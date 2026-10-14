/**
 * Shorty's body for the Reel: the real rig (src/lib/shorty/mascot), driven by an explicit clock instead of requestAnimationFrame,
 * so every frame is the same every time. His two arms are the rig's; the six extra arms are drawn in Arms.tsx.
 */
import { base, arm, seg, easeOutBack, easeInOutSoft, SHOULDER, type Pose, type Side, type PropState } from "@/lib/shorty/mascot/poses";
import { ARMS, CUT2, CUT3, CUT4, HITS, VOICE_AT, armExt, mouthAt, popAt, wordStart } from "./timeline";

const rel = (s: Side, x: number, y: number): [number, number] => [x - SHOULDER[s][0], y - SHOULDER[s][1]];
const hang = (s: Side, sway = 0) => arm(s === "L" ? -10 - sway : 10 - sway, 52, 14, 0, s === "L" ? -6 : 6);
const hip = (s: Side) => arm(...rel(s, s === "L" ? 22 : 104, 146), 46, 1, s === "L" ? 150 : -150);
const hold = (x: Partial<PropState> = {}): PropState => ({ v: 1, s: 1, hand: "R", rot: 0, ox: 0, oy: 0, at: null, ...x });
const mix = (a: number, b: number, k: number) => a + (b - a) * k;

const BLINKS = [2.6, 5.4, 8.9, 11.2, 14.8, 17.6, 21.3];
const SEEDS = [3, 7, 11];

