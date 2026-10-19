"use client";
/**
 * shortlistpass.com/rentals. Rendered by src/app/rentals/page.tsx (and, in dev only, by /dev/rentals-preview).
 * Section order is the brief's: hero, movie slot, 100 messages, a few things I'm not, when something goes wrong,
 * trained by you, found in ChatGPT, book direct, pricing. Notes on what differs from the home page: docs/design/rentals-divergence.md.
 */
import type { ReactNode } from "react";
import ANotSection, { type NotRow } from "@/components/foodtrucks/ANotSection";
import NothingReplaces from "@/components/foodtrucks/NothingReplaces";
import { PipesSection } from "@/components/new-home/PipesSection";
import { SiteHeader } from "@/components/new-home/SiteHeader";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import { FridgeCard } from "./FridgeCard";
import { MovieSlot } from "./MovieSlot";
import { ChatScreen, HomeScreen, Phone, RequestScreen } from "./screens";
import { R, SERIF, SIGNUP_HREF, PRICE_LINE } from "./tokens";
import { Btn, Card, DemoChip, Eyebrow, IconSquare, PAGE_CSS } from "./ui";

const ROWS: NotRow[] = [
  { claim: "A replacement for your listing.", fix: "Keep it. I work between the bookings.", why: "Your listing is where people find you and book. I'm what the guest meets after that: the answers, the house guide, the codes. I don't touch your listing." },
  { claim: "Another app your guests have to download.", fix: "No download. No login. A card on the fridge.", why: "Guests scan the card with their camera and the house app opens in the browser. Nothing to install, no account to make." },
  { claim: "A bot that makes things up.", fix: "I only know what you told me.", why: "I answer from what you gave me and real local data. If it isn't there, I say I don't know." },
  { claim: "A middleman taking a cut.", fix: "Your money never touches our hands.", why: "We partner with Stripe and Square. We build the cart, they move the money, and it lands in your bank. No commission, ever." },
];

const Q = ({ children }: { children: ReactNode }) => <span style={{ display: "inline-flex", alignItems: "center", minHeight: 40, padding: "0 16px", borderRadius: 999, background: R.tint, fontSize: 15, fontWeight: 700 }}>{children}</span>;
const Caption = ({ children }: { children: ReactNode }) => <p style={{ marginTop: 14, fontSize: 13, color: R.greyText, textAlign: "center", maxWidth: 360 }}>{children}</p>;

function Hero() {
  return (
    <section className="rp-sec" style={{ paddingTop: 40 }}>
      <div className="rp-wrap rp-hero">
        <div style={{ display: "flex", flexDirection: "column", gap: 22, alignItems: "flex-start" }}>
          <Eyebrow>Short-term rentals</Eyebrow>
          <h1 className="rp-hd rp-h1">Your guests stop texting you. Shorty answers.</h1>
          <p className="rp-lead">Every rental gets its own house app, opened from a QR card on the fridge. No download, no login.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Btn kind="ink" href={SIGNUP_HREF}>Get started</Btn>
            <Btn kind="quiet" href="#movie">Watch the movie</Btn>
          </div>
          <div style={{ fontSize: 14, color: R.greyText }}>{PRICE_LINE}</div>
        </div>
        <div className="rp-hero-vis">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Phone label="Demo: the guest house app, home page" scale={0.74} height={820}><HomeScreen /></Phone>
            <Caption>The house app. <DemoChip /> Example house, example guest.</Caption>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 36 }}>
            <FridgeCard />
            <Caption>The card on the fridge. <DemoChip /> Every house gets its own QR.</Caption>
          </div>
        </div>
      </div>
    </section>
  );
}

function Movie() {
  return (
    <section id="movie" className="rp-sec" style={{ paddingTop: 0 }}>
      <div className="rp-wrap" style={{ maxWidth: 1040 }}>
        <MovieSlot />
        <p style={{ marginTop: 14, fontSize: 14, color: R.greyText, textAlign: "center" }}>A short film goes here: a family arrives, and Shorty is there every step.</p>
      </div>
    </section>
  );
}

function Messages() {
  return (
    <section className="rp-sec" style={{ paddingTop: 0 }}>
      <div className="rp-wrap rp-split">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Eyebrow>Your inbox</Eyebrow>
          <h2 className="rp-hd rp-h2">No more 100 messages.</h2>
          <p className="rp-lead">Most guest messages are the same few questions. I answer them day and night, in seconds, from what you told me. You stop being a full-time answering service.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Wi-Fi", "Door code", "Checkout", "Parking", "Trash day", "The TV"].map((t) => <Q key={t}>{t}</Q>)}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Phone label="Demo: a guest asking Shorty questions about the house" scale={0.8} height={720}><ChatScreen /></Phone>
            <Caption><DemoChip /> Example conversation, not a real guest.</Caption>
          </div>
          <div aria-hidden="true" className="rp-shorty-side"><ShortyMascot mood="nod" size={120} still style={{ width: "100%", height: "auto" }} /></div>
        </div>
      </div>
    </section>
  );
}

