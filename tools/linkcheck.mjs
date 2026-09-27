/**
 * Vérificateur de liens internes : parcourt dist/ et vérifie que chaque
 * href/src interne pointe vers un fichier existant, et que chaque page HTML
 * contient les éléments SEO minimum (title, meta description, canonical, h1).
 * Usage : node tools/linkcheck.mjs
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const htmlFiles = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (entry.endsWith('.html')) htmlFiles.push(p);
  }
}
walk(DIST);

let broken = [];
let seoIssues = [];
const checked = new Set();

/** Résout une URL interne vers un fichier du dist. */
function resolveInternal(href) {
  let path = href.split('#')[0].split('?')[0];
  if (!path) return null;
  if (!path.startsWith('/')) return null; // relatif → ignoré (rare)
  if (path.startsWith('/_assets/') || path.startsWith('/@')) return path.slice(1);
  let candidate = path.slice(1);
  if (candidate === '') candidate = 'index.html';
  else if (candidate.endsWith('/')) candidate += 'index.html';
  else if (!extname(candidate)) candidate += '/index.html';
  return candidate;
}

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const rel = file.replace(DIST, '');

  // --- liens + assets ---
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|javascript:|#)/.test(ref)) continue;
    const target = resolveInternal(ref);
    if (!target) continue;
    if (!existsSync(join(DIST, target))) broken.push(`${rel} → ${ref}`);
  }

  // --- SEO minimum ---
  if (!/<title>[^<]+<\/title>/.test(html)) seoIssues.push(`${rel}: title manquant`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) seoIssues.push(`${rel}: meta description manquante`);
  if (!/<link rel="canonical"/.test(html)) seoIssues.push(`${rel}: canonical manquant`);
  if (!/<h1[\s>]/.test(html)) seoIssues.push(`${rel}: H1 manquant`);
  checked.add(rel);
}

console.log(`Pages vérifiées : ${checked.size}`);
if (broken.length) {
  console.log(`\n❌ Liens cassés (${broken.length}) :`);
  broken.forEach((b) => console.log('  - ' + b));
} else {
  console.log('✅ Aucun lien interne cassé');
}
if (seoIssues.length) {
  console.log(`\n❌ Problèmes SEO (${seoIssues.length}) :`);
  seoIssues.forEach((s) => console.log('  - ' + s));
} else {
  console.log('✅ SEO minimum présent partout (title, description, canonical, h1)');
}

process.exit(broken.length || seoIssues.length ? 1 : 0);
