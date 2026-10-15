"use client";

/**
 * "Play to see Shorty in action", the food trucks version: the same teaser band as the homepage (faded newspaper, taped paper card,
 * pulsing play button, Shorty) but the street is a food truck park: four trucks with their windows open, people
 * walking up, queueing and walking off with their food. The newspaper behind is the Food Truck Gazette. Tapping the card opens the
 * narrated explainer (ShortyVideo) in a window, with sound (the tap lets it play). /foodtrucks#watch opens it too (muted).
 * Cut paper like the rest of the site: flat shapes, hard offset shadow, grain, no SVG filters.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import { NewsBackdrop, NEWSPRINT } from "@/components/new-home/Newsprint";
import { PaperCard } from "@/components/new-home/PaperCard";
import { TornEdge, tearPolys } from "@/components/new-home/TornEdge";
import { Cloud, GRAIN_URL, Paper, Tree, cut } from "@/components/new-home/ShortyReel";
import ShortyVideo from "./ShortyVideo";

const INK = "#14161A";
const CREAM = "#FBF6E6";
const MINT = "#5FDDAE";
const SANS = "var(--font-sora), system-ui, sans-serif";
const SERIF = "var(--font-fraunces), Georgia, serif";
const TEAR = tearPolys(13, -12, 0.75, 56);
const DARK = "#2a2219";

/* ── a food truck, facing right, parked on the ground line (y = 410) ───────────── */
function FoodTruck({ x, w = 250, body, dark, awning, name, seed }: { x: number; w?: number; body: string; dark: string; awning: string; name: string; seed: number }) {
  const winX = x + 26, winY = 262, winW = w - 130, winH = 70;
  const scallops = Array.from({ length: Math.round(winW / 22) }, () => "q-11 12 -22 0").join(" ");
  return (
    <g>
      {/* roof sign */}
      <Paper d={cut(x + 52, 196, w - 150, 34, seed + 1, 1.4)} fill={CREAM} dx={3} dy={4} />
      <text x={x + 52 + (w - 150) / 2} y={219} textAnchor="middle" fontSize={20} fontWeight={800} letterSpacing={2.2} fill={INK} style={{ fontFamily: SANS }}>{name}</text>
      {/* body and cab */}
      <Paper d={cut(x, 232, w - 52, 152, seed)} fill={body} dx={6} dy={7} />
      <Paper d={`M${x + w - 58} 262 H${x + w - 28} Q${x + w} 262 ${x + w} 292 V384 H${x + w - 58} Z`} fill={dark} dx={4} dy={5} />
      <Paper d={`M${x + w - 50} 272 H${x + w - 30} Q${x + w - 10} 272 ${x + w - 8} 292 V312 H${x + w - 50} Z`} fill="#CFE6E1" dx={1.5} dy={1.5} />
      <Paper d={cut(x + 8, 352, w - 70, 16, seed + 2, 1.2)} fill={dark} dx={0} dy={2} />
      {/* serving window, the cook inside, the counter */}
      <rect x={winX} y={winY} width={winW} height={winH} fill="#4A3326" />
      <g className="reel-cook" style={{ transformOrigin: `${winX + winW * 0.6}px ${winY + winH}px` }}>
        <path d={`M${winX + winW * 0.6 - 24} ${winY + winH} Q${winX + winW * 0.6 - 22} ${winY + 34} ${winX + winW * 0.6} ${winY + 32} Q${winX + winW * 0.6 + 22} ${winY + 34} ${winX + winW * 0.6 + 24} ${winY + winH} Z`} fill={DARK} />
        <circle cx={winX + winW * 0.6} cy={winY + 22} r={11} fill={DARK} />
        <path d={`M${winX + winW * 0.6 - 12} ${winY + 16} Q${winX + winW * 0.6} ${winY + 2} ${winX + winW * 0.6 + 12} ${winY + 16} Z`} fill={DARK} />
      </g>
      <Paper d={cut(winX - 8, winY + winH - 4, winW + 16, 11, seed + 3, 1)} fill={dark} dx={0} dy={2} />
      {/* awning */}
      <Paper d={`M${winX - 12} ${winY + 2} L${winX + 6} ${winY - 26} H${winX + winW - 6} L${winX + winW + 12} ${winY + 2} ${scallops} Z`} fill={awning} dx={3} dy={4} />
      {[0, 2, 4].map((i) => <path key={i} d={`M${winX + 12 + i * 22} ${winY - 26} L${winX + 6 + i * 22} ${winY + 2} h14 l5 -28 Z`} fill={CREAM} opacity={0.9} />)}
      {/* a chalkboard leaning on the front, wheels */}
      <Paper d={cut(x + 4, 358, 34, 50, seed + 4, 1)} fill="#3C5A4C" dx={2} dy={3} />
      <path d={`M${x + 11} 372 H${x + 31} M${x + 11} 382 H${x + 27} M${x + 11} 392 H${x + 30}`} stroke="#F4ECD6" strokeWidth={2} strokeLinecap="round" />
      {[x + 60, x + w - 62].map((cx) => (
        <g key={cx}><Paper d={`M${cx - 24} 392 a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0 Z`} fill="#2B2620" dx={3} dy={4} /><circle cx={cx} cy={392} r={8} fill="#E9DCC4" /></g>
      ))}
    </g>
  );
}

