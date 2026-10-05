# Neyluno V2 — Final Audit Report ("Global Growth")

Date: 27 September 2026 · Production build verified (`npm run build`), preview-tested in headless Chromium, live-verified on Render.
Live: **https://neyluno.onrender.com** · Repo: `natwixpaye-stack/Neyluno` (main, `e5fe40c`) · Hosting: Render free static site (0 €/month).

## Executive summary

Neyluno V2 is a complete, English-first transformation of the V1 French site, rebuilt **in place** (no restart): the existing architecture (Astro 5 SSG + vanilla JS, per-tool components, shared design system) was kept and extended.

| Gate | Result |
|---|---|
| Static build | ✅ 65 pages, ~8 s, zero warnings |
| Unit tests (`npm test`) | ✅ 99/99 |
| Browser e2e (`node tests/e2e.mjs`) | ✅ 43/43 |
| Link & SEO check (`node tools/linkcheck.mjs`) | ✅ 65 pages, 0 broken links, title/description/canonical/H1 present everywhere |
| Live routes (curl) | ✅ all EN routes 200; all legacy FR routes redirect to EN equivalents |
| Cost | ✅ 0 € — static hosting, no backend, no paid API, no ads |

Everything the brief asked for is shipped, tested and live: task-oriented home with intent search, 30 finished tools, workflows with saved pipelines, batch processing with stats and auto-ZIP, favorites/recents, 3-state theme, guides, full SEO, and client-side-only processing.

## Methodology (replayable)

1. `npm test` — 99 unit tests over pure functions (search intents, workflow merge, file validation, formatting, percentages, passwords, QR payloads, JSON error locating, PDF page ranges).
2. `node tests/e2e.mjs` — 43 browser assertions (Chromium headless): home, search, favorites/recents, theme, every tool exercised with valid/invalid input, workflows end-to-end (preset → batch run → stats → ZIP → save/load/delete), file handoff, all routes, 404, mobile nav.
3. `node tools/linkcheck.mjs` — internal link + SEO minimum scan over the built site.
4. Production curl checks — status codes, redirect targets, sitemap, OG image.

## 1 · Product: task-oriented, not tool-oriented

- Home hero: **"Get things done. Fast."** with the giant *"What do you want to do?"* bar as the centerpiece; rotating task-phrase examples in the placeholder.
- Popular quick actions row (real links to real tools).
- Intent-based local search (no paid AI): synonym and task-phrase mapping in `src/lib/search.js`. E.g. `"make my photo smaller"` → Image Compressor, `"webp to jpg"` → WebP→JPG, `"merge two pdfs"` → Merge PDF. Tested with 7 intent cases. Opens with `Ctrl+K` / `/`, full keyboard navigation (arrows, Enter).
- Tool pages lead with the task ("Drop images to compress them"), not with marketing.

## 2 · Tools — 30 shipped, all finished

Every tool: drag & drop + file picker, mobile-friendly targets, progress for heavy work, instant results, obvious download buttons, "Start over", friendly errors (never a raw `DOMException`).

| Category | Tools | E2E highlights verified |
|---|---|---|
| Image (9) | Compressor, Resizer, JPG→WebP, PNG→WebP, WebP→JPG, JPG→PNG, Rotator, Cropper, Favicon generator | real re-encoding (canvas), before/after + savings %, wrong format rejected with a friendly message |
| PDF (6) | Merge, Split (page ranges), Compress, Rotate, Image→PDF, PDF→Image | pdf-lib rebuild; split ranges validated (`1-3,5`); compress only delivers when actually smaller (honest) |
| Text (5) | Word counter, Case converter, Sort lines, Dedupe lines, JSON formatter | live stats; JSON errors reported as *"line 3, column 12: …"* via an in-house locator |
| Developer (6) | Base64, URL encode/decode, UUID, Timestamp, Regex tester, (JSON above) | unicode round-trip, garbage rejected kindly, batch UUID options, epoch 0 → 1970 |
| Everyday (4) | Unit converter, Date calculator, Percentage calculator, Password generator, QR generator (6 payload types incl. Wi-Fi escaping) | km→mi, 0 °C→32 °F, date diff/add, 20-char passwords |

**"Do more with this file"**: after a result, a handoff chip offers the next logical tool (compress → resize/WebP/favicon), passing the file locally via IndexedDB with TTL. Tested.

## 3 · Key differentiator: Workflows

`/workflows/` — upload once, chain steps, get one ZIP:
- Steps: resize (max side), compress (quality %), convert (format). Add / remove / move / configure.
- Presets: *Optimize for web*, *Email-friendly*, *Thumbnails*.
- Named workflows saved in `localStorage`, load/delete tested.
- Batch runner: per-file progress + status, batch summary (count, done/failed, before/after totals, % saved), auto-ZIP via `fflate` with name de-duplication.
- Engine (`src/lib/workflow.js`) is pure and unit-tested (`mergeSteps`, presets, pipeline order).

## 4 · Batch & stats

