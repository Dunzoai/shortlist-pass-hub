import type { CSSProperties, ReactNode } from "react";

/**
 * The cards that come out on the lot, drawn like the cards on the homepage hero (new-home/ShortyHero.tsx): cream paper, a thick ink
 * outline with a hard offset shadow, paper grain, a tinted icon tile with an uppercase label, a little picture of what happened, and
 * a green "Done" pill. They also move like the hero's: tucked small at their source, rise out with a springy ease, then fly off.
 * (Copied rather than imported: the hero keeps these private, and the homepage file is not touched.)
 */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const INK = "#1d1a16";
const ICONS = {
  megaphone: "M4 10v4h3l7 4V6L7 10H4zM17 9a4 4 0 0 1 0 6",
  menu: "M6 7h12M6 12h12M6 17h8",
};
export type CardState = "tucked" | "out" | "away";

const CARD_STYLE: Record<CardState, CSSProperties> = {
  tucked: { opacity: 0, transform: "translate(-6px, 20%) scale(.1)", transition: "none" },
  out: { opacity: 1, transform: "translate(0, -100%) rotate(3deg) scale(1)", transition: "transform 1150ms cubic-bezier(.55,.05,.2,1.12), opacity 260ms ease-in" },
  away: { opacity: 0, transform: "translate(60vw, -90vh) rotate(10deg) scale(.9)", transition: "transform 1400ms cubic-bezier(.45,0,.6,.6), opacity 1400ms cubic-bezier(.7,0,.9,.5)" },
};

export function HeroCard({ state, style, icon, tint, label, done = "Done", children }: { state: CardState; style: CSSProperties; icon: keyof typeof ICONS; tint: string; label: string; done?: string; children: ReactNode }) {
  return (
    <div aria-hidden="true" style={{ position: "absolute", zIndex: 6, pointerEvents: "none", transformOrigin: "0% 100%", ...style, ...CARD_STYLE[state] }}>
      <div style={{ position: "relative", background: "#fbf6e6", color: INK, border: `2px solid ${INK}`, borderRadius: 14, boxShadow: `3px 3px 0 ${INK}`, padding: "10px 12px" }}>
        <span aria-hidden="true" style={{ position: "absolute", inset: 0, borderRadius: "inherit", opacity: 0.22, mixBlendMode: "multiply", backgroundImage: GRAIN, pointerEvents: "none" }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ display: "grid", placeItems: "center", width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${INK}`, background: tint }}>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={ICONS[icon]} /></svg>
          </span>
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase" }}>{label}</span>
        </div>
        <div style={{ position: "relative", marginTop: 8 }}>{children}</div>
        <p style={{ position: "relative", margin: "8px 0 0", display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 99, background: "#2f7a50", color: "#fbf6e6", padding: "1px 8px", fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>✓ {done}</p>
      </div>
    </div>
  );
}

/** "Posted to social": a little post with its picture, caption and hearts (the hero's PostArt). */
export function PostCardArt({ caption }: { caption: string }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <div style={{ position: "relative", width: 42, height: 42, flex: "none", borderRadius: 6, border: `1.5px solid ${INK}`, overflow: "hidden", background: "linear-gradient(135deg, #f5a46a, #fbf6e6)" }}>
        <span style={{ position: "absolute", top: 3, right: 5, fontSize: 10 }}>✦</span>
        <span style={{ position: "absolute", bottom: 2, left: 4, fontSize: 15 }}>🌮</span>
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 12, lineHeight: 1.25, fontWeight: 600 }}>&ldquo;{caption}&rdquo;</p>
        <p style={{ margin: "4px 0 0", fontSize: 10.5, fontWeight: 700, color: "#5d564b", display: "flex", gap: 6 }}><span style={{ color: "#d6463f" }}>♥ 24</span><span>💬 4</span></p>
      </div>
    </div>
  );
}

/** "Order in": the hero's price-tag picture, the item, a price stamp, and the pickup time. */
export function OrderCardArt({ item, price, pickup }: { item: string; price: string; pickup: string }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <svg viewBox="0 0 40 26" width="38" height="25" aria-hidden="true" style={{ flex: "none" }}>
          <path d="M3 22 Q4 6 20 5 Q36 6 37 22 Z" fill="#e8b25a" stroke={INK} strokeWidth={1.6} />
          <path d="M7 21 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3 l3 -3" fill="none" stroke={INK} strokeWidth={1.2} />
        </svg>
        <p style={{ margin: 0, flex: 1, minWidth: 0, fontSize: 12, lineHeight: 1.25, fontWeight: 600 }}>{item}</p>
        <span style={{ transform: "rotate(-6deg)", border: `1.5px solid ${INK}`, borderRadius: 4, padding: "1px 6px", fontSize: 12, fontWeight: 800, background: "#f5a46a" }}>{price}</span>
      </div>
      <p style={{ margin: "5px 0 0", fontSize: 11, color: "#5d564b" }}>{pickup}</p>
    </div>
  );
}
