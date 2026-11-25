// ONE-TIME TOOL (2026-11-25): download the exact Google Fonts files the site used through next/font/google, so the build never has to
// fetch them again (a Vercel build of 3cf3d98 failed when that download failed). It asks Google with next/font's OWN url builder and the
// same options each font used, keeps the "latin" faces (the subset every call asked for — next/font preloaded exactly these), and writes
// them to src/fonts/<family>/ plus src/fonts/manifest.json (family → [{file, weight, style}]). All of these fonts are SIL OFL 1.1, which
// allows self-hosting. Re-run only to change a font: node scripts/fonts/fetch-google-fonts.mjs
import { createRequire } from 'module';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
const require = createRequire(import.meta.url);
const G = 'next/dist/compiled/@next/font/dist/google/';
const { getFontAxes } = require(G + 'get-font-axes');
const { getGoogleFontsUrl } = require(G + 'get-google-fonts-url');

/* every next/font/google call the site made (src/app/layout.tsx, src/lib/fonts.ts, src/lib/fonts-rentals.ts,
   src/app/smartassistant/hoa/page.tsx, src/components/new-home/Newsprint.tsx) */
const FONTS = [
  { family: 'Sora', weights: ['variable'], styles: ['normal'] },
  { family: 'Libre Baskerville', weights: ['400', '700'], styles: ['normal', 'italic'] },
  { family: 'Cormorant Garamond', weights: ['300', '400', '500', '600'], styles: ['normal', 'italic'] },
  { family: 'Inter', weights: ['400', '500', '600'], styles: ['normal'] },
  { family: 'Fraunces', weights: ['400', '500', '600', '700'], styles: ['normal', 'italic'] },
  { family: 'Instrument Serif', weights: ['400'], styles: ['normal', 'italic'] },
  { family: 'Schibsted Grotesk', weights: ['400', '500', '600', '700', '800'], styles: ['normal'] },
  { family: 'Caveat', weights: ['variable'], styles: ['normal'] },
  { family: 'UnifrakturCook', weights: ['700'], styles: ['normal'] },
];
/* the user agent next/font sends, so Google answers with woff2 */
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36';
const OUT = join(process.cwd(), 'src/fonts');
const manifest = {};
for (const f of FONTS) {
  const axes = getFontAxes(f.family, f.weights, f.styles, undefined);
  const url = getGoogleFontsUrl(f.family, axes, 'swap');
  const css = await (await fetch(url, { headers: { 'user-agent': UA } })).text();
  const slug = f.family.toLowerCase().replace(/\s+/g, '-');
  mkdirSync(join(OUT, slug), { recursive: true });
  /* each @font-face exactly as Google declared it (one per requested weight and style — for a variable font every one of them points at
     the SAME file, so that file is saved once and listed once per face, which is what the browser matched against before) */
  const files = new Map(); const faces = [];
  for (const m of css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*{([^}]*)}/g)) {
    if (m[1] !== 'latin') continue;
    const body = m[2];
    const style = /font-style:\s*(\w+)/.exec(body)[1];
    const weight = /font-weight:\s*([\d ]+);/.exec(body)[1].trim();
    const src = /url\(([^)]+\.woff2)\)/.exec(body)[1];
    if (!files.has(src)) {
      const file = `${slug}/${slug}-${style}-${files.size + 1}.woff2`;
      const buf = Buffer.from(await (await fetch(src)).arrayBuffer());
      writeFileSync(join(OUT, file), buf); files.set(src, { file, bytes: buf.length });
    }
    faces.push({ file: files.get(src).file, weight, style, from: src });
  }
  manifest[f.family] = { request: url, faces };
  console.log(f.family, faces.map(x => `${x.weight} ${x.style} → ${x.file}`).join(' · '));
}
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