Shared batch engine (`src/lib/fileui.js`): done/failed counters, progress bar, total before/after sizes and savings, per-file retry/remove, ZIP download for multi-results. No invented stats — numbers come from real `File.size` values.

## 5 · Performance (a feature)

- Static SSG; home HTML **10.5 KB gzipped**, tool page **7.6 KB**.
- Code splitting: heavy libs (`pdf-lib`, `pdfjs-dist` + worker, `qrcode`, `fflate`) are separate chunks loaded only on the tool that needs them (verified: dynamic `import()` in built assets).
- Fonts: Inter Variable + Space Grotesk, `font-display: swap`, latin subsets only.
- No blocking third-party scripts; no analytics by default (`src/lib/analytics.js` is a no-op stub, flag off).

## 6 · Privacy — claims that are technically true

- "Files are processed on your device" — true: all processing is in-browser (canvas/pdf-lib); the only network traffic is fetching the static site itself.
- File handoff uses IndexedDB with a TTL; nothing leaves the machine.
- No signup, no blocking popups, no invasive tracking, no ads shipped (clean `AdPlaceholder` + flags in `src/data/site.js` for a future, discreet, non-blocking monetization layer).

## 7 · SEO & content

- 65 pages: home, 30 tools, 7 category pages, tools index, workflows, 5 guides + guides index, about/privacy/legal, 404, plus 14 legacy-FR redirect pages (noindex).
- Per page: unique title + meta description, canonical, single H1, semantic H2/H3; content useful without JS.
- JSON-LD: `WebSite` + `SearchAction`, `SoftwareApplication`/`HowTo`/`FAQPage`/`BreadcrumbList`, `Article` for guides.
- `sitemap.xml` (tools + guides + workflows), `robots.txt`, OG/Twitter tags with a fresh EN 1200×630 cover.
- Guides: 5 genuinely useful long-tail articles (email image size, WebP→JPG, PDF for email, favicons, strong passwords) — human-written, cross-linked to tools, FAQ schema, no keyword stuffing.

## 8 · Legacy URLs

Render's API-created static service silently ignores `redirects` (documented limitation), so legacy French URLs are handled by lightweight noindex redirect pages (meta-refresh 0 + JS `location.replace` + canonical to the EN target): all 10 old `/outils/*` slugs map to their exact EN equivalents, plus `/outils`, `/a-propos`, `/confidentialite`, `/mentions-legales`. Verified live: each returns the correct target. `render.yaml` documents the ideal 301 set should the site ever be re-created from the blueprint.

## 9 · Design, a11y, responsive

- Premium minimal dark-first design; Light / Dark / **System** theme, remembered; boot script prevents flash.
- Keyboard: search modal, theme toggle, favorites, all forms operable; visible focus rings; `aria-pressed` on favorites; labels on icon buttons; `role="alert"` on errors; touch targets ≥ 44 px; `prefers-reduced-motion` honored (animations reduced).
- Mobile: burger nav (e2e), dropzones and lists usable at 375 px, no horizontal overflow.

## 10 · Bugs found & fixed during this audit

1. `hidden` attribute overridden by `display:flex/grid` on 15+ V2 blocks (QR empty state, batch summary, handoff chips, results panels) → global `[hidden]` guard.
2. JSON formatter relied on V8 "position N" errors (absent in modern Chrome) → wrote `src/lib/jsonloc.js` (tested scanner) reporting line/column/hint.
3. Workflow saved-list delete button missing its `data-rm` hook.
4. Theme e2e assumed wrong initial preference → tests now assert the 3-state cycle generically.
5. Linkcheck false positives from escaped HTML inside guide `<pre>` snippets → scanner now strips code blocks.
6. `getStaticPaths` isolation for the FR redirect page (map moved to `src/data/legacyRedirects.js`).

Each fix was re-tested: unit 99/99, e2e 43/43, linkcheck clean, no regressions.

## 11 · Known limitations (honest)

- Legacy FR URLs are client-side redirects (meta refresh), not HTTP 301 — Render's API-created static service doesn't accept redirects; acceptable SEO-wise via `noindex` + canonical.
- PDF compression is a clean rebuild; it only delivers the file when smaller (the UI says so — no fake "‑80 %" claims).
- HEIC→JPG intentionally not shipped (heavy WASM, poor reliability/weight trade-off).
- English-only for now; the architecture (single EN source, route + content separation) is ready for localization later.

## 12 · Deployment & hygiene

- Auto-deploy from GitHub on push; both V2 commits verified live.
- ⚠️ **Action for the owner**: the GitHub PAT and Render API key shared in chat must be revoked/rotated (GitHub → Settings → Developer settings; Render → Dashboard → Account → API Keys). The new PAT used for this push should be deleted after use too.

## Conclusion

V2 ships a faster, broader, globally-readable product on the same zero-cost stack: 30 finished tools, workflows, batch stats, intent search, guides, and an a11y/SEO discipline verified by 99 unit + 43 e2e assertions and a clean 65-page static audit. No dead buttons, no fake features, no tracking — and a clear, flag-gated path to monetization when desired.
