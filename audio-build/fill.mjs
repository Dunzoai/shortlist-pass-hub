// Second pass: any line followed by more than 1.4 s of silence is regenerated a little slower (never below 0.85) so it fills more of its window. Words unchanged.
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const env = fs.readFileSync("/Users/marcmatlioski/Desktop/loyalty-pwa/loyalty-pwa 2/.env.local", "utf8");
const KEY = env.match(/^ELEVENLABS_API_KEY=(.*)$/m)[1].trim().replace(/^["']|["']$/g, "");
const VOICE = "lhoxUh835Ntz9NEE6xoB";
const S = JSON.parse(fs.readFileSync("audio-build/script.json", "utf8")), R = JSON.parse(fs.readFileSync("audio-build/voice-fit.json", "utf8"));
const dur = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString()) * 1000;
const FEEL = (l, i) => l.scene === 1 ? [0.35, 0.5] : l.scene === 2 ? (i < 7 ? [0.6, 0.15] : [0.33, 0.55]) : l.scene === 3 ? [0.4, 0.45] : l.scene === 4 ? [0.3, 0.55] : (i >= S.length - 3 ? [0.55, 0.3] : [0.4, 0.45]);
for (let i = 0; i < R.length - 1; i++) {
  const gap = R[i + 1].start - (R[i].start + R[i].dur);
  if (gap <= 1400) continue;
  const speed = Math.max(0.85, +(R[i].speed * R[i].dur / (R[i].dur + gap - 700)).toFixed(2));
  if (speed >= R[i].speed - 0.02) continue;
  const f = `audio-build/voice/${R[i].id}.mp3`, [stability, style] = FEEL(S[i], i);
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_128`, { method: "POST", headers: { "xi-api-key": KEY, "content-type": "application/json" }, body: JSON.stringify({ text: S[i].text, model_id: "eleven_multilingual_v2", voice_settings: { stability, similarity_boost: 0.8, style, use_speaker_boost: true, speed } }) });
  if (!r.ok) throw new Error(r.status);
  fs.writeFileSync(f, Buffer.from(await r.arrayBuffer()));
  const d = dur(f); R[i].dur = Math.round(d); R[i].speed = speed; R[i].fits = d <= R[i].win - 100;
  console.log(R[i].id, "speed", speed, "dur", Math.round(d), "win", R[i].win, R[i].fits ? "fits" : "TOO LONG");
}
fs.writeFileSync("audio-build/voice-fit.json", JSON.stringify(R, null, 1));
