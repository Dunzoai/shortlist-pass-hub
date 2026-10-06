// Copied from the app repo (loyalty-pwa lib/shorty/mascot/rig.ts) on 2026-10-01 for the
// website hero. The app is the source of truth; poses.ts adds the `walk` pose here.
/**
 * ── SHORTY'S RIG: draws one pose into one <svg> (2026-09-29) ───────────────
 *
 * Ported from prototypes/shorty-moods.html. Builds the SVG once, then `update`
 * moves it every frame — plain DOM attributes, no React re-render per frame and
 * no animation library. Poses come from poses.ts.
 *
 * LAYERING (Marc's rules for the prototype, kept): an arm that does not reach
 * in front of him is BEHIND the body; props are in front of the body; every
 * glove is in front of every prop, so a hand is never hidden by what it holds.
 */
import {
  BODY, SHOULDER, HIP, FOOT, PIVOT, EYE, BROW, MOUTH, PROP_NAMES,
  clamp01, easeOutBack, type Pose, type PropName, type Side, type MouthShape,
} from './poses';

const NS = 'http://www.w3.org/2000/svg';
/* Sampled from public/shorty-mascot.png (#80C1AD), warmed so it reads as printed ink. */
const C = { green: '#8cc3a1', side: '#5f9677', stitch: '#3e6c56', ink: '#1d1a16', white: '#fbf6e6', pink: '#e8747a', yellow: '#f2c94c', red: '#c8473d' };
/** Thick on the silhouette, thin inside. */
const LW = { outer: 3.4, limb: 6, inner: 1.3, feature: 2.4 };
/** Detail that turns to mush at header size. */
const SMALL_SKIP = new Set<string>(['pencil', 'pad', 'whisk', 'bowl', 'papers', 'notes', 'sign']);

