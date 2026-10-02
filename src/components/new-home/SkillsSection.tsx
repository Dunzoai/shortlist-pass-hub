"use client";

/**
 * "Shorty's got skills.": a charcoal chapter below the "AI agents are here" section on /new. A confident
 * Shorty (sunglasses, iced coffee, white sneakers, one arm pointing at the cards) stands beside a wall of
 * pinned paper cards listing what he does. The card set follows the same Businesses / HOAs toggle as the hero.
 *
 * Shorty is a purpose-drawn inline SVG in the rig's own style and coordinates (the shared rig is drawn by
 * JavaScript, so it can't take CSS keyframes). The three parts that move are their own groups with their own
 * transform-origin: the sunglasses, the pointing arm, and the cup + arm. Motion is CSS transform/opacity only,
 * triggered once by a single IntersectionObserver; the idle loop only runs while the section is on screen.
 */
import { useEffect, useRef } from "react";
import { useAudience, type Audience } from "./audience";
import { SkillIcon } from "./skillIcons";

const INK = "#14161A", CREAM = "#FBF6E6", MINT = "#5FDDAE", AMBER = "#E2A43C";
const SANS = "var(--font-sora), system-ui, sans-serif";
const SERIF = "var(--font-fraunces), Georgia, serif";
const BODY = "var(--font-sans-inter), system-ui, sans-serif";

/* Paper grain: the same noise the other sections use. */
const GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

type Card = { icon: string; title: string; line: string };

const BUSINESS: Card[] = [
  { icon: "app", title: "Your own app", line: "Customers download an app with your name on it." },
  { icon: "answers", title: "Answers 24/7", line: "Knows what you sell and answers at 11pm." },
  { icon: "book", title: "Learns your business", line: "Upload a menu or just chat with him. He learns it." },
  { icon: "events", title: "Events", line: "Tell him where you'll be. He posts it." },
  { icon: "menu", title: "Menus and offerings", line: "Add or change an item with a text." },
  { icon: "bag", title: "Checkout", line: "Takes the order and the payment. The money goes to your Stripe or Square, never through us." },
  { icon: "bookings", title: "Bookings", line: "Customers pick a time and it lands on your calendar." },
  { icon: "chart", title: "Reports", line: "Ask how the week went and he tells you." },
  { icon: "mail", title: "Emails and newsletters", line: "Tell him what's new and he writes it." },
  { icon: "bell", title: "Push notifications", line: "Reach everyone who has your app." },
  { icon: "loyalty", title: "Loyalty rewards", line: "Reward the people who keep coming back." },
  { icon: "post", title: "Social posting", line: "Say 'post this' and it's posted." },
  { icon: "sms", title: "Text messages", line: "Deals and updates to customers who said yes." },
];

const HOA: Card[] = [
  { icon: "voice", title: "Your community's voice", line: "The board runs the conversation. No more arguing in a Facebook group." },
  { icon: "appHome", title: "Your community's app", line: "One place for every neighbor." },
  { icon: "ask", title: "Answers rule questions 24/7", line: "From your own documents, not a guess." },
  { icon: "book", title: "Learns your rules", line: "Upload your documents and he pulls the rules out." },
  { icon: "events", title: "Events and RSVPs", line: "Bingo night, pool party, board meeting." },
  { icon: "bellTarget", title: "Targeted push notifications", line: "One person, one street, the whole neighborhood, or just the bingo RSVPs." },
  { icon: "tag", title: "Yard sale sign-ups", line: "Neighbors favorite the sales they don't want to miss." },
  { icon: "trophy", title: "Holiday contests", line: "Residents enter, the neighborhood votes." },
  { icon: "report", title: "Resident reports", line: "Broken gate or dead streetlight, all in one place for the board." },
  { icon: "mail", title: "Newsletters", line: "Tell him what happened and he writes it." },
];

const SETS: Record<Audience, Card[]> = { business: BUSINESS, hoa: HOA };
/* Loose, uneven tilts, between -3 and +3 degrees. */
const TILTS = [-2.4, 1.6, -0.8, 2.6, -1.8, 0.9, -2.9, 2.1, -1.1, 1.3, -2.2, 2.8, -0.6];
const PINS = [AMBER, MINT, CREAM];

