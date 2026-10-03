/**
 * A torn-paper seam. `fill` is the paper ABOVE the seam; it hangs down over whatever is below it with a ragged, fibrous edge:
 * big slow bites, medium chips and fine fray (layered seeded noise), a pale paper-core rim showing where the sheet tore
 * (real torn paper is white along the break), a few loose fibres, and a soft shadow under it. `after` puts it just below its
 * container instead of inside the top of it.
 *
 * `angle` tilts the whole tear (view-box units of drop across the width; negative rises) and `rough` scales the bites. A
 * tilted tear also grows rougher as it runs, like a rip that starts clean and opens up. `tall` gives it the room that needs.
 */
const W = 1200;
function noise(seed: number) {
  const v = (i: number) => { let t = (Math.imul(i ^ seed, 0x45d9f3b) ^ (i >>> 3)) >>> 0; t = Math.imul(t ^ (t >>> 15), 0x2c1b3c6d) >>> 0; return ((t ^ (t >>> 12)) >>> 0) / 4294967296; };
  return (x: number) => { const i = Math.floor(x), f = x - i, s = f * f * (3 - 2 * f); return v(i) * (1 - s) + v(i + 1) * s; };
}
function edge(seed: number, base: number, angle: number, rough: number) {
  const a = noise(seed), b = noise(seed + 11), c = noise(seed + 23), d = noise(seed + 37), e = noise(seed + 51);
  const pts: [number, number][] = [];
  for (let x = 0; x <= W; x += 2.5) {
    const u = x / W, grow = angle === 0 ? 1 : 0.55 + 1.15 * (angle > 0 ? u : 1 - u);
    pts.push([x, base + angle * u + grow * rough * (a(x / 160) * 9 + e(x / 70) * 6 + b(x / 38) * 4.5 + c(x / 9) * 2.6 + d(x / 2.6) * 1.1)]);
  }
  return pts;
}
const line = (pts: [number, number][]) => pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");
const CACHE = new Map<string, { PAPER: string; CORE: string; FIBRES: string; H: number }>();
function build(seed: number, angle: number, rough: number) {
  const key = `${seed}/${angle}/${rough}`, hit = CACHE.get(key);
  if (hit) return hit;
  const H = Math.round(34 + Math.abs(angle) + 26 * rough);
  const base = angle < 0 ? 12 - angle : 12;
  const top = edge(seed, base, angle, rough), core = edge(seed + 41, base + 4.5, angle, rough * 1.1);
  const PAPER = `M0 0 H${W} V${top[top.length - 1][1].toFixed(1)} L${line([...top].reverse())} Z`;
  const CORE = `M0 0 H${W} V${core[core.length - 1][1].toFixed(1)} L${line([...core].reverse())} Z`;
  const r = noise(99 + seed), out: string[] = [];
  for (let i = 0; i < 60; i++) { const x = 20 + r(i * 3.7) * (W - 40), k = Math.min(top.length - 1, Math.round(x / 2.5)), y = top[k][1] + 1; out.push(`M${x.toFixed(1)} ${y.toFixed(1)} q${(r(i + 50) * 6 - 3).toFixed(1)} ${(3 + r(i + 90) * 5).toFixed(1)} ${(r(i + 20) * 9 - 4.5).toFixed(1)} ${(5 + r(i + 70) * 7).toFixed(1)}`); }
  const res = { PAPER, CORE, FIBRES: out.join(" "), H };
  CACHE.set(key, res);
  return res;
}

export function TornEdge({ fill, after = false, angle = 0, rough = 1, seed = 5, className = "" }: { fill: string; after?: boolean; angle?: number; rough?: number; seed?: number; className?: string }) {
  const { PAPER, CORE, FIBRES, H } = build(seed, angle, rough);
  const k = H / 34;
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={`pointer-events-none absolute inset-x-0 z-10 w-full ${after ? "top-full" : "top-0"} ${className}`} style={{ height: `${(26 * k).toFixed(0)}px`, filter: "drop-shadow(0 3px 2.5px rgba(40,25,10,.3))" }}>
      <path d={CORE} fill="#FFFDF6" />
      <path d={FIBRES} fill="none" stroke="#FFFDF6" strokeWidth={0.9} strokeLinecap="round" opacity={0.85} />
      <path d={PAPER} fill={fill} />
    </svg>
  );
}

/**
 * The same tear as a CSS clip-path, for cutting a textured element's own bottom edge (so the texture runs right to the rip, unlike
 * the flat `TornEdge` flap). The rip lives in the bottom `T` px of the element. `paper` is the element's cut; `core` is a copy
 * a little lower, to sit behind it as the pale torn core.
 */
export function tearPolys(seed: number, angle: number, rough: number, T: number) {
  const base = angle < 0 ? 12 - angle : 12;
  const top = edge(seed, base, angle, rough), core = edge(seed + 41, base + 4.5, angle, rough * 1.1);
  const poly = (pts: [number, number][]) => "polygon(0 0, 100% 0, " + [...pts].reverse().filter((_, i) => i % 3 === 0).map(([x, y]) => `${((x / W) * 100).toFixed(2)}% calc(100% - ${Math.max(0, T - Math.min(T - 2, y * 0.8)).toFixed(1)}px)`).join(", ") + ")";
  return { paper: poly(top), core: poly(core) };
}
