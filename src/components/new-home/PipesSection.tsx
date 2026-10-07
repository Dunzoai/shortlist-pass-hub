"use client";

/**
 * "AI agents are here": the headline sits in its own black strip, the lead-in to a mint scene, in both
 * the Businesses and HOAs views. Shorty (the hero's own ShortyMascot, `carry` pose, drawn once) holds a
 * pipe at an angle between a small shop (further back) and the AI agents card. Two paper text-message
 * bubbles ask the questions people are about to ask an AI: one above the shop, one by the agents.
 * Everything that isn't Shorty is SVG laid over his drawing in the SAME units, so the pieces track the
 * pipe ends exactly. The cards, bubbles, tiles and pipe are cut paper (torn edge, grain, hard offset
 * shadow) like the hero scenes. No animation.
 */
import { useEffect, useRef, useSyncExternalStore } from "react";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import { CARRY_TILT, carryPose } from "@/lib/shorty/mascot/poses";
import { pipeEnds } from "@/lib/shorty/mascot/rig";
import { AI_LOGOS } from "./aiLogos";
import { useAudience, type Audience } from "./audience";

const INK = "#14161A";
const CREAM = "#FBF6E6";
const AMBER = "#E2A43C";
const SANS = "var(--font-sora), system-ui, sans-serif";
const SERIF = "var(--font-fraunces), Georgia, serif";

/* Paper grain: the same noise the hero's bubbles and scenes use. */
const GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/** Mint with some paper in it: a lighter wash top-left, a deeper one bottom-right, and grain over everything. */
const MINT_BG =
  "radial-gradient(900px 520px at 12% 8%, rgba(255,255,255,.28), rgba(255,255,255,0) 62%), radial-gradient(1000px 560px at 92% 96%, rgba(8,70,48,.16), rgba(8,70,48,0) 62%), #5FDDAE";

/* ── Words, by mode. Bubble lines are [desktop, phone]. ───────────────────── */
type Lines = [string[], string[]];
const MODES: Record<Audience, { headline: [string, string]; sign: [string, string]; agentBubble: Lines; shopBubble: Lines; socialBubble: string[] }> = {
  business: {
    headline: ["AI agents are here.", "Your business can’t reach them."],
    sign: ["RISE", "BAKERY"],
    agentBubble: [["Can you find me a plumber", "for Saturday at 7pm?"], ["Can you find me", "a plumber for", "Saturday at 7pm?"]],
    shopBubble: [["Can you order me a dozen", "bagels for pickup?"], ["Can you order me", "a dozen bagels", "for pickup?"]],
    socialBubble: ["Which brewery", "has music bingo", "this week?"],   // phones only: there's room bottom right of Shorty
  },
  hoa: {
    headline: ["Your residents are about to ask an AI.", "Does it know your rules?"],
    sign: ["HERON", "POINT HOA"],
    agentBubble: [["Can you RSVP me", "for bingo?"], ["Can you RSVP me", "for bingo?"]],
    shopBubble: [["Can I put up", "a shed?"], ["Can I put up", "a shed?"]],
    socialBubble: ["Who’s hosting", "the block party", "this weekend?"],
  },
};

const AGENTS = [
  { key: "openai", name: "Dots", color: "#14161A" },
  { key: "meta", name: "Muse", color: "#0866FF" },
  { key: "grok", name: "Grok", color: "#14161A" },
  { key: "claude", name: "Claude", color: "#D97757", live: true },   // the only one we've verified as connected
] as const;

/* Shorty's drawing box, in his own units (frame.ts): x -95…221, y -66…252. */
const BOX = { x: -95, y: -66, w: 316, h: 318 };

/* The pipe he's carrying: centre (63,150), half-length 85 (with the flanges), tilted CARRY_TILT degrees. */
const TH = (CARRY_TILT * Math.PI) / 180, COS = Math.cos(TH), SIN = Math.sin(TH);
const END_L: [number, number] = [63 - 85 * COS, 150 - 85 * SIN];   // low end, toward the shop
const END_R: [number, number] = [63 + 85 * COS, 150 + 85 * SIN];   // raised end, toward the AI agents

