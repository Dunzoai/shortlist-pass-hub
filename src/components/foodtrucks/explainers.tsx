"use client";

/**
 * THE EXPLAINER FLOWS (preorder, texts, install, follow) as reusable scene pieces.
 *
 * Everything here is presentational: no timers, no page state, no Shorty. The lot (ShortysLot) owns the state and drives
 * these; the admin dashboard tutorials or the unclaimed-page cartoon can render the same screens and run the same flows.
 *
 *   <PhoneShell>            the black phone with the truck page's header
 *   <HomeScreen/> <MenuScreen/> <PaidScreen/> <FollowScreen/> <InstallScreen/> <TextScreen/> <EmailScreen/>
 *   FLOWS                   each flow as a list of timed steps ({ at: ms, ...what changes }) any host can play with runFlow()
 *
 * Names in [BRACKETS] are placeholders for the owner's own truck, place, item and price.
 */
import type { ReactNode } from "react";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import { C, SANS, SERIF } from "./tokens";

export type ScreenId = "home" | "menu" | "paid" | "follow" | "install" | "text" | "email";
export type Cart = { a: number; b: number; c: number };
export type TextMsg = { text: string; say: string };

/* ───────────── the shell ───────────── */
export function PhoneShell({ children, width, height, style }: { children: ReactNode; width: number; height: number; style?: React.CSSProperties }) {
  return (
    <div className="ftl-ph" style={{ width, height, boxSizing: "border-box", background: C.ink, borderRadius: 28, padding: 9, boxShadow: "0 18px 40px rgba(0,0,0,.45)", ...style }}>
      <div style={{ position: "relative", width: "100%", height: "100%", boxSizing: "border-box", background: "#fff", borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", fontSize: 13, fontFamily: SANS, color: C.ink }}>
        <div style={{ background: C.ink, color: C.cream, padding: "12px 14px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: 15, lineHeight: 1 }}>[YOUR TRUCK]</div>
            <div style={{ fontSize: 10, color: "#8D8A80", marginTop: 3 }}>Tonight · [PLACE] · til 9</div>
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".1em", color: C.mint }}>LIVE</span>
        </div>
        {children}
      </div>
    </div>
  );
}

const pill = (extra: React.CSSProperties): React.CSSProperties => ({ borderRadius: 999, border: "1px solid " + C.hair, background: "#fff", fontSize: 12, fontWeight: 700, color: C.ink, cursor: "pointer", fontFamily: SANS, ...extra });
const col = (extra: React.CSSProperties): React.CSSProperties => ({ flexGrow: 1, display: "flex", flexDirection: "column", ...extra });
const BackBtn = ({ onClick }: { onClick: () => void }) => (
  <button type="button" className="ftl-pb" onClick={onClick} style={pill({ minHeight: 40, padding: "0 14px" })}>Back to the page</button>
);

/* ───────────── screens ───────────── */
export function HomeScreen({ chatLine, shortyHere, following, onMenu, onFollow, onInstall }: { chatLine: string; shortyHere: boolean; following: boolean; onMenu: () => void; onFollow: () => void; onInstall: () => void }) {
  return (
    <div style={col({ gap: 10, padding: 12 })}>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        {shortyHere ? (
          <div style={{ flex: "none", width: 54, height: 54, margin: "0 -6px -6px -8px", position: "relative" }}>
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-48%)" }}><ShortyMascot mood="hello" size={60} /></div>
          </div>
        ) : (
          <div style={{ flex: "none", width: 24, height: 24, borderRadius: 99, background: C.mint, border: "1px solid " + C.hair }} />
        )}
        <div style={{ background: C.mint, color: "#0D2B20", borderRadius: "14px 14px 14px 4px", padding: "8px 10px", fontSize: 12, lineHeight: 1.35, fontWeight: 600 }}>{chatLine}</div>
      </div>
      <button type="button" className="ftl-pb" onClick={onMenu} style={{ minHeight: 44, borderRadius: 999, border: 0, background: C.ink, color: C.cream, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: SANS }}>Order ahead</button>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" className="ftl-pb" onClick={onFollow} style={pill({ flex: 1, minHeight: 44, borderRadius: 10, fontSize: 13, background: following ? C.mint : C.cream })}>{following ? "Following" : "Follow"}</button>
        <button type="button" className="ftl-pb" onClick={onMenu} style={pill({ flex: 1, minHeight: 44, borderRadius: 10, fontSize: 13 })}>Menu</button>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
        {[C.amber, C.mint, C.blue].map((c) => <div key={c} style={{ flex: 1, aspectRatio: "1", borderRadius: 8, background: c, border: "1px solid " + C.hair }} />)}
      </div>
      <div style={{ fontSize: 10, color: C.body, textAlign: "center" }}>Tonight&rsquo;s menu · 3 items</div>
      <div style={{ flexGrow: 1 }} />
      <button type="button" className="ftl-pb" onClick={onInstall} style={{ minHeight: 40, borderRadius: 10, border: "1px dashed #BFB8A6", background: "transparent", color: C.ink, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: SANS }}>Add to home screen</button>
    </div>
  );
}

const ITEMS: { key: keyof Cart; color: string }[] = [{ key: "a", color: C.amber }, { key: "b", color: C.mint }, { key: "c", color: C.blue }];
export function MenuScreen({ cart, onAdd, onPay }: { cart: Cart; onAdd: (k: keyof Cart) => void; onPay: () => void }) {
  const count = cart.a + cart.b + cart.c;
  return (
    <div style={col({ padding: "10px 12px", gap: 6 })}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".14em", color: C.body }}>MENU · TONIGHT</div>
      {ITEMS.map((it) => (
        <div key={it.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 8px", background: cart[it.key] ? C.cream : "transparent", borderRadius: 8, transition: "background .2s" }}>
          <div style={{ width: 30, height: 30, flex: "none", borderRadius: 6, background: it.color, border: "1px solid " + C.hair }} />
          <div style={{ flexGrow: 1, minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 12 }}>[ITEM]</div><div style={{ fontSize: 10, color: C.body }}>[PRICE]</div></div>
          <button type="button" className="ftl-pb" aria-label="Add [ITEM]" onClick={() => onAdd(it.key)} style={{ width: 34, height: 34, borderRadius: 99, border: "1px solid " + C.hair, background: C.mint, fontSize: 14, fontWeight: 700, padding: 0, cursor: "pointer", fontFamily: SANS }}>{cart[it.key] ? String(cart[it.key]) : "+"}</button>
        </div>
      ))}
      <div style={{ flexGrow: 1 }} />
      <button type="button" className="ftl-pb" onClick={onPay} style={{ minHeight: 46, borderRadius: 999, border: 0, background: count ? C.mint : C.cream, color: count ? "#0D2B20" : "#8D8A80", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: SANS }}>
        {count ? `Pay · ${count} ${count === 1 ? "item" : "items"}` : "Pick something"}
      </button>
    </div>
  );
}

