# /foodtrucks (food truck owners page)

`shortlistpass.com/foodtrucks`: a sell-and-educate page for food truck owners. Reference designs: `docs/design/foodtrucks/`.

**Page order:** header, hero, feature sections, "trucks out tonight" card (live count from the app's trucks-tonight endpoint, re-fetched every 60 s), final CTA.

**Where things are**
- `src/app/foodtrucks/` the page and its layout (hides the site-wide agency bar here only).
- `src/components/foodtrucks/` `Hero.tsx`, `Sections.tsx`, `TrucksTonight.tsx`, `FoodTrucksHeader.tsx`, `api.ts` (tonight's trucks), `config.ts`, `tokens.ts`.
- **Hero:** the homepage hero stage itself (`ShortyStage` in `src/components/new-home/ShortyHero.tsx`), playing only the Low Tide Tacos scene (`FOODTRUCK_EXCHANGES`). Stage on top on a phone, beside the copy on desktop.

**Removed (Oct 2026):** the playable "Shorty's lot" (drag/flick game, phone iframe, chips, sound, voice lines, the copied motion layer in `shorty/live`) was taken out at Marc's request. It is in git history (commits before "Food trucks: remove the playable lot").

**Demo truck still in the database:** "Low Tide Tacos" (`scripts/seed-low-tide-tacos.mjs`, `demo-truck.json`, pictures in `public/foodtrucks/demo-menu/`). The page no longer uses it; the seed script is kept in case it is wanted again.
