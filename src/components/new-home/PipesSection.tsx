"use client";

/**
 * The "pipes" chapter, below the hero on /new: Shorty lays a pipe from a shop that only has a
 * billboard to the AI assistants, so they can reach it.
 *
 * One scene component, two geometry configs (DESKTOP / MOBILE). One 18 s loop: every animation is
 * a CSS keyframe built from the same timeline below, so everything stays in sync. Shorty is the
 * hero's own ShortyMascot. The only moving parts that aren't CSS are the two ticket stubs
 * (<animateMotion>, re-synced to the CSS clock) and Shorty's pose, which follows the same clock.
 */
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type RefObject } from "react";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import type { MascotMood } from "@/lib/shorty/mascot/poses";

/* ── Palette: the brief's, plus neutrals derived from the background ─────── */
const C = {
  bg: "#14161A", cream: "#F6F1E4", band: "#E8E1CD", mint: "#34D399", lmint: "#5FDDAE", pale: "#D7F5E8",
  amber: "#E2A43C", amberL: "#F6B94A", dimFill: "#2A2E36", dimStroke: "#3A3F49", dimText: "#8D8A80",
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
type Geo = {
  W: number; H: number; ground: number;
  shop: { x0: number; x1: number; roofY: number; awn: number; flaps: number; board: number; post: number; win: [number, number, number, number]; door: [number, number, number]; band: number };
  boardTitle: number; boardSub: string[]; boardSubSize: number;
  pipeY: number; riserX: number; pw: number; joint: [number, number]; flange: [number, number];
  bub: { x: number; w: number; h: number; r: number; tail: number; ys: number[]; name: number; cap: number; pad: number; badge: [number, number, number] };
  note: { x: number; y: number; lh: number; size: number };
  caption: { x: number; ys: number[]; size: number; lines: string[] };
  stub: { w: number; h: number; font: number };
  shorty: { boxW: number; dx: number; hop: [string, string] };
  stars: Array<[number, number]>; clouds: Array<[number, number, number, number]>; moon: [number, number, number];
};

const DESKTOP: Geo = {
  W: 1200, H: 596, ground: 506,
  shop: { x0: 40, x1: 330, roofY: 262, awn: 58, flaps: 4, board: 82, post: 31, win: [29, 91, 112, 85], door: [243, 60, 108], band: 93 },
  boardTitle: 30, boardSub: ["Instagram · Facebook"], boardSubSize: 13,
  pipeY: 478, riserX: 900, pw: 22, joint: [17, 10], flange: [10, 36],
  bub: { x: 962, w: 218, h: 64, r: 22, tail: 12, ys: [120, 210, 300, 390], name: 25, cap: 11.5, pad: 26, badge: [84, 20, 10.5] },
  note: { x: 42, y: 96, lh: 25, size: 21 },
  caption: { x: 615, ys: [550, 580], size: 22, lines: ["Can see what you sell. Can build the order.", "Can send them to your checkout."] },
  stub: { w: 176, h: 34, font: 13.5 },
  shorty: { boxW: 205, dx: 30, hop: ["-26px", "-11px"] },
  stars: [[517, 45], [794, 33], [661, 177], [445, 200], [250, 40]],
  clouds: [[630, 118, 130, 30], [760, 150, 100, 22]],
  moon: [990, 236, 214],
};

const MOBILE: Geo = {
  W: 360, H: 560, ground: 500,
  shop: { x0: 8, x1: 112, roofY: 318, awn: 34, flaps: 3, board: 66, post: 18, win: [8, 52, 40, 44], door: [78, 26, 62], band: 56 },
  boardTitle: 17, boardSub: ["Instagram ·", "Facebook"], boardSubSize: 8,
  pipeY: 476, riserX: 244, pw: 14, joint: [11, 6.5], flange: [7, 24],
  bub: { x: 256, w: 98, h: 52, r: 18, tail: 8, ys: [70, 148, 226, 304], name: 15, cap: 9, pad: 12, badge: [58, 15, 7.5] },
  note: { x: 8, y: 196, lh: 16, size: 12.5 },
  caption: { x: 180, ys: [522, 538, 554], size: 12.5, lines: ["Sees what you sell.", "Builds the order.", "Sends them to checkout."] },
  stub: { w: 122, h: 24, font: 9 },
  shorty: { boxW: 120, dx: 19, hop: ["-16px", "-7px"] },
  stars: [[170, 40], [60, 120], [210, 250], [40, 230]],
  clouds: [[150, 90, 70, 16]],
  moon: [300, 220, 150],
};

const BUBBLES = [
  { name: "Dots", cap: "OPENAI" },
  { name: "Muse", cap: "META" },
  { name: "Grok", cap: "XAI" },
  { name: "Claude", cap: "ANTHROPIC" },
];

/* ── The 18-second timeline (seconds). Everything below reads from this. ──── */
const D = 18;
const T = {
  show: [0.5, 1.0], walk: [1.0, 6.8], riser: [6.8, 8.6], branches: [8.6, 9.6], hop: [8.6, 9.8],
  lit: [9.6, 10.0, 10.4, 10.8], badge: 11.2, caption: [10.2, 11.2],
  stub1: [10.8, 14.4], stub2: [12.2, 15.8], fade: [16.8, 17.6],
};
const pc = (t: number) => `${+((t / D) * 100).toFixed(3)}%`;

/** Shorty's pose follows the same clock as the CSS. */
function moodAt(t: number): MascotMood {
  if (t < T.walk[0]) return "wait";
  if (t < T.walk[1]) return "walkR";
  if (t < T.branches[0]) return "wait";
  if (t < 10.6) return "hello";
  if (t < 13.5) return "pleased";
  return "wait";
}

function buildCss(): string {
  const kf = (name: string, body: string) => `@keyframes ${name}{${body}}`;
  const fade = (a: number, b: number) => `0%,${pc(a)}{opacity:0}${pc(b)},${pc(T.fade[0])}{opacity:1}${pc(T.fade[1])},100%{opacity:0}`;
  let s = `@property --amp{syntax:'<number>';inherits:true;initial-value:0}`;
  s += kf("pp-clock", "from{opacity:1}to{opacity:1}");
  s += kf("pp-grp", `0%,${pc(T.fade[0])}{opacity:1}${pc(T.fade[1])},100%{opacity:0}`);
  s += kf("pp-dh", `0%,${pc(T.walk[0])}{stroke-dashoffset:1}${pc(T.walk[1])},100%{stroke-dashoffset:0}`);
  s += kf("pp-dv", `0%,${pc(T.riser[0])}{stroke-dashoffset:1}${pc(T.riser[1])},100%{stroke-dashoffset:0}`);
  s += kf("pp-db", `0%,${pc(T.branches[0])}{stroke-dashoffset:1}${pc(T.branches[1])},100%{stroke-dashoffset:0}`);
  s += kf("pp-pop", `0%,${pc(8.6)}{transform:scale(0)}${pc(8.85)}{transform:scale(1.2)}${pc(9.05)},100%{transform:scale(1)}`);
  s += kf("pp-fl0", `0%,${pc(0.95)}{opacity:0}${pc(1.05)},100%{opacity:1}`);
  s += kf("pp-fl1", `0%,${pc(2.8)}{opacity:0}${pc(3.0)},100%{opacity:1}`);
  s += kf("pp-fl2", `0%,${pc(4.73)}{opacity:0}${pc(4.93)},100%{opacity:1}`);
  s += kf("pp-bf", `0%{opacity:0}${pc(0.6)}{opacity:1}${pc(T.fade[0])}{opacity:1}${pc(T.fade[1])},100%{opacity:0}`);
  s += kf("pp-badge", `0%,${pc(T.badge - 0.1)}{opacity:0}${pc(T.badge + 0.2)},100%{opacity:1}`);
  s += kf("pp-cap", fade(T.caption[0], T.caption[1]));
  const stubFade = (a: number, b: number) => `0%,${pc(a - 0.1)}{opacity:0}${pc(a + 0.1)},${pc(b - 0.2)}{opacity:1}${pc(b)},100%{opacity:0}`;
  s += kf("pp-s1", stubFade(T.stub1[0], T.stub1[1]));
  s += kf("pp-s2", stubFade(T.stub2[0], T.stub2[1]));
  s += kf("pp-door", `0%,${pc(14.4)}{fill:${C.door}}${pc(14.5)},${pc(14.7)}{fill:${C.amberL}}${pc(15.1)},${pc(15.8)}{fill:${C.door}}${pc(15.9)},${pc(16.1)}{fill:${C.amberL}}${pc(16.5)},100%{fill:${C.door}}`);
  s += kf("pp-tw", "0%,100%{opacity:.3}50%{opacity:.85}");
  s += kf("pp-fl", "from{transform:translateY(-3px)}to{transform:translateY(3px)}");
  /* Shorty */
  s += kf("pp-sh-fade", `0%,${pc(T.show[0])}{opacity:0}${pc(T.show[1])},${pc(T.fade[0])}{opacity:1}${pc(T.fade[1])},100%{opacity:0}`);
  s += kf("pp-sh-walk", `0%,${pc(T.walk[0])}{transform:translateX(0)}${pc(T.walk[1])},100%{transform:translateX(var(--walk))}`);
  s += kf("pp-sh-amp", `0%,${pc(T.walk[0])}{--amp:0}${pc(T.walk[0] + 0.3)},${pc(T.walk[1] - 0.4)}{--amp:1}${pc(T.walk[1] + 0.2)},100%{--amp:0}`);
  s += kf("pp-bob", `0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(calc(var(--amp) * -9px)) rotate(calc(var(--amp) * 2.4deg))}`);
  s += kf("pp-hop", `0%,${pc(T.hop[0])}{transform:translateY(0)}${pc(9.0)}{transform:translateY(var(--hop1))}${pc(9.3)}{transform:translateY(0)}${pc(9.55)}{transform:translateY(var(--hop2))}${pc(T.hop[1])},100%{transform:translateY(0)}`);
  /* Bubbles: dim until their moment, then lit. Only Claude goes solid (it's the one we've verified). */
  BUBBLES.forEach((_, i) => {
    const t = T.lit[i], solid = i === 3;
    const lit = (dim: string, on: string) => `0%,${pc(t)}{fill:${dim}}${pc(t + 0.3)},${pc(T.fade[1])}{fill:${on}}100%{fill:${dim}}`;
    s += kf(`pp-bfill${i}`, lit(C.dimFill, solid ? C.mint : C.litFill));
    s += kf(`pp-bstroke${i}`, `0%,${pc(t)}{stroke:${C.dimStroke}}${pc(t + 0.3)},${pc(T.fade[1])}{stroke:${C.mint}}100%{stroke:${C.dimStroke}}`);
    s += kf(`pp-btext${i}`, lit(C.dimText, solid ? C.solidText : C.pale));
  });
  const floats: Array<[number, number]> = [[5.4, 0], [6.6, -2], [7.8, -4], [6.0, -1]];
  const a = (name: string) => `${name} ${D}s linear infinite`;
  s += `.pp{animation:${a("pp-clock")}}`;
  s += `.pp-grp{animation:${a("pp-grp")}}.pp-dh{animation:${a("pp-dh")}}.pp-dv{animation:${a("pp-dv")}}.pp-db{animation:${a("pp-db")}}`;
  s += `.pp-joint{transform-box:fill-box;transform-origin:center;animation:${a("pp-pop")}}`;
  s += `.pp-fl0{animation:${a("pp-fl0")}}.pp-fl1{animation:${a("pp-fl1")}}.pp-fl2{animation:${a("pp-fl2")}}`;
  s += `.pp-bfade{animation:${a("pp-bf")}}.pp-badge{animation:${a("pp-badge")}}.pp-cap{animation:${a("pp-cap")}}`;
  s += `.pp-s1{animation:${a("pp-s1")}}.pp-s2{animation:${a("pp-s2")}}.pp-door{animation:${a("pp-door")}}`;
  s += `.pp-star{animation:pp-tw 3.4s ease-in-out infinite}.pp-star:nth-child(2n){animation-duration:4.6s;animation-delay:-1.2s}`;
  BUBBLES.forEach((_, i) => {
    s += `.pp-b${i}{animation:${a(`pp-bfill${i}`)},${a(`pp-bstroke${i}`)}}.pp-t${i}{animation:${a(`pp-btext${i}`)}}`;
    s += `.pp-float${i}{animation:pp-fl ${floats[i][0]}s ease-in-out ${floats[i][1]}s infinite alternate}`;
  });
  s += `.pp-sh{animation:${a("pp-sh-fade")},${a("pp-sh-walk")},${a("pp-sh-amp")}}`;
  s += `.pp-bob{animation:pp-bob .59s ease-in-out infinite}.pp-hop{animation:pp-hop ${D}s ease-in-out infinite}`;
  /* Reduced motion: freeze at the 13 s mark (all drawn, bubbles lit, caption up, Shorty at the elbow, no stubs). */
  s += `@media (prefers-reduced-motion: reduce){.pp,.pp *{animation-play-state:paused !important;animation-delay:-13s !important}.pp-stub{display:none}}`;
  return s;
}
const CSS = buildCss();

/* ── Media queries as external stores (desktop geometry from 900px up) ───── */
const mq = (q: string) => ({
  subscribe: (cb: () => void) => { const m = window.matchMedia(q); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); },
  get: () => window.matchMedia(q).matches,
});
const DESK = mq("(min-width: 900px)");
const REDUCED = mq("(prefers-reduced-motion: reduce)");

