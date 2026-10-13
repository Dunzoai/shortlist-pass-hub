/**
 * ONE-TIME COPY from the app repo (loyalty-pwa), branch feature/locals-shortlist-v1 @ eeb8dd9,
 * components/locals/live-shorty/motion.ts. Drag, flick, bounce, land, platforms, held items are
 * unchanged. Added for the /foodtrucks lot (search "FOODTRUCKS"): scripted performances
 * (point, phone, megaphone, eat, envelope, sit, oof), `carry-only` items, and the landing position
 * on onLand.
 *
 * ── SHORTY COMES ALIVE: the motion layer (2026-10-09) ───────────────────────
 *
 * PURE: no DOM, no React. A physics state is stepped every frame and turned
 * into a `Pose` for the existing rig (lib/shorty/mascot/rig.ts) — no new
 * poses are drawn; every number below is one the rig already reads:
 *
 *   p.by / p.dx / p.rot / p.sx / p.sy   body lift, shift, tilt, squash & stretch
 *                                       (scale about the hips, PIVOT [63,172])
 *   p.L / p.R  { hx, hy, bend, fist, rot, front }  each arm's HAND offset from
 *                                       the shoulder; the rig bows the arm out
 *   p.feet.L / R  { x, lift, tilt }     each foot, in WORLD space (feet stay put
 *                                       when the body lifts — the legs stretch)
 *   p.face  { gx, gy, eo, bl, br, blr, brr, mouth }   gaze, eye openness, brows,
 *                                       and the mouth SHAPE (none at rest)
 *   p.fx.shake, p.fx.q, p.fx.dust       whole-figure shake, the "?", landing dust
 *   p.blink                              per frame (ShortyMascot used to do this)
 *
 * Units: positions are SCENE units (the diorama's viewBox). The figure is drawn
 * `r` scene units per rig unit (r = figure height / 231), and every constant
 * that is "about his body" is written in rig units and scaled by `r` at use,
 * so phone and desktop feel the same.
 *
 * Where he stands: the boardwalk is a 2-D area. `x` runs along it; `depth`
 * (0 = the back edge by the buildings' doors, 1 = the front) says how far
 * forward, and his feet sit on `backY + depth × (ground − backY)`. Depth also
 * scales him (further back = smaller). Or he stands on a PLATFORM (a roof):
 * then his feet line is its top edge. `y` is his height ABOVE that line.
 *
 * The scene is data (scenes/*.ts → `Stage`): platforms, doors, effect zones,
 * items he can hold. Nothing in here names a specific object.
 *
 * Springs everywhere: `spring()` is a damped harmonic oscillator stepped with
 * semi-implicit Euler. `tune.bounce` is 1 − damping ratio, so 0 settles with no
 * overshoot and 0.9 wobbles a lot. No library.
 */
import { arm, base, type Pose } from '@/lib/shorty/mascot/poses';
import { EFFECTS } from './effects';

/* ── Tunables (the ?tune=1 panel edits these live) ─────────────────────────── */
export interface Tune {
  /** 0 = no overshoot, 0.9 = very rubbery. */
  bounce: number;
  /** Gravity, rig units/s². */
  weight: number;
  /** Walk speed, rig units/s, for a short walk; long walks go up to 2×. */
  walk: number;
  /** How much he squashes on landing (0.1 = subtle, 0.4 = cartoon). */
  squash: number;
  /** Seconds between idle behaviours, on average. */
  idleEvery: number;
}
export const DEFAULT_TUNE: Tune = { bounce: 0.45, weight: 2600, walk: 170, squash: 0.2, idleEvery: 6 };
export const TUNE_RANGES: Record<keyof Tune, { min: number; max: number; step: number; label: string }> = {
  bounce: { min: 0, max: 0.9, step: 0.05, label: 'Bounciness' },
  weight: { min: 800, max: 6000, step: 100, label: 'Weight (gravity)' },
  walk: { min: 60, max: 400, step: 10, label: 'Walk speed' },
  squash: { min: 0, max: 0.45, step: 0.01, label: 'Squash amount' },
  idleEvery: { min: 2, max: 20, step: 0.5, label: 'Idle every (s)' },
};

/* ── The stage: what the motion needs from a scene (built from scene data) ── */
export interface Door { id: string; x: number; bottom: number; halfW: number; votes: string | null; peekOnly: boolean }
export interface Platform { id: string; x0: number; x1: number; y: number }
export interface Zone { id: string; effect: string; sound?: string; x0: number; x1: number; depth0: number; depth1: number }
export interface ItemDef {
  id: string; shape: string; w: number; color?: string;
  rest: { x: number; depth: number; rot: number };
  hand: 'L' | 'R'; hold: { ox: number; oy: number; rot: number }; arm: { hx: number; hy: number }; flags: string[];
}
export interface Stage {
  /** Scene size, units. */
  vw: number; vh: number;
  /** The FRONT feet line (scene y), the back one (by the doors), the x range he may occupy, and where he starts. */
  ground: number; backY: number; minX: number; maxX: number; startX: number;
  /** Figure height in scene units (rig 231), at depth 1. */
  figure: number;
  doors: Door[];
  platforms: Platform[];
  zones: Zone[];
  items: ItemDef[];
  /** Drawn things that do nothing (scene units, origin per shape). */
  decor: { id: string; shape: string; w: number; color?: string; x: number; y: number }[];
  /** Where the composer is, so he can look toward it while he waits for an answer. */
  composerAt: { x: number; y: number };
}
/** How much smaller he is at the back edge (and on a roof). */
export const BACK_SCALE = 0.74;
export const depthScale = (depth: number) => BACK_SCALE + (1 - BACK_SCALE) * depth;

/* ── Springs ─────────────────────────────────────────────────────────────── */
export interface Spring { v: number; vel: number }
export const sp = (v = 0): Spring => ({ v, vel: 0 });
/** Step a damped spring toward `target`. `w` = angular frequency (rad/s), `zeta` = damping ratio. */
export function spring(s: Spring, target: number, dt: number, w: number, zeta: number) {
  const a = w * w * (target - s.v) - 2 * zeta * w * s.vel;
  s.vel += a * dt;
  s.v += s.vel * dt;
}
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pickOne = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];

