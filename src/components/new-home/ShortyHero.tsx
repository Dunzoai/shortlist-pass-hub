"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import type { MascotMood } from "@/lib/shorty/mascot/poses";
import { APP_SIGNUP_URL } from "./SiteHeader";

/* After the walk-in: wave hello, then hang out (bob, foot tap, look around)
   with a wave every so often. */
const HELLO_MS = 2400;
const WAIT_MS = 9000;

type Phase = "offstage" | "walking" | "hello" | "wait";

export function ShortyHero() {
  const walker = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<Phase>("offstage");

  /* Shorty walks in from off the right edge of the screen to his spot. */
  useLayoutEffect(() => {
    const el = walker.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      setPhase("wait");
      return;
    }
    const rect = el.getBoundingClientRect();
    const distance = window.innerWidth - rect.left + 24;
    const ms = Math.min(2800, Math.max(1700, (distance / 360) * 1000));
    const id = window.setTimeout(() => {
      el.style.opacity = "1";
      setPhase("walking");
      el.animate(
        [{ transform: `translateX(${distance}px)` }, { transform: "translateX(0)" }],
        { duration: ms, easing: "cubic-bezier(.25,.5,.45,1)", fill: "backwards" },
      ).onfinish = () => setPhase("hello");
    }, 350);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (phase !== "hello" && phase !== "wait") return;
    const id = window.setTimeout(() => setPhase(phase === "hello" ? "wait" : "hello"), phase === "hello" ? HELLO_MS : WAIT_MS);
    return () => clearTimeout(id);
  }, [phase]);

  const mood: MascotMood = phase === "offstage" || phase === "walking" ? "walk" : phase;

  return (
    <section className="relative overflow-x-clip">
      <div className="mx-auto grid max-w-[1180px] grid-cols-[minmax(0,1fr)_130px] gap-x-3 px-4 pt-8 pb-16 [grid-template-areas:'head_shorty''copy_copy'] sm:grid-cols-[minmax(0,1fr)_190px] sm:px-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-x-10 lg:pt-20 lg:pb-24 lg:[grid-template-areas:'head_shorty''copy_shorty']">
        <div className="self-end [grid-area:head]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2f7a50] sm:text-[12px]">Your newest hire</p>
          <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-[clamp(52px,6.4vw,84px)] leading-[0.95] font-normal tracking-[-0.03em] text-[#1d1a16] lg:whitespace-nowrap">
            Meet Shorty.
          </h1>
        </div>

        <div className="mt-6 max-w-[460px] [grid-area:copy] lg:mt-7">
          <p className="text-[17px] leading-[1.6] text-[#3a352d] sm:text-[18px]">
            I&apos;m your coworker who never clocks out. I know everything you sell, I talk to your customers, I take their
            money for you, and I handle the busywork so you can focus on what you do best.
          </p>
          <p className="mt-4 text-[15px] font-semibold text-[#2f7a50]">Just text me what you need. You say yes, I get it done.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={APP_SIGNUP_URL}
              className="rounded-full bg-[#1d1a16] px-6 py-3.5 text-center text-[15px] font-semibold text-[#fbf6e6] transition-transform hover:-translate-y-px"
            >
              Hire Shorty for $50 a month
            </a>
            <a
              href={APP_SIGNUP_URL}
              className="rounded-full border border-[#1d1a16]/80 px-6 py-3.5 text-center text-[15px] font-semibold text-[#1d1a16] transition-colors hover:bg-[#1d1a16]/5"
            >
              Claim free
            </a>
          </div>
          <p className="mt-4 max-w-[380px] text-[13px] leading-[1.5] text-[#6d665b]">
            Nito&apos;s Empanadas has kept $3,383 that would have gone to delivery-app fees.
          </p>
        </div>

        {/* Shorty: beside the headline on phones, standing to the right of everything on desktop. */}
        <div className="self-end [grid-area:shorty] lg:self-center">
          <div
            ref={walker}
            data-walkin
            className="relative w-[var(--w)] ml-[calc(50%-var(--w)/2)] opacity-0 [--w:225px] sm:[--w:285px] lg:[--w:375px]"
          >
            <ShortyMascot mood={mood} size={190} style={{ width: "100%", height: "auto" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
