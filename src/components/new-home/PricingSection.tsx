"use client";

/**
 * Pricing, directly below "Shorty's got skills." on /new. Cut-paper boxes (a hand-cut edge, grain, a deeper wash
 * in one corner, a thick outline and a hard offset shadow), a cream chapter. For Businesses two boxes (the $50
 * one first, so it leads on a phone); for HOAs one.
 *
 * Behind the Business boxes Shorty lives on a 32 second loop (all CSS, running only while the section is on
 * screen): he peeks through the gap, walks behind the free box to its far side and looks at it, walks back and
 * peeks again, comes out beside the $50 box and taps it, it lights up and bounces, he smiles, repeat.
 * On a phone the boxes stack, so the same loop plays in the gap between them: he peeks over the free box, looks
 * down at it from the right, ducks, then taps the $50 box from below.
 * Both CTAs point at the signup that already exists on the page.
 */
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useAudience } from "./audience";
import { APP_SIGNUP_URL } from "./SiteHeader";
import { G, RestGlove, Sneaker, ink, ticketPath } from "./SkillsSection";

const INK = "#14161A", MINT_LIGHT = "#D7F5E8", MINT = "#34D399", PAPER = "#F6F1E4";
const SANS = "var(--font-sora), system-ui, sans-serif";
const SERIF = "var(--font-fraunces), Georgia, serif";
const BODY = "var(--font-sans-inter), system-ui, sans-serif";

/* Paper grain: the same noise the other sections use. */
const GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/* ---------- the paper: a hand-cut outline, built once (no SVG filters, so it stays smooth on a phone) ---------- */

/** A rounded rectangle whose edge wobbles a little, like scissors: a seeded jitter, so server and client agree. */
function cutPath(w: number, h: number, seed: number, r = 18, step = 8, amp = 1.5) {
  let a = seed;
  const rnd = () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const wob = (i: number) => (rnd() - 0.5) * amp * 1.6 + Math.sin(i * 0.41 + seed) * amp * 0.7;
  const pts: string[] = [];
  const f = (n: number) => n.toFixed(1);
  let i = 0;
  for (let x = r; x < w - r; x += step) pts.push(`${f(x)} ${f(wob(i++))}`);
  for (let k = 0; k <= 3; k++) { const ang = -Math.PI / 2 + (k / 3) * (Math.PI / 2); pts.push(`${f(w - r + Math.cos(ang) * r + wob(i++) * 0.4)} ${f(r + Math.sin(ang) * r + wob(i++) * 0.4)}`); }
  for (let y = r; y < h - r; y += step) pts.push(`${f(w + wob(i++))} ${f(y)}`);
  for (let k = 0; k <= 3; k++) { const ang = (k / 3) * (Math.PI / 2); pts.push(`${f(w - r + Math.cos(ang) * r + wob(i++) * 0.4)} ${f(h - r + Math.sin(ang) * r + wob(i++) * 0.4)}`); }
  for (let x = w - r; x > r; x -= step) pts.push(`${f(x)} ${f(h + wob(i++))}`);
  for (let k = 0; k <= 3; k++) { const ang = Math.PI / 2 + (k / 3) * (Math.PI / 2); pts.push(`${f(r + Math.cos(ang) * r + wob(i++) * 0.4)} ${f(h - r + Math.sin(ang) * r + wob(i++) * 0.4)}`); }
  for (let y = h - r; y > r; y -= step) pts.push(`${f(wob(i++))} ${f(y)}`);
  for (let k = 0; k <= 3; k++) { const ang = Math.PI + (k / 3) * (Math.PI / 2); pts.push(`${f(r + Math.cos(ang) * r + wob(i++) * 0.4)} ${f(r + Math.sin(ang) * r + wob(i++) * 0.4)}`); }
  return `M${pts.join("L")}Z`;
}
const CUT_FEATURED = cutPath(400, 560, 3);
const CUT_FREE = cutPath(400, 560, 9);
const CUT_HOA = cutPath(400, 440, 5);

