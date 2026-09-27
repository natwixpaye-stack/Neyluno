/** Sitemap généré automatiquement depuis le registre d'outils et les pages fixes. */
import { site, categories } from '../data/site.js';
import { tools } from '../data/tools.js';

export async function GET() {
  const base = new URL('', import.meta.env.SITE).href.replace(/\/$/, '');
  const paths = [
    '/',
    '/outils/',
    '/categories/',
    '/a-propos/',
    '/confidentialite/',
    '/mentions-legales/',
    ...tools.map((t) => `/outils/${t.slug}/`),
    ...categories
      .filter((c) => tools.some((t) => t.category === c.slug))
      .map((c) => `/categories/${c.slug}/`),
  ];

  const today = new Date().toISOString().slice(0, 10);
  const urls = paths
    .map(
      (p) => `  <url>
    <loc>${base}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${p === '/' ? '1.0' : p.startsWith('/outils/') ? '0.8' : '0.5'}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
}
