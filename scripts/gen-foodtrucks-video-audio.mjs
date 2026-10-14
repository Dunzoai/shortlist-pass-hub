/**
 * Audio for the /foodtrucks explainer video (src/components/foodtrucks/video/).
 *   1. Shorty's voice for every line in video/lines.json, WITH per-character timings (ElevenLabs
 *      /text-to-speech/{voice}/with-timestamps) -> public/foodtrucks/video/voice/<id>.mp3 and
 *      src/components/foodtrucks/video/voice.json (duration, words, caption chunks).
 *   2. Sound effects (whoosh, envelope flutter, push ding, cash register, crowd murmur) -> public/foodtrucks/video/sfx/.
 * Same voice ("Fughedaboutit"), model and mp3_44100_128 format as the earlier foodtrucks audio. The music loop is
 * public/foodtrucks/video/bg.mp3 (the loop recorded earlier, kept). Existing files are skipped; delete one (or pass its id) to re-record.
 * The API key is passed in as the ELEVENLABS_API_KEY environment variable and is never printed.
 * Usage: ELEVENLABS_API_KEY=... node scripts/gen-foodtrucks-video-audio.mjs [ids]   (or `rechunk` to rebuild caption groups from the saved timings)
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) { console.log("No ELEVENLABS_API_KEY was passed in."); process.exit(1); }
const VOICE = "lhoxUh835Ntz9NEE6xoB", MODEL = "eleven_flash_v2_5", BASE = "https://api.elevenlabs.io/v1", FMT = "output_format=mp3_44100_128";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const lines = JSON.parse(fs.readFileSync(path.join(ROOT, "src/components/foodtrucks/video/lines.json"), "utf8"));
const jsonPath = path.join(ROOT, "src/components/foodtrucks/video/voice.json");
const vdir = path.join(ROOT, "public/foodtrucks/video/voice"), sdir = path.join(ROOT, "public/foodtrucks/video/sfx");
const only = process.argv.slice(2);
const have = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, "utf8")) : {};
const failed = [];

const STOP = new Set("a an and are be but by do for from get hey i i'm i'll in is it me my of on or so that the they to we what when where while with you you'll you're your all".split(" "));
/* two to four words at a time; the longest word of each group is the key word (mint in the captions) */
function chunks(words) {
  const segs = []; let cur = [];
  for (const w of words) { cur.push(w); if (/[.,!?;:]$/.test(w.w)) { segs.push(cur); cur = []; } }
  if (cur.length) segs.push(cur);
  const groups = [];
  for (const seg of segs) {
    if (seg.length === 1 && groups.length && groups[groups.length - 1].length < 4 && !/[.!?]$/.test(groups[groups.length - 1].at(-1).w)) { groups[groups.length - 1].push(seg[0]); continue; }
    const k = Math.ceil(seg.length / 4); let i = 0;
    for (let g = 0; g < k; g++) { const n = Math.round((seg.length - i) / (k - g)); groups.push(seg.slice(i, i + n)); i += n; }
  }
  return groups.map((g) => {
    const clean = g.map((w) => w.w.replace(/[^\p{L}\p{N}']/gu, ""));
    const pool = clean.map((c, i) => i).filter((i) => !STOP.has(clean[i].toLowerCase()));
    let key = (pool.length ? pool : clean.map((c, i) => i))[0]; (pool.length ? pool : clean.map((c, i) => i)).forEach((i) => { if (clean[i].length > clean[key].length) key = i; });
    return { words: g.map((w) => w.w), key, s: g[0].s, e: g[g.length - 1].e };
  });
}

if (only[0] === "rechunk") {   // recompute the caption chunks from the saved word timings (no API calls)
  for (const id of Object.keys(have)) have[id].chunks = chunks(have[id].words);
  fs.writeFileSync(jsonPath, JSON.stringify(have, null, 1)); console.log("rechunked"); process.exit(0);
}
const todo = Object.entries(lines).filter(([id]) => (only.length ? only.includes(id) : !have[id] || !fs.existsSync(path.join(vdir, id + ".mp3"))));
console.log(`voice lines to record: ${todo.length}, characters: ${todo.reduce((n, [, t]) => n + t.length, 0)}`);
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
    have[id] = { text, duration: Math.round(dur * 1000) / 1000, words, chunks: chunks(words) };
    console.log("ok voice", id, have[id].duration + "s", have[id].chunks.length + " caption chunks");
  } catch (e) { console.log("FAILED voice", id, String(e.message || e)); failed.push(id); }
}
fs.writeFileSync(jsonPath, JSON.stringify(have, null, 1));

/* sound effects: ElevenLabs minimum is 0.5 s, so trim to the wanted length */
const SFX = {
  whoosh: ["A soft quick airy whoosh of a text message flying away, with a tiny swoosh and pop, gentle, no music", 1.0, 0.9],
  flutter: ["A bundle of paper envelopes fluttering and splitting into many, light paper flutter and tiny pops, gentle, no music", 2.0, 1.8],
  ding: ["A soft friendly phone push notification ding, two gentle chime notes, clean, no music", 1.0, 0.9],
  register: ["A vintage cash register ka-ching with a bell, short, friendly, no music", 1.2, 1.1],
  ambience: ["A very soft outdoor ambience of a light sea breeze and far-off waves and distant gulls at a seaside park, calm, steady, no music, no voices", 20.0, 20.0],
  footsteps: ["Soft footsteps of a small character walking on sand and gravel, six gentle steady steps, no music", 3.2, 3.2],
  shutter: ["A food truck serving window metal shutter sliding open with a soft rattle and a small clunk, no music", 1.4, 1.2],
  sizzle: ["A flat-top grill sizzling softly with a light spatula scrape, food cooking, steady, no music", 8.0, 8.0],
  pop: ["A single soft bubble pop with a tiny sparkle, cute app icon landing, no music", 0.6, 0.5],
  bag: ["A paper take-out bag being handed over, soft paper rustle, quick", 0.8, 0.8],
  chime: ["A small happy two-note chime, bright and friendly, short, no music", 0.8, 0.8],
  flurry: ["A flurry of many soft quick airy whooshes and tiny paper flicks, light, fast, no music", 1.6, 1.5],
  tap: ["A person quickly tapping and typing on a phone screen, a few soft taps, then one swipe, quiet", 1.2, 1.1],
  buzz: ["A phone vibrating on a table, a short double buzz, soft, no music", 1.0, 0.9],
  camera: ["A camera shutter click, single crisp soft click, phone camera", 0.6, 0.5],
  likes: ["A series of tiny soft bubble pops ticking upward in pitch, like likes counting up, gentle, no music", 2.4, 2.3],
  printer: ["A small receipt ticket printer chattering for a moment and tearing off a ticket, soft, no music", 1.4, 1.3],
  bell: ["One bright clear service bell ding, single, cheerful, no music", 1.0, 0.9],
  crowd: ["A soft quiet crowd murmur of people waiting in a line outside, low friendly chatter, steady, no music, no distinct words", 8.0, 8.0],
};
for (const [name, [text, ask, keep]] of Object.entries(SFX)) {
  const out = path.join(sdir, name + ".mp3");
  if (fs.existsSync(out) && !only.includes(name)) continue;
  if (only.length && !only.includes(name)) continue;
  try {
    const r = await fetch(`${BASE}/sound-generation?${FMT}`, { method: "POST", headers: { "xi-api-key": KEY, "content-type": "application/json" }, body: JSON.stringify({ text, duration_seconds: Math.max(0.5, ask), prompt_influence: 0.6 }) });
    if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 160)}`);
    const raw = out + ".raw.mp3"; fs.writeFileSync(raw, Buffer.from(await r.arrayBuffer()));
    execFileSync("ffmpeg", ["-y", "-v", "error", "-i", raw, "-t", String(keep), "-af", `afade=t=out:st=${(keep - 0.05).toFixed(2)}:d=0.05`, "-ar", "44100", "-b:a", "128k", out]);
    fs.unlinkSync(raw); console.log("ok sfx", name);
    if (name === "ambience") {   // make it loop without a seam: the last 2 s are crossfaded into the first 2 s
      const tmp = out + ".loop.mp3";
      execFileSync("ffmpeg", ["-y", "-v", "error", "-i", out, "-filter_complex", "[0]atrim=18:20,asetpts=PTS-STARTPTS[t];[0]atrim=0:2,asetpts=PTS-STARTPTS[h];[t][h]acrossfade=d=2[x];[0]atrim=2:18,asetpts=PTS-STARTPTS[m];[x][m]concat=n=2:v=0:a=1", "-ar", "44100", "-b:a", "128k", tmp]);
      fs.renameSync(tmp, out);
    }
  } catch (e) { console.log("FAILED sfx", name, String(e.message || e)); failed.push(name); }
}
console.log(failed.length ? "FAILED: " + failed.join(", ") : "all done");
