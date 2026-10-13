'use client';
/* eslint-disable react-hooks/refs, react-hooks/immutability -- as in the app: the frame loop owns these refs and the stage object */

/* ONE-TIME COPY from the app repo (loyalty-pwa), branch feature/locals-shortlist-v1 @ eeb8dd9,
   components/locals/LiveShorty.tsx. Drag / tap / flick, the frame loop and the hand-attached props are unchanged.
   Added for /foodtrucks (search "FOODTRUCKS"): a control handle, a pin (window peek / hidden), carry-only items,
   the shapes the lot needs, and arrive / surface / placed events. */

import { useEffect, useRef } from 'react';
import { bodyMatrix, makeRig, type RigUpdate } from '@/lib/shorty/mascot/rig';
import { SHOULDER } from '@/lib/shorty/mascot/poses';
import { MASCOT_VIEWBOX } from '@/lib/shorty/mascot/frame';
import {
  DEFAULT_TUNE, burst, cheer, depthScale, endPerform, feetY, grabEnd, grabMove, grabStart, initState, itemGrab, itemMove, itemRelease, perform, poseOf, showOffSpin, step, tapped, visualDepth, walkTo, walkToDoor,
  type Events, type PerfKind, type Stage, type State, type Tune,
} from './motion';

/**
 * ── SHORTY, ALIVE IN THE SCENE (2026-10-09) ────────────────────────────────
 *
 * The app's rig (lib/shorty/mascot/rig.ts) drawn into one <svg>, driven every
 * frame by the motion layer (live-shorty/motion.ts) instead of the mood poses.
 * This file is the DOM half: the frame loop, pointer handling (tap / drag /
 * flick on his body only; drag on items), where he is in the scene, the scene
 * objects (items he can hold, decorations, effect particles) drawn in one SVG
 * over the overlay, the CSS variables the speech bubble and the rain follow,
 * and the pauses (off screen, reduced motion).
 *
 * Coordinates: the motion runs in SCENE units. This component sits inside the
 * scene overlay (the box with the diorama's geometry), so `px = units × k`
 * with k = overlay width / vw, re-measured on resize. The objects SVG uses the
 * scene's viewBox directly, so it draws in scene units.
 *
 * Commands from the page (a building tapped → walk to its door) arrive through
 * `bus`, shared by the phone and desktop instances; only the one on screen acts.
 */
export type ShortyCommand = { kind: 'door'; id: string } | { kind: 'walk'; x: number; depth: number } | { kind: 'cheer' } | { kind: 'burst'; effect: string; doorId: string } | { kind: 'near'; doorId: string } | { kind: 'glance'; at: { phone: { x: number; y: number }; desktop: { x: number; y: number } }; ms: number };
export interface ShortyBus { walkToDoor: (id: string) => void; walkTo: (x: number, depth: number) => void; cheer: () => void; burst: (effect: string, doorId: string) => void; walkNear: (doorId: string) => void; /** fix round 5: look at a point (scene units, one per layout) for `ms` */ glance: (at: { phone: { x: number; y: number }; desktop: { x: number; y: number } }, ms: number) => void; handlers: Set<(c: ShortyCommand) => void> }
export const makeBus = (): ShortyBus => {
  const handlers = new Set<(c: ShortyCommand) => void>();
  const send = (c: ShortyCommand) => handlers.forEach((h) => h(c));
  return { handlers, walkToDoor: (id) => send({ kind: 'door', id }), walkTo: (x, depth) => send({ kind: 'walk', x, depth }), cheer: () => send({ kind: 'cheer' }), burst: (effect, doorId) => send({ kind: 'burst', effect, doorId }), walkNear: (doorId) => send({ kind: 'near', doorId }), glance: (at, ms) => send({ kind: 'glance', at, ms }) };
};