/** Reads the CSS loop's clock: Shorty's pose, and keeps the SMIL stubs in step with it. */
function useSceneClock(root: RefObject<HTMLDivElement | null>, front: RefObject<SVGSVGElement | null>, active: boolean, reduced: boolean): MascotMood {
  const [mood, setMood] = useState<MascotMood>("wait");
  useEffect(() => {
    if (!active || reduced) return;
    let raf = 0, last = 0;
    const tick = (now: number) => {
      const el = root.current;
      const clock = el?.getAnimations().find((x) => (x as CSSAnimation).animationName === "pp-clock");
      const prog = clock?.effect?.getComputedTiming().progress;
      if (typeof prog === "number") {
        const t = prog * D;
        setMood((m) => { const next = moodAt(t); return m === next ? m : next; });
        const svg = front.current;
        if (svg && now - last > 2000) {
          last = now;
          const drift = (((svg.getCurrentTime() % D) - t + 27) % D) - 9;
          if (Math.abs(drift) > 0.12) svg.setCurrentTime(t);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [root, front, active, reduced]);
  return reduced ? "wait" : mood;
}

/* ── Shapes ───────────────────────────────────────────────────────────────── */
const bubblePath = (x: number, y: number, w: number, h: number, r: number, t: number) => {
  const cy = y + h / 2;
  return `M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h} H${x + r} A${r} ${r} 0 0 1 ${x} ${y + h - r} V${cy + t * 0.7} L${x - t} ${cy} L${x} ${cy - t * 0.7} V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`;
};
const stubPath = (w: number, h: number, r: number, n: number) =>
  `M${r} 0 H${w - r} Q${w} 0 ${w} ${r} V${h / 2 - n} A${n} ${n} 0 0 0 ${w} ${h / 2 + n} V${h - r} Q${w} ${h} ${w - r} ${h} H${r} Q0 ${h} 0 ${h - r} V${h / 2 + n} A${n} ${n} 0 0 0 0 ${h / 2 - n} V${r} Q0 0 ${r} 0 Z`;

function Shop({ g }: { g: Geo }) {
  const s = g.shop, w = s.x1 - s.x0, bodyTop = s.roofY + 6;
  const seg = w / (s.flaps * 2);
  const boardBottom = s.roofY - 8 - s.post, boardTop = boardBottom - s.board;
  const bx = s.x0 + w * 0.055, bw = w * 0.9, mid = bx + bw / 2;
  const flap = (x: number) => `M${x} ${bodyTop} H${x + seg} V${bodyTop + s.awn - seg / 2} A${seg / 2} ${seg / 2} 0 0 1 ${x} ${bodyTop + s.awn - seg / 2} Z`;
  const [wx, wy, ww, wh] = s.win, [dx, dw, dh] = s.door, k = g.boardTitle / 30;
  return (
    <>
    <g filter="url(#pp-paper)">
      <rect x={s.x0 + w * 0.245} y={boardBottom} width={w * 0.028} height={s.post + 8} fill={C.dimText} />
      <rect x={s.x0 + w * 0.727} y={boardBottom} width={w * 0.028} height={s.post + 8} fill={C.dimText} />
      <rect x={bx} y={boardTop} width={bw} height={s.board} rx={6} fill={C.cream} />
      <rect x={bx + 6} y={boardTop + 6} width={bw - 12} height={s.board - 12} rx={4} fill="none" stroke={C.mint} strokeWidth={3} />
      <rect x={s.x0 - 6} y={s.roofY - 8} width={w + 12} height={14} fill={C.roof} />
      <rect x={s.x0} y={bodyTop} width={w} height={g.ground - bodyTop} fill={C.cream} />
      <rect x={s.x0} y={g.ground - s.band} width={w} height={s.band} fill={C.band} />
      {Array.from({ length: s.flaps * 2 }, (_, i) => <path key={i} d={flap(s.x0 + i * seg)} fill={i % 2 === 0 ? C.mint : C.band} />)}
      <rect x={s.x0 + wx} y={s.roofY + wy} width={ww} height={wh} fill={C.dimStroke} stroke={C.bg} strokeWidth={3} />
      <rect className="pp-door" x={dx} y={g.ground - dh} width={dw} height={dh} rx={3} fill={C.door} />
      <circle cx={dx + dw - 8} cy={g.ground - dh * 0.42} r={Math.max(2, dw * 0.05)} fill={C.dimText} />
      {/* ink linework, like the hero scenes: window bars and glint, door panels, awning stitch, a hand-drawn underline */}
      <g fill="none" strokeLinecap="round">
        <path d={`M${s.x0 + wx + ww / 2} ${s.roofY + wy} V${s.roofY + wy + wh} M${s.x0 + wx} ${s.roofY + wy + wh / 2} H${s.x0 + wx + ww}`} stroke={C.bg} strokeWidth={3} />
        <path d={`M${s.x0 + wx + ww * 0.12} ${s.roofY + wy + wh * 0.2} l${ww * 0.12} ${-wh * 0.1}`} stroke={C.cream} strokeOpacity={0.5} strokeWidth={2} />
        <rect x={dx + 5} y={g.ground - dh + 7} width={dw - 10} height={dh * 0.36} rx={2} stroke={C.dimStroke} strokeWidth={2} />
        <rect x={dx + 5} y={g.ground - dh * 0.52} width={dw - 10} height={dh * 0.4} rx={2} stroke={C.dimStroke} strokeWidth={2} />
        <path d={`M${s.x0 + 3} ${bodyTop + 5} H${s.x1 - 3}`} stroke={C.roof} strokeOpacity={0.35} strokeWidth={1.4} strokeDasharray="4 4" />
        <path d={`M${s.x0} ${g.ground - s.band} H${s.x1}`} stroke={INK} strokeOpacity={0.45} strokeWidth={1.4} />
        <path d={`M${mid - 22 * k} ${boardTop + s.board * (g.boardSub.length > 1 ? 0.5 : 0.59)} q${4 * k} ${-3.5 * k} ${8 * k} 0 t${8 * k} 0 t${8 * k} 0 t${8 * k} 0 t${8 * k} 0`} stroke={INK} strokeWidth={1.5} />
      </g>
      {g.W > 600 && (
        <>
          <path d={`M${s.x0 - 28} ${g.ground - 24} H${s.x0 - 8} L${s.x0 - 11} ${g.ground} H${s.x0 - 25} Z`} fill="#D9825B" />
          <path d={`M${s.x0 - 18} ${g.ground - 24} Q${s.x0 - 38} ${g.ground - 36} ${s.x0 - 32} ${g.ground - 54} Q${s.x0 - 18} ${g.ground - 46} ${s.x0 - 18} ${g.ground - 24} Z M${s.x0 - 18} ${g.ground - 24} Q${s.x0 - 6} ${g.ground - 40} ${s.x0 - 10} ${g.ground - 58} Q${s.x0 - 22} ${g.ground - 42} ${s.x0 - 18} ${g.ground - 24} Z`} fill="#6F8F5B" />
        </>
      )}
    </g>
    {/* the words stay crisp: drawn on top of the torn paper, not through the filter */}
    <text x={mid} y={boardTop + s.board * (g.boardSub.length > 1 ? 0.42 : 0.5)} textAnchor="middle" fontSize={g.boardTitle} fill={C.bg} style={{ fontFamily: SERIF }}>Website</text>
    {g.boardSub.map((line, i) => (
      <text key={line} x={mid} y={boardTop + s.board * (g.boardSub.length > 1 ? 0.63 : 0.74) + i * (g.boardSubSize + 2.5)} textAnchor="middle" fontSize={g.boardSubSize} fontWeight={800} fill={C.bg} style={{ fontFamily: SANS }}>{line}</text>
    ))}
    </>
  );
}

function Pipes({ g }: { g: Geo }) {
  const { shop: s, pipeY: y, riserX: rx, pw } = g;
  const tops = g.bub.ys, branchEnd = g.bub.x - 6, off = pw * 0.27;
  const seg = (d: string, cls: string, key: string, hiShift: string) => (
    <g key={key}>
      <path d={d} pathLength={1} strokeDasharray="1 1" fill="none" stroke={C.dark} strokeWidth={pw + 6} className={cls} />
      <path d={d} pathLength={1} strokeDasharray="1 1" fill="none" stroke={C.mint} strokeWidth={pw} className={cls} />
      <path d={d} pathLength={1} strokeDasharray="1 1" fill="none" stroke="url(#pp-grain)" strokeOpacity={0.55} strokeWidth={pw} className={cls} style={{ mixBlendMode: "multiply" }} />
      <path d={d} pathLength={1} strokeDasharray="1 1" fill="none" stroke={C.hi} strokeOpacity={0.7} strokeWidth={Math.max(2, pw * 0.14)} transform={hiShift} className={cls} />
    </g>
  );
  const len = rx - s.x1, [fw, fh] = g.flange;
  return (
    <g className="pp-grp" filter="url(#pp-cut)">
      {seg(`M${s.x1} ${y} H${rx}`, "pp-dh", "h", `translate(0 ${-off})`)}
      {seg(`M${rx} ${y} V${tops[0]}`, "pp-dv", "v", `translate(${-off} 0)`)}
      {tops.map((ty) => seg(`M${rx} ${ty} H${branchEnd}`, "pp-db", `b${ty}`, `translate(0 ${-off})`))}
      <rect className="pp-fl0" x={s.x1 - 2} y={y - fh / 2} width={fw} height={fh} rx={2} fill={C.dark} />
      <rect className="pp-fl1" x={s.x1 + len * 0.328 - fw / 2} y={y - fh / 2} width={fw} height={fh} rx={2} fill={C.dark} />
      <rect className="pp-fl2" x={s.x1 + len * 0.661 - fw / 2} y={y - fh / 2} width={fw} height={fh} rx={2} fill={C.dark} />
      {[y, ...tops].map((jy) => (
        <g key={jy} className="pp-joint">
          <circle cx={rx} cy={jy} r={g.joint[0]} fill={C.dark} />
          <circle cx={rx} cy={jy} r={g.joint[1]} fill={C.mint} />
        </g>
      ))}
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
          <g key={bub.name} className="pp-bfade">
            <g className={`pp-float${i}`}>
              <g filter="url(#pp-cut)">
                <path className={`pp-b${i}`} d={bubblePath(b.x, top, b.w, b.h, b.r, b.tail)} fill={C.dimFill} stroke={C.dimStroke} strokeWidth={3} strokeLinejoin="round" />
                <path d={bubblePath(b.x, top, b.w, b.h, b.r, b.tail)} fill="url(#pp-grain)" fillOpacity={0.5} style={{ mixBlendMode: "multiply" }} />
              </g>
              <text className={`pp-t${i}`} x={b.x + b.pad} y={top + b.h * 0.45} fontSize={b.name} fontWeight={800} fill={C.dimText} style={{ fontFamily: SANS }}>{bub.name}</text>
              <text className={`pp-t${i}`} x={b.x + b.pad} y={top + b.h * 0.78} fontSize={b.cap} fontWeight={800} letterSpacing="0.14em" fill={C.dimText} style={{ fontFamily: SANS }}>{bub.cap}</text>
              {i === 3 && (
                <g className="pp-badge" opacity={0}>
                  <rect x={b.x + b.w - b.badge[0] - 14} y={top - b.badge[1] / 2} width={b.badge[0]} height={b.badge[1]} rx={b.badge[1] / 2} fill={C.amber} filter="url(#pp-cut)" />
                  <text x={b.x + b.w - b.badge[0] / 2 - 14} y={top + b.badge[2] * 0.36} textAnchor="middle" fontSize={b.badge[2]} fontWeight={800} letterSpacing="0.08em" fill={C.bg} style={{ fontFamily: SANS }}>LIVE NOW</text>
                </g>
              )}
            </g>
          </g>
        );
      })}
    </>
  );
}

