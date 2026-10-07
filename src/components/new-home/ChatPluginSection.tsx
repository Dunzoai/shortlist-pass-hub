"use client";

/**
 * "Your customers are already asking ChatGPT": between the mint "AI agents are here" section and "Shorty's got skills." Cream paper
 * torn over the mint above and torn again over the charcoal below. Shorty is plugged into ChatGPT and Claude (their marks, drawn on paper
 * cards in our style), three things customers can now just ask for, and the billboard-vs-door point. Business view only.
 * The two install links are constants: the real ChatGPT plugin page and the Claude connector directory page.
 */
import { useEffect, useRef } from "react";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import { AI_LOGOS } from "./aiLogos";
import { PaperCard, cutPath } from "./PaperCard";
import { TornEdge, tearPolys } from "./TornEdge";
import { useAudience } from "./audience";

export const CHATGPT_PLUGIN_URL = "https://chatgpt.com/plugins/plugin_asdk_app_6abf0138fbb88191875bfcf06eca0dd9";
export const CLAUDE_CONNECTOR_URL = "https://claude.ai/directory/connectors/shortlist-pass";

const INK = "#14161A";
const CREAM = "#F5EDDC";
const PAPER = "#FBF6E6";
const MINT = "#5FDDAE";
const BRICK = "#C8624A";
const SANS = "var(--font-sora), system-ui, sans-serif";
const SERIF = "var(--font-fraunces), Georgia, serif";
const BODY = "var(--font-sans-inter), system-ui, sans-serif";
const GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";
const TEAR = tearPolys(29, 10, 0.8, 56);

/** One AI's card, tappable, sized in the scene's own units (cqw) so the whole picture scales together. Mint on hover and press. */
function LogoCard({ path, name, href, seed, tilt }: { path: string; name: string; href: string; seed: number; tilt: number }) {
  return (
    <a href={href} aria-label={`Add Shorty to ${name}`} className="logo-card block cursor-pointer no-underline outline-none">
      <PaperCard seed={seed} tilt={tilt} fill={PAPER} shadow="rgba(45,30,12,.34)">
        <div className="flex flex-col items-center" style={{ gap: "0.9cqw", padding: "2.2cqw 0.8cqw" }}>
          <svg viewBox="0 0 24 24" aria-hidden="true" fill={INK} style={{ width: "8.6cqw", height: "8.6cqw" }}><path d={path} /></svg>
          <span className="font-extrabold" style={{ fontFamily: SANS, color: INK, fontSize: "clamp(11px, 2.5cqw, 23px)" }}>{name}</span>
          <span className="inline-flex items-center rounded-full border-2 border-[#14161A] font-extrabold" style={{ background: MINT, color: "#0D2B20", fontFamily: SANS, fontSize: "clamp(8px, 1.25cqw, 12px)", letterSpacing: "0.12em", padding: "0.2cqw 1cqw", gap: "0.5cqw" }}>
            <span className="rounded-full bg-[#14161A]" style={{ width: "0.7cqw", height: "0.7cqw" }} />LIVE
          </span>
        </div>
      </PaperCard>
      <p className="text-center font-extrabold leading-tight text-[#6b6558]" style={{ fontFamily: SANS, marginTop: "1.2cqw", fontSize: "clamp(7.5px, 1.25cqw, 13px)", letterSpacing: "0.1em" }}>TAP TO ADD THE PLUGIN</p>
    </a>
  );
}

/** Little confirmations that float up out of the laptop, on a loop. */
const BUBBLES: { text: string; dx: number; fill: string }[] = [
  { text: "Plumber booked", dx: -17, fill: "#FBF6E6" },
  { text: "Burger ordered", dx: 17, fill: "#D7F5E8" },
  { text: "Dress shipped", dx: -19, fill: "#FBF6E6" },
  { text: "Yoga confirmed 7pm", dx: 16, fill: "#F5E7B6" },
  { text: "Coffee beans ordered", dx: -15, fill: "#D7F5E8" },
  { text: "Haircut Sat 2pm", dx: 19, fill: "#FBF6E6" },
  { text: "Table for 4 at 8", dx: -18, fill: "#F5E7B6" },
  { text: "Flowers on the way", dx: 15, fill: "#FBF6E6" },
  { text: "Oil change Tuesday", dx: 18, fill: "#D7F5E8" },
  { text: "Tacos ordered", dx: -16, fill: "#FBF6E6" },
];
const STEP = 1.7;

