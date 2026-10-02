"use client";

/**
 * The "pipes" chapter, below the hero on /new.
 *
 * THE STORY (plays once when it scrolls into view, then stays live forever):
 *  1. search : the AI assistants are already plugged into a pipe that stops short of the shop.
 *              Requests run down it, hit the dead end, and bounce back ("Can't connect. Searching
 *              for a new business…"). The shop sign says Website; the red note says it can be read
 *              but not used.
 *  2. lay    : Shorty walks in and connects the two missing pipes.
 *  3. live   : sign turns mint ("Your Business on the Shortlist"), window and door light up, the
 *              agents light up, "Now you're connected!", and requests flow into the building forever.
 *
 * One scene component, two geometries (DESKTOP / MOBILE). A single JS clock (T seconds since the
 * scene scrolled into view) decides the phase, Shorty's pose and the request tickets; everything
 * else is CSS transitions keyed to `data-phase`. Layers, back to front: backdrop + shop + signs ·
 * Shorty (the hero's own ShortyMascot) · pipes + agents · request tickets.
 */
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type RefObject } from "react";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import type { MascotMood } from "@/lib/shorty/mascot/poses";

/* ── Palette: the brief's, plus the red Marc asked for and neutrals from the background ── */
const C = {
  bg: "#14161A", cream: "#F6F1E4", band: "#E8E1CD", mint: "#34D399", lmint: "#5FDDAE", pale: "#D7F5E8",
  amber: "#E2A43C", warm: "#F6B94A", warmHi: "#FFE3A8", red: "#E8695D",
  dimFill: "#2A2E36", dimStroke: "#3A3F49", dimText: "#8D8A80",
  litFill: "#1E2B27", dark: "#1F9E73", hi: "#9DF0CC", door: "#3A3F49", solidText: "#0D2B20",
  roof: "#0B0C0E", ground: "#1A1D22", disc: "#181B21", cloud: "#1B1E24",
};
/* Paper grain: the same noise the hero's bubbles and scenes use. */
const GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";
const INK = "#2A2219";
const SANS = "var(--font-sans-inter), system-ui, sans-serif";
const SERIF = "var(--font-fraunces), Georgia, serif";

/* ── The two geometries ──────────────────────────────────────────────────── */
type SignLine = { t: string; y: number; size: number; serif?: boolean };
type Geo = {
  W: number; H: number; ground: number;
  shop: { x0: number; x1: number; roofY: number; awn: number; flaps: number; board: number; post: number; win: [number, number, number, number]; door: [number, number, number]; band: number };
  sign: { old: SignLine[]; neu: SignLine[]; squiggleY: number };
  pipeY: number; riserX: number; endX: number; pw: number; joint: [number, number]; flange: [number, number];
  bub: { x: number; w: number; h: number; r: number; tail: number; ys: number[]; name: number; cap: number; pad: number; badge: [number, number, number] };
  note: { x: number; y: number; lh: number; size: number; lines: string[]; good: string; goodSize: number };
  caption: { x: number; ys: number[]; size: number; lines: string[]; fail: { ys: number[]; lines: string[] } };
  stub: { w: number; h: number; font: number };
  shorty: { boxW: number; dx: number; hop: [string, string] };
  speed: number; walk: number;
  stars: Array<[number, number]>; clouds: Array<[number, number, number, number]>; moon: [number, number, number];
};

const DESKTOP: Geo = {
  W: 1200, H: 596, ground: 506,
  shop: { x0: 40, x1: 330, roofY: 262, awn: 58, flaps: 4, board: 82, post: 31, win: [29, 91, 112, 85], door: [243, 60, 108], band: 93 },
  sign: {
    old: [{ t: "Website", y: 0.5, size: 30, serif: true }, { t: "Instagram · Facebook", y: 0.74, size: 13 }],
    neu: [{ t: "Your Business", y: 0.5, size: 30, serif: true }, { t: "on the Shortlist", y: 0.76, size: 14 }],
    squiggleY: 0.59,
  },
  pipeY: 478, riserX: 900, endX: 706, pw: 22, joint: [17, 10], flange: [10, 36],
  bub: { x: 962, w: 218, h: 64, r: 22, tail: 12, ys: [120, 210, 300, 390], name: 25, cap: 11.5, pad: 26, badge: [84, 20, 10.5] },
  note: { x: 42, y: 90, lh: 25, size: 21, lines: ["Your business can be read", "but not used by agents."], good: "Now you’re connected!", goodSize: 27 },
  caption: { x: 615, ys: [550, 580], size: 22, lines: ["Can see what you sell. Can build the order.", "Can send them to your checkout."], fail: { ys: [566], lines: ["Can’t connect. Searching for a new business…"] } },
  stub: { w: 176, h: 34, font: 13.5 },
  shorty: { boxW: 205, dx: 30, hop: ["-26px", "-11px"] },
  speed: 200, walk: 4.4,
  stars: [[517, 45], [794, 33], [661, 177], [445, 200], [250, 40]],
  clouds: [[630, 118, 130, 30], [760, 150, 100, 22]],
  moon: [990, 236, 214],
};

const MOBILE: Geo = {
  W: 360, H: 560, ground: 500,
  shop: { x0: 8, x1: 112, roofY: 318, awn: 34, flaps: 3, board: 66, post: 18, win: [8, 52, 40, 44], door: [78, 26, 62], band: 56 },
  sign: {
    old: [{ t: "Website", y: 0.42, size: 17, serif: true }, { t: "Instagram ·", y: 0.63, size: 8 }, { t: "Facebook", y: 0.79, size: 8 }],
    neu: [{ t: "Your", y: 0.27, size: 15, serif: true }, { t: "Business", y: 0.55, size: 15, serif: true }, { t: "on the Shortlist", y: 0.84, size: 8 }],
    squiggleY: 0.5,
  },
  pipeY: 476, riserX: 244, endX: 192, pw: 14, joint: [11, 6.5], flange: [7, 24],
  bub: { x: 256, w: 98, h: 52, r: 18, tail: 8, ys: [70, 148, 226, 304], name: 15, cap: 9, pad: 12, badge: [58, 15, 7.5] },
  note: { x: 8, y: 178, lh: 15, size: 12, lines: ["Your business can be read", "but not used by agents."], good: "Now you’re connected!", goodSize: 15 },
  caption: { x: 180, ys: [522, 538, 554], size: 12.5, lines: ["Sees what you sell.", "Builds the order.", "Sends them to checkout."], fail: { ys: [524, 540], lines: ["Can’t connect.", "Searching for a new business…"] } },
  stub: { w: 96, h: 24, font: 8.5 },
  shorty: { boxW: 120, dx: 19, hop: ["-16px", "-7px"] },
  speed: 120, walk: 2.4,
  stars: [[170, 40], [60, 120], [210, 250], [40, 230]],
  clouds: [[150, 90, 70, 16]],
  moon: [300, 220, 150],
};

