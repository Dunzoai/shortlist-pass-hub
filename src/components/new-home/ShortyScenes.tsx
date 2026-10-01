/**
 * Cut-paper scenes behind Shorty: whoever just texted, he's standing in their
 * world. Each layer is a piece of colored paper (torn edge, grain, a soft
 * shadow under it), stacked back to front, with a little ink on top. Each
 * scene has a mood (the taco truck at golden hour, the taproom on trivia
 * night...). A business without a scene shows the plain cream.
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
          <circle cx={x} cy={lightY(x) + 9} r={11} fill="#ffcf66" opacity={0.7} filter="url(#glow)" />
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
        <circle cx={82} cy={78} r={6} /> <circle cx={82} cy={98} r={6} />
        <path d="M87 81 L120 94 M87 95 L120 82" />
      </g>
    </>
  );
}

function NitosKitchen() {
  return (
    <>
      {/* Friday night in the kitchen: warm tile, a pendant lamp, the street dark outside */}
      <Paper rot={-1}>
        <path d="M22 232 C6 140 34 30 160 22 C292 14 410 50 400 156 C396 204 386 232 386 232 Z" fill="#eaa486" />
      </Paper>
      <Paper rot={1.2} at={[318, 80]}>
        <path d="M270 40 H368 V122 H270 Z" fill="#2f3d5c" />
        <circle cx={342} cy={64} r={11} fill="#f6e3a8" />
      </Paper>
      <Paper rot={-0.5}>
        <path d="M6 170 H414 V240 H6 Z" fill="#8a5a3b" />
        <path d="M6 166 H414 V178 H6 Z" fill="#a8744e" />
      </Paper>
      <Paper rot={0.8} at={[70, 70]}>
        <circle cx={48} cy={78} r={20} fill="#3b3430" /> <path d="M48 58 V40" stroke="#3b3430" strokeWidth={5} />
        <circle cx={96} cy={86} r={15} fill="#4a413b" /> <path d="M96 71 V40" stroke="#4a413b" strokeWidth={5} />
      </Paper>
      <Paper rot={-1.4} at={[200, 60]}>
        <path d="M150 52 H252 V58 H150 Z" fill="#c9c2b5" />
        <path d="M158 58 H180 V84 H158 Z" fill="#fbf3dc" />
        <path d="M190 58 H210 V80 H190 Z" fill="#fbf3dc" />
        <path d="M220 58 H244 V88 H220 Z" fill="#fbf3dc" />
      </Paper>
      <Paper rot={1} at={[300, 160]}>
        <ellipse cx={312} cy={166} rx={52} ry={9} fill="#fbf3dc" />
        <path d="M276 162 Q290 140 306 162 Z M300 160 Q316 136 334 160 Z M322 163 Q338 142 352 163 Z" fill="#e8b25a" />
      </Paper>
      <Paper rot={-1} at={[120, 30]}>
        <path d="M110 0 V22" stroke="#2a2219" strokeWidth={2} />
        <path d="M96 40 L104 22 H116 L124 40 Z" fill="#f2c94c" />
      </Paper>
      <circle cx={110} cy={52} r={22} fill="#ffd27a" opacity={0.5} filter="url(#glow)" />
      <g {...INK}>
        <path d="M14 100 H140 M14 130 H140 M40 100 V130 M90 100 V130 M65 130 V160 M115 130 V160 M14 160 H140" strokeWidth={1.1} opacity={0.5} />
        <path d="M164 66 h10 M164 72 h8 M196 66 h8 M226 66 h12 M226 72 h8" strokeWidth={1.1} />
        <path d="M282 160 l3 -3 l3 3 l3 -3 l3 3 M306 158 l3 -3 l3 3 l3 -3 l3 3 M328 161 l3 -3 l3 3 l3 -3 l3 3" strokeWidth={1.1} />
      </g>
    </>
  );
}