/* ── a paper person; origin is the feet, he is about 78 units tall. eat: his right hand brings food to his mouth now and then ── */
function Guy({ body, skin, hair, phone, eat, eatEvery = 3.4, eatAt = 0 }: { body: string; skin: string; hair: string; phone?: boolean; eat?: "taco" | "burger" | "crepe"; eatEvery?: number; eatAt?: number }) {
  return (
    <g>
      <ellipse cx={0} cy={2} rx={17} ry={4.5} fill="rgba(60,40,20,.25)" />
      <g className="reel-bob">
        <path d="M-8 0 V-24 M8 0 V-24" stroke="#33404E" strokeWidth={7} strokeLinecap="round" />
        <Paper d={cut(-14, -58, 28, 40, 9, 1.2)} fill={body} dx={2.5} dy={3} />
        <path d="M-14 -50 L-22 -34" stroke={skin} strokeWidth={6} strokeLinecap="round" />
        <Paper d="M-11 -68 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0 Z" fill={skin} dx={2} dy={2.5} />
        <path d="M-12 -72 Q-10 -84 0 -84 Q11 -84 12 -72 Q4 -77 -12 -72 Z" fill={hair} />
        <circle cx={4} cy={-69} r={1.5} fill={INK} /><circle cx={-3} cy={-69} r={1.5} fill={INK} />
        <path d="M-3 -63 Q1 -60 5 -63" fill="none" stroke={INK} strokeWidth={1.3} strokeLinecap="round" />
        {phone && <rect x={14} y={-46} width={8} height={13} rx={2} fill={MINT} stroke={INK} strokeWidth={1.2} />}
        {eat ? (
          <g className="reel-eat" style={{ transformOrigin: "14px -50px", animationDuration: `${eatEvery}s`, animationDelay: `${eatAt}s` }}>
            <path d="M14 -50 L24 -36" stroke={skin} strokeWidth={6} strokeLinecap="round" />
            {eat === "taco" && <path d="M18 -34 a8 8 0 0 1 16 0 Z" fill="#F2C45C" stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />}
            {eat === "burger" && <g><path d="M17 -37 a8 6 0 0 1 16 0 Z" fill="#D9A15B" stroke={INK} strokeWidth={1.1} /><rect x={17} y={-37} width={16} height={3} fill="#7A4A2A" /><path d="M17 -34 h16 a8 4 0 0 1 -16 0 Z" fill="#D9A15B" stroke={INK} strokeWidth={1.1} /></g>}
            {eat === "crepe" && <path d="M18 -30 L30 -42 L34 -34 Z" fill="#F4D9A0" stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />}
          </g>
        ) : <path d="M14 -50 L22 -34" stroke={skin} strokeWidth={6} strokeLinecap="round" />}
      </g>
    </g>
  );
}
/** A picnic table with a plate on it; whoever sits at it is drawn first, so the table hides his legs. */
function Table({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <Paper d={`M${x - 40} ${y + 8} L${x - 52} ${y + 40} H${x - 44} L${x - 32} ${y + 8} Z M${x + 40} ${y + 8} L${x + 52} ${y + 40} H${x + 44} L${x + 32} ${y + 8} Z`} fill="#8A5A3A" dx={2} dy={3} />
      <Paper d={cut(x - 48, y, 96, 10, 77, 1)} fill="#C98F5B" dx={3} dy={4} />
      <ellipse cx={x + 4} cy={y - 2} rx={13} ry={3.4} fill="#FBF6E6" stroke={INK} strokeWidth={1} />
      <path d={`M${x - 3} ${y - 4} a7 6 0 0 1 14 0 Z`} fill="#F2C45C" stroke={INK} strokeWidth={1} />
    </g>
  );
}

