"use client";

/**
 * "Shorty's got skills.": a charcoal chapter below the "AI agents are here" section on /new. A confident
 * Shorty (sunglasses, iced coffee, white sneakers) stands beside a wall of
 * pinned paper cards listing what he does. The card set follows the same Businesses / HOAs toggle as the hero.
 *
 * Shorty is a purpose-drawn inline SVG in the rig's own style and coordinates (the shared rig is drawn by
 * JavaScript, so it can't take CSS keyframes). The three parts that move are their own groups with their own
 * transform-origin: the sunglasses, the free arm, the cup + arm, the feet and the body. Motion is CSS transform/opacity only,
 * triggered once by a single IntersectionObserver; the idle loop only runs while the section is on screen.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAudience, type Audience } from "./audience";
import { SkillIcon } from "./skillIcons";

const INK = "#14161A", CREAM = "#FBF6E6", MINT = "#5FDDAE", AMBER = "#E2A43C";
const SANS = "var(--font-sora), system-ui, sans-serif";
const SERIF = "var(--font-fraunces), Georgia, serif";
const BODY = "var(--font-sans-inter), system-ui, sans-serif";

/* Paper grain: the same noise the other sections use. */
const GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

type Card = { icon: string; title: string; line: string; how: string };

const BUSINESS: Card[] = [
  { icon: "app", title: "Your own app", line: "Customers download an app with your name on it.", how: "Your customers can download an app with your name on it. Once it's on their phone, you can send them push notifications: a new offer, a change in hours, a big announcement." },
  { icon: "answers", title: "Answers 24/7", line: "Knows what you sell and answers at 11pm.", how: "Shorty knows what you sell or offer in detail, plus your hours and location. He answers customers at any hour the way you would, and points them to the right thing to buy or book." },
  { icon: "book", title: "Learns your business", line: "Upload a menu or just chat with him. He learns it.", how: "Upload your menu, price list or catalog and he pulls out the items and details for you. Or just chat with him and tell him about your business. You can add to what he knows any time." },
  { icon: "events", title: "Events", line: "Tell him the when and where. He posts it.", how: "Tell him the when and where of a sale, a pop-up, a class, a grand opening, anything. He posts the event and lets your customers know." },
  { icon: "menu", title: "Menus and offerings", line: "Add or change an item with a text.", how: "Add a new item or service, change a price, or take something off with a text. Sold out or booked up? Tell him and he stops offering it." },
  { icon: "bag", title: "Checkout", line: "Takes the order and the payment. The money goes to your Stripe or Square, never through us.", how: "Customers build their cart in the chat and pay through your Stripe or Square. The money lands in your bank, and we never touch it. If you use Clover, open a free Stripe or Square account to take orders through Shorty." },
  { icon: "bookings", title: "Bookings", line: "Customers pick a time and it lands on your calendar.", how: "Customers pick an open time and it lands on your calendar. No phone tag." },
  { icon: "chart", title: "Reports", line: "Ask how the week went and he tells you.", how: "Ask how the week went and he tells you in plain words. You also get a sales report every month." },
  { icon: "mail", title: "Emails and newsletters", line: "Tell him what's new and he writes it.", how: "Tell him what's new and he writes the email or the weekly newsletter. You say yes and he sends it to your customers." },
  { icon: "bell", title: "Push notifications", line: "Reach everyone who has your app.", how: "Send a message straight to the phones of customers who have your app: an offer, a change of plans, news about an event." },
  { icon: "loyalty", title: "Loyalty rewards", line: "Punch cards, discounts, and games with prizes.", how: "Give customers digital punch cards and discounts that bring them back. You can also put a game in their hands, like golf, where they compete for prizes you set up at your place." },
  { icon: "post", title: "Social posting", line: "Say 'post this' and it's posted.", how: "Say 'post this to Instagram' and he writes the post and lines it up. You say yes before it goes out." },
  { icon: "sms", title: "Text messages", line: "Deals and updates to customers who said yes.", how: "Offers, updates and changes of plans. He texts the customers who said yes to hearing from you." },
];

