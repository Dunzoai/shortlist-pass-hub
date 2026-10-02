"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import type { MascotMood } from "@/lib/shorty/mascot/poses";
import { ShortyScenes } from "./ShortyScenes";
import { useAudience } from "./audience";

/* ── Paper, the same feel as Shorty's ink ──────────────────────────────────── */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const Grain = () => (
  <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[.22] mix-blend-multiply" style={{ backgroundImage: GRAIN }} />
);
const PAPER = "border-[1.5px] border-[#1d1a16] shadow-[2px_2px_0_#1d1a16] sm:border-2 sm:shadow-[3px_3px_0_#1d1a16]";
const MINT = "#8cc3a1";

const ICONS = {
  menu: "M6 7h12M6 12h12M6 17h8",
  clock: "M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  megaphone: "M4 10v4h3l7 4V6L7 10H4zM17 9a4 4 0 0 1 0 6",
  calendar: "M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5zM4 10h16M8.5 3v4M15.5 3v4",
  minus: "M6 12h12",
  message: "M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H11l-4 3.5V15h.5A2.5 2.5 0 0 1 5 12.5z",
  send: "M4 12 20 4l-6 16-3-7-7-1z",
  file: "M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  clipboard: "M9 4h6v3H9zM6 6h12v15H6zM9 12h6M9 16h4",
  trophy: "M8 4h8v5a4 4 0 0 1-8 0zM8 6H5v2a3 3 0 0 0 3 3M16 6h3v2a3 3 0 0 1-3 3M12 13v4M9 20h6",
};
type Icon = keyof typeof ICONS;

/* ── What goes on each card: a little picture of the thing he did ─────────── */
const Chip = ({ children, bg = "#fbf6e6", className = "", pill = true }: { children: ReactNode; bg?: string; className?: string; pill?: boolean }) => (
  <span className={`inline-flex items-center ${pill ? "rounded-full" : "rounded-md"} border border-[#1d1a16] px-1.5 py-px text-[8.5px] font-bold uppercase tracking-[0.08em] sm:text-[10px] ${className}`} style={{ background: bg }}>
    {children}
  </span>
);

function PriceTagArt({ name, price, tint }: { name: string; price: string; tint: string }) {
  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 40 26" className="h-6 w-9 shrink-0 sm:h-7 sm:w-11" aria-hidden="true">
        <path d="M3 22 Q4 6 20 5 Q36 6 37 22 Z" fill="#e8b25a" stroke="#1d1a16" strokeWidth={1.6} />
        <path d="M7 21 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3 l3 -3" fill="none" stroke="#1d1a16" strokeWidth={1.2} />
      </svg>
      <p className="min-w-0 flex-1 text-[11px] leading-[1.25] font-semibold sm:text-[13.5px]">{name}</p>
      <span className="relative -rotate-6 rounded-[4px] border-[1.5px] border-[#1d1a16] px-1.5 py-0.5 text-[11px] font-extrabold sm:text-[13px]" style={{ background: tint }}>
        {price}
      </span>
    </div>
  );
}