/** The sheet: a hard offset shadow, the paper, a light/deep wash across it, and grain over the lot. */
function Paper({ d, h, fill, thick }: { d: string; h: number; fill: string; thick?: boolean }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox={`-8 -8 416 ${h + 24}`} preserveAspectRatio="none" className="pointer-events-none absolute -inset-[6px] h-[calc(100%+12px)] w-[calc(100%+12px)] overflow-visible">
      <path d={d} transform="translate(7 8)" fill={INK} />
      <path d={d} fill={fill} stroke={INK} strokeWidth={thick ? 4.5 : 3.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d={d} fill="url(#pr-wash)" />
      <path d={d} fill="url(#pr-grain)" opacity="0.2" style={{ mixBlendMode: "multiply" }} />
    </svg>
  );
}

/* ---------- Shorty's loop ---------- */

const LOOP = 32;
type Stop = [number, string];
const kf = (name: string, stops: Stop[]) =>
  `@keyframes ${name}{${stops.map(([t, v]) => `${((t / LOOP) * 100).toFixed(2)}%{${v}}`).join("")}}`;
const tf = (v: string) => `transform:${v}`;
const NONE = tf("none");
const byTime = (a: Stop[]) => a.sort((x, y) => x[0] - y[0]).filter((s, i, l) => i === 0 || s[0] > l[i - 1][0]);
/* The beats, in seconds: peek 0-2.8, walk right 2.8-7.4, look 7.4-11, walk back 11-15.4, peek 15.4-18.2,
   walk left 18.2-22.8, tap 22.8-26, smile 24.3-27.4, walk back to the gap 27.4-32. */
const WALKS: [number, number][] = [[2.8, 7.4], [11, 15.4], [18.2, 22.8], [27.4, LOOP]];
const REST_ARM = 85;

function legStops(phase: 0 | 1): Stop[] {
  const out: Stop[] = [[0, NONE]];
  for (const [t0, t1] of WALKS) {
    out.push([t0, NONE]);
    for (let k = 1; t0 + k * 0.25 < t1 - 0.01; k++) out.push([+(t0 + k * 0.25).toFixed(3), k % 2 === phase ? tf("translateY(-5px)") : NONE]);
    out.push([t1, NONE]);
  }
  return byTime(out);
}
function bobStops(): Stop[] {
  const out: Stop[] = [[0, NONE]];
  for (const [t0, t1] of WALKS) {
    out.push([t0, NONE]);
    for (let k = 1; t0 + k * 0.25 < t1 - 0.01; k++) out.push([+(t0 + k * 0.25).toFixed(3), k % 2 === 0 ? tf("translateY(-2px)") : NONE]);
    out.push([t1, NONE]);
  }
  return byTime(out);
}
/** Desktop: where his middle is, in % of the stage width (the gap sits at 52, the margins at 6.5 and 94.5). */
const dx = (x: number) => tf(`translate(calc(${x}cqw - 50%),0)`);
const DESKTOP_X: [number, number][] = [[0, 52], [2.8, 52], [7.4, 94.5], [11, 94.5], [15.4, 52], [18.2, 52], [22.8, 6.5], [27.4, 6.5], [LOOP, 52]];
/** Phone: he lives in the gap between the stacked boxes: x in % of that gap, y = how far he's sunk behind the free box. */
const mv = (x: number, y: number, px = 0) => tf(`translate(calc(${x}cqw - 50%),calc(${y}% + ${px}px))`);
const PHONE_XY: [number, number, number, number][] = [
  [0, 50, 100, 0], [0.2, 50, 100, 0], [1.2, 50, 55, 0], [2.8, 50, 55, 0], [3.6, 50, 0, 0], [7.4, 86, 0, 0], [11, 86, 0, 0],
  [12.5, 74, 100, 0], [15.4, 50, 100, 0], [16.4, 50, 55, 0], [18.2, 50, 55, 0], [19, 50, 0, 0], [22.8, 14, 0, 0],
  [23.8, 14, 0, 0], [24, 14, 0, -10], [24.2, 14, 0, 0], [24.5, 14, 0, -10], [24.8, 14, 0, 0], [27.4, 14, 0, 0], [30.4, 44, 100, 0], [LOOP, 50, 100, 0],
];
const arm = (list: [number, number][]) => list.map(([t, a]) => [t, tf(`rotate(${a}deg)`)] as Stop);
const look = (list: [number, number, number][]) => list.map(([t, x, y]) => [t, tf(`translate(${x}px,${y}px)`)] as Stop);
const glances: [number, number, number][] = [[1, 0, 0], [1.6, -2.5, 0], [2.2, 2.5, 0], [2.7, 0, 0], [16.2, 0, 0], [16.8, -2.5, 0], [17.4, 2.5, 0], [17.9, 0, 0]];
const lookD = look([[0, 0, 0], ...glances.slice(0, 4), [7.4, 0, 0], [8, -3, 0], [10.6, -3, 0], [11, 0, 0], [15.4, 0, 0], ...glances.slice(4), [22.8, 0, 0], [23.2, 3, 0], [26, 3, 0], [26.7, 0, 0], [LOOP, 0, 0]]);
const lookM = look([[0, 0, 0], ...glances.slice(0, 4), [7.4, 0, 0], [8, 0, 3], [10.6, 0, 3], [11, 0, 0], [15.4, 0, 0], ...glances.slice(4), [22.8, 0, 0], [23.2, 0, -3], [26, 0, -3], [26.7, 0, 0], [LOOP, 0, 0]]);
const fade = (a: number, b: number): Stop[] => [[0, "opacity:1"], [a, "opacity:1"], [a + 0.2, "opacity:0"], [b, "opacity:0"], [b + 0.3, "opacity:1"], [LOOP, "opacity:1"]];
const fadeIn = (a: number, b: number): Stop[] => [[0, "opacity:0"], [a, "opacity:0"], [a + 0.2, "opacity:1"], [b, "opacity:1"], [b + 0.3, "opacity:0"], [LOOP, "opacity:0"]];