function Backdrop({ g }: { g: Geo }) {
  return (
    <>
      <g filter="url(#pp-paper)">
        <circle cx={g.moon[0]} cy={g.moon[1]} r={g.moon[2]} fill={C.disc} />
        {g.clouds.map(([cx, cy, rx, ry]) => <ellipse key={`${cx}${cy}`} cx={cx} cy={cy} rx={rx} ry={ry} fill={C.cloud} />)}
        <rect x={0} y={g.ground} width={g.W} height={g.H - g.ground} fill="url(#pp-ground)" />
      </g>
      {g.stars.map(([x, y]) => <circle key={`${x}${y}`} className="pp-star" cx={x} cy={y} r={g.W > 600 ? 2.2 : 1.6} fill={C.amber} />)}
      <path d={`M0 ${g.ground} H${g.W}`} stroke="url(#pp-ground-line)" strokeWidth={2} />
    </>
  );
}

/** The dashed grey route: the connection that doesn't exist yet. Always visible. */
function Route({ g }: { g: Geo }) {
  const d = `M${g.shop.x1} ${g.pipeY} H${g.riserX} V${g.bub.ys[0]}` + g.bub.ys.map((y) => ` M${g.riserX} ${y} H${g.bub.x - 6}`).join("");
  return <path d={d} fill="none" stroke={C.dimStroke} strokeWidth={Math.max(2, g.pw * 0.2)} strokeDasharray="9 8" />;
}