function CalendarArt({ day, date, where, when, tint, pin = true }: { day: string; date: string; where: string; when: string; tint: string; pin?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-10 shrink-0 overflow-hidden rounded-[6px] border-[1.5px] border-[#1d1a16] bg-[#fffdf6] text-center sm:w-12">
        <p className="border-b-[1.5px] border-[#1d1a16] text-[8px] font-extrabold tracking-[0.1em] sm:text-[9.5px]" style={{ background: tint }}>{day}</p>
        <p className="font-[family-name:var(--font-fraunces)] text-[15px] leading-[1.5] sm:text-[18px]">{date}</p>
      </div>
      <div className="min-w-0 text-[11px] leading-[1.3] sm:text-[13.5px]">
        <p className="font-semibold">{pin ? "📍 " : ""}{where}</p>
        <p className="text-[#5d564b]">{when}</p>
      </div>
    </div>
  );
}

function RescheduleArt({ from, to, tint }: { from: string; to: string; tint: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Chip className="line-through decoration-[1.5px] opacity-60">{from}</Chip>
      <svg viewBox="0 0 24 12" className="h-3 w-6" aria-hidden="true"><path d="M1 6 H21 M16 1 L22 6 L16 11" fill="none" stroke="#1d1a16" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" /></svg>
      <Chip bg={tint}>{to}</Chip>
    </div>
  );
}

function PostArt({ caption, tint, likes, emoji }: { caption: string; tint: string; likes: number; emoji: string }) {
  return (
    <div className="flex gap-2">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[6px] border-[1.5px] border-[#1d1a16] sm:h-12 sm:w-12" style={{ background: `linear-gradient(135deg, ${tint}, #fbf6e6)` }}>
        <span className="absolute top-1 right-1.5 text-[10px]">✦</span>
        <span className="absolute bottom-0.5 left-1 text-[13px] sm:text-[15px]">{emoji}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[11px] leading-[1.25] font-semibold sm:text-[13px]">“{caption}”</p>
        <p className="mt-1 flex items-center gap-1.5 text-[9.5px] font-bold text-[#5d564b] sm:text-[11px]">
          <span className="text-[#d6463f]">♥ {likes}</span> <span>💬 {Math.round(likes / 6)}</span>
        </p>
      </div>
    </div>
  );
}

function RemovedArt({ item }: { item: string }) {
  return (
    <div className="relative flex items-center gap-2">
      <span className="text-[16px] sm:text-[18px]">🥐</span>
      <p className="text-[12px] font-semibold line-through decoration-[#c8473d] decoration-2 sm:text-[14px]">{item}</p>
      <span className="absolute -top-1 right-0 -rotate-12 rounded-[3px] border-[1.5px] border-[#c8473d] px-1 text-[8.5px] font-extrabold tracking-[0.1em] text-[#c8473d] sm:text-[10px]">SOLD OUT</span>
    </div>
  );
}

function TextBlastArt({ count, note }: { count: number; note: string }) {
  const faces = ["#f2c94c", "#8fb8e0", "#f0a3b4", "#a8d08d", "#b7a3e0"];
  return (
    <div>
      <div className="flex items-center">
        {faces.map((c, i) => (
          <span key={c} className="-ml-1.5 h-5 w-5 rounded-full border-[1.5px] border-[#1d1a16] first:ml-0 sm:h-6 sm:w-6" style={{ background: c, zIndex: 5 - i }} />
        ))}
        <span className="ml-1.5 text-[11px] font-extrabold sm:text-[13px]">+{count - faces.length}</span>
      </div>
      <p className="mt-1 text-[10.5px] font-semibold text-[#5d564b] sm:text-[12.5px]">{note} · <span className="text-[#2f7a50]">{count} delivered</span></p>
    </div>
  );
}

function QuoteArt({ who, total }: { who: string; total: string }) {
  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 22 28" className="h-7 w-6 shrink-0 sm:h-8 sm:w-7" aria-hidden="true">
        <path d="M2 2 H15 L20 7 V26 H2 Z" fill="#fffdf6" stroke="#1d1a16" strokeWidth={1.6} />
        <path d="M6 11 H16 M6 15 H16 M6 19 H12" stroke="#1d1a16" strokeWidth={1.2} />
      </svg>
      <div className="text-[11px] leading-[1.25] sm:text-[13px]">
        <p className="font-semibold">{who}</p>
        <p className="font-extrabold text-[#2f7a50]">{total}</p>
      </div>
    </div>
  );
}

/* ── HOA cards ───────────────────────────────────────────────────────────── */
function RulesArt() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="relative grid h-8 w-7 shrink-0 place-items-center rounded-[3px] border-[1.5px] border-[#1d1a16] bg-[#fffdf6] sm:h-9 sm:w-8">
          <span className="absolute -bottom-1 -left-1 rounded-[2px] bg-[#c8473d] px-0.5 text-[7px] font-extrabold tracking-wide text-[#fbf6e6] sm:text-[8px]">PDF</span>
          <span className="h-px w-3 bg-[#1d1a16]/50 shadow-[0_3px_0_rgba(29,26,22,.5),0_-3px_0_rgba(29,26,22,.5)]" />
        </span>
        <p className="text-[11px] leading-[1.25] font-semibold sm:text-[13.5px]">Covenants.pdf</p>
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1">
        <Chip bg="#cfe5f1">Fences</Chip><Chip bg="#f6e3a8">Parking</Chip><Chip bg="#f4c0cc">Pets</Chip><Chip bg="#d6e0b8">Paint colors</Chip>
      </div>
    </div>
  );
}

