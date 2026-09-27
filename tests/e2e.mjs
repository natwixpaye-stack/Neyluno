/**
 * End-to-end tests (Playwright) — QuickTools V2.
 * Requires: npm run build && npm run preview (port 4321), then node tests/e2e.mjs
 */
import { chromium } from 'playwright-core';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4321';
const EXEC = process.env.CHROMIUM_EXECUTABLE || null;

let pass = 0;
let fail = 0;
const failures = [];

async function ok(name, fn) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    pass++;
  } catch (err) {
    console.log(`  ❌ ${name}`);
    console.log(String(err.stack || err).split('\n').slice(0, 4).join('\n'));
    failures.push(name);
    fail++;
  }
}

const browser = await chromium.launch({
  executablePath: EXEC || undefined,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
page.setDefaultTimeout(15000);

console.log('\n=== QuickTools V2 e2e ===\n');

/* ================= HOME ================= */
console.log('Home');
await page.goto(BASE + '/');
await page.waitForSelector('h1');

await ok('hero headline “Get things done. Fast.”', async () => {
  const h1 = await page.locator('h1').innerText();
  if (!h1.includes('Get things done')) throw new Error(h1);
});

await ok('hero search bar present with placeholder', async () => {
  const ph = await page.getAttribute('[data-hero-search]', 'placeholder');
  if (!ph.includes('What do you want to do')) throw new Error(ph);
});

await ok('popular quick actions link to real tools', async () => {
  const href = await page.locator('.hero-chip').first().getAttribute('href');
  if (!href.startsWith('/tools/')) throw new Error(href);
  const res = await page.request.get(BASE + href);
  if (res.status() !== 200) throw new Error(`status ${res.status()}`);
});

await ok('tools grid renders 30 cards', async () => {
  const n = await page.locator('.tools-grid .tool-card').count();
  if (n !== 30) throw new Error(`found ${n}`);
});

await ok('category filter narrows the grid', async () => {
  await page.click('.filter-chip[data-filter="pdf"]');
  const visible = await page.locator('.tools-grid [data-tool-wrap]:not([style*="display: none"])').count();
  if (visible !== 6) throw new Error(`visible ${visible}`);
  await page.click('.filter-chip[data-filter="all"]');
});

/* ================= SEARCH MODAL (intent) ================= */
console.log('Search');
await ok('Ctrl+K opens the search modal', async () => {
  await page.keyboard.press('Control+k');
  await page.waitForSelector('[data-search-overlay]:not([hidden])');
  await page.fill('[data-search-input]', '');
});

await ok('intent query “make my photo smaller” → Image Compressor first', async () => {
  await page.fill('[data-search-input]', 'make my photo smaller');
  await page.waitForTimeout(300);
  const first = page.locator('.sm-item').first();
  const name = await first.locator('.sm-item-name').innerText();
  if (!name.includes('Image Compressor')) throw new Error(name);
});

await ok('Enter navigates to the first result', async () => {
  await page.keyboard.press('Enter');
  await page.waitForURL('**/tools/image-compressor/');
  await page.waitForSelector('#tool-compress');
});

await ok('"/" opens the palette outside inputs', async () => {
  await page.keyboard.press('/');
  await page.waitForSelector('[data-search-overlay]:not([hidden])');
  await page.keyboard.press('Escape');
  await page.waitForSelector('[data-search-overlay]', { state: 'hidden' });
});

/* ================= FAVORITES + RECENTS ================= */
console.log('Personal state');
await ok('favorite button toggles and persists', async () => {
  await page.click('.tool-head [data-fav]');
  const pressed = await page.getAttribute('.tool-head [data-fav]', 'aria-pressed');
  if (pressed !== 'true') throw new Error('not favorited');
});

await ok('recent + favorite appear on home', async () => {
  await page.goto(BASE + '/');
  await page.waitForSelector('#personal:not([hidden])');
  const favVisible = await page.locator('#fav-row:not([hidden]) [data-fav-chips] a').count();
  const recVisible = await page.locator('#recents-row:not([hidden]) [data-recents-chips] a').count();
  if (favVisible < 1) throw new Error('no favorite chip');
  if (recVisible < 1) throw new Error('no recent chip');
});

/* ================= THEME (3 states) ================= */
console.log('Theme');
await ok('theme toggle cycles through dark / light / system', async () => {
  const prefs = [];
  for (let i = 0; i < 3; i++) {
    await page.click('[data-theme-toggle]');
    prefs.push(await page.evaluate(() => document.documentElement.dataset.themePref));
  }
  // three clicks must visit all three states exactly once
  const sorted = [...prefs].sort().join(',');
  if (sorted !== 'dark,light,system') throw new Error(prefs.join(','));
});

await ok('theme preference survives reload', async () => {
  // click until the preference is "light"
  for (let i = 0; i < 3; i++) {
    const pref = await page.evaluate(() => document.documentElement.dataset.themePref);
    if (pref === 'light') break;
    await page.click('[data-theme-toggle]');
  }
  await page.reload();
  const pref = await page.evaluate(() => document.documentElement.dataset.themePref);
  if (pref !== 'light') throw new Error(pref);
  const eff = await page.evaluate(() => document.documentElement.dataset.theme);
  if (eff !== 'light') throw new Error(eff);
  // back to system for the rest of the run
  await page.click('[data-theme-toggle]');
  await page.click('[data-theme-toggle]');
});

/* ================= TEXT TOOLS ================= */
console.log('Text tools');
await page.goto(BASE + '/tools/word-counter/');
await ok('word counter updates live', async () => {
  await page.fill('[data-input]', "Hello world. Don't stop believing!");
  await page.waitForTimeout(200);
  const words = await page.locator('[data-stat-words]').innerText();
  if (words !== '5') throw new Error(`words=${words}`);
});

await page.goto(BASE + '/tools/case-converter/');
await ok('case converter: UPPER and kebab-case', async () => {
  await page.fill('[data-input]', 'Hello World Test');
  await page.click('[data-case="upper"]');
  let out = await page.inputValue('[data-output]');
  if (out !== 'HELLO WORLD TEST') throw new Error(out);
  await page.click('[data-case="kebab"]');
  out = await page.inputValue('[data-output]');
  if (out !== 'hello-world-test') throw new Error(out);
});

await page.goto(BASE + '/tools/remove-duplicate-lines/');
await ok('dedupe removes duplicates and reports count', async () => {
  await page.fill('[data-input]', 'apple\nbanana\napple\ncherry\nbanana');
  await page.click('[data-go]');
  const out = await page.inputValue('[data-output]');
  if (out !== 'apple\nbanana\ncherry') throw new Error(out);
  const status = await page.locator('[data-status]').innerText();
  if (!status.includes('2 duplicates removed')) throw new Error(status);
});

await page.goto(BASE + '/tools/sort-lines/');
await ok('sort lines A→Z works', async () => {
  await page.fill('[data-input]', 'banana\napple\ncherry');
  await page.click('[data-go]');
  const out = await page.inputValue('[data-output]');
  if (out !== 'apple\nbanana\ncherry') throw new Error(out);
});

/* ================= DEVELOPER TOOLS ================= */
console.log('Developer tools');
await page.goto(BASE + '/tools/json-formatter/');
await ok('JSON formatter beautifies valid JSON', async () => {
  await page.fill('[data-input]', '{"a":1,"b":[1,2]}');
  await page.click('[data-format]');
  const out = await page.inputValue('[data-output]');
  if (!out.includes('\n  "a": 1')) throw new Error(out);
});

await ok('JSON formatter reports line+column on invalid JSON', async () => {
  await page.fill('[data-input]', '{\n  "a": \n}');
  await page.click('[data-format]');
  const status = await page.locator('[data-status]').innerText();
  if (!/line 3/.test(status)) throw new Error(status);
});

await page.goto(BASE + '/tools/base64-encode-decode/');
await ok('base64 round-trip with unicode', async () => {
  await page.fill('[data-input]', 'Héllo wörld 🙂');
  await page.click('[data-encode]');
  const enc = await page.inputValue('[data-output]');
  await page.fill('[data-input]', enc);
  await page.click('[data-decode]');
  const dec = await page.inputValue('[data-output]');
  if (dec !== 'Héllo wörld 🙂') throw new Error(dec);
});

await ok('base64 decode rejects garbage with friendly error', async () => {
  await page.fill('[data-input]', '%%%not-base64%%%');
  await page.click('[data-decode]');
  const status = await page.locator('[data-status]').innerText();
  if (!/not valid Base64/.test(status)) throw new Error(status);
});

await page.goto(BASE + '/tools/uuid-generator/');
await ok('UUID batch generation (5, uppercase, no hyphens)', async () => {
  await page.fill('[data-count]', '5');
  await page.check('[data-upper]');
  await page.check('[data-nohyphens]');
  await page.click('[data-go]');
  const out = await page.inputValue('[data-output]');
  const lines = out.split('\n');
  if (lines.length !== 5) throw new Error(`lines ${lines.length}`);
  if (!/^[0-9A-F]{32}$/.test(lines[0])) throw new Error(lines[0]);
});

await page.goto(BASE + '/tools/timestamp-converter/');
await ok('timestamp 0 → Jan 1 1970 (UTC)', async () => {
  await page.fill('[data-ts-input]', '0');
  await page.waitForSelector('[data-ts-result]:not([hidden])');
  const utc = await page.locator('[data-ts-utc]').innerText();
  if (!utc.includes('1970')) throw new Error(utc);
});

await page.goto(BASE + '/tools/regex-tester/');
await ok('regex tester highlights matches', async () => {
  await page.fill('[data-pattern]', '\\d+');
  await page.fill('[data-subject]', 'abc 123 def 45');
  await page.waitForSelector('.rx-highlight mark');
  const marks = await page.locator('.rx-highlight mark').count();
  if (marks !== 2) throw new Error(`marks ${marks}`);
});

/* ================= CALCULATORS ================= */
console.log('Calculators');
await page.goto(BASE + '/tools/unit-converter/');
await ok('1 km → 0.621371 mi', async () => {
  await page.selectOption('[data-cat]', 'length');
  await page.fill('[data-val-a]', '1');
  await page.selectOption('[data-unit-a]', 'km');
  await page.selectOption('[data-unit-b]', 'mi');
  await page.locator('[data-val-a]').dispatchEvent('input');
  const b = await page.inputValue('[data-val-b]');
  if (!b.startsWith('0.6213')) throw new Error(b);
});

await ok('temperature: 0 °C → 32 °F', async () => {
  await page.selectOption('[data-cat]', 'temperature');
  await page.fill('[data-val-a]', '0');
  await page.selectOption('[data-unit-a]', '°C');
  await page.selectOption('[data-unit-b]', '°F');
  await page.locator('[data-val-a]').dispatchEvent('input');
  const b = await page.inputValue('[data-val-b]');
  if (b !== '32') throw new Error(b);
});

await page.goto(BASE + '/tools/date-calculator/');
await ok('date difference: 2026-01-01 → 2026-03-01 = 59 days', async () => {
  await page.fill('[data-d1]', '2026-01-01');
  await page.fill('[data-d2]', '2026-03-01');
  await page.waitForSelector('[data-diff-result]:not([hidden])');
  const days = await page.locator('[data-df-days]').innerText();
  if (days !== '59') throw new Error(days);
});

await ok('add 90 days to 2026-01-01 → April 1, 2026', async () => {
  await page.click('[data-tab="arith"]');
  await page.fill('[data-base]', '2026-01-01');
  await page.fill('[data-n-days]', '90');
  await page.waitForSelector('[data-arith-result]:not([hidden])');
  const txt = await page.locator('[data-arith-date]').innerText();
  if (!txt.includes('April 1, 2026')) throw new Error(txt);
});

await page.goto(BASE + '/tools/percentage-calculator/');
await ok('20% of 150 = 30', async () => {
  await page.fill('[data-a]', '20');
  await page.fill('[data-b]', '150');
  const result = await page.locator('[data-result]').innerText();
  if (result !== '30') throw new Error(result);
});

/* ================= SECURITY & UTILITIES ================= */
console.log('Security & utilities');
await page.goto(BASE + '/tools/password-generator/');
await ok('password generator respects length 20', async () => {
  await page.fill('[data-length]', '20');
  await page.locator('[data-length]').dispatchEvent('input');
  await page.waitForTimeout(150);
  const pw = await page.locator('[data-output]').innerText();
  if (pw.length !== 20) throw new Error(`len ${pw.length}`);
});

await page.goto(BASE + '/tools/qr-code-generator/');
await ok('QR tool renders without error for a URL', async () => {
  await page.fill('[data-f-url]', 'https://example.com/hello');
  await page.waitForTimeout(600);
  const canvas = page.locator('[data-canvas]');
  if (!(await canvas.isVisible())) throw new Error('canvas hidden');
  const emptyHidden = await page.locator('[data-empty]').isHidden();
  if (!emptyHidden) throw new Error('empty state still visible');
});

/* ================= WORKFLOWS ================= */
console.log('Workflows');
await page.goto(BASE + '/workflows/');
await ok('preset loads 3 steps into the builder', async () => {
  await page.click('[data-preset="0"]');
  const n = await page.locator('.wf-step').count();
  if (n !== 3) throw new Error(`steps ${n}`);
});

const PNG_2x2 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEklEQVR4nGP8z8DwnwEJMDGgAXQBAIIdA/0d1M5oAAAAAElFTkSuQmCC';

await ok('workflow run over a batch produces stats + ZIP button', async () => {
  await page.evaluate(async (dataUrl) => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const dt = new DataTransfer();
    dt.items.add(new File([blob], 'test-a.png', { type: 'image/png' }));
    dt.items.add(new File([blob], 'test-b.png', { type: 'image/png' }));
    const dz = document.querySelector('[data-dropzone]');
    dz.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true }));
  }, PNG_2x2);
  await page.waitForSelector('.file-list .file-item');
  await page.click('[data-run]');
  await page.waitForSelector('[data-summary]:not([hidden])', { timeout: 20000 });
  const done = await page.locator('[data-sum-done]').innerText();
  if (done !== '2') throw new Error(`done=${done}`);
  if (await page.locator('[data-download-all]').isHidden()) throw new Error('ZIP button hidden');
});

