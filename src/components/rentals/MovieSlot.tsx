"use client";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import { R } from "./tokens";
import { Placeholder } from "./ui";

const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/**
 * THE MOVIE: a slot only. A 16:9 poster frame in the screenprint finish (heavy ink outline, halftone dots in the fills, paper grain), a play button,
 * a caption bar in the house style, and a visible [MOVIE PLACEHOLDER] label. No film is built or scripted; the caption text is a sample of the style.
 */
export function MovieSlot() {
  const ink = { stroke: R.ink, strokeWidth: 5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <div style={{ position: "relative", aspectRatio: "16 / 9", width: "100%", borderRadius: 18, overflow: "hidden", background: "#F2EAD3", border: `3px solid ${R.ink}`, boxShadow: R.shadow }}>
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <pattern id="mv-dots" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="7" cy="7" r="2.6" fill={R.ink} fillOpacity=".55" /></pattern>
        </defs>
        {/* ground */}
        <path d="M0 700 C300 680 600 720 900 700 S1400 690 1600 706 V900 H0Z" fill={R.mint} {...ink} />
        <path d="M0 700 C300 680 600 720 900 700 S1400 690 1600 706 V900 H0Z" fill="url(#mv-dots)" />
        {/* the house: a beach house on stilts-ish posts */}
        <g transform="translate(100 190)">
          <path d="M60 330 L60 520 M300 330 L300 520 M540 330 L540 520" {...ink} fill="none" />
          <rect x="20" y="170" width="560" height="190" fill="#FBF8F0" {...ink} />
          <path d="M-20 175 L300 -10 L620 175 Z" fill={R.mint} {...ink} />
          <path d="M-20 175 L300 -10 L620 175 Z" fill="url(#mv-dots)" />
          <rect x="70" y="220" width="110" height="90" fill={R.tint} {...ink} />
          <rect x="420" y="220" width="110" height="90" fill={R.tint} {...ink} />
          <rect x="250" y="210" width="100" height="150" rx="6" fill={R.amber} {...ink} />
          <circle cx="332" cy="292" r="7" fill={R.ink} />
          <path d="M-20 360 H620" {...ink} />
        </g>
        {/* a fridge-card on the porch rail: where the story starts */}
        <g transform="translate(1010 560) rotate(-5)"><rect width="120" height="160" rx="10" fill="#fff" {...ink} /><rect x="22" y="38" width="76" height="76" fill="none" stroke={R.ink} strokeWidth="5" /><path d="M32 48h20v20H32zM68 48h20v20H68zM32 84h20v20H32z" fill={R.ink} /></g>
      </svg>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `url("${GRAIN}")`, opacity: .16, mixBlendMode: "multiply", pointerEvents: "none" }} />
      <div aria-hidden="true" style={{ position: "absolute", right: "6%", bottom: "13%", width: "26%", maxWidth: 360 }}><ShortyMascot mood="hello" size={190} still style={{ width: "100%", height: "auto" }} /></div>
      <div style={{ position: "absolute", left: 14, top: 14 }}><Placeholder>[MOVIE PLACEHOLDER]</Placeholder></div>
      <button type="button" aria-label="Play the movie (placeholder, nothing plays yet)" style={{ position: "absolute", left: "50%", top: "46%", transform: "translate(-50%,-50%)", width: 88, height: 88, borderRadius: 999, background: R.mint, border: `4px solid ${R.ink}`, cursor: "default", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
        <svg aria-hidden="true" width="34" height="34" viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z" fill={R.ink} stroke={R.ink} strokeWidth="2" strokeLinejoin="round" /></svg>
      </button>
      <div style={{ position: "absolute", left: "50%", bottom: 16, transform: "translateX(-50%)", maxWidth: "88%", padding: "9px 18px", borderRadius: 12, background: "rgba(20,22,26,.9)", color: R.cream, fontSize: 18, fontWeight: 700, whiteSpace: "nowrap" }}>
        Scan the card. Ask <span style={{ color: R.mint }}>Shorty.</span>
      </div>
    </div>
  );
}
