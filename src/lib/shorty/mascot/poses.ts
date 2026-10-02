// Copied from the app repo (loyalty-pwa lib/shorty/mascot/poses.ts) on 2026-10-01 for the
// website hero. The app is the source of truth; poses.ts adds the `walk` pose here.
/**
 * ── SHORTY'S POSE LIBRARY (2026-09-29) ──────────────────────────────────────
 *
 * Ported from the approved prototype (prototypes/shorty-moods.html, vintage
 * version). PURE: no DOM, no React. A pose is a function of time `t` (seconds
 * since the mood began) that returns every joint, prop and effect for one frame;
 * `rig.ts` draws it.
 *
 * THE DEFAULTS LIVE HERE. A vertical overrides a mood (or a mood+task) in ITS OWN
 * skill file (`lib/dashboard/verticals/skills/*.ts` → `mascot`), never in the
 * component. Lookup order, tested in poses.test.ts:
 *
 *   vertical mood:task → vertical mood → default mood:task → default mood
 *
 * An override may bring a whole new `pose`, or just `swapProps` over the pose it
 * falls back to (food truck: the chef pose with a spatula for the whisk).
 * Docs: docs/features/admin-dashboard/shorty-mascot.md.
 */

export type MascotMood = 'walk' | 'wait' | 'nod' | 'pocket' | 'tapping' | 'pleased' | 'content' | 'whistle' | 'proud' | 'surprised' | 'hello' | 'idle' | 'listening' | 'thinking' | 'working' | 'done' | 'oops';
export type MascotTask = 'menu' | 'event' | 'social' | 'text' | 'none';
export type Side = 'L' | 'R';

export const PROP_NAMES = ['whisk', 'spatula', 'bowl', 'pad', 'pencil', 'phone', 'phoneBack', 'megaphone', 'hammer', 'stamp'] as const;
export type PropName = typeof PROP_NAMES[number];

export type Arm = { hx: number; hy: number; bend: number; fist: number; rot: number; bump: number; front: number };
export type PropState = { v: number; s: number; hand: Side; rot: number; ox: number; oy: number; at: [number, number] | null };
export type MouthShape = 'none' | 'grin' | 'o' | 'squiggle' | 'shout' | 'frown';
export type Foot = { x: number; lift: number; tilt: number };
export type Paper = { x: number; y: number; r: number; v: number };
export type Pose = {
  t: number; by: number; dx: number; rot: number; sx: number; sy: number; hat: number;
  L: Arm; R: Arm;
  feet: { L: Foot; R: Foot; bow: number };
  face: { bl: number; blr: number; br: number; brr: number; gx: number; gy: number; eo: number; mouth: MouthShape };
  props: Record<PropName, PropState>;
  world: { sign: { v: number; sink: number; wob: number }; live: number; papers: Paper[] };
  fx: {
    q: number; sparkle: number; shake: number; dust: number; bulb: number; lit: number; notes: number;
    shout: number; shoutAt: [number, number];
    text: { on: number; typing: number; pop: number; n: number };
    /** The phone's screen light on his face (website hero), 0–1. */
    glow?: number;
  };
  /** Set per frame by the component, not by a pose. */
  blink?: number; boilSeed?: number;
};
export type PoseFn = (t: number) => Pose;

/** One entry of the library, default or vertical. */
export type PoseEntry = {
  /** A whole pose of its own. Omit to reuse the pose this key falls back to. */
  pose?: PoseFn;
  /** Draw one prop as another, same place and motion (whisk → spatula). */
  swapProps?: Partial<Record<PropName, PropName>>;
  /** Seconds into the pose to show when motion is reduced. */
  still?: number;
};
/** A vertical's overrides, keyed `mood` or `mood:task` ('working:menu'). */
export type MascotOverrides = Partial<Record<string, PoseEntry>>;

/* ── Geometry, in the reference PNG's own 126×240 space ────────────────────── */
export const BODY = { x0: 14, x1: 112, y0: 3, y1: 172, r: 11, ny: 77, nr: 5.5 };
export const SHOULDER: Record<Side, [number, number]> = { L: [15, 100], R: [111, 100] };
export const HIP: Record<Side, [number, number]> = { L: [52, 170], R: [75, 170] };
export const FOOT: Record<Side, [number, number]> = { L: [44, 228], R: [84, 228] };
export const PIVOT: [number, number] = [63, 172];
export const EYE: Record<Side, [number, number]> = { L: [51.5, 45.5], R: [72.5, 45.5] };
export const BROW: Record<Side, [number, number]> = { L: [49, 32], R: [74.5, 32] };
export const MOUTH: [number, number] = [62, 58];

