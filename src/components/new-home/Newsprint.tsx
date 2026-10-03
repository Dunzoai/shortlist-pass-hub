/**
 * The vintage newspaper that sits BEHIND the film card: loose pages of "The Shortlist Gazette" drawn in the site's cut-paper style
 * (hand-cut sheets, hard soft shadows, grain, text as rows of paper strips, little paper pictures). It fills the film section and the
 * card sits on top of it, covering the middle. Decorative only. The SVG is cropped to the section (`slice`), so the masthead sits
 * top-centre and the pages hang off both sides and the bottom, which is what a phone's narrow crop still shows.
 */
const PRINT = "#3a3026";
const SERIF = "var(--font-fraunces), Georgia, serif";
const GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export const NEWSPRINT = "#E7DCBF";

const rnd = (seed: number) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
/** A rectangle with scissor-cut edges. */
function cut(x: number, y: number, w: number, h: number, seed: number, j = 2.2) {
  const r = rnd(seed), pts: [number, number][] = [];
  const side = (x0: number, y0: number, x1: number, y1: number) => {
    const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / 60));
    for (let i = 0; i < n; i++) pts.push([x0 + ((x1 - x0) * i) / n + (r() - 0.5) * j, y0 + ((y1 - y0) * i) / n + (r() - 0.5) * j]);
  };
  side(x, y, x + w, y); side(x + w, y, x + w, y + h); side(x + w, y + h, x, y + h); side(x, y + h, x, y);
  return "M" + pts.map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join(" L") + " Z";
}
function Sheet({ d, fill, dx = 7, dy = 9, grain = 0.28 }: { d: string; fill: string; dx?: number; dy?: number; grain?: number }) {
  return (
    <g>
      <path d={d} fill="rgba(45,30,12,.32)" transform={`translate(${dx} ${dy})`} />
      <path d={d} fill="rgba(45,30,12,.14)" transform={`translate(${dx / 2} ${dy / 2})`} />
      <path d={d} fill={fill} />
      <path d={d} fill="url(#np-wash)" />
      <path d={d} fill="url(#np-grain)" opacity={grain} style={{ mixBlendMode: "multiply" }} />
    </g>
  );
}
/** Body copy as rows of thin paper strips. */
function Strips({ x, y, w, rows, seed, gap = 15 }: { x: number; y: number; w: number; rows: number; seed: number; gap?: number }) {
  const r = rnd(seed);
  return (
    <g>
      {Array.from({ length: rows }, (_, i) => {
        const ww = (i === rows - 1 ? 0.5 : 0.84 + r() * 0.16) * w;
        return <g key={i}><rect x={x + 1.5} y={y + i * gap + 2} width={ww} height={6.5} rx={2.5} fill="rgba(45,30,12,.2)" /><rect x={x} y={y + i * gap} width={ww} height={6.5} rx={2.5} fill={PRINT} opacity={0.62} /></g>;
      })}
    </g>
  );
}
const Head = ({ x, y, lines, size = 25 }: { x: number; y: number; lines: string[]; size?: number }) => (
  <g style={{ fontFamily: SERIF, fontWeight: 900, fill: PRINT, fontSize: size, letterSpacing: "-0.01em" }}>
    {lines.map((l, i) => <text key={l} x={x} y={y + i * (size + 3)}>{l}</text>)}
  </g>
);

/** A cut-paper picture: a frame with pieces layered inside, then a faint print-tint over it. */
function Frame({ x, y, w, h, seed, children }: { x: number; y: number; w: number; h: number; seed: number; children: React.ReactNode }) {
  const id = `np-f${seed}`;
  return (
    <g>
      <Sheet d={cut(x - 5, y - 5, w + 10, h + 10, seed, 1.2)} fill="#F4ECD6" dx={3} dy={4} />
      <clipPath id={id}><rect x={x} y={y} width={w} height={h} /></clipPath>
      <g clipPath={`url(#${id})`}>{children}</g>
      <rect x={x} y={y} width={w} height={h} fill="#8a6a3a" opacity={0.12} style={{ mixBlendMode: "multiply" }} />
    </g>
  );
}

