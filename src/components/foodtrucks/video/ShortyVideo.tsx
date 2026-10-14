"use client";

/**
 * The narrated explainer on /foodtrucks: four drawn scenes, Shorty's recorded voice, YouTube-style captions.
 * One clock drives everything (timeline.ts). Autoplays muted with captions when it scrolls into view, pauses when it
 * scrolls out. Controls: play/pause, a scrubber with one chapter per scene, time, CC, speaker, fullscreen; keyboard and touch.
 * The end screen has Replay and Share. /foodtrucks#watch scrolls here and plays from the start.
 * URL options for checking: ?ftvT=12 starts at 12 s, &ftvHold=1 keeps it paused there, &ftvBare=1 hides the controls; ?ftvCapture=wide|tall is the mp4
 * recording layout (no controls, driven by window.__ftvSeek) used by scripts/record-foodtrucks-video.mjs.
 */
import { memo, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import { C, SANS, SERIF } from "../tokens";
import voice from "./voice.json";
import { LotBack, PaperDefs, TruckFront, layer } from "./art";
import { frameAt, type Frame } from "./scenes";
import { CHAPTERS, MUSIC_VOL, SFX, TOTAL, VOICE_AT, VIEW, captionAt, type VoiceId } from "./timeline";

const MemoBack = memo(LotBack);
const MemoTruck = memo(TruckFront);
const MemoShorty = memo(ShortyMascot);
const SHORTY_STYLE = { width: "100%", height: "auto", display: "block" } as const;
const Dyn = ({ children }: { children?: React.ReactNode }) => <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} style={layer} aria-hidden="true">{children}</svg>;
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const chapterAt = (t: number) => { let c = CHAPTERS[0]; for (const x of CHAPTERS) if (t >= x.at) c = x; return c; };

type Cue = { key: string; src: string; start: number; end: number; vol: number; loop?: boolean };
const CUES: Cue[] = [
  { key: "music", src: "/foodtrucks/video/bg.mp3", start: 0, end: TOTAL, vol: MUSIC_VOL, loop: true },
  ...(Object.keys(voice) as VoiceId[]).map((id) => ({ key: "v-" + id, src: `/foodtrucks/video/voice/${id}.mp3`, start: VOICE_AT[id], end: VOICE_AT[id] + voice[id].duration + 0.1, vol: 1 })),
  ...SFX.map((s) => ({ key: s.id, src: `/foodtrucks/video/sfx/${s.src}.mp3`, start: s.at, end: s.at + s.len, vol: s.vol, loop: s.loop })),
];

/** Voice, effects and music, scheduled against the video clock. Nothing is created until the visitor turns sound on. */
function useVideoAudio() {
  return useMemo(() => {
    const els = new Map<string, HTMLAudioElement>();
    const armed = new Set<string>();   // cues already placed at the right point of their file this time through
    /** Called inside the tap that turns sound on: starts every element once so iOS lets them play later, silent. */
    const unlock = () => {
      if (!els.size) for (const c of CUES) { const a = new Audio(c.src); a.preload = "auto"; a.loop = !!c.loop; els.set(c.key, a); }
      els.forEach((a) => { a.volume = 0; void a.play().catch(() => {}); });
    };
    const sync = (t: number, active: boolean) => {
      if (!els.size) return;
      const speaking = CUES.some((c) => c.key.startsWith("v-") && t >= c.start && t < c.end);
      for (const c of CUES) {
        const a = els.get(c.key); if (!a) continue;
        const inside = active && t >= c.start && t < c.end;
        if (!inside) { if (!a.paused) a.pause(); armed.delete(c.key); continue; }
        const want = c.loop ? (t - c.start) % (a.duration || 60) : t - c.start;
        a.volume = c.key === "music" && speaking ? c.vol * 0.7 : c.vol;
        if (!armed.has(c.key)) {
          if (a.readyState >= 1) {   // metadata is in: put it at the matching point (music joins mid-song, not from zero)
            try { a.currentTime = want; armed.add(c.key); } catch { /* try again next frame */ }
          }
          if (a.paused) void a.play().catch(() => {});
        } else {
          if (a.paused) void a.play().catch(() => {});
          else if (!c.loop && Math.abs(a.currentTime - want) > 0.35) { try { a.currentTime = want; } catch { /* ignore */ } }
        }
      }
    };
    const stop = () => { els.forEach((a) => a.pause()); armed.clear(); };
    return { unlock, sync, stop };
  }, []);
}