const KEYFRAMES = [
  kf("pw-dx", DESKTOP_X.map(([t, x]) => [t, dx(x)] as Stop)),
  kf("pw-mx", PHONE_XY.map(([t, x, y, px]) => [t, mv(x, y, px)] as Stop)),
  kf("pw-leg0", legStops(0)), kf("pw-leg1", legStops(1)), kf("pw-bob", bobStops()),
  kf("pw-tilt-d", [[0, tf("rotate(0deg)")], [7.4, tf("rotate(0deg)")], [8.2, tf("rotate(-5deg)")], [10.5, tf("rotate(-5deg)")], [11, tf("rotate(0deg)")], [22.8, tf("rotate(0deg)")], [23.4, tf("rotate(5deg)")], [26, tf("rotate(5deg)")], [26.7, tf("rotate(0deg)")], [LOOP, tf("rotate(0deg)")]]),
  kf("pw-tilt-m", [[0, tf("rotate(0deg)")], [7.4, tf("rotate(0deg)")], [8.2, tf("rotate(4deg)")], [10.5, tf("rotate(4deg)")], [11, tf("rotate(0deg)")], [LOOP, tf("rotate(0deg)")]]),
  kf("pw-arm-d", arm([[0, REST_ARM], [22.8, REST_ARM], [23.5, 14], [23.9, 4], [24.2, 14], [24.5, 4], [24.8, 14], [26, 14], [26.7, REST_ARM], [LOOP, REST_ARM]])),
  kf("pw-arm-m", arm([[0, REST_ARM], [22.8, REST_ARM], [23.5, -76], [23.9, -68], [24.2, -76], [24.5, -68], [24.8, -76], [26, -76], [26.7, REST_ARM], [LOOP, REST_ARM]])),
  kf("pw-look-d", lookD), kf("pw-look-m", lookM),
  kf("pw-blink", [[0, tf("scaleY(1)")], [4.9, tf("scaleY(1)")], [5, tf("scaleY(.1)")], [5.14, tf("scaleY(1)")], [13.2, tf("scaleY(1)")], [13.3, tf("scaleY(.1)")], [13.44, tf("scaleY(1)")], [20.5, tf("scaleY(1)")], [20.6, tf("scaleY(.1)")], [20.74, tf("scaleY(1)")], [LOOP, tf("scaleY(1)")]]),
  kf("pw-neutral", fade(24.3, 27.2)), kf("pw-smile", fadeIn(24.3, 27.2)),
  kf("pr-glow", [[0, "opacity:0"], [23.8, "opacity:0"], [24.1, "opacity:1"], [26.4, "opacity:.9"], [27.8, "opacity:0"], [LOOP, "opacity:0"]]),
  kf("pr-bounce", [[0, "scale:1"], [24, "scale:1"], [24.25, "scale:1.035"], [24.55, "scale:.99"], [24.9, "scale:1.018"], [25.3, "scale:1"], [LOOP, "scale:1"]]),
].join("\n");