const BUBBLES = [
  { name: "Dots", cap: "OPENAI", ask: "dinner · 7pm" },
  { name: "Muse", cap: "META", ask: "pizza · pickup 5pm" },
  { name: "Grok", cap: "XAI", ask: "haircut · Friday" },
  { name: "Claude", cap: "ANTHROPIC", ask: "plumber · Saturday" },
];

/* ── The timeline (seconds since the scene scrolled into view) ───────────── */
const SEARCH_END = 9.0;            // Shorty walks in
const FIRST_FAIL = 2.8;            // the first request reaches the dead end → "Can't connect"
const BOUNCES = [{ b: 3, t0: 1.0 }, { b: 1, t0: 3.8 }, { b: 2, t0: 6.6 }];   // requests that bounce, before it's connected
const ORDER = [3, 1, 2, 0];        // which agent sends the next request, once connected
const GAP = 2.6;                   // seconds between requests, forever
const SHAKE = 0.55;

const liveAt = (g: Geo) => SEARCH_END + 0.6 + g.walk + 0.4;

function moodAt(T: number, g: Geo): MascotMood {
  const u = T - SEARCH_END;
  if (u < 0.6) return "wait";
  if (u < 0.6 + g.walk) return "walkR";
  if (u < 3.0 + g.walk) return "hello";
  const k = Math.floor((u - (3.0 + g.walk)) / 6) % 4;
  return (["wait", "content", "wait", "pleased"] as const)[k];
}

/** One stylesheet. Everything that isn't a request ticket or Shorty's pose is a CSS transition keyed to data-phase. */
const CSS = `
@property --amp{syntax:'<number>';inherits:true;initial-value:0}
@keyframes pp-amp{0%{--amp:0}6%,94%{--amp:1}100%{--amp:0}}
@keyframes pp-bob{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(calc(var(--amp) * -9px)) rotate(calc(var(--amp) * 2.4deg))}}
@keyframes pp-hop{0%,100%{transform:translateY(0)}30%{transform:translateY(var(--hop1))}55%{transform:translateY(0)}75%{transform:translateY(var(--hop2))}}
@keyframes pp-pop{0%{transform:scale(0)}60%{transform:scale(1.25)}100%{transform:scale(1)}}
@keyframes pp-tw{0%,100%{opacity:.3}50%{opacity:.85}}
@keyframes pp-fl{from{transform:translateY(-3px)}to{transform:translateY(3px)}}
/* Idle loops (stars, floating bubbles): desktop only, and only while the scene is on screen. Phones skip them. */
@media (min-width: 900px){
.pp[data-inview] .pp-star{animation:pp-tw 3.4s ease-in-out infinite}.pp[data-inview] .pp-star:nth-child(2n){animation-duration:4.6s;animation-delay:-1.2s}
.pp[data-inview] .pp-float0{animation:pp-fl 5.4s ease-in-out 0s infinite alternate}.pp[data-inview] .pp-float1{animation:pp-fl 6.6s ease-in-out -2s infinite alternate}
.pp[data-inview] .pp-float2{animation:pp-fl 7.8s ease-in-out -4s infinite alternate}.pp[data-inview] .pp-float3{animation:pp-fl 6s ease-in-out -1s infinite alternate}
}
/* Shorty: out of sight until it's his turn, then he walks the gap at the same pace the pipe grows */
.pp-sh{opacity:0;transform:translateX(0)}
.pp[data-phase=lay] .pp-sh,.pp[data-phase=live] .pp-sh{opacity:1;transform:translateX(var(--wx));transition:opacity .6s ease,transform var(--wk) linear .6s}
.pp[data-phase=lay] .pp-sh{animation:pp-amp var(--wk) linear .6s both}
.pp[data-phase=lay] .pp-bob{animation:pp-bob .59s ease-in-out infinite}
.pp[data-phase=live] .pp-hop{animation:pp-hop 1.3s ease-in-out .15s 1 both}
/* the two missing pipes, laid one after the other, with a coupling at each joint */
.pp-g1,.pp-g2{stroke-dashoffset:1}
.pp[data-phase=lay] .pp-g1,.pp[data-phase=live] .pp-g1{stroke-dashoffset:0;transition:stroke-dashoffset calc(var(--wk) / 2) linear .6s}
.pp[data-phase=lay] .pp-g2,.pp[data-phase=live] .pp-g2{stroke-dashoffset:0;transition:stroke-dashoffset calc(var(--wk) / 2) linear calc(.6s + var(--wk) / 2)}
.pp-pop{transform-box:fill-box;transform-origin:center;transform:scale(0)}
.pp[data-phase=lay] .pp-pa,.pp[data-phase=live] .pp-pa{animation:pp-pop .4s ease-out .6s both}
.pp[data-phase=lay] .pp-pb,.pp[data-phase=live] .pp-pb{animation:pp-pop .4s ease-out calc(.6s + var(--wk) / 2) both}
.pp[data-phase=lay] .pp-pc,.pp[data-phase=live] .pp-pc{animation:pp-pop .45s ease-out calc(.6s + var(--wk)) both}
/* the moment it connects */
.pp-sign-old{opacity:1;transition:opacity .35s ease}
.pp[data-phase=live] .pp-sign-old{opacity:0}
.pp-sign-new{opacity:0;transform-box:fill-box;transform-origin:center;transform:scale(.9);transition:opacity .4s ease .15s,transform .55s cubic-bezier(.2,1.35,.4,1) .15s}
.pp[data-phase=live] .pp-sign-new{opacity:1;transform:scale(1)}
.pp-note-bad{opacity:1;transition:opacity .3s ease}
.pp[data-phase=live] .pp-note-bad{opacity:0}
.pp-note-good{opacity:0;transition:opacity .45s ease .4s}
.pp[data-phase=live] .pp-note-good{opacity:1}
.pp-lit{opacity:0;transition:opacity .8s ease}
.pp[data-phase=live] .pp-lit-w{opacity:1;transition-delay:.3s}
.pp[data-phase=live] .pp-lit-d{opacity:1;transition-delay:.55s}
.pp-door-fill{fill:${C.warm};transition:fill .2s ease}
.pp[data-hit] .pp-door-fill{fill:${C.warmHi}}
.pp-b{fill:${C.dimFill};stroke:${C.dimStroke};transition:fill .5s ease,stroke .5s ease}
.pp-t{fill:${C.dimText};transition:fill .5s ease}
.pp[data-phase=live] .pp-b0,.pp[data-phase=live] .pp-b1,.pp[data-phase=live] .pp-b2{fill:${C.litFill};stroke:${C.mint}}
.pp[data-phase=live] .pp-b3{fill:${C.mint};stroke:${C.mint}}
.pp[data-phase=live] .pp-t0,.pp[data-phase=live] .pp-t1,.pp[data-phase=live] .pp-t2{fill:${C.pale}}
.pp[data-phase=live] .pp-t3{fill:${C.solidText}}
.pp[data-phase=live] .pp-b0,.pp[data-phase=live] .pp-t0{transition-delay:.4s}
.pp[data-phase=live] .pp-b1,.pp[data-phase=live] .pp-t1{transition-delay:.8s}
.pp[data-phase=live] .pp-b2,.pp[data-phase=live] .pp-t2{transition-delay:1.2s}
.pp[data-phase=live] .pp-b3,.pp[data-phase=live] .pp-t3{transition-delay:1.6s}
.pp-badge{opacity:0;transition:opacity .4s ease 2.1s}
.pp[data-phase=live] .pp-badge{opacity:1}
.pp-cap-fail{opacity:0;transition:opacity .5s ease}
.pp[data-fail] .pp-cap-fail{opacity:1}
.pp[data-phase=live] .pp-cap-fail{opacity:0;transition-duration:.3s}
.pp-cap-ok{opacity:0;transition:opacity .6s ease 1.2s}
.pp[data-phase=live] .pp-cap-ok{opacity:1}
@media (prefers-reduced-motion: reduce){.pp *{transition:none !important;animation:none !important}.pp-tix{display:none}}
`;

