/**
 * Reusable cut-paper pieces for the explainer video, in the drawing space of timeline.ts (VIEW 480x270).
 * Static layers (backdrop, truck) wear the site's paper filter once; moving pieces are flat ink-and-paper so they stay cheap.
 * The truck, sky, sun, water and lights are the homepage hero's taco-truck scene (new-home/ShortyScenes.tsx), re-laid
 * in 16:9 with the serving window cut out so it can open. Exported so dashboard tutorials can use them.
 */
import type { ReactNode } from "react";

export const INK = "#2a2219";
const STROKE = { stroke: INK, strokeWidth: 1.3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
export const TX = 30, TY = 14;                       // where the hero's 420x260 truck sits in the 480x270 frame
export const WINDOW = { x: 135, y: 126, w: 150, h: 58 };  // the serving window, in frame units
export const GROUND = 246;                           // feet line for people in front of the truck
export const SANS_STACK = "var(--font-sans-inter), 'Helvetica Neue', Helvetica, sans-serif";
export const SERIF_STACK = "var(--font-fraunces), Georgia, serif";

/** The paper filter and the light glow, once per stage. */
export function PaperDefs() {
  return (
    <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <filter id="ftv-paper" x="-8%" y="-8%" width="116%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={2} seed={7} result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale={3.5} xChannelSelector="R" yChannelSelector="G" result="torn" />
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} result="fine" />
          <feColorMatrix in="fine" type="matrix" values="0 0 0 0 0.16  0 0 0 0 0.12  0 0 0 0 0.08  0.32 0 0 0 -0.13" result="specks" />
          <feComposite in="specks" in2="torn" operator="in" result="grain" />
          <feMerge result="sheet"><feMergeNode in="torn" /><feMergeNode in="grain" /></feMerge>
          <feDropShadow in="sheet" dx={1.6} dy={2.6} stdDeviation={1.4} floodColor="#3a2a12" floodOpacity={0.22} />
        </filter>
        <filter id="ftv-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation={4} /></filter>
      </defs>
    </svg>
  );
}

const Paper = ({ rot = 0, at = [240, 135], children }: { rot?: number; at?: [number, number]; children: ReactNode }) => (
  <g filter="url(#ftv-paper)" transform={`rotate(${rot} ${at[0]} ${at[1]})`}>{children}</g>
);

/** Golden-hour sky, sun, water, sand (static, full frame). */
export function LotBack() {
  return (
    <svg viewBox="0 0 480 270" style={layer}>
      <rect width={480} height={270} fill="#f9d6a8" />
      <Paper rot={-1}><path d="M14 262 C-14 160 40 40 190 28 C330 18 472 52 466 160 C462 215 450 262 450 262 Z" fill="#f7cfa4" /></Paper>
      <Paper rot={1}><circle cx={348} cy={112} r={50} fill="#f19a63" /></Paper>
      <Paper rot={-0.6}><path d="M-10 222 Q80 176 160 206 T300 194 T440 210 T500 200 V262 H-10 Z" fill="#9fbccb" /></Paper>
      <Paper rot={0.3}><path d="M-8 238 Q240 226 488 238 V280 H-8 Z" fill="#e2b585" /></Paper>
    </svg>
  );
}

