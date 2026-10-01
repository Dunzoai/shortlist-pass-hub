"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import type { MascotMood } from "@/lib/shorty/mascot/poses";

/* ── One owner at a time texts Shorty; he does it on his phone and answers ────
   Nito's Empanadas is a real client; the other business names are made up. */
type Icon = keyof typeof ICONS;
type Exchange = {
  biz: string; tint: string; ask: string; reply: string;
  card: { icon: Icon; label: string; value: string };
};

const EXCHANGES: Exchange[] = [
  { biz: "Nito's Empanadas", tint: "#f2c94c", ask: "Add the Meatball Parm Empanada to the menu. $6.", reply: "On the menu. Smells great from here.",
    card: { icon: "menu", label: "Menu item added", value: "Meatball Parm Empanada · $6" } },
  { biz: "Coastal Plumbing", tint: "#8fb8e0", ask: "Move my 2pm to Thursday and let her know.", reply: "Moved. She's got the new time.",
    card: { icon: "clock", label: "Rescheduled", value: "2:00 PM → Thursday" } },
  { biz: "Salt & Shear Salon", tint: "#f0a3b4", ask: "Post to social media: walk-ins welcome today.", reply: "Posted. Clear your chairs.",
    card: { icon: "megaphone", label: "Posted to social", value: "Walk-ins welcome today" } },
  { biz: "Low Tide Tacos", tint: "#f5a46a", ask: "We're at Clear Pond Friday, 1 to 5.", reply: "It's on the calendar. Clear Pond won't know what hit it.",
    card: { icon: "calendar", label: "Event scheduled", value: "Fri · Clear Pond · 1–5 PM" } },
  { biz: "Rise Bakery", tint: "#d9b58c", ask: "Sold out of croissants. Take them off.", reply: "Gone. Tomorrow's batch better hurry.",
    card: { icon: "minus", label: "Removed from menu", value: "Croissants · sold out" } },
  { biz: "Anchor Taproom", tint: "#b7a3e0", ask: "Text everyone trivia starts at 7.", reply: "Texted 348 regulars. Brains warming up.",
    card: { icon: "message", label: "Text sent", value: "348 regulars · Trivia at 7" } },
  { biz: "Greenline Landscaping", tint: "#a8d08d", ask: "Send the Hendersons the backyard quote.", reply: "Sent. Fingers crossed, gloves on.",
    card: { icon: "send", label: "Quote sent", value: "The Hendersons · Backyard" } },
  { biz: "Shine Mobile Detailing", tint: "#7fd0d6", ask: "Post to social media: Saturday's wide open.", reply: "Posted. Saturday won't stay open long.",
    card: { icon: "megaphone", label: "Posted to social", value: "Saturday's wide open" } },
];

const ICONS = {
  menu: "M6 7h12M6 12h12M6 17h8",
  clock: "M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  megaphone: "M4 10v4h3l7 4V6L7 10H4zM17 9a4 4 0 0 1 0 6",
  calendar: "M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5zM4 10h16M8.5 3v4M15.5 3v4",
  minus: "M6 12h12",
  message: "M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H11l-4 3.5V15h.5A2.5 2.5 0 0 1 5 12.5z",
  send: "M4 12 20 4l-6 16-3-7-7-1z",
};

const HELLO_MS = 1500;
/* Per text: 0 quiet · 1 it arrives (he nods) · 2 he works his phone · 3 the card pops out · 4 his reply · 5 all clear */
const STEP_MS = [600, 1400, 1300, 1100, 2700, 450];

/* Printed-paper grain, the same feel as Shorty's ink. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const Grain = () => (
  <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[.22] mix-blend-multiply" style={{ backgroundImage: GRAIN }} />
);
const PAPER = "border-[1.5px] border-[#1d1a16] shadow-[2px_2px_0_#1d1a16] sm:border-2 sm:shadow-[3px_3px_0_#1d1a16]";
const pop = (on: boolean) => (on ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-90");

/** The owner's text: a colored strip with the business name, then the message. */
function Incoming({ on, ex }: { on: boolean; ex: Exchange }) {
  return (
    <div
      className={`ml-auto max-w-[220px] origin-bottom-right transition-[opacity,translate,scale,rotate] duration-300 ease-[cubic-bezier(.2,.8,.3,1.25)] sm:max-w-[270px] lg:max-w-[300px] ${pop(on)}`}
      style={{ rotate: "1.2deg" }}
    >
      <div className={`relative overflow-hidden rounded-[15px] rounded-br-[5px] bg-[#fbf6e6] sm:rounded-[20px] ${PAPER}`}>
        <Grain />
        <p className="relative border-b-[1.5px] border-[#1d1a16] px-3 py-1 text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-[#1d1a16] sm:border-b-2 sm:px-4 sm:py-1.5 sm:text-[11px]" style={{ background: ex.tint }}>
          {ex.biz}
        </p>
        <p className="relative px-3 py-1.5 text-[12.5px] leading-[1.35] font-medium text-balance text-[#1d1a16] sm:px-4 sm:py-2.5 sm:text-[15px] lg:text-[16px]">{ex.ask}</p>
      </div>
    </div>
  );
}

/** Shorty's answer. */
function Reply({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`mr-auto max-w-[220px] origin-bottom-left transition-[opacity,translate,scale,rotate] duration-300 ease-[cubic-bezier(.2,.8,.3,1.25)] sm:max-w-[270px] lg:max-w-[300px] ${pop(on)}`}
      style={{ rotate: "-1deg" }}
    >
      <p className="mb-0.5 ml-3 text-[8.5px] font-semibold uppercase tracking-[0.14em] text-[#7a7266] sm:mb-1 sm:text-[10px]">Shorty</p>
      <div className={`relative rounded-[15px] rounded-bl-[5px] bg-[#8cc3a1] px-3 py-1.5 text-[12.5px] leading-[1.35] font-semibold text-[#12301f] sm:rounded-[20px] sm:px-4 sm:py-2.5 sm:text-[15px] lg:text-[16px] ${PAPER}`}>
        <Grain />
        <span className="relative block text-balance">{children}</span>
      </div>
    </div>
  );
}

