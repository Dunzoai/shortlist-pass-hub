"use client";

/**
 * Shorty, animated — ported from the app (loyalty-pwa components/shorty/ShortyMascot.tsx).
 * Pure SVG driven by one requestAnimationFrame loop; poses live in
 * src/lib/shorty/mascot/poses.ts, the drawing in rig.ts. A mood change blends
 * from whatever is on screen. Reduced motion draws one still frame per mood.
 */
import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { makeRig, type RigUpdate } from "@/lib/shorty/mascot/rig";
import {
  resolvePose, lerpPose, easeInOutSoft, seg, withPhoneInHand,
  type MascotMood, type MascotTask, type Pose, type ResolvedPose,
} from "@/lib/shorty/mascot/poses";
import { MASCOT_VIEWBOX, mascotBoxHeight, mascotBoxWidth } from "@/lib/shorty/mascot/frame";

type Props = {
  mood: MascotMood;
  task?: MascotTask;
  /** HIS height in px; the drawn box is bigger (frame.ts). Under 100 draws the small version. */
  size?: number;
  /** Keep his phone in his right glove in every pose (website hero). */
  holdPhone?: boolean;
  /** Draw one frame and stop (a still picture), whatever the reduced-motion setting. */
  still?: boolean;
  style?: CSSProperties;
};

const BLEND_S = 0.6;
const SEEDS = [3, 7, 11];

export function ShortyMascot({ mood, task = "none", size = 160, holdPhone = false, still = false, style }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const small = size < 100;
  const resolved = useMemo(() => resolvePose(mood, task), [mood, task]);
  /* read every frame, so it can switch on after the loop is built */
  const holdPhoneRef = useRef(holdPhone);
  holdPhoneRef.current = holdPhone;

  const state = useRef<{
    update: RigUpdate; reduce: boolean; current: ResolvedPose; start: number;
    from: Pose | null; blendAt: number; last: Pose | null; nextBlink: number; blinkAt: number;
    raf: number; draw: () => void;
  } | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const reduce = still || (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
    /* Phones: skip the line-boil filter (it regenerates noise 10x a second) and draw at 30fps. */
    const narrow = window.matchMedia?.("(max-width: 899px)").matches ?? false;
    const now = performance.now() / 1000;
    const st = {
      update: makeRig(svg, { small, reduce, boil: !small && !narrow }), reduce, current: resolved, start: now,
      from: null as Pose | null, blendAt: 0, last: null as Pose | null,
      nextBlink: now + 2 + Math.random() * 2, blinkAt: -1, raf: 0, draw: () => {},
    };
    st.draw = () => {
      const t = performance.now() / 1000;
      const r = st.current;
      let p = r.pose(st.reduce ? r.still : t - st.start);
      if (holdPhoneRef.current) p = withPhoneInHand(p);
      if (st.from && !st.reduce) {
        const k = seg(t - st.blendAt, 0, BLEND_S);
        if (k < 1) p = lerpPose(st.from, p, easeInOutSoft(k)); else st.from = null;
      }
      p.t = t;
      if (!st.reduce) {
        if (t >= st.nextBlink) { st.blinkAt = t; st.nextBlink = t + 3 + Math.random() * 2; }
        const b = (t - st.blinkAt) / 0.15;
        p.blink = b >= 0 && b <= 1 ? 1 - Math.sin(b * Math.PI) * 0.92 : 1;
        p.boilSeed = SEEDS[Math.floor(t * 10) % SEEDS.length];
      }
      st.last = p;
      st.update(p, r.swapProps);
    };
    state.current = st;
    /* Only run while he's on screen. */
    let visible = true, lastDraw = 0;
    const loop = () => {
      st.raf = 0;
      if (!visible) return;
      const now = performance.now();
      if (!narrow || now - lastDraw >= 33) { lastDraw = now; st.draw(); }
      st.raf = requestAnimationFrame(loop);
    };
    let io: IntersectionObserver | null = null;
    if (reduce) st.draw();
    else {
      st.raf = requestAnimationFrame(loop);
      io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible && !st.raf) st.raf = requestAnimationFrame(loop);
      }, { rootMargin: "200px" });
      io.observe(svg);
    }
    return () => {
      io?.disconnect();
      cancelAnimationFrame(st.raf);
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      state.current = null;
    };
    // Built once per size; mood changes are handled below without rebuilding.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [small]);

  useEffect(() => {
    const st = state.current;
    if (!st || st.current === resolved) return;
    const t = performance.now() / 1000;
    st.from = st.last ? (JSON.parse(JSON.stringify(st.last)) as Pose) : null;
    st.blendAt = t; st.start = t; st.current = resolved;
    if (st.reduce) st.draw();
  }, [resolved]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      focusable="false"
      data-mascot-mood={mood}
      viewBox={MASCOT_VIEWBOX}
      width={mascotBoxWidth(size)}
      height={mascotBoxHeight(size)}
      style={{ display: "block", overflow: "visible", pointerEvents: "none", ...style }}
    />
  );
}
