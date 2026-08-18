"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// ---------------------------------------------------------------------------
// THE LIST — add and remove names here, nowhere else.
// The section picks its own layout from the length of this array:
//   0 entries    -> "the first kitchens are signing" state
//   1-6 entries  -> early state, one full-width row each
//   7+ entries   -> the full grid
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

// PLACEHOLDER VERTICALS — not yet contracted. The card's rotating line only.
const VERTICALS = [
  "off a second entree",
  "off your second round",
  "off a second ticket",
  "off your second scoop",
  "off a second item",
];

// Non-restaurant members. ALL PLACEHOLDER — swap before launch.
const PERKS = [
  { name: "Tidal Creek Creamery", category: "Ice Cream", deal: "Buy one scoop, get one free" }, // PLACEHOLDER
  { name: "Sugar & Salt Bakeshop", category: "Dessert", deal: "Free dessert with any $15 order" }, // PLACEHOLDER
  { name: "Litchfield Links Academy", category: "Golf", deal: "$20 off a 30-minute lesson" }, // PLACEHOLDER
  { name: "Strand Surf Supply", category: "Retail", deal: "10% off everything in the shop" }, // PLACEHOLDER
];

const STEPS = [
  {
    n: "1",
    title: "Get on the list",
    body: "A minute on your phone and the pass is in your Shortlist account. $4.99 a month, starting the day you join.",
  },
  {
    n: "2",
    title: "Pull it up when you sit down",
    body: "It lives in your account, not on your phone. New phone, cleared browser, borrowed tablet — sign in and it is there.",
  },
  {
    n: "3",
    title: "Show your server",
    body: "Before they ring you up. Half off the second entree comes straight off the check.",
  },
];

const INCLUDED = [
  "Half off a second entree everywhere on the list",
  "Little River to Pawleys, one pass, no zones",
  "Every place that joins after you do, at no extra cost",
  "Cancel anytime from your account",
];

const FAQS = [
  {
    q: "Is there an app?",
    a: "No. The pass opens in the browser you already use, and there is nothing to carry in your wallet.",
  },
  {
    q: "What happens when I get a new phone?",
    a: "Sign in to Shortlist and the pass is there. It belongs to your account, not your device.",
  },
  {
    q: "How does it work at the table?",
    a: "Pull up the pass and show your server before they ring you up. Nothing to scan, and nothing for the restaurant to install.",
  },
  {
    q: "Who is behind this?",
    a: "We are. The Shortlist Co is on the Grand Strand, and we built this for the places we eat at ourselves. Your $4.99 pays us and the businesses on the list — there is no national chain taking a cut.",
  },
  {
    q: "Does the list keep growing?",
    a: "That is the point. We are signing kitchens now, and members hear about each one the day it joins. Nothing is frozen at signup.",
  },
];

// DRAFT TERMS — legal and each restaurant to confirm before launch.
const TERMS = [
  "The discount applies to a second entree of equal or lesser value.",
  "One discount per membership, per visit.",
  "Dine-in only, unless a restaurant states otherwise on its listing.",
  "Not combinable with other discounts, happy hour pricing, or holiday menus.",
  "Excludes alcohol, tax, and gratuity.",
  "Participating businesses set their own blackout dates. Current dates are always shown on the listing in your account.",
  "Membership is per person and non-transferable.",
];

const display = { fontFamily: "var(--font-fraunces)" };

// Halftone wash — the printed-paper texture the consumer system uses.
const halftone = {
  backgroundImage: "radial-gradient(rgba(242,245,243,0.055) 1px, transparent 1px)",
  backgroundSize: "5px 5px",
};

/**
 * PLACEHOLDER ARTWORK — a drawn Grand Strand, line art in one accent.
 * Stands in until real Strand illustration or photography exists.
 */
