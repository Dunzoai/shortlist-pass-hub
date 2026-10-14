"use client";
/**
 * The Instagram Reel, one 1080x1920 page driven by one clock (timeline.ts). Nothing here plays by itself:
 * window.__reelSeek(t) draws the frame for time t, and scripts/record-foodtrucks-reel.mjs steps it 1/30 s at a time.
 * (Open it with ?play=1 to just watch it run, silently, in a browser.)
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { makeRig, bodyMatrix, type RigUpdate } from "@/lib/shorty/mascot/rig";
import { GRAIN_URL } from "@/components/new-home/ShortyReel";
import { LotBack, TruckFront, PaperDefs } from "@/components/foodtrucks/video/art";
import { shortyPose } from "./poses";
import { ExtraArms, Glove } from "./Arms";
import {
  CAPS, CUES, CUT2, CUT3, CUT4, END_CARD_AT, FADE_OUT_AT, H, HITS, SLIDE_AT, TOTAL, W, X_STROKES,
} from "./timeline";

const INK = "#1A1C20", IVORY = "#FBF8F0", MINT = "#34D399", AMBER = "#E2A43C", RED = "#E2574C";
const SANS = "'Schibsted Grotesk', 'Inter', sans-serif", SERIF = "'Instrument Serif', Georgia, serif";
const clamp01 = (k: number) => Math.max(0, Math.min(1, k));
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const easeOutBack = (k: number, s = 1.9) => 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2);
const easeOutCubic = (k: number) => 1 - Math.pow(1 - k, 3);
const easeInOut = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
const mix = (a: number, b: number, k: number) => a + (b - a) * k;

/* ── where he stands, per shot (px per rig unit, body-centre x, and the screen y of rig y = 0) ── */
function stageFor(t: number) {
  if (t < CUT2) { const s = mix(7.2, 9.2, easeInOut(seg(t, 1.0, 2.2))); return { s, cx: 540, top: 760 - 45 * s }; }
  const pop = 1 + 0.07 * (1 - easeOutBack(seg(t, t < CUT3 ? CUT2 : t < CUT4 ? CUT3 : CUT4, (t < CUT3 ? CUT2 : t < CUT4 ? CUT3 : CUT4) + 0.28), 2));
  if (t < CUT3) { const s = 3.3 * pop; return { s, cx: 540, top: 1340 - 228 * s }; }
  if (t < CUT4) { const s = 3.2 * pop; return { s, cx: 540, top: 1325 - 228 * s }; }
  const s = 3.1 * pop; return { s, cx: 790, top: 1340 - 228 * s };
}

function Shorty({ t, s, cx, top }: { t: number; s: number; cx: number; top: number }) {
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
    <>
      <svg ref={ref} viewBox="-95 -66 316 318" style={box} aria-hidden />
      <svg viewBox="-95 -66 316 318" style={box} aria-hidden>
        <g transform={`translate(${p.fx.shake.toFixed(2)} 0)`}>
          <g transform={`matrix(${m.map((v) => v.toFixed(4)).join(" ")})`}><ExtraArms t={t} /></g>
        </g>
      </svg>
    </>
  );
}

/* ── backgrounds ── */
const Grain = ({ o = 0.35 }: { o?: number }) => <div style={{ position: "absolute", inset: 0, backgroundImage: `url("${GRAIN_URL}")`, opacity: o, mixBlendMode: "multiply", pointerEvents: "none" }} />;