const PALETTE = [
  { body: "#6B8FA8", skin: "#E8B98F", hair: "#3B2B22" }, { body: "#C9704F", skin: "#8D5A3B", hair: "#1F1A17" },
  { body: "#7A9A63", skin: "#F0C9A0", hair: "#B5793A" }, { body: "#8A6FA8", skin: "#C68A62", hair: "#2A2019" },
  { body: "#D9A441", skin: "#DBA37A", hair: "#5A3A22" }, { body: "#5E8F86", skin: "#E0A979", hair: "#2F2A26" },
  { body: "#E58B8B", skin: "#F0C9A0", hair: "#7A4B2A" }, { body: "#4F6D8C", skin: "#B98560", hair: "#1F1A17" },
];
/** Keyframes for a walker: each step is [percent, x, y, facing]; a facing change happens at the same spot. */
const WALKERS: { name: string; delay: number; dur: number; steps: [number, number, number, 1 | -1][] }[] = [
  /* walks in from the left, waits at the TACOS window, walks back out */
  { name: "w1", delay: -9, dur: 34, steps: [[0, -90, 440, 1], [16, 96, 438, 1], [52, 96, 438, 1], [53, 96, 438, -1], [100, -100, 440, -1]] },
  /* walks in from the right, waits at the CREPES window, walks back out */
  { name: "w2", delay: -22, dur: 38, steps: [[0, 1310, 440, -1], [15, 1040, 438, -1], [50, 1040, 438, -1], [51, 1040, 438, 1], [100, 1310, 440, 1]] },
];
const walkCss = WALKERS.map((w) => `@keyframes ${w.name} { ${w.steps.map(([p, x, y, f]) => `${p}% { transform: translate(${x}px, ${y}px) scale(${f}, 1) }`).join(" ")} }
.reel-${w.name} { animation: ${w.name} ${w.dur}s linear infinite; animation-delay: ${w.delay}s; transform: translate(${w.steps[0][1]}px, ${w.steps[0][2]}px) scale(${w.steps[0][3]}, 1) }`).join("\n");

