/**
 * Audio for the 25-second Instagram Reel (src/components/foodtrucks/reel/, dev route /dev/foodtrucks-reel).
 *   1. Shorty's voice for every line in reel/lines.json WITH per-character timings (ElevenLabs /text-to-speech/{voice}/with-timestamps)
 *      -> docs/features/foodtrucks-reel/audio/voice/<id>.mp3 and src/components/foodtrucks/reel/voice.json (duration, words).
 *   2. Sound effects (glass knock, rattle, listing whoosh, marker squeak, arm pop, ding, shutter, register, ...) and a short music bed
 *      -> docs/features/foodtrucks-reel/audio/sfx/ and music.mp3.
 * Same voice ("Fughedaboutit" lhoxUh835Ntz9NEE6xoB), model eleven_flash_v2_5 and mp3_44100_128 as the other foodtrucks audio.
 * The key is passed in as ELEVENLABS_API_KEY and never printed. Existing files are skipped; pass ids to redo them.
 * Usage: ELEVENLABS_API_KEY=... node scripts/gen-foodtrucks-reel-audio.mjs [ids]
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) { console.log("No ELEVENLABS_API_KEY was passed in."); process.exit(1); }
const VOICE = "lhoxUh835Ntz9NEE6xoB", MODEL = "eleven_flash_v2_5", BASE = "https://api.elevenlabs.io/v1", FMT = "output_format=mp3_44100_128";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const lines = JSON.parse(fs.readFileSync(path.join(ROOT, "src/components/foodtrucks/reel/lines.json"), "utf8"));
const jsonPath = path.join(ROOT, "src/components/foodtrucks/reel/voice.json");
const A = path.join(ROOT, "docs/features/foodtrucks-reel/audio"), vdir = path.join(A, "voice"), sdir = path.join(A, "sfx");
const only = process.argv.slice(2);
const have = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, "utf8")) : {};
const failed = [];

const todo = Object.entries(lines).filter(([id]) => (only.length ? only.includes(id) : !have[id] || !fs.existsSync(path.join(vdir, id + ".mp3"))));
const chars = todo.reduce((n, [, t]) => n + t.length, 0);
console.log(`voice lines to record: ${todo.length}, characters: ${chars}`);
for (const [id, text] of todo) {
  try {
    const r = await fetch(`${BASE}/text-to-speech/${VOICE}/with-timestamps?${FMT}`, { method: "POST", headers: { "xi-api-key": KEY, "content-type": "application/json" }, body: JSON.stringify({ text, model_id: MODEL }) });
    if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 160)}`);
    const j = await r.json();
    const file = path.join(vdir, id + ".mp3");
    fs.writeFileSync(file, Buffer.from(j.audio_base64, "base64"));
    const a = j.alignment, words = []; let cur = null;
    a.characters.forEach((c, i) => {
      if (/\s/.test(c)) { cur = null; return; }
      if (!cur) { cur = { w: "", s: a.character_start_times_seconds[i], e: 0 }; words.push(cur); }
      cur.w += c; cur.e = a.character_end_times_seconds[i];
    });
    const dur = parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString());
    have[id] = { text, chars: text.length, duration: Math.round(dur * 1000) / 1000, words };
    console.log("ok voice", id, have[id].duration + "s");
  } catch (e) { console.log("FAILED voice", id, String(e.message || e)); failed.push(id); }
}
fs.writeFileSync(jsonPath, JSON.stringify(have, null, 1));

/* sound effects: ElevenLabs minimum is 0.5 s, so trim to the wanted length */
const SFX = {
  knock: ["One single sharp knuckle knock on a thick glass window pane, one knock only, solid and dry, close, then silence, no music", 0.6, 0.5],
  smack: ["A loud heavy flat palm slap hitting a glass window with a deep thud, big impact, close, no music", 0.8, 0.7],
  rattle: ["A low rattle and shudder of a glass pane and its frame shaking after being hit, short, decaying, no music", 1.6, 1.4],
  slide: ["A quick papery whoosh of a flat card sliding up into place, swift, soft, no music", 0.9, 0.8],
  squeak: ["A fat felt marker squeaking and scribbling hard across a whiteboard, two quick rough strokes, no music", 1.4, 1.2],
  armpop: ["A cartoon pop with a tiny springy boing, a limb popping out, cute, short, no music", 0.6, 0.5],
  ding: ["A bright friendly phone notification ding, single clear chime, no music", 0.8, 0.7],
  shutter: ["A phone camera shutter click, one crisp click, no music", 0.6, 0.5],
  register: ["A vintage cash register ka-ching with a bell, short, friendly, no music", 1.2, 1.0],
  whoosh: ["A soft quick airy whoosh of a message flying away, tiny swoosh, no music", 0.8, 0.7],
  paper: ["A quick paper envelope flutter and a soft flick, light, no music", 0.8, 0.7],
  ticket: ["A small receipt ticket printer chirp and tear, quick, no music", 0.9, 0.8],
  fold: ["A quick soft fabric whump and slide of an arm tucking back in, cartoon, short, no music", 0.6, 0.5],
};
for (const [name, [text, ask, keep]] of Object.entries(SFX)) {
  const out = path.join(sdir, name + ".mp3");
  if (only.length ? !only.includes(name) : fs.existsSync(out)) continue;
  try {
    const r = await fetch(`${BASE}/sound-generation?${FMT}`, { method: "POST", headers: { "xi-api-key": KEY, "content-type": "application/json" }, body: JSON.stringify({ text, duration_seconds: Math.max(0.5, ask), prompt_influence: 0.6 }) });
    if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 160)}`);
    const raw = out + ".raw.mp3"; fs.writeFileSync(raw, Buffer.from(await r.arrayBuffer()));
    execFileSync("ffmpeg", ["-y", "-v", "error", "-i", raw, "-t", String(keep), "-af", `afade=t=out:st=${(keep - 0.05).toFixed(2)}:d=0.05`, "-ar", "44100", "-b:a", "128k", out]);
    fs.unlinkSync(raw); console.log("ok sfx", name);
  } catch (e) { console.log("FAILED sfx", name, String(e.message || e)); failed.push(name); }
}
const musicOut = path.join(A, "music.mp3");
if (only.length ? only.includes("music") : !fs.existsSync(musicOut)) {
  try {
    const r = await fetch(`${BASE}/music?${FMT}`, { method: "POST", headers: { "xi-api-key": KEY, "content-type": "application/json" }, body: JSON.stringify({ prompt: "Short driving feel-good funk-pop instrumental bed for a 25 second social video: 128 BPM, tight punchy kick and snare, handclaps, bouncy slap bass, plucky guitar riff, a little brass stab, builds energy, confident and playful, no vocals, ends on a clean hit.", music_length_ms: 27000, model_id: "music_v1", force_instrumental: true }) });
    if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 160)}`);
    fs.writeFileSync(musicOut, Buffer.from(await r.arrayBuffer())); console.log("ok music");
  } catch (e) { console.log("FAILED music", String(e.message || e)); failed.push("music"); }
}
console.log(failed.length ? "FAILED: " + failed.join(", ") : "all done");