const reducedQuery = "(prefers-reduced-motion: reduce)";
const subReduced = (cb: () => void) => { const m = window.matchMedia(reducedQuery); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); };

export default function ShortyVideo() {
  const outerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);
  const [w, setW] = useState(390);
  const [cc, setCc] = useState(true);
  const [sound, setSound] = useState(false);
  const [ended, setEnded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [controlsOn, setControlsOn] = useState(false);
  const [fs, setFs] = useState(false);
  const [hover, setHover] = useState<{ f: number; drag: boolean } | null>(null);
  const [toast, setToast] = useState("");
  const [capture, setCapture] = useState<"" | "wide" | "tall">("");
  const [bare, setBare] = useState(false);
  const reduced = useSyncExternalStore(subReduced, () => window.matchMedia(reducedQuery).matches, () => false);
  const tRef = useRef(0);
  const playing = useRef(false);
  const visible = useRef(false);
  const held = useRef(false);          // opened at a fixed time for checking, or the recording layout
  const userPaused = useRef(false);
  const soundRef = useRef(false);
  const pending = useRef<number | null>(null);
  const hideTimer = useRef(0);
  const hoverTimer = useRef(0);
  const toastTimer = useRef(0);
  const audio = useVideoAudio();

  const setPlaying = useCallback((p: boolean) => { playing.current = p; setIsPlaying(p); }, []);
  const syncPlaying = useCallback(() => setPlaying(visible.current && !userPaused.current && !held.current && tRef.current < TOTAL), [setPlaying]);
  const seek = useCallback((time: number) => {
    const next = Math.max(0, Math.min(TOTAL, time));
    tRef.current = next; setT(next);
    setEnded(next >= TOTAL);
    if (next >= TOTAL) setPlaying(false); else if (visible.current && !held.current && !userPaused.current) setPlaying(true);
  }, [setPlaying]);
  const startOver = useCallback(() => { userPaused.current = false; held.current = false; audio.stop(); seek(0); }, [seek, audio]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cap = params.get("ftvCapture");
    if (cap === "wide" || cap === "tall") { pending.current = parseFloat(params.get("ftvT") ?? "0") || 0; held.current = true; window.requestAnimationFrame(() => setCapture(cap)); }
    if (params.has("ftvBare")) window.requestAnimationFrame(() => setBare(true));
    const q = params.get("ftvT");
    if (!cap && q !== null && !Number.isNaN(parseFloat(q))) { pending.current = parseFloat(q); held.current = params.has("ftvHold"); }
    const el = rootRef.current; if (!el) return;
    const ro = new ResizeObserver(() => setW(el.getBoundingClientRect().width || 390)); ro.observe(el);
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; syncPlaying(); }, { threshold: 0.4 });
    if (!cap) io.observe(el);
    let raf = 0, last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      if (pending.current !== null) { const p = pending.current; pending.current = null; tRef.current = p; setT(p); }
      if (playing.current && !document.hidden) {
        tRef.current = Math.min(TOTAL, tRef.current + dt);
        setT(tRef.current);
        if (tRef.current >= TOTAL) { playing.current = false; setIsPlaying(false); setEnded(true); }
      }
      audio.sync(tRef.current, soundRef.current && playing.current);
    };
    raf = requestAnimationFrame(loop);
    /* the recording script sets the clock frame by frame */
    (window as unknown as { __ftvSeek?: (s: number) => void }).__ftvSeek = (s: number) => { tRef.current = s; flushSync(() => setT(s)); };
    (window as unknown as { __ftvCues?: unknown }).__ftvCues = { total: TOTAL, cues: CUES, voice: VOICE_AT };
    /* /foodtrucks#watch: scroll to the video and play it from the start */
    const watch = () => {
      if (window.location.hash !== "#watch") return;
      userPaused.current = false; held.current = false;
      tRef.current = 0; setT(0); setEnded(false);
      el.scrollIntoView({ block: "center" });
      syncPlaying();
    };
    watch(); window.addEventListener("hashchange", watch);
    const onFs = () => setFs(!!document.fullscreenElement && document.fullscreenElement === outerRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); audio.stop();
      window.removeEventListener("hashchange", watch); document.removeEventListener("fullscreenchange", onFs);
      window.clearTimeout(hideTimer.current); window.clearTimeout(hoverTimer.current); window.clearTimeout(toastTimer.current);
    };
  }, [syncPlaying, audio]);

  const toggleSound = useCallback(() => {
    const on = !soundRef.current;
    soundRef.current = on; setSound(on);
    if (on) audio.unlock(); else audio.stop();
  }, [audio]);
  const togglePlay = useCallback(() => {
    if (tRef.current >= TOTAL) { startOver(); return; }
    userPaused.current = playing.current; held.current = false; syncPlaying();
    if (!playing.current) audio.stop();
  }, [startOver, syncPlaying, audio]);
  const showControls = useCallback(() => {
    setControlsOn(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => { if (playing.current) setControlsOn(false); }, 2800);
  }, []);
  const toggleFs = useCallback(() => {
    const el = outerRef.current; if (!el) return;
    const d = document as Document & { webkitExitFullscreen?: () => void };
    if (fs) { if (document.fullscreenElement) void document.exitFullscreen?.(); else d.webkitExitFullscreen?.(); setFs(false); return; }
    if (document.fullscreenEnabled && el.requestFullscreen) { el.requestFullscreen().then(() => setFs(true)).catch(() => setFs(true)); } else setFs(true);   // phones without element fullscreen: fill the screen in the page
  }, [fs]);
  const flash = (msg: string) => { setToast(msg); window.clearTimeout(toastTimer.current); toastTimer.current = window.setTimeout(() => setToast(""), 2200); };
  const share = useCallback(async () => {
    const url = `${window.location.origin}/foodtrucks#watch`;
    if (typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches) {
      try { await navigator.share({ title: "Shorty for food trucks", url }); return; } catch (e) { if ((e as Error).name === "AbortError") return; }
    }
    try { await navigator.clipboard.writeText(url); } catch {
      const ta = document.createElement("textarea"); ta.value = url; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch { /* nothing else to try */ }
      ta.remove();
    }
    flash("Link copied");
  }, []);

  /* scrubber */
  const barRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const fracOf = (e: React.PointerEvent) => { const r = barRef.current!.getBoundingClientRect(); return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); };
  const onBarDown = (e: React.PointerEvent) => { e.preventDefault(); barRef.current!.setPointerCapture(e.pointerId); dragging.current = true; const f = fracOf(e); setHover({ f, drag: true }); seek(f * TOTAL); showControls(); };
  const onBarMove = (e: React.PointerEvent) => { const f = fracOf(e); setHover({ f, drag: dragging.current }); if (dragging.current) seek(f * TOTAL); };
  const onBarUp = () => { dragging.current = false; window.clearTimeout(hoverTimer.current); hoverTimer.current = window.setTimeout(() => setHover(null), 1400); };

  const onKey = (e: React.KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    const k = e.key;
    if ((k === " " || k === "Enter") && tag === "BUTTON") return;   // let a focused button do its own thing
    let used = true;
    if (k === " " || k === "k") togglePlay();
    else if (k === "ArrowRight") seek(tRef.current + 5);
    else if (k === "ArrowLeft") seek(tRef.current - 5);
    else if (k === "Home") seek(0);
    else if (k === "End") seek(TOTAL - 0.1);
    else if (k === "m") toggleSound();
    else if (k === "c") setCc((v) => !v);
    else if (k === "f") toggleFs();
    else if (/^[1-4]$/.test(k)) seek(CHAPTERS[+k - 1].at);
    else used = false;
    if (used) { e.preventDefault(); showControls(); }
  };

  const f: Frame = useMemo(() => frameAt(t), [t]);
  const lot = f.bg === "lot";
  const cam = reduced ? { s: 1, cx: VIEW.w / 2, cy: VIEW.h / 2 } : f.cam;
  const tx = Math.min(0, Math.max(VIEW.w * (1 - cam.s), VIEW.w / 2 - cam.s * cam.cx));
  const ty = Math.min(0, Math.max(VIEW.h * (1 - cam.s), VIEW.h / 2 - cam.s * cam.cy));
  const cap = captionAt(t);
  const sh = f.shorty;
  const boxW = sh ? (sh.h * 316) / 231 : 0, boxH = sh ? (sh.h * 318) / 231 : 0;
  const capSize = capture === "tall" ? Math.max(14, w * 0.062) : Math.max(14, w * 0.043);
  const showUi = !capture;
  const barOn = showUi && !bare && (controlsOn || !isPlaying);
  const sz = w < 520 ? 34 : 40;
  const circle = { minHeight: sz, minWidth: sz, borderRadius: 999, border: "1px solid " + C.hair, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 16px -10px rgba(26,28,32,.6)", font: `800 13px ${SANS}`, color: C.ink, padding: 0 } as const;
  const ico = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: C.ink, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;
  const tipCh = hover ? chapterAt(hover.f * TOTAL) : null;
  const fullFs = fs && !capture;
  const stageW = fullFs ? "min(100vw, calc(100vh * 16 / 9))" : capture === "wide" ? "100vw" : capture === "tall" ? "100vw" : "100%";

  const stage = (
    <div
      ref={rootRef} id="watch" role="group" aria-label="Shorty explains what he does for a food truck, in four short scenes" tabIndex={0}
      onKeyDown={onKey} onPointerMove={(e) => { if (showUi && e.pointerType === "mouse") showControls(); }}
      onPointerDown={(e) => { if (!showUi) return; if (e.pointerType === "mouse") { if ((e.target as HTMLElement).closest("button,a,[data-ftv-bar]")) return; togglePlay(); } showControls(); }}
      onFocus={() => showUi && showControls()}
      style={{ position: "relative", width: stageW, aspectRatio: "16 / 9", overflow: "hidden", borderRadius: fullFs || capture ? 0 : 24, background: "#f9d6a8", boxShadow: fullFs || capture ? "none" : "0 24px 48px -30px rgba(26,28,32,.55)", border: fullFs || capture ? 0 : "1px solid " + C.hair, isolation: "isolate", scrollMarginTop: 90, outlineOffset: 3, touchAction: "manipulation" }}
    >
      <PaperDefs />
      {capture && <style>{"nextjs-portal{display:none!important}"}</style>}
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
        <div style={{ position: "absolute", left: "27%", right: "3%", top: "26%", textAlign: "center", opacity: f.endcard, pointerEvents: f.endcard > 0.6 ? "auto" : "none" }}>
          <div style={{ fontFamily: SERIF, color: C.ivory, fontSize: Math.max(15, w * 0.045), lineHeight: 1.15, textShadow: "0 2px 0 rgba(0,0,0,.25)" }}>shortlistpass.com/foodtrucks</div>
          {showUi && (
            <div style={{ marginTop: w * 0.03, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button type="button" onClick={startOver} style={{ ...circle, padding: `0 ${Math.max(14, w * 0.03)}px`, background: C.mint, font: `800 ${Math.max(13, w * 0.026)}px ${SANS}` }}>↻ Replay</button>
              <button type="button" onClick={() => void share()} style={{ ...circle, padding: `0 ${Math.max(14, w * 0.03)}px`, background: "rgba(255,255,255,.95)", font: `800 ${Math.max(13, w * 0.026)}px ${SANS}` }}>Share</button>
            </div>
          )}
        </div>
      )}

      {cc && cap && capture !== "tall" && (
        <div aria-hidden="true" style={{ position: "absolute", left: "4%", right: "4%", bottom: barOn ? "22%" : "6%", textAlign: "center", pointerEvents: "none", transition: "bottom .2s" }}>
          <span data-ftv-caption style={{ display: "inline-block", background: "rgba(26,28,32,.9)", color: C.ivory, fontFamily: SANS, fontWeight: 700, fontSize: capSize, lineHeight: 1.25, padding: "0.12em 0.55em 0.16em", borderRadius: 7, whiteSpace: "nowrap" }}>
            {cap.words.map((wd, i) => <span key={i} style={i === cap.key ? { color: C.mint } : undefined}>{wd}{i < cap.words.length - 1 ? " " : ""}</span>)}
          </span>
        </div>
      )}

      {showUi && (
        <>
          {!sound && !barOn && (
            <button type="button" aria-label="Turn sound on" onClick={toggleSound} style={{ ...circle, position: "absolute", top: 10, right: 10, zIndex: 3, background: "rgba(255,255,255,.92)" }}>
              <svg {...ico}><path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" /><path d="M17 9 L22 15 M22 9 L17 15" /></svg>
            </button>
          )}

          <div data-ftv-controls style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 3, padding: "18px 8px 4px", background: "linear-gradient(transparent, rgba(26,28,32,.78))", opacity: barOn ? 1 : 0, transition: "opacity .2s", pointerEvents: barOn ? "auto" : "none" }}>
            <div
              ref={barRef} data-ftv-bar role="slider" aria-label="Video position" aria-valuemin={0} aria-valuemax={Math.round(TOTAL)} aria-valuenow={Math.round(t)} aria-valuetext={`${chapterAt(t).label}, ${fmt(t)} of ${fmt(TOTAL)}`}
              onPointerDown={onBarDown} onPointerMove={onBarMove} onPointerUp={onBarUp} onPointerCancel={onBarUp} onPointerLeave={() => { if (!dragging.current) setHover(null); }}
              style={{ position: "relative", height: 22, cursor: "pointer", touchAction: "none", display: "flex", alignItems: "center" }}
            >
              {CHAPTERS.map((c, i) => {
                const next = i + 1 < CHAPTERS.length ? CHAPTERS[i + 1].at : TOTAL;
                const done = Math.max(0, Math.min(1, (t - c.at) / (next - c.at)));
                return (
                  <div key={c.label} style={{ position: "absolute", left: `${(c.at / TOTAL) * 100}%`, width: `calc(${((next - c.at) / TOTAL) * 100}% - 3px)`, height: hover ? 7 : 5, borderRadius: 3, background: "rgba(255,255,255,.38)", overflow: "hidden", transition: "height .12s" }}>
                    <div style={{ width: `${done * 100}%`, height: "100%", background: C.mint }} />
                  </div>
                );
              })}
              <div style={{ position: "absolute", left: `calc(${(t / TOTAL) * 100}% - 7px)`, width: 14, height: 14, borderRadius: 99, background: C.mint, border: "2px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,.4)", opacity: hover ? 1 : 0, transition: "opacity .12s", pointerEvents: "none" }} />
              {hover && tipCh && (
                <div style={{ position: "absolute", bottom: 26, left: `${Math.max(14, Math.min(86, hover.f * 100))}%`, transform: "translateX(-50%)", background: "rgba(26,28,32,.95)", color: C.ivory, fontFamily: SANS, fontSize: 12, fontWeight: 700, padding: "5px 9px", borderRadius: 7, whiteSpace: "nowrap", pointerEvents: "none", textAlign: "center" }}>
                  {tipCh.label}<div style={{ fontWeight: 500, opacity: 0.8 }}>{fmt(hover.f * TOTAL)}</div>
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button type="button" aria-label={ended ? "Replay" : isPlaying ? "Pause" : "Play"} onClick={togglePlay} style={{ ...circle, background: "rgba(255,255,255,.95)" }}>
                {ended ? <svg {...ico}><path d="M4 12a8 8 0 1 0 3-6.2M4 4v5h5" /></svg> : isPlaying ? <svg {...ico}><path d="M8 5v14M16 5v14" strokeWidth={3} /></svg> : <svg {...ico}><path d="M7 4.5v15l12-7.5z" fill={C.ink} /></svg>}
              </button>
              <span style={{ color: C.ivory, fontFamily: SANS, fontWeight: 600, fontSize: 13, fontVariantNumeric: "tabular-nums", textShadow: "0 1px 2px rgba(0,0,0,.5)" }}>{fmt(t)} / {fmt(TOTAL)}</span>
              <span style={{ flex: 1 }} />
              <button type="button" aria-label={cc ? "Turn captions off" : "Turn captions on"} aria-pressed={cc} onClick={() => setCc((v) => !v)} style={{ ...circle, background: cc ? C.mint : "rgba(255,255,255,.92)", padding: "0 12px" }}>CC</button>
              <button type="button" aria-label={sound ? "Turn sound off" : "Turn sound on"} aria-pressed={sound} onClick={toggleSound} style={{ ...circle, background: sound ? C.mint : "rgba(255,255,255,.92)" }}>
                <svg {...ico}><path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" fill={sound ? C.ink : "none"} />{sound ? <path d="M16 9 Q18.5 12 16 15 M18.5 6.5 Q23 12 18.5 17.5" /> : <path d="M17 9 L22 15 M22 9 L17 15" />}</svg>
              </button>
              <button type="button" aria-label={fs ? "Exit full screen" : "Full screen"} onClick={toggleFs} style={{ ...circle, background: "rgba(255,255,255,.92)" }}>
                <svg {...ico}>{fs ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}</svg>
              </button>
            </div>
          </div>
          <div aria-hidden="true" data-ftv-progress style={{ position: "absolute", left: 0, bottom: 0, height: 3, width: `${(t / TOTAL) * 100}%`, background: C.mint, zIndex: 2, opacity: barOn ? 0 : 1 }} />
        </>
      )}
      {toast && <div role="status" style={{ position: "absolute", left: "50%", top: "14%", transform: "translateX(-50%)", background: "rgba(26,28,32,.92)", color: C.ivory, font: `700 14px ${SANS}`, padding: "8px 14px", borderRadius: 999, zIndex: 4 }}>{toast}</div>}
      <p style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        {(Object.keys(voice) as VoiceId[]).map((id) => voice[id].text).join(" ")}
      </p>
    </div>
  );

  if (capture === "tall") {
    return (
      <div ref={outerRef} style={{ position: "fixed", inset: 0, zIndex: 99999, background: "linear-gradient(#f7cfa4, #f9d6a8 55%, #e2b585)", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ marginTop: "21%", width: "100%" }}>{stage}</div>
        <div style={{ marginTop: "7%", width: "92%", minHeight: capSize * 2.6, textAlign: "center" }}>
          {cc && cap && (
            <span style={{ display: "inline-block", background: "rgba(26,28,32,.92)", color: C.ivory, fontFamily: SANS, fontWeight: 800, fontSize: capSize, lineHeight: 1.25, padding: "0.14em 0.55em 0.18em", borderRadius: 14 }}>
              {cap.words.map((wd, i) => <span key={i} style={i === cap.key ? { color: C.mint } : undefined}>{wd}{i < cap.words.length - 1 ? " " : ""}</span>)}
            </span>
          )}
        </div>
        <div style={{ position: "absolute", bottom: "4%", fontFamily: SERIF, color: "#2a2219", fontSize: capSize * 0.8 }}>shortlistpass.com/foodtrucks</div>
      </div>
    );
  }
  if (capture === "wide") return <div ref={outerRef} style={{ position: "fixed", inset: 0, zIndex: 99999, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>{stage}</div>;
  return (
    <div ref={outerRef} style={fullFs ? { position: "fixed", inset: 0, zIndex: 2147483000, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" } : { width: "100%" }}>
      {stage}
    </div>
  );
}