function StrandScene() {
  return (
    <svg
      viewBox="0 0 600 130"
      fill="none"
      stroke="#34D399"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-auto w-full"
      aria-hidden="true"
    >
      {/* string lights */}
      <path d="M0 14q150 20 300 8t300 6" stroke="rgba(242,245,243,0.2)" strokeWidth={1.2} />
      <circle cx="84" cy="22" r="2.6" stroke="rgba(240,168,104,0.85)" strokeWidth={1.4} />
      <circle cx="180" cy="25" r="2.6" stroke="rgba(240,168,104,0.85)" strokeWidth={1.4} />
      <circle cx="276" cy="24" r="2.6" stroke="rgba(240,168,104,0.85)" strokeWidth={1.4} />
      <circle cx="372" cy="21" r="2.6" stroke="rgba(240,168,104,0.85)" strokeWidth={1.4} />
      <circle cx="468" cy="23" r="2.6" stroke="rgba(240,168,104,0.85)" strokeWidth={1.4} />

      {/* gulls */}
      <path d="M120 44q7-7 14 0M134 44q7-7 14 0" stroke="rgba(242,245,243,0.45)" strokeWidth={1.4} />
      <path d="M436 36q6-6 12 0M448 36q6-6 12 0" stroke="rgba(242,245,243,0.45)" strokeWidth={1.4} />

      {/* water */}
      <path d="M0 100h600" stroke="rgba(242,245,243,0.14)" strokeWidth={1.2} />
      <path d="M24 110q14-5 28 0t28 0M120 114q14-5 28 0t28 0M400 112q14-5 28 0t28 0M500 108q14-5 28 0t28 0" stroke="rgba(242,245,243,0.12)" strokeWidth={1.2} />

      {/* pier — deck, planks, railing, pilings into the water */}
      <path d="M0 74h214" />
      <path d="M0 68h206" stroke="rgba(52,211,153,0.45)" strokeWidth={1.2} />
      <path d="M18 68V52M62 68V52M106 68V52M150 68V52M194 68V52" stroke="rgba(52,211,153,0.5)" strokeWidth={1.4} />
      <path d="M0 52h200" stroke="rgba(52,211,153,0.5)" strokeWidth={1.4} />
      <path d="M18 74v32M62 74v30M106 74v29M150 74v28M194 74v27" />
      <path d="M18 90h44M106 89h44" stroke="rgba(52,211,153,0.45)" strokeWidth={1.3} />

      {/* shrimp boat */}
      <path d="M248 84q66 26 132 0l-10-14H258z" />
      <path d="M286 70V46h44v24" />
      <path d="M296 52h12v10h-12" stroke="rgba(242,245,243,0.4)" strokeWidth={1.3} />
      <path d="M330 46V12" />
      <path d="M330 20l-58 46M330 20l52 44" stroke="rgba(52,211,153,0.5)" strokeWidth={1.4} />
      <path d="M330 12h22v9h-22" stroke="rgba(240,168,104,0.8)" strokeWidth={1.5} />

      {/* marsh grass */}
      <path d="M222 102q3-24 10-32M230 102q1-27 6-34M238 102q4-22 12-28" stroke="rgba(52,211,153,0.8)" strokeWidth={1.6} />
      <path d="M396 102q3-20 10-27M404 102q1-23 6-29M412 102q4-19 12-24" stroke="rgba(52,211,153,0.8)" strokeWidth={1.6} />
      <path d="M486 104q3-22 10-30M494 104q1-25 6-32M502 104q4-21 12-26" stroke="rgba(52,211,153,0.8)" strokeWidth={1.6} />

      {/* palmetto */}
      <path d="M552 106V44" strokeWidth={2.2} />
      <path d="M552 44q-30-14-42 4M552 44q30-14 42 4M552 44q-12-30 4-36M552 44q18-26 34-16M552 44q-28 6-30 26M552 44q28 6 30 26" stroke="rgba(52,211,153,0.75)" strokeWidth={1.8} />
      <path d="M545 50q4 8 14 8" stroke="rgba(240,168,104,0.7)" strokeWidth={1.4} />
    </svg>
  );
}