/* ── Easing ─────────────────────────────────────────────────────────────── */
export const clamp01 = (k: number) => Math.max(0, Math.min(1, k));
export const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const easeOutBack = (k: number, s = 1.9) => 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2);
/** Mood-to-mood: ease-in-out with only a whisper of overshoot. */
export const easeInOutSoft = (k: number) => {
  const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  return e + Math.sin(Math.PI * k) * 0.04 * k;
};

/* ── Building blocks ────────────────────────────────────────────────────── */
/** Hand offset from the shoulder. `bend` always bows OUT (rig.ts); `front` = reaches in front of the body. */
export const arm = (hx: number, hy: number, bend = 12, fist = 0, rot = 0, bump = 0, front = 0): Arm => ({ hx, hy, bend, fist, rot, bump, front });
const to = (s: Side, x: number, y: number): [number, number] => [x - SHOULDER[s][0], y - SHOULDER[s][1]];
const hang = (s: Side, sway = 0) => arm(s === 'L' ? -10 - sway : 10 - sway, 52, 14, 0, s === 'L' ? -6 : 6);
/** Glove on the hip, arm in a wide akimbo loop. */
const hip = (s: Side) => arm(...to(s, s === 'L' ? 22 : 104, 146), 46, 1, s === 'L' ? 150 : -150);
const noProp = (): PropState => ({ v: 0, s: 1, hand: 'R', rot: 0, ox: 0, oy: 0, at: null });
const hold = (extra: Partial<PropState> = {}): PropState => ({ ...noProp(), v: 1, ...extra });
const paperRest = (i: number): Paper => ({ x: 63 + (i - 1.5) * 1.5, y: 120 - i * 3, r: (i - 1.5) * 3, v: 0 });

export const base = (t: number): Pose => ({
  t, by: 0, dx: 0, rot: 0, sx: 1, sy: 1, hat: 0,
  L: hang('L'), R: hang('R'),
  feet: { L: { x: 0, lift: 0, tilt: 0 }, R: { x: 0, lift: 0, tilt: 0 }, bow: 0 },
  face: { bl: 0, blr: 0, br: 0, brr: 0, gx: 0, gy: 0, eo: 1, mouth: 'none' },
  props: Object.fromEntries(PROP_NAMES.map(k => [k, noProp()])) as Record<PropName, PropState>,
  world: { sign: { v: 0, sink: 0, wob: 0 }, live: 0, papers: [0, 1, 2, 3].map(paperRest) },
  fx: { q: 0, sparkle: 0, shake: 0, dust: 0, bulb: 0, lit: 0, notes: 0, shout: 0, shoutAt: [0, 0], text: { on: 0, typing: 0, pop: -1, n: 0 } },
});

/* ── The moods ──────────────────────────────────────────────────────────── */
/**
 * THE WALK (website hero, 2026-10-01): a stroll toward screen-left, in place —
 * the caller slides the whole box across the page. One stride cycle = one step
 * per foot. A foot lifts only while it swings forward (left), so the soles
 * never skate; arms swing against the legs; the body bobs at mid-stance and
 * leans into the walk.
 */
export const WALK_HZ = 1.7;
function walk(t: number): Pose {
  const p = base(t), w = t * Math.PI * 2 * WALK_HZ, s = Math.sin(w), c = Math.cos(w), A = 13;
  p.feet.L = { x: -A * s, lift: Math.max(0, c) * 9, tilt: -Math.max(0, c) * 14 };
  p.feet.R = { x: A * s, lift: Math.max(0, -c) * 9, tilt: -Math.max(0, -c) * 14 };
  p.by = Math.abs(c) * 3; p.sy = 1 + Math.abs(c) * 0.012; p.sx = 1 - Math.abs(c) * 0.008;
  p.rot = -3.5 + c * 0.8;
  p.L = arm(-10 + s * 10, 50 - Math.abs(s) * 4, 14, 0, -6 + s * 8);
  p.R = arm(10 - s * 10, 50 - Math.abs(s) * 4, 14, 0, 6 - s * 8);
  p.face = { ...p.face, mouth: 'grin', bl: -2, br: -2, gx: -2.2, gy: -0.4 };
  return p;
}
/**
 * WAITING (website hero, 2026-10-01): standing around after the walk-in. A
 * gentle bob, an easy foot tap, arms swaying, and he looks around — left,
 * back to you, right, back — with a little brow lift on each look.
 */
