"use client";
/**
 * The Instagram Reel, one 1080x1920 page driven by one clock (timeline.ts). Nothing here plays by itself:
 * window.__reelSeek(t) draws the frame for time t, and scripts/record-foodtrucks-reel.mjs steps it 1/30 s at a time.
 * (Open it with ?play=1 to just watch it run, silently, in a browser.)
 * The whole video sits on one off-white textured canvas: nothing is drawn behind him except the listing in shot 2.
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { makeRig, bodyMatrix, type RigUpdate } from "@/lib/shorty/mascot/rig";
import { GRAIN_URL } from "@/components/new-home/ShortyReel";
import { shortyPose, KNOCK_HAND } from "./poses";
import { ExtraArms } from "./Arms";
import { CAPS, CUES, CUT2, CUT3, CUT4, END_CARD_AT, FADE_OUT_AT, H, HITS, SLIDE_AT, TOTAL, W, X_STROKES } from "./timeline";

const PAPER = "#F6F2E8", INK = "#1A1C20", IVORY = "#FBF8F0", MINT = "#34D399", RED = "#E2574C";
const SANS = "'Schibsted Grotesk', 'Inter', sans-serif", SERIF = "'Instrument Serif', Georgia, serif";
const clamp01 = (k: number) => Math.max(0, Math.min(1, k));
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const easeOutBack = (k: number, s = 1.9) => 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2);
const easeOutCubic = (k: number) => 1 - Math.pow(1 - k, 3);
const easeInOut = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);

/* ── where he stands, per shot: px per rig unit, body-centre x, screen y of rig y = 0, a tilt, and an offset for the entrance ── */
type Stage = { s: number; cx: number; top: number; rot: number; dx: number; dy: number };
function stageFor(t: number): Stage {
  if (t < CUT2) {
    /* climbing in from the lower right (the 5 o'clock corner), tilted on a diagonal, leaning into frame */
    const e = easeOutCubic(seg(t, 0, 0.75)), lean = easeInOut(seg(t, 0.9, 2.6));
    return { s: 6.0 + 0.5 * lean, cx: 800, top: 640, rot: -32 + 3 * lean, dx: (1 - e) * 330, dy: (1 - e) * 420 };
  }
  const from = t < CUT3 ? CUT2 : t < CUT4 ? CUT3 : CUT4;
  const pop = 1 + 0.06 * (1 - easeOutBack(seg(t, from, from + 0.28), 2));
  if (t < CUT3) { const s = 2.0 * pop; return { s, cx: 540, top: 1430 - 228 * s, rot: 0, dx: 0, dy: 0 }; }
  if (t < CUT4) { const s = 3.2 * pop; return { s, cx: 540, top: 1325 - 228 * s, rot: 0, dx: 0, dy: 0 }; }
  const s = 3.5 * pop; return { s, cx: 540, top: 1350 - 228 * s, rot: 0, dx: 0, dy: 0 };
}

function Shorty({ t, st }: { t: number; st: Stage }) {
  const { s, rot } = st, cx = st.cx + st.dx, top = st.top + st.dy;
  const ref = useRef<SVGSVGElement>(null);
  const upd = useRef<RigUpdate | null>(null);
  useLayoutEffect(() => {
    const svg = ref.current!;
    upd.current = makeRig(svg, { boil: true });
    return () => { while (svg.firstChild) svg.removeChild(svg.firstChild); upd.current = null; };
  }, []);
  const p = useMemo(() => shortyPose(t), [t]);
  useLayoutEffect(() => { upd.current?.(p, {}); }, [p]);
  const m = bodyMatrix(p);
  const box = { position: "absolute" as const, left: cx - (63 + 95) * s, top: top - 66 * s, width: 316 * s, height: 318 * s, overflow: "visible" as const };
  return (
    <div style={{ position: "absolute", inset: 0, transform: rot ? `rotate(${rot}deg)` : undefined, transformOrigin: `${cx}px ${top + 110 * s}px` }}>
      <svg ref={ref} viewBox="-95 -66 316 318" style={box} aria-hidden />
      <svg viewBox="-95 -66 316 318" style={box} aria-hidden>
        <g transform={`translate(${p.fx.shake.toFixed(2)} 0)`}>
          <g transform={`matrix(${m.map((v) => v.toFixed(4)).join(" ")})`}>{t < CUT4 && <ExtraArms t={t} />}</g>
        </g>
      </svg>
    </div>
  );
}

const Grain = ({ o = 0.4 }: { o?: number }) => <div style={{ position: "absolute", inset: 0, backgroundImage: `url("${GRAIN_URL}")`, opacity: o, mixBlendMode: "multiply", pointerEvents: "none" }} />;