/** FOODTRUCKS: what the page can see and ask. */
export type LotEvents = Events & {
  /** He finished a walk and is standing. */
  onArrive?: () => void;
  /** He is standing on a platform (a roof) now, or off it (null). */
  onSurface?: (id: string | null) => void;
  /** He was picked up (drag began). */
  onGrab?: () => void;
  /** A slow release put him down right there (a flick reports through onLand instead). */
  onPlaced?: (at: { x: number; depth: number; surface: string | null }) => void;
};
/** FOODTRUCKS: put him at a fixed spot, scaled (`ds` = depth scale) and frozen: the serving window. `hidden` = not drawn. */
export type Pin = { x: number; feetY: number; ds: number; hidden?: boolean } | null;
export interface ShortyControl {
  state: State;
  stage: Stage;
  walkTo: (x: number, depth: number) => void;
  perform: (kind: PerfKind, ms?: number) => void;
  stop: () => void;
  /** Stand him somewhere (scene units): used when he is let out of the window or the phone. */
  stand: (x: number, depth: number) => void;
}

export interface LiveShortyProps {
  stage: Stage;
  /** Mutable: the tuning panel edits it in place. */
  tune: Tune;
  bus: ShortyBus;
  talking: boolean;
  waiting: boolean;
  reduced: boolean;
  events: LotEvents;
  /** FOODTRUCKS: filled in with the control handle once he is on stage. */
  control?: React.MutableRefObject<ShortyControl | null>;
  /** FOODTRUCKS: a pin overrides where he is drawn (and freezes his physics). */
  pin?: React.MutableRefObject<Pin>;
  /** The overlay element: pointer positions are read against it and the bubble's CSS vars are set on it. */
  overlayRef: React.RefObject<HTMLDivElement | null>;
}

const NS = 'http://www.w3.org/2000/svg';
/* Write a DOM value only when it changed: WebKit repaints an SVG or recalculates a subtree's styles on EVERY
   setAttribute / setProperty, changed or not — measured 13 fps with everything paused while the loop rewrote
   the same transforms and CSS variables each frame, 55 when it did not. */
const last = new WeakMap<object, Record<string, string>>();
const put = (el: Element | HTMLElement, key: string, value: string, apply: (v: string) => void) => {
  let m = last.get(el); if (!m) { m = {}; last.set(el, m); }
  if (m[key] === value) return;
  m[key] = value; apply(value);
};
const attr = (el: Element, name: string, value: string) => put(el, `a:${name}`, value, (v) => el.setAttribute(name, v));
const style = (el: HTMLElement | SVGElement, name: string, value: string) => put(el, `s:${name}`, value, (v) => (el.style as unknown as Record<string, string>)[name] = v);
const cssVar = (el: HTMLElement, name: string, value: string) => put(el, `v:${name}`, value, (v) => el.style.setProperty(name, v));
const r1 = (v: number) => Math.round(v * 10) / 10;
const f1 = (v: number) => v.toFixed(1);