function StreetArt() {
  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 54 34" className="h-8 w-12 shrink-0 sm:h-9 sm:w-14" aria-hidden="true">
        <rect x="1" y="1" width="52" height="32" rx="4" fill="#fffdf6" stroke="#1d1a16" strokeWidth="1.4" />
        <path d="M6 9 H48 M6 25 H48 M10 9 V25" stroke="#cfc6b3" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M10 17 H48" stroke="#f08a3c" strokeWidth="4.5" strokeLinecap="round" />
        {[16, 23, 30, 37, 44].map((x) => <circle key={x} cx={x} cy={12.2} r={1.5} fill="#1d1a16" />)}
        {[16, 23, 30, 37, 44].map((x) => <circle key={`b${x}`} cx={x} cy={21.8} r={1.5} fill="#1d1a16" />)}
      </svg>
      <div className="min-w-0 text-[11px] leading-[1.3] sm:text-[13.5px]">
        <p className="font-semibold"><span className="line-through opacity-50">All streets</span> → <span className="font-extrabold">Maple Court</span></p>
        <p className="font-extrabold text-[#2f7a50]">18 homes</p>
      </div>
    </div>
  );
}

function BingoEventArt() {
  return (
    <div>
      <CalendarArt day="THU" date="7 PM" where="Clubhouse" when="Bingo Night" tint="#a8d08d" pin />
      <div className="mt-1.5"><Chip bg="#a8d08d">RSVPs open</Chip></div>
    </div>
  );
}

function PoolNoticeArt() {
  const roofs = ["#b9523b", "#6f7f99", "#d9b58c", "#b9523b", "#6f7f99"];
  return (
    <div>
      <div className="-rotate-1 rounded-[5px] border-[1.5px] border-[#1d1a16] bg-[#fffdf6] px-2 py-1 text-[10.5px] leading-[1.3] font-semibold sm:text-[12.5px]">
        “Pool closes 6 PM tonight”
      </div>
      <div className="mt-1.5 flex items-center gap-1.5">
        <svg viewBox="0 0 24 12" className="h-3 w-5 shrink-0" aria-hidden="true"><path d="M1 6 H21 M16 1 L22 6 L16 11" fill="none" stroke="#1d1a16" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span className="text-[10.5px] font-extrabold sm:text-[12.5px]">Every home</span>
        <span className="flex">
          {roofs.map((c, i) => (
            <svg key={i} viewBox="0 0 12 11" className="-ml-px h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true"><path d="M1 5 L6 1 L11 5 V10 H1 Z" fill={c} stroke="#1d1a16" strokeWidth={1} strokeLinejoin="round" /></svg>
          ))}
        </span>
      </div>
    </div>
  );
}

function YardSaleArt() {
  return (
    <div>
      <CalendarArt day="SAT" date="8–12" where="Yard sale" when="8 AM to noon" tint="#f0b45a" pin={false} />
      <div className="mt-1.5"><Chip bg="#f4c0cc" pill={false} className="whitespace-normal leading-[1.25]">♥ Neighbors can favorite sales</Chip></div>
    </div>
  );
}

function ContestArt() {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border-[1.5px] border-[#1d1a16] bg-[#f5a46a] text-[19px] sm:h-10 sm:w-10 sm:text-[22px]">🎃</span>
      <div className="min-w-0 text-[11px] leading-[1.3] sm:text-[13.5px]">
        <p className="font-semibold">Best Halloween House</p>
        <p className="text-[#5d564b]">Voting closes <span className="font-bold text-[#c8473d]">Oct 31</span></p>
      </div>
    </div>
  );
}

/* ── One owner at a time texts Shorty; he does it on his phone and answers ────
   Nito's Empanadas is a real client; the other business names are made up. */