function wait(t: number): Pose {
  const p = base(t), w = t * 2.6, tap = Math.max(0, Math.sin(w * 1.5));
  p.by = 1 + Math.sin(w) * 1.4; p.sy = 1 + Math.sin(w) * 0.006;
  p.rot = Math.sin(w / 2) * 1.2;
  p.L = hang('L', 2.5 * Math.sin(w / 2)); p.R = hang('R', 2.5 * Math.sin(w / 2));
  p.feet.R.tilt = -tap * 14; p.feet.R.lift = tap * 1.5;
  const c = t % 7, k = (a: number, b: number) => seg(c, a, a + 0.35) * (1 - seg(c, b, b + 0.35));
  const left = k(1.2, 2.6), right = k(4.2, 5.6);
  p.face = { ...p.face, mouth: 'none', gx: -2.8 * left + 2.8 * right, gy: -0.4, bl: -1 - left * 1.5, br: -1 - right * 1.5 };
  p.rot += -1.5 * left + 1.5 * right;
  return p;
}
/** SURPRISED (website hero): something's coming from the right. Eyes wide, a little hop, gloves up. */
function surprised(t: number): Pose {
  const p = base(t), k = easeOutBack(seg(t, 0, 0.25)), hop = Math.sin(Math.PI * seg(t, 0, 0.3));
  p.by = hop * 6; p.sy = 1 + hop * 0.03; p.rot = 3 * k;
  p.L = arm(-26 * k - 10 * (1 - k), 52 - 34 * k, 12, 0, -50 * k);
  p.R = arm(26 * k + 10 * (1 - k), 52 - 34 * k, 12, 0, 50 * k);
  p.face = { ...p.face, mouth: 'o', eo: 1 + 0.4 * k, gx: 3 * k, gy: -0.8, bl: -4.5 * k, br: -4.5 * k };
  p.feet.L.lift = hop * 3; p.feet.R.lift = hop * 3;
  return p;
}
/** NOD (website hero): a text just came in up and to his right. He glances up at it, then two easy nods. */
function nod(t: number): Pose {
  const p = base(t), look = easeOutBack(seg(t, 0, 0.3), 1.2);
  const n = t > 0.55 ? Math.max(0, Math.sin((t - 0.55) * Math.PI * 2.6)) * (1 - seg(t, 1.3, 1.6)) : 0;
  p.by = 0.6 + Math.sin(t * 2.4) * 0.6 - n * 1.5; p.rot = 1.5 * look + n * 2;
  p.L = hang('L', Math.sin(t * 2) * 1.5); p.R = hang('R', Math.sin(t * 2) * 1.5);
  p.face = { ...p.face, mouth: 'none', gx: 2.4 * look, gy: -2.2 * look + n * 2.5, bl: -1.5 * look, br: -2.5 * look };
  return p;
}
/** PLEASED (website hero): reply sent. A small smile, a gentle bob, eyes back on you. */
function pleased(t: number): Pose {
  const p = base(t), w = t * 2.4, k = Math.sin(Math.PI * seg(t, 0, 0.35));
  p.by = k * 2.5 + Math.abs(Math.sin(w)) * 0.8; p.sy = 1 + k * 0.012;
  p.rot = Math.sin(w / 2) * 1;
  p.L = hang('L', 2 * Math.sin(w / 2)); p.R = hang('R', 2 * Math.sin(w / 2));
  p.face = { ...p.face, mouth: 'grin', gx: -0.6, gy: 0, bl: -2, br: -2 };
  p.feet.R.tilt = -Math.max(0, Math.sin(w * 1.5)) * 10;
  return p;
}
/** TAPPING (website hero): phone up at his chest in both gloves, screen toward him (we see the back),
    thumb tapping, eyes on the screen; the rig lights his face with its glow. */