/** Where the small shop's ground is: higher than Shorty's feet (y 231), so it reads as further back. */
const SHOP_GROUND = 216;

type Geo = {
  phone: boolean;
  vb: [number, number, number, number];
  arrow: { start: number; len: number; sw: number };
  shop: { bodyW: number; bodyH: number; signW: number; signH: number; signFont: number; flaps: number; awn: number; post: number };
  card: { w: number; pad: number; head: number; headFont: number; cols: number; tile: [number, number]; gap: number; logo: number; name: number; lift: number; center?: [number, number]; tilt: number };
  bubble: { font: number; charW: number; agent: { x: number; y: number; tail: "up" | "down" }; social?: { x: number; y: number } };
};

const DESKTOP: Geo = {
  phone: false,
  vb: [-215, -72, 600, 344],
  arrow: { start: 22, len: 46, sw: 7 },
  shop: { bodyW: 84, bodyH: 80, signW: 104, signH: 44, signFont: 14, flaps: 4, awn: 20, post: 12 },
  card: { w: 154, pad: 13, head: 26, headFont: 14, cols: 2, tile: [57, 70], gap: 8, logo: 32, name: 12, lift: 14, tilt: 2 },
  bubble: { font: 10.6, charW: 6.1, agent: { x: 303, y: -70, tail: "down" } },
};
/* Phones: the agents card spans the screen under the headline; Shorty and the shop sit below it. */
const MOBILE: Geo = {
  phone: true,
  vb: [-150, -202, 466, 474],
  arrow: { start: 14, len: 24, sw: 5 },
  shop: { bodyW: 62, bodyH: 56, signW: 84, signH: 38, signFont: 12, flaps: 3, awn: 15, post: 9 },
  card: { w: 472, pad: 12, head: 26, headFont: 15, cols: 4, tile: [106, 100], gap: 8, logo: 48, name: 14, lift: 0, center: [83, -202 + 4 + 150 / 2], tilt: 1 },
  bubble: { font: 11.2, charW: 6.7, agent: { x: 248, y: 22, tail: "up" }, social: { x: 250, y: 168 } },
};

const DESK = {
  subscribe: (cb: () => void) => { const m = window.matchMedia("(min-width: 900px)"); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); },
  get: () => window.matchMedia("(min-width: 900px)").matches,
};

/* ── The two lines to the pipe. Their tails are fixed (at the shop, at the AI agents card); their heads ride
      the pipe's ends, so they sway with it. Both read the same sway the mascot does (carryPose). ───────── */
const STILL_T = 0.4;   // the moment drawn when motion is reduced (the carry pose's still frame)
type Pt = [number, number];
const unit = (a: Pt, b: Pt): Pt => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
/** Pipe → shop: an arrow pointing out to the bakery. Its head is fixed at the shop; its tail sits a small gap off the pipe's left end. */
function shopArrowD(tip: Pt, t: number, sw: number, gap: number): string {
  const L = pipeEnds(carryPose(t)).L, u = unit(L, tip), tail: Pt = [L[0] + u[0] * gap, L[1] + u[1] * gap], head = sw * 2.4;
  const wing = (a: number): Pt => [tip[0] - (u[0] * Math.cos(a) - u[1] * Math.sin(a)) * head, tip[1] - (u[0] * Math.sin(a) + u[1] * Math.cos(a)) * head];
  const w1 = wing(0.62), w2 = wing(-0.62);
  return `M${tail[0].toFixed(1)} ${tail[1].toFixed(1)} L${tip[0].toFixed(1)} ${tip[1].toFixed(1)} M${w1[0].toFixed(1)} ${w1[1].toFixed(1)} L${tip[0].toFixed(1)} ${tip[1].toFixed(1)} L${w2[0].toFixed(1)} ${w2[1].toFixed(1)}`;
}
/**
 * AI agents → pipe: a plain, softly curved line. It stops short of the card AND short of the pipe's right end (a small
 * break at each, on purpose), and eases into the pipe's end along the pipe's own angle. On phones it hangs down from
 * under the card and curls in; on desktop it's a gentle S.
 */