type Exchange = { biz: string; scene?: string; tint: string; ask: string; reply: string; card: { icon: Icon; label: string; art: ReactNode } };

const EXCHANGES: Exchange[] = [
  { biz: "Nito's Empanadas", tint: "#f2c94c", ask: "Add the Meatball Parm Empanada to the menu. $6.", reply: "On the menu. Smells great from here.",
    card: { icon: "menu", label: "Menu item added", art: <PriceTagArt name="Meatball Parm Empanada" price="$6" tint="#f2c94c" /> } },
  { biz: "Coastal Plumbing", tint: "#8fb8e0", ask: "Move my 2pm to Thursday and let her know.", reply: "Moved. She's got the new time.",
    card: { icon: "clock", label: "Rescheduled", art: <RescheduleArt from="Tue 2:00" to="Thu 2:00" tint="#8fb8e0" /> } },
  { biz: "Salt & Shear Salon", tint: "#f0a3b4", ask: "Post to social media: walk-ins welcome today.", reply: "Posted. Clear your chairs.",
    card: { icon: "megaphone", label: "Posted to social", art: <PostArt caption="Walk-ins welcome today" tint="#f0a3b4" likes={24} emoji="✂️" /> } },
  { biz: "Low Tide Tacos", tint: "#f5a46a", ask: "We're at Clear Pond Friday, 1 to 5.", reply: "It's on the calendar. Clear Pond won't know what hit it.",
    card: { icon: "calendar", label: "Event scheduled", art: <CalendarArt day="FRI" date="1–5" where="Clear Pond" when="Food truck stop · 1–5 PM" tint="#f5a46a" /> } },
  { biz: "Rise Bakery", tint: "#d9b58c", ask: "Sold out of croissants. Take them off.", reply: "Gone. Tomorrow's batch better hurry.",
    card: { icon: "minus", label: "Removed from menu", art: <RemovedArt item="Butter croissant" /> } },
  { biz: "Anchor Taproom", tint: "#b7a3e0", ask: "Text everyone trivia starts at 7.", reply: "Texted 348 regulars. Brains warming up.",
    card: { icon: "message", label: "Text sent", art: <TextBlastArt count={348} note="Trivia at 7" /> } },
  { biz: "Greenline Landscaping", tint: "#a8d08d", ask: "Send the Hendersons the backyard quote.", reply: "Sent. Fingers crossed, gloves on.",
    card: { icon: "send", label: "Quote sent", art: <QuoteArt who="The Hendersons · Backyard" total="$2,450" /> } },
  { biz: "Shine Mobile Detailing", tint: "#7fd0d6", ask: "Post to social media: Saturday's wide open.", reply: "Posted. Saturday won't stay open long.",
    card: { icon: "megaphone", label: "Posted to social", art: <PostArt caption="Saturday's wide open" tint="#7fd0d6" likes={31} emoji="🚗" /> } },
];

/* The HOA version. Names are made up (like Rise Bakery) so no real community is on the homepage;
   "48 pages" and "18 homes" are illustration numbers. Order is on purpose: the two things a
   Facebook group can't do (learn the documents, text just one street) come first. */
