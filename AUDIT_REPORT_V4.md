# Neyluno V4 — Audit Report: "Énorme en profondeur, minimal à l'écran"

Date: 2 October 2026 · Base: V3 (65 pages, 99 unit + 16 new lib tests, 45 e2e) · Live target: https://neyluno-4tco.onrender.com
Hosting unchanged: Render free static site, 0 €. No backend, no account, no AI cost.

Method: audit-first (§1) — V3 baseline fully re-verified this session (build 65 pages, unit 99/99, e2e 45/45) before touching anything. Then implemented phase by phase, each phase verified by build + unit + e2e before moving on. Final: `tools/v3audit.mjs` harness (console/page errors on every route, overflow, overlays, storage resilience) + screenshot review in `audit/`.

---

## 1. Gates (final state)

| Gate | V3 baseline | V4 result |
|---|---|---|
| Build (Astro SSG) | 65 pages | **77 pages** ✅ |
| Unit tests (`npm test`) | 99 pass | **124 pass, 0 fail** ✅ (+16 flow/calc/textops/naming, +9 workflow validation/JSON) |
| E2E (Playwright, Chromium) | 45 pass | **55 pass, 0 fail** ✅ (45 V3 kept/adapted + 10 new V4 journeys) |
| Route audit harness | clean | **clean** (0 page errors on all 77 routes; only expected 404-test console line) |

## 2. What shipped (per master spec)

### Consolidation (§2, §87) — no page-per-pair anymore
- **Unified Image Converter** (`/tools/image-converter/`): one tool, all directions (→ JPG/PNG/WebP), quality + background-for-JPG options, batch + ZIP, `?to=` deep-link.
- The 4 legacy converter pages now client-redirect to it (`jpg-to-webp`, `png-to-webp`, `webp-to-jpg`, `jpg-to-png`), preserving the target format. Old URLs keep working (SEO).
- **Encoding Lab** (`/tools/encoding-lab/`): Base64 / URL / HTML entities / Unicode escapes in one tabbed tool; legacy `base64-encode-decode` and `url-encode-decode` redirect there with the right tab via `#hash`.

### New tools (registry is the single source of truth — 30 → 41 tools)
- Image studio: **Image Editor** (brightness/contrast/saturation/hue/blur/grayscale/sepia/invert + rotate/flip, undo/redo/reset, live preview), **Watermark** (text, 6 positions + tiling, opacity/size/rotation, batch), **Image Analyzer** (dimensions, MP, ratio, weight, transparency sampling → suggested next actions).
- Text studio: **Text Cleaner**, **Find & Replace** (regex + case control, counter), **Text Diff** (LCS line diff, copy-changes), **Text Extractor** (emails/URLs/numbers/hashtags/mentions, deduped).
- **Calculator**: 5 modes on one page (basic keypad, scientific functions, percentage, finance VAT/discount/compound, everyday average/rule-of-three/age/speed) — real Pratt-parser evaluator, no `eval()`.
- **Color Studio**: picker, HEX/RGB/HSL live conversion, deterministic palettes (tints/shades/complementary/analogous), WCAG 2.2 contrast checker with AA/AAA badges.

### Studios (§7)
- Category pages restyled as **Studios** (URLs preserved): header with tool count, **local search** filtering name/description/keywords/intents, "Popular in this Studio" strip, empty state.

### Batch Engine upgrades (§43–46)
- `fileui.js`: per-file **Cancel** while processing (result dropped, status "Cancelled", Retry available), **naming patterns** (`{name}`, `{n}`, `{ext}`, `{width}x{height}`) with live preview, applied to single downloads and ZIP; image tools expose dimensions in `meta`.

### Workflow 2.0 (§50–53)
- **Validation before run** (`validateWorkflowSteps`, human Cause+Action messages) — no mid-batch config failures; also enforced at save.
- **Stop** during a run (remaining files stay runnable).
- Step **duplicate** button (add/move/remove already existed).
- **JSON export/import**: strict schema validation (`parseWorkflowsJSON` never throws, returns `{ok, error}`), imported workflows are saved — **never auto-executed**; name collisions get `(2)`, `(3)`…

### Flow (§5)
- Rule-based FR+EN intent engine (`src/lib/flow.js`, pure + unit-tested) → tool deep-links (`?to=…`) or **workflow plans**.
- Palette: a highlighted Flow row appears above results when a sentence is understood — deliberately **not** part of the keyboard roving list, so V3 "first result + Enter" behavior is preserved.
- Home hero: Flow card with 3 example sentences (EN + FR) opening the palette pre-filled.
- `/workflows/?plan=<json>` pre-fills the builder after strict validation — nothing runs automatically.

### Settings & History (§74–76)
- New `/settings/` page: theme (dark/light/system radio), language status (honest, no fake control), privacy section listing exactly what localStorage holds with per-item + "clear all" actions, keyboard shortcuts reference, About + version 4.0. Linked from header gear, mobile nav, footer.

### Reliability (§109–112)
- **Error boundary per tool**: inline script in ToolLayout (runs before any module) replaces a crashed tool UI with an honest Cause/Action/Reload panel; resource-load errors ignored to avoid false positives.
- All new engines are pure ES modules with unit tests; no new runtime dependency added (0 new npm package).

## 3. Regressions checked

- All 30 V3 tools still routed and UI-mapped; e2e keeps their journeys green (compressor, resizer, handoff, JSON formatter line/col, UUID, timestamp, regex, QR, password, dates, units, percent, PDF suite, guides, sitemap, 404, FR→EN legacy URLs, mobile nav).
- Intent search: registry `intents` conflicts resolved (e.g. "remove duplicate lines" stays on the dedicated tool, not the cleaner) — proven by `tests/search.test.js`.
- Only test adaptation allowed by the session scope: legacy base64 e2e now asserts the redirect to Encoding Lab and round-trips there (same coverage, new home).

## 4. Known limitations (documented, honest)

- Canvas can only **encode** JPG/PNG/WebP — the converter says so in its FAQ; GIF/BMP/AVIF are decode-only (browser-dependent), friendly errors otherwise.
- `ctx.filter` (Image Editor) is unsupported in a few engines — the tool shows a note instead of silently doing nothing.
- Workflow OCR/PDF thumbnails (§16–23) and image watermark logo (§8 roadmap) are intentionally **not** in this release: no reliable 0 € local path yet, and shipping a broken version would violate "RELIABILITY > features".
- Language section in Settings is informational only (EN-first; dictionary-driven i18n foundation remains a next step, §77).

## 5. Files of record

- Registry: `src/data/tools.js` (41 tools, `group` field, nextSteps).
- Engines: `src/lib/{flow,calc,textops,naming}.js` (+`image.js` background option, `fileui.js` cancel/naming, `workflow.js` validation/JSON).
- UIs: `src/tools/ui/{ImageConverter,ImageEditor,Watermark,ImageAnalyzer,TextCleaner,FindReplace,TextDiff,TextExtractor,Calculator,ColorStudio,EncodingLab,ToolRedirect}.astro`.
- Tests: `tests/v4libs.test.js`, `tests/workflow-v4.test.js`, updated `tests/e2e.mjs`.
- Screenshots: `audit/` (regenerated by `tools/v3audit.mjs`).
