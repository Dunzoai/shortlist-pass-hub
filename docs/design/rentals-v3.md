# /rentals v3

Source of truth: the two design files (`rentals-desktop-v3.html`, 1440 wide, and `rentals-phone-v3.html`, 390 wide). Copy is word for word. One responsive page: the desktop markup, plus a phone-width block (max-width 700px) taken from the phone file.

## Section order
header, hero, "Meet Shorty" heading, Answers trained by you (animated notes + phone chat), Best of the area, Keeps in touch (lock screen), The stay they talk about (hand-drawn house, floating hearts), New guests too (dark AI band), Getting them in (hand-drawn text, email, link, QR), Runs your socials, Book direct, Price, closing line, footer (dark).

## Reused, changed, added
- Reused: `src/components/rentals/tokens.ts` (`SIGNUP_HREF`), `src/lib/fonts-rentals.ts`, `src/app/rentals/layout.tsx` (ivory, hides the site nav and chat widget).
- Changed: `tokens.ts` (added `DEMO_HREF`), `fonts-rentals.ts` (Instrument Serif now loads its italic, not faked), `src/app/rentals/page.tsx` (renders the new component).
- Added: `src/components/rentals/RentalsV3.tsx` (the whole page; inline SVG drawings and the two filters `rough` and `grain` defined once at the top; animation keyframes copied from the design; both stop under `prefers-reduced-motion`).
- Not touched: shared header and footer, global CSS, other routes.

## Left in place, no longer used by /rentals
`RentalsPreview.tsx`, `screens.tsx`, `FridgeCard.tsx`, `MovieSlot.tsx`, `qr.ts`, `ui.tsx` (the dev route `/dev/rentals-preview` still renders the old preview). Earlier additive props on shared components (`SiteHeader` `plain`, `ANotSection` `rows`, `NothingReplaces` `lines`, `PipesSection` rentals mode) are also unused now.

## What changed from the design file
- Photo placeholders: no photo in the repo fits, so the colored blocks stay and the bracket text is gone. They are hidden from screen readers (they are not photos).
- Price list: the "[CONFIRM: social posting...]" line is dropped. Four items ship.
- "Get started" = `SIGNUP_HREF`. "Try the demo house" = `DEMO_HREF` = `#shorty` (there was no demo-house link before; it scrolls to the on-page Shorty demo). Swap in `tokens.ts` when a real demo exists.

## Name check (web search, Myrtle Beach area)
- "Harborside Grill": no Myrtle Beach business found (hits were Atlantic Highlands NJ, Ocean City MD, Hilton Head's "Harbourside"). Kept.
- "Low Tide Tacos": no real Myrtle Beach business found. It is also the site's own demo taco truck (home page and /foodtrucks). Kept.
- "The aquarium" is generic. Jenna, 843-555-0142, sarah.k, thebeachhouse are made up.

## [CONFIRM BUILT] before we send traffic
- Shorty answers comments and DMs on Instagram and Facebook
- Shorty posts to socials for rentals
- Shorty gives guests the host's contact and pings the host
- Push notifications to guests
- Texts and emails to past guests
- Local perks
- Found in ChatGPT, plus "Ask about dates"
- Request dates, host confirms, guest pays through the host's own Stripe or Square
- The playable demo house
