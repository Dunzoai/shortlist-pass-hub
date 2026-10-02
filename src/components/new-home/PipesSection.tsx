"use client";

/**
 * The "pipes" chapter, below the hero on /new: one still picture.
 * A shop with its lights off, the AI assistants on the right plugged into a pipe that stops short of
 * it, and Shorty standing in the gap holding the pipe that will connect them. Cut-paper, like the
 * hero scenes; Shorty is the hero's own ShortyMascot (drawn once, no loop). One scene component,
 * two geometries (DESKTOP / MOBILE).
 */
import { useSyncExternalStore } from "react";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";

const C = {
  bg: "#14161A", cream: "#F6F1E4", band: "#E8E1CD", mint: "#34D399", lmint: "#5FDDAE", pale: "#D7F5E8",
  amber: "#E2A43C", red: "#E8695D",
  dimFill: "#2A2E36", dimStroke: "#3A3F49", dimText: "#8D8A80",
  dark: "#1F9E73", hi: "#9DF0CC", door: "#3A3F49",
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
  sign: SignLine[]; squiggleY: number;
  pipeY: number; riserX: number; endX: number; pw: number; joint: [number, number]; flange: [number, number];
  bub: { x: number; w: number; h: number; r: number; tail: number; ys: number[]; name: number; cap: number; pad: number };
  note: { x: number; y: number; lh: number; size: number; lines: string[] };
  caption: { x: number; ys: number[]; size: number; lines: string[] };
  shorty: { boxW: number; cx: number };
  stars: Array<[number, number]>; clouds: Array<[number, number, number, number]>; moon: [number, number, number];
};

const DESKTOP: Geo = {
  W: 1200, H: 596, ground: 506,
  shop: { x0: 40, x1: 330, roofY: 262, awn: 58, flaps: 4, board: 82, post: 31, win: [29, 91, 112, 85], door: [243, 60, 108], band: 93 },
  sign: [{ t: "Website", y: 0.5, size: 30, serif: true }, { t: "Instagram · Facebook", y: 0.74, size: 13 }], squiggleY: 0.59,
  pipeY: 478, riserX: 900, endX: 706, pw: 22, joint: [17, 10], flange: [10, 36],
  bub: { x: 962, w: 218, h: 64, r: 22, tail: 12, ys: [120, 210, 300, 390], name: 25, cap: 11.5, pad: 26 },
  note: { x: 42, y: 90, lh: 25, size: 21, lines: ["Your business can be read", "but not used by agents."] },
  caption: { x: 615, ys: [566], size: 22, lines: ["Can’t connect. Searching for a new business…"] },
  shorty: { boxW: 300, cx: 612 },
  stars: [[517, 45], [794, 33], [661, 177], [445, 200], [250, 40]],
  clouds: [[630, 118, 130, 30], [760, 150, 100, 22]],
  moon: [990, 236, 214],
};

const MOBILE: Geo = {
  W: 360, H: 560, ground: 500,
  shop: { x0: 8, x1: 112, roofY: 318, awn: 34, flaps: 3, board: 66, post: 18, win: [8, 52, 40, 44], door: [78, 26, 62], band: 56 },
  sign: [{ t: "Website", y: 0.42, size: 17, serif: true }, { t: "Instagram ·", y: 0.63, size: 8 }, { t: "Facebook", y: 0.79, size: 8 }], squiggleY: 0.5,
  pipeY: 476, riserX: 244, endX: 192, pw: 14, joint: [11, 6.5], flange: [7, 24],
  bub: { x: 256, w: 98, h: 52, r: 18, tail: 8, ys: [70, 148, 226, 304], name: 15, cap: 9, pad: 12 },
  note: { x: 8, y: 178, lh: 15, size: 12, lines: ["Your business can be read", "but not used by agents."] },
  caption: { x: 180, ys: [524, 540], size: 12.5, lines: ["Can’t connect.", "Searching for a new business…"] },
  shorty: { boxW: 160, cx: 135 },
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

/* ── Media query as an external store (desktop geometry from 900px up) ───── */
const DESK = {
  subscribe: (cb: () => void) => { const m = window.matchMedia("(min-width: 900px)"); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); },
  get: () => window.matchMedia("(min-width: 900px)").matches,
};

