"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import type { MascotMood } from "@/lib/shorty/mascot/poses";

/* ── One owner at a time texts Shorty; he answers ─────────────────────────────
   Nito's Empanadas is a real client; the other business names are made up. */
type Exchange = { biz: string; ask: string; reply: string };

const EXCHANGES: Exchange[] = [
  { biz: "Nito's Empanadas", ask: "Add the Meatball Parm Empanada to the menu. $6.", reply: "On the menu. Smells great from here." },
  { biz: "Coastal Plumbing", ask: "Move my 2pm to Thursday and let her know.", reply: "Moved. She's got the new time." },
  { biz: "Salt & Shear Salon", ask: "Post to social media: walk-ins welcome today.", reply: "Posted. Clear your chairs." },
  { biz: "Low Tide Tacos", ask: "We're at Clear Pond Friday, 1 to 5.", reply: "It's on the calendar. Clear Pond won't know what hit it." },
  { biz: "Rise Bakery", ask: "Sold out of croissants. Take them off.", reply: "Gone. Tomorrow's batch better hurry." },
  { biz: "Anchor Taproom", ask: "Text everyone trivia starts at 7.", reply: "Texted 348 regulars. Brains warming up." },
  { biz: "Greenline Landscaping", ask: "Send the Hendersons the backyard quote.", reply: "Sent. Fingers crossed, gloves on." },
  { biz: "Shine Mobile Detailing", ask: "Post to social media: Saturday's wide open.", reply: "Posted. Saturday won't stay open long." },
];

const HELLO_MS = 1500;
/* Per text: 0 quiet · 1 it arrives (he looks, nods) · 2 he's typing · 3 his reply · 4 both float away */
const STEP_MS = [700, 1700, 900, 2800, 450];

/* Printed-paper grain, the same feel as Shorty's ink. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function Bubble({ on, side, label, children }: { on: boolean; side: "in" | "out"; label: string; children: React.ReactNode }) {
  const mine = side === "out";
  return (
    <div
      className={`max-w-[260px] transition-[opacity,transform] duration-300 ease-[cubic-bezier(.2,.8,.3,1.25)] lg:max-w-[290px] ${mine ? "mr-auto origin-bottom-left" : "ml-auto origin-bottom-right"} ${
        on ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-90"
      }`}
      style={{ rotate: mine ? "-1deg" : "1.2deg" }}
    >
      <p className={`mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a7266] ${mine ? "ml-3" : "mr-3 text-right"}`}>{label}</p>
      <div
        className={`relative rounded-[20px] border-[2px] border-[#1d1a16] px-3.5 py-2 text-[14.5px] leading-[1.38] shadow-[3px_3px_0_#1d1a16] lg:px-4 lg:py-2.5 lg:text-[16px] ${
          mine ? "rounded-bl-[6px] bg-[#8cc3a1] font-semibold text-[#12301f]" : "rounded-br-[6px] bg-[#fbf6e6] font-medium text-[#1d1a16]"
        }`}
      >
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[.22] mix-blend-multiply" style={{ backgroundImage: GRAIN }} />
        <span className="relative">{children}</span>
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
    if (reduce.current) { setPhase("texts"); setStep(3); }
  }, []);

  useEffect(() => {
    if (reduce.current) return;
    if (phase === "hello") {
      const id = window.setTimeout(() => setPhase("texts"), HELLO_MS);
      return () => clearTimeout(id);
    }
    const id = window.setTimeout(() => {
      if (step < 4) setStep(step + 1);
      else { setStep(0); setN((k) => k + 1); }
    }, STEP_MS[step]);
    return () => clearTimeout(id);
  }, [phase, step]);

  const ex = EXCHANGES[n % EXCHANGES.length];
  const mood: MascotMood =
    phase === "hello" ? "hello"
    : reduce.current ? "pleased"
    : step === 1 ? "nod"
    : step === 3 ? "pleased"
    : "wait";

  return (
    <section className="relative overflow-x-clip">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 px-4 pt-3 pb-10 [grid-template-areas:'stage''copy'] sm:px-8 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center lg:gap-x-12 lg:pt-10 lg:pb-24 lg:[grid-template-areas:'copy_stage']">
        {/* The stage: a text comes in, Shorty answers, then the next one. */}
        <div className="mx-auto flex w-full max-w-[400px] flex-col [grid-area:stage] lg:max-w-none">
          <div className="mt-4 flex h-[176px] flex-col justify-end gap-2.5 lg:mt-0 lg:h-[220px] lg:gap-4" aria-live="polite">
            <Bubble on={phase === "texts" && step >= 1 && step <= 3} side="in" label={ex.biz}>
              {ex.ask}
            </Bubble>
            <Bubble on={phase === "texts" && (step === 2 || step === 3)} side="out" label="Shorty">
              {step === 2 ? (
                <span className="inline-flex gap-1.5 py-1" aria-label="Shorty is typing">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-[#12301f]/70" style={{ animationDelay: `${i * 120}ms`, animationDuration: "900ms" }} />
                  ))}
                </span>
              ) : (
                ex.reply
              )}
            </Bubble>
          </div>
          <div className="relative -mt-9 w-[var(--w)] self-center [--w:170px] lg:-mt-8 lg:[--w:300px]">
            <ShortyMascot mood={mood} size={190} style={{ width: "100%", height: "auto" }} />
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
