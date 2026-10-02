"use client";

/**
 * "Shorty Connects": a mint chapter below the hero on /new. Shorty (the hero's own ShortyMascot,
 * `carry` pose, drawn once) holds a pipe at an angle. At its two ends: a small shop with "Your Business" on its
 * sign (set further back) and an
 * "AI Agents" card carrying the assistants' logos, with arrows along the pipe. Everything that isn't
 * Shorty is one SVG laid over his drawing in the SAME units, so the cards track the pipe ends exactly;
 * the cards, tiles and pipe are cut paper (torn edge, grain, hard offset shadow) like the hero scenes.
 */
import { useSyncExternalStore } from "react";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import { CARRY_TILT } from "@/lib/shorty/mascot/poses";
import { AI_LOGOS } from "./aiLogos";

const INK = "#14161A";
const CREAM = "#FBF6E6";
const SANS = "var(--font-sora), var(--font-sans-inter), system-ui, sans-serif";
const BODY = "var(--font-sans-inter), system-ui, sans-serif";

/* Paper grain: the same noise the hero's bubbles and scenes use. */
const GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/** Mint with some paper in it: a lighter wash top-left, a deeper one bottom-right, and grain over everything. */
const MINT_BG =
  "radial-gradient(900px 520px at 12% 8%, rgba(255,255,255,.28), rgba(255,255,255,0) 62%), radial-gradient(1000px 560px at 92% 96%, rgba(8,70,48,.16), rgba(8,70,48,0) 62%), #5FDDAE";

const AGENTS = [
  { key: "openai", name: "Dots", color: "#14161A" },
  { key: "meta", name: "Muse", color: "#0866FF" },
  { key: "grok", name: "Grok", color: "#14161A" },
  { key: "claude", name: "Claude", color: "#D97757" },
] as const;

/* Shorty's drawing box, in his own units (frame.ts): x -95…221, y -66…252. */
const BOX = { x: -95, y: -66, w: 316, h: 318 };

/* The pipe he's carrying: centre (63,150), half-length 85 (with the flanges), tilted CARRY_TILT degrees. */
const TH = (CARRY_TILT * Math.PI) / 180, COS = Math.cos(TH), SIN = Math.sin(TH);
const END_L: [number, number] = [63 - 85 * COS, 150 - 85 * SIN];   // low end, toward Your Business
const END_R: [number, number] = [63 + 85 * COS, 150 + 85 * SIN];   // raised end, toward the AI agents

type Geo = {
  vb: [number, number, number, number];
  arrow: { start: number; len: number; sw: number };
  shop: { bodyW: number; bodyH: number; signW: number; signH: number; signFont: number; flaps: number; awn: number; post: number };
  card: { w: number; pad: number; head: number; headFont: number; tile: [number, number]; gap: number; logo: number; name: number; lift: number };
};
const DESKTOP: Geo = {
  vb: [-215, -62, 600, 318],
  arrow: { start: 22, len: 46, sw: 7 },
  shop: { bodyW: 84, bodyH: 80, signW: 104, signH: 44, signFont: 14, flaps: 4, awn: 20, post: 12 },
  card: { w: 154, pad: 13, head: 26, headFont: 14, tile: [57, 70], gap: 8, logo: 32, name: 12, lift: 0 },
};
/* Phones: the agents card is bigger and sits higher. */
const MOBILE: Geo = {
  vb: [-150, -62, 466, 318],
  arrow: { start: 14, len: 24, sw: 5 },
  shop: { bodyW: 62, bodyH: 56, signW: 84, signH: 38, signFont: 12, flaps: 3, awn: 15, post: 9 },
  card: { w: 118, pad: 8, head: 18, headFont: 11, tile: [47, 47], gap: 5, logo: 28, name: 0, lift: 16 },
};

/** Where the small shop's ground is: higher than Shorty's feet (y 231), so it reads as further back. */
const SHOP_GROUND = 216;

const DESK = {
  subscribe: (cb: () => void) => { const m = window.matchMedia("(min-width: 900px)"); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); },
  get: () => window.matchMedia("(min-width: 900px)").matches,
};

