# Food trucks Instagram Reel (25 s, 1080x1920, 30 fps)
- `shorty-foodtrucks-reel-1080x1920.mp4`, `shorty-foodtrucks-reel-cover.jpg`, `stills/`, `audio/` (voice, effects, music).
- Scene: `src/components/foodtrucks/reel/` at the dev-only route `/dev/foodtrucks-reel` (404 in production).
- Audio: `ELEVENLABS_API_KEY=... node scripts/gen-foodtrucks-reel-audio.mjs` (348 voice characters). Render: run `next dev -p 3113`, then `node scripts/record-foodtrucks-reel.mjs http://localhost:3113`.
