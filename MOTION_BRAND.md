# Neyluno — Motion Design & Brand Showcase

Direction artistique animée de Neyluno (V4.2). Motto : **« Énorme en profondeur. Minimal à l'écran. »**
Règle d'or : **90 % clarté / 10 % spectacle.** Chaque animation doit aider à comprendre, naviguer ou ressentir le premium — sinon elle n'existe pas.

---

## 1. Identité animée

- **Palette** : fond `#07080d`, panneaux translucides, accent dégradé `#ffb454 → #ff6e59`, vert succès `#4ade9e`.
- **Typo** : Space Grotesk (display) / Inter (texte) — mêmes familles que le site.
- **Courbe** : `cubic-bezier(0.22, 1, 0.36, 1)` (out-expo douce) — rapide, jamais agressive.
- **Signature visuelle** : *complexité cachée → simplicité visible*. Des éléments complexes (pages PDF, tuiles, filtres) apparaissent, travaillent, puis **tout se recentre** dans une interface minimaliste.
- **Micro-interactions** : élévation de quelques px, soulignement accentué, icône qui respire. Jamais de zoom/rotation cartoon, jamais de glow agressif.

## 2. La vidéo promotionnelle (master 38,5 s)

Fichier : `motion/scenes/promo.html` — page autonome, aucun asset externe, timeline **déterministe** (`window.seek(ms)`).
Rendu : `motion/render.mjs` (Playwright frame-à-frame, 30 fps, H.264) — la synchro voix/motion est exacte, pas approximative.

### Timeline (voix → visuel, conçus ensemble)

| Temps (EN) | Voix | Visuel |
|---|---|---|
| 0–1.2 s | — | Noir → orbes de profondeur, grid |
| 1.2–11.1 s | « Every day… calculate something » | Fenêtres fantômes → beats **Compress / Edit / Convert / Calculate** (2.4 MB→480 KB, sweep de filtres hue/sepia, 10 km→6.21 mi, (120+80)×1.2=240) |
| 12.0–18.2 s | « Neyluno brings them together » | 12 tuiles convergent → carte **Upload → Choose → Done** |
| 19.1–25.3 s | « And with Flow… » | Barre de recherche, phrase tapée « I want to extract the text from this PDF », plan **Flow → PDF → Text ✓**, fichier qui voyage, `text.txt ✓` |
| 26.2–29.6 s | « Forty-three tools » | Compte **1→43** + 7 chips catégories qui fleurissent puis se recentrent |
| 30.5–38.5 s | « Neyluno. Huge under the hood… » | Logo reveal (sweep de lumière), slogan, CTA « Try Neyluno » |

La version FR utilise la même timeline recalculée depuis les durées réelles des clips (`motion/timeline-fr.json`).

### Sound design — 3 couches séparées

1. **VOICE** : clips générés (`motion/audio/voice/{en,fr}-a..e.mp3`) — remplaçables un par un (naming = point de synchro).
2. **MUSIC** : lit génératif numpy (`make_audio.py`) — pads Am→F→C→G, arpège à partir de la scène B, pulse + énergie sur « 43 », respiration finale, **ducking automatique sous la voix**.
3. **UI SOUNDS** : whoosh de transitions, ticks des beats, click (plan Flow), chime (résultat), pop (arrivée du 43), chime final — synthétisés, discrets (-18 dB sous la voix).

Sorties séparées : `audio/music-<lang>.wav`, `audio/sfx-<lang>.wav`, mix final `audio/mix-<lang>.wav`.

## 3. Formats livrés (`motion/out/`)

| Fichier | Usage |
|---|---|
| `neyluno-promo-en-16x9.mp4` | YouTube / présentation / hero |
| `neyluno-promo-fr-16x9.mp4` | Idem, voix française |
| `…-en-9x16.mp4` / `…-fr-9x16.mp4` | TikTok / Shorts / Reels |
| `…-en-1x1.mp4` / `…-fr-1x1.mp4` | Réseaux sociaux (feed) |

Même DA sur tous les formats : la scène est responsive (`vmin` + media query portrait), jamais un simple recadrage.

## 4. Motion sur le site (couche production)

- **Hero** : entrée en focus-pull (translateY + blur 8px→0), stagger existant conservé.
- **Profondeur** : parallaxe pointeur sur `.hero-depth` (transform-only, lissé rAF) — désactivée si `prefers-reduced-motion` ou pointeur non fin.
- **Cartes outils** : élévation −3 px, ombre lift, soulignement accent (teinte de la catégorie) en sweep 320 ms, icône qui se soulève.
- **Accessibilité** : le bloc global `prefers-reduced-motion` coupe transitions/parallaxe ; aucune animation n'est nécessaire pour comprendre le site.
- **Performance** : uniquement `transform`/`opacity`/`filter` courts ; zéro asset vidéo chargé par le site ; aucun impact sur LCP.

## 5. Remplacer la voix (ElevenLabs ou autre)

1. Générer 5 clips par langue aux mêmes textes (`motion/scripts.txt` ci-dessous) → `motion/audio/voice/{lang}-a..e.mp3`.
2. Mesurer les durées → `motion/timeline-<lang>.json` (formule : intro 1.2 s, gap 0.9 s, tail 3.9 s — voir `render.mjs`).
3. `python3 motion/audio/make_audio.py <lang>` (musique + SFX re-synchronisés) puis `node motion/render.mjs <lang> <format>` et mux :
   `ffmpeg -i out/…-video.mp4 -i audio/mix-<lang>.wav -c:v copy -c:a aac -b:a 192k out/…mp4`

Aucune clé API côté front : les fichiers audio sont des **assets statiques**. Une future intégration ElevenLabs devra passer par un backend avec variables d'environnement (§21 du brief).

### Scripts (source de vérité)

**EN** : Every day, we use dozens of tools just to get simple things done. Compress a PDF. Edit an image. Convert a file. Calculate something. / Neyluno brings them together. One place. Simple tools. No unnecessary complexity. / And with Flow, you don't even need to know which tool you need. Just tell Neyluno what you want to do. / Forty-three tools. One simple interface. / Neyluno. Huge under the hood. Minimal on screen.

**FR** : Chaque jour, on utilise des dizaines d'outils pour faire des choses finalement très simples. Compresser un PDF. Modifier une image. Convertir un fichier. Faire un calcul. / Neyluno rassemble tout au même endroit. Des outils simples. Une interface claire. Aucune complexité inutile. / Et avec Flow, vous n'avez même pas besoin de savoir quel outil utiliser. Dites simplement ce que vous voulez faire. / Quarante-trois outils. Une seule interface. / Neyluno. Énorme en profondeur. Minimal à l'écran.

## 6. Non fait volontairement

- Pas de 3D/glitch/particules clichés ; pas de musique corporate ; pas de voix criarde.
- Pas de vidéo embarquée dans le site (poids/perf) : le hero vit par CSS, la vidéo vit dehors.
- Pas de sur-animation des pages outils : le motion du site reste micro.