function CoastalPlumbing() {
  return (
    <>
      {/* an early call by the water: pale sky, low sun, the van, copper pipe */}
      <Paper rot={1}>
        <path d="M22 232 C6 140 34 30 160 22 C292 14 410 50 400 156 C396 204 386 232 386 232 Z" fill="#bfdbe8" />
      </Paper>
      <Paper rot={-1} at={[80, 70]}>
        <circle cx={82} cy={70} r={30} fill="#f6d58b" />
      </Paper>
      <Paper rot={0.6}>
        <path d="M10 150 Q110 140 210 150 T410 150 V200 H10 Z" fill="#6fa7c4" />
      </Paper>
      <Paper rot={-0.4}>
        <path d="M8 196 Q210 186 412 196 V242 H8 Z" fill="#ead9b8" />
      </Paper>
      <Paper rot={-0.8} at={[300, 180]}>
        <path d="M210 214 V126 Q210 112 224 112 H340 Q360 112 372 132 L392 170 V214 Z" fill="#f6f1e6" />
        <path d="M210 168 H392 V182 H210 Z" fill="#3f78a8" />
        <path d="M346 120 L370 160 H346 Z" fill="#bfdbe8" />
        <path d="M222 104 H330 V110 H222 Z M232 98 V110 M260 98 V110 M288 98 V110 M316 98 V110" fill="#8f8a83" stroke="#8f8a83" strokeWidth={3} />
        <circle cx={250} cy={214} r={17} fill="#2b2620" /> <circle cx={250} cy={214} r={6} fill="#e9dcc4" />
        <circle cx={358} cy={214} r={17} fill="#2b2620" /> <circle cx={358} cy={214} r={6} fill="#e9dcc4" />
      </Paper>
      <Paper rot={1.5} at={[60, 190]}>
        <path d="M20 240 V176 Q20 160 36 160 H86 Q102 160 102 144 V120 H118 V146 Q118 176 88 176 H38 V240 Z" fill="#d08a52" />
        <path d="M14 150 H40 V162 H14 Z" fill="#b8733f" />
      </Paper>
      <Paper rot={-2} at={[160, 210]}>
        <path d="M134 206 H190 V236 H134 Z" fill="#d9534f" />
        <path d="M150 206 V198 H174 V206" fill="none" stroke="#2a2219" strokeWidth={3} />
      </Paper>
      <g {...INK}>
        <path d="M150 52 q6 -6 12 0 q6 -6 12 0 M196 40 q5 -5 10 0 q5 -5 10 0" />
        <path d="M30 164 q12 -5 24 0 t24 0 M260 160 q12 -5 24 0 t24 0" opacity={0.6} />
        <path d="M262 150 H330" strokeWidth={1.2} />
      </g>
    </>
  );
}

