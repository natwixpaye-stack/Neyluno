import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Domaine de production (sert à canonical + sitemap + Open Graph)
  site: 'https://neyluno.onrender.com',
  trailingSlash: 'ignore',
  server: { host: true, port: 4321, allowedHosts: true },
  preview: { host: true, port: 4321, allowedHosts: true },
  build: {
    inlineStylesheets: 'auto',
    assets: '_assets',
  },
  compressHTML: true,
  devToolbar: { enabled: false },
});
