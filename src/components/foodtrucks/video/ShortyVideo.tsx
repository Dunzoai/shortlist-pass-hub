"use client";

/**
 * The narrated explainer on /foodtrucks: four drawn scenes, Shorty's recorded voice, YouTube-style captions.
 * One clock drives everything (timeline.ts). Autoplays muted with captions when it scrolls into view, pauses when it
 * scrolls out, speaker turns voice + sound on, CC turns captions off, replay at the end.
 * Add ?ftvT=12 to the page URL to start the video at 12 s; add &ftvHold=1 to keep it paused there (for checking a frame).
 */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import { GET_A_SHORTY_URL } from "../config";
import { C, SANS, SERIF } from "../tokens";
import voice from "./voice.json";
import { LotBack, PaperDefs, TruckFront, layer } from "./art";
import { frameAt, type Frame } from "./scenes";
import { MUSIC_VOL, SFX, TOTAL, VOICE_AT, VIEW, captionAt, type VoiceId } from "./timeline";

const MemoBack = memo(LotBack);
const MemoTruck = memo(TruckFront);
const MemoShorty = memo(ShortyMascot);
const SHORTY_STYLE = { width: "100%", height: "auto", display: "block" } as const;
const Dyn = ({ children }: { children?: React.ReactNode }) => <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} style={layer} aria-hidden="true">{children}</svg>;

type Cue = { key: string; src: string; start: number; end: number; vol: number; loop?: boolean };
const CUES: Cue[] = [
  { key: "music", src: "/foodtrucks/video/bg.mp3", start: 0, end: TOTAL, vol: MUSIC_VOL, loop: true },
  ...(Object.keys(voice) as VoiceId[]).map((id) => ({ key: "v-" + id, src: `/foodtrucks/video/voice/${id}.mp3`, start: VOICE_AT[id], end: VOICE_AT[id] + voice[id].duration + 0.1, vol: 1 })),
  ...SFX.map((s) => ({ key: s.id, src: `/foodtrucks/video/sfx/${s.src}.mp3`, start: s.at, end: s.at + s.len, vol: s.vol })),
];

/** Voice, effects and music, scheduled against the video clock. Nothing is created until the visitor turns sound on. */
function useVideoAudio() {
  const els = useRef<Map<string, HTMLAudioElement>>(new Map());
  const make = () => {
    if (els.current.size) return;
    for (const c of CUES) { const a = new Audio(c.src); a.preload = "auto"; a.loop = !!c.loop; els.current.set(c.key, a); }
  };
  /** Called inside the tap that turns sound on: starts every element once so iOS lets them play later, silent. */
  const unlock = () => { make(); els.current.forEach((a) => { a.volume = 0; void a.play().catch(() => {}); }); };
  const sync = (t: number, active: boolean) => {
    if (!els.current.size) return;
    const speaking = CUES.some((c) => c.key.startsWith("v-") && t >= c.start && t < c.end);
    for (const c of CUES) {
      const a = els.current.get(c.key); if (!a) continue;
      const inside = active && t >= c.start && t < c.end;
      if (inside) {
        const want = c.loop ? (t - c.start) % (a.duration || 60) : t - c.start;
        a.volume = c.key === "music" && speaking ? c.vol * 0.7 : c.vol;
        if (a.paused) { try { a.currentTime = want; } catch { /* metadata not ready yet */ } void a.play().catch(() => {}); }
        else if (!c.loop && Math.abs(a.currentTime - want) > 0.35) { try { a.currentTime = want; } catch { /* ignore */ } }
      } else if (!a.paused) a.pause();
    }
  };
  const stop = () => els.current.forEach((a) => a.pause());
  return { unlock, sync, stop };
}