/* ── Shapes ───────────────────────────────────────────────────────────────── */
const bubblePath = (x: number, y: number, w: number, h: number, r: number, t: number) => {
  const cy = y + h / 2;
  return `M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h} H${x + r} A${r} ${r} 0 0 1 ${x} ${y + h - r} V${cy + t * 0.7} L${x - t} ${cy} L${x} ${cy - t * 0.7} V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`;
};

const board = (g: Geo) => {
  const s = g.shop, w = s.x1 - s.x0;
  const bottom = s.roofY - 8 - s.post, top = bottom - s.board, bx = s.x0 + w * 0.055, bw = w * 0.9;
  return { top, bottom, bx, bw, mid: bx + bw / 2, h: s.board };
};

function Backdrop({ g }: { g: Geo }) {
  return (
    <>
      <circle cx={g.moon[0]} cy={g.moon[1]} r={g.moon[2]} fill={C.disc} />
      {g.clouds.map(([cx, cy, rx, ry]) => <ellipse key={`${cx}${cy}`} cx={cx} cy={cy} rx={rx} ry={ry} fill={C.cloud} />)}
      <rect x={0} y={g.ground} width={g.W} height={g.H - g.ground} fill="url(#pp-ground)" />
      {g.stars.map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={g.W > 600 ? 2.2 : 1.6} fill={C.amber} opacity={0.6} />)}
      <path d={`M0 ${g.ground} H${g.W}`} stroke="url(#pp-ground-line)" strokeWidth={2} />
    </>
  );
}

/** The shop, lights off: dark window, dark door, the sign still says Website. */
function Shop({ g }: { g: Geo }) {
  const s = g.shop, w = s.x1 - s.x0, bodyTop = s.roofY + 6;
  const seg = w / (s.flaps * 2), b = board(g), k = g.sign[0].size / 30;
  const flap = (x: number) => `M${x} ${bodyTop} H${x + seg} V${bodyTop + s.awn - seg / 2} A${seg / 2} ${seg / 2} 0 0 1 ${x} ${bodyTop + s.awn - seg / 2} Z`;
  const [wx, wy, ww, wh] = s.win, [dx, dw, dh] = s.door;
  return (
    <>
      <g filter="url(#pp-paper)">
        <rect x={s.x0 + w * 0.245} y={b.bottom} width={w * 0.028} height={s.post + 8} fill={C.dimText} />
        <rect x={s.x0 + w * 0.727} y={b.bottom} width={w * 0.028} height={s.post + 8} fill={C.dimText} />
        <rect x={b.bx} y={b.top} width={b.bw} height={b.h} rx={6} fill={C.cream} />
        <rect x={b.bx + 6} y={b.top + 6} width={b.bw - 12} height={b.h - 12} rx={4} fill="none" stroke={C.mint} strokeWidth={3} />
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
      {/* the words stay crisp: drawn on top of the torn paper */}
      {g.sign.map((l) => (
        <text key={l.t} x={b.mid} y={b.top + b.h * l.y} textAnchor="middle" fontSize={l.size} fontWeight={l.serif ? 400 : 800} fill={C.bg} style={{ fontFamily: l.serif ? SERIF : SANS }}>{l.t}</text>
      ))}
      <path d={`M${b.mid - 22 * k} ${b.top + b.h * g.squiggleY} q${4 * k} ${-3.5 * k} ${8 * k} 0 t${8 * k} 0 t${8 * k} 0 t${8 * k} 0 t${8 * k} 0`} fill="none" stroke={INK} strokeWidth={1.5} strokeLinecap="round" />
    </>
  );
}