function Stubs({ g, svgRef }: { g: Geo; svgRef: RefObject<SVGSVGElement | null> }) {
  const doorCx = g.shop.door[0] + g.shop.door[1] / 2;
  const stubs = [
    { label: "plumber · Saturday", y: g.bub.ys[3], times: T.stub1, cls: "pp-s1" },
    { label: "pizza · pickup 5pm", y: g.bub.ys[1], times: T.stub2, cls: "pp-s2" },
  ];
  const { w, h, font } = g.stub;
  return (
    <svg ref={svgRef} viewBox={`0 0 ${g.W} ${g.H}`} aria-hidden="true" className="pp-stub pointer-events-none absolute inset-0 h-full w-full" style={{ fontFamily: SANS }}>
      {stubs.map((s) => (
        <g key={s.cls} className={s.cls} opacity={0}>
          <animateMotion
            dur={`${D}s`} repeatCount="indefinite" calcMode="linear" keyPoints="0;0;1;1"
            keyTimes={`0;${s.times[0] / D};${s.times[1] / D};1`}
            path={`M${g.bub.x + 14} ${s.y} H${g.riserX} V${g.pipeY} H${doorCx}`}
          />
          <g transform={`translate(${-w / 2} ${-h / 2})`}>
            <g filter="url(#pp-cut)">
              <path d={stubPath(w, h, 6, h * 0.2)} fill={C.cream} />
              <path d={stubPath(w, h, 6, h * 0.2)} fill="url(#pp-grain)" fillOpacity={0.5} style={{ mixBlendMode: "multiply" }} />
            </g>
            <text x={w / 2} y={h / 2 + font * 0.36} textAnchor="middle" fontSize={font} fontWeight={800} fill={C.bg}>{s.label}</text>
          </g>
        </g>
      ))}
    </svg>
  );
}

