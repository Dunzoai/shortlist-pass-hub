# /foodtrucks (food truck owners page)

**What it is:** `shortlistpass.com/foodtrucks`, a sell-and-educate page with a playable "Shorty's lot". Spec and reference designs: `docs/design/foodtrucks/` (`SPEC.md` and `design/*.dc.html`).

**Where things are**
- `src/app/foodtrucks/` the page (re-fetches tonight's trucks every 60 s) and its layout (hides the site-wide agency bar here only).
- `src/components/foodtrucks/` the page parts. `ShortysLot.tsx` is the stage; `explainers.tsx` holds the reusable phone screens and flows (preorder, texts, install, follow) with `FLOWS` + `runFlow()`, ready to reuse in dashboard tutorials and the unclaimed-page cartoon; `lines.ts` is everything Shorty says; `chips.ts` is the question chips; `api.ts` is every call to the app; `config.ts` has the URLs and the stub switches.
- `src/components/shorty/live/` Shorty's motion layer (see below).
- Screenshots from the test runs: `docs/features/foodtrucks-page-shots/`.

**The Shorty rig.** Shorty is the Locals character, not a drawing. The drawn figure is the app's rig already in this repo (`src/lib/shorty/mascot/`). What makes him alive (dangling legs when held, flick, bounce, "oof", standing on the roof, props in his real hand) is the Locals motion layer, copied once from the app repo (`loyalty-pwa`), branch `feature/locals-shortlist-v1`, commit `eeb8dd9`: `components/locals/live-shorty/motion.ts`, `effects.ts` and `components/locals/LiveShorty.tsx`. The copies carry a header note. Added on top (search "FOODTRUCKS"): scripted performances (point, phone, megaphone, eat, envelope, sit, oof), carry-only props, a pin for the serving window, and arrive/surface/placed events. Drag/flick/physics are unchanged. To pick up later app changes, diff against that commit.

**What is stubbed (nothing is faked)**
- **Texting:** `sendDemoText()` in `api.ts` sends nothing while `TEXTING_LIVE` is false (`config.ts`). The app has no public route for the four demo messages; its only public text route is the per-business "Reply YES" opt-in. The number never leaves the browser, and Shorty says it is a demo.
- **Email:** `sendPageEmail()` sends nothing while `EMAIL_LIVE` is false (no public email route exists). The phone shows an email preview marked "not sent".
- **Typed questions:** go to the app's public `POST /api/shorty/demo-chat`. That route's knowledge is written into the route, not read from the Binder yet. If it fails, Shorty says so.
- **Trucks tonight:** real, from `GET /api/agent/v1/trucks-tonight?city=myrtle-beach`. With no stops posted (or the app unreachable) the card and the roof line show no number.

**Change the chips.** Edit `src/components/foodtrucks/chips.ts`: reorder the arrays to re-rank; add a row (`kind: "answer"` with a `line`, or `kind: "action"` with an action name). Lines live in `lines.ts`.

## Round 2 (the phone, the scene, the sound)

**The scene.** The lot is the homepage hero's cut-paper taco-truck scene (`SCENES["Low Tide Tacos"]` in `src/components/new-home/ShortyScenes.tsx`, imported, not copied), continued with plain paper to the sides so any stage width works. `lot-geo.ts` places everything in the drawing's own units: the truck (tap target, serving window, roof platform), the A-frame sign, the sand Shorty walks on. Shorty is about 60% of his round-1 size.

**The phone shows a real page.** An iframe of the demo truck's SmartPage (`DEMO_PAGE_URL` in `config.ts`), laid out at 390 px and scaled into the frame. The app sends no `X-Frame-Options` and no CSP on SmartPage routes (checked on live pages 2026-10-13), so no app change was needed for framing. Close it with the X on the phone's corner, a tap on the dark area, or the "Put the phone down" chip (always shown). The install steps, the text demo and the email preview play on top of the page like another app. Shorty can go into the phone (drop him on it); the round badge on the phone's corner, or closing the phone, puts him back on the lot. Tapping the truck lets him out of the window.
Two things come with the demo flag (below): the page shows a small "Demos" button of its own, and the **Text me opt-in button does not appear on a demo page** (the app hides it for `is_demo`), so the text demo on the lot stays our own message thread.

**The demo truck: Low Tide Tacos** (`https://lowtidetacos.shortlistpass.com`). A made-up business with `is_demo = true`, the app's documented demo pattern (`docs/architecture/demo-businesses.md` in the app repo): it renders at its subdomain, is noindex, is left out of search, the sitemap and trucks.shortlistpass.com, and a preorder on it skips Stripe (marked paid, `payment_method: demo`), so no money moves. Menu, logo and stops are in `src/components/foodtrucks/demo-truck.json` (also what the sign reads). Pictures are our own cut-paper drawings (`public/foodtrucks/demo-menu/`), not photographs; there is no food photo set in either repo. Seed or top it up with `scripts/seed-low-tide-tacos.mjs` (dry run by default, `APPLY=1` to write; idempotent; never deletes). It writes 12 weeks of Tue/Thu/Sat stops, so run it again every couple of months. Row ids are recorded at the end of this page.

**Sound.** Off until the speaker button (top right of the stage) is tapped; never plays before a tap; off again on every page load; effects are skipped for `prefers-reduced-motion`. Files live in `public/foodtrucks/`: `voice/<id>.mp3` (Shorty reading each line in `lines.json`), `audio/<name>.mp3` (seven soft effects) and `audio/bg.mp3` (the quiet loop). All were generated once with ElevenLabs by `scripts/gen-foodtrucks-audio.mjs` (constant 128 kbps, 44.1 kHz): the voice is "Fughedaboutit" (`lhoxUh835Ntz9NEE6xoB`, model `eleven_flash_v2_5`, the same as the app's `/api/voice/tts`), the effects and the loop come from ElevenLabs Sound Effects and Music on Marc's subscription. License: ElevenLabs grants commercial use of output generated on a paid plan; confirm the plan tier covers it. Visitors never trigger ElevenLabs for scripted lines. Typed answers are not voiced: the app's TTS route needs a signed-in owner and a business id, so it cannot be used from this page.
To re-record a line: edit it in `lines.json`, delete `public/foodtrucks/voice/<id>.mp3`, and run `ELEVENLABS_API_KEY=... node scripts/gen-foodtrucks-audio.mjs` (or pass the id: `... intro mega`). It skips files that exist and refuses to spend if the voice characters would pass 20,000.

**Bubbles.** Each has a small X, fades on its own after 9 s (longer for long lines, about 70 ms a character), and a new line crossfades over the old one.

**Pricing copy.** Social posting is listed under Communications (matching the app's public Shorty). The spec also lists "social" under Verified; ask Marc which is right.

**Rollback.** `git revert <sha> && git push` (the sha is in the build report).
