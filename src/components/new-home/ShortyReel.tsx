"use client";

/**
 * "Play to see Shorty in action": a hand-drawn teaser band between the hero and "AI agents are here".
 * Wide on desktop, a square on phones. Shorty (the hero's own mascot) strolls back and forth along a cut-paper street
 * while a play button pulses; tapping anywhere opens the vertical film in a modal with chapters you can jump to.
 * The film only loads when the modal opens. Cut paper like the rest of the page: flat shapes, hard offset shadow, grain, no SVG filters.
 */
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";

const INK = "#14161A";
const CREAM = "#FBF6E6";
const MINT = "#5FDDAE";
const AMBER = "#E2A43C";
const SANS = "var(--font-sora), system-ui, sans-serif";
const SERIF = "var(--font-fraunces), Georgia, serif";
const GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/** Where the film lives. It's in /public for now; point this at a bucket URL to move it out of the repo. */
export const REEL_SRC = "/shorty-in-action.mp4";
export const REEL_POSTER = "/shorty-in-action-poster.jpg";

/** Start times (seconds) of each part of the film. */
const CHAPTERS = [
  { at: 0, label: "Meet Shorty" },
  { at: 8, label: "At work" },
  { at: 43, label: "Orders & payments" },
  { at: 57, label: "Email & texts" },
  { at: 68, label: "AI agents" },
  { at: 79, label: "Watch this" },
  { at: 99, label: "Does it all" },
] as const;

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/* ── The street scene (SVG, 1200x520; phones crop the middle of it) ───────── */
const WIN = (x: number, y: number, cols: number, rows: number, w = 16, h = 22, gap = 14) =>
  Array.from({ length: cols * rows }, (_, i) => (
    <rect key={`${x}${y}${i}`} x={x + (i % cols) * (w + gap)} y={y + Math.floor(i / cols) * (h + gap)} width={w} height={h} rx={2} fill={i % 5 === 2 ? AMBER : "#FBF6E6"} stroke={INK} strokeWidth={2} />
  ));
function Building({ x, w, h, fill, cols, rows, awning }: { x: number; w: number; h: number; fill: string; cols: number; rows: number; awning?: string }) {
  const y = 400 - h;
  return (
    <g>
      <rect x={x + 6} y={y + 6} width={w} height={h} fill={INK} opacity={0.3} />
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      {WIN(x + 20, y + 26, cols, rows)}
      {awning && (
        <g>
          <path d={`M${x + 8} ${390 - 54} h${w - 16} l8 24 h-${w} z`} fill={awning} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          <rect x={x + w / 2 - 15} y={352} width={30} height={48} rx={3} fill="#FBF6E6" stroke={INK} strokeWidth={3} />
        </g>
      )}
    </g>
  );
}
function Tree({ x, s = 1 }: { x: number; s?: number }) {
  return (
    <g transform={`translate(${x} 400) scale(${s})`}>
      <rect x={-6} y={-70} width={12} height={70} fill="#A9744A" stroke={INK} strokeWidth={3} />
      <circle cx={0} cy={-92} r={38} fill="#8DB89A" stroke={INK} strokeWidth={3} />
      <circle cx={-22} cy={-72} r={24} fill="#8DB89A" stroke={INK} strokeWidth={3} />
      <circle cx={22} cy={-74} r={22} fill="#7CAA8A" stroke={INK} strokeWidth={3} />
    </g>
  );
}
function Scene() {
  return (
    <svg viewBox="0 0 1200 520" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <rect width="1200" height="520" fill="#F7E3A6" />
      <circle cx="880" cy="170" r="120" fill="#F2B84B" stroke={INK} strokeWidth={3} />
      <circle cx="200" cy="120" r="44" fill="#FBF6E6" opacity={0.8} />
      <circle cx="244" cy="132" r="32" fill="#FBF6E6" opacity={0.8} />
      <circle cx="1040" cy="70" r="30" fill="#FBF6E6" opacity={0.8} />
      <Building x={20} w={190} h={250} fill="#8FB6C9" cols={4} rows={4} />
      <Building x={230} w={170} h={310} fill="#D9946A" cols={3} rows={5} awning="#C8624A" />
      <Building x={420} w={200} h={220} fill="#8DB89A" cols={4} rows={3} awning="#E2A43C" />
      <Building x={640} w={170} h={290} fill="#C8624A" cols={3} rows={5} />
      <Building x={830} w={200} h={240} fill="#B6A5C9" cols={4} rows={3} awning="#8FB6C9" />
      <Building x={1050} w={150} h={300} fill="#F0D98C" cols={3} rows={5} />
      <Tree x={410} s={0.9} />
      <Tree x={825} s={1} />
      <rect x={-40} y={400} width={1280} height={130} fill="#8A8478" stroke={INK} strokeWidth={3} />
      <rect x={-40} y={400} width={1280} height={18} fill="#B8B1A2" stroke={INK} strokeWidth={3} />
      <path d="M-20 470 H1220" stroke="#F0D98C" strokeWidth={8} strokeDasharray="60 40" />
    </svg>
  );
}