function GlassShot() {
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 48% at 50% 40%, #3a3326 0%, #1f2127 45%, #0b0c0e 100%)` }} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 420, height: 700, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(226,164,60,.34), rgba(226,164,60,0))" }} />
    </>
  );
}
function GlassOver({ t }: { t: number }) {
  const flash = HITS.reduce((m, h) => Math.max(m, t >= h ? Math.exp(-(t - h) * 12) : 0), 0);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(112deg, rgba(255,255,255,0) 28%, rgba(255,255,255,.075) 34%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 58%, rgba(255,255,255,.05) 62%, rgba(255,255,255,0) 66%)" }} />
      <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 0 26px #090a0c, inset 0 0 0 31px rgba(255,255,255,.1), inset 0 0 160px 40px rgba(0,0,0,.55)" }} />
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: 0.09 * flash }} />
    </>
  );
}
/** the smack: a burst around the hand, a ring that runs out across the glass, a few cracks */
function Impact({ t, s, cx, top }: { t: number; s: number; cx: number; top: number }) {
  const spots: Array<[number, number]> = [[108, 68], [18, 68]];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: W, height: H }} aria-hidden>
      {HITS.map((h, i) => {
        const d = t - h;
        if (d < 0 || d > 0.6) return null;
        const x = cx + (spots[i][0] - 63) * s, y = top + spots[i][1] * s;
        const fade = 1 - d / 0.6, r = 70 + d * 520;
        return (
          <g key={i}>
          <g opacity={fade} stroke="#fbf6e6" strokeLinecap="round" fill="none">
            <ellipse cx={x} cy={y} rx={r} ry={r * 0.82} strokeWidth={6 * fade + 1} opacity={0.7} />
            <ellipse cx={x} cy={y} rx={r * 0.62} ry={r * 0.5} strokeWidth={3} opacity={0.5} />
            {Array.from({ length: 11 }, (_, k) => {
              const a = (k / 11) * Math.PI * 2 + i, r0 = 120 + (k % 3) * 18 + d * 80, r1 = r0 + 70 + (k % 2) * 60;
              return <path key={k} d={`M${(x + Math.cos(a) * r0).toFixed(1)} ${(y + Math.sin(a) * r0).toFixed(1)} L${(x + Math.cos(a) * r1).toFixed(1)} ${(y + Math.sin(a) * r1).toFixed(1)}`} strokeWidth={9} />;
            })}
            {Array.from({ length: 5 }, (_, k) => {
              const a = (k / 5) * Math.PI * 2 + 0.5 + i, pts = [0, 1, 2, 3].map((j) => `${(x + Math.cos(a + j * 0.09) * (70 + j * 62)).toFixed(1)} ${(y + Math.sin(a - j * 0.07) * (60 + j * 56)).toFixed(1)}`);
              return <path key={"c" + k} d={"M" + pts.join(" L")} strokeWidth={2.4} opacity={0.65} />;
            })}
          </g>
          </g>
        );
      })}
      {HITS.map((h, i) => {
        const reach = seg(t, h - 0.14, h), away = seg(t, h + 0.16, h + 0.42), k = reach * (1 - away);
        if (k <= 0) return null;
        const x = cx + (spots[i][0] - 63) * s, y = top + spots[i][1] * s, sc = s * (1 + 0.6 * easeOutCubic(k));
        return <g key={"g" + i} transform={`translate(${x.toFixed(1)} ${(y + 70).toFixed(1)}) rotate(${i === 0 ? -86 : -94}) scale(${sc.toFixed(2)} ${(i === 0 ? sc : -sc).toFixed(2)})`}><Glove fist={false} /></g>;
      })}
    </svg>
  );
}

const ROWS = ["Taco Truck", "Burger Truck", "BBQ Truck", "Noodle Truck", "Crepe Truck", "Coffee Truck"];
/** a generic truck-listing site: rows of names, nothing branded, no ratings, no numbers */
function Listing({ t }: { t: number }) {
  const k = easeOutCubic(seg(t, SLIDE_AT, SLIDE_AT + 0.38));
  const y = (1 - k) * 1500;
  return (
    <div style={{ position: "absolute", left: 100, top: 270 + y, width: 880, height: 900, background: "#F1EEE4", border: `5px solid ${INK}`, borderRadius: 18, boxShadow: `14px 16px 0 rgba(40,28,14,.35)`, overflow: "hidden" }}>
      <div style={{ height: 78, background: "#DAD6C9", borderBottom: `4px solid ${INK}`, display: "flex", alignItems: "center", gap: 14, padding: "0 28px" }}>
        {["#c9c4b4", "#c9c4b4", "#c9c4b4"].map((c, i) => <span key={i} style={{ width: 20, height: 20, borderRadius: 20, background: c, border: `3px solid ${INK}` }} />)}
        <span style={{ flex: 1, marginLeft: 16, height: 38, borderRadius: 20, background: "#F1EEE4", border: `3px solid ${INK}` }} />
      </div>
      <div style={{ padding: "26px 40px 0", fontFamily: SANS, fontWeight: 800, fontSize: 44, color: "#4a4a44" }}>Food Truck List</div>
      {ROWS.map((r, i) => (
        <div key={r} style={{ margin: "0 40px", height: 112, borderBottom: "3px solid #cfcabb", display: "flex", alignItems: "center", gap: 26, fontFamily: SANS, fontWeight: 700, fontSize: 44, color: "#55554e" }}>
          <span style={{ width: 62, height: 62, borderRadius: 12, background: ["#cfd3c4", "#d8cfc0", "#c9ccd2"][i % 3], border: "3px solid #9b988b" }} />
          <span style={{ flex: 1 }}>{r}</span>
          <span style={{ fontSize: 36, color: "#9b988b" }}>›</span>
        </div>
      ))}
    </div>
  );
}
/** a red marker, two rough strokes */
function MarkerX({ t }: { t: number }) {
  const strokes = ["M150 330 C 330 420 360 560 560 690 S 840 900 940 1050", "M940 330 C 800 450 700 520 540 690 S 270 930 150 1060"];
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

function Rays({ t }: { t: number }) {
  const n = 22;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: W, height: H }} aria-hidden>
      <rect width={W} height={H} fill={MINT} />
      <g transform={`translate(540 960) rotate(${t * 3})`}>
        {Array.from({ length: n }, (_, i) => {
          const a0 = (i / n) * 360, a1 = a0 + 360 / n / 2;
          const p = (a: number, r: number) => `${(Math.cos((a * Math.PI) / 180) * r).toFixed(1)} ${(Math.sin((a * Math.PI) / 180) * r).toFixed(1)}`;
          return <path key={i} d={`M0 0 L${p(a0, 1500)} L${p(a1, 1500)} Z`} fill="#fbf8f0" opacity={0.2} />;
        })}
      </g>
      <circle cx={540} cy={960} r={470} fill="#2fc38d" opacity={0.55} />
    </svg>
  );
}