/* ── The scene ────────────────────────────────────────────────────────────── */
function PipesScene() {
  const desk = useSyncExternalStore(DESK.subscribe, DESK.get, () => true);
  const reduced = useSyncExternalStore(REDUCED.subscribe, REDUCED.get, () => false);
  const g = desk ? DESKTOP : MOBILE;
  const root = useRef<HTMLDivElement | null>(null);
  const front = useRef<SVGSVGElement | null>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, [desk]);
  const mood = useSceneClock(root, front, active, reduced);

  const { boxW, dx, hop } = g.shorty;
  const boxH = (boxW * 318) / 316;
  const shortyStyle = {
    left: `${((g.shop.x1 + dx - boxW / 2) / g.W) * 100}%`,
    top: `${((g.ground - 0.937 * boxH) / g.H) * 100}%`,
    width: `${(boxW / g.W) * 100}%`,
    "--walk": `${(((g.riserX - g.shop.x1) / boxW) * 100).toFixed(2)}%`,
    "--hop1": hop[0], "--hop2": hop[1],
  } as CSSProperties;

  return (
    <div ref={root} key={desk ? "d" : "m"} className="pp relative w-full" style={{ aspectRatio: `${g.W} / ${g.H}` }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <svg
        viewBox={`0 0 ${g.W} ${g.H}`} role="img" className="absolute inset-0 h-full w-full overflow-hidden"
        aria-label="Shorty lays a pipe from a business, which only has a billboard, to the AI assistants, so they can reach it"
        style={{ fontFamily: SANS }}
      >
        <defs>
          <linearGradient id="pp-ground" gradientUnits="userSpaceOnUse" x1={0} x2={g.W} y1={0} y2={0}>
            <stop offset="0" stopColor={C.ground} stopOpacity={0} /><stop offset="0.07" stopColor={C.ground} /><stop offset="0.93" stopColor={C.ground} /><stop offset="1" stopColor={C.ground} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="pp-ground-line" gradientUnits="userSpaceOnUse" x1={0} x2={g.W} y1={0} y2={0}>
            <stop offset="0" stopColor={C.dimStroke} stopOpacity={0} /><stop offset="0.07" stopColor={C.dimStroke} /><stop offset="0.93" stopColor={C.dimStroke} /><stop offset="1" stopColor={C.dimStroke} stopOpacity={0} />
          </linearGradient>
          <pattern id="pp-grain" patternUnits="userSpaceOnUse" width={160} height={160}>
            <image href={GRAIN_URL} width={160} height={160} />
          </pattern>
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
          {/* Moving art (pipes, bubbles, stubs): a light torn edge + the same shadow; grain comes from the overlay pattern. */}
          <filter id="pp-cut" x="-10%" y="-10%" width="125%" height="135%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={1} seed={5} result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale={2.4} xChannelSelector="R" yChannelSelector="G" result="torn" />
            <feDropShadow in="torn" dx="0" dy="5" stdDeviation="0" floodColor="#000" floodOpacity="0.38" />
          </filter>
        </defs>
        <Backdrop g={g} />
        <Route g={g} />
        <Shop g={g} />
        <text fontSize={g.note.size} fontWeight={800} fill={C.dimText} style={{ fontFamily: SANS }}>
          <tspan x={g.note.x} y={g.note.y}>Can be read.</tspan>
          <tspan x={g.note.x} y={g.note.y + g.note.lh}>Can’t be used.</tspan>
        </text>
        <Pipes g={g} />
        <Bubbles g={g} />
        <text className="pp-cap" textAnchor="middle" fontSize={g.caption.size} fontWeight={800} fill={C.pale} opacity={0} style={{ fontFamily: SANS }}>
          {g.caption.lines.map((line, i) => <tspan key={line} x={g.caption.x} y={g.caption.ys[i]}>{line}</tspan>)}
        </text>
      </svg>
      {/* Shorty: the hero's own rig, in front of the pipe. */}
      <div aria-hidden="true" className="pp-sh pointer-events-none absolute" style={shortyStyle}>
        <div className="pp-bob">
          <div className="pp-hop relative">
            {active && (
              <>
                {/* The app's answer for dark surfaces: his ink is black, so a soft warm glow sits behind him. */}
                <div className="pointer-events-none absolute" style={{ left: "6%", top: "12%", width: "88%", height: "86%", background: "radial-gradient(ellipse farthest-side at 50% 60%, rgba(242,231,204,.66), rgba(242,231,204,.42) 48%, rgba(242,231,204,0))" }} />
                <ShortyMascot mood={mood} size={190} style={{ width: "100%", height: "auto", position: "relative" }} />
              </>
            )}
          </div>
        </div>
      </div>
      <Stubs g={g} svgRef={front} />
    </div>
  );
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
