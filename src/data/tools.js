import { categories as categoriesList } from './site.js';

/**
 * REGISTRE DES OUTILS
 * Pour ajouter un outil : ajouter une entrée ici + créer son composant UI
 * dans src/tools/ui/ + l'enregistrer dans src/pages/outils/[slug].astro.
 * Tout le reste (navigation, recherche, catégories, sitemap, liens internes) suit automatiquement.
 */
export const tools = [
  {
    slug: 'jpg-vers-webp',
    name: 'JPG vers WebP',
    icon: 'img-convert',
    category: 'images',
    shortDesc: 'Convertissez vos images JPG en WebP pour réduire leur poids jusqu’à 80 %.',
    description:
      'Convertissez une ou plusieurs images JPG/JPEG au format WebP, directement dans votre navigateur. Réglage de la qualité, aperçu, téléchargement individuel ou groupé en ZIP.',
    keywords: ['jpg', 'jpeg', 'webp', 'conversion', 'image', 'convertir'],
    steps: ['Ajoutez vos images JPG (glisser-déposer ou parcourir)', 'Réglez la qualité de conversion', 'Téléchargez vos fichiers WebP, un par un ou en ZIP'],
    faq: [
      { q: 'Mes images sont-elles envoyées sur un serveur ?', a: 'Non. La conversion est réalisée entièrement dans votre navigateur grâce à l’API Canvas. Vos fichiers ne quittent jamais votre appareil.' },
      { q: 'Quelle qualité choisir ?', a: 'Entre 75 et 85 %, la différence est invisible à l’œil nu pour la plupart des photos, tout en réduisant nettement le poids. En dessous de 60 %, des artefacts peuvent apparaître sur les dégradés.' },
      { q: 'Pourquoi passer au WebP ?', a: 'Le WebP offre une compression 25 à 35 % plus efficace que le JPEG à qualité équivalente. Il est pris en charge par tous les navigateurs modernes, ce qui en fait un excellent choix pour accélérer un site web.' },
    ],
    seo: `<p>Le format <strong>WebP</strong> a été conçu pour remplacer le JPEG sur le web : à qualité visuelle égale, il produit des fichiers nettement plus légers. Convertir vos photos en WebP est l’un des moyens les plus simples d’accélérer le chargement d’un site ou de libérer de l’espace de stockage.</p><p>Cet outil convertit vos fichiers <strong>JPG/JPEG en WebP</strong> sans aucune limite artificielle de nombre de fichiers. Vous pouvez ajuster la qualité de compression, vérifier chaque résultat, retirer un fichier de la liste, puis tout télécharger d’un coup au format ZIP.</p><p>Comme tout le traitement s’effectue localement dans votre navigateur, vos photos restent strictement confidentielles : rien n’est uploadé, rien n’est stocké.</p>`,
  },
  {
    slug: 'png-vers-webp',
    name: 'PNG vers WebP',
    icon: 'img-convert',
    category: 'images',
    shortDesc: 'Convertissez vos PNG en WebP en conservant la transparence.',
    description:
      'Convertissez vos images PNG au format WebP, avec prise en charge de la transparence (canal alpha). Traitement 100 % local, qualité réglable, téléchargement groupé en ZIP.',
    keywords: ['png', 'webp', 'conversion', 'transparence', 'image', 'alpha'],
    steps: ['Ajoutez vos images PNG', 'Choisissez la qualité de sortie', 'Téléchargez vos WebP, individuellement ou en ZIP'],
    faq: [
      { q: 'La transparence est-elle conservée ?', a: 'Oui. Le WebP gère le canal alpha : les zones transparentes de vos PNG restent transparentes après conversion.' },
      { q: 'Le WebP est-il toujours plus léger que le PNG ?', a: 'Pour des images avec beaucoup de couleurs (captures d’écran illustrées, visuels marketing), oui, très nettement. Pour de minuscules icônes en peu de couleurs, le gain peut être plus modeste — l’outil affiche le poids avant/après pour que vous puissiez juger.' },
      { q: 'Puis-je convertir plusieurs PNG à la fois ?', a: 'Oui, ajoutez autant de fichiers que nécessaire, puis utilisez « Tout télécharger » pour récupérer un ZIP unique.' },
    ],
    seo: `<p>Le PNG est parfait pour la qualité sans perte, mais ses fichiers sont souvent volumineux. Le format <strong>WebP</strong> conserve la <strong>transparence</strong> tout en réduisant fortement le poids des images, ce qui en fait le remplaçant idéal pour les visuels de sites web, les logos détourés et les captures d’écran.</p><p>Ce convertisseur traite vos PNG <strong>localement dans le navigateur</strong> : aucun upload, aucune copie sur un serveur. Vous gardez la main sur la qualité de compression et vous pouvez télécharger vos résultats un par un ou regroupés dans une archive ZIP.</p>`,
  },
  {
    slug: 'compresser-image',
    name: 'Compresseur d’image',
    icon: 'compress',
    category: 'images',
    shortDesc: 'Réduisez le poids de vos images JPG, PNG et WebP avec comparaison avant/après.',
    description:
      'Compressez vos images JPG, PNG et WebP avec un contrôle précis de la qualité. Comparaison visuelle avant/après, poids avant/après et pourcentage d’économie affichés pour chaque fichier.',
    keywords: ['compresser', 'image', 'réduire', 'poids', 'optimiser', 'jpg', 'png', 'webp'],
    steps: ['Ajoutez une ou plusieurs images', 'Ajustez la qualité et observez l’économie', 'Comparez avant/après puis téléchargez'],
    faq: [
      { q: 'Comment fonctionne la compression ?', a: 'L’image est ré-encodée dans votre navigateur avec le niveau de qualité choisi. Pour le PNG, l’image est ré-encodée via Canvas : le gain dépend du contenu, l’outil affiche toujours le résultat réel avant/après.' },
      { q: 'Vais-je perdre en qualité visuelle ?', a: 'Le curseur de qualité vous donne le contrôle : autour de 80 %, la perte reste généralement imperceptible. Le comparateur avant/après vous permet de vérifier visuellement avant de télécharger.' },
      { q: 'Quelle taille d’image puis-je compresser ?', a: 'Les fichiers jusqu’à 50 Mo sont acceptés. Les très grandes images (plus de 4096 px de large) sont automatiquement signalées pour éviter les problèmes de mémoire sur mobile.' },
    ],
    seo: `<p>Des images trop lourdes ralentissent un site web, remplissent un stockage cloud et compliquent l’envoi par e-mail. Ce <strong>compresseur d’image</strong> réduit le poids de vos fichiers <strong>JPG, PNG et WebP</strong> en quelques secondes, avec un curseur de qualité pour trouver le bon équilibre.</p><p>Pour chaque image, l’outil affiche le <strong>poids avant et après compression</strong>, le <strong>pourcentage économisé</strong>, et un <strong>comparateur visuel</strong> pour vérifier que la qualité reste acceptable.</p><p>Tout se passe dans votre navigateur : aucune image n’est transmise à un serveur, ce qui rend l’outil aussi privé que rapide.</p>`,
  },
  {
    slug: 'redimensionner-image',
    name: 'Redimensionner une image',
    icon: 'resize',
    category: 'images',
    shortDesc: 'Changez la taille de vos images en pixels ou en pourcentage, ratio verrouillable.',
    description:
      'Redimensionnez une image par dimensions exactes (largeur × hauteur) ou par pourcentage, avec verrouillage du ratio. Choisissez le format de sortie : JPG, PNG ou WebP.',
    keywords: ['redimensionner', 'image', 'taille', 'pixels', 'resize', 'échelle', 'pourcentage'],
    steps: ['Ajoutez votre image', 'Indiquez la largeur, la hauteur ou un pourcentage', 'Choisissez le format de sortie et téléchargez'],
    faq: [
      { q: 'Le ratio de mon image est-il respecté ?', a: 'Par défaut, le ratio est verrouillé : modifier la largeur ajuste automatiquement la hauteur. Déverrouillez-le si vous avez besoin de dimensions exactes, au risque d’une image déformée.' },
      { q: 'Redimensionner réduit-il la qualité ?', a: 'Réduire une image diminue son nombre de pixels et donc son poids, sans perte visible. Agrandir au-delà de la taille d’origine produit une image plus floue : aucun outil ne peut inventer les pixels manquants.' },
      { q: 'Quel format de sortie choisir ?', a: 'JPG pour les photos (léger), PNG si vous avez besoin de transparence, WebP pour le meilleur rapport qualité/poids sur le web.' },
    ],
    seo: `<p>Recadrer la taille d’une image est souvent nécessaire avant de l’envoyer par e-mail, de la publier sur un réseau social ou de l’intégrer à un site web. Cet outil permet de <strong>redimensionner une image</strong> en indiquant simplement la largeur ou la hauteur souhaitée : l’autre dimension est calculée automatiquement pour <strong>préserver les proportions</strong>.</p><p>Vous pouvez aussi travailler <strong>en pourcentage</strong> (50 %, 25 %…) et choisir le format de sortie. L’aperçu se met à jour instantanément et le fichier final est généré dans votre navigateur, sans upload.</p>`,
  },
  {
    slug: 'image-en-pdf',
    name: 'Image en PDF',
    icon: 'img-pdf',
    category: 'pdf',
    shortDesc: 'Transformez une ou plusieurs images en un seul document PDF.',
    description:
      'Créez un PDF à partir de vos images JPG, PNG ou WebP : réordonnez les pages, choisissez l’orientation, le format de page et les marges. Génération 100 % locale avec pdf-lib.',
    keywords: ['pdf', 'image', 'jpg', 'png', 'convertir', 'document'],
    steps: ['Ajoutez vos images dans l’ordre souhaité', 'Choisissez orientation, format de page et marges', 'Générez et téléchargez votre PDF'],
    faq: [
      { q: 'Puis-je changer l’ordre des pages ?', a: 'Oui. Faites glisser les vignettes pour réorganiser vos images : le PDF suit exactement l’ordre affiché.' },
      { q: 'Quels formats d’images sont acceptés ?', a: 'JPG, PNG et WebP. Les autres formats acceptés par votre navigateur sont automatiquement convertis en PNG au moment de l’insertion.' },
      { q: 'La qualité des images est-elle préservée ?', a: 'Oui. Les images JPG et PNG sont intégrées nativement dans le PDF sans recompression lorsque vous choisissez le mode « taille adaptée ».' },
    ],
    seo: `<p>Factures scannées, notes photographiées, planches de visuels : il est fréquent de devoir <strong>transformer des images en PDF</strong> pour produire un document unique et facile à partager.</p><p>Cet outil assemble vos images en <strong>un seul fichier PDF</strong>, dans l’ordre de votre choix. Vous contrôlez l’<strong>orientation</strong> (portrait ou paysage), le <strong>format de page</strong> (A4, Letter ou taille adaptée à l’image) et les <strong>marges</strong>.</p><p>La génération du PDF se fait avec la bibliothèque open source pdf-lib, entièrement dans votre navigateur : vos images ne transitent par aucun serveur.</p>`,
  },
  {
    slug: 'fusionner-pdf',
    name: 'Fusionner des PDF',
    icon: 'merge',
    category: 'pdf',
    shortDesc: 'Combinez plusieurs fichiers PDF en un seul document, dans l’ordre de votre choix.',
    description:
      'Fusionnez plusieurs PDF en un seul fichier : réorganisation par glisser-déposer, aperçu du nombre de pages par document, suppression individuelle. Traitement local avec pdf-lib.',
    keywords: ['pdf', 'fusionner', 'combiner', 'assembler', 'merge'],
    steps: ['Ajoutez au moins deux fichiers PDF', 'Réorganisez-les par glisser-déposer', 'Fusionnez et téléchargez le document final'],
    faq: [
      { q: 'Mes PDF sont-ils uploadés quelque part ?', a: 'Non. La fusion s’effectue entièrement dans votre navigateur avec la bibliothèque open source pdf-lib. Vos documents restent sur votre appareil.' },
      { q: 'Que se passe-t-il avec un PDF protégé par mot de passe ?', a: 'Les PDF chiffrés avec mot de passe ne peuvent pas être fusionnés. L’outil vous signale clairement le fichier concerné pour que vous puissiez le retirer ou le déverrouiller au préalable.' },
      { q: 'Y a-t-il une limite de taille ou de nombre de fichiers ?', a: 'La limite est celle de la mémoire de votre appareil. En pratique, plusieurs dizaines de PDF de taille courante fusionnent sans problème. Les fichiers de plus de 50 Mo sont refusés par sécurité.' },
    ],
    seo: `<p>Assembler plusieurs documents — un rapport et ses annexes, des factures mensuelles, des chapitres séparés — est une tâche courante que cet outil réalise en quelques secondes, <strong>sans installer de logiciel</strong>.</p><p>Ajoutez vos fichiers, <strong>réorganisez-les par glisser-déposer</strong>, vérifiez le nombre de pages de chaque document, puis lancez la fusion. Le fichier final est généré localement avec la bibliothèque open source <strong>pdf-lib</strong> : rien n’est envoyé sur un serveur, ce qui rend l’outil adapté aux documents confidentiels.</p>`,
  },
  {
    slug: 'generer-qr-code',
    name: 'Générateur de QR code',
    icon: 'qr',
    category: 'utilitaires',
    shortDesc: 'Créez un QR code personnalisé en temps réel : URL, texte, e-mail, téléphone, Wi-Fi.',
    description:
      'Générez un QR code personnalisé avec aperçu en temps réel : contenu (URL, texte, e-mail, téléphone, SMS, Wi-Fi), couleurs, taille, marge et niveau de correction. Export PNG ou SVG.',
    keywords: ['qr', 'qrcode', 'qr code', 'générer', 'flashcode'],
    steps: ['Choisissez le type de contenu et saisissez-le', 'Personnalisez couleurs, taille et correction', 'Téléchargez en PNG ou en SVG'],
    faq: [
      { q: 'Le QR code fonctionne-t-il longtemps ?', a: 'Oui. Un QR code statique encode directement son contenu : il ne dépend d’aucun service externe et reste lisible indéfiniment.' },
      { q: 'À quoi sert le niveau de correction d’erreur ?', a: 'Il détermine la capacité du QR code à rester lisible même partiellement masqué ou abîmé. Le niveau M (15 %) convient presque toujours ; choisissez Q ou H si votre code sera imprimé petit ou partiellement recouvert par un logo.' },
      { q: 'PNG ou SVG : quel format exporter ?', a: 'Le PNG est idéal pour un usage immédiat (web, présentation). Le SVG est vectoriel : il reste net à toutes les tailles, parfait pour l’impression.' },
    ],
    seo: `<p>Un <strong>QR code</strong> permet de partager instantanément un lien, une adresse e-mail, un numéro de téléphone ou même un accès Wi-Fi. Ce générateur crée votre code <strong>en temps réel</strong>, pendant que vous tapez.</p><p>Personnalisez les couleurs, la taille, la zone de silence et le <strong>niveau de correction d’erreur</strong>, puis exportez en <strong>PNG</strong> (usage web) ou en <strong>SVG</strong> (impression, mise à l’échelle infinie).</p><p>Le code est dessiné dans votre navigateur : aucun contenu n’est transmis à un service tiers, et votre QR code ne dépend d’aucune plateforme susceptible d’expirer.</p>`,
  },
  {
    slug: 'calculateur-pourcentage',
    name: 'Calculateur de pourcentage',
    icon: 'percent',
    category: 'calcul',
    shortDesc: 'Cinq modes de calcul : valeur d’un %, proportion, évolution, réduction, augmentation.',
    description:
      'Calculez instantanément : X % de Y, la proportion de X dans Y, une évolution en %, ou appliquez une réduction/augmentation. Résultat immédiat, sans bouton à cliquer.',
    keywords: ['pourcentage', 'calcul', 'calculatrice', 'réduction', 'augmentation', 'proportion'],
    steps: ['Choisissez le mode de calcul', 'Saisissez vos deux nombres', 'Le résultat s’affiche instantanément'],
    faq: [
      { q: 'Comment calculer X % de Y ?', a: 'Multipliez Y par X puis divisez par 100. Par exemple, 20 % de 150 = 150 × 20 ÷ 100 = 30. Le mode « X % de Y » de l’outil fait exactement cela.' },
      { q: 'Comment calculer une évolution en pourcentage ?', a: 'L’évolution vaut (valeur finale − valeur initiale) ÷ valeur initiale × 100. Une hausse de 80 à 100 donne +25 % ; une baisse de 100 à 80 donne −20 %.' },
      { q: 'Les calculs sont-ils arrondis ?', a: 'Les résultats sont affichés avec une précision adaptée (jusqu’à 4 décimales significatives) ; le calcul interne n’est jamais arrondi.' },
    ],
    seo: `<p>Soldes, TVA, remises, statistiques, notes : les <strong>pourcentages</strong> sont partout, et leur formule n’est jamais tout à fait la même selon le contexte. Ce calculateur regroupe les <strong>cinq situations les plus courantes</strong> : trouver la valeur d’un pourcentage, calculer une proportion, mesurer une évolution, appliquer une réduction ou une augmentation.</p><p>Le résultat s’affiche <strong>instantanément pendant la saisie</strong>, avec la formule détaillée pour comprendre le calcul plutôt que simplement le copier.</p>`,
  },
  {
    slug: 'generateur-mot-de-passe',
    name: 'Générateur de mot de passe',
    icon: 'password',
    category: 'securite',
    shortDesc: 'Générez des mots de passe forts avec crypto.getRandomValues(), sans envoi réseau.',
    description:
      'Générez des mots de passe forts et aléatoires : longueur réglable, majuscules, chiffres, symboles, exclusion des caractères ambigus. Indicateur d’entropie et copie en un clic. Génération 100 % locale.',
    keywords: ['mot de passe', 'password', 'générer', 'sécurité', 'aléatoire', 'fort'],
    steps: ['Réglez la longueur et les caractères autorisés', 'Générez votre mot de passe', 'Copiez-le et conservez-le dans un gestionnaire'],
    faq: [
      { q: 'Le mot de passe est-il vraiment aléatoire ?', a: 'Oui. L’outil utilise l’API cryptographique du navigateur (crypto.getRandomValues), la même que celle utilisée pour le chiffrement TLS — pas une fonction pseudo-aléatoire classique comme Math.random().' },
      { q: 'Mon mot de passe est-il envoyé quelque part ?', a: 'Jamais. La génération a lieu dans votre navigateur et le mot de passe n’est écrit dans aucun journal, aucun stockage, aucun serveur. Vous pouvez même utiliser l’outil hors ligne.' },
      { q: 'Quelle longueur choisir ?', a: 'Au minimum 12 caractères pour un compte ordinaire, 16 ou plus pour les comptes sensibles. Un mot de passe de 16 caractères mélangeant tous les types dépasse 90 bits d’entropie : hors de portée d’une attaque par force brute.' },
    ],
    seo: `<p>Les mots de passe courts ou réutilisés sont la première cause de piratage de comptes. La solution : des <strong>mots de passe longs, aléatoires et uniques</strong> pour chaque service — exactement ce que produit ce générateur.</p><p>La génération s’appuie sur <strong>crypto.getRandomValues()</strong>, le générateur aléatoire cryptographique du navigateur, et chaque tirage garantit au moins un caractère de chaque catégorie sélectionnée. L’<strong>indicateur d’entropie</strong> vous montre la résistance réelle du mot de passe en bits.</p><p>Tout se passe localement : le mot de passe n’est ni transmis, ni stocké par le site.</p>`,
  },
  {
    slug: 'compteur-de-mots',
    name: 'Compteur de mots',
    icon: 'counter',
    category: 'texte',
    shortDesc: 'Comptez mots, caractères, phrases, paragraphes et temps de lecture en temps réel.',
    description:
      'Collez ou rédigez votre texte et obtenez en temps réel : mots, caractères, caractères sans espaces, phrases, paragraphes, lignes et temps de lecture estimé.',
    keywords: ['mots', 'caractères', 'compter', 'texte', 'phrases', 'paragraphes'],
    steps: ['Collez ou saisissez votre texte', 'Consultez les statistiques en temps réel', 'Copiez ou effacez en un clic'],
    faq: [
      { q: 'Comment les mots sont-ils comptés ?', a: 'Un mot est une suite de caractères séparée par des espaces ou de la ponctuation forte, comme dans la plupart des traitements de texte : « l’arbre » compte pour deux mots, conformément à la convention des correcteurs français.' },
      { q: 'Le temps de lecture est-il fiable ?', a: 'Il est estimé sur la base d’environ 200 mots par minute, vitesse moyenne de lecture silencieuse en français. C’est un ordre de grandeur, utile pour calibrer un article ou un discours.' },
      { q: 'Mon texte est-il enregistré ?', a: 'Non. Le comptage se fait en direct dans votre navigateur ; rien n’est envoyé ni sauvegardé. Si vous rechargez la page, le contenu est effacé.' },
    ],
    seo: `<p>Rédiger un article, une lettre de motivation ou un post avec une contrainte de longueur ? Ce <strong>compteur de mots</strong> affiche en temps réel le nombre de <strong>mots, caractères, caractères sans espaces, phrases, paragraphes et lignes</strong>, ainsi qu’une estimation du <strong>temps de lecture</strong>.</p><p>Le comptage est instantané, sans bouton à presser, et le texte reste dans votre navigateur : idéal pour les documents sensibles ou confidentiels.</p>`,
  },
];

export function getTool(slug) {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(categorySlug) {
  return tools.filter((t) => t.category === categorySlug);
}

export function getRelatedTools(tool, count = 4) {
  const sameCat = tools.filter((t) => t.category === tool.category && t.slug !== tool.slug);
  const others = tools.filter((t) => t.category !== tool.category);
  return [...sameCat, ...others].slice(0, count);
}

export function getUsedCategories() {
  const used = new Set(tools.map((t) => t.category));
  return categoriesList.filter((c) => used.has(c.slug));
}