/* ── State ───────────────────────────────────────────────────────────────── */
export type Mode = 'stand' | 'walk' | 'drag' | 'air' | 'enter' | 'pop' | 'peek';
export type IdleAct = 'tap' | 'look' | 'shake' | 'kick' | 'gull' | null;
/** FOODTRUCKS: a scripted performance the page asks for (he stands and does it). `sit` lasts until he is moved. */
export type PerfKind = 'point' | 'phone' | 'mega' | 'eat' | 'send' | 'sit' | 'oof';
export interface Input {
  /** Pointer in scene units (for the eyes), or null. */
  pointer: { x: number; y: number } | null;
  /** The seagull is crossing. */
  gull: boolean;
  /** He is saying something (mouth + bob). */
  talking: boolean;
  /** Waiting for the visitor's answer: he looks toward the composer (or the pointer), tilts a little, bobs patiently. */
  waiting: boolean;
  reduced: boolean;
}
export interface Events {
  onEnter?: (door: Door) => void;        // he has gone through a door: cast the vote
  onOut?: (door: Door) => void;          // he is back out and has waved: ask the follow-up
  onLand?: (hard: boolean, at: { x: number; depth: number; surface: string | null; flick: boolean }) => void;
  onTapped?: () => void;
  onEffect?: (zone: Zone) => void;      // an effect zone fired (the page plays its sound)
}
export type ItemSt = 'rest' | 'drag' | 'air' | 'held';
export interface ItemState { x: number; y: number; depth: number; vx: number; vy: number; rot: number; st: ItemSt; off: { ox: number; oy: number }; hist: [number, number, number][] }
export interface Particle { x: number; y: number; vx: number; vy: number; t0: number; life: number; color: string; size: number }
export interface Ripple { x: number; y: number; t0: number; dur: number; size: number }
export interface State {
  t: number;
  mode: Mode;
  /** Along the boardwalk (scene x), how far forward (0 back … 1 front), and height ABOVE his feet line. */
  x: number; depth: number; y: number; vx: number; vy: number;
  /** The platform he stands on, or null for the boardwalk. */
  surface: Platform | null;
  /** +1 faces right, −1 left. */
  face: 1 | -1;
  /* body springs (rig units) */
  lift: Spring; shift: Spring; tilt: Spring; sq: Spring;
  armL: { x: Spring; y: Spring }; armR: { x: Spring; y: Spring };
  footL: { x: Spring; lift: Spring }; footR: { x: Spring; lift: Spring };
  gaze: { x: Spring; y: Spring };
  /** Fix round 5: look at a point in the scene until `until` (the NEXT UP ticket landing). */
  glance: { x: number; y: number; until: number } | null;
  spin: number;                        // extra body rotation while tumbling (deg)
  spinVel: number;
  /* walk */
  target: { x: number; depth: number } | null; walkPhase: number; walkSpeed: number;
  /* what the walk is for */
  intent: Door | null;
  /** Standing by a door (feet near its sill): the building lights up and waits for the tap. */
  near: string | null;
  /* drag */
  grab: { ox: number; oy: number; px: number; py: number; hist: [number, number, number][] } | null;
  /* timelines */
  act: { kind: IdleAct; t0: number; dur: number; data?: number } | null;
  nextIdleAt: number;
  enterT0: number; popT0: number; peekT0: number; door: Door | null;
  /** Air time started by a tap hop (so a hop never counts as a flick). */
  hop: boolean;
  /** FOODTRUCKS: the scripted performance in progress, and the carry-only item he holds for it. */
  perf: { kind: PerfKind; t0: number; until: number; data?: number } | null;
  carry: string | null;
  blinkAt: number; nextBlink: number;
  /** Scale/opacity for the doorway (1/1 normally). */
  scale: number; opacity: number;
  dust: number; shake: number;
  landedAt: number;
  /* items, effects */
  items: Record<string, ItemState>;
  held: string | null;
  showOffAt: number;
  inZone: string | null;
  startleAt: number;
  particles: Particle[];
  ripples: Ripple[];
  /* written by step() for poseOf() */
  waveUntil?: number; q?: number;
  mouthShape?: Pose['face']['mouth']; brows?: { bl: number; br: number; blr: number; brr: number };
  fist?: number; armBend?: number; front?: [number, number]; armRot?: [number, number];
}

/** Scene y of the boardwalk line at a depth. */
export const lineAt = (st: Stage, depth: number) => st.backY + depth * (st.ground - st.backY);
/** Scene y of his feet line: the platform's edge, or the boardwalk at his depth. */
export const feetLine = (s: State, st: Stage) => (s.surface ? s.surface.y : lineAt(st, s.depth));
/** Scene y of his feet right now (lifted by y). */
export const feetY = (s: State, st: Stage) => feetLine(s, st) - s.y;
/** The depth that scales him: a roof is at the back. */
export const visualDepth = (s: State) => (s.surface ? 0 : s.depth);
const depthOfY = (st: Stage, y: number) => clamp((y - st.backY) / (st.ground - st.backY), 0, 1);
const platformUnder = (st: Stage, x: number, y: number, margin: number) => st.platforms.find((p) => x >= p.x0 && x <= p.x1 && Math.abs(y - p.y) <= margin) ?? null;
const zoneAt = (st: Stage, x: number, depth: number) => st.zones.find((z) => x >= z.x0 && x <= z.x1 && depth >= z.depth0 && depth <= z.depth1) ?? null;

export function initState(stage: Stage, now: number): State {
  const items: Record<string, ItemState> = {};
  for (const it of stage.items) items[it.id] = { x: it.rest.x, y: lineAt(stage, it.rest.depth), depth: it.rest.depth, vx: 0, vy: 0, rot: it.rest.rot, st: 'rest', off: { ox: 0, oy: 0 }, hist: [] };
  return {
    t: now, mode: 'stand', x: clamp(stage.startX, stage.minX, stage.maxX), depth: 0.55, y: 0, vx: 0, vy: 0, surface: null, face: 1,
    lift: sp(), shift: sp(), tilt: sp(), sq: sp(1),
    armL: { x: sp(-10), y: sp(52) }, armR: { x: sp(10), y: sp(52) },
    footL: { x: sp(), lift: sp() }, footR: { x: sp(), lift: sp() },
    gaze: { x: sp(), y: sp() },
    glance: null,
    spin: 0, spinVel: 0,
    target: null, walkPhase: 0, walkSpeed: 0, intent: null, near: null, grab: null,
    act: null, nextIdleAt: now + 3, enterT0: 0, popT0: 0, peekT0: 0, door: null, hop: false, perf: null, carry: null,
    blinkAt: -1, nextBlink: now + 2 + Math.random() * 2,
    scale: 1, opacity: 1, dust: 0, shake: 0, landedAt: -10,
    items, held: null, showOffAt: -10, inZone: null, startleAt: -10, particles: [], ripples: [],
  };
}

