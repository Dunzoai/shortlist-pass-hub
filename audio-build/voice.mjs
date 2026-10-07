// Narration: one mp3 per line of audio-build/script.json, in Shorty's voice (Fughedaboutit, eleven_multilingual_v2).
// That model has no audio tags, so delivery is done with punctuation plus per-scene voice settings (speed, expressiveness).
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const env = fs.readFileSync("/Users/marcmatlioski/Desktop/loyalty-pwa/loyalty-pwa 2/.env.local", "utf8");
const KEY = env.match(/^ELEVENLABS_API_KEY=(.*)$/m)[1].trim().replace(/^["']|["']$/g, "");
const VOICE = "lhoxUh835Ntz9NEE6xoB";
const S = JSON.parse(fs.readFileSync("audio-build/script.json", "utf8"));
const dur = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString()) * 1000;
/* scene feel: [stability, style, speed]. Lower stability = livelier. Scene 2's first three lines are slow and soft (lullaby), then it picks up. */
const FEEL = (l, i) => l.scene === 1 ? [0.35, 0.5, 1.04] : l.scene === 2 ? (i < 7 ? [0.6, 0.15, 0.9] : [0.33, 0.55, 1.06]) : l.scene === 3 ? [0.4, 0.45, 1.03] : l.scene === 4 ? [0.3, 0.55, 1.1] : (i >= S.length - 3 ? [0.55, 0.3, 0.95] : [0.4, 0.45, 1.0]);
const gen = async (text, [stability, style, speed], out) => {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_128`, {
    method: "POST", headers: { "xi-api-key": KEY, "content-type": "application/json" },
    body: JSON.stringify({ text, model_id: "eleven_multilingual_v2", voice_settings: { stability, similarity_boost: 0.8, style, use_speaker_boost: true, speed } }),
  });
  if (!r.ok) throw new Error(out + " " + r.status + " " + (await r.text()).slice(0, 160));
  fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
};
const rows = [];
for (let i = 0; i < S.length; i++) {
  const f = `audio-build/voice/${S[i].id}.mp3`, win = (i + 1 < S.length ? S[i + 1].start_real_ms : 175000) - S[i].start_real_ms;
  let feel = FEEL(S[i], i); await gen(S[i].text, feel, f);
  let d = dur(f);
  if (d > win - 120) { feel = [feel[0], feel[1], 1.15]; await gen(S[i].text, feel, f); d = dur(f); }   // one retry, faster (max 1.15)
  rows.push({ id: S[i].id, scene: S[i].scene, start: S[i].start_real_ms, dur: Math.round(d), win, speed: feel[2], fits: d <= win - 100 });
}
fs.writeFileSync("audio-build/voice-fit.json", JSON.stringify(rows, null, 1));
console.log("id   sc  start   dur  window speed fits");
for (const r of rows) console.log(r.id, String(r.scene).padStart(2), String(r.start).padStart(6), String(r.dur).padStart(5), String(r.win).padStart(5), String(r.speed).padStart(5), r.fits ? "yes" : "NO");