export const TAP_PHONE_AT: [number, number] = [84, 132];
function tapping(t: number): Pose {
  const p = base(t), up = seg(t, 0, 0.4), tap = Math.max(0, Math.sin(t * 13)) * 0.9;
  const [px, py] = TAP_PHONE_AT;
  p.by = 0.5 + Math.sin(t * 2.2) * 0.5; p.rot = 1.5;
  /* both gloves wrap the phone's lower edges; the thumbs are on the screen side, out of sight,
     so all we see is the phone give a tiny bob with each tap. The phone rides in his right
     glove (not pinned in space), so it travels with the hand from his side up to his chest. */
  p.props.phoneBack = hold({ hand: 'R', ox: -15, oy: 14, s: 1.5, rot: -6 });
  p.fx.glow = up;
  p.R = arm(...to('R', px + 15, py - 14 - tap), 14, 1, 56, 0, 1);     // fingers wrap in from the right edge
  p.L = arm(...to('L', px - 16, py - 12 - tap), 16, 1, -20, 0, 1);    // and from the left
  p.face = { ...p.face, mouth: 'none', gx: 1.6, gy: 2.8, bl: 1, br: 0.5, blr: 6, brr: -4 };
  return p;
}
/** CONTENT (website hero): job done, mouth closed, eyes squinting happy, a slow satisfied nod. */
function content(t: number): Pose {
  const p = base(t), w = t * 2.2, k = Math.sin(Math.PI * seg(t, 0, 0.4));
  p.by = k * 1.5 + Math.sin(w) * 0.5; p.rot = -1 + Math.sin(w / 2) * 0.8;
  p.L = hang('L', 1.5 * Math.sin(w / 2)); p.R = hang('R', 1.5 * Math.sin(w / 2));
  p.face = { ...p.face, mouth: 'none', eo: 0.55, gx: 0, gy: 0.6, bl: -2.5, br: -2.5 };
  return p;
}
/** WHISTLE (website hero): a little tune while he waits for the next one, notes floating up. */
function whistle(t: number): Pose {
  const p = base(t), w = t * 3;
  p.by = Math.abs(Math.sin(w)) * 0.8; p.rot = Math.sin(w / 2) * 1.4;
  p.L = hang('L', 3 * Math.sin(w / 2)); p.R = hang('R', 3 * Math.sin(w / 2));
  p.feet.L.tilt = -Math.max(0, Math.sin(w)) * 12; p.feet.L.lift = Math.max(0, Math.sin(w)) * 1.2;
  p.face = { ...p.face, mouth: 'o', gx: 1.2, gy: -1.2, bl: -2, br: -1 };
  p.fx.notes = 1;
  return p;
}
/** PROUD (website hero): glove on his hip, chin up, eyebrows doing the talking. */
function proud(t: number): Pose {
  const p = base(t), k = easeOutBack(seg(t, 0, 0.35), 1.3);
  p.L = hip('L'); p.R = hang('R', Math.sin(t * 2) * 1.5);
  p.rot = -2.5 * k; p.sy = 1 + 0.02 * k; p.by = 0.6 + Math.sin(t * 2.2) * 0.4;
  p.face = { ...p.face, mouth: 'none', gx: -0.4, gy: -1, bl: -3.5 * k, br: -1 * k, brr: 8 * k };
  return p;
}
/** POCKET (website hero): after the wave, he reaches to his hip, pulls his phone out of
    his pocket and brings it up to a relaxed hold at his waist. */
