# Neyluno

> Des outils simples, rapides et privés, directement dans ton navigateur.

Plateforme d'outils web gratuits, **100 % statique**, sans compte, sans backend : tous les traitements
(conversion d'images, compression, PDF, QR codes…) s'exécutent dans le navigateur de l'utilisateur.

## Les 10 outils de la V1

| Outil | Catégorie | Traitement |
|---|---|---|
| JPG vers WebP | Images | Canvas (navigateur) |
| PNG vers WebP | Images | Canvas (navigateur) |
| Compresseur d'image | Images | Canvas + comparateur avant/après |
| Redimensionner une image | Images | Canvas, ratio verrouillable |
| Image en PDF | PDF | pdf-lib (chargé à la demande) |
| Fusionner des PDF | PDF | pdf-lib (chargé à la demande) |
| Générateur de QR code | Utilitaires | qrcode (chargé à la demande), export PNG/SVG |
| Calculateur de pourcentage | Calcul | Fonctions pures testées |
| Générateur de mot de passe | Sécurité | `crypto.getRandomValues()` |
| Compteur de mots | Texte | Analyse en temps réel |

## Démarrage rapide

```bash
npm install
npm run dev        # développement → http://localhost:4321
npm run build      # génère le site statique dans dist/
npm run preview    # sert le build de production en local
npm test           # tests unitaires (node:test, 73 tests)
node tests/e2e.mjs # tests navigateur complets (99 assertions, requiert npm run preview)
node tools/linkcheck.mjs  # liens internes + SEO minimum sur le build
```

## Stack

- **Astro 5** — génération statique, zéro JS par défaut, code splitting automatique
- **Vanilla JS** (aucun framework runtime) pour les outils
- **pdf-lib**, **qrcode**, **fflate** — importés dynamiquement *uniquement* quand l'utilisateur
  en a besoin (aucun de ces octets ne pèse sur le chargement initial)
- Polices auto-hébergées (Inter Variable + Space Grotesk Variable), aucun CDN
- Hébergement cible : n'importe quel hébergeur statique gratuit (Netlify, Cloudflare Pages,
  Vercel, GitHub Pages, Pages OVH…)

## Configuration centrale

Tout se règle dans **`src/data/site.js`** : nom du site, baseline, thème par défaut,
catégories, activation publicitaire (`ads.enabled`), activation analytics (`analytics`).

Le registre des outils est dans **`src/data/tools.js`** (slug, textes, FAQ, SEO, mots-clés).

> ⚠️ Avant mise en production : remplacer `https://neyluno.example.com` par le vrai domaine
> dans `astro.config.mjs` (canonical, Open Graph, sitemap) et `public/robots.txt`.

## Ajouter un outil (5 minutes)

1. Ajouter l'entrée dans `src/data/tools.js` (slug, textes, FAQ, SEO).
2. Créer `src/tools/ui/MonOutil.astro` (interface + `<script>`).
3. L'enregistrer dans `UI_MAP` de `src/pages/outils/[slug].astro`.

La page, le sitemap, la recherche, les breadcrumbs, les outils similaires, la catégorie et le
maillage interne sont générés automatiquement.

## Architecture

```
src/
├── components/      # Header, Footer, ToolCard, SearchModal, FAQ, AdPlaceholder…
├── data/            # site.js (config centrale) + tools.js (registre)
├── layouts/         # BaseLayout (SEO global) + ToolLayout (structure page outil)
├── lib/             # logique pure testable : percentage, password, text, qrdata,
│                    # search, format, files, image + ui.js + fileui.js (moteur fichiers)
├── pages/           # index, outils/[slug], categories/[slug], légales, sitemap.xml
├── styles/          # global.css (design system, thèmes clair/sombre)
└── tools/ui/        # une interface .astro par outil
tests/               # 7 fichiers de tests unitaires + e2e.mjs (Playwright)
tools/linkcheck.mjs  # audit liens internes + SEO du build
```

## Monétisation (prête, désactivée)

Les emplacements `AdPlaceholder` existent déjà (après le hero, après le résultat des outils).
Pour activer : `site.ads.enabled = true` + injecter le code régie dans le composant.
Règles codées dans le composant : jamais sur un bouton, toujours étiqueté « Publicité ».

## Analytics (prête, désactivée)

`src/lib/analytics.js` expose `track(event, data)` avec file d'attente. Activer un outil
respectueux de la vie privée (Plausible/Umami/Matomo) via `site.analytics`.

## Confidentialité

Aucun fichier n'est uploadé, aucun compte, aucun tracking. Seul le choix de thème est stocké en
`localStorage`. Pages `/confidentialite/` et `/mentions-legales/` à compléter selon vos
obligations avant production.
