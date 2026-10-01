/**
 * Faint hand-sketched scenes behind Shorty: whoever just texted, he's standing in
 * their shop. Same ink as Shorty, very light, with a slight line wobble, and
 * faded out toward the edges. Two drawn so far (taco truck, salon) as a style
 * test; a business without a scene shows the plain cream.
 */
const INK = { fill: "none", stroke: "#1d1a16", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function TacoTruck() {
  const scallops = Array.from({ length: 10 }, (_, i) => `q8.5 11 17 0`).join(" ");
  const bulbs = [30, 70, 110, 150, 190, 230, 270, 310, 350, 390];
  /* y on the light string (two quadratic swags) at x */
  const q = (a: number, c: number, b: number, t: number) => (1 - t) ** 2 * a + 2 * t * (1 - t) * c + t * t * b;
  const lightY = (x: number) => (x < 210 ? q(30, 60, 35, x / 210) : q(35, 60, 30, (x - 210) / 210));
  return (
    <g {...INK}>
      <path d="M0 30 Q105 60 210 35 Q315 60 420 30" strokeWidth={1.6} />
      {bulbs.map((x) => (
        <g key={x}>
          <path d={`M${x} ${lightY(x)} v5`} strokeWidth={1.4} />
          <ellipse cx={x} cy={lightY(x) + 10} rx={3.6} ry={5} strokeWidth={1.6} />
        </g>
      ))}
      <path d="M8 236 H412" />
      <path d="M70 224 V96 Q70 82 85 82 H298 Q316 82 328 100 L364 150 Q372 160 372 172 V224 Z" />
      <path d="M304 100 L334 146 H304 Z" />
      <path d="M105 112 H255 V170 H105 Z" />
      <path d="M97 172 H263 V179 H97 Z" />
      <path d={`M95 110 L106 92 H254 L265 110 M95 110 ${scallops}`} />
      <path d="M150 82 Q150 58 180 58 Q210 58 210 82 M166 82 V73 M194 82 V73 M162 70 Q180 62 198 70" />
      <circle cx={120} cy={224} r={20} /> <circle cx={120} cy={224} r={6} />
      <circle cx={312} cy={224} r={20} /> <circle cx={312} cy={224} r={6} />
      <path d="M120 140 h18 M120 150 h28 M180 128 q12 -10 24 0 M228 140 v22" strokeWidth={1.6} />
      <path d="M22 236 L36 182 H64 L78 236 M41 196 H59 M39 207 H61 M37 218 H63" />
    </g>
  );
}

function Salon() {
  return (
    <g {...INK}>
      <path d="M8 236 H412 M8 222 H412" strokeWidth={1.4} />
      <circle cx={210} cy={86} r={56} /> <circle cx={210} cy={86} r={48} strokeWidth={1.4} />
      <path d="M186 64 q10 -10 22 -8" strokeWidth={1.4} />
      <path d="M170 170 V116 Q170 104 182 104 H238 Q250 104 250 116 V170" />
      <path d="M156 172 H264 Q270 172 270 178 V186 H150 V178 Q150 172 156 172 Z" />
      <path d="M146 160 H172 M248 160 H274 M210 186 V222 M182 206 H238" />
      <path d="M174 229 Q210 218 246 229 Q210 238 174 229 Z" />
      <path d="M58 236 V152 M40 236 H76 M28 152 Q28 110 58 108 Q92 110 92 152 Z M34 140 H86" />
      <path d="M302 122 H384 M310 122 V102 H322 V122 M330 122 V96 Q336 88 342 96 V122 M352 122 V106 H364 V122 M370 122 V98 H378 V122" />
      <path d="M330 236 L336 206 H366 L372 236 Z M351 206 Q340 188 328 184 M351 206 Q352 182 364 172 M351 206 Q364 194 380 194" />
      <circle cx={46} cy={58} r={6} /> <circle cx={46} cy={78} r={6} />
      <path d="M51 61 L84 74 M51 75 L84 62" />
    </g>
  );
}

export const SCENES: Record<string, () => React.JSX.Element> = {
  "Low Tide Tacos": TacoTruck,
  "Salt & Shear Salon": Salon,
};

/** All scenes stacked; the current business's fades in, the rest fade out. */
export function ShortyScenes({ biz, show }: { biz: string; show: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-[-8%] bottom-0 h-[115%] [mask-image:radial-gradient(ellipse_at_50%_70%,black_35%,transparent_72%)]"
    >
      <svg viewBox="0 0 420 260" preserveAspectRatio="xMidYMax meet" className="absolute inset-0 h-full w-full">
        <defs>
          <filter id="scene-wobble" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={4} />
            <feDisplacementMap in="SourceGraphic" scale={2.4} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        {Object.entries(SCENES).map(([name, Scene]) => (
          <g
            key={name}
            filter="url(#scene-wobble)"
            className="transition-opacity duration-700"
            style={{ opacity: show && name === biz ? 0.16 : 0 }}
          >
            <Scene />
          </g>
        ))}
      </svg>
    </div>
  );
}