function pocket(t: number): Pose {
  const p = base(t);
  const reach = easeInOutSoft(seg(t, 0, 0.3)), lift = easeInOutSoft(seg(t, 0.38, 0.85));
  const hipX = 108, hipY = 166;
  const hx = 121 + (hipX - 121) * reach + (REST_HAND[0] - hipX) * lift;
  const hy = 152 + (hipY - 152) * reach + (REST_HAND[1] - hipY) * lift;
  p.R = arm(...to('R', hx, hy), 14, 1, 71 * lift + 6 * (1 - lift), 0, lift > 0.5 ? 1 : 0);
  const out = seg(t, 0.3, 0.42);
  p.props.phoneBack = { v: Math.max(0.001, out), s: 0.9 + 0.4 * lift, hand: 'R', rot: -8 * lift + 20 * (1 - lift), ox: -6 * lift, oy: 10, at: null };
  p.L = hang('L', Math.sin(t * 3) * 1.5);
  p.rot = 2 * reach * (1 - lift); p.by = 0.6 + Math.sin(t * 2.4) * 0.4;
  p.face = { ...p.face, mouth: 'none', gx: 1.6 * reach * (1 - lift), gy: 2.4 * reach * (1 - lift), bl: -1, br: -1 };
  return p;
}
function hello(t: number): Pose {
  const p = base(t), hop = t < 0.5 ? Math.sin(Math.PI * t / 0.5) : 0, land = seg(t, 0.5, 0.6) * (1 - seg(t, 0.6, 0.8));
  p.by = hop * 5; p.sy = 1 + hop * 0.02 - land * 0.025; p.sx = 1 - hop * 0.01 + land * 0.02;
  /* THE WAVE: the whole arm swings from the shoulder; straight wrist, open glove, finger wiggle */
  const th = (26 + 16 * Math.sin(t * 4.2)) * Math.PI / 180, L = 70;
  p.R = arm(L * Math.sin(th), -L * Math.cos(th), 9, 0, 5 * Math.sin(t * 11));
  p.L = hang('L', Math.sin(t * 3) * 3);
  p.rot = -1.5 + Math.sin(t * 4.2) * 0.6;
  p.face = { ...p.face, mouth: 'grin', bl: -2.5, br: -2.5 };
  p.feet.L.lift = hop * 2; p.feet.R.lift = hop * 2; p.feet.L.tilt = hop * -5; p.feet.R.tilt = hop * -5;
  return p;
}
function idle(t: number): Pose {
  const p = base(t), w = t * 3.2, tapL = Math.max(0, Math.sin(w)), tapR = Math.max(0, -Math.sin(w));
  p.by = Math.abs(Math.sin(w)) * 0.9; p.rot = Math.sin(w / 2) * 1.1;
  p.L = hang('L', 3.5 * Math.sin(w / 2)); p.R = hang('R', 3.5 * Math.sin(w / 2));
  p.feet.L.tilt = -tapL * 12; p.feet.L.lift = tapL * 1.2;
  p.feet.R.tilt = -tapR * 12; p.feet.R.lift = tapR * 1.2;
  const whistling = (t % 2.6) < 1.5;
  p.face = { ...p.face, mouth: whistling ? 'o' : 'none', bl: -1.5, br: -1.5, gx: Math.sin(t * 0.9) * 1.2, gy: -0.6 };
  p.fx.notes = whistling ? 1 : 0;
  return p;
}
function listening(t: number): Pose {
  const p = base(t), nod = Math.sin(t * 2.2);
  p.rot = -2 + nod * 0.9; p.by = 0.5 + Math.abs(nod) * 0.5;
  /* notepad in front at chest height; the near glove grips its LEFT edge in front of it */
  const pad: [number, number] = [34, 106];
  p.props.pad = hold({ at: pad, s: 1.55 });
  p.L = arm(...to('L', pad[0] + 1, pad[1] + 8), 16, 1, 0, 0, 1);
  const sx = Math.sin(t * 9) * 3, sy = Math.cos(t * 5.5) * 1.6;
  p.R = arm(...to('R', 88 + sx, 122 + sy), 16, 1, 0, 0, 1);
  p.props.pencil = hold({ hand: 'R', rot: 216, s: 1.45 });
  const look = (t % 1.7) < 0.7;
  p.face = { ...p.face, mouth: 'none', gx: look ? -1.6 : 0.4, gy: look ? 2.8 : -0.4, bl: 0.8, br: -0.6, blr: 8, brr: -4 };
  return p;
}
function thinking(t: number): Pose {
  const p = base(t), s = Math.sin(t * 1.3);
  p.rot = -4 + s * 0.8; p.by = 0.4 + Math.sin(t * 1.6) * 0.4;
  /* scratching the SIDE of his head: fingers up and in, cuff toward the arm */
  const scr = Math.sin(t * 9);
  p.R = arm(...to('R', 116, 30 + scr * 2.5), 16, 0, -32 + scr * 6, 0, 1);
  p.L = hip('L');
  p.fx.bulb = easeOutBack(seg(t, 0.15, 0.45));
  const flick = t < 0.45 ? 0 : [0.55, 1.05, 1.5].some(x => Math.abs(t - x) < 0.09) ? 0.55 : 0.05;
  p.fx.lit = t >= 1.9 ? 1 : flick;
  if (t >= 1.9) p.fx.bulb *= 1 + 0.28 * Math.sin(Math.PI * clamp01((t - 1.9) / 0.3));
  const got = t >= 1.95;
  p.face = { ...p.face, mouth: got ? 'grin' : 'squiggle', gx: got ? 0 : 1.6, gy: got ? -1 : -3, bl: got ? -3 : 0.5, br: -3, blr: got ? 0 : -6 };
  p.feet.R.tilt = -10 + s * 4; p.feet.R.lift = 2;
  return p;
}
/** The shared working base: a small busy bounce, determined brows. */
function workingBase(t: number): Pose {
  const p = base(t), w = t * 6, hop = Math.abs(Math.sin(w));
  p.by = hop * 1; p.sy = 1 - (1 - hop) * 0.012; p.sx = 1 + (1 - hop) * 0.008;
  p.feet.L.x = Math.sin(w * 0.5) * 1.5; p.feet.R.x = -Math.sin(w * 0.5) * 1.5;
  p.feet.L.lift = Math.max(0, Math.sin(w * 0.5)); p.feet.R.lift = Math.max(0, -Math.sin(w * 0.5));
  p.face = { ...p.face, mouth: 'none', bl: 1.5, br: 1.5, blr: 10, brr: 10 };
  return p;
}
/** Working with no particular desk (FAQs, or a task not yet known): busy hands at his sides. */
function working(t: number): Pose {
  const p = workingBase(t), w = t * 6;
  p.L = arm(-18, 30 + Math.sin(w) * 8, 14, 1); p.R = arm(18, 30 - Math.sin(w) * 8, 14, 1);
  return p;
}
function workingMenu(t: number): Pose {
  const p = workingBase(t);
  p.hat = easeOutBack(seg(t, 0, 0.3));
  const bowl: [number, number] = [60, 148];
  p.props.bowl = hold({ at: bowl, s: 1.5 });
  p.L = arm(...to('L', bowl[0] - 27, bowl[1] + 2), 16, 1, -10, 0, 1);   // glove on the rim
  const a = t * 9;
  p.R = arm(...to('R', 88 + Math.cos(a) * 6, 112 + Math.sin(a) * 3), 16, 1, 0, 0, 1);
  p.props.whisk = hold({ hand: 'R', rot: 125 + Math.sin(a) * 10, s: 1.6 });
  p.face.gx = -1.2; p.face.gy = 2.6;
  return p;
}
function workingEvent(t: number): Pose {
  const p = workingBase(t);
  p.world.sign.v = easeOutBack(seg(t, 0, 0.3));
  const ph = (t * 1.3) % 1, n = Math.floor(t * 1.3);
  const k = ph < 0.72 ? ph / 0.72 : 1 - (ph - 0.72) / 0.28;       // slow wind-up, fast swing
  const th = (-25 + 110 * k) * Math.PI / 180, L = 62;            // k=0 strike, k=1 over the shoulder
  p.R = arm(L * Math.cos(th) * 0.9, -L * Math.sin(th) + 18, 10, 1, 0);
  p.props.hammer = hold({ hand: 'R', rot: 114 - 234 * k, s: 1.45 });
  const hit = ph > 0.96 || ph < 0.07;
  p.world.sign.sink = Math.min(12, n * 2.5); p.world.sign.wob = hit ? 3 : 0;
  if (hit && t > 0.3) { p.fx.shake = 0.6; p.sy -= 0.015; }
  p.L = hang('L'); p.rot = 2 + k;
  p.face.gx = 2.5; p.face.gy = 1.5;
  return p;
}
function workingSocial(t: number): Pose {
  const p = workingBase(t);
  const mp: [number, number] = [MOUTH[0] + 4, MOUTH[1] + 2];       // cone megaphone at his mouth
  p.props.megaphone = hold({ at: mp, rot: -14, s: 1.05 });
  p.R = arm(...to('R', mp[0] + 16.6, mp[1] + 14.6), 12, 1, 0, 0, 1);
  p.L = hip('L');
  p.face = { ...p.face, mouth: 'shout', bl: -2.5, br: -2.5, blr: 0, brr: 0 };
  p.fx.shout = 1; p.fx.shoutAt = [mp[0] + 40, mp[1] - 10];
  p.by += Math.sin(t * 5) * 0.4;
  return p;
}
function workingText(t: number): Pose {
  const p = workingBase(t);
  /* he just HOLDS it out to the side: the screen and the bubbles do the work */
  p.by = 0; p.sx = 1; p.sy = 1;
  p.feet.L = { x: 0, lift: 0, tilt: 0 }; p.feet.R = { x: 0, lift: 0, tilt: 0 };
  p.R = arm(38, 0, 14, 1, 0, 0);
  p.props.phone = hold({ hand: 'R', ox: 1, oy: 4, s: 1.75 });
  p.L = hip('L');
  p.rot = 2.5;
  const cyc = 2.4, c = t % cyc;
  p.fx.text = { on: 1, typing: c < 1.1 ? 1 : 0, pop: c >= 1.1 ? (c - 1.1) / (cyc - 1.1) : -1, n: Math.floor(t / cyc) };
  p.face = { ...p.face, gx: 2.4, gy: 1.6, bl: -1, br: -1 };
  return p;
}
function done(t: number): Pose {
  const p = base(t);
  p.face = { ...p.face, mouth: 'grin', bl: -2, br: -2 };
  if (t < 1.0) {                                                    // the rubber stamp
    const up = easeOutBack(seg(t, 0, 0.4), 1.2), slam = seg(t, 0.4, 0.5), gone = seg(t, 0.82, 1);
    p.R = arm(20 + 6 * slam, -58 * up * (1 - slam) + 84 * slam, 12, 1, 0);
    p.props.stamp = hold({ hand: 'R', v: Math.max(0.001, 1 - gone), s: 1.55 });
    p.L = arm(-30, 12, 12, 0, -30);
    p.rot = 2 + 5 * slam; p.dx = 3 * slam;
    const since = t - 0.5;
    if (since >= 0) { const d = Math.exp(-since * 10); p.sy = 1 - 0.035 * d; p.sx = 1 + 0.025 * d; p.fx.shake = Math.sin(since * 60) * d; }
    p.world.live = since >= 0 ? easeOutBack(seg(since, 0, 0.18), 2.2) : 0;
    return p;
  }
  p.world.live = 1;
  /* THE FLEX: upper arm out, forearm up, bowed outward, a round muscle bump */
  const k = easeOutBack(seg(t, 1.0, 1.35));
  if (t < 1.95) {
    p.R = arm(10 + 26 * k, 52 - 100 * k, 14 + 20 * k, 1, -20 * k, k * (1 + 0.1 * Math.sin(t * 12) * seg(t, 1.35, 1.6)));
    p.L = hip('L');
    p.rot = -4 * k; p.sy = 1 + 0.03 * k;
    p.face.br = -3.5; p.face.brr = 10;
    return p;
  }
  p.R = arm(36, -48, 34, 1, -20, 1); p.L = hip('L'); p.rot = -4; p.sy = 1.03;
  p.face.br = -3.5; p.face.brr = 10;
  const up = seg(t, 1.95, 2.15), down = seg(t, 2.15, 2.23);        // the stomp
  p.feet.L.lift = up * 14 * (1 - down); p.feet.L.tilt = -up * 18 * (1 - down);
  const since = t - 2.23;
  if (since >= 0) {
    const d = Math.exp(-since * 9);
    p.sy -= 0.04 * d; p.sx += 0.03 * d; p.by = -0.8 * d;
    p.fx.shake = Math.sin(since * 60) * 1.8 * d;
    p.fx.dust = clamp01(1 - since / 0.45);
    p.fx.sparkle = clamp01(since / 0.2) * (since < 1.2 ? 1 : 0.55);
    p.R.bump = 1 + 0.06 * Math.sin(t * 3);
  }
  return p;
}
function oops(t: number): Pose {
  const p = base(t), slip = 0.35;
  if (t < slip) {                                                   // carrying a stack of papers
    p.L = arm(...to('L', 46, 128), 16, 1, 0, 0, 1); p.R = arm(...to('R', 80, 128), 16, 1, 0, 0, 1);
    p.world.papers = [0, 1, 2, 3].map(i => ({ ...paperRest(i), v: 1 }));
    return p;
  }
  const tau = t - slip;
  const VEL: Array<[number, number, number]> = [[-60, -70, -260], [45, -95, 300], [-25, -40, 180], [70, -55, -220]];
  p.world.papers = VEL.map(([vx, vy, vr], i) => {
    const r0 = paperRest(i), g = 420, ground = 222 + i * 2;
    const tHit = (-vy + Math.sqrt(vy * vy + 2 * g * (ground - r0.y))) / g, tl = Math.min(tau, tHit);
    let r = r0.r + vr * tl;
    if (tau >= tHit) r = 90 * Math.round(r / 90) + (i - 1.5) * 8;
    return { x: r0.x + vx * tl, y: r0.y + vy * tl + 0.5 * g * tl * tl, r, v: 1 };
  });
  /* THE SHRUG: both arms out to the sides, open gloves, palms up */
  const k = easeOutBack(seg(tau, 0.1, 0.45), 1.2), bob = Math.sin(t * 2.2) * 1.5 * seg(tau, 0.4, 0.6);
  p.L = arm(-36 * k - 6 * (1 - k), 52 - 70 * k + bob, 12, 0, -40 * k);
  p.R = arm(36 * k + 6 * (1 - k), 52 - 70 * k + bob, 12, 0, 40 * k);
  p.by = 1.5 * k; p.rot = -4 * k; p.sy = 1 + 0.015 * k;
  p.fx.q = easeOutBack(seg(tau, 0.5, 0.75));
  p.face = { ...p.face, mouth: tau < 0.15 ? 'none' : 'frown', bl: -2.5, br: -1, blr: -12, brr: -12, gx: 0, gy: 1.2 };
  p.feet.L.tilt = 8; p.feet.R.tilt = 8;
  return p;
}