const MOVERS = ".pw-bob,.pw-tilt,.pw-leg0,.pw-leg1,.pw-look,.pw-blink,.pw-arm,.pw-neutral,.pw-eyes,.pw-smile,.pw-happy,.pw-d,.pw-m,.pr-featured,.pr-halo,.pr-lit";
const CSS = `
.pr-box{position:relative;z-index:1;transition:translate .15s ease}
@media (hover:hover){.pr-box:hover{translate:0 -4px}}
.pr-lit,.pr-halo{position:absolute;pointer-events:none;opacity:0}
.pr-lit{inset:0;border-radius:18px;background:radial-gradient(closest-side at 50% 42%,rgba(255,255,255,.62),rgba(255,255,255,0) 82%);mix-blend-mode:soft-light}
.pr-halo{inset:0;border-radius:20px;box-shadow:0 0 54px 18px rgba(52,211,153,.7);z-index:-1}
.pr-stage{container-type:inline-size;position:relative}
.pr-grid{display:flex;flex-direction:column}
.pr-alley{position:relative;height:104px;container-type:inline-size;display:block}
.pw{position:absolute;left:0;bottom:0;z-index:0;pointer-events:none;aspect-ratio:190/250}
.pw svg{display:block;width:100%;height:100%;overflow:visible}
.pw-d{display:none}
.pw-m{height:98px;transform:translate(calc(50cqw - 50%),55%)}
.pw-tilt,.pw-arm{transform-box:view-box}
.pw-tilt{transform-origin:94px 238px}
.pw-arm{transform-origin:141px 106px;transform:rotate(${REST_ARM}deg)}
.pw-blink{transform-box:fill-box;transform-origin:center}
.pw-smile,.pw-happy{opacity:0}
.pr-featured .pr-halo{animation:pr-glow ${LOOP}s ease-in-out infinite}
.pr-featured .pr-lit{animation:pr-glow ${LOOP}s ease-in-out infinite}
.pr-featured{animation:pr-bounce ${LOOP}s ease-in-out infinite}
.pw-m{animation:pw-mx ${LOOP}s linear infinite}
.pw-m .pw-look{animation:pw-look-m ${LOOP}s ease-in-out infinite}
.pw-m .pw-tilt{animation:pw-tilt-m ${LOOP}s ease-in-out infinite}
.pw-m .pw-arm{animation:pw-arm-m ${LOOP}s ease-in-out infinite}
.pw-bob{animation:pw-bob ${LOOP}s ease-in-out infinite}
.pw-leg0{animation:pw-leg0 ${LOOP}s ease-in-out infinite}
.pw-leg1{animation:pw-leg1 ${LOOP}s ease-in-out infinite}
.pw-blink{animation:pw-blink ${LOOP}s ease-in-out infinite}
.pw-eyes,.pw-neutral{animation:pw-neutral ${LOOP}s ease-in-out infinite}
.pw-smile,.pw-happy{animation:pw-smile ${LOOP}s ease-in-out infinite}
${KEYFRAMES}
${MOVERS}{animation-play-state:paused}
[data-live] :is(${MOVERS}){animation-play-state:running}
@media (min-width:900px){
  .pr-grid{display:grid;grid-template-columns:1.12fr 1fr;column-gap:6cqw;padding-inline:11cqw;align-items:stretch}
  .pr-alley,.pw-m{display:none}
  .pw-d{display:block;bottom:8px;height:14.5cqw;transform:translate(calc(52cqw - 50%),0);animation:pw-dx ${LOOP}s linear infinite}
  .pw-d .pw-look{animation:pw-look-d ${LOOP}s ease-in-out infinite}
  .pw-d .pw-tilt{animation:pw-tilt-d ${LOOP}s ease-in-out infinite}
  .pw-d .pw-arm{animation:pw-arm-d ${LOOP}s ease-in-out infinite}
}
@media (prefers-reduced-motion: reduce){
  .pr-box{transition:none}.pr-box:hover{translate:none}
  ${MOVERS}{animation:none !important}
  .pr-lit,.pr-halo{display:none}
}
`;

