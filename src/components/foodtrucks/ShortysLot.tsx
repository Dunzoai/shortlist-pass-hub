"use client";
/* eslint-disable react-hooks/refs -- the handlers run later (timers, pointer events) and read these refs; they are kept current on each render */

/**
 * SHORTY'S LOT: the playable stage, the chat box and the question chips. Shorty is the Locals character: the app's rig, driven by the
 * live motion layer (src/components/shorty/live): drag with dangling legs, flick, bounce, land, stand on the truck roof. The stage
 * behind him is the homepage hero's cut-paper taco-truck scene. The phone shows the demo truck's real page in an iframe. This file
 * is the page logic around him: what each tap does, where he walks, what he says (lines.json), and the sound.
 *
 * Coordinates: the stage is W px wide. HTML objects sit by `bottom`; the Stage the motion layer runs on is drawn Hmax tall and
 * anchored to the bottom (the visible part is H tall), so the two always agree.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import LiveShorty, { DEFAULT_TUNE, makeBus, type LotEvents, type Pin, type ShortyControl } from "@/components/shorty/live/LiveShorty";
import { askShorty, sendDemoText, sendPageEmail } from "./api";
import { useLotAudio } from "./audio";
import { CATEGORIES, PHONE_CHIPS, TEXT_CHIPS, isPlay, type Chip } from "./chips";
import { DEMO_PAGE_URL } from "./config";
import demo from "./demo-truck.json";
import { signData } from "./demo-sign";
import { HeroCard, OrderCardArt, PostCardArt, type CardState } from "./hero-cards";
import { FLOWS, type TextMsg } from "./explainers";
import { BurgerObj, Crate, Customers, MegaObj, PhoneObj, Sign, Table, TruckHit, LotBackdrop, WindowGlow, type SignData } from "./lot-art";
import { figureFor, lotGeo, lotStage, type Geo } from "./lot-geo";
import { L, askNumberLine, voiceIdFor } from "./lines";
import { PhoneFrame, type Overlay } from "./PhoneFrame";
import { C, SANS, SERIF } from "./tokens";

type Where = "" | "roof" | "window" | "phone";
type S = {
  mode: "lot" | "phone"; overlay: Overlay; where: Where; frameSrc: string; frameKey: number; inst: 0 | 1 | 2;
  texts: TextMsg[]; textStep: number; inputMode: "ask" | "tel" | "email"; typed: string; emailTo: string; emailPreview: boolean;
  shake: boolean; orderUp: boolean; postUp: boolean; ding: boolean; signFlip: boolean; burgerGone: boolean; megaGone: boolean;
  active: string; cat: string | null; cardPost: CardState; cardOrder: CardState; hint: boolean; replyKey: number; reply: string; bubbleOn: boolean; talking: boolean; waiting: boolean;
};
const INIT: S = {
  mode: "lot", overlay: "none", where: "", frameSrc: DEMO_PAGE_URL, frameKey: 0, inst: 0,
  texts: [], textStep: 0, inputMode: "ask", typed: "", emailTo: "", emailPreview: false,
  shake: false, orderUp: false, postUp: false, ding: false, signFlip: false, burgerGone: false, megaGone: false,
  active: "", cat: null, cardPost: "tucked", cardOrder: "tucked", hint: true, replyKey: 0, reply: L.intro, bubbleOn: true, talking: true, waiting: false,
};
const DEPTH = 0.3;          // how far forward on the lot he usually stands (0 back … 1 front)
const DEPTH_PHONE = 0.12;
const bubbleMs = (line: string) => Math.max(9000, line.length * 70);   // fades on its own: 9 s, longer for long lines (~70 ms a character)

const chipBase = (compact: boolean): CSSProperties => ({ flex: "none", whiteSpace: "nowrap", scrollSnapAlign: "start", minHeight: 44, padding: "0 16px", borderRadius: 999, border: "1px solid " + C.hair, color: C.ink, fontSize: compact ? 14 : 15, fontWeight: 700, boxShadow: "0 10px 20px -16px rgba(26,28,32,.35)", textAlign: "left", display: "flex", alignItems: "center", gap: 8 });
function ChipButton({ c, active, compact, onClick }: { c: Chip; active: boolean; compact: boolean; onClick: () => void }) {
  return (
    <button type="button" className="ftl-chip" onClick={onClick} style={{ ...chipBase(compact), background: active ? C.mint : "#fff" }}>
      {isPlay(c) && <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1 L11 6 L2 11 Z" fill={C.green} stroke={C.ink} strokeWidth="1.5" strokeLinejoin="round" /></svg>}
      <span>{c.label}</span>
    </button>
  );
}

export default function ShortysLot({ tonightCount }: { tonightCount: number | null }) {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [stageW, setStageW] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [s, setSt] = useState<S>(INIT);
  const [prev, setPrev] = useState<{ text: string; key: number } | null>(null);
  const sRef = useRef<S>(INIT);
  const set = useCallback((p: Partial<S>) => { sRef.current = { ...sRef.current, ...p }; setSt(sRef.current); }, []);
  const audio = useLotAudio(reduced);
  const audioRef = useRef(audio); audioRef.current = audio;

  const geo = useMemo<Geo | null>(() => (stageW ? lotGeo(stageW) : null), [stageW]);
  const geoRef = useRef<Geo | null>(null); geoRef.current = geo;
  const stage = useMemo(() => (geo ? lotStage(geo) : null), [geo]);
  const sign = useMemo<SignData | null>(() => (stageW ? signData() : null), [stageW]);
  const bus = useMemo(() => makeBus(), []);
  const tune = useRef({ ...DEFAULT_TUNE });
  const ctl = useRef<ShortyControl | null>(null);
  const pin = useRef<Pin>(null);
  const timers = useRef<number[]>([]);
  const bubbleTimer = useRef(0);
  const arrive = useRef<(() => void) | null>(null);
  const alive = useRef(true);
  const grabbed = useRef(false);
  const landI = useRef(0);
  const spot = useRef(0);
  const askSeq = useRef(0);
  const tonightRef = useRef(tonightCount); tonightRef.current = tonightCount;

  /* ── measuring: the stage is rebuilt when its width settles (rotate, resize), not on every pixel ── */
  useEffect(() => {
    alive.current = true;
    const el = sectionRef.current;
    if (!el) return;
    let t = 0, first = true;
    const measure = () => {
      const w = Math.round(el.getBoundingClientRect().width);
      if (!w) return;
      if (first) { first = false; setStageW(w); return; }
      window.clearTimeout(t);
      t = window.setTimeout(() => setStageW((cur) => (Math.abs(cur - w) > 2 ? w : cur)), 180);
    };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(el);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onMq = () => setReduced(mq.matches);
    mq.addEventListener("change", onMq);
    return () => { alive.current = false; ro.disconnect(); mq.removeEventListener("change", onMq); window.clearTimeout(t); window.clearTimeout(bubbleTimer.current); timers.current.forEach(clearTimeout); };
  }, []);

  /* ── timers, speech and walking ── */
  const later = (ms: number, fn: () => void) => { const id = window.setTimeout(() => { if (alive.current) fn(); }, ms); timers.current.push(id); return id; };
  const stopAll = () => { timers.current.forEach(clearTimeout); timers.current = []; arrive.current = null; };
  const clearFx = () => set({ postUp: false, orderUp: false, ding: false, shake: false, burgerGone: false, megaGone: false, cardPost: "tucked", cardOrder: "tucked" });
  /** A card like the homepage hero's: tucked small, rises out with a spring, flies off. */
  const flyCard = (which: "cardPost" | "cardOrder", hold: number) => {
    set({ [which]: "tucked" } as Partial<S>);
    later(40, () => set({ [which]: "out" } as Partial<S>));
    later(40 + hold, () => set({ [which]: "away" } as Partial<S>));
    later(40 + hold + 1500, () => set({ [which]: "tucked" } as Partial<S>));
  };
  /** A line in the bubble: the old one crossfades out, the new one in; it fades away on its own; the voice reads recorded lines when sound is on. */
  const say = (line: string, keep?: boolean) => {
    const cur = sRef.current;
    if (cur.bubbleOn && cur.reply !== line) { setPrev({ text: cur.reply, key: cur.replyKey }); later(260, () => setPrev(null)); }
    set({ reply: line, replyKey: cur.replyKey + 1, bubbleOn: true, talking: true, hint: false });
    audioRef.current.speak(voiceIdFor(line));
    window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => { if (alive.current) set({ bubbleOn: false }); }, bubbleMs(line));
    if (!keep) later(Math.max(2600, Math.min(6000, line.length * 38)), () => set({ talking: false }));
  };
  const dismissBubble = () => { window.clearTimeout(bubbleTimer.current); audioRef.current.stopVoice(); set({ bubbleOn: false, talking: false }); };
  const sw = () => figureFor(geoRef.current!.compact) * 0.83 * 0.9;
  const face = (d: 1 | -1) => { if (ctl.current) ctl.current.state.face = d; };
  const perform = (kind: Parameters<ShortyControl["perform"]>[0], ms?: number) => { if (!pin.current) ctl.current?.perform(kind, ms); };
  const walkThen = (x: number, depth: number, fn?: () => void) => {
    const c = ctl.current;
    if (!c) { fn?.(); return; }
    arrive.current = fn ?? null;
    c.walkTo(x, depth);
    if (fn) later(7000, () => { if (arrive.current === fn) { arrive.current = null; fn(); } });
  };
  const idleSoon = (ms: number) => {
    later(ms, () => { if (sRef.current.where !== "roof") ctl.current?.stop(); set({ talking: false, active: "" }); });
    later(ms + 1500, wander);
  };
  function wander() {
    const st = sRef.current, c = ctl.current, g = geoRef.current;
    if (!c || !g || st.mode !== "lot" || st.where || pin.current || c.state.mode !== "stand" || c.state.perf || c.state.held) { later(1500, wander); return; }
    const spots = g.compact ? [0.5, 0.4, 0.56, 0.46] : [0.46, 0.55, 0.66, 0.5, 0.6, 0.4, 0.56];
    spot.current = (spot.current + 1) % spots.length;
    walkThen(spots[spot.current] * g.W, DEPTH, () => later(1600 + Math.random() * 1600, wander));
  }
  /** Bring him out of the serving window (he stands beside the truck). */
  const leaveWindow = () => {
    if (sRef.current.where !== "window") return;
    pin.current = null;
    const g = geoRef.current!;
    ctl.current?.stand(g.truck.x - sw() * 0.3, DEPTH);
  };

  /* ── the objects ── */
  const tapBurger = () => {
    const g = geoRef.current!; stopAll(); clearFx(); leaveWindow();
    set({ active: "burger", where: sRef.current.where === "phone" ? "phone" : "" });
    walkThen(g.table.x + g.table.w * 0.5 - 20 * g.k, DEPTH, () => {
      face(1); perform("eat", 3400); set({ burgerGone: true }); say(L.burger); idleSoon(3600);
      later(3500, () => set({ burgerGone: false }));
    });
  };
  const tapMega = () => {
    const g = geoRef.current!; stopAll(); clearFx(); leaveWindow();
    set({ active: "mega", where: sRef.current.where === "phone" ? "phone" : "" });
    walkThen(g.crate.x + g.crate.w * 0.5 - 30 * g.k, DEPTH, () => {
      face(1); perform("mega", 3800); set({ megaGone: true }); say(L.mega, true); audioRef.current.sfx("megaphone");
      later(700, () => flyCard("cardPost", 4600));
      later(1400, () => set({ ding: true }));
      later(4600, () => set({ ding: false, talking: false }));
      later(3900, () => set({ megaGone: false }));
      idleSoon(3800);
    });
  };
  const tapSign = () => {
    const g = geoRef.current!; stopAll(); clearFx(); leaveWindow();
    set({ active: "sign", where: sRef.current.where === "phone" ? "phone" : "" });
    walkThen(g.sign.x + g.sign.w + sw() * 0.5, DEPTH, () => {
      const week = !sRef.current.signFlip;
      face(-1); perform("point", 4200); set({ signFlip: week }); say(week ? L.signWeek : L.signTonight); idleSoon(4200);
    });
  };
  const orderLands = () => {
    set({ shake: true, orderUp: true });
    flyCard("cardOrder", 4800);
    audioRef.current.sfx("truck_shake"); later(450, () => audioRef.current.sfx("order_card"));
    later(700, () => set({ shake: false }));
    later(5200, () => set({ orderUp: false }));
  };
  const tapTruck = () => {
    const g = geoRef.current!; stopAll(); clearFx();
    if (sRef.current.where === "window") {                                  // let him out of the window
      leaveWindow(); set({ where: "" }); face(-1);
      later(40, () => perform("oof", 1500)); say(L.outOfWindow); idleSoon(2000);
      return;
    }
    set({ active: "truck", where: sRef.current.where === "phone" ? "phone" : "" });
    const go = (fn: () => void) => (sRef.current.mode === "phone" ? fn() : walkThen(g.truck.x - sw() * 0.3, DEPTH, fn));
    go(() => {
      face(1); perform("phone", 4800); say(L.truck1, true);
      later(900, orderLands);
      later(2000, () => say(L.truck2));
      idleSoon(4800);
    });
  };

  /* ── the phone ── */
  const phoneSlot = () => { const g = geoRef.current!; return { x: g.phoneBig.x, w: g.phoneBig.w }; };
  const frameTo = (suffix = "") => { const src = DEMO_PAGE_URL + suffix; if (sRef.current.frameSrc !== src || suffix) set({ frameSrc: src, frameKey: sRef.current.frameKey + 1 }); };
  const openPhone = (line: string | null, keep?: boolean, suffix = "") => {
    const g = geoRef.current!; stopAll(); clearFx(); leaveWindow();
    const was = sRef.current.where, wasOpen = sRef.current.mode === "phone";
    if (!wasOpen) audioRef.current.sfx("phone_open");
    set({ mode: "phone", overlay: "none", where: was === "phone" ? "phone" : "", active: "phone", hint: false, inputMode: "ask", typed: "" });
    if (!wasOpen || suffix) frameTo(suffix);
    if (was === "phone") { if (line) say(line, keep); return; }
    const ps = phoneSlot();
    later(30, () => walkThen(ps.x + ps.w + sw() * (g.compact ? 0.4 : 0.5), DEPTH_PHONE, () => {
      face(-1); perform("point"); if (line) say(line, keep);
    }));
  };
  /** Close the phone by any route (the X, the dark area, the chip). Shorty goes back on the lot, wherever he was. */
  const closePhone = () => {
    if (sRef.current.mode !== "phone") return;
    const g = geoRef.current!; stopAll();
    audioRef.current.sfx("phone_close");
    const wasInside = sRef.current.where === "phone";
    set({ mode: "lot", overlay: "none", where: "", active: "", inputMode: "ask", typed: "", texts: [], textStep: 0, inst: 0 });
    if (wasInside) { pin.current = null; const ps = phoneSlot(); ctl.current?.stand(ps.x + ps.w * 0.5, DEPTH); }
    later(30, () => walkThen(g.W * 0.5, DEPTH, () => later(1500, wander)));
  };
  /** Let him out of the phone, onto the lot, with the phone still open. */
  const letOutOfPhone = () => {
    if (sRef.current.where !== "phone") return;
    stopAll(); pin.current = null;
    const ps = phoneSlot(), g = geoRef.current!;
    set({ where: "" });
    ctl.current?.stand(ps.x + ps.w + sw() * (g.compact ? 0.4 : 0.5), DEPTH_PHONE);
    face(-1); later(40, () => perform("point")); say("Back out. Tap around the page, or put the phone down.");
  };
  /** He goes into the phone: he is the chat on the customer's page. */
  const intoPhone = (line: string) => {
    stopAll(); clearFx();
    pin.current = { x: 0, feetY: 0, ds: 1, hidden: true };
    ctl.current?.stop();
    const wasOpen = sRef.current.mode === "phone";
    if (!wasOpen) { audioRef.current.sfx("phone_open"); frameTo(); }
    set({ where: "phone", mode: "phone", overlay: "none", active: "phone", hint: false, inputMode: "ask", typed: "" });
    say(line, true);
  };
  const intoWindow = () => {
    const g = geoRef.current!; stopAll(); clearFx();
    ctl.current?.stop();
    const r = figureFor(g.compact) / 231;
    const u = Math.min((g.win.h - 6) / 108, r * 0.95);                      // px per rig unit: his head and shoulders in the window, not bigger than he is outside
    const hipsY = g.win.y + g.win.h * 0.5 + (172 - 58) * u;                 // his face (rig y 58) at the middle of the window
    pin.current = { x: g.win.x + g.win.w / 2, feetY: hipsY + 56 * u, ds: u / r };
    set({ where: "window", mode: "lot", active: "truck", hint: false });
    say(L.intoWindow);
  };
  const landRoof = () => {
    stopAll(); clearFx();
    const n = tonightRef.current;
    set({ where: "roof", mode: "lot", active: "", hint: false, inputMode: "ask" });
    perform("sit");
    say(n && n > 0 ? L.roofCount(n) : L.roofNoCount);
  };
  const demoOrder = () => {
    openPhone(L.orderStart, true, "/");
    later(1800, () => { say(L.orderPick, true); frameTo("/?order=1"); });
    later(4600, () => say(L.orderPay, true));
    later(6600, () => { orderLands(); say(L.orderTicket); });
  };
  const runInstall = () => {
    const wasPhone = sRef.current.mode === "phone";
    if (!wasPhone) openPhone(null); else stopAll();
    set({ mode: "phone", overlay: "install", inst: 0, active: "install" });
    say(L.install, true);
    FLOWS.install.forEach((st, i) => { if (i > 0) later(st.at, () => { set({ inst: (st.install ?? 0) as 0 | 1 | 2 }); if (i === FLOWS.install.length - 1) set({ talking: false }); }); });
  };
  const follow = () => {
    if (sRef.current.mode !== "phone") openPhone(null); else stopAll();
    set({ overlay: "none", active: "follow" }); frameTo("/#follow"); say(L.follow);
  };
  const askNumber = () => {
    if (sRef.current.mode !== "phone") openPhone(null);
    stopAll();
    set({ mode: "phone", overlay: "text", inputMode: "tel", typed: "", active: "text", texts: [], textStep: 0 });
    say(askNumberLine(), true);
  };
  const sendText = async () => {
    const i = sRef.current.textStep;
    if (i >= L.texts.length) { say(L.textsDone); return; }
    const msg = L.texts[i];
    void sendDemoText(sRef.current.typed, i);
    set({ overlay: "text", texts: sRef.current.texts.concat([msg as TextMsg]), textStep: i + 1, typed: "", inputMode: "ask", active: "text" });
    say(msg.say);
  };
  const sendEmail = async () => {
    const to = sRef.current.typed.trim();
    if (!/\S+@\S+\.\S+/.test(to)) { say("That doesn't look like an email. Try again."); return; }
    const r = await sendPageEmail(to);
    set({ overlay: "email", emailTo: to, emailPreview: !r.sent, typed: "", inputMode: "ask", active: "email" });
    say(L.emailPreview);
  };
  const talk = (id: string, line: string) => {
    stopAll(); leaveWindow();
    const st = sRef.current;
    set({ active: id, where: st.where === "roof" ? "roof" : st.where === "phone" ? "phone" : "" });
    say(line);
    if (st.mode !== "phone") idleSoon(4200);
  };
  const askTyped = async (q: string) => {
    const my = ++askSeq.current;
    stopAll(); leaveWindow();
    set({ active: "typed", typed: "", waiting: true, where: sRef.current.where === "roof" ? "roof" : sRef.current.where === "phone" ? "phone" : "" });
    say(L.thinking, true);
    const r = await askShorty(q);
    if (my !== askSeq.current || !alive.current) return;
    set({ waiting: false });
    say(r.ok ? r.reply : L.askFail);      // typed answers are text only: the app's voice route needs a signed-in owner
    if (sRef.current.mode !== "phone") idleSoon(5000);
  };

  /* ── what the live layer tells us ── */
  const captured = useRef(false);
  /** After a drop that was not caught by the window or the phone: a flick gets his "oof" line, a gentle put-down just goes on. */
  const handleDrop = (flicked: boolean) => {
    if (captured.current) { captured.current = false; return; }
    if (flicked) {
      landI.current = (landI.current + 1) % L.landHard.length;
      audioRef.current.sfx("land");
      later(40, () => perform("oof", 1500));
      say(L.landHard[landI.current]); idleSoon(1700);
    } else idleSoon(300);
  };
  const events: LotEvents = {
    onGrab: () => {
      grabbed.current = true; stopAll(); clearFx();
      audioRef.current.sfx("grab");
      set({ hint: false, talking: false, active: "", where: sRef.current.where === "roof" ? "" : sRef.current.where });
    },
    /* where his chest was when you let go decides if he goes in the window or the phone (being near the truck is not enough) */
    onRelease: ({ x, y }) => {
      const g = geoRef.current!, st = sRef.current;
      captured.current = false;
      if (st.mode === "phone") {
        if (x > g.phoneZone.x0 - 10 && x < g.phoneZone.x1 + 10) { captured.current = true; grabbed.current = false; intoPhone(L.intoPhone); }
        return;
      }
      const cp = g.cratePhone;
      if (x > cp.x - 26 && x < cp.x + cp.w + 26 && y > cp.bottomY - cp.h - 26 && y < cp.bottomY + 30) { captured.current = true; grabbed.current = false; intoPhone(L.cratePhone); return; }
      const z = g.winZone;
      if (x > z.x0 && x < z.x1 && y > z.y0 && y < z.y1) { captured.current = true; grabbed.current = false; intoWindow(); }
    },
    onArrive: () => { const f = arrive.current; arrive.current = null; f?.(); },
    onSurface: (id) => {
      if (id !== "roof" || sRef.current.where === "roof" || pin.current) return;
      grabbed.current = false;
      /* with the phone open the roof is behind it: a drop over the phone goes into the phone, not onto the roof */
      const x = ctl.current?.state.x ?? 0, ps = phoneSlot();
      if (sRef.current.mode === "phone" && x > ps.x - 10 && x < ps.x + ps.w + 10) { intoPhone(L.intoPhone); return; }
      audioRef.current.sfx("land"); landRoof();
    },
    onPlaced: () => { const f = grabbed.current; grabbed.current = false; if (f) handleDrop(false); },
    onLand: (_hard, at) => {
      if (at.surface === "roof" || !grabbed.current) return;     // only a landing after YOU let go counts (walking off the roof or a hop does not)
      grabbed.current = false;
      handleDrop(at.flick);
    },
  };

  /* ── start up, and start over when the stage is rebuilt ── */
  const started = useRef(false);
  useEffect(() => {
    if (!stageW) return;
    pin.current = null; arrive.current = null;
    if (started.current) { stopAll(); set({ ...INIT, hint: false, talking: false, bubbleOn: false, reply: L.intro }); }
    else { started.current = true; }
    window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => { if (alive.current) set({ bubbleOn: false }); }, bubbleMs(L.intro));
    later(2600, () => set({ talking: false }));
    later(3400, wander);
    if (sRef.current.hint) later(9000, () => set({ hint: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageW]);

  /* ── chips and the input ── */
  const phoneChips: Chip[] = s.overlay === "text" && s.textStep > 0 ? TEXT_CHIPS(s.textStep) : PHONE_CHIPS;
  const cat = CATEGORIES.find((c) => c.id === s.cat) ?? null;
  const onChip = (c: Chip) => {
    if (c.kind === "answer") { talk(c.id, c.line); return; }
    switch (c.action) {
      case "openPhone": openPhone(L.phoneOpen); break;
      case "demoOrder": demoOrder(); break;
      case "askNumber": askNumber(); break;
      case "install": runInstall(); break;
      case "follow": follow(); break;
      case "closePhone": closePhone(); break;
      case "nextText": void sendText(); break;
      case "emailMe": set({ inputMode: "email", typed: "", active: "email" }); say(L.emailAsk, true); break;
    }
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = sRef.current;
    if (st.inputMode === "tel") void sendText();
    else if (st.inputMode === "email") void sendEmail();
    else if (st.typed.trim()) void askTyped(st.typed.trim());
  };

  /* ── drawing ── */
  if (!geo || !stage || !sign) {
    return <div className="ftl" ref={(n) => { sectionRef.current = n as HTMLElement | null; }} style={{ minHeight: 560, background: "#f7cfa4", borderRadius: 24 }} aria-hidden="true" />;
  }
  const g = geo, phone = s.mode === "phone", compact = g.compact;
  const H = g.H(phone);
  const bw = compact ? 210 : 320;
  const lotPE = phone ? "none" : "auto";
  const inWindow = s.where === "window";
  const win = g.win;
  const clip = inWindow ? `inset(${win.y}px ${g.W - (win.x + win.w)}px ${g.Hmax - (win.y + win.h)}px ${win.x}px)` : undefined;
  /* the bubble: near his head on the lot; fixed spots with the phone, the window, or on a small screen */
  let bubble: CSSProperties;
  const ph = g.phoneBig;
  if (phone) bubble = compact ? { left: 12, bottom: 12, width: g.W - 24 } : { left: ph.x + ph.w + 16, bottom: H - 130, width: Math.min(360, g.W - ph.x - ph.w - 40) };
  else if (compact) bubble = { left: 12, bottom: H - 118, width: g.W - 24 - 44 };
  else if (s.where === "window") bubble = { left: Math.max(10, g.truck.x - bw - 10), bottom: g.B(150), width: bw };
  else {
    const left = `clamp(10px, calc(var(--lsl-head-x, 50%) - ${bw * 0.35}px), ${g.W - bw - 10}px)`;
    bubble = { left: s.orderUp ? `min(${left}, ${Math.max(10, g.truck.x - bw - 16)}px)` : left, bottom: `min(calc(${g.Hmax}px - var(--lsl-head-top, ${g.Hmax - 200}px) + 8px), ${H - 110}px)`, width: bw };
  }
  const bfs = compact ? 14 : 16;
  const hintText = compact ? "Grab Shorty. Tap the phone or the truck." : "Grab Shorty and flick him. Tap the phone, the truck, the sign, the megaphone.";
  const inputMode = s.inputMode;
  const bubbleBase: CSSProperties = { position: "absolute", boxSizing: "border-box", background: "#fff", border: "1px solid " + C.hair, borderRadius: 18, padding: "10px 14px 12px", boxShadow: "0 18px 36px -24px rgba(0,0,0,.7)", zIndex: 8, transition: "left .35s ease-out, bottom .35s ease-out, opacity .4s", ...bubble };

  return (
    <div className="ftl" style={{ width: "100%", boxSizing: "border-box", background: C.cream, border: "1px solid " + C.hair, borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 48px -30px rgba(26,28,32,.55)", fontFamily: SANS, color: C.ink }}>
      <section ref={sectionRef} aria-label="Shorty's lot" style={{ position: "relative", height: H, background: "linear-gradient(#f2b185 0%, #f7cfa4 55%, #f0c697 100%)", overflow: "hidden", transition: "height .3s" }}>
        <LotBackdrop g={g} shake={s.shake} />
        <WindowGlow g={g} on={s.orderUp || inWindow} />

        <Customers ding={s.ding} style={{ position: "absolute", left: g.custs.x, bottom: g.custs.bottom, width: g.custs.w, height: "auto", pointerEvents: "none" }} />

        {/* the cards that come out: drawn and moved like the homepage hero's cards */}
        <HeroCard state={s.cardPost} icon="megaphone" tint="#f5a46a" label="Posted to social" style={{ left: compact ? 16 : g.crate.x + 330, bottom: compact ? 24 : g.crate.bottom + 90, width: compact ? 172 : 214 }}>
          <PostCardArt caption={`Tonight: ${demo.weeklyStops[0].title}`} />
        </HeroCard>
        <HeroCard state={s.cardOrder} icon="menu" tint="#f2c94c" label="Order in" done="Paid" style={{ left: compact ? g.W - 172 - 16 : g.truck.x + g.truck.w * 0.55, bottom: compact ? 24 : g.Hmax - g.truck.y - 14, width: compact ? 172 : 214 }}>
          <OrderCardArt item="2 × Birria Tacos" price="$26" pickup="Pickup 6:40 · [CUSTOMER]" />
        </HeroCard>

        <TruckHit g={g} onClick={tapTruck} />
        <Crate style={{ position: "absolute", left: g.crate.x, bottom: g.crate.bottom, width: g.crate.w, height: "auto", pointerEvents: "none" }} />
        <Table style={{ position: "absolute", left: g.table.x, bottom: g.table.bottom, width: g.table.w, height: "auto", pointerEvents: "none" }} />
        <Sign flip={s.signFlip} label="Tap the sign" data={sign} onClick={tapSign} style={{ position: "absolute", left: g.sign.x, bottom: g.sign.bottom, width: g.sign.w, pointerEvents: lotPE }} />
        <PhoneObj className={s.hint ? "ftl-tapme" : ""} onClick={() => openPhone(L.phoneOpen)} style={{ left: g.crate.x + 10 * g.k, bottom: g.crate.bottom + 40 * g.k, width: 40 * g.k, pointerEvents: lotPE }} />
        <MegaObj onClick={tapMega} style={{ left: g.crate.x + 60 * g.k, bottom: g.crate.bottom + 40 * g.k, width: 60 * g.k, pointerEvents: lotPE, visibility: s.megaGone ? "hidden" : "visible" }} />
        <BurgerObj hidden={s.burgerGone} onClick={tapBurger} style={{ left: g.table.x + 30 * g.k, bottom: g.table.bottom + 33 * g.k, width: 50 * g.k, pointerEvents: lotPE }} />

        {/* the dark area behind the phone: a tap on it puts the phone down */}
        {phone && <div aria-hidden="true" onClick={closePhone} style={{ position: "absolute", inset: 0, background: "rgba(20,22,26,.62)", zIndex: 2, cursor: "pointer" }} />}
        {phone && (
          <PhoneFrame
            g={g} src={s.frameSrc} frameKey={s.frameKey} overlay={s.overlay} texts={s.texts} textNote={s.textStep ? "Texts need Communications · $30/mo" : "Enter your number below."}
            emailTo={s.emailTo} emailPreview={s.emailPreview} inst={s.inst} shortyInside={s.where === "phone"}
            onClose={closePhone} onBackToPage={() => set({ overlay: "none" })} onLetOut={letOutOfPhone}
          />
        )}

        {/* Shorty (the Locals rig). The overlay is the stage's full scene, anchored to the bottom; the clip crops him to the serving window. */}
        <div ref={overlayRef} style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: g.Hmax, pointerEvents: "none", zIndex: 5 }}>
          <div style={{ position: "absolute", inset: 0, clipPath: clip }}>
            <LiveShorty
              key={stageW}
              stage={stage} tune={tune.current} bus={bus} talking={s.talking} waiting={s.waiting} reduced={reduced}
              events={events} overlayRef={overlayRef} control={ctl} pin={pin}
            />
          </div>
          {prev && (
            <div key={"p" + prev.key} aria-hidden="true" className="ftl-bfade" style={{ ...bubbleBase, pointerEvents: "none", zIndex: 7 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: C.green }}>Shorty</div>
              <div style={{ fontSize: bfs, lineHeight: 1.35, marginTop: 2 }}>{prev.text}</div>
            </div>
          )}
          <div key={s.replyKey} className="ftl-bubble" aria-hidden={!s.bubbleOn} style={{ ...bubbleBase, opacity: s.bubbleOn ? 1 : 0, pointerEvents: "none", paddingRight: 34 }}>
            <button type="button" aria-label="Close this message" onClick={dismissBubble} style={{ position: "absolute", top: 4, right: 4, width: 28, height: 28, borderRadius: 99, border: 0, background: "transparent", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: s.bubbleOn ? "auto" : "none" }}>
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 1 L9 9 M9 1 L1 9" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round" /></svg>
            </button>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: C.green }}>Shorty</div>
            <div aria-live="polite" style={{ fontSize: bfs, lineHeight: 1.35, marginTop: 2 }}>{s.reply}</div>
          </div>
        </div>

        {/* sound: off until tapped */}
        <button type="button" aria-label={audio.on ? "Turn sound off" : "Turn sound on"} aria-pressed={audio.on} onClick={audio.toggle} style={{ position: "absolute", top: 10, right: 10, zIndex: 9, width: 40, height: 40, borderRadius: 99, border: "1px solid " + C.hair, background: audio.on ? C.mint : "rgba(255,255,255,.92)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 16px -10px rgba(26,28,32,.6)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" fill={audio.on ? C.ink : "none"} />
            {audio.on ? <path d="M16 9 Q18.5 12 16 15 M18.5 6.5 Q23 12 18.5 17.5" /> : <path d="M17 9 L22 15 M22 9 L17 15" />}
          </svg>
        </button>

        {s.hint && (
          <div className="ftl-hint" aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, bottom: 8, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: compact ? 18 : 24, color: "#2a2219", textShadow: "0 1px 0 rgba(255,255,255,.5)", pointerEvents: "none", zIndex: 9 }}>{hintText}</div>
        )}
      </section>

      <form onSubmit={submit} style={{ display: "flex", gap: 8, padding: 12, background: C.cream, borderTop: "1px solid " + C.hair }}>
        <label htmlFor="ask-shorty" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{inputMode === "tel" ? "Your phone number" : inputMode === "email" ? "Your email" : "Ask Shorty"}</label>
        <input
          id="ask-shorty" type={inputMode === "tel" ? "tel" : inputMode === "email" ? "email" : "text"} value={s.typed} onChange={(e) => set({ typed: e.target.value })}
          placeholder={inputMode === "tel" ? "(843) 555-0199" : inputMode === "email" ? "you@yourtruck.com" : compact ? "Ask Shorty anything" : "Ask Shorty: why isn't this just another truck finder?"}
          autoComplete={inputMode === "tel" ? "tel" : inputMode === "email" ? "email" : "off"}
          style={{ flexGrow: 1, minWidth: 0, minHeight: 48, boxSizing: "border-box", border: "1px solid " + C.hair, borderRadius: 999, background: inputMode === "ask" ? "#fff" : C.mintTint, padding: "0 18px", font: `16px ${SANS}`, color: C.ink }}
        />
        <button type="submit" aria-label={inputMode === "ask" ? "Send to Shorty" : "Send"} style={{ minWidth: 48, height: 48, padding: `0 ${inputMode === "ask" ? 0 : 14}px`, borderRadius: 999, border: 0, background: C.ink, color: C.cream, fontSize: inputMode === "ask" ? 20 : 14, fontWeight: 700, whiteSpace: "nowrap" }}>
          {inputMode === "tel" ? "Text me" : inputMode === "email" ? "Email me" : "→"}
        </button>
      </form>

      {/* the questions: a short row of categories (scrolls sideways); a category opens its few questions, with a Back chip */}
      <div className="ftl-row" role="group" aria-label={phone ? "Ask about the phone" : cat ? cat.label : "Things to ask Shorty"} style={{ display: "flex", gap: 10, padding: "14px 12px 16px", background: C.cream, borderTop: "1px solid #EFE9DA", overflowX: "auto", justifyContent: "safe center", scrollSnapType: "x proximity", WebkitOverflowScrolling: "touch" }}>
        {phone && phoneChips.map((c) => <ChipButton key={c.id} c={c} active={s.active === c.id} compact={compact} onClick={() => onChip(c)} />)}
        {!phone && cat && (
          <>
            <button type="button" className="ftl-chip" onClick={() => set({ cat: null })} aria-label="Back to the categories" style={{ ...chipBase(compact), background: C.ink, color: C.cream, borderColor: C.ink }}>
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M9 2 L4 7 L9 12" fill="none" stroke={C.cream} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span>Back</span>
            </button>
            {cat.chips.map((c) => <ChipButton key={c.id} c={c} active={s.active === c.id} compact={compact} onClick={() => onChip(c)} />)}
          </>
        )}
        {!phone && !cat && CATEGORIES.map((c) => (
          <button key={c.id} type="button" className="ftl-chip" onClick={() => set({ cat: c.id })} style={{ ...chipBase(compact), background: c.play ? C.mintTint : "#fff" }}>
            {c.play && <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1 L11 6 L2 11 Z" fill={C.green} stroke={C.ink} strokeWidth="1.5" strokeLinejoin="round" /></svg>}
            <span>{c.label}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2 L8 6 L4 10" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        ))}
      </div>
    </div>
  );
}