/** The default library. `still` = the frame shown under reduced motion. */
export const DEFAULT_POSES: Record<string, PoseEntry> = {
  walk: { pose: walk, still: 0.15 },
  wait: { pose: wait, still: 0.5 },
  nod: { pose: nod, still: 0.4 },
  pocket: { pose: pocket, still: 1 },
  tapping: { pose: tapping, still: 0.6 },
  pleased: { pose: pleased, still: 0.6 },
  content: { pose: content, still: 0.8 },
  whistle: { pose: whistle, still: 0.8 },
  proud: { pose: proud, still: 0.8 },
  surprised: { pose: surprised, still: 0.4 },
  hello: { pose: hello, still: 1.2 },
  idle: { pose: idle, still: 3.0 },
  listening: { pose: listening, still: 0.4 },
  thinking: { pose: thinking, still: 2.6 },
  working: { pose: working, still: 0.5 },
  'working:menu': { pose: workingMenu, still: 0.5 },
  'working:event': { pose: workingEvent, still: 0.3 },
  'working:social': { pose: workingSocial, still: 0.5 },
  'working:text': { pose: workingText, still: 1.8 },
  done: { pose: done, still: 3.2 },
  oops: { pose: oops, still: 2.0 },
};

export type ResolvedPose = {
  /** Which key answered, and from which library — for tests and the debug attribute. */
  key: string; source: 'vertical' | 'default';
  pose: PoseFn; swapProps: Partial<Record<PropName, PropName>>; still: number;
};