function ParkScene() {
  const flags = Array.from({ length: 22 }, (_, i) => i);
  const flagColors = ["#E58B5A", "#F2C45C", "#7FB5A8", "#B7A3D8", "#C8624A"];
  const sag = (x: number) => 64 + 22 * Math.sin((x / 1200) * Math.PI);
  return (
    <svg viewBox="0 0 1200 640" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <pattern id="reelGrain" width="160" height="160" patternUnits="userSpaceOnUse"><image href={GRAIN_URL} width="160" height="160" /></pattern>
        <linearGradient id="reelWash" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".16" /><stop offset=".55" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#3a2410" stopOpacity=".14" /></linearGradient>
        <linearGradient id="reelSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#CFE6E1" /><stop offset=".55" stopColor="#F4E7B9" /><stop offset="1" stopColor="#F6D9A8" /></linearGradient>
      </defs>
      <g transform="translate(0 120)">{/* 120 extra units of sky on top: a phone's square crop then shows the two middle trucks whole (signs included) */}
      <rect y={-120} width="1200" height="640" fill="url(#reelSky)" />
      <circle cx="930" cy="150" r="82" fill="#F2B84B" opacity={0.9} />
      <circle cx="930" cy="150" r="82" fill="url(#reelGrain)" opacity={0.2} style={{ mixBlendMode: "multiply" }} />
      <Cloud y={40} s={1.1} className="reel-cloud-a" />
      <Cloud y={110} s={0.8} className="reel-cloud-b" />
      <Cloud y={20} s={0.7} className="reel-cloud-c" />
      {/* bunting across the park */}
      <path d={`M0 ${sag(0)} ${Array.from({ length: 25 }, (_, i) => `L${i * 50} ${sag(i * 50).toFixed(1)}`).join(" ")}`} fill="none" stroke="#6B5A48" strokeWidth={2} />
      {flags.map((i) => { const fx = 28 + i * 54, fy = sag(fx); return <Paper key={i} d={`M${fx - 11} ${fy} L${fx + 11} ${fy} L${fx} ${fy + 26} Z`} fill={flagColors[i % flagColors.length]} dx={2} dy={3} />; })}
      {/* trees behind the trucks */}
      <Tree x={275} s={1.9} /><Tree x={600} s={2.1} /><Tree x={925} s={1.9} /><Tree x={1180} s={1.7} /><Tree x={10} s={1.6} />
      {/* gravel lot and lawn */}
      <Paper d={cut(-30, 404, 1260, 70, 5, 3)} fill="#E2C99A" dx={0} dy={-3} />
      <Paper d={cut(-30, 466, 1260, 90, 6, 3)} fill="#9CC79A" dx={0} dy={-3} />
      {Array.from({ length: 10 }, (_, i) => <Paper key={i} d={cut(30 + i * 124, 440, 46, 6, 70 + i, 1.2)} fill="#F4ECD6" dx={1} dy={2} />)}
      {/* the trucks */}
      <FoodTruck x={16} body="#E58B5A" dark="#B5553F" awning="#C8624A" name="TACOS" seed={11} />
      <FoodTruck x={280} body="#7FB5A8" dark="#4E8A7C" awning="#E2A43C" name="BURGERS" seed={23} />
      <FoodTruck x={670} body="#F0C95C" dark="#C99A35" awning="#7FB5A8" name="COFFEE" seed={37} />
      <FoodTruck x={934} body="#B7A3D8" dark="#8A74B5" awning="#C8624A" name="CREPES" seed={51} />
      {/* a few people, each doing something different, none sharing a spot */}
      <g transform="translate(366 440)"><g className="reel-idle"><Guy {...PALETTE[2]} eat="burger" eatEvery={4.7} eatAt={-0.6} /></g></g>
      <g transform="translate(756 440)"><g className="reel-idle reel-idle-2"><Guy {...PALETTE[5]} phone /></g></g>
      <g transform="translate(273 478)"><g className="reel-idle reel-idle-2"><Guy {...PALETTE[6]} eat="taco" eatEvery={6.3} eatAt={-3.9} /></g></g>
      <Table x={273} y={446} />
      <g className="reel-walker reel-w1"><Guy {...PALETTE[0]} phone /></g>
      <g className="reel-walker reel-w2"><Guy {...PALETTE[1]} /></g>
      {/* shrubs with flowers, front corners */}
      <Paper d="M-20 520 Q-10 474 40 474 Q92 476 100 520 Z" fill="#7FB08E" dx={4} dy={4} />
      <Paper d="M1100 520 Q1108 478 1156 476 Q1210 478 1224 520 Z" fill="#7FB08E" dx={4} dy={4} />
      {[[20, 494], [52, 486], [76, 500], [1130, 492], [1166, 486], [1192, 500]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={5} fill={["#F2C45C", "#E58B8B", "#FBF6E6"][i % 3]} />)}
      </g>
    </svg>
  );
}

/* ── the video window ─────────────────────────────────────────────────────── */
function VideoModal({ onClose, sound }: { onClose: () => void; sound: boolean }) {
  const dialog = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6" onClick={onClose}>
      <div ref={dialog} role="dialog" aria-modal="true" aria-label="Shorty for food trucks" tabIndex={-1} onClick={(e) => e.stopPropagation()} className="relative outline-none" style={{ width: "min(100%, calc(88dvh * 16 / 9), 1180px)" }}>
        <button type="button" onClick={onClose} aria-label="Close the video" className="absolute -top-3 -right-1 z-[5] grid h-10 w-10 place-items-center rounded-full sm:-right-3 sm:-top-4" style={{ background: CREAM, border: `2.5px solid ${INK}`, boxShadow: `3px 3px 0 ${INK}` }}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2 L14 14 M14 2 L2 14" stroke={INK} strokeWidth={2.6} strokeLinecap="round" /></svg>
        </button>
        <ShortyVideo startWithSound={sound} />
      </div>
    </div>
  );
}

