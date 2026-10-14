"use client";

/**
 * "A few things I'm not." (design: docs/design/foodtrucks/design/AFewThingsImNot.dc.html; the closing line moved to its own section, NothingReplaces.tsx). A full-width ink band: four tappable
 * rows, each a grey claim; tap one and two rough red marker strokes draw across it, the correction stamps in underneath in mint,
 * the explanation fades in, and the label flips to "Here's what I am". Rows open and close independently. Copy is verbatim from the
 * design. Strike and stamp animations are skipped under prefers-reduced-motion (the struck line and correction just appear).
 */
import { useState } from "react";
import { SERIF } from "./tokens";

const ROWS = [
  {
    claim: "Another food truck finder.",
    fix: "That's a list. I'm a coworker.",
    why: "A finder page sits there and waits for somebody to look. I go get them: outreach, bringing back the ones who haven't come by in a while, your social posts. Finder pages wait for action. I bring the action.",
  },
  {
    claim: "A reason to switch registers.",
    fix: "Keep what you use. I work alongside it.",
    why: "Your register checks out the people already standing in front of you. I bring in the ones who just found you, and turn them into regulars. Nothing to rip out, nothing to learn.",
  },
  {
    claim: "A middleman taking a cut.",
    fix: "Your money never touches our hands.",
    why: "We partner with the industry leaders, Stripe and Square. We pass them the cart, they handle your money and deposit it in your bank. No commission, ever.",
  },
  {
    claim: "Another flyer you'll forget to post.",
    fix: "I never forget, and I never skip a day.",
    why: "Keep making the flyers you like. I put them out consistently: every date, every menu item you need in front of customers, without you lifting a finger.",
  },
];

const CSS = `
.fn { background:#14161A; color:#F6F1E4; position:relative; overflow:hidden; padding:64px 56px 72px; --h2:64px; --sub:15px; --gap:38px; --rowgap:30px; --claim:38px; --fix:32px; --why:16px }
@media (max-width: 720px) { .fn { padding:44px 20px 52px; --h2:42px; --sub:14px; --gap:28px; --rowgap:26px; --claim:27px; --fix:23px; --why:15px } }
.fn *, .fn *::before, .fn *::after { box-sizing:border-box }
.fn-grid { position:absolute; inset:0; background-image:repeating-linear-gradient(0deg, rgba(246,241,228,.035) 0 1px, transparent 1px 34px); pointer-events:none }
.fn-serif { font-family:${SERIF}; font-weight:400; letter-spacing:-0.015em }
.fn-row { display:block; width:100%; text-align:left; background:transparent; border:0; padding:0; margin:0; font-family:inherit; color:inherit; cursor:pointer }
.fn-row:focus-visible { outline:3px solid #34D399; outline-offset:6px; border-radius:4px }
.fn-claim { color:#6F6B60; transition:color .3s ease; -webkit-box-decoration-break:clone; box-decoration-break:clone; background-repeat:no-repeat; background-position:0 60%, 0 52%; background-size:0 .5em, 0 .5em;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 20' preserveAspectRatio='none'%3E%3Cpath d='M1 15 C22 9 44 16 66 10 S92 6 99 9' stroke='%23E2574C' stroke-width='5' stroke-linecap='round' fill='none' vector-effect='non-scaling-stroke'/%3E%3C/svg%3E"), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 20' preserveAspectRatio='none'%3E%3Cpath d='M2 11 C26 16 48 7 70 13 S94 14 98 12' stroke='%23E2574C' stroke-width='5' stroke-linecap='round' fill='none' vector-effect='non-scaling-stroke'/%3E%3C/svg%3E") }
.fn-row:hover .fn-claim { color:#8D8A80 }
.fn-open .fn-claim { color:#4A4740; background-size:100% .5em, 100% .5em; animation:fnStrike .55s cubic-bezier(.3,.7,.3,1) }
.fn-fix { display:block; opacity:0; transform:translateY(10px) rotate(-1.4deg) scale(.96); transform-origin:0 50%; color:#34D399; height:0; overflow:hidden }
.fn-open .fn-fix { height:auto; overflow:visible; animation:fnStamp .45s cubic-bezier(.2,1.5,.4,1) .28s forwards }
.fn-why { display:block; opacity:0; height:0; overflow:hidden; color:#8D8A80; transition:opacity .3s ease }
.fn-open .fn-why { height:auto; overflow:visible; opacity:1; transition-delay:.55s }
.fn-tag { display:flex; align-items:center; gap:8px; font-size:11px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:#4A4740; transition:color .3s; margin-bottom:12px }
.fn-open .fn-tag { color:#E2574C }
.fn-dot { width:7px; height:7px; border-radius:999px; background:#3A3F49; transition:background .3s }
.fn-open .fn-dot { background:#E2574C }
@keyframes fnStrike { 0% { background-size:0 .5em, 0 .5em } 70% { background-size:100% .5em, 40% .5em } 100% { background-size:100% .5em, 100% .5em } }
@keyframes fnStamp { to { opacity:1; transform:translateY(0) rotate(-1.4deg) scale(1) } }
@media (prefers-reduced-motion: reduce) {
  .fn-open .fn-claim { animation:none }
  .fn-open .fn-fix { animation:none; opacity:1; transform:rotate(-1.4deg) }
  .fn-claim, .fn-why, .fn-tag, .fn-dot { transition:none }
}
`;

export default function ANotSection() {
  const [open, setOpen] = useState<Record<number, boolean>>({});
  return (
    <section aria-labelledby="fn-h" className="fn">
      <style>{CSS}</style>
      <div className="fn-grid" aria-hidden="true" />
      <div style={{ position: "relative", maxWidth: 1060, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase", color: "#34D399" }}>Straight from Shorty</div>
            <h2 id="fn-h" className="fn-serif" style={{ margin: "12px 0 0", fontSize: "var(--h2)", lineHeight: 0.9, textWrap: "balance" }}>A few things<br />I&rsquo;m not.</h2>
          </div>
          <div style={{ fontSize: "var(--sub)", color: "#6F6B60", paddingBottom: 10 }}>Tap one.</div>
        </div>

        <div style={{ marginTop: "var(--gap)", display: "flex", flexDirection: "column", gap: "var(--rowgap)" }}>
          {ROWS.map((r, i) => {
            const on = !!open[i];
            return (
              <button key={r.claim} type="button" className={`fn-row${on ? " fn-open" : ""}`} aria-expanded={on} onClick={() => setOpen((o) => ({ ...o, [i]: !o[i] }))}>
                <span className="fn-tag"><span className="fn-dot" />{on ? "Here's what I am" : "I'm not"}</span>
                <span className="fn-serif" style={{ display: "block", fontSize: "var(--claim)", lineHeight: 1.12 }}>
                  <span className="fn-claim">{r.claim}</span>
                </span>
                <span className="fn-serif fn-fix" style={{ fontSize: "var(--fix)", lineHeight: 1.04, marginTop: 14 }}>{r.fix}</span>
                <span className="fn-why" style={{ fontSize: "var(--why)", lineHeight: 1.55, marginTop: 14, maxWidth: 640 }}>{r.why}</span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
