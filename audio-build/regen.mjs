// Regenerate chosen lines (ids as arguments) and re-check each with speech-to-text until it matches the script (up to 5 tries).
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const env = fs.readFileSync("/Users/marcmatlioski/Desktop/loyalty-pwa/loyalty-pwa 2/.env.local", "utf8");
const KEY = env.match(/^ELEVENLABS_API_KEY=(.*)$/m)[1].trim().replace(/^["']|["']$/g, "");
const VOICE = "lhoxUh835Ntz9NEE6xoB";
const S = JSON.parse(fs.readFileSync("audio-build/script.json", "utf8")), R = JSON.parse(fs.readFileSync("audio-build/voice-fit.json", "utf8"));
const dur = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString()) * 1000;
const NUM = { "11":"eleven","15":"fifteen","14":"fourteen","30":"thirty","54":"fifty-four","70":"seventy" };
const norm = (t) => t.toLowerCase().replace(/[^a-z0-9' -]/g, " ").replace(/\b\d+\b/g, (m) => NUM[m] || m).replace(/-/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
for (const id of process.argv.slice(2)) {
  const i = S.findIndex((l) => l.id === id), l = S[i], win = (i + 1 < S.length ? S[i + 1].start_real_ms : 175000) - l.start_real_ms, f = `audio-build/voice/${id}.mp3`;
  const base = R[i].speed;
  for (let t = 0; t < 5; t++) {
    const speed = Math.min(1.15, +(base + t * 0.02).toFixed(2));
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_128`, { method: "POST", headers: { "xi-api-key": KEY, "content-type": "application/json" }, body: JSON.stringify({ text: l.text, model_id: "eleven_multilingual_v2", voice_settings: { stability: l.scene === 2 ? 0.5 : 0.4, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true, speed } }) });
    fs.writeFileSync(f, Buffer.from(await r.arrayBuffer()));
    const fd = new FormData(); fd.append("model_id", "scribe_v1"); fd.append("file", new Blob([fs.readFileSync(f)]), "x.mp3");
    const heard = norm(((await (await fetch("https://api.elevenlabs.io/v1/speech-to-text", { method: "POST", headers: { "xi-api-key": KEY }, body: fd })).json()).text) || ""), want = norm(l.text);
    const extra = heard.filter((w) => !want.includes(w)), d = dur(f);
    console.log(id, "try", t + 1, "speed", speed, "dur", Math.round(d), "window", win, "extra words:", extra.join(",") || "none", "|", heard.join(" "));
    if (!extra.length && d <= win - 100) { Object.assign(R[i], { dur: Math.round(d), speed, win, fits: true }); break; }
  }
}
fs.writeFileSync("audio-build/voice-fit.json", JSON.stringify(R, null, 1));
