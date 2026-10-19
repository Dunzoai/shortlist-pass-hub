import type { CSSProperties, ReactNode } from "react";
import { R, SERIF, SANS } from "./tokens";

/** Page-wide rules: pill-button hover lift, mint focus ring on keyboard focus only, reduced motion. */
export const PAGE_CSS = `
.rp *, .rp *::before, .rp *::after { box-sizing: border-box }
.rp { font-family: ${SANS}; color: ${R.ink}; background: ${R.ivory}; -webkit-font-smoothing: antialiased }
.rp .rp-hd { margin: 0; font-family: ${SERIF}; font-weight: 400; letter-spacing: -0.01em; text-wrap: balance }
.rp p { margin: 0; text-wrap: pretty }
.rp-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 14px 24px; border-radius: 999px; font-family: ${SANS}; font-size: 16px; font-weight: 700; text-decoration: none; border: 0; cursor: pointer; transition: transform .2s cubic-bezier(.2,.7,.2,1); text-align: center }
.rp-btn:hover { transform: translateY(-2px) }
.rp-btn:focus-visible, .rp a:focus-visible { outline: 3px solid ${R.mint}; outline-offset: 3px }
.rp-ink { background: ${R.ink}; color: ${R.cream} }
.rp-mint { background: ${R.mint}; color: ${R.onMint} }
.rp-quiet { background: ${R.cream}; color: ${R.ink}; box-shadow: inset 0 0 0 1px ${R.line} }
.rp-sec { padding: 64px 20px }
@media (min-width: 900px) { .rp-sec { padding: 96px 48px } }
.rp-wrap { max-width: 1280px; margin: 0 auto }
.rp-h2 { font-size: 36px; line-height: .98 }
@media (min-width: 900px) { .rp-h2 { font-size: 54px } }
.rp-lead { font-size: 17px; line-height: 1.55; color: ${R.grey}; max-width: 640px }
@media (min-width: 900px) { .rp-lead { font-size: 19px } }
.rp-split { display: grid; gap: 40px; align-items: center }
@media (min-width: 900px) { .rp-split { grid-template-columns: 1fr 1fr; gap: 72px } }
.rp-grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr)) }
@media (prefers-reduced-motion: reduce) { .rp-btn { transition: none } .rp-btn:hover { transform: none } }
`;

export const Eyebrow = ({ children, color = R.green }: { children: ReactNode; color?: string }) => (
  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color }}>{children}</div>
);

export function Btn({ kind, href, children, style }: { kind: "ink" | "mint" | "quiet"; href: string; children: ReactNode; style?: CSSProperties }) {
  return <a href={href} className={`rp-btn rp-${kind}`} style={style}>{children}</a>;
}

/** White card, hairline, soft shadow. 24px padding on phone, 32px on desktop (set by the caller's class when it matters). */
export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ background: R.card, border: `1px solid ${R.line}`, borderRadius: R.radius, boxShadow: R.shadow, padding: 28, ...style }}>{children}</div>;
}

/** 38px mint-tint square with a 20px ink stroke icon (1.75px, round caps). One per card. */
export function IconSquare({ children }: { children: ReactNode }) {
  return (
    <span style={{ flex: "0 0 auto", width: 38, height: 38, borderRadius: 11, background: R.tint, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <svg aria-hidden="true" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={R.ink} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
    </span>
  );
}

/** A visible placeholder: stays on the page until the real thing exists. */
export const Placeholder = ({ children, onDark }: { children: ReactNode; onDark?: boolean }) => (
  <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 999, border: `1.5px dashed ${onDark ? R.amber : R.ink}`, background: onDark ? "transparent" : R.cream, color: onDark ? R.amber : R.ink, fontSize: 12, fontWeight: 800, letterSpacing: ".06em", whiteSpace: "nowrap" }}>{children}</span>
);

export const DemoChip = ({ children = "Demo" }: { children?: ReactNode }) => (
  <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 999, background: R.ink, color: R.cream, fontSize: 11, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase" }}>{children}</span>
);
