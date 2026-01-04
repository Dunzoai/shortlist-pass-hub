"use client";

import { useEffect } from "react";

export function SmartPagesEmbed() {
  // Listen for iframe resize messages from SmartPages
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      // Security: only accept messages from *.shortlistpass.com domains
      try {
        const origin = new URL(e.origin);
        if (!origin.hostname.endsWith("shortlistpass.com")) return;
      } catch {
        return;
      }

      // Only handle resize messages
      if (e.data?.type !== "slp_embed_resize") return;

      // Validate height is a number
      if (typeof e.data.height !== "number") return;

      // Find the iframe
      const iframe = document.getElementById("slp-embed") as HTMLIFrameElement;
      if (!iframe) return;

      // Verify the message came from this specific iframe
      if (e.source !== iframe.contentWindow) return;

      // Apply height without clamping
      iframe.style.height = `${e.data.height}px`;
      iframe.style.transition = "height 200ms ease";

      // Debug log
      console.log("SLP resize applied", e.data.height);
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Send page context to SmartPages embed
  useEffect(() => {
    function sendContext() {
      const iframe = document.getElementById("slp-embed") as HTMLIFrameElement;
      if (!iframe) return;

      iframe.contentWindow?.postMessage(
        {
          type: "slp_context",
          payload: {
            url: window.location.href,
            path: window.location.pathname,
            title: document.title,
          },
        },
        "https://hello.shortlistpass.com"
      );
    }

    sendContext();
  }, []);

  return (
    <iframe
      id="slp-embed"
      src="https://hello.shortlistpass.com/embed"
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(480px, 92vw)",
        height: "88px",
        border: 0,
        background: "transparent",
        zIndex: 999999,
        pointerEvents: "auto",
        transition: "height 200ms ease",
      }}
    />
  );
}
