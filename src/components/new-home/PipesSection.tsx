"use client";

/**
 * "Shorty Connects": a bold mint chapter below the hero on /new. A large Shorty holds a pipe;
 * Your Business is on one end, AI Agents on the other, arrows pointing at each other. Shorty is the
 * hero's own ShortyMascot (the `carry` pose, drawn once). The tags are cut-paper like the hero's bubbles.
 */
import { ShortyMascot } from "@/components/shorty/ShortyMascot";

/* Paper grain: the same noise the hero's bubbles and scenes use. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Which way the arrows point: "out" = at the two tags (the pipe leads to each), "in" = toward the pipe (each feeds it). */
const ARROWS: "out" | "in" = "out";

/** A chunky ink arrow. `dir` is the way it points. */
function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 48 28" aria-hidden="true"
      className={`h-[18px] w-[30px] shrink-0 drop-shadow-[2px_2px_0_rgba(20,22,26,.25)] min-[900px]:h-[34px] min-[900px]:w-[58px] ${dir === "left" ? "-scale-x-100" : ""}`}
    >
      <path d="M3 14 H38 M29 4 L42 14 L29 24" fill="none" stroke="#14161A" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A cut-paper tag: cream, ink outline, hard offset shadow, grain, a little tilt. */
function Tag({ children, tilt }: { children: React.ReactNode; tilt: number }) {
  return (
    <span
      className="relative inline-block rounded-[12px] border-2 border-[#14161A] bg-[#fbf6e6] px-2 py-1 text-center font-extrabold uppercase leading-[1.1] tracking-[0.08em] text-[#14161A] shadow-[3px_3px_0_#14161A] min-[900px]:rounded-[16px] min-[900px]:border-[3px] min-[900px]:px-5 min-[900px]:py-3 min-[900px]:text-[22px] min-[900px]:tracking-[0.1em] min-[900px]:shadow-[5px_5px_0_#14161A]"
      style={{ rotate: `${tilt}deg`, fontSize: "clamp(8.5px, 2.5vw, 22px)" }}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[.22] mix-blend-multiply" style={{ backgroundImage: GRAIN }} />
      <span className="relative">{children}</span>
    </span>
  );
}

export function PipesSection() {
  return (
    <section aria-labelledby="pipes-h" className="overflow-x-clip bg-[#5FDDAE] px-5 pt-14 pb-16 text-center text-[#0D2B20] min-[900px]:px-12 min-[900px]:pt-24 min-[900px]:pb-24">
      <div className="mx-auto max-w-[1180px]">
        <h2
          id="pipes-h"
          className="font-[family-name:var(--font-fraunces)] font-bold leading-[0.92] tracking-[-0.035em] text-[#0A2A1D]"
          style={{ fontSize: "clamp(54px, 11.5vw, 150px)" }}
        >
          Shorty Connects.
        </h2>

        {/* Shorty, large, holding the pipe. The pipe's two ends sit at 23% and 77% of his box, at 70% down. */}
        <div className="relative mx-auto mt-4 min-[900px]:mt-2" style={{ width: "clamp(228px, 62vw, 600px)" }}>
          <div aria-hidden="true" className="pointer-events-none absolute" style={{ left: "2%", top: "6%", width: "96%", height: "94%", background: "radial-gradient(ellipse closest-side at 50% 55%, rgba(251,246,230,.95), rgba(251,246,230,.6) 55%, rgba(251,246,230,0))" }} />
          <ShortyMascot mood="carry" still size={190} style={{ width: "100%", height: "auto", position: "relative" }} />

          <div className="absolute top-[69.8%] right-[81%] flex -translate-y-1/2 items-center gap-1 min-[900px]:gap-3">
            <Tag tilt={-3}>Your<br className="min-[900px]:hidden" /> Business</Tag>
            <Arrow dir={ARROWS === "out" ? "left" : "right"} />
          </div>
          <div className="absolute top-[69.8%] left-[81%] flex -translate-y-1/2 items-center gap-1 min-[900px]:gap-3">
            <Arrow dir={ARROWS === "out" ? "right" : "left"} />
            <Tag tilt={3}>AI<br className="min-[900px]:hidden" /> Agents</Tag>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-[780px] text-[19px] leading-[1.45] font-medium text-[#0D2B20] min-[900px]:mt-10 min-[900px]:text-[27px] min-[900px]:leading-[1.4]">
          Your website and socials can only be read by <strong className="font-extrabold">Dots</strong>, <strong className="font-extrabold">Muse</strong>, <strong className="font-extrabold">Grok</strong>, and <strong className="font-extrabold">Claude</strong>, but Shorty connects them to your business so they can <strong className="font-extrabold">transact</strong>, <strong className="font-extrabold">book</strong>, and more.
        </p>
      </div>
    </section>
  );
}