const HOA_EXCHANGES: Exchange[] = [
  { scene: "hoa-covenants", biz: "Heron Point HOA", tint: "#8fb8e0", ask: "Here's our covenants. Answer residents' questions from it.", reply: "Read all 48 pages. Go ahead, ask me about fences.",
    card: { icon: "file", label: "Rules learned", art: <RulesArt /> } },
  { scene: "hoa-street", biz: "Oak Hollow HOA", tint: "#f0b45a", ask: "Message the residents on Maple Court: the street gets paved Monday. Cars off the road by 8.", reply: "Just Maple Court. Everyone else gets to sleep in.",
    card: { icon: "target", label: "Targeted", art: <StreetArt /> } },
  { scene: "hoa-bingo", biz: "Palmetto Pines HOA", tint: "#a8d08d", ask: "Bingo Thursday at 7 in the clubhouse. Open RSVPs.", reply: "Posted. Dust off the daubers.",
    card: { icon: "calendar", label: "Event posted", art: <BingoEventArt /> } },
  { scene: "hoa-pool", biz: "Willow Creek HOA", tint: "#7fd0d6", ask: "Pool closes at 6 tonight for cleaning. Tell everyone.", reply: "Sent. Nobody's showing up in a swimsuit at 7.",
    card: { icon: "message", label: "Notice sent", art: <PoolNoticeArt /> } },
  { scene: "hoa-yardsale", biz: "Oak Hollow HOA", tint: "#f0b45a", ask: "Open yard sale sign-ups for Saturday.", reply: "Open. Somebody's finally selling that treadmill.",
    card: { icon: "clipboard", label: "Sign-ups open", art: <YardSaleArt /> } },
  { scene: "hoa-halloween", biz: "Willow Creek HOA", tint: "#7fd0d6", ask: "Start the Halloween decorating contest. Voting closes the 31st.", reply: "Live. My money's on the house with the 12-foot skeleton.",
    card: { icon: "trophy", label: "Contest live", art: <ContestArt /> } },
];

const COPY = {
  business: {
    eyebrow: "Your newest hire",
    blurb: "He's the coworker who never clocks out. He knows everything you sell, talks to your customers, takes their money for you, and handles the busywork so you can focus on what you do best.",
  },
  hoa: {
    eyebrow: "Your newest board member",
    blurb: "He's the board member who never sleeps. He knows every rule in your documents, answers residents at midnight, runs your events, and gets the word to exactly the right neighbors, so your board can get its evenings back.",
  },
};

const HELLO_MS = 1500;
/* then he pulls his phone out of his pocket and keeps it in hand from there on */
const POCKET_MS = 1100;
/* How he takes a finished job: a different look each round, the big grin only now and then. */
const REACTIONS: MascotMood[] = ["content", "whistle", "pleased", "proud"];
/* Per text:
   0 quiet · 1 owner typing… · 2 their text lands (he nods) · 3 he works his phone ·
   4 the card grows out of his phone · 5 Shorty typing… · 6 his reply lands ·
   7 the card drifts off up and to the right · 8 the texts clear */
const STEP_MS = [500, 1400, 1200, 1100, 1400, 1300, 1400, 1400, 450];

function Dots() {
  return (
    <span className="inline-flex gap-1 py-1" aria-label="typing">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#1d1a16]/60 sm:h-2 sm:w-2" style={{ animationDelay: `${i * 160}ms`, animationDuration: "1100ms" }} />
      ))}
    </span>
  );
}

type BubbleState = "hidden" | "typing" | "text";

/** A text, owner's or Shorty's: a colored strip with the name, then "…", then the words. */
function TextBubble({ state, name, tint, mine, children }: { state: BubbleState; name: string; tint: string; mine?: boolean; children: ReactNode }) {
  const on = state !== "hidden";
  return (
    <div
      className={`max-w-[220px] transition-[opacity,translate,scale] duration-500 ease-[cubic-bezier(.25,.8,.35,1.15)] sm:max-w-[270px] lg:max-w-[300px] ${
        mine ? "mr-auto origin-bottom-left" : "ml-auto origin-bottom-right"
      } ${on ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-90"}`}
      style={{ rotate: mine ? "-1deg" : "1.2deg" }}
    >
      <div className={`relative overflow-hidden rounded-[15px] bg-[#fbf6e6] sm:rounded-[20px] ${mine ? "rounded-bl-[5px] sm:rounded-bl-[6px]" : "rounded-br-[5px] sm:rounded-br-[6px]"} ${PAPER}`}>
        <Grain />
        <p className="relative border-b-[1.5px] border-[#1d1a16] px-3 py-1 text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-[#1d1a16] sm:border-b-2 sm:px-4 sm:py-1.5 sm:text-[11px]" style={{ background: tint }}>
          {name}
        </p>
        <div key={state} className="slp-land relative px-3 py-1.5 text-[12.5px] leading-[1.35] font-medium text-balance text-[#1d1a16] sm:px-4 sm:py-2.5 sm:text-[15px] lg:text-[16px]">
          {state === "typing" ? <Dots /> : children}
        </div>
      </div>
    </div>
  );
}