await ok('workflow save/load round-trip', async () => {
  await page.fill('[data-wf-name]', 'My test workflow');
  await page.click('[data-wf-save]');
  await page.waitForSelector('[data-saved]:not([hidden])');
  await page.click('[data-saved-list] [data-rm]'); // remove it again
  await page.waitForSelector('[data-saved]', { state: 'hidden' });
});

/* ================= FILE TOOLS (compressor) ================= */
console.log('File tools');
await page.goto(BASE + '/tools/image-compressor/');
await ok('compressor processes a dropped file and shows summary', async () => {
  await page.evaluate(async (dataUrl) => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const dt = new DataTransfer();
    dt.items.add(new File([blob], 'photo.jpg', { type: 'image/jpeg' }));
    document.querySelector('[data-dropzone]').dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true }));
  }, PNG_2x2);
  await page.waitForSelector('.file-item.is-done, .file-item.is-error');
  const isDone = await page.locator('.file-item.is-done').count();
  if (isDone !== 1) {
    const err = await page.locator('.fi-meta').innerText();
    throw new Error(`not done: ${err}`);
  }
  await page.waitForSelector('[data-summary]:not([hidden])');
  const before = await page.locator('[data-sum-before]').innerText();
  if (before === '—') throw new Error('summary empty');
});