/* ── FOODTRUCKS: scripted performances ───────────────────────────────────── */
const CARRY: Partial<Record<PerfKind, string>> = { phone: 'phone', mega: 'mega', eat: 'burger', send: 'envelope' };
/** Stop whatever he is performing; put down what he carried for it. */
export function endPerform(s: State) {
  s.perf = null; s.q = 0;
  if (s.carry) { if (s.held === s.carry) s.held = null; const it = s.items[s.carry]; if (it && it.st === 'held') it.st = 'rest'; s.carry = null; }
}
/** Ask him to do something now (he must be standing). `ms` omitted = until he is moved. */
export function perform(s: State, st: Stage, kind: PerfKind, now: number, ms?: number) {
  if (s.mode !== 'stand') return;
  endPerform(s);
  s.act = null; s.target = null; s.intent = null;
  s.perf = { kind, t0: now, until: ms ? now + ms / 1000 : Infinity };
  const id = CARRY[kind];
  if (id && st.items.some((i) => i.id === id) && !s.held) { s.held = id; s.carry = id; s.items[id].st = 'held'; s.items[id].rot = 0; }
  if (kind === 'oof') s.q = 1;
}

/* ── Commands (from pointer handling and the page) ───────────────────────── */
/** Walk to a point on the boardwalk. `depth` 0 = by the doors, 1 = the front. From a roof he walks to its edge and drops off. */
export function walkTo(s: State, st: Stage, x: number, depth: number, intent: Door | null = null) {
  if (s.mode === 'enter' || s.mode === 'pop' || s.mode === 'drag') return;
  s.target = { x: clamp(x, st.minX, st.maxX), depth: clamp(depth, 0, 1) };
  s.intent = intent;
  s.act = null; endPerform(s);
  if (s.mode === 'stand' || s.mode === 'walk' || s.mode === 'peek') s.mode = 'walk';
}
/** A door tapped: walk to it (at the back) and go in — or peek, for a peek-only door. */
export function walkToDoor(s: State, st: Stage, doorId: string) {
  const door = st.doors.find((d) => d.id === doorId);
  if (!door) return;
  walkTo(s, st, door.x, 0, door);
}
/** Pointer down on his body. `px` scene x, `py` HEIGHT above his feet line (scene units). */
export function grabStart(s: State, px: number, py: number, now: number) {
  if (s.mode === 'enter' || s.mode === 'pop') return;
  s.mode = 'drag';
  s.target = null; s.intent = null; s.act = null; s.hop = false; s.near = null; endPerform(s);
  s.grab = { ox: px - s.x, oy: py - s.y, px, py, hist: [[now, px, py]] };
}
export function grabMove(s: State, px: number, py: number, now: number) {
  if (!s.grab) return;
  const g = s.grab;
  g.px = px; g.py = py;
  g.hist.push([now, px, py]);
  while (g.hist.length > 12) g.hist.shift();
}
/** The pointer's speed over its last ~120 ms, in scene units/s — from TIMESTAMPS, so a slow frame rate
    cannot read a still hand as a throw (measured: a held drop at 6 fps came out as a flick). */
export function releaseVelocity(hist: [number, number, number][], now: number): [number, number] {
  const last = hist[hist.length - 1];
  if (!last || now - last[0] > 0.15) return [0, 0];
  const from = hist.find((h) => last[0] - h[0] <= 0.12) ?? hist[0];
  const dt = last[0] - from[0];
  if (dt < 1e-3) return [0, 0];
  return [(last[1] - from[1]) / dt, (last[2] - from[2]) / dt];
}
/**
 * Let go. A fast release is a FLICK (he flies that way). A slow one PLACES him:
 * on a roof if his feet are at its edge, on the boardwalk at that depth if
 * they are over it (smaller further back), otherwise he drops onto whatever
 * is below. Placing him by a door never enters it — the building lights up
 * instead (see `near`) and waits for the tap.
 */
export function grabEnd(s: State, st: Stage, r: number, now: number) {
  if (s.mode !== 'drag' || !s.grab) return;
  [s.vx, s.vy] = releaseVelocity(s.grab.hist, now);
  s.grab = null;
  s.hop = false;
  const fy = feetY(s, st), x = s.x;
  const speed = Math.hypot(s.vx, s.vy);
  /* from here on he is off any surface: y is measured from the boardwalk line at his depth */
  s.surface = null;
  if (speed >= 260 * r) {
    s.mode = 'air';
    s.vx = clamp(s.vx, -1400 * r, 1400 * r); s.vy = clamp(s.vy, -300 * r, 900 * r);
    s.spinVel = clamp(s.vx / r * 0.9, -720, 720);
    s.depth = depthOfY(st, fy); s.y = Math.max(0, lineAt(st, s.depth) - fy);
    return;
  }
  s.vx = 0; s.vy = 0;
  const margin = 16 * r;
  const plat = platformUnder(st, x, fy, margin);
  if (plat) { s.surface = plat; s.y = 0; s.mode = 'stand'; s.walkSpeed = 0; s.sq.vel -= 0.9; s.lift.vel -= 10; return; }
  if (fy >= st.backY - margin && fy <= st.ground + margin) {
    /* placed on the boardwalk */
    s.depth = depthOfY(st, fy); s.y = 0; s.mode = 'stand'; s.walkSpeed = 0;
    s.sq.vel -= 0.9; s.lift.vel -= 10;
    return;
  }
  s.mode = 'air';
  s.depth = fy < st.backY ? 0 : 1;
  s.y = Math.max(0, lineAt(st, s.depth) - fy);
}
/** A tap on his body (no drag): a hop, with a wobble; sometimes a spin. Holding something: a show-off twirl instead. */
export function tapped(s: State, r: number, now: number) {
  if (s.mode === 'drag' || s.mode === 'enter' || s.mode === 'pop') return;
  s.act = null; s.target = null; s.intent = null; if (s.perf) endPerform(s);
  if (s.held) { s.showOffAt = now; s.lift.vel += 25; return; }
  s.mode = 'air'; s.hop = true;
  s.vy = 520 * r; s.vx = 0;
  s.tilt.vel += rnd(-500, 500);
  if (Math.random() < 0.3) s.spinVel = (Math.random() < 0.5 ? 1 : -1) * 900;
}

