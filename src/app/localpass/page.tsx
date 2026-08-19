"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";

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

// Same reveal the homepage uses (src/app/page.tsx).
const fadeUpVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Section reveal. `plain` renders a normal div with no motion and no hidden
 * state — used for reduced motion and for browsers without IntersectionObserver,
 * so content can never be stranded invisible. The data-reveal hook is what the
 * <noscript> rule in layout.tsx targets when JS never runs at all.
 */
function Reveal({
  children,
  plain,
  className,
}: {
  children: React.ReactNode;
  plain: boolean;
  className?: string;
}) {
  if (plain) {
    return (
      <div data-reveal className={className}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      data-reveal
      className={className}
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}



const STRIP = [
  {
    n: "01",
    title: "Claim your pass",
    body: "A minute on your phone. The Local Pass lands in your Shortlist account and it is yours from that moment on.",
  },
  {
    n: "02",
    title: "Explore the Strand",
    body: "Kitchens, coffee, barbers, shops and tee times from Little River to Pawleys — one list that keeps growing.",
  },
  {
    n: "03",
    title: "Show your digital card",
    body: "Pull it up at the table before they ring you up. Nothing to scan, and nothing for anyone to install.",
  },
  {
    n: "04",
    title: "Enjoy the perks",
    body: "Half off a second entree, plus whatever the shops and studios around town are running that month.",
  },
];

/** Hollow Fraunces numerals, drawn as stroked SVG text. */
function Numeral({ n, tilt }: { n: string; tilt: number }) {
  return (
    <svg
      viewBox="0 0 120 72"
      className="h-[62px] w-[104px] sm:h-[76px] sm:w-[126px]"
      style={{ transform: `rotate(${tilt}deg)` }}
      aria-hidden="true"
    >
      <text
        x="60"
        y="56"
        textAnchor="middle"
        fill="none"
        stroke="#34D399"
        strokeWidth="1.5"
        strokeLinejoin="round"
        style={{ fontFamily: "var(--font-fraunces)", fontSize: 64, fontWeight: 500 }}
      >
        {n}
      </text>
    </svg>
  );
}

/** Types itself in once when it comes into view. Full text is always in the DOM. */
function Typed({ lines, plain, go }: { lines: string[]; plain: boolean; go: boolean }) {
  let i = 0;
  return (
    <h2
      className="text-center text-[42px] leading-[1.02] tracking-[-0.02em] text-[#F2F5F3] sm:text-[72px] lg:text-[86px]"
      style={display}
    >
      {lines.map((line, li) => (
        <span key={line} className="block">
          {Array.from(line).map((ch, ci) => {
            const d = i++ * 0.035;
            return (
              <motion.span
                key={ci}
                data-reveal
                className="inline-block whitespace-pre"
                initial={plain ? false : { opacity: 0 }}
                animate={plain || go ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.01, delay: plain ? 0 : d }}
              >
                {ch}
              </motion.span>
            );
          })}
          {li === lines.length - 1 && !plain && (
            <motion.span
              aria-hidden="true"
              className="ml-1.5 inline-block h-[0.72em] w-[0.5em] align-baseline"
              style={{ background: "#F0A868" }}
              animate={
                go
                  ? {
                      opacity: [1, 1, 0, 0],
                      transition: { duration: 0.8, repeat: 3, times: [0, 0.45, 0.5, 1], ease: "linear" },
                    }
                  : { opacity: 0 }
              }
            />
          )}
        </span>
      ))}
    </h2>
  );
}

function StepsStrip({ plain }: { plain: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { amount: 0.25, once: false });

  return (
    <div ref={wrap}>
      <Typed lines={["A better way", "to local"]} plain={plain} go={inView} />

      <div className="mt-14 grid grid-cols-1 gap-12 sm:mt-16 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-7">
        {STRIP.map((s, i) => (
          <div key={s.n} className="flex flex-col items-center text-center">
            {/* gentle hover, each on its own clock so they never move together */}
            <motion.div
              data-reveal
              animate={plain || !inView ? { y: 0 } : { y: [0, -9, 0] }}
              transition={
                plain || !inView
                  ? { duration: 0 }
                  : { duration: 3.1 + i * 0.42, repeat: Infinity, ease: "easeInOut", delay: i * 0.55 }
              }
            >
              <Numeral n={s.n} tilt={[-3, 2, -2, 3][i]} />
            </motion.div>

            <h3 className="mt-5 flex min-h-[2.4em] max-w-[220px] items-center text-[21px] font-semibold leading-[1.2] text-[#F2F5F3] sm:text-[22px]">
              {s.title}
            </h3>
            <p className="mt-3 max-w-[260px] text-[14px] leading-[1.65] text-[#9AA49E]">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Halftone wash — the printed-paper texture the consumer system uses.
const halftone = {
  backgroundImage: "radial-gradient(rgba(242,245,243,0.055) 1px, transparent 1px)",
  backgroundSize: "5px 5px",
};


export default function LocalPassPage() {
  const [termsOpen, setTermsOpen] = useState(false);
  const [vertical, setVertical] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const still = prefersReducedMotion === true;

  // whileInView needs IntersectionObserver. Where it is missing, render every
  // section plainly rather than leaving it stranded at opacity 0. Server
  // assumes it exists, so the markup hydrates without a mismatch.
  const canObserve = useSyncExternalStore(
    () => () => {},
    () => typeof IntersectionObserver !== "undefined",
    () => true
  );
  const plain = still || !canObserve;

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
            data-reveal
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
                        data-reveal
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

      {/* ================= A BETTER WAY TO LOCAL — steps strip =========== */}
      <section className="relative overflow-hidden border-y border-dashed border-[#F2F5F3]/20 px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
        <div className="absolute inset-0" style={halftone} />
        <div className="relative mx-auto max-w-[1100px]">
          <StepsStrip plain={plain} />
        </div>
      </section>

      {/* ================= TRUST STRIP ===================================== */}
      <section className="px-6">
        <Reveal plain={plain} className="mx-auto grid max-w-[600px] grid-cols-3 gap-px bg-[#1A211D]">
          {["Nothing to download", "Little River to Pawleys", "Every dollar stays local"].map(
            (item) => (
              <div key={item} className="bg-[#0B0F0D] px-3 py-5 text-center">
                <span className="text-[10px] font-medium uppercase leading-[1.6] tracking-[0.14em] text-[#9AA49E]">
                  {item}
                </span>
              </div>
            )
          )}
        </Reveal>
      </section>

      {/* ================= THE LIST — three states ========================= */}
      <section className="px-6 pb-14">
        <Reveal plain={plain} className="mx-auto max-w-[600px]">
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
        </Reveal>
      </section>

      {/* ================= MEMBER PERKS ==================================== */}
      <section className="px-6 pb-14">
        <Reveal plain={plain} className="mx-auto max-w-[600px]">
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
        </Reveal>
      </section>

      {/* ================= PRICING ========================================= */}
      <section className="px-6 pb-14">
        <Reveal plain={plain} className="mx-auto max-w-[600px] rounded-[18px] border border-[#34D399]/45 bg-[#34D399]/8 px-6 py-8">
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
        </Reveal>
      </section>

      {/* ================= FAQ ============================================= */}
      <section className="px-6 pb-14">
        <Reveal plain={plain} className="mx-auto max-w-[600px]">
          <h2 className="mb-4 text-[27px] leading-[1.2] text-[#F2F5F3]" style={display}>
            Questions
          </h2>
          {FAQS.map((f) => (
            <div key={f.q} className="flex flex-col gap-2 border-t border-[#F2F5F3]/14 py-5">
              <h3 className="text-[16px] font-semibold text-[#F2F5F3]">{f.q}</h3>
              <p className="text-[14px] leading-[1.65] text-[#9AA49E]">{f.a}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ================= FOOTER ========================================== */}
      <footer className="border-t border-[#F2F5F3]/14 px-6 pt-8 pb-11">
        <Reveal plain={plain} className="mx-auto flex max-w-[600px] flex-col gap-3.5">
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
        </Reveal>
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