await ok('corrupt file fails with a Retry action and failed stat', async () => {
  await page.evaluate(() => {
    const dt = new DataTransfer();
    dt.items.add(new File([new Uint8Array([1, 2, 3, 4])], 'broken.png', { type: 'image/png' }));
    document.querySelector('[data-dropzone]').dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true }));
  });
  await page.waitForSelector('.file-item.is-error');
  if (!(await page.locator('.file-item.is-error [data-retry]').count())) throw new Error('no retry button');
  const failed = await page.locator('[data-sum-failed]').innerText();
  if (failed !== '1') throw new Error(`failed stat=${failed}`);
});

await ok('handoff chip appears on resizer after compression', async () => {
  await page.goto(BASE + '/tools/image-resizer/');
  await page.waitForSelector('[data-handoff]:not([hidden])', { timeout: 5000 });
  const name = await page.locator('[data-handoff-name]').innerText();
  if (!name.includes('photo')) throw new Error(name);
});

await ok('wrong format rejected with friendly message', async () => {
  await page.goto(BASE + '/tools/image-compressor/');
  await page.evaluate(() => {
    const dt = new DataTransfer();
    dt.items.add(new File([new Blob(['hello'], { type: 'text/plain' })], 'notes.txt', { type: 'text/plain' }));
    document.querySelector('[data-dropzone]').dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true }));
  });
  await page.waitForSelector('[data-notice]:not([hidden])');
  const msg = await page.locator('[data-notice]').innerText();
  if (!/Unsupported format/.test(msg)) throw new Error(msg);
});