/**
 * vertical mood:task → vertical mood → default mood:task → default mood.
 * A vertical entry with no `pose` borrows the pose of the first DEFAULT that
 * answers for the same mood/task, and keeps its own swaps.
 */
/**
 * The website hero keeps the phone in his right glove the whole time: any pose that isn't
 * already working the phone gets it hanging from his hand at his side, back toward us.
 */
export function withPhoneInHand(p: Pose): Pose {
  if (p.props.phoneBack.v > 0.5) return p;
  restHold(p);
  return p;
}
/** Phone held loosely at his waist in the right glove, back toward us, screen off. */
export const REST_HAND: [number, number] = [94, 150];
function restHold(p: Pose, k = 1, s = 1.3) {
  p.R = arm(...to('R', REST_HAND[0], REST_HAND[1]), 14, 1, 71, 0, 1);
  p.props.phoneBack = { v: k, s, hand: 'R', rot: -8, ox: -6, oy: 10, at: null };
}

export function resolvePose(mood: MascotMood, task: MascotTask = 'none', overrides?: MascotOverrides | null): ResolvedPose {
  const keys = task !== 'none' ? [`${mood}:${task}`, mood] : [mood];
  const fromDefault = keys.map(k => [k, DEFAULT_POSES[k]] as const).find(([, e]) => e?.pose)
    ?? (['idle', DEFAULT_POSES.idle] as const);
  for (const k of keys) {
    const v = overrides?.[k];
    if (v) {
      return {
        key: k, source: 'vertical',
        pose: v.pose ?? fromDefault[1]!.pose!,
        swapProps: v.swapProps ?? {},
        still: v.still ?? fromDefault[1]!.still ?? 0.5,
      };
    }
  }
  return { key: fromDefault[0], source: 'default', pose: fromDefault[1]!.pose!, swapProps: fromDefault[1]!.swapProps ?? {}, still: fromDefault[1]!.still ?? 0.5 };
}

/** Blend two poses: numbers interpolate, words switch halfway. */
export function lerpPose<T>(a: unknown, b: T, k: number): T {
  if (typeof b === 'number') { const a0 = typeof a === 'number' ? a : b; return (a0 + (b - a0) * k) as T; }
  if (b === null || typeof b !== 'object') return (k < 0.5 && a !== undefined ? a : b) as T;
  if (Array.isArray(b)) return b.map((v, i) => lerpPose((a as unknown[] | undefined)?.[i], v, k)) as T;
  const o: Record<string, unknown> = {};
  for (const key of Object.keys(b as object)) o[key] = lerpPose((a as Record<string, unknown> | undefined)?.[key], (b as Record<string, unknown>)[key], k);
  return o as T;
}