/* ── Media queries as external stores (desktop geometry from 900px up) ───── */
const mq = (q: string) => ({
  subscribe: (cb: () => void) => { const m = window.matchMedia(q); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); },
  get: () => window.matchMedia(q).matches,
});
const DESK = mq("(min-width: 900px)");
const REDUCED = mq("(prefers-reduced-motion: reduce)");

/* ── Request tickets: where each one is at time T ────────────────────────── */
type Dims = { a: number; v: number; Lb: number; Ld: number; out: number; back: number; dur: number };
function dimsFor(g: Geo, b: number): Dims {
  const a = g.bub.x + 14 - g.riserX, v = g.pipeY - g.bub.ys[b];
  const door = g.shop.door[0] + g.shop.door[1] / 2;
  const Lb = a + v + Math.max(0, g.riserX - (g.endX + g.stub.w / 2));   // stops with its leading edge at the dead end
  const Ld = a + v + (g.riserX - door);
  const out = Lb / g.speed;
  return { a, v, Lb, Ld, out, back: out * 1.05, dur: Ld / g.speed };
}
function posAt(g: Geo, b: number, d: Dims, s: number): [number, number] {
  const y0 = g.bub.ys[b], bx = g.bub.x + 14;
  if (s <= d.a) return [bx - s, y0];
  if (s <= d.a + d.v) return [g.riserX, y0 + (s - d.a)];
  return [g.riserX - (s - d.a - d.v), g.pipeY];
}
type Trip = { kind: "bounce" | "deliver"; u: number };
function tripFor(g: Geo, b: number, d: Dims, T: number): Trip | null {
  for (const x of BOUNCES) if (x.b === b && T >= x.t0 && T < x.t0 + d.out + SHAKE + d.back) return { kind: "bounce", u: T - x.t0 };
  const idx = ORDER.indexOf(b), base = liveAt(g) + 0.7 + GAP * idx, period = GAP * ORDER.length;
  if (T >= base) {
    const u = (T - base) % period;
    if (u < d.dur) return { kind: "deliver", u };
  }
  return null;
}

/* ── Shapes ───────────────────────────────────────────────────────────────── */
const bubblePath = (x: number, y: number, w: number, h: number, r: number, t: number) => {
  const cy = y + h / 2;
  return `M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h} H${x + r} A${r} ${r} 0 0 1 ${x} ${y + h - r} V${cy + t * 0.7} L${x - t} ${cy} L${x} ${cy - t * 0.7} V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`;
};
const stubPath = (w: number, h: number, r: number, n: number) =>
  `M${r} 0 H${w - r} Q${w} 0 ${w} ${r} V${h / 2 - n} A${n} ${n} 0 0 0 ${w} ${h / 2 + n} V${h - r} Q${w} ${h} ${w - r} ${h} H${r} Q0 ${h} 0 ${h - r} V${h / 2 + n} A${n} ${n} 0 0 0 0 ${h / 2 - n} V${r} Q0 0 ${r} 0 Z`;

