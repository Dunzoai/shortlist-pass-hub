/**
 * Shorty's body for the Reel: the real rig (src/lib/shorty/mascot), driven by an explicit clock instead of requestAnimationFrame,
 * so every frame is the same every time. His two arms are the rig's; the six extra arms are drawn in Arms.tsx the same way
 * (plain strokes with a glove on the end: no joints, no bumps, never crossed).
 */
import { base, arm, seg, easeOutBack, easeInOutSoft, SHOULDER, type Pose, type Side, type PropState } from "@/lib/shorty/mascot/poses";
import { ARMS, CUT2, CUT3, CUT4, HITS, VOICE_AT, armExt, armIndex, mouthAt, popAt, wordStart } from "./timeline";

/** "I go get 'em." starts at word 9 of the second ending line */
const WORD_GO = wordStart("v5", 9) - VOICE_AT.v5;

const rel = (s: Side, x: number, y: number): [number, number] => [x - SHOULDER[s][0], y - SHOULDER[s][1]];
const hang = (s: Side, sway = 0) => arm(s === "L" ? -10 - sway : 10 - sway, 52, 14, 0, s === "L" ? -6 : 6);
const hip = (s: Side) => arm(...rel(s, s === "L" ? 22 : 104, 146), 46, 1, s === "L" ? 150 : -150);
const hold = (x: Partial<PropState> = {}): PropState => ({ v: 1, s: 1, hand: "R", rot: 0, ox: 0, oy: 0, at: null, ...x });
const mix = (a: number, b: number, k: number) => a + (b - a) * k;

const BLINKS = [2.2, 4.4, 7.1, 9.8, 12.3, 15.0, 17.4];
const SEEDS = [3, 7, 11];

/** where his knocking hand is (rig units, relative to his left shoulder): up and out, tapping the glass */
export const KNOCK_HAND: [number, number] = [-26, -66];
function knockLift(t: number): number {
  let l = 0;
  for (const th of HITS) {
    if (t < th) l = Math.max(l, 14 * easeInOutSoft(seg(t, th - 0.2, th - 0.04)));
    else if (t < th + 0.16) l = Math.max(l, -3 * Math.sin(((t - th) / 0.16) * Math.PI));
  }
  return l;
}

/** the rig arm that carries the phone (R) or the megaphone (L): out to its spot, drifting gently, plain stroke */
function rigArm(side: Side, t: number) {
  const i = ARMS.findIndex((a) => a.rig && a.side === side), a = ARMS[i], ext = armExt(i, t);
  const w = 1.7 + i * 0.12, ph = a.ph;
  const home = hang(side);
  if (ext <= 0.002) return home;
  const e = Math.min(1, ext);
  const [rx, ry] = rel(side, a.hand[0] + Math.sin(t * w + ph) * 2.4 * e, a.hand[1] + Math.cos(t * w * 0.8 + ph) * 2.4 * e);
  const out = arm(rx, ry, 12, 1, 0, 0, 1);
  return { hx: mix(home.hx, out.hx, ext), hy: mix(home.hy, out.hy, ext), bend: mix(home.bend, out.bend, e), fist: out.fist, rot: mix(home.rot, 0, e), bump: 0, front: ext > 0.4 ? 1 : 0 };
}

