"use client";

/**
 * "Play to see Shorty in action": a hand-drawn teaser band between the hero and "AI agents are here".
 * Wide on desktop, a square on phones. Shorty (the hero's own mascot) strolls back and forth along a cut-paper street
 * while a play button pulses; tapping anywhere opens the vertical film in a modal with chapters you can jump to.
 * The film only loads when the modal opens. Cut paper like the rest of the page: flat shapes, hard offset shadow, grain, no SVG filters.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import { useAudience } from "./audience";
import { TornEdge, tearPolys } from "./TornEdge";
import { PaperCard } from "./PaperCard";
import { NewsBackdrop, NEWSPRINT } from "./Newsprint";

const INK = "#14161A";
const CREAM = "#FBF6E6";
const MINT = "#5FDDAE";
const SANS = "var(--font-sora), system-ui, sans-serif";
const SERIF = "var(--font-fraunces), Georgia, serif";
const GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/** Where the film lives. It's in /public for now; point this at a bucket URL to move it out of the repo. */
export const REEL_SRC = "/shorty-in-action.mp4";
export const REEL_POSTER = "/shorty-in-action-poster.jpg";

/** Start times (seconds) of each part of the film. */
const CHAPTERS = [
  { at: 0, label: "Meet Shorty" },
  { at: 8, label: "At work" },
  { at: 43, label: "Orders & payments" },
  { at: 57, label: "Email & texts" },
  { at: 68, label: "AI agents" },
  { at: 79, label: "Watch this" },
  { at: 99, label: "Does it all" },
] as const;

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/* ── The scene (SVG, 1200x520; phones crop the middle of it) ──────────────────
   Cut paper: every shape is a hand-cut polygon with a hard offset shadow and grain over it, no outlines.
   Slow, quiet life: clouds drift, a plane crosses now and then, a bird lands on a roof and flies off. */