function subscribeReduce(cb: () => void) {
  const m = window.matchMedia("(prefers-reduced-motion: reduce)");
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

/* ── The teaser ───────────────────────────────────────────────────────────── */
export function ShortyReel() {
  const [open, setOpen] = useState(false);
  const [dir, setDir] = useState<"R" | "L">("R");
  const reduce = useSyncExternalStore(subscribeReduce, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);
  const opener = useRef<HTMLButtonElement | null>(null);

  /* Shorty strolls across, turns, strolls back (one leg = 9s, matches the CSS transition). */
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setDir((d) => (d === "R" ? "L" : "R")), 9000);
    return () => clearInterval(id);
  }, [reduce]);

  const close = useCallback(() => { setOpen(false); setTimeout(() => opener.current?.focus(), 0); }, []);

  return (
    <section aria-label="Watch Shorty in action" className="bg-[#f5eddc] px-4 pb-14 pt-2 sm:px-6 md:pb-20">
      <div className="mx-auto max-w-[1120px]">
        <button
          ref={opener}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Play the film: Shorty in action"
          className="group relative block aspect-square w-full cursor-pointer overflow-hidden rounded-[28px] border-[3px] text-left md:aspect-[16/6.2]"
          style={{ borderColor: INK, boxShadow: `6px 7px 0 ${INK}`, background: "#F7E3A6" }}
        >
          <Scene />
          {/* Shorty, strolling along the street */}
          <span
            aria-hidden="true"
            className="absolute bottom-[3%] block h-[44%] w-[22%] md:bottom-[2%] md:h-[52%] md:w-[16%]"
            style={{ left: dir === "R" ? "74%" : "6%", transition: reduce ? "none" : "left 9s linear" }}
          >
            <span className="absolute inset-x-0 bottom-0 flex justify-center">
              <ShortyMascot mood={dir === "R" ? "walk" : "walkR"} size={170} still={reduce} style={{ height: "100%", width: "auto" }} />
            </span>
          </span>
          {/* the tease: a pulsing play button, with a cut-paper label */}
          <span className="absolute left-1/2 top-[34%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 md:top-[32%]">
            <span className="relative grid h-[88px] w-[88px] place-items-center md:h-[104px] md:w-[104px]">
              <span className="reel-pulse absolute inset-0 rounded-full" style={{ border: `4px solid ${MINT}` }} />
              <span className="reel-pulse reel-pulse-2 absolute inset-0 rounded-full" style={{ border: `4px solid ${MINT}` }} />
              <span className="relative grid h-full w-full place-items-center rounded-full transition-transform duration-150 group-hover:scale-105 group-active:scale-95" style={{ background: MINT, border: `3px solid ${INK}`, boxShadow: `4px 5px 0 ${INK}` }}>
                <svg viewBox="0 0 24 24" className="h-10 w-10 translate-x-[2px] md:h-12 md:w-12" fill={INK} stroke={INK} strokeWidth={1.5} strokeLinejoin="round"><path d="M7 4.5v15l13-7.5z" /></svg>
              </span>
            </span>
            <span className="relative rounded-xl px-4 py-2 text-center text-[15px] font-bold leading-tight sm:text-[17px]" style={{ background: CREAM, border: `2.5px solid ${INK}`, boxShadow: `3px 4px 0 ${INK}`, fontFamily: SERIF, color: INK }}>
              Play to see Shorty in action
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[.2] mix-blend-multiply" style={{ backgroundImage: `url("${GRAIN_URL}")` }} />
            </span>
          </span>
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[.16] mix-blend-multiply" style={{ backgroundImage: `url("${GRAIN_URL}")` }} />
        </button>
      </div>
      {open && <ReelModal onClose={close} />}
      <style>{`
        @keyframes reelPulse { 0% { transform: scale(1); opacity: .9 } 100% { transform: scale(1.7); opacity: 0 } }
        .reel-pulse { animation: reelPulse 2.2s ease-out infinite }
        .reel-pulse-2 { animation-delay: 1.1s }
        @media (prefers-reduced-motion: reduce) { .reel-pulse { animation: none; opacity: 0 } }
      `}</style>
    </section>
  );
}

