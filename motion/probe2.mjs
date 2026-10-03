import { chromium } from 'playwright-core';
import path from 'node:path'; import fs from 'node:fs';
const __dirname = 'motion';
const EXEC = '/home/user/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome';
const b = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });
for (const [W, H, tag] of [[1080, 1920, '916'], [1080, 1080, '11']]) {
  const page = await b.newPage({ viewport: { width: W, height: H } });
  await page.goto(`file://${path.resolve('motion/scenes/promo.html')}?lang=fr`);
  const TL = JSON.parse(fs.readFileSync('motion/timeline-fr.json'));
  await page.evaluate((tl) => { window.__TL = tl; }, TL);
  for (const [t, name] of [[5000, 'a'], [16000, 'b'], [24000, 'c'], [28000, 'd'], [33000, 'e']]) {
    await page.evaluate((tt) => window.seek(tt), t);
    await page.screenshot({ path: `motion/probe-${tag}-${name}.png` });
  }
  await page.close();
}
await b.close();
console.log('portrait probes done');