/** A chunky ink arrow, drawn along the pipe: `base` is where it starts, `deg` the way it points. */
function Arrow({ base, deg, len, sw }: { base: [number, number]; deg: number; len: number; sw: number }) {
  const head = sw * 2.2;
  const d = `M0 0 H${len} M${len - head} ${-head} L${len} 0 L${len - head} ${head}`;
  return (
    <g transform={`translate(${base[0]} ${base[1]}) rotate(${deg})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={INK} strokeOpacity={0.3} strokeWidth={sw} transform={`translate(${sw * 0.35} ${sw * 0.5})`} />
      <path d={d} stroke={INK} strokeWidth={sw} />
    </g>
  );
}

/** A cut-paper card: torn-edge cream sheet with a hard shadow, then crisp text on top. */
function PaperCard({ x, y, w, h, tilt, children }: { x: number; y: number; w: number; h: number; tilt: number; children: React.ReactNode }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <g filter="url(#mc-paper)">
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={Math.min(14, h * 0.2)} fill={CREAM} />
      </g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={Math.min(14, h * 0.2)} fill="url(#mc-grain)" fillOpacity={0.14} />
      {children}
    </g>
  );
}

/** A small shop with the business's name on its sign: paler, smaller and higher than Shorty, so it sits further back. */
function SmallShop({ cx, g }: { cx: number; g: Geo }) {
  const { bodyW: w, bodyH: h, signW, signH, signFont, flaps, awn, post } = g.shop;
  const x0 = cx - w / 2, top = SHOP_GROUND - h, seg = w / (flaps * 2);
  const boardBottom = top - 6 - post, boardTop = boardBottom - signH, bx = cx - signW / 2;
  const flap = (x: number) => `M${x} ${top + 2} H${x + seg} V${top + awn - seg / 2} A${seg / 2} ${seg / 2} 0 0 1 ${x} ${top + awn - seg / 2} Z`;
  const dw = w * 0.26, dh = h * 0.5, wx = x0 + w * 0.12, ww = w * 0.34, wy = top + awn + 6, wh = h * 0.32;
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
      {/* ink: window bars, door knob, a bit of sign text */}
      <g fill="none" stroke="#2F5144" strokeWidth={1.8} strokeLinecap="round">
        <path d={`M${wx + ww / 2} ${wy} V${wy + wh} M${wx} ${wy + wh / 2} H${wx + ww}`} />
        <circle cx={x0 + w * 0.6 + dw - 5} cy={SHOP_GROUND - dh * 0.45} r={1.3} fill="#2F5144" />
      </g>
      <text textAnchor="middle" fontSize={signFont} fontWeight={800} letterSpacing="0.05em" fill={INK} style={{ fontFamily: SANS }}>
        <tspan x={cx} y={boardTop + signH * 0.46}>YOUR</tspan>
        <tspan x={cx} y={boardTop + signH * 0.84}>BUSINESS</tspan>
      </text>
    </g>
  );
}

function Scene({ g }: { g: Geo }) {
  const [vx, vy, vw, vh] = g.vb;
  const dirL: [number, number] = [-COS, -SIN], dirR: [number, number] = [COS, SIN];
  const aL = (Math.atan2(dirL[1], dirL[0]) * 180) / Math.PI, aR = CARRY_TILT;
  const { arrow: A, shop: S, card: K } = g;

  const baseL: [number, number] = [END_L[0] + dirL[0] * A.start, END_L[1] + dirL[1] * A.start];
  const tipL: [number, number] = [baseL[0] + dirL[0] * A.len, baseL[1] + dirL[1] * A.len];
  const shopCx = tipL[0] - 6 - S.bodyW / 2;   // the arrow points at its door side

  const baseR: [number, number] = [END_R[0] + dirR[0] * A.start, END_R[1] + dirR[1] * A.start];
  const tipR: [number, number] = [baseR[0] + dirR[0] * A.len, baseR[1] + dirR[1] * A.len];
  const rows = 2, cardH = K.pad * 2 + K.head + rows * K.tile[1] + (rows - 1) * K.gap;
  const cardC: [number, number] = [tipR[0] + dirR[0] * (8 + K.w / 2), tipR[1] + dirR[1] * (8 + K.w / 2) - K.lift];

  const pct = (n: number, total: number) => `${(n / total) * 100}%`;
  const view = `${vx} ${vy} ${vw} ${vh}`;
  return (
    <div className="relative mx-auto w-full" style={{ aspectRatio: `${vw} / ${vh}` }}>
      {/* back layer: the shop (further back than Shorty) and the shared paper filters */}
      <svg viewBox={view} className="absolute inset-0 h-full w-full overflow-visible" role="img"
        aria-label="Shorty holds a pipe that connects a small business, on the left, to the AI agents (Dots, Muse, Grok and Claude), on the right.">
        <defs>
          <pattern id="mc-grain" patternUnits="userSpaceOnUse" width={80} height={80}>
            <image href={GRAIN_URL} width={80} height={80} />
          </pattern>
          {/* Cut paper: torn edge + grain + a hard offset shadow (the hero scenes' technique). */}
          <filter id="mc-paper" x="-10%" y="-10%" width="125%" height="130%" colorInterpolationFilters="sRGB">
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
        <SmallShop cx={shopCx} g={g} />
      </svg>

      {/* the cream glow, and Shorty (the shared rig, drawn once) */}
      <div
        aria-hidden="true" className="pointer-events-none absolute"
        style={{ left: pct(BOX.x - vx, vw), top: pct(BOX.y - vy, vh), width: pct(BOX.w, vw), height: pct(BOX.h, vh) }}
      >
        <div className="pointer-events-none absolute" style={{ left: "2%", top: "6%", width: "96%", height: "94%", background: "radial-gradient(ellipse closest-side at 50% 55%, rgba(251,246,230,.95), rgba(251,246,230,.6) 55%, rgba(251,246,230,0))" }} />
        <ShortyMascot mood="carry" still size={190} style={{ width: "100%", height: "auto", position: "relative" }} />
      </div>

      {/* front layer: the arrows and the AI agents card */}
      <svg viewBox={view} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <Arrow base={baseL} deg={aL} len={A.len} sw={A.sw} />
        <Arrow base={baseR} deg={aR} len={A.len} sw={A.sw} />

        {/* AI Agents, with the four logos */}
        <PaperCard x={cardC[0]} y={cardC[1]} w={K.w} h={cardH} tilt={2}>
          <text x={0} y={-cardH / 2 + K.pad + K.headFont * 0.95} textAnchor="middle" fontSize={K.headFont} fontWeight={800} letterSpacing="0.1em" fill={INK} style={{ fontFamily: SANS }}>AI AGENTS</text>
          {AGENTS.map((a, i) => {
            const col = i % 2, row = Math.floor(i / 2);
            const gridW = 2 * K.tile[0] + K.gap;
            const tx = -gridW / 2 + col * (K.tile[0] + K.gap);
            const ty = -cardH / 2 + K.pad + K.head + row * (K.tile[1] + K.gap);
            const lx = tx + (K.tile[0] - K.logo) / 2, ly = ty + (K.name ? 7 : (K.tile[1] - K.logo) / 2);
            return (
              <g key={a.key}>
                <rect x={tx + 1.8} y={ty + 2.4} width={K.tile[0]} height={K.tile[1]} rx={7} fill={INK} fillOpacity={0.22} />
                <rect x={tx} y={ty} width={K.tile[0]} height={K.tile[1]} rx={7} fill="#FFFDF6" stroke={INK} strokeWidth={1.6} />
                <g transform={`translate(${lx} ${ly}) scale(${K.logo / 24})`}><path d={AI_LOGOS[a.key]} fill={a.color} /></g>
                {K.name > 0 && (
                  <text x={tx + K.tile[0] / 2} y={ty + K.tile[1] - 8} textAnchor="middle" fontSize={K.name} fontWeight={700} fill={INK} style={{ fontFamily: BODY }}>{a.name}</text>
                )}
              </g>
            );
          })}
        </PaperCard>
      </svg>
    </div>
  );
}

export function PipesSection() {
  const desk = useSyncExternalStore(DESK.subscribe, DESK.get, () => true);
  return (
    <section aria-labelledby="pipes-h" className="relative overflow-x-clip px-5 pt-14 pb-16 text-[#0D2B20] min-[900px]:px-10 min-[900px]:pt-20 min-[900px]:pb-24" style={{ background: MINT_BG }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[.4] mix-blend-multiply" style={{ backgroundImage: `url("${GRAIN_URL}")` }} />
      <div className="relative mx-auto max-w-[1180px]">
        <h2
          id="pipes-h"
          className="relative z-10 mb-3 origin-top-left font-extrabold leading-[0.95] tracking-[-0.03em] text-[#0A2A1D] min-[900px]:absolute min-[900px]:top-0 min-[900px]:left-0 min-[900px]:mb-0"
          style={{ fontFamily: SANS, fontSize: "clamp(40px, 5vw, 76px)", rotate: "-4deg" }}
        >
          Shorty<br />Connects.
        </h2>
        <Scene key={desk ? "d" : "m"} g={desk ? DESKTOP : MOBILE} />
        <p
          className="mx-auto mt-6 max-w-[760px] text-center text-[19px] leading-[1.45] font-medium min-[900px]:mt-8 min-[900px]:text-[26px] min-[900px]:leading-[1.4]"
          style={{ fontFamily: BODY }}
        >
          Right now your website and socials are a billboard. They get read by agents, but can’t do anything. Shorty builds the pipes that let your customers’ AI agents <strong className="font-extrabold">transact</strong>, <strong className="font-extrabold">book</strong>, and <strong className="font-extrabold">interact</strong>.
        </p>
      </div>
    </section>
  );
}