/** A small hand-drawn check mark. Decorative: the line beside it carries the meaning. */
function Check() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="mt-[3px] h-[22px] w-[22px] shrink-0">
      <circle cx="12" cy="12" r="10" fill={MINT} stroke={INK} strokeWidth="2" />
      <path d="M6.600 12.600 L10.300 16.200 L17.600 7.800" fill="none" stroke={INK} strokeWidth="2.600" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Lines({ items }: { items: string[] }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-2.5 text-[16.5px] leading-[1.35] font-semibold text-[#14161A]" style={{ fontFamily: BODY }}>
          <Check />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

const FINE = "text-[13.5px] leading-[1.45] text-[#14161A]/[0.72]";

/** The "VERIFIED" stamp: a mint circle with the site's own logo mark (its shield is a cut-out, so cream shows through), tilted, with the word under it. */
function Stamp() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -top-6 -right-3 z-10 flex w-[104px] flex-col items-center min-[900px]:-top-7 min-[900px]:-right-5 min-[900px]:w-[116px]" style={{ rotate: "8deg" }}>
      <div className="relative h-[78px] w-[78px] overflow-hidden rounded-full border-[3px] border-[#14161A] bg-[#FBF6E6] shadow-[2px_3px_0_#14161A] min-[900px]:h-[88px] min-[900px]:w-[88px]">
        <Image src="/shortlist-mint-mark.png" alt="" width={160} height={160} loading="eager" className="absolute -top-[14%] -left-[14%] h-[128%] w-[128%] max-w-none" />
      </div>
      <span
        className="-mt-2.5 rounded-full border-[2.5px] border-[#14161A] bg-[#FBF6E6] px-2.5 py-[2px] text-[11.5px] font-extrabold tracking-[0.12em] text-[#14161A] shadow-[2px_3px_0_#14161A]"
        style={{ fontFamily: SANS }}
      >
        VERIFIED
      </span>
    </div>
  );
}

const BTN = "inline-flex min-h-12 items-center justify-center rounded-full px-7 text-[16px] font-bold whitespace-nowrap no-underline";

function Box({ featured, d, h, fill, children }: { featured?: boolean; d: string; h: number; fill: string; children: React.ReactNode }) {
  return (
    <article className={`pr-box ${featured ? "pr-featured" : ""}`}>
      {featured && <span className="pr-halo" aria-hidden="true" />}
      <Paper d={d} h={h} fill={fill} thick={featured} />
      {featured && <span className="pr-lit" aria-hidden="true" />}
      {children}
    </article>
  );
}

