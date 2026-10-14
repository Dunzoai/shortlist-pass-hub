# /foodtrucks (food truck owners page)

`shortlistpass.com/foodtrucks`: a sell-and-educate page for food truck owners. Reference designs: `docs/design/foodtrucks/`.

**Page order:** header, hero, the narrated video, feature sections, "trucks out tonight" card (live count from the app's trucks-tonight endpoint, re-fetched every 60 s), final CTA.

**Where things are**
- `src/app/foodtrucks/` the page and its layout (hides the site-wide agency bar here only).
- `src/components/foodtrucks/` `Hero.tsx`, `Sections.tsx`, `TrucksTonight.tsx`, `FoodTrucksHeader.tsx`, `api.ts` (tonight's trucks), `config.ts`, `tokens.ts`.
- **Hero:** the homepage hero stage itself (`ShortyStage` in `src/components/new-home/ShortyHero.tsx`), playing only the Low Tide Tacos scene (`FOODTRUCK_EXCHANGES`). Stage on top on a phone, beside the copy on desktop.

**Removed (Oct 2026):** the playable "Shorty's lot" (drag/flick game, phone iframe, chips, sound, voice lines, the copied motion layer in `shorty/live`) was taken out at Marc's request. It is in git history (commits before "Food trucks: remove the playable lot").

**Demo truck still in the database:** "Low Tide Tacos" (`scripts/seed-low-tide-tacos.mjs`, `demo-truck.json`, pictures in `public/foodtrucks/demo-menu/`). The page no longer uses it; the seed script is kept in case it is wanted again.

## The narrated video (rounds 3 and 4)
`src/components/foodtrucks/video/` — a ~62 s, four-scene, 16:9 video drawn in the page (no video file). `ShortyVideo.tsx` is the player: one clock drives the drawing (`scenes.tsx`, `art.tsx`), the voice, the effects and the captions (`timeline.ts` holds the clock, the beats, the chapters and the sound cues).

**Player:** autoplays muted with captions when 40% in view, pauses when scrolled out. Controls (show on hover/tap, always while paused): play/pause, scrubber (click, drag, touch) with one chapter per scene and a label on hover/tap, time, CC, speaker, fullscreen (in-page fill on iPhone, where Safari has no element fullscreen). Keys: Space/K play-pause, ←/→ ±5 s, Home/End, 1–4 jump to a chapter, M sound, C captions, F fullscreen. End screen: Replay and Share. Share copies `https://www.shortlistpass.com/foodtrucks#watch` (the native share sheet on phones that have one); opening that link scrolls to the video and plays it from the start. URL options for checking: `?ftvT=12` start at 12 s, `&ftvHold=1` hold, `&ftvBare=1` hide the controls.

**Chapters:** Meet Shorty (0:00) · He talks to your customers (0:09) · He posts for you (0:34) · He takes the orders (0:45). Total about 60 s (scene 1 cuts about a second after "…never miss you.").

**Script (verbatim, as shipped; `video/lines.json`)**
- Scene 1: "Hey, I'm Shorty. I'm your front of house, and I never close." / "I give your customers your own app, so they never miss you."
- Scene 2 (one line per beat): "I talk to your customers for you. All day, all night." / "Order's ready? They get a text. No shouting names, nobody standing around." / "New item on the menu? Your whole list hears about it before they pull up." / "A push notification lands right on their phone, wherever they are." / "Somebody asks if you've got the birria today? I answer. Even when you're slammed."
- Scene 3: "Tell me where you'll be and what you're selling. I post it ahead of every event, so your marketing's done before you get busy."
- Scene 4: "And I take the orders and the bookings while you're running the show." / "Share your menu and your stops for free. Get Verified and I'll handle the orders, the bookings, and all the talking."
- On-screen texts: "Order's up at the window." / "New flavor alert: birria empanada." / "Nito's is at the clubhouse today, 4 to 7." / "Do you have the birria empanada today?" / "Yep, fully stocked." / "post about the birria." / "Tonight: Pier View Park, 5 to 9" / "Clear Pond HOA, Saturday 1 to 5, 200 people". The post's like count and the order cards are decoration, not claims about a real business; the birria picture is our own drawing.

**Timing rules:** every prop that flies out of Shorty's phone (text, envelope, push notification, post, order cards) is held still and readable for 2 s+ before it moves; text is at least ~11 px on a 390 px phone. Scene-2 beats are as long as their picture needs (`BEAT` in `timeline.ts`); a line starts near the end of its beat so the voice runs on without a gap. Shorty and the customers stand on the ground line (`GROUND` in `art.tsx`), in front of the truck and clear of the wheels.

**Caption timing:** from ElevenLabs' `with-timestamps` endpoint (per-character times) — `scripts/gen-foodtrucks-video-audio.mjs` turns them into words and 2–4-word groups (key word in mint = longest non-filler word) and saves `video/voice.json`. Captions follow the audio exactly; nothing is evenly split.

**Re-record a line:** edit the text in `video/lines.json`, then `ELEVENLABS_API_KEY=... node scripts/gen-foodtrucks-video-audio.mjs <id>` (e.g. `s2c`; it overwrites that id). New length and captions come with it. If a line gets longer, adjust `BEAT`/`SCENE` lengths in `video/timeline.ts` and the beats in `scenes.tsx`. `... rechunk` rebuilds caption groups from saved timings without calling the API. Sound effects: pass an effect name (`... whoosh`) to regenerate it. Voice "Fughedaboutit" (`lhoxUh835Ntz9NEE6xoB`), model `eleven_flash_v2_5`, `mp3_44100_128`. Round 4 re-recorded only scene 2 (5 lines, 347 characters).

**Audio files:** `public/foodtrucks/video/voice/*.mp3` (the old `s2.mp3` is still there, unused), `public/foodtrucks/video/sfx/`: whoosh, flutter, ding, register, crowd, order_card (earlier) + ambience (breeze/seaside bed, seamless loop), footsteps, shutter, sizzle, pop, bag, chime, flurry, tap, buzz, camera, likes, printer, bell (round 4); `music.mp3` (round 5: upbeat funk-pop, 126 BPM, 65 s, generated by the same script; `bg.mp3` is the older slow loop, kept but unused). Sound plays through the Web Audio API (files decoded once, started on the audio clock; the earlier one-<audio>-per-sound version stuttered on phones). Nothing loads or plays until the speaker is tapped; the music joins at the matching point of the timeline and fades out over the last 2.5 s.

**mp4 files for posting:** `docs/features/foodtrucks-video/shorty-foodtrucks-1920x1080.mp4` and `shorty-foodtrucks-1080x1350.mp4` (vertical, for Instagram: the picture over a peach background with big captions underneath). Captions are burned in. Made by `scripts/record-foodtrucks-video.mjs`: Playwright steps the page frame by frame (1/30 s) in a recording layout (`?ftvCapture=wide|tall`), and because headless Chromium can't capture sound, the audio is mixed with ffmpeg from the page's own cue list. Re-run it after any change: `node scripts/record-foodtrucks-video.mjs https://www.shortlistpass.com both`.

**Reusable pieces:** `art.tsx` (LotBack, TruckFront, Kitchen, Shutter, Person, Bubble, Envelope, MiniPhone, InfoCard, Bag, Heart, ThumbsUp) and `frameAt(t)` in `scenes.tsx`, so a dashboard tutorial can mount a scene with its own clock.