const HOA: Card[] = [
  { icon: "voice", title: "Your community's voice", line: "The board runs the conversation. No more arguing in a Facebook group.", how: "Your board runs the conversation in one official place, not a Facebook group. News, events and reminders come from the board, so everyone hears the same thing." },
  { icon: "appHome", title: "Your community's app", line: "One place for every neighbor.", how: "Residents download your community's app. It lives on their phone, so they see events, notices and answers without digging through a group feed." },
  { icon: "ask", title: "Answers rule questions 24/7", line: "From your own documents, not a guess.", how: "Residents ask Shorty anything about your rules, at any hour. He answers from your own documents, so the answer matches what the board adopted." },
  { icon: "book", title: "Learns your rules", line: "Upload your documents and he pulls the rules out.", how: "Upload your documents and Shorty pulls the rules out. You can also chat with him to teach him more." },
  { icon: "events", title: "Events and RSVPs", line: "Bingo night, pool party, board meeting.", how: "Post an event and residents RSVP in a tap. You see who is coming before you set up the chairs." },
  { icon: "bellTarget", title: "Targeted push notifications", line: "One person, one street, the whole neighborhood, or just the bingo RSVPs.", how: "Send a notice to one person, one street, the whole neighborhood, or only the people who RSVP'd to an event. Maple Court gets the repaving notice and nobody else does." },
  { icon: "tag", title: "Yard sale sign-ups", line: "Neighbors favorite the sales they don't want to miss.", how: "Residents sign up and show what they're selling. Neighbors favorite the sales they want to hit so they don't miss them." },
  { icon: "trophy", title: "Holiday contests", line: "Residents enter, the neighborhood votes.", how: "Residents enter, and neighbors vote on the best one, like a Halloween decorating contest." },
  { icon: "report", title: "Resident reports", line: "Broken gate or dead streetlight, all in one place for the board.", how: "Residents report problems like a broken gate or a streetlight that is out, and the board sees every report in one place." },
  { icon: "mail", title: "Newsletters", line: "Tell him what happened and he writes it.", how: "Tell him what happened this month and he writes the newsletter for every resident. You say yes and he sends it." },
];

const SETS: Record<Audience, Card[]> = { business: BUSINESS, hoa: HOA };
/* Loose, uneven tilts, between -3 and +3 degrees. */
const TILTS = [-2.4, 1.6, -0.8, 2.6, -1.8, 0.9, -2.9, 2.1, -1.1, 1.3, -2.2, 2.8, -0.6];
const PINS = [AMBER, MINT, CREAM];

/* Shorty's routine: every moment is a time in seconds on one loop, turned into keyframe percentages. */
const LOOP = 18;
type Stop = [number, string];
const kf = (name: string, stops: Stop[]) =>
  `@keyframes ${name}{${stops.map(([t, v]) => `${((t / LOOP) * 100).toFixed(2)}%{${v}}`).join("")}}`;
const tf = (v: string) => `transform:${v}`;
const rot = (d: number) => tf(`rotate(${d}deg)`);
const NONE = tf("none");
/* The loop: sip 1.2-3.2, a calm stretch, glasses and a wink 7.2-10, another calm stretch, then he checks his phone
   (out 12.4, texts pop 14.3-15.7, away 17), chill. */
const ARM = 85, ARM_GLASSES = -100, ARM_PHONE = -35;
const PHONE_IN = 12.4, PHONE_UP = 13.2, PHONE_DOWN = 16.2, PHONE_AWAY = 17;