/** Shorty, cut-paper style, drawn small for behind the boxes: his own parts so they can move on their own. */
function PwShorty({ cls }: { cls: string }) {
  const w = { fill: G.white, ...ink(2.3) };
  return (
    <div className={`pw ${cls}`} aria-hidden="true">
      <svg viewBox="0 0 190 250" focusable="false">
        <g className="pw-bob">
          <g className="pw-tilt">
            <g transform="translate(30 6)">
              <g className="pw-leg0">
                <path d="M52 158 V170 Q42 199 44 224" fill="none" stroke={G.ink} strokeWidth="7" strokeLinecap="round" />
                <Sneaker side={-1} x={44} y={228} />
              </g>
              <g className="pw-leg1">
                <path d="M75 158 V170 Q85.500 199 84 224" fill="none" stroke={G.ink} strokeWidth="7" strokeLinecap="round" />
                <Sneaker side={1} x={84} y={228} />
              </g>
              <path d={ticketPath(0)} fill={G.side} {...ink(3.4)} transform="translate(-2.6 1.6)" />
              <path d={ticketPath(0)} fill={G.green} {...ink(3.4)} />
              <path d={ticketPath(4.2)} fill="none" stroke={G.stitch} strokeWidth="1.1" strokeDasharray="3 2.6" opacity="0.85" />
              <path d="M82 104 V150 H42 V90 A20 20 0 0 1 81 85" fill="none" stroke={G.white} strokeWidth="5.200" strokeLinejoin="miter" />
              <path d="M50 113 L59.500 123.500 L84 93" fill="none" stroke={G.white} strokeWidth="5.400" strokeLinejoin="miter" strokeLinecap="square" />
              {/* the face: eyes that look around and blink, a closed smirk that becomes a real smile */}
              <path d="M-4.200 1.800 Q0 -2.400 4.200 1.800" transform="translate(49 30.500) rotate(-6)" fill="none" {...ink(2.4)} />
              <path d="M-4.200 1.800 Q0 -2.400 4.200 1.800" transform="translate(74.500 30.500) rotate(6)" fill="none" {...ink(2.4)} />
              <g className="pw-look">
                <g className="pw-blink"><g className="pw-eyes">
                  <path d="M0 0 L2.900 -2.200 A3.100 6 0 1 1 1 -5.700 Z" transform="translate(51.500 45.500)" fill={G.ink} />
                  <path d="M0 0 L2.900 -2.200 A3.100 6 0 1 1 1 -5.700 Z" transform="translate(72.500 45.500)" fill={G.ink} />
                </g></g>
                <g className="pw-happy">
                  <path d="M45.500 46 Q51.500 38 57.500 46" fill="none" {...ink(2.8)} />
                  <path d="M66.500 46 Q72.500 38 78.500 46" fill="none" {...ink(2.8)} />
                </g>
              </g>
              <path className="pw-neutral" d="M53 59 Q62 65.500 72 58" fill="none" {...ink(2.4)} />
              <path className="pw-smile" d="M48.500 57 Q62 74 75.500 57" fill="none" {...ink(3)} />
              {/* his left arm hangs; the fist is a plain glove */}
              <path d="M15 100 Q-12 108 -14 134" fill="none" stroke={G.ink} strokeWidth="6" strokeLinecap="round" />
              <circle cx="-14" cy="141" r="8.600" {...w} />
              <path d="M-18.500 139 Q-14 141.500 -9.500 139 M-18.500 144 Q-14 146.500 -9.500 144" fill="none" {...ink(1.3)} />
            </g>
            {/* the arm that taps (origin: his right shoulder) */}
            <g className="pw-arm">
              <g transform="translate(30 6)">
                <path d="M111 100 Q136 86 160 88" fill="none" stroke={G.ink} strokeWidth="6" strokeLinecap="round" />
                <g transform="translate(160 88) rotate(9)"><RestGlove /></g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

export function PricingSection() {
  const { audience } = useAudience();
  const hoa = audience === "hoa";
  const root = useRef<HTMLElement | null>(null);

  /* Shorty only moves while the section is on screen. */
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => el.toggleAttribute("data-live", e.isIntersecting)), { threshold: [0, 0.05] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={root} aria-labelledby="pricing-h" className="relative overflow-x-clip bg-[#FBF8F0] px-5 py-14 min-[900px]:px-10 min-[900px]:py-24">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {/* the shared paper textures: a wash that's lighter top-left and deeper bottom-right, and the grain */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="pr-wash" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.4" />
            <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#6b5a3a" stopOpacity="0.12" />
          </linearGradient>
          <pattern id="pr-grain" patternUnits="userSpaceOnUse" width="80" height="80">
            <image href={GRAIN_URL} width="80" height="80" />
          </pattern>
        </defs>
      </svg>

      <div className="mx-auto max-w-[1100px]">
        <div className="text-center">
          <h2 id="pricing-h" className="font-extrabold leading-[1.04] tracking-[-0.03em] text-[#1A1C20]" style={{ fontFamily: SANS, fontSize: "clamp(32px, 5.4vw, 72px)" }}>
            {hoa ? "Your community, your voice." : "Pick your Shorty."}
          </h2>
          {!hoa && (
            <p className="mt-2 leading-[1.25] text-[#1A1C20]/80 min-[900px]:mt-3" style={{ fontFamily: SERIF, fontSize: "clamp(19px, 2.2vw, 30px)" }}>
              Claim yours free, or let him run the business.
            </p>
          )}
        </div>

        {hoa ? (
          <div className="mx-auto mt-12 max-w-[640px] min-[900px]:mt-16">
            <Box fill={MINT_LIGHT} d={CUT_HOA} h={440}>
              <div className="relative flex flex-col items-center gap-5 px-6 py-9 text-center min-[900px]:px-12 min-[900px]:py-12">
                <h3 className="text-[26px] leading-[1.1] font-extrabold tracking-[-0.02em] text-[#14161A] min-[900px]:text-[34px]" style={{ fontFamily: SANS }}>
                  Shorty is free to every HOA
                </h3>
                <p className="text-[21px] leading-[1.3] text-[#14161A] min-[900px]:text-[25px]" style={{ fontFamily: SERIF }}>
                  The Shortlist wants you to control the communication in your own community.
                </p>
                <p className={FINE} style={{ fontFamily: BODY }}>Everything Shorty does, except checkout.</p>
                <a href={APP_SIGNUP_URL} className={`${BTN} mt-1 bg-[#14161A] text-[#F6F1E4]`} style={{ fontFamily: BODY }}>
                  Set up your community, free
                </a>
              </div>
            </Box>
          </div>
        ) : (
          <div className="pr-stage mt-14 min-[900px]:mt-[72px]">
            <div className="pr-grid">
              <Box featured fill={MINT_LIGHT} d={CUT_FEATURED} h={560}>
                <Stamp />
                <div className="relative flex h-full flex-col gap-5 px-6 py-8 min-[900px]:px-10 min-[900px]:py-11">
                  <h3 className="max-w-[78%] text-[26px] leading-[1.1] font-extrabold tracking-[-0.02em] text-[#14161A] min-[900px]:max-w-[80%] min-[900px]:text-[34px]" style={{ fontFamily: SANS }}>
                    Get your own verified Shorty
                  </h3>
                  <p className="flex items-baseline gap-2 text-[#14161A]" style={{ fontFamily: SANS }}>
                    <span className="text-[76px] leading-none font-extrabold tracking-[-0.04em] min-[900px]:text-[96px]">$50</span>
                    <span className="text-[17px] font-bold" style={{ fontFamily: BODY }}>/ month</span>
                  </p>
                  <Lines items={["Answers customers 24/7", "Ordering", "Bookings", "Reports"]} />
                  <div className="flex flex-col gap-1.5">
                    <p className={FINE} style={{ fontFamily: BODY }}>Integrated with Square and Stripe. We never touch your money.</p>
                    <p className={FINE} style={{ fontFamily: BODY }}>Texting and social posting are available as add-ons.</p>
                  </div>
                  <a href={APP_SIGNUP_URL} className={`${BTN} mt-auto self-start bg-[#14161A] text-[#F6F1E4]`} style={{ fontFamily: BODY }}>
                    Get your own Shorty
                  </a>
                </div>
              </Box>

              {/* phone only: the gap between the stacked boxes is where Shorty plays */}
              <div className="pr-alley" aria-hidden="true"><PwShorty cls="pw-m" /></div>

              <Box fill={PAPER} d={CUT_FREE} h={560}>
                <div className="relative flex h-full flex-col gap-5 px-6 py-8 min-[900px]:px-9 min-[900px]:py-11">
                  <h3 className="text-[24px] leading-[1.1] font-extrabold tracking-[-0.02em] text-[#14161A] min-[900px]:text-[30px]" style={{ fontFamily: SANS }}>
                    Claim a free Shorty
                  </h3>
                  <p className="text-[#14161A]" style={{ fontFamily: SANS }}>
                    <span className="text-[76px] leading-none font-extrabold tracking-[-0.04em] min-[900px]:text-[96px]">$0</span>
                  </p>
                  <Lines items={["Add your offerings", "Shorty chats with customers about your business"]} />
                  <p className={FINE} style={{ fontFamily: BODY }}>Limited knowledge. No ordering, booking or marketing.</p>
                  <a href={APP_SIGNUP_URL} className={`${BTN} mt-auto self-start border-[3px] border-[#14161A] bg-transparent text-[#14161A]`} style={{ fontFamily: BODY }}>
                    Claim a free Shorty
                  </a>
                </div>
              </Box>
            </div>
            {/* wide screens: Shorty walks behind the two boxes */}
            <PwShorty cls="pw-d" />
          </div>
        )}
      </div>
    </section>
  );
}