/** What he did: comes up out of the top edge of his phone (where the screen light spills,
    about 57% across and 43% down his box), grows as it travels out to its spot beside him,
    then drifts off up and to the right before the texts clear. The card's bottom-left
    corner is pinned to the phone; --w is his box width, set on the wrapper. */
type CardState = "tucked" | "out" | "away";
const CARD_STYLE: Record<CardState, React.CSSProperties> = {
  tucked: { opacity: 0, transform: "translate(-12px, -100%) scale(.1)", transition: "none" },
  out: {
    opacity: 1, transform: "translate(calc(var(--w) * 0.14), calc(-100% + var(--w) * 0.3)) rotate(3deg) scale(1)",
    /* eases in so you see it small, rising out of the phone, before it swells out to its spot */
    transition: "transform 1150ms cubic-bezier(.55,.05,.2,1.12), opacity 260ms ease-in",
  },
  away: {
    opacity: 0, transform: "translate(70vw, -70vh) rotate(10deg) scale(.9)",
    transition: "transform 1400ms cubic-bezier(.45,0,.6,.6), opacity 1400ms cubic-bezier(.7,0,.9,.5)",
  },
};

function ResultCard({ state, ex }: { state: CardState; ex: Exchange }) {
  return (
    <>
      {/* a burst of light off the screen as it comes out */}
      {state === "out" && <span aria-hidden="true" className="slp-flash pointer-events-none absolute top-[43%] left-[57%] z-10 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,#f2fff8,rgba(191,240,212,.6)_45%,rgba(191,240,212,0))]" />}
      <div data-result-card className="absolute top-[43%] left-[57%] z-10 w-[160px] origin-[0%_100%] sm:w-[210px] lg:w-[235px]" style={CARD_STYLE[state]}>
        <div className={`relative rounded-[12px] bg-[#fbf6e6] px-3 py-2.5 text-[#1d1a16] sm:rounded-[14px] sm:px-4 sm:py-3 ${PAPER}`}>
          <Grain />
          <div className="relative flex items-center gap-1.5 sm:gap-2">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md border-[1.5px] border-[#1d1a16] sm:h-6 sm:w-6" style={{ background: ex.tint }}>
              <svg viewBox="0 0 24 24" className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" stroke="#1d1a16" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={ICONS[ex.card.icon]} />
              </svg>
            </span>
            <span className="text-[8.5px] font-extrabold uppercase tracking-[0.12em] sm:text-[10px]">{ex.card.label}</span>
          </div>
          <div className="relative mt-2 sm:mt-2.5">{ex.card.art}</div>
          <p className="relative mt-2 inline-flex items-center gap-1 rounded-full bg-[#2f7a50] px-1.5 py-px text-[8.5px] font-bold uppercase tracking-[0.1em] text-[#fbf6e6] sm:mt-2 sm:px-2 sm:text-[10px]">
            ✓ Done
          </p>
        </div>
      </div>
    </>
  );
}

export function ShortyHero() {
  const { audience } = useAudience();
  const [phase, setPhase] = useState<"hello" | "pocket" | "texts">("hello");
  const [n, setN] = useState(0);
  const [step, setStep] = useState(0);
  const reduce = useRef(false);

  useLayoutEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce.current) { setPhase("texts"); setStep(6); }
  }, []);

  /* Switching to the other version starts its texts from the top. */
  useEffect(() => {
    setN(0);
    setStep(reduce.current ? 6 : 0);
  }, [audience]);

  useEffect(() => {
    if (reduce.current) return;
    if (phase === "hello" || phase === "pocket") {
      const id = window.setTimeout(() => setPhase(phase === "hello" ? "pocket" : "texts"), phase === "hello" ? HELLO_MS : POCKET_MS);
      return () => clearTimeout(id);
    }
    const id = window.setTimeout(() => {
      if (step < 8) setStep(step + 1);
      else { setStep(0); setN((k) => k + 1); }
    }, STEP_MS[step]);
    return () => clearTimeout(id);
  }, [phase, step]);

  const list = audience === "hoa" ? HOA_EXCHANGES : EXCHANGES;
  const ex = list[n % list.length];
  const copy = COPY[audience];
  const live = phase === "texts";
  const mood: MascotMood =
    phase === "hello" ? "hello"
    : phase === "pocket" ? "pocket"
    : reduce.current ? "pleased"
    : step === 2 ? "nod"
    : step >= 3 && step <= 5 ? "tapping"
    : step === 6 || step === 7 ? REACTIONS[n % REACTIONS.length]
    : "wait";
  const owner: BubbleState = !live || step < 1 || step > 7 ? "hidden" : step === 1 ? "typing" : "text";
  const shorty: BubbleState = !live || step < 5 || step > 7 ? "hidden" : step === 5 ? "typing" : "text";
  const card: CardState = !live || step < 4 ? "tucked" : step >= 7 ? "away" : "out";

  return (
    <section className="relative overflow-x-clip">
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes slp-land{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:none}}
.slp-land{animation:slp-land .4s cubic-bezier(.25,.85,.35,1.15) both;transform-origin:left center}
@keyframes slp-flash{0%{opacity:0;scale:.2}25%{opacity:1}100%{opacity:0;scale:2.6}}
.slp-flash{animation:slp-flash .6s ease-out both}
@media (prefers-reduced-motion: reduce){.slp-land,.slp-flash{animation:none}}`,
        }}
      />
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 px-4 pt-3 pb-10 [grid-template-areas:'stage''copy'] sm:px-8 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center lg:gap-x-12 lg:pt-10 lg:pb-24 lg:[grid-template-areas:'copy_stage']">
        {/* The stage: a text comes in, Shorty works his phone, the result unfolds out of it, he answers. */}
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col [grid-area:stage] lg:max-w-none" aria-live="polite">
          {/* Whoever texted, he's standing in their world; scenes crossfade, never empty. */}
          <div className="absolute inset-x-0 bottom-0 h-[230px] lg:h-[400px]">
            <ShortyScenes scene={ex.scene ?? ex.biz} group={audience} show />
          </div>
          {/* Each bubble has its own fixed spot, so nothing shifts when the other lands: the owner's
              grows down from the top right, Shorty's grows up from just over his head. */}
          <div className="relative mt-2 h-[176px] sm:mt-4 sm:h-[190px] lg:mt-0 lg:h-[230px]">
            <div className="absolute top-0 right-0">
              <TextBubble state={owner} name={ex.biz} tint={ex.tint}>{ex.ask}</TextBubble>
            </div>
            <div className="absolute bottom-0 left-0">
              <TextBubble state={shorty} name="Shorty" tint={MINT} mine>{ex.reply}</TextBubble>
            </div>
          </div>
          {/* Shorty sits a little left of center so the card has room to come out on his right. */}
          <div className="relative -mt-7 w-[var(--w)] -translate-x-[38px] self-center [--w:170px] sm:-mt-9 sm:-translate-x-[42px] sm:[--w:190px] lg:-translate-x-[70px] lg:[--w:300px]">
            <ShortyMascot mood={mood} size={190} holdPhone={phase === "texts"} style={{ width: "100%", height: "auto" }} />
            <ResultCard state={card} ex={ex} />
          </div>
        </div>

        <div className="mt-2 max-w-[480px] [grid-area:copy] sm:mt-4 lg:mt-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2f7a50] sm:text-[12px]">{copy.eyebrow}</p>
          <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-[clamp(44px,6.4vw,84px)] leading-[0.95] font-normal tracking-[-0.03em] text-[#1d1a16] lg:mt-3 lg:whitespace-nowrap">
            Meet Shorty.
          </h1>
          <p className="mt-3 text-[15.5px] leading-[1.5] text-[#3a352d] sm:text-[18px] sm:leading-[1.6] lg:mt-6">
            {copy.blurb}
          </p>
          <p className="mt-2.5 text-[14.5px] font-semibold text-[#2f7a50] sm:text-[15px] lg:mt-4">
            Just text Shorty what you need. You say yes, he gets it done.
          </p>
        </div>
      </div>
    </section>
  );
}
