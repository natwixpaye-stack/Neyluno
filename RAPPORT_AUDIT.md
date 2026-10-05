# Neyluno — Rapport d'audit final (V1)

Date : 27 septembre 2026 · Build de production vérifié (`npm run build`), serveur preview testé.

## Méthodologie

Trois niveaux de vérification, tous rejouables :

1. **Tests unitaires** — `npm test` : fonctions pures (pourcentages, mots de passe, comptage de
   texte, recherche, construction QR, validation fichiers, formatage). Cas valides, invalides,
   vides, limites, division par zéro, flottants.
2. **Tests navigateur (e2e)** — `node tests/e2e.mjs` (Chromium headless) : chaque outil exercé
   avec entrée valide, invalide, vide, corrompue, trop grosse, mauvais format, multi-fichiers,
   téléchargement, réinitialisation, refresh, viewports mobile/desktop.
3. **Audit statique du build** — `node tools/linkcheck.mjs` : liens internes, assets, et SEO
   minimum (title, meta description, canonical, H1) sur les 23 pages.

## Fonctionnalités

| Outil | Résultat | Vérifications clés |
|---|---|---|
| 1. JPG → WebP | ✅ PASS | conversion réelle (magic bytes), multi-fichiers, ZIP, qualité, suppression, reset, fichier vide/corrompu/trop gros/mauvais format, refresh, mobile |
| 2. PNG → WebP | ✅ PASS | conversion + transparence, JPG refusé avec message, export vérifié (RIFF/WEBP) |
| 3. Compresseur | ✅ PASS | avant/après + % économie, comparateur visuel, JPG/PNG/WebP, avertissement PNG sans perte |
| 4. Redimensionner | ✅ PASS | dimensions de sortie vérifiées pixel-par-pixel (100×50, 300×300), ratio verrou/déverrou, mode %, dimensions excessives refusées |
| 5. Image en PDF | ✅ PASS | PDF vérifié avec pdf-lib (nb pages, A4 paysage 842×595), réorganisation ↑↓, image corrompue → erreur explicite |
| 6. Fusionner PDF | ✅ PASS | 2+3=5 pages vérifié, compteur de pages par fichier, PDF protégé/illisible signalé, non-PDF refusé |
| 7. QR code | ✅ PASS | aperçu temps réel, exports PNG+SVG vérifiés, URL/e-mail invalides, Wi-Fi avec échappement, couleurs |
| 8. Pourcentage | ✅ PASS | 5 modes, virgule décimale française, division par 0, texte invalide (13 tests unitaires) |
| 9. Mot de passe | ✅ PASS | longueur 4-48, familles de caractères, exclusion ambigus, entropie, copie presse-papiers vérifiée, crypto.getRandomValues |
| 10. Compteur de mots | ✅ PASS | mots/caractères/phrases/paragraphes/lignes, virgules typographiques, 200 000 mots sans erreur |

**Résultat e2e : 99/99 assertions.** Tests unitaires : 73/73.

## Responsive

| Viewport | Résultat | Détails |
|---|---|---|
| Mobile 320 / 375 / 390 px | ✅ PASS | aucun débordement horizontal mesuré, menu burger, dropzones et listes utilisables |
| Tablette | ✅ PASS | grilles auto-adaptatives (testé via grilles `auto-fill`) |
| Desktop / grand écran | ✅ PASS | hero, halo curseur, comparateur, modal recherche |

## SEO

| Contrôle | Résultat |
|---|---|
| Metadata (title/description uniques par page) | ✅ PASS (vérifié sur 23 pages) |
| Sitemap.xml (22 URL, priorités, lastmod) | ✅ PASS |
| robots.txt | ✅ PASS (⚠️ domaine exemple à remplacer) |
| Canonical | ✅ PASS sur toutes les pages |
| Open Graph + Twitter/X | ✅ PASS (image og 1200×630 générée) |
| Données structurées | ✅ PASS — SoftwareApplication + FAQPage + BreadcrumbList + WebSite + ItemList |
| H1 unique + hiérarchie H2/H3 | ✅ PASS |
| Contenu lisible sans JS | ✅ PASS — textes, FAQ, SEO rendus en HTML statique |
| Liens internes | ✅ PASS — 0 lien cassé (linkcheck) |

## Accessibilité

| Contrôle | Résultat |
|---|---|
| Navigation clavier | ✅ PASS (Tab, Entrée, Ctrl+K, flèches dans la recherche, Esc) |
| Focus visible | ✅ PASS (`:focus-visible` global accent) |
| Labels / aria | ✅ PASS (aucun bouton sans label, aucune img sans alt — vérifié par script) |
| Contrastes | ✅ PASS texte principal (>7:1) ; couleur `--faint` réservée aux indications secondaires |
| `prefers-reduced-motion` | ✅ PASS (particules, reveals, transitions désactivés) |
| Fonctionnement sans souris | ✅ PASS (dropzone activable Entrée/Espace, réorganisation par boutons ↑↓) |
| Messages d'erreur accessibles | ✅ PASS (`role="alert"`, `aria-live`) |

## Performance

| Poste | Mesure |
|---|---|
| Chargement initial (chemin critique) | < 50 Ko gzip (HTML + CSS + JS) par page |
| Code splitting | ✅ un chunk JS par outil ; pdf-lib (177 Ko gz), qrcode (~10 Ko gz), fflate (~12 Ko gz) chargés **uniquement à l'action** |
| Polices | auto-hébergées, `font-display: swap`, subsets woff2 |
| Animations | transform/opacity uniquement, canvas DPR plafonné 1.5, pause quand l'onglet est masqué |
| Images | aucune image décorative lourde (SVG inline) ; OG image unique |
| Layout shift | pas de slot pub rendu tant que `ads.enabled=false`, pas d'images sans dimensions |

## Confidentialité & coûts

- ✅ 0 upload serveur, 0 compte, 0 cookie, 0 tracking activé
- ✅ 1 seul état stocké : le thème (localStorage)
- ✅ Déployable sur tout hébergeur statique gratuit (0 €/an)

## Bugs connus / limites honnêtes

1. **Domaine placeholder** : `neyluno.example.com` est utilisé dans `astro.config.mjs`,
   `robots.txt` et le sitemap. À remplacer par le domaine réel avant production (README, §Configuration).
2. **Pages légales à compléter** : `/confidentialite/` et `/mentions-legales/` contiennent des
   sections `[à compléter]` (éditeur, hébergeur) — obligatoire avant mise en ligne (LCEN/RGPD).
3. **Safari < 16** : l'encodage WebP via Canvas n'existe pas ; l'outil affiche désormais une
   erreur explicite (garde-fou `blob.type`) au lieu de produire un faux WebP. À revérifier
   manuellement sur Safari réel.
4. **Réorganisation des listes** : implémentée par boutons ↑↓ (fiable tactile + clavier + lecteurs
   d'écran). Le drag & drop natif de réordonnancement n'est pas ajouté (le drag & drop d'ajout de
   fichiers, lui, fonctionne partout).
5. **Tests multi-navigateurs** : la campagne automatisée a été menée sur Chromium headless.
   Firefox/Safari partagent les mêmes APIs web, mais un passage manuel rapide est recommandé.
6. **PDF chiffrés** : `ignoreEncryption` permet certains PDF protégés, mais les PDF verrouillés
   par mot de passe sont détectés et refusés avec un message clair (comportement voulu).
7. Le ZIP « Tout télécharger » porte un nom fixe (`neyluno-export.zip`).

Aucun bug bloquant connu. Les points 1 et 2 sont des actions de mise en production, pas des défauts
de code.