/** The CSS for the section: card paper, the pin-in, Shorty's entrance and idle loop, hover, and reduced motion. */
const CSS = `
.sk-card{position:relative;opacity:0;transform:translateY(14px) scale(.96);rotate:var(--r,0deg);transition:rotate .15s ease,translate .15s ease}
[data-in] .sk-card{animation:sk-pin .45s cubic-bezier(.3,1.55,.5,1) both;animation-delay:calc(var(--i) * 60ms)}
@keyframes sk-pin{from{opacity:0;transform:translateY(14px) scale(.96)}to{opacity:1;transform:none}}
@media (hover:hover){.sk-card:hover{rotate:0deg;translate:0 -4px}}
.sk-paper{position:absolute;inset:0;border-radius:14px;background:${CREAM};border:3px solid ${INK};filter:url(#sk-tear);pointer-events:none}
.sk-paper::after{content:"";position:absolute;inset:0;border-radius:inherit;background-image:url("${GRAIN_URL}");opacity:.16;mix-blend-mode:multiply}
.sk-pin{position:absolute;top:-7px;left:50%;width:14px;height:14px;margin-left:-7px;border-radius:50%;border:2px solid ${INK};box-shadow:1px 2px 0 rgba(0,0,0,.4);pointer-events:none}
.sk-glasses,.sk-arm,.sk-cuparm,.sk-cup{transform-box:view-box}
.sk-glasses{transform-origin:102px 69.5px;opacity:0;transform:translateY(-26px)}
[data-in] .sk-glasses{animation:sk-drop .5s ease-out .2s both}
@keyframes sk-drop{0%{opacity:0;transform:translateY(-26px)}55%{opacity:1;transform:translateY(2.5px)}78%{opacity:1;transform:translateY(-1.5px)}100%{opacity:1;transform:none}}
.sk-arm{transform-origin:151px 124px;transform:rotate(85deg)}
[data-in] .sk-arm{animation:sk-point .8s cubic-bezier(.2,.8,.3,1) .2s both}
@keyframes sk-point{from{transform:rotate(85deg)}to{transform:none}}
.sk-cuparm{transform-origin:55px 124px}
.sk-cup{transform-origin:26px 162px}
.sk-bob{animation:sk-bob 3.2s ease-in-out 1.1s infinite;animation-play-state:paused}
@keyframes sk-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
.sk-cuparm{animation:sk-sip 7s ease-in-out 3.4s infinite;animation-play-state:paused}
.sk-cup{animation:sk-sipc 7s ease-in-out 3.4s infinite;animation-play-state:paused}
@keyframes sk-sip{0%{transform:rotate(0)}7%{transform:rotate(160deg)}11.5%{transform:rotate(160deg)}18%{transform:rotate(0)}100%{transform:rotate(0)}}
@keyframes sk-sipc{0%{transform:rotate(0)}7%{transform:rotate(-160deg)}11.5%{transform:rotate(-160deg)}18%{transform:rotate(0)}100%{transform:rotate(0)}}
[data-live] .sk-bob,[data-live] .sk-cuparm,[data-live] .sk-cup{animation-play-state:running}
@media (prefers-reduced-motion: reduce){
  .sk-card{opacity:1 !important;transform:none !important;animation:none !important;transition:none !important}
  .sk-glasses{opacity:1 !important;transform:none !important;animation:none !important}
  .sk-arm{transform:none !important;animation:none !important}
  .sk-bob,.sk-cuparm,.sk-cup{animation:none !important}
}
`;

/** The rig's ticket body outline (same as the hero Shorty), `i` insets it for the stitching. */
function ticketPath(i = 0) {
  const x0 = 14, x1 = 112, y0 = 3, y1 = 172, r = 11, ny = 77, nr = 5.5;
  const a = x0 + i, b = x1 - i, t = y0 + i, u = y1 - i, rr = Math.max(2, r - i), n = nr + i;
  return `M${a + rr} ${t} H${b - rr} Q${b} ${t} ${b} ${t + rr} V${ny - n} A${n} ${n} 0 0 0 ${b} ${ny + n} V${u - rr} Q${b} ${u} ${b - rr} ${u} H${a + rr} Q${a} ${u} ${a} ${u - rr} V${ny + n} A${n} ${n} 0 0 0 ${a} ${ny - n} V${t + rr} Q${a} ${t} ${a + rr} ${t} Z`;
}