/* ── The shapes a scene's `draw` can name. Origin and size: see scenes/types.ts. ── */
type ShapeFn = (g: SVGGElement, w: number, color: string) => void;
const el = (tag: string, attrs: Record<string, string | number>, parent: Element) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  parent.appendChild(n);
  return n;
};
const SHAPES: Record<string, ShapeFn> = {
  /** A paper umbrella, RIG units, origin at the end of its handle (where a hand holds it); canopy above. */
  umbrella(g, w, color) {
    const h = w * 0.52, top = -92;
    el('path', { d: 'M0 2 Q-7 10 -2 16', fill: 'none', stroke: '#1D1A16', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, g);   // hook
    el('path', { d: `M0 0 V${top + 2}`, stroke: '#1D1A16', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, g);
    el('path', { d: `M${-w / 2} ${top} q${w / 2} -${h} ${w} 0 z`, fill: color }, g);
    el('path', { d: `M${-w * 0.16} ${top} q${w * 0.16} -${h} ${w * 0.32} 0`, fill: '#F4ECD6' }, g);
    el('path', { d: `M${-w / 2} ${top} q${w / 2} -${h} ${w} 0`, fill: 'none', stroke: 'rgba(36,24,10,.35)', 'stroke-width': 2 }, g);
    el('circle', { cx: 0, cy: top - h - 2, r: 3.5, fill: '#1D1A16' }, g);
  },
  /** FOODTRUCKS. Held shapes: RIG units, origin where the hand grips. */
  phone(g) {
    el('rect', { x: -13, y: -30, width: 26, height: 46, rx: 6, fill: '#1A1C20' }, g);
    el('rect', { x: -10, y: -25, width: 20, height: 34, rx: 3.5, fill: '#34D399' }, g);
    el('path', { d: 'M-5 -7 L-1 -3 L6 -13', fill: 'none', stroke: '#fff', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  },
  megaphone(g) {
    el('rect', { x: -9, y: -9, width: 18, height: 16, rx: 3, fill: '#1A1C20' }, g);
    el('path', { d: 'M6 -8 L48 -26 L48 22 L6 6 Z', fill: '#E2A43C', stroke: '#1A1C20', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    el('ellipse', { cx: 48, cy: -2, rx: 7, ry: 24, fill: '#0B7A50', stroke: '#1A1C20', 'stroke-width': 3 }, g);
  },
  burger(g) {
    el('path', { d: 'M-18 6 H18 V10 Q18 17 12 17 H-12 Q-18 17 -18 10 Z', fill: '#34D399', stroke: '#1A1C20', 'stroke-width': 2.5 }, g);
    el('rect', { x: -20, y: -4, width: 40, height: 10, rx: 5, fill: '#8A5A3C', stroke: '#1A1C20', 'stroke-width': 2.5 }, g);
    el('path', { d: 'M-18 -5 Q-18 -22 0 -22 Q18 -22 18 -5 Z', fill: '#34D399', stroke: '#1A1C20', 'stroke-width': 2.5 }, g);
    el('circle', { cx: -7, cy: -14, r: 1.6, fill: '#F6F1E4' }, g); el('circle', { cx: 4, cy: -17, r: 1.6, fill: '#F6F1E4' }, g); el('circle', { cx: 10, cy: -12, r: 1.6, fill: '#F6F1E4' }, g);
  },
  envelope(g) {
    el('rect', { x: -22, y: -15, width: 44, height: 30, rx: 4, fill: '#FFFFFF', stroke: '#1A1C20', 'stroke-width': 3 }, g);
    el('path', { d: 'M-22 -13 L0 4 L22 -13', fill: 'none', stroke: '#1A1C20', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
  },
  /** A puddle on the boardwalk, SCENE units, origin at its centre. */
  puddle(g, w, color) {
    el('ellipse', { cx: 0, cy: 0, rx: w / 2, ry: w / 9, fill: color }, g);
    el('ellipse', { cx: -w * 0.12, cy: -w * 0.02, rx: w * 0.22, ry: w * 0.035, fill: 'rgba(251,246,230,.35)' }, g);
  },
};
/** The held item's hit zone around the hand, rig units: wide enough for the canopy, down to the hook. */
const HOLD_HIT = { w: 130, up: 150, down: 20 };

export default function LiveShorty({ stage, tune, bus, talking, waiting, reduced, events, overlayRef, control, pin: pinRef }: LiveShortyProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const hitRef = useRef<HTMLButtonElement>(null);
  const objRef = useRef<SVGSVGElement>(null);
  const itemHitsRef = useRef<HTMLDivElement>(null);
  const state = useRef<State | null>(null);
  const inputs = useRef({ talking, waiting, reduced, tune, events });
  inputs.current = { talking, waiting, reduced, tune, events };
  const r = stage.figure / 231;

  useEffect(() => {
    const svg = svgRef.current, anchor = anchorRef.current, hit = hitRef.current, overlay = overlayRef.current, obj = objRef.current, itemHits = itemHitsRef.current;
    if (!svg || !anchor || !hit || !overlay || !obj || !itemHits) return;
    const scene = overlay.parentElement as HTMLElement | null;
    const now = () => performance.now() / 1000;
    const s = initState(stage, now());
    state.current = s;
    const events0 = () => inputs.current.events;
    if (control) {
      control.current = {
        state: s, stage,
        walkTo: (x, depth) => walkTo(s, stage, x, depth),
        perform: (kind, ms) => perform(s, stage, kind, now(), ms),
        stop: () => { s.target = null; endPerform(s); },
        stand: (x, depth) => { s.mode = 'stand'; s.surface = null; s.x = Math.max(stage.minX, Math.min(stage.maxX, x)); s.depth = depth; s.y = 0; s.vx = 0; s.vy = 0; s.target = null; s.intent = null; s.opacity = 1; s.scale = 1; endPerform(s); },
      };
    }
    /* No line boil: that filter re-rasterises the whole figure every frame once he moves — measured 6 fps
       on the desktop scene in WebKit with it on, 30+ without. The cut-paper look comes from the scene. */
    const update: RigUpdate = makeRig(svg, { small: false, boil: false, reduce: inputs.current.reduced });
    let k = 1;                                       // px per scene unit
    /* The overlay's rect is cached: reading getBoundingClientRect every frame forced a synchronous layout
       right after the rig's attribute writes had dirtied it — measured in WebKit, that doubled the frame. */
    let rect = overlay.getBoundingClientRect();
    const measure = () => { rect = overlay.getBoundingClientRect(); k = rect.width / stage.vw || 1; overlay.style.setProperty('--lsl-k', `${k}px`); };
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(overlay);
    const onScroll = () => { rect = overlay.getBoundingClientRect(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    const rectTimer = window.setInterval(onScroll, 1000);

    /* Visible? Pause the loop (and never vote) while the scene is off screen or this layout is hidden. */
    let visible = true;
    const io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.02 }) : null;
    io?.observe(overlay);

    /* The pointer, for the eyes (client px → scene units each frame). */
    let pointer: { cx: number; cy: number } | null = null;
    const onMove = (e: PointerEvent) => { pointer = { cx: e.clientX, cy: e.clientY }; };
    window.addEventListener('pointermove', onMove, { passive: true });
    const toUnits = (cx: number, cy: number) => ({ x: ((cx - rect.left) / rect.width) * stage.vw, y: ((cy - rect.top) / rect.height) * stage.vh });
    /* Heights in the motion layer are above HIS feet line (it moves with his depth / platform). */
    const feetLineOf = () => (s.surface ? s.surface.y : stage.backY + s.depth * (stage.ground - stage.backY));

    /* Drag / tap on his body. touch-action: none is on the hit zone only (CSS). */
    let down: { cx: number; cy: number; id: number; dragging: boolean } | null = null;
    const onDown = (e: PointerEvent) => {
      if (inputs.current.reduced) return;
      e.preventDefault();
      hit.setPointerCapture(e.pointerId);
      down = { cx: e.clientX, cy: e.clientY, id: e.pointerId, dragging: false };
    };
    const onDrag = (e: PointerEvent) => {
      if (!down || e.pointerId !== down.id) return;
      const u = toUnits(e.clientX, e.clientY);
      if (!down.dragging) {
        if (Math.hypot(e.clientX - down.cx, e.clientY - down.cy) < 8) return;
        down.dragging = true;
        /* The grab point is where the PRESS was, not this first move — measured: a fast first move
           put the grab offset 90px off and he hung too low to reach a doorway. */
        const d = toUnits(down.cx, down.cy);
        grabStart(s, d.x, feetLineOf() - d.y, now());
        events0().onGrab?.();
      }
      grabMove(s, u.x, feetLineOf() - u.y, now());
    };
    const onUp = (e: PointerEvent) => {
      if (!down || e.pointerId !== down.id) return;
      const was = down; down = null;
      if (was.dragging) {
        grabEnd(s, stage, r, now());
        if (s.mode === 'stand') events0().onPlaced?.({ x: s.x, depth: s.depth, surface: s.surface?.id ?? null });
      } else { tapped(s, r, now()); inputs.current.events.onTapped?.(); }
    };
    hit.addEventListener('pointerdown', onDown);
    hit.addEventListener('pointermove', onDrag);
    hit.addEventListener('pointerup', onUp);
    hit.addEventListener('pointercancel', onUp);

    /* ── scene objects: one <g> per drawn object, one HTML hit zone per item ── */
    const groups: Record<string, SVGGElement> = {};
    const hits: Record<string, HTMLButtonElement> = {};
    for (const dec of stage.decor) {
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'lsl-obj lsl-obj-decor');
      g.setAttribute('transform', `translate(${f1(dec.x)} ${f1(dec.y)})`);
      SHAPES[dec.shape]?.(g, dec.w, dec.color ?? '#8FA6B0');
      obj.appendChild(g);
    }
    for (const def of stage.items) {
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'lsl-obj');
      SHAPES[def.shape]?.(g, def.w, def.color ?? '#EE7B80');
      obj.appendChild(g);
      groups[def.id] = g;
      const b = document.createElement('button');
      if (def.flags.includes('carry-only')) continue;     // FOODTRUCKS: only the page puts these in his hand
      b.type = 'button'; b.className = 'lsl-item-hit'; b.dataset.item = def.id;
      b.setAttribute('aria-label', `${def.id}. Drag it onto Shorty and he holds it.`);
      itemHits.appendChild(b);
      hits[def.id] = b;
      let idown: { id: number; cx: number; cy: number; dragging: boolean } | null = null;
      b.addEventListener('pointerdown', (e) => {
        if (inputs.current.reduced) return;
        e.preventDefault(); e.stopPropagation();
        b.setPointerCapture(e.pointerId);
        idown = { id: e.pointerId, cx: e.clientX, cy: e.clientY, dragging: false };
      });
      b.addEventListener('pointermove', (e) => {
        if (!idown || e.pointerId !== idown.id) return;
        const u = toUnits(e.clientX, e.clientY);
        if (!idown.dragging) {
          if (Math.hypot(e.clientX - idown.cx, e.clientY - idown.cy) < 6) return;
          idown.dragging = true;
          const d = toUnits(idown.cx, idown.cy);
          itemGrab(s, def.id, d.x, d.y, now());
        }
        itemMove(s, def.id, u.x, u.y, now());
      });
      const iup = (e: PointerEvent) => {
        if (!idown || e.pointerId !== idown.id) return;
        const was = idown; idown = null;
        if (was.dragging) itemRelease(s, stage, def.id, now());
      };
      b.addEventListener('pointerup', iup); b.addEventListener('pointercancel', iup);
    }
    /* effects: a pool of drops and rings */
    const fx = document.createElementNS(NS, 'g'); fx.setAttribute('class', 'lsl-fx'); obj.appendChild(fx);
    const drops = Array.from({ length: 24 }, () => el('ellipse', { rx: 2, ry: 1.4, display: 'none' }, fx) as SVGEllipseElement);
    const rings = Array.from({ length: 4 }, () => el('ellipse', { fill: 'none', stroke: 'rgba(251,246,230,.9)', 'stroke-width': 2, display: 'none' }, fx) as SVGEllipseElement);

    /* Commands from the page. */
    const cmd = (c: ShortyCommand) => {
      if (!visible || inputs.current.reduced) return;
      if (c.kind === 'door') walkToDoor(s, stage, c.id);
      else if (c.kind === 'walk') walkTo(s, stage, c.x, c.depth);
      else if (c.kind === 'cheer') cheer(s, r, now());
      else if (c.kind === 'burst') { const d = stage.doors.find((x) => x.id === c.doorId); if (d) burst(s, stage, c.effect, d.x, d.bottom - 40 * r, now()); }
      else if (c.kind === 'near') { const d = stage.doors.find((x) => x.id === c.doorId); if (d) walkTo(s, stage, d.x + (s.x < d.x ? -d.halfW - 10 * r : d.halfW + 10 * r), 0.12); }
      else if (c.kind === 'glance') { const at = stage.vw < 900 ? c.at.phone : c.at.desktop; s.glance = { x: at.x, y: at.y, until: now() + c.ms / 1000 }; }
    };
    bus.handlers.add(cmd);

    let gullAt = 0, gull = false, raf = 0, lastDraw = 0, prevSurface: string | null = null;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) { s.t = now(); return; }
      const t = now();
      if (t - gullAt > 0.25) { gullAt = t; gull = !!scene?.querySelector('.lsl-gull-fly'); }
      const inp = inputs.current;
      const pu = pointer ? toUnits(pointer.cx, pointer.cy) : null;
      const pin = pinRef?.current ?? null;
      const hadTarget = !!s.target;
      if (!pin) step(s, stage, inp.tune, { pointer: pu, gull, talking: inp.talking, waiting: inp.waiting, reduced: inp.reduced }, inp.events, t);
      else s.t = t;
      /* FOODTRUCKS: tell the page when a walk ends and when he steps on / off a roof */
      if (hadTarget && !s.target && s.mode === 'stand') inp.events.onArrive?.();     // even a walk of zero length
      const sid = s.surface?.id ?? null;
      if (sid !== prevSurface) { prevSurface = sid; inp.events.onSurface?.(sid); }
      const pose = poseOf(s, t);
      /* The rig redraw (≈90 SVG attributes) is the expensive half of a frame — measured in WebKit on a
         1440 scene: the scene's own animations ran at 13 fps and Shorty alone at 14. His POSITION is a
         compositor transform and updates every frame; the limbs redraw at 30 fps while he is doing
         something and 15 fps while he just stands (eyes, blink), which is invisible and halves the cost. */
      const busy = s.mode !== 'stand' || !!s.act || inp.talking || Math.abs(s.lift.vel) > 2 || Math.abs(s.tilt.vel) > 4 || !!s.held;
      const every = busy ? 1 / 30 : 1 / 12;
      /* window.__lslNoDraw: a measurement switch (drives only) that skips the rig redraw to price it. */
      if (t - lastDraw >= every - 0.002 && !(window as unknown as { __lslNoDraw?: boolean }).__lslNoDraw) { lastDraw = t; update(pose); }
      /* Place him: the anchor is his HIPS (rig 63,172), 56 rig units above his feet; depth (or a roof) scales him. */
      const ds = pin ? pin.ds : depthScale(visualDepth(s)), fy = pin ? pin.feetY : feetY(s, stage);
      const ax = pin ? pin.x : s.x, ay = fy - 56 * r * ds;
      style(anchor, 'transform', `translate(${r1(ax * k)}px, ${r1(ay * k)}px) scale(${ds.toFixed(3)})`);
      style(svg, 'transform', `scaleX(${s.face}) scale(${s.scale.toFixed(3)})`);
      style(svg, 'opacity', pin?.hidden ? '0' : s.opacity.toFixed(3));
      style(hit, 'pointerEvents', pin || s.mode === 'enter' || s.mode === 'pop' ? 'none' : '');
      if (anchor.dataset.mode !== s.mode) anchor.dataset.mode = s.mode;
      /* Scene units, for drives and the tuning panel; cheap, and only when it moved. */
      const pos = `${r1(s.x)},${r1(s.depth * 100) / 100},${r1(s.y)}`;
      if (anchor.dataset.pos !== pos) anchor.dataset.pos = pos;
      if (anchor.dataset.surface !== (s.surface?.id ?? '')) anchor.dataset.surface = s.surface?.id ?? '';
      if (anchor.dataset.held !== (s.held ?? '')) anchor.dataset.held = s.held ?? '';
      /* The building he is standing by lights up (scene-overlay.tsx CSS reads this). */
      if (overlay.dataset.near !== (s.near ?? '')) overlay.dataset.near = s.near ?? '';
      /* The bubble follows his head (scene-overlay.tsx reads these). */
      cssVar(overlay, '--lsl-head-x', `${r1(s.x * k)}px`);
      /* Holding something tall (the umbrella's canopy ends ~250 rig units above his feet): the bubble goes
         above it instead of his head, so it never covers what he holds (overnight Part 0). */
      const heldDef = s.held ? stage.items.find((i) => i.id === s.held) : null;
      const headRig = heldDef ? 200 + Math.max(0, -heldDef.arm.hy) + 92 + heldDef.w * 0.52 - 100 : 250;
      cssVar(overlay, '--lsl-head-top', `${r1((fy - headRig * r * ds) * k)}px`);

      /* ── items ── */
      const m = bodyMatrix(pose);
      let dryA = 0, dryB = 0;
      for (const def of stage.items) {
        const it = s.items[def.id], g = groups[def.id], hb = hits[def.id];
        if (!it || !g) continue;
        if (def.flags.includes('carry-only') && it.st !== 'held' && it.st !== 'air') { style(g, 'opacity', '0'); continue; }
        if (it.st === 'held') {
          /* at his hand: the hand point in rig space, through the body matrix, then into scene units */
          const [sx0, sy0] = SHOULDER[def.hand], a = def.hand === 'L' ? pose.L : pose.R;
          const hx = sx0 + a.hx, hy = sy0 + a.hy;
          const wx = m[0] * hx + m[2] * hy + m[4], wy = m[1] * hx + m[3] * hy + m[5];
          const X = ax + (wx - 63) * r * ds * s.face, Y = ay + (wy - 172) * r * ds;
          it.x = X; it.y = Y; it.depth = visualDepth(s);
          const rot = def.hold.rot + showOffSpin(s, t);
          attr(g, 'transform', `translate(${f1(X)} ${f1(Y)}) scale(${(r * ds * s.face).toFixed(4)} ${(r * ds).toFixed(4)}) rotate(${f1(rot)}) translate(${def.hold.ox} ${def.hold.oy})`);
          style(g, 'opacity', s.opacity.toFixed(3));
          if (def.flags.includes('blocks-rain')) { const half = (def.w / 2 + 8) * r * ds; dryA = (X - half) / stage.vw * 100; dryB = (X + half) / stage.vw * 100; }
          if (hb) {
            style(hb, 'transform', `translate(${r1((X - HOLD_HIT.w / 2 * r * ds) * k)}px, ${r1((Y - HOLD_HIT.up * r * ds) * k)}px)`);
            style(hb, 'width', `${r1(HOLD_HIT.w * r * ds * k)}px`); style(hb, 'height', `${r1((HOLD_HIT.up + HOLD_HIT.down) * r * ds * k)}px`);
          }
        } else {
          const sc = r * depthScale(it.depth);
          attr(g, 'transform', `translate(${f1(it.x)} ${f1(it.y)}) scale(${sc.toFixed(4)}) rotate(${f1(it.rot)})`);
          style(g, 'opacity', '1');
          /* the hit zone wraps the drawing, roughly: a box the canopy's width, from above it to the handle's end */
          const half = def.w * 0.6 * sc;
          if (hb) {
            style(hb, 'transform', `translate(${r1((it.x - half) * k)}px, ${r1((it.y - half * 1.5) * k)}px)`);
            style(hb, 'width', `${r1(half * 2 * k)}px`); style(hb, 'height', `${r1(half * 1.8 * k)}px`);
          }
        }
        if (hb && hb.dataset.st !== it.st) hb.dataset.st = it.st;
      }
      /* the rain canvas (scene-layers.tsx) reads this each frame and leaves that column dry */
      if (scene) { const v = dryB > dryA ? `${(dryA / 100 * stage.vw).toFixed(1)},${(dryB / 100 * stage.vw).toFixed(1)}` : ''; if (scene.dataset.dry !== v) scene.dataset.dry = v; }

      /* ── effects ── */
      for (let i = 0; i < drops.length; i++) {
        const p = s.particles[i], d = drops[i];
        if (!p) { if (d.style.display !== 'none') d.style.display = 'none'; continue; }
        const age = (t - p.t0) / p.life;
        d.style.display = '';
        d.setAttribute('cx', f1(p.x)); d.setAttribute('cy', f1(p.y));
        d.setAttribute('rx', f1(p.size)); d.setAttribute('ry', f1(p.size * 0.7));
        d.setAttribute('fill', p.color); d.setAttribute('opacity', (1 - age * age).toFixed(2));
      }
      for (let i = 0; i < rings.length; i++) {
        const rp = s.ripples[i], d = rings[i];
        if (!rp) { if (d.style.display !== 'none') d.style.display = 'none'; continue; }
        const age = (t - rp.t0) / rp.dur, e = 1 - Math.pow(1 - age, 2);
        d.style.display = '';
        d.setAttribute('cx', f1(rp.x)); d.setAttribute('cy', f1(rp.y));
        d.setAttribute('rx', f1(rp.size * e)); d.setAttribute('ry', f1(rp.size * e * 0.22));
        d.setAttribute('opacity', (1 - age).toFixed(2));
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect(); io?.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll); window.clearInterval(rectTimer);
      hit.removeEventListener('pointerdown', onDown); hit.removeEventListener('pointermove', onDrag);
      hit.removeEventListener('pointerup', onUp); hit.removeEventListener('pointercancel', onUp);
      bus.handlers.delete(cmd);
      if (control) control.current = null;
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      while (obj.firstChild) obj.removeChild(obj.firstChild);
      while (itemHits.firstChild) itemHits.removeChild(itemHits.firstChild);
      state.current = null;
    };
    // The stage is per scene and never changes after mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  /* The svg box: 316×318 rig units around the 231-tall figure, in scene px via the overlay's --lsl-k.
     The anchor is a 0×0 point at his hips; the svg is offset so rig (63,172) lands on it. */
  const u = `calc(var(--lsl-k, 1px) * ${r})`;                      // px per rig unit
  return (
    <>
      {/* scene objects, in scene units: decorations under him, items and effects drawn over the buildings */}
      <svg ref={objRef} className="lsl-objects" viewBox={`0 0 ${stage.vw} ${stage.vh}`} preserveAspectRatio="none" aria-hidden="true" />
      <div ref={itemHitsRef} className="lsl-item-hits" />
      <div ref={anchorRef} className="lsl-live" style={{ ['--lsl-r' as string]: r }}>
        <svg ref={svgRef} aria-hidden="true" focusable="false" viewBox={MASCOT_VIEWBOX} className="lsl-live-svg"
          style={{ width: `calc(${u} * 316)`, height: `calc(${u} * 318)`, left: `calc(${u} * -158)`, top: `calc(${u} * -238)`, transformOrigin: `calc(${u} * 158) calc(${u} * 238)` }} />
        <button ref={hitRef} type="button" className="lsl-live-hit" aria-label="Shorty. Tap him and he says something; drag him around the boardwalk."
          style={{ left: `calc(${u} * -52)`, top: `calc(${u} * -175)`, width: `calc(${u} * 104)`, height: `calc(${u} * 236)` }} />
      </div>
    </>
  );
}

export { DEFAULT_TUNE };