function RiseBakery() {
  return (
    <>
      {/* 5 a.m., first batch out: dawn in the window, bread in the case */}
      <Paper rot={-1}>
        <path d="M22 232 C6 140 34 30 160 22 C292 14 410 50 400 156 C396 204 386 232 386 232 Z" fill="#f4c7b6" />
      </Paper>
      <Paper rot={1} at={[300, 70]}>
        <path d="M250 30 H370 V112 H250 Z" fill="#f7b27e" />
        <circle cx={310} cy={112} r={28} fill="#fbe28f" />
        <path d="M250 106 H370 V116 H250 Z" fill="#c98b62" />
      </Paper>
      <Paper rot={0.5} at={[80, 70]}>
        <path d="M40 40 H128 V104 H40 Z" fill="#3d4540" />
      </Paper>
      <Paper rot={-0.6}>
        <path d="M6 150 H414 V242 H6 Z" fill="#c99a6b" />
      </Paper>
      <Paper rot={0.4} at={[220, 160]}>
        <path d="M150 124 H400 V200 H150 Z" fill="#e7efec" />
        <path d="M150 158 H400 V164 H150 Z" fill="#c99a6b" />
      </Paper>
      <Paper rot={-0.8} at={[270, 140]}>
        <ellipse cx={180} cy={150} rx={18} ry={8} fill="#d9a05b" />
        <ellipse cx={220} cy={150} rx={18} ry={8} fill="#cf9550" />
        <path d="M258 156 Q270 136 286 156 Q272 150 258 156 Z M296 156 Q308 136 324 156 Q310 150 296 156 Z" fill="#e2a54e" />
        <ellipse cx={356} cy={150} rx={20} ry={8} fill="#d9a05b" />
        <circle cx={186} cy={188} r={9} fill="#f0b8c6" /> <circle cx={210} cy={188} r={9} fill="#f6e3a8" />
        <circle cx={234} cy={188} r={9} fill="#f0b8c6" /> <circle cx={318} cy={188} r={11} fill="#b5764a" />
      </Paper>
      <Paper rot={2} at={[40, 210]}>
        <path d="M16 236 Q14 196 30 190 H60 Q76 196 74 236 Z" fill="#f6efe0" />
      </Paper>
      <g {...INK}>
        <path d="M54 58 h36 M54 70 h52 M54 82 h28" stroke="#f6efe0" strokeWidth={2} />
        <path d="M24 212 h40" strokeWidth={1.4} />
        <path d="M176 116 q-6 -10 0 -18 q6 -8 0 -16 M222 118 q-6 -10 0 -18 q6 -8 0 -16" opacity={0.6} />
        <path d="M172 150 l4 -3 M180 150 l4 -3 M188 150 l4 -3 M212 150 l4 -3 M220 150 l4 -3 M228 150 l4 -3" strokeWidth={1.1} />
      </g>
    </>
  );
}

function AnchorTaproom() {
  return (
    <>
      {/* trivia night: dark wall, warm lamps, the taps lined up */}
      <Paper rot={1}>
        <path d="M22 232 C6 140 34 30 160 22 C292 14 410 50 400 156 C396 204 386 232 386 232 Z" fill="#2e3a55" />
      </Paper>
      {[110, 210, 310].map((x) => (
        <g key={x}>
          <circle cx={x} cy={58} r={26} fill="#ffc96a" opacity={0.45} filter="url(#glow)" />
          <path d={`M${x} 0 V40`} stroke="#c9b48a" strokeWidth={1.6} />
        </g>
      ))}
      <Paper rot={-0.6} at={[210, 50]}>
        <path d="M98 50 Q110 36 122 50 Z M198 50 Q210 36 222 50 Z M298 50 Q310 36 322 50 Z" fill="#f2c94c" />
      </Paper>
      <Paper rot={0.8} at={[300, 100]}>
        <path d="M236 92 H392 V98 H236 Z M236 128 H392 V134 H236 Z" fill="#9a6a42" />
        <path d="M246 92 V72 Q252 64 258 72 V92 Z M268 92 V66 H278 V92 Z M290 92 V74 Q296 68 302 74 V92 Z M314 92 V70 H322 V92 Z M336 92 V76 Q342 70 348 76 V92 Z M362 92 V68 H372 V92 Z" fill="#c9893d" />
        <path d="M250 128 V110 H262 V128 Z M276 128 V104 Q282 98 288 104 V128 Z M302 128 V112 H314 V128 Z M330 128 V106 H340 V128 Z M356 128 V110 Q362 104 368 110 V128 Z" fill="#6e9a8a" />
      </Paper>
      <Paper rot={-1.5} at={[70, 110]}>
        <circle cx={70} cy={110} r={30} fill="#f6efe0" />
        <circle cx={70} cy={110} r={21} fill="#c8473d" />
        <circle cx={70} cy={110} r={12} fill="#f6efe0" />
        <circle cx={70} cy={110} r={4} fill="#c8473d" />
      </Paper>
      <Paper rot={0.4}>
        <path d="M6 168 H414 V242 H6 Z" fill="#7a4f30" />
        <path d="M6 162 H414 V172 H6 Z" fill="#9a6a42" />
      </Paper>
      <Paper rot={-0.5} at={[230, 150]}>
        <path d="M150 146 H330 V156 H150 Z" fill="#c98a4b" />
        <path d="M164 146 V124 H172 V146 Z" fill="#f2c94c" /> <path d="M196 146 V120 H204 V146 Z" fill="#e8747a" />
        <path d="M228 146 V126 H236 V146 Z" fill="#8fb8e0" /> <path d="M260 146 V122 H268 V146 Z" fill="#f6efe0" />
        <path d="M292 146 V124 H300 V146 Z" fill="#b7a3e0" />
      </Paper>
      <Paper rot={2} at={[330, 170]}>
        <path d="M312 166 L316 150 H336 L340 166 Z M350 166 L354 150 H374 L378 166 Z" fill="#e9a93b" />
        <path d="M315 152 Q326 144 337 152 Z M353 152 Q364 144 375 152 Z" fill="#fbf3dc" />
      </Paper>
      <g {...INK} stroke="#f6efe0">
        <circle cx={160} cy={96} r={16} strokeWidth={1.4} />
        <path d="M160 84 V108 M152 90 H168 M150 102 Q160 112 170 102" strokeWidth={1.4} />
      </g>
    </>
  );
}

