"use client";
import { ShortyMascot } from "@/components/shorty/ShortyMascot";
import { EmailScreen, InstallOverlay, PhoneShell, TextScreen, type TextMsg } from "./explainers";
import type { Geo } from "./lot-geo";
import { C, SANS } from "./tokens";

export type Overlay = "none" | "text" | "email" | "install";
const PAGE_W = 390;     // the page is laid out at a normal phone width and scaled down to fit the frame

/** The big phone: the demo truck's real page in an iframe, so a visitor can tap through it. The X, the scrim behind it, and the
    "Put the phone down" chip all close it. Text, email and the install walkthrough play on top of the page like another app. */
export function PhoneFrame({ g, src, frameKey, overlay, texts, textNote, emailTo, emailPreview, inst, shortyInside, onClose, onBackToPage, onLetOut }: {
  g: Geo; src: string; frameKey: number; overlay: Overlay; texts: TextMsg[]; textNote: string; emailTo: string; emailPreview: boolean; inst: 0 | 1 | 2;
  shortyInside: boolean; onClose: () => void; onBackToPage: () => void; onLetOut: () => void;
}) {
  const ph = g.phoneBig;
  const innerW = ph.w - 18, innerH = ph.h - 18;
  const scale = innerW / PAGE_W;
  return (
    <div style={{ position: "absolute", left: ph.x, top: ph.top, zIndex: 4 }}>
      <PhoneShell width={ph.w} height={ph.h} header={false}>
        <div style={{ position: "relative", flexGrow: 1, background: C.cream, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: C.muted, fontFamily: SANS }}>Opening the page…</div>
          <iframe
            key={frameKey} src={src} title="Low Tide Tacos, the demo truck's page"
            style={{ position: "absolute", left: 0, top: 0, width: PAGE_W, height: innerH / scale, border: 0, background: "transparent", transform: `scale(${scale})`, transformOrigin: "0 0" }}
          />
          {overlay === "install" && (
            <>
              <InstallOverlay step={inst} />
              <button type="button" className="ftl-pb" onClick={onBackToPage} style={{ position: "absolute", right: 8, top: 52, zIndex: 2, minHeight: 32, padding: "0 12px", borderRadius: 99, border: "1px solid " + C.hair, background: "#fff", fontSize: 11, fontWeight: 700, fontFamily: SANS, cursor: "pointer" }}>Back to the page</button>
            </>
          )}
          {(overlay === "text" || overlay === "email") && (
            <div style={{ position: "absolute", inset: 0, background: "#fff", display: "flex", flexDirection: "column" }}>
              {overlay === "text" && <TextScreen texts={texts} note={textNote} />}
              {overlay === "email" && <EmailScreen to={emailTo} preview={emailPreview} onBack={onBackToPage} />}
              {overlay === "text" && (
                <button type="button" className="ftl-pb" onClick={onBackToPage} style={{ margin: "0 12px 12px", minHeight: 40, borderRadius: 99, border: "1px solid " + C.hair, background: "#fff", fontSize: 12, fontWeight: 700, fontFamily: SANS, cursor: "pointer" }}>Back to the page</button>
              )}
            </div>
          )}
        </div>
      </PhoneShell>
      <button type="button" aria-label="Close the phone" onClick={onClose} style={{ position: "absolute", top: -12, right: -12, width: 36, height: 36, borderRadius: 99, border: "2px solid #fff", background: C.ink, color: "#fff", fontSize: 18, lineHeight: 1, cursor: "pointer", boxShadow: "0 6px 14px rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2 L12 12 M12 2 L2 12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" /></svg>
      </button>
      {shortyInside && (
        <button type="button" aria-label="Shorty is on this page. Tap to let him out." onClick={onLetOut} style={{ position: "absolute", left: -14, bottom: -14, width: 56, height: 56, borderRadius: 99, border: "2px solid #fff", background: C.mint, padding: 0, cursor: "pointer", overflow: "hidden", boxShadow: "0 6px 14px rgba(0,0,0,.4)" }}>
          <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-44%)", pointerEvents: "none" }}><ShortyMascot mood="hello" size={64} /></span>
        </button>
      )}
    </div>
  );
}