/** What he did, popping out of his phone. Anchored at the phone's spot on the drawing (TAP_PHONE_AT). */
function ResultCard({ on, ex }: { on: boolean; ex: Exchange }) {
  return (
    <div
      className={`absolute top-[33%] left-[60%] z-10 w-[150px] origin-[0%_80%] transition-[opacity,translate,scale,rotate] duration-[420ms] ease-[cubic-bezier(.2,.9,.3,1.3)] sm:w-[200px] lg:w-[215px] ${
        on ? "translate-x-3 -translate-y-1 scale-100 rotate-[3deg] opacity-100" : "-translate-x-6 translate-y-6 scale-[.2] rotate-0 opacity-0"
      }`}
    >
      <div className={`relative rounded-[12px] bg-[#fbf6e6] px-2.5 py-2 sm:rounded-[14px] sm:px-3 sm:py-2.5 ${PAPER}`}>
        <Grain />
        <div className="relative flex items-center gap-1.5 sm:gap-2">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md border-[1.5px] border-[#1d1a16] sm:h-6 sm:w-6" style={{ background: ex.tint }}>
            <svg viewBox="0 0 24 24" className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" stroke="#1d1a16" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={ICONS[ex.card.icon]} />
            </svg>
          </span>
          <span className="text-[8.5px] font-extrabold uppercase tracking-[0.12em] text-[#1d1a16] sm:text-[10px]">{ex.card.label}</span>
        </div>
        <p className="relative mt-1 text-[11.5px] leading-[1.3] font-semibold text-[#1d1a16] sm:mt-1.5 sm:text-[14px]">{ex.card.value}</p>
        <p className="relative mt-1 inline-flex items-center gap-1 rounded-full bg-[#2f7a50] px-1.5 py-px text-[8.5px] font-bold uppercase tracking-[0.1em] text-[#fbf6e6] sm:mt-1.5 sm:px-2 sm:text-[10px]">
          ✓ Done
        </p>
      </div>
    </div>
  );
}

export function ShortyHero() {
  const [phase, setPhase] = useState<"hello" | "texts">("hello");
  const [n, setN] = useState(0);
  const [step, setStep] = useState(0);
  const reduce = useRef(false);

  useLayoutEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce.current) { setPhase("texts"); setStep(4); }
  }, []);

  useEffect(() => {
    if (reduce.current) return;
    if (phase === "hello") {
      const id = window.setTimeout(() => setPhase("texts"), HELLO_MS);
      return () => clearTimeout(id);
    }
    const id = window.setTimeout(() => {
      if (step < 5) setStep(step + 1);
      else { setStep(0); setN((k) => k + 1); }
    }, STEP_MS[step]);
    return () => clearTimeout(id);
  }, [phase, step]);

  const ex = EXCHANGES[n % EXCHANGES.length];
  const live = phase === "texts";
  const mood: MascotMood =
    phase === "hello" ? "hello"
    : reduce.current ? "pleased"
    : step === 1 ? "nod"
    : step === 2 || step === 3 ? "tapping"
    : step === 4 ? "pleased"
    : "wait";

  return (
    <section className="relative overflow-x-clip">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 px-4 pt-3 pb-10 [grid-template-areas:'stage''copy'] sm:px-8 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center lg:gap-x-12 lg:pt-10 lg:pb-24 lg:[grid-template-areas:'copy_stage']">
        {/* The stage: a text comes in, Shorty works his phone, the result pops out, he answers. */}
        <div className="mx-auto flex w-full max-w-[400px] flex-col [grid-area:stage] lg:max-w-none" aria-live="polite">
          <div className="mt-4 flex h-[150px] flex-col justify-end gap-2 sm:h-[190px] sm:gap-2.5 lg:mt-0 lg:h-[230px] lg:gap-4">
            <Incoming on={live && step >= 1 && step <= 4} ex={ex} />
            <Reply on={live && step === 4}>{ex.reply}</Reply>
          </div>
          {/* Shorty sits a little left of center so the card has room to come out on his right. */}
          <div className="relative -mt-7 w-[var(--w)] -translate-x-[42px] self-center [--w:190px] sm:-mt-9 lg:-translate-x-[70px] lg:[--w:300px]">
            <ShortyMascot mood={mood} size={190} style={{ width: "100%", height: "auto" }} />
            <ResultCard on={live && step >= 3 && step <= 4} ex={ex} />
          </div>
        </div>

        <div className="mt-4 max-w-[480px] [grid-area:copy] lg:mt-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2f7a50] sm:text-[12px]">Your newest hire</p>
          <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-[clamp(44px,6.4vw,84px)] leading-[0.95] font-normal tracking-[-0.03em] text-[#1d1a16] lg:mt-3 lg:whitespace-nowrap">
            Meet Shorty.
          </h1>
          <p className="mt-3 text-[15.5px] leading-[1.5] text-[#3a352d] sm:text-[18px] sm:leading-[1.6] lg:mt-6">
            He&apos;s the coworker who never clocks out. He knows everything you sell, talks to your customers, takes their
            money for you, and handles the busywork so you can focus on what you do best.
          </p>
          <p className="mt-2.5 text-[14.5px] font-semibold text-[#2f7a50] sm:text-[15px] lg:mt-4">
            Just text Shorty what you need. You say yes, he gets it done.
          </p>
        </div>
      </div>
    </section>
  );
}
