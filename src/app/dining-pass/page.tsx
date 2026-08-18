"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// ---------------------------------------------------------------------------
// THE ROSTER — add and remove names here, nowhere else.
// The section picks its own layout from the length of this array:
//   0 entries      -> "first kitchens are signing now" state
//   1-6 entries    -> early state, one full-width row each
//   7+ entries     -> grouped index by town (holds up to 40+)
//
// Nito's Empanadas and Palmetto Taps are real Shortlist clients.
// Every other entry is PLACEHOLDER and must be swapped before launch.
// ---------------------------------------------------------------------------
const RESTAURANTS = [
  { name: "Nito's Empanadas", category: "Empanadas", town: "Myrtle Beach" },
  { name: "Palmetto Taps", category: "Taproom", town: "Myrtle Beach" },
  { name: "The Boardwalk Tap", category: "Sports Bar", town: "Myrtle Beach" }, // PLACEHOLDER
  { name: "Via Mare Trattoria", category: "Italian", town: "Myrtle Beach" }, // PLACEHOLDER
  { name: "Sunrise Diner on 3rd", category: "Breakfast", town: "Myrtle Beach" }, // PLACEHOLDER
  { name: "North End Chophouse", category: "Steakhouse", town: "North Myrtle Beach" }, // PLACEHOLDER
  { name: "Casa Verde Cantina", category: "Mexican", town: "North Myrtle Beach" }, // PLACEHOLDER
  { name: "Kings Highway Sports Grill", category: "Sports Bar", town: "North Myrtle Beach" }, // PLACEHOLDER
  { name: "Inlet Crab House", category: "Seafood", town: "Murrells Inlet" }, // PLACEHOLDER
  { name: "Smokehouse 17", category: "BBQ", town: "Murrells Inlet" }, // PLACEHOLDER
  { name: "Pawleys Pub & Kitchen", category: "Pub", town: "Pawleys Island" }, // PLACEHOLDER
  { name: "Waccamaw Fish Camp", category: "Seafood", town: "Pawleys Island" }, // PLACEHOLDER
];

const TOWNS = ["Myrtle Beach", "North Myrtle Beach", "Murrells Inlet", "Pawleys Island"];

// Non-restaurant members. ALL PLACEHOLDER — swap before launch.
const PERKS = [
  { name: "Tidal Creek Creamery", category: "Ice Cream", deal: "Buy one scoop, get one free" }, // PLACEHOLDER
  { name: "Sugar & Salt Bakeshop", category: "Dessert", deal: "Free dessert with any $15 order" }, // PLACEHOLDER
  { name: "Litchfield Links Academy", category: "Golf", deal: "$20 off a 30-minute lesson" }, // PLACEHOLDER
  { name: "Strand Surf Supply", category: "Retail", deal: "10% off everything in the shop" }, // PLACEHOLDER
];

const STEPS = [
  {
    n: "I",
    title: "Join",
    body: "A minute on your phone. The card is in your account before you close the tab.",
  },
  {
    n: "II",
    title: "Pull up your card",
    body: "Open Shortlist when you sit down. New phone, cleared browser, borrowed tablet — sign in and it is there.",
  },
  {
    n: "III",
    title: "Show your server",
    body: "Before they ring you up. Half off the second entree comes straight off the check.",
  },
];

const INCLUDED = [
  "Half off a second entree at every participating spot",
  "The whole Grand Strand, from Little River to Pawleys",
  "Every restaurant that joins after you do, automatically",
  "Cancel anytime from your account",
];

const FAQS = [
  {
    q: "Do I have to download anything?",
    a: "No. Your card opens in the browser you already use, and there is no plastic card to carry.",
  },
  {
    q: "What happens when I get a new phone?",
    a: "Sign in to Shortlist and your card is there. It lives in your account, not on your device.",
  },
  {
    q: "How do I use it at the table?",
    a: "Pull up your card and show your server before they ring you up. Nothing to scan and nothing for them to install.",
  },
  {
    q: "Does the list of restaurants change?",
    a: "It grows. Every place that joins shows up in your account the day they sign, at no extra cost.",
  },
  {
    q: "Can I cancel?",
    a: "Anytime, from your account settings. No phone call, no email, no last-month charge.",
  },
];

