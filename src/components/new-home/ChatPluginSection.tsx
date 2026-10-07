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

/** One AI's card: its mark in ink on a paper tile, its name, a LIVE chip. */
function LogoCard({ path, name, seed, tilt }: { path: string; name: string; seed: number; tilt: number }) {
  return (
    <PaperCard seed={seed} tilt={tilt} fill={PAPER} shadow="rgba(45,30,12,.34)">
      <div className="flex flex-col items-center gap-1.5 px-1.5 py-3 sm:gap-2.5 sm:px-6 sm:py-7">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-10 w-10 sm:h-20 sm:w-20" fill={INK}><path d={path} /></svg>
        <span className="text-[13px] font-extrabold sm:text-[22px]" style={{ fontFamily: SANS, color: INK }}>{name}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#14161A] px-2 py-0.5 text-[10px] font-extrabold tracking-[0.12em] sm:text-[12px]" style={{ background: MINT, color: "#0D2B20", fontFamily: SANS }}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#14161A]" />LIVE
        </span>
      </div>
    </PaperCard>
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

const BTN = "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border-[3px] border-[#14161A] px-6 text-[16px] font-bold whitespace-nowrap no-underline transition-transform hover:-translate-y-0.5";

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
        <TornEdge fill="#63D4A9" angle={-18} rough={1.1} seed={31} />

        <div className="relative z-[1] mx-auto max-w-[1100px]">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border-[3px] border-[#14161A] px-4 py-1.5 text-[13px] font-extrabold tracking-[0.14em] text-white" style={{ background: BRICK, fontFamily: SANS, boxShadow: `3px 4px 0 ${INK}` }}>
              <span className="h-2 w-2 rounded-full bg-white" />LIVE NOW
            </span>
            <h2 id="chat-h" className="mx-auto mt-5 max-w-[960px] font-extrabold leading-[1.02] tracking-[-0.03em] [text-wrap:balance]" style={{ fontFamily: SANS, color: INK, fontSize: "clamp(32px, 5.6vw, 76px)" }}>
              Your customers are already asking <span style={{ color: BRICK }}>ChatGPT.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[760px] leading-[1.25] [text-wrap:balance]" style={{ fontFamily: SERIF, color: "#2f2a22", fontSize: "clamp(20px, 2.4vw, 32px)" }}>
              Shorty is plugged into ChatGPT and Claude. So they don’t just <em>ask about</em> your business. They get things done.
            </p>
          </div>

          {/* Shorty, plugged in to both */}
          <div className="mx-auto mt-12 grid max-w-[900px] grid-cols-[minmax(0,1fr)_minmax(14px,.3fr)_92px_minmax(14px,.3fr)_minmax(0,1fr)] items-center gap-x-0.5 sm:mt-16 sm:grid-cols-[1fr_minmax(34px,.5fr)_auto_minmax(34px,.5fr)_1fr] sm:gap-x-3">
            <LogoCard path={AI_LOGOS.openai} name="ChatGPT" seed={71} tilt={-1.5} />
            <Cable />
            <div className="relative h-[170px] w-[92px] sm:h-[300px] sm:w-[190px]">
              <ShortyMascot mood="carry" size={170} style={{ position: "absolute", left: "50%", top: "50%", height: "130%", width: "auto", transform: "translate(-50%, -50%)" }} />
            </div>
            <Cable flip />
            <LogoCard path={AI_LOGOS.claude} name="Claude" seed={72} tilt={1.5} />
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
          <div className="mt-16 grid gap-7 sm:mt-24 sm:grid-cols-2 sm:gap-10">
            <PaperCard seed={91} tilt={-1} fill="#DDD6C4" shadow="rgba(45,30,12,.34)">
              <div className="px-6 py-8 sm:px-9 sm:py-10">
                <p className="text-[13px] font-extrabold tracking-[0.14em] text-[#6b6558]" style={{ fontFamily: SANS }}>THEIR WEBSITE</p>
                <p className="mt-1 text-[34px] leading-[1.05] font-extrabold text-[#5d5848] sm:text-[44px]" style={{ fontFamily: SANS }}>A billboard.</p>
                <p className="mt-3 text-[18px] leading-[1.3] text-[#4a463a] sm:text-[20px]" style={{ fontFamily: BODY }}>Agents can read it. Nobody can order, book or buy. It just sits there.</p>
              </div>
            </PaperCard>
            <PaperCard seed={92} tilt={1} fill={MINT} shadow="rgba(45,30,12,.38)">
              <div className="px-6 py-8 sm:px-9 sm:py-10">
                <p className="text-[13px] font-extrabold tracking-[0.14em] text-[#0D2B20]" style={{ fontFamily: SANS }}>YOUR SHORTY</p>
                <p className="mt-1 text-[34px] leading-[1.05] font-extrabold text-[#0D2B20] sm:text-[44px]" style={{ fontFamily: SANS }}>A door.</p>
                <p className="mt-3 text-[18px] leading-[1.3] text-[#0D2B20] sm:text-[20px]" style={{ fontFamily: BODY }}>Agents walk right in and get it done. The Shortlist built the foundation that makes it possible.</p>
              </div>
            </PaperCard>
          </div>

          {/* the links */}
          <div className="mt-14 text-center sm:mt-20">
            <p className="mx-auto max-w-[760px] font-bold leading-[1.15] [text-wrap:balance]" style={{ fontFamily: SANS, color: INK, fontSize: "clamp(22px, 2.8vw, 36px)" }}>
              While they’re a billboard, you’re open for business.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href={CHATGPT_PLUGIN_URL} className={`${BTN} text-[#12301f]`} style={{ background: "#7fd0a4", boxShadow: `4px 5px 0 ${INK}`, fontFamily: BODY }}>
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill={INK} aria-hidden="true"><path d={AI_LOGOS.openai} /></svg>Add Shorty to ChatGPT
              </a>
              <a href={CLAUDE_CONNECTOR_URL} className={`${BTN}`} style={{ background: PAPER, color: INK, boxShadow: `4px 5px 0 ${INK}`, fontFamily: BODY }}>
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill={INK} aria-hidden="true"><path d={AI_LOGOS.claude} /></svg>Add Shorty to Claude
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* dark room under the torn cream, so it hangs over charcoal like the other seams */}
      <div aria-hidden="true" className="h-14 bg-[#14161A] sm:h-16" />
    </>
  );
}