function GreenlineYard() {
  return (
    <>
      {/* Saturday, fresh cut: bright sky, rolling yard, white fence */}
      <Paper rot={-1}>
        <path d="M22 232 C6 140 34 30 160 22 C292 14 410 50 400 156 C396 204 386 232 386 232 Z" fill="#cfe5f1" />
      </Paper>
      <Paper rot={1} at={[330, 60]}>
        <circle cx={330} cy={62} r={24} fill="#f6d35e" />
      </Paper>
      <Paper rot={-0.8} at={[120, 50]}>
        <path d="M70 60 Q74 44 92 48 Q100 34 118 42 Q134 38 136 54 Q148 60 136 68 H76 Q62 66 70 60 Z" fill="#fbf6e6" />
      </Paper>
      <Paper rot={0.5}>
        <path d="M8 160 Q110 120 220 150 T412 140 V242 H8 Z" fill="#b8d07f" />
      </Paper>
      <Paper rot={-0.4}>
        <path d="M8 196 Q160 176 300 196 T412 192 V242 H8 Z" fill="#93b45f" />
      </Paper>
      <Paper rot={1.2} at={[60, 140]}>
        <path d="M54 196 H70 V136 H54 Z" fill="#8a5a3b" />
        <circle cx={62} cy={110} r={40} fill="#6f9b52" />
        <circle cx={40} cy={130} r={22} fill="#7eaa5c" />
      </Paper>
      <Paper rot={-0.6} at={[290, 170]}>
        {[220, 244, 268, 292, 316, 340, 364, 388].map((x) => (
          <path key={x} d={`M${x} 196 V160 L${x + 7} 150 L${x + 14} 160 V196 Z`} fill="#fbf6e6" />
        ))}
        <path d="M214 166 H408 V172 H214 Z M214 184 H408 V190 H214 Z" fill="#fbf6e6" />
      </Paper>
      <Paper rot={1.5} at={[150, 210]}>
        <path d="M120 222 V204 Q120 196 128 196 H176 L184 222 Z" fill="#d9534f" />
        <path d="M176 196 L196 168" stroke="#2a2219" strokeWidth={3} />
        <circle cx={130} cy={224} r={8} fill="#2b2620" /> <circle cx={176} cy={224} r={8} fill="#2b2620" />
      </Paper>
      <g>
        {[[30, 214, "#f0a3b4"], [44, 222, "#f6d35e"], [360, 220, "#f0a3b4"], [376, 212, "#fbf6e6"], [392, 222, "#f6d35e"]].map(([x, y, c]) => (
          <circle key={`${x}`} cx={x as number} cy={y as number} r={4} fill={c as string} stroke="#2a2219" strokeWidth={1} />
        ))}
      </g>
      <g {...INK}>
        <path d="M100 206 q4 -8 8 0 M196 230 q4 -8 8 0 M250 212 q4 -8 8 0 M300 232 q4 -8 8 0" opacity={0.6} />
      </g>
    </>
  );
}

