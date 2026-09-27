/** Sitemap generated automatically from the tools registry and static pages. */
import { tools } from '../data/tools.js';
import { categories } from '../data/site.js';

const GUIDE_SLUGS = ['reduce-image-size-for-email', 'convert-webp-to-jpg', 'compress-pdf-for-email', 'create-a-favicon', 'strong-passwords-guide'];

export async function GET() {
  const base = new URL('', import.meta.env.SITE).href.replace(/\/$/, '');
  const paths = [
    '/',
    '/tools/',
    '/categories/',
    '/workflows/',
    '/guides/',
    '/about/',
    '/privacy/',
    '/legal/',
    ...tools.map((t) => `/tools/${t.slug}/`),
    ...categories
      .filter((c) => tools.some((t) => t.category === c.slug))
      .map((c) => `/categories/${c.slug}/`),
    ...GUIDE_SLUGS.map((g) => `/guides/${g}/`),
  ];

  const today = new Date().toISOString().slice(0, 10);
  const urls = paths
    .map(
      (p) => `  <url>
    <loc>${base}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${p === '/' ? '1.0' : p.startsWith('/tools/') ? '0.8' : '0.5'}</priority>
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