export default function LocalPassPage() {
  const [termsOpen, setTermsOpen] = useState(false);
  const [vertical, setVertical] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const still = prefersReducedMotion === true;

  // Rotating category line. Static on reduced motion.
  useEffect(() => {
    if (still) return;
    const id = setInterval(() => {
      setVertical((v) => (v + 1) % VERTICALS.length);
    }, 3600);
    return () => clearInterval(id);
  }, [still]);

  const count = RESTAURANTS.length;

  return (
    <main className="bg-[#0B0F0D]">
      {/* ================= HERO ============================================ */}
      <section className="px-6 pt-12 pb-14">
        <div className="mx-auto flex max-w-[600px] flex-col gap-7">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F0A868]">
            Built on the Grand Strand · by people who live here
          </span>

          {/* The pass. Credit-card proportions at every width. */}
          <motion.div
            initial={still ? false : { opacity: 0, y: 14, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative mx-auto aspect-[856/540] w-full max-w-[420px] overflow-hidden rounded-[18px] bg-[#34D399] shadow-[0_18px_40px_rgba(11,15,13,0.55)]"
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(11,15,13,0.12) 1px, transparent 1px)",
                backgroundSize: "4px 4px",
              }}
            />

            {/* Sheen. Slow enough to read as light, not a glint. */}
            {!still && (
              <motion.div
                className="pointer-events-none absolute inset-y-0 -left-full w-full"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 20%, rgba(242,245,243,0.38) 50%, transparent 80%)",
                }}
                animate={{ x: ["0%", "300%"] }}
                transition={{
                  duration: 5.5,
                  repeatDelay: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            <div className="absolute inset-0 flex flex-col justify-between px-6 py-5">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0B0F0D]/70">
                  The Local Pass
                </span>
                {/* Rubber stamp — ticket furniture, sits slightly off-square. */}
                <span className="-rotate-[7deg] rounded-[4px] border-[1.5px] border-[#0B0F0D]/45 px-[7px] py-[4px] text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0B0F0D]">
                  Founding member
                </span>
                <svg
                  className="hidden h-6 w-6 text-[#F2F5F3]/75"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 3v8a3 3 0 0 0 3 3v7" />
                  <path d="M7 3v6" />
                  <path d="M10 3v6" />
                  <path d="M17 3c-1.5 2-2 4-2 7h4V3z" />
                  <path d="M17 10v11" />
                </svg>
              </div>

              <div className="flex items-end gap-3">
                {/* Fixed. Never rotates. */}
                <span
                  className="text-[62px] leading-[0.86] text-[#0B0F0D] sm:text-[74px]"
                  style={display}
                >
                  50%
                </span>
                <div className="relative h-[46px] w-[150px] shrink-0 pb-1 sm:h-[56px] sm:w-[180px]">
                  {still ? (
                    <span
                      className="absolute inset-x-0 bottom-0 text-[17px] italic leading-[1.3] text-[#0B0F0D]/75 sm:text-[21px]"
                      style={display}
                    >
                      {VERTICALS[0]}
                    </span>
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={vertical}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.55, ease: "easeInOut" }}
                        className="absolute inset-x-0 bottom-0 text-[17px] italic leading-[1.3] text-[#0B0F0D]/75 sm:text-[21px]"
                        style={display}
                      >
                        {VERTICALS[vertical]}
                      </motion.span>
                    </AnimatePresence>
                  )}
                </div>
              </div>

              {/* Perforation, then the stub line. */}
              <div className="border-t border-dashed border-[#0B0F0D]/30 pt-3">
                <div className="flex items-center justify-between text-[10px] font-bold tracking-[0.16em] text-[#0B0F0D]/60">
                  <span>№ 001 · GRAND STRAND</span>
                  <span>$4.99/MO</span>
                </div>
              </div>
            </div>
          </motion.div>

          <h1
            className="text-[32px] leading-[1.18] tracking-[-0.01em] text-[#F2F5F3] text-pretty sm:text-[40px]"
            style={display}
          >
            One pass for the places we actually go.
          </h1>

          <p className="text-[15px] leading-[1.7] text-[#9AA49E] text-pretty sm:text-[16px]">
            Half off a second entree from Little River to Pawleys, for $4.99 a month. We live
            here too. This is the shortlist of spots we think are worth your money, and every
            dollar of it stays on the Strand.
          </p>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="flex min-h-[56px] items-center justify-center rounded-full bg-[#34D399] px-6 text-[17px] font-semibold text-[#0B0F0D] transition-colors duration-200 hover:bg-[#34D399]/85"
            >
              Get on the list — $4.99/month
            </button>
            <button
              type="button"
              onClick={() => setTermsOpen(true)}
              className="mx-auto min-h-[44px] px-2 text-[13px] text-[#9AA49E] underline underline-offset-4 transition-colors duration-200 hover:text-[#F2F5F3]/80"
            >
              Discount terms
            </button>
          </div>
        </div>
      </section>

      {/* ================= THE STRAND — placeholder line art =============== */}
      <section className="relative overflow-hidden border-y border-dashed border-[#F2F5F3]/20">
        <div className="absolute inset-0" style={halftone} />
        <motion.div
          initial={still ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto max-w-[600px] px-6 pt-5 pb-5"
        >
          <StrandScene />
          <p className="mt-4 text-center text-[13px] leading-[1.6] text-[#9AA49E]">
            Little River, Myrtle Beach, Murrells Inlet, Pawleys. One pass, the whole of it.
          </p>
        </motion.div>
      </section>

      {/* ================= TRUST STRIP ===================================== */}
      <section className="px-6">
        <div className="mx-auto grid max-w-[600px] grid-cols-3 gap-px bg-[#1A211D]">
          {["Nothing to download", "Little River to Pawleys", "Every dollar stays local"].map(
            (item) => (
              <div key={item} className="bg-[#0B0F0D] px-3 py-5 text-center">
                <span className="text-[10px] font-medium uppercase leading-[1.6] tracking-[0.14em] text-[#9AA49E]">
                  {item}
                </span>
              </div>
            )
          )}
        </div>
      </section>

      {/* ================= HOW IT WORKS ==================================== */}
      <section className="px-6 pt-12 pb-12">
        <div className="mx-auto max-w-[600px]">
          <h2
            className="mb-1 text-[27px] leading-[1.2] text-[#F2F5F3]"
            style={display}
          >
            Three steps, then dinner.
          </h2>
          <p className="mb-6 text-[14px] text-[#9AA49E]">
            No hardware, no sticker on the door, nothing for the kitchen to learn.
          </p>
          {STEPS.map((step) => (
            <div key={step.n} className="flex gap-[18px] border-t border-[#F2F5F3]/14 py-6">
              <span
                className="w-10 shrink-0 text-[40px] leading-[0.85] text-[#34D399]"
                style={display}
              >
                {step.n}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="text-[18px] font-semibold text-[#F2F5F3]">{step.title}</h3>
                <p className="text-[14px] leading-[1.65] text-[#9AA49E]">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= THE LIST — three states ========================= */}
      <section className="px-6 pb-14">
        <div className="mx-auto max-w-[600px]">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#34D399]">
                The list
              </span>
              <h2 className="text-[27px] leading-[1.15] text-[#F2F5F3]" style={display}>
                {count === 0
                  ? "The first kitchens are signing now."
                  : count <= 6
                    ? `The first ${count} are in.`
                    : "Where it works"}
              </h2>
            </div>
            {count > 6 && (
              <span className="shrink-0 rounded-full bg-[#34D399] px-3 py-1.5 text-[11px] font-semibold tracking-[0.08em] text-[#0B0F0D]">
                {count} SPOTS
              </span>
            )}
          </div>

          {count === 0 ? (
            /* Nobody signed yet. No counts, no ghost cells — name the towns. */
            <>
              <div className="overflow-hidden rounded-[14px] border border-[#1A211D]">
                {TOWNS.map((town, i) => (
                  <div
                    key={town}
                    className={`flex items-center justify-between gap-3 bg-[#131916] px-4 py-4 ${
                      i > 0 ? "border-t border-[#1A211D]" : ""
                    }`}
                  >
                    <span className="text-[15px] font-semibold text-[#F2F5F3]">{town}</span>
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#34D399]">
                      In conversation
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[14px] leading-[1.65] text-[#9AA49E]">
                Get on the list before it opens and every place that signs lands on your pass
                automatically — starting with the first one.
              </p>
            </>
          ) : count <= 6 ? (
            /* A handful signed. Full-width rows carry more presence than a thin grid. */
            <div className="flex flex-col gap-2">
              {RESTAURANTS.map((r) => (
                <div
                  key={r.name}
                  className="flex items-center justify-between gap-3 rounded-[12px] bg-[#131916] px-4 py-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[16px] font-semibold leading-[1.25] text-[#F2F5F3]">
                      {r.name}
                    </span>
                    <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#34D399]">
                      {r.category}
                    </span>
                  </div>
                  <span className="shrink-0 text-[11px] text-[#9AA49E]">{r.town}</span>
                </div>
              ))}
              <div className="flex items-center gap-2.5 rounded-[12px] border border-dashed border-[#34D399]/55 px-4 py-4">
                <svg
                  className="h-[18px] w-[18px] shrink-0 text-[#34D399]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                <span className="text-[13px] leading-[1.5] text-[#9AA49E]">
                  More signing this month. Founding members get every one of them.
                </span>
              </div>
            </div>
          ) : (
            /* The full grid. Town stays as information, not as the structure. */
            <>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-[#1A211D] bg-[#1A211D]">
                {RESTAURANTS.map((r) => (
                  <div
                    key={r.name}
                    className="flex min-h-[100px] flex-col justify-center gap-2 bg-[#131916] px-3.5 py-4"
                  >
                    <span className="text-[15px] font-semibold leading-[1.3] text-[#F2F5F3]">
                      {r.name}
                    </span>
                    <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#34D399]">
                      {r.category}
                      <span className="text-[#9AA49E]"> · {r.town}</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2.5 rounded-[12px] border border-dashed border-[#34D399]/55 px-4 py-3.5">
                <svg
                  className="h-[18px] w-[18px] shrink-0 text-[#34D399]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                <span className="text-[13px] leading-[1.5] text-[#9AA49E]">
                  We are still signing kitchens. They land on your pass the day they do.
                </span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ================= MEMBER PERKS ==================================== */}
      <section className="px-6 pb-14">
        <div className="mx-auto max-w-[600px]">
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#34D399]">
            Beyond dinner
          </span>
          <h2 className="mb-1 text-[27px] leading-[1.2] text-[#F2F5F3]" style={display}>
            The Strand is not only restaurants.
          </h2>
          <p className="mb-6 text-[14px] leading-[1.65] text-[#9AA49E]">
            A few neighbors run their own deal for members. Same pass, same account.
          </p>
          <div className="flex flex-col gap-2">
            {PERKS.map((p) => (
              <div
                key={p.name}
                className="flex flex-col gap-2 rounded-[12px] border-l-2 border-[#34D399] bg-[#131916] px-4 py-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[16px] font-semibold text-[#F2F5F3]">{p.name}</span>
                  <span className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9AA49E]">
                    {p.category}
                  </span>
                </div>
                <span className="text-[14px] leading-[1.55] text-[#F0A868]">{p.deal}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRICING ========================================= */}
      <section className="px-6 pb-14">
        <div className="mx-auto max-w-[600px] rounded-[18px] border border-[#34D399]/45 bg-[#34D399]/8 px-6 py-8">
          <div className="mb-6 flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#34D399]">
              Founding membership
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-[52px] leading-none text-[#F2F5F3]" style={display}>
                $4.99
              </span>
              <span className="text-[15px] text-[#9AA49E]">a month</span>
            </div>
            <span className="text-[13px] leading-[1.6] text-[#9AA49E]">
              One price, no zones, no tiers. Founding members keep it for as long as they stay.
            </span>
          </div>
          <div className="mb-6 flex flex-col gap-3">
            {INCLUDED.map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <svg
                  className="mt-0.5 h-[17px] w-[17px] shrink-0 text-[#34D399]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-[14px] leading-[1.55] text-[#F2F5F3]">{item}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="flex min-h-[56px] w-full items-center justify-center rounded-full bg-[#34D399] px-6 text-[17px] font-semibold text-[#0B0F0D] transition-colors duration-200 hover:bg-[#34D399]/85"
          >
            Get on the list — $4.99/month
          </button>
        </div>
      </section>

      {/* ================= FAQ ============================================= */}
      <section className="px-6 pb-14">
        <div className="mx-auto max-w-[600px]">
          <h2 className="mb-4 text-[27px] leading-[1.2] text-[#F2F5F3]" style={display}>
            Questions
          </h2>
          {FAQS.map((f) => (
            <div key={f.q} className="flex flex-col gap-2 border-t border-[#F2F5F3]/14 py-5">
              <h3 className="text-[16px] font-semibold text-[#F2F5F3]">{f.q}</h3>
              <p className="text-[14px] leading-[1.65] text-[#9AA49E]">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ========================================== */}
      <footer className="border-t border-[#F2F5F3]/14 px-6 pt-8 pb-11">
        <div className="mx-auto flex max-w-[600px] flex-col gap-3.5">
          <span className="text-[15px] font-semibold text-[#F2F5F3]">The Shortlist Co</span>
          <span className="text-[13px] leading-[1.6] text-[#9AA49E]">
            Myrtle Beach, South Carolina. We are from here.
          </span>
          <a
            href="mailto:hello@shortlistpass.com"
            className="text-[13px] text-[#9AA49E] transition-colors duration-200 hover:text-[#F2F5F3]"
          >
            hello@shortlistpass.com
          </a>
          <span className="text-[11px] text-[#9AA49E]">
            © {new Date().getFullYear()} The Shortlist Co
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
            className="absolute inset-0 w-full bg-[#0B0F0D]/80"
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[80vh] max-w-[600px] flex-col gap-4 overflow-auto rounded-t-[20px] border-t-2 border-[#34D399] bg-[#131916] px-6 pt-5 pb-7">
            <div className="mx-auto h-1 w-10 rounded-full bg-[#F2F5F3]/25" />
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[22px] leading-[1.25] text-[#F2F5F3]" style={display}>
                Discount terms
              </h3>
              <button
                type="button"
                onClick={() => setTermsOpen(false)}
                aria-label="Close"
                className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center"
              >
                <svg
                  className="h-5 w-5 text-[#9AA49E]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>
            {TERMS.map((t) => (
              <div key={t} className="flex gap-2.5 border-b border-[#F2F5F3]/12 pb-3">
                <span className="mt-2 h-[5px] w-[5px] shrink-0 rounded-full bg-[#34D399]" />
                <span className="text-[13px] leading-[1.65] text-[#9AA49E]">{t}</span>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setTermsOpen(false)}
              className="flex min-h-[50px] items-center justify-center rounded-full border border-[#F2F5F3]/30 text-[15px] font-medium text-[#F2F5F3]"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
