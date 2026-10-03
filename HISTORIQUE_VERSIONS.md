# QuickTools — Historique complet des versions

Site en production : **https://quicktools-4tco.onrender.com**
Dépôt GitHub : `natwixpaye-stack/Quicktools` · Hébergement : Render (statique gratuit, 0 €)
Stack : Astro 5 (SSG) + JavaScript vanilla — tout le traitement des fichiers se fait dans le navigateur.

---

## V1 — Lancement (site français)

**Objectif** : prouver le concept — une poignée d'outils locaux, rapides, sans compte, sur un design premium.

### Ce qui a été ajouté
- **10 outils** (traitement 100 % local) :
  1. JPG → WebP
  2. PNG → WebP
  3. Compresseur d'image (avant/après, % d'économie)
  4. Redimensionneur d'image (ratio, %, dimensions exactes)
  5. Image → PDF
  6. Fusionner PDF
  7. Générateur de QR code (URL, e-mail, téléphone, SMS, Wi-Fi)
  8. Calculateur de pourcentage (5 modes)
  9. Générateur de mot de passe (entropie, familles de caractères)
  10. Compteur de mots
- **Traitement par lot** : plusieurs fichiers, statuts, téléchargement ZIP.
- **Design system** sombre premium : accents ambre/corail, Space Grotesk + Inter, halo au survol des cartes, micro-interactions.
- **Drag & drop** accessible (clavier inclus), erreurs amicales, boutons "recommencer".
- **SEO complet** : titles/descriptions uniques, canonical, sitemap.xml, robots.txt, Open Graph + image de couverture, JSON-LD (SoftwareApplication, FAQ, Breadcrumb).
- **Accessibilité** : skip-link, focus visible, aria, `prefers-reduced-motion`.
- **Tests** : 73/73 unitaires · 99/99 e2e navigateur · linkcheck 0 lien cassé.
- **Déploiement** : GitHub → Render (auto-déploiement à chaque push), domaine `quicktools-4tco.onrender.com`.

Commits : `ef03584`, `d938c5e` · Rapport : `RAPPORT_AUDIT.md`

---

## V2 — "Global Growth" (passage à l'anglais, ×3 outils)

**Objectif** : devenir un produit mondial — "The fastest place to get small digital tasks done."

