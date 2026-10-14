/**
 * Records the /foodtrucks explainer as mp4 files (captions burned in), for posting.
 *   node scripts/record-foodtrucks-video.mjs [baseUrl] [wide|tall|both]
 * How: the page has a recording layout (?ftvCapture=wide|tall: no controls, driven by window.__ftvSeek). Playwright's fake clock
 * steps the page 1/30 s at a time (so Shorty's own animation stays in step), a frame is saved each step, and ffmpeg assembles them.
 * Headless Chromium can't capture sound, so the audio is mixed with ffmpeg from the page's own cue list (voice, effects, ambience,
 * music), at the same times and volumes the page uses.
 * Needs: ffmpeg, and Playwright (taken from PLAYWRIGHT_PATH, default the app repo's copy; no dependency is added to this repo).
 * Output: docs/features/foodtrucks-video/shorty-foodtrucks-1920x1080.mp4 and shorty-foodtrucks-1080x1350.mp4
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
const PW = process.env.PLAYWRIGHT_PATH || "/Users/marcmatlioski/Desktop/loyalty-pwa/loyalty-pwa 2/node_modules/playwright/index.mjs";
const { chromium } = await import(PW);
const base = process.argv[2] || "https://www.shortlistpass.com";
const which = process.argv[3] || "both";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT = path.join(ROOT, "docs/features/foodtrucks-video");
fs.mkdirSync(OUT, { recursive: true });
const FPS = 30;

async function frames(mode, w, h, dir) {
  fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch();
  const page = await (await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 })).newPage();
  await page.clock.install({ time: 0 });
  await page.goto(`${base}/foodtrucks?ftvCapture=${mode}`, { waitUntil: "load" });
  await page.waitForSelector('[aria-label^="Shorty explains"]');
  await page.waitForTimeout(2500);   // images and fonts
  await page.clock.pauseAt(5000);
  const meta = await page.evaluate(() => window.__ftvCues);
  const n = Math.ceil(meta.total * FPS);
  console.log(mode, "frames:", n);
  for (let i = 0; i < n; i++) {
    await page.evaluate((t) => window.__ftvSeek(t), i / FPS);
    await page.clock.runFor(1000 / FPS);
    await page.screenshot({ path: path.join(dir, String(i).padStart(5, "0") + ".jpg"), type: "jpeg", quality: 93 });
    if (i % 150 === 0) console.log(mode, i, "/", n);
  }
  await b.close();
  return meta;
}

function mixAudio(meta, wav) {
  const pub = path.join(ROOT, "public");
  const inputs = [], chains = [], labels = [];
  const add = (src, loop) => { inputs.push(...(loop ? ["-stream_loop", "-1"] : []), "-i", path.join(pub, src)); return inputs.filter((x) => x === "-i").length - 1; };
  const voices = meta.cues.filter((c) => c.key.startsWith("v-"));
  const duck = voices.map((v) => `between(t,${v.start.toFixed(2)},${v.end.toFixed(2)})`).join("+") || "0";
  meta.cues.forEach((c) => {
    const k = add(c.src, c.loop);
    const len = Math.min(c.end, meta.total) - c.start;
    const vol = c.key === "music" ? `volume='${c.vol}*(1-0.3*min(1,${duck}))':eval=frame` : `volume=${c.vol}`;
    chains.push(`[${k}:a]atrim=0:${len.toFixed(3)},asetpts=PTS-STARTPTS,${vol},adelay=${Math.round(c.start * 1000)}|${Math.round(c.start * 1000)}[a${k}]`);
    labels.push(`[a${k}]`);
  });
  const filter = chains.join(";") + `;${labels.join("")}amix=inputs=${labels.length}:normalize=0:duration=longest,alimiter=limit=0.95,atrim=0:${meta.total.toFixed(3)}[out]`;
  execFileSync("ffmpeg", ["-y", "-v", "error", ...inputs, "-filter_complex", filter, "-map", "[out]", "-ar", "44100", "-ac", "2", wav], { stdio: "inherit" });
}

for (const [mode, w, h, name] of [["wide", 1920, 1080, "shorty-foodtrucks-1920x1080.mp4"], ["tall", 1080, 1350, "shorty-foodtrucks-1080x1350.mp4"]]) {
  if (which !== "both" && which !== mode) continue;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ftv-" + mode + "-"));
  const meta = await frames(mode, w, h, dir);
  const wav = path.join(dir, "mix.wav");
  mixAudio(meta, wav);
  execFileSync("ffmpeg", ["-y", "-v", "error", "-framerate", String(FPS), "-i", path.join(dir, "%05d.jpg"), "-i", wav, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "medium", "-movflags", "+faststart", "-c:a", "aac", "-b:a", "192k", "-shortest", path.join(OUT, name)], { stdio: "inherit" });
  fs.rmSync(dir, { recursive: true, force: true });
  console.log("wrote", path.join(OUT, name));
}