function ShineDetailing() {
  return (
    <>
      {/* a sunny driveway, a cherry-red classic, suds everywhere */}
      <Paper rot={1}>
        <path d="M22 232 C6 140 34 30 160 22 C292 14 410 50 400 156 C396 204 386 232 386 232 Z" fill="#fde2a3" />
      </Paper>
      <Paper rot={-1} at={[90, 60]}>
        <circle cx={92} cy={62} r={26} fill="#f6b85e" />
      </Paper>
      <Paper rot={-0.4}>
        <path d="M8 196 Q210 186 412 196 V242 H8 Z" fill="#cdc6ba" />
      </Paper>
      <Paper rot={-0.8} at={[270, 170]}>
        <path d="M150 204 V172 Q150 160 164 158 L200 154 Q222 124 256 122 H310 Q336 122 352 150 L380 156 Q396 160 396 176 V204 Z" fill="#d6463f" />
        <path d="M214 154 Q230 132 254 132 H276 V154 Z M286 132 H306 Q324 132 336 154 H286 Z" fill="#cfe5f1" />
        <path d="M150 182 H396 V188 H150 Z" fill="#f6efe0" />
        <circle cx={196} cy={206} r={18} fill="#2b2620" /> <circle cx={196} cy={206} r={8} fill="#d9d4ca" />
        <circle cx={350} cy={206} r={18} fill="#2b2620" /> <circle cx={350} cy={206} r={8} fill="#d9d4ca" />
      </Paper>
      <Paper rot={2} at={[90, 210]}>
        <path d="M64 236 L70 196 H112 L118 236 Z" fill="#4f7fbf" />
        <path d="M66 198 Q76 184 90 192 Q102 182 116 198 Z" fill="#fbfdff" />
      </Paper>
      <path d="M118 200 Q150 250 200 236 T300 240" fill="none" stroke="#f2c94c" strokeWidth={5} strokeLinecap="round" />
      <g>
        {[[230, 110, 10], [258, 92, 7], [284, 104, 12], [316, 84, 8], [210, 140, 6], [372, 120, 9], [344, 100, 6], [130, 150, 8]].map(([x, y, r]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill="#fbfdff" fillOpacity={0.75} stroke="#2a2219" strokeWidth={1.2} />
        ))}
      </g>
      <g {...INK}>
        <path d="M232 106 q2 -3 5 -3 M286 99 q3 -4 6 -4" stroke="#8fb8e0" strokeWidth={1.4} />
        <path d="M380 60 v14 M373 67 h14 M150 40 v10 M145 45 h10" stroke="#2a2219" strokeWidth={1.6} />
      </g>
    </>
  );
}

export const SCENES: Record<string, () => React.JSX.Element> = {
  "Nito's Empanadas": NitosKitchen,
  "Coastal Plumbing": CoastalPlumbing,
  "Salt & Shear Salon": Salon,
  "Low Tide Tacos": TacoTruck,
  "Rise Bakery": RiseBakery,
  "Anchor Taproom": AnchorTaproom,
  "Greenline Landscaping": GreenlineYard,
  "Shine Mobile Detailing": ShineDetailing,
};

/** All scenes stacked; the current business's fades in, the rest fade out. */
export function ShortyScenes({ biz, show }: { biz: string; show: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-[-10%] bottom-0 h-[118%] lg:-left-[22%] lg:-right-[48%] lg:h-[140%] [mask-image:radial-gradient(ellipse_62%_70%_at_50%_62%,black_60%,transparent_100%)]"
    >
      <svg viewBox="0 0 420 260" preserveAspectRatio="xMidYMax meet" className="absolute inset-0 h-full w-full">
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
