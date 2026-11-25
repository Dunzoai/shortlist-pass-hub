import localFont from "next/font/local";

// Display face from the Shortlist Consumer design system. Self-hosted since 2026-11-25 (src/fonts/: the exact latin files Google served,
// with Google's fallback metrics in src/fonts/fallbacks.css) so a build never downloads fonts. Defined once here:
// declaring the same Google font in two files breaks the Turbopack build.
/* the const name is the font-family name (next/font/local names the face after it): "Fraunces", as Google named it */
const Fraunces = localFont({ src: [{ path: "../fonts/fraunces/fraunces-italic-1.woff2", weight: "400", style: "italic" }, { path: "../fonts/fraunces/fraunces-italic-1.woff2", weight: "500", style: "italic" }, { path: "../fonts/fraunces/fraunces-italic-1.woff2", weight: "600", style: "italic" }, { path: "../fonts/fraunces/fraunces-italic-1.woff2", weight: "700", style: "italic" }, { path: "../fonts/fraunces/fraunces-normal-2.woff2", weight: "400", style: "normal" }, { path: "../fonts/fraunces/fraunces-normal-2.woff2", weight: "500", style: "normal" }, { path: "../fonts/fraunces/fraunces-normal-2.woff2", weight: "600", style: "normal" }, { path: "../fonts/fraunces/fraunces-normal-2.woff2", weight: "700", style: "normal" }], variable: "--font-fraunces", display: "swap", adjustFontFallback: false, fallback: ["Fraunces Fallback"] });
export const fraunces = Fraunces;
