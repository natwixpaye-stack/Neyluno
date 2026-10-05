import { chromium } from 'playwright-core';
import path from 'node:path';
const EXEC = '/home/user/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome';
const b = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });
const page = await b.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto('file://' + path.resolve('motion/brand/og.html'));
await page.screenshot({ path: 'public/og-cover.png' });
await b.close();
console.log('og-cover regenerated');