const board = (g: Geo) => {
  const s = g.shop, w = s.x1 - s.x0;
  const bottom = s.roofY - 8 - s.post, top = bottom - s.board, bx = s.x0 + w * 0.055, bw = w * 0.9;
  return { top, bottom, bx, bw, mid: bx + bw / 2, h: s.board };
};

function Backdrop({ g }: { g: Geo }) {
  return (
    <>
      <g>
        <circle cx={g.moon[0]} cy={g.moon[1]} r={g.moon[2]} fill={C.disc} />
        {g.clouds.map(([cx, cy, rx, ry]) => <ellipse key={`${cx}${cy}`} cx={cx} cy={cy} rx={rx} ry={ry} fill={C.cloud} />)}
        <rect x={0} y={g.ground} width={g.W} height={g.H - g.ground} fill="url(#pp-ground)" />
      </g>
      {g.stars.map(([x, y]) => <circle key={`${x}${y}`} className="pp-star" cx={x} cy={y} r={g.W > 600 ? 2.2 : 1.6} fill={C.amber} />)}
      <path d={`M0 ${g.ground} H${g.W}`} stroke="url(#pp-ground-line)" strokeWidth={2} />
    </>
  );
}

/** The shop itself (still paper). The signs and the lights are separate so they can change. */
function Shop({ g }: { g: Geo }) {
  const s = g.shop, w = s.x1 - s.x0, bodyTop = s.roofY + 6;
  const seg = w / (s.flaps * 2), b = board(g);
  const flap = (x: number) => `M${x} ${bodyTop} H${x + seg} V${bodyTop + s.awn - seg / 2} A${seg / 2} ${seg / 2} 0 0 1 ${x} ${bodyTop + s.awn - seg / 2} Z`;
  const [wx, wy, ww, wh] = s.win, [dx, dw, dh] = s.door;
  return (
    <g filter="url(#pp-paper)">
      <rect x={s.x0 + w * 0.245} y={b.bottom} width={w * 0.028} height={s.post + 8} fill={C.dimText} />
      <rect x={s.x0 + w * 0.727} y={b.bottom} width={w * 0.028} height={s.post + 8} fill={C.dimText} />
      <rect x={s.x0 - 6} y={s.roofY - 8} width={w + 12} height={14} fill={C.roof} />
      <rect x={s.x0} y={bodyTop} width={w} height={g.ground - bodyTop} fill={C.cream} />
      <rect x={s.x0} y={g.ground - s.band} width={w} height={s.band} fill={C.band} />
      {Array.from({ length: s.flaps * 2 }, (_, i) => <path key={i} d={flap(s.x0 + i * seg)} fill={i % 2 === 0 ? C.mint : C.band} />)}
      <rect x={s.x0 + wx} y={s.roofY + wy} width={ww} height={wh} fill={C.dimStroke} stroke={C.bg} strokeWidth={3} />
      <rect x={dx} y={g.ground - dh} width={dw} height={dh} rx={3} fill={C.door} />
      <circle cx={dx + dw - 8} cy={g.ground - dh * 0.42} r={Math.max(2, dw * 0.05)} fill={C.dimText} />
      <g fill="none" strokeLinecap="round">
        <path d={`M${s.x0 + wx + ww / 2} ${s.roofY + wy} V${s.roofY + wy + wh} M${s.x0 + wx} ${s.roofY + wy + wh / 2} H${s.x0 + wx + ww}`} stroke={C.bg} strokeWidth={3} />
        <path d={`M${s.x0 + wx + ww * 0.12} ${s.roofY + wy + wh * 0.2} l${ww * 0.12} ${-wh * 0.1}`} stroke={C.cream} strokeOpacity={0.5} strokeWidth={2} />
        <rect x={dx + 5} y={g.ground - dh + 7} width={dw - 10} height={dh * 0.36} rx={2} stroke={C.dimStroke} strokeWidth={2} />
        <rect x={dx + 5} y={g.ground - dh * 0.52} width={dw - 10} height={dh * 0.4} rx={2} stroke={C.dimStroke} strokeWidth={2} />
        <path d={`M${s.x0 + 3} ${bodyTop + 5} H${s.x1 - 3}`} stroke={C.roof} strokeOpacity={0.35} strokeWidth={1.4} strokeDasharray="4 4" />
        <path d={`M${s.x0} ${g.ground - s.band} H${s.x1}`} stroke={INK} strokeOpacity={0.45} strokeWidth={1.4} />
      </g>
      {g.W > 600 && (
        <>
          <path d={`M${s.x0 - 28} ${g.ground - 24} H${s.x0 - 8} L${s.x0 - 11} ${g.ground} H${s.x0 - 25} Z`} fill="#D9825B" />
          <path d={`M${s.x0 - 18} ${g.ground - 24} Q${s.x0 - 38} ${g.ground - 36} ${s.x0 - 32} ${g.ground - 54} Q${s.x0 - 18} ${g.ground - 46} ${s.x0 - 18} ${g.ground - 24} Z M${s.x0 - 18} ${g.ground - 24} Q${s.x0 - 6} ${g.ground - 40} ${s.x0 - 10} ${g.ground - 58} Q${s.x0 - 22} ${g.ground - 42} ${s.x0 - 18} ${g.ground - 24} Z`} fill="#6F8F5B" />
        </>
      )}
    </g>
  );
}