function agentCurveD(tail: Pt, t: number, gap: number, phone: boolean): string {
  const { L, R } = pipeEnds(carryPose(t)), axis = unit(L, R), perp: Pt = [-axis[1], axis[0]];
  const E: Pt = [R[0] + axis[0] * gap, R[1] + axis[1] * gap];
  const c1: Pt = phone ? [tail[0], tail[1] + 52] : [tail[0] - axis[0] * 14 + perp[0] * 11, tail[1] - axis[1] * 14 + perp[1] * 11];
  const k = phone ? 30 : 14, c2: Pt = phone ? [E[0] + axis[0] * k, E[1] + axis[1] * k] : [E[0] + axis[0] * k + perp[0] * 11, E[1] + axis[1] * k + perp[1] * 11];
  const f = (v: Pt) => `${v[0].toFixed(1)} ${v[1].toFixed(1)}`;
  return `M${f(tail)} C${f(c1)} ${f(c2)} ${f(E)}`;
}

/** A cut-paper sheet: torn-edge cream with a hard shadow, then whatever's drawn on it. */
function PaperCard({ x, y, w, h, tilt, mark, children }: { x: number; y: number; w: number; h: number; tilt: number; mark?: string; children: React.ReactNode }) {
  const rx = Math.min(14, h * 0.2);
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`} data-agents={mark}>
      <g filter="url(#mc-paper)">
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={rx} fill={CREAM} />
      </g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={rx} fill="url(#mc-grain)" fillOpacity={0.14} />
      {children}
    </g>
  );
}

/** "searching…" with a magnifier, or "matched!" with a check: the little status line under a bubble. */
function StatusNote({ note, font, x, y }: { note: { kind: "search" | "match"; text: string }; font: number; x: number; y: number }) {
  const icon = font * 1.15, gap = font * 0.45, textW = note.text.length * font * 0.56, total = icon + gap + textW, x0 = -total / 2;
  const match = note.kind === "match", col = match ? "#0F5F43" : "#0A2A1D";
  return (
    <g data-agents="note" transform={`translate(${x} ${y})`}>
      {match ? (
        <>
          <circle cx={x0 + icon / 2} cy={-font * 0.34} r={icon / 2} fill="#0F5F43" />
          <path d={`M${x0 + icon * 0.27} ${-font * 0.34} l${icon * 0.17} ${icon * 0.19} l${icon * 0.32} ${-icon * 0.36}`} fill="none" stroke={CREAM} strokeWidth={font * 0.17} strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <g fill="none" stroke={col} strokeWidth={font * 0.17} strokeLinecap="round">
          <circle cx={x0 + icon * 0.42} cy={-font * 0.46} r={icon * 0.33} />
          <path d={`M${x0 + icon * 0.66} ${-font * 0.22} l${icon * 0.3} ${icon * 0.3}`} />
        </g>
      )}
      <text x={x0 + icon + gap} y={0} fontSize={font} fontWeight={match ? 800 : 700} fontStyle={match ? "normal" : "italic"} fill={col} fillOpacity={match ? 1 : 0.8} style={{ fontFamily: SANS }}>{note.text}</text>
    </g>
  );
}

/**
 * A paper text-message bubble: cream, torn edge, grain, hard shadow, and a tail toward what it's asking about.
 * (x, y) is where the tail leaves the bubble: its bottom edge for a down tail, its top edge for an up tail.
 */
function Bubble({ x, y, lines, font, charW, tail, tilt, mark, tailLen = 12, note }: { x: number; y: number; lines: string[]; font: number; charW: number; tail: "up" | "down"; tilt: number; mark: string; tailLen?: number; note?: { kind: "search" | "match"; text: string } }) {
  const w = Math.round(Math.max(...lines.map((l) => l.length)) * charW + 26), h = Math.round(lines.length * font * 1.3 + 20);
  const cy = tail === "down" ? y - h / 2 : y + h / 2;
  const edge = tail === "down" ? h / 2 : -h / 2, dir = tail === "down" ? 1 : -1;
  const rx = Math.min(16, h * 0.34), tx = (tail === "down" ? -1 : 1) * w * 0.14;
  return (
    <g transform={`translate(${x} ${cy}) rotate(${tilt})`} data-agents={mark}>
      <g filter="url(#mc-paper)">
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={rx} fill={CREAM} />
        <path d={`M${tx - 8} ${edge - dir} L${tx + 9} ${edge - dir} L${tx - 3} ${edge + dir * tailLen} Z`} fill={CREAM} />
      </g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={rx} fill="url(#mc-grain)" fillOpacity={0.14} />
      <text textAnchor="middle" fontSize={font} fontWeight={700} fill={INK} style={{ fontFamily: SANS }}>
        {lines.map((l, i) => <tspan key={l} x={0} y={-h / 2 + 10 + font * 1.3 * (i + 0.78)}>{l}</tspan>)}
      </text>
      {note && <StatusNote note={note} font={font * 0.84} x={tail === "down" ? w * 0.2 : 0} y={h / 2 + font * 0.84 + 4} />}
    </g>
  );
}

/** A small shop with the business's name on its sign: paler, smaller and higher than Shorty, so it sits further back. */
function SmallShop({ cx, g, sign }: { cx: number; g: Geo; sign: [string, string] }) {
  const { bodyW: w, bodyH: h, signW, signH, signFont, flaps, awn, post } = g.shop;
  const x0 = cx - w / 2, top = SHOP_GROUND - h, seg = w / (flaps * 2);
  const boardBottom = top - 6 - post, boardTop = boardBottom - signH, bx = cx - signW / 2;
  const flap = (x: number) => `M${x} ${top + 2} H${x + seg} V${top + awn - seg / 2} A${seg / 2} ${seg / 2} 0 0 1 ${x} ${top + awn - seg / 2} Z`;
  const dw = w * 0.26, dh = h * 0.5, wx = x0 + w * 0.12, ww = w * 0.34, wy = top + awn + 6, wh = h * 0.32;
  const font = Math.min(signFont, (signW - 14) / (Math.max(...sign.map((l) => l.length)) * 0.7));
  return (
    <g>
      <ellipse cx={cx} cy={SHOP_GROUND + 1.5} rx={w * 0.62} ry={3} fill="#0A2A1D" fillOpacity={0.14} />
      <g filter="url(#mc-paper-far)">
        <rect x={cx - w * 0.3} y={boardBottom} width={3.4} height={post + 8} fill="#7E9C8E" />
        <rect x={cx + w * 0.3 - 3.4} y={boardBottom} width={3.4} height={post + 8} fill="#7E9C8E" />
        <rect x={bx} y={boardTop} width={signW} height={signH} rx={5} fill="#F1F7EE" />
        <rect x={bx + 4} y={boardTop + 4} width={signW - 8} height={signH - 8} rx={3} fill="none" stroke="#3FBF93" strokeWidth={2} />
        <rect x={x0 - 4} y={top - 6} width={w + 8} height={8} fill="#3C5B4E" />
        <rect x={x0} y={top} width={w} height={h} fill="#EAF3EA" />
        <rect x={x0} y={SHOP_GROUND - h * 0.28} width={w} height={h * 0.28} fill="#D6E7DB" />
        {Array.from({ length: flaps * 2 }, (_, i) => <path key={i} d={flap(x0 + i * seg)} fill={i % 2 === 0 ? "#43C79B" : "#D6E7DB"} />)}
        <rect x={wx} y={wy} width={ww} height={wh} fill="#8CCBB2" stroke="#2F5144" strokeWidth={2} />
        <rect x={x0 + w * 0.6} y={SHOP_GROUND - dh} width={dw} height={dh} rx={2} fill="#5E9C84" />
      </g>
      <g fill="none" stroke="#2F5144" strokeWidth={1.8} strokeLinecap="round">
        <path d={`M${wx + ww / 2} ${wy} V${wy + wh} M${wx} ${wy + wh / 2} H${wx + ww}`} />
        <circle cx={x0 + w * 0.6 + dw - 5} cy={SHOP_GROUND - dh * 0.45} r={1.3} fill="#2F5144" />
      </g>
      <g data-agents="sign">
        <rect x={bx} y={boardTop} width={signW} height={signH} fill="none" />
        <text textAnchor="middle" fontSize={font} fontWeight={800} letterSpacing="0.05em" fill={INK} style={{ fontFamily: SANS }}>
          <tspan x={cx} y={boardTop + signH * 0.46}>{sign[0]}</tspan>
          <tspan x={cx} y={boardTop + signH * 0.84}>{sign[1]}</tspan>
        </text>
      </g>
    </g>
  );
}

function Scene({ g, mode }: { g: Geo; mode: Audience }) {
  const [vx, vy, vw, vh] = g.vb;
  const box = useRef<HTMLDivElement | null>(null);
  const clock = useRef(0);                                     // set by Shorty when his animation begins
  const lines = useRef<Array<SVGPathElement | null>>([]);     // [shop shadow, shop ink, agent shadow, agent ink]
  const M = MODES[mode], li = g.phone ? 1 : 0;
  const dirL: [number, number] = [-COS, -SIN], dirR: [number, number] = [COS, SIN];
  const { arrow: A, shop: S, card: K, bubble: B } = g;

  const baseL: [number, number] = [END_L[0] + dirL[0] * A.start, END_L[1] + dirL[1] * A.start];
  const tipL: [number, number] = [baseL[0] + dirL[0] * A.len, baseL[1] + dirL[1] * A.len];
  const shopCx = tipL[0] - 6 - S.bodyW / 2;   // the arrow points at its door side
  const signTop = SHOP_GROUND - S.bodyH - 6 - S.post - S.signH;

  const baseR: [number, number] = [END_R[0] + dirR[0] * A.start, END_R[1] + dirR[1] * A.start];
  const tipR: [number, number] = [baseR[0] + dirR[0] * A.len, baseR[1] + dirR[1] * A.len];
  const rows = Math.ceil(AGENTS.length / K.cols), cardH = K.pad * 2 + K.head + rows * K.tile[1] + (rows - 1) * K.gap;
  const cardC: [number, number] = K.center ?? [tipR[0] + dirR[0] * (8 + K.w / 2), tipR[1] + dirR[1] * (8 + K.w / 2) - K.lift];

  /* fixed ends: the arrow's head at the shop; the agents' line starts a little way off the card (breathing room), on the pipe's axis */
  const edgeX = cardC[0] - K.w / 2 - 14, cardLeftGap: Pt = [edgeX, END_R[1] + (edgeX - END_R[0]) * (SIN / COS)];
  const shopTip: Pt = tipL, GAP = g.phone ? 13 : 15, agentTail: Pt = g.phone ? [128, -34] : cardLeftGap;
  const dShop0 = shopArrowD(shopTip, STILL_T, A.sw, GAP), dAgent0 = agentCurveD(agentTail, STILL_T, GAP, g.phone);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const draw = (t: number) => {
      const a = shopArrowD(shopTip, t, A.sw, GAP), b = agentCurveD(agentTail, t, GAP, g.phone);
      lines.current[0]?.setAttribute("d", a); lines.current[1]?.setAttribute("d", a);
      lines.current[2]?.setAttribute("d", b); lines.current[3]?.setAttribute("d", b);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { draw(STILL_T); return; }
    let raf = 0, visible = true;
    const tick = () => {
      raf = 0;
      if (!visible) return;
      const now = performance.now() / 1000;
      draw(now - (clock.current || now));
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(tick); }, { rootMargin: "200px" });
    io.observe(el);
    raf = requestAnimationFrame(tick);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
    // the tails are fixed for this scene (it remounts when the geometry changes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct = (n: number, total: number) => `${(n / total) * 100}%`;
  const view = `${vx} ${vy} ${vw} ${vh}`;
  return (
    <div ref={box} className="relative mx-auto w-full" style={{ aspectRatio: `${vw} / ${vh}` }}>
      {/* back layer: the shop (further back than Shorty) and the shared paper filters */}
      <svg viewBox={view} className="absolute inset-0 h-full w-full overflow-visible" role="img"
        aria-label="Shorty holds a pipe that connects a small business, on the left, to the AI agents (Dots, Muse, Grok and Claude), on the right.">
        <defs>
          <pattern id="mc-grain" patternUnits="userSpaceOnUse" width={80} height={80}>
            <image href={GRAIN_URL} width={80} height={80} />
          </pattern>
          {/* Cut paper: torn edge + grain + a hard offset shadow (the hero scenes' technique). */}
          <filter id="mc-paper" x="-10%" y="-10%" width="125%" height="135%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves={2} seed={7} result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale={3.4} xChannelSelector="R" yChannelSelector="G" result="torn" />
            <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves={2} seed={3} result="fine" />
            <feColorMatrix in="fine" type="matrix" values="0 0 0 0 0.08  0 0 0 0 0.07  0 0 0 0 0.05  0.4 0 0 0 -0.15" result="specks" />
            <feComposite in="specks" in2="torn" operator="in" result="grain" />
            <feMerge result="sheet"><feMergeNode in="torn" /><feMergeNode in="grain" /></feMerge>
            <feDropShadow in="sheet" dx="3.4" dy="4.6" stdDeviation="0" floodColor="#0A2A1D" floodOpacity="0.5" />
          </filter>
          {/* The same paper, for things further back: a smaller, fainter shadow. */}
          <filter id="mc-paper-far" x="-10%" y="-10%" width="125%" height="130%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves={2} seed={11} result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale={2.6} xChannelSelector="R" yChannelSelector="G" result="torn" />
            <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves={2} seed={3} result="fine" />
            <feColorMatrix in="fine" type="matrix" values="0 0 0 0 0.08  0 0 0 0 0.07  0 0 0 0 0.05  0.3 0 0 0 -0.11" result="specks" />
            <feComposite in="specks" in2="torn" operator="in" result="grain" />
            <feMerge result="sheet"><feMergeNode in="torn" /><feMergeNode in="grain" /></feMerge>
            <feDropShadow in="sheet" dx="2" dy="2.8" stdDeviation="0" floodColor="#0A2A1D" floodOpacity="0.3" />
          </filter>
        </defs>
        <SmallShop cx={shopCx} g={g} sign={M.sign} />
      </svg>

      {/* the cream glow, and Shorty (the shared rig, drawn once) */}
      <div
        aria-hidden="true" className="pointer-events-none absolute" data-agents="shorty"
        style={{ left: pct(BOX.x - vx, vw), top: pct(BOX.y - vy, vh), width: pct(BOX.w, vw), height: pct(BOX.h, vh) }}
      >
        <div className="pointer-events-none absolute" style={{ left: "2%", top: "6%", width: "96%", height: "94%", background: "radial-gradient(ellipse closest-side at 50% 55%, rgba(251,246,230,.95), rgba(251,246,230,.6) 55%, rgba(251,246,230,0))" }} />
        <ShortyMascot mood="carry" onStart={(t) => { clock.current = t; }} size={190} style={{ width: "100%", height: "auto", position: "relative" }} />
      </div>

      {/* front layer: the arrows, the two question bubbles and the AI agents card */}
      <svg viewBox={view} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        {/* an arrow out to the bakery, and a soft curved line from the AI agents that stops short of both the card and the pipe: both sway with it */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round" data-agents="lines">
          <path ref={(el) => { lines.current[0] = el; }} d={dShop0} stroke={INK} strokeOpacity={0.3} strokeWidth={A.sw} transform={`translate(${A.sw * 0.35} ${A.sw * 0.5})`} />
          <path ref={(el) => { lines.current[1] = el; }} d={dShop0} stroke={INK} strokeWidth={A.sw} />
          <path ref={(el) => { lines.current[2] = el; }} d={dAgent0} stroke={INK} strokeOpacity={0.3} strokeWidth={A.sw} transform={`translate(${A.sw * 0.35} ${A.sw * 0.5})`} />
          <path ref={(el) => { lines.current[3] = el; }} d={dAgent0} stroke={INK} strokeWidth={A.sw} />
        </g>

        {/* the question above the shop */}
        <Bubble mark="ticket" x={shopCx} y={signTop - (g.phone ? 27 : 25)} lines={M.shopBubble[li]} font={B.font} charW={B.charW} tail="down" tilt={-2} tailLen={g.phone ? 20 : 23} note={{ kind: "match", text: "matched!" }} />
        {/* the question by the AI agents */}
        <Bubble mark="ticket" x={B.agent.x} y={B.agent.y} lines={M.agentBubble[li]} font={B.font} charW={B.charW} tail={B.agent.tail} tilt={g.phone ? -3 : 2} tailLen={g.phone ? 30 : 16} note={{ kind: "search", text: "searching…" }} />

        {/* phones: a third, social question in the room bottom right of Shorty */}
        {B.social && <Bubble mark="ticket" x={B.social.x} y={B.social.y} lines={M.socialBubble} font={B.font} charW={B.charW} tail="up" tilt={2} tailLen={16} />}

        {/* AI Agents, with the four logos */}
        <PaperCard mark="card" x={cardC[0]} y={cardC[1]} w={K.w} h={cardH} tilt={K.tilt}>
          <text x={0} y={-cardH / 2 + K.pad + K.headFont * 0.95} textAnchor="middle" fontSize={K.headFont} fontWeight={800} letterSpacing="0.1em" fill={INK} style={{ fontFamily: SANS }}>AI AGENTS</text>
          {AGENTS.map((a, i) => {
            const col = i % K.cols, row = Math.floor(i / K.cols);
            const gridW = K.cols * K.tile[0] + (K.cols - 1) * K.gap;
            const tx = -gridW / 2 + col * (K.tile[0] + K.gap);
            const ty = -cardH / 2 + K.pad + K.head + row * (K.tile[1] + K.gap);
            const lx = tx + (K.tile[0] - K.logo) / 2, ly = ty + (K.name ? 8 : (K.tile[1] - K.logo) / 2);
            const pw = K.tile[0] > 80 ? 52 : 46, ph = K.tile[0] > 80 ? 15 : 14, pf = K.tile[0] > 80 ? 8.4 : 7.6;
            return (
              <g key={a.key}>
                <rect x={tx + 1.8} y={ty + 2.4} width={K.tile[0]} height={K.tile[1]} rx={7} fill={INK} fillOpacity={0.22} />
                <rect x={tx} y={ty} width={K.tile[0]} height={K.tile[1]} rx={7} fill="#FFFDF6" stroke={INK} strokeWidth={1.6} />
                <g transform={`translate(${lx} ${ly}) scale(${K.logo / 24})`}><path d={AI_LOGOS[a.key]} fill={a.color} /></g>
                {K.name > 0 && (
                  <text x={tx + K.tile[0] / 2} y={ty + K.tile[1] - 9} textAnchor="middle" fontSize={K.name} fontWeight={700} fill={INK} style={{ fontFamily: SANS }}>{a.name}</text>
                )}
                {"live" in a && (
                  <g data-agents="live">
                    <rect x={tx + K.tile[0] - pw + 6} y={ty - ph / 2 - 1} width={pw} height={ph} rx={ph / 2} fill={AMBER} stroke={INK} strokeWidth={1.2} />
                    <text x={tx + K.tile[0] - pw / 2 + 6} y={ty - ph / 2 - 1 + ph * 0.7} textAnchor="middle" fontSize={pf} fontWeight={800} letterSpacing="0.06em" fill={INK} style={{ fontFamily: SANS }}>LIVE NOW</text>
                  </g>
                )}
              </g>
            );
          })}
        </PaperCard>
      </svg>
    </div>
  );
}

/* Phones: each line of the paragraph slides in from alternating sides as it scrolls into view. */
const REVEAL_CSS = `
@media (max-width: 899px){
  /* each line sits on a paper pill, so it feels grounded as it slides in */
  .pp-pill{position:relative;padding:14px 18px;border:2px solid #14161A;border-radius:22px;background:#FBF6E6;box-shadow:3px 4px 0 #14161A}
  .pp-pill::before{content:"";position:absolute;inset:0;border-radius:inherit;background-image:url("${GRAIN_URL}");opacity:.2;mix-blend-mode:multiply;pointer-events:none}
  [data-rv="l"]{rotate:-1deg}
  [data-rv="r"]{rotate:1deg}
  [data-armed] [data-rv]{opacity:0;transition:opacity .7s ease,transform .8s cubic-bezier(.2,.8,.25,1)}
  [data-armed] [data-rv="l"]{transform:translateX(-48px)}
  [data-armed] [data-rv="r"]{transform:translateX(48px)}
  [data-armed] [data-rv][data-in]{opacity:1;transform:none}
}
@media (prefers-reduced-motion: reduce){[data-armed] [data-rv]{opacity:1 !important;transform:none !important;transition:none !important}}
`;

export function PipesSection() {
  const desk = useSyncExternalStore(DESK.subscribe, DESK.get, () => true);
  const root = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    el.setAttribute("data-armed", "");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.setAttribute("data-in", ""); io.unobserve(e.target); } });
    }, { threshold: 0.2, rootMargin: "0px 0px -6% 0px" });
    el.querySelectorAll("[data-rv]").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  const { audience } = useAudience();
  const M = MODES[audience];
  return (
    <section ref={root} aria-labelledby="pipes-h">
      <style dangerouslySetInnerHTML={{ __html: REVEAL_CSS }} />
      {/* The headline: its own black strip, the lead-in to the scene below. */}
      <div className="overflow-x-clip bg-[#14161A] px-5 pt-7 pb-9 min-[900px]:px-10 min-[900px]:pt-20 min-[900px]:pb-14">
        <div className="mx-auto max-w-[1180px]">
          <div data-agents="head" className="relative z-10 text-center">
            <h2
              id="pipes-h"
              className="font-extrabold leading-[1.02] tracking-[-0.03em] text-[#F6F1E4]"
              style={{ fontFamily: SANS, fontSize: "clamp(25px, 4.4vw, 64px)" }}
            >
              {M.headline.map((line) => <span key={line} className="block [text-wrap:balance]">{line}</span>)}
            </h2>
            <p className="mt-2 font-bold leading-[1.15] text-[#5FDDAE] min-[900px]:mt-3" style={{ fontFamily: SANS, fontSize: "clamp(16px, 1.9vw, 27px)" }}>
              Shorty builds the pipe.
            </p>
          </div>
        </div>
      </div>

      {/* The scene, on mint. On phones the agents card tucks up over the strip's edge, so it reads as part of the headline group. */}
      <div className="relative flow-root overflow-x-clip px-5 pb-16 text-[#0D2B20] min-[900px]:px-10 min-[900px]:pt-16 min-[900px]:pb-24" style={{ background: MINT_BG }}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[.4] mix-blend-multiply" style={{ backgroundImage: `url("${GRAIN_URL}")` }} />
        <div className="relative mx-auto max-w-[1180px]">
          <div className="relative z-10 -mt-[28px] min-[900px]:mt-0">
            <Scene key={`${desk ? "d" : "m"}-${audience}`} g={desk ? DESKTOP : MOBILE} mode={audience} />
          </div>
          {/* One paragraph on desktop; on phones each idea sits on its own paper pill and slides in from alternating sides. */}
          <p
            data-agents="para"
            className="mx-auto mt-7 max-w-[1000px] text-center leading-[1.2] [text-wrap:balance] min-[900px]:mt-8 min-[900px]:leading-[1.22]"
            style={{ fontFamily: SERIF, fontSize: "clamp(26px, 3vw, 42px)", fontWeight: 400 }}
          >
            <span data-rv="l" className="pp-pill block text-[27px] leading-[1.15] min-[900px]:inline min-[900px]:text-[length:inherit] min-[900px]:leading-[inherit]">
              Right now your website and socials are <em className="italic">outdated.</em>
            </span>{" "}
            <span data-rv="r" className="pp-pill mt-3.5 block text-[22px] leading-[1.2] min-[900px]:mt-0 min-[900px]:inline min-[900px]:text-[length:inherit]">
              They get read by agents, but can’t do anything.
            </span>{" "}
            <span data-rv="l" className="pp-pill mt-3.5 block text-[22px] leading-[1.2] min-[900px]:mt-0 min-[900px]:inline min-[900px]:text-[length:inherit]">
              Shorty builds the pipes that let your customers’ AI agents{" "}
              <span className="mt-2.5 block text-[27px] leading-[1.15] min-[900px]:mt-0 min-[900px]:inline min-[900px]:text-[length:inherit]">
                <strong className="font-bold">transact</strong>, <strong className="font-bold">book</strong>, and <strong className="font-bold">interact</strong>.
              </span>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