type Attrs = Record<string, string | number>;
const el = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Attrs = {}, parent?: Element): SVGElementTagNameMap[K] => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  if (parent) parent.appendChild(n);
  return n;
};
const ink = (w = 2.2): Attrs => ({ stroke: C.ink, 'stroke-width': w, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
const show = (n: SVGElement, on: boolean) => { n.style.display = on ? '' : 'none'; };
const f1 = (v: number) => (+v).toFixed(1);

function ticketPath(i = 0) {
  const { x0, x1, y0, y1, r, ny, nr } = BODY;
  const a = x0 + i, b = x1 - i, t = y0 + i, u = y1 - i, rr = Math.max(2, r - i), n = nr + i;
  return `M${a + rr} ${t} H${b - rr} Q${b} ${t} ${b} ${t + rr} V${ny - n} A${n} ${n} 0 0 0 ${b} ${ny + n} V${u - rr} Q${b} ${u} ${b - rr} ${u} H${a + rr} Q${a} ${u} ${a} ${u - rr} V${ny + n} A${n} ${n} 0 0 0 ${a} ${ny - n} V${t + rr} Q${a} ${t} ${a + rr} ${t} Z`;
}
/** 1930s pie-cut eye: a black oval with a wedge cut out for the highlight. */
function pie(rx: number, ry: number, a1 = -22, a2 = -72) {
  const P = (a: number) => [rx * Math.cos(a * Math.PI / 180), ry * Math.sin(a * Math.PI / 180)].map(f1).join(' ');
  return `M0 0 L${P(a1)} A${rx} ${ry} 0 1 1 ${P(a2)} Z`;
}
export function bodyMatrix(p: Pose): number[] {
  const r = p.rot * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
  const a = c * p.sx, b = s * p.sx, cc = -s * p.sy, d = c * p.sy, [px, py] = PIVOT;
  return [a, b, cc, d, px - (a * px + cc * py) + p.dx, py - (b * px + d * py) - p.by];
}
const apply = (m: number[], [x, y]: [number, number]): [number, number] => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
/** Where the two ends of the carried pipe are, in the rig's own units (props ride in the body group, so the body's move counts). */
export function pipeEnds(p: Pose): { L: [number, number]; R: [number, number] } {
  const pr = p.props.pipe, m = bodyMatrix(p), a = (pr.rot * Math.PI) / 180, [cx, cy] = pr.at ?? [63, 150], half = 87;
  const end = (sgn: number): [number, number] => apply(m, [cx + pr.ox + sgn * half * Math.cos(a), cy + pr.oy + sgn * half * Math.sin(a)]);
  return { L: end(-1), R: end(1) };
}

/* ── Parts ──────────────────────────────────────────────────────────────── */
function glove(parent: Element) {                                 // fingers along +x, wrist at 0,0
  const g = el('g', {}, parent), open = el('g', {}, g), fist = el('g', {}, g), point = el('g', {}, g);
  const w = { fill: C.white, ...ink(2.3) };
  el('ellipse', { cx: 6, cy: -9.4, rx: 3.6, ry: 4.2, transform: 'rotate(-25 6 -9.4)', ...w }, open);
  for (const [x, y] of [[15, -6.2], [18, -2.1], [18, 2.2], [15, 6.3]]) el('circle', { cx: x, cy: y, r: 3.9, ...w }, open);
  el('ellipse', { cx: 8.5, cy: 0, rx: 8.8, ry: 8.4, ...w }, open);
  el('path', { d: 'M4.5 -3.4 Q8 -3.7 11.5 -3.4 M4.5 0 H11.8 M4.5 3.4 Q8 3.7 11.5 3.4', fill: 'none', ...ink(LW.inner) }, open);
  el('ellipse', { cx: 6.5, cy: -8.6, rx: 3.4, ry: 3.8, ...w }, fist);
  el('circle', { cx: 9, cy: 0, r: 9.2, ...w }, fist);
  el('path', { d: 'M15 -5.4 Q13 -3.4 15.3 -1.5 M15.9 -1.1 Q13.4 0.8 15.9 2.8 M15.1 3.4 Q13 5.2 14.8 6.8', fill: 'none', ...ink(LW.inner) }, fist);
  el('path', { d: 'M3.8 -3 Q7 -3.3 10 -3 M3.8 0.2 H10 M3.8 3.4 Q7 3.7 10 3.4', fill: 'none', ...ink(LW.inner) }, fist);
  /* POINTING (fist = 2): the fist with the index finger out along the arm */
  el('path', { d: 'M10 -9.9 H29 A3.7 3.7 0 0 1 29 -2.5 H10 Z', ...w }, point);
  el('ellipse', { cx: 6.5, cy: -8.6, rx: 3.4, ry: 3.8, ...w }, point);
  el('circle', { cx: 9, cy: 1.4, r: 8.2, ...w }, point);
  el('path', { d: 'M15.4 -1.1 Q13.4 0.8 15.4 2.8 M15 3.4 Q13 5.2 14.8 6.8 M4 -1.6 H11 M4 1.8 H10.5 M4 5 H10', fill: 'none', ...ink(LW.inner) }, point);
  el('path', { d: 'M-7.5 -8.4 Q-3.4 -9.4 0.4 -7.4 V7.4 Q-3.4 9.4 -7.5 8.4 Q-9 0 -7.5 -8.4 Z', ...w }, g);   // rolled cuff
  el('path', { d: 'M-3.6 -8.2 Q-5 0 -3.6 8.2', fill: 'none', ...ink(LW.inner) }, g);
  return { g, open, fist, point };
}
function shoe(parent: Element, side: number) {
  const g = el('g', {}, parent);
  el('path', { d: `M${-12 * side - 2} 0 Q${-12 * side} -11 ${3 * side} -11 Q${16 * side} -11 ${17 * side} -2 Q${17 * side} 3 ${10 * side} 3 L${-8 * side} 3 Q${-12 * side - 2} 3 ${-12 * side - 2} 0 Z`, fill: C.ink, ...ink(2.2) }, g);
  el('ellipse', { cx: 7 * side, cy: -7, rx: 4.2, ry: 1.8, fill: C.white, opacity: 0.7, transform: `rotate(${-12 * side} ${7 * side} -7)` }, g);
  return g;
}
const star = (p: Element) => el('path', { d: 'M0 -7 Q1.2 -1.2 7 0 Q1.2 1.2 0 7 Q-1.2 1.2 -7 0 Q-1.2 -1.2 0 -7 Z', fill: C.yellow, ...ink(1.4) }, p);
const heart = (p: Element) => el('path', { d: 'M0 3 C-6 -1 -5 -7 0 -4 C5 -7 6 -1 0 3 Z', fill: C.red, ...ink(1.3) }, p);
function note(parent: Element) {
  const g = el('g', {}, parent);
  el('path', { d: 'M3 -14 V0 M3 -14 Q9 -12 9 -6', fill: 'none', ...ink(2) }, g);
  el('ellipse', { cx: 0, cy: 0, rx: 3.6, ry: 2.8, transform: 'rotate(-20)', fill: C.ink }, g);
  return g;
}

type PhoneParts = { typing: SVGGElement; dots: SVGCircleElement[] };
/* Props. `at` = placed in BODY space (the hand goes to it); otherwise drawn at the
   hand. Draw order = PROP_NAMES order: flat things first. */
const PROPS: Record<PropName, (p: Element, phone: Partial<PhoneParts>) => SVGGElement> = {
  whisk(p) { const g = el('g', {}, p);
    el('path', { d: 'M-5 0 H7', ...ink(3.6) }, g);
    for (const s of [-1, 0, 1]) el('path', { d: `M7 0 Q17 ${-5 * s - 3} 23 ${-2 * s} Q17 ${5 * s + 3} 7 0`, fill: 'none', stroke: '#4a4238', 'stroke-width': 1.5 }, g);
    return g; },
  /* The food-truck swap (lib/dashboard/verticals/skills/food-truck.ts → mascot). Bold on purpose: it must read at header size. */
  spatula(p) { const g = el('g', {}, p);
    el('path', { d: 'M-5 0 H9', stroke: '#9c6a42', 'stroke-width': 4.2, 'stroke-linecap': 'round' }, g);
    el('path', { d: 'M9 -1.4 L14 -1.4 L14 1.4 L9 1.4 Z', fill: '#8a8a86', ...ink(1.4) }, g);
    el('rect', { x: 14, y: -7, width: 13, height: 14, rx: 2, fill: '#b9b9b3', ...ink(2.2) }, g);
    el('path', { d: 'M18 -3.5 V3.5 M22 -3.5 V3.5', fill: 'none', ...ink(1.2) }, g);
    return g; },
  bowl(p) { const g = el('g', {}, p);
    el('path', { d: 'M-18 0 H18 Q17 16 0 16 Q-17 16 -18 0 Z', fill: '#e7d9b8', ...ink(2.4) }, g);
    el('ellipse', { cx: 0, cy: 0, rx: 18, ry: 3.6, fill: '#f6ecd2', ...ink(2) }, g);
    el('path', { d: 'M-10 9 Q0 12 10 9', fill: 'none', ...ink(LW.inner) }, g); return g; },
  pad(p) { const g = el('g', {}, p);
    el('rect', { x: 0, y: -19, width: 30, height: 38, rx: 2, fill: '#fbf3dc', ...ink(2.2) }, g);
    for (const y of [-7, -1, 5, 11]) el('path', { d: `M5 ${y} H26`, stroke: '#8fa9bf', 'stroke-width': 1.1 }, g);
    el('path', { d: 'M6 -8.5 q2 -2.4 4 0 t4 0 t4 0 M6 -2.5 q2 -2 4 0 t4 0', fill: 'none', ...ink(1.2) }, g);
    for (let x = 4; x <= 26; x += 5.5) el('circle', { cx: x, cy: -19, r: 1.8, fill: 'none', ...ink(1.2) }, g);
    return g; },
  pencil(p) { const g = el('g', {}, p);
    el('path', { d: 'M-4 -2.5 H15 V2.5 H-4 Z', fill: C.yellow, ...ink(1.8) }, g);
    el('path', { d: 'M15 -2.5 L21 0 L15 2.5 Z', fill: '#efd2a2', ...ink(1.8) }, g);
    el('path', { d: 'M19 -0.8 L21 0 L19 0.8 Z', fill: C.ink }, g);
    el('rect', { x: -8, y: -2.5, width: 4, height: 5, fill: C.pink, ...ink(1.8) }, g); return g; },
  /* A mug of coffee, handle toward us on the right (the "Play to see Shorty in action" band). Origin = where the glove grips. */
  cup(p) { const g = el('g', {}, p);
    el('path', { d: 'M9 -4 Q18 -4 18 2.5 Q18 9 8.5 8', fill: 'none', ...ink(2.2) }, g);
    el('path', { d: 'M-9 -9 H9 L8 8 Q7.5 11 5 11 H-5 Q-7.5 11 -8 8 Z', fill: '#fbf6e6', ...ink(2.2) }, g);
    el('path', { d: 'M-8.6 -1 H8.6 L8.3 3 H-8.3 Z', fill: '#8cc3a1', stroke: 'none' }, g);
    el('ellipse', { cx: 0, cy: -9, rx: 9, ry: 2.4, fill: '#6b4428', ...ink(1.8) }, g);
    return g; },
  phone(p, phone) { const g = el('g', {}, p);
    el('rect', { x: -9, y: -40, width: 18, height: 40, rx: 3.5, fill: C.ink, ...ink(2) }, g);
    el('rect', { x: -6.5, y: -35.5, width: 13, height: 28, rx: 1.6, fill: '#bfe0cb' }, g);
    el('rect', { x: -5, y: -30, width: 8, height: 4.5, rx: 2.2, fill: '#fbf6e6' }, g);
    const typing = el('g', {}, g);
    el('rect', { x: -2, y: -20, width: 8.5, height: 5.5, rx: 2.7, fill: '#fbf6e6', stroke: '#2e5b46', 'stroke-width': 0.8 }, typing);
    phone.dots = [0, 1, 2].map(i => el('circle', { cx: 0.2 + i * 2.1, cy: -17.2, r: 0.75, fill: '#2e5b46' }, typing));
    phone.typing = typing; return g; },
  /* The phone from behind (website hero): screen faces Shorty, its light spills over the top edge. */
  phoneBack(p) { const g = el('g', {}, p);
    el('ellipse', { cx: 0, cy: -41, rx: 13, ry: 6, fill: '#dffbea', opacity: 0.55 }, g);
    el('rect', { x: -9, y: -40, width: 18, height: 40, rx: 3.5, fill: '#2b2a26', ...ink(2) }, g);
    el('path', { d: 'M-9 -36 Q-9 -40 -5 -40 H5 Q9 -40 9 -36', fill: 'none', stroke: '#bff0d4', 'stroke-width': 1.4, 'stroke-linecap': 'round' }, g);
    el('rect', { x: -6.5, y: -36.5, width: 8, height: 9.5, rx: 2.2, fill: '#3d3b36', stroke: '#1d1a16', 'stroke-width': 1 }, g);
    el('circle', { cx: -4, cy: -34, r: 1.6, fill: '#1d1a16' }, g);
    el('circle', { cx: -0.5, cy: -30.5, r: 1.6, fill: '#1d1a16' }, g);
    el('rect', { x: -3.2, y: -19, width: 6.4, height: 6.4, rx: 1.6, fill: C.green }, g);
    return g; },
  /* A length of pipe for the website's pipes picture: mint body, darker flanges, the rig's black ink. */
  pipe(p) { const g = el('g', {}, p);
    el('rect', { x: -85, y: -14, width: 170, height: 28, rx: 3, fill: '#34d399', ...ink(2.4) }, g);
    el('path', { d: 'M-82 -8 H82', stroke: '#9df0cc', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 }, g);
    for (const x of [-80, 0, 80]) el('rect', { x: x - 7, y: -20, width: 14, height: 40, rx: 2.5, fill: '#1f9e73', ...ink(2.2) }, g);
    return g; },
  megaphone(p) { const g = el('g', {}, p);
    el('rect', { x: -5, y: -3.4, width: 6, height: 6.8, rx: 1.5, fill: '#333', ...ink(1.8) }, g);
    el('path', { d: 'M0 -3.8 L34 -15 Q40 0 34 15 L0 3.8 Z', fill: C.white, ...ink(2.4) }, g);
    el('path', { d: 'M17 -9.4 L22 -11 Q25 0 22 11 L17 9.4 Q19.5 0 17 -9.4 Z', fill: C.red, ...ink(1.4) }, g);
    el('ellipse', { cx: 34.5, cy: 0, rx: 4, ry: 15, fill: '#e9dfc4', ...ink(2.4) }, g);
    el('path', { d: 'M11 5.5 L13 16', ...ink(4) }, g);
    return g; },
  hammer(p) { const g = el('g', {}, p);
    el('path', { d: 'M-4 0 H24', stroke: '#9c6a42', 'stroke-width': 4.6, 'stroke-linecap': 'round' }, g);
    el('rect', { x: 20, y: -8.5, width: 10.5, height: 17, rx: 2.5, fill: '#8a8a86', ...ink(2.2) }, g); return g; },
  stamp(p) { const g = el('g', {}, p);
    el('circle', { cx: 0, cy: 0, r: 6, fill: C.red, ...ink(2.2) }, g);
    el('rect', { x: -2.6, y: 4, width: 5.2, height: 12, fill: '#6b4a2f', ...ink(1.8) }, g);
    el('rect', { x: -13, y: 15, width: 26, height: 8.5, rx: 1.5, fill: '#6b4a2f', ...ink(2.2) }, g);
    el('rect', { x: -13, y: 22.5, width: 26, height: 3.5, fill: '#3f8f64', ...ink(1.6) }, g); return g; },
};

let rigN = 0;
export type RigUpdate = (p: Pose, swaps?: Partial<Record<PropName, PropName>>) => void;

/** Build Shorty into `svg`. `small` = header size: thicker lines, fine detail skipped. */
export function makeRig(svg: SVGSVGElement, opts: { small?: boolean; boil?: boolean; reduce?: boolean } = {}): RigUpdate {
  const small = opts.small ?? false, boil = opts.boil ?? !small, reduce = opts.reduce ?? false;
  const id = `m${rigN++}${Math.random().toString(36).slice(2, 6)}`, W = small ? 1.45 : 1;
  const defs = el('defs', {}, svg);
  /* LINE BOIL: a tiny displacement whose noise seed steps ~10×/s, like redrawn frames */
  const f = el('filter', { id: `boil${id}`, x: '-5%', y: '-5%', width: '110%', height: '110%' }, defs);
  const turb = el('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.045, numOctaves: 2, seed: 1, result: 'n' }, f);
  el('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: 0.9, xChannelSelector: 'R', yChannelSelector: 'G' }, f);
  const boiling = boil && !reduce;

  const world = el('g', boiling ? { filter: `url(#boil${id})` } : {}, svg);
  const shadow = el('ellipse', { cx: 64, cy: 229, rx: 44, ry: 5, fill: '#3a2a12', opacity: 0.18 }, world);
  const live = el('g', {}, world);
  el('rect', { x: -19, y: -9, width: 38, height: 18, rx: 4, fill: 'none', stroke: '#3f8f64', 'stroke-width': small ? 4.5 : 3 }, live);
  el('text', { x: 0, y: 5, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 900, fill: '#3f8f64', 'font-family': 'Georgia,serif', 'letter-spacing': 1 }, live).textContent = 'LIVE';
  const sign = el('g', {}, world);
  el('rect', { x: -2.5, y: -10, width: 5, height: 40, fill: '#9c6a42', ...ink(2) }, sign);
  el('rect', { x: -21, y: -35, width: 42, height: 25, rx: 2, fill: '#fbf3dc', ...ink(2.4) }, sign);
  el('text', { x: 0, y: -18.5, 'text-anchor': 'middle', 'font-size': 9.5, 'font-weight': 900, fill: C.ink, 'font-family': 'Georgia,serif' }, sign).textContent = 'EVENT';
  const papers = [0, 1, 2, 3].map(() => { const g = el('g', {}, world);
    el('rect', { x: -10, y: -13, width: 20, height: 26, rx: 1.5, fill: '#fbf3dc', ...ink(1.8) }, g);
    for (const y of [-6, -1, 4]) el('path', { d: `M-6 ${y} H6`, stroke: '#a8997c', 'stroke-width': 1.2 }, g);
    return g; });
  const legs = {} as Record<Side, SVGPathElement>, shoes = {} as Record<Side, SVGGElement>;
  for (const s of ['L', 'R'] as Side[]) legs[s] = el('path', { fill: 'none', stroke: C.ink, 'stroke-width': 7 * W, 'stroke-linecap': 'round' }, world);
  for (const s of ['L', 'R'] as Side[]) shoes[s] = shoe(world, s === 'L' ? -1 : 1);

  const body = el('g', {}, world);
  const backArms = el('g', {}, body);
  el('path', { d: ticketPath(0), fill: C.side, ...ink(LW.outer * W), transform: 'translate(-2.6 1.6)' }, body);
  el('path', { d: ticketPath(0), fill: C.green, ...ink(LW.outer * W) }, body);
  if (!small) el('path', { d: ticketPath(4.2), fill: 'none', stroke: C.stitch, 'stroke-width': 1.1, 'stroke-dasharray': '3 2.6', opacity: 0.85 }, body);
  const bw = small ? 1.25 : 1;
  el('path', { d: 'M82 104 V150 H42 V90 A20 20 0 0 1 81 85', fill: 'none', stroke: C.white, 'stroke-width': 5.2 * bw, 'stroke-linejoin': 'miter' }, body);
  el('path', { d: 'M50 113 L59.5 123.5 L84 93', fill: 'none', stroke: C.white, 'stroke-width': 5.4 * bw, 'stroke-linejoin': 'miter', 'stroke-linecap': 'square' }, body);

  /* The phone's light on his face while he works it (phoneBack). */
  const sg = el('radialGradient', { id: `sg${id}` }, defs);
  el('stop', { offset: '0%', 'stop-color': '#f2fff8', 'stop-opacity': 0.75 }, sg);
  el('stop', { offset: '100%', 'stop-color': '#f2fff8', 'stop-opacity': 0 }, sg);
  const screenGlow = el('ellipse', { cx: 66, cy: 64, rx: 40, ry: 32, fill: `url(#sg${id})` }, body);
  const face = el('g', {}, body);
  const brows = {} as Record<Side, SVGPathElement>, eyes = {} as Record<Side, SVGGElement>;
  for (const s of ['L', 'R'] as Side[]) {
    brows[s] = el('path', { d: 'M-4.2 1.8 Q0 -2.4 4.2 1.8', fill: 'none', ...ink(LW.feature * W) }, face);
    eyes[s] = el('g', {}, face);
    el('path', { d: pie(3.1 * (small ? 1.25 : 1), 6 * (small ? 1.1 : 1)), fill: C.ink }, eyes[s]);
  }
  const mouthG = el('g', {}, face), mouths = {} as Record<Exclude<MouthShape, 'none'>, SVGGElement>;
  const mk = (k: Exclude<MouthShape, 'none'>, build: (g: SVGGElement) => void) => { mouths[k] = el('g', {}, mouthG); build(mouths[k]); show(mouths[k], false); };
  const lw = 2.2 * W;
  mk('grin', g => { el('path', { d: 'M-8 -2 Q0 -0.4 8 -2 Q7.4 10 0 10 Q-7.4 10 -8 -2 Z', fill: '#3a1812', ...ink(lw) }, g);
    el('path', { d: 'M-3.6 7.4 Q0 4 3.6 7.4 Q0 9.6 -3.6 7.4 Z', fill: C.pink }, g); });
  mk('o', g => el('ellipse', { cx: 1, cy: 1.2, rx: 2.1, ry: 2.5, fill: '#3a1812', ...ink(lw * 0.9) }, g));
  mk('squiggle', g => el('path', { d: 'M-5 1.5 q1.6 -2.2 3.2 0 t3.2 0 t3.4 -1.4', fill: 'none', ...ink(lw) }, g));
  mk('shout', g => el('ellipse', { cx: 0, cy: 2.5, rx: 5.6, ry: 6.4, fill: '#3a1812', ...ink(lw) }, g));
  mk('frown', g => el('path', { d: 'M-5.5 3 q1.4 -3 2.8 -1.6 t2.8 -1 t2.8 1 t2.6 1.6', fill: 'none', ...ink(lw) }, g));
  const mouthState: { shown: MouthShape; phase: 'idle' | 'in' | 'out'; t0: number } = { shown: 'none', phase: 'idle', t0: 0 };

  const hat = el('g', {}, body);
  for (const [x, y, r] of [[48, -12, 10], [63, -18, 12], [78, -12, 10]]) el('circle', { cx: x, cy: y, r, fill: C.white, ...ink(2.4 * W) }, hat);
  el('rect', { x: 42, y: -8, width: 42, height: 12, rx: 2, fill: C.white, ...ink(2.4 * W) }, hat);
  el('path', { d: 'M54 -6 V2 M63 -6 V2 M72 -6 V2', fill: 'none', ...ink(LW.inner), opacity: 0.6 }, hat);

  /* A hard hat, for when he's building pipes: yellow dome, centre rib, wide brim, the rig's black ink. */
  const hardhat = el('g', {}, body);
  el('path', { d: 'M28 5 Q28 -25 63 -25 Q98 -25 98 5 Z', fill: '#f2c94c', ...ink(2.4 * W) }, hardhat);
  el('rect', { x: 56, y: -26, width: 14, height: 31, rx: 3, fill: '#e5b02e', ...ink(1.8 * W) }, hardhat);
  el('rect', { x: 20, y: 2, width: 86, height: 10, rx: 5, fill: '#f2c94c', ...ink(2.4 * W) }, hardhat);
  el('path', { d: 'M36 -4 Q40 -16 50 -19', fill: 'none', stroke: '#fff7d6', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.85 }, hardhat);
  const frontArms = el('g', {}, body), propLayer = el('g', {}, body), gloveLayer = el('g', {}, body);
  const arms = {} as Record<Side, { back: SVGPathElement; front: SVGPathElement }>;
  const bumps = {} as Record<Side, SVGGElement>, gloves = {} as Record<Side, ReturnType<typeof glove>>;
  for (const s of ['L', 'R'] as Side[]) {
    arms[s] = { back: el('path', { fill: 'none', stroke: C.ink, 'stroke-width': LW.limb * W, 'stroke-linecap': 'round' }, backArms),
                front: el('path', { fill: 'none', stroke: C.ink, 'stroke-width': LW.limb * W, 'stroke-linecap': 'round' }, frontArms) };
    bumps[s] = el('g', {}, frontArms);
    el('circle', { r: 10.5, fill: C.ink }, bumps[s]);
    el('path', { d: 'M-5 -5.6 Q0 -8.6 5 -5.6', fill: 'none', stroke: C.white, 'stroke-width': 1.6, 'stroke-linecap': 'round', opacity: 0.75 }, bumps[s]);
    gloves[s] = glove(gloveLayer);
  }
  const phone: Partial<PhoneParts> = {};
  const held = Object.fromEntries(PROP_NAMES.map(k => [k, PROPS[k](propLayer, phone)])) as Record<PropName, SVGGElement>;
  /* The held pipe is cut paper, like the website's scenes: torn edge, grain, a hard offset shadow. */
  const pf = el('filter', { id: `pipe${id}`, x: '-15%', y: '-45%', width: '130%', height: '200%', 'color-interpolation-filters': 'sRGB' }, defs);
  el('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.06, numOctaves: 1, seed: 5, result: 'warp' }, pf);
  el('feDisplacementMap', { in: 'SourceGraphic', in2: 'warp', scale: 2.6, xChannelSelector: 'R', yChannelSelector: 'G', result: 'torn' }, pf);
  el('feTurbulence', { type: 'fractalNoise', baseFrequency: 1.4, numOctaves: 2, seed: 3, result: 'fine' }, pf);
  el('feColorMatrix', { in: 'fine', type: 'matrix', values: '0 0 0 0 0.08  0 0 0 0 0.07  0 0 0 0 0.05  0.5 0 0 0 -0.18', result: 'specks' }, pf);
  el('feComposite', { in: 'specks', in2: 'torn', operator: 'in', result: 'grain' }, pf);
  const pm = el('feMerge', { result: 'sheet' }, pf);
  el('feMergeNode', { in: 'torn' }, pm); el('feMergeNode', { in: 'grain' }, pm);
  el('feDropShadow', { in: 'sheet', dx: 3, dy: 4, stdDeviation: 0, 'flood-color': '#000', 'flood-opacity': 0.38 }, pf);
  held.pipe.setAttribute('filter', `url(#pipe${id})`);
  hardhat.setAttribute('filter', `url(#pipe${id})`);   // the hard hat is cut paper too
  const bubbleLayer = el('g', {}, body);
  const bubbles = [0, 1].map(i => { const g = el('g', {}, bubbleLayer);
    el('path', { d: 'M-12 -7 H12 Q16 -7 16 -3 V3 Q16 7 12 7 H-4 L-9 11 L-8 7 H-12 Q-16 7 -16 3 V-3 Q-16 -7 -12 -7 Z', fill: i ? '#fbf6e6' : C.green, ...ink(1.8) }, g);
    el('path', { d: 'M-10 -1.5 H9 M-10 2.5 H3', fill: 'none', ...ink(1.3), opacity: 0.7 }, g);
    return g; });

  const over = el('g', {}, world);
  const q = el('text', { 'font-size': 34, 'font-weight': 900, 'text-anchor': 'middle', fill: C.white, stroke: C.ink, 'stroke-width': 2.2 * W, 'paint-order': 'stroke', 'font-family': 'Georgia,serif' }, over);
  q.textContent = '?';
  const bulb = el('g', {}, over), rays = el('g', {}, bulb);
  for (let i = 0; i < 8; i++) el('path', { d: 'M0 -17 V-23', ...ink(2.4), transform: `rotate(${i * 45})` }, rays);
  const glass = el('circle', { cx: 0, cy: -3, r: 11, fill: '#f6efd2', ...ink(2.4 * W) }, bulb);
  el('path', { d: 'M-4 1 Q0 -7 4 1', fill: 'none', stroke: '#a88410', 'stroke-width': 1.4 }, bulb);
  el('rect', { x: -5.5, y: 7, width: 11, height: 8, rx: 1.5, fill: '#9d9a90', ...ink(2) }, bulb);
  el('path', { d: 'M-5.5 10 H5.5 M-5.5 12.5 H5.5', stroke: C.ink, 'stroke-width': 1.1 }, bulb);
  const notes = [0, 1, 2].map(() => note(over));
  const stars = [0, 1, 2, 3].map(() => star(over));
  const shout = el('g', {}, over);
  const shoutLines = el('path', { fill: 'none', ...ink(2.2) }, shout);
  const bits = [heart(shout), star(shout), heart(shout)];
  const dust = el('path', { fill: 'none', ...ink(2) }, over);

  return function update(p: Pose, swaps = {}) {
    if (boiling) turb.setAttribute('seed', String(p.boilSeed || 1));
    const m = bodyMatrix(p);
    world.setAttribute('transform', `translate(${f1(p.fx.shake)} 0)`);
    body.setAttribute('transform', `matrix(${m.map(v => v.toFixed(4)).join(' ')})`);
    shadow.setAttribute('rx', f1(44 - p.by * 0.6));

    /* face */
    const blink = p.blink ?? 1;
    for (const s of ['L', 'R'] as Side[]) {
      const [ex, ey] = EYE[s], [bx, by] = BROW[s], side = s === 'L' ? -1 : 1;
      eyes[s].setAttribute('transform', `translate(${f1(ex + p.face.gx)} ${f1(ey + p.face.gy)}) scale(1 ${Math.max(0.08, p.face.eo * blink).toFixed(3)})`);
      const bo = s === 'L' ? p.face.bl : p.face.br, br = (s === 'L' ? p.face.blr : p.face.brr) * side;
      brows[s].setAttribute('transform', `translate(${bx} ${f1(by + bo)}) rotate(${f1(br)})`);
    }
    /* MOUTH: none at rest; pops in/out with a quick squash, never a fade */
    const now = p.t, ms = mouthState, target = p.face.mouth;
    if (reduce) { ms.shown = target; ms.phase = 'idle'; }
    else {
      if (ms.phase === 'idle' && target !== ms.shown) { ms.phase = ms.shown === 'none' ? 'in' : 'out'; if (ms.phase === 'in') ms.shown = target; ms.t0 = now; }
      if (ms.phase === 'out' && now - ms.t0 >= 0.08) { ms.shown = target; ms.phase = target === 'none' ? 'idle' : 'in'; ms.t0 = now; }
      if (ms.phase === 'in' && now - ms.t0 >= 0.18) ms.phase = 'idle';
    }
    let msx = 1, msy = 1;
    if (ms.phase === 'out') { const k = (now - ms.t0) / 0.08; msx = 1 + 0.3 * k; msy = Math.max(0.01, 1 - k); }
    if (ms.phase === 'in') { const k = clamp01((now - ms.t0) / 0.18); msy = Math.max(0.01, easeOutBack(k, 2.4)); msx = 1 + 0.35 * Math.sin(Math.PI * k); }
    for (const [k, g] of Object.entries(mouths)) show(g, k === ms.shown);
    mouthG.setAttribute('transform', `translate(${MOUTH[0]} ${MOUTH[1]}) scale(${msx.toFixed(3)} ${msy.toFixed(3)})`);

    /* limbs */
    const hand = {} as Record<Side, [number, number]>;
    for (const s of ['L', 'R'] as Side[]) {
      const side = s === 'L' ? -1 : 1, a = p[s];
      const [sx0, sy0] = SHOULDER[s], hx = sx0 + a.hx, hy = sy0 + a.hy;
      hand[s] = [hx, hy];
      const dx = hx - sx0, dy = hy - sy0, len = Math.hypot(dx, dy) || 1;
      /* ALWAYS BOW OUTWARD: the bulge points away from the body (or droops, when level) */
      let nx = -dy / len, ny = dx / len;
      if (nx * side < 0 || (Math.abs(nx) < 0.25 && ny < 0)) { nx = -nx; ny = -ny; }
      const cx = (sx0 + hx) / 2 + nx * a.bend, cy = (sy0 + hy) / 2 + ny * a.bend;
      const d = `M${sx0} ${sy0} Q${f1(cx)} ${f1(cy)} ${f1(hx)} ${f1(hy)}`;
      const front = a.front > 0.5;
      arms[s].front.setAttribute('d', d); arms[s].back.setAttribute('d', d);
      show(arms[s].front, front); show(arms[s].back, !front);
      const u = 0.42, mx = (1 - u) ** 2 * sx0 + 2 * u * (1 - u) * cx + u * u * hx, my = (1 - u) ** 2 * sy0 + 2 * u * (1 - u) * cy + u * u * hy;
      bumps[s].setAttribute('transform', `translate(${f1(mx)} ${f1(my)}) scale(${Math.max(0.001, a.bump).toFixed(3)})`);
      const ang = Math.atan2(hy - cy, hx - cx) * 180 / Math.PI + a.rot;
      gloves[s].g.setAttribute('transform', `translate(${f1(hx)} ${f1(hy)}) rotate(${f1(ang)}) scale(1 ${s === 'L' ? -1 : 1})`);
      show(gloves[s].open, a.fist <= 0.5); show(gloves[s].fist, a.fist > 0.5 && a.fist < 1.5); show(gloves[s].point, a.fist >= 1.5);
      const [hpx, hpy] = apply(m, HIP[s]);
      const fx = FOOT[s][0] + p.feet[s].x, fy = FOOT[s][1] - p.feet[s].lift;
      legs[s].setAttribute('d', `M${f1(hpx)} ${f1(hpy)} Q${f1((hpx + fx) / 2 + side * (6 + p.feet.bow))} ${f1((hpy + fy) / 2)} ${f1(fx)} ${f1(fy - 4)}`);
      shoes[s].setAttribute('transform', `translate(${f1(fx)} ${f1(fy)}) rotate(${f1(p.feet[s].tilt * side)})`);
    }

    /* props, with a vertical's swaps: the pose says "whisk", the drawing may be a spatula */
    const drawn = new Set<PropName>();
    for (const k of PROP_NAMES) {
      const pr = p.props[k];
      if (!pr || pr.v <= 0.02) continue;
      const as = swaps[k] ?? k;
      if (small && SMALL_SKIP.has(as)) continue;
      const g = held[as];
      const [x, y] = pr.at ? pr.at : hand[pr.hand];
      g.setAttribute('transform', `translate(${f1(x + pr.ox)} ${f1(y + pr.oy)}) rotate(${f1(pr.rot)}) scale(${(pr.v * pr.s).toFixed(3)})`);
      drawn.add(as);
    }
    for (const k of PROP_NAMES) show(held[k], drawn.has(k));

    /* texting: dots on the screen while typing, then a bubble pops out and floats away */
    const tx = p.fx.text;
    if (tx && tx.on > 0.5 && drawn.has('phone') && phone.typing && phone.dots) {
      show(phone.typing, tx.typing > 0.5);
      phone.dots.forEach((d, i) => d.setAttribute('cy', f1(-17.2 - Math.max(0, Math.sin(p.t * 7 - i * 0.9)) * 1.1)));
      const [hx, hy] = hand[p.props.phone.hand], sx0 = hx + 1, sy0 = hy + 3 - 40 * p.props.phone.s;
      bubbles.forEach((b, i) => {
        const k = i === tx.n % 2 ? tx.pop : -1;
        show(b, k >= 0);
        if (k < 0) return;
        const grow = easeOutBack(clamp01(k / 0.18), 2), fade = 1 - clamp01((k - 0.6) / 0.4);
        b.setAttribute('transform', `translate(${f1(sx0 + 6 + k * 34)} ${f1(sy0 - 4 - k * 46)}) rotate(${f1(-6 + k * 10)}) scale(${(Math.max(0.001, grow) * (small ? 1.3 : 1)).toFixed(3)})`);
        b.setAttribute('opacity', fade.toFixed(2));
      });
    } else { bubbles.forEach(b => show(b, false)); if (phone.typing) show(phone.typing, false); }
    const glowOn = p.fx.glow ?? 0;
    /* the light spilling over the phone's top edge is the screen: only on while he's working it */
    (held.phoneBack.firstChild as SVGElement | null)?.setAttribute('opacity', (0.55 * glowOn).toFixed(2));
    show(screenGlow, glowOn > 0.02);
    screenGlow.setAttribute('opacity', (glowOn * (0.85 + 0.15 * Math.sin(p.t * 9))).toFixed(2));
    show(hardhat, (p.hardhat ?? 0) > 0.5);
    show(hat, p.hat > 0.02);
    hat.setAttribute('transform', `translate(63 4) scale(${Math.max(0.001, p.hat).toFixed(3)}) translate(-63 -4)`);

    const sg = p.world.sign;
    show(sign, sg.v > 0.02 && !small);
    sign.setAttribute('transform', `translate(150 ${f1(206 + sg.sink)}) rotate(${f1(sg.wob)}) scale(${Math.max(0.001, sg.v).toFixed(3)})`);
    show(live, p.world.live > 0.02);
    live.setAttribute('transform', `translate(136 224) rotate(-6) scale(${(Math.max(0.001, p.world.live) * 1.25).toFixed(3)} ${(Math.max(0.001, p.world.live) * 0.75).toFixed(3)})`);
    papers.forEach((g, i) => {
      const pp = p.world.papers[i];
      show(g, pp.v > 0.02 && !(small && SMALL_SKIP.has('papers')));
      g.setAttribute('transform', `translate(${f1(pp.x)} ${f1(pp.y)}) rotate(${f1(pp.r)}) scale(${Math.max(0.001, pp.v).toFixed(3)})`);
    });

    show(q, p.fx.q > 0.02);
    q.setAttribute('transform', `translate(100 ${f1(-12 + Math.sin(p.t * 3) * 3)}) rotate(${f1(12 + Math.sin(p.t * 2) * 6)}) scale(${(Math.max(0.001, p.fx.q) * (small ? 1.3 : 1)).toFixed(3)})`);
    show(bulb, p.fx.bulb > 0.02);
    bulb.setAttribute('transform', `translate(63 -30) scale(${(Math.max(0.001, p.fx.bulb) * (small ? 1.35 : 1)).toFixed(3)})`);
    glass.setAttribute('fill', p.fx.lit > 0.6 ? C.yellow : p.fx.lit > 0.2 ? '#f5e29a' : '#f6efd2');
    show(rays, p.fx.lit > 0.85);
    rays.setAttribute('transform', `scale(${(0.9 + 0.12 * Math.sin(p.t * 8)).toFixed(3)})`);
    notes.forEach((n, i) => {
      const ph = (p.t * 0.55 + i / 3) % 1, on = p.fx.notes * (small ? 0 : 1) * Math.sin(ph * Math.PI);
      show(n, on > 0.03);
      n.setAttribute('transform', `translate(${f1(76 + ph * 36 + Math.sin(ph * 9) * 3)} ${f1(54 - ph * 62)}) rotate(${f1(Math.sin(ph * 6) * 15)}) scale(${on.toFixed(3)})`);
    });
    const sh = p.fx.shout;
    show(shout, sh > 0.02);
    if (sh > 0.02) {
      const [ox, oy] = p.fx.shoutAt, w = (p.t * 3) % 1;
      shoutLines.setAttribute('d', [0, 1, 2].map(i => { const r = 8 + i * 7 + w * 6; return `M${f1(ox + r * 0.5)} ${f1(oy - r)} Q${f1(ox + r * 1.1)} ${f1(oy)} ${f1(ox + r * 0.5)} ${f1(oy + r)}`; }).join(' '));
      shoutLines.setAttribute('opacity', (sh * (1 - w * 0.6)).toFixed(2));
      bits.forEach((b, i) => { const ph = (p.t * 0.9 + i / 3) % 1;
        b.setAttribute('transform', `translate(${f1(ox + 10 + ph * 44)} ${f1(oy - 6 - ph * 34 + i * 10 - 10)}) rotate(${f1(ph * 60 - 20)}) scale(${(sh * Math.sin(ph * Math.PI) * (small ? 1.5 : 1.1)).toFixed(3)})`); });
    }
    ([[14, -48], [112, -44], [134, -8], [-8, -14]] as Array<[number, number]>).forEach(([x, y], i) => {
      const k = clamp01(p.fx.sparkle * 1.3 - i * 0.08) * (0.75 + 0.25 * Math.sin(p.t * 7 + i * 1.7));
      show(stars[i], k > 0.02);
      stars[i].setAttribute('transform', `translate(${x} ${y}) rotate(${(p.t * 90 + i * 30) % 360}) scale(${(k * (small ? 1.5 : i % 2 ? 0.8 : 1.1)).toFixed(3)})`);
    });
    show(dust, p.fx.dust > 0.02 && !small);
    const r = 10 + (1 - p.fx.dust) * 14;
    dust.setAttribute('d', `M${84 + r} 226 l7 -4 M${86 + r} 231 l9 0 M${44 - r} 226 l-7 -4 M${42 - r} 231 l-9 0`);
    dust.setAttribute('opacity', p.fx.dust.toFixed(2));
  };
}