/** The truck: body with the serving window cut out, awning, wheels, string lights. Static. */
export function TruckFront() {
  const q = (a: number, c: number, b: number, t: number) => (1 - t) ** 2 * a + 2 * t * (1 - t) * c + t * t * b;
  const lightY = (x: number) => (x < 240 ? q(26, 58, 32, x / 240) : q(32, 58, 26, (x - 240) / 240));
  const bulbs = [14, 56, 98, 140, 182, 224, 266, 308, 350, 392, 434, 470];
  const scallops = Array.from({ length: 10 }, () => "q-8.5 11 -17 0").join(" ");
  const W = WINDOW;
  return (
    <svg viewBox="0 0 480 270" style={layer}>
      <g transform={`translate(${TX} ${TY})`}>
        <Paper rot={-0.8} at={[220, 160]}>
          <path fillRule="evenodd" d={`M70 224 V96 Q70 82 85 82 H298 Q316 82 328 100 L364 150 Q372 160 372 172 V224 Z M${W.x - TX} ${W.y - TY} H${W.x - TX + W.w} V${W.y - TY + W.h} H${W.x - TX} Z`} fill="#df7458" />
          <path d="M304 100 L334 146 H304 Z" fill="#fbf3dc" />
          <path d={`M${W.x - TX - 8} ${W.y - TY + W.h} H${W.x - TX + W.w + 8} V${W.y - TY + W.h + 8} H${W.x - TX - 8} Z`} fill="#b9523b" />
          <path d="M150 82 Q150 58 180 58 Q210 58 210 82 Z" fill="#f2c94c" />
        </Paper>
        <Paper rot={0.6} at={[180, 100]}>
          <path d={`M95 110 L106 92 H254 L265 110 ${scallops} Z`} fill="#f2c94c" transform="translate(0 0)" />
          <path d="M130 92 L124 110 h17 L146 92 Z M180 92 v18 h17 V92 Z M214 92 L218 110 h17 L230 92 Z" fill="#fbf3dc" />
        </Paper>
        <Paper>
          <circle cx={120} cy={224} r={20} fill="#2b2620" /> <circle cx={120} cy={224} r={7} fill="#e9dcc4" />
          <circle cx={312} cy={224} r={20} fill="#2b2620" /> <circle cx={312} cy={224} r={7} fill="#e9dcc4" />
        </Paper>
      </g>
      <g fill="none" {...STROKE} strokeWidth={1.6}>
        <path d="M-6 26 Q117 58 240 32 Q363 58 486 26" />
      </g>
      {bulbs.map((x) => (
        <g key={x}>
          <circle cx={x} cy={lightY(x) + 9} r={11} fill="#ffcf66" opacity={0.7} filter="url(#ftv-glow)" />
          <path d={`M${x} ${lightY(x)} v4`} fill="none" {...STROKE} strokeWidth={1.2} />
          <ellipse cx={x} cy={lightY(x) + 9} rx={3.4} ry={4.6} fill="#ffe08a" stroke={INK} strokeWidth={1.2} />
        </g>
      ))}
    </svg>
  );
}