/** The rig arm that carries the phone (R) or the megaphone (L): out to its spec'd spot, wobbling, then back home. */
function rigArm(side: Side, t: number) {
  const i = ARMS.findIndex((a) => a.rig && a.side === side), a = ARMS[i], ext = armExt(i, t);
  const w = 7.5 + i, ph = a.ph;
  const wob: [number, number] = [Math.sin(t * w + ph) * 4, Math.cos(t * w * 0.8 + ph) * 4];
  const home = side === "L" ? hang("L") : hang("R");
  if (ext <= 0.002) return home;
  const [rx, ry] = rel(side, a.hand[0] + wob[0] * ext, a.hand[1] + wob[1] * ext);
  const out = arm(rx, ry, 12, 1, 0, 1, 1);
  return { hx: mix(home.hx, out.hx, ext), hy: mix(home.hy, out.hy, ext), bend: mix(home.bend, out.bend, Math.min(1, ext)), fist: out.fist, rot: mix(home.rot, 0, Math.min(1, ext)), bump: Math.min(1, ext), front: ext > 0.4 ? 1 : 0 };
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

  /* ── shot 1: he's on the other side of the glass, knocking, then leans in ── */
  if (t < CUT2) {
    for (let i = 0; i < HITS.length; i++) {
      const side: Side = i === 0 ? "R" : "L", sg = side === "R" ? 1 : -1;
      const th = HITS[i];
      const reach = i === 0 ? seg(t, th - 0.2, th) : seg(t, th - 0.14, th);
      const away = seg(t, th + 0.16, th + 0.42);
      const k = reach * (1 - away) * (1 - 0.0);
      if (k <= 0) continue;
      p[side] = arm(sg * mix(10, -11, easeInOutSoft(k)), mix(52, -38, easeInOutSoft(k)), 10, 0, 0, 0, k > 0.25 ? 1 : 0);
    }
    const lean = easeInOutSoft(seg(t, 1.0, 2.2));
    p.rot = 0.8 * Math.sin(t * 1.7);
    p.face = { ...p.face, mouth: m ?? "none", gx: 0, gy: 0.6, eo: 1.1 + 0.1 * lean, bl: -3.5, br: -3.5, blr: -3, brr: -3 };
    for (const th of HITS) { const d = t - th; if (d >= 0 && d < 0.4) { const k = Math.exp(-d * 9); p.sy = 1 - 0.03 * k; p.sx = 1 + 0.02 * k; } }
    return p;
  }

  /* ── shot 2: arms crossed, not impressed ── */
  if (t < CUT3) {
    const landed = easeOutBack(seg(t, CUT2, CUT2 + 0.3), 2);
    p.by += Math.sin(Math.PI * seg(t, CUT2, CUT2 + 0.3)) * 5;
    p.sy = 1 + 0.02 * (1 - landed);
    p.L = arm(...rel("L", 84, 126), 14, 1, 12, 0, 1);
    p.R = arm(...rel("R", 44, 134), 14, 1, -12, 0, 1);
    const shake = Math.sin((t - wordStart("v3", 0)) * 17) * (t > wordStart("v3", 0) && t < wordStart("v3", 0) + 0.5 ? 2.2 : 0);
    p.rot = shake + Math.sin(t * 1.6) * 0.5;
    p.face = { ...p.face, mouth: m ?? "frown", gx: 0, gy: 0.4, eo: 1, bl: 1.5, br: 1.5, blr: -12, brr: -12 };
    return p;
  }

  /* ── shot 3: eight arms ── */
  if (t < CUT4) {
    const hop = Math.sin(Math.PI * seg(t, CUT3, CUT3 + 0.3)) * 5;
    p.by += hop;
    const v4 = VOICE_AT.v4, v5 = VOICE_AT.v5, v6 = VOICE_AT.v6;
    if (t < v5 - 0.1) {                                         // "Those list you and forget you." — a shrug
      const k = easeInOutSoft(seg(t, v4 - 0.05, v4 + 0.3));
      p.L = arm(mix(-10, -30, k), mix(52, 34, k), 14, 0, -40 * k);
      p.R = arm(mix(10, 30, k), mix(52, 34, k), 14, 0, 40 * k);
      p.by += k * 2 * Math.abs(Math.sin(t * 5)) * 0.4;
      p.rot = 1.5 * Math.sin(t * 2.2);
      p.face = { ...p.face, mouth: m ?? "squiggle", gx: 0, gy: 0, bl: -1, br: -2.5, blr: 6, brr: -2 };
    } else if (t < v6 - 0.05) {                                  // "I don't." — hands on hips, chin up
      const k = easeOutBack(seg(t, v5 - 0.1, v5 + 0.15), 1.4);
      p.L = hip("L"); p.R = hip("R");
      p.rot = -2 * k + Math.sin((t - v5) * 14) * 1.6 * (t < v5 + 0.7 ? 1 : 0);
      p.sy = 1 + 0.02 * k;
      p.face = { ...p.face, mouth: m ?? "none", gx: 0, gy: -1, bl: -3 * k, br: -3 * k, blr: -4, brr: -4 };
    } else {                                                     // the list: everything moves at once
      p.L = rigArm("L", t);
      p.R = rigArm("R", t);
      if (armExt(0, t) > 0.01) {
        const c = (t - popAt(ARMS[0])) % 2.4;
        p.props.phone = hold({ hand: "R", ox: 1, oy: 4, s: 1.35, rot: 8 });
        p.fx.text = { on: 1, typing: c < 1.1 ? 1 : 0, pop: c >= 1.1 ? (c - 1.1) / 1.3 : -1, n: Math.floor((t - popAt(ARMS[0])) / 2.4) };
      }
      if (armExt(6, t) > 0.01) {
        p.props.megaphone = hold({ hand: "L", s: 1.45, rot: -158 + Math.sin(t * 11) * 6, ox: 0, oy: -2 });
        const e = armExt(6, t);
        p.fx.shout = Math.min(1, e) * 0.9; p.fx.shoutAt = [-92, 56];
      }
      /* he bounces on every landing */
      for (const a of ARMS) { const d = t - popAt(a); if (d >= 0 && d < 0.35) p.by += Math.sin(Math.PI * d / 0.35) * 3; }
      p.rot = Math.sin(t * 3.1) * 1.4;
      p.face = { ...p.face, mouth: m ?? "grin", gx: Math.sin(t * 1.3) * 1.6, gy: 0, bl: -2.5, br: -2.5 };
    }
    return p;
  }

  /* ── shot 4: arms fold away, back to normal Shorty standing by the truck ── */
  p.L = rigArm("L", t);
  p.R = rigArm("R", t);
  if (armExt(0, t) > 0.01) {
    p.props.phone = hold({ hand: "R", ox: 1, oy: 4, s: 1.35 * Math.min(1, armExt(0, t)), rot: 8 });
    p.fx.text = { on: 1, typing: 1, pop: -1, n: 0 };
  }
  if (armExt(6, t) > 0.01) p.props.megaphone = hold({ hand: "L", s: 1.45 * Math.min(1, armExt(6, t)), rot: -158, ox: 0, oy: -2 });
  const v8 = VOICE_AT.v8, up = easeOutBack(seg(t, v8 + 0.05, v8 + 0.4), 1.6) * (1 - seg(t, v8 + 1.3, v8 + 1.6));
  if (up > 0.01) p.R = arm(mix(10, 26, up), mix(52, -26, up), 12, 3, -10 * up, 0, 0);       // thumbs-up on "I'll handle the rest."
  p.rot = Math.sin(t * 1.9) * 1;
  p.face = { ...p.face, mouth: m ?? "grin", gx: -0.3, gy: 0, bl: -2, br: -2 };
  const tail = seg(t, CUT4, CUT4 + 0.25);
  p.by += Math.sin(Math.PI * tail) * 3;
  return p;
}
