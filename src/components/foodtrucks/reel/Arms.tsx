"use client";
/**
 * The six extra arms. His rig only has two, so these are drawn here in exactly the rig's style: the same 6-unit ink limb with round
 * ends, the same sleeve bump, the same white glove with the rolled cuff (copied from src/lib/shorty/mascot/rig.ts), the same
 * ink outlines and flat fills. They live in the rig's own units and ride his body matrix, so they breathe and bounce with him.
 * The phone (texts) and the megaphone (regulars) are the rig's own props on his own two arms; the other six are drawn here.
 */
import type { ReactNode } from "react";
import { ARMS, armExt, popAt, type ArmId, type ArmSpec } from "./timeline";
import { SHOULDER } from "@/lib/shorty/mascot/poses";

const C = { green: "#8cc3a1", ink: "#1d1a16", white: "#fbf6e6", pink: "#e8747a", yellow: "#f2c94c", red: "#c8473d", cream: "#fbf3dc" };
const ink = (w = 2.2) => ({ stroke: C.ink, strokeWidth: w, strokeLinejoin: "round" as const, strokeLinecap: "round" as const });
const f1 = (v: number) => +v.toFixed(1);

/** the rig's glove: wrist at the origin, fingers along +x; fist and open variants, with the rolled cuff */
export function Glove({ fist = true }: { fist?: boolean }) {
  const w = { fill: C.white, ...ink(2.3) };
  return (
    <g>
      {fist ? (
        <g>
          <ellipse cx={6.5} cy={-8.6} rx={3.4} ry={3.8} {...w} />
          <circle cx={9} cy={0} r={9.2} {...w} />
          <path d="M15 -5.4 Q13 -3.4 15.3 -1.5 M15.9 -1.1 Q13.4 0.8 15.9 2.8 M15.1 3.4 Q13 5.2 14.8 6.8" fill="none" {...ink(1.3)} />
          <path d="M3.8 -3 Q7 -3.3 10 -3 M3.8 0.2 H10 M3.8 3.4 Q7 3.7 10 3.4" fill="none" {...ink(1.3)} />
        </g>
      ) : (
        <g>
          <ellipse cx={6} cy={-9.4} rx={3.6} ry={4.2} transform="rotate(-25 6 -9.4)" {...w} />
          {[[15, -6.2], [18, -2.1], [18, 2.2], [15, 6.3]].map(([x, y]) => <circle key={x + "," + y} cx={x} cy={y} r={3.9} {...w} />)}
          <ellipse cx={8.5} cy={0} rx={8.8} ry={8.4} {...w} />
        </g>
      )}
      <path d="M-7.5 -8.4 Q-3.4 -9.4 0.4 -7.4 V7.4 Q-3.4 9.4 -7.5 8.4 Q-9 0 -7.5 -8.4 Z" {...w} />
      <path d="M-3.6 -8.2 Q-5 0 -3.6 8.2" fill="none" {...ink(1.3)} />
    </g>
  );
}

/** the rig's limb geometry: a quadratic from shoulder to hand that always bows away from the body */
function limb(s: [number, number], h: [number, number], bend: number, side: number) {
  const [sx, sy] = s, [hx, hy] = h, dx = hx - sx, dy = hy - sy, len = Math.hypot(dx, dy) || 1;
  let nx = -dy / len, ny = dx / len;
  if (nx * side < 0 || (Math.abs(nx) < 0.25 && ny < 0)) { nx = -nx; ny = -ny; }
  const cx = (sx + hx) / 2 + nx * bend, cy = (sy + hy) / 2 + ny * bend;
  const u = 0.42, mx = (1 - u) ** 2 * sx + 2 * u * (1 - u) * cx + u * u * hx, my = (1 - u) ** 2 * sy + 2 * u * (1 - u) * cy + u * u * hy;
  return { d: `M${sx} ${sy} Q${f1(cx)} ${f1(cy)} ${f1(hx)} ${f1(hy)}`, mx, my, ang: (Math.atan2(hy - cy, hx - cx) * 180) / Math.PI };
}

/* ── what each arm holds. Origin = the glove's grip; the thing sits above it. `a` = seconds since it landed. ── */
const loop = (a: number, every: number) => (a % every) / every;

