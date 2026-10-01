"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import type { MascotMood, MascotTask } from "@/lib/shorty/mascot/poses";

/* ── One owner at a time texts Shorty; he does it and answers ─────────────────
   Nito's Empanadas is a real client; the other business names are made up. */
type Exchange = { biz: string; ask: string; act: { mood: MascotMood; task?: MascotTask }; reply: string };

const EXCHANGES: Exchange[] = [
  { biz: "Nito's Empanadas", ask: "Add the Meatball Parm Empanada to the menu. $6.", act: { mood: "working", task: "menu" }, reply: "On the menu. Smells great from here." },
  { biz: "Coastal Plumbing", ask: "Move my 2pm to Thursday and let her know.", act: { mood: "working", task: "text" }, reply: "Moved. She's got the new time." },
  { biz: "Salt & Shear Salon", ask: "Post to social media: walk-ins welcome today.", act: { mood: "working", task: "social" }, reply: "Posted. Clear your chairs." },
  { biz: "Low Tide Tacos", ask: "We're at Clear Pond Friday, 1 to 5.", act: { mood: "working", task: "event" }, reply: "It's on the calendar. Clear Pond won't know what hit it." },
  { biz: "Rise Bakery", ask: "Sold out of croissants. Take them off.", act: { mood: "oops" }, reply: "Gone. Tomorrow's batch better hurry." },
  { biz: "Anchor Taproom", ask: "Text everyone trivia starts at 7.", act: { mood: "working", task: "text" }, reply: "Texted 348 regulars. Brains warming up." },
  { biz: "Greenline Landscaping", ask: "Send the Hendersons the backyard quote.", act: { mood: "listening" }, reply: "Sent. Fingers crossed, gloves on." },
  { biz: "Shine Mobile Detailing", ask: "Post to social media: Saturday's wide open.", act: { mood: "working", task: "social" }, reply: "Posted. Saturday won't stay open long." },
];

/* The intro: he waves, spots something, the phone slides in and shoves him over. */
const HELLO_MS = 1300;
const SPOT_MS = 500;
const PHONE_MS = 420;
const SHOVE_MS = 650;
/* Per text: 0 owner types · 1 sent (he reads) · 2 he works · 3 reply · 4 screen clears */
const STEP_MS = [1100, 1000, 1700, 2600, 380];

type Phase = "hello" | "spot" | "shove" | "texts";