/** a few short ink lines where the knuckles land (his hand stays on his arm; these are just the knock) */
function Knock({ t, st }: { t: number; st: Stage }) {
  const { s, rot } = st, cx = st.cx + st.dx, top = st.top + st.dy;
  const pv: [number, number] = [cx, top + 110 * s], rr = (rot * Math.PI) / 180;
  const rx = 15 + KNOCK_HAND[0] - 14, ry = 100 + KNOCK_HAND[1] - 12;
  const x0 = cx + (rx - 63) * s - pv[0], y0 = top + ry * s - pv[1];
  const X = pv[0] + x0 * Math.cos(rr) - y0 * Math.sin(rr), Y = pv[1] + x0 * Math.sin(rr) + y0 * Math.cos(rr);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: W, height: H }} aria-hidden>
      {HITS.map((h, i) => {
        const d = t - h;
        if (d < 0 || d > 0.32) return null;
        const f = 1 - d / 0.32;
        return (
          <g key={i} opacity={f} stroke={INK} strokeLinecap="round" strokeWidth={9}>
            {[-70, -28, 14].map((a, k) => {
              const ar = ((a + rot - 90) * Math.PI) / 180, r0 = 120 + d * 120, r1 = r0 + 55;
              return <path key={k} d={`M${(X + Math.cos(ar) * r0).toFixed(1)} ${(Y + Math.sin(ar) * r0).toFixed(1)} L${(X + Math.cos(ar) * r1).toFixed(1)} ${(Y + Math.sin(ar) * r1).toFixed(1)}`} />;
            })}
          </g>
        );
      })}
    </svg>
  );
}

const ROWS = ["Taco Truck", "Burger Truck", "BBQ Truck", "Noodle Truck", "Crepe Truck"];
/** a generic truck-listing site: rows of names, nothing branded, no ratings, no numbers */
function Listing({ t }: { t: number }) {
  const k = easeOutCubic(seg(t, SLIDE_AT, SLIDE_AT + 0.38));
  const y = (1 - k) * 1500;
  return (
    <div style={{ position: "absolute", left: 100, top: 230 + y, width: 880, height: 700, background: "#FBFAF5", border: `5px solid ${INK}`, borderRadius: 18, boxShadow: `14px 16px 0 rgba(40,28,14,.3)`, overflow: "hidden" }}>
      <div style={{ height: 78, background: "#DAD6C9", borderBottom: `4px solid ${INK}`, display: "flex", alignItems: "center", gap: 14, padding: "0 28px" }}>
        {[0, 1, 2].map((i) => <span key={i} style={{ width: 20, height: 20, borderRadius: 20, background: "#c9c4b4", border: `3px solid ${INK}` }} />)}
        <span style={{ flex: 1, marginLeft: 16, height: 38, borderRadius: 20, background: "#F1EEE4", border: `3px solid ${INK}` }} />
      </div>
      <div style={{ padding: "22px 40px 0", fontFamily: SANS, fontWeight: 800, fontSize: 44, color: "#4a4a44" }}>Food Truck List</div>
      {ROWS.map((r, i) => (
        <div key={r} style={{ margin: "0 40px", height: 104, borderBottom: "3px solid #cfcabb", display: "flex", alignItems: "center", gap: 26, fontFamily: SANS, fontWeight: 700, fontSize: 42, color: "#55554e" }}>
          <span style={{ width: 58, height: 58, borderRadius: 12, background: ["#cfd3c4", "#d8cfc0", "#c9ccd2"][i % 3], border: "3px solid #9b988b" }} />
          <span style={{ flex: 1 }}>{r}</span>
          <span style={{ fontSize: 36, color: "#9b988b" }}>›</span>
        </div>
      ))}
    </div>
  );
}
/** a red marker, two rough strokes */
function MarkerX({ t }: { t: number }) {
  const strokes = ["M150 280 C 330 380 360 500 560 600 S 840 820 950 940", "M950 280 C 800 390 700 460 540 600 S 270 830 150 950"];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: W, height: H }} aria-hidden>
      <defs>
        <filter id="marker" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={4} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={9} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter="url(#marker)" fill="none" strokeLinecap="round">
        {strokes.map((d, i) => {
          const pr = easeInOut(seg(t, X_STROKES[i][0], X_STROKES[i][1]));
          if (pr <= 0) return null;
          return (
            <g key={i}>
              <path d={d} pathLength={1} stroke={RED} strokeWidth={50} strokeDasharray="1 1.01" strokeDashoffset={1 - pr} opacity={0.94} />
              <path d={d} pathLength={1} stroke="#c9453b" strokeWidth={9} strokeDasharray="1 1.01" strokeDashoffset={1 - pr} opacity={0.5} transform="translate(-9 -7)" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* ── captions: a dark rounded bar, 2 to 4 words at a time, key word in mint (the /foodtrucks video's format), above the bottom band ── */
const STOP = new Set("a an and are be but by do for from get hey i i'm i'll in is it me my of on or so that the they to we what when where while with you you'll you're your all this at not just".split(" "));
function Caption({ t }: { t: number }) {
  const c = CAPS.find((x) => t >= x.start && t < x.end);
  if (!c) return null;
  const words = c.text.split(" ");
  const clean = words.map((w) => w.replace(/[^\p{L}\p{N}']/gu, ""));
  let key = -1;
  clean.forEach((w, i) => { if (!STOP.has(w.toLowerCase()) && (key < 0 || w.length > clean[key].length)) key = i; });
  const k = easeOutBack(seg(t, c.start, c.start + 0.1), 1.6);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: H - 1585, display: "flex", justifyContent: "center" }}>
      <span style={{ display: "inline-block", background: "rgba(26,28,32,.92)", color: IVORY, fontFamily: SANS, fontWeight: 700, fontSize: 70, lineHeight: 1.25, padding: "0.12em 0.55em 0.16em", borderRadius: 16, whiteSpace: "nowrap", transform: `scale(${(0.94 + 0.06 * k).toFixed(3)})`, transformOrigin: "50% 100%" }}>
        {words.map((w, i) => <span key={i} style={{ color: i === key ? MINT : IVORY }}>{w}{i < words.length - 1 ? " " : ""}</span>)}
      </span>
    </div>
  );
}

function EndCard({ t }: { t: number }) {
  const k = easeOutBack(seg(t, END_CARD_AT, END_CARD_AT + 0.3), 1.6);
  if (t < END_CARD_AT) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1405, display: "flex", justifyContent: "center", transform: `translateY(${(1 - k) * 60}px) scale(${0.9 + 0.1 * k})`, opacity: clamp01(k * 1.4) }}>
      <div style={{ background: IVORY, border: `5px solid ${INK}`, borderRadius: 18, padding: "20px 40px 26px", boxShadow: `12px 14px 0 ${INK}`, transform: "rotate(-1.5deg)" }}>
        <div style={{ fontFamily: SERIF, fontSize: 84, lineHeight: 1.0, color: INK, whiteSpace: "nowrap" }}>shortlistpass.com/<span style={{ color: "#0c8f62" }}>foodtrucks</span></div>
      </div>
    </div>
  );
}

function CoverText() {
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1230, textAlign: "center", fontFamily: SERIF, fontSize: 190, lineHeight: 1.0, color: IVORY, WebkitTextStroke: `20px ${INK}`, paintOrder: "stroke fill", textShadow: `0 10px 0 ${INK}` }}>
      <span style={{ color: MINT }}>Hey.</span> Anybody here?
    </div>
  );
}

