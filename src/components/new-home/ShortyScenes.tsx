/**
 * Cut-paper scenes behind Shorty: whoever just texted, he's standing in their
 * world. Each layer is a piece of colored paper (torn edge, grain, a soft
 * shadow under it), stacked back to front, with a little ink on top. Each
 * scene has a mood: the taco truck at golden hour, the salon in Saturday-
 * morning light. A business without a scene shows the plain cream.
 */
import type { ReactNode } from "react";

const INK = { fill: "none", stroke: "#2a2219", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/** One sheet of paper: torn edges, grain, a shadow, a hair of tilt. */
function Paper({ rot = 0, at = [210, 130], children }: { rot?: number; at?: [number, number]; children: ReactNode }) {
  return (
    <g filter="url(#paper)" transform={`rotate(${rot} ${at[0]} ${at[1]})`}>
      {children}
    </g>
  );
}

function TacoTruck() {
  const q = (a: number, c: number, b: number, t: number) => (1 - t) ** 2 * a + 2 * t * (1 - t) * c + t * t * b;
  const lightY = (x: number) => (x < 210 ? q(26, 58, 32, x / 210) : q(32, 58, 26, (x - 210) / 210));
  const bulbs = [28, 66, 104, 142, 180, 218, 256, 294, 332, 370, 400];
  const scallops = Array.from({ length: 10 }, () => "q-8.5 11 -17 0").join(" ");
  return (
    <>
      {/* golden-hour sky and the sun going down behind the pond */}
      <Paper rot={-1.2}>
        <path d="M24 232 C6 150 34 34 150 24 C262 14 404 44 398 150 C395 200 384 232 384 232 Z" fill="#f7cfa4" />
      </Paper>
      <Paper rot={1}>
        <circle cx={318} cy={104} r={50} fill="#f19a63" />
      </Paper>
      <Paper rot={-0.6}>
        <path d="M14 206 Q80 160 150 190 T290 178 T410 194 V236 H14 Z" fill="#9fbccb" />
      </Paper>
      <Paper rot={0.4}>
        <path d="M8 220 Q210 210 412 220 V242 H8 Z" fill="#e2b585" />
      </Paper>

      {/* the truck */}
      <Paper rot={-0.8} at={[220, 160]}>
        <path d="M70 224 V96 Q70 82 85 82 H298 Q316 82 328 100 L364 150 Q372 160 372 172 V224 Z" fill="#df7458" />
        <path d="M304 100 L334 146 H304 Z" fill="#fbf3dc" />
        <path d="M105 112 H255 V170 H105 Z" fill="#fbf3dc" />
        <path d="M97 172 H263 V180 H97 Z" fill="#b9523b" />
        <path d="M150 82 Q150 58 180 58 Q210 58 210 82 Z" fill="#f2c94c" />
      </Paper>
      <Paper rot={0.6} at={[180, 100]}>
        <path d={`M95 110 L106 92 H254 L265 110 ${scallops} Z`} fill="#f2c94c" />
        <path d="M130 92 L124 110 h17 L146 92 Z M180 92 v18 h17 V92 Z M214 92 L218 110 h17 L230 92 Z" fill="#fbf3dc" />
      </Paper>
      <Paper>
        <circle cx={120} cy={224} r={20} fill="#2b2620" /> <circle cx={120} cy={224} r={7} fill="#e9dcc4" />
        <circle cx={312} cy={224} r={20} fill="#2b2620" /> <circle cx={312} cy={224} r={7} fill="#e9dcc4" />
        <path d="M22 236 L36 182 H64 L78 236 Z" fill="#fbf3dc" />
      </Paper>

      {/* ink on top: menu chalk, the sign, the string of lights glowing */}
      <g {...INK}>
        <path d="M41 196 H59 M39 207 H61 M37 218 H63 M120 140 h18 M120 150 h28 M162 70 Q180 62 198 70" />
        <path d="M0 26 Q105 58 210 32 Q315 58 420 26" />
      </g>
      {bulbs.map((x) => (
        <g key={x}>
          <circle cx={x} cy={lightY(x) + 9} r={9} fill="#ffd27a" opacity={0.45} filter="url(#glow)" />
          <path d={`M${x} ${lightY(x)} v4`} {...INK} strokeWidth={1.2} />
          <ellipse cx={x} cy={lightY(x) + 9} rx={3.4} ry={4.6} fill="#ffe08a" stroke="#2a2219" strokeWidth={1.2} />
        </g>
      ))}
    </>
  );
}

function Salon() {
  return (
    <>
      {/* a lilac wall, morning sun coming through */}
      <Paper rot={1}>
        <path d="M22 232 C8 140 30 30 160 22 C290 14 410 52 400 156 C396 204 386 232 386 232 Z" fill="#d8c6ec" />
      </Paper>
      <Paper rot={-2} at={[120, 80]}>
        <path d="M40 20 L130 20 L250 232 L120 232 Z" fill="#fbe7a6" opacity={0.85} />
      </Paper>
      <Paper rot={-0.5}>
        <path d="M8 218 Q210 208 412 218 V242 H8 Z" fill="#f2cfc4" />
      </Paper>

      {/* the gold mirror */}
      <Paper rot={1.5} at={[210, 86]}>
        <circle cx={210} cy={86} r={58} fill="#e8b84a" />
        <circle cx={210} cy={86} r={47} fill="#cfe2ec" />
      </Paper>

      {/* the chair, the dryer, the shelf, the plant */}
      <Paper rot={-0.8} at={[210, 170]}>
        <path d="M170 172 V116 Q170 104 182 104 H238 Q250 104 250 116 V172 Z" fill="#ef9fb1" />
        <path d="M150 172 H270 V188 H150 Z" fill="#e2869c" />
        <path d="M204 188 H216 V222 H204 Z M174 229 Q210 216 246 229 Q210 240 174 229 Z" fill="#8f8a83" />
      </Paper>
      <Paper rot={1.2} at={[60, 170]}>
        <path d="M28 152 Q28 108 60 106 Q94 108 94 152 Z" fill="#9bb7da" />
        <path d="M56 152 H64 V236 H56 Z M38 232 H82 V238 H38 Z" fill="#8f8a83" />
      </Paper>
      <Paper rot={-1} at={[340, 110]}>
        <path d="M298 120 H386 V126 H298 Z" fill="#c99a6b" />
        <path d="M310 120 V100 H322 V120 Z" fill="#f2c94c" />
        <path d="M330 120 V96 Q336 88 342 96 V120 Z" fill="#9bb7da" />
        <path d="M352 120 V104 H364 V120 Z" fill="#ef9fb1" />
        <path d="M370 120 V98 H378 V120 Z" fill="#fbf3dc" />
      </Paper>
      <Paper rot={2} at={[352, 210]}>
        <path d="M351 206 Q332 186 316 186 Q330 204 351 206 Z M351 206 Q350 178 366 166 Q368 190 351 206 Z M351 206 Q366 190 386 192 Q372 208 351 206 Z" fill="#6f8f5b" />
        <path d="M330 236 L336 206 H366 L372 236 Z" fill="#d9825b" />
      </Paper>

      {/* ink on top */}
      <g {...INK}>
        <path d="M186 62 q10 -10 22 -8 M190 72 q6 -6 13 -5" stroke="#fbfdff" strokeWidth={2.2} />
        <path d="M34 140 H86 M182 206 H238" />
        <circle cx={46} cy={56} r={6} /> <circle cx={46} cy={76} r={6} />
        <path d="M51 59 L84 72 M51 73 L84 60" />
      </g>
    </>
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
      className="pointer-events-none absolute inset-x-[-10%] bottom-0 h-[118%] [mask-image:radial-gradient(ellipse_62%_70%_at_50%_62%,black_60%,transparent_100%)]"
    >
      <svg viewBox="0 0 420 260" preserveAspectRatio="xMidYMax meet" className="absolute inset-0 h-full w-full">
        <defs>
          <filter id="paper" x="-8%" y="-8%" width="116%" height="120%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={2} seed={7} result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale={3.5} xChannelSelector="R" yChannelSelector="G" result="torn" />
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} result="fine" />
            <feColorMatrix in="fine" type="matrix" values="0 0 0 0 0.16  0 0 0 0 0.12  0 0 0 0 0.08  0.55 0 0 0 -0.2" result="specks" />
            <feComposite in="specks" in2="torn" operator="in" result="grain" />
            <feMerge result="sheet"><feMergeNode in="torn" /><feMergeNode in="grain" /></feMerge>
            <feDropShadow in="sheet" dx={1.6} dy={2.6} stdDeviation={1.4} floodColor="#3a2a12" floodOpacity={0.22} />
          </filter>
          <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation={4} />
          </filter>
        </defs>
        {Object.entries(SCENES).map(([name, Scene]) => (
          <g key={name} className="transition-opacity duration-700" style={{ opacity: show && name === biz ? 1 : 0 }}>
            <Scene />
          </g>
        ))}
      </svg>
    </div>
  );
}
