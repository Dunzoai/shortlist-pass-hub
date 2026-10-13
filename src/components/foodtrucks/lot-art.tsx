import { SCENES } from "@/components/new-home/ShortyScenes";
import { BURGER_PARTS } from "@/components/shorty/live/props";
import { SCENE, type Geo } from "./lot-geo";
import { C, SANS, SERIF } from "./tokens";

/* The things on the lot. The truck, its string lights and awning, the sky and the water are the homepage hero's cut-paper scene. */

/** The hero's taco-truck scene as the backdrop, with the paper continued to both sides so any stage width works. */
export function LotBackdrop({ g, shake }: { g: Geo; shake: boolean }) {
  const Scene = SCENES["Low Tide Tacos"];
  return (
    <div className={shake ? "ftl-shake" : ""} aria-hidden="true" style={{ position: "absolute", left: g.ox, bottom: 0, width: SCENE.w * g.s, height: SCENE.h * g.s, pointerEvents: "none" }}>
      <svg viewBox={`0 0 ${SCENE.w} ${SCENE.h}`} width="100%" height="100%" style={{ overflow: "visible", display: "block" }}>
        <defs>
          {/* the same two filters the hero defines (ShortyScenes.tsx) */}
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
        {/* paper beyond the drawing's own edges (same colors as its layers) */}
        <rect x={-700} y={-500} width={1820} height={740} fill="#f7cfa4" />
        <path d="M-700 196 H14 V240 H-700 Z M406 196 H1120 V240 H406 Z" fill="#9fbccb" />
        <rect x={-700} y={218} width={1820} height={50} fill="#e2b585" />
        <rect x={-700} y={242} width={1820} height={30} fill="#d9a876" />
        <Scene />
      </svg>
    </div>
  );
}

/** The invisible tap target over the scene's truck. */
export function TruckHit({ g, onClick }: { g: Geo; onClick: () => void }) {
  return <button type="button" className="ftl-obj ftl-truckhit" aria-label="Tap the truck" onClick={onClick} style={{ left: g.truck.x, bottom: g.Hmax - (g.truck.y + g.truck.h), width: g.truck.w, height: g.truck.h, background: "transparent" }} />;
}

/** Amber glow in the serving window while an order is up or Shorty is inside. */
export function WindowGlow({ g, on }: { g: Geo; on: boolean }) {
  return <div aria-hidden="true" style={{ position: "absolute", left: g.win.x, bottom: g.Hmax - (g.win.y + g.win.h), width: g.win.w, height: g.win.h, background: "rgba(226,164,60,.55)", opacity: on ? 1 : 0, transition: "opacity .3s", pointerEvents: "none" }} />;
}

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

/** 8px of invisible tap area around the small props, without moving what you see. */
const HIT: React.CSSProperties = { boxSizing: "content-box", padding: 8, margin: -8 };

export type SignData = { tonight: { title: string; time: string } | null; nextStop: { day: string; title: string } | null; week: { day: string; title: string }[] };

/** The A-frame sign, drawn over the scene's own little sign. Front: tonight. Back: this week. The words come from the truck's real stops. */
export function Sign({ flip, label, data, style, onClick }: { flip: boolean; label: string; data: SignData; style: React.CSSProperties; onClick: () => void }) {
  const face = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", position: "absolute", inset: 0, width: "100%", height: "100%" } as React.CSSProperties;
  const clip = (t: string, n: number) => (t.length > n ? t.slice(0, n - 1) + "…" : t);
  return (
    <button type="button" className="ftl-obj" aria-label={label} onClick={onClick} style={{ ...style, perspective: 400 }}>
      <div className={"ftl-sign" + (flip ? " flip" : "")} style={{ position: "relative", width: "100%", aspectRatio: "1 / 1.25" }}>
        <svg viewBox="0 0 90 112" style={face} aria-hidden="true">
          <path d="M14 10 L4 104 M76 10 L86 104" stroke={C.ink} strokeWidth="4" strokeLinecap="round" />
          <rect x="10" y="8" width="70" height="78" rx="4" fill={C.cream} stroke={C.ink} strokeWidth="3" />
          <text x="45" y="30" textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize="17" fill={C.green}>{data.tonight ? "Tonight" : "Next up"}</text>
          <text x="45" y="50" textAnchor="middle" fontFamily={SANS} fontSize="9.5" fontWeight="700" fill={C.ink}>{clip(data.tonight?.title ?? data.nextStop?.title ?? "See this week", 14)}</text>
          <text x="45" y="66" textAnchor="middle" fontFamily={SANS} fontSize="9.5" fontWeight="700" fill={C.ink}>{data.tonight?.time ?? data.nextStop?.day ?? ""}</text>
        </svg>
        <svg viewBox="0 0 90 112" style={{ ...face, transform: "rotateY(180deg)" }} aria-hidden="true">
          <path d="M14 10 L4 104 M76 10 L86 104" stroke={C.ink} strokeWidth="4" strokeLinecap="round" />
          <rect x="10" y="8" width="70" height="78" rx="4" fill={C.mint} stroke={C.ink} strokeWidth="3" />
          <text x="45" y="24" textAnchor="middle" fontFamily={SANS} fontSize="8" fontWeight="700" letterSpacing="1.5" fill={C.ink}>THIS WEEK</text>
          {data.week.slice(0, 3).map((w, i) => <text key={w.day + i} x="15" y={42 + i * 16} fontFamily={SANS} fontSize="8.4" fontWeight="700" fill={C.ink}>{w.day.toUpperCase()}  {clip(w.title, 11)}</text>)}
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
    <button type="button" className={"ftl-obj " + className} aria-label="Pick up the phone" onClick={onClick} style={{ ...style, borderRadius: 10, ...HIT }}>
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
    <button type="button" className="ftl-obj" aria-label="Tap the megaphone" onClick={onClick} style={{ ...style, ...HIT }}>
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
    <button type="button" className="ftl-obj" aria-label="Tap the burger" onClick={onClick} style={{ ...style, visibility: hidden ? "hidden" : "visible", ...HIT }}>
      <svg viewBox="0 0 100 80" style={{ display: "block", width: "100%", height: "auto" }} aria-hidden="true">
        <g stroke={C.ink} strokeWidth="3" strokeLinejoin="round">
          {BURGER_PARTS.map((p, i) => {
            const Tag = p.tag as "path";
            return <Tag key={i} {...(p.a as object)} />;
          })}
        </g>
      </svg>
    </button>
  );
}
