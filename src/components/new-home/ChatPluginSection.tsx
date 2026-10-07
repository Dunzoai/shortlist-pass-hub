"use client";

/**
 * "Your customers are already asking ChatGPT": between the mint "AI agents are here" section and "Shorty's got skills." Cream paper
 * torn over the mint above and torn again over the charcoal below. Shorty is plugged into ChatGPT and Claude (their marks, drawn on paper
 * cards in our style), three things customers can now just ask for, and the billboard-vs-door point. Business view only.
 * The two install links are constants: the real ChatGPT plugin page and the Claude connector directory page.
 */
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import { AI_LOGOS } from "./aiLogos";
import { PaperCard } from "./PaperCard";
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

/** One AI's card, tappable: its mark in ink on a paper tile, its name, a LIVE chip. Goes to the install page; turns mint on hover and press. */
function LogoCard({ path, name, href, seed, tilt }: { path: string; name: string; href: string; seed: number; tilt: number }) {
  return (
    <a href={href} aria-label={`Add Shorty to ${name}`} className="logo-card block cursor-pointer no-underline outline-none">
      <PaperCard seed={seed} tilt={tilt} fill={PAPER} shadow="rgba(45,30,12,.34)">
        <div className="flex flex-col items-center gap-1.5 px-1.5 py-3 sm:gap-2.5 sm:px-6 sm:py-7">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-10 w-10 sm:h-20 sm:w-20" fill={INK}><path d={path} /></svg>
          <span className="text-[13px] font-extrabold sm:text-[22px]" style={{ fontFamily: SANS, color: INK }}>{name}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#14161A] px-2 py-0.5 text-[10px] font-extrabold tracking-[0.12em] sm:text-[12px]" style={{ background: MINT, color: "#0D2B20", fontFamily: SANS }}>
            <span className="h-1.5 w-1.5 rounded-full bg-[#14161A]" />LIVE
          </span>
        </div>
      </PaperCard>
      <p className="mt-4 text-center text-[9px] leading-tight font-extrabold tracking-[0.1em] text-[#6b6558] sm:text-[13px]" style={{ fontFamily: SANS }}>TAP TO ADD THE PLUGIN</p>
    </a>
  );
}

