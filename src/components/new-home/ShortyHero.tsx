"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import type { MascotMood, MascotTask } from "@/lib/shorty/mascot/poses";

/* ── Texts from all kinds of owners, and what Shorty does about each ───────── */
type Exchange = { who: string; ask: string; act: { mood: MascotMood; task?: MascotTask }; reply: string };

const EXCHANGES: Exchange[] = [
  { who: "Restaurant", ask: "Add the Meatball Parm Empanada to the menu. $6.", act: { mood: "working", task: "menu" }, reply: "On the menu. Smells great from here." },
  { who: "Plumber", ask: "Move my 2pm to Thursday and let her know.", act: { mood: "working", task: "text" }, reply: "Moved. She's got the new time." },
  { who: "Salon", ask: "Post to social media: walk-ins welcome today.", act: { mood: "working", task: "social" }, reply: "Posted. Clear your chairs." },
  { who: "Food truck", ask: "We're at Clear Pond Friday, 1 to 5.", act: { mood: "working", task: "event" }, reply: "It's on the calendar. Clear Pond won't know what hit it." },
  { who: "Bakery", ask: "Sold out of croissants. Take them off.", act: { mood: "oops" }, reply: "Gone. Tomorrow's batch better hurry." },
  { who: "Taproom", ask: "Text everyone trivia starts at 7.", act: { mood: "working", task: "text" }, reply: "Texted 348 regulars. Brains warming up." },
  { who: "Landscaper", ask: "Send the Hendersons the backyard quote.", act: { mood: "listening" }, reply: "Sent. Fingers crossed, gloves on." },
  { who: "Detailer", ask: "Post to social media: Saturday's wide open.", act: { mood: "working", task: "social" }, reply: "Posted. Saturday won't stay open long." },
];

/* Steps: 0 quiet · 1 text arrives (he reads) · 2 he works · 3 done + reply · 4 clear */
const STEP_MS = [500, 1100, 1800, 2700, 450];
const WALK_HELLO_MS = 1600;

type Phase = "offstage" | "walking" | "hello" | "texts";

function Pop({ on, className = "", children }: { on: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div
      data-pop
      className={`transition-[opacity,transform] duration-300 ease-out ${on ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-[.97]"} ${className}`}
    >
      {children}
    </div>
  );
}

export function ShortyHero() {
  const walker = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<Phase>("offstage");
  const [i, setI] = useState(0);
  const [step, setStep] = useState(0);
  const reduce = useRef(false);

  /* Shorty walks in from off the right edge of the screen to center stage. */
  useLayoutEffect(() => {
    const el = walker.current;
    if (!el) return;
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce.current) {
      el.style.opacity = "1";
      setPhase("texts");
      setStep(3);
      return;
    }
    const rect = el.getBoundingClientRect();
    const distance = window.innerWidth - rect.left + 24;
    const ms = Math.min(2600, Math.max(1600, (distance / 380) * 1000));
    const id = window.setTimeout(() => {
      el.style.opacity = "1";
      setPhase("walking");
      el.animate(
        [{ transform: `translateX(${distance}px)` }, { transform: "translateX(0)" }],
        { duration: ms, easing: "cubic-bezier(.25,.5,.45,1)", fill: "backwards" },
      ).onfinish = () => setPhase("hello");
    }, 300);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (phase !== "hello") return;
    const id = window.setTimeout(() => setPhase("texts"), WALK_HELLO_MS);
    return () => clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "texts" || reduce.current) return;
    const id = window.setTimeout(() => {
      if (step < 4) setStep(step + 1);
      else { setStep(0); setI((n) => (n + 1) % EXCHANGES.length); }
    }, STEP_MS[step]);
    return () => clearTimeout(id);
  }, [phase, step]);

  const ex = EXCHANGES[i];
  let mood: MascotMood = "wait", task: MascotTask = "none";
  if (phase === "offstage" || phase === "walking") mood = "walk";
  else if (phase === "hello") mood = "hello";
  else if (!reduce.current) {
    if (step === 1) mood = "listening";
    else if (step === 2) { mood = ex.act.mood; task = ex.act.task ?? "none"; }
    else if (step === 3) mood = "done";
  }
  const showing = step >= 1 && step <= 3;

  return (
    <section className="relative overflow-x-clip">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 px-4 pt-6 pb-16 [grid-template-areas:'stage''copy'] sm:px-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center lg:gap-x-12 lg:pt-14 lg:pb-24 lg:[grid-template-areas:'copy_stage']">
        {/* The stage: texts come in up top, Shorty handles them below. */}
        <div className="[grid-area:stage]" aria-live="polite">
          <div className="mx-auto flex min-h-[210px] max-w-[400px] flex-col justify-end gap-2.5 pt-6 lg:min-h-[230px]">
            <Pop on={showing} className="ml-auto max-w-[290px]">
              <div className="rounded-[18px] rounded-br-md bg-[#1d1a16] px-4 py-3 text-[#fbf6e6] shadow-[0_10px_30px_-14px_rgba(29,26,22,.55)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#fbf6e6]/55">{ex.who} · by text</p>
                <p className="mt-0.5 text-[15px] leading-[1.4] font-medium">{ex.ask}</p>
              </div>
            </Pop>
            <Pop on={showing && step >= 3} className="mr-auto max-w-[290px]">
              <div className="rounded-[18px] rounded-bl-md bg-[#86d3a9] px-4 py-3 text-[15px] leading-[1.4] font-semibold text-[#12301f]">
                {ex.reply}
              </div>
            </Pop>
          </div>
          <div
            ref={walker}
            data-walkin
            className="relative -mt-2 w-[var(--w)] ml-[calc(50%-var(--w)/2)] opacity-0 [--w:270px] sm:[--w:300px] lg:[--w:350px]"
          >
            <ShortyMascot mood={mood} task={task} size={190} style={{ width: "100%", height: "auto" }} />
          </div>
        </div>

        <div className="mt-4 max-w-[480px] [grid-area:copy] lg:mt-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2f7a50] sm:text-[12px]">Your newest hire</p>
          <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-[clamp(52px,6.4vw,84px)] leading-[0.95] font-normal tracking-[-0.03em] text-[#1d1a16] lg:whitespace-nowrap">
            Meet Shorty.
          </h1>
          <p className="mt-6 text-[17px] leading-[1.6] text-[#3a352d] sm:text-[18px]">
            He&apos;s the coworker who never clocks out. He knows everything you sell, talks to your customers, takes their
            money for you, and handles the busywork so you can focus on what you do best.
          </p>
          <p className="mt-4 text-[15px] font-semibold text-[#2f7a50]">
            Just text Shorty what you need. You say yes, he gets it done.
          </p>
        </div>
      </div>
    </section>
  );
}