function GoesWrong() {
  const point = (icon: ReactNode, title: string, body: ReactNode) => (
    <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <IconSquare>{icon}</IconSquare>
      <h3 className="rp-hd" style={{ fontSize: 28, lineHeight: 1.05 }}>{title}</h3>
      <div style={{ fontSize: 16, lineHeight: 1.55, color: R.grey }}>{body}</div>
    </Card>
  );
  return (
    <section className="rp-sec">
      <div className="rp-wrap">
        <div style={{ maxWidth: 760, display: "flex", flexDirection: "column", gap: 20 }}>
          <Eyebrow>When it matters</Eyebrow>
          <h2 className="rp-hd rp-h2">When something actually goes wrong.</h2>
          <p className="rp-lead">I handle the routine. You handle what matters. A broken AC, a lockout, a noise complaint: that goes to you, fast.</p>
        </div>
        <div className="rp-split" style={{ marginTop: 48, alignItems: "start" }}>
          <div style={{ display: "grid", gap: 16 }}>
            {point(<><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></>, "A real person, right away.",
              <>When Shorty can&rsquo;t answer, or something needs a real person, he texts you right away. A guest request from the app, with a photo if they want, texts you the second it lands. Mark it urgent and you get a call too. The guest can always still text or call you directly from the app.</>)}
            {point(<><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M12 8v8M8 12h8" /></>, "Emergencies are one tap.",
              <>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>{["911", "Nearest ER", "Urgent care", "Pharmacy", "Fire extinguisher", "Water shut-off"].map((t) => <Q key={t}>{t}</Q>)}</div>
                The ER, urgent care and pharmacy come from real local data. The fire extinguisher and the water shut-off are the spots you tell me about.
              </>)}
            {point(<><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>, "Codes stay with the real guest.",
              <>The door code and Wi-Fi show up only for the guest who is staying: from 24 hours before check-in to 2 hours after checkout. Anyone else who asks hears &ldquo;That&rsquo;s shared with guests when they check in.&rdquo;</>)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Phone label="Demo: the Need something? request screen" scale={0.84} height={860}><RequestScreen /></Phone>
            <Caption><DemoChip /> Example request. You get a text the second a guest sends it.</Caption>
          </div>
        </div>
      </div>
    </section>
  );
}

function Trained() {
  const you = (t: string) => <div style={{ alignSelf: "flex-end", maxWidth: "92%", padding: "12px 16px", borderRadius: 18, background: R.slate2, color: R.cream, fontSize: 17 }}>{t}</div>;
  const shorty = (t: string) => (
    <div style={{ alignSelf: "flex-start", maxWidth: "92%", display: "flex", flexDirection: "column", gap: 10, padding: "12px 16px", borderRadius: 18, background: R.inkDeep, border: `1px solid ${R.slate2}`, color: R.cream, fontSize: 16, lineHeight: 1.5 }}>
      {t}<span style={{ alignSelf: "flex-start", minHeight: 40, padding: "0 18px", borderRadius: 999, background: R.mint, color: R.onMint, fontWeight: 700, fontSize: 15, display: "inline-flex", alignItems: "center" }}>Yes, save it</span>
    </div>
  );
  return (
    <section className="rp-sec" style={{ background: R.inkDeep, color: R.cream }}>
      <div className="rp-wrap rp-split" style={{ alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Eyebrow color={R.mint}>Trained by you</Eyebrow>
          <h2 className="rp-hd rp-h2" style={{ color: R.cream }}>You set me up by talking to me.</h2>
          <p style={{ fontSize: 18, lineHeight: 1.55, color: R.creamSub, maxWidth: 560 }}>Change a code. Add a guest. Tell me about a restaurant you love. I show you what I&rsquo;ll change, and nothing saves until you say yes.</p>
          <p style={{ fontSize: 22, lineHeight: 1.3, fontFamily: SERIF, color: R.cream, maxWidth: 560 }}>I only answer from what you gave me and real local data. <span style={{ color: R.mint }}>I never make things up.</span></p>
        </div>
        <div style={{ background: R.slate, borderRadius: 24, padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: R.creamSub }}>You, talking to Shorty</span><DemoChip>Example</DemoChip></div>
          {you("change the door code to 4821")}
          {shorty("Door code changes to 4821 for The Beach House. Save it?")}
          {you("Jenna checks in Friday at 4 till Monday at 10")}
          {shorty("Jenna, Friday 4 PM to Monday 10 AM. I'll make her stay link. Save it?")}
        </div>
      </div>
    </section>
  );
}

function Money() {
  const beat = (icon: ReactNode, title: string, body: ReactNode, tag?: ReactNode) => (
    <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}><IconSquare>{icon}</IconSquare>{tag}</div>
      <h3 className="rp-hd" style={{ fontSize: 28, lineHeight: 1.05 }}>{title}</h3>
      <div style={{ fontSize: 16, lineHeight: 1.55, color: R.grey }}>{body}</div>
    </Card>
  );
  return (
    <section className="rp-sec">
      <div className="rp-wrap">
        <div style={{ maxWidth: 760, display: "flex", flexDirection: "column", gap: 20 }}>
          <Eyebrow>Your guest list</Eyebrow>
          <h2 className="rp-hd rp-h2">Book direct, get paid.</h2>
          <p className="rp-lead">Most hosts have never had a guest list. After this, you do.</p>
        </div>
        <div className="rp-grid" style={{ marginTop: 40 }}>
          {beat(<><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.5a3 3 0 0 1 0 5.5M18 14.5c2 .7 3.5 2.6 3.5 5.5" /></>, "The guest list is yours.",
            <>Guests choose to hear from you about open dates and deals, right from the house app. They can say stop any time. The list belongs to you, not to anyone else.</>)}
          {beat(<><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18M7 15h3" /></>, "Repeat guests can book direct.",
            <>Guests who opted in can request dates right in the house app. You confirm, and send a payment link through your own Stripe. No booking-site fee.</>)}
          {beat(<><path d="M4 19V9l8-5 8 5v10z" /><path d="M9 19v-6h6v6" /></>, "Stripe and Square handle the money.",
            <>Stays are paid through a payment link on your own Stripe account. Orders from your favorite spots run through Stripe and Square. The money lands in your bank. We never hold it.</>)}
        </div>
        <p style={{ marginTop: 24, fontSize: 15, color: R.greyText, maxWidth: 640 }}>We never touch anyone&rsquo;s listing account.</p>
      </div>
    </section>
  );
}

function Pricing() {
  const line = (t: string) => (
    <li style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 17, lineHeight: 1.4 }}>
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={R.ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "0 0 auto", marginTop: 1 }}><path d="M5 12l5 5 9-10" /></svg>{t}
    </li>
  );
  return (
    <section className="rp-sec" style={{ paddingTop: 0 }}>
      <div className="rp-wrap" style={{ maxWidth: 760 }}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 16, alignItems: "center", marginBottom: 40 }}>
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="rp-hd rp-h2">One price. One house.</h2>
        </div>
        <Card style={{ padding: 32, display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontFamily: SERIF, fontSize: 96, lineHeight: .9, letterSpacing: "-0.02em" }}>$50</span>
            <span style={{ fontSize: 18, fontWeight: 700 }}>/ month per property</span>
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {line("Its own house app and QR card")}
            {line("Shorty answers your guests 24/7")}
            {line("Requests text you right away")}
            {line("Your own guest list")}
            {line("No commission, ever")}
          </ul>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
            <Btn kind="ink" href={SIGNUP_HREF}>Get started</Btn>
            <div style={{ fontSize: 14, color: R.greyText }}>{PRICE_LINE}</div>
          </div>
        </Card>
      </div>
    </section>
  );
}

const LAYOUT_CSS = `
.rp-h1 { font-size: 48px; line-height: .95; max-width: 760px }
@media (min-width: 900px) { .rp-h1 { font-size: 86px } }
.rp-hero { display: grid; gap: 48px; align-items: center }
@media (min-width: 1100px) { .rp-hero { grid-template-columns: minmax(0, 1fr) auto; gap: 48px } }
.rp-hero-vis { display: flex; gap: 40px; align-items: flex-start; justify-content: center; flex-wrap: wrap }
.rp-shorty-side { width: 120px; margin-left: -34px; flex: 0 0 auto }
@media (max-width: 520px) { .rp-shorty-side { display: none } }
`;

export default function RentalsPreview() {
  return (
    <div className="rp">
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS + LAYOUT_CSS }} />
      <SiteHeader plain={{ ctaLabel: "Get started", ctaHref: SIGNUP_HREF }} />
      <main>
        <Hero />
        <Movie />
        <Messages />
        <ANotSection rows={ROWS} />
        <NothingReplaces lines={{ first: "Nothing here replaces your listing.", em: "the 100 messages." }} />
        <GoesWrong />
        <Trained />
        <PipesSection mode="rentals" />
        <Money />
        <Pricing />
      </main>
    </div>
  );
}
