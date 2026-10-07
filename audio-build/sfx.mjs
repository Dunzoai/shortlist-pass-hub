// Sound effects (one file per cue type, reused for repeats) and the music bed, from ElevenLabs.
import fs from "node:fs";
const env = fs.readFileSync("/Users/marcmatlioski/Desktop/loyalty-pwa/loyalty-pwa 2/.env.local", "utf8");
const KEY = env.match(/^ELEVENLABS_API_KEY=(.*)$/m)[1].trim().replace(/^["']|["']$/g, "");
const H = { "xi-api-key": KEY, "content-type": "application/json" };
const SFX = {
  wipe: ["a soft pencil sweeping across paper, a quick scribble whoosh, gentle", 1.3],
  footsteps: ["soft sneaker footsteps walking on a floor, steady, gentle, quiet", 3.0],
  whoosh: ["a soft airy whoosh, short, light", 0.8],
  swoosh: ["a gentle swoosh of a paper sliding, short", 0.7],
  ping: ["a single soft bright glassy ping, short, pleasant", 0.8],
  pop: ["a small cute bubble pop, short, soft", 0.5],
  chime: ["a warm success chime, two ascending notes, friendly, short", 1.4],
  crickets: ["quiet night crickets chirping, gentle background ambience", 4.0],
  bark: ["a single small puppy bark, cute, short", 0.8],
  swipe: ["a phone screen swipe, soft smooth slide, short", 0.6],
  typing: ["soft quiet laptop keyboard typing clicks, steady, gentle", 3.0],
  send: ["a soft message sent whoosh, short, light", 0.7],
  buzzer: ["a soft low error buzzer, short, not harsh", 0.7],
  notify: ["a gentle phone notification ping, short", 0.9],
  tap: ["a single soft finger tap click on a phone screen, short", 0.3],
  heart: ["a tiny cute pop with a soft sparkle, short, lovable", 0.5],
  lamp: ["a bedside lamp switch click, short", 0.4],
  snore: ["a very soft sleepy puppy snore, short, cute", 1.6],
  keyloop: ["quiet laptop keyboard typing, steady rhythm, background, gentle", 6.0],
  rustle: ["soft paper rustle, short", 1.0],
  stamp: ["a soft rubber stamp thump on paper, short", 0.5],
  ding: ["a cash register ding, bright, short", 1.2],
  slide: ["a small window sliding open, quiet, short", 1.0],
  bag: ["a paper bag rustle, short, soft", 1.0],
  truck: ["a faint distant food truck engine idling, low, background hum", 6.0],
  done: ["a tiny soft confirmation ding, very short", 0.5],
  endchime: ["a warm gentle ending chime, resolving, short, uplifting", 2.5],
};
for (const [name, [text, secs]] of Object.entries(SFX)) {
  const f = `audio-build/sfx/${name}.mp3`;
  if (fs.existsSync(f)) continue;
  const r = await fetch("https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128", { method: "POST", headers: H, body: JSON.stringify({ text, duration_seconds: Math.max(0.5, secs), prompt_influence: 0.5 }) });
  if (!r.ok) { console.log("SFX FAIL", name, r.status, (await r.text()).slice(0, 120)); continue; }
  fs.writeFileSync(f, Buffer.from(await r.arrayBuffer())); console.log("sfx", name);
}
const mf = "audio-build/music/bed2.mp3";
if (!fs.existsSync(mf)) {
  const r = await fetch("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128", { method: "POST", headers: H, body: JSON.stringify({ prompt: "A warm, light, friendly instrumental background track for a neighborhood explainer. Soft acoustic guitar, gentle piano and light percussion. Calm and gentle at the start, a quiet almost lullaby-like middle section, a small lift in the second half, and a warm uplifting finish. No vocals.", music_length_ms: Math.round(JSON.parse(fs.readFileSync("audio-build/timeline.json","utf8")).total_real_ms + 1500), force_instrumental: true }) });
  if (!r.ok) console.log("MUSIC FAIL", r.status, (await r.text()).slice(0, 300));
  else { fs.writeFileSync(mf, Buffer.from(await r.arrayBuffer())); console.log("music ok"); }
}
