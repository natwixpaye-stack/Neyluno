/**
 * CONFIGURATION CENTRALE DU SITE
 * Le nom, la baseline et les réglages globaux se modifient ici uniquement.
 */
export const site = {
  name: 'QuickTools',
  tagline: 'Des outils simples, rapides et privés, directement dans ton navigateur.',
  shortDescription:
    'Des outils gratuits et rapides pour convertir, compresser, calculer et créer — sans inscription, sans envoi de fichiers sur un serveur.',
  locale: 'fr-FR',
  // Couleur de thème par défaut : 'dark' | 'light'
  defaultTheme: 'dark',

  // MONÉTISATION — les emplacements existent dans l'architecture,
  // passer `enabled` à true lorsque la régie publicitaire est intégrée.
  ads: {
    enabled: false,
    // Exemple : script de régie à injecter dans BaseLayout le jour J.
    providerScript: null,
  },

  // ANALYTICS — architecture prête, aucun tracking activé par défaut.
  analytics: {
    enabled: false,
    // Exemple : 'plausible' | 'umami' | 'matomo'
    provider: null,
    scriptUrl: null,
  },

  // Limites techniques partagées (messages d'erreur cohérents partout)
  limits: {
    maxFileMB: 50,
  },
};

/**
 * Catégories du site. La teinte (`hue`) sert à colorer icônes, badges et cartes.
 */
export const categories = [
  {
    slug: 'images',
    name: 'Images',
    icon: 'image',
    hue: '#FFB454',
    description: 'Convertir, compresser, redimensionner et transformer vos images, sans les envoyer sur un serveur.',
  },
  {
    slug: 'pdf',
    name: 'PDF',
    icon: 'pdf',
    hue: '#FF6E59',
    description: 'Fusionner des PDF ou créer un PDF à partir de vos images, directement dans le navigateur.',
  },
  {
    slug: 'texte',
    name: 'Texte',
    icon: 'text',
    hue: '#4ADE9E',
    description: 'Compter, mesurer et analyser vos textes instantanément.',
  },
  {
    slug: 'calcul',
    name: 'Calcul',
    icon: 'calc',
    hue: '#5CC8FF',
    description: 'Des calculatrices simples et rapides pour les pourcentages et plus encore.',
  },
  {
    slug: 'securite',
    name: 'Sécurité',
    icon: 'shield',
    hue: '#B7F04D',
    description: 'Générer des mots de passe forts, localement, sans jamais les transmettre.',
  },
  {
    slug: 'utilitaires',
    name: 'Utilitaires',
    icon: 'utility',
    hue: '#C4A3FF',
    description: 'Des outils pratiques du quotidien : QR codes, conversions et petites tâches rapides.',
  },
];

export function getCategory(slug) {
  return categories.find((c) => c.slug === slug);
}