export default function ShortyVideo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);
  const [w, setW] = useState(390);
  const [cc, setCc] = useState(true);
  const [sound, setSound] = useState(false);
  const [ended, setEnded] = useState(false);
  const [reduced, setReduced] = useState(false);
  const tRef = useRef(0);
  const playing = useRef(false);
  const visible = useRef(false);
  const held = useRef(false);        // opened at a fixed time for checking
  const soundRef = useRef(false);
  const audio = useVideoAudio();
  const audioRef = useRef(audio); audioRef.current = audio;

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const q = new URLSearchParams(window.location.search).get("ftvT");
    if (q !== null && !Number.isNaN(parseFloat(q))) { tRef.current = parseFloat(q); held.current = new URLSearchParams(window.location.search).has("ftvHold"); setT(tRef.current); }
    const el = rootRef.current; if (!el) return;
    const ro = new ResizeObserver(() => setW(el.getBoundingClientRect().width || 390)); ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
      if (held.current) return;
      if (e.isIntersecting && tRef.current < TOTAL) playing.current = true; else playing.current = false;
    }, { threshold: 0.4 });
    io.observe(el);
    let raf = 0, last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      if (playing.current && !document.hidden) {
        tRef.current = Math.min(TOTAL, tRef.current + dt);
        setT(tRef.current);
        if (tRef.current >= TOTAL) { playing.current = false; setEnded(true); }
      }
      audioRef.current.sync(tRef.current, soundRef.current && playing.current);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); audioRef.current.stop(); };
  }, []);

  const toggleSound = useCallback(() => {
    const on = !soundRef.current;
    soundRef.current = on; setSound(on);
    if (on) audioRef.current.unlock(); else audioRef.current.stop();
  }, []);
  const replay = useCallback(() => { tRef.current = 0; setT(0); setEnded(false); held.current = false; playing.current = visible.current || true; audioRef.current.stop(); }, []);

  const f: Frame = useMemo(() => frameAt(t), [t]);
  const lot = f.bg === "lot";
  const cam = reduced ? { s: 1, cx: VIEW.w / 2, cy: VIEW.h / 2 } : f.cam;
  const tx = Math.min(0, Math.max(VIEW.w * (1 - cam.s), VIEW.w / 2 - cam.s * cam.cx));
  const ty = Math.min(0, Math.max(VIEW.h * (1 - cam.s), VIEW.h / 2 - cam.s * cam.cy));
  const cap = captionAt(t);
  const sh = f.shorty;
  const boxW = sh ? (sh.h * 316) / 231 : 0, boxH = sh ? (sh.h * 318) / 231 : 0;
  const capSize = Math.max(14, w * 0.043);
  const pill = { minHeight: 40, minWidth: 40, borderRadius: 999, border: "1px solid " + C.hair, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 16px -10px rgba(26,28,32,.6)", font: `800 13px ${SANS}`, color: C.ink, padding: 0 } as const;

  return (
    <div ref={rootRef} role="group" aria-label="Shorty explains what he does for a food truck, in four short scenes" style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", overflow: "hidden", borderRadius: 24, background: "#f9d6a8", boxShadow: "0 24px 48px -30px rgba(26,28,32,.55)", border: "1px solid " + C.hair, isolation: "isolate" }}>
      <PaperDefs />
      <div style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform: `translate(${(tx / VIEW.w) * 100}%, ${(ty / VIEW.h) * 100}%) scale(${cam.s})`, willChange: "transform" }}>
        <div style={{ position: "absolute", inset: 0, visibility: lot ? "visible" : "hidden" }}><MemoBack /></div>
        {lot && <Dyn>{f.behind}</Dyn>}
        <div style={{ position: "absolute", inset: 0, visibility: lot ? "visible" : "hidden" }}><MemoTruck /></div>
        <Dyn>{f.front}</Dyn>
        {f.endcard > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(26,28,32,${0.58 * f.endcard})` }} />}
        {sh && lot && (
          <div style={{ position: "absolute", left: `${((sh.fx - boxW / 2) / VIEW.w) * 100}%`, top: `${((sh.fy - 0.934 * boxH) / VIEW.h) * 100}%`, width: `${(boxW / VIEW.w) * 100}%`, transform: sh.flip ? "scaleX(-1)" : undefined, pointerEvents: "none" }}>
            <MemoShorty mood={sh.mood} holdPhone={!!sh.holdPhone} size={190} style={SHORTY_STYLE} />
          </div>
        )}
        <Dyn>{f.top}</Dyn>
      </div>

      {f.endcard > 0.02 && (
        <div style={{ position: "absolute", left: "27%", right: "3%", top: "24%", textAlign: "center", opacity: f.endcard, pointerEvents: f.endcard > 0.6 ? "auto" : "none" }}>
          <div style={{ fontFamily: SERIF, color: C.ivory, fontSize: Math.max(15, w * 0.045), lineHeight: 1.15, textShadow: "0 2px 0 rgba(0,0,0,.25)" }}>shortlistpass.com/foodtrucks</div>
          <div style={{ marginTop: w * 0.025, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={GET_A_SHORTY_URL} style={{ background: C.mint, color: C.ink, borderRadius: 999, padding: `${Math.max(8, w * 0.016)}px ${Math.max(14, w * 0.03)}px`, font: `800 ${Math.max(12, w * 0.026)}px ${SANS}`, textDecoration: "none", minHeight: 40, display: "inline-flex", alignItems: "center" }}>Get your own Shorty</a>
            {ended && <button type="button" onClick={replay} style={{ ...pill, padding: `0 ${Math.max(12, w * 0.025)}px`, background: "rgba(255,255,255,.95)", font: `800 ${Math.max(12, w * 0.026)}px ${SANS}` }}>↻ Replay</button>}
          </div>
        </div>
      )}

      {cc && cap && (
        <div aria-hidden="true" style={{ position: "absolute", left: "4%", right: "4%", bottom: "6%", textAlign: "center", pointerEvents: "none" }}>
          <span data-ftv-caption style={{ display: "inline-block", background: "rgba(26,28,32,.9)", color: C.ivory, fontFamily: SANS, fontWeight: 700, fontSize: capSize, lineHeight: 1.25, padding: "0.12em 0.55em 0.16em", borderRadius: 7, whiteSpace: "nowrap" }}>
            {cap.words.map((wd, i) => <span key={i} style={i === cap.key ? { color: C.mint } : undefined}>{wd}{i < cap.words.length - 1 ? " " : ""}</span>)}
          </span>
        </div>
      )}

      <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 8, zIndex: 3 }}>
        <button type="button" aria-label={cc ? "Turn captions off" : "Turn captions on"} aria-pressed={cc} onClick={() => setCc((v) => !v)} style={{ ...pill, background: cc ? C.mint : "rgba(255,255,255,.92)", padding: "0 12px" }}>CC</button>
        <button type="button" aria-label={sound ? "Turn sound off" : "Turn sound on"} aria-pressed={sound} onClick={toggleSound} style={{ ...pill, background: sound ? C.mint : "rgba(255,255,255,.92)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" fill={sound ? C.ink : "none"} />
            {sound ? <path d="M16 9 Q18.5 12 16 15 M18.5 6.5 Q23 12 18.5 17.5" /> : <path d="M17 9 L22 15 M22 9 L17 15" />}
          </svg>
        </button>
      </div>
      <div aria-hidden="true" data-ftv-progress style={{ position: "absolute", left: 0, bottom: 0, height: 3, width: `${(t / TOTAL) * 100}%`, background: C.mint, zIndex: 3 }} />
      <p style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        {(Object.keys(voice) as VoiceId[]).map((id) => voice[id].text).join(" ")}
      </p>
    </div>
  );
}
