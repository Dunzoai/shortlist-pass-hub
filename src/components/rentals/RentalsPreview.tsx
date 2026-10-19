"use client";
/**
 * shortlistpass.com/rentals. Rendered by src/app/rentals/page.tsx (and, in dev only, by /dev/rentals-preview).
 * The story: your rental has its own app, and it keeps your guests yours. Order: hero, movie slot, everything they'd ask,
 * a better stay, peace of mind, local perks, they found you somewhere else, bring them back, found in ChatGPT,
 * a few things I'm not, trained by you, price, closing line. What differs from the home page: docs/design/rentals-divergence.md.
 */
import type { ReactNode } from "react";
import ANotSection, { type NotRow } from "@/components/foodtrucks/ANotSection";
import NothingReplaces from "@/components/foodtrucks/NothingReplaces";
import { PipesSection } from "@/components/new-home/PipesSection";
import { SiteHeader } from "@/components/new-home/SiteHeader";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import { FridgeCard } from "./FridgeCard";
import { MovieSlot } from "./MovieSlot";
import { AroundScreen, ChatScreen, HomeScreen, Phone, RequestScreen } from "./screens";
import { R, SERIF, SIGNUP_HREF, PRICE_LINE } from "./tokens";
import { Btn, Card, DemoChip, Eyebrow, IconSquare, PAGE_CSS } from "./ui";

const ROWS: NotRow[] = [
  { claim: "A replacement for your listing.", fix: "Keep it. I work between the bookings.", why: "Your listing is where people find you and book. I'm what the guest meets after that: the answers, the house guide, the codes. I don't touch your listing." },
  { claim: "Another app your guests have to download.", fix: "No download. No login. A card on the fridge.", why: "Guests scan the card with their camera and the house app opens in the browser. Nothing to install, no account to make." },
  { claim: "A bot that makes things up.", fix: "I only know what you told me.", why: "I answer from what you gave me and real local data. If it isn't there, I say I don't know." },
  { claim: "A middleman taking a cut.", fix: "Your money never touches our hands.", why: "We partner with Stripe and Square. We build the cart, they move the money, and it lands in your bank. No commission, ever." },
];

const Q = ({ children }: { children: ReactNode }) => <span style={{ display: "inline-flex", alignItems: "center", minHeight: 40, padding: "0 16px", borderRadius: 999, background: R.tint, fontSize: 15, fontWeight: 700 }}>{children}</span>;
const Caption = ({ children }: { children: ReactNode }) => <p style={{ marginTop: 14, fontSize: 13, color: R.greyText, textAlign: "center", maxWidth: 360 }}>{children}</p>;
const Head = ({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: ReactNode }) => (
  <div style={{ maxWidth: 760, display: "flex", flexDirection: "column", gap: 20 }}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <h2 className="rp-hd rp-h2">{title}</h2>
    {lead && <p className="rp-lead">{lead}</p>}
  </div>
);
const Point = ({ icon, title, children, tag }: { icon: ReactNode; title: string; children: ReactNode; tag?: ReactNode }) => (
  <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}><IconSquare>{icon}</IconSquare>{tag}</div>
    <h3 className="rp-hd" style={{ fontSize: 28, lineHeight: 1.05 }}>{title}</h3>
    <div style={{ fontSize: 16, lineHeight: 1.55, color: R.grey }}>{children}</div>
  </Card>
);

function Hero() {
  return (
    <section className="rp-sec" style={{ paddingTop: 40 }}>
      <div className="rp-wrap rp-hero">
        <div style={{ display: "flex", flexDirection: "column", gap: 22, alignItems: "flex-start" }}>
          <Eyebrow>Short-term rentals</Eyebrow>
          <h1 className="rp-hd rp-h1">Your rental has its own app.</h1>
          <p className="rp-lead">Everything a guest would ask you, already answered. The best of the area at their fingertips. And a way back to you, without the booking fees.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Btn kind="ink" href={SIGNUP_HREF}>Get started</Btn>
            <Btn kind="quiet" href="#movie">Watch the movie</Btn>
          </div>
          <div style={{ fontSize: 14, color: R.greyText }}>Opened from a QR card on the fridge. No download, no login.</div>
        </div>
        <div className="rp-hero-vis">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Phone label="Demo: the guest house app, home page" scale={0.74} height={820}><HomeScreen /></Phone>
            <Caption>The house app. <DemoChip /> Example house, example guest.</Caption>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 36 }}>
            <FridgeCard />
            <Caption>The card on the fridge. <DemoChip /> Every house gets its own QR.</Caption>
          </div>
        </div>
      </div>
    </section>
  );
}

