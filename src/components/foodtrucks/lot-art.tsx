import { C, SANS, SERIF } from "./tokens";

/* The things on the lot, drawn as in docs/design/foodtrucks/design/Stage.dc.html. Positions come from lot-geo.ts. */

export function Customers({ ding, style }: { ding: boolean; style: React.CSSProperties }) {
  const person = (cx: number, head: number, bodyY: number, bodyH: number, fill: string, phoneX: number, phoneY: number) => (
    <g>
      <circle cx={cx} cy={head} r="9" fill={C.ink} />
      <rect x={cx - 10} y={bodyY} width="20" height={bodyH} rx="6" fill={fill} />
      <rect className="ftl-cph" x={phoneX} y={phoneY} width="9" height="14" rx="2" fill="#6B6356" stroke={C.ink} strokeWidth="1.5" />
      <circle className="ftl-ring" cx={phoneX + 4} cy={phoneY + 7} r="8" fill="none" stroke={C.amber} strokeWidth="2" />
    </g>
  );
  return (
    <svg className={ding ? "ftl-ding" : ""} aria-hidden="true" viewBox="0 0 200 60" style={style}>
      {person(30, 18, 28, 26, "#45423C", 36, 26)}
      {person(100, 16, 26, 28, "#5A5448", 106, 24)}
      {person(166, 19, 29, 25, "#45423C", 146, 27)}
    </svg>
  );
}

export function Sign({ flip, label, style, onClick }: { flip: boolean; label: string; style: React.CSSProperties; onClick: () => void }) {
  const face = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", position: "absolute", inset: 0, width: "100%", height: "100%" } as React.CSSProperties;
  return (
    <button type="button" className="ftl-obj" aria-label={label} onClick={onClick} style={{ ...style, perspective: 400 }}>
      <div className={"ftl-sign" + (flip ? " flip" : "")} style={{ position: "relative", width: "100%", aspectRatio: "1 / 1.25" }}>
        <svg viewBox="0 0 90 112" style={face} aria-hidden="true">
          <path d="M14 10 L4 104 M76 10 L86 104" stroke={C.ink} strokeWidth="4" strokeLinecap="round" />
          <rect x="10" y="8" width="70" height="78" rx="4" fill={C.cream} stroke={C.ink} strokeWidth="3" />
          <text x="45" y="34" textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize="18" fill={C.green}>Tonight</text>
          <text x="45" y="54" textAnchor="middle" fontFamily={SANS} fontSize="11" fontWeight="700" fill={C.ink}>[PLACE]</text>
          <text x="45" y="70" textAnchor="middle" fontFamily={SANS} fontSize="11" fontWeight="700" fill={C.ink}>5 – 9</text>
        </svg>
        <svg viewBox="0 0 90 112" style={{ ...face, transform: "rotateY(180deg)" }} aria-hidden="true">
          <path d="M14 10 L4 104 M76 10 L86 104" stroke={C.ink} strokeWidth="4" strokeLinecap="round" />
          <rect x="10" y="8" width="70" height="78" rx="4" fill={C.mint} stroke={C.ink} strokeWidth="3" />
          <text x="45" y="26" textAnchor="middle" fontFamily={SANS} fontSize="9" fontWeight="700" letterSpacing="1.5" fill={C.ink}>THIS WEEK</text>
          <text x="16" y="44" fontFamily={SANS} fontSize="10" fontWeight="700" fill={C.ink}>TUE  [PLACE]</text>
          <text x="16" y="60" fontFamily={SANS} fontSize="10" fontWeight="700" fill={C.ink}>THU  [PLACE]</text>
          <text x="16" y="76" fontFamily={SANS} fontSize="10" fontWeight="700" fill={C.ink}>SAT  [PARK]</text>
        </svg>
      </div>
    </button>
  );
}

export function Crate({ style }: { style: React.CSSProperties }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 70" style={style}>
      <rect x="4" y="22" width="112" height="46" rx="3" fill="#8A6A3C" stroke={C.ink} strokeWidth="3" />
      <path d="M4 38 H116 M4 54 H116 M30 22 V68 M90 22 V68" stroke={C.ink} strokeWidth="2.5" opacity=".55" />
    </svg>
  );
}

export function PhoneObj({ className, style, onClick }: { className: string; style: React.CSSProperties; onClick: () => void }) {
  return (
    <button type="button" className={"ftl-obj " + className} aria-label="Pick up the phone" onClick={onClick} style={{ ...style, borderRadius: 10 }}>
      <svg viewBox="0 0 40 70" style={{ display: "block", width: "100%", height: "auto" }} aria-hidden="true">
        <rect x="3" y="3" width="34" height="64" rx="7" fill={C.ink} />
        <rect x="6" y="9" width="28" height="52" rx="4" fill={C.mint} />
        <path d="M13 36 L18 41 L28 29" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </button>
  );
}

