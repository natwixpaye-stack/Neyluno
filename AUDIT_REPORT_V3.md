# QuickTools V3 — Ultra Audit, Polish & Product Quality — Final Report

Date: 27 September 2026 · Base: V2 (65 pages, 99 unit, 43 e2e) · Commit shipped: `f934453`
Live: https://quicktools-4tco.onrender.com · Hosting unchanged: Render free static, 0 €.

Method: inspect everything first (global CSS, layouts, header, search, all shared libs, 30 tool UIs, workflows, guides, legacy routes, tests), then run an automated audit harness (`tools/v3audit.mjs`: console/page errors on all 65+ routes, horizontal overflow at 320/375/390/430/768/1024/1280/1440/1920, overlay behaviors, corrupted-storage resilience) plus screenshot review (desktop/mobile, dark/light) in `audit/`. Fix → retest → re-audit.

---

## Bugs corrigés

| # | Sévérité | Bug | Correction |
|---|---|---|---|
| 1 | **P0** | Le menu mobile (`display:flex`) ignorait l'attribut `hidden` → menu ouvert en permanence sur toutes les pages, desktop et mobile (site semblait cassé). | Règle structurelle unique `[hidden] { display:none !important }` dans global.css (corrige toute la classe de bug, pas un z-index). |
| 2 | **P1** | Tous les `<button hidden>` (×23 : "Start over", "Download all (ZIP)", downloads…) restaient visibles (`.btn{display:inline-flex}` écrasait `hidden`). | Idem règle `[hidden]` globale. |
| 3 | **P1** | Les styles scopés Astro n'atteignent pas les nœuds créés par JS : résultats de la commande palette, étapes/sauvegardes du builder workflow, chips favoris/récents, matches regex, pages PDF→image, aperçus favicon étaient non stylés. | Section globale "Runtime-generated elements" dans global.css (sm-item…, wf-step…, p-chip, rx-list li, pi-page, fav-icon-slot). |
| 4 | **P1** | `localStorage` corrompu (`qt-recents = "42"`) → `TypeError … .map is not a function` à chaque chargement de la home. | `local.js` : lecture défensive `readArray` avec validation de forme (recents/favorites/workflows). |
| 5 | **P1** | Panneaux de mode (Date Calculator "Add/subtract", Resize "percent") visibles simultanément malgré `hidden` (le test e2e remplissait un champ censément caché). | Corrigé par la règle `[hidden]` ; tests e2e mis à jour pour exercer le comportement réel (clic sur l'onglet d'abord). |
| 6 | **P2** | Icône du toggle thème incohérente au chargement (lune affichée en thème clair système). | `syncThemeButtons()` appelé à l'init (icônes + aria-label alignés sur `data-theme-pref`). |
| 7 | **P2** | Fichier échoué dans un batch : aucune action possible à part supprimer. | Bouton **Retry** par item en erreur (fileui), testé en e2e. |
| 8 | **P2** | Messages d'erreur encore en français dans le générateur QR ("Cette adresse ne semble pas valide…", etc.). | Traduits en anglais naturel ; "Publicité" → "Advertisement". |
| 9 | **P2** | Étiquettes d'étapes workflow collées ("1ResizeMax side") — conséquence du bug #3. | Corrigé via #3 + espacement/hiérarchie du builder. |
| 10 | **P2** | Contenu masqué sans JS (`.reveal` à opacité 0) et à l'impression. | Reveal gated par `html.js` (boot script) + garde `@media print`. |

## Défauts visuels corrigés

- Menu mobile fantôme sur desktop (voir P0) — vérifié par screenshots avant/après.
- Builder workflow : étapes sans cadre ni espacement → désormais cartes numérotées alignées (screenshot `audit/v3-workflows-built.png`).
- Command palette : résultats non stylés → rendu premium complet (screenshot `audit/v3-search.png`).
- Header 320 px : overflow après agrandissement des cibles tactiles → nom de marque masqué ≤400 px (le logo reste), plus aucun overflow horizontal sur 9 largeurs × 9 pages.
- CSS mort supprimé (hero canvas, step-cards V1) — moins de poids, plus de confusion.

## UX améliorée

- `/` ouvre la commande palette hors champs de saisie (en plus de Ctrl/Cmd+K) ; Escape ferme palette **et** menu mobile (avec retour du focus au burger).
- Focus piégé dans la modale de recherche (Tab/Shift+Tab cyclent dans le dialogue).
- Retry sur fichier échoué ; stats "failed" toujours réelles.
- Indice `⌘ K` automatique sur claviers Mac.
- Cibles tactiles icon-btn 40 → 44 px (brief a11y), sans casser le layout.

## Outils vérifiés