function Envelope({ a }: { a: number }) {
  const open = 0.5 + 0.5 * Math.sin(a * 5.2), apex = -2 - 22 * open;
  const f = loop(a, 1.1), g = loop(a + 0.5, 1.1);
  const mini = (k: number, key: string) => (
    <g key={key} transform={`translate(${f1(14 + k * 26)} ${f1(-26 - k * 34)}) rotate(${f1(-10 + k * 25)}) scale(0.45)`} opacity={Math.sin(Math.PI * k)}>
      <rect x={-18} y={-12} width={36} height={24} rx={3} fill={C.white} {...ink(3)} /><path d="M-18 -12 L0 4 L18 -12" fill="none" {...ink(3)} />
    </g>
  );
  return (
    <g transform="translate(0 -17)">
      {mini(f, "m1")}{mini(g, "m2")}
      <rect x={-22} y={-13} width={44} height={28} rx={3} fill={C.white} {...ink(2.2)} />
      <path d={`M-22 -13 L0 ${f1(apex + 14)} L22 -13 Z`} fill={open > 0.5 ? "#efe6cc" : C.white} {...ink(2)} />
      <path d="M-18 11 L-6 1 M18 11 L6 1" fill="none" {...ink(1.3)} />
      <path d="M0 -4 C-5 -8 -4 -13 0 -10 C4 -13 5 -8 0 -4 Z" fill={C.red} {...ink(1.2)} transform={`translate(0 ${f1(open > 0.5 ? -3 : 3)})`} />
    </g>
  );
}
function Camera({ a }: { a: number }) {
  const f = loop(a + 0.2, 0.95), burst = f < 0.28 ? Math.sin((Math.PI * f) / 0.28) : 0;
  const h = loop(a + 0.1, 0.95);
  return (
    <g transform="translate(0 -17)">
      <circle cx={-16} cy={-22} r={30 * burst} fill="#fff7d6" opacity={0.65 * burst} />
      <path d="M-14 -16 L-20 -30 M-16 -17 L-8 -33 M-20 -22 L-34 -24" stroke={C.yellow} strokeWidth={3} strokeLinecap="round" opacity={burst} />
      <rect x={-24} y={-14} width={48} height={30} rx={5} fill={C.white} {...ink(2.2)} />
      <path d="M-24 -6 H24" {...ink(1.4)} />
      <rect x={-22} y={-20} width={13} height={7} rx={1.5} fill={C.yellow} {...ink(1.8)} />
      <rect x={10} y={-19} width={10} height={6} rx={2} fill={C.red} {...ink(1.8)} />
      <circle cx={0} cy={5} r={11} fill={C.ink} {...ink(2.2)} /><circle cx={0} cy={5} r={6.5} fill="#3a4a58" />
      <circle cx={-2.5} cy={2.5} r={2} fill={C.white} />
      <g transform={`translate(${f1(18 + h * 8)} ${f1(-28 - h * 36)}) scale(${f1(0.8 * Math.sin(Math.PI * h))})`}>
        <path d="M0 3 C-6 -1 -5 -7 0 -4 C5 -7 6 -1 0 3 Z" fill={C.red} {...ink(1.3)} transform="scale(2.2)" />
      </g>
    </g>
  );
}
function Ticket({ a }: { a: number }) {
  const feed = 8 * Math.abs(Math.sin(a * 3.2)), n = Math.floor(a * 1.6) % 3;
  return (
    <g transform={`translate(0 ${f1(-14 + feed * 0.3)}) rotate(${f1(Math.sin(a * 4) * 3)})`}>
      <path d={`M-15 -38 H15 V${f1(14 + feed)} L11 ${f1(19 + feed)} L7 ${f1(14 + feed)} L3 ${f1(19 + feed)} L-1 ${f1(14 + feed)} L-5 ${f1(19 + feed)} L-9 ${f1(14 + feed)} L-13 ${f1(19 + feed)} L-15 ${f1(16 + feed)} Z`} fill={C.white} {...ink(2.2)} />
      <rect x={-15} y={-38} width={30} height={9} fill={C.red} {...ink(2)} />
      <path d="M-9 -34 H3" stroke={C.white} strokeWidth={2.2} strokeLinecap="round" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(0 ${-20 + i * 11})`}>
          <rect x={-10} y={-3.5} width={7} height={7} rx={1} fill={i <= n ? "#bfe0cb" : "none"} {...ink(1.4)} />
          {i <= n && <path d="M-9 0 L-7 2.4 L-4 -2.4" fill="none" {...ink(1.6)} />}
          <path d="M0 0 H10" {...ink(1.5)} />
        </g>
      ))}
    </g>
  );
}
function Calendar({ a }: { a: number }) {
  const cell = Math.floor(a * 2.4) % 9, cx = -12 + (cell % 3) * 12, cy = -13 + Math.floor(cell / 3) * 11;
  const pop = 1 - (a * 2.4 - Math.floor(a * 2.4));
  return (
    <g transform="translate(0 -20)">
      <rect x={-22} y={-22} width={44} height={42} rx={3} fill={C.white} {...ink(2.2)} />
      <rect x={-22} y={-22} width={44} height={11} rx={3} fill={C.red} {...ink(2.2)} />
      {[-12, 12].map((x) => <rect key={x} x={x - 2} y={-27} width={4} height={9} rx={2} fill={C.ink} />)}
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-12 + (i % 3) * 12} cy={-13 + Math.floor(i / 3) * 11 + 11} r={1.7} fill={C.ink} opacity={0.55} />)}
      <g transform={`translate(${cx} ${cy + 11})`}>
        <circle r={5.6 + 1.5 * pop} fill="#bfe0cb" {...ink(1.6)} />
        <path d="M-2.6 0.4 L-0.6 2.6 L3 -2.4" fill="none" {...ink(1.8)} />
      </g>
    </g>
  );
}
function Sign({ a }: { a: number }) {
  return (
    <g transform={`rotate(${f1(Math.sin(a * 4.2) * 7)})`}>
      <rect x={-2.5} y={-16} width={5} height={34} fill="#9c6a42" {...ink(2)} />
      <g transform="translate(0 -40)">
        <rect x={-28} y={-18} width={56} height={34} rx={3} fill={C.cream} {...ink(2.4)} />
        <rect x={-28} y={-18} width={56} height={9} rx={3} fill="#9c6a42" {...ink(2.2)} />
        {["THU", "FRI", "SAT"].map((d, i) => (
          <g key={d}>
            <text x={-22} y={-1 + i * 8.5} fontSize={6.6} fontWeight={900} fill={C.ink} fontFamily="'Schibsted Grotesk',sans-serif">{d}</text>
            <path d={`M-4 ${-3 + i * 8.5} H${[24, 20, 22][i]}`} {...ink(1.6)} />
          </g>
        ))}
        <circle cx={-20} cy={-13.6} r={1.5} fill={C.cream} /><circle cx={20} cy={-13.6} r={1.5} fill={C.cream} />
      </g>
    </g>
  );
}
function Bubble({ a }: { a: number }) {
  return (
    <g transform="translate(0 -14)">
      <path d="M-26 -46 H26 Q32 -46 32 -40 V-20 Q32 -14 26 -14 H-4 L-16 -2 L-14 -14 H-26 Q-32 -14 -32 -20 V-40 Q-32 -46 -26 -46 Z" fill={C.green} {...ink(2.4)} />
      {[0, 1, 2].map((i) => <circle key={i} cx={-12 + i * 12} cy={f1(-30 + Math.sin(a * 7 - i * 0.9) * -3)} r={3.4} fill={C.white} {...ink(1.3)} />)}
      <g transform={`translate(30 -54) rotate(${f1(Math.sin(a * 2) * 5)})`}>
        <path d="M0 -10 A10 10 0 1 0 9 6 A8 8 0 1 1 0 -10 Z" fill={C.yellow} {...ink(1.8)} />
        <path d="M-14 -3 L-12.5 0 L-9 0.5 L-12 3 L-11 6.5 L-14 4.5 L-17 6.5 L-16 3 L-19 0.5 L-15.5 0 Z" fill={C.yellow} {...ink(1.2)} transform="translate(-6 -10) scale(0.7)" />
      </g>
    </g>
  );
}

const ITEM: Partial<Record<ArmId, (p: { a: number }) => ReactNode>> = { envelope: Envelope, camera: Camera, ticket: Ticket, calendar: Calendar, sign: Sign, bubble: Bubble };

/** one drawn arm: limb, sleeve bump, the thing, the glove */
function DrawnArm({ spec, i, t }: { spec: ArmSpec; i: number; t: number }) {
  const ext = armExt(i, t);
  if (ext <= 0.002) return null;
  const a = Math.max(0, t - popAt(spec)), side = spec.side === "L" ? -1 : 1, e = Math.min(ext, 1.25);
  const w = 6.2 + i * 0.9;
  const S = spec.shoulder;
  const H: [number, number] = [S[0] + (spec.hand[0] - S[0]) * ext + Math.sin(t * w + spec.ph) * 4.5 * Math.min(1, ext), S[1] + (spec.hand[1] - S[1]) * ext + Math.cos(t * w * 0.85 + spec.ph) * 4.5 * Math.min(1, ext)];
  const L = limb(S, H, 16, side);
  const Item = ITEM[spec.id];
  const bump = Math.min(1, ext);
  return (
    <g>
      <path d={L.d} fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
      <g transform={`translate(${f1(L.mx)} ${f1(L.my)}) scale(${bump.toFixed(3)})`}>
        <circle r={10.5} fill={C.ink} />
        <path d="M-5 -5.6 Q0 -8.6 5 -5.6" fill="none" stroke={C.white} strokeWidth={1.6} strokeLinecap="round" opacity={0.75} />
      </g>
      <g transform={`translate(${f1(H[0])} ${f1(H[1])})`}>
        {Item && <g transform={`scale(${e.toFixed(3)})`}><Item a={a} /></g>}
        <g transform={`rotate(${f1(L.ang)}) scale(1 ${spec.side === "L" ? -1 : 1})`}><Glove fist /></g>
      </g>
    </g>
  );
}

/** all the drawn arms (not the rig's phone and megaphone arms) in rig units; wrap in the body's matrix */
export function ExtraArms({ t }: { t: number }) {
  return (
    <g>
      {ARMS.map((s, i) => (s.rig ? null : <DrawnArm key={s.id} spec={s} i={i} t={t} />))}
    </g>
  );
}
void SHOULDER;