/* ── The phone, dressed like the real Shorty app ──────────────────────────── */
const TABS = [
  { label: "Chat", d: "M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H11l-4 3.5V15h.5A2.5 2.5 0 0 1 5 12.5z" },
  { label: "Playbook", d: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" },
  { label: "Dashboard", d: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { label: "More", d: "M6 12h.01M12 12h.01M18 12h.01" },
];

function Phone({ ex, step, typed }: { ex: Exchange; step: number; typed: string }) {
  const sent = step >= 1 && step <= 3;
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[28px] border-[5px] border-[#2a2925] bg-[#141412] text-[#f1ece0] shadow-[0_30px_60px_-28px_rgba(29,26,22,.7)] lg:rounded-[38px] lg:border-[7px]">
      <div className="flex items-center gap-2 border-b border-[#2a2925] px-3 pt-3 pb-2 lg:px-4 lg:pt-5 lg:pb-3">
        <span className={`truncate text-[10.5px] font-semibold transition-opacity duration-300 lg:text-[13px] ${step === 4 ? "opacity-0" : "opacity-100"}`}>{ex.biz}</span>
      </div>

      <div className={`flex flex-1 flex-col justify-end gap-2.5 overflow-hidden px-2.5 pb-2 transition-opacity duration-300 lg:gap-4 lg:px-4 lg:pb-3 ${step === 4 ? "opacity-0" : "opacity-100"}`}>
        {sent && (
          <p className="slp-pop ml-auto max-w-[88%] rounded-[14px] bg-[#2b2a26] px-2.5 py-1.5 text-[10.5px] leading-[1.35] lg:rounded-[16px] lg:px-3.5 lg:py-2.5 lg:text-[13px]">
            {ex.ask}
          </p>
        )}
        {step >= 2 && step <= 3 && (
          <div className="slp-pop max-w-[92%]">
            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#8a8578] lg:text-[10px]">Shorty</p>
            {step === 2 ? (
              <span className="mt-1.5 inline-flex gap-1" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8cd3ad]" style={{ animationDelay: `${i * 120}ms`, animationDuration: "900ms" }} />
                ))}
              </span>
            ) : (
              <p className="slp-pop mt-0.5 text-[10.5px] leading-[1.4] lg:mt-1 lg:text-[13.5px]">{ex.reply}</p>
            )}
          </div>
        )}
      </div>

      <div className="px-2 pb-1.5 lg:px-3 lg:pb-2">
        <div className="flex items-center gap-1.5 rounded-full border border-[#3a3833] bg-[#1f1e1b] p-1 lg:gap-2 lg:p-1.5">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[#3a3833] text-[11px] leading-none text-[#b9b3a6] lg:h-7 lg:w-7 lg:text-[15px]">+</span>
          <span className={`min-w-0 flex-1 truncate text-[10px] lg:text-[12.5px] ${step === 0 && typed ? "text-[#f1ece0]" : "text-[#7d786d]"}`}>
            {step === 0 && typed ? typed : "Ask Shorty"}
          </span>
          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full transition-colors lg:h-7 lg:w-7 ${step === 0 && typed ? "bg-[#f1ece0] text-[#141412]" : "bg-[#2e2d29] text-[#8a8578]"}`}>
            <svg viewBox="0 0 24 24" className="h-3 w-3 lg:h-3.5 lg:w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
          </span>
        </div>
        <p className="mt-1 hidden text-center text-[9.5px] text-[#7d786d] lg:block">Nothing goes live until you confirm it.</p>
      </div>

      <div className="flex justify-around border-t border-[#2a2925] px-1 pt-1.5 pb-2 lg:pt-2 lg:pb-3">
        {TABS.map((t, i) => (
          <span key={t.label} className={`flex flex-col items-center gap-0.5 text-[7.5px] font-semibold lg:text-[10px] ${i === 0 ? "text-[#8cd3ad]" : "text-[#8a8578]"}`}>
            <span className={`grid place-items-center rounded-full px-2 py-0.5 lg:px-3 lg:py-1 ${i === 0 ? "bg-[#23332b]" : ""}`}>
              <svg viewBox="0 0 24 24" className="h-3 w-3 lg:h-4 lg:w-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={t.d} /></svg>
            </span>
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ShortyHero() {
  const stage = useRef<HTMLDivElement | null>(null);
  const shorty = useRef<HTMLDivElement | null>(null);
  const phone = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<Phase>("hello");
  const [n, setN] = useState(0);
  const [step, setStep] = useState(0);
  const [chars, setChars] = useState(0);
  const reduce = useRef(false);

  /* Where Shorty ends up after the shove: about a quarter of the stage to the left. */
  const shoveBy = () => -(stage.current?.clientWidth ?? 400) * 0.25;

  useLayoutEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce.current) return;
    shorty.current?.style.setProperty("transform", `translateX(${shoveBy()}px)`);
    if (phone.current) phone.current.style.opacity = "1";
    setPhase("texts");
    setStep(3);
  }, []);

  /* The intro, beat by beat. */
  useEffect(() => {
    if (reduce.current) return;
    if (phase === "hello") {
      const id = window.setTimeout(() => setPhase("spot"), HELLO_MS);
      return () => clearTimeout(id);
    }
    if (phase === "spot") {
      const id = window.setTimeout(() => {
        const ph = phone.current, sh = shorty.current;
        if (!ph || !sh) return;
        const from = window.innerWidth - ph.getBoundingClientRect().left + 30;
        ph.style.opacity = "1";
        ph.animate([{ transform: `translateX(${from}px)` }, { transform: "translateX(-14px)", offset: 0.85 }, { transform: "translateX(0)" }],
          { duration: PHONE_MS, easing: "cubic-bezier(.2,.7,.3,1)", fill: "backwards" });
        const dx = shoveBy();
        sh.animate(
          [
            { transform: "translateX(0) rotate(0deg)" },
            { transform: `translateX(${dx * 0.75}px) rotate(-9deg)`, offset: 0.35 },
            { transform: `translateX(${dx * 1.06}px) rotate(4deg)`, offset: 0.7 },
            { transform: `translateX(${dx}px) rotate(0deg)` },
          ],
          { duration: SHOVE_MS, delay: PHONE_MS * 0.6, easing: "ease-out", fill: "forwards" },
        );
        setPhase("shove");
      }, SPOT_MS);
      return () => clearTimeout(id);
    }
    if (phase === "shove") {
      const id = window.setTimeout(() => setPhase("texts"), PHONE_MS * 0.6 + SHOVE_MS + 200);
      return () => clearTimeout(id);
    }
  }, [phase]);

  /* Then one text at a time. */
  useEffect(() => {
    if (phase !== "texts" || reduce.current) return;
    const id = window.setTimeout(() => {
      if (step < 4) setStep(step + 1);
      else { setStep(0); setChars(0); setN((k) => k + 1); }
    }, STEP_MS[step]);
    return () => clearTimeout(id);
  }, [phase, step]);

  /* The owner typing it out in the input bar. */
  const ex = EXCHANGES[n % EXCHANGES.length];
  useEffect(() => {
    if (phase !== "texts" || step !== 0 || reduce.current) return;
    const total = ex.ask.length, per = (STEP_MS[0] - 250) / total;
    const id = window.setInterval(() => setChars((c) => Math.min(total, c + 1)), per);
    return () => clearInterval(id);
  }, [phase, step, ex.ask.length]);

  let mood: MascotMood = "wait", task: MascotTask = "none";
  if (phase === "hello") mood = "hello";
  else if (phase === "spot" || phase === "shove") mood = "surprised";
  else if (!reduce.current) {
    if (step === 1) mood = "listening";
    else if (step === 2) { mood = ex.act.mood; task = ex.act.task ?? "none"; }
    else if (step === 3) mood = "done";
  }

  return (
    <section className="relative overflow-x-clip">
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes slp-pop{from{opacity:0;transform:translateY(6px) scale(.96)}to{opacity:1;transform:none}}
.slp-pop{animation:slp-pop .3s cubic-bezier(.2,.8,.3,1.15) both}
@media (prefers-reduced-motion: reduce){.slp-pop{animation:none}}`,
        }}
      />
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 px-4 pt-3 pb-10 [grid-template-areas:'stage''copy'] sm:px-8 lg:grid-cols-[minmax(0,1fr)_500px] lg:items-center lg:gap-x-12 lg:pt-10 lg:pb-24 lg:[grid-template-areas:'copy_stage']">
        {/* The stage: Shorty starts in the middle; the phone takes the right side. */}
        <div ref={stage} className="relative mx-auto h-[300px] w-full max-w-[400px] [grid-area:stage] lg:h-[560px] lg:max-w-none">
          <div
            ref={phone}
            data-phone
            className="absolute right-[3%] bottom-2 z-10 h-[290px] w-[168px] opacity-0 lg:right-0 lg:bottom-4 lg:h-[520px] lg:w-[260px]"
          >
            <Phone ex={ex} step={phase === "texts" ? step : 4} typed={ex.ask.slice(0, chars)} />
          </div>
          <div
            ref={shorty}
            className="absolute bottom-0 left-[calc(50%-var(--w)/2)] w-[var(--w)] origin-bottom [--w:215px] lg:[--w:330px]"
          >
            <ShortyMascot mood={mood} task={task} size={190} style={{ width: "100%", height: "auto" }} />
          </div>
        </div>

        <div className="mt-5 max-w-[480px] [grid-area:copy] lg:mt-0">
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