/** The sign on the roof: cream "Website" before, mint "Your Business on the Shortlist" after. */
function Sign({ g, neu }: { g: Geo; neu: boolean }) {
  const b = board(g), k = g.sign.old[0].size / 30;
  const lines = neu ? g.sign.neu : g.sign.old;
  return (
    <g className={neu ? "pp-sign-new" : "pp-sign-old"}>
      <g filter="url(#pp-paper)">
        <rect x={b.bx} y={b.top} width={b.bw} height={b.h} rx={6} fill={neu ? C.mint : C.cream} />
        <rect x={b.bx + 6} y={b.top + 6} width={b.bw - 12} height={b.h - 12} rx={4} fill="none" stroke={neu ? C.pale : C.mint} strokeWidth={3} />
      </g>
      {lines.map((l) => (
        <text key={l.t} x={b.mid} y={b.top + b.h * l.y} textAnchor="middle" fontSize={l.size} fontWeight={l.serif ? 400 : 800} fill={neu ? C.solidText : C.bg} style={{ fontFamily: l.serif ? SERIF : SANS }}>{l.t}</text>
      ))}
      {!neu && (
        <path d={`M${b.mid - 22 * k} ${b.top + b.h * g.sign.squiggleY} q${4 * k} ${-3.5 * k} ${8 * k} 0 t${8 * k} 0 t${8 * k} 0 t${8 * k} 0 t${8 * k} 0`} fill="none" stroke={INK} strokeWidth={1.5} strokeLinecap="round" />
      )}
    </g>
  );
}

/** The window and door once it's connected: warm light, with a glow around each. */
function Lights({ g }: { g: Geo }) {
  const s = g.shop, [wx, wy, ww, wh] = s.win, [dx, dw, dh] = s.door;
  const wcx = s.x0 + wx + ww / 2, wcy = s.roofY + wy + wh / 2;
  return (
    <>
      <g className="pp-lit pp-lit-w">
        <ellipse cx={wcx} cy={wcy} rx={ww * 0.95} ry={wh * 1.05} fill="url(#pp-warm)" />
        <rect x={s.x0 + wx} y={s.roofY + wy} width={ww} height={wh} fill={C.warm} stroke={C.bg} strokeWidth={3} />
        <rect x={s.x0 + wx} y={s.roofY + wy} width={ww} height={wh} fill="url(#pp-grain)" fillOpacity={0.45} />
        <path d={`M${wcx} ${s.roofY + wy} V${s.roofY + wy + wh} M${s.x0 + wx} ${wcy} H${s.x0 + wx + ww}`} stroke={INK} strokeWidth={3} fill="none" />
        <path d={`M${s.x0 + wx + ww * 0.12} ${s.roofY + wy + wh * 0.2} l${ww * 0.12} ${-wh * 0.1}`} stroke={C.warmHi} strokeWidth={2} strokeLinecap="round" fill="none" />
      </g>
      <g className="pp-lit pp-lit-d">
        <ellipse cx={dx + dw / 2} cy={g.ground - dh * 0.5} rx={dw * 1.5} ry={dh * 0.8} fill="url(#pp-warm)" />
        <ellipse cx={dx + dw / 2} cy={g.ground} rx={dw * 2.2} ry={Math.max(6, dh * 0.09)} fill="url(#pp-warm)" />
        <rect className="pp-door-fill" x={dx} y={g.ground - dh} width={dw} height={dh} rx={3} />
        <rect x={dx} y={g.ground - dh} width={dw} height={dh} rx={3} fill="url(#pp-grain)" fillOpacity={0.45} />
        <g fill="none" stroke="#7A4F12" strokeOpacity={0.6} strokeWidth={2}>
          <rect x={dx + 5} y={g.ground - dh + 7} width={dw - 10} height={dh * 0.36} rx={2} />
          <rect x={dx + 5} y={g.ground - dh * 0.52} width={dw - 10} height={dh * 0.4} rx={2} />
        </g>
        <circle cx={dx + dw - 8} cy={g.ground - dh * 0.42} r={Math.max(2, dw * 0.05)} fill="#7A4F12" />
      </g>
    </>
  );
}

/** One pipe, three layers (outline, body, grain) and a highlight. `grow` draws it in with a class. */
function PipeLine({ d, pw, hi, grow }: { d: string; pw: number; hi: string; grow?: string }) {
  const dash = grow ? ({ pathLength: 1, strokeDasharray: "1 1", className: grow } as const) : {};
  return (
    <g>
      <path d={d} fill="none" stroke={C.dark} strokeWidth={pw + 6} {...dash} />
      <path d={d} fill="none" stroke={C.mint} strokeWidth={pw} {...dash} />
      <path d={d} fill="none" stroke="url(#pp-grain)" strokeOpacity={0.55} strokeWidth={pw} {...dash} />
      <path d={d} fill="none" stroke={C.hi} strokeOpacity={0.7} strokeWidth={Math.max(2, pw * 0.14)} transform={hi} {...dash} />
    </g>
  );
}

function Ring({ x, y, g, cls }: { x: number; y: number; g: Geo; cls?: string }) {
  return (
    <g className={cls}>
      <circle cx={x} cy={y} r={g.joint[0]} fill={C.dark} />
      <circle cx={x} cy={y} r={g.joint[1]} fill={C.mint} />
    </g>
  );
}

/** Pipes in front of Shorty: the part that's already there, and the two he connects. */
function Pipes({ g }: { g: Geo }) {
  const { shop: s, pipeY: y, riserX: rx, endX, pw } = g;
  const tops = g.bub.ys, branchEnd = g.bub.x - 6, off = pw * 0.27, [fw, fh] = g.flange;
  const mid = (s.x1 + endX) / 2;
  const flange = (x: number, cls?: string) => <rect key={`${x}${cls}`} className={cls} x={x - fw / 2} y={y - fh / 2} width={fw} height={fh} rx={2} fill={C.dark} />;
  return (
    <g filter="url(#pp-cut)">
      {/* already connected to the agents: riser, four branches, and a stub that stops short of the shop */}
      <PipeLine d={`M${rx} ${y} V${tops[0]}`} pw={pw} hi={`translate(${-off} 0)`} />
      {tops.map((ty) => <PipeLine key={ty} d={`M${rx} ${ty} H${branchEnd}`} pw={pw} hi={`translate(0 ${-off})`} />)}
      <PipeLine d={`M${rx} ${y} H${endX}`} pw={pw} hi={`translate(0 ${-off})`} />
      {flange(endX)}
      {flange(endX + (rx - endX) * 0.55)}
      {[y, ...tops].map((jy) => <Ring key={jy} x={rx} y={jy} g={g} />)}
      {/* the two Shorty connects, one after the other */}
      <PipeLine d={`M${s.x1} ${y} H${mid}`} pw={pw} hi={`translate(0 ${-off})`} grow="pp-g1" />
      <PipeLine d={`M${mid} ${y} H${endX}`} pw={pw} hi={`translate(0 ${-off})`} grow="pp-g2" />
      {flange(s.x1 - 2, "pp-pop pp-pa")}
      {flange(mid, "pp-pop pp-pb")}
      <Ring x={endX} y={y} g={g} cls="pp-pop pp-pc" />
    </g>
  );
}

