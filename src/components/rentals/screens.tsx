import type { CSSProperties, ReactNode } from "react";
import { R, SERIF, SANS } from "./tokens";

/**
 * The guest app, drawn from app/smartpage/v2/house/HouseApp.tsx in the app repo: the same tokens, the same structure, the same words
 * (the defaults in lib/dashboard/verticals/skills/short_term_rental.ts). Static copies for the marketing page: nothing here is wired to anything.
 * Every name, time, code and message below is DEMO content. The three screens drawn are the three that exist in that file:
 * the home page, the Ask Shorty sheet, and "Need something?".
 */
const cardStyle: CSSProperties = { background: R.card, border: `1px solid ${R.line}`, borderRadius: R.radius, boxShadow: R.shadow };
const Ico = ({ d, size = 20, color = R.ink, sw = 1.9 }: { d: ReactNode; size?: number; color?: string; sw?: number }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const I = {
  back: <path d="M15 6l-6 6 6 6" />,
  send: <path d="M5 12h13M13 6l6 6-6 6" />,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>,
  wrench: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" />,
  book: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19V5" /></>,
  car: <><path d="M5 16V11l2-5h10l2 5v5" /><path d="M3 16h18v3H3z" /><circle cx="7.5" cy="16" r="1.5" /><circle cx="16.5" cy="16" r="1.5" /></>,
  cross: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M12 8v8M8 12h8" /></>,
  camera: <><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  close: <path d="M6 6l12 12M18 6L6 18" />,
};
const Eb = ({ children, color = R.green }: { children: ReactNode; color?: string }) => (
  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color }}>{children}</div>
);
const Sq = ({ d }: { d: ReactNode }) => (
  <span style={{ flex: "0 0 auto", width: 38, height: 38, borderRadius: 11, background: R.tint, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={d} /></span>
);

/** The phone: 390px of real app, drawn at `scale`. Cropped at `height` the way a screenshot of a scrolled page is. */
export function Phone({ children, scale = 0.8, height = 760, label }: { children: ReactNode; scale?: number; height?: number; label: string }) {
  const bezel = 9, w = Math.round(390 * scale);
  return (
    <div role="img" aria-label={label} style={{ width: w + bezel * 2, height: Math.round(height * scale) + bezel * 2, background: R.inkDeep, borderRadius: 44, padding: bezel, boxShadow: "0 30px 50px -34px rgba(26,28,32,.7)", flex: "0 0 auto" }}>
      <div style={{ width: w, height: Math.round(height * scale), borderRadius: 36, overflow: "hidden", background: R.ivory, position: "relative" }}>
        <div aria-hidden="true" style={{ width: 390, height, transform: `scale(${scale})`, transformOrigin: "0 0", fontFamily: SANS, color: R.ink, background: R.ivory }}>{children}</div>
      </div>
    </div>
  );
}

/* ── 1. the home page (HouseApp "home": Welcome + Tiles + Around here) ── */
export function HomeScreen() {
  const tile = (label: string, sub: string, d: ReactNode) => (
    <div style={{ ...cardStyle, padding: 14, display: "flex", flexDirection: "column", gap: 10, minHeight: 112 }}>
      <Sq d={d} />
      <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 16, fontWeight: 700 }}>{label}</span>
        <span style={{ fontSize: 13, color: R.greyText }}>{sub}</span>
      </span>
    </div>
  );
  const pair = (label: string, value: string) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: R.creamSub }}>{label}</span>
      <span style={{ fontSize: 17, fontWeight: 700 }}>{value}</span>
    </div>
  );
  const copy = (
    <span style={{ minHeight: 44, padding: "0 16px", borderRadius: 999, background: R.mint, color: R.onMint, fontWeight: 700, fontSize: 14, display: "inline-flex", alignItems: "center" }}>Copy</span>
  );
  const list = (name: string, n: number) => (
    <div style={{ ...cardStyle, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <span style={{ height: 110, background: R.cream, display: "flex", alignItems: "flex-end", padding: 10 }}><span style={{ fontSize: 11, fontWeight: 700, color: R.greyText, letterSpacing: ".08em", textTransform: "uppercase" }}>Host photo</span></span>
      <span style={{ padding: "10px 12px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 16, fontWeight: 700 }}>{name}</span>
        <span style={{ fontSize: 13, color: R.greyText }}>{n} picks</span>
      </span>
    </div>
  );
  return (
    <div>
      <div style={{ padding: "26px 20px 0", display: "flex", flexDirection: "column", gap: 6 }}>
        <Eb>Welcome in</Eb>
        <div style={{ fontFamily: SERIF, fontSize: 40, lineHeight: 1, letterSpacing: "-0.01em" }}>The Beach House</div>
        <div style={{ fontSize: 15, color: R.grey }}>Hosted by Jenna · Myrtle Beach</div>
      </div>
      <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 6px 6px 18px", borderRadius: 999, background: R.card, border: `1px solid ${R.line}`, boxShadow: R.shadow }}>
          <span style={{ flex: 1, minHeight: 44, display: "flex", alignItems: "center", fontSize: 16, color: R.greyText }}>Ask anything about your stay</span>
          <span style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I.mic} /></span>
          <span style={{ width: 44, height: 44, borderRadius: 999, background: R.mint, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I.send} color={R.onMint} /></span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["How do I use the TV?", "Where's beach access?", "Trash day?"].map((c) => (
            <span key={c} style={{ minHeight: 40, padding: "0 14px", borderRadius: 999, background: R.tint, fontSize: 14, fontWeight: 700, display: "inline-flex", alignItems: "center" }}>{c}</span>
          ))}
        </div>
      </div>
      <div style={{ padding: "20px 20px 0" }}>
        {/* stay card, state C: the guest is inside the window, so the codes show */}
        <div style={{ background: R.inkDeep, color: R.cream, borderRadius: 24, padding: "22px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
            <Eb color={R.mint}>Your stay</Eb><div style={{ fontSize: 13, color: R.creamSub }}>Fri to Mon</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 0", borderTop: `1px solid ${R.slate}` }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 13, color: R.creamSub }}>Front door</span>
              <span style={{ fontFamily: SERIF, fontSize: 44, lineHeight: 1, letterSpacing: "0.04em" }}>0000</span>
            </div>
            {copy}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 0", borderTop: `1px solid ${R.slate}` }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 13, color: R.creamSub }}>Wi-Fi</span>
              <span style={{ fontSize: 18, fontWeight: 700 }}>DemoNetwork</span>
              <span style={{ fontSize: 15, color: R.creamSub }}>Password: <span style={{ color: R.cream, fontWeight: 700 }}>demo-only</span></span>
            </div>
            {copy}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "12px 0 0", borderTop: `1px solid ${R.slate}` }}>{pair("Check-in", "Fri 4:00 PM")}{pair("Checkout", "Mon 10:00 AM")}</div>
          <div style={{ fontSize: 13, color: R.creamSub }}>Only you can see these, and only during your stay.</div>
        </div>
      </div>
      <div style={{ padding: "20px 20px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {tile("Need something?", "Text or call your host", I.wrench)}
        {tile("House guide", "TV, pool, trash, rules", I.book)}
        {tile("Parking", "Two in the driveway", I.car)}
        {tile("Emergency", "ER, urgent care, 24-hr pharmacy", I.cross)}
      </div>
      <div style={{ padding: "32px 20px 0" }}>
        <Eb>Around here</Eb>
        <div style={{ margin: "6px 0 14px", fontFamily: SERIF, fontSize: 30, lineHeight: 1.05 }}>Your host&rsquo;s favorite spots</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{list("Top restaurants", 6)}{list("Rainy day", 4)}</div>
      </div>
    </div>
  );
}

/* ── 2. the Ask Shorty sheet (ShortyChat): the same bubbles and header, a demo conversation ── */
const CHAT: Array<[("user" | "bot"), ReactNode]> = [
  ["user", "Where do we park?"],
  ["bot", <>Two spots in the driveway. The street on the left is for the neighbors, so please skip it.</>],
  ["user", "What time is checkout?"],
  ["bot", <><strong>10 AM Monday.</strong> The list under &ldquo;Before you go&rdquo; has the last few things.</>],
  ["user", "Trash day?"],
  ["bot", <>Tuesday. Bins go to the end of the driveway the night before.</>],
  ["user", "How do I use the TV?"],
  ["bot", <>One remote. The big green button turns on the TV and the sound bar together. The apps are already signed in.</>],
];
export function ChatScreen() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: R.ivory }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 16px 8px" }}>
        <span style={{ fontFamily: SERIF, fontSize: 26 }}>Ask Shorty</span>
        <span style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I.close} /></span>
      </div>
      <div style={{ flex: 1, padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {CHAT.map(([who, body], k) => (
          <div key={k} style={who === "user"
            ? { alignSelf: "flex-end", maxWidth: "82%", padding: "12px 16px", borderRadius: 18, background: R.ink, color: R.cream, fontSize: 15 }
            : { alignSelf: "flex-start", maxWidth: "88%", padding: "12px 16px", borderRadius: 18, background: R.card, border: `1px solid ${R.line}`, fontSize: 15, lineHeight: 1.5 }}>{body}</div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, padding: 16 }}>
        <span style={{ flex: 1, minHeight: 48, padding: "0 16px", borderRadius: 999, border: `1px solid ${R.line}`, background: R.card, fontSize: 16, color: R.greyText, display: "flex", alignItems: "center" }}>Ask anything about your stay</span>
        <span style={{ width: 48, height: 48, borderRadius: 999, background: R.mint, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I.send} color={R.onMint} /></span>
      </div>
    </div>
  );
}

/* ── 3. "Need something?" (RequestPage) ── */
export function RequestScreen() {
  const kinds = ["Something's broken", "Need more towels, TP, supplies", "Early check-in or late checkout", "Noise or a neighbor issue", "Something else"];
  const soft = (children: ReactNode) => (
    <span style={{ minHeight: 44, padding: "0 16px", borderRadius: 999, background: R.card, border: `1px solid ${R.line}`, fontSize: 14, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8 }}>{children}</span>
  );
  return (
    <div style={{ padding: "16px 20px 0" }}>
      <div style={{ minHeight: 44, display: "flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 700 }}><Ico d={I.back} /> The Beach House</div>
      <div style={{ padding: "8px 0 0", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontFamily: SERIF, fontSize: 40, lineHeight: 1 }}>Need something?</div>
        <div style={{ fontSize: 15, color: R.grey }}>Jenna gets a text the second you send this.</div>
      </div>
      <div style={{ padding: "20px 0 0", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ paddingBottom: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: R.greyText }}>What&rsquo;s going on?</div>
        {kinds.map((k, i) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 56, padding: "0 16px", borderRadius: R.radius, border: i === 0 ? `2px solid ${R.ink}` : `1px solid ${R.line}`, background: R.card, fontSize: 16, fontWeight: i === 0 ? 700 : 600 }}>
            <span style={{ width: 20, height: 20, borderRadius: 999, border: `2px solid ${R.ink}`, display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>{i === 0 && <span style={{ width: 10, height: 10, borderRadius: 999, background: R.ink }} />}</span>{k}
          </div>
        ))}
      </div>
      <div style={{ padding: "20px 0 0", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: R.grey }}>Tell Jenna what happened</div>
        <div style={{ height: 96, padding: "14px 16px", borderRadius: 12, border: `1px solid ${R.ink}`, background: R.card, fontSize: 16, lineHeight: 1.5, color: R.ink }}>The AC in the back bedroom isn&rsquo;t cooling.</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{soft(<><Ico d={I.camera} size={18} />Add a photo</>)}{soft(<><Ico d={I.mic} size={18} />Say it instead</>)}</div>
      </div>
      <div style={{ padding: "20px 0 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, minHeight: 56, padding: "0 16px", borderRadius: R.radius, background: R.cream, fontSize: 16, fontWeight: 700 }}>
          <span style={{ display: "flex", flexDirection: "column", gap: 2 }}><span>It&rsquo;s urgent</span><span style={{ fontSize: 13, fontWeight: 400, color: R.greyText }}>Jenna also gets a call</span></span>
          <span style={{ width: 22, height: 22, borderRadius: 5, border: `2px solid ${R.ink}` }} />
        </div>
      </div>
      <div style={{ padding: "24px 0 0", display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={{ minHeight: 52, borderRadius: 999, background: R.ink, color: R.cream, fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>Send to Jenna</span>
        <span style={{ minHeight: 48, borderRadius: 999, border: `1px solid ${R.ink}`, fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>Call instead</span>
        <span style={{ textAlign: "center", fontSize: 13, color: R.greyText }}>Fire, medical or danger? Call 911 first.</span>
      </div>
    </div>
  );
}
