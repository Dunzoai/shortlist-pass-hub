"use client";
import Image from "next/image";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import { R, SERIF, SANS } from "./tokens";
import { QR_N, QR_PATH } from "./qr";

/**
 * The thing a host actually puts in the house: a card on the fridge, held by a magnet. Drawn with the character look
 * (heavy ink outline, slightly tilted); the QR is a real, scannable code (it opens shortlistpass.com: it is a demo card).
 * Shorty is the existing ShortyMascot, not a redraw.
 */
export function FridgeCard() {
  return (
    <div role="img" aria-label="Demo fridge card: a card held to a fridge door by a magnet, with a QR code, 'Ask Shorty', and the words no app, no login." style={{ position: "relative", width: 320, flex: "0 0 auto", margin: "26px 22px 40px" }}>
      {/* the fridge door: a plain panel with the handle edge, no brand, no detail */}
      <div aria-hidden="true" style={{ position: "absolute", inset: "-26px -22px -26px -22px", background: R.line2, border: `1px solid ${R.line}`, borderRadius: 26 }}>
        <div style={{ position: "absolute", right: 14, top: "18%", bottom: "18%", width: 10, borderRadius: 999, background: R.slate2 }} />
      </div>
      <div style={{ position: "relative", transform: "rotate(-2.2deg)", background: "#fff", border: `3px solid ${R.ink}`, borderRadius: 16, boxShadow: "0 22px 34px -22px rgba(26,28,32,.55)", padding: "34px 22px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        {/* the magnet */}
        <span aria-hidden="true" style={{ position: "absolute", top: -17, left: "50%", marginLeft: -22, width: 44, height: 44, borderRadius: 999, background: R.mint, border: `3px solid ${R.ink}`, boxShadow: "0 5px 8px -4px rgba(26,28,32,.6)" }}>
          <span style={{ position: "absolute", top: 6, left: 9, width: 12, height: 7, borderRadius: 999, background: "#fff", opacity: .85, transform: "rotate(-30deg)" }} />
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8, alignSelf: "stretch", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: 34, lineHeight: .95, letterSpacing: "-0.01em" }}>Ask Shorty.</div>
            <div style={{ fontFamily: SANS, fontSize: 13, color: R.grey, marginTop: 4 }}>Anything about the house.</div>
          </div>
          <div style={{ width: 70, height: 80, position: "relative", flex: "0 0 auto" }}>
            <div style={{ position: "absolute", left: -20, top: -23, width: 110, pointerEvents: "none" }}><ShortyMascot mood="hello" size={80} still style={{ width: "100%", height: "auto" }} /></div>
          </div>
        </div>
        <div style={{ padding: 10, border: `3px solid ${R.ink}`, borderRadius: 12, background: "#fff" }}>
          <svg aria-hidden="true" viewBox={`-1 -1 ${QR_N + 2} ${QR_N + 2}`} width={176} height={176} shapeRendering="crispEdges" style={{ display: "block" }}><rect x={-1} y={-1} width={QR_N + 2} height={QR_N + 2} fill="#fff" /><path d={QR_PATH} fill={R.ink} /></svg>
        </div>
        <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 700, textAlign: "center" }}>Point your camera here</div>
        <div style={{ fontFamily: SANS, fontSize: 13, color: R.grey, textAlign: "center", lineHeight: 1.4 }}>Wi-Fi, door code, checkout, parking, where to eat.<br /><strong style={{ color: R.ink }}>No app. No login.</strong></div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 2 }}>
          <Image src="/shortlist-mint-mark.png" alt="" width={18} height={18} />
          <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: R.greyText }}>Powered by The Shortlist</span>
        </div>
      </div>
    </div>
  );
}