/** The stage: Shorty behind a paper desk, a laptop with the Shortlist mark in front of him, the two AI cards plugged into its sides, confirmations rising out of it. */
function PlugScene() {
  const root = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((e) => e.forEach((x) => el.toggleAttribute("data-live", x.isIntersecting)), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const cable = "M322 388 C 262 440, 268 214, 214 206";
  return (
    <div ref={root} className="plug-scene relative mx-auto mt-12 w-full max-w-[940px] sm:mt-16" style={{ containerType: "inline-size", aspectRatio: "940 / 520" }}>
      {/* Shorty, behind everything */}
      <div className="absolute left-1/2 z-[1] -translate-x-1/2" style={{ bottom: "22%", height: "92%", width: "40%" }}>
        <ShortyMascot mood="typing" size={170} style={{ position: "absolute", left: "50%", bottom: 0, transform: "translateX(-50%)", height: "100%", width: "auto" }} />
      </div>
      {/* confirmations, rising from behind the laptop */}
      {BUBBLES.map((b, i) => (
        <span key={b.text} aria-hidden="true" className={`plug-bubble absolute left-1/2 z-[2] whitespace-nowrap rounded-full border-2 border-[#14161A] font-bold ${i > 5 ? "max-sm:hidden" : ""}`} style={{ bottom: "34%", background: b.fill, color: INK, fontFamily: BODY, fontSize: "clamp(10px, 1.9cqw, 18px)", padding: "0.5cqw 1.6cqw", boxShadow: `2px 3px 0 ${INK}`, ["--dx" as string]: `${b.dx}cqw`, animationDelay: `${(i * STEP).toFixed(1)}s`, animationDuration: `${(BUBBLES.length * STEP).toFixed(1)}s` }}>
          {b.text} <span style={{ color: "#1f9d74" }}>✓</span>
        </span>
      ))}
      {/* the two cards, standing on the desk */}
      <div className="absolute z-[4]" style={{ left: "1%", top: "9%", width: "21%" }}><LogoCard path={AI_LOGOS.openai} name="ChatGPT" href={CHATGPT_PLUGIN_URL} seed={71} tilt={-1.5} /></div>
      <div className="absolute z-[4]" style={{ right: "1%", top: "9%", width: "21%" }}><LogoCard path={AI_LOGOS.claude} name="Claude" href={CLAUDE_CONNECTOR_URL} seed={72} tilt={1.5} /></div>
      {/* the desk: a slab of paper, in front of Shorty's legs */}
      <div className="absolute inset-x-[-1.5%] bottom-0 z-[3]" style={{ height: "27%" }}>
        <PaperCard seed={63} fill="#D8B987" shadow="rgba(45,30,12,.38)" className="h-full">
          <div className="relative h-full" style={{ borderTop: "6px solid rgba(255,255,255,.3)" }}>
            <span className="absolute left-[14%] top-[28%] h-[34%] w-[30%] rounded-md border-[3px] border-[rgba(90,60,25,.35)]" /><span className="absolute left-[22%] top-[40%] h-[8%] w-[14%] rounded-full bg-[rgba(90,60,25,.45)]" />
            <span className="absolute right-[14%] top-[28%] h-[34%] w-[30%] rounded-md border-[3px] border-[rgba(90,60,25,.35)]" /><span className="absolute right-[22%] top-[40%] h-[8%] w-[14%] rounded-full bg-[rgba(90,60,25,.45)]" />
          </div>
        </PaperCard>
      </div>
      {/* the laptop, back of the lid toward us, with our logo on it */}
      <svg viewBox="0 0 330 210" aria-hidden="true" focusable="false" className="absolute left-1/2 z-[4] -translate-x-1/2 overflow-visible" style={{ bottom: "23%", width: "30%" }}>
        <rect x="38" y="22" width="262" height="158" rx="12" fill="rgba(45,30,12,.34)" />
        <rect x="30" y="12" width="262" height="158" rx="12" fill="#D6D9DC" stroke={INK} strokeWidth="5" />
        <rect x="30" y="12" width="262" height="158" rx="12" fill="url(#lap-w)" />
        <image href="/shortlist-mint-mark.png" x="121" y="48" width="80" height="80" />
        <rect x="60" y="168" width="202" height="8" fill="#8f9499" stroke={INK} strokeWidth="3" />
        <path d="M6 176 H316 L324 196 Q324 204 316 204 H6 Q-2 204 -2 196 Z" fill="#B9BDC1" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <defs><linearGradient id="lap-w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset=".6" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#3a2410" stopOpacity=".12" /></linearGradient></defs>
      </svg>
      {/* USB cables: from the laptop's two sides to the two cards, plugged in at both ends */}
      <svg viewBox="0 0 940 520" preserveAspectRatio="none" aria-hidden="true" focusable="false" className="pointer-events-none absolute inset-0 z-[5] h-full w-full overflow-visible">
        {[false, true].map((flip) => (
          <g key={String(flip)} transform={flip ? "translate(940 0) scale(-1 1)" : undefined}>
            <path d={cable} fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
            <path d={cable} fill="none" stroke="#5FDDAE" strokeWidth="3" strokeDasharray="3 10" strokeLinecap="round" />
            <rect x="306" y="380" width="30" height="16" rx="3" fill="#3a3d42" stroke={INK} strokeWidth="3" />
            <rect x="312" y="385" width="12" height="6" fill="#d6d9dc" />
            <rect x="198" y="197" width="26" height="18" rx="3" fill="#3a3d42" stroke={INK} strokeWidth="3" />
          </g>
        ))}
      </svg>
    </div>
  );
}

const ASKS: { ask: string; done: string }[] = [
  { ask: "Order me empanadas.", done: "Ordered. Pickup at 12:30." },
  { ask: "Book me the plumber.", done: "Booked. Saturday, 7pm." },
  { ask: "Browse the boutique, buy me that dress, and ship it to my house.", done: "Bought. Shipping today." },
];

function Ask({ ask, done, seed, tilt }: { ask: string; done: string; seed: number; tilt: number }) {
  return (
    <PaperCard seed={seed} tilt={tilt} fill={PAPER} shadow="rgba(45,30,12,.34)">
      <div className="flex h-full flex-col gap-3 px-5 py-6 sm:px-6 sm:py-7">
        <p className="text-[19px] leading-[1.2] font-bold sm:text-[22px]" style={{ fontFamily: BODY, color: INK }}>“{ask}”</p>
        <p className="mt-auto inline-flex items-center gap-2 self-start rounded-full border-[2.5px] border-[#14161A] px-3.5 py-1.5 text-[14px] font-extrabold sm:text-[15px]" style={{ background: MINT, color: "#0D2B20", fontFamily: SANS, boxShadow: `2px 3px 0 ${INK}` }}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke={INK} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
          {done}
        </p>
      </div>
    </PaperCard>
  );
}

/**
 * The two posters, as paper cutouts from an art project: every piece is a hand-cut shape (wobbly edges, an arch for the door) with its own soft
 * shadow, a paper-fibre texture and grain, stuck down a hair crooked. THEIR website is a billboard on posts (look, don't touch); YOUR Shorty is a mint door.
 */
const rnd = (seed: number) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
/** A tall arch (a door) with a slightly uneven cut. */
function archPath(w: number, h: number, seed: number, j = 2.6) {
  const r = rnd(seed), pts: string[] = [], f = (n: number) => n.toFixed(1), jit = () => (r() - 0.5) * j * 2;
  for (let y = h; y >= w / 2; y -= 16) pts.push(`${f(jit())} ${f(y)}`);
  for (let k = 0; k <= 28; k++) { const a = Math.PI + (k / 28) * Math.PI; pts.push(`${f(w / 2 + Math.cos(a) * (w / 2) + jit())} ${f(w / 2 + Math.sin(a) * (w / 2) + jit())}`); }
  for (let y = w / 2; y <= h; y += 16) pts.push(`${f(w + jit())} ${f(y)}`);
  pts.push(`${f(w * 0.6)} ${f(h + jit())}`, `${f(w * 0.3)} ${f(h + jit())}`);
  return `M${pts.join("L")}Z`;
}
/** One cut piece: shadow, paper, wash, fibres, grain. `x y` place it, `rot` sets it a little crooked. */
function Piece({ d, x = 0, y = 0, rot = 0, ox = 0, oy = 0, fill, sh = 8, tex = 0.5, id }: { d: string; x?: number; y?: number; rot?: number; ox?: number; oy?: number; fill: string; sh?: number; tex?: number; id: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot} ${ox} ${oy})`}>
      <path d={d} transform={`translate(${sh} ${sh * 1.15})`} fill="rgba(45,30,12,.36)" />
      <path d={d} transform={`translate(${sh * 0.4} ${sh * 0.5})`} fill="rgba(45,30,12,.16)" />
      <path d={d} fill={fill} stroke="rgba(110,85,45,.32)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      <path d={d} fill={`url(#${id}-w)`} />
      <path d={d} fill={`url(#${id}-t)`} opacity={tex} />
      <path d={d} fill={`url(#${id}-g)`} opacity=".3" style={{ mixBlendMode: "multiply" }} />
    </g>
  );
}
const WOOD = "#B58A5B";
function Poster({ kind, tilt }: { kind: "billboard" | "door"; tilt: number }) {
  const id = `po-${kind}`;
  const door = kind === "door";
  return (
    <div className="relative mx-auto w-full max-w-[440px]" style={{ aspectRatio: "420 / 560", rotate: `${tilt}deg`, containerType: "inline-size" }}>
      <svg viewBox="-14 -10 448 590" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true" focusable="false" preserveAspectRatio="none">
        <defs>
          <pattern id={`${id}-g`} patternUnits="userSpaceOnUse" width="80" height="80"><image href={GRAIN_URL} width="80" height="80" /></pattern>
          <pattern id={`${id}-t`} patternUnits="userSpaceOnUse" width="420" height="420"><image href="/paper-texture.webp" width="420" height="420" /></pattern>
          <linearGradient id={`${id}-w`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".42" /><stop offset=".55" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#3a2410" stopOpacity=".16" /></linearGradient>
        </defs>
        {door ? (
          <>
            <Piece id={id} d={archPath(420, 560, 11)} fill="#FBF6E6" sh={12} tex={0.35} />
            <Piece id={id} d={archPath(372, 536, 12)} x={24} y={24} rot={-0.4} ox={186} oy={268} fill="#6FDDB2" sh={6} />
            <Piece id={id} d={archPath(300, 306, 13, 2)} x={60} y={70} rot={0.5} ox={150} oy={150} fill="#9BEACB" sh={5} tex={0.4} />
            <Piece id={id} d={cutPath(300, 128, 14, 12, 10, 2)} x={60} y={398} rot={-0.6} ox={150} oy={64} fill="#9BEACB" sh={5} tex={0.4} />
            <circle cx="362" cy="404" r="17" fill="rgba(45,30,12,.36)" transform="translate(4 5)" />
            <circle cx="362" cy="404" r="17" fill="#F2B84B" stroke="rgba(110,85,45,.4)" strokeWidth="1.5" />
            <circle cx="356" cy="398" r="5" fill="rgba(255,255,255,.55)" />
            <g transform="translate(232 424) rotate(7)">
              <path d="M62 0 L58 -24" stroke="#6b5a3a" strokeWidth="3" />
              <Piece id={id} d={cutPath(124, 58, 15, 6, 10, 1.6)} fill="#FBF6E6" sh={5} tex={0.35} />
              <text x="62" y="39" textAnchor="middle" fontSize="27" fontWeight="800" letterSpacing="3" style={{ fontFamily: SANS, fill: INK }}>OPEN</text>
            </g>
          </>
        ) : (
          <>
            <Piece id={id} d={cutPath(420, 24, 21, 4, 12, 2)} y={538} fill="#CFC7B0" sh={3} />
            {[78, 312].map((x, i) => <Piece key={x} id={id} d={cutPath(32, 190, 22 + i, 3, 14, 2)} x={x} y={356} rot={i ? 0.6 : -0.5} ox={16} oy={95} fill={WOOD} sh={6} tex={0.55} />)}
            <Piece id={id} d={cutPath(352, 18, 24, 4, 12, 1.6)} x={34} y={350} fill="#7a7466" sh={4} />
            {[100, 210, 320].map((x, i) => (
              <g key={x}>
                <path d={`M${x - 10} 62 L${x - 46} 134 H${x + 46} L${x + 10} 62 Z`} fill="rgba(255,236,170,.3)" />
                <Piece id={id} d={cutPath(8, 28, 30 + i, 2, 10, 1)} x={x - 4} y={54} fill="#5d5750" sh={2} />
                <Piece id={id} d={cutPath(34, 16, 33 + i, 3, 10, 1.2)} x={x - 17} y={40} fill="#6c665d" sh={3} />
              </g>
            ))}
            <Piece id={id} d={cutPath(392, 270, 25, 6, 12, 2.6)} x={14} y={80} rot={-0.4} ox={196} oy={135} fill="#E9E1CB" sh={12} tex={0.5} />
            <Piece id={id} d={cutPath(354, 232, 26, 6, 12, 2.4)} x={33} y={98} rot={0.5} ox={177} oy={116} fill="#F2ECDA" sh={4} tex={0.45} />
          </>
        )}
      </svg>
      {door ? (
        <div className="absolute left-[19%] right-[19%] top-[33%] text-[#0D2B20]">
          <p className="font-extrabold" style={{ fontFamily: SANS, fontSize: "clamp(10px, 3.1cqw, 14px)", letterSpacing: "0.14em" }}>YOUR SHORTY</p>
          <p className="mt-1 font-extrabold leading-[1]" style={{ fontFamily: SANS, fontSize: "clamp(30px, 10.5cqw, 56px)" }}>A door.</p>
          <p className="mt-2 leading-[1.25]" style={{ fontFamily: BODY, fontSize: "clamp(13px, 4.1cqw, 19px)" }}>Agents walk right in and get it done. The Shortlist built the foundation that makes it possible.</p>
        </div>
      ) : (
        <div className="absolute left-[12%] right-[12%] top-[21%] text-[#4a463a]">
          <p className="font-extrabold text-[#6b6558]" style={{ fontFamily: SANS, fontSize: "clamp(10px, 3.1cqw, 14px)", letterSpacing: "0.14em" }}>THEIR WEBSITE</p>
          <p className="mt-1 font-extrabold leading-[1] text-[#5d5848]" style={{ fontFamily: SANS, fontSize: "clamp(28px, 10cqw, 52px)" }}>A billboard.</p>
          <p className="mt-2 leading-[1.25]" style={{ fontFamily: BODY, fontSize: "clamp(12px, 3.9cqw, 18px)" }}>Agents can read it. Nobody can order, book or buy. It just sits there.</p>
          <p className="mt-3 italic font-semibold leading-[1.22]" style={{ fontFamily: SERIF, color: BRICK, fontSize: "clamp(12px, 4cqw, 19px)" }}>When’s the last time <u>you</u> took action from a billboard? Yeah. Never.</p>
        </div>
      )}
    </div>
  );
}

const LOGO_CSS = `
@keyframes plugRise{0%{opacity:0;transform:translate(calc(-50% + var(--dx) * .12),0) scale(.55)}8%{opacity:1;transform:translate(calc(-50% + var(--dx) * .2),-4cqw) scale(.8)}17%{opacity:1;transform:translate(calc(-50% + var(--dx)),-27cqw) scale(1)}23%,100%{opacity:0;transform:translate(calc(-50% + var(--dx)),-31cqw) scale(1)}}
.plug-bubble{opacity:0;animation:plugRise 17s ease-out infinite;animation-play-state:paused}
.plug-scene[data-live] .plug-bubble{animation-play-state:running}
@media (prefers-reduced-motion: reduce){.plug-bubble{animation:none;opacity:0}}
.logo-card{transition:transform .15s ease}
.logo-card .pc-sheet{transition:fill .18s ease}
.logo-card:hover,.logo-card:focus-visible{transform:translateY(-4px)}
.logo-card:hover .pc-sheet,.logo-card:focus-visible .pc-sheet,.logo-card:active .pc-sheet{fill:#5FDDAE}
.logo-card:active{transform:translateY(1px)}
@media (prefers-reduced-motion: reduce){.logo-card,.logo-card .pc-sheet{transition:none}}
`;

export function ChatPluginSection() {
  const { audience } = useAudience();
  if (audience === "hoa") return null;
  return (
    <>
      <section aria-labelledby="chat-h" className="relative px-5 pb-20 pt-24 min-[900px]:px-10 min-[900px]:pb-28 min-[900px]:pt-32" style={{ background: CREAM }}>
        {/* the cream paper runs 56px past the section and its own bottom is torn over the charcoal below */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -bottom-[56px] z-0" style={{ filter: "drop-shadow(0 3px 2.5px rgba(40,25,10,.3))" }}>
          <div className="absolute inset-0" style={{ clipPath: TEAR.core, background: "#FFFDF6" }} />
          <div className="absolute inset-0 overflow-hidden" style={{ clipPath: TEAR.paper, background: CREAM }}>
            <div className="absolute inset-0 opacity-[.25] mix-blend-multiply" style={{ backgroundImage: `url("${GRAIN_URL}")` }} />
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: LOGO_CSS }} />
        <TornEdge fill="#63D4A9" angle={-18} rough={1.1} seed={31} />

        <div className="relative z-[1] mx-auto max-w-[1100px]">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border-[3px] border-[#14161A] px-4 py-1.5 text-[13px] font-extrabold tracking-[0.14em] text-white" style={{ background: BRICK, fontFamily: SANS, boxShadow: `3px 4px 0 ${INK}` }}>
              <span className="h-2 w-2 rounded-full bg-white" />LIVE NOW
            </span>
            <h2 id="chat-h" className="mx-auto mt-5 max-w-[980px] font-extrabold leading-[1.02] tracking-[-0.03em] [text-wrap:balance]" style={{ fontFamily: SANS, color: INK, fontSize: "clamp(32px, 5.4vw, 72px)" }}>
              Your customers are living inside <span style={{ color: BRICK }}>ChatGPT.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[820px] font-semibold italic leading-[1.2] [text-wrap:balance]" style={{ fontFamily: SERIF, color: BRICK, fontSize: "clamp(20px, 2.3vw, 30px)" }}>
              Dinner. Directions. Doctors. Dresses. They ask it everything they want to know.
            </p>
            <p className="mx-auto mt-5 max-w-[780px] leading-[1.28] [text-wrap:balance]" style={{ fontFamily: SERIF, color: "#2f2a22", fontSize: "clamp(19px, 2.2vw, 28px)" }}>
              Shorty is plugged into both ChatGPT and Claude to meet them where they are. He makes sure they can do more than just ask about your business. <strong className="font-semibold">He gets things done.</strong>
            </p>
          </div>

          <PlugScene />

          {/* what they can now just ask for */}
          <div className="mt-14 text-center sm:mt-20">
            <h3 className="mx-auto max-w-[820px] font-extrabold leading-[1.05] tracking-[-0.02em] [text-wrap:balance]" style={{ fontFamily: SANS, color: INK, fontSize: "clamp(26px, 3.6vw, 48px)" }}>
              Shorty doesn’t answer questions. He takes action.
            </h3>
          </div>
          <div className="mt-8 grid gap-7 sm:mt-10 sm:grid-cols-3 sm:gap-8">
            {ASKS.map((a, i) => <Ask key={a.ask} {...a} seed={81 + i} tilt={[-1, 0.8, -0.6][i]} />)}
          </div>

          {/* billboard vs door */}
          <div className="mt-16 grid gap-10 sm:mt-24 sm:grid-cols-2 sm:gap-14">
            <Poster kind="billboard" tilt={-1} />
            <Poster kind="door" tilt={1} />
          </div>

          {/* the links */}
          <div className="mt-14 text-center sm:mt-20">
            <p className="mx-auto max-w-[760px] font-bold leading-[1.15] [text-wrap:balance]" style={{ fontFamily: SANS, color: INK, fontSize: "clamp(22px, 2.8vw, 36px)" }}>
              While they’re a billboard, you’re open for business.
            </p>
          </div>
        </div>
      </section>
      {/* dark room under the torn cream, so it hangs over charcoal like the other seams */}
      <div aria-hidden="true" className="h-14 bg-[#14161A] sm:h-16" />
    </>
  );
}