// DRAFT TERMS — legal and each restaurant to confirm before launch.
const TERMS = [
  "The discount applies to a second entree of equal or lesser value.",
  "One discount per membership, per visit.",
  "Dine-in only, unless a restaurant states otherwise on its listing.",
  "Not combinable with other discounts, happy hour pricing, or holiday menus.",
  "Excludes alcohol, tax, and gratuity.",
  "Participating restaurants set their own blackout dates. Current dates are always shown on the listing in your account.",
  "Membership is per person and non-transferable.",
];

const serif = { fontFamily: "var(--font-serif)" };
const baskerville = { fontFamily: "var(--font-libre-baskerville)" };

export default function DiningPassPage() {
  const [termsOpen, setTermsOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const count = RESTAURANTS.length;
  const grouped = TOWNS.map((town) => ({
    town,
    places: RESTAURANTS.filter((r) => r.town === town),
  })).filter((g) => g.places.length > 0);

  return (
    <main className="bg-[#F4F1EC]">
      {/* ================= HERO — direction C palette, near-black ============ */}
      <section className="bg-[#1a1a1a] px-6 pt-12 pb-14">
        <div className="mx-auto max-w-[600px] flex flex-col gap-7">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#2E8B57]">
            Locals only · Grand Strand
          </span>

          {/* The card. One entrance move: it settles into its tilt. */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative h-[208px] rounded-[18px] bg-[#2E8B57] shadow-[0_18px_40px_rgba(26,26,26,0.45)]"
          >
            <div
              className="absolute inset-0 rounded-[18px]"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(244,241,236,0.16) 1px, transparent 1px)",
                backgroundSize: "4px 4px",
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-between px-6 py-5">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F4F1EC]/75">
                  Dining Pass
                </span>
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ color: "rgba(244,241,236,0.75)" }}
                >
                  <path d="M4 3v8a3 3 0 0 0 3 3v7" />
                  <path d="M7 3v6" />
                  <path d="M10 3v6" />
                  <path d="M17 3c-1.5 2-2 4-2 7h4V3z" />
                  <path d="M17 10v11" />
                </svg>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-[62px] leading-[0.86] text-[#F4F1EC]" style={baskerville}>
                  50%
                </span>
                <span className="pb-1.5 text-[13px] leading-[1.35] text-[#F4F1EC]/85">
                  off a second
                  <br />
                  entree
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] tracking-[0.1em] text-[#F4F1EC]/70">
                <span>MEMBER SINCE 2026</span>
                <span>$4.99/MO</span>
              </div>
            </div>
          </motion.div>

          <h1
            className="text-[32px] leading-[1.18] tracking-[-0.01em] text-[#F4F1EC] text-pretty"
            style={baskerville}
          >
            One card. Every table on the Strand.
          </h1>

          <p className="text-[15px] leading-[1.7] text-[#F4F1EC]/60 text-pretty">
            Myrtle Beach to Pawleys, half off a second entree for $4.99 a month. It lives in
            your Shortlist account, so a new phone never costs you it.
          </p>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="flex min-h-[56px] items-center justify-center rounded-full bg-[#2E8B57] px-6 text-[17px] font-semibold text-[#F4F1EC] transition-colors duration-200 hover:bg-[#2E8B57]/85"
            >
              Join for $4.99/month
            </button>
            <button
              type="button"
              onClick={() => setTermsOpen(true)}
              className="mx-auto min-h-[44px] px-2 text-[13px] text-[#F4F1EC]/50 underline underline-offset-4 transition-colors duration-200 hover:text-[#F4F1EC]/80"
            >
              Discount terms
            </button>
          </div>
        </div>
      </section>

      {/* ===== THE SEAM — hard cut, near-black to ivory. No blend. ========== */}

      {/* ================= TRUST STRIP — direction B ======================== */}
      <section className="border-b border-[#222222]/14 bg-[#F4F1EC]">
        <div className="mx-auto grid max-w-[600px] grid-cols-3">
          {["No app to download", "Whole Grand Strand", "Secure checkout"].map((item, i) => (
            <div
              key={item}
              className={`px-3 py-5 text-center ${i < 2 ? "border-r border-[#222222]/14" : ""}`}
            >
              <span className="text-[10px] font-medium uppercase leading-[1.6] tracking-[0.14em] text-[#5A6570]">
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS — direction B ======================= */}
      <section className="px-6 pt-13 pb-12">
        <div className="mx-auto max-w-[600px]">
          <span className="mb-5 block text-[10px] font-medium uppercase tracking-[0.25em] text-[#5A6570]">
            How it works
          </span>
          {STEPS.map((step) => (
            <div key={step.n} className="flex gap-[18px] border-t border-[#222222]/16 py-6">
              <span
                className="w-[34px] shrink-0 text-[38px] leading-[0.9] text-[#2E8B57]"
                style={serif}
              >
                {step.n}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="text-[25px] font-medium leading-[1.2] text-[#222222]" style={serif}>
                  {step.title}
                </h3>
                <p className="text-[14px] leading-[1.7] text-[#5A6570]">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= RESTAURANTS — direction B, three states ========== */}
      <section className="px-6 pb-14">
        <div className="mx-auto max-w-[600px]">
          {count === 0 ? (
            /* Nobody signed yet. No counts, no ghost cells — name the towns. */
            <>
              <div className="flex items-baseline justify-between gap-3 border-b-2 border-[#222222] pb-3.5">
                <h2 className="text-[32px] leading-[1.1] text-[#222222]" style={serif}>
                  The first kitchens are signing now.
                </h2>
              </div>
              {TOWNS.map((town) => (
                <div
                  key={town}
                  className="flex items-center justify-between gap-3 border-b border-[#222222]/14 py-4"
                >
                  <span className="text-[16px] font-semibold text-[#222222]">{town}</span>
                  <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.12em] text-[#5A6570]">
                    In conversation
                  </span>
                </div>
              ))}
              <p className="mt-6 text-[18px] italic leading-[1.6] text-[#5A6570]" style={serif}>
                Join before the list opens and every restaurant that signs lands on your card
                automatically — starting with the first one.
              </p>
            </>
          ) : count <= 6 ? (
            /* A handful signed. Full-width rows carry more presence than a thin grid. */
            <>
              <div className="flex items-baseline justify-between gap-3 border-b-2 border-[#222222] pb-3.5">
                <h2 className="text-[32px] leading-[1.1] text-[#222222]" style={serif}>
                  The first {count} are in.
                </h2>
              </div>
              {RESTAURANTS.map((r) => (
                <div
                  key={r.name}
                  className="flex items-center justify-between gap-3 border-b border-[#222222]/14 py-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[21px] font-medium leading-[1.25] text-[#222222]" style={serif}>
                      {r.name}
                    </span>
                    <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#5A6570]">
                      {r.category}
                    </span>
                  </div>
                  <span className="shrink-0 text-[12px] text-[#5A6570]">{r.town}</span>
                </div>
              ))}
              <p className="mt-6 text-[18px] italic leading-[1.6] text-[#5A6570]" style={serif}>
                More sign every week. The day one joins it is on your card — you never pay
                again for the list getting longer.
              </p>
            </>
          ) : (
            /* The full index, grouped by town. Holds its shape well past 40. */
            <>
              <div className="flex items-baseline justify-between gap-3 border-b-2 border-[#222222] pb-3.5">
                <h2 className="text-[32px] leading-[1.1] text-[#222222]" style={serif}>
                  The table of contents
                </h2>
                <span className="shrink-0 text-[10px] font-medium uppercase tracking-[0.14em] text-[#5A6570]">
                  {count} spots
                </span>
              </div>
              {grouped.map((group) => (
                <div key={group.town} className="pt-6">
                  <span className="block pb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#2E8B57]">
                    {group.town}
                  </span>
                  {group.places.map((r) => (
                    <div
                      key={r.name}
                      className="flex items-baseline justify-between gap-3.5 border-t border-[#222222]/14 py-3.5"
                    >
                      <span className="text-[21px] font-medium leading-[1.25] text-[#222222]" style={serif}>
                        {r.name}
                      </span>
                      <span className="shrink-0 text-[9px] font-medium uppercase tracking-[0.16em] text-[#5A6570]">
                        {r.category}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
              <p className="mt-6 text-[18px] italic leading-[1.6] text-[#5A6570]" style={serif}>
                New kitchens sign on every month. They appear on your card the day they do.
              </p>
            </>
          )}
        </div>
      </section>

      {/* ================= MEMBER PERKS — direction B, dark band ============ */}
      <section className="bg-[#333333] px-6 py-12">
        <div className="mx-auto max-w-[600px]">
          <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.25em] text-[#F4F1EC]/50">
            Member perks
          </span>
          <h2 className="mb-6 text-[30px] font-light leading-[1.2] text-[#F4F1EC]" style={serif}>
            Beyond the dinner table.
          </h2>
          {PERKS.map((p) => (
            <div key={p.name} className="flex flex-col gap-1.5 border-t border-[#F4F1EC]/12 py-4.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[21px] font-medium text-[#F4F1EC]" style={serif}>
                  {p.name}
                </span>
                <span className="shrink-0 text-[9px] font-medium uppercase tracking-[0.16em] text-[#F4F1EC]/45">
                  {p.category}
                </span>
              </div>
              <span className="text-[13px] leading-[1.6] text-[#2E8B57]">{p.deal}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PRICING — direction B =========================== */}
      <section className="px-6 py-14">
        <div className="mx-auto flex max-w-[600px] flex-col gap-6 text-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#5A6570]">
              Membership
            </span>
            <span className="text-[66px] font-light leading-none text-[#222222]" style={serif}>
              $4.99
            </span>
            <span className="text-[19px] italic text-[#5A6570]" style={serif}>
              a month, cancel whenever
            </span>
          </div>
          <div className="text-left">
            {INCLUDED.map((item) => (
              <div key={item} className="border-t border-[#222222]/16 py-3.5">
                <span className="text-[14px] leading-[1.6] text-[#222222]">{item}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="flex min-h-[54px] items-center justify-center rounded-full bg-[#2E8B57] px-6 text-[17px] font-semibold text-[#F4F1EC] transition-colors duration-200 hover:bg-[#2E8B57]/85"
          >
            Join for $4.99/month
          </button>
        </div>
      </section>

      {/* ================= FAQ — direction B =============================== */}
      <section className="px-6 pb-14">
        <div className="mx-auto max-w-[600px]">
          <span className="mb-4 block text-[10px] font-medium uppercase tracking-[0.25em] text-[#5A6570]">
            Questions
          </span>
          {FAQS.map((f) => (
            <div key={f.q} className="flex flex-col gap-2 border-t border-[#222222]/16 py-5">
              <h3 className="text-[22px] font-medium leading-[1.25] text-[#222222]" style={serif}>
                {f.q}
              </h3>
              <p className="text-[14px] leading-[1.7] text-[#5A6570]">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER — direction B ============================ */}
      <footer className="bg-[#333333] px-6 pt-9 pb-11">
        <div className="mx-auto flex max-w-[600px] flex-col gap-3.5">
          <span className="text-[22px] text-[#F4F1EC]" style={serif}>
            The Shortlist Co
          </span>
          <a
            href="mailto:hello@shortlistpass.com"
            className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#F4F1EC]/55 transition-colors duration-200 hover:text-[#F4F1EC]/80"
          >
            hello@shortlistpass.com
          </a>
          <span className="text-[11px] text-[#F4F1EC]/40">
            © {new Date().getFullYear()} The Shortlist Co · Myrtle Beach, SC
          </span>
        </div>
      </footer>

      {/* ================= FINE PRINT MODAL ================================ */}
      {termsOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close discount terms"
            onClick={() => setTermsOpen(false)}
            className="absolute inset-0 w-full bg-[#1a1a1a]/68"
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[80vh] max-w-[600px] flex-col gap-4 overflow-auto bg-[#F4F1EC] px-6 pt-6 pb-7">
            <div className="flex items-start justify-between gap-3 border-b-2 border-[#222222] pb-3">
              <h3 className="text-[28px] leading-[1.15] text-[#222222]" style={serif}>
                Discount terms
              </h3>
              <button
                type="button"
                onClick={() => setTermsOpen(false)}
                aria-label="Close"
                className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center"
              >
                <svg
                  className="h-5 w-5 text-[#5A6570]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>
            {TERMS.map((t) => (
              <div key={t} className="border-b border-[#222222]/12 pb-3">
                <span className="text-[13px] leading-[1.7] text-[#5A6570]">{t}</span>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setTermsOpen(false)}
              className="flex min-h-[50px] items-center justify-center border border-[#222222] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#222222]"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