- Automatisé : les 30 pages outils chargées sans erreur console (harness), plus exercices e2e réels : compressor (fichier valide + corrompu + mauvais format), resizer (handoff), word counter, case converter, dedupe, sort, JSON (erreur ligne/colonne), base64 (round-trip + rejet), UUID batch, timestamp epoch 0, regex highlight, unit (km→mi, 0 °C→32 °F), date (diff + arithmétique via onglet), percentage, password longueur, QR rendu, merge/split/rotate/pdf-to-image via pages 200 + tests unitaires des libs.
- Visuel (screenshots) : home dark/light desktop+mobile, compressor dark/light, workflows, guides, palette, footer.

## Workflows — scénarios vérifiés

Preset chargé (3 étapes stylées, configurables), exécution batch (stats + ZIP), sauvegarde/chargement/suppression, réordonnancement, erreurs d'étape non silencieuses (moteur unit-tested `mergeSteps`/`runPipeline`).

## Responsive — tailles réellement testées

320, 375, 390, 430, 768, 1024, 1280, 1440, 1920 px sur 9 pages clés : **0 overflow horizontal**. Non testé : orientation physique réelle (émulateur uniquement) — risque jugé faible (aucun layout en hauteur fixe hors modale 70 vh).

## Accessibilité

- Clavier : Tab/Shift+Tab, Enter, Space (dropzone), Escape (palette + menu mobile), flèches + Enter dans la palette, `/` et Ctrl/Cmd+K ; focus visible global ; focus piégé dans la modale ; focus rendu au burger.
- `aria-pressed` (favoris, presets), `role="alert"` (erreurs), aria-labels des boutons icon-only, touch targets 44 px, `prefers-reduced-motion` respecté, skip-link, contenu lisible sans JS.

## Performance

- Inchangée et vérifiée : SSG 65 pages ~7 s, home 10,5 Ko gz, libs lourdes en chunks dynamiques (pdf-lib, pdfjs, qrcode, fflate), aucun script tiers. Ajouts V3 : CSS global +2 Ko (règles déplacées, pas dupliquées côté effet), aucune nouvelle dépendance, aucun listener supplémentaire hors un keydown document (palette) déjà présent.

## Privacy

- Vérifié : aucun fetch sortant hors assets statiques (harness écoute le réseau implicitement via console; architecture inchangée) ; localStorage/IndexedDB tous défensifs (corrompu, quota, indisponible) ; handoff local avec TTL ; workflows/favoris/récents purement locaux. Aucune promesse ajoutée.

## SEO

- Fondations V2 intactes (linkcheck 65 pages : 0 lien cassé, title/description/canonical/H1 partout). Routes legacy FR toujours 200 + meta-refresh + canonical + noindex (vérifié en production). Pas de page créée artificiellement.

## Tests — résultats exacts

| Gate | Résultat |
|---|---|
| `npm run build` | ✅ 65 pages |
| `npm test` | ✅ 99/99 |
| `node tests/e2e.mjs` | ✅ 45/45 (dont 2 nouveaux : `/` shortcut ; corrupt file → Retry + stat failed) |
| `node tools/linkcheck.mjs` | ✅ 65 pages, 0 lien cassé |
| Harness `tools/v3audit.mjs` | ✅ 0 erreur console (hors 404 volontaire), 0 overflow, overlays OK, stockage corrompu OK |
| Production | ✅ déployé `f934453`, routes 200, règle `[hidden]` présente dans le CSS servi |

## Régressions

Deux tests e2e V2 ont dû être **corrigés** (pas affaiblis) : ils passaient *grâce* aux bugs (`#mobile-nav[hidden]` attendu "visible" ; champ date remplissable sans activer son onglet). Ils vérifient maintenant le comportement réel, avec une assertion supplémentaire "le menu fermé est vraiment invisible". Aucune fonctionnalité V2 supprimée ; les corrections V2 listées dans le brief (hidden/display, jsonloc, wf delete, thème, linkcheck pre/code, redirects FR) ont été re-vérifiées opérationnelles après V3.

## Limitations restantes (honnêtes)

- Redirects FR = pages meta-refresh (pas de 301 serveur) : limitation du service statique Render créé par API ; contournement propre en place, documenté.
- Pas de renommage direct d'un workflow sauvegardé (recharger + resauver sous un autre nom fonctionne) — non ajouté, jugé hors périmètre "bugs d'abord".
- Compression PDF honnête (ne livre que si plus petit) ; HEIC volontairement absent.
- Vérifications visuelles faites en Chromium headless : rendu Safari/Firefox réel et appareils physiques non testés ici.
- Orientation EXIF : dépend du comportement navigateur par défaut (`from-image`), pas d'extraction manuelle.
- Des commentaires de code restent en français (non visibles des utilisateurs).
