# Fonts are self-hosted (no build-time download)

Since 2026-11-25 every font on shortlistpass.com comes from `src/fonts/` through `next/font/local`. Nothing imports `next/font/google`
any more. Before this, every build downloaded the fonts from Google, and a Vercel build of `3cf3d98` failed when that download failed.

**What's there**
- `src/fonts/<family>/*.woff2` (13 files, 504 KB): the exact latin files Google served for the same requests. All the families are
  SIL OFL 1.1, which allows self-hosting: Sora, Libre Baskerville, Cormorant Garamond, Inter, Fraunces, Instrument Serif,
  Schibsted Grotesk, Caveat and UnifrakturCook. For a variable font, Google answers every requested weight of a style with the same file;
  it is stored once and listed once per weight, as Google declared it.
- `src/fonts/manifest.json`: each family's Google request, and each face's file, weight, style and original URL.
- `src/fonts/fallbacks.css`: the fallback faces (`"<Family> Fallback"`, Times New Roman or Arial resized with Google's own metrics from
  `next/dist/server/font-utils`). It is imported by `src/app/layout.tsx`, and every loader names it with `adjustFontFallback: false`.
  next/font/local's own computed metrics differ by up to about 10% (Fraunces, Cormorant), which would change text shown before the
  font loads and any glyph the font lacks.
- `scripts/fonts/fetch-google-fonts.mjs` re-downloads them with next/font's own URL builder. Run it only to change a font.

**The loaders** (same CSS variables, `display: swap`, and `preload` as before):
- `src/lib/fonts.ts`: Fraunces.
- `src/lib/fonts-rentals.ts`: Instrument Serif and Schibsted Grotesk, preload off.
- `src/app/layout.tsx`: Sora, Libre Baskerville, Cormorant Garamond and Inter.
- `src/app/smartassistant/hoa/page.tsx`: Caveat.
- `src/components/new-home/Newsprint.tsx`: UnifrakturCook.

**Traps (all measured on a real Turbopack production build)**
- **next/font/local names the face after the JS const it's assigned to.** A `font-family` in `declarations` renames the @font-face but
  NOT the class or the CSS variable. That breaks the font silently (the class points at a name no face has), so don't use it. The
  single-word families are therefore named exactly as Google named them (`const Inter`, `Sora`, `Fraunces`, `Caveat`, `UnifrakturCook`).
  That matters because pages write `"Inter, system-ui"` by name: `ShortyScenes`, `/smartassistant/business` and
  `/smartassistant/hoa/pitch`. The four multi-word families get their identifier as their face name (`instrumentSerif`, `schibsted`,
  `cormorantGaramond`, `libreBaskerville`). Nothing on a live page names those literally (`'Schibsted Grotesk'` appears only in the dev
  reel, which is a 404 in production).
- **next/font/local's class doesn't carry a weight or style.** Google's did (UnifrakturCook `font-weight: 700`), so the Newsprint
  masthead adds `font-bold`.
- **Only the latin subset is kept.** next/font/local can't set a `unicode-range` per file. The site's only character outside Google's
  latin range that one of these fonts actually had is `№` on /localist (from a Cyrillic subset), and /localist measured pixel-identical.
- **Local `next build` needs a real `node_modules`.** `~/hub-main/node_modules` is a symlink, which Turbopack refuses. Build in a
  worktree with a copied `node_modules` (or use `next dev --webpack` to look).

**How it was checked**
- The old code built behind a proxy that refuses fonts.googleapis.com and fonts.gstatic.com fails (9 requests blocked). The new code
  builds behind the same proxy with 0 requests to Google.
- Full-page shots and a layout signature (every text element's box and computed weight and style) of /brands, /rentals, the home page
  and /localist at 1440: before (production) vs after, 0 pixels differ and 0 text elements moved.
