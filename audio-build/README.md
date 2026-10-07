# HOA clip audio
Rebuild: `node audio-build/voice.mjs`, then `node audio-build/fill.mjs` and `node audio-build/refit.mjs` (voice lines from script.json, Shorty's ElevenLabs voice, then pacing passes), `node audio-build/sfx.mjs` (effects and music, skips files that exist), `python3 audio-build/make-build.py && bash audio-build/build.sh` (the mix, 175 s, 128k, about -16 LUFS). Output is copied to `public/hoa/hoa-clip-audio-v5.mp3`.
Needs ELEVENLABS_API_KEY in the loyalty-pwa .env.local (path set in the scripts). `voice-fit.json` has the per-line duration vs window.