export const layer = { position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", willChange: "transform" } as const;

/* ── moving pieces (flat paper + ink) ───────────────────────────────────────────── */

/** What's inside the serving window: dark kitchen, the flat-top griddle, the owner (a silhouette, cap on, spatula going). */
export function Kitchen({ t, back = false, phone = false }: { t: number; back?: boolean; phone?: boolean }) {
  const W = WINDOW, ox = W.x + 92, sway = Math.sin(t * 5) * 3, flip = Math.sin(t * 2.6) * 6;
  return (
    <g>
      <rect x={W.x} y={W.y} width={W.w} height={W.h} fill="#4a3326" />
      <rect x={W.x} y={W.y + 6} width={W.w} height={10} fill="#5b4030" opacity={0.7} />
      {/* owner */}
      <g fill={INK}>
        <path d={`M${ox - 24} ${W.y + W.h} Q${ox - 22} ${W.y + 30} ${ox} ${W.y + 28} Q${ox + 22} ${W.y + 30} ${ox + 24} ${W.y + W.h} Z`} />
        <circle cx={ox} cy={W.y + 20} r={10.5} />
        <path d={`M${ox - 11} ${W.y + 14} Q${ox} ${W.y - 2} ${ox + 11} ${W.y + 14} Z`} />
      </g>
      {back && <path d={`M${ox - 16} ${W.y + 36} L${ox + 16} ${W.y + 52} M${ox + 16} ${W.y + 36} L${ox - 16} ${W.y + 52}`} stroke="#8a6a52" strokeWidth={1.6} fill="none" strokeLinecap="round" />}
      {/* arm and spatula over the griddle (or a phone in hand) */}
      <g transform={`rotate(${flip} ${ox - 10} ${W.y + 42})`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round">
        <path d={`M${ox - 12} ${W.y + 38} L${ox - 38} ${W.y + 46 + sway * 0.3}`} />
      </g>
      {phone ? (
        <rect x={ox - 46} y={W.y + 34} width={9} height={15} rx={2} fill="#34d399" stroke="#8a6a52" strokeWidth={1} />
      ) : (
        <g transform={`rotate(${flip} ${ox - 10} ${W.y + 42})`}><path d={`M${ox - 38} ${W.y + 46} L${ox - 52} ${W.y + 49}`} stroke="#c9c2b8" strokeWidth={2.4} strokeLinecap="round" /></g>
      )}
      <rect x={W.x} y={W.y + W.h - 8} width={W.w} height={8} fill="#6b6762" />
      {[0, 1, 2].map((i) => {
        const u = ((t * 0.6 + i / 3) % 1);
        return <circle key={i} cx={W.x + 30 + i * 22 + Math.sin(t * 3 + i) * 3} cy={W.y + W.h - 10 - u * 34} r={2 + u * 3} fill="#fff" opacity={0.5 * (1 - u)} />;
      })}
    </g>
  );
}

/** The window's cover, sliding up under the awning. open: 0 closed .. 1 open. Clipped to the window. */
export function Shutter({ open }: { open: number }) {
  const W = WINDOW;
  return (
    <g>
      <clipPath id="ftv-win"><rect x={W.x} y={W.y} width={W.w} height={W.h} /></clipPath>
      <g clipPath="url(#ftv-win)">
        <g transform={`translate(0 ${-open * (W.h + 4)})`}>
          <rect x={W.x} y={W.y} width={W.w} height={W.h} fill="#fbf3dc" stroke={INK} strokeWidth={1.2} />
          <path d={`M${W.x + 16} ${W.y + 24} h20 M${W.x + 16} ${W.y + 34} h32`} stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
}

type PersonProps = { x: number; h?: number; body: string; skin: string; phone?: boolean; bob?: number; face?: 1 | -1; happy?: boolean; y?: number; look?: number };
/** A paper customer, feet at (x, y). bob in radians-ish drives a little hop; face flips left/right. */
export function Person({ x, h = 36, body, skin, phone, bob = 0, face = 1, happy = true, y = GROUND, look = 0 }: PersonProps) {
  const hop = Math.abs(Math.sin(bob)) * h * 0.1;
  const top = y - h - hop, r = h * 0.19;
  return (
    <g transform={`translate(${x} 0) scale(${face} 1)`}>
      <ellipse cx={0} cy={y + 1} rx={h * 0.22} ry={2} fill="#000" opacity={0.12} />
      <path d={`M${-h * 0.2} ${y - hop} V${top + h * 0.38} Q${-h * 0.2} ${top + h * 0.26} 0 ${top + h * 0.26} Q${h * 0.2} ${top + h * 0.26} ${h * 0.2} ${top + h * 0.38} V${y - hop} Z`} fill={body} {...STROKE} />
      <circle cx={0} cy={top + r * 0.2} r={r} fill={skin} {...STROKE} />
      <circle cx={r * 0.35 + look} cy={top + r * 0.1} r={0.9} fill={INK} />
      <circle cx={-r * 0.35 + look} cy={top + r * 0.1} r={0.9} fill={INK} />
      {happy && <path d={`M${-r * 0.4 + look * 0.6} ${top + r * 0.55} Q${look * 0.6} ${top + r * 0.95} ${r * 0.4 + look * 0.6} ${top + r * 0.55}`} fill="none" stroke={INK} strokeWidth={0.9} strokeLinecap="round" />}
      {phone && <rect x={h * 0.14} y={top + h * 0.4} width={h * 0.16} height={h * 0.26} rx={1.2} fill="#34d399" stroke={INK} strokeWidth={0.9} />}
    </g>
  );
}

/** A paper text, like an iPhone message: cream, ink outline, a hard shadow, one small tail corner. (x, y) is its center. */
export function Bubble({ x, y, text, scale = 1, rot = 0, tint = "#fbf6e6", opacity = 1, maxChars = 22, size = 8.5, tail = "bl" }: {
  x: number; y: number; text: string; scale?: number; rot?: number; tint?: string; opacity?: number; maxChars?: number; size?: number; tail?: "bl" | "br";
}) {
  const words = text.split(" "), lines: string[] = [];
  let cur = "";
  for (const w of words) { if ((cur + " " + w).trim().length > maxChars) { lines.push(cur); cur = w; } else cur = (cur + " " + w).trim(); }
  if (cur) lines.push(cur);
  const w = Math.max(...lines.map((l) => l.length)) * size * 0.54 + 14, h = lines.length * size * 1.25 + 9;
  const rl = tail === "bl" ? "2 9 9 9" : "9 9 2 9";
  void rl;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`} opacity={opacity}>
      <path d={bubblePath(-w / 2 + 1.8, -h / 2 + 2.2, w, h, tail)} fill={INK} />
      <path d={bubblePath(-w / 2, -h / 2, w, h, tail)} fill={tint} stroke={INK} strokeWidth={1.3} strokeLinejoin="round" />
      {lines.map((l, i) => (
        <text key={i} x={-w / 2 + 7} y={-h / 2 + 6.5 + size * 0.85 + i * size * 1.25} fontSize={size} fontWeight={600} fill={INK} style={{ fontFamily: SANS_STACK }}>{l}</text>
      ))}
    </g>
  );
}
function bubblePath(x: number, y: number, w: number, h: number, tail: "bl" | "br") {
  const r = Math.min(9, h / 2), s = 2;
  const bl = tail === "bl" ? s : r, br = tail === "br" ? s : r;
  return `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - br} Q${x + w} ${y + h} ${x + w - br} ${y + h} H${x + bl} Q${x} ${y + h} ${x} ${y + h - bl} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;
}

export function Envelope({ x, y, s = 1, rot = 0, tint = "#fbf6e6", opacity = 1 }: { x: number; y: number; s?: number; rot?: number; tint?: string; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={opacity}>
      <rect x={-12} y={-8} width={24} height={16} rx={2} fill={tint} stroke={INK} strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M-12 -7 L0 2 L12 -7" fill="none" stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
    </g>
  );
}

/** A small phone, face up to us. lit: 0..1 screen glow. */
export function MiniPhone({ x, y, w = 16, lit = 0, rot = 0, children }: { x: number; y: number; w?: number; lit?: number; rot?: number; children?: ReactNode }) {
  const h = w * 1.75;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.2} fill={INK} />
      <rect x={-w / 2 + 1.3} y={-h / 2 + 1.8} width={w - 2.6} height={h - 3.6} rx={w * 0.14} fill={lit > 0.02 ? `rgb(${Math.round(52 + (1 - lit) * 130)},${Math.round(211 - (1 - lit) * 80)},${Math.round(153 + (1 - lit) * 20)})` : "#5a6068"} />
      {children}
    </g>
  );
}