/* Shorty's own palette, from the rig. */
const G = { green: "#8cc3a1", side: "#5f9677", stitch: "#3e6c56", ink: "#1d1a16", white: "#fbf6e6" };
const ink = (w: number) => ({ stroke: G.ink, strokeWidth: w, strokeLinejoin: "round" as const, strokeLinecap: "round" as const });
const OFFSET = "translate(40 24)";   // rig space (x 0..126, y 0..240) → this SVG's 260 x 276 view box

function Sneaker({ side, x, y }: { side: number; x: number; y: number }) {
  const s = side;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M${-12 * s - 2} 0 Q${-12 * s} -11 ${3 * s} -11 Q${16 * s} -11 ${17 * s} -2 Q${17 * s} 3 ${10 * s} 3 L${-8 * s} 3 Q${-12 * s - 2} 3 ${-12 * s - 2} 0 Z`} fill={G.white} {...ink(2.2)} />
      <path d={`M${-11 * s} 0.2 H${15 * s}`} fill="none" {...ink(2.2)} />
      <path d={`M${2 * s} -10 L${5 * s} -6 M${7 * s} -10 L${10 * s} -6`} fill="none" {...ink(1.4)} />
      <path d={`M${12 * s} -4 Q${15 * s} -3 ${15.500 * s} -0.500`} fill="none" stroke={G.ink} strokeWidth={1.4} strokeLinecap="round" />
    </g>
  );
}

/** A glove pointing along +x with its wrist at 0,0 (the rig's glove, with the index finger out). */
function PointingGlove() {
  const w = { fill: G.white, ...ink(2.3) };
  return (
    <>
      <circle cx="13" cy="7.400" r="3.300" {...w} />
      <circle cx="9" cy="9.600" r="3.100" {...w} />
      <ellipse cx="8" cy="0" rx="8.500" ry="8" {...w} />
      <ellipse cx="5.500" cy="-8.200" rx="3.600" ry="4" transform="rotate(-25 5.500 -8.200)" {...w} />
      <rect x="12" y="-3.400" width="19" height="6.800" rx="3.400" {...w} />
      <path d="M-7.500 -8.400 Q-3.400 -9.400 0.400 -7.400 V7.400 Q-3.400 9.400 -7.500 8.400 Q-9 0 -7.500 -8.400 Z" {...w} />
      <path d="M-3.600 -8.200 Q-5 0 -3.600 8.200" fill="none" {...ink(1.3)} />
    </>
  );
}

function Shorty() {
  const w = { fill: G.white, ...ink(2.3) };
  return (
    <svg viewBox="0 0 260 276" aria-hidden="true" focusable="false" className="relative block h-auto w-full overflow-visible">
      {/* the short ground line, and his shadow */}
      <ellipse cx="104" cy="253" rx="46" ry="5" fill="#000" opacity="0.3" />
      <path d="M14 257H214" stroke={CREAM} strokeWidth="3" strokeLinecap="round" opacity="0.8" />

      <g className="sk-bob">
        {/* legs, white sneakers, the ticket body, his face */}
        <g transform={OFFSET}>
          <path d="M52 170 Q42 199 44 224" fill="none" stroke={G.ink} strokeWidth="7" strokeLinecap="round" />
          <path d="M75 170 Q85.500 199 84 224" fill="none" stroke={G.ink} strokeWidth="7" strokeLinecap="round" />
          <Sneaker side={-1} x={44} y={228} />
          <Sneaker side={1} x={84} y={228} />

          <path d={ticketPath(0)} fill={G.side} {...ink(3.4)} transform="translate(-2.6 1.6)" />
          <path d={ticketPath(0)} fill={G.green} {...ink(3.4)} />
          <path d={ticketPath(4.2)} fill="none" stroke={G.stitch} strokeWidth="1.1" strokeDasharray="3 2.6" opacity="0.85" />
          <path d="M82 104 V150 H42 V90 A20 20 0 0 1 81 85" fill="none" stroke={G.white} strokeWidth="5.200" strokeLinejoin="miter" />
          <path d="M50 113 L59.500 123.500 L84 93" fill="none" stroke={G.white} strokeWidth="5.400" strokeLinejoin="miter" strokeLinecap="square" />

          {/* eyes (under the sunglasses until they drop), brows, a confident smirk */}
          <path d="M0 0 L2.900 -2.200 A3.100 6 0 1 1 1 -5.700 Z" transform="translate(51.500 45.500)" fill={G.ink} />
          <path d="M0 0 L2.900 -2.200 A3.100 6 0 1 1 1 -5.700 Z" transform="translate(72.500 45.500)" fill={G.ink} />
          <path d="M-4.200 1.800 Q0 -2.400 4.200 1.800" transform="translate(49 30.500) rotate(-6)" fill="none" {...ink(2.4)} />
          <path d="M-4.200 1.800 Q0 -2.400 4.200 1.800" transform="translate(74.500 30.500) rotate(6)" fill="none" {...ink(2.4)} />
          <path d="M53 59 Q62 65.500 72 58" fill="none" {...ink(2.4)} />
        </g>

        {/* sunglasses: flat black lenses, no highlight. Origin: the bridge of his nose. */}
        <g className="sk-glasses">
          <g transform={OFFSET}>
            <path d="M41.500 38 H61.500 V47 Q61.500 54.500 52 54.500 Q41.500 54.500 41.500 47 Z" fill={G.ink} />
            <path d="M62.500 38 H82.500 V47 Q82.500 54.500 73 54.500 Q62.500 54.500 62.500 47 Z" fill={G.ink} />
            <path d="M60.500 40.500 Q62 38 63.500 40.500" fill="none" {...ink(2.2)} />
            <path d="M41.500 40.500 L30 38.500 M82.500 40.500 L94 38.500" fill="none" {...ink(2.4)} />
          </g>
        </g>

        {/* the cup arm: the arm and the iced coffee, as one group (origin: his left shoulder) */}
        <g className="sk-cuparm">
          <g transform={OFFSET}>
            <path d="M15 100 Q-13 108 -14 134" fill="none" stroke={G.ink} strokeWidth="6" strokeLinecap="round" />
          </g>
          <g className="sk-cup">{/* the cup stays upright as the arm lifts it (origin: the hand) */}
            <g transform={OFFSET}>
              <path d="M-13 131 L-10 107 L-1 101" fill="none" stroke={G.ink} strokeWidth="5.400" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M-13 131 L-10 107 L-1 101" fill="none" stroke={MINT} strokeWidth="2.600" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M-27 118 L-24 156 H-4 L-1 118 Z" fill={CREAM} fillOpacity="0.28" {...ink(2.4)} />
              <path d="M-25.500 131 L-23.500 154 H-4.500 L-2.500 131 Z" fill={AMBER} />
              <path d="M-25.500 131 Q-14 135.500 -2.500 131" fill="none" stroke={CREAM} strokeWidth="2.600" strokeLinecap="round" opacity="0.9" />
              <rect x="-21" y="137" width="6" height="6" rx="1.600" transform="rotate(-12 -18 140)" fill={CREAM} fillOpacity="0.9" {...ink(1.3)} />
              <rect x="-13" y="144" width="6" height="6" rx="1.600" transform="rotate(14 -10 147)" fill={CREAM} fillOpacity="0.9" {...ink(1.3)} />
              <path d="M-28.500 118 H0.500" fill="none" {...ink(3.200)} />
              {/* the fist around the cup */}
              <circle cx="-14" cy="141" r="9.200" {...w} />
              <path d="M-19 139 Q-14 141.500 -9 139 M-19 144 Q-14 146.500 -9 144" fill="none" {...ink(1.3)} />
            </g>
          </g>
        </g>

        {/* the pointing arm (origin: his right shoulder): swings up from his side to point at the cards */}
        <g className="sk-arm">
          <g transform={OFFSET}>
            <path d="M111 100 Q136 86 160 88" fill="none" stroke={G.ink} strokeWidth="6" strokeLinecap="round" />
            <g transform="translate(160 88) rotate(9)"><PointingGlove /></g>
          </g>
        </g>
      </g>
    </svg>
  );
}

/** One pinned card. Everything but the paper layer is crisp text, so nothing is distorted. */
function SkillCard({ card, i, last, odd }: { card: Card; i: number; last: boolean; odd: boolean }) {
  const place = last ? `min-[900px]:col-start-3 ${odd ? "max-[899px]:col-start-2" : ""}` : "";
  return (
    <li
      className={`sk-card col-span-2 ${place}`}
      style={{ ["--i" as string]: i, ["--r" as string]: `${TILTS[i % TILTS.length]}deg` }}
    >
      <span className="sk-paper" aria-hidden="true" />
      <span className="sk-pin" aria-hidden="true" style={{ background: PINS[i % PINS.length] }} />
      <div className="relative flex h-full flex-col gap-1.5 px-3 pt-4 pb-3.5 min-[900px]:gap-2 min-[900px]:px-[18px] min-[900px]:pt-[22px] min-[900px]:pb-[18px]">
        <div className="h-9 w-9 min-[900px]:h-11 min-[900px]:w-11"><SkillIcon id={card.icon} /></div>
        <strong className="block text-[14.5px] leading-[1.15] font-extrabold tracking-[-0.01em] text-[#14161A] min-[900px]:text-[18px]" style={{ fontFamily: SANS }}>{card.title}</strong>
        <p className="text-[12.5px] leading-[1.38] font-medium text-[#2b2620] min-[900px]:text-[14.5px] min-[900px]:leading-[1.42]" style={{ fontFamily: BODY }}>{card.line}</p>
      </div>
    </li>
  );
}

export function SkillsSection() {
  const { audience } = useAudience();
  const root = useRef<HTMLElement | null>(null);
  const cards = SETS[audience];

  /* One observer: the entrance plays once when the section first scrolls into view; the idle loop runs only while it's on screen. */
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        el.toggleAttribute("data-live", e.isIntersecting);
        if (!el.hasAttribute("data-in") && e.isIntersecting && (e.intersectionRatio >= 0.25 || e.intersectionRect.height >= window.innerHeight * 0.5)) {
          el.setAttribute("data-in", "");
        }
      });
    }, { threshold: [0, 0.25, 0.5] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={root} aria-labelledby="skills-h" className="relative overflow-x-clip bg-[#14161A] px-5 py-14 min-[900px]:px-10 min-[900px]:py-24">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <noscript><style>{`.sk-card{opacity:1 !important;transform:none !important}.sk-glasses{opacity:1 !important;transform:none !important}.sk-arm{transform:none !important}`}</style></noscript>
      {/* the torn edge + the hard offset shadow for the card paper */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <filter id="sk-tear" x="-8%" y="-8%" width="118%" height="124%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={1} seed={7} result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale={4} xChannelSelector="R" yChannelSelector="G" result="torn" />
            <feDropShadow in="torn" dx="4" dy="5" stdDeviation="0" floodColor="#1F9E73" floodOpacity="0.9" />
          </filter>
        </defs>
      </svg>

      <div className="mx-auto max-w-[1180px]">
        <div className="text-center">
          <h2 id="skills-h" className="font-extrabold leading-[1.02] tracking-[-0.03em] text-[#F6F1E4]" style={{ fontFamily: SANS, fontSize: "clamp(34px, 6vw, 84px)" }}>
            Shorty&apos;s got skills.
          </h2>
          <p className="mt-2 leading-[1.2] text-[#5FDDAE] min-[900px]:mt-3" style={{ fontFamily: SERIF, fontSize: "clamp(20px, 2.4vw, 34px)" }}>
            Just ask. He handles it.
          </p>
        </div>

        <div className="mt-9 grid items-center gap-9 min-[900px]:mt-14 min-[900px]:grid-cols-[30%_minmax(0,1fr)] min-[900px]:gap-12">
          {/* Shorty, with a soft mint glow behind him */}
          <div className="relative mx-auto w-[60vw] max-w-[300px] min-[900px]:w-full min-[900px]:max-w-none">
            <div aria-hidden="true" className="pointer-events-none absolute" style={{ left: "-6%", top: "2%", width: "112%", height: "96%", background: "radial-gradient(closest-side at 50% 52%, rgba(95,221,174,.8), rgba(95,221,174,.42) 55%, rgba(95,221,174,0))" }} />
            <Shorty />
          </div>

          <ul className="grid list-none grid-cols-4 gap-x-3.5 gap-y-5 p-0 min-[900px]:grid-cols-6 min-[900px]:gap-x-[22px] min-[900px]:gap-y-7">
            {cards.map((c, i) => (
              <SkillCard key={`${audience}-${c.title}`} card={c} i={i} last={i === cards.length - 1} odd={cards.length % 2 === 1} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
