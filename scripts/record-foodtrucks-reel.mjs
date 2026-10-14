/**
 * Renders the 25 s Instagram Reel (dev route /dev/foodtrucks-reel) to docs/features/foodtrucks-reel/:
 *   shorty-foodtrucks-reel-1080x1920.mp4 (H.264 + AAC, 30 fps) and shorty-foodtrucks-reel-cover.jpg
 *   node scripts/record-foodtrucks-reel.mjs [baseUrl]      (baseUrl: a running `next dev`, default http://localhost:3000)
 * Deterministic: the page draws frame t on demand (window.__reelSeek), one screenshot per 1/30 s, then ffmpeg encodes.
 * Audio is mixed by ffmpeg from the page's own cue list (voice, effects, music), never captured from the browser.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
const PW = process.env.PLAYWRIGHT_PATH || "/Users/marcmatlioski/Desktop/loyalty-pwa/loyalty-pwa 2/node_modules/playwright/index.mjs";
const { chromium } = await import(PW);
const base = process.argv[2] || "http://localhost:3000";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT = path.join(ROOT, "docs/features/foodtrucks-reel"), AUD = path.join(OUT, "audio");
const FPS = 30;
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "reel-"));
const b = await chromium.launch();
const page = await (await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })).newPage();
await page.goto(`${base}/dev/foodtrucks-reel`, { waitUntil: "load" });
await page.waitForFunction(() => window.__reelReady === true, null, { timeout: 60000 });
await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
await page.waitForTimeout(1000);
const meta = await page.evaluate(() => window.__reelCues);
const n = Math.round(meta.total * FPS);
console.log("frames:", n);
for (let i = 0; i < n; i++) {
  await page.evaluate((t) => window.__reelSeek(t), i / FPS);
  await page.screenshot({ path: path.join(dir, String(i).padStart(5, "0") + ".png") });
  if (i % 100 === 0) console.log(i, "/", n);
}
/* the cover: his knock pose with the hook line on it */
const cp = await (await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })).newPage();
await cp.goto(`${base}/dev/foodtrucks-reel?cover=0.2`, { waitUntil: "load" });
await cp.waitForFunction(() => window.__reelReady === true, null, { timeout: 60000 });
await cp.addStyleTag({ content: "nextjs-portal{display:none!important}" });
await cp.evaluate(() => { for (const d of [0.4, 0.25, 0.1, 0]) window.__reelSeek(0.2 - d * 0.2); window.__reelSeek(0.2); });
await cp.waitForTimeout(500);
await cp.screenshot({ path: path.join(dir, "cover.png") });
await b.close();
execFileSync("ffmpeg", ["-y", "-v", "error", "-i", path.join(dir, "cover.png"), "-q:v", "2", path.join(OUT, "shorty-foodtrucks-reel-cover.jpg")]);

/* sound: every cue at its time, music ducked under the voice, a short fade at the very end for a clean loop */
const inputs = [], chains = [], labels = [];
const voices = meta.cues.filter((c) => c.kind === "voice");
const duck = voices.map((v) => `between(t,${(v.at).toFixed(2)},${(v.at + 3.3).toFixed(2)})`);   // coarse; refined below with exact durations
const dur = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
const vwin = voices.map((v) => `between(t,${v.at.toFixed(3)},${(v.at + dur(path.join(AUD, v.src))).toFixed(3)})`).join("+") || "0";
void duck;
meta.cues.forEach((c, k) => {
  inputs.push("-i", path.join(AUD, c.src));
  const len = Math.min(c.dur ?? 99, meta.total - c.at);
  const vol = c.kind === "music" ? `volume='${c.vol}*(1-0.55*min(1,${vwin}))':eval=frame` : `volume=${c.vol}`;
  const fade = c.kind === "music" ? `,afade=t=out:st=${(len - 0.7).toFixed(2)}:d=0.7` : "";
  const ms = Math.round(c.at * 1000);
  chains.push(`[${k}:a]atrim=0:${len.toFixed(3)},asetpts=PTS-STARTPTS,${vol}${fade},adelay=${ms}|${ms}[a${k}]`);
  labels.push(`[a${k}]`);
});
const wav = path.join(dir, "mix.wav");
execFileSync("ffmpeg", ["-y", "-v", "error", ...inputs, "-filter_complex", chains.join(";") + `;${labels.join("")}amix=inputs=${labels.length}:normalize=0:duration=longest,alimiter=limit=0.95,afade=t=out:st=${(meta.total - 0.25).toFixed(2)}:d=0.25,atrim=0:${meta.total.toFixed(3)}[out]`, "-map", "[out]", "-ar", "44100", "-ac", "2", wav], { stdio: "inherit" });
const mp4 = path.join(OUT, "shorty-foodtrucks-reel-1080x1920.mp4");
execFileSync("ffmpeg", ["-y", "-v", "error", "-framerate", String(FPS), "-i", path.join(dir, "%05d.png"), "-i", wav, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-profile:v", "high", "-crf", "18", "-preset", "slow", "-r", String(FPS), "-movflags", "+faststart", "-c:a", "aac", "-b:a", "192k", "-shortest", mp4], { stdio: "inherit" });
fs.mkdirSync(path.join(OUT, "frames-check"), { recursive: true });
fs.rmSync(dir, { recursive: true, force: true });
console.log("wrote", mp4);
