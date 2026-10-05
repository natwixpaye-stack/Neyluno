# Neyluno — V4.1 Audit & Finalization Report

Date: 2026-10-03 · Baseline: V4 (live on Render, commit `c72cd88`) · Motto: **énorme en profondeur, minimal à l'écran**

---

## 1. Avant / Après

| Area | V4 (before) | V4.1 (after) |
|---|---|---|
| Tools in registry | 41 | **43** (+ PDF Organizer, PDF → Text) |
| Pages built | 75 | **83** |
| PDF manipulation | merge / split / rotate / compress only | **+ Organizer** (thumbnails, select, reorder, rotate, duplicate, delete, metadata read/edit/strip) **+ PDF → Text** (honest scan detection) **+ PdfToImage bug fixed** (latent since V3: pdfjs namespace import) |
| Image editor controls | brightness, contrast, saturation, grayscale, blur | **+ hue, sepia, invert** (full §9 checklist) |
| Unit converter | 6 categories | **10 categories** (+ area, energy, pressure, time) |
| Calculator | basic / percentage / finance / everyday | **+ multiplier** (coefficient), **+ weighted average**, **+ fuel consumption & trip cost** |
| Utilities | QR only for §16 | Timer/Pomodoro/Lorem deferred to V5 (see §4 below) |
| Student mode | — | **New curated page** `/student/` — links only, zero duplicated logic (§17) |
| Handoff (§19) | used by a few tools | Watermark, Image Editor, Image Analyzer now **save and consume** the handoff |
| Batch summary | done / failed counts | **+ Cancelled count** (§20), summary shown when only errors/cancels |
| Flow (§22) | FR+EN intents V4 | **+ discount/TVA intents**, **+ PDF organize/delete-pages intent**, **+ PDF text-extraction intent** (disambiguated from "extract pages" → split) |
| i18n (§27) | none | **Foundation**: `translations.js` dictionaries + `i18n.js` runtime, Settings switch, applied to all JS-rendered tool strings (batch statuses, palette). Honest partial coverage label. |
| PWA (§26) | none | **manifest.webmanifest + service worker** (app shell only, network-first navigations, immutable hashed assets; user files never cached) |
| Guides (§35) | 5 guides | **8 guides** (+ merge PDFs, extract PDF text, Base64) |
| Privacy (§25) | prose | **Exhaustive storage table** (what / where / key / lifetime) + centralized `site.contactEmail` |
| Feedback (§36) | none | Settings panel: mailto + copy address, no backend by design |
| Settings | v4.0 | v4.1: language control, feedback panel, `qt-lang` cleared by "clear all" |

## 2. What was improved (non-regression safe)

- **fileui.js**: all user-facing strings now dictionary-driven; cancelled items counted; summary visibility covers error/cancel-only batches.
- **flow.js**: text-extraction detected before the generic split rule (prevents "extract text" → wrong tool); discount/VAT requests route to the calculator with a tailored message.
- **PdfToImage**: silent V3 bug fixed (namespace import) — verified rendering 3 pages via CDP probe.
- **tests/e2e.mjs**: hardcoded counts replaced by registry-driven constants (`TOOL_COUNT`, `PDF_COUNT`) — no more count drift on every new tool.
- Guides, privacy and settings keep the "Cause / Action" friendly-error and honest-copy conventions.

## 3. Test & route results (final gate)

| Gate | Result |
|---|---|
| `npm test` (unit) | **138/138 pass** (124 baseline + 8 Flow + 6 i18n) |
| `node tests/e2e.mjs` | **61/61 pass** (55 V4 + 6 new V4.1 checks) |
| `npm run build` | **83 pages, clean**, no warnings |
| Routes probed | `/`, `/student/`, `/settings/`, `/privacy/`, `/manifest.webmanifest`, `/sw.js`, `/guides/{merge-pdf-files,extract-text-from-pdf,base64-encoding}/` → all 200 |
| Console errors | none across audited pages (probes included) |
| Cancelled-count probe | summary shows `1` cancelled, no page errors |

## 4. Deliberately NOT added (with reasons)

| Item | Reason |
|---|---|
| PDF password protection | pdf-lib cannot encrypt reliably client-side (§6: skip rather than ship fragile) → V5 |
| OCR for scanned PDFs | heavy/experimental; architecture note only (§6.6, §7); PDF → Text states honestly when no text layer exists |
| PDF thumbnails inside Workflows builder | non-trivial; §8 says V5 unless trivial |
| Timer / Stopwatch / Pomodoro / Lorem Ipsum (§16) | deferred — every existing surface had open QA items first; stability > feature count. Slated first for V5. |
| CSV formatter, code formatters, HTTP/MIME reference | not natural small pieces (§11) → V5 |
| Watermark with image logo | canvas compositing of arbitrary logos adds real QA surface → V5 |
| Full site translation | dictionary foundation shipped; translating 83 static pages is a V5 project — Settings labels French "(partiel)" honestly (§27) |
| Analytics (§37) | explicitly V5 |
| Accounts / cloud / sync / payments / API (§38) | V4 locked boundary — none shipped, none planned for V4.x |

## 5. V5 candidate list

1. Utilities expansion: Timer, Stopwatch, Pomodoro, Lorem Ipsum (first candidates, §16 remainder).
2. Real OCR pipeline decision (local wasm vs honest skip) + scanned-PDF workflows.
3. PDF encryption if a reliable local crypto path exists.
4. Full FR translation pass once dictionary proves itself in production.
5. CSV/code formatters, HTTP status & MIME reference pages.
6. Watermark image-logo mode.
7. Aggregated, privacy-respecting analytics (opt-in, declared in Privacy first).

## 6. Known limitations (declared, not hidden)

- Service worker caches pages visited (offline shell); it does **not** pre-cache all 83 routes — first offline visit to an unseen page falls back to `/`.
- Manifest icons reuse `favicon.svg` (any) + `og-cover.png`; no dedicated square PNG app icon yet (Chromium accepts SVG; cosmetic only).
- French dictionary covers JS-rendered strings only; static copy remains English-first (documented in Settings).
- Handoff holds one file, 10-minute TTL — by design, not a limitation bug.

---

## 7. V4 LOCK

All §56 priority blocks closed. Gates green. Registry = single source of truth (43 tools).
**V4 is locked.** New feature requests go to V5.
