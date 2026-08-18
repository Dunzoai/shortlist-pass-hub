"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  AnimatePresence,
  motion,
  useAnimate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
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


const STEPS = [
  {
    n: "1",
    title: "Get on the list",
    body: "A minute on your phone and the pass is in your Shortlist account. $4.99 a month, starting the day you join.",
  },
  {
    n: "2",
    title: "Pull it up when you sit down",
    body: "It lives in your account, not on your phone. New phone, cleared browser, borrowed tablet \u2014 sign in and it is there.",
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

/* ── Hand-drawn line icons. Single weight, mint with amber accents.
   Deliberately a little wobbly — the drawing style from the old Strand
   scene is the one thing worth keeping from it. ── */
const ICON = {
  fill: "none" as const,
  stroke: "#34D399",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const AMBER = "#F0A868";

function IcoPier() {
  return (
    <svg viewBox="0 0 40 40" {...ICON} aria-hidden="true">
      <path d="M2 16.5q9-1 18-.5t18 .5" />
      <path d="M7 16v15M15 16.5v13.5M24 16v15M33 16.5v13" />
      <path d="M7 23.5q4 .5 8 0M24 23q4.5.5 9 0" stroke="rgba(52,211,153,0.5)" />
      <path d="M2 12.5q9-1.5 18-1t18 1" stroke={AMBER} strokeWidth="1.4" />
    </svg>
  );
}
function IcoPalmetto() {
  return (
    <svg viewBox="0 0 40 40" {...ICON} aria-hidden="true">
      <path d="M20.5 37q-.5-10 0-19" />
      <path d="M20 18q-9-6-14 .5M20 18q9.5-6 14 .5M20 18q-4.5-10 1.5-13M20 18q6.5-9 11-4.5M20 18q-9 2.5-9.5 9M20 18q9 2.5 9.5 9" />
      <path d="M17 22.5q2.5 4 6.5 3.5" stroke={AMBER} strokeWidth="1.3" />
    </svg>
  );
}
function IcoMarsh() {
  return (
    <svg viewBox="0 0 40 40" {...ICON} aria-hidden="true">
      <path d="M6 35q1.5-13 5-17M13 35q-.5-15 2.5-19M20.5 35q2-13 6.5-16M27 35q-.5-14 3-17M34 35q1-11 4.5-14" />
      <path d="M2 35.5q18-1.5 36 0" stroke="rgba(52,211,153,0.4)" />
    </svg>
  );
}
function IcoGull() {
  return (
    <svg viewBox="0 0 40 40" {...ICON} aria-hidden="true">
      <path d="M2 22q9.5-11 18-.5" />
      <path d="M20 21.5q9-10.5 18 .5" />
      <path d="M18.5 21.5q1.5 2 3 0" stroke={AMBER} strokeWidth="1.3" />
    </svg>
  );
}
function IcoWave() {
  return (
    <svg viewBox="0 0 40 40" {...ICON} aria-hidden="true">
      <path d="M2 18q6-7 12-.5t12 0 12-2.5" />
      <path d="M2 26q6-6.5 12 0t12 0 12-2" />
      <path d="M2 33.5q6-6 12 0t12 0 12-2" stroke={AMBER} strokeWidth="1.3" />
    </svg>
  );
}
function IcoForkKnife() {
  return (
    <svg viewBox="0 0 40 40" {...ICON} aria-hidden="true">
      <path d="M11.5 4v9M15.5 4v9M13.5 4v9" />
      <path d="M9 13q4.5.8 9 0v2q0 3.5-3 4.5l.8 16" />
      <path d="M28.5 4q3.5 5 2.5 12h-5q-.8-7 2.5-12z" />
      <path d="M28.5 16.5q.4 10 0 19" />
      <path d="M9 36q10-1 22 0" stroke={AMBER} strokeWidth="1.3" />
    </svg>
  );
}
function IcoCoffee() {
  return (
    <svg viewBox="0 0 40 40" {...ICON} aria-hidden="true">
      <path d="M6.5 14.5q11-1 21 0v9.5q0 8.5-8 8.5h-5q-8 0-8-8.5z" />
      <path d="M27.5 17.5q6-.8 6 4t-6 4" />
      <path d="M4 36q14-1 27 0" stroke="rgba(52,211,153,0.5)" />
      <path d="M14 10q3-3.5 0-6M21 10q3-3.5 0-6" stroke={AMBER} strokeWidth="1.3" />
    </svg>
  );
}
function IcoScissors() {
  return (
    <svg viewBox="0 0 40 40" {...ICON} aria-hidden="true">
      <circle cx="11" cy="30.5" r="4.3" />
      <circle cx="28.5" cy="30.5" r="4.3" />
      <path d="M14 27.5 30.5 5" />
      <path d="M25.5 27.5 9 5" />
      <path d="M19 18.5q1.5 1 2.5 0" stroke={AMBER} strokeWidth="1.3" />
    </svg>
  );
}
function IcoBag() {
  return (
    <svg viewBox="0 0 40 40" {...ICON} aria-hidden="true">
      <path d="M7.5 13q12.5-1 25 0l-2.5 22q-10 1-20 0z" />
      <path d="M14 13.5q-.5-8 6-8t6 8" />
      <path d="M14 21q6 1.5 12 0" stroke={AMBER} strokeWidth="1.3" />
    </svg>
  );
}
function IcoTicket() {
  return (
    <svg viewBox="0 0 40 40" {...ICON} aria-hidden="true">
      <path d="M3 12.5q17-1 34 0v5.5q-3.5 2-3.5 4t3.5 4V32q-17 1-34 0v-6q3.5-2 3.5-4t-3.5-4z" />
      <path d="M20 15v2.5M20 21v2.5M20 27v2.5" stroke={AMBER} strokeWidth="1.4" />
    </svg>
  );
}
function IcoGolf() {
  return (
    <svg viewBox="0 0 40 40" {...ICON} aria-hidden="true">
      <circle cx="20" cy="11" r="6.2" />
      <path d="M12.5 19.5q7.5 2.5 15 0" />
      <path d="M15 20 18.5 30M25 20 21.5 30" />
      <path d="M18.5 30q1.5 2.2 3 0" />
      <path d="M7 33.5q13 1.5 26 0" stroke="rgba(52,211,153,0.5)" />
      <path d="M17.5 9.5q1.2 1.6 2.8 1.2" stroke={AMBER} strokeWidth="1.3" />
    </svg>
  );
}

type RingIcon = { C: () => React.ReactElement; x: number; y: number; r: number };

const SLIDE_1: RingIcon[] = [
  { C: IcoPier, x: 14, y: 20, r: -8 },
  { C: IcoPalmetto, x: 82, y: 14, r: 7 },
  { C: IcoGull, x: 90, y: 52, r: -5 },
  { C: IcoWave, x: 74, y: 86, r: 4 },
  { C: IcoMarsh, x: 12, y: 76, r: -6 },
];

// Six different kinds of business. Generic on purpose — no name, no claim.
const SLIDE_2: RingIcon[] = [
  { C: IcoForkKnife, x: 20, y: 12, r: -7 },
  { C: IcoCoffee, x: 76, y: 10, r: 6 },
  { C: IcoScissors, x: 90, y: 44, r: -4 },
  { C: IcoBag, x: 74, y: 86, r: 5 },
  { C: IcoTicket, x: 24, y: 88, r: -6 },
  { C: IcoGolf, x: 8, y: 46, r: 7 },
];

// Same six, drifted inward to make room for the pass.
const SLIDE_3: RingIcon[] = [
  { C: IcoForkKnife, x: 16, y: 31, r: -5 },
  { C: IcoCoffee, x: 84, y: 28, r: 4 },
  { C: IcoScissors, x: 89, y: 57, r: -3 },
  { C: IcoBag, x: 78, y: 85, r: 4 },
  { C: IcoTicket, x: 21, y: 87, r: -4 },
  { C: IcoGolf, x: 11, y: 57, r: 5 },
];

const SLIDES = [
  { line: "You live here.", icons: SLIDE_1, card: false },
  { line: "You already support local.", icons: SLIDE_2, card: false },
  { line: "Now it pays you back.", icons: SLIDE_3, card: true },
];

function Ring({ icons, active, plain, dim }: { icons: RingIcon[]; active: boolean; plain: boolean; dim: boolean }) {
  return (
    <>
      {icons.map((ic, i) => (
        <motion.span
          key={i}
          data-reveal
          className="absolute block h-11 w-11 sm:h-14 sm:w-14"
          style={{ left: `${ic.x}%`, top: `${ic.y}%`, marginLeft: "-1.375rem", marginTop: "-1.375rem" }}
          initial={plain ? false : { opacity: 0, scale: 0.4, rotate: ic.r - 16 }}
          animate={
            plain
              ? { opacity: dim ? 0.55 : 1, scale: 1, rotate: ic.r }
              : active
                ? { opacity: dim ? 0.55 : 1, scale: 1, rotate: ic.r }
                : { opacity: 0, scale: 0.4, rotate: ic.r - 16 }
          }
          transition={{ type: "spring", stiffness: 430, damping: 17, delay: active ? 0.16 + i * 0.09 : 0 }}
        >
          <ic.C />
        </motion.span>
      ))}
    </>
  );
}

function Slide({ s, active, plain }: { s: (typeof SLIDES)[number]; active: boolean; plain: boolean }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px] sm:max-w-[420px]">
      <Ring icons={s.icons} active={active} plain={plain} dim={s.card} />
      <p
        data-reveal
        className={`absolute inset-x-[14%] text-center text-[27px] leading-[1.15] text-[#F2F5F3] sm:text-[34px] ${
          s.card ? "top-[2%]" : "top-1/2 -translate-y-1/2"
        }`}
        style={display}
      >
        {s.line}
      </p>
      {s.card && (
        <motion.span
          data-reveal
          className="absolute left-1/2 top-[49%] block w-[46%] max-w-[172px] rounded-[10px] bg-[#34D399] px-3 py-2.5"
          style={{ marginLeft: "-23%" }}
          initial={plain ? false : { opacity: 0, scale: 0.7, y: 18, rotate: 4 }}
          animate={plain || active ? { opacity: 1, scale: 1, y: 0, rotate: -4 } : { opacity: 0, scale: 0.7, y: 18, rotate: 4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: active && !plain ? 0.72 : 0 }}
        >
          <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-[#0B0F0D]/70">
            The Local Pass
          </span>
          <span className="mt-1 block text-[30px] leading-none text-[#0B0F0D]" style={display}>
            50%
          </span>
          <span className="mt-2 block border-t border-dashed border-[#0B0F0D]/30 pt-1.5 text-[8px] font-bold tracking-[0.14em] text-[#0B0F0D]/60">
            № 001 · GRAND STRAND
          </span>
        </motion.span>
      )}
    </div>
  );
}

function WhyCarousel({ plain }: { plain: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { amount: 0.3 });
  const [index, setIndex] = useState(0);
  const [took, setTook] = useState(false);

  // Auto-advance. Stops for good the moment anyone touches it, and rests
  // whenever the section is off screen.
  useEffect(() => {
    if (plain || took || !inView) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 4600);
    return () => clearInterval(id);
  }, [plain, took, inView]);

  const go = (n: number) => {
    setTook(true);
    setIndex(((n % SLIDES.length) + SLIDES.length) % SLIDES.length);
  };

  if (plain) {
    return (
      <div className="flex flex-col gap-10">
        {SLIDES.map((s) => (
          <Slide key={s.line} s={s} active plain />
        ))}
      </div>
    );
  }

  return (
    <div ref={wrap}>
      <div
        data-carousel-viewport
        className="overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#34D399]"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Why the pass"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(index + 1);
          if (e.key === "ArrowLeft") go(index - 1);
        }}
      >
        <motion.div
          data-carousel-track
          className="flex"
          animate={{ x: `-${index * 100}%` }}
          transition={{ type: "spring", stiffness: 250, damping: 32 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.16}
          onDragStart={() => setTook(true)}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(index + 1);
            else if (info.offset.x > 60) go(index - 1);
          }}
        >
          {SLIDES.map((s, i) => (
            <div key={s.line} data-carousel-slide className="w-full shrink-0 px-2">
              <Slide s={s} active={i === index} plain={false} />
            </div>
          ))}
        </motion.div>
      </div>

      <div data-carousel-chrome className="mt-6 flex items-center justify-center gap-2.5">
        {SLIDES.map((s, i) => (
          <button
            key={s.line}
            type="button"
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}: ${s.line}`}
            aria-current={i === index}
            className="flex h-11 w-7 items-center justify-center"
          >
            <span
              className="block h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === index ? 22 : 8,
                background: i === index ? "#34D399" : "rgba(242,245,243,0.28)",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * THE CHECK — the bill arriving, top-down. Vector and type only.
 * One loop: land, print, halve, stamp, "so bring somebody".
 * The stamp is the only percussive beat on the page; everything else is quiet.
 */
const MONO = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
};

function TheCheck({ plain }: { plain: boolean }) {
  const [scope, animate] = useAnimate();
  const inView = useInView(scope, { amount: 0.35 });
  // starts at the settled value so the no-JS and reduced-motion views read as finished
  const price = useMotionValue(11);
  const priceText = useTransform(price, (v) => v.toFixed(2));

  useEffect(() => {
    if (plain || !inView) return;
    const controls = animate(
      [
        // reset
        ["#chk", { opacity: 0, y: 64, rotate: 0, scale: 0.97, x: 0 }, { duration: 0 }],
        ["#l1", { opacity: 0 }, { duration: 0, at: 0 }],
        ["#l2", { opacity: 0 }, { duration: 0, at: 0 }],
        ["#strike", { scaleX: 0 }, { duration: 0, at: 0 }],
        ["#stamp", { opacity: 0, scale: 1.7, rotate: -24 }, { duration: 0, at: 0 }],
        ["#cap", { opacity: 0, y: 10 }, { duration: 0, at: 0 }],
        ["#shadow", { opacity: 0, scaleY: 1 }, { duration: 0, at: 0 }],
        [price, 22, { duration: 0, at: 0 }],

        // 1 — it lands, and settles off-square
        ["#chk", { opacity: 1, y: 0, rotate: -4, scale: 1 }, { duration: 0.9, ease: [0.16, 1, 0.3, 1] }],
        ["#shadow", { opacity: 0.5 }, { duration: 0.9, at: 0 }],

        // 2 — two plates, printed one after the other
        ["#l1", { opacity: 1 }, { duration: 0.14, at: 1.05 }],
        ["#l2", { opacity: 1 }, { duration: 0.14, at: 1.6 }],

        // 3 — the second one halves
        ["#strike", { scaleX: 1 }, { duration: 0.24, at: 2.5, ease: "easeOut" }],
        [price, 11, { duration: 0.5, at: 2.62, ease: [0.3, 0, 0.1, 1] }],

        // 4 — THE STAMP. everything reacts to it.
        ["#stamp", { opacity: 1, scale: 0.93, rotate: -11 }, { duration: 0.11, at: 3.45, ease: [0.4, 0, 0.2, 1] }],
        ["#stamp", { scale: 1 }, { duration: 0.55, at: 3.56, ease: [0.2, 1.5, 0.35, 1] }],
        ["#chk", { x: [0, -4, 3, -1.5, 0], rotate: [-4, -3.2, -4.5, -3.9, -4] }, { duration: 0.4, at: 3.45 }],
        ["#shadow", { scaleY: [1, 0.84, 1.04, 1], opacity: [0.5, 0.72, 0.5] }, { duration: 0.4, at: 3.45 }],

        // 5 — it goes, the line stays
        ["#chk", { opacity: 0, y: 40 }, { duration: 0.6, at: 4.9, ease: "easeIn" }],
        ["#shadow", { opacity: 0 }, { duration: 0.5, at: 4.9 }],
        ["#cap", { opacity: 1, y: 0 }, { duration: 0.55, at: 5.15, ease: "easeOut" }],
        ["#cap", { opacity: 0 }, { duration: 0.45, at: 6.5 }],
      ],
      { repeat: Infinity, repeatDelay: 0.15 }
    );
    return () => controls.stop();
  }, [plain, inView, animate, price]);

  return (
    <div
      ref={scope}
      className="relative mx-auto flex min-h-[380px] w-full max-w-[600px] items-center justify-center sm:min-h-[430px]"
    >
      {/* the light on the table */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 42%, rgba(240,168,104,0.11), transparent 72%)",
        }}
      />

      {/* the line it leaves behind */}
      <p
        id="cap"
        data-reveal
        className="absolute px-8 text-center text-[26px] leading-[1.25] text-[#F2F5F3] sm:text-[32px]"
        style={{ ...display, opacity: plain ? 1 : 0 }}
      >
        So bring somebody.
      </p>

      {/* cast shadow, separate so it can react to the thump */}
      <div
        id="shadow"
        aria-hidden="true"
        className="absolute h-[74%] w-[min(300px,74vw)] rounded-[6px] sm:w-[340px]"
        style={{
          background: "#0B0F0D",
          filter: "blur(26px)",
          transform: "translateY(24px)",
          opacity: plain ? 0.5 : 0,
        }}
      />

      {/* the check */}
      <div
        id="chk"
        data-reveal
        className="relative w-[min(300px,74vw)] rounded-[4px] px-5 pt-6 pb-16 sm:w-[340px] sm:px-6"
        style={{
          background:
            "linear-gradient(158deg, #F2F5F3 0%, #F2F5F3 62%, rgba(154,164,158,0.28) 100%)",
          color: "#0B0F0D",
          opacity: plain ? 1 : 0,
          transform: plain ? "rotate(-4deg)" : undefined,
          boxShadow: "0 18px 40px rgba(11,15,13,0.55)",
        }}
      >
        {/* paper grain */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[4px]"
          style={{
            backgroundImage: "radial-gradient(rgba(11,15,13,0.07) 1px, transparent 1px)",
            backgroundSize: "4px 4px",
          }}
        />
        {/* fold */}
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2"
          style={{ height: 1, background: "rgba(11,15,13,0.06)" }}
        />

        <div className="relative">
          <div
            className="flex items-baseline justify-between text-[10px] tracking-[0.1em] opacity-55"
            style={MONO}
          >
            <span>TABLE 4</span>
            <span>2 GUESTS</span>
          </div>

          <div
            className="mt-5 border-t border-dashed pt-4"
            style={{ borderColor: "rgba(11,15,13,0.22)" }}
          />

          <div
            id="l1"
            className="flex items-baseline justify-between text-[13px] sm:text-[14px]"
            style={{ ...MONO, opacity: plain ? 1 : 0 }}
          >
            <span>ENTREE</span>
            <span>24.00</span>
          </div>

          <div
            id="l2"
            className="mt-2.5 flex items-baseline justify-between text-[13px] sm:text-[14px]"
            style={{ ...MONO, opacity: plain ? 1 : 0 }}
          >
            <span>ENTREE</span>
            <span className="flex items-baseline gap-2">
              <span className="relative opacity-40">
                22.00
                <span
                  id="strike"
                  className="absolute left-0 top-1/2 h-px w-full origin-left"
                  style={{
                    background: "#0B0F0D",
                    transform: plain ? "scaleX(1)" : "scaleX(0)",
                  }}
                />
              </span>
              <motion.span className="font-bold">{priceText}</motion.span>
            </span>
          </div>

          <div
            className="mt-4 border-t border-dashed pt-3"
            style={{ borderColor: "rgba(11,15,13,0.22)" }}
          />
          <div className="text-[10px] tracking-[0.1em] opacity-55" style={MONO}>
            THANK YOU
          </div>
        </div>

        {/* the stamp — ink, not a sticker */}
        <span
          id="stamp"
          data-reveal
          className="absolute bottom-4 right-4 rounded-[4px] px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] sm:text-[11px]"
          style={{
            border: "2px solid #F0A868",
            color: "#F0A868",
            mixBlendMode: "multiply",
            opacity: plain ? 1 : 0,
            transform: plain ? "rotate(-11deg)" : undefined,
          }}
        >
          Local Pass
        </span>
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

      {/* ================= THE CHECK ======================================= */}
      <section className="relative overflow-hidden border-y border-dashed border-[#F2F5F3]/20 px-6 pt-8 pb-10">
        <div className="absolute inset-0" style={halftone} />
        <div className="relative">
          <TheCheck plain={plain} />
          <Reveal plain={plain} className="mx-auto mt-6 max-w-[420px]">
            <p className="text-center text-[13px] leading-[1.65] text-[#9AA49E]">
              Show your server before they ring you up. Half comes off the second entree,
              right there on the check.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ================= WHY — carousel ================================== */}
      <section className="relative overflow-hidden border-b border-dashed border-[#F2F5F3]/20 px-4 pt-12 pb-12">
        <div className="absolute inset-0" style={halftone} />
        <div className="relative mx-auto max-w-[600px]">
          <WhyCarousel plain={plain} />
        </div>
      </section>

      {/* ================= HOW IT WORKS ==================================== */}
      <section className="px-6 pt-12 pb-12">
        <Reveal plain={plain} className="mx-auto max-w-[600px]">
          <h2 className="mb-1 text-[27px] leading-[1.2] text-[#F2F5F3]" style={display}>
            Three steps, then dinner.
          </h2>
          <p className="mb-6 text-[14px] text-[#9AA49E]">
            No hardware, no sticker on the door, nothing for the kitchen to learn.
          </p>
          {STEPS.map((step) => (
            <div key={step.n} className="flex gap-[18px] border-t border-[#F2F5F3]/14 py-6">
              <span className="w-10 shrink-0 text-[40px] leading-[0.85] text-[#34D399]" style={display}>
                {step.n}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="text-[18px] font-semibold text-[#F2F5F3]">{step.title}</h3>
                <p className="text-[14px] leading-[1.65] text-[#9AA49E]">{step.body}</p>
              </div>
            </div>
          ))}
        </Reveal>
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
