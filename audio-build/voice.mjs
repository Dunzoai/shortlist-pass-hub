// One mp3 per narration line, in Shorty's voice (Fughedaboutit, eleven_multilingual_v2). Windows = time until the next line starts (real ms).
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const env = fs.readFileSync("/Users/marcmatlioski/Desktop/loyalty-pwa/loyalty-pwa 2/.env.local", "utf8");
const KEY = env.match(/^ELEVENLABS_API_KEY=(.*)$/m)[1].trim().replace(/^["']|["']$/g, "");
const VOICE = "lhoxUh835Ntz9NEE6xoB";
const N = JSON.parse(fs.readFileSync("audio-build/narration.json", "utf8"));
const dur = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString()) * 1000;
const gen = async (text, speed, out) => {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_128`, {
    method: "POST", headers: { "xi-api-key": KEY, "content-type": "application/json" },
    body: JSON.stringify({ text, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true, speed } }),
  });
  if (!r.ok) throw new Error(out + " " + r.status + " " + (await r.text()).slice(0, 160));
  fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
};
const rows = [];
for (let i = 0; i < N.length; i++) {
  const f = `audio-build/voice/${String(i + 1).padStart(2, "0")}.mp3`;
  const win = (i + 1 < N.length ? N[i + 1].real_ms : 175000) - N[i].real_ms;
  if (!fs.existsSync(f)) await gen(N[i].line, 1.0, f);
  let d = dur(f), speed = 1.0;
  if (d > win - 150) { speed = 1.15; await gen(N[i].line, speed, f); d = dur(f); }
  rows.push({ i: i + 1, scene: N[i].scene, start: N[i].real_ms, dur: Math.round(d), win, speed, fits: d <= win - 100 });
}
fs.writeFileSync("audio-build/voice-fit.json", JSON.stringify(rows, null, 1));
console.log("line scene start dur window speed fits");
for (const r of rows) console.log(String(r.i).padStart(2), r.scene, String(r.start).padStart(6), String(r.dur).padStart(5), String(r.win).padStart(5), r.speed, r.fits ? "yes" : "NO");