function Bubbles({ g }: { g: Geo }) {
  const b = g.bub;
  return (
    <>
      {BUBBLES.map((bub, i) => {
        const cy = b.ys[i], top = cy - b.h / 2;
        return (
          <g key={bub.name} className={`pp-float${i}`}>
            <g filter="url(#pp-cut)">
              <path className={`pp-b pp-b${i}`} d={bubblePath(b.x, top, b.w, b.h, b.r, b.tail)} strokeWidth={3} strokeLinejoin="round" />
              <path d={bubblePath(b.x, top, b.w, b.h, b.r, b.tail)} fill="url(#pp-grain)" fillOpacity={0.5} />
            </g>
            <text className={`pp-t pp-t${i}`} x={b.x + b.pad} y={top + b.h * 0.45} fontSize={b.name} fontWeight={800} style={{ fontFamily: SANS }}>{bub.name}</text>
            <text className={`pp-t pp-t${i}`} x={b.x + b.pad} y={top + b.h * 0.78} fontSize={b.cap} fontWeight={800} letterSpacing="0.14em" style={{ fontFamily: SANS }}>{bub.cap}</text>
            {i === 3 && (
              <g className="pp-badge">
                <rect x={b.x + b.w - b.badge[0] - 14} y={top - b.badge[1] / 2} width={b.badge[0]} height={b.badge[1]} rx={b.badge[1] / 2} fill={C.amber} filter="url(#pp-cut)" />
                <text x={b.x + b.w - b.badge[0] / 2 - 14} y={top + b.badge[2] * 0.36} textAnchor="middle" fontSize={b.badge[2]} fontWeight={800} letterSpacing="0.08em" fill={C.bg} style={{ fontFamily: SANS }}>LIVE NOW</text>
              </g>
            )}
          </g>
        );
      })}
    </>
  );
}