function Lot() {
  /* the site's own truck scene (the same paper pieces as the explainer), sized so the wheels sit on the ground Shorty stands on */
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#f9d6a8" }} />
      <div style={{ position: "absolute", left: -700, top: 319, width: 1900, height: 1070 }}>
        <LotBack />
        <TruckFront />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1385, bottom: 0, background: "#e2b585" }} />
      <PaperDefs />
    </>
  );
}

/* ── captions: 2 to 4 words, big, just above the bottom safe band ── */
const STOP = new Set("a an and are be but by do for from get hey i i'm i'll in is it me my of on or so that the they to we what when where while with you you'll you're your all this at".split(" "));
function Caption({ t }: { t: number }) {
  const c = CAPS.find((x) => t >= x.start && t < x.end);
  if (!c) return null;
  const words = c.text.split(" ");
  const clean = words.map((w) => w.replace(/[^\p{L}\p{N}']/gu, ""));
  let key = -1;
  clean.forEach((w, i) => { if (!STOP.has(w.toLowerCase()) && (key < 0 || w.length > clean[key].length)) key = i; });
  const chars = c.text.length;
  const size = chars <= 11 ? 132 : chars <= 15 ? 120 : chars <= 19 ? 104 : 92;
  const k = easeOutBack(seg(t, c.start, c.start + 0.13), 2.2);
  return (
    <div style={{ position: "absolute", left: 40, right: 40, bottom: H - 1560, display: "flex", justifyContent: "center", transform: `scale(${(0.8 + 0.2 * k).toFixed(3)})`, transformOrigin: "50% 100%", opacity: Math.min(1, seg(t, c.start, c.start + 0.05) * 1.5) }}>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: size, lineHeight: 1.0, letterSpacing: "-0.01em", textAlign: "center", color: IVORY, WebkitTextStroke: `${Math.round(size * 0.16)}px ${INK}`, paintOrder: "stroke fill", textShadow: `0 ${Math.round(size * 0.07)}px 0 ${INK}`, textTransform: "uppercase" }}>
        {words.map((w, i) => <span key={i} style={{ color: i === key ? MINT : IVORY }}>{w}{i < words.length - 1 ? " " : ""}</span>)}
      </div>
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

export const HOOK = "Hey. How many times you answering 'where y'all at today' this week?";
function CoverText() {
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1130, textAlign: "center", fontFamily: SERIF, fontSize: 108, lineHeight: 1.06, color: IVORY, WebkitTextStroke: `16px ${INK}`, paintOrder: "stroke fill", textShadow: `0 8px 0 ${INK}` }}>
      <span style={{ color: AMBER }}>Hey.</span> How many times you answering <span style={{ color: MINT }}>&lsquo;where y&rsquo;all at today&rsquo;</span> this week?
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
    if (q.get("cover")) { setCover(true); setT(parseFloat(q.get("cover")!) || 0.2); }
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
  const rattle = HITS.reduce((m, h) => (t >= h ? m + Math.exp(-(t - h) * 6) * Math.sin((t - h) * 75) : m), 0);
  const shot = t < CUT2 ? 1 : t < CUT3 ? 2 : t < CUT4 ? 3 : 4;
  const fade = cover ? 0 : seg(t, FADE_OUT_AT, TOTAL);
  return (
    <div style={{ position: "fixed", left: 0, top: 0, width: W, height: H, overflow: "hidden", background: INK, zIndex: 2147483000 }} data-shot={shot}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Schibsted+Grotesk:wght@600;700;800;900&display=swap" />
      <div style={{ position: "absolute", inset: 0, transform: shot === 1 ? `translate(${(rattle * 11).toFixed(2)}px, ${(rattle * 7).toFixed(2)}px) rotate(${(rattle * 0.35).toFixed(3)}deg) scale(1.035)` : undefined }}>
        {shot === 1 && <GlassShot />}
        {shot === 2 && (<><div style={{ position: "absolute", inset: 0, background: IVORY }} /><Listing t={t} /><MarkerX t={t} /></>)}
        {shot === 3 && <Rays t={t} />}
        {shot === 4 && <Lot />}
        <Shorty t={t} {...st} />
        {shot === 1 && (<><Impact t={t} {...st} /><GlassOver t={t} /></>)}
      </div>
      <Grain o={shot === 1 ? 0.22 : 0.3} />
      {!bare && !cover && <Caption t={t} />}
      {!bare && !cover && <EndCard t={t} />}
      {cover && <CoverText />}
      <div style={{ position: "absolute", inset: 0, background: INK, opacity: fade, pointerEvents: "none" }} />
    </div>
  );
}