export function MegaObj({ style, onClick }: { style: React.CSSProperties; onClick: () => void }) {
  return (
    <button type="button" className="ftl-obj" aria-label="Tap the megaphone" onClick={onClick} style={style}>
      <svg viewBox="0 0 70 50" style={{ display: "block", width: "100%", height: "auto", transform: "rotate(-28deg)" }} aria-hidden="true">
        <rect x="4" y="18" width="14" height="16" rx="3" fill={C.ink} />
        <path d="M16 14 L54 2 L54 46 L16 34 Z" fill={C.amber} stroke={C.ink} strokeWidth="3" strokeLinejoin="round" />
        <ellipse cx="54" cy="24" rx="6" ry="22" fill={C.green} stroke={C.ink} strokeWidth="3" />
      </svg>
    </button>
  );
}

export function Table({ style }: { style: React.CSSProperties }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 110 60" style={style}>
      <rect x="2" y="24" width="106" height="9" rx="2" fill="#6B4F2E" stroke={C.ink} strokeWidth="3" />
      <path d="M22 33 L12 58 M88 33 L98 58 M30 33 L26 58 M80 33 L84 58" stroke={C.ink} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function BurgerObj({ hidden, style, onClick }: { hidden: boolean; style: React.CSSProperties; onClick: () => void }) {
  return (
    <button type="button" className="ftl-obj" aria-label="Tap the burger" onClick={onClick} style={{ ...style, visibility: hidden ? "hidden" : "visible" }}>
      <svg viewBox="0 0 56 44" style={{ display: "block", width: "100%", height: "auto" }} aria-hidden="true">
        <path d="M6 30 H50 V34 Q50 40 44 40 H12 Q6 40 6 34 Z" fill={C.mint} stroke={C.ink} strokeWidth="2.5" />
        <rect x="4" y="20" width="48" height="10" rx="5" fill="#8A5A3C" stroke={C.ink} strokeWidth="2.5" />
        <path d="M4 19 Q10 12 16 19 Q22 12 28 19 Q34 12 40 19 Q46 12 52 19" fill={C.mint} stroke={C.ink} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M6 18 Q6 2 28 2 Q50 2 50 18 Z" fill={C.mint} stroke={C.ink} strokeWidth="2.5" />
        <circle cx="18" cy="10" r="1.6" fill={C.cream} /><circle cx="28" cy="7" r="1.6" fill={C.cream} /><circle cx="38" cy="11" r="1.6" fill={C.cream} />
      </svg>
    </button>
  );
}

export function Truck({ shake, winFill, style, onClick }: { shake: boolean; winFill: string; style: React.CSSProperties; onClick: () => void }) {
  return (
    <button type="button" className={"ftl-obj " + (shake ? "ftl-shake" : "")} aria-label="Tap the truck" onClick={onClick} style={style}>
      <svg viewBox="0 0 170 124" style={{ display: "block", width: "100%", height: "auto" }} aria-hidden="true">
        <rect x="6" y="14" width="114" height="84" rx="5" fill={C.amber} stroke={C.ink} strokeWidth="4" />
        <path d="M120 40 H140 L160 68 V98 H120 Z" fill={C.amber} stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
        <path d="M127 47 H138 L148 66 H127 Z" fill="#fff" stroke={C.ink} strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="20" y="36" width="82" height="40" rx="3" fill={C.ink} />
        <rect x="23" y="39" width="76" height="34" fill={winFill} style={{ transition: "fill .3s" }} />
        <rect x="20" y="76" width="82" height="6" fill={C.ink} />
        <rect x="12" y="22" width="98" height="14" fill={C.cream} stroke={C.ink} strokeWidth="3" />
        <path d="M26 22 v14 M40 22 v14 M54 22 v14 M68 22 v14 M82 22 v14 M96 22 v14" stroke={C.ink} strokeWidth="3" />
        <text x="87" y="93" textAnchor="middle" fontFamily={SANS} fontSize="7" fontWeight="700" letterSpacing="1" fill={C.cream}>[YOUR TRUCK]</text>
        <circle cx="38" cy="100" r="13" fill={C.ink} /><circle cx="38" cy="100" r="4.5" fill="#8D8A80" />
        <circle cx="136" cy="100" r="13" fill={C.ink} /><circle cx="136" cy="100" r="4.5" fill="#8D8A80" />
      </svg>
    </button>
  );
}