export function PaidScreen({ onBack }: { onBack: () => void }) {
  return (
    <div style={col({ alignItems: "center", justifyContent: "center", gap: 10, padding: 14, textAlign: "center" })}>
      <div className="ftl-msg" style={{ width: "100%", boxSizing: "border-box", background: C.cream, border: "1px solid " + C.hair, borderRadius: 6, padding: 12, boxShadow: "0 14px 28px -20px rgba(26,28,32,.5)" }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".14em", color: C.green }}>PAID · YOU&rsquo;RE IN</div>
        <div style={{ fontFamily: SERIF, fontSize: 22, lineHeight: 1.05, marginTop: 4 }}>Pickup 6:40</div>
        <div style={{ fontSize: 11, color: C.body, marginTop: 4 }}>At the window. Skip the line.</div>
      </div>
      <div style={{ fontSize: 11, lineHeight: 1.35, color: C.body }}>Shorty texts them when it&rsquo;s up.</div>
      <BackBtn onClick={onBack} />
    </div>
  );
}

export function FollowScreen({ following, onToggle, onBack }: { following: boolean; onToggle: () => void; onBack: () => void }) {
  return (
    <div style={col({ alignItems: "center", justifyContent: "center", gap: 12, padding: 14, textAlign: "center" })}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: C.amber, border: "1px solid " + C.hair }} />
      <div style={{ fontFamily: SERIF, fontSize: 18, lineHeight: 1.1 }}>[YOUR TRUCK]</div>
      <button type="button" className="ftl-pb" onClick={onToggle} style={pill({ minHeight: 46, padding: "0 22px", fontSize: 14, background: following ? C.mint : C.cream, boxShadow: "0 10px 20px -16px rgba(26,28,32,.5)" })}>{following ? "Following" : "Follow"}</button>
      <div style={{ fontSize: 11, lineHeight: 1.4, color: C.body, minHeight: 30 }}>{following ? "You'll get a text when [YOUR TRUCK] is out near you." : "One tap. No account, no app store."}</div>
      <BackBtn onClick={onBack} />
    </div>
  );
}

