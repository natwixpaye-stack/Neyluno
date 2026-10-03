import { chromium } from 'playwright-core';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXEC = '/home/user/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome';
const TL = { a0:1200, a1:11070, b0:11970, b1:18160, c0:19060, c1:25330, d0:26230, d1:29630, e0:30530, e1:34630, total:38500 };
const b = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });
const page = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(`file://${__dirname}/scenes/promo.html?lang=en`);
await page.evaluate((tl) => { window.__TL = tl; }, TL);
const shots = [
  [1600, 'ghosts'], [4200, 'compress'], [6400, 'edit'], [8300, 'convert'], [10200, 'calc'],
  [15500, 'hub'], [22000, 'flow-typed'], [24800, 'flow-result'], [27800, 'count43'], [33500, 'logo'],
];
for (const [t, name] of shots) {
  await page.evaluate((tt) => window.seek(tt), t);
  await page.screenshot({ path: `${__dirname}/probe-${name}.png` });
}
await b.close();
console.log('done');