/** The cup arm swings the cup up to his mouth for the sip and otherwise drifts a little. */
const CUP_ARM: [number, number][] = [
  [0, 0], [1.2, 0], [1.8, -132], [2.6, -132], [3.2, 0], [4.4, 4], [5.6, -3], [6.8, 2], [7.6, 0],
  [10, 0], [11.4, 3], [12.6, -2], [14, 2], [15.5, -2], [17, 0], [LOOP, 0],
];
/** The free arm: a small drift at his side, a shrug, up to his glasses, a calm stretch, then up with the phone. */
const FREE_ARM: [number, number][] = [
  [0, ARM], [1.5, ARM + 2], [3, ARM - 2], [4.6, ARM - 7], [5.5, ARM - 7], [6.4, ARM], [7.2, ARM], [7.8, ARM_GLASSES], [9.2, ARM_GLASSES], [10, ARM],
  [11.2, ARM + 2], [PHONE_IN, ARM], [PHONE_UP, ARM_PHONE], [14.7, ARM_PHONE - 3], [15.6, ARM_PHONE + 2], [PHONE_DOWN, ARM_PHONE], [PHONE_AWAY, ARM], [LOOP, ARM],
];
/** A text bubble pops out at `t`, floats up a touch, and fades as he puts the phone away. */
const pop = (t: number): Stop[] => [
  [0, "opacity:0;transform:translateY(0) scale(.2)"], [t, "opacity:0;transform:translateY(0) scale(.2)"],
  [t + 0.22, "opacity:1;transform:translateY(-2px) scale(1.12)"], [t + 0.38, "opacity:1;transform:translateY(-2px) scale(1)"],
  [16.2, "opacity:1;transform:translateY(-6px) scale(1)"], [16.7, "opacity:0;transform:translateY(-10px) scale(.9)"], [LOOP, "opacity:0;transform:translateY(-10px) scale(.9)"],
];
const KEYFRAMES = [
  kf("sk-sip", CUP_ARM.map(([t, a]) => [t, rot(a)] as Stop)),
  kf("sk-sipc", CUP_ARM.map(([t, a]) => [t, rot(-a)] as Stop)),
  kf("sk-armloop", FREE_ARM.map(([t, a]) => [t, rot(a)] as Stop)),
  kf("sk-lower", [[0, NONE], [7.8, NONE], [8.1, tf("translateY(15px)")], [9.2, tf("translateY(15px)")], [9.5, NONE], [LOOP, NONE]]),
  kf("sk-wink", [[0, NONE], [8.3, NONE], [8.4, tf("scaleY(.1)")], [8.75, tf("scaleY(.1)")], [8.9, NONE], [LOOP, NONE]]),
  kf("sk-sway", [[0, rot(0)], [13, rot(0)], [13.8, rot(2.5)], [16, rot(2.5)], [16.8, rot(0)], [LOOP, rot(0)]]),
  kf("sk-phone", [
    [0, "opacity:0;transform:scale(.6)"], [PHONE_IN + 0.2, "opacity:0;transform:scale(.6)"], [PHONE_IN + 0.7, "opacity:1;transform:scale(1)"],
    [16.4, "opacity:1;transform:scale(1)"], [PHONE_AWAY, "opacity:0;transform:scale(.6)"], [LOOP, "opacity:0;transform:scale(.6)"],
  ]),
  kf("sk-b1", pop(14.3)), kf("sk-b2", pop(14.9)), kf("sk-b3", pop(15.5)),
].join("\n");

