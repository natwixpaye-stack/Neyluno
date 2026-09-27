/** V3 audit harness — console errors, overflow, overlays, storage resilience, screenshots. */
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const BASE = 'http://127.0.0.1:4321';
const out = (x) => console.log(x);

const routes = fs
  .readFileSync('dist/sitemap.xml', 'utf8')
  .match(/<loc>[^<]+<\/loc>/g)
  .map((m) => new URL(m.replace(/<[^>]+>/g, '')).pathname)
  .concat(['/outils/compresser-image/', '/a-propos/', '/confidentialite/', '/mentions-legales/', '/outils/', '/nowhere-404/', '/categories/', '/about/', '/privacy/', '/legal/', '/guides/', '/workflows/']);

const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });

/* ---------- 1. console/page errors on every route ---------- */
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const issues = [];
  page.on('pageerror', (e) => issues.push(`pageerror ${page.url().replace(BASE, '')}: ${String(e).slice(0, 140)}`));
  page.on('console', (m) => {
    if (m.type() === 'error') issues.push(`console ${page.url().replace(BASE, '')}: ${m.text().slice(0, 140)}`);
  });
  for (const r of routes) {
    await page.goto(BASE + r, { waitUntil: 'load' });
    await page.waitForTimeout(250);
  }
  out('== CONSOLE/PAGE ERRORS ==');
  out(issues.length ? issues.join('\n') : '(none)');
  await page.close();
}

/* ---------- 2. horizontal overflow per width ---------- */
{
  const keyPages = ['/', '/tools/', '/tools/image-compressor/', '/tools/word-counter/', '/tools/qr-code-generator/', '/workflows/', '/guides/reduce-image-size-for-email/', '/tools/merge-pdf/', '/tools/date-calculator/'];
  const widths = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920];
  out('== HORIZONTAL OVERFLOW ==');
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 800 } });
    for (const p of keyPages) {
      await page.goto(BASE + p, { waitUntil: 'load' });
      const bad = await page.evaluate(() => {
        const docW = document.documentElement.clientWidth;
        if (document.documentElement.scrollWidth <= docW) return null;
        // find widest offenders
        const off = [];
        document.querySelectorAll('*').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.right > docW + 1 || r.left < -1) {
            if (off.length < 3) off.push(`${el.tagName}.${String(el.className).slice(0, 30)} right=${Math.round(r.right)}`);
          }
        });
        return `${document.documentElement.scrollWidth}>${docW} :: ${off.join(' | ')}`;
      });
      if (bad) out(`  ${w}px ${p} → ${bad}`);
    }
    await page.close();
  }
  out('  (only problems listed)');
}

/* ---------- 3. overlay behaviors ---------- */
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(BASE + '/', { waitUntil: 'load' });
  out('== OVERLAYS ==');

  // search modal
  await page.keyboard.press('Control+k');
  await page.waitForTimeout(200);
  out('modal open after Ctrl+K: ' + (await page.evaluate(() => !document.querySelector('[data-search-overlay]').hidden)));
  out('body overflow while open: ' + (await page.evaluate(() => document.body.style.overflow)));
  // focus inside?
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  out('focus still in modal after 2 Tabs: ' + (await page.evaluate(() => !!document.activeElement.closest('.modal'))));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  out('modal closed after Escape: ' + (await page.evaluate(() => document.querySelector('[data-search-overlay]').hidden)));
  out('body overflow restored: ' + JSON.stringify(await page.evaluate(() => document.body.style.overflow)));

  // slash shortcut
  await page.keyboard.press('/');
  await page.waitForTimeout(200);
  out('"/" opens search: ' + (await page.evaluate(() => !document.querySelector('[data-search-overlay]').hidden)));
  await page.keyboard.press('Escape');

  // mobile nav at small viewport
  await page.setViewportSize({ width: 390, height: 800 });
  await page.click('[data-nav-toggle]');
  await page.waitForTimeout(150);
  out('mobile nav open: ' + (await page.evaluate(() => !document.getElementById('mobile-nav').hidden)));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  out('mobile nav closed by Escape: ' + (await page.evaluate(() => document.getElementById('mobile-nav').hidden)));
  await page.close();
}

/* ---------- 4. corrupted localStorage resilience ---------- */
{
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 120)));
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.evaluate(() => {
    localStorage.setItem('qt-favorites', '{{{not json');
    localStorage.setItem('qt-recents', '42');
    localStorage.setItem('qt-workflows', '["nope"');
    localStorage.setItem('qt-theme', 'neon');
  });
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(400);
  const heroVisible = await page.evaluate(() => !!document.querySelector('.hero h1'));
  out('== STORAGE RESILIENCE ==');
  out('hero renders with corrupted storage: ' + heroVisible);
  out('pageerrors: ' + (errs.length ? errs.join(' | ') : '(none)'));
  await page.close();
}

/* ---------- 5. screenshots ---------- */
{
  fs.mkdirSync('audit', { recursive: true });
  const shots = [
    ['/', 1440, 900, 'home-desktop-dark'],
    ['/', 375, 800, 'home-mobile-dark'],
    ['/tools/image-compressor/', 1440, 900, 'tool-desktop-dark'],
    ['/tools/image-compressor/', 375, 800, 'tool-mobile-dark'],
    ['/workflows/', 1440, 900, 'workflows-desktop-dark'],
    ['/workflows/', 375, 800, 'workflows-mobile-dark'],
    ['/guides/reduce-image-size-for-email/', 1440, 900, 'guide-desktop-dark'],
    ['/tools/word-counter/', 1440, 900, 'stool-desktop-dark'],
  ];
  for (const [path, w, h, name] of shots) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto(BASE + path, { waitUntil: 'load' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `audit/${name}.png`, fullPage: name.startsWith('home') });
    await page.close();
  }
  // light theme variants
  for (const [path, name] of [['/', 'home-desktop-light'], ['/tools/image-compressor/', 'tool-desktop-light']]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(BASE + path, { waitUntil: 'load' });
    await page.evaluate(() => localStorage.setItem('qt-theme', 'light'));
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `audit/${name}.png` });
    await page.close();
  }
  out('== SCREENSHOTS == written to audit/');
}

await browser.close();
out('AUDIT DONE');
