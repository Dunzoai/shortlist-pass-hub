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

**Pricing copy.** Social posting is listed under Communications (matching the app's public Shorty). The spec also lists "social" under Verified; ask Marc which is right.

**Rollback.** `git revert <sha> && git push` (the sha is in the build report).