### Positionnement & navigation
- Site **entièrement traduit en anglais** (architecture prête pour d'autres langues plus tard).
- Homepage orientée **tâches**, pas outils : hero « Get things done. Fast. », barre géante « What do you want to do? », exemples rotatifs, quick actions populaires.
- **Recherche par intention** (Ctrl/Cmd+K) : comprend les phrases naturelles (« make my photo smaller » → Image Compressor), synonymes, navigation clavier.
- Favoris + outils récents (localStorage), page par page et sur la home.
- Thème **Light / Dark / System** mémorisé, sans flash au chargement.

### Nouveaux outils (+20 → 30 au total)
- **Image** : WebP → JPG, JPG → PNG, rotateur, cropper, générateur de favicon (kit complet ICO/PNG).
- **PDF** : diviser (plages de pages), compresser (honnête : ne livre que si plus petit), pivoter, PDF → image (png par page).
- **Texte** : convertisseur de casse, tri de lignes, suppression de doublons, formateur JSON (erreur ligne/colonne).
- **Dev** : Base64, URL encode/decode, UUID, convertisseur de timestamp, testeur de regex.
- **Quotidien** : convertisseur d'unités, calculateur de dates.

### Le différenciateur : Workflows
- Chaînage d'étapes **resize → compress → convert** sur tout un lot, presets (Optimize for web, Email-friendly, Thumbnails), ajout/déplacement/suppression/configuration d'étapes, **sauvegarde locale**, export **ZIP** unique, statistiques réelles (avant/après, économie).

### Qualité produit
- **« Do more with this file »** : après un résultat, propose l'outil suivant et transmet le fichier localement (IndexedDB avec expiration).
- **5 guides longue traîne** réellement utiles (image pour e-mail, WebP→JPG, PDF pour e-mail, favicon, mots de passe) avec FAQ schema.
- **SEO global** : pages EN propres, JSON-LD étendu, image OG régénérée en anglais.
- **Routes françaises legacy** redirigées vers leurs équivalents EN (pages de redirection meta-refresh + canonical, car le service Render actuel n'accepte pas les redirects serveur).
- **Performance préservée** : code splitting, libs lourdes (pdf-lib, pdfjs, qrcode, fflate) chargées uniquement par l'outil qui les utilise.

### Chiffres
65 pages · 99/99 unitaires · 43/43 e2e · linkcheck propre.
Commits : `20bdbe5`, `e5fe40c` · Rapport : `AUDIT_REPORT_V2.md`

---

## V3 — "Ultra Audit, Polish & Product Quality"

**Objectif** : aucun nouvel outil — traquer les défauts réels (visuels, UX, robustesse) que les tests automatisés ratent, et donner une sensation de produit fini.

### Bugs majeurs découverts & corrigés
- **P0 — menu mobile ouvert en permanence** (sur desktop aussi) : `display:flex` écrasait l'attribut `hidden`. Corrigé par une règle structurelle `[hidden] { display:none !important }`.
- Cette même règle a réparé **23 boutons** ("Start over", "Download all (ZIP)"…) qui restaient visibles à vide, et des **panneaux superposés** (modes Date Calculator / Resize).
- **Styles manquants sur tout le DOM créé par JS** (limite d'Astro) : résultats de la palette de recherche, étapes & sauvegardes du builder workflow, chips favoris/récents, matches regex, pages PDF→image, aperçus favicon → déplacés en CSS global.
- **Crash au chargement si localStorage corrompu** (`qt-recents = "42"`) → lectures défensives validées (favoris, récents, workflows).
- **Icône de thème incohérente** au chargement (lune affichée en clair) → synchronisation au boot.
- **Fichier échoué sans recours** → bouton **Retry** par fichier en erreur.
- **Messages encore en français** dans le générateur QR → traduits.
- **Contenu invisible sans JS / à l'impression** (animations reveal) → gate `html.js` + garde print.

### UX & accessibilité ajoutées
- `/` ouvre la recherche (en plus de Ctrl/Cmd+K) ; **Escape** ferme palette **et** menu mobile (focus rendu).
- **Focus piégé** dans la modale de recherche (Tab cyclique).
- Cibles tactiles portées à **44 px** ; `⌘ K` affiché automatiquement sur Mac.
- Header corrigé à **320 px** (plus aucun overflow horizontal sur 9 largeurs testées).
- CSS mort supprimé (restes V1).

### Vérifications
Harness d'audit maison : 0 erreur console sur 65+ routes, 0 overflow (320→1920 px), overlays (ouverture/fermeture/Escape/scroll), résilience stockage, screenshots dark/light desktop+mobile conservés dans `audit/`.

### Chiffres
65 pages · 99/99 unitaires · **45/45 e2e** (2 nouveaux tests réels) · linkcheck propre · déployé.
Commits : `f934453`, `8cd27a0` · Rapport : `AUDIT_REPORT_V3.md`

---

## V4 — "Énorme en profondeur, minimal à l'écran" (version gratuite complète & mature)

**Objectif** : passer de 30 outils fiabilisés à une plateforme quotidienne, extrêmement polyvalente, sans rien casser ni multiplier les pages.

### Consolidation (pas de page par paire de formats)
- **Convertisseur d'image unifié** (`/tools/image-converter/`) : toutes les directions (→ JPG/PNG/WebP), qualité, couleur de fond pour le JPG, lot + ZIP, deep-link `?to=`.
- Les 4 anciennes pages de conversion **redirigent** vers lui (URLs conservées pour le SEO) ; `base64-encode-decode` et `url-encode-decode` redirigent vers l'**Encoding Lab** (Base64/URL/HTML/Unicode en onglets).

### 11 nouveaux outils (30 → 41), registre = source unique de vérité
- **Studio Image** : Éditeur d'image (luminosité/contraste/saturation/teinte/flou/N&B/sépia/inversion + rotation/miroir, undo/redo), Filigrane (texte, 6 positions + tuile, opacité/taille/rotation, lot), Analyseur d'image (dimensions, MP, ratio, poids, transparence → actions suggérées).
- **Studio Texte** : Nettoyeur de texte, Rechercher & remplacer (regex), Diff de texte (LCS ligne à ligne), Extracteur (emails/URLs/nombres/hashtags/mentions, dédupliqués).
- **Calculateur** : 5 modes sur une page (basique, scientifique, pourcentage, finance TVA/remise/intérêts composés, quotidien) — vrai parseur, sans `eval()`.
- **Color Studio** : pipette, HEX/RGB/HSL, palettes déterministes, contraste WCAG 2.2 (badges AA/AAA).

### Studios
- Les pages catégories deviennent des **Studios** (URLs conservées) : recherche locale (nom/description/mots-clés/intentions), bandeau "Popular", état vide.

### Moteur de lot (fileui)
- **Annulation** par fichier pendant le traitement (statut "Cancelled" + Retry).
- **Motifs de nommage** `{name}`, `{n}`, `{ext}`, `{width}x{height}` avec aperçu live, appliqués aux téléchargements et au ZIP.

### Workflow 2.0
- **Validation avant exécution** (messages Cause + Action), **Stop** pendant le run, bouton **dupliquer** une étape.
- **Export/import JSON** : validation stricte, jamais d'exécution automatique à l'import.

### Flow (règles FR+EN, sans IA)
- Moteur d'intention pur et testé (`flow.js`) : phrase naturelle → outil (deep-link) ou **plan de workflow**.
- Ligne Flow en tête de la palette (hors navigation clavier pour préserver le comportement V3), carte Flow dans le hero avec exemples EN+FR, pré-remplissage du builder via `?plan=`.

### Settings & historique
- Page `/settings/` : thème (dark/light/system), langue (statut honnête), confidentialité avec **effacement par catégorie ou total** des données locales, raccourcis clavier, À propos + version 4.0. Accès : engrenage header, menu mobile, footer.

### Fiabilité
- **Error boundary par outil** : un outil qui plante affiche un panneau Cause/Action/Recharger au lieu d'une interface morte.
- 0 nouvelle dépendance npm ; tous les nouveaux moteurs sont des modules purs testés.

### Vérifications
- Baseline V3 re-validée en début de session (build 65, unitaires 99/99, e2e 45/45) avant toute modification.
- Final : build 77 pages · unitaires **124/124** · e2e **55/55** (45 V3 conservés/adaptés + 10 parcours V4) · harness d'audit 0 erreur console sur toutes les routes.
- Rapport détaillé : `AUDIT_REPORT_V4.md`.
- Commit : `c72cd88` · déployé automatiquement sur Render (push → live en ~1 min).

### Limites assumées (honnêteté > feature)
- Encodage canvas limité à JPG/PNG/WebP (FAQ explicite) ; GIF/BMP/AVIF en décodage seulement.
- OCR PDF, miniatures PDF et filigrane-image reportés : pas de chemin local 0 € fiable — fiabilité d'abord.

---

## V4.1 — Finalisation & verrouillage du cahier des charges V4 (2026-10)

Brief 63 sections : fermer tous les écarts du cahier des charges V4, corriger les incohérences, puis **V4 LOCKED** (les grosses nouveautés passent en V5).

### Nouveautés
- **PDF Studio complet** : `pdf-organizer` (miniatures pdf.js, sélection, réorganisation, rotation, duplication, suppression, lecture/édition/suppression des métadonnées) + `pdf-to-text` (extraction honnête, détection des scans) → 43 outils.
- **Mode Étudiant** (`/student/`) : parcours curaté vers les outils existants, zéro logique dupliquée (§17).
- **Éditeur d'image complet (§9)** : ajout hue, sepia, invert (+ rotation/flip/undo/redo/reset déjà présents).
- **Convertisseur d'unités : 10 catégories** (+ surface, énergie, pression, temps).
- **Calculatrice enrichie** : coefficient multiplicateur, moyenne pondérée, consommation carburant & coût de trajet.
- **i18n (fondation)** : dictionnaires `translations.js` + runtime `i18n.js`, sélecteur dans Settings, appliqué aux chaînes JS (statuts batch, palette). Couverture partielle assumée et étiquetée telle quelle (§27).
- **PWA** : `manifest.webmanifest` + service worker (app shell, navigations network-first, assets hachés immuables ; jamais de fichiers utilisateurs en cache) (§26).
- **3 guides utiles** : fusionner des PDF, extraire le texte d'un PDF, Base64 (taille, usages, pièges) → 8 guides.
- **Centre de vie privée** : table de stockage exhaustive (quoi / où / clé / durée) ; `site.contactEmail` centralisé.
- **Feedback sans backend** : panneau Settings (mailto + copie de l'adresse).

### Améliorations
- **Handoff (§19)** branché sur Watermark, Image Editor (export → chip) et Image Analyzer (analyse → chip).
- **Batch (§20)** : compteur « Cancelled » dans le résumé ; résumé visible même avec uniquement des erreurs/annulations.
- **Flow (§22)** : intents remise/TVA → calculatrice ; supprimer/réorganiser des pages → organisateur ; extraire le texte → pdf-to-text (désambiguïsé d'« extraire des pages » → split).
- **Bug V3 latent corrigé** : PdfToImage ne fonctionnait jamais (import namespace pdfjs) — vérifié rendu 3 pages par sonde CDP.
- Tests e2e : compteurs pilotés par le registre (`TOOL_COUNT`, `PDF_COUNT`) — plus de dérive à chaque nouvel outil.

### Vérifications
- Build final : **83 pages**, propre. · Unitaires **138/138** · E2E **61/61** (55 V4 + 6 nouveaux V4.1) · 0 erreur console sur les routes auditées.
- Rapport : `AUDIT_REPORT_V4_1.md` (avant/après, non-ajoutés avec raisons, liste V5, limites déclarées).

### Non ajouté volontairement (fiabilité > features)
- Mot de passe PDF (pdf-lib ne chiffre pas fiablement côté client), OCR lourd, miniatures PDF dans le builder de workflows, Timer/Pomodoro/Lorem (→ tête de liste V5), formateurs CSV/code, filigrane-image, traduction complète du site.

**→ V4 est VERROUILLÉE. Toute nouvelle fonctionnalité majeure va en V5.**

---

## À venir (V5, non commencé)

- **Utilities §16 restant** : Timer, Chronomètre, Pomodoro, Lorem Ipsum (tête de liste).
- Traduction FR complète du site (fondation dictionnaires livrée en V4.1, à étendre page par page).
- Filigrane-image ; OCR PDF si une solution locale fiable apparaît ; chiffrement PDF si chemin crypto local fiable.
- Formateurs CSV/code, pages de référence HTTP/MIME ; analytics agrégés opt-in (déclarés dans Privacy avant).
- **Motion design promotionnel** : page animée + capture vidéo (voix off anglaise optionnelle) — décidé en principe, à spécifier au retour.

---

## Récapitulatif en un coup d'œil

| | V1 | V2 | V3 | V4 | V4.1 (verrouillée) |
|---|---|---|---|---|---|
| Langue | Français | Anglais (global) | Anglais (copy peaufinée) | Anglais (Flow FR+EN) | Anglais + fondation i18n FR |
| Outils | 10 | 30 | 30 (fiabilisés) | 41 (consolidés) | 43 |
| Différenciateur | — | Workflows + recherche par intention | Finition & robustesse | Studios + Flow + profondeur | PDF Studio complet + PWA + guides |
| Unitaires | 73/73 | 99/99 | 99/99 | 124/124 | 138/138 |
| E2E | 99/99 | 43/43 | 45/45 | 55/55 | 61/61 |
| Pages | 23 | 65 | 65 | 77 | 83 |
| Coût | 0 € | 0 € | 0 € | 0 € | 0 € |