/** The CSS for the section: card paper, the pin-in, Shorty's entrance and idle loop, hover, and reduced motion. */
const CSS = `
.sk-card{position:relative;opacity:0;transform:translateY(14px) scale(.96);rotate:var(--r,0deg);transition:rotate .15s ease,translate .15s ease}
[data-in] .sk-card{animation:sk-pin .45s cubic-bezier(.3,1.55,.5,1) both;animation-delay:calc(var(--i) * 60ms)}
@keyframes sk-pin{from{opacity:0;transform:translateY(14px) scale(.96)}to{opacity:1;transform:none}}
@media (hover:hover){.sk-card:hover{rotate:0deg;translate:0 -4px}}
.sk-paper{position:absolute;inset:0;border-radius:14px;background:${CREAM};border:3px solid ${INK};filter:url(#sk-tear);pointer-events:none}
.sk-paper::after{content:"";position:absolute;inset:0;border-radius:inherit;background-image:url("${GRAIN_URL}");opacity:.16;mix-blend-mode:multiply}
.sk-pin{position:absolute;top:-7px;left:50%;width:14px;height:14px;margin-left:-7px;border-radius:50%;border:2px solid ${INK};box-shadow:1px 2px 0 rgba(0,0,0,.4);pointer-events:none}
.sk-glasses,.sk-arm,.sk-cuparm,.sk-cup,.sk-sway,.sk-idle,.sk-bob{transform-box:view-box}
.sk-glasses{transform-origin:102px 69.5px;opacity:0;transform:translateY(-26px)}
[data-in] .sk-glasses{animation:sk-drop .5s ease-out .2s both}
@keyframes sk-drop{0%{opacity:0;transform:translateY(-26px)}55%{opacity:1;transform:translateY(2.5px)}78%{opacity:1;transform:translateY(-1.5px)}100%{opacity:1;transform:none}}
.sk-arm{transform-origin:151px 124px;transform:rotate(85deg)}
.sk-cuparm{transform-origin:55px 124px}
.sk-cup{transform-origin:26px 162px}
.sk-sway,.sk-idle,.sk-bob{transform-origin:104px 250px}
.sk-wink,.sk-phone{transform-box:fill-box;transform-origin:center}
.sk-phone,.sk-b1,.sk-b2,.sk-b3{opacity:0}
.sk-b1,.sk-b2,.sk-b3{transform-box:view-box}
.sk-b1{transform-origin:204px 62px}
.sk-b2{transform-origin:213px 35px}
.sk-b3{transform-origin:190px 54px}
/* always breathing: a slow rise and fall, and his weight drifting from foot to foot */
.sk-bob{animation:sk-breathe 3.6s ease-in-out 0.4s infinite}
@keyframes sk-breathe{0%,100%{transform:translateY(0) scale(1,1)}50%{transform:translateY(-1.6px) scale(1.006,1.013)}}
.sk-idle{animation:sk-weight 8.4s ease-in-out infinite}
@keyframes sk-weight{0%,100%{transform:rotate(0deg) translateX(0)}28%{transform:rotate(-.9deg) translateX(-1.6px)}64%{transform:rotate(.8deg) translateX(1.6px)}}
/* one ${LOOP}s routine, after the entrance: sip, small human movements, glasses and a wink, a calm stretch, checking his phone, chill */
.sk-cuparm{animation:sk-sip ${LOOP}s ease-in-out 1.2s infinite}
.sk-cup{animation:sk-sipc ${LOOP}s ease-in-out 1.2s infinite}
.sk-arm{animation:sk-armloop ${LOOP}s ease-in-out 1.2s infinite}
.sk-lower{animation:sk-lower ${LOOP}s ease-in-out 1.2s infinite}
.sk-wink{animation:sk-wink ${LOOP}s ease-in-out 1.2s infinite}
.sk-sway{animation:sk-sway ${LOOP}s ease-in-out 1.2s infinite}
.sk-phone{animation:sk-phone ${LOOP}s ease-in-out 1.2s infinite}
.sk-b1{animation:sk-b1 ${LOOP}s ease-out 1.2s infinite}
.sk-b2{animation:sk-b2 ${LOOP}s ease-out 1.2s infinite}
.sk-b3{animation:sk-b3 ${LOOP}s ease-out 1.2s infinite}
${KEYFRAMES}
.sk-bob,.sk-idle,.sk-cuparm,.sk-cup,.sk-arm,.sk-lower,.sk-wink,.sk-sway,.sk-phone,.sk-b1,.sk-b2,.sk-b3{animation-play-state:paused}
[data-live] .sk-bob,[data-live] .sk-idle,[data-live] .sk-cuparm,[data-live] .sk-cup,[data-live] .sk-arm,[data-live] .sk-lower,[data-live] .sk-wink,[data-live] .sk-sway,[data-live] .sk-phone,[data-live] .sk-b1,[data-live] .sk-b2,[data-live] .sk-b3{animation-play-state:running}
.sk-hit{display:block;width:100%;height:100%;padding:0;margin:0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer;border-radius:14px;-webkit-tap-highlight-color:transparent}
.sk-hit:focus-visible{outline:3px solid ${MINT};outline-offset:4px}
.sk-plus{position:absolute;right:7px;bottom:6px;width:20px;height:20px;border-radius:50%;background:${CREAM};border:2.5px solid ${INK};box-shadow:1px 2px 0 rgba(0,0,0,.4);pointer-events:none}
.sk-ov{position:fixed;inset:0;z-index:70;display:flex;align-items:center;justify-content:center;padding:24px}
.sk-bd{position:absolute;inset:0;background:rgba(10,12,15,.74);touch-action:none}
.sk-dlg{position:relative;width:100%;max-width:560px;transform-origin:50% 50%}
.sk-dlg .sk-paper{border-radius:18px}
.sk-dlg-body{position:relative;max-height:calc(100vh - 48px);max-height:calc(100dvh - 48px);overflow-y:auto;overscroll-behavior:contain;padding:34px 34px 32px}
.sk-x{position:absolute;top:10px;right:10px;z-index:2;width:46px;height:46px;border-radius:50%;background:${CREAM};border:3px solid ${INK};box-shadow:2px 3px 0 rgba(0,0,0,.45);cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center}
.sk-x:focus-visible{outline:3px solid ${MINT};outline-offset:3px}
@media (max-width:899px){
  .sk-ov{align-items:flex-end;padding:0}
  .sk-dlg{max-width:none}
  .sk-dlg .sk-paper{border-radius:22px 22px 0 0;bottom:-10px}
  .sk-dlg-body{max-height:86vh;max-height:86dvh;padding:30px 22px 34px}
}
@media (prefers-reduced-motion: reduce){
  .sk-card{opacity:1 !important;transform:none !important;animation:none !important;transition:none !important}
  .sk-glasses{opacity:1 !important;transform:none !important;animation:none !important}
  .sk-arm{transform:rotate(85deg) !important;animation:none !important}
  .sk-bob,.sk-idle,.sk-cuparm,.sk-cup,.sk-lower,.sk-wink,.sk-sway,.sk-phone,.sk-b1,.sk-b2,.sk-b3{animation:none !important}
}
`;