/* ================= SEO / ROUTES ================= */
console.log('Routes & SEO');
await ok('all 30 tool pages return 200', async () => {
  const slugs = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="/tools/"]')].map((a) => a.getAttribute('href'))
  );
  // collect from /tools/ page instead (home may paginate)
  await page.goto(BASE + '/tools/');
  const links = await page.evaluate(() =>
    [...new Set([...document.querySelectorAll('.tool-card')].map((a) => a.getAttribute('href')))]
  );
  if (links.length !== 30) throw new Error(`found ${links.length} tool cards`);
  for (const href of links) {
    const res = await page.request.get(BASE + href);
    if (res.status() !== 200) throw new Error(`${href} → ${res.status()}`);
  }
});

await ok('guides pages return 200', async () => {
  const slugs = ['reduce-image-size-for-email', 'convert-webp-to-jpg', 'compress-pdf-for-email', 'create-a-favicon', 'strong-passwords-guide'];
  for (const s of slugs) {
    const res = await page.request.get(BASE + `/guides/${s}/`);
    if (res.status() !== 200) throw new Error(`${s} → ${res.status()}`);
  }
});

await ok('sitemap contains tools, guides, workflows', async () => {
  const res = await page.request.get(BASE + '/sitemap.xml');
  const body = await res.text();
  for (const needle of ['/tools/', '/guides/', '/workflows/']) {
    if (!body.includes(needle)) throw new Error(`missing ${needle}`);
  }
});