function PipeLine({ d, pw, hi }: { d: string; pw: number; hi: string }) {
  return (
    <g fill="none">
      <path d={d} stroke={C.dark} strokeWidth={pw + 6} />
      <path d={d} stroke={C.mint} strokeWidth={pw} />
      <path d={d} stroke="url(#pp-grain)" strokeOpacity={0.55} strokeWidth={pw} />
      <path d={d} stroke={C.hi} strokeOpacity={0.7} strokeWidth={Math.max(2, pw * 0.14)} transform={hi} />
    </g>
  );
}

/** What's already there: the riser, four branches to the agents, and a stub that stops short of the shop. */
function Pipes({ g }: { g: Geo }) {
  const { pipeY: y, riserX: rx, endX, pw } = g;
  const tops = g.bub.ys, branchEnd = g.bub.x - 6, off = pw * 0.27, [fw, fh] = g.flange;
  const flange = (x: number) => <rect key={x} x={x - fw / 2} y={y - fh / 2} width={fw} height={fh} rx={2} fill={C.dark} />;
  return (
    <g filter="url(#pp-cut)">
      <PipeLine d={`M${rx} ${y} V${tops[0]}`} pw={pw} hi={`translate(${-off} 0)`} />
      {tops.map((ty) => <PipeLine key={ty} d={`M${rx} ${ty} H${branchEnd}`} pw={pw} hi={`translate(0 ${-off})`} />)}
      <PipeLine d={`M${rx} ${y} H${endX}`} pw={pw} hi={`translate(0 ${-off})`} />
      {flange(endX)}
      {flange(endX + (rx - endX) * 0.55)}
      {[y, ...tops].map((jy) => (
        <g key={jy}>
          <circle cx={rx} cy={jy} r={g.joint[0]} fill={C.dark} />
          <circle cx={rx} cy={jy} r={g.joint[1]} fill={C.mint} />
        </g>
      ))}
    </g>
  );
}

/** The AI assistants, plugged in but not yet able to reach anyone. */
function Bubbles({ g }: { g: Geo }) {
  const b = g.bub;
  return (
    <>
      {BUBBLES.map((bub, i) => {
        const top = b.ys[i] - b.h / 2;
        return (
          <g key={bub.name}>
            <g filter="url(#pp-cut)">
              <path d={bubblePath(b.x, top, b.w, b.h, b.r, b.tail)} fill={C.dimFill} stroke={C.dimStroke} strokeWidth={3} strokeLinejoin="round" />
              <path d={bubblePath(b.x, top, b.w, b.h, b.r, b.tail)} fill="url(#pp-grain)" fillOpacity={0.5} />
            </g>
            <text x={b.x + b.pad} y={top + b.h * 0.45} fontSize={b.name} fontWeight={800} fill={C.dimText} style={{ fontFamily: SANS }}>{bub.name}</text>
            <text x={b.x + b.pad} y={top + b.h * 0.78} fontSize={b.cap} fontWeight={800} letterSpacing="0.14em" fill={C.dimText} style={{ fontFamily: SANS }}>{bub.cap}</text>
          </g>
        );
      })}
    </>
  );
}