declare global { interface Window { __reelSeek?: (t: number) => void; __reelCues?: unknown; __reelReady?: boolean } }

export function Reel() {
  const [t, setT] = useState(0);
  const [cover, setCover] = useState(false);
  const [bare, setBare] = useState(false);
  /* eslint-disable react-hooks/set-state-in-effect -- reads the URL once on mount */
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    if (q.get("cover")) { setCover(true); setT(parseFloat(q.get("cover")!) || 0.9); }
    else if (q.get("t")) setT(parseFloat(q.get("t")!));
    setBare(!!q.get("bare"));
    window.__reelSeek = (x: number) => flushSync(() => setT(x));
    window.__reelCues = { total: TOTAL, cues: CUES };
    document.fonts?.ready.then(() => { window.__reelReady = true; });
    if (q.get("play")) {
      const t0 = performance.now();
      let raf = 0;
      const loop = () => { const x = ((performance.now() - t0) / 1000) % TOTAL; setT(x); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(raf);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  const st = stageFor(t);
  const rattle = HITS.reduce((m, h) => (t >= h ? m + Math.exp(-(t - h) * 9) * Math.sin((t - h) * 75) : m), 0);
  const shot = t < CUT2 ? 1 : t < CUT3 ? 2 : t < CUT4 ? 3 : 4;
  const fade = cover ? 0 : seg(t, FADE_OUT_AT, TOTAL);
  return (
    <div style={{ position: "fixed", left: 0, top: 0, width: W, height: H, overflow: "hidden", background: PAPER, zIndex: 2147483000 }} data-shot={shot}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Schibsted+Grotesk:wght@600;700;800;900&display=swap" />
      <div style={{ position: "absolute", inset: 0, transform: shot === 1 ? `translate(${(rattle * 5).toFixed(2)}px, ${(rattle * 3).toFixed(2)}px)` : undefined }}>
        {shot === 2 && (<><Listing t={t} /><MarkerX t={t} /></>)}
        <Shorty t={t} st={st} />
        {shot === 1 && <Knock t={t} st={st} />}
      </div>
      <Grain />
      {!bare && !cover && <Caption t={t} />}
      {!bare && !cover && <EndCard t={t} />}
      {cover && <CoverText />}
      <div style={{ position: "absolute", inset: 0, background: PAPER, opacity: fade, pointerEvents: "none" }} />
    </div>
  );
}