/** The rig's ticket body outline (same as the hero Shorty), `i` insets it for the stitching. */
export function ticketPath(i = 0) {
  const x0 = 14, x1 = 112, y0 = 3, y1 = 172, r = 11, ny = 77, nr = 5.5;
  const a = x0 + i, b = x1 - i, t = y0 + i, u = y1 - i, rr = Math.max(2, r - i), n = nr + i;
  return `M${a + rr} ${t} H${b - rr} Q${b} ${t} ${b} ${t + rr} V${ny - n} A${n} ${n} 0 0 0 ${b} ${ny + n} V${u - rr} Q${b} ${u} ${b - rr} ${u} H${a + rr} Q${a} ${u} ${a} ${u - rr} V${ny + n} A${n} ${n} 0 0 0 ${a} ${ny - n} V${t + rr} Q${a} ${t} ${a + rr} ${t} Z`;
}

/* Shorty's own palette, from the rig. */
export const G = { green: "#8cc3a1", side: "#5f9677", stitch: "#3e6c56", ink: "#1d1a16", white: "#fbf6e6" };
export const ink = (w: number) => ({ stroke: G.ink, strokeWidth: w, strokeLinejoin: "round" as const, strokeLinecap: "round" as const });
const OFFSET = "translate(40 24)";   // rig space (x 0..126, y 0..240) → this SVG's 260 x 276 view box