function StillScene({ g }: { g: Geo }) {
  const { boxW, cx } = g.shorty;
  const boxH = (boxW * 318) / 316, n = g.note, rot = `rotate(-5 ${n.x} ${n.y + n.lh})`;
  return (
    <div className="relative w-full" style={{ aspectRatio: `${g.W} / ${g.H}` }}>
      {/* back layer: backdrop, the dark shop, the words */}
      <svg
        viewBox={`0 0 ${g.W} ${g.H}`} role="img" className="absolute inset-0 h-full w-full overflow-hidden" style={{ fontFamily: SANS }}
        aria-label="A shop with its lights off, and Shorty holding a length of pipe. The AI assistants on the right are plugged into a pipe that stops short of the shop, so they can read the business but not use it."
      >
        <defs>
          <pattern id="pp-grain" patternUnits="userSpaceOnUse" width={160} height={160}>
            <image href={GRAIN_URL} width={160} height={160} />
          </pattern>
          <linearGradient id="pp-ground" gradientUnits="userSpaceOnUse" x1={0} x2={g.W} y1={0} y2={0}>
            <stop offset="0" stopColor={C.ground} stopOpacity={0} /><stop offset="0.07" stopColor={C.ground} /><stop offset="0.93" stopColor={C.ground} /><stop offset="1" stopColor={C.ground} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="pp-ground-line" gradientUnits="userSpaceOnUse" x1={0} x2={g.W} y1={0} y2={0}>
            <stop offset="0" stopColor={C.dimStroke} stopOpacity={0} /><stop offset="0.07" stopColor={C.dimStroke} /><stop offset="0.93" stopColor={C.dimStroke} /><stop offset="1" stopColor={C.dimStroke} stopOpacity={0} />
          </linearGradient>
          {/* Torn edges + grain + the hard offset shadow (the hero scenes' technique). */}
          <filter id="pp-paper" x="-8%" y="-8%" width="116%" height="124%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={2} seed={7} result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale={3.2} xChannelSelector="R" yChannelSelector="G" result="torn" />
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} result="fine" />
            <feColorMatrix in="fine" type="matrix" values="0 0 0 0 0.08  0 0 0 0 0.07  0 0 0 0 0.05  0.42 0 0 0 -0.16" result="specks" />
            <feComposite in="specks" in2="torn" operator="in" result="grain" />
            <feMerge result="sheet"><feMergeNode in="torn" /><feMergeNode in="grain" /></feMerge>
            <feDropShadow in="sheet" dx="0" dy="5" stdDeviation="0" floodColor="#000" floodOpacity="0.38" />
          </filter>
          <filter id="pp-cut" x="-10%" y="-10%" width="125%" height="135%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={1} seed={5} result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale={2.4} xChannelSelector="R" yChannelSelector="G" result="torn" />
            <feDropShadow in="torn" dx="0" dy="5" stdDeviation="0" floodColor="#000" floodOpacity="0.38" />
          </filter>
        </defs>
        <Backdrop g={g} />
        <path d={`M${g.shop.x1} ${g.pipeY} H${g.endX}`} fill="none" stroke={C.dimStroke} strokeWidth={Math.max(2, g.pw * 0.2)} strokeDasharray="9 8" />
        <Shop g={g} />
        <text fontSize={n.size} fontWeight={800} fill={C.red} transform={rot} style={{ fontFamily: SANS }}>
          {n.lines.map((line, i) => <tspan key={line} x={n.x} y={n.y + i * n.lh}>{line}</tspan>)}
        </text>
        <text textAnchor="middle" fontSize={g.caption.size} fontWeight={800} fill={C.amber} style={{ fontFamily: SANS }}>
          {g.caption.lines.map((line, i) => <tspan key={line} x={g.caption.x} y={g.caption.ys[i]}>{line}</tspan>)}
        </text>
      </svg>

      {/* Shorty, holding the pipe. The hero's own rig, drawn once. */}
      <div
        aria-hidden="true" className="pointer-events-none absolute"
        style={{ left: `${((cx - boxW / 2) / g.W) * 100}%`, top: `${((g.ground - 0.937 * boxH) / g.H) * 100}%`, width: `${(boxW / g.W) * 100}%` }}
      >
        {/* The app's answer for dark surfaces: his ink is black, so a soft warm glow sits behind him. */}
        <div className="pointer-events-none absolute" style={{ left: "6%", top: "12%", width: "88%", height: "86%", background: "radial-gradient(ellipse farthest-side at 50% 60%, rgba(242,231,204,.66), rgba(242,231,204,.42) 48%, rgba(242,231,204,0))" }} />
        <ShortyMascot mood="carry" still size={190} style={{ width: "100%", height: "auto", position: "relative" }} />
      </div>

      {/* front layer: the pipe and the agents */}
      <svg viewBox={`0 0 ${g.W} ${g.H}`} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" style={{ fontFamily: SANS }}>
        <Pipes g={g} />
        <Bubbles g={g} />
      </svg>
    </div>
  );
}

function PipesScene() {
  const desk = useSyncExternalStore(DESK.subscribe, DESK.get, () => true);
  return <StillScene g={desk ? DESKTOP : MOBILE} />;
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
