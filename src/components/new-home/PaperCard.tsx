/**
 * A loose sheet of paper: a hand-cut edge (seeded, so server and client agree), a soft double shadow, a light/deep wash and grain,
 * set a hair off-square. Used where a card should sit on the page as its own piece of paper.
 */
const GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export function cutPath(w: number, h: number, seed: number, r = 14, step = 9, amp = 1.7) {
  let a = seed;
  const rnd = () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const wob = (i: number) => (rnd() - 0.5) * amp * 1.6 + Math.sin(i * 0.41 + seed) * amp * 0.7;
  const pts: string[] = [], f = (n: number) => n.toFixed(1);
  let i = 0;
  const corner = (cx: number, cy: number, a0: number) => { for (let k = 0; k <= 3; k++) { const ang = a0 + (k / 3) * (Math.PI / 2); pts.push(`${f(cx + Math.cos(ang) * r + wob(i++) * 0.4)} ${f(cy + Math.sin(ang) * r + wob(i++) * 0.4)}`); } };
  for (let x = r; x < w - r; x += step) pts.push(`${f(x)} ${f(wob(i++))}`);
  corner(w - r, r, -Math.PI / 2);
  for (let y = r; y < h - r; y += step) pts.push(`${f(w + wob(i++))} ${f(y)}`);
  corner(w - r, h - r, 0);
  for (let x = w - r; x > r; x -= step) pts.push(`${f(x)} ${f(h + wob(i++))}`);
  corner(r, h - r, Math.PI / 2);
  for (let y = h - r; y > r; y -= step) pts.push(`${f(wob(i++))} ${f(y)}`);
  corner(r, r, Math.PI);
  return `M${pts.join("L")}Z`;
}
const CACHE = new Map<number, string>();
const path = (seed: number) => CACHE.get(seed) ?? (CACHE.set(seed, cutPath(400, 300, seed)), CACHE.get(seed)!);

export function PaperCard({ seed, fill = "#FBF6E6", tilt = 0, shadow = "rgba(0,0,0,.5)", className = "", children }: { seed: number; fill?: string; tilt?: number; shadow?: string; className?: string; children: React.ReactNode }) {
  const d = path(seed), id = `pc-${seed}`;
  return (
    <div className={`relative ${className}`} style={{ rotate: `${tilt}deg` }}>
      <svg aria-hidden="true" focusable="false" viewBox="-12 -12 424 330" preserveAspectRatio="none" className="pointer-events-none absolute -inset-[6px] h-[calc(100%+12px)] w-[calc(100%+12px)] overflow-visible">
        <defs>
          <linearGradient id={`${id}-w`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".45" /><stop offset=".55" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#6b5a3a" stopOpacity=".14" /></linearGradient>
          <pattern id={`${id}-g`} patternUnits="userSpaceOnUse" width="80" height="80"><image href={GRAIN_URL} width="80" height="80" /></pattern>
        </defs>
        <path d={d} transform="translate(8 10)" fill={shadow} />
        <path className="pc-sheet" d={d} fill={fill} stroke="rgba(110,85,45,.3)" strokeWidth={1.6} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        <path d={d} fill={`url(#${id}-w)`} />
        <path d={d} fill={`url(#${id}-g)`} opacity={0.3} style={{ mixBlendMode: "multiply" }} />
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}
