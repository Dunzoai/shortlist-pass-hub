"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import type { MascotMood, MascotTask } from "@/lib/shorty/mascot/poses";
import { ShortlistMark } from "./SiteHeader";

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

/* The intro: he waves, spots something, the phone slides in and shoves him over. */
const HELLO_MS = 1300;
const SPOT_MS = 500;
const PHONE_MS = 420;
const SHOVE_MS = 650;
/* Per text: 0 quiet · 1 it arrives (he reads) · 2 he works · 3 done + reply */
const STEP_MS = [450, 1100, 1800, 2500];

type Phase = "hello" | "spot" | "shove" | "texts";
type Msg = { key: string; from: "owner" | "shorty"; who?: string; text: string };

/** The thread so far: every finished exchange, plus the one in progress. */
function threadFor(n: number, step: number): Msg[] {
  const msgs: Msg[] = [];
  for (let k = Math.max(0, n - 3); k <= n; k++) {
    const ex = EXCHANGES[k % EXCHANGES.length];
    const live = k === n;
    if (live && step < 1) break;
    msgs.push({ key: `a${k}`, from: "owner", who: ex.who, text: ex.ask });
    if (!live || step >= 3) msgs.push({ key: `r${k}`, from: "shorty", text: ex.reply });
  }
  return msgs;
}

function Phone({ msgs, typing }: { msgs: Msg[]; typing: boolean }) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[30px] border-[6px] border-[#1d1a16] bg-[#fffdf8] shadow-[0_30px_60px_-30px_rgba(29,26,22,.55)] lg:rounded-[38px] lg:border-[7px]">
      <div className="flex flex-col items-center gap-1 border-b border-[#efe9dc] bg-[#fbf7ee] pt-2.5 pb-2 lg:pt-4">
        <span className="mb-1 h-1.5 w-12 rounded-full bg-[#1d1a16]/85 lg:w-16" />
        <ShortlistMark className="h-6 w-6 lg:h-8 lg:w-8" />
        <span className="text-[10px] font-semibold text-[#1d1a16] lg:text-[11px]">Shorty</span>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-1.5 overflow-hidden px-2 pb-3 lg:gap-2 lg:px-3 lg:pb-4">
        {msgs.map((m) =>
          m.from === "owner" ? (
            <div key={m.key} className="slp-pop ml-auto max-w-[86%] text-right">
              <p className="mr-1 text-[8.5px] font-semibold uppercase tracking-[0.12em] text-[#8a8276] lg:text-[9.5px]">{m.who}</p>
              <p className="rounded-[14px] rounded-br-[4px] bg-[#1d1a16] px-2.5 py-1.5 text-left text-[11.5px] leading-[1.35] text-[#fbf6e6] lg:px-3 lg:py-2 lg:text-[13px]">{m.text}</p>
            </div>
          ) : (
            <p key={m.key} className="slp-pop mr-auto max-w-[86%] rounded-[14px] rounded-bl-[4px] bg-[#86d3a9] px-2.5 py-1.5 text-[11.5px] leading-[1.35] font-semibold text-[#12301f] lg:px-3 lg:py-2 lg:text-[13px]">
              {m.text}
            </p>
          ),
        )}
        {typing && (
          <span className="slp-pop mr-auto inline-flex gap-1 rounded-[14px] rounded-bl-[4px] bg-[#e3f3e9] px-3 py-2.5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#2f7a50]" style={{ animationDelay: `${i * 120}ms`, animationDuration: "900ms" }} />
            ))}
          </span>
        )}
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

  /* Then the texts keep coming. */
  useEffect(() => {
    if (phase !== "texts" || reduce.current) return;
    const id = window.setTimeout(() => {
      if (step < 3) setStep(step + 1);
      else { setStep(0); setN((k) => k + 1); }
    }, STEP_MS[step]);
    return () => clearTimeout(id);
  }, [phase, step]);

  const ex = EXCHANGES[n % EXCHANGES.length];
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
          __html: `@keyframes slp-pop{from{opacity:0;transform:translateY(8px) scale(.94)}to{opacity:1;transform:none}}
.slp-pop{animation:slp-pop .32s cubic-bezier(.2,.8,.3,1.2) both}
@media (prefers-reduced-motion: reduce){.slp-pop{animation:none}}`,
        }}
      />
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 px-4 pt-6 pb-16 [grid-template-areas:'stage''copy'] sm:px-8 lg:grid-cols-[minmax(0,1fr)_500px] lg:items-center lg:gap-x-12 lg:pt-10 lg:pb-24 lg:[grid-template-areas:'copy_stage']">
        {/* The stage: Shorty starts in the middle; the phone takes the right side. */}
        <div ref={stage} className="relative mx-auto h-[400px] w-full max-w-[420px] [grid-area:stage] lg:h-[560px] lg:max-w-none">
          <div
            ref={phone}
            data-phone
            className="absolute right-[2%] bottom-6 z-10 h-[340px] w-[176px] opacity-0 lg:right-0 lg:bottom-4 lg:h-[500px] lg:w-[250px]"
          >
            <Phone msgs={threadFor(n, phase === "texts" ? step : 0)} typing={phase === "texts" && step === 2} />
          </div>
          <div
            ref={shorty}
            className="absolute bottom-0 left-[calc(50%-var(--w)/2)] w-[var(--w)] origin-bottom [--w:230px] lg:[--w:330px]"
          >
            <ShortyMascot mood={mood} task={task} size={190} style={{ width: "100%", height: "auto" }} />
          </div>
        </div>

        <div className="mt-6 max-w-[480px] [grid-area:copy] lg:mt-0">
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
