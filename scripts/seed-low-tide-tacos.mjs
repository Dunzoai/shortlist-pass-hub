/**
 * Seeds the demo food truck behind shortlistpass.com/foodtrucks: "Low Tide Tacos" (lowtidetacos.shortlistpass.com).
 *
 * A made-up business, flagged `is_demo = true` (the app's documented demo pattern, docs/architecture/demo-businesses.md in the
 * app repo): it renders at its own subdomain, is noindex, never appears in search, the sitemap or trucks.shortlistpass.com,
 * and preorders on it skip Stripe (the order is marked paid with payment_method 'demo'). No reviews, no stats, no photos
 * of real food (the pictures are our own cut-paper drawings in public/foodtrucks/demo-menu/).
 *
 * Idempotent and it never deletes: re-running reuses what exists, adds missing menu items, and tops up the weekly stops
 * (12 weeks of Tue/Thu/Sat from today), so run it again every couple of months to keep the stops in the future.
 *
 *   dry run (reads only):  node scripts/seed-low-tide-tacos.mjs
 *   write:                 APPLY=1 node scripts/seed-low-tide-tacos.mjs
 * Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment (the app's Supabase project).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const here = path.dirname(fileURLToPath(import.meta.url));
const demo = JSON.parse(fs.readFileSync(path.join(here, "../src/components/foodtrucks/demo-truck.json"), "utf8"));
const art = path.join(here, "../public/foodtrucks/demo-menu");
const APPLY = process.env.APPLY === "1";
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL, KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_ || !KEY) { console.log("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY."); process.exit(1); }
const db = createClient(URL_, KEY, { auth: { persistSession: false } });
const out = { mode: APPLY ? "APPLY" : "DRY RUN" };
const fail = (what, error) => { console.log(JSON.stringify({ ...out, FAILED: what, error: error?.message ?? error }, null, 1)); process.exit(1); };

/* ── 1. the business ── */
let { data: biz, error: e1 } = await db.from("businesses").select("id, name, is_demo, smartpage_subdomain").eq("smartpage_subdomain", demo.subdomain).maybeSingle();
if (e1) fail("look up business", e1);
if (biz && !biz.is_demo) fail("a NON-demo business already owns this subdomain; not touching it", biz.id);
out.business = biz ? { id: biz.id, action: "exists" } : { action: APPLY ? "created" : "would create" };
if (!biz && APPLY) {
  const now = new Date().toISOString();
  const ins = await db.from("businesses").insert({
    name: demo.name, city: demo.city, state: demo.state, timezone: demo.timezone,
    smartpage_subdomain: demo.subdomain, slug: demo.subdomain, smartpage_enabled: true, smartpage_status: "live",
    is_demo: true, published: true, location_mode: "mobile", claimed_at: now,
    seed_provenance: { tool: "foodtrucks_page_demo", note: "Demo business for shortlistpass.com/foodtrucks. Made up; not a real business.", built_by: "foodtrucks round 2", created_at: now },
  }).select("id").single();
  if (ins.error) fail("insert business", ins.error);
  biz = { id: ins.data.id }; out.business.id = biz.id;
}
const bid = biz?.id;

/* ── 2. pictures, into the app's public storage (its image host allow-list is the Supabase storage domain) ── */
const BUCKET = "event-images";
const urlFor = async (file) => {
  const p = `demo/${demo.subdomain}/${file}`;
  if (APPLY) {
    const { error } = await db.storage.from(BUCKET).upload(p, fs.readFileSync(path.join(art, file)), { contentType: "image/png", upsert: true });
    if (error) { console.log("upload warning", file, error.message); return null; }
  }
  return db.storage.from(BUCKET).getPublicUrl(p).data.publicUrl;
};
const logoUrl = await urlFor("logo.png");

/* ── 3. page profile ── */
if (bid) {
  const { data: prof } = await db.from("smartpage_profiles").select("id").eq("business_id", bid).maybeSingle();
  out.profile = prof ? "exists" : APPLY ? "created" : "would create";
  if (!prof && APPLY) {
    const { error } = await db.from("smartpage_profiles").insert({
      business_id: bid, page_type: "business", business_category: "food_truck", business_specialization: "general_food_truck",
      operation_mode: "mobile", name: demo.name, headline: demo.headline, about: demo.about, background_color: "#0B1018", logo_url: logoUrl,
    });
    if (error) fail("insert profile", error);
  }
}

