import { SCENES } from "@/components/new-home/ShortyScenes";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";

/**
 * The picture at the top of the page: a busy food truck in the homepage hero's cut-paper style (the same scene and the same
 * paper filter, with a line of customers at the window), and Shorty off to the side, smiling, his phone in his hand. Still,
 * not animated. Same composition on a desktop and on a phone.
 */
const INK = "#2a2219";
const PEOPLE: { x: number; h: number; body: string; skin: string; phone?: boolean }[] = [
  { x: 118, h: 33, body: "#6b8fa8", skin: "#e8b98f", phone: true },
  { x: 142, h: 29, body: "#c9704f", skin: "#8d5a3b" },
  { x: 166, h: 35, body: "#7a9a63", skin: "#f0c9a0", phone: true },
  { x: 192, h: 30, body: "#8a6fa8", skin: "#c68a62" },
  { x: 218, h: 34, body: "#d9a441", skin: "#dba37a" },
];

function Queue() {
  return (
    <g filter="url(#paper)">
      {PEOPLE.map((p, i) => {
        const top = 236 - p.h;
        return (
          <g key={i}>
            <path d={`M${p.x - 7} 236 V${top + 12} Q${p.x - 7} ${top + 6} ${p.x} ${top + 6} Q${p.x + 7} ${top + 6} ${p.x + 7} ${top + 12} V236 Z`} fill={p.body} stroke={INK} strokeWidth={1.3} strokeLinejoin="round" />
            <circle cx={p.x} cy={top} r={6.2} fill={p.skin} stroke={INK} strokeWidth={1.3} />
            {p.phone && <rect x={p.x + 5} y={top + 10} width={5} height={8} rx={1.2} fill="#34d399" stroke={INK} strokeWidth={1} />}
          </g>
        );
      })}
    </g>
  );
}

export function HeroScene() {
  const Scene = SCENES["Low Tide Tacos"];
  return (
    <div className="relative mx-auto w-full max-w-[560px]" role="img" aria-label="A busy food truck at golden hour, with Shorty off to the side smiling, his phone in his hand">
      <div className="[mask-image:radial-gradient(ellipse_74%_82%_at_50%_58%,black_62%,transparent_100%)]">
        <svg viewBox="0 0 420 260" className="block h-auto w-full" aria-hidden="true">
          <defs>
            <filter id="paper" x="-8%" y="-8%" width="116%" height="120%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={2} seed={7} result="warp" />
              <feDisplacementMap in="SourceGraphic" in2="warp" scale={3.5} xChannelSelector="R" yChannelSelector="G" result="torn" />
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} result="fine" />
              <feColorMatrix in="fine" type="matrix" values="0 0 0 0 0.16  0 0 0 0 0.12  0 0 0 0 0.08  0.32 0 0 0 -0.13" result="specks" />
              <feComposite in="specks" in2="torn" operator="in" result="grain" />
              <feMerge result="sheet"><feMergeNode in="torn" /><feMergeNode in="grain" /></feMerge>
              <feDropShadow in="sheet" dx={1.6} dy={2.6} stdDeviation={1.4} floodColor="#3a2a12" floodOpacity={0.22} />
            </filter>
            <filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation={4} /></filter>
          </defs>
          <Scene />
          <Queue />
        </svg>
      </div>
      {/* Shorty, off to the side: the rig drawn once, smiling, phone in his glove */}
      <div className="pointer-events-none absolute -bottom-1 right-[-2%] hidden md:block">
        <ShortyMascot mood="pleased" holdPhone still size={190} />
      </div>
      <div className="pointer-events-none absolute -bottom-1 right-[-3%] md:hidden">
        <ShortyMascot mood="pleased" holdPhone still size={130} />
      </div>
    </div>
  );
}