/* ── Items ───────────────────────────────────────────────────────────────── */
/** Pointer down on an item (at rest, or held — then it comes off him). `px,py` scene units. */
export function itemGrab(s: State, id: string, px: number, py: number, now: number) {
  const it = s.items[id];
  if (!it) return;
  if (s.held === id) s.held = null;
  it.st = 'drag'; it.off = { ox: px - it.x, oy: py - it.y }; it.vx = 0; it.vy = 0; it.hist = [[now, px, py]];
}
export function itemMove(s: State, id: string, px: number, py: number, now: number) {
  const it = s.items[id];
  if (!it || it.st !== 'drag') return;
  it.x = px - it.off.ox; it.y = py - it.off.oy;
  it.hist.push([now, px, py]); while (it.hist.length > 12) it.hist.shift();
}
/** Let an item go: onto him (he grabs it), or it drops/flies and lands on the boardwalk. */
export function itemRelease(s: State, st: Stage, id: string, now: number) {
  const it = s.items[id];
  if (!it || it.st !== 'drag') return;
  const r = st.figure / 231, ds = depthScale(visualDepth(s));
  const fy = feetY(s, st);
  const onHim = s.mode !== 'enter' && s.mode !== 'pop' && Math.abs(it.x - s.x) <= 60 * r * ds && it.y >= fy - 210 * r * ds && it.y <= fy + 12 * r;
  if (onHim) { if (s.held && s.held !== id) dropItem(s, st, s.held, 0, 0); it.st = 'held'; s.held = id; it.rot = 0; return; }
  const [vx, vy] = releaseVelocity(it.hist, now);
  it.vx = clamp(vx, -1400 * r, 1400 * r); it.vy = clamp(-vy, -900 * r, 900 * r);   // scene y is down
  it.depth = depthOfY(st, it.y);
  it.st = 'air';
}
/** The held item leaves his hand with some velocity (scene units/s; vy positive = up). */
export function dropItem(s: State, st: Stage, id: string, vx: number, vy: number) {
  const it = s.items[id];
  if (!it) return;
  if (s.held === id) s.held = null;
  it.st = 'air'; it.vx = vx; it.vy = -vy; it.depth = depthOfY(st, it.y);
}

/* ── Effects ─────────────────────────────────────────────────────────────── */
function fire(s: State, st: Stage, zone: Zone, ev: Events, now: number) {
  const spec = EFFECTS[zone.effect];
  if (!spec) return;
  const r = st.figure / 231, ds = depthScale(visualDepth(s));
  const x = s.x, y = feetY(s, st);
  if (spec.particles) {
    const P = spec.particles;
    for (let i = 0; i < P.count; i++) {
      const a = (-Math.PI / 2) + rnd(-1, 1) * P.spread * (Math.PI / 2), v = P.speed * r * ds * rnd(0.5, 1.1);
      s.particles.push({ x: x + rnd(-14, 14) * r * ds, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t0: now, life: P.life * rnd(0.7, 1.2), color: pickOne(P.colors), size: P.size * r * ds * rnd(0.6, 1.3) });
    }
  }
  if (spec.ripple) s.ripples.push({ x, y, t0: now, dur: spec.ripple.duration, size: spec.ripple.size * r * ds });
  if (spec.reaction === 'startle') { s.shake = Math.max(s.shake, 0.9); s.startleAt = now; s.lift.vel += 35; s.sq.vel += 0.5; }
  ev.onEffect?.(zone);
}

/** Fire an effect at a scene point, from the page (the crowning confetti). */
export function burst(s: State, st: Stage, effect: string, x: number, y: number, now: number) {
  const spec = EFFECTS[effect];
  if (!spec?.particles) return;
  const r = st.figure / 231, P = spec.particles;
  for (let i = 0; i < P.count; i++) {
    const a = (-Math.PI / 2) + rnd(-1, 1) * P.spread * (Math.PI / 2), v = P.speed * r * rnd(0.4, 1.1);
    s.particles.push({ x: x + rnd(-30, 30) * r, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t0: now, life: P.life * rnd(0.7, 1.3), color: pickOne(P.colors), size: P.size * r * rnd(0.5, 1.2) });
  }
}
/** He cheers: a hop and the wave (the crowning moment). */
export function cheer(s: State, r: number, now: number) {
  if (s.mode === 'drag' || s.mode === 'enter' || s.mode === 'pop') return;
  s.waveUntil = now + 1.6;
  if (s.mode === 'stand') { s.mode = 'air'; s.hop = true; s.vy = 560 * r; s.vx = 0; }
  s.act = null;
}

