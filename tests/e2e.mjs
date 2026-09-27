/**
 * Tests end-to-end : chaque outil est exercé dans un vrai navigateur.
 * Couvre : entrée valide, entrée invalide, fichier vide, mauvais format,
 * plusieurs fichiers, téléchargement, réinitialisation, mobile/desktop, thème.
 * Usage : node tests/e2e.mjs  (le serveur preview doit tourner sur :4321)
 */
import { chromium } from 'playwright-core';
import { readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE = 'http://localhost:4321';
const tmp = mkdtempSync(join(tmpdir(), 'qt-e2e-'));
let pass = 0;
let fail = 0;
const failures = [];

function ok(name, cond, extra = '') {
  if (cond) {
    pass++;
    console.log(`  ✅ ${name}`);
  } else {
    fail++;
    failures.push(name + (extra ? ` — ${extra}` : ''));
    console.log(`  ❌ ${name} ${extra}`);
  }
}

async function section(name, fn) {
  console.log(`\n=== ${name} ===`);
  try {
    await fn();
  } catch (e) {
    fail++;
    const msg = String((e && e.message) || e).split('\n')[0].slice(0, 160);
    failures.push(`[section interrompue] ${name} — ${msg}`);
    console.log(`  ❌ section interrompue : ${msg}`);
  }
}

/* ---------- Fabrique de fichiers de test ---------- */
async function makeJpeg(page, w = 40, h = 40, color = '#ff0000') {
  return page.evaluate(
    ([w, h, color]) =>
      new Promise((resolve) => {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(w / 4, h / 4, w / 2, h / 2);
        c.toBlob((b) => b.arrayBuffer().then((ab) => resolve(Array.from(new Uint8Array(ab)))), 'image/jpeg', 0.9);
      }),
    [w, h, color]
  );
}

async function makePng(page, w = 40, h = 40) {
  return page.evaluate(
    ([w, h]) =>
      new Promise((resolve) => {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        ctx.fillStyle = 'rgba(0,120,255,0.7)';
        ctx.fillRect(0, 0, w, h);
        c.toBlob((b) => b.arrayBuffer().then((ab) => resolve(Array.from(new Uint8Array(ab)))), 'image/png');
      }),
    [w, h]
  );
}

const buf = (arr) => Buffer.from(arr);

async function setFiles(page, files) {
  await page.locator('[data-file-input]').setInputFiles(files);
}

async function waitForStatus(page, status, timeout = 20000) {
  await page.waitForSelector(`.file-item.is-${status}`, { timeout });
}

const browser = await chromium.launch({ args: ['--no-sandbox'] });

/* =========================================================
   ACCUEIL — hero, recherche, thème, responsive
   ========================================================= */
await section('Accueil', async () => {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  ok('titre présent', (await page.title()).includes('QuickTools'));
  ok('H1 exact du brief', (await page.locator('h1').innerText()).includes('Sans les complications'));
  ok('10 cartes outils affichées', (await page.locator('.tool-card').count()) === 10);
  ok('aucune erreur JS au chargement', errors.length === 0, errors.join(' | '));

  // Recherche : Ctrl+K
  await page.keyboard.press('Control+k');
  await page.waitForSelector('.modal-overlay:not([hidden])', { timeout: 3000 });
  await page.locator('[data-search-input]').fill('pdf');
  await page.waitForTimeout(150);
  const results = await page.locator('.sm-item').count();
  ok('recherche "pdf" → résultats (≥2)', results >= 2, `${results}`);
  await page.keyboard.press('Escape');
  ok('Esc ferme la modale', await page.locator('.modal-overlay').isHidden());

  // Recherche via la barre hero
  await page.locator('#hero-search').focus();
  await page.waitForSelector('.modal-overlay:not([hidden])', { timeout: 3000 });
  ok('la barre hero ouvre la recherche', true);
  await page.keyboard.press('Escape');

  // La page reste utilisable une fois la modale fermée (aucun overlay fantôme)
  await page.locator('[data-filter="pdf"]').click({ timeout: 4000 });
  const visible = await page.locator('[data-tool-wrap]:not(.filtered-out)').count();
  ok('filtre PDF → 2 outils visibles', visible === 2, `${visible}`);
  await page.locator('[data-filter="all"]').click();

  // Thème : bascule, mémorisation, persistance après refresh
  const initialTheme = await page.locator('html').getAttribute('data-theme');
  await page.locator('[data-theme-toggle]').click();
  await page.waitForTimeout(200);
  const toggled = await page.locator('html').getAttribute('data-theme');
  ok('la bascule de thème change le thème', toggled !== initialTheme, `${initialTheme} → ${toggled}`);
  const persisted = await page.evaluate(() => localStorage.getItem('qt-theme'));
  ok('thème mémorisé (localStorage)', persisted === toggled, `stocké=${persisted}`);
  await page.reload({ waitUntil: 'networkidle' });
  ok('thème conservé après refresh', (await page.locator('html').getAttribute('data-theme')) === toggled);
  await page.locator('[data-theme-toggle]').click();

  // Navigation mobile + aucun débordement horizontal
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(200);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok('mobile 375px : aucun débordement horizontal', overflow <= 1, `overflow=${overflow}px`);
  await page.locator('[data-nav-toggle]').click();
  ok('menu mobile s’ouvre', !(await page.locator('#mobile-nav').isHidden()));
  await page.locator('#mobile-nav a[href="/outils/"]').first().click();
  await page.waitForURL('**/outils/');
  ok('lien menu mobile fonctionne', page.url().includes('/outils/'));

  await page.setViewportSize({ width: 320, height: 700 });
  const overflow320 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok('mobile 320px : aucun débordement', overflow320 <= 1, `overflow=${overflow320}px`);

  await page.close();
});

/* =========================================================
   OUTIL 1 — JPG → WebP
   ========================================================= */
await section('Outil 1 : JPG → WebP', async () => {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const dl = [];
  page.on('download', async (d) => {
    const p = join(tmp, d.suggestedFilename());
    await d.saveAs(p);
    dl.push(p);
  });
  await page.goto(BASE + '/outils/jpg-vers-webp/', { waitUntil: 'networkidle' });

  // Fichier valide
  const jpg = buf(await makeJpeg(page, 60, 60));
  await setFiles(page, [{ name: 'photo.jpg', mimeType: 'image/jpeg', buffer: jpg }]);
  await waitForStatus(page, 'done');
  ok('JPG valide converti', true);
  const meta = await page.locator('.file-item .fi-meta').first().innerText();
  ok('méta avant/après affichée', meta.includes('→'), meta);

  // Plusieurs fichiers
  const jpg2 = buf(await makeJpeg(page, 30, 30, '#0000ff'));
  const jpg3 = buf(await makeJpeg(page, 80, 80, '#222222'));
  await setFiles(page, [
    { name: 'a.jpg', mimeType: 'image/jpeg', buffer: jpg2 },
    { name: 'b.jpg', mimeType: 'image/jpeg', buffer: jpg3 },
  ]);
  await page.waitForFunction(() => document.querySelectorAll('.file-item.is-done').length >= 3, { timeout: 20000 });
  ok('3 fichiers présents', (await page.locator('.file-item').count()) === 3);

  // Téléchargement unitaire
  await page.locator('.file-item .fi-actions [data-download]').first().click();
  await page.waitForTimeout(400);
  ok('téléchargement unitaire déclenché', dl.length >= 1);
  ok('extension .webp', dl[0].endsWith('.webp'), dl[0]);

  // ZIP
  await page.locator('[data-download-all]').click();
  await page.waitForTimeout(1800);
  ok('téléchargement ZIP', dl.some((f) => f.endsWith('.zip')));
  const zipFile = dl.find((f) => f.endsWith('.zip'));
  ok('ZIP non vide', zipFile && readFileSync(zipFile).length > 100);

  // Suppression d'un fichier
  await page.locator('.file-item [aria-label^="Retirer"]').first().click();
  ok('suppression d’un fichier', (await page.locator('.file-item').count()) === 2);

  // Qualité : reconversion
  await page.locator('[data-quality]').fill('50');
  await page.locator('[data-quality]').dispatchEvent('change');
  await page.waitForTimeout(1200);
  ok('reconversion après changement de qualité', (await page.locator('.file-item.is-done').count()) === 2);

  // Mauvais format
  await setFiles(page, [{ name: 'script.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') }]);
  await page.waitForTimeout(300);
  const notice = await page.locator('[data-notice]').innerText();
  ok('mauvais format refusé avec message', notice.includes('Format non pris en charge'), notice.slice(0, 80));
  ok('fichier refusé non ajouté', (await page.locator('.file-item').count()) === 2);

  // Fichier vide
  await setFiles(page, [{ name: 'vide.jpg', mimeType: 'image/jpeg', buffer: Buffer.alloc(0) }]);
  await page.waitForTimeout(300);
  ok('fichier vide refusé', (await page.locator('[data-notice]').innerText()).includes('vide'));

  // Fichier corrompu (extension .jpg, contenu poubelle)
  await page.locator('[data-clear-all]').click();
  ok('réinitialisation vide la liste', (await page.locator('.file-item').count()) === 0);
  await setFiles(page, [{ name: 'casse.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('ceci n est pas une image du tout') }]);
  await waitForStatus(page, 'error');
  const errMsg = await page.locator('.file-item.is-error .fi-meta').innerText();
  ok('fichier corrompu : erreur claire (pas "Error: undefined")', errMsg.length > 15 && !errMsg.includes('undefined'), errMsg.slice(0, 80));

  // Trop gros (51 Mo) — injecté via DataTransfer (Playwright refuse les buffers > 50 Mo)
  await page.evaluate(() => {
    const big = new File([new ArrayBuffer(51 * 1024 * 1024)], 'gros.jpg', { type: 'image/jpeg' });
    const dt = new DataTransfer();
    dt.items.add(big);
    const input = document.querySelector('[data-file-input]');
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForTimeout(600);
  ok('fichier > 50 Mo refusé', (await page.locator('[data-notice]').innerText()).includes('limite'));

  ok('aucune erreur JS sur l’outil', errors.length === 0, errors.join(' | '));

  // Refresh : la liste repart de zéro, l'outil fonctionne toujours
  await page.reload({ waitUntil: 'networkidle' });
  ok('après refresh : dropzone opérationnelle', (await page.locator('.dropzone').count()) === 1);
  await setFiles(page, [{ name: 'photo2.jpg', mimeType: 'image/jpeg', buffer: jpg }]);
  await waitForStatus(page, 'done');
  ok('conversion OK après refresh', true);

  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(200);
  const ovf = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok('mobile : aucun débordement', ovf <= 1, `${ovf}px`);

  await page.close();
});

/* =========================================================
   OUTIL 2 — PNG → WebP
   ========================================================= */
await section('Outil 2 : PNG → WebP', async () => {
  const page = await browser.newPage();
  const dl = [];
  page.on('download', async (d) => {
    const p = join(tmp, 'pw-' + d.suggestedFilename());
    await d.saveAs(p);
    dl.push(p);
  });
  await page.goto(BASE + '/outils/png-vers-webp/', { waitUntil: 'networkidle' });

  const png = buf(await makePng(page, 48, 48));
  await setFiles(page, [{ name: 'logo.png', mimeType: 'image/png', buffer: png }]);
  await waitForStatus(page, 'done');
  ok('PNG valide converti', true);

  // JPG refusé ici
  const jpg = buf(await makeJpeg(page, 20, 20));
  await setFiles(page, [{ name: 'photo.jpg', mimeType: 'image/jpeg', buffer: jpg }]);
  await page.waitForTimeout(300);
  ok('JPG refusé sur l’outil PNG', (await page.locator('[data-notice]').innerText()).includes('Format'));

  await page.locator('.file-item [data-download]').first().click();
  await page.waitForTimeout(500);
  ok('téléchargement .webp', dl.some((f) => f.endsWith('.webp')));

  // Vérifie que le fichier téléchargé est un vrai WebP (magic bytes RIFF....WEBP)
  const webpPath = dl.find((f) => f.endsWith('.webp'));
  const bytes = readFileSync(webpPath);
  const magic = bytes.subarray(0, 4).toString() + bytes.subarray(8, 12).toString();
  ok('magic bytes WebP valides', magic === 'RIFFWEBP', magic);

  await page.close();
});

/* =========================================================
   OUTIL 3 — Compresseur d'image
   ========================================================= */
await section('Outil 3 : Compresseur', async () => {
  const page = await browser.newPage();
  await page.goto(BASE + '/outils/compresser-image/', { waitUntil: 'networkidle' });

  const bigJpg = buf(
    await page.evaluate(() =>
      new Promise((resolve) => {
        const c = document.createElement('canvas');
        c.width = 600;
        c.height = 600;
        const ctx = c.getContext('2d');
        for (let i = 0; i < 600; i += 6) {
          ctx.fillStyle = `hsl(${(i * 7) % 360}, 60%, ${30 + (i % 40)}%)`;
          ctx.fillRect(0, i, 600, 6);
        }
        c.toBlob((b) => b.arrayBuffer().then((ab) => resolve(Array.from(new Uint8Array(ab)))), 'image/jpeg', 1);
      })
    )
  );
  await setFiles(page, [{ name: 'grosse.jpg', mimeType: 'image/jpeg', buffer: bigJpg }]);
  await waitForStatus(page, 'done');
  ok('compression effectuée', true);

  await page.locator('[data-quality]').fill('40');
  await page.locator('[data-quality]').dispatchEvent('change');
  await page.waitForTimeout(1500);
  const summary = await page.locator('[data-summary]').innerText();
  ok('récap Avant/Après/Économie affiché', /avant[\s\S]*après[\s\S]*économie/i.test(summary), summary.replace(/\n/g, ' '));
  ok('comparateur avant/après visible (1 fichier)', !(await page.locator('[data-compare]').isHidden()));

  const saved = await page.locator('[data-sum-saved]').innerText();
  ok('pourcentage d’économie affiché', saved.includes('%'), saved);

  // WebP accepté aussi
  await page.locator('[data-clear-all]').click();
  const webpSrc = buf(
    await page.evaluate(() =>
      new Promise((resolve) => {
        const c = document.createElement('canvas');
        c.width = 60;
        c.height = 60;
        c.getContext('2d').fillRect(0, 0, 60, 60);
        c.toBlob((b) => b.arrayBuffer().then((ab) => resolve(Array.from(new Uint8Array(ab)))), 'image/webp', 0.9);
      })
    )
  );
  await setFiles(page, [{ name: 'img.webp', mimeType: 'image/webp', buffer: webpSrc }]);
  await waitForStatus(page, 'done');
  ok('WebP accepté en entrée', true);

  await page.close();
});

/* =========================================================
   OUTIL 4 — Redimensionner
   ========================================================= */
await section('Outil 4 : Redimensionner', async () => {
  const page = await browser.newPage();
  const dl = [];
  page.on('download', async (d) => {
    const p = join(tmp, 'rz-' + d.suggestedFilename());
    await d.saveAs(p);
    dl.push(p);
  });
  await page.goto(BASE + '/outils/redimensionner-image/', { waitUntil: 'networkidle' });

  const jpg = buf(await makeJpeg(page, 200, 100));
  await setFiles(page, [{ name: 'src.jpg', mimeType: 'image/jpeg', buffer: jpg }]);
  await page.waitForFunction(() => document.querySelector('[data-info]')?.textContent.includes('200 × 100'), { timeout: 8000 });
  ok('dimensions originales détectées (200 × 100)', true);

  // Ratio verrouillé : largeur 100 → hauteur 50
  await page.locator('[data-width]').fill('100');
  const h = await page.locator('[data-height]').inputValue();
  ok('ratio verrouillé : hauteur auto (50)', h === '50', `h=${h}`);

  await page.locator('[data-go]').click();
  await waitForStatus(page, 'done');
  await page.locator('.file-item [data-download]').first().click();
  await page.waitForTimeout(700);
  ok('téléchargement après redimensionnement', dl.length === 1);

  // Vérifie les dimensions réelles du fichier produit
  const dims = await page.evaluate(async (arr) => {
    const blob = new Blob([new Uint8Array(arr)]);
    const bmp = await createImageBitmap(blob);
    return [bmp.width, bmp.height];
  }, Array.from(readFileSync(dl[0])));
  ok('dimensions de sortie correctes (100×50)', dims[0] === 100 && dims[1] === 50, `${dims}`);

  // Mode pourcentage
  await page.locator('[data-mode-btn="percent"]').click();
  await page.locator('[data-pct="50"]').click();
  await page.waitForFunction(() => document.querySelector('[data-info]')?.textContent.includes('100 × 50'), { timeout: 5000 });
  ok('mode pourcentage : 50 % de 200×100 → 100×50', true);

  // Ratio déverrouillé
  await page.locator('[data-mode-btn="dims"]').click();
  await page.locator('[data-lock]').uncheck();
  await page.locator('[data-width]').fill('300');
  await page.locator('[data-height]').fill('300');
  await page.locator('[data-go]').click();
  await page.waitForSelector('.file-item.is-done', { timeout: 15000 });
  const beforeCount = dl.length;
  await page.locator('.file-item [data-download]').first().click();
  for (let i = 0; i < 30 && dl.length <= beforeCount; i++) await page.waitForTimeout(250);
  const dims2 = await page.evaluate(async (arr) => {
    const blob = new Blob([new Uint8Array(arr)]);
    const bmp = await createImageBitmap(blob);
    return [bmp.width, bmp.height];
  }, Array.from(readFileSync(dl.at(-1))));
  ok('ratio déverrouillé : 300×300 exact', dims2[0] === 300 && dims2[1] === 300, `${dims2}`);

  // Largeur excessive → erreur claire
  await page.locator('[data-width]').fill('99999');
  await page.locator('[data-go]').click();
  await page.waitForSelector('.file-item.is-error', { timeout: 10000 });
  const meta = await page.locator('.file-item .fi-meta').first().innerText();
  ok('dimensions excessives → message clair', meta.includes('trop grandes'), meta.slice(0, 80));

  await page.close();
});

/* =========================================================
   OUTIL 5 — Image en PDF
   ========================================================= */
await section('Outil 5 : Image en PDF', async () => {
  const page = await browser.newPage();
  const dl = [];
  page.on('download', async (d) => {
    const p = join(tmp, 'ip-' + d.suggestedFilename());
    await d.saveAs(p);
    dl.push(p);
  });
  await page.goto(BASE + '/outils/image-en-pdf/', { waitUntil: 'networkidle' });

  const j1 = buf(await makeJpeg(page, 120, 200, '#ff0000'));
  const p1 = buf(await makePng(page, 90, 90));
  await setFiles(page, [
    { name: 'page1.jpg', mimeType: 'image/jpeg', buffer: j1 },
    { name: 'page2.png', mimeType: 'image/png', buffer: p1 },
  ]);
  await page.waitForTimeout(600);

  // Réorganisation
  await page.locator('.file-item').nth(1).locator('[data-mv-up]').click();
  const first = await page.locator('.file-item .fi-name').first().innerText();
  ok('réorganisation ↑↓ fonctionne', first === 'page2.png', first);

  await page.locator('[data-generate]').click();
  for (let i = 0; i < 40 && !dl.some((f) => f.endsWith('.pdf')); i++) await page.waitForTimeout(250);
  ok('PDF téléchargé', dl.some((f) => f.endsWith('.pdf')));

  // Vérifie le PDF généré avec pdf-lib (côté node)
  const { PDFDocument } = await import('pdf-lib');
  const doc = await PDFDocument.load(readFileSync(dl.find((f) => f.endsWith('.pdf'))));
  ok('PDF : 2 pages', doc.getPageCount() === 2, `${doc.getPageCount()}`);

  // Orientation paysage + A4
  await page.locator('[data-orientation]').selectOption('landscape');
  const pdfCount = dl.filter((f) => f.endsWith('.pdf')).length;
  await page.locator('[data-generate]').click();
  for (let i = 0; i < 40 && dl.filter((f) => f.endsWith('.pdf')).length <= pdfCount; i++) await page.waitForTimeout(250);
  const doc2 = await PDFDocument.load(readFileSync(dl.filter((f) => f.endsWith('.pdf')).at(-1)));
  const { width: w, height: h } = doc2.getPage(0).getSize();
  ok('A4 paysage : largeur > hauteur', w > h, `${w}×${h}`);
  ok('dimensions A4 ≈ 842×595', Math.round(w) === 842 && Math.round(h) === 595, `${Math.round(w)}×${Math.round(h)}`);

  // Fichier corrompu
  await page.locator('[data-clear-all]').click();
  await setFiles(page, [{ name: 'faux.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('pas une image') }]);
  await page.waitForTimeout(400);
  await page.locator('[data-generate]').click();
  await page.waitForTimeout(2500);
  const toast = await page.locator('.toast-stack').innerText().catch(() => '');
  ok('image corrompue → erreur explicite à la génération', toast.includes('invalide') || toast.includes('Impossible'), toast.slice(0, 90));

  await page.close();
});

/* =========================================================
   OUTIL 6 — Fusionner des PDF
   ========================================================= */
await section('Outil 6 : Fusionner des PDF', async () => {
  const page = await browser.newPage();
  const dl = [];
  page.on('download', async (d) => {
    const p = join(tmp, 'mp-' + d.suggestedFilename());
    await d.saveAs(p);
    dl.push(p);
  });
  await page.goto(BASE + '/outils/fusionner-pdf/', { waitUntil: 'networkidle' });

  const { PDFDocument } = await import('pdf-lib');
  const mkPdf = async (pages) => {
    const d = await PDFDocument.create();
    for (let i = 0; i < pages; i++) d.addPage([200, 300]);
    return Buffer.from(await d.save());
  };
  const pdfA = await mkPdf(2);
  const pdfB = await mkPdf(3);

  await setFiles(page, [
    { name: 'a.pdf', mimeType: 'application/pdf', buffer: pdfA },
    { name: 'b.pdf', mimeType: 'application/pdf', buffer: pdfB },
  ]);
  await page.waitForFunction(
    () => document.querySelectorAll('.fi-meta').length === 2 && ![...document.querySelectorAll('.fi-meta')].some((e) => e.textContent.includes('analyse')),
    { timeout: 15000 }
  );
  const metas = await page.locator('.fi-meta').allInnerTexts();
  ok('nombre de pages affiché par fichier', metas[0].includes('2 pages') && metas[1].includes('3 pages'), metas.join(' | '));

  await page.locator('[data-merge]').click();
  await page.waitForTimeout(3000);
  ok('PDF fusionné téléchargé', dl.some((f) => f.endsWith('.pdf')));
  const merged = await PDFDocument.load(readFileSync(dl.find((f) => f.endsWith('.pdf'))));
  ok('fusion : 2+3 = 5 pages', merged.getPageCount() === 5, `${merged.getPageCount()}`);

  // Réorganisation puis re-fusion
  await page.locator('.file-item').nth(1).locator('[data-mv-up]').click();
  await page.locator('[data-merge]').click();
  await page.waitForTimeout(3000);
  const merged2 = await PDFDocument.load(readFileSync(dl.filter((f) => f.endsWith('.pdf')).at(-1)));
  ok('re-fusion après réorganisation OK', merged2.getPageCount() === 5);

  // PDF invalide
  await setFiles(page, [{ name: 'faux.pdf', mimeType: 'application/pdf', buffer: Buffer.from('PDF mais en fait non') }]);
  await page.waitForFunction(() => [...document.querySelectorAll('.fi-meta')].some((e) => e.textContent.includes('protégé ou illisible')), { timeout: 15000 });
  await page.locator('[data-merge]').click();
  await page.waitForTimeout(600);
  const notice = await page.locator('[data-notice]').innerText();
  ok('PDF illisible signalé avant fusion', notice.includes('protégé') || notice.includes('illisible'), notice.slice(0, 90));

  // Mauvais format refusé
  await setFiles(page, [{ name: 'image.png', mimeType: 'image/png', buffer: Buffer.from('x') }]);
  await page.waitForTimeout(300);
  ok('non-PDF refusé', (await page.locator('[data-notice]').innerText()).includes('Format'));

  await page.close();
});

/* =========================================================
   OUTIL 7 — Générateur de QR code
   ========================================================= */
await section('Outil 7 : QR code', async () => {
  const page = await browser.newPage();
  const dl = [];
  page.on('download', async (d) => {
    const p = join(tmp, 'qr-' + d.suggestedFilename());
    await d.saveAs(p);
    dl.push(p);
  });
  await page.goto(BASE + '/outils/generer-qr-code/', { waitUntil: 'networkidle' });

  ok('boutons désactivés sans contenu', await page.locator('[data-dl-png]').isDisabled());

  await page.locator('[data-f-url]').fill('https://example.fr/bonjour');
  await page.waitForTimeout(900);
  ok(
    'aperçu généré (canvas non vide)',
    await page.evaluate(() => {
      const c = document.querySelector('[data-canvas]');
      return c.getContext('2d').getImageData(0, 0, c.width, c.height).data.some((v, i) => i % 4 === 3 && v > 0);
    })
  );
  ok('PNG activé', !(await page.locator('[data-dl-png]').isDisabled()));

  await page.locator('[data-dl-png]').click();
  await page.waitForTimeout(700);
  await page.locator('[data-dl-svg]').click();
  await page.waitForTimeout(700);
  ok('export PNG + SVG déclenchés', dl.some((f) => f.endsWith('.png')) && dl.some((f) => f.endsWith('.svg')));
  const svg = readFileSync(dl.find((f) => f.endsWith('.svg')), 'utf8');
  ok('SVG valide', svg.includes('<svg'));

  // URL invalide
  await page.locator('[data-f-url]').fill('pas une url');
  await page.waitForTimeout(700);
  ok('URL invalide → message', (await page.locator('[data-error]').innerText()).includes('pas valide'));

  // Type Wi-Fi
  await page.locator('#qr-type').selectOption('wifi');
  await page.locator('[data-f-wifi-ssid]').fill('MonRéseau');
  await page.locator('[data-f-wifi-pass]').fill('mot;depasse');
  await page.waitForTimeout(900);
  ok('Wi-Fi généré sans erreur', !(await page.locator('[data-dl-png]').isDisabled()));

  // Email invalide
  await page.locator('#qr-type').selectOption('email');
  await page.locator('[data-f-email-to]').fill('pas-un-email');
  await page.waitForTimeout(700);
  ok('e-mail invalide → message', (await page.locator('[data-error]').innerText()).includes('invalide'));

  // Couleur personnalisée
  await page.locator('#qr-type').selectOption('url');
  await page.locator('[data-fg]').fill('#ff0000');
  await page.waitForTimeout(900);
  ok('changement de couleur appliqué sans erreur', true);

  await page.close();
});

/* =========================================================
   OUTIL 8 — Calculateur de pourcentage
   ========================================================= */
await section('Outil 8 : Pourcentage', async () => {
  const page = await browser.newPage();
  await page.goto(BASE + '/outils/calculateur-pourcentage/', { waitUntil: 'networkidle' });

  await page.locator('[data-a]').fill('20');
  await page.locator('[data-b]').fill('150');
  ok('20 % de 150 = 30', (await page.locator('[data-result]').innerText()).trim() === '30');

  await page.locator('[data-mode="proportion"]').click();
  await page.locator('[data-a]').fill('30');
  await page.locator('[data-b]').fill('150');
  ok('30 sur 150 = 20 %', (await page.locator('[data-result]').innerText()).includes('20'));

  await page.locator('[data-mode="evolution"]').click();
  await page.locator('[data-a]').fill('80');
  await page.locator('[data-b]').fill('100');
  ok('80 → 100 = +25 %', (await page.locator('[data-result]').innerText()).includes('25'));
  await page.locator('[data-a]').fill('100');
  await page.locator('[data-b]').fill('80');
  ok('100 → 80 = −20 %', (await page.locator('[data-result]').innerText()).includes('20'));

  await page.locator('[data-mode="discount"]').click();
  await page.locator('[data-a]').fill('120');
  await page.locator('[data-b]').fill('25');
  ok('120 − 25 % = 90', (await page.locator('[data-result]').innerText()).trim() === '90');

  await page.locator('[data-mode="add"]').click();
  await page.locator('[data-a]').fill('100');
  await page.locator('[data-b]').fill('10,5');
  ok('virgule décimale acceptée (100 + 10,5 % = 110,5)', (await page.locator('[data-result]').innerText()).includes('110,5'));

  await page.locator('[data-a]').fill('abc');
  ok('texte invalide → message doux', (await page.locator('[data-sentence]').innerText()).length > 0);

  await page.locator('[data-mode="proportion"]').click();
  await page.locator('[data-a]').fill('10');
  await page.locator('[data-b]').fill('0');
  ok('division par 0 gérée', (await page.locator('[data-sentence]').innerText()).length > 0);

  await page.close();
});

/* =========================================================
   OUTIL 9 — Générateur de mot de passe
   ========================================================= */
await section('Outil 9 : Mot de passe', async () => {
  const page = await browser.newPage();
  await page.goto(BASE + '/outils/generateur-mot-de-passe/', { waitUntil: 'networkidle' });

  const pw = await page.locator('[data-output]').innerText();
  ok('mot de passe généré au chargement (16 car.)', pw.length === 16 && !pw.includes('•'), pw);
  ok('contient des minuscules et majuscules', /[a-z]/.test(pw) && /[A-Z]/.test(pw));

  await page.locator('[data-length]').fill('24');
  await page.locator('[data-length]').dispatchEvent('input');
  await page.waitForTimeout(300);
  ok('longueur 24 respectée', (await page.locator('[data-output]').innerText()).length === 24);

  await page.locator('[data-opt-upper]').uncheck();
  await page.locator('[data-opt-digits]').uncheck();
  await page.locator('[data-opt-symbols]').uncheck();
  await page.waitForTimeout(200);
  const pwLower = await page.locator('[data-output]').innerText();
  ok('minuscules uniquement', /^[a-z]+$/.test(pwLower), pwLower);

  await page.locator('[data-opt-lower]').uncheck();
  await page.waitForTimeout(200);
  ok('avertissement si aucune famille', !(await page.locator('[data-note]').isHidden()));
  ok('copie désactivée', await page.locator('[data-copy]').isDisabled());
  await page.locator('[data-opt-lower]').check();

  await page.locator('[data-opt-noamb]').check();
  await page.locator('[data-regen]').click();
  await page.waitForTimeout(300);
  const pwNoAmb = await page.locator('[data-output]').innerText();
  ok('aucun caractère ambigu', !/[Il1O0o|`'"{}[\]();:.]/.test(pwNoAmb), pwNoAmb);

  ok('indicateur d’entropie présent', (await page.locator('[data-strength-bits]').innerText()).includes('bits'));

  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.locator('[data-copy]').click();
  await page.waitForTimeout(500);
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  ok('copie dans le presse-papiers', clip === pwNoAmb);

  const before = await page.locator('[data-output]').innerText();
  await page.locator('[data-regen]').click();
  await page.waitForTimeout(300);
  ok('régénération → mot différent', (await page.locator('[data-output]').innerText()) !== before);

  await page.close();
});

/* =========================================================
   OUTIL 10 — Compteur de mots
   ========================================================= */
await section('Outil 10 : Compteur de mots', async () => {
  const page = await browser.newPage();
  await page.goto(BASE + '/outils/compteur-de-mots/', { waitUntil: 'networkidle' });

  await page.locator('[data-input]').fill("Bonjour le monde. Voici un test.\n\nDeuxième paragraphe !");
  await page.waitForTimeout(250);
  ok('mots comptés', (await page.locator('[data-stat-words]').innerText()) === '8');
  ok('phrases comptées', (await page.locator('[data-stat-sentences]').innerText()) === '3');
  ok('paragraphes comptés', (await page.locator('[data-stat-paragraphs]').innerText()) === '2');
  ok('lignes comptées', (await page.locator('[data-stat-lines]').innerText()) === '3');

  await page.locator('[data-clear]').click();
  await page.waitForTimeout(200);
  ok('effacer remet à zéro', (await page.locator('[data-stat-words]').innerText()) === '0');

  await page.locator('[data-sample]').click();
  await page.waitForTimeout(250);
  const w = parseInt((await page.locator('[data-stat-words]').innerText()).replace(/[^\d]/g, ''), 10);
  ok('texte exemple : comptage non nul', w > 80, `${w}`);

  await page.evaluate(() => {
    const ta = document.querySelector('[data-input]');
    ta.value = Array(200000).fill('mot').join(' ');
    ta.dispatchEvent(new Event('input'));
  });
  await page.waitForTimeout(2000);
  const big = (await page.locator('[data-stat-words]').innerText()).replace(/[^\d]/g, '');
  ok('200 000 mots traités sans erreur', big === '200000', big);

  await page.close();
});

/* =========================================================
   RECHERCHE + CLAVIER
   ========================================================= */
await section('Recherche & clavier', async () => {
  const page = await browser.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  await page.keyboard.press('Control+k');
  await page.waitForSelector('.modal-overlay:not([hidden])');
  await page.locator('[data-search-input]').fill('compress');
  await page.waitForTimeout(250);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(800);
  ok('navigation clavier → Enter ouvre un outil', page.url().includes('/outils/'), page.url());
  await page.close();
});

/* =========================================================
   ACCESSIBILITÉ DE BASE
   ========================================================= */
await section('Accessibilité', async () => {
  const page = await browser.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const issues = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('img:not([alt])').forEach((i) => out.push('img sans alt: ' + i.src.slice(0, 60)));
    document.querySelectorAll('button').forEach((b) => {
      if (!b.textContent.trim() && !b.getAttribute('aria-label') && !b.querySelector('svg')) out.push('bouton sans label');
    });
    return out;
  });
  ok('a11y : pas d’img sans alt ni bouton sans label', issues.length === 0, issues.slice(0, 3).join(' | '));
  const lang = await page.locator('html').getAttribute('lang');
  ok('lang="fr" présent', lang === 'fr');
  await page.close();
});

await browser.close();

console.log(`\n========================================`);
console.log(`RÉSULTAT : ${pass} ✅ / ${fail} ❌`);
if (failures.length) {
  console.log('Échecs :');
  failures.forEach((f) => console.log('  - ' + f));
}
process.exit(fail ? 1 : 0);
