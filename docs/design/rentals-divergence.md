# /rentals preview: where it differs from the home page

Live at `/rentals` (`src/app/rentals/`). `/dev/rentals-preview` still exists and 404s in production. This is the list of things the migration has to settle later.

## Type and color
| | Home page (`/new`, `/`) | /rentals preview (design doc target) |
|---|---|---|
| Display font | Fraunces (`--font-fraunces`) | Instrument Serif (`--font-instrument`) |
| Body font | Inter (`--font-sans-inter`), Sora for the pipes headline | Schibsted Grotesk (`--font-schibsted`) |
| Page background | `#f5eddc` (forced in the old `/new` layout) | Ivory `#FBF8F0` |
| Fonts load from | `src/app/layout.tsx` and `src/lib/fonts.ts` (Fraunces) | `src/lib/fonts-rentals.ts` (only /rentals loads them) |

How the borrowed components got the new type without being rewritten: `src/app/dev/rentals-preview/layout.tsx` points `--font-fraunces`, `--font-sora` and `--font-sans-inter` at the target pair for this route only. The wall (`ANotSection`, `NothingReplaces`) and the pipes scene therefore render in Instrument Serif and Schibsted here, and in Fraunces and Sora everywhere else. A real migration should rename those variables in the components, not alias them.

## Components
- **Header.** `SiteHeader` got a `plain` prop: logo, Sign in, one button, no audience toggle, no page menu. Default behavior is unchanged. Its wordmark uses Instrument Serif in the plain variant.
- **Buttons and cards.** `/new` has no shared ones. `src/components/rentals/ui.tsx` builds them to the design doc: pill buttons (48px, primary ink, mint, quiet), white cards with a hairline and the soft shadow, 38px icon squares. The home page's buttons are inline Tailwind per section and differ (for example the pricing buttons use a 3px ink border and a different radius).
- **Correction wall.** `ANotSection` and `NothingReplaces` (from `/foodtrucks`) now take optional props (`rows`, `lines`). With no props they render exactly as before. The wall's own CSS is untouched: it still has the faint grid lines on the ink band, and `NothingReplaces` still uses its two soft radial washes on the mint. Both are older than the design doc's no-gradient rule. Left alone on purpose.
- **Pipes.** `PipesSection` got a `"rentals"` mode (data, a paragraph, and one layout change). In that mode the headline sits on the mint instead of in its own black strip, so the page has two dark bands (the wall, "Trained by you") and never two in a row, as the design doc requires. The home page and `/foodtrucks` are unchanged. The pipes scene still draws the cut-paper "screenprint" bubbles and the "AI agents" card with its existing logos and the "LIVE NOW" tag on one of them.
- **Phones.** `src/components/rentals/screens.tsx` draws three screens from `app/smartpage/v2/house/HouseApp.tsx` in the app repo (home, Ask Shorty sheet, Need something?) with that file's tokens, structure and default words. They are static copies, not the real component. They need re-syncing if HouseApp changes.

## Copy notes
- Urgent requests send a second text marked URGENT. They do not call. The app's own string in `HouseApp.tsx` (`requestUrgentSub`, "{host} also gets a call") says otherwise, so the phone mockup on /rentals deliberately does not copy it. Fix it in the app.
- Page order: hero, movie slot, everything they'd ask, a better stay, peace of mind, local perks, they found you somewhere else, bring them back, found in ChatGPT, a few things I'm not, trained by you, price, closing line.

## Not yet decided
- **Sign-up link.** Every button reads `SIGNUP_HREF` in `src/components/rentals/tokens.ts`. Today it opens an email to connect@shortlistpass.com (the sales address in the home-page footer) labelled "Shortlist Stay (rentals) lead". The app's `/freeshorty` form only knows park, truck and event, so it can't take a rental yet. When the real sign-up exists, change that one constant.
- **The movie.** The slot still shows `[MOVIE PLACEHOLDER]` and a play button that does nothing. Swap `MovieSlot.tsx` when the film exists.
- No footer. The home page's `SiteFooter` is not in the brief.
- The app builds behind the page copy (guests requesting dates, the payment link, the public AI-findable listing, "Ask about dates") are described as built. Check each is live before sending traffic.