/* ── 4. ordering on (a Stripe account is not needed: a demo business skips Stripe at checkout) ── */
if (bid && APPLY) {
  const a = await db.from("business_addons").upsert({ business_id: bid, ordering_enabled: true, ordering_enabled_at: new Date().toISOString() }, { onConflict: "business_id" });
  if (a.error) fail("business_addons", a.error);
  const { data: cfg } = await db.from("business_ordering_config").select("business_id").eq("business_id", bid).maybeSingle();
  if (!cfg) {
    const c = await db.from("business_ordering_config").insert({ business_id: bid, ordering_paused: false, tax_rate: demo.taxRate, timezone: demo.timezone });
    if (c.error) fail("business_ordering_config", c.error);
  }
  out.ordering = "on";
}

/* ── 5. menu ── */
const offeringIds = {};
let added = 0;
if (bid) {
  const { data: have } = await db.from("smartpage_offerings").select("id, title").eq("business_id", bid);
  for (const [i, m] of demo.menu.entries()) {
    const found = (have ?? []).find((h) => h.title === m.title);
    if (found) { offeringIds[m.title] = found.id; continue; }
    added++;
    if (!APPLY) continue;
    const imageUrl = await urlFor(m.image);
    const { data, error } = await db.from("smartpage_offerings").insert({
      business_id: bid, title: m.title, description: m.description, price: m.price, price_type: "fixed", category: m.category,
      is_active: true, is_public: true, is_featured: m.featured, sort_order: i + 1, image_url: imageUrl,
    }).select("id").single();
    if (error) fail(`insert menu item ${m.title}`, error);
    offeringIds[m.title] = data.id;
  }
}
out.menu = { items: demo.menu.length, added: APPLY ? added : `would add ${added}` };

/* ── 6. weekly stops (Tue/Thu/Sat) with the whole menu on each ── */
const todayNY = new Date().toLocaleDateString("en-CA", { timeZone: demo.timezone });
const dates = [];
{
  const [y, m, d] = todayNY.split("-").map(Number);
  for (let i = 0; i < demo.weeksSeeded * 7; i++) {
    const dt = new Date(Date.UTC(y, m - 1, d + i));
    const stop = demo.weeklyStops.find((s) => s.dow === dt.getUTCDay());
    if (stop) dates.push({ date: dt.toISOString().slice(0, 10), stop });
  }
}
let stopsAdded = 0, linksAdded = 0;
if (bid) {
  const { data: haveEv } = await db.from("smartpage_events").select("id, slug").eq("business_id", bid);
  for (const { date, stop } of dates) {
    const slug = `${demo.subdomain}-${date}`;
    let ev = (haveEv ?? []).find((h) => h.slug === slug);
    if (!ev) {
      stopsAdded++;
      if (!APPLY) continue;
      const { data, error } = await db.from("smartpage_events").insert({
        business_id: bid, title: stop.title, event_date: date, start_time: stop.start, end_time: stop.end,
        street: stop.street, city: demo.city, state: demo.state, postal_code: demo.postalCode,
        status: "published", is_recurring: false, allow_preorders: true, allow_walkups: true, slug, tax_rate: demo.taxRate,
        description: `${demo.name} at ${stop.title}. Demo stop.`,
      }).select("id").single();
      if (error) fail(`insert stop ${date}`, error);
      ev = data;
    }
    if (APPLY && ev) {
      const rows = Object.values(offeringIds).map((offering_id, i) => ({ event_id: ev.id, offering_id, is_exclusive: false, sort_order: i + 1 }));
      const { error } = await db.from("smartpage_event_offerings").upsert(rows, { onConflict: "event_id,offering_id" });
      if (error) fail(`link menu to stop ${date}`, error);
      linksAdded += rows.length;
    }
  }
}
out.stops = { weeks: demo.weeksSeeded, planned: dates.length, added: APPLY ? stopsAdded : `would add ${stopsAdded}`, menuLinksWritten: linksAdded };
out.page = `https://${demo.subdomain}.shortlistpass.com`;
if (APPLY && bid) out.ids = { business: bid, offerings: offeringIds };
console.log(JSON.stringify(out, null, 1));
