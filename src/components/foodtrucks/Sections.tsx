import { GET_A_SHORTY_URL } from "./config";
import { C, SERIF } from "./tokens";

const eyebrow = (color: string = C.green) => ({ fontWeight: 700, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color } as const);
const h2 = { fontFamily: SERIF, fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 0.98, margin: 0, textWrap: "balance" } as const;
const card = { background: "#fff", border: "1px solid " + C.hair, borderRadius: 16, boxShadow: "0 18px 36px -26px rgba(26,28,32,.5)" } as const;
const btn = "inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-[15px] font-bold transition-transform hover:-translate-y-0.5";
const list = { margin: 0, paddingLeft: 18, listStyle: "disc", fontSize: 14.5, lineHeight: 1.7, color: C.body } as const;

/** "Pick your Shorty. No commission, ever." The other sections that used to live here (a full shift, text him, found in ChatGPT) were taken out. */
export function Sections() {
  return (
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
  );
}
