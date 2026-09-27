import { chromium } from 'playwright-core';
import fs from 'node:fs';
const BASE = 'http://127.0.0.1:4321';
fs.mkdirSync('audit', { recursive: true });
const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
async function shot(path, w, h, name, theme) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  if (theme) { await page.goto(BASE + path); await page.evaluate((t) => localStorage.setItem('qt-theme', t), theme); }
  await page.goto(BASE + path, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  // scroll through to trigger reveals
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 400) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 90)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `audit/${name}.png`, fullPage: true });
  await page.close();
}
await shot('/', 1440, 900, 'v3-home-dark', 'dark');
await shot('/', 1440, 900, 'v3-home-light', 'light');
await shot('/', 375, 800, 'v3-home-mobile-dark', 'dark');
await shot('/tools/image-compressor/', 1440, 900, 'v3-tool-dark', 'dark');
await shot('/workflows/', 1440, 900, 'v3-workflows-dark', 'dark');
await shot('/tools/date-calculator/', 1440, 900, 'v3-datecalc-dark', 'dark');
await browser.close();
console.log('shots done');
