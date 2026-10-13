"use client";
/* eslint-disable react-hooks/refs -- the handlers run later (timers, pointer events) and read these refs; they are kept current on each render */

/**
 * SHORTY'S LOT: the playable stage, the chat box and the question chips. Behavior and lines come from
 * docs/design/foodtrucks/design/Stage.dc.html. Shorty is the Locals character: the app's rig, driven by the live motion layer
 * (src/components/shorty/live): drag with dangling legs, flick, bounce, land, stand on the truck roof. This file is the page
 * logic around him: what each tap does, where he walks, what he says.
 *
 * Coordinates: the stage is W px wide. HTML objects sit by `bottom`; the Stage the motion layer runs on is drawn Hmax tall and
 * anchored to the bottom (the visible part is H tall), so the two always agree.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import LiveShorty, { DEFAULT_TUNE, makeBus, type LotEvents, type Pin, type ShortyControl } from "@/components/shorty/live/LiveShorty";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import { askShorty, sendDemoText, sendPageEmail } from "./api";
import { LOT_CHIPS, PHONE_CHIPS, TEXT_CHIPS, isPlay, type Chip } from "./chips";
import { BurgerObj, Crate, Customers, MegaObj, PhoneObj, Sign, Table, Truck } from "./lot-art";
import { figureFor, lotGeo, lotStage, type Geo } from "./lot-geo";
import {
  EmailScreen, FLOWS, FollowScreen, HomeScreen, InstallScreen, MenuScreen, PaidScreen, PhoneShell, TextScreen,
  type Cart, type FlowStep, type ScreenId, type TextMsg,
} from "./explainers";
import { L } from "./lines";
import { C, SANS, SERIF } from "./tokens";

type Where = "" | "roof" | "window" | "phone";
type S = {
  mode: "lot" | "phone"; screen: ScreenId; where: Where; cart: Cart; following: boolean; inst: 0 | 1 | 2;
  texts: TextMsg[]; textStep: number; inputMode: "ask" | "tel" | "email"; typed: string; emailTo: string; emailPreview: boolean;
  shake: boolean; orderUp: boolean; postUp: boolean; ding: boolean; signFlip: boolean; burgerGone: boolean; megaGone: boolean;
  active: string; hint: boolean; replyKey: number; reply: string; talking: boolean; waiting: boolean;
};
const ZERO: Cart = { a: 0, b: 0, c: 0 };
const INIT: S = {
  mode: "lot", screen: "home", where: "", cart: ZERO, following: false, inst: 0, texts: [], textStep: 0, inputMode: "ask", typed: "", emailTo: "", emailPreview: false,
  shake: false, orderUp: false, postUp: false, ding: false, signFlip: false, burgerGone: false, megaGone: false,
  active: "", hint: true, replyKey: 0, reply: L.intro, talking: true, waiting: false,
};
const DEPTH = 0.3;          // how far forward on the lot he usually stands (0 back … 1 front)
const DEPTH_PHONE = 0.12;

export default function ShortysLot({ tonightCount }: { tonightCount: number | null }) {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [stageW, setStageW] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [s, setSt] = useState<S>(INIT);
  const sRef = useRef<S>(INIT);
  const set = useCallback((p: Partial<S>) => { sRef.current = { ...sRef.current, ...p }; setSt(sRef.current); }, []);

  const geo = useMemo<Geo | null>(() => (stageW ? lotGeo(stageW) : null), [stageW]);
  const geoRef = useRef<Geo | null>(null); geoRef.current = geo;
  const stage = useMemo(() => (geo ? lotStage(geo) : null), [geo]);
  const bus = useMemo(() => makeBus(), []);
  const tune = useRef({ ...DEFAULT_TUNE });
  const ctl = useRef<ShortyControl | null>(null);
  const pin = useRef<Pin>(null);
  const timers = useRef<number[]>([]);
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
    return () => { alive.current = false; ro.disconnect(); mq.removeEventListener("change", onMq); window.clearTimeout(t); timers.current.forEach(clearTimeout); };
  }, []);

  /* ── timers and walking ── */
  const later = (ms: number, fn: () => void) => { const id = window.setTimeout(() => { if (alive.current) fn(); }, ms); timers.current.push(id); return id; };
  const stopAll = () => { timers.current.forEach(clearTimeout); timers.current = []; arrive.current = null; };
  const clearFx = () => set({ postUp: false, orderUp: false, ding: false, shake: false, burgerGone: false, megaGone: false });
  const say = (line: string, keep?: boolean) => {
    set({ reply: line, replyKey: sRef.current.replyKey + 1, talking: true, hint: false });
    if (!keep) later(Math.max(2600, Math.min(6000, line.length * 38)), () => set({ talking: false }));
  };
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
    const spots = g.compact ? [0.5, 0.4, 0.56, 0.46] : [0.31, 0.55, 0.66, 0.5, 0.6, 0.31, 0.56];
    spot.current = (spot.current + 1) % spots.length;
    walkThen(spots[spot.current] * g.W, DEPTH, () => later(1600 + Math.random() * 1600, wander));
  }
  /** Bring him out of the serving window (he stands beside the truck). */
  const leaveWindow = () => {
    if (sRef.current.where !== "window") return;
    pin.current = null;
    ctl.current?.stand(geoRef.current!.truckX - sw() * 0.4, DEPTH);
  };

  /* ── the objects ── */
  const tapBurger = () => {
    const g = geoRef.current!; stopAll(); clearFx(); leaveWindow();
    set({ active: "burger", where: sRef.current.where === "phone" ? "phone" : "" });
    walkThen(g.tableX + g.tableW * 0.5 - 20 * g.k, DEPTH, () => {
      face(1); perform("eat", 3400); set({ burgerGone: true }); say(L.burger); idleSoon(3600);
      later(3500, () => set({ burgerGone: false }));
    });
  };
  const tapMega = () => {
    const g = geoRef.current!; stopAll(); clearFx(); leaveWindow();
    set({ active: "mega", where: sRef.current.where === "phone" ? "phone" : "" });
    walkThen(g.crateX + g.crateW * 0.5 - 30 * g.k, DEPTH, () => {
      face(1); perform("mega", 3800); set({ megaGone: true }); say(L.mega, true);
      later(700, () => set({ postUp: true }));
      later(1400, () => set({ ding: true }));
      later(4600, () => set({ postUp: false, ding: false, talking: false }));
      later(3900, () => set({ megaGone: false }));
      idleSoon(3800);
    });
  };
  const tapSign = () => {
    const g = geoRef.current!; stopAll(); clearFx(); leaveWindow();
    set({ active: "sign", where: sRef.current.where === "phone" ? "phone" : "" });
    walkThen(g.signX + g.signW + sw() * 0.6, DEPTH, () => {
      face(-1); perform("point", 4200); set({ signFlip: !sRef.current.signFlip }); say(L.sign); idleSoon(4200);
    });
  };
  const orderLands = () => {
    set({ shake: true, orderUp: true });
    later(700, () => set({ shake: false }));
    later(5200, () => set({ orderUp: false }));
  };
  const tapTruck = () => {
    const g = geoRef.current!; stopAll(); clearFx();
    if (sRef.current.where === "window") {
      leaveWindow(); set({ where: "" }); face(-1);
      later(40, () => perform("oof", 1500)); say(L.outOfWindow); idleSoon(2000);
      return;
    }
    set({ active: "truck", where: sRef.current.where === "phone" ? "phone" : sRef.current.where === "roof" ? "" : "" });
    const go = (fn: () => void) => (sRef.current.mode === "phone" ? fn() : walkThen(g.truckX - sw() * 0.45, DEPTH, fn));
    go(() => {
      face(1); perform("phone", 4800); say(L.truck1, true);
      later(900, orderLands);
      later(2000, () => say(L.truck2));
      idleSoon(4800);
    });
  };

  /* ── the phone ── */
  const phoneSlot = () => { const g = geoRef.current!; return { x: g.phoneBig.x, w: g.phoneBig.w }; };
  const openPhone = (line: string | null, screen: ScreenId = "home", keep?: boolean) => {
    const g = geoRef.current!; stopAll(); clearFx(); leaveWindow();
    const was = sRef.current.where;
    set({ mode: "phone", screen, where: was === "phone" ? "phone" : "", active: "phone", hint: false, inputMode: "ask", typed: "" });
    if (was === "phone") { if (line) say(line, keep); return; }
    const ps = phoneSlot();
    later(30, () => walkThen(ps.x + ps.w + sw() * (g.compact ? 0.45 : 0.6), DEPTH_PHONE, () => {
      face(-1); perform("point"); if (line) say(line, keep);
    }));
  };
  const closePhone = () => {
    const g = geoRef.current!; stopAll();
    const wasInside = sRef.current.where === "phone";
    set({ mode: "lot", where: "", active: "", inputMode: "ask", typed: "", texts: [], textStep: 0, screen: "home", cart: ZERO, inst: 0 });
    if (wasInside) { pin.current = null; const ps = phoneSlot(); ctl.current?.stand(ps.x + ps.w * 0.5, DEPTH); }
    later(30, () => walkThen(g.W * 0.5, DEPTH, () => { say(L.phoneClosed); later(1500, wander); }));
  };
  /** He goes into the phone: he is the chat on the customer's page. */
  const intoPhone = (line: string) => {
    stopAll(); clearFx();
    pin.current = { x: 0, feetY: 0, ds: 1, hidden: true };
    ctl.current?.stop();
    const open = sRef.current.mode === "phone";
    set({ where: "phone", mode: "phone", screen: open ? sRef.current.screen : "home", active: "phone", hint: false, inputMode: "ask", typed: "" });
    say(line, true);
  };
  const intoWindow = () => {
    const g = geoRef.current!; stopAll(); clearFx();
    ctl.current?.stop();
    const u = (g.win.h - 6) / 108;                                      // px per rig unit so his head and shoulders fill the window
    const r = figureFor(g.compact) / 231;
    const hipsY = g.win.y + 3 + (172 - 6) * u;
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
  const applyStep = (step: FlowStep, keep: boolean) => {
    const p: Partial<S> = {};
    if (step.screen) { p.screen = step.screen; p.active = step.screen === "install" ? "install" : sRef.current.active; }
    if (step.cart) p.cart = step.cart;
    if (step.install !== undefined) p.inst = step.install;
    set(p);
    if (step.ticket) orderLands();
    if (step.say) say(step.say, keep);
  };
  const demoOrder = () => {
    openPhone(L.orderStart, "home", true);
    const steps = FLOWS.preorder;
    steps.forEach((st, i) => { if (i > 0) later(st.at, () => applyStep(st, i < steps.length - 1)); });
  };
  const pay = () => {
    const c = sRef.current.cart;
    if (c.a + c.b + c.c === 0) { say(L.payEmpty); return; }
    set({ screen: "paid" }); say(L.paid, true);
    later(900, () => { orderLands(); say(L.paidTicket); });
  };
  const runInstall = () => {
    const wasPhone = sRef.current.mode === "phone";
    if (!wasPhone) openPhone(null, "install"); else stopAll();
    set({ mode: "phone", screen: "install", inst: 0, active: "install" });
    say(L.install, true);
    FLOWS.install.forEach((st, i) => { if (i > 0) later(st.at, () => { applyStep(st, true); if (i === FLOWS.install.length - 1) set({ talking: false }); }); });
  };
  const askNumber = () => {
    if (sRef.current.mode !== "phone") openPhone(null, "text");
    stopAll();
    set({ mode: "phone", screen: "text", inputMode: "tel", typed: "", active: "text", texts: [], textStep: 0 });
    say(L.askNumber, true);
  };
  const sendText = async () => {
    const i = sRef.current.textStep;
    if (i >= L.texts.length) { say(L.textsDone); return; }
    const msg = L.texts[i];
    void sendDemoText(sRef.current.typed, i);
    set({ texts: sRef.current.texts.concat([msg]), textStep: i + 1, typed: "", inputMode: "ask", active: "text" });
    say(msg.say);
  };
  const sendEmail = async () => {
    const to = sRef.current.typed.trim();
    if (!/\S+@\S+\.\S+/.test(to)) { say("That doesn't look like an email. Try again."); return; }
    const r = await sendPageEmail(to);
    set({ screen: "email", emailTo: to, emailPreview: !r.sent, typed: "", inputMode: "ask", active: "email" });
    say(r.sent ? L.emailSent : L.emailPreview);
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
    say(r.ok ? r.reply : L.askFail);
    if (sRef.current.mode !== "phone") idleSoon(5000);
  };

  /* ── what the live layer tells us ── */
  const handleDrop = (at: { x: number; depth: number; surface: string | null }, flicked: boolean) => {
    const g = geoRef.current!, st = sRef.current;
    if (at.surface) return;                                             // a roof is handled by onSurface
    if (st.mode === "phone") {
      const ps = phoneSlot();
      if (at.x > ps.x - 10 && at.x < ps.x + ps.w + 10) { intoPhone(L.intoPhone); return; }
    } else {
      const px = g.crateX + 10 * g.k, pw = 40 * g.k;
      if (at.x > px - 20 && at.x < px + pw + 20) { intoPhone(L.cratePhone); return; }
      if (at.x > g.truckX && at.x < g.truckX + g.truckW) { intoWindow(); return; }
    }
    if (flicked) {
      landI.current = (landI.current + 1) % L.landHard.length;
      later(40, () => perform("oof", 1500));
      say(L.landHard[landI.current]); idleSoon(1700);
    } else idleSoon(300);
  };
  const events: LotEvents = {
    onGrab: () => {
      grabbed.current = true; stopAll(); clearFx();
      set({ hint: false, talking: false, active: "", where: sRef.current.where === "roof" ? "" : sRef.current.where });
    },
    onArrive: () => { const f = arrive.current; arrive.current = null; f?.(); },
    onSurface: (id) => { if (id === "roof" && sRef.current.where !== "roof") { grabbed.current = false; landRoof(); } },
    onPlaced: (at) => { const f = grabbed.current; grabbed.current = false; if (f) handleDrop(at, false); },
    onLand: (_hard, at) => {
      if (at.surface === "roof") return;
      const f = grabbed.current && at.flick; if (grabbed.current && at.flick) grabbed.current = false;
      if (grabbed.current && !at.flick) return;
      handleDrop(at, f);
    },
  };

  /* ── start up, and start over when the stage is rebuilt ── */
  const started = useRef(false);
  useEffect(() => {
    if (!stageW) return;
    pin.current = null; arrive.current = null;
    if (started.current) { stopAll(); set({ ...INIT, hint: false, talking: false, reply: L.phoneClosed }); }
    else { started.current = true; }
    later(2600, () => set({ talking: false }));
    later(3400, wander);
    if (sRef.current.hint) later(9000, () => set({ hint: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageW]);

  /* ── chips and the input ── */
  const chips: Chip[] = s.mode === "phone" ? (s.screen === "text" && s.textStep > 0 ? TEXT_CHIPS(s.textStep) : PHONE_CHIPS) : LOT_CHIPS;
  const onChip = (c: Chip) => {
    if (c.kind === "answer") { talk(c.id, c.line); return; }
    switch (c.action) {
      case "openPhone": openPhone(L.phoneOpen, "home"); break;
      case "demoOrder": demoOrder(); break;
      case "askNumber": askNumber(); break;
      case "install": runInstall(); break;
      case "follow": set({ screen: "follow", active: "follow" }); say(L.follow); break;
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
  if (!geo || !stage) {
    return <div className="ftl" ref={(n) => { sectionRef.current = n as HTMLElement | null; }} style={{ minHeight: 560, background: C.stage, borderRadius: 24 }} aria-hidden="true" />;
  }
  const g = geo, phone = s.mode === "phone", compact = g.compact;
  const H = g.H(phone);
  const bw = compact ? 210 : 320;
  const lotOp = phone ? 0.22 : 1;
  const lotPE = phone ? "none" : "auto";
  const inWindow = s.where === "window";
  const win = g.win;
  const clip = inWindow ? `inset(${win.y}px ${g.W - (win.x + win.w)}px ${g.Hmax - (win.y + win.h)}px ${win.x}px)` : undefined;
  /* the bubble: near his head on the lot; fixed spots with the phone, the window, or on a small screen */
  let bubble: CSSProperties;
  const ph = g.phoneBig;
  if (phone) bubble = compact ? { left: 12, bottom: 12, width: g.W - 24 } : { left: ph.x + ph.w + 16, bottom: H - 130, width: Math.min(360, g.W - ph.x - ph.w - 40) };
  else if (compact) bubble = { left: 12, bottom: H - 118, width: g.W - 24 };
  else if (s.where === "window") bubble = { left: g.truckX - bw - 10, bottom: g.G + 70, width: bw };
  else {
    const left = `clamp(10px, calc(var(--lsl-head-x, 50%) - ${bw * 0.35}px), ${g.W - bw - 10}px)`;
    bubble = { left: s.orderUp ? `min(${left}, ${g.truckX - bw - 16}px)` : left, bottom: `min(calc(${g.Hmax}px - var(--lsl-head-top, ${g.Hmax - 200}px) + 8px), ${H - 110}px)`, width: bw };
  }
  const bfs = compact ? 14 : 16;
  const hintText = compact ? "Grab Shorty. Tap the phone or the truck." : "Grab Shorty and flick him. Tap the phone, the truck, the sign, the megaphone.";
  const inputMode = s.inputMode;

  return (
    <div className="ftl" style={{ width: "100%", boxSizing: "border-box", background: C.cream, border: "1px solid " + C.hair, borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 48px -30px rgba(26,28,32,.55)", fontFamily: SANS, color: C.ink }}>
      <section ref={sectionRef} aria-label="Shorty's lot" style={{ position: "relative", height: H, background: C.stage, overflow: "hidden", transition: "height .3s" }}>
        <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: 0, height: H - g.G - 60, background: C.sky }} />
        <div aria-hidden="true" style={{ position: "absolute", right: "7%", top: 58, width: 40, height: 40, borderRadius: 99, background: C.cream, opacity: phone ? 0 : 1, transition: "opacity .3s" }} />
        <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: 12, display: "flex", justifyContent: "space-around", padding: "0 14px" }}>
          {[0, 5, 8, 10, 8, 5, 0].map((m, i) => <span key={i} className="ftl-dot" style={{ width: 9, height: 9, borderRadius: 99, background: C.amber, marginTop: m }} />)}
        </div>

        <Customers ding={s.ding} style={{ position: "absolute", left: g.W * 0.42, bottom: g.G + 26, width: compact ? 120 : 200, height: "auto", opacity: lotOp, transition: "opacity .3s" }} />
        <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: g.G, background: C.floor, borderTop: "1px solid " + C.hair }} />

        {/* the post card rises from behind the crate; the order ticket from behind the truck */}
        <div className="ftl-lift" aria-hidden="true" style={{ position: "absolute", left: g.crateX, bottom: g.objBottom, width: compact ? 120 : 160, boxSizing: "border-box", background: C.cream, border: "1px solid " + C.hair, borderRadius: 8, padding: "8px 10px", boxShadow: "0 14px 28px -20px rgba(26,28,32,.5)", transform: `translateY(${s.postUp ? -(90 * g.k + 10) : 0}px) rotate(-3deg)`, opacity: s.postUp ? 1 : 0 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".14em", color: C.green }}>NEW POST · ALL FOLLOWERS</div>
          <div style={{ fontFamily: SERIF, fontSize: 14, lineHeight: 1.15, marginTop: 3 }}>Tonight at [PLACE] til 9</div>
        </div>
        <div className="ftl-lift" aria-hidden="true" style={{ position: "absolute", left: g.truckX + g.truckW * (compact ? 0.34 : 0.18), bottom: g.objBottom, width: compact ? 118 : 150, boxSizing: "border-box", background: "#fff", border: "1px solid " + C.hair, borderRadius: "6px 6px 2px 2px", padding: "8px 10px", boxShadow: "0 14px 28px -20px rgba(26,28,32,.5)", transform: `translateY(${s.orderUp ? -(g.truckH + 10) : 0}px) rotate(2deg)`, opacity: s.orderUp ? 1 : 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, fontWeight: 700, letterSpacing: ".12em" }}><span>ORDER</span><span style={{ color: C.green }}>PAID</span></div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 3 }}>2 × [ITEM]</div>
          <div style={{ fontSize: 11, color: C.body }}>Pickup 6:40 · [CUSTOMER]</div>
        </div>

        <Sign flip={s.signFlip} label="Tap the sign" onClick={tapSign} style={{ position: "absolute", left: g.signX, bottom: g.objBottom, width: g.signW, opacity: lotOp, pointerEvents: lotPE }} />
        <Crate style={{ position: "absolute", left: g.crateX, bottom: g.objBottom, width: g.crateW, height: "auto", opacity: lotOp, transition: "opacity .3s" }} />
        <PhoneObj className={s.hint ? "ftl-tapme" : ""} onClick={() => openPhone(L.phoneOpen, "home")} style={{ left: g.crateX + 10 * g.k, bottom: g.objBottom + 40 * g.k, width: 40 * g.k, opacity: lotOp, pointerEvents: lotPE }} />
        <MegaObj onClick={tapMega} style={{ left: g.crateX + 60 * g.k, bottom: g.objBottom + 40 * g.k, width: 60 * g.k, opacity: lotOp, pointerEvents: lotPE, visibility: s.megaGone ? "hidden" : "visible" }} />
        <Table style={{ position: "absolute", left: g.tableX, bottom: g.objBottom, width: g.tableW, height: "auto", opacity: lotOp, transition: "opacity .3s" }} />
        <BurgerObj hidden={s.burgerGone} onClick={tapBurger} style={{ left: g.tableX + 28 * g.k, bottom: g.objBottom + 34 * g.k, width: 56 * g.k, opacity: lotOp, pointerEvents: lotPE }} />
        <Truck shake={s.shake} winFill={s.orderUp || inWindow ? C.amber : C.stage} onClick={tapTruck} style={{ left: g.truckX, bottom: g.objBottom, width: g.truckW, transition: "opacity .3s" }} />

        {/* the big phone: what the customer sees */}
        {phone && (
          <div style={{ position: "absolute", left: ph.x, top: ph.top, zIndex: 3 }}>
            <PhoneShell width={ph.w} height={ph.h}>
              {s.screen === "home" && <HomeScreen chatLine={s.where === "phone" ? "Hey, it's Shorty. Birria's back tonight. Want to order ahead?" : "Birria's back tonight. Order ahead and skip the line?"} shortyHere={s.where === "phone"} following={s.following} onMenu={() => set({ screen: "menu", active: "" })} onFollow={() => set({ screen: "follow" })} onInstall={runInstall} />}
              {s.screen === "menu" && <MenuScreen cart={s.cart} onAdd={(k) => set({ cart: { ...sRef.current.cart, [k]: sRef.current.cart[k] + 1 } })} onPay={pay} />}
              {s.screen === "paid" && <PaidScreen onBack={() => set({ screen: "home" })} />}
              {s.screen === "follow" && <FollowScreen following={s.following} onToggle={() => { const f = !sRef.current.following; set({ following: f }); say(f ? L.followed : L.unfollowed); }} onBack={() => set({ screen: "home" })} />}
              {s.screen === "install" && <InstallScreen step={s.inst} />}
              {s.screen === "text" && <TextScreen texts={s.texts} note={s.textStep ? (L.texts.length ? "Texts need Communications · $30/mo" : "") : "Enter your number below."} />}
              {s.screen === "email" && <EmailScreen to={s.emailTo} preview={s.emailPreview} onBack={() => set({ screen: "home" })} />}
            </PhoneShell>
          </div>
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
          <div key={s.replyKey} className="ftl-bubble" style={{ position: "absolute", boxSizing: "border-box", background: "#fff", border: "1px solid " + C.hair, borderRadius: 18, padding: "10px 14px 12px", boxShadow: "0 18px 36px -24px rgba(0,0,0,.7)", zIndex: 8, transition: "left .35s ease-out, bottom .35s ease-out", pointerEvents: "none", ...bubble }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: C.green }}>Shorty</div>
            <div aria-live="polite" style={{ fontSize: bfs, lineHeight: 1.35, marginTop: 2 }}>{s.reply}</div>
          </div>
        </div>

        {s.hint && (
          <div className="ftl-hint" aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, bottom: 8, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: compact ? 20 : 26, color: C.mint, pointerEvents: "none", zIndex: 9 }}>{hintText}</div>
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

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: compact ? "flex-start" : "center", gap: 10, padding: "14px 12px 16px", background: C.cream, borderTop: "1px solid #EFE9DA" }}>
        {chips.map((c) => (
          <button key={c.id} type="button" className="ftl-chip" onClick={() => onChip(c)} style={{ minHeight: 44, padding: "0 16px", borderRadius: 999, border: "1px solid " + C.hair, background: s.active === c.id ? C.mint : "#fff", color: C.ink, fontSize: compact ? 14 : 15, fontWeight: 700, boxShadow: "0 10px 20px -16px rgba(26,28,32,.35)", textAlign: "left", display: "flex", alignItems: "center", gap: 8 }}>
            {isPlay(c) && <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1 L11 6 L2 11 Z" fill={C.green} stroke={C.ink} strokeWidth="1.5" strokeLinejoin="round" /></svg>}
            <span>{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** A still Shorty for the hero: the same rig, not a picture. */
export function HeroShorty({ size }: { size: number }) {
  return <ShortyMascot mood="hello" size={size} />;
}
