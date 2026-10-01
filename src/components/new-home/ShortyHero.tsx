"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import type { MascotMood, MascotTask } from "@/lib/shorty/mascot/poses";
import { APP_SIGNUP_URL } from "./SiteHeader";

/* ── The demo: what the owner texts, and what Shorty did about it ─────────── */
type Tone = "green" | "amber" | "blue";
type Row = { icon: keyof typeof ICONS; tone: Tone; label: string; value: string; badge?: string; toggle?: boolean };
type Slide = { label: string; task: MascotTask; ask: string; reply: string; rows: Row[] };

const SLIDES: Slide[] = [
  {
    label: "Set up Friday",
    task: "event",
    ask: "Hey Shorty, schedule an event for this Friday at the brewery, 5 to 9. Add a new Meatball Parm Empanada to my standard menu at $6, and turn preorders on.",
    reply: "On it. Here's what I set up:",
    rows: [
      { icon: "calendar", tone: "green", label: "New event", value: "Friday · The Brewery · 5–9 PM" },
      { icon: "menu", tone: "amber", label: "Standard menu", badge: "New", value: "Meatball Parm Empanada · $6" },
      { icon: "cart", tone: "blue", label: "Preorders", value: "On for Friday", toggle: true },
    ],
  },
  {
    // PLACEHOLDER copy for slide 2 — swap before launch.
    label: "Text the regulars",
    task: "text",
    ask: "Text my regulars that we're at the brewery Friday and preorders are open.",
    reply: "Sent. Here's the rundown:",
    rows: [
      { icon: "message", tone: "green", label: "Text sent", value: "212 regulars · just now" },
      { icon: "link", tone: "amber", label: "Preorder link", value: "Included in the text" },
      { icon: "reply", tone: "blue", label: "Replies", value: "I'll answer them for you" },
    ],
  },
];

/* Demo steps: 0 empty · 1 the ask · 2 Shorty working · 3 done · 4 hold */
const STEP_MS = [450, 1500, 2300, 3200, 2800];

const ICONS = {
  calendar: <><rect x="4" y="5.5" width="16" height="14" rx="2.5" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /></>,
  menu: <path d="M6 7h12M6 12h12M6 17h8" />,
  cart: <><path d="M3.5 5h2.2l2 10h10l1.8-7H7" /><circle cx="9" cy="19" r="1.2" /><circle cx="16.5" cy="19" r="1.2" /></>,
  message: <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H11l-4 3.5V15h0.5A2.5 2.5 0 0 1 5 12.5z" />,
  link: <path d="M10 14a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1 1M14 10a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1-1" />,
  reply: <path d="M9.5 8 5 12l4.5 4M5.5 12H14a5 5 0 0 1 5 5v1" />,
};
const TONES: Record<Tone, string> = {
  green: "bg-[#e3f3e9] text-[#2f7a50]",
  amber: "bg-[#fbecc9] text-[#9a6a12]",
  blue: "bg-[#e4ebf7] text-[#3d5f93]",
};