const rnd = (seed: number) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
/** A rectangle whose corners and edges are a little off, like it was cut with scissors. */
function cut(x: number, y: number, w: number, h: number, seed: number, j = 2.4) {
  const r = rnd(seed), pts: [number, number][] = [];
  const side = (x0: number, y0: number, x1: number, y1: number) => {
    const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / 70));
    for (let i = 0; i < n; i++) pts.push([x0 + ((x1 - x0) * i) / n + (r() - 0.5) * j, y0 + ((y1 - y0) * i) / n + (r() - 0.5) * j]);
  };
  side(x, y, x + w, y); side(x + w, y, x + w, y + h); side(x + w, y + h, x, y + h); side(x, y + h, x, y);
  return "M" + pts.map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join(" L") + " Z";
}
const SHADOW = "rgba(60,40,20,.28)";
function Paper({ d, fill, seed, dx = 6, dy = 7 }: { d: string; fill: string; seed?: number; dx?: number; dy?: number }) {
  void seed;
  return (
    <g>
      <path d={d} fill={SHADOW} transform={`translate(${dx} ${dy})`} />
      <path d={d} fill={fill} />
      <path d={d} fill="url(#reelGrain)" opacity={0.2} style={{ mixBlendMode: "multiply" }} />
      <path d={d} fill="url(#reelWash)" />
    </g>
  );
}
function Building({ x, w, h, fill, cols, rows, seed, door, awning }: { x: number; w: number; h: number; fill: string; cols: number; rows: number; seed: number; door?: boolean; awning?: string }) {
  const y = 410 - h, gx = (w - 36) / cols, gy = Math.min(46, (h - 70) / rows);
  return (
    <g>
      <Paper d={cut(x, y, w, h, seed)} fill={fill} />
      {Array.from({ length: cols * rows }, (_, i) => {
        const wx = x + 18 + (i % cols) * gx + 4, wy = y + 24 + Math.floor(i / cols) * gy, ww = gx - 12, wh = gy - 14, lit = (i * 7 + seed) % 6 === 0;
        return <Paper key={i} d={cut(wx, wy, ww, wh, seed + i, 1.2)} fill={lit ? "#F2C45C" : "#FBF2DA"} dx={2} dy={2.5} />;
      })}
      {awning && <Paper d={`M${x + 10} 372 H${x + w - 10} l10 22 H${x} z`} fill={awning} dx={3} dy={4} />}
      {door && <Paper d={cut(x + w / 2 - 17, 364, 34, 46, seed + 99, 1.2)} fill="#8A5A3A" dx={3} dy={3} />}
    </g>
  );
}
function Tree({ x, s = 1 }: { x: number; s?: number }) {
  return (
    <g transform={`translate(${x} 412) scale(${s})`}>
      <Paper d="M-6 0 V-72 H6 V0 Z" fill="#9C6A42" dx={3} dy={3} />
      <Paper d="M-44 -90 Q-44 -140 0 -140 Q44 -140 44 -90 Q44 -60 0 -58 Q-44 -60 -44 -90 Z" fill="#7FB08E" dx={5} dy={6} />
      <Paper d="M-34 -70 Q-34 -100 -8 -102 Q18 -102 26 -80 Q22 -58 -6 -58 Q-30 -58 -34 -70 Z" fill="#9CC5A4" dx={0} dy={0} />
    </g>
  );
}
function Cloud({ y, s, className }: { y: number; s: number; className: string }) {
  return (
    <g className={`reel-anim ${className}`} style={{ transform: `translate(0px, ${y}px) scale(${s})` }}>
      <Paper d="M0 40 Q-6 14 22 14 Q30 -8 58 4 Q82 -10 98 14 Q128 12 126 40 Z" fill="#FFFAEC" dx={4} dy={5} />
    </g>
  );
}
/** The towed banner: a ribbon with a gentle ripple along both edges and a swallowtail end. */
const ripple = (x: number, y: number, ph: number) => y + 3.2 * Math.sin(x * 0.045 + ph);
const BANNER = (() => {
  const x0 = -112, x1 = -494, top = -16, bot = 20, pts: string[] = [];
  for (let x = x0; x >= x1; x -= 19) pts.push(`${x} ${ripple(x, top, 0).toFixed(1)}`);
  const notch = `${x1 + 20} ${(top + bot) / 2}`;
  const back: string[] = [];
  for (let x = x1; x <= x0; x += 19) back.push(`${x} ${ripple(x, bot, 0.8).toFixed(1)}`);
  return `M${pts.join(" L")} L${x1 - 2} ${top + 1} L${notch} L${x1 - 2} ${bot} L${back.join(" L")} L${x0} ${bot} Z`;
})();
const BANNER_STITCH = (() => {
  const pts: string[] = [];
  for (let x = -122; x >= -484; x -= 19) pts.push(`${x} ${ripple(x, -9.5, 0).toFixed(1)}`);
  for (let x = -484; x <= -122; x += 19) pts.push(`${x} ${ripple(x, 13.5, 0.8).toFixed(1)}`);
  return `M${pts.join(" L")} Z`;
})();
function Scene() {
  return (
    <svg viewBox="0 0 1200 520" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <pattern id="reelGrain" width="160" height="160" patternUnits="userSpaceOnUse"><image href={GRAIN_URL} width="160" height="160" /></pattern>
        <linearGradient id="reelWash" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".16" /><stop offset=".55" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#3a2410" stopOpacity=".14" /></linearGradient>
        <linearGradient id="reelSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#CFE6E1" /><stop offset=".55" stopColor="#F4E7B9" /><stop offset="1" stopColor="#F6D9A8" /></linearGradient>
      </defs>
      <rect width="1200" height="520" fill="url(#reelSky)" />
      <circle cx="930" cy="150" r="82" fill="#F2B84B" opacity={0.9} />
      <circle cx="930" cy="150" r="82" fill="url(#reelGrain)" opacity={0.2} style={{ mixBlendMode: "multiply" }} />
      <Cloud y={40} s={1.1} className="reel-cloud-a" />
      <Cloud y={110} s={0.8} className="reel-cloud-b" />
      <Cloud y={20} s={0.7} className="reel-cloud-c" />
      {/* the plane: a small cut-paper plane with a dotted trail, crossing every half minute */}
      <Building x={14} w={196} h={262} fill="#9DBFCE" cols={4} rows={4} seed={11} />
      <Building x={226} w={170} h={318} fill="#DDA07A" cols={3} rows={5} seed={23} door awning="#C8624A" />
      <Building x={414} w={206} h={226} fill="#9EC3A8" cols={4} rows={3} seed={37} door awning="#E2A43C" />
      <Building x={640} w={176} h={298} fill="#CC6E56" cols={3} rows={5} seed={51} />
      <Building x={834} w={206} h={246} fill="#BDAED0" cols={4} rows={3} seed={67} door awning="#8FB6C9" />
      <Building x={1058} w={150} h={306} fill="#F2DC96" cols={3} rows={5} seed={83} />
      <Tree x={408} s={0.85} />
      <Tree x={826} s={0.95} />
      <g className="reel-anim reel-plane" style={{ transform: "translate(-640px, 124px)" }}>
        {/* a little prop plane towing a banner, all cut paper: layered pieces, hard shadows, grain, a rippling ribbon */}
        <path d="M-60 2 L-112 -14 M-60 4 L-112 20" stroke="#6B5A48" strokeWidth={1.4} fill="none" />
        <g className="reel-banner">
          <Paper d={BANNER} fill="#FBF6E6" dx={4} dy={5} />
          <path d={BANNER} fill="none" stroke="#5FDDAE" strokeWidth={3.2} strokeLinejoin="round" />
          <path d={BANNER_STITCH} fill="none" stroke="#5FDDAE" strokeWidth={1.2} strokeDasharray="5 5" opacity={0.9} />
          <text x={-306} y={9.5} textAnchor="middle" fontSize={15.5} fontWeight={800} letterSpacing={0.5} fill="#14161A" style={{ fontFamily: SANS }}>THE CITY POWERED BY THE SHORTLIST</text>
        </g>
        <g transform="scale(1.1)">
          <Paper d="M-48 -4 L-64 -34 L-46 -34 L-32 -6 Z" fill="#C8624A" dx={2.5} dy={3} />
          <Paper d="M-56 4 L-74 16 L-50 16 Z" fill="#B5553F" dx={2} dy={2} />
          <Paper d="M-22 6 L-8 30 H14 L10 6 Z" fill="#F3E7C9" dx={2.5} dy={3} />
          <Paper d="M-62 0 Q-58 -13 -30 -15 H20 Q44 -15 52 0 Q44 13 20 13 H-30 Q-58 13 -62 0 Z" fill="#E8A94A" dx={3} dy={4} />
          <path d="M-34 -3 H44 Q46 0 44 3 H-34 Z" fill="#5FDDAE" opacity={0.95} />
          <Paper d="M8 -12 H28 Q34 -12 36 -6 V-3 H8 Z" fill="#CBE7EE" dx={1.5} dy={1.5} />
          <path d="M-16 -13 L-24 -36 M12 -13 L16 -36" stroke="#6B5A48" strokeWidth={1.6} />
          <Paper d="M-28 -36 H24 L18 -14 H-20 Z" fill="#F7EDD2" dx={2.5} dy={3} />
          <path d="M-20 -26 H16" stroke="#5FDDAE" strokeWidth={2.4} strokeLinecap="round" />
          <Paper d="M48 -9 H58 V9 H48 Z" fill="#4A4A48" dx={2} dy={2} />
          <circle cx="26" cy="17" r="5" fill="#3B3A38" />
          <path d="M26 13 V20" stroke="#6B5A48" strokeWidth={1.4} />
          <circle cx="60" cy="0" r="3" fill="#3B3A38" />
          <g className="reel-prop"><Paper d="M57 -19 Q62 0 57 19 Q55 0 57 -19 Z" fill="#7B6A58" dx={1.5} dy={1.5} /></g>
        </g>
      </g>
      {/* the bird: flies in, lands on the roof of the red building, looks about, flies off */}
      <g className="reel-anim reel-bird" style={{ transform: "translate(1320px, 20px)" }}>
        <g className="reel-bird-fly">
          <Paper d="M-10 0 Q-4 -6 4 -4 Q12 -4 15 2 Q8 8 -4 6 Z" fill="#3E5C76" dx={2} dy={3} />
          <g className="reel-wing"><Paper d="M-2 -3 L-14 -16 L6 -8 Z" fill="#587C9A" dx={1} dy={2} /></g>
        </g>
        <g className="reel-bird-sit">
          <g className="reel-bird-head">
            <Paper d="M-12 0 Q-10 -12 2 -12 Q12 -12 13 -2 Q16 0 20 1 Q14 4 10 6 Q-6 8 -12 0 Z" fill="#3E5C76" dx={2} dy={2.5} />
            <path d="M13 -2 L21 1 L13 3 Z" fill="#E2A43C" />
            <circle cx="7" cy="-5" r="1.6" fill="#14161A" />
          </g>
          <path d="M-12 2 L-24 7 L-12 8 Z" fill="#2F4A62" />
          <path d="M-2 8 V13 M4 8 V13" stroke="#14161A" strokeWidth={1.6} />
        </g>
      </g>
      {/* the street: a strip of grey paper, a pavement edge, and cut-paper dashes */}
      <Paper d={cut(-30, 410, 1260, 140, 5, 3)} fill="#9A9486" dx={0} dy={-4} />
      <Paper d={cut(-30, 410, 1260, 20, 6, 2)} fill="#C4BDAA" dx={0} dy={3} />
      {Array.from({ length: 12 }, (_, i) => <Paper key={i} d={cut(14 + i * 104, 478, 56, 9, 90 + i, 1.4)} fill="#F2DC96" dx={2} dy={2} />)}
      {/* a delivery cyclist far down the sidewalk (small, like he is in the distance) with a Shortlist Pass bag on the back rack */}
      <g className="reel-anim reel-bike" style={{ transform: "translate(-160px, 432px) scale(0.5)" }}>
        <ellipse cx="0" cy="2" rx="80" ry="5" fill={SHADOW} />
        {[-44, 44].map((cx) => (
          <g key={cx} transform={`translate(${cx} -28)`}>
            <circle r="28" fill="#3B3A38" />
            <circle r="22" fill="#E6DFC9" />
            <g className="reel-wheel"><path d="M-22 0 H22 M0 -22 V22 M-15 -15 L15 15 M15 -15 L-15 15" stroke="#3B3A38" strokeWidth={1.8} /></g>
            <circle r="4.5" fill="#3B3A38" />
          </g>
        ))}
        {/* frame, fork, handlebar, seat */}
        <path d="M-44 -28 L0 -28 L-10 -74 M0 -28 L30 -66 M-10 -74 L30 -66 M30 -66 L44 -28 M30 -66 L26 -86 M20 -87 H36" fill="none" stroke="#C8624A" strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
        <path d="M-20 -77 H-2" stroke="#14161A" strokeWidth={6} strokeLinecap="round" />
        {/* rear rack and the bag */}
        <path d="M-84 -64 H-30 M-74 -64 L-44 -28" stroke="#14161A" strokeWidth={3} strokeLinecap="round" />
        <Paper d={cut(-90, -136, 66, 72, 61, 1.5)} fill="#23292E" dx={3} dy={4} />
        <Paper d={cut(-90, -136, 66, 14, 62, 1)} fill="#34404A" dx={0} dy={2} />
        
        <image href="/shortlist-mint-mark.png" x={-80} y={-118} width={46} height={46} />
        {/* rider: far leg, torso, head and helmet, arm, near leg */}
        <path d="M-10 -78 L10 -58 L2 -32" fill="none" stroke="#25384B" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} className="reel-leg2" />
        <Paper d="M-22 -80 Q-24 -102 -6 -122 L16 -126 Q28 -120 22 -108 L8 -84 Z" fill="#F2B84B" dx={2} dy={3} />
        <circle cx="18" cy="-140" r="12" fill="#EBC9A0" />
        <path d="M5 -141 A13 13 0 0 1 31 -141 L31 -136 L5 -138 Z" fill="#5FDDAE" />
        <circle cx="25" cy="-138" r="1.6" fill="#14161A" />
        <path d="M10 -118 L34 -88" stroke="#F2B84B" strokeWidth={8} strokeLinecap="round" />
        <circle cx="35" cy="-87" r="4.5" fill="#FBF6E6" />
        <g className="reel-leg" style={{ transformOrigin: "-10px -78px" }}><path d="M-10 -78 L12 -56 L4 -30" fill="none" stroke="#2F4A62" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" /><path d="M0 -30 H12" stroke="#14161A" strokeWidth={5} strokeLinecap="round" /></g>
      </g>
    </svg>
  );
}

