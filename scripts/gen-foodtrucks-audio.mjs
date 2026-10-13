/**
 * Records the /foodtrucks audio with ElevenLabs, ONCE, at build time (visitors never trigger ElevenLabs for scripted lines):
 *   1. Shorty's voice reading every line in src/components/foodtrucks/lines.json  -> public/foodtrucks/voice/<id>.mp3
 *   2. seven soft sound effects                                                    -> public/foodtrucks/audio/<name>.mp3
 *   3. one quiet instrumental background loop                                      -> public/foodtrucks/audio/bg.mp3
 * All mp3, constant bitrate 128 kbps, 44.1 kHz (ElevenLabs output_format mp3_44100_128).
 * Files that exist are skipped. To re-record one line: delete its mp3 (or pass ids: `node scripts/gen-foodtrucks-audio.mjs intro mega`).
 * Stops without spending anything if the voice characters would pass 20,000.
 * Voice: "Fughedaboutit" lhoxUh835Ntz9NEE6xoB, the same voice and model as the app's /api/voice/tts. The key is passed in as
 * the ELEVENLABS_API_KEY environment variable.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(here, "..");
const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) { console.log("No ELEVENLABS_API_KEY was passed in."); process.exit(1); }
const VOICE = "lhoxUh835Ntz9NEE6xoB", MODEL = "eleven_flash_v2_5", BASE = "https://api.elevenlabs.io/v1", FMT = "output_format=mp3_44100_128";
const lines = JSON.parse(fs.readFileSync(path.join(ROOT, "src/components/foodtrucks/lines.json"), "utf8"));
const only = process.argv.slice(2);
const vdir = path.join(ROOT, "public/foodtrucks/voice"), adir = path.join(ROOT, "public/foodtrucks/audio");
fs.mkdirSync(vdir, { recursive: true }); fs.mkdirSync(adir, { recursive: true });
const failed = [];

/* "$50" -> "fifty dollars" for the ear only (same idea as the app's sayMoney) */
const W = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
const T = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
const words = (n) => (n < 20 ? W[n] : T[Math.floor(n / 10)] + (n % 10 ? "-" + W[n % 10] : ""));
const forEar = (s) => s.replace(/\$(\d{1,2})\b/g, (_, n) => `${words(+n)} dollar${+n === 1 ? "" : "s"}`);

const todo = Object.entries(lines).filter(([id]) => (only.length ? only.includes(id) : true) && !fs.existsSync(path.join(vdir, id + ".mp3")));
const chars = todo.reduce((n, [, t]) => n + forEar(t).length, 0);
console.log(`voice lines to record: ${todo.length}, characters: ${chars}`);
if (chars > 20000) { console.log("That is over 20,000 characters. Stopping."); process.exit(1); }

for (const [id, text] of todo) {
  try {
    const r = await fetch(`${BASE}/text-to-speech/${VOICE}?${FMT}`, { method: "POST", headers: { "xi-api-key": KEY, "content-type": "application/json", accept: "audio/mpeg" }, body: JSON.stringify({ text: forEar(text), model_id: MODEL }) });
    if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 160)}`);
    fs.writeFileSync(path.join(vdir, id + ".mp3"), Buffer.from(await r.arrayBuffer()));
    console.log("ok voice", id);
  } catch (e) { console.log("FAILED voice", id, String(e.message || e)); failed.push(id); }
}

/* sound effects: soft and short; ElevenLabs minimum is 0.5 s, so trim to the wanted length */
const SFX = {
  grab: ["A soft cartoon pop and tiny squeak, like picking up a small rubber toy, gentle, no music", 0.5, 0.45],
  land: ["A soft cartoon thud with a tiny squish, a small character landing on the ground, gentle, no music", 0.6, 0.55],
  truck_shake: ["A food truck rattling and shaking for half a second, light metal pots and pans rattle, no music", 0.8, 0.8],
  order_card: ["A receipt ticket pops out of a printer, then a small soft bell ding, friendly, no music", 1.2, 1.2],
  megaphone: ["A small megaphone chirp followed by a few soft notification pings, light and friendly, no music", 1.5, 1.4],
  phone_open: ["A soft smooth phone screen wake whoosh going up with a tiny click, gentle, no music", 0.5, 0.5],
  phone_close: ["A soft smooth phone screen lock whoosh going down with a tiny click, gentle, no music", 0.5, 0.5],
};
for (const [name, [text, ask, keep]] of Object.entries(SFX)) {
  const out = path.join(adir, name + ".mp3");
  if (fs.existsSync(out) || (only.length && !only.includes(name))) continue;
  try {
    const r = await fetch(`${BASE}/sound-generation?${FMT}`, { method: "POST", headers: { "xi-api-key": KEY, "content-type": "application/json" }, body: JSON.stringify({ text, duration_seconds: Math.max(0.5, ask), prompt_influence: 0.6 }) });
    if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 160)}`);
    const raw = out + ".raw.mp3"; fs.writeFileSync(raw, Buffer.from(await r.arrayBuffer()));
    execFileSync("ffmpeg", ["-y", "-v", "error", "-i", raw, "-t", String(keep), "-af", `afade=t=out:st=${(keep - 0.04).toFixed(2)}:d=0.04`, "-ar", "44100", "-b:a", "128k", out]);
    fs.unlinkSync(raw); console.log("ok sfx", name);
  } catch (e) { console.log("FAILED sfx", name, String(e.message || e)); failed.push(name); }
}

/* background loop: 60 s instrumental, then the last 3 s are crossfaded into the first 3 s so it repeats without a seam */
const bg = path.join(adir, "bg.mp3");
if (!fs.existsSync(bg) && (!only.length || only.includes("bg"))) {
  try {
    const r = await fetch(`${BASE}/music?${FMT}`, { method: "POST", headers: { "xi-api-key": KEY, "content-type": "application/json" }, body: JSON.stringify({ prompt: "Quiet, warm, friendly acoustic instrumental background for a food truck lot at golden hour: soft fingerpicked guitar, light shaker and hand claps, gentle bass, relaxed 96 BPM, steady loop-friendly groove with no big drops, no vocals, sits under speech.", music_length_ms: 60000, model_id: "music_v1", force_instrumental: true }) });
    if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 160)}`);
    const raw = bg + ".raw.mp3"; fs.writeFileSync(raw, Buffer.from(await r.arrayBuffer()));
    execFileSync("ffmpeg", ["-y", "-v", "error", "-i", raw, "-filter_complex",
      "[0:a]atrim=3:57,asetpts=PTS-STARTPTS[mid];[0:a]atrim=57:60,asetpts=PTS-STARTPTS[tail];[0:a]atrim=0:3,asetpts=PTS-STARTPTS[head];[tail][head]acrossfade=d=3[x];[mid][x]concat=n=2:v=0:a=1[o]",
      "-map", "[o]", "-ar", "44100", "-b:a", "128k", bg]);
    fs.unlinkSync(raw); console.log("ok bg loop");
  } catch (e) { console.log("FAILED bg", String(e.message || e)); failed.push("bg"); }
}
console.log(failed.length ? `\nFailed: ${failed.join(", ")} (run again to retry only those)` : "\nAll done, nothing failed.");