await ok('404 page works', async () => {
  const res = await page.request.get(BASE + '/tools/does-not-exist/');
  if (res.status() !== 404) throw new Error(res.status());
});

await ok('legacy FR URLs redirect to EN equivalents', async () => {
  for (const [fr, en] of [
    ['/outils/compresser-image/', '/tools/image-compressor/'],
    ['/outils/', '/tools/'],
    ['/a-propos/', '/about/'],
    ['/confidentialite/', '/privacy/'],
  ]) {
    const res = await fetch(BASE + fr);
    const body = await res.text();
    if (res.status !== 200) throw new Error(`${fr} → ${res.status}`);
    if (!body.includes(`url=${en}`)) throw new Error(`${fr} missing refresh to ${en}`);
    // canonical is absolute (production origin at build time) — check the path
    const m = body.match(/rel="canonical" href="([^"]+)"/);
    if (!m || !new URL(m[1]).pathname.startsWith(en.replace(/\/$/, ''))) throw new Error(`${fr} bad canonical: ${m && m[1]}`);
  }
});

await ok('privacy page states local processing', async () => {
  const res = await page.request.get(BASE + '/privacy/');
  const body = await res.text();
  if (!body.includes('never leave your device')) throw new Error('claim missing');
});

/* ================= MOBILE ================= */
console.log('Mobile');
await ok('mobile nav opens and closes', async () => {
  await context.clearCookies();
  const mobile = await browser.newPage({ viewport: { width: 390, height: 780 } });
  await mobile.goto(BASE + '/');
  await mobile.click('[data-nav-toggle]');
  await mobile.waitForSelector('#mobile-nav:not([hidden])');
  await mobile.click('[data-nav-toggle]');
  await mobile.waitForSelector('#mobile-nav[hidden]', { state: 'attached' });
  // and it must be truly invisible now (the [hidden] attribute wins over display:flex)
  if (await mobile.locator('#mobile-nav').isVisible()) throw new Error('mobile nav still visible');
  await mobile.close();
});

await browser.close();

console.log(`\n=== Résultats : ${pass} ok, ${fail} échec(s) ===`);
if (failures.length) {
  console.log('Échecs :');
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