/** Fades/slides a demo piece in when its step arrives. */
function Step({ on, delay = 0, className = "", children }: { on: boolean; delay?: number; className?: string; children: React.ReactNode }) {
  return (
    <div
      data-step
      className={`transition-[opacity,transform] duration-500 ease-out ${on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} ${className}`}
      style={{ transitionDelay: on ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

function TypingDots({ dark = false }: { dark?: boolean }) {
  return (
    <span className="inline-flex gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 animate-bounce rounded-full ${dark ? "bg-[#2f7a50]" : "bg-[#8cc3a1]"}`}
          style={{ animationDelay: `${i * 120}ms`, animationDuration: "900ms" }}
        />
      ))}
    </span>
  );
}

function SettingItUp({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border border-[#e4ddcc] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#1d1a16] shadow-sm ${className}`}>
      <TypingDots /> Setting it up
    </div>
  );
}

function Demo({ slide, step, index, total, onPick }: { slide: Slide; step: number; index: number; total: number; onPick: (i: number) => void }) {
  return (
    <div data-demo className="flex flex-col">
      <div className="min-h-[392px] sm:min-h-[372px]">
        <Step on={step >= 1} className="ml-auto max-w-[330px] rounded-[18px] bg-[#1d1a16] px-4 py-3.5 text-[#fbf6e6] shadow-[0_10px_30px_-12px_rgba(29,26,22,.5)] lg:-ml-7 lg:max-w-none">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#fbf6e6]/60">You, by text</p>
          <p className="mt-1 text-[14px] leading-[1.45] font-medium">{slide.ask}</p>
        </Step>

        {/* On phones Shorty stands up by the headline, so the "working" cue lives in the
            thread, in the same spot the reply then takes. */}
        <div className="mt-3 grid lg:mt-4">
          <Step on={step === 2} className="[grid-area:1/1] lg:hidden">
            <SettingItUp />
          </Step>
          <Step on={step >= 3} className="[grid-area:1/1]">
            <span className="inline-block rounded-full bg-[#86d3a9] px-3.5 py-2 text-[13px] font-semibold text-[#12301f]">{slide.reply}</span>
          </Step>
        </div>

        <Step on={step >= 3} delay={150} className="mt-3">
          <div className="rounded-[18px] border border-[#e9e3d4] bg-white px-3.5 py-1 shadow-[0_18px_40px_-20px_rgba(29,26,22,.35)]">
            {slide.rows.map((r, i) => (
              <Step key={r.label} on={step >= 3} delay={300 + i * 180}>
                <div className={`flex items-center gap-3 py-3 ${i ? "border-t border-[#efe9dc]" : ""}`}>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${TONES[r.tone]}`}>
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {ICONS[r.icon]}
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a7266]">
                      {r.label}
                      {r.badge && <span className="rounded bg-[#e8b84a] px-1.5 py-px text-[9px] tracking-[0.08em] text-[#3d2a05]">{r.badge}</span>}
                    </p>
                    <p className="truncate text-[14px] font-semibold text-[#1d1a16]">{r.value}</p>
                  </div>
                  {r.toggle && (
                    <span className={`relative h-6 w-10 shrink-0 rounded-full transition-colors delay-700 duration-300 ${step >= 3 ? "bg-[#3f9a68]" : "bg-[#dcd6c8]"}`}>
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-[left] delay-700 duration-300 ${step >= 3 ? "left-[18px]" : "left-0.5"}`} />
                    </span>
                  )}
                </div>
              </Step>
            ))}
          </div>
        </Step>
      </div>

      <div className="mt-2 flex items-center gap-2 text-[12px] text-[#6d665b]">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPick(i)}
            aria-label={`Show example ${i + 1}`}
            className={`h-2 w-2 rounded-full transition-colors ${i === index ? "bg-[#1d1a16]" : "bg-[#d8d1c2]"}`}
          />
        ))}
        <span className="ml-1">{index + 1} of {total} · {slide.label}</span>
      </div>
    </div>
  );
}

/* ── The hero ─────────────────────────────────────────────────────────────── */
type Arrival = "offstage" | "walking" | "waving" | "here";

