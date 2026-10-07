// Retime: voice for scenes 1, 3, 4 is generated per caption (one line per picture beat), measured, and each scene gets only as much slowdown as it needs.
// Writes audio-build/timeline.json (per-scene speed, caption offsets) and a new script.json (real ms starts). Scenes 2 and 5 keep their lines (their clip offsets are kept).
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const env = fs.readFileSync("/Users/marcmatlioski/Desktop/loyalty-pwa/loyalty-pwa 2/.env.local", "utf8");
const KEY = env.match(/^ELEVENLABS_API_KEY=(.*)$/m)[1].trim().replace(/^["']|["']$/g, "");
const VOICE = "lhoxUh835Ntz9NEE6xoB";
const START = [0, 20000, 58000, 88000, 118000], DUR = [20000, 38000, 30000, 30000, 22000];
const old = JSON.parse(fs.readFileSync("audio-build/old-v4/script.json", "utf8"));
// v = the picture beat (clip ms inside the scene); text = what Shorty says (and the caption shows)
const BEATS = {
  0: [[600, "Hey, come on in! Name's Shorty. The board member who never clocks out."], [5200, "Watch this. The board uploads the rules, and boom, it's in my head."], [8300, "Management, phone numbers, links, food truck night, bingo. All of it, straight in."], [14000, "Trained on your official documents and information. Ready to talk day or night. Ask me anything, twenty-four seven."]],
  2: [[600, "Now meet Betty. Seventy years young, and she lives for bingo."], [6200, "Management company emails? She never opens them. Industry average: one in ten. Betty's one of the nine."], [9000, "And the gym, where they pin up the news? Betty doesn't go."], [11800, "So she's missing everything. Bingo night, and she'd never know."], [14200, "Now it all lands right on her phone."], [17400, "She spots her favorite event, and RSVPs right there."], [21200, "One tap, and she's in. Fourteen left!"], [24800, "Betty's happy. Communication inside one sticky app fed her exactly what she wanted to do."]],
  3: [[500, "Meanwhile, Shorty runs the office. It lives in the app residents actually use, not just where they pay dues."], [3700, "So I get to work. Weekly newsletter? Automated from your events list, sent to everyone."], [6500, "Burn ban today? One text, and every phone lights up."], [11300, "Resident reports? I read each one, alert the board in their dashboard, and can email the list to your management company."], [16300, "Food truck outside the clubhouse? One tap, lunch is ordered and paid."], [20500, "Yeah, it's that easy. Anything on site can be handled by the app, and the whole experience gets better."], [27000, "And Shorty never clocks out."]],
};
const FEEL = { 0: [0.35, 0.5, 1.0], 2: [0.4, 0.45, 1.0], 3: [0.3, 0.55, 1.05] };
const NUM = { "10": "ten", "14": "fourteen", "24": "twenty four", "70": "seventy" };
const norm = (t) => t.toLowerCase().replace(/[^a-z0-9' -]/g, " ").replace(/\b\d+\b/g, (m) => NUM[m] || m).replace(/-/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
const dur = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString()) * 1000;
const tts = async (text, [stability, style, speed], f) => { const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_128`, { method: "POST", headers: { "xi-api-key": KEY, "content-type": "application/json" }, body: JSON.stringify({ text, model_id: "eleven_multilingual_v2", voice_settings: { stability, similarity_boost: 0.8, style, use_speaker_boost: true, speed } }) }); if (!r.ok) throw new Error(r.status); fs.writeFileSync(f, Buffer.from(await r.arrayBuffer())); };
const stt = async (f) => { const fd = new FormData(); fd.append("model_id", "scribe_v1"); fd.append("file", new Blob([fs.readFileSync(f)]), "x.mp3"); return ((await (await fetch("https://api.elevenlabs.io/v1/speech-to-text", { method: "POST", headers: { "xi-api-key": KEY }, body: fd })).json()).text) || ""; };
// ---- time warp: each picture beat gets the real time its narration needs (never less than the original 1.25x pace) ----
const BASE = 1.25, durs = {};
for (const sc of [0, 2, 3]) {
  durs[sc] = [];
  for (let k = 0; k < BEATS[sc].length; k++) {
    const [, text] = BEATS[sc][k], id = `S${sc + 1}-${k + 1}`, f = `audio-build/voice/${id}.mp3`;
    let best = null;
    if (fs.existsSync(f) && !process.env.REGEN) best = dur(f);
    for (let t = 0; !best && t < 4; t++) {
      await tts(text, FEEL[sc], f); const want = norm(text), heard = norm(await stt(f)), extra = heard.filter((w) => !want.includes(w));
      if (!extra.length) best = dur(f); else console.log(id, "retry (extra words:", extra.join(","), ")");
    }
    durs[sc].push(best ?? dur(f));
  }
}
const segs = [];   // { c0: clip ms start, c1: clip ms end, r0: real ms start, r1: real ms end }
let r = 0; const lineStarts = {};
for (let sc = 0; sc < 5; sc++) {
  const c0 = START[sc], c1 = START[sc] + DUR[sc];
  if (!BEATS[sc]) { segs.push({ c0, c1, r0: r, r1: r + (c1 - c0) * BASE }); r += (c1 - c0) * BASE; continue; }
  const bs = BEATS[sc], lead = bs[0][0];
  segs.push({ c0, c1: c0 + lead, r0: r, r1: r + lead * BASE }); r += lead * BASE;
  bs.forEach(([v], k) => {
    const next = k + 1 < bs.length ? bs[k + 1][0] : DUR[sc], base = (next - v) * BASE, need = durs[sc][k] + (k + 1 < bs.length ? 350 : 500);
    const len = Math.max(base, need);
    segs.push({ c0: c0 + v, c1: c0 + next, r0: r, r1: r + len, beat: `S${sc + 1}-${k + 1}` }); lineStarts[`S${sc + 1}-${k + 1}`] = r + 80; r += len;
  });
}
const total = r;
const c2r = (c) => { for (const g of segs) if (c >= g.c0 && c <= g.c1) return g.r0 + (c - g.c0) * (g.r1 - g.r0) / (g.c1 - g.c0); return total; };
const script = [];
for (const sc of [0, 2, 3]) BEATS[sc].forEach(([, text], k) => script.push({ id: `S${sc + 1}-${k + 1}`, scene: sc + 1, start_real_ms: Math.round(lineStarts[`S${sc + 1}-${k + 1}`]), text }));
for (const x of old) if (x.scene === 2 || x.scene === 5) { const clip = START[x.scene - 1] + (x.start_real_ms - START[x.scene - 1] * 1.25) / 1.25; script.push({ id: x.id, scene: x.scene, start_real_ms: Math.round(c2r(clip)), text: x.text }); }
script.sort((a, b) => a.start_real_ms - b.start_real_ms);
const speeds = segs.filter((g) => g.beat).map((g) => ({ beat: g.beat, speed: +((g.r1 - g.r0) / (g.c1 - g.c0)).toFixed(2) }));
fs.writeFileSync("audio-build/timeline.json", JSON.stringify({ segments: segs.map((g) => ({ c0: g.c0, c1: g.c1, r0: Math.round(g.r0), r1: Math.round(g.r1) })), total_real_ms: Math.round(total), speeds }, null, 1));
fs.writeFileSync("audio-build/script.json", JSON.stringify(script, null, 1));
console.log("beat speeds (1.25 = original pace):", speeds.map((x) => x.beat + "=" + x.speed).join("  "));
console.log("total real seconds", (total / 1000).toFixed(1));