export function Sneaker({ side, x, y }: { side: number; x: number; y: number }) {
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

/** A relaxed glove with its wrist at 0,0, arm along +x: a soft fist, thumb tucked. */
export function RestGlove() {
  const w = { fill: G.white, ...ink(2.3) };
  return (
    <>
      <circle cx="8.500" cy="0" r="8.600" {...w} />
      <ellipse cx="6.500" cy="-7.500" rx="3.500" ry="3.200" transform="rotate(-20 6.500 -7.500)" {...w} />
      <path d="M12 -5 Q14.500 0 12 5 M8 -6 Q10.500 0 8 6" fill="none" {...ink(1.2)} />
      <path d="M-7.500 -8.400 Q-3.400 -9.400 0.400 -7.400 V7.400 Q-3.400 9.400 -7.500 8.400 Q-9 0 -7.500 -8.400 Z" {...w} />
      <path d="M-3.600 -8.200 Q-5 0 -3.600 8.200" fill="none" {...ink(1.3)} />
    </>
  );
}

function Shorty() {
  const w = { fill: G.white, ...ink(2.3) };
  return (
    <svg viewBox="0 0 260 296" aria-hidden="true" focusable="false" className="relative block h-auto w-full overflow-visible">
      {/* the short ground line, and his shadow */}
      {/* the chat bar he stands on: an input with its placeholder and a send button */}
      <rect x="7" y="258" width="246" height="34" rx="17" fill={G.side} stroke={INK} strokeWidth="3" />
      <rect x="4" y="254" width="246" height="34" rx="17" fill={CREAM} stroke={INK} strokeWidth="3" />
      <text x="22" y="275.500" fontSize="12.500" fontFamily={BODY} fill={INK} fillOpacity="0.62">Ask Shorty to do anything...</text>
      <circle cx="231" cy="271" r="12" fill={MINT} stroke={INK} strokeWidth="2.600" />
      <path d="M225.500 271H236 M231.500 266 L236.500 271 L231.500 276" fill="none" {...ink(2.600)} />

      <g>
      <ellipse cx="104" cy="253" rx="46" ry="5" fill="#000" opacity="0.3" />
      <g className="sk-sway">
      <g className="sk-idle">
      <g className="sk-bob">
        {/* legs, white sneakers, the ticket body, his face */}
        <g transform={OFFSET}>
          <g className="sk-legl">
            <path d="M52 158 V170 Q42 199 44 224" fill="none" stroke={G.ink} strokeWidth="7" strokeLinecap="round" />
            <Sneaker side={-1} x={44} y={228} />
          </g>
          <g className="sk-legr">
            <path d="M75 158 V170 Q85.500 199 84 224" fill="none" stroke={G.ink} strokeWidth="7" strokeLinecap="round" />
            <Sneaker side={1} x={84} y={228} />
          </g>

          <path d={ticketPath(0)} fill={G.side} {...ink(3.4)} transform="translate(-2.6 1.6)" />
          <path d={ticketPath(0)} fill={G.green} {...ink(3.4)} />
          <path d={ticketPath(4.2)} fill="none" stroke={G.stitch} strokeWidth="1.1" strokeDasharray="3 2.6" opacity="0.85" />
          <path d="M82 104 V150 H42 V90 A20 20 0 0 1 81 85" fill="none" stroke={G.white} strokeWidth="5.200" strokeLinejoin="miter" />
          <path d="M50 113 L59.500 123.500 L84 93" fill="none" stroke={G.white} strokeWidth="5.400" strokeLinejoin="miter" strokeLinecap="square" />

          {/* eyes (under the sunglasses until they drop), brows, a confident smirk */}
          <g className="sk-wink"><path d="M0 0 L2.900 -2.200 A3.100 6 0 1 1 1 -5.700 Z" transform="translate(51.500 45.500)" fill={G.ink} /></g>
          <path d="M0 0 L2.900 -2.200 A3.100 6 0 1 1 1 -5.700 Z" transform="translate(72.500 45.500)" fill={G.ink} />
          <path d="M-4.200 1.800 Q0 -2.400 4.200 1.800" transform="translate(49 30.500) rotate(-6)" fill="none" {...ink(2.4)} />
          <path d="M-4.200 1.800 Q0 -2.400 4.200 1.800" transform="translate(74.500 30.500) rotate(6)" fill="none" {...ink(2.4)} />
          <path d="M53 59 Q62 65.500 72 58" fill="none" {...ink(2.4)} />
        </g>

        {/* sunglasses: flat black lenses, no highlight. Origin: the bridge of his nose. */}
        <g className="sk-glasses"><g className="sk-lower">
          <g transform={OFFSET}>
            <path d="M41.500 38 H61.500 V47 Q61.500 54.500 52 54.500 Q41.500 54.500 41.500 47 Z" fill={G.ink} />
            <path d="M62.500 38 H82.500 V47 Q82.500 54.500 73 54.500 Q62.500 54.500 62.500 47 Z" fill={G.ink} />
            <path d="M60.500 40.500 Q62 38 63.500 40.500" fill="none" {...ink(2.2)} />
            <path d="M41.500 40.500 L30 38.500 M82.500 40.500 L94 38.500" fill="none" {...ink(2.4)} />
          </g>
        </g></g>

        {/* the cup arm: the arm and the iced coffee, as one group (origin: his left shoulder) */}
        <g className="sk-cuparm">
          <g transform={OFFSET}>
            <path d="M15 100 Q-13 108 -14 134" fill="none" stroke={G.ink} strokeWidth="6" strokeLinecap="round" />
          </g>
          <g className="sk-cup">{/* the cup stays upright as the arm lifts it (origin: the hand) */}
            <g transform={OFFSET}>
              <path d="M-13 131 L-12.500 112 L-14.600 104.200" fill="none" stroke={G.ink} strokeWidth="5.400" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M-13 131 L-12.500 112 L-14.600 104.200" fill="none" stroke={MINT} strokeWidth="2.600" strokeLinecap="round" strokeLinejoin="round" />
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

        {/* the free arm (origin: his right shoulder): drifts at his side, shrugs, goes up to his glasses, swings on the groove */}
        <g className="sk-arm">
          <g transform={OFFSET}>
            <path d="M111 100 Q136 86 160 88" fill="none" stroke={G.ink} strokeWidth="6" strokeLinecap="round" />
            {/* the phone he pulls out (upright when the arm is raised), behind the fingers */}
            <g transform="translate(160 88) rotate(26)">
              <g className="sk-phone">
                <rect x="-2" y="-18" width="21" height="36" rx="4.500" fill={INK} stroke={INK} strokeWidth="2" />
                <rect x="0" y="-14.500" width="17" height="29" rx="2" fill={MINT} />
                <path d="M3.500 -9H13.500M3.500 -4.500H11" fill="none" stroke={CREAM} strokeWidth="2" strokeLinecap="round" />
              </g>
            </g>
            <g transform="translate(160 88) rotate(9)"><RestGlove /></g>
          </g>
        </g>

        {/* text messages popping out of the phone */}
        <g className="sk-b1">
          <path d="M209 60 L203 67 L216 60 Z" fill={CREAM} {...ink(2.2)} />
          <rect x="203" y="43" width="32" height="18" rx="8" fill={CREAM} {...ink(2.4)} />
          <circle cx="212" cy="52" r="1.700" fill={INK} /><circle cx="219" cy="52" r="1.700" fill={INK} /><circle cx="226" cy="52" r="1.700" fill={INK} />
        </g>
        <g className="sk-b2">
          <path d="M217 35 L211 42 L224 35 Z" fill={MINT} {...ink(2.2)} />
          <rect x="209" y="16" width="38" height="20" rx="8" fill={MINT} {...ink(2.4)} />
          <path d="M215 25H238M215 30H230" fill="none" {...ink(2.2)} />
        </g>
        <g className="sk-b3">
          <path d="M186 53 L190 62 L194 53 Z" fill={CREAM} {...ink(2.2)} />
          <rect x="170" y="35" width="32" height="19" rx="8" fill={CREAM} {...ink(2.4)} />
          <path d="M180 44.500 L185 49 L194 40" fill="none" stroke={INK} strokeWidth="2.600" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
      </g>
      </g>
      </g>
    </svg>
  );
}

/** One pinned card. Everything but the paper layer is crisp text, so nothing is distorted. The whole card is one button
    that opens its "How it works" card. */
function SkillCard({ card, i, last, odd, open, onOpen }: { card: Card; i: number; last: boolean; odd: boolean; open: boolean; onOpen: (i: number, li: HTMLElement, btn: HTMLButtonElement) => void }) {
  const place = last ? `min-[900px]:col-start-3 ${odd ? "max-[899px]:col-start-2" : ""}` : "";
  const li = useRef<HTMLLIElement | null>(null);
  return (
    <li
      ref={li}
      className={`sk-card col-span-2 ${place}`}
      style={{ ["--i" as string]: i, ["--r" as string]: `${TILTS[i % TILTS.length]}deg`, visibility: open ? "hidden" : undefined }}
    >
      <span className="sk-paper" aria-hidden="true" />
      <span className="sk-pin" aria-hidden="true" style={{ background: PINS[i % PINS.length] }} />
      <button type="button" className="sk-hit" aria-haspopup="dialog" aria-expanded={open} onClick={(e) => li.current && onOpen(i, li.current, e.currentTarget)}>
        <span className="relative flex h-full flex-col gap-1.5 px-3 pt-4 pb-[28px] min-[900px]:gap-2 min-[900px]:px-[18px] min-[900px]:pt-[22px] min-[900px]:pb-[30px]">
          <span className="block h-9 w-9 min-[900px]:h-11 min-[900px]:w-11"><SkillIcon id={card.icon} /></span>
          <strong className="block text-[14.5px] leading-[1.15] font-extrabold tracking-[-0.01em] text-[#14161A] min-[900px]:text-[18px]" style={{ fontFamily: SANS }}>{card.title}</strong>
          <span className="block text-[12.5px] leading-[1.38] font-medium text-[#2b2620] min-[900px]:text-[14.5px] min-[900px]:leading-[1.42]" style={{ fontFamily: BODY }}>{card.line}</span>
        </span>
        <span className="sk-plus" aria-hidden="true">
          <svg viewBox="0 0 16 16" className="block h-full w-full"><path d="M8 4.200V11.800M4.200 8H11.800" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" /></svg>
        </span>
      </button>
    </li>
  );
}

/** The expanded card: grows from the tapped card (a FLIP: transform + opacity only), centered on desktop and a bottom
    sheet on a phone. It owns the dialog mechanics: scroll lock, Escape, backdrop tap, focus trap, and closing back. */
function CardDialog({ card, from, tilt, pin, onClosed }: { card: Card; from: DOMRect; tilt: number; pin: string; onClosed: () => void }) {
  const dlg = useRef<HTMLDivElement>(null);
  const bd = useRef<HTMLDivElement>(null);
  const x = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);
  const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* where the card sits relative to the expanded card, as a transform */
  const fromT = useCallback(() => {
    const el = dlg.current;
    if (!el) return "none";
    const to = el.getBoundingClientRect();
    const sx = from.width / to.width, sy = from.height / to.height;
    const dx = from.left + from.width / 2 - (to.left + to.width / 2), dy = from.top + from.height / 2 - (to.top + to.height / 2);
    return `translate(${dx}px, ${dy}px) scale(${sx}, ${sy}) rotate(${tilt}deg)`;
  }, [from, tilt]);

  useLayoutEffect(() => {
    if (reduced() || !dlg.current || !bd.current) return;
    const t = fromT();
    dlg.current.animate([{ transform: t, opacity: 0.4 }, { transform: "none", opacity: 1 }], { duration: 300, easing: "cubic-bezier(.2,.8,.3,1)" });
    bd.current.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: "ease-out" });
  }, [fromT]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    if (reduced() || !dlg.current || !bd.current) { onClosed(); return; }
    const t = fromT();
    bd.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "ease-in", fill: "forwards" });
    const done = () => { window.clearTimeout(fallback); onClosed(); };
    const fallback = window.setTimeout(done, 320);   // if the animation never reports back (a hidden tab), close anyway
    dlg.current.animate([{ transform: "none", opacity: 1 }, { transform: t, opacity: 0 }], { duration: 200, easing: "ease-in", fill: "forwards" }).finished.then(done, done);
  }, [fromT, onClosed]);

  /* scroll lock (the scrollbar's gutter stays, so nothing behind shifts), focus in, Escape, and a focus trap */
  useEffect(() => {
    const html = document.documentElement;
    const prev = { overflow: html.style.overflow, gutter: html.style.scrollbarGutter };
    html.style.scrollbarGutter = "stable";
    html.style.overflow = "hidden";
    x.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "Tab") { e.preventDefault(); x.current?.focus({ preventScroll: true }); }   // the close button is the only stop
    };
    /* the page behind must not scroll: swallow wheel and touch moves unless they belong to the card's own scroller */
    const guard = (e: Event) => { if (!(e.target instanceof Element && e.target.closest(".sk-dlg-body"))) e.preventDefault(); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("wheel", guard, { passive: false });
    document.addEventListener("touchmove", guard, { passive: false });
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("wheel", guard); document.removeEventListener("touchmove", guard); html.style.overflow = prev.overflow; html.style.scrollbarGutter = prev.gutter; };
  }, [close]);

  return createPortal(
    <div className="sk-ov">
      <div ref={bd} className="sk-bd" onClick={close} aria-hidden="true" />
      <div ref={dlg} className="sk-dlg" role="dialog" aria-modal="true" aria-labelledby="sk-dlg-title">
        <span className="sk-paper" aria-hidden="true" />
        <span className="sk-pin" aria-hidden="true" style={{ background: pin }} />
        <button ref={x} type="button" className="sk-x" aria-label="Close" onClick={close}>
          <svg viewBox="0 0 20 20" className="block h-[20px] w-[20px]" aria-hidden="true" focusable="false"><path d="M4.500 4.500L15.500 15.500M15.500 4.500L4.500 15.500" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" /></svg>
        </button>
        <div className="sk-dlg-body">
          <div className="h-16 w-16" aria-hidden="true"><SkillIcon id={card.icon} /></div>
          <h3 id="sk-dlg-title" className="mt-3 pr-12 text-[26px] leading-[1.1] font-extrabold tracking-[-0.015em] text-[#14161A]" style={{ fontFamily: SANS }}>{card.title}</h3>
          <p className="mt-2 text-[16px] leading-[1.45] font-medium text-[#2b2620]" style={{ fontFamily: BODY }}>{card.line}</p>
          <h4 className="mt-6 text-[18px] leading-[1.1] font-extrabold tracking-[-0.01em] text-[#14161A]" style={{ fontFamily: SANS }}>How it works</h4>
          <p className="mt-2 text-[17px] leading-[1.6] text-[#1d1a16]" style={{ fontFamily: BODY }}>{card.how}</p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function SkillsSection() {
  const { audience } = useAudience();
  const root = useRef<HTMLElement | null>(null);
  const cards = SETS[audience];

  /* Which card is open (at most one), where it sat, and the button to hand focus back to. The set it belongs to is
     remembered, so switching the toggle simply means it no longer matches and it closes. */
  const [open, setOpen] = useState<{ i: number; aud: Audience; from: DOMRect } | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  if (open && open.aud !== audience) setOpen(null);   // the toggle changed: close it (adjusting state while rendering, the sanctioned way)
  const shown = open && open.aud === audience ? open : null;
  const onOpen = useCallback((i: number, li: HTMLElement, btn: HTMLButtonElement) => {
    trigger.current = btn;
    setOpen({ i, aud: audience, from: li.getBoundingClientRect() });
  }, [audience]);
  const refocus = useRef(false);
  const onClosed = useCallback(() => {
    refocus.current = true;
    setOpen(null);
  }, []);
  /* once the card is visible again, hand focus back to it */
  useEffect(() => {
    if (!open && refocus.current) {
      refocus.current = false;
      trigger.current?.focus({ preventScroll: true });
    }
  }, [open]);

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
              <SkillCard key={`${audience}-${c.title}`} card={c} i={i} last={i === cards.length - 1} odd={cards.length % 2 === 1} open={shown?.i === i} onOpen={onOpen} />
            ))}
          </ul>
        </div>
      </div>
      {shown && (
        <CardDialog key={`${shown.aud}-${shown.i}`} card={cards[shown.i]} from={shown.from} tilt={TILTS[shown.i % TILTS.length]} pin={PINS[shown.i % PINS.length]} onClosed={onClosed} />
      )}
    </section>
  );
}