/* ── the teaser band ──────────────────────────────────────────────────────── */
export default function FoodTruckReel() {
  const [open, setOpen] = useState(false);
  const [sound, setSound] = useState(false);
  const opener = useRef<HTMLButtonElement | null>(null);
  const play = () => { setSound(true); setOpen(true); };
  const close = useCallback(() => {
    setOpen(false);
    if (window.location.hash === "#watch") window.history.replaceState(null, "", window.location.pathname + window.location.search);
    setTimeout(() => opener.current?.focus(), 0);
  }, []);
  /* /foodtrucks#watch: open it, muted (nothing has been tapped yet) */
  useEffect(() => {
    const check = () => { if (window.location.hash === "#watch") window.requestAnimationFrame(() => { setSound(false); setOpen(true); }); };
    check(); window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  return (
    <>
      <section id="watch" aria-label="Watch Shorty for food trucks" className="relative px-4 pb-24 pt-32 sm:px-6 md:pb-28 md:pt-[290px]" style={{ background: NEWSPRINT, scrollMarginTop: 60 }}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -bottom-[56px] z-0" style={{ filter: "drop-shadow(0 3px 2.5px rgba(40,25,10,.3))" }}>
          <div className="absolute inset-0" style={{ clipPath: TEAR.core, background: "#FFFDF6" }} />
          <NewsBackdrop clip={TEAR.paper} edition="trucks" />
        </div>
        <TornEdge fill="#FBF8F0" angle={46} rough={1.5} seed={5} />
        <div className="relative z-[1] mx-auto max-w-[1120px]">
          <PaperCard seed={61} tilt={0} shadow="rgba(40,25,10,.42)" className="mx-auto">
            <div className="p-3 sm:p-5 md:p-6">
              <button
                ref={opener} type="button" onClick={play} aria-label="Play the video: Shorty for food trucks"
                className="group relative block aspect-square w-full cursor-pointer rounded-[28px] text-left md:aspect-[16/6.2]"
                style={{ boxShadow: "1px 2px 0 rgba(40,25,10,.35), 0 0 0 2px rgba(110,85,45,.22)", background: "#F4E7B9" }}
              >
                <span className="absolute inset-0 overflow-hidden rounded-[28px]">
                  <ParkScene />
                  <span aria-hidden="true" className="absolute bottom-[2%] left-1/2 block h-[56%] w-[30%] -translate-x-1/2 md:bottom-[2%] md:h-[72%] md:w-[24%]">
                    <span className="absolute inset-x-0 bottom-0 flex justify-center">
                      <ShortyMascot mood="pleased" holdPhone size={190} style={{ height: "100%", width: "auto" }} />
                    </span>
                  </span>
                </span>
                <span className="absolute left-1/2 top-[19%] -translate-x-1/2 -translate-y-1/2">
                  <span className="relative grid h-[84px] w-[84px] place-items-center md:h-[96px] md:w-[96px]">
                    <span className="reel-pulse absolute inset-0 rounded-full" style={{ border: `4px solid ${MINT}` }} />
                    <span className="reel-pulse reel-pulse-2 absolute inset-0 rounded-full" style={{ border: `4px solid ${MINT}` }} />
                    <span className="relative grid h-full w-full place-items-center rounded-full transition-transform duration-150 group-hover:scale-105 group-active:scale-95" style={{ background: MINT, border: `3px solid ${INK}`, boxShadow: `4px 5px 0 ${INK}` }}>
                      <svg viewBox="0 0 24 24" className="h-9 w-9 translate-x-[2px] md:h-11 md:w-11" fill={INK} stroke={INK} strokeWidth={1.5} strokeLinejoin="round"><path d="M7 4.5v15l13-7.5z" /></svg>
                    </span>
                  </span>
                </span>
                <span className="absolute -right-3 -top-3 z-10 max-w-[150px] rotate-[7deg] rounded-xl px-3 py-2 text-center text-[15px] font-bold leading-tight md:left-1/2 md:right-auto md:top-[calc(19%+58px)] md:max-w-none md:-translate-x-1/2 md:rotate-0 md:px-3 md:text-[15px] sm:text-[17px]" style={{ background: CREAM, border: `2.5px solid ${INK}`, boxShadow: `3px 4px 0 ${INK}`, fontFamily: SERIF, color: INK }}>
                  Play to see Shorty in action
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[.2] mix-blend-multiply" style={{ backgroundImage: `url("${GRAIN_URL}")` }} />
                </span>
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[28px] opacity-[.12] mix-blend-multiply" style={{ backgroundImage: `url("${GRAIN_URL}")` }} />
              </button>
            </div>
            <span aria-hidden="true" className="reel-tape absolute -top-3 left-[7%] z-10 h-[26px] w-[92px] sm:-top-4 sm:h-[32px] sm:w-[120px]" style={{ rotate: "-5deg" }} />
            <span aria-hidden="true" className="reel-tape absolute -top-3 right-[8%] z-10 h-[26px] w-[92px] sm:-top-4 sm:h-[32px] sm:w-[120px]" style={{ rotate: "4deg" }} />
          </PaperCard>
        </div>
        {open && <VideoModal onClose={close} sound={sound} />}
        <style>{`
          .reel-tape { background: linear-gradient(180deg, rgba(240,226,180,.88), rgba(228,210,160,.82)); box-shadow: 0 2px 3px rgba(40,25,10,.28); clip-path: polygon(0 8%, 4% 0, 8% 10%, 12% 0, 100% 0, 96% 25%, 100% 50%, 96% 75%, 100% 100%, 12% 100%, 8% 90%, 4% 100%, 0 92%, 4% 75%, 0 50%, 4% 25%) }
          @keyframes reelPulse { 0% { transform: scale(1); opacity: .9 } 100% { transform: scale(1.7); opacity: 0 } }
          .reel-pulse { animation: reelPulse 2.2s ease-out infinite }
          .reel-pulse-2 { animation-delay: 1.1s }
          @keyframes cloudDrift { from { transform: translate(-260px, var(--y)) scale(var(--s)) } to { transform: translate(1360px, var(--y)) scale(var(--s)) } }
          .reel-cloud-a { --y: 40px; --s: 1.1; animation: cloudDrift 110s linear infinite; animation-delay: -30s }
          .reel-cloud-b { --y: 110px; --s: .8; animation: cloudDrift 150s linear infinite; animation-delay: -95s }
          .reel-cloud-c { --y: 20px; --s: .7; animation: cloudDrift 130s linear infinite; animation-delay: -10s }
          @keyframes reelBob { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-3.5px) } }
          .reel-walker .reel-bob { animation: reelBob .46s ease-in-out infinite }
          @keyframes reelIdle { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-1.2px) } }
          .reel-idle { animation: reelIdle 2.6s ease-in-out infinite }
          .reel-idle-2 { animation-delay: -1.3s }
          @keyframes reelCook { 0%, 100% { transform: translateY(0) rotate(0) } 50% { transform: translateY(-1.5px) rotate(1.2deg) } }
          .reel-cook { animation: reelCook 1.3s ease-in-out infinite }
          @keyframes reelEat { 0%, 30% { transform: rotate(0deg) } 42%, 58% { transform: rotate(-165deg) } 70%, 100% { transform: rotate(0deg) } }
          .reel-eat { animation: reelEat 3.4s ease-in-out infinite }
          ${walkCss}
          @media (prefers-reduced-motion: reduce) { .reel-pulse { animation: none; opacity: 0 } .reel-walker, .reel-walker .reel-bob, .reel-idle, .reel-cook, .reel-eat, .reel-cloud-a, .reel-cloud-b, .reel-cloud-c { animation: none } }
        `}</style>
      </section>
      {/* page-colored room under the newspaper for its torn edge to hang over, so it never touches the section below */}
      <div aria-hidden="true" className="h-14 bg-[#14161A] sm:h-16" />
    </>
  );
}