/** Requests: one ticket per agent. Before it's connected they bounce off the dead end; after, they go in the door. */
type TixRefs = { g: Array<SVGGElement | null>; x: Array<SVGGElement | null> };
function Tickets({ g, refs }: { g: Geo; refs: RefObject<TixRefs> }) {
  const { w, h, font } = g.stub;
  return (
    <svg viewBox={`0 0 ${g.W} ${g.H}`} aria-hidden="true" className="pp-tix pointer-events-none absolute inset-0 h-full w-full" style={{ fontFamily: SANS }}>
      {BUBBLES.map((bub, i) => (
        <g key={bub.name} ref={(el) => { refs.current.g[i] = el; }} opacity={0}>
          <g transform={`translate(${-w / 2} ${-h / 2})`}>
            <g filter="url(#pp-cut)">
              <path d={stubPath(w, h, 6, h * 0.2)} fill={C.cream} />
              <path d={stubPath(w, h, 6, h * 0.2)} fill="url(#pp-grain)" fillOpacity={0.5} />
            </g>
            <text x={w / 2} y={h / 2 + font * 0.36} textAnchor="middle" fontSize={font} fontWeight={800} fill={C.bg}>{bub.ask}</text>
            <g ref={(el) => { refs.current.x[i] = el; }} opacity={0}>
              <circle cx={4} cy={2} r={h * 0.34} fill={C.red} stroke={C.bg} strokeWidth={1.5} />
              <path d={`M${4 - h * 0.13} ${2 - h * 0.13} l${h * 0.26} ${h * 0.26} M${4 + h * 0.13} ${2 - h * 0.13} l${-h * 0.26} ${h * 0.26}`} stroke="#fff" strokeWidth={Math.max(1.6, h * 0.08)} strokeLinecap="round" />
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}

type Phase = "idle" | "search" | "lay" | "live";

/* ── The scene ────────────────────────────────────────────────────────────── */
function Scene({ g, reduced }: { g: Geo; reduced: boolean }) {
  const root = useRef<HTMLDivElement | null>(null);
  const start = useRef(0);
  const inView = useRef(false);
  const tix = useRef<TixRefs>({ g: [], x: [] });
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [fail, setFail] = useState(false);
  const [mood, setMood] = useState<MascotMood>("wait");
  const ph: Phase = reduced ? "live" : phase;

  /* Start the story the first time it's properly on screen. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      inView.current = e.isIntersecting;
      el.toggleAttribute("data-inview", e.isIntersecting);
      if (e.isIntersecting && !start.current) { start.current = performance.now(); setStarted(true); setPhase("search"); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* The clock: phase, Shorty's pose, and the requests. */
  useEffect(() => {
    if (!started || reduced) return;
    const live = liveAt(g), dims = BUBBLES.map((_, b) => dimsFor(g, b));
    let raf = 0, curPhase: Phase = "search", curFail = false, curMood: MascotMood = "wait", curHit = false;
    const hide = (i: number) => { tix.current.g[i]?.setAttribute("opacity", "0"); tix.current.x[i]?.setAttribute("opacity", "0"); };

    const tick = () => {
      const T = (performance.now() - start.current) / 1000;
      const next: Phase = T < SEARCH_END ? "search" : T < live ? "lay" : "live";
      if (next !== curPhase) { curPhase = next; setPhase(next); }
      const f = next !== "live" && T > FIRST_FAIL;
      if (f !== curFail) { curFail = f; setFail(f); }
      const m = moodAt(T, g);
      if (m !== curMood) { curMood = m; setMood(m); }

      let hit = false;
      BUBBLES.forEach((_, b) => {
        const d = dims[b], trip = tripFor(g, b, d, T), el = tix.current.g[b], x = tix.current.x[b];
        /* a delivered request has just reached the door: pulse it */
        const idx = ORDER.indexOf(b), base = live + 0.7 + GAP * idx;
        if (T >= base) { const ua = ((T - base) % (GAP * ORDER.length)) - d.dur; if (ua > -0.15 && ua < 0.5) hit = true; }
        if (!trip || !inView.current || !el) { if (el && el.getAttribute("opacity") !== "0") hide(b); return; }
        const { u } = trip;
        let s: number, sx = 0, op = Math.min(1, u / 0.25), bad = 0;
        if (trip.kind === "bounce") {
          const total = d.out + SHAKE + d.back;
          if (u < d.out) s = d.Lb * (u / d.out);
          else if (u < d.out + SHAKE) { const k = (u - d.out) / SHAKE; s = d.Lb; sx = Math.sin(k * 45) * 3.5 * (1 - k); bad = 1; }
          else { const k = (u - d.out - SHAKE) / d.back; s = d.Lb * (1 - k) * (1 - k); bad = 1; op = Math.min(op, (total - u) / 0.3); }
        } else {
          s = d.Ld * (u / d.dur);
          op = Math.min(op, (d.dur - u) / 0.3);
        }
        const [px, py] = posAt(g, b, d, Math.min(s, d.Ld));
        el.setAttribute("transform", `translate(${(px + sx).toFixed(1)} ${py.toFixed(1)})`);
        el.setAttribute("opacity", Math.max(0, Math.min(1, op)).toFixed(2));
        x?.setAttribute("opacity", String(bad));
      });
      if (hit !== curHit) { curHit = hit; root.current?.toggleAttribute("data-hit", hit); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, reduced, g]);

  const { boxW, dx, hop } = g.shorty;
  const boxH = (boxW * 318) / 316;
  const shortyStyle = {
    left: `${((g.shop.x1 + dx - boxW / 2) / g.W) * 100}%`,
    top: `${((g.ground - 0.937 * boxH) / g.H) * 100}%`,
    width: `${(boxW / g.W) * 100}%`,
    "--wx": `${(((g.endX - g.shop.x1) / boxW) * 100).toFixed(2)}%`,
    "--hop1": hop[0], "--hop2": hop[1],
  } as CSSProperties;
  const n = g.note, rot = `rotate(-5 ${n.x} ${n.y + n.lh})`;

  return (
    <div
      ref={root} data-phase={ph} data-fail={fail && ph !== "live" ? "" : undefined}
      className="pp relative w-full" style={{ aspectRatio: `${g.W} / ${g.H}`, "--wk": `${g.walk}s` } as CSSProperties}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {/* back layer: backdrop, the shop, its signs and lights, the words */}
      <svg
        viewBox={`0 0 ${g.W} ${g.H}`} role="img" className="absolute inset-0 h-full w-full overflow-hidden" style={{ fontFamily: SANS }}
        aria-label="AI assistants are plugged into a pipe that stops short of a business that only has a billboard, so they can read it but not use it. Shorty connects the last pipes, and now the assistants can reach the business."
      >
        <defs>
          <pattern id="pp-grain" patternUnits="userSpaceOnUse" width={160} height={160}>
            <image href={GRAIN_URL} width={160} height={160} />
          </pattern>
          <radialGradient id="pp-warm"><stop offset="0" stopColor={C.warm} stopOpacity={0.6} /><stop offset="1" stopColor={C.warm} stopOpacity={0} /></radialGradient>
          <linearGradient id="pp-ground" gradientUnits="userSpaceOnUse" x1={0} x2={g.W} y1={0} y2={0}>
            <stop offset="0" stopColor={C.ground} stopOpacity={0} /><stop offset="0.07" stopColor={C.ground} /><stop offset="0.93" stopColor={C.ground} /><stop offset="1" stopColor={C.ground} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="pp-ground-line" gradientUnits="userSpaceOnUse" x1={0} x2={g.W} y1={0} y2={0}>
            <stop offset="0" stopColor={C.dimStroke} stopOpacity={0} /><stop offset="0.07" stopColor={C.dimStroke} /><stop offset="0.93" stopColor={C.dimStroke} /><stop offset="1" stopColor={C.dimStroke} stopOpacity={0} />
          </linearGradient>
          {/* Still art: torn edges + grain + the hard offset shadow (the hero scenes' technique). */}
          <filter id="pp-paper" x="-8%" y="-8%" width="116%" height="124%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={2} seed={7} result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale={3.2} xChannelSelector="R" yChannelSelector="G" result="torn" />
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} result="fine" />
            <feColorMatrix in="fine" type="matrix" values="0 0 0 0 0.08  0 0 0 0 0.07  0 0 0 0 0.05  0.42 0 0 0 -0.16" result="specks" />
            <feComposite in="specks" in2="torn" operator="in" result="grain" />
            <feMerge result="sheet"><feMergeNode in="torn" /><feMergeNode in="grain" /></feMerge>
            <feDropShadow in="sheet" dx="0" dy="5" stdDeviation="0" floodColor="#000" floodOpacity="0.38" />
          </filter>
          {/* Pipes, agents, tickets: a light torn edge + the same shadow; grain comes from the overlay pattern. */}
          <filter id="pp-cut" x="-10%" y="-10%" width="125%" height="135%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={1} seed={5} result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale={2.4} xChannelSelector="R" yChannelSelector="G" result="torn" />
            <feDropShadow in="torn" dx="0" dy="5" stdDeviation="0" floodColor="#000" floodOpacity="0.38" />
          </filter>
        </defs>
        <Backdrop g={g} />
        {/* the missing connection: dashed until Shorty lays it */}
        <path d={`M${g.shop.x1} ${g.pipeY} H${g.endX}`} fill="none" stroke={C.dimStroke} strokeWidth={Math.max(2, g.pw * 0.2)} strokeDasharray="9 8" />
        <Shop g={g} />
        <Sign g={g} neu={false} />
        <Sign g={g} neu />
        <Lights g={g} />
        <g style={{ fontFamily: SANS }} fontWeight={800}>
          <text className="pp-note-bad" fontSize={n.size} fill={C.red} transform={rot}>
            {n.lines.map((line, i) => <tspan key={line} x={n.x} y={n.y + i * n.lh}>{line}</tspan>)}
          </text>
          <text className="pp-note-good" fontSize={n.goodSize} fill={C.mint} transform={rot}>
            <tspan x={n.x} y={n.y + n.lh}>{n.good}</tspan>
          </text>
        </g>
        <text className="pp-cap-fail" textAnchor="middle" fontSize={g.caption.size} fontWeight={800} fill={C.amber}>
          {g.caption.fail.lines.map((line, i) => <tspan key={line} x={g.caption.x} y={g.caption.fail.ys[i]}>{line}</tspan>)}
        </text>
        <text className="pp-cap-ok" textAnchor="middle" fontSize={g.caption.size} fontWeight={800} fill={C.pale}>
          {g.caption.lines.map((line, i) => <tspan key={line} x={g.caption.x} y={g.caption.ys[i]}>{line}</tspan>)}
        </text>
      </svg>

      {/* Shorty: the hero's own rig, behind the pipes. */}
      <div aria-hidden="true" className="pp-sh pointer-events-none absolute" style={shortyStyle}>
        <div className="pp-bob">
          <div className="pp-hop relative">
            {started && (
              <>
                {/* The app's answer for dark surfaces: his ink is black, so a soft warm glow sits behind him. */}
                <div className="pointer-events-none absolute" style={{ left: "6%", top: "12%", width: "88%", height: "86%", background: "radial-gradient(ellipse farthest-side at 50% 60%, rgba(242,231,204,.66), rgba(242,231,204,.42) 48%, rgba(242,231,204,0))" }} />
                <ShortyMascot mood={mood} size={190} style={{ width: "100%", height: "auto", position: "relative" }} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* front layer: the pipes and the agents, so Shorty walks behind the pipe he's laying */}
      <svg viewBox={`0 0 ${g.W} ${g.H}`} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" style={{ fontFamily: SANS }}>
        <Pipes g={g} />
        <Bubbles g={g} />
      </svg>

      <Tickets g={g} refs={tix} />
    </div>
  );
}

function PipesScene() {
  const desk = useSyncExternalStore(DESK.subscribe, DESK.get, () => true);
  const reduced = useSyncExternalStore(REDUCED.subscribe, REDUCED.get, () => false);
  return <Scene key={desk ? "d" : "m"} g={desk ? DESKTOP : MOBILE} reduced={reduced} />;
}

/* ── The section ──────────────────────────────────────────────────────────── */
const label = "text-[12px] font-bold uppercase tracking-[0.18em]";
const body = "mt-4 text-[17px] leading-[1.6] text-[#D2CCBC] min-[900px]:text-[18px]";
const quote = "font-[family-name:var(--font-fraunces)] text-[20px] italic leading-[1.35] text-[#F6F1E4]";

export function PipesSection() {
  return (
    <section aria-labelledby="pipes-h" className="bg-[#14161A] px-5 pt-16 pb-16 text-[#F6F1E4] min-[900px]:px-12 min-[900px]:pt-[104px] min-[900px]:pb-24">
      <div className="mx-auto max-w-[1344px]">
        <p className={`${label} text-[#34D399]`}>THE WAY BUSINESS GETS DONE IS CHANGING</p>
        <h2
          id="pipes-h"
          className="mt-4 max-w-[1040px] font-[family-name:var(--font-fraunces)] text-[46px] leading-[1.02] font-normal tracking-[-0.02em] min-[900px]:mt-5 min-[900px]:text-[84px] min-[900px]:leading-[1]"
        >
          Everyone’s about to have an AI assistant. <em className="italic text-[#5FDDAE]">We build the pipes so it can reach you.</em>
        </h2>

        <div className="mt-10 min-[900px]:mt-12"><PipesScene /></div>

        <div className="mt-12 grid gap-10 min-[900px]:mt-16 min-[900px]:grid-cols-3 min-[900px]:gap-12">
          <div>
            <p className={`${label} text-[#34D399]`}>WHO’S COMING</p>
            <p className={body}>
              ChatGPT has Dots. Meta has Muse. Grok has its own. These are personal assistants people will talk to all day, the way they use email now. They don’t scroll and browse. They get things done.
            </p>
            <p className={`${quote} mt-5`}>“Hire me a plumber with the best ratings who can come Saturday at 7.”</p>
            <p className={`${quote} mt-3`}>“Order me a pizza for pickup at 5.”</p>
          </div>
          <div>
            <p className={`${label} text-[#E2A43C]`}>THE CATCH</p>
            <p className={body}>
              Your website and your socials can be read by these assistants, and that’s all they can do. They’re a billboard. The assistant can look at it, but it can’t ask a question, place an order, or book a time. So it skips you and moves on to a business it can actually use.
            </p>
          </div>
          <div>
            <p className={`${label} text-[#34D399]`}>WHAT WE DO</p>
            <p className={body}>
              Shortlist builds the pipes. Your page speaks the language these assistants use (it’s called MCP). They can see what you sell, build the order, and send the customer to your checkout. The money still goes straight to your Stripe or Square.
            </p>
          </div>
        </div>

        <div className="mt-16 min-[900px]:mt-24">
          <p className="max-w-[1100px] font-[family-name:var(--font-fraunces)] text-[36px] leading-[1.1] font-normal tracking-[-0.015em] min-[900px]:text-[54px]">
            The people who hand off their errands get an hour back every day. <em className="italic text-[#5FDDAE]">They’ll pick the businesses their assistant can reach.</em>
          </p>
          <p className="mt-8 inline-flex items-center gap-2.5 rounded-full border-[1.5px] border-[#34D399] px-5 py-3 text-[15px] text-[#D7F5E8] min-[900px]:text-[16px]">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#34D399]" />
            Shortlist is already listed in the Claude connector directory.
          </p>
        </div>
      </div>
    </section>
  );
}
