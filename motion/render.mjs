/**
 * QuickTools promo renderer — deterministic frame capture.
 * Usage: node motion/render.mjs <en|fr> <16x9|9x16|1x1>
 * Loads motion/scenes/promo.html, injects the audio-derived timeline,
 * seeks frame by frame, screenshots, encodes H.264 (no audio — mixed later).
 */
import { chromium } from 'playwright-core';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXEC = process.env.CHROMIUM_EXECUTABLE || '/home/user/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome';
const FPS = 30;

const lang = process.argv[2] || 'en';
const aspect = process.argv[3] || '16x9';
const SIZES = { '16x9': [1920, 1080], '9x16': [1080, 1920], '1x1': [1080, 1080] };
const [W, H] = SIZES[aspect];

/* Audio clip durations (ffprobe-measured) → build the timeline */
const DURS = {
  en: [9.874286, 6.19102, 6.269388, 3.395918, 4.101224],
  fr: [10.475102, 7.131429, 5.407347, 2.899592, 3.604898],
}[lang];
const INTRO = 1.2, GAP = 0.9, TAIL = 3.9;
const sec = (arr) => {
  const ms = arr.map((s) => Math.round(s * 1000));
  const a0 = INTRO * 1000, a1 = a0 + ms[0];
  const b0 = a1 + GAP * 1000, b1 = b0 + ms[1];
  const c0 = b1 + GAP * 1000, c1 = c0 + ms[2];
  const d0 = c1 + GAP * 1000, d1 = d0 + ms[3];
  const e0 = d1 + GAP * 1000, e1 = e0 + ms[4];
  return { a0, a1, b0, b1, c0, c1, d0, d1, e0, e1, total: e1 + TAIL * 1000 };
};
const TL = sec(DURS);
fs.writeFileSync(path.join(__dirname, `timeline-${lang}.json`), JSON.stringify(TL, null, 2));

const framesDir = path.join(__dirname, 'frames', `${lang}-${aspect}`);
fs.rmSync(framesDir, { recursive: true, force: true });
fs.mkdirSync(framesDir, { recursive: true });

const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox', '--force-color-profile=srgb', '--disable-lcd-text'] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto(`file://${path.join(__dirname, 'scenes/promo.html')}?lang=${lang}`);
await page.evaluate((tl) => { window.__TL = tl; }, TL);
await page.evaluate(() => window.seek(0));

const frames = Math.ceil((TL.total / 1000) * FPS);
console.log(`Rendering ${frames} frames @ ${W}x${H} (${lang}, ${aspect}) — total ${(TL.total / 1000).toFixed(2)}s`);

for (let i = 0; i < frames; i++) {
  const t = (i / FPS) * 1000;
  await page.evaluate((tt) => window.seek(tt), t);
  await page.screenshot({ path: path.join(framesDir, `f_${String(i).padStart(5, '0')}.png`), animations: 'disabled' });
  if (i % 150 === 0) console.log(`  frame ${i}/${frames} (t=${(t / 1000).toFixed(1)}s)`);
}
await browser.close();

const out = path.join(__dirname, 'out', `quicktools-promo-${lang}-${aspect}-video.mp4`);
fs.mkdirSync(path.dirname(out), { recursive: true });
execSync(
  `ffmpeg -y -framerate ${FPS} -i "${framesDir}/f_%05d.png" -c:v libx264 -pix_fmt yuv420p -crf 17 -preset slow -movflags +faststart "${out}"`,
  { stdio: 'inherit' }
);
console.log('Video (no audio):', out);