/* ── The step ────────────────────────────────────────────────────────────── */
export function step(s: State, st: Stage, tune: Tune, inp: Input, ev: Events, now: number) {
  const dt = clamp(now - s.t, 0, 1 / 30);
  s.t = now;
  const r = st.figure / 231;
  const zeta = 1 - tune.bounce;
  const W = 14;                                                  // base spring frequency (rad/s)
  const DEPTH_LEN = st.ground - st.backY;                       // scene units of boardwalk depth
  const prevFeet = feetY(s, st);

  /* ── idle behaviours ───────────────────────────────────────────────────── */
  if (!inp.reduced && s.mode === 'stand' && !s.act && !s.perf && now >= s.nextIdleAt && !inp.waiting) {
    const kinds: IdleAct[] = ['tap', 'look', 'shake', 'kick'];
    const kind = pickOne(kinds);
    const puddle = !s.surface ? st.zones.find((z) => Math.abs((z.x0 + z.x1) / 2 - s.x) < 160 * r) : undefined;
    if (kind === 'kick' && puddle) {
      const zx = (puddle.x0 + puddle.x1) / 2, zd = (puddle.depth0 + puddle.depth1) / 2;
      if (Math.abs(zx - s.x) > 30 * r || Math.abs(zd - s.depth) > 0.15) {
        /* walk up to the puddle first; the kick starts when he arrives */
        walkTo(s, st, zx + (zx > s.x ? -30 * r : 30 * r), zd);
        s.intent = null; s.act = { kind: 'kick', t0: -1, dur: 1.1, data: 1 };
      } else s.act = { kind: 'kick', t0: now, dur: 1.1, data: 1 };
    } else {
      s.act = { kind, t0: now, dur: kind === 'tap' ? 2.6 : kind === 'look' ? 2.4 : kind === 'shake' ? 0.9 : 1.1 };
    }
    s.nextIdleAt = now + tune.idleEvery * rnd(0.6, 1.5);
  }
  if (inp.gull && s.mode === 'stand' && (!s.act || s.act.kind === 'tap' || s.act.kind === 'look')) s.act = { kind: 'gull', t0: s.act?.kind === 'gull' ? s.act.t0 : now, dur: 9 };
  if (s.act && s.act.t0 >= 0 && now - s.act.t0 > s.act.dur) { s.act = null; s.nextIdleAt = Math.max(s.nextIdleAt, now + 1.5); }
  if (s.act?.kind === 'gull' && !inp.gull) s.act = null;

  /* ── modes ─────────────────────────────────────────────────────────────── */
  let liftT = 0, shiftT = 0, tiltT = 0, sqT = 1;
  let armLT: [number, number] = [-10, 52], armRT: [number, number] = [10, 52];
  let footLT: [number, number] = [0, 0], footRT: [number, number] = [0, 0];
  const armBend = 14, frontL = 0, frontR = 0;
  let fist = 0, armRotL = -6, armRotR = 6;
  let mouth: Pose['face']['mouth'] = 'none';
  let brows = { bl: 0, br: 0, blr: 0, brr: 0 };
  let gazeT: [number, number] | null = null;

  if (s.mode === 'walk' && s.target) {
    if (s.surface) {
      /* along the roof: x only; past its edge he drops off (the target survives the fall) */
      const dx = s.target.x - s.x, ad = Math.abs(dx);
      const speed = tune.walk * r * clamp(1 + ad / (260 * r), 1, 2);
      if (ad < 2 * r) { s.x = s.target.x; s.target = null; s.walkSpeed = 0; s.mode = 'stand'; s.intent = null; }
      else {
        s.face = dx > 0 ? 1 : -1;
        s.x += Math.sign(dx) * Math.min(ad, speed * dt);
        s.walkSpeed = speed; s.walkPhase += (speed * dt) / (62 * r) * Math.PI * 2;
        if (s.x < s.surface.x0 - 6 * r || s.x > s.surface.x1 + 6 * r) {
          const edgeY = s.surface.y; s.surface = null; s.depth = 0; s.y = Math.max(0, lineAt(st, 0) - edgeY);
          s.mode = 'air'; s.vx = s.face * speed * 0.6; s.vy = 0;
        }
      }
    } else {
      const dx = s.target.x - s.x, dd = (s.target.depth - s.depth) * DEPTH_LEN;
      const dist = Math.hypot(dx, dd);
      const speed = tune.walk * r * clamp(1 + dist / (260 * r), 1, 2);
      if (dist < 2 * r) {
        s.x = s.target.x; s.depth = s.target.depth; s.target = null; s.walkSpeed = 0;
        const it = s.intent; s.intent = null;
        if (it) {
          s.mode = it.peekOnly ? 'peek' : 'enter'; s.door = it; s.enterT0 = now; s.peekT0 = now;
          if (!it.peekOnly && s.held) dropItem(s, st, s.held, -s.face * 80 * r, 120 * r);   // he leaves what he holds at the door
        } else { s.mode = 'stand'; if (s.act?.kind === 'kick' && s.act.t0 < 0) s.act.t0 = now; }
      } else {
        if (Math.abs(dx) > 4 * r) s.face = dx > 0 ? 1 : -1;
        const mv = Math.min(dist, speed * dt), k = mv / dist;
        s.x += dx * k; s.depth += (dd * k) / DEPTH_LEN;
        s.walkSpeed = speed;
        s.walkPhase += (speed * dt) / (62 * r) * Math.PI * 2;
      }
    }
  }
  if (s.mode === 'walk' || (s.mode === 'stand' && s.walkSpeed > 0)) {
    const ph = s.walkPhase, sn = Math.sin(ph), cs = Math.cos(ph);
    liftT = Math.abs(sn) * 3.2; tiltT = s.face * 3.5 + sn * 1.2;
    footLT = [cs * 11, Math.max(0, sn) * 9]; footRT = [-cs * 11, Math.max(0, -sn) * 9];
    armLT = [-10 - sn * 14, 50 + Math.abs(sn) * 3]; armRT = [10 + sn * 14, 50 + Math.abs(sn) * 3];
    if (s.mode === 'stand') s.walkSpeed = 0;
  }

  if (s.mode === 'drag' && s.grab) {
    const g = s.grab;
    const tx = clamp(g.px - g.ox, st.minX, st.maxX);
    const ty = clamp(g.py - g.oy, -DEPTH_LEN - 40 * r, feetLine(s, st) - 150 * r);   // may hang below his line, never off the top
    /* the body hangs after the hand: a soft spring on position */
    s.vx = (tx - s.x) * 10; s.vy = (ty - s.y) * 10;
    s.x += (tx - s.x) * Math.min(1, dt * 16); s.y += (ty - s.y) * Math.min(1, dt * 16);
    tiltT = clamp((tx - s.x) / r * 0.9 + s.vx / r * 0.04, -28, 28);
    sqT = 1.06;                                                      // stretched: being lifted
    liftT = 0;
    /* legs dangle and kick; arms flail */
    const k = now * 9;
    footLT = [Math.sin(k) * 10 + s.vx / r * 0.02, 10 + Math.max(0, Math.sin(k)) * 8];
    footRT = [Math.sin(k + 2.4) * 10 + s.vx / r * 0.02, 10 + Math.max(0, Math.sin(k + 2.4)) * 8];
    armLT = [-30 - Math.sin(k * 0.7) * 10, -10 + Math.cos(k * 0.9) * 14]; armRT = [30 + Math.sin(k * 0.8) * 10, -10 + Math.sin(k) * 14];
    armRotL = -40; armRotR = 40;
    mouth = 'o'; brows = { bl: -3, br: -3, blr: 0, brr: 0 };
    gazeT = [0, 2.5];
  }

  if (s.mode === 'air') {
    s.vy -= tune.weight * r * dt;
    s.vx *= Math.pow(0.4, dt);
    s.x += s.vx * dt; s.y += s.vy * dt;
    s.spinVel *= Math.pow(0.5, dt);
    s.spin += s.spinVel * dt;
    if (s.x <= st.minX || s.x >= st.maxX) { s.x = clamp(s.x, st.minX, st.maxX); s.vx = -s.vx * 0.5; s.spinVel = -s.spinVel * 0.5; }
    sqT = s.vy > 0 ? 1.06 : 1.03;                                    // stretched in the air
    const k = now * 11;
    footLT = [Math.sin(k) * 6, 8 + Math.max(0, Math.sin(k)) * 6]; footRT = [Math.sin(k + 2.2) * 6, 8 + Math.max(0, Math.sin(k + 2.2)) * 6];
    armLT = [-34, -20]; armRT = [34, -20]; armRotL = -50; armRotR = 50;
    mouth = s.hop ? 'grin' : 'o';
    /* a roof under his feet on the way down? (feet crossed its edge this frame) */
    const nowFeet = feetY(s, st);
    const roof = s.vy < 0 ? st.platforms.find((p) => s.x >= p.x0 && s.x <= p.x1 && prevFeet <= p.y + 0.01 && nowFeet >= p.y) ?? null : null;
    if (roof || s.y <= 0) {
      /* LAND */
      if (roof) { s.surface = roof; }
      s.y = 0;
      const hard = -s.vy > 700 * r;
      const soft = clamp(-s.vy / (1400 * r), 0.15, 1);
      s.sq.v = Math.min(s.sq.v, 1);                                  // the in-air stretch is over the moment he touches down
      s.sq.vel = -tune.squash * 26 * soft;                           // squash (≈8% on a hop, ≈20% on a big fall at 0.2), then the spring rebounds
      s.lift.vel -= 40 * soft;
      s.dust = hard ? 1 : s.dust;
      s.shake = hard ? 1 : 0;
      if (-s.vy > 900 * r && !s.hop && !roof) { s.vy = -s.vy * 0.22; s.vx *= 0.6; }   // one small bounce on a big fall
      else {
        s.vy = 0; s.vx = 0; s.walkSpeed = 0; s.landedAt = now; ev.onLand?.(hard, { x: s.x, depth: s.depth, surface: s.surface?.id ?? null, flick: !s.hop });
        s.mode = s.target ? 'walk' : 'stand';
        /* the tumble: he catches himself — the spin snaps to the nearest upright and the tilt spring wobbles it off */
        s.tilt.vel += (s.spin % 360 > 180 ? 1 : -1) * Math.min(600, Math.abs(s.spinVel)) * 0.4;
        s.spin = 0; s.spinVel = 0;
        /* a hard landing shakes what he holds out of his hand */
        if (hard && s.held) dropItem(s, st, s.held, -s.face * rnd(120, 260) * r, rnd(220, 380) * r);
        /* an effect zone under his feet */
        if (!s.surface) { const z = zoneAt(st, s.x, s.depth); s.inZone = z?.id ?? null; if (z && !inp.reduced) fire(s, st, z, ev, now); }
      }
    }
  }

  if (s.mode === 'enter' && s.door) {
    /* through the doorway: the feet rise to the sill, the body shrinks and fades */
    const k = clamp((now - s.enterT0) / 0.75, 0, 1), e = k * k * (3 - 2 * k);
    const sill = s.door.bottom - 2 * r;
    s.depth = lerp(s.depth, 0, Math.min(1, dt * 8));
    s.y = lerp(0, Math.max(0, feetLine(s, st) - sill), e);
    s.x = lerp(s.x, s.door.x, Math.min(1, dt * 6));
    s.scale = lerp(1, 0.62, e); s.opacity = 1 - clamp((k - 0.55) / 0.45, 0, 1);
    s.walkPhase += dt * 9;
    const sn = Math.sin(s.walkPhase);
    footLT = [Math.cos(s.walkPhase) * 8, Math.max(0, sn) * 7]; footRT = [-Math.cos(s.walkPhase) * 8, Math.max(0, -sn) * 7];
    liftT = Math.abs(sn) * 2.5;
    armLT = [-10 - sn * 10, 50]; armRT = [10 + sn * 10, 50];
    if (k >= 1) { s.mode = 'pop'; s.popT0 = now; s.opacity = 0; ev.onEnter?.(s.door); }
  }
  if (s.mode === 'pop' && s.door) {
    const k = clamp((now - s.popT0) / 0.55, 0, 1), e = 1 - Math.pow(1 - k, 3);
    const sill = s.door.bottom - 2 * r;
    s.opacity = clamp(k / 0.35, 0, 1);
    s.scale = lerp(0.62, 1, e);
    s.y = lerp(Math.max(0, feetLine(s, st) - sill), 0, e);
    if (k >= 1) {
      /* out: a hop and the wave */
      s.y = 0; s.scale = 1; s.opacity = 1;
      s.lift.vel += 60; s.sq.vel += 1.2;
      s.mode = 'stand';
      const d = s.door; s.door = null;
      s.waveUntil = now + 1.3;
      ev.onOut?.(d);
    }
  }
  if (s.mode === 'peek' && s.door) {
    const k = now - s.peekT0;
    s.x = lerp(s.x, s.door.x, Math.min(1, dt * 6));
    if (k < 0.8) { tiltT = -14 * s.face; shiftT = 8 * s.face; gazeT = [2 * s.face, -2]; liftT = 2; mouth = 'none'; }
    else if (k < 2.2) {                                             // the shrug
      const e = clamp((k - 0.8) / 0.3, 0, 1);
      armLT = [-36 * e - 10 * (1 - e), 52 - 70 * e]; armRT = [36 * e + 10 * (1 - e), 52 - 70 * e];
      armRotL = -40 * e; armRotR = 40 * e; liftT = 1.5 * e; tiltT = -3 * e;
      mouth = 'frown'; brows = { bl: -2.5, br: -1, blr: -12, brr: -12 };
      s.q = e;
    } else { s.mode = 'stand'; s.door = null; s.q = 0; }
  }

  /* ── walking through an effect zone fires it on the way in ───────────── */
  if (s.mode === 'walk' && !s.surface && s.y === 0) {
    const z = zoneAt(st, s.x, s.depth);
    if ((z?.id ?? null) !== s.inZone) { s.inZone = z?.id ?? null; if (z && !inp.reduced) fire(s, st, z, ev, now); }
  } else if (s.mode !== 'stand' && s.mode !== 'air') s.inZone = null;

  /* ── standing by a door: the building lights up and waits for the tap ── */
  if (s.mode === 'stand' && !s.surface && s.y === 0 && s.depth <= 0.3) {
    const d = st.doors.find((d) => Math.abs(s.x - d.x) <= d.halfW + 14 * r);
    s.near = d ? d.id : null;
  } else s.near = null;

  /* ── the wave after a vote ─────────────────────────────────────────────── */
  if (s.waveUntil && now < s.waveUntil && s.mode === 'stand') {
    const th = (26 + 16 * Math.sin(now * 4.2)) * Math.PI / 180, L = 70;
    armRT = [L * Math.sin(th), -L * Math.cos(th)]; armRotR = 5 * Math.sin(now * 11);
    mouth = 'grin'; brows = { bl: -2.5, br: -2.5, blr: 0, brr: 0 };
    tiltT += -1.5 + Math.sin(now * 4.2) * 0.6;
  }

  /* ── idle acts (standing) ─────────────────────────────────────────────── */
  if (s.mode === 'stand' && s.act && s.act.t0 >= 0) {
    const a = s.act, k = now - a.t0;
    if (a.kind === 'tap') { const w = k * 7, tap = Math.max(0, Math.sin(w)); footRT = [0, tap * 2.2]; liftT += Math.abs(Math.sin(w)) * 0.5; armLT = [-12 + Math.sin(w / 2) * 2, 52]; }
    if (a.kind === 'look') { const ph = Math.sin(k * 2.6); gazeT = [ph * 2.4, -0.6]; tiltT += ph * 2.5; brows = { bl: -1.5, br: -1.5, blr: 0, brr: 0 }; }
    if (a.kind === 'shake') { const d = Math.exp(-k * 3); tiltT += Math.sin(k * 40) * 9 * d; s.shake = Math.max(s.shake, 0.8 * d); armLT = [-22, 40]; armRT = [22, 40]; armRotL = -30; armRotR = 30; mouth = 'squiggle'; brows = { bl: 1, br: 1, blr: 6, brr: -6 }; }
    if (a.kind === 'kick') { const up = clamp(k / 0.35, 0, 1), swing = clamp((k - 0.35) / 0.2, 0, 1), back = clamp((k - 0.7) / 0.4, 0, 1);
      const f = s.face; const lift = (up * 10 - back * 10), fx = (up * -8 + swing * 30) * f * (1 - back);
      if (f > 0) footRT = [fx, Math.max(0, lift)]; else footLT = [fx, Math.max(0, lift)];
      tiltT += -5 * f * (1 - back) * swing; armLT = [-26, 30]; armRT = [26, 30]; mouth = swing > 0.5 && back < 0.5 ? 'grin' : 'none';
      /* the kick lands: a puddle under him splashes (once per kick) */
      if (swing >= 1 && a.data === 1) { a.data = 2; s.dust = Math.max(s.dust, 0.6); const z = !s.surface ? zoneAt(st, s.x, s.depth) : null; if (z && !inp.reduced) fire(s, st, z, ev, now); } }
    if (a.kind === 'gull') { gazeT = [clamp((k / 9 - 0.5) * 5, -2.4, 2.4), -2.6]; brows = { bl: -3, br: -3, blr: 0, brr: 0 }; tiltT += (k / 9 - 0.5) * 4; }
  }

  /* ── holding something: the arm from the item's data; the show-off twirl ── */
  if (s.held) {
    const def = st.items.find((i) => i.id === s.held);
    if (def) {
      const so = clamp((now - s.showOffAt) / 0.7, 0, 1), lift = Math.sin(so * Math.PI);
      const tgt: [number, number] = [def.arm.hx + lift * 10, def.arm.hy - lift * 30];
      if (def.hand === 'R') { armRT = tgt; armRotR = 0; } else { armLT = tgt; armRotL = 0; }
      fist = 1;
      if (so < 1) { tiltT += -4 * lift; mouth = 'grin'; brows = { bl: -2, br: -2, blr: 0, brr: 0 }; }
    }
  }

  /* ── FOODTRUCKS: the scripted performances (the arms are hand offsets from the shoulder, rig units) ── */
  if (s.perf && s.mode !== 'stand') endPerform(s);
  if (s.perf && s.mode === 'stand') {
    const p = s.perf, k = now - p.t0;
    if (now >= p.until) endPerform(s);
    else if (p.kind === 'point') {
      const e = clamp(k / 0.25, 0, 1);
      armRT = [10 + 62 * e, 52 - 78 * e]; armRotR = -70 * e; mouth = 'grin';
      brows = { bl: -1.5, br: -1.5, blr: 0, brr: 0 }; tiltT += -2 * e;
    } else if (p.kind === 'phone') {
      mouth = 'grin'; gazeT = [0, 2.2]; tiltT += 2; liftT += Math.abs(Math.sin(k * 3)) * 0.6;
    } else if (p.kind === 'mega') {
      mouth = 'shout'; brows = { bl: -2.5, br: -2.5, blr: 0, brr: 0 }; tiltT += -3;
      liftT += Math.max(0, Math.sin(k * 7)) * 2; if (p.data !== 1 && k > 0) p.data = 1;
    } else if (p.kind === 'eat') {
      const c = (Math.sin(k * 5.5) + 1) / 2;
      armRT = [lerp(22, -4, c), lerp(-18, -58, c)]; armRotR = 0; fist = 1;
      mouth = c > 0.8 ? 'o' : 'grin'; liftT += Math.abs(Math.sin(k * 5.5)) * 0.8;
    } else if (p.kind === 'send') {
      const e = clamp((k - 0.55) / 0.2, 0, 1);
      armRT = [lerp(26, 62, e), lerp(-48, -26, e)]; armRotR = 0; fist = 1; mouth = 'grin'; tiltT += -2 * e;
      if (k > 0.75 && p.data !== 1) { p.data = 1; if (s.carry) { const id = s.carry; s.carry = null; dropItem(s, st, id, s.face * 640 * r, 420 * r); } }
      if (k > 1.7) endPerform(s);
    } else if (p.kind === 'sit') {
      liftT = -30; footLT = [-24 + Math.sin(now * 2.2) * 5, 0]; footRT = [24 + Math.sin(now * 2.2 + 1.4) * 5, 0]; armLT = [-26, 34]; armRT = [26, 34];
      tiltT += Math.sin(now * 1.3) * 1.2; mouth = 'none';
    } else if (p.kind === 'oof') {
      const d = Math.exp(-k * 2.2);
      tiltT += Math.sin(k * 14) * 7 * d; armLT = [-30, 30]; armRT = [30, 30]; armRotL = -35; armRotR = 35;
      mouth = 'squiggle'; brows = { bl: 1.5, br: 1.5, blr: 6, brr: -6 }; s.q = clamp(1 - k / 1.6, 0, 1);
      gazeT = [Math.sin(k * 9) * 1.6, 0];
    }
  }

  /* ── waiting for the visitor's answer: toward the composer, a small patient bob ── */
  if (inp.waiting && s.mode === 'stand' && !s.act && !(s.waveUntil && now < s.waveUntil)) {
    tiltT += -3;
    liftT += Math.abs(Math.sin(now * 2.4)) * 1.2;
    if (!inp.pointer) {
      const ds = depthScale(visualDepth(s));
      const dx = (st.composerAt.x - s.x) / r, dy = (st.composerAt.y - (feetY(s, st) - 150 * r * ds)) / r;
      gazeT = [clamp(dx / 60, -2.4, 2.4) * s.face, clamp(dy / 60, -2.4, 2.8)];
    }
    brows = { ...brows, bl: brows.bl - 1, br: brows.br - 1 };
  }

  /* ── startled (an effect's reaction) ───────────────────────────────────── */
  if (now - s.startleAt < 0.6 && s.mode !== 'drag') {
    const k = 1 - (now - s.startleAt) / 0.6;
    mouth = 'o'; brows = { bl: -3.5 * k, br: -3.5 * k, blr: 0, brr: 0 };
    tiltT += Math.sin((now - s.startleAt) * 40) * 6 * k;
    gazeT = [0, 2.2];
  }

  /* ── talking: a gentle bob, the mouth opens and closes ────────────────── */
  if (inp.talking && s.mode !== 'drag') {
    liftT += Math.abs(Math.sin(now * 9)) * 1.4;
    const cyc = Math.floor(now * 7.5) % 4;
    mouth = (['o', 'grin', 'o', 'none'] as const)[cyc];
    brows = { ...brows, bl: brows.bl - 1, br: brows.br - 1 };
  }

  /* ── a glance at something in the scene (fix round 5): overrides the pointer, a small head tilt with it ── */
  if (s.glance && now < s.glance.until && s.mode !== 'drag' && s.mode !== 'enter') {
    const ds = depthScale(visualDepth(s));
    const headX = s.x, headY = feetY(s, st) - 150 * r * ds;
    const dx = (s.glance.x - headX) / r, dy = (s.glance.y - headY) / r;
    gazeT = [clamp(dx / 60, -2.4, 2.4) * s.face, clamp(dy / 60, -2.8, 2.8)];
    tiltT += clamp(dx / 40, -1, 1) * 3;
    brows = { ...brows, bl: brows.bl - 1.5, br: brows.br - 1.5 };
  } else if (s.glance && now >= s.glance.until) s.glance = null;
  /* ── eyes follow the pointer, within limits ───────────────────────────── */
  if (!gazeT) {
    if (inp.pointer) {
      const ds = depthScale(visualDepth(s));
      const headX = s.x, headY = feetY(s, st) - 150 * r * ds;
      const dx = (inp.pointer.x - headX) / r, dy = (inp.pointer.y - headY) / r;
      gazeT = [clamp(dx / 60, -2.4, 2.4) * s.face, clamp(dy / 60, -2.4, 2.8)];
    } else gazeT = [Math.sin(now * 0.9) * 1.2, -0.6];
  }

  /* ── items: falling ones land on the boardwalk; dragged and held ones are placed by the page ── */
  for (const id in s.items) {
    const it = s.items[id];
    if (it.st !== 'air') continue;
    it.vy += tune.weight * r * dt;                                   // scene y is down
    it.vx *= Math.pow(0.3, dt);
    it.x += it.vx * dt; it.y += it.vy * dt;
    it.rot += it.vx * dt * 0.8;
    const line = lineAt(st, it.depth);
    if (it.y >= line) {
      it.y = line; it.x = clamp(it.x, st.minX - 10, st.maxX + 10); it.st = 'rest'; it.vx = 0; it.vy = 0;
      const def = st.items.find((i) => i.id === id); it.rot = def ? def.rest.rot * (it.rot >= 0 ? 1 : -1) : it.rot;
    }
  }
  /* particles and ripples */
  if (s.particles.length) {
    const g = 1700 * r;
    for (const p of s.particles) { p.vy += g * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
    s.particles = s.particles.filter((p) => now - p.t0 < p.life);
  }
  if (s.ripples.length) s.ripples = s.ripples.filter((rp) => now - rp.t0 < rp.dur);

  /* ── springs ──────────────────────────────────────────────────────────── */
  if (inp.reduced) {
    s.lift.v = 0; s.shift.v = 0; s.tilt.v = 0; s.sq.v = 1;
    s.armL.x.v = -10; s.armL.y.v = 52; s.armR.x.v = 10; s.armR.y.v = 52;
    s.footL.x.v = 0; s.footL.lift.v = 0; s.footR.x.v = 0; s.footR.lift.v = 0;
    s.gaze.x.v = lerp(s.gaze.x.v, gazeT[0], 0.2); s.gaze.y.v = lerp(s.gaze.y.v, gazeT[1], 0.2);
  } else {
    spring(s.lift, liftT, dt, W, zeta); spring(s.shift, shiftT, dt, W, zeta); spring(s.tilt, tiltT, dt, W * 0.8, zeta);
    spring(s.sq, sqT, dt, W * 1.3, zeta * 0.9);
    spring(s.armL.x, armLT[0], dt, W * 1.1, zeta); spring(s.armL.y, armLT[1], dt, W * 1.1, zeta);
    spring(s.armR.x, armRT[0], dt, W * 1.1, zeta); spring(s.armR.y, armRT[1], dt, W * 1.1, zeta);
    spring(s.footL.x, footLT[0], dt, W * 1.6, zeta + 0.2); spring(s.footL.lift, footLT[1], dt, W * 1.6, zeta + 0.2);
    spring(s.footR.x, footRT[0], dt, W * 1.6, zeta + 0.2); spring(s.footR.lift, footRT[1], dt, W * 1.6, zeta + 0.2);
    spring(s.gaze.x, gazeT[0], dt, 9, 0.9); spring(s.gaze.y, gazeT[1], dt, 9, 0.9);
  }
  s.dust = Math.max(0, s.dust - dt * 2.2);
  s.shake *= Math.pow(0.02, dt);

  /* ── blink ─────────────────────────────────────────────────────────────── */
  if (now >= s.nextBlink) { s.blinkAt = now; s.nextBlink = now + 3 + Math.random() * 2; }

  s.mouthShape = mouth; s.brows = brows; s.fist = fist; s.armBend = armBend; s.front = [frontL, frontR]; s.armRot = [armRotL, armRotR];
}

/** The pose for one frame, from the state. */
export function poseOf(s: State, now: number): Pose {
  const p = base(now);
  p.by = s.lift.v; p.dx = s.shift.v; p.rot = s.tilt.v + s.spin;
  const sq = s.sq.v;
  p.sy = sq; p.sx = 1 + (1 - sq) * 0.9;                             // volume-ish preservation
  p.L = arm(s.armL.x.v, s.armL.y.v, s.armBend ?? 14, s.fist ?? 0, s.armRot?.[0] ?? -6, 0, s.front?.[0] ?? 0);
  p.R = arm(s.armR.x.v, s.armR.y.v, s.armBend ?? 14, s.fist ?? 0, s.armRot?.[1] ?? 6, 0, s.front?.[1] ?? 0);
  p.feet.L = { x: s.footL.x.v, lift: Math.max(0, s.footL.lift.v), tilt: -s.footL.lift.v * 1.2 };
  p.feet.R = { x: s.footR.x.v, lift: Math.max(0, s.footR.lift.v), tilt: -s.footR.lift.v * 1.2 };
  const b = s.brows ?? { bl: 0, br: 0, blr: 0, brr: 0 };
  p.face = { ...p.face, gx: s.gaze.x.v, gy: s.gaze.y.v, mouth: s.mouthShape ?? 'none', ...b };
  p.fx.shake = s.shake * 2; p.fx.dust = s.dust; p.fx.q = s.q ?? 0;
  const bk = (now - s.blinkAt) / 0.15;
  p.blink = bk >= 0 && bk <= 1 ? 1 - Math.sin(bk * Math.PI) * 0.92 : 1;
  return p;
}

/** The show-off twirl's extra rotation for the held item, degrees. */
export const showOffSpin = (s: State, now: number) => { const k = clamp((now - s.showOffAt) / 0.7, 0, 1); return k < 1 ? 360 * (k * k * (3 - 2 * k)) : 0; };
