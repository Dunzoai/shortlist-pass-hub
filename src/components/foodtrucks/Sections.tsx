import type { ReactNode } from "react";
import { GET_A_SHORTY_URL, TRUCKS_SITE_URL } from "./config";
import { C, SERIF } from "./tokens";

const eyebrow = (color: string = C.green) => ({ fontWeight: 700, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color } as const);
const h2 = { fontFamily: SERIF, fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 0.98, margin: 0, textWrap: "balance" } as const;
const card = { background: "#fff", border: "1px solid " + C.hair, borderRadius: 16, boxShadow: "0 18px 36px -26px rgba(26,28,32,.5)" } as const;
const btn = "inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-[15px] font-bold transition-transform hover:-translate-y-0.5";

const Ico = ({ bg, children }: { bg: string; children: ReactNode }) => (
  <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={bg === C.mint ? "#0D2B20" : C.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
  </div>
);

const SHIFT: { bg: string; icon: ReactNode; title: string; text: string; dark?: boolean }[] = [
  { bg: C.mintTint, title: "Where, when, what. 24/7.", text: "Your stops, your hours, your menu. Anyone who asks gets a straight answer, at 2 a.m. too.", icon: <><path d="M12 21 C8 16 5 13 5 9 a7 7 0 0 1 14 0 c0 4-3 7-7 12Z" /><circle cx="12" cy="9" r="2.5" /></> },
  { bg: "#FBE7C2", title: "Takes the orders.", text: "Preorders and pickup from your page. You get the ticket, they skip the line. No commission, ever.", icon: <><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M4 10 H20 M8 14 H12" /></> },
  { bg: "#E4ECFB", title: "Gets you booked.", text: "Events, parks, private gigs. Requests come in through your page. You say yes or no.", icon: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10 H21 M8 3 V7 M16 3 V7" /></> },
  { bg: C.mintTint, title: "Texts your customers.", text: "“Order’s up.” “Haven’t seen you in a while, we’re close by Friday.” “You’re a top 20, $5 off.” Only to people who said yes.", icon: <><path d="M4 5 H20 V16 H10 L6 20 V16 H4 Z" /><path d="M8 9 H16 M8 12 H13" /></> },
  { bg: "#FBE7C2", title: "Emails for you.", text: "Your week’s schedule, every Monday. New menu items when you add them. Your list, your name on it.", icon: <><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 7 L12 13 L21 7" /></> },
  { bg: "#E4ECFB", title: "Posts for you.", text: "“Post about today’s schedule.” “Post about the birria.” Done, on Instagram and Facebook, with your photo and tonight’s stop.", icon: <><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17" cy="7" r="1" fill={C.ink} /></> },
  { bg: C.mintTint, title: "Text him from anywhere.", text: "No app to open. From the line at the restaurant depot: “We’re at [PLACE] til 9.” He updates your page and tells your followers.", icon: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18 H13" /><path d="M9 9 L11 11 L15 7" /></> },
  { bg: C.mint, dark: true, title: "Gets you found.", text: "The local truck pages, Google, and ChatGPT, where people now ask where to eat. Your truck is in the answer, and they can start an order right there.", icon: <><circle cx="11" cy="11" r="7" /><path d="M16 16 L21 21" /><path d="M8 11 L10 13 L14 9" /></> },
];

const me = { alignSelf: "flex-end", maxWidth: "88%", background: C.ink, color: C.cream, borderRadius: "20px 20px 6px 20px", padding: "11px 15px", lineHeight: 1.45, fontSize: 14.5 } as const;
const sh = { alignSelf: "flex-start", maxWidth: "88%", background: C.mint, color: "#0D2B20", borderRadius: "20px 20px 20px 6px", padding: "11px 15px", lineHeight: 1.45, fontWeight: 600, fontSize: 14.5 } as const;
const list = { margin: 0, paddingLeft: 18, listStyle: "disc", fontSize: 14.5, lineHeight: 1.7, color: C.body } as const;

export function Sections() {
  return (
    <div className="flex flex-col gap-14 md:gap-24">
      {/* 1. What he does all day */}
      <section style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ maxWidth: 640 }}>
          <div style={eyebrow()}>Your newest hire</div>
          <h2 className="text-[40px] md:text-[56px]" style={{ ...h2, marginTop: 10 }}>Shorty&rsquo;s got a full shift.</h2>
          <p className="text-[16.5px] md:text-[19px]" style={{ margin: "14px 0 0", lineHeight: 1.6, color: C.body, textWrap: "pretty" }}>Everything a good front-of-house person would do, if they never slept and never asked for a raise.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 14 }}>
          {SHIFT.map((c) => (
            <div key={c.title} style={{ ...card, padding: 20, display: "flex", flexDirection: "column", gap: 10, ...(c.dark ? { background: C.ink, borderColor: C.ink, color: C.cream } : {}) }}>
              <Ico bg={c.bg}>{c.icon}</Ico>
              <div style={{ fontWeight: 800, fontSize: 17, lineHeight: 1.2, color: c.dark ? C.mint : undefined }}>{c.title}</div>
              <div style={{ fontSize: 14.5, lineHeight: 1.5, color: c.dark ? "#D2CCBC" : C.body }}>{c.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Text him like an employee */}
      <section className="p-6 md:p-10" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 32, alignItems: "center", background: C.ink, color: C.cream, borderRadius: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={eyebrow(C.mint)}>No app to open</div>
          <h2 className="text-[40px] md:text-[56px]" style={h2}>Text him like you&rsquo;d text an employee.</h2>
          <p className="text-[16.5px] md:text-[19px]" style={{ margin: 0, lineHeight: 1.6, color: "#D2CCBC", textWrap: "pretty" }}>Schedule changes, sold-out items, a post you want up, a text to your regulars. Say it in plain words. He does it, and checks with you before anything goes out to customers.</p>
          <div style={{ fontSize: 13.5, color: "#8D8A80" }}>Texting Shorty comes with Communications.</div>
        </div>
        <div style={{ ...card, padding: 16, display: "flex", flexDirection: "column", gap: 10, maxWidth: 400, width: "100%", justifySelf: "center", color: C.ink }}>
          <div style={{ textAlign: "center", fontSize: 11, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: C.muted }}>Messages · Shorty</div>
          <div style={me}>Post about the birria today</div>
          <div style={sh}>Done. Instagram and Facebook, with your birria photo and tonight&rsquo;s stop at [PLACE] til 9.</div>
          <div style={me}>Sold out of birria</div>
          <div style={sh}>Marked sold out on tonight&rsquo;s menu.</div>
          <div style={me}>Text my regulars we&rsquo;re at the brewery Friday</div>
          <div style={sh}>Ready for [NUMBER] regulars who opted in: &ldquo;We&rsquo;re at [PLACE] Friday 5–9. Order ahead and skip the line.&rdquo; Reply YES to send.</div>
        </div>
      </section>

      {/* 3. Found in ChatGPT */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 32, alignItems: "center" }}>
        <div style={{ ...card, padding: 18, display: "flex", flexDirection: "column", gap: 12, maxWidth: 440, width: "100%", justifySelf: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: C.muted }}>Example · someone in ChatGPT, 6:12 pm</div>
          <div style={{ alignSelf: "flex-end", maxWidth: "85%", background: C.cream, borderRadius: 16, padding: "10px 14px", fontSize: 15, lineHeight: 1.45 }}>Best birria truck near me tonight?</div>
          <div style={{ fontSize: 15, lineHeight: 1.55 }}>[YOUR TRUCK] is at [PLACE] until 9 tonight. Birria tacos, street corn. Want to order ahead and skip the line?</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, border: "1px solid " + C.hair, borderRadius: 14, background: C.ivory }}>
            <div style={{ width: 44, height: 44, flex: "none", borderRadius: 10, background: C.amber }} />
            <div style={{ flexGrow: 1, minWidth: 0 }}><div style={{ fontWeight: 800, fontSize: 14.5 }}>[YOUR TRUCK]</div><div style={{ fontSize: 12.5, color: C.muted }}>[PLACE] · til 9 · Shortlist Pass</div></div>
            <span style={{ flex: "none", background: C.mint, color: "#0D2B20", borderRadius: 999, padding: "7px 14px", fontSize: 13, fontWeight: 800 }}>Start order</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={eyebrow()}>Where people ask now</div>
          <h2 className="text-[40px] md:text-[56px]" style={h2}>Be the answer in ChatGPT.</h2>
          <p className="text-[16.5px] md:text-[19px]" style={{ margin: 0, lineHeight: 1.6, color: C.body, textWrap: "pretty" }}>People spend their day asking ChatGPT questions, including where to eat tonight. Shortlist puts your truck, tonight&rsquo;s stop, and your menu in that answer, and lets them start an order right there. Same on Google and on the local truck pages.</p>
          <a href={TRUCKS_SITE_URL} style={{ alignSelf: "flex-start", minHeight: 44, display: "flex", alignItems: "center", fontSize: 15.5, fontWeight: 700, color: C.green }}>See the local truck pages →</a>
        </div>
      </section>

      {/* 4. Pick your Shorty */}
      <section style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ maxWidth: 640 }}>
          <div style={eyebrow()}>Straight prices</div>
          <h2 className="text-[40px] md:text-[56px]" style={{ ...h2, marginTop: 10 }}>Pick your Shorty. No commission, ever.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 14, alignItems: "stretch" }}>
          <div style={{ ...card, padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={eyebrow(C.muted)}>Your page</div>
            <div style={{ fontFamily: SERIF, fontSize: 44, lineHeight: 1 }}>Free</div>
            <ul style={list}><li>Your menu, stops, and hours</li><li>Shorty answering customers 24/7</li><li>Found on the truck pages, Google, and ChatGPT</li><li>Followers</li></ul>
            <a className={btn} href={GET_A_SHORTY_URL} style={{ marginTop: "auto", background: C.cream, color: C.ink }}>Claim a free Shorty</a>
          </div>
          <div style={{ ...card, padding: 24, display: "flex", flexDirection: "column", gap: 12, border: "2px solid " + C.mint }}>
            <div style={eyebrow()}>Verified</div>
            <div style={{ fontFamily: SERIF, fontSize: 44, lineHeight: 1 }}>$50<span style={{ fontSize: 18, color: C.muted }}>/mo</span></div>
            <ul style={list}><li>Preorders and online ordering</li><li>Reports: what sold, who&rsquo;s coming back</li><li>Event and booking requests</li></ul>
            <a className={btn} href={GET_A_SHORTY_URL} style={{ marginTop: "auto", background: C.ink, color: C.cream }}>Get your own Shorty</a>
          </div>
          <div style={{ ...card, padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={eyebrow(C.muted)}>Communications</div>
            <div style={{ fontFamily: SERIF, fontSize: 44, lineHeight: 1 }}>$30<span style={{ fontSize: 18, color: C.muted }}>/mo</span></div>
            <ul style={list}><li>Texts to customers: order&rsquo;s up, come back, rewards</li><li>Posts to Instagram and Facebook</li><li>Weekly schedule and new-item emails</li><li>Text Shorty from anywhere</li></ul>
            <div style={{ marginTop: "auto", fontSize: 13.5, color: C.muted }}>Add it to Verified.</div>
          </div>
        </div>
        <div style={{ fontSize: 14.5, color: C.muted }}>Keep your POS for walk-ups. Shortlist doesn&rsquo;t touch it.</div>
      </section>
    </div>
  );
}