export function shortyPose(t: number): Pose {
  const p = base(t);
  p.t = t;
  p.boilSeed = SEEDS[Math.floor(t * 10) % 3];
  let blink = 1;
  for (const b of BLINKS) { const k = (t - b) / 0.15; if (k >= 0 && k <= 1) blink = 1 - Math.sin(k * Math.PI) * 0.92; }
  p.blink = blink;
  p.by = 0.6 + Math.sin(t * 2.4) * 0.5;
  const m = mouthAt(t);

  /* ── shot 1: knocking on the glass, same hand every time, the other arm at his side ── */
  if (t < CUT2) {
    const lift = knockLift(t);
    p.L = arm(KNOCK_HAND[0] + lift * 0.4, KNOCK_HAND[1] - lift, 10, 1, 0, 0, 1);
    p.R = hang("R", Math.sin(t * 2) * 1.5);
    p.face = { ...p.face, mouth: m ?? "none", gx: 0, gy: 0.2, eo: 0.95, bl: 1.2, br: 1.2, blr: -8, brr: -8 };
    return p;
  }

  /* ── shot 2: arms hanging, listening, not impressed ── */
  if (t < CUT3) {
    const landed = easeOutBack(seg(t, CUT2, CUT2 + 0.3), 2);
    p.by += Math.sin(Math.PI * seg(t, CUT2, CUT2 + 0.3)) * 4;
    p.sy = 1 + 0.02 * (1 - landed);
    p.L = hang("L", Math.sin(t * 1.8) * 1.5); p.R = hang("R", Math.sin(t * 1.8) * 1.5);
    p.rot = Math.sin(t * 1.6) * 0.6;
    p.face = { ...p.face, mouth: m ?? "none", gx: 0, gy: 0.2, eo: 0.95, bl: 1.2, br: 1.2, blr: -8, brr: -8 };
    return p;
  }

  /* ── shot 3: he's your coworker: the arms arrive one on each word, then keep quietly working ── */
  if (t < CUT4) {
    p.by += Math.sin(Math.PI * seg(t, CUT3, CUT3 + 0.3)) * 4;
    p.L = rigArm("L", t);
    p.R = rigArm("R", t);
    const mi = armIndex("megaphone"), pi = armIndex("phone");
    if (armExt(pi, t) > 0.01) {
      const c = (t - popAt(ARMS[pi])) % 2.6;
      p.props.phone = hold({ hand: "R", ox: 1, oy: 4, s: 1.35 * Math.min(1, armExt(pi, t)), rot: 8 });
      p.fx.text = { on: 1, typing: c < 1.2 ? 1 : 0, pop: c >= 1.2 ? (c - 1.2) / 1.4 : -1, n: Math.floor((t - popAt(ARMS[pi])) / 2.6) };
    }
    if (armExt(mi, t) > 0.01) {
      const e = Math.min(1, armExt(mi, t));
      p.props.megaphone = hold({ hand: "L", s: 1.45 * e, rot: -158 + Math.sin(t * 2.4) * 3, ox: 0, oy: -2 });
      p.fx.shout = e * 0.8; p.fx.shoutAt = [-92, 56];
    }
    for (const a of ARMS) { const d = t - popAt(a); if (d >= 0 && d < 0.4) p.by += Math.sin(Math.PI * d / 0.4) * 1.6; }
    p.rot = Math.sin(t * 1.3) * 0.8;
    p.face = { ...p.face, mouth: m ?? "none", gx: Math.sin(t * 1.0) * 0.8, gy: 0.1, eo: 0.95, bl: 1.2, br: 1.2, blr: -8, brr: -8 };
    return p;
  }

  /* ── shot 4: just him, flat and hard. Arms down for the finder line, hands on hips for "quit selling your truck short",
        a finger out for "I go get 'em", then the same finger down toward the end card for "Get on the Shortlist. Free." ── */
  const v5 = VOICE_AT.v5, v6 = VOICE_AT.v6, goAt = v5 + wordTimeV5Go();
  const k = easeOutBack(seg(t, CUT4, CUT4 + 0.3), 1.4);
  p.by += Math.sin(Math.PI * seg(t, CUT4, CUT4 + 0.3)) * 4;
  const hipsK = easeInOutSoft(seg(t, v5 - 0.1, v5 + 0.2));
  const sway = Math.sin(t * 1.8) * 1.2;
  const mixArm = (a: ReturnType<typeof arm>, b: ReturnType<typeof arm>, kk: number) => ({ hx: mix(a.hx, b.hx, kk), hy: mix(a.hy, b.hy, kk), bend: mix(a.bend, b.bend, kk), fist: kk > 0.5 ? b.fist : a.fist, rot: mix(a.rot, b.rot, kk), bump: 0, front: kk > 0.5 ? b.front : a.front });
  p.L = mixArm(hang("L", sway), hip("L"), hipsK);
  p.R = mixArm(hang("R", sway), hip("R"), hipsK);
  const pointK = easeOutBack(seg(t, goAt - 0.05, goAt + 0.25), 1.3);
  const pointDown = easeInOutSoft(seg(t, v6 + 0.3, v6 + 0.6));
  if (pointK > 0.01) p.R = mixArm(p.R as ReturnType<typeof arm>, arm(mix(32, 26, pointDown), mix(18, 62, pointDown), 10, 2, mix(-8, 38, pointDown), 0, 0), Math.min(1, pointK));
  const shakeNo = t > v5 + 1.6 && t < v5 + 2.15 ? Math.sin((t - v5 - 1.6) * 24) * 2.2 : 0;
  p.rot = -1 * k + shakeNo + Math.sin(t * 1.9) * 0.4;
  p.sy = 1 + 0.015 * k;
  p.face = { ...p.face, mouth: m ?? "none", gx: 0, gy: 0.1, eo: 0.95, bl: 1.6, br: 1.6, blr: -10, brr: -10 };
  return p;
}
function wordTimeV5Go() { return WORD_GO; }
