/**
 * A torn-paper seam. `fill` is the paper ABOVE the seam; it hangs down over whatever is below it with a ragged, fibrous edge:
 * big slow bites, medium chips and fine fray (layered seeded noise), a pale paper-core rim showing where the sheet tore
 * (real torn paper is white along the break), a few loose fibres, and a soft shadow under it. `after` puts it just below its
 * container instead of inside the top of it.
 */
const W = 1200, H = 34;
function noise(seed: number) {
  const v = (i: number) => { let t = (Math.imul(i ^ seed, 0x45d9f3b) ^ (i >>> 3)) >>> 0; t = Math.imul(t ^ (t >>> 15), 0x2c1b3c6d) >>> 0; return ((t ^ (t >>> 12)) >>> 0) / 4294967296; };
  return (x: number) => { const i = Math.floor(x), f = x - i, s = f * f * (3 - 2 * f); return v(i) * (1 - s) + v(i + 1) * s; };
}
function edge(seed: number, base: number) {
  const a = noise(seed), b = noise(seed + 11), c = noise(seed + 23), d = noise(seed + 37);
  const pts: [number, number][] = [];
  for (let x = 0; x <= W; x += 2.5) pts.push([x, base + a(x / 150) * 7 + b(x / 38) * 4.5 + c(x / 9) * 2.6 + d(x / 2.6) * 1.1]);
  return pts;
}
const line = (pts: [number, number][]) => pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");
const top = edge(5, 12), core = edge(41, 16.5);
const PAPER = `M0 0 H${W} V${top[top.length - 1][1].toFixed(1)} L${line([...top].reverse())} Z`;
const CORE = `M0 0 H${W} V${core[core.length - 1][1].toFixed(1)} L${line([...core].reverse())} Z`;
/* a handful of loose fibres hanging off the tear */
const FIBRES = (() => {
  const r = noise(99), out: string[] = [];
  for (let i = 0; i < 46; i++) { const x = 20 + r(i * 3.7) * (W - 40), k = Math.min(top.length - 1, Math.round(x / 2.5)), y = top[k][1] + 1; out.push(`M${x.toFixed(1)} ${y.toFixed(1)} q${(r(i + 50) * 6 - 3).toFixed(1)} ${(3 + r(i + 90) * 4).toFixed(1)} ${(r(i + 20) * 8 - 4).toFixed(1)} ${(5 + r(i + 70) * 5).toFixed(1)}`); }
  return out.join(" ");
})();

export function TornEdge({ fill, after = false, className = "" }: { fill: string; after?: boolean; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={`pointer-events-none absolute inset-x-0 z-10 h-[26px] w-full sm:h-[34px] ${after ? "top-full" : "top-0"} ${className}`} style={{ filter: "drop-shadow(0 3px 2.5px rgba(40,25,10,.3))" }}>
      <path d={CORE} fill="#FFFDF6" />
      <path d={FIBRES} fill="none" stroke="#FFFDF6" strokeWidth={0.9} strokeLinecap="round" opacity={0.85} />
      <path d={PAPER} fill={fill} />
    </svg>
  );
}