export function ShortyHero() {
  const walker = useRef<HTMLDivElement | null>(null);
  const demoRef = useRef<HTMLDivElement | null>(null);
  const [arrival, setArrival] = useState<Arrival>("offstage");
  const [demoVisible, setDemoVisible] = useState(false);
  const [slide, setSlide] = useState(0);
  const [step, setStep] = useState(0);
  const reduce = useRef(false);

  /* Shorty walks in from off the right edge of the screen to his spot. */
  useLayoutEffect(() => {
    const el = walker.current;
    if (!el) return;
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce.current) {
      el.style.opacity = "1";
      setArrival("here");
      setStep(4);
      return;
    }
    const rect = el.getBoundingClientRect();
    const distance = window.innerWidth - rect.left + 24;
    const ms = Math.min(2800, Math.max(1700, (distance / 360) * 1000));
    const timers: number[] = [];
    timers.push(window.setTimeout(() => {
      el.style.opacity = "1";
      setArrival("walking");
      const anim = el.animate(
        [{ transform: `translateX(${distance}px)` }, { transform: "translateX(0)" }],
        { duration: ms, easing: "cubic-bezier(.25,.5,.45,1)", fill: "backwards" },
      );
      anim.onfinish = () => {
        setArrival("waving");
        timers.push(window.setTimeout(() => setArrival("here"), 2200));
      };
    }, 350));
    return () => timers.forEach(clearTimeout);
  }, []);

  /* The demo plays once it's on screen (it's below the fold on phones). */
  useEffect(() => {
    const el = demoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setDemoVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (arrival !== "here" || !demoVisible) return;
    if (reduce.current) return;
    const id = window.setTimeout(() => {
      if (step < 4) setStep(step + 1);
      else { setStep(0); setSlide((s) => (s + 1) % SLIDES.length); }
    }, STEP_MS[step]);
    return () => clearTimeout(id);
  }, [arrival, demoVisible, step]);

  const current = SLIDES[slide];
  const mood: MascotMood =
    arrival === "offstage" || arrival === "walking" ? "walk"
    : arrival === "waving" ? "hello"
    : !demoVisible ? "idle"
    : step === 1 ? "listening"
    : step === 2 ? "working"
    : step === 3 ? "done"
    : "idle";
  const task: MascotTask = mood === "working" ? current.task : "none";

  return (
    <section className="relative overflow-x-clip">
      <div className="mx-auto grid max-w-[1120px] grid-cols-[minmax(0,1fr)_120px] gap-x-3 px-4 pt-8 pb-16 [grid-template-areas:'head_shorty''copy_copy''demo_demo'] sm:grid-cols-[minmax(0,1fr)_170px] sm:px-8 lg:grid-cols-[minmax(0,1fr)_200px_330px] lg:gap-x-6 lg:pt-20 lg:pb-24 lg:[grid-template-areas:'head_shorty_demo''copy_shorty_demo']">
        <div className="self-end [grid-area:head]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2f7a50] sm:text-[12px]">Your newest hire</p>
          <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-[clamp(52px,7.4vw,92px)] leading-[0.95] font-normal tracking-[-0.03em] text-[#1d1a16]">
            Meet Shorty.
          </h1>
        </div>

        <div className="mt-6 max-w-[440px] [grid-area:copy] lg:mt-7">
          <p className="text-[17px] leading-[1.6] text-[#3a352d] sm:text-[18px]">
            I&apos;m your coworker who never clocks out. I know everything you sell, I talk to your customers, I take their
            money for you, and I handle the busywork so you can focus on what you do best.
          </p>
          <p className="mt-4 text-[15px] font-semibold text-[#2f7a50]">Just text me what you need. You say yes, I get it done.</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={APP_SIGNUP_URL}
              className="rounded-full bg-[#1d1a16] px-6 py-3.5 text-[15px] font-semibold text-[#fbf6e6] transition-transform hover:-translate-y-px"
            >
              Hire Shorty for $50 a month
            </a>
            <a
              href={APP_SIGNUP_URL}
              className="rounded-full border border-[#1d1a16]/80 px-6 py-3.5 text-[15px] font-semibold text-[#1d1a16] transition-colors hover:bg-[#1d1a16]/5"
            >
              Claim free
            </a>
          </div>
          <p className="mt-4 max-w-[380px] text-[13px] leading-[1.5] text-[#6d665b]">
            Nito&apos;s Empanadas has kept $3,383 that would have gone to delivery-app fees.
          </p>
        </div>

        {/* Shorty. On phones he stands beside the headline; on desktop, between the copy and the thread. */}
        <div className="relative self-end [grid-area:shorty] lg:self-center lg:pt-24">
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[55%] h-[130%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(140,195,161,.28),rgba(140,195,161,0))]" />
          <div className={`absolute -top-1 left-1/2 hidden -translate-x-[70%] transition-[opacity,transform] duration-300 lg:block ${mood === "working" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
            <SettingItUp />
          </div>
          <div ref={walker} data-walkin className="relative w-[var(--w)] ml-[calc(50%-var(--w)/2)] opacity-0 [--w:150px] sm:[--w:190px] lg:[--w:250px]">
            <ShortyMascot mood={mood} task={task} size={190} style={{ width: "100%", height: "auto" }} />
          </div>
        </div>

        <div ref={demoRef} className="mt-12 [grid-area:demo] lg:mt-0">
          <Demo slide={current} step={step} index={slide} total={SLIDES.length} onPick={(i) => { setSlide(i); setStep(reduce.current ? 4 : 1); }} />
        </div>
      </div>
    </section>
  );
}