/** The paper cards that rise out of the truck: order in / booking. */
export function InfoCard({ x, y, w = 64, h = 26, label, lines, tint, pill, rot = 0, scale = 1, opacity = 1 }: {
  x: number; y: number; w?: number; h?: number; label: string; lines: string[]; tint: string; pill?: string; rot?: number; scale?: number; opacity?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`} opacity={opacity}>
      <rect x={-w / 2 + 2} y={-h / 2 + 2.4} width={w} height={h} rx={5} fill={INK} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={5} fill="#fbf6e6" stroke={INK} strokeWidth={1.3} />
      <rect x={-w / 2 + 4} y={-h / 2 + 4} width={5.5} height={5.5} rx={1.4} fill={tint} stroke={INK} strokeWidth={0.8} />
      <text x={-w / 2 + 12} y={-h / 2 + 9} fontSize={4.6} fontWeight={800} letterSpacing={0.6} fill={INK} style={{ fontFamily: SANS_STACK }}>{label}</text>
      {lines.map((l, i) => (
        <text key={i} x={-w / 2 + 5} y={-h / 2 + 16.5 + i * 7.4} fontSize={i === 0 ? 6.6 : 5.8} fontWeight={i === 0 ? 700 : 500} fill={INK} style={{ fontFamily: SANS_STACK }}>{l}</text>
      ))}
      {pill && (
        <g><rect x={w / 2 - 22} y={h / 2 - 9.5} width={18} height={6.5} rx={3.2} fill="#2f7a50" /><text x={w / 2 - 13} y={h / 2 - 4.9} fontSize={4.2} fontWeight={800} textAnchor="middle" fill="#fbf6e6" style={{ fontFamily: SANS_STACK }}>{pill}</text></g>
      )}
    </g>
  );
}

/** A paper take-out bag. */
export function Bag({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-9 -10 L9 -10 L11 10 L-11 10 Z" fill="#d9a86c" stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
      <path d="M-9 -10 L-5 -15 L5 -15 L9 -10" fill="#c8924f" stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
      <path d="M-3 0 h6" stroke={INK} strokeWidth={1.2} strokeLinecap="round" />
    </g>
  );
}

export function Heart({ x, y, s = 1, opacity = 1, color = "#d6463f" }: { x: number; y: number; s?: number; opacity?: number; color?: string }) {
  return <path d="M0 3 C-9 -4 -5 -10 0 -5 C5 -10 9 -4 0 3 Z" transform={`translate(${x} ${y}) scale(${s})`} fill={color} stroke={INK} strokeWidth={0.9} opacity={opacity} />;
}

export function ThumbsUp({ x, y, s = 1, opacity = 1 }: { x: number; y: number; s?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      <circle r={13} fill="#f2c94c" stroke={INK} strokeWidth={1.3} />
      <path d="M-6 1 H-2 L2 -7 Q5 -7 5 -3 L4 0 H8 Q10 0 9.4 3 L8 8 Q7.4 10 5.5 10 H-6 Z" fill="#fbf6e6" stroke={INK} strokeWidth={1.1} strokeLinejoin="round" />
    </g>
  );
}