/* ── The modal ────────────────────────────────────────────────────────────── */
function ReelModal({ onClose }: { onClose: () => void }) {
  const vid = useRef<HTMLVideoElement | null>(null);
  const bar = useRef<HTMLDivElement | null>(null);
  const dialog = useRef<HTMLDivElement | null>(null);
  const [now, setNow] = useState(0);
  const [dur, setDur] = useState(0);
  const [playing, setPlaying] = useState(false);

  const toggle = () => { const v = vid.current; if (!v) return; if (v.paused) v.play().catch(() => {}); else v.pause(); };
  const seek = (s: number) => { const v = vid.current; if (v) v.currentTime = Math.max(0, Math.min(v.duration || s, s)); };

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " " && e.target === dialog.current) { e.preventDefault(); toggle(); }
      if (e.key === "ArrowRight") seek((vid.current?.currentTime ?? 0) + 5);
      if (e.key === "ArrowLeft") seek((vid.current?.currentTime ?? 0) - 5);
    };
    window.addEventListener("keydown", onKey);
    const v = vid.current;
    v?.play().catch(() => setPlaying(false));   // the click that opened this lets sound play; if a browser says no, the big play button shows
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; v?.pause(); };
  }, [onClose]);

  const scrub = (clientX: number) => {
    const r = bar.current?.getBoundingClientRect(); if (!r || !dur) return;
    seek(((clientX - r.left) / r.width) * dur);
  };
  const chapter = CHAPTERS.reduce((k, c, i) => (now >= c.at ? i : k), 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm sm:p-6" onClick={onClose}>
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Shorty in action"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative h-[100dvh] w-full overflow-hidden bg-black outline-none sm:h-[min(92dvh,900px)] sm:w-auto sm:rounded-3xl sm:border-[3px]"
        style={{ aspectRatio: "9 / 16", borderColor: INK, boxShadow: `0 0 0 3px ${MINT}` }}
      >
        <video
          ref={vid}
          src={REEL_SRC}
          poster={REEL_POSTER}
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-contain"
          onClick={toggle}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
          onTimeUpdate={(e) => setNow(e.currentTarget.currentTime)}
          onEnded={() => setPlaying(false)}
        />
        {!playing && (
          <button type="button" onClick={toggle} aria-label="Play" className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full" style={{ background: MINT, border: `3px solid ${INK}`, boxShadow: `4px 5px 0 ${INK}` }}>
            <svg viewBox="0 0 24 24" className="h-9 w-9 translate-x-[2px]" fill={INK} stroke={INK} strokeWidth={1.5} strokeLinejoin="round"><path d="M7 4.5v15l13-7.5z" /></svg>
          </button>
        )}
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full" style={{ background: CREAM, border: `2.5px solid ${INK}`, boxShadow: `2px 3px 0 ${INK}` }}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        {/* chapters + progress */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent px-3 pb-4 pt-12" style={{ fontFamily: SANS }}>
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Chapters">
            {CHAPTERS.map((c, i) => (
              <button
                key={c.label}
                type="button"
                role="tab"
                aria-selected={i === chapter}
                onClick={() => { seek(c.at); vid.current?.play().catch(() => {}); }}
                className="shrink-0 rounded-full px-3 py-1.5 text-[12px] font-bold"
                style={{ background: i === chapter ? MINT : CREAM, color: INK, border: `2px solid ${INK}`, opacity: i === chapter ? 1 : 0.85 }}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 text-[12px] font-semibold text-white">
            <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: CREAM, border: `2px solid ${INK}` }}>
              {playing
                ? <svg viewBox="0 0 24 24" className="h-4 w-4" fill={INK}><path d="M7 5h3.5v14H7zM13.500 5H17v14h-3.500z" /></svg>
                : <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px]" fill={INK}><path d="M7 4.500v15l13-7.500z" /></svg>}
            </button>
            <span className="w-9 shrink-0 tabular-nums">{fmt(now)}</span>
            <div
              ref={bar}
              role="slider"
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={Math.round(dur)}
              aria-valuenow={Math.round(now)}
              tabIndex={0}
              className="relative h-8 flex-1 cursor-pointer touch-none"
              onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); scrub(e.clientX); }}
              onPointerMove={(e) => { if (e.buttons) scrub(e.clientX); }}
            >
              <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/30" />
              <div className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full" style={{ width: dur ? `${(now / dur) * 100}%` : 0, background: MINT }} />
              {dur > 0 && CHAPTERS.slice(1).map((c) => <span key={c.at} className="absolute top-1/2 h-3 w-[3px] -translate-y-1/2 rounded bg-white" style={{ left: `${(c.at / dur) * 100}%` }} />)}
              {dur > 0 && <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: `${(now / dur) * 100}%`, background: MINT, border: `2px solid ${INK}` }} />}
            </div>
            <span className="w-9 shrink-0 text-right tabular-nums">{fmt(dur)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