function Movie() {
  return (
    <section id="movie" className="rp-sec" style={{ paddingTop: 0 }}>
      <div className="rp-wrap" style={{ maxWidth: 1040 }}>
        <MovieSlot />
        <p style={{ marginTop: 14, fontSize: 14, color: R.greyText, textAlign: "center" }}>A short film goes here: a family arrives, and Shorty is there every step.</p>
      </div>
    </section>
  );
}

function Asking() {
  return (
    <section className="rp-sec" style={{ paddingTop: 0 }}>
      <div className="rp-wrap rp-split">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Eyebrow>Before they ask</Eyebrow>
          <h2 className="rp-hd rp-h2">Everything they&rsquo;d ask, without asking.</h2>
          <p className="rp-lead">Shorty answers day and night, from what you told him. The door code and Wi-Fi show only to the guest who&rsquo;s staying, and only during the stay. And you&rsquo;re not answering the same questions all day.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Wi-Fi", "Door code", "Checkout", "Parking", "Trash day", "The TV"].map((t) => <Q key={t}>{t}</Q>)}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Phone label="Demo: a guest asking Shorty questions about the house" scale={0.8} height={720}><ChatScreen /></Phone>
            <Caption><DemoChip /> Example conversation, not a real guest.</Caption>
          </div>
          <div aria-hidden="true" className="rp-shorty-side"><ShortyMascot mood="nod" size={120} still style={{ width: "100%", height: "auto" }} /></div>
        </div>
      </div>
    </section>
  );
}

function BetterStay() {
  return (
    <section className="rp-sec">
      <div className="rp-wrap rp-split rp-flip">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Eyebrow>A better stay</Eyebrow>
          <h2 className="rp-hd rp-h2">The best of the area, picked by you.</h2>
          <p className="rp-lead">Your favorite local spots, with photos and your own notes. Rainy day ideas. Places with kids, the beach, coffee. Food trucks out tonight. And ordering ahead from places on the Shortlist.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Top restaurants", "Rainy day", "With kids", "Beach & outdoors", "Coffee", "Food trucks tonight"].map((t) => <Q key={t}>{t}</Q>)}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Phone label="Demo: the host's favorite spots and food trucks out tonight" scale={0.8} height={640}><AroundScreen /></Phone>
          <Caption><DemoChip /> Example picks. Your photos and your notes go here.</Caption>
        </div>
      </div>
    </section>
  );
}