const TEAR = tearPolys(13, -12, 0.75, 56);

/* ── The teaser ───────────────────────────────────────────────────────────── */
export function ShortyReel() {
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement | null>(null);
  const close = useCallback(() => { setOpen(false); setTimeout(() => opener.current?.focus(), 0); }, []);
  const { audience } = useAudience();
  const hoa = audience === "hoa";   // the HOA view plays the animated HOA clip instead of the business film

  return (
    <>
    <section aria-label="Watch Shorty in action" className="relative px-4 pb-24 pt-32 sm:px-6 md:pb-28 md:pt-[290px]" style={{ background: NEWSPRINT }}>
      {/* the newspaper runs 56px past the section and its own bottom is torn (a pale core behind it, a soft shadow under it), so the texture goes right down to the rip */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -bottom-[56px] z-0" style={{ filter: "drop-shadow(0 3px 2.5px rgba(40,25,10,.3))" }}>
        <div className="absolute inset-0" style={{ clipPath: TEAR.core, background: "#FFFDF6" }} />
        <NewsBackdrop clip={TEAR.paper} />
      </div>
      <TornEdge fill="#f5eddc" angle={46} rough={1.5} seed={5} />
      <div className="relative z-[1] mx-auto max-w-[1120px]">
        <PaperCard seed={61} tilt={0} shadow="rgba(40,25,10,.42)" className="mx-auto">
          <div className="p-3 sm:p-5 md:p-6">
        <button
          ref={opener}
          type="button"
          onClick={() => setOpen(true)}
          aria-label={hoa ? "Play the clip: Shorty for your HOA" : "Play the film: Shorty in action"}
          className="group relative block aspect-square w-full cursor-pointer rounded-[28px] text-left md:aspect-[16/6.2]"
          style={{ boxShadow: "1px 2px 0 rgba(40,25,10,.35), 0 0 0 2px rgba(110,85,45,.22)", background: "#F4E7B9" }}
        >
          <span className="absolute inset-0 overflow-hidden rounded-[28px]">
          <Scene />
          {/* Shorty, standing easy in the middle with his coffee, taking it all in */}
          <span aria-hidden="true" className="absolute bottom-[4%] left-1/2 block h-[50%] w-[26%] -translate-x-1/2 md:bottom-[3%] md:h-[62%] md:w-[20%]">
            <span className="absolute inset-x-0 bottom-0 flex justify-center">
              <ShortyMascot mood="coffee" size={170} style={{ height: "100%", width: "auto" }} />
            </span>
          </span>
          </span>
          {/* the tease: a pulsing play button, with a cut-paper label. The label: under the button on desktop; on phones it sits tilted in the top-right corner, spilling past the card into the page */}
          <span className="absolute left-1/2 top-[27%] -translate-x-1/2 -translate-y-1/2">
            <span className="relative grid h-[84px] w-[84px] place-items-center md:h-[96px] md:w-[96px]">
              <span className="reel-pulse absolute inset-0 rounded-full" style={{ border: `4px solid ${MINT}` }} />
              <span className="reel-pulse reel-pulse-2 absolute inset-0 rounded-full" style={{ border: `4px solid ${MINT}` }} />
              <span className="relative grid h-full w-full place-items-center rounded-full transition-transform duration-150 group-hover:scale-105 group-active:scale-95" style={{ background: MINT, border: `3px solid ${INK}`, boxShadow: `4px 5px 0 ${INK}` }}>
                <svg viewBox="0 0 24 24" className="h-9 w-9 translate-x-[2px] md:h-11 md:w-11" fill={INK} stroke={INK} strokeWidth={1.5} strokeLinejoin="round"><path d="M7 4.5v15l13-7.5z" /></svg>
              </span>
            </span>
          </span>
          <span className="absolute -right-3 -top-3 z-10 max-w-[150px] rotate-[7deg] rounded-xl px-3 py-2 text-center text-[15px] md:left-1/2 md:right-auto md:top-[calc(27%+60px)] md:max-w-none md:-translate-x-1/2 md:rotate-0 md:px-4 font-bold leading-tight sm:text-[17px]" style={{ background: CREAM, border: `2.5px solid ${INK}`, boxShadow: `3px 4px 0 ${INK}`, fontFamily: SERIF, color: INK }}>
              {hoa ? "Play to see Shorty run your HOA" : "Play to see Shorty in action"}
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[.2] mix-blend-multiply" style={{ backgroundImage: `url("${GRAIN_URL}")` }} />
          </span>
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[28px] opacity-[.12] mix-blend-multiply" style={{ backgroundImage: `url("${GRAIN_URL}")` }} />
        </button>
          </div>
          {/* masking tape holding the print to the page */}
          <span aria-hidden="true" className="reel-tape absolute -top-3 left-[7%] z-10 h-[26px] w-[92px] sm:-top-4 sm:h-[32px] sm:w-[120px]" style={{ rotate: "-5deg" }} />
          <span aria-hidden="true" className="reel-tape absolute -top-3 right-[8%] z-10 h-[26px] w-[92px] sm:-top-4 sm:h-[32px] sm:w-[120px]" style={{ rotate: "4deg" }} />
        </PaperCard>
      </div>
      {open && (hoa ? <HoaClipModal onClose={close} /> : <ReelModal onClose={close} />)}
      <style>{`
        .reel-tape { background: linear-gradient(180deg, rgba(240,226,180,.88), rgba(228,210,160,.82)); box-shadow: 0 2px 3px rgba(40,25,10,.28); clip-path: polygon(0 8%, 4% 0, 8% 10%, 12% 0, 100% 0, 96% 25%, 100% 50%, 96% 75%, 100% 100%, 12% 100%, 8% 90%, 4% 100%, 0 92%, 4% 75%, 0 50%, 4% 25%) }
        @keyframes reelPulse { 0% { transform: scale(1); opacity: .9 } 100% { transform: scale(1.7); opacity: 0 } }
        .reel-pulse { animation: reelPulse 2.2s ease-out infinite }
        .reel-pulse-2 { animation-delay: 1.1s }
        @keyframes cloudDrift { from { transform: translate(-260px, var(--y)) scale(var(--s)) } to { transform: translate(1360px, var(--y)) scale(var(--s)) } }
        .reel-cloud-a { --y: 40px; --s: 1.1; animation: cloudDrift 110s linear infinite; animation-delay: -30s }
        .reel-cloud-b { --y: 110px; --s: .8; animation: cloudDrift 150s linear infinite; animation-delay: -95s }
        .reel-cloud-c { --y: 20px; --s: .7; animation: cloudDrift 130s linear infinite; animation-delay: -10s }
        @keyframes planeFly { 0%, 12% { transform: translate(-640px, 124px) } 100% { transform: translate(1420px, 108px) } }
        .reel-plane { animation: planeFly 34s linear infinite; animation-delay: -3.5s }
        @keyframes bannerWave { 0%, 100% { transform: skewY(-1.6deg) } 50% { transform: skewY(1.6deg) } }
        .reel-banner { transform-origin: -112px 2px; animation: bannerWave 2.2s ease-in-out infinite }
        @keyframes propSpin { 0%, 100% { transform: scaleY(1) } 50% { transform: scaleY(.15) } }
        .reel-prop { transform-origin: 59px 0; animation: propSpin .12s linear infinite }
        @keyframes bikeRide { 0%, 30% { transform: translate(-160px, 432px) scale(0.5) } 62%, 100% { transform: translate(1340px, 432px) scale(0.5) } }
        .reel-bike { animation: bikeRide 38s linear infinite; animation-delay: -4s }
        @keyframes wheelSpin { to { transform: rotate(360deg) } }
        .reel-wheel { animation: wheelSpin .7s linear infinite }
        @keyframes legPedal { 0%, 100% { transform: rotate(-24deg) } 50% { transform: rotate(24deg) } }
        .reel-leg { animation: legPedal .7s ease-in-out infinite }
        .reel-leg2 { transform-origin: -10px -78px; animation: legPedal .7s ease-in-out infinite reverse }
        @keyframes birdTrip {
          0%, 6% { transform: translate(1320px, 20px) }
          16% { transform: translate(980px, 60px) }
          22% { transform: translate(738px, 114px) }
          24%, 60% { transform: translate(738px, 114px) }
          62% { transform: translate(738px, 108px) }
          72% { transform: translate(300px, 20px) }
          76%, 100% { transform: translate(-200px, 0px) }
        }
        .reel-bird { animation: birdTrip 28s ease-in-out infinite }
        @keyframes birdShowFly { 0%, 21% { opacity: 1 } 22%, 61% { opacity: 0 } 62%, 100% { opacity: 1 } }
        @keyframes birdShowSit { 0%, 21% { opacity: 0 } 22%, 61% { opacity: 1 } 62%, 100% { opacity: 0 } }
        .reel-bird-fly { animation: birdShowFly 28s step-end infinite }
        .reel-bird-sit { animation: birdShowSit 28s step-end infinite }
        @keyframes wingFlap { 0%, 100% { transform: scaleY(1) } 50% { transform: scaleY(-.5) } }
        .reel-wing { transform-box: fill-box; transform-origin: 50% 100%; animation: wingFlap .28s ease-in-out infinite }
        @keyframes birdHead { 0%, 38%, 100% { transform: rotate(0deg) } 42% { transform: rotate(-9deg) } 48% { transform: rotate(7deg) } 54% { transform: rotate(0deg) } }
        .reel-bird-head { transform-box: fill-box; transform-origin: 50% 100%; animation: birdHead 28s ease-in-out infinite }
        @media (prefers-reduced-motion: reduce) { .reel-pulse { animation: none; opacity: 0 } .reel-anim, .reel-banner, .reel-prop, .reel-wheel, .reel-leg, .reel-leg2, .reel-wing, .reel-bird-head, .reel-bird-fly, .reel-bird-sit { animation: none } .reel-bird { opacity: 0 } }
      `}</style>
    </section>
    {/* dark room under the newspaper for its torn edge to hang over, so it never touches the "AI agents" headline below */}
    <div aria-hidden="true" className="h-14 bg-[#14161A] sm:h-16" />
    </>
  );
}

/* ── The modal ────────────────────────────────────────────────────────────── */
function ReelModal({ onClose }: { onClose: () => void }) {
  const vid = useRef<HTMLVideoElement | null>(null);
  const bar = useRef<HTMLDivElement | null>(null);
  const dialog = useRef<HTMLDivElement | null>(null);
  const [now, setNow] = useState(0);
  const [dur, setDur] = useState(0);
  const [playing, setPlaying] = useState(false);

  const toggle = () => { const v = vid.current; if (!v) return; if (v.paused) v.play().catch(() => {}); else v.pause(); };
  const seek = (s: number) => { const v = vid.current; if (v) v.currentTime = Math.max(0, Math.min(v.duration || s, s)); };

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " " && e.target === dialog.current) { e.preventDefault(); toggle(); }
      if (e.key === "ArrowRight") seek((vid.current?.currentTime ?? 0) + 5);
      if (e.key === "ArrowLeft") seek((vid.current?.currentTime ?? 0) - 5);
    };
    window.addEventListener("keydown", onKey);
    const v = vid.current;
    v?.play().catch(() => setPlaying(false));   // the click that opened this lets sound play; if a browser says no, the big play button shows
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; v?.pause(); };
  }, [onClose]);

  const scrub = (clientX: number) => {
    const r = bar.current?.getBoundingClientRect(); if (!r || !dur) return;
    seek(((clientX - r.left) / r.width) * dur);
  };
  const chapter = CHAPTERS.reduce((k, c, i) => (now >= c.at ? i : k), 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm sm:p-6" onClick={onClose}>
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Shorty in action"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative h-[100dvh] w-full overflow-hidden bg-black outline-none sm:h-[min(92dvh,900px)] sm:w-auto sm:rounded-3xl sm:border-[3px]"
        style={{ aspectRatio: "9 / 16", borderColor: INK, boxShadow: `0 0 0 3px ${MINT}` }}
      >
        <video
          ref={vid}
          src={REEL_SRC}
          poster={REEL_POSTER}
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-contain"
          onClick={toggle}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
          onTimeUpdate={(e) => setNow(e.currentTarget.currentTime)}
          onEnded={() => setPlaying(false)}
        />
        {!playing && (
          <button type="button" onClick={toggle} aria-label="Play" className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full" style={{ background: MINT, border: `3px solid ${INK}`, boxShadow: `4px 5px 0 ${INK}` }}>
            <svg viewBox="0 0 24 24" className="h-9 w-9 translate-x-[2px]" fill={INK} stroke={INK} strokeWidth={1.5} strokeLinejoin="round"><path d="M7 4.5v15l13-7.5z" /></svg>
          </button>
        )}
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full" style={{ background: CREAM, border: `2.5px solid ${INK}`, boxShadow: `2px 3px 0 ${INK}` }}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        {/* chapters + progress */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent px-3 pb-4 pt-12" style={{ fontFamily: SANS }}>
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Chapters">
            {CHAPTERS.map((c, i) => (
              <button
                key={c.label}
                type="button"
                role="tab"
                aria-selected={i === chapter}
                onClick={() => { seek(c.at); vid.current?.play().catch(() => {}); }}
                className="shrink-0 rounded-full px-3 py-1.5 text-[12px] font-bold"
                style={{ background: i === chapter ? MINT : CREAM, color: INK, border: `2px solid ${INK}`, opacity: i === chapter ? 1 : 0.85 }}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 text-[12px] font-semibold text-white">
            <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: CREAM, border: `2px solid ${INK}` }}>
              {playing
                ? <svg viewBox="0 0 24 24" className="h-4 w-4" fill={INK}><path d="M7 5h3.5v14H7zM13.500 5H17v14h-3.500z" /></svg>
                : <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px]" fill={INK}><path d="M7 4.500v15l13-7.500z" /></svg>}
            </button>
            <span className="w-9 shrink-0 tabular-nums">{fmt(now)}</span>
            <div
              ref={bar}
              role="slider"
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={Math.round(dur)}
              aria-valuenow={Math.round(now)}
              tabIndex={0}
              className="relative h-8 flex-1 cursor-pointer touch-none"
              onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); scrub(e.clientX); }}
              onPointerMove={(e) => { if (e.buttons) scrub(e.clientX); }}
            >
              <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/30" />
              <div className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full" style={{ width: dur ? `${(now / dur) * 100}%` : 0, background: MINT }} />
              {dur > 0 && CHAPTERS.slice(1).map((c) => <span key={c.at} className="absolute top-1/2 h-3 w-[3px] -translate-y-1/2 rounded bg-white" style={{ left: `${(c.at / dur) * 100}%` }} />)}
              {dur > 0 && <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: `${(now / dur) * 100}%`, background: MINT, border: `2px solid ${INK}` }} />}
            </div>
            <span className="w-9 shrink-0 text-right tabular-nums">{fmt(dur)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ── The HOA popup: the animated clip in an iframe, with chapter buttons and a bar that drive the clip's own clock ─────────────────────────── */
const HOA_CLIP_SRC = "/hoa/shorty-hoa-clip.html";
const HOA_AUDIO_SRC = "/hoa/hoa-clip-audio-v3.mp3";   // narration, music and effects, 175 s, one file
const HOA_TOTAL = 140000, HOA_SPEED = 1.25;   // the clip's own length (ms) and its playback slowdown
const HOA_CHAPTERS = [
  { at: 0, label: "Meet Shorty" },
  { at: 20000, label: "Sally's 11pm question" },
  { at: 58000, label: "Betty and bingo" },
  { at: 88000, label: "Shorty runs the office" },
  { at: 118000, label: "Every resident" },
] as const;
type ClipWin = Window & { __clock?: (f: () => number | undefined) => void; __seek?: (t: number) => void; __play?: () => void; __pause?: () => void; __resume?: () => void; __time?: () => number };

function HoaClipModal({ onClose }: { onClose: () => void }) {
  const frame = useRef<HTMLIFrameElement | null>(null);
  const bar = useRef<HTMLDivElement | null>(null);
  const dialog = useRef<HTMLDivElement | null>(null);
  const [now, setNow] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [h, setH] = useState(700);
  const [muted, setMuted] = useState(false);
  const [blocked, setBlocked] = useState(false);   // a browser refused autoplay: show a "Play with sound" button
  const [ready, setReady] = useState(false);       // the whole mp3 is buffered (canplaythrough)
  const audio = useRef<HTMLAudioElement | null>(null);   // the ONE audio element
  const master = useRef(false);                          // true once the audio is playing: from then on the AUDIO is the clock
  const win = () => (frame.current?.contentWindow ?? null) as ClipWin | null;

  /* The audio is the master clock. While it plays, the clip's time is audio.currentTime / 1.25, so a slow phone makes the pictures wait
     instead of seeking the sound (a seek chops words). Nothing ever sets audio.currentTime in a loop: only start, replay, chapter taps and scrubbing do. */
  const clock = () => { const a = audio.current; if (!a) return undefined; if (a.ended) return HOA_TOTAL; return master.current && !a.paused ? (a.currentTime * 1000) / HOA_SPEED : undefined; };
  const startBoth = () => {
    const a = audio.current, w = win(); if (!a) return;
    master.current = false; w?.__seek?.(0);                // hold the pictures at 0 until the sound is really playing
    a.pause(); a.currentTime = 0;
    a.play().then(() => { master.current = true; setBlocked(false); w?.__resume?.(); }).catch(() => { setBlocked(true); w?.__play?.(); });   // blocked: pictures play silent on their own timer
  };

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const aud = audio.current;
    if (aud) { aud.load(); if (aud.readyState >= 4) setReady(true); }
    const id = window.setInterval(() => { const t = win()?.__time?.(); if (typeof t === "number") setNow(t); }, 250);   // the display only; it never touches the audio
    const onVis = () => { const a = audio.current, w = win(); if (document.hidden) { a?.pause(); w?.__pause?.(); } else if (a && w && master.current && (w.__time?.() ?? 0) < HOA_TOTAL) { a.play().then(() => w.__resume?.()).catch(() => {}); } };
    document.addEventListener("visibilitychange", onVis);
    return () => { window.removeEventListener("keydown", onKey); document.removeEventListener("visibilitychange", onVis); window.clearInterval(id); document.body.style.overflow = prev; aud?.pause(); };
  }, [onClose]);

  const jump = (ms: number) => { const w = win(); if (!w?.__seek) return; w.__seek(ms); setNow(ms); if (audio.current) audio.current.currentTime = (ms * HOA_SPEED) / 1000; if (playing) w.__resume?.(); };
  const toggle = () => {
    const w = win(), a = audio.current; if (!w) return;
    if (playing) { w.__pause?.(); a?.pause(); setPlaying(false); return; }
    setPlaying(true);
    if ((w.__time?.() ?? 0) >= HOA_TOTAL - 1000) { startBoth(); return; }
    a?.play().then(() => { master.current = true; w.__resume?.(); }).catch(() => { setBlocked(true); w.__resume?.(); });
  };
  const scrub = (clientX: number) => { const r = bar.current?.getBoundingClientRect(); if (r) jump(Math.max(0, Math.min(HOA_TOTAL - 1, ((clientX - r.left) / r.width) * HOA_TOTAL))); };
  const chapter = HOA_CHAPTERS.reduce((k, c, i) => (now >= c.at ? i : k), 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6" onClick={onClose}>
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Shorty for your HOA"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[96dvh] w-full max-w-[880px] flex-col overflow-hidden rounded-3xl outline-none sm:border-[3px]"
        style={{ background: CREAM, borderColor: INK, boxShadow: `0 0 0 3px ${MINT}` }}
      >
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full" style={{ background: CREAM, border: `2.5px solid ${INK}`, boxShadow: `2px 3px 0 ${INK}` }}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        {/* the clip page is as tall as it needs to be; this area scrolls on short screens so the controls below stay put */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <iframe ref={frame} src={HOA_CLIP_SRC} title="Shorty, the digital board member for your HOA" className="block w-full border-0" style={{ height: h }}
            onLoad={() => {
              const w0 = win(), d = frame.current?.contentDocument; if (!w0 || !d) return;
              w0.__clock?.(clock);
              d.getElementById("replay")?.addEventListener("click", () => { startBoth(); setPlaying(true); });   // the clip's own Replay also rewinds the sound
              const fit = () => { const m = d.querySelector("main"); if (m) setH(Math.ceil(m.getBoundingClientRect().height + 40)); };
              fit(); w0.addEventListener("resize", fit);
              startBoth();
            }} />
        </div>
        <audio ref={audio} src={HOA_AUDIO_SRC} preload="auto" muted={muted} onCanPlayThrough={() => setReady(true)} onEnded={() => setPlaying(false)} />
        {/* chapters and progress, under the clip so they never cover it */}
        <div className="px-3 pb-4 pt-3" style={{ fontFamily: SANS, background: CREAM }}>
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Chapters">
            {HOA_CHAPTERS.map((c, i) => (
              <button key={c.label} type="button" role="tab" aria-selected={i === chapter} onClick={() => jump(c.at)} className="shrink-0 rounded-full px-3 py-1.5 text-[12px] font-bold" style={{ background: i === chapter ? MINT : "#EFE6CF", color: INK, border: `2px solid ${INK}` }}>{c.label}</button>
            ))}
          </div>
          <div className="flex items-center gap-3 text-[12px] font-semibold" style={{ color: INK }}>
            <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: MINT, border: `2px solid ${INK}` }}>
              {playing
                ? <svg viewBox="0 0 24 24" className="h-4 w-4" fill={INK}><path d="M7 5h3.5v14H7zM13.500 5H17v14h-3.500z" /></svg>
                : <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px]" fill={INK}><path d="M7 4.500v15l13-7.500z" /></svg>}
            </button>
            <span className="w-9 shrink-0 tabular-nums">{fmt((now * HOA_SPEED) / 1000)}</span>
            <div ref={bar} role="slider" aria-label="Seek" aria-valuemin={0} aria-valuemax={Math.round((HOA_TOTAL * HOA_SPEED) / 1000)} aria-valuenow={Math.round((now * HOA_SPEED) / 1000)} tabIndex={0} className="relative h-8 flex-1 cursor-pointer touch-none"
              onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); scrub(e.clientX); }}
              onPointerMove={(e) => { if (e.buttons) scrub(e.clientX); }}>
              <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full" style={{ background: "rgba(20,22,26,.18)" }} />
              <div className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full" style={{ width: `${(now / HOA_TOTAL) * 100}%`, background: MINT }} />
              {HOA_CHAPTERS.slice(1).map((c) => <span key={c.at} className="absolute top-1/2 h-3 w-[3px] -translate-y-1/2 rounded" style={{ left: `${(c.at / HOA_TOTAL) * 100}%`, background: INK }} />)}
              <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: `${(now / HOA_TOTAL) * 100}%`, background: MINT, border: `2px solid ${INK}` }} />
            </div>
            <span className="w-9 shrink-0 text-right tabular-nums">{fmt((HOA_TOTAL * HOA_SPEED) / 1000)}</span>
            <button type="button" onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"} aria-pressed={muted} className="grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: "#EFE6CF", border: `2px solid ${INK}` }}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.500z" fill={INK} />{muted ? <path d="M16 9.5l5 5M21 9.5l-5 5" /> : <path d="M15.500 9a4 4 0 0 1 0 6M18 6.500a8 8 0 0 1 0 11" />}</svg>
            </button>
          </div>
          {blocked && (
            <button type="button" disabled={!ready} onClick={() => { startBoth(); setPlaying(true); }} className="mt-3 w-full rounded-full px-4 py-2 text-[14px] font-extrabold disabled:opacity-60" style={{ background: MINT, color: INK, border: `2.5px solid ${INK}`, boxShadow: `2px 3px 0 ${INK}` }}>{ready ? "🔊 Play with sound" : "Loading sound…"}</button>
          )}
        </div>
      </div>
    </div>
  );
}