/** The cable from a card to Shorty: a thick ink line with a plug on each end. */
function Cable({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 120 40" preserveAspectRatio="none" aria-hidden="true" className="h-8 w-full min-w-0 sm:h-10" style={{ transform: flip ? "scaleX(-1)" : undefined }}>
      <path d="M6 20 C 40 4, 80 36, 114 20" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d="M6 20 C 40 4, 80 36, 114 20" fill="none" stroke={MINT} strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <rect x="0" y="12" width="9" height="16" rx="2" fill={INK} />
      <rect x="111" y="12" width="9" height="16" rx="2" fill={INK} />
    </svg>
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

/** The two posters: THEIR website as a billboard (posts, catwalk, lamps; look but don't touch), YOUR Shorty as a door (arched, mint, open). */
const WOOD = "#A9744A";
function Poster({ kind, tilt }: { kind: "billboard" | "door"; tilt: number }) {
  const id = `po-${kind}`;
  const door = kind === "door";
  return (
    <div className="relative mx-auto w-full max-w-[440px]" style={{ aspectRatio: "420 / 560", rotate: `${tilt}deg` }}>
      <svg viewBox="-14 -10 448 590" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true" focusable="false" preserveAspectRatio="none">
        <defs>
          <pattern id={`${id}-g`} patternUnits="userSpaceOnUse" width="80" height="80"><image href={GRAIN_URL} width="80" height="80" /></pattern>
          <linearGradient id={`${id}-w`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".42" /><stop offset=".55" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#0d2b20" stopOpacity=".16" /></linearGradient>
        </defs>
        {door ? (
          <>
            <path d="M0 560 V190 Q0 0 210 0 Q420 0 420 190 V560 Z" transform="translate(12 14)" fill="rgba(45,30,12,.34)" />
            <path d="M0 560 V190 Q0 0 210 0 Q420 0 420 190 V560 Z" fill={PAPER} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
            <path d="M24 560 V196 Q24 24 210 24 Q396 24 396 196 V560 Z" fill={MINT} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <path d="M24 560 V196 Q24 24 210 24 Q396 24 396 196 V560 Z" fill={`url(#${id}-w)`} />
            <path d="M24 560 V196 Q24 24 210 24 Q396 24 396 196 V560 Z" fill={`url(#${id}-g)`} opacity=".28" style={{ mixBlendMode: "multiply" }} />
            <path d="M62 372 V210 Q62 62 210 62 Q358 62 358 210 V372 Z" fill="none" stroke="rgba(13,43,32,.4)" strokeWidth="4" />
            <rect x="62" y="396" width="296" height="130" rx="14" fill="none" stroke="rgba(13,43,32,.4)" strokeWidth="4" />
            <circle cx="360" cy="400" r="17" fill="#F2B84B" stroke={INK} strokeWidth="4" />
            <g transform="translate(228 424) rotate(7)">
              <rect width="124" height="58" rx="6" fill={PAPER} stroke={INK} strokeWidth="4" transform="translate(4 5)" opacity=".35" />
              <rect width="124" height="58" rx="6" fill={PAPER} stroke={INK} strokeWidth="4" />
              <path d="M62 0 L58 -26" stroke={INK} strokeWidth="3" />
            </g>
          </>
        ) : (
          <>
            <rect x="0" y="540" width="420" height="20" fill="#cfc7b0" stroke={INK} strokeWidth="4" />
            {[80, 310].map((x) => <rect key={x} x={x} y="356" width="32" height="188" fill={WOOD} stroke={INK} strokeWidth="4" />)}
            <rect x="34" y="350" width="352" height="16" fill="#6b6558" stroke={INK} strokeWidth="4" />
            {[100, 210, 320].map((x) => (
              <g key={x}>
                <path d={`M${x} 82 V54`} stroke={INK} strokeWidth="5" />
                <path d={`M${x - 15} 54 H${x + 15} L${x + 10} 38 H${x - 10} Z`} fill="#55504a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
                <path d={`M${x - 10} 56 L${x - 46} 130 H${x + 46} L${x + 10} 56 Z`} fill="rgba(255,236,170,.28)" />
              </g>
            ))}
            <rect x="14" y="82" width="392" height="268" rx="6" fill="rgba(45,30,12,.34)" transform="translate(12 14)" />
            <rect x="14" y="82" width="392" height="268" rx="6" fill="#E6DEC8" stroke={INK} strokeWidth="6" />
            <rect x="14" y="82" width="392" height="268" rx="6" fill={`url(#${id}-w)`} />
            <rect x="14" y="82" width="392" height="268" rx="6" fill={`url(#${id}-g)`} opacity=".3" style={{ mixBlendMode: "multiply" }} />
            <rect x="32" y="100" width="356" height="232" rx="3" fill="none" stroke="rgba(60,50,35,.28)" strokeWidth="3" />
          </>
        )}
      </svg>
      {door ? (
        <div className="absolute left-[21%] right-[21%] top-[19%] text-[#0D2B20]">
          <p className="text-[12px] font-extrabold tracking-[0.14em] sm:text-[13px]" style={{ fontFamily: SANS }}>YOUR SHORTY</p>
          <p className="mt-1 text-[40px] leading-[1] font-extrabold sm:text-[56px]" style={{ fontFamily: SANS }}>A door.</p>
          <p className="mt-3 text-[15px] leading-[1.28] sm:text-[18px]" style={{ fontFamily: BODY }}>Agents walk right in and get it done. The Shortlist built the foundation that makes it possible.</p>
        </div>
      ) : (
        <div className="absolute left-[11%] right-[11%] top-[20%] text-[#4a463a]">
          <p className="text-[12px] font-extrabold tracking-[0.14em] text-[#6b6558] sm:text-[13px]" style={{ fontFamily: SANS }}>THEIR WEBSITE</p>
          <p className="mt-1 text-[40px] leading-[1] font-extrabold text-[#5d5848] sm:text-[56px]" style={{ fontFamily: SANS }}>A billboard.</p>
          <p className="mt-3 text-[16px] leading-[1.28] sm:text-[19px]" style={{ fontFamily: BODY }}>Agents can read it. Nobody can order, book or buy. It just sits there.</p>
        </div>
      )}
      {door && <p className="absolute left-[56%] top-[78.2%] w-[28%] -rotate-0 text-center text-[18px] font-extrabold tracking-[0.1em] sm:text-[24px]" style={{ fontFamily: SANS, color: INK, transform: "rotate(7deg)" }}>OPEN</p>}
    </div>
  );
}

const LOGO_CSS = `
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

          {/* Shorty, plugged in to both */}
          <div className="mx-auto mt-12 grid max-w-[900px] grid-cols-[minmax(0,1fr)_minmax(14px,.3fr)_92px_minmax(14px,.3fr)_minmax(0,1fr)] items-center gap-x-0.5 sm:mt-16 sm:grid-cols-[1fr_minmax(34px,.5fr)_auto_minmax(34px,.5fr)_1fr] sm:gap-x-3">
            <LogoCard path={AI_LOGOS.openai} name="ChatGPT" href={CHATGPT_PLUGIN_URL} seed={71} tilt={-1.5} />
            <Cable />
            <div className="relative h-[170px] w-[92px] sm:h-[300px] sm:w-[190px]">
              <ShortyMascot mood="typing" size={170} style={{ position: "absolute", left: "50%", top: "50%", height: "130%", width: "auto", transform: "translate(-50%, -50%)" }} />
            </div>
            <Cable flip />
            <LogoCard path={AI_LOGOS.claude} name="Claude" href={CLAUDE_CONNECTOR_URL} seed={72} tilt={1.5} />
          </div>

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