function PeaceOfMind() {
  return (
    <section className="rp-sec" style={{ paddingTop: 0 }}>
      <div className="rp-wrap">
        <Head eyebrow="Peace of mind" title="If something goes wrong, they know where to turn." lead="Help is one tap away for the guest, and you hear about it right away." />
        <div className="rp-split" style={{ marginTop: 48, alignItems: "start" }}>
          <div style={{ display: "grid", gap: 16 }}>
            <Point icon={<><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M12 8v8M8 12h8" /></>} title="Help is one tap away.">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>{["911", "Nearest ER", "Urgent care", "24-hour pharmacy", "Fire extinguisher", "Water shut-off"].map((t) => <Q key={t}>{t}</Q>)}</div>
              The ER, urgent care and pharmacy come from real local data. The fire extinguisher and the water shut-off are the spots you tell me about.
            </Point>
            <Point icon={<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />} title="&ldquo;Need something?&rdquo; reaches you right away.">
              A guest sends a request, with a photo if they like, and you get a text. Urgent ones come through marked URGENT. When Shorty can&rsquo;t answer, or something needs a real person, he texts you. Guests can always text or call you directly from the app.
            </Point>
            <Point icon={<><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>} title="Codes stay with the real guest.">
              The door code and Wi-Fi show up only for the guest who is staying: from 24 hours before check-in to 2 hours after checkout. Anyone else who asks hears &ldquo;That&rsquo;s shared with guests when they check in.&rdquo;
            </Point>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Phone label="Demo: the Need something? request screen" scale={0.84} height={860}><RequestScreen /></Phone>
            <Caption><DemoChip /> Example request. You get a text the second a guest sends it.</Caption>
          </div>
        </div>
      </div>
    </section>
  );
}

function Perks() {
  return (
    <section className="rp-sec" style={{ paddingTop: 0 }}>
      <div className="rp-wrap" style={{ maxWidth: 900 }}>
        <Card style={{ padding: 32, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
          <Eyebrow>Local perks</Eyebrow>
          <h2 className="rp-hd rp-h2" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>Guests get the local deals.</h2>
          <p className="rp-lead">Guests get access to local discounts at Shortlist spots nearby. Your place is where they find them.</p>
        </Card>
      </div>
    </section>
  );
}

function FoundElsewhere() {
  return (
    <section className="rp-sec" style={{ paddingTop: 0 }}>
      <div className="rp-wrap">
        <Head eyebrow="Your own channel" title="They found you somewhere else. Now they live in your app." />
        <div className="rp-grid" style={{ marginTop: 40 }}>
          <Point icon={<><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.5a3 3 0 0 1 0 5.5M18 14.5c2 .7 3.5 2.6 3.5 5.5" /></>} title="They share it.">
            Guests pass the app to the friends and family in their group, so everyone has the answers and the picks.
          </Point>
          <Point icon={<><rect x="7" y="3" width="10" height="18" rx="2.5" /><path d="M11 18h2" /></>} title="You live on their phone.">
            The house app sits right there, the whole trip. You&rsquo;re the host they&rsquo;re looking at.
          </Point>
          <Point icon={<><path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15z" /><path d="M10 21h4" /></>} title="They choose to hear from you.">
            Guests opt in, right in the app. After that, it&rsquo;s a line between you and them.
          </Point>
        </div>
      </div>
    </section>
  );
}

function BringThemBack() {
  return (
    <section className="rp-sec" style={{ paddingTop: 0 }}>
      <div className="rp-wrap">
        <Head eyebrow="Bring them back" title="Bring them back." lead="Most hosts have never had a guest list. After this, you do." />
        <div className="rp-grid" style={{ marginTop: 40 }}>
          <Point icon={<><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.5a3 3 0 0 1 0 5.5M18 14.5c2 .7 3.5 2.6 3.5 5.5" /></>} title="The guest list is yours.">
            Guests choose to hear from you about open dates and deals, and they can say stop any time. You can send texts, emails and push notifications to past guests. The list belongs to you, not to anyone else.
          </Point>
          <Point icon={<><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18M7 15h3" /></>} title="Repeat guests can book direct.">
            Guests who opted in can request dates right in the house app. You confirm, and send a payment link through your own Stripe. No booking-site fees.
          </Point>
          <Point icon={<><path d="M4 19V9l8-5 8 5v10z" /><path d="M9 19v-6h6v6" /></>} title="The money goes straight to your bank.">
            Stays are paid through a payment link on your own Stripe account. Orders from your favorite spots run through Stripe and Square. We never hold the money.
          </Point>
        </div>
        <p style={{ marginTop: 24, fontSize: 15, color: R.greyText, maxWidth: 640 }}>We never touch anyone&rsquo;s listing account.</p>
      </div>
    </section>
  );
}

function Trained() {
  const you = (t: string) => <div style={{ alignSelf: "flex-end", maxWidth: "92%", padding: "12px 16px", borderRadius: 18, background: R.slate2, color: R.cream, fontSize: 17 }}>{t}</div>;
  const shorty = (t: string) => (
    <div style={{ alignSelf: "flex-start", maxWidth: "92%", display: "flex", flexDirection: "column", gap: 10, padding: "12px 16px", borderRadius: 18, background: R.inkDeep, border: `1px solid ${R.slate2}`, color: R.cream, fontSize: 16, lineHeight: 1.5 }}>
      {t}<span style={{ alignSelf: "flex-start", minHeight: 40, padding: "0 18px", borderRadius: 999, background: R.mint, color: R.onMint, fontWeight: 700, fontSize: 15, display: "inline-flex", alignItems: "center" }}>Yes, save it</span>
    </div>
  );
  return (
    <section className="rp-sec" style={{ background: R.inkDeep, color: R.cream }}>
      <div className="rp-wrap rp-split" style={{ alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Eyebrow color={R.mint}>Trained by you</Eyebrow>
          <h2 className="rp-hd rp-h2" style={{ color: R.cream }}>You set me up by talking to me.</h2>
          <p style={{ fontSize: 22, lineHeight: 1.3, fontFamily: SERIF, color: R.cream, maxWidth: 560 }}>I only answer from what you gave me and real local data. <span style={{ color: R.mint }}>I never make things up.</span></p>
        </div>
        <div style={{ background: R.slate, borderRadius: 24, padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: R.creamSub }}>You, talking to Shorty</span><DemoChip>Example</DemoChip></div>
          {you("change the door code to 4821")}
          {shorty("Door code changes to 4821 for The Beach House. Save it?")}
          {you("Jenna checks in Friday at 4 till Monday at 10")}
          {shorty("Jenna, Friday 4 PM to Monday 10 AM. I'll make her stay link. Save it?")}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const line = (t: string) => (
    <li style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 17, lineHeight: 1.4 }}>
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={R.ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "0 0 auto", marginTop: 1 }}><path d="M5 12l5 5 9-10" /></svg>{t}
    </li>
  );
  return (
    <section className="rp-sec">
      <div className="rp-wrap" style={{ maxWidth: 760 }}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 16, alignItems: "center", marginBottom: 40 }}>
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="rp-hd rp-h2">One price. One house.</h2>
        </div>
        <Card style={{ padding: 32, display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontFamily: SERIF, fontSize: 96, lineHeight: .9, letterSpacing: "-0.02em" }}>$50</span>
            <span style={{ fontSize: 18, fontWeight: 700 }}>/ month per property</span>
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {line("Your own house app and QR card")}
            {line("Local spots and perks for your guests")}
            {line("Your own guest list")}
            {line("Book direct, with no booking-site fees")}
            {line("Shorty answers your guests 24/7")}
            {line("Alerts when it matters")}
          </ul>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
            <Btn kind="ink" href={SIGNUP_HREF}>Get started</Btn>
            <div style={{ fontSize: 14, color: R.greyText }}>{PRICE_LINE}</div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="rp-sec" style={{ paddingTop: 16, paddingBottom: 120 }}>
      <div className="rp-wrap" style={{ maxWidth: 980 }}>
        <p style={{ textAlign: "center", fontFamily: SERIF, fontSize: "clamp(34px, 5.4vw, 68px)", lineHeight: 1, letterSpacing: "-0.015em", textWrap: "balance" }}>
          Make them love your place, enjoy the area, and come back through your own app.
        </p>
      </div>
    </section>
  );
}

const LAYOUT_CSS = `
.rp-h1 { font-size: 48px; line-height: .95; max-width: 760px }
@media (min-width: 900px) { .rp-h1 { font-size: 86px } }
.rp-hero { display: grid; gap: 48px; align-items: center }
@media (min-width: 1100px) { .rp-hero { grid-template-columns: minmax(0, 1fr) auto; gap: 48px } }
.rp-hero-vis { display: flex; gap: 40px; align-items: flex-start; justify-content: center; flex-wrap: wrap }
.rp-shorty-side { width: 120px; margin-left: -34px; flex: 0 0 auto }
@media (max-width: 520px) { .rp-shorty-side { display: none } }
@media (min-width: 900px) { .rp-flip > :first-child { order: 2 } }
`;

export default function RentalsPreview() {
  return (
    <div className="rp">
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS + LAYOUT_CSS }} />
      <SiteHeader plain={{ ctaLabel: "Get started", ctaHref: SIGNUP_HREF }} />
      <main>
        <Hero />
        <Movie />
        <Asking />
        <BetterStay />
        <PeaceOfMind />
        <Perks />
        <FoundElsewhere />
        <BringThemBack />
        <PipesSection mode="rentals" />
        <ANotSection rows={ROWS} />
        <NothingReplaces lines={{ first: "Nothing here replaces your listing.", lead: "", em: "It’s the part of the stay that stays yours." }} />
        <Trained />
        <Pricing />
        <Closing />
      </main>
    </div>
  );
}