export function InstallScreen({ step }: { step: 0 | 1 | 2 }) {
  const note = { fontSize: 12, lineHeight: 1.4, color: C.body } as const;
  return (
    <div style={col({ padding: 12, gap: 8, position: "relative" })}>
      {step === 0 && (<>
        <div style={note}>No app store. They tap the share button…</div>
        <div style={{ flexGrow: 1 }} />
        <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 0", borderTop: "1px solid #EFE9DA" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8D8A80" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M15 18 L9 12 L15 6" /></svg>
          <svg className="ftl-tapme" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ borderRadius: 99 }} aria-hidden="true"><path d="M12 3 V15 M8 7 L12 3 L16 7 M5 12 V20 H19 V12" /></svg>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8D8A80" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 6 H20 M4 12 H20 M4 18 H20" /></svg>
        </div>
      </>)}
      {step === 1 && (<>
        <div style={note}>…then &ldquo;Add to Home Screen&rdquo;.</div>
        <div style={{ flexGrow: 1 }} />
        <div className="ftl-msg" style={{ background: C.cream, border: "1px solid " + C.hair, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "10px 12px", fontSize: 12, borderBottom: "1px solid #EFE9DA" }}>Copy link</div>
          <div className="ftl-tapme" style={{ padding: "10px 12px", fontSize: 12, fontWeight: 700, background: C.mint, display: "flex", justifyContent: "space-between" }}><span>Add to Home Screen</span><span>+</span></div>
          <div style={{ padding: "10px 12px", fontSize: 12 }}>Share…</div>
        </div>
      </>)}
      {step === 2 && (<>
        <div style={note}>Now your truck is an icon on their phone.</div>
        <div className="ftl-msg" style={{ flexGrow: 1, display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10, alignContent: "start", paddingTop: 6 }}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => i === 5
            ? <div key={i} className="ftl-tapme" style={{ aspectRatio: "1", borderRadius: 10, background: C.amber, border: "1px solid " + C.hair, display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12 L10 17 L19 7" /></svg></div>
            : <div key={i} style={{ aspectRatio: "1", borderRadius: 10, background: C.hair }} />)}
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, textAlign: "center", color: C.body, marginLeft: "25%", width: "25%" }}>[YOUR TRUCK]</div>
      </>)}
    </div>
  );
}

export function TextScreen({ texts, note }: { texts: TextMsg[]; note: string }) {
  return (
    <div style={col({ padding: "10px 12px", gap: 8, background: "#fff" })}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", color: C.body, textAlign: "center" }}>MESSAGES · [YOUR TRUCK]</div>
      {texts.map((t, i) => (
        <div key={i} className="ftl-msg" style={{ alignSelf: "flex-start", maxWidth: "88%", background: "#fff", border: "1px solid " + C.hair, borderRadius: "12px 12px 12px 3px", padding: "8px 10px", fontSize: 12, lineHeight: 1.35 }}>{t.text}</div>
      ))}
      <div style={{ flexGrow: 1 }} />
      <div style={{ fontSize: 10, color: C.body, textAlign: "center", lineHeight: 1.35 }}>{note}</div>
    </div>
  );
}

export function EmailScreen({ to, preview, onBack }: { to: string; preview: boolean; onBack: () => void }) {
  return (
    <div style={col({ padding: 12, gap: 10 })}>
      <div className="ftl-msg" style={{ background: "#fff", border: "1px solid " + C.hair, borderRadius: 10, padding: "10px 12px", boxShadow: "0 10px 20px -16px rgba(26,28,32,.5)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, fontWeight: 700, letterSpacing: ".1em", color: C.body }}><span>{preview ? "MAIL · PREVIEW" : "MAIL"}</span><span>{preview ? "not sent" : "now"}</span></div>
        <div style={{ fontWeight: 700, fontSize: 12, marginTop: 4 }}>Shortlist Pass</div>
        <div style={{ fontSize: 12, lineHeight: 1.35 }}>Your truck page, preorders, and how customers follow you. {preview ? `Would go to ${to}` : `Sent to ${to}`}</div>
      </div>
      <div style={{ flexGrow: 1 }} />
      <BackBtn onClick={onBack} />
    </div>
  );
}

/* ───────────── the flows, as data ───────────── */
/** One step of a flow: after `at` ms, switch screens and/or change what's on them, and optionally have Shorty say a line. */
export type FlowStep = { at: number; screen?: ScreenId; cart?: Cart; install?: 0 | 1 | 2; say?: string; ticket?: boolean };
export const FLOWS: Record<"preorder" | "install", FlowStep[]> = {
  preorder: [
    { at: 0, screen: "home" },
    { at: 1600, screen: "menu", say: "They pick what they want." },
    { at: 2500, cart: { a: 1, b: 0, c: 0 } },
    { at: 3200, cart: { a: 1, b: 1, c: 0 } },
    { at: 4300, screen: "paid", say: "They pay right there. No commission." },
    { at: 5400, ticket: true, say: "You get the ticket. They skip the line." },
  ],
  install: [
    { at: 0, screen: "install", install: 0 },
    { at: 1600, install: 1 },
    { at: 3300, install: 2 },
  ],
};
/** Play a flow: `apply` is called for each step at its time. Returns a function that cancels what hasn't happened yet. */
export function runFlow(steps: FlowStep[], apply: (s: FlowStep) => void): () => void {
  const ids = steps.map((s) => window.setTimeout(() => apply(s), s.at));
  return () => ids.forEach((id) => window.clearTimeout(id));
}