export function NewsBackdrop() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full select-none">
      <defs>
        <pattern id="np-grain" patternUnits="userSpaceOnUse" width="160" height="160"><image href={GRAIN_URL} width="160" height="160" /></pattern>
        <linearGradient id="np-wash" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".4" /><stop offset=".55" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#6b5a3a" stopOpacity=".12" /></linearGradient>
      </defs>
      <rect width="1200" height="560" fill={NEWSPRINT} />
      <rect width="1200" height="560" fill="url(#np-grain)" opacity={0.22} style={{ mixBlendMode: "multiply" }} />

      {/* left page: the bakery, with a picture of the shop */}
      <g transform="rotate(-2 170 330)">
        <Sheet d={cut(-30, 110, 400, 480, 11)} fill="#EFE5CB" />
        <Head x={14} y={176} lines={["CORNER BAKERY", "HIRES SHORTY"]} />
        <rect x={14} y={224} width={300} height={3} fill={PRINT} opacity={0.55} />
        <Strips x={14} y={244} w={316} rows={4} seed={3} />
        <Frame x={14} y={322} w={316} h={110} seed={31}>
          <rect x={14} y={322} width={316} height={110} fill="#B9D3DC" />
          <circle cx={278} cy={350} r={24} fill="#F0C65C" />
          <rect x={14} y={398} width={316} height={40} fill="#D9C79A" />
          <rect x={80} y={352} width={160} height={52} fill="#D9946A" />
          <path d="M72 352 H248 L238 334 H82 Z" fill="#C8624A" />
          <rect x={146} y={368} width={28} height={40} fill="#8A5A3A" />
          <rect x={94} y={366} width={34} height={22} fill="#FBF2DA" /><rect x={192} y={366} width={34} height={22} fill="#FBF2DA" />
        </Frame>
        <Strips x={14} y={452} w={316} rows={4} seed={8} />
      </g>

      {/* right page: AI agents, with the Shortlist mark */}
      <g transform="rotate(1.8 1030 330)">
        <Sheet d={cut(840, 100, 400, 490, 17)} fill="#EEE3C7" />
        <Head x={880} y={166} lines={["AI AGENTS", "HAVE ARRIVED"]} />
        <rect x={880} y={214} width={290} height={3} fill={PRINT} opacity={0.55} />
        <Frame x={880} y={234} w={290} h={110} seed={43}>
          <rect x={880} y={234} width={290} height={110} fill="#9EC3A8" />
          <circle cx={1120} cy={262} r={20} fill="#F0C65C" />
          <path d="M880 344 V312 Q1025 262 1170 312 V344 Z" fill="#8DB89A" />
          <image href="/shortlist-mint-mark.png" x={977} y={246} width={96} height={96} />
        </Frame>
        <Strips x={880} y={366} w={290} rows={5} seed={5} />
        <Strips x={880} y={460} w={290} rows={4} seed={9} />
      </g>

      {/* the masthead, laid across the top of both pages */}
      <g transform="rotate(-0.5 600 76)">
        <Sheet d={cut(230, 22, 740, 112, 23)} fill="#F3EAD2" dx={6} dy={8} />
        <rect x={262} y={36} width={676} height={3} fill={PRINT} opacity={0.55} /><rect x={262} y={43} width={676} height={1.6} fill={PRINT} opacity={0.55} />
        <text x={600} y={95} textAnchor="middle" style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 58, fill: PRINT, letterSpacing: "-0.01em" }}>THE SHORTLIST GAZETTE</text>
        <rect x={262} y={106} width={676} height={1.6} fill={PRINT} opacity={0.55} /><rect x={262} y={112} width={676} height={3} fill={PRINT} opacity={0.55} />
        <text x={262} y={128} style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 10.5, fill: PRINT, letterSpacing: "0.18em" }}>VOL. 1 · NO. 1</text>
        <text x={938} y={128} textAnchor="end" style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 10.5, fill: PRINT, letterSpacing: "0.18em" }}>EST. 2026</text>
      </g>

      {/* bottom: a lower strip of the front page */}
      <g transform="rotate(0.6 600 520)">
        <Sheet d={cut(330, 468, 540, 150, 29)} fill="#EBDFC2" />
        <Head x={362} y={506} lines={["OPEN AROUND THE CLOCK"]} size={20} />
        <Strips x={362} y={524} w={230} rows={3} seed={13} />
        <Strips x={614} y={524} w={230} rows={3} seed={19} />
      </g>
    </svg>
  );
}
