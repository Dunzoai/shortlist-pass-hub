# /foodtrucks (food truck owners page)

`shortlistpass.com/foodtrucks`: a sell-and-educate page for food truck owners. Reference designs: `docs/design/foodtrucks/`.

**Page order:** header, hero, the narrated video, feature sections, "trucks out tonight" card (live count from the app's trucks-tonight endpoint, re-fetched every 60 s), final CTA.

**Where things are**
- `src/app/foodtrucks/` the page and its layout (hides the site-wide agency bar here only).
- `src/components/foodtrucks/` `Hero.tsx`, `Sections.tsx`, `TrucksTonight.tsx`, `FoodTrucksHeader.tsx`, `api.ts` (tonight's trucks), `config.ts`, `tokens.ts`.
- **Hero:** the homepage hero stage itself (`ShortyStage` in `src/components/new-home/ShortyHero.tsx`), playing only the Low Tide Tacos scene (`FOODTRUCK_EXCHANGES`). Stage on top on a phone, beside the copy on desktop.

**Removed (Oct 2026):** the playable "Shorty's lot" (drag/flick game, phone iframe, chips, sound, voice lines, the copied motion layer in `shorty/live`) was taken out at Marc's request. It is in git history (commits before "Food trucks: remove the playable lot").

**Demo truck still in the database:** "Low Tide Tacos" (`scripts/seed-low-tide-tacos.mjs`, `demo-truck.json`, pictures in `public/foodtrucks/demo-menu/`). The page no longer uses it; the seed script is kept in case it is wanted again.

## The narrated video (round 3)
`src/components/foodtrucks/video/` — a ~56 s, four-scene, 16:9 video drawn in the page (no video file). `ShortyVideo.tsx` is the player: one clock drives the drawing (`scenes.tsx`, `art.tsx`), the voice, the effects and the captions. Autoplays muted with captions when 40% in view, pauses when scrolled out, speaker button = voice + sound, CC button = captions, replay at the end, reduced motion = no camera moves. `?ftvT=12` in the URL starts it at 12 s (`&ftvHold=1` holds the frame, for checking).

**Script (verbatim, as shipped; `video/lines.json`)**
- Scene 1: "Hey, I'm Shorty. I'm your front of house, and I never close." / "I give your customers your own app, so they never miss you."
- Scene 2: "I talk to your customers for you. Text, email, push notification, all day, all night."
- Scene 3: "Tell me where you'll be and what you're selling. I post it ahead of every event, so your marketing's done before you get busy."
- Scene 4: "And I take the orders and the bookings while you're running the show." / "Share your menu and your stops for free. Get Verified and I'll handle the orders, the bookings, and all the talking."
- On-screen texts: "Order's up at the window." / "New flavor alert: birria empanada." / "Nito's is at the clubhouse today, 4 to 7." / "Do you have the birria empanada today?" / "Yep, fully stocked." / "post about the birria." / "Tonight: Pier View Park, 5 to 9" / "Clear Pond HOA, Saturday 1 to 5, 200 people". The post's like count and the order cards are decoration, not claims about a real business; the birria picture is our own drawing.

**Caption timing:** from ElevenLabs' `with-timestamps` endpoint (per-character times) — `scripts/gen-foodtrucks-video-audio.mjs` turns them into words and 2–4-word groups (key word in mint = longest non-filler word) and saves `video/voice.json`. Captions follow the audio exactly; nothing is evenly split.

**Re-record a line:** edit the text in `video/lines.json`, then `ELEVENLABS_API_KEY=... node scripts/gen-foodtrucks-video-audio.mjs <id>` (e.g. `s2`; delete nothing, it overwrites that id). New lengths and captions come with it. If a line gets longer, move the cue times in `video/timeline.ts` (`VOICE_AT`, `SCENE`, `TOTAL`) and the beats in `scenes.tsx`. `... rechunk` rebuilds caption groups from saved timings without calling the API. Sound effects: `... whoosh` etc. re-generate one effect (delete the file first). Voice "Fughedaboutit" (`lhoxUh835Ntz9NEE6xoB`), model `eleven_flash_v2_5`, `mp3_44100_128`; the six lines are 515 characters.

**Audio files:** `public/foodtrucks/video/voice/*.mp3`, `sfx/` (whoosh, flutter, ding, register, crowd murmur, order_card), `bg.mp3` (the music loop recorded earlier, kept). Nothing loads or plays until the speaker is tapped.

**Reusable pieces:** `art.tsx` (LotBack, TruckFront, Kitchen, Shutter, Person, Bubble, Envelope, MiniPhone, InfoCard, Bag, Heart, ThumbsUp) and `frameAt(t)` in `scenes.tsx`, so a dashboard tutorial can mount a scene with its own clock.
