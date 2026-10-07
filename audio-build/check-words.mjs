// Speech-to-text every voice line and flag extra or missing words versus the script (catches stray "yeah, so" the voice sometimes adds).
import fs from "node:fs";
const env = fs.readFileSync("/Users/marcmatlioski/Desktop/loyalty-pwa/loyalty-pwa 2/.env.local", "utf8");
const KEY = env.match(/^ELEVENLABS_API_KEY=(.*)$/m)[1].trim().replace(/^["']|["']$/g, "");
const S = JSON.parse(fs.readFileSync("audio-build/script.json", "utf8"));
const NUM = { "0":"zero","1":"one","2":"two","3":"three","4":"four","5":"five","6":"six","7":"seven","8":"eight","9":"nine","10":"ten","11":"eleven","15":"fifteen","14":"fourteen","30":"thirty","54":"fifty-four","70":"seventy","24":"twenty-four" };
const norm = (t) => t.toLowerCase().replace(/[^a-z0-9' -]/g, " ").replace(/\b\d+\b/g, (m) => NUM[m] || m).replace(/-/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
const only = process.argv.slice(2);
let bad = 0;
for (const l of S) {
  if (only.length && !only.includes(l.id)) continue;
  const fd = new FormData(); fd.append("model_id", "scribe_v1"); fd.append("file", new Blob([fs.readFileSync(`audio-build/voice/${l.id}.mp3`)]), `${l.id}.mp3`);
  const r = await fetch("https://api.elevenlabs.io/v1/speech-to-text", { method: "POST", headers: { "xi-api-key": KEY }, body: fd });
  const heard = norm((await r.json()).text || ""), want = norm(l.text);
  const extra = heard.filter((w) => !want.includes(w)), missing = want.filter((w) => !heard.includes(w));
  const ok = extra.length === 0 && missing.length === 0;
  if (!ok) { bad++; console.log(l.id, "HEARD:", heard.join(" "), "| extra:", extra.join(","), "| missing:", missing.join(",")); }
}
console.log(only.length ? "checked " + only.join(",") : "checked all", "- lines with differences:", bad);
