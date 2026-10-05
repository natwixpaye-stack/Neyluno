/**
 * CENTRAL SITE CONFIGURATION — Neyluno V2 (global, English-first)
 * Name, tagline and global settings are changed here only.
 */
export const site = {
  name: 'Neyluno',
  tagline: 'The fastest place to get small digital tasks done.',
  shortDescription:
    'Free online tools for images, PDFs, text and files. No sign-up, no uploads — everything runs privately in your browser.',
  locale: 'en',
  // Public contact address (used by Privacy, Settings feedback — no form backend by design).
  contactEmail: 'Noah.mailpro@yahoo.com',
  // Default theme when the visitor has no stored preference and no OS preference:
  defaultTheme: 'dark',

  // MONETIZATION — slots exist in the architecture, keep disabled.
  ads: {
    enabled: false,
    providerScript: null,
  },

  // ANALYTICS — architecture ready, nothing tracked by default.
  analytics: {
    enabled: false,
    provider: null,
    scriptUrl: null,
  },

  limits: {
    maxFileMB: 50,
  },

  storageKeys: {
    theme: 'qt-theme',
    recents: 'qt-recents',
    favorites: 'qt-favorites',
    workflows: 'qt-workflows',
  },
};

/** Site categories. `hue` drives icon/badge/card tinting. */
export const categories = [
  {
    slug: 'images',
    name: 'Images',
    icon: 'image',
    hue: '#FFB454',
    description: 'Convert, compress, resize, crop and rotate images — processed on your device, never uploaded.',
  },
  {
    slug: 'pdf',
    name: 'PDF',
    icon: 'pdf',
    hue: '#FF6E59',
    description: 'Merge, split, rotate, compress and create PDF files, entirely in your browser.',
  },
  {
    slug: 'text',
    name: 'Text',
    icon: 'text',
    hue: '#4ADE9E',
    description: 'Count, clean, sort and transform text instantly.',
  },
  {
    slug: 'developer',
    name: 'Developer',
    icon: 'code',
    hue: '#5CC8FF',
    description: 'Formatters, encoders and generators for everyday development tasks.',
  },
  {
    slug: 'calculators',
    name: 'Calculators',
    icon: 'calc',
    hue: '#C4A3FF',
    description: 'Fast calculators for percentages, units, dates and more.',
  },
  {
    slug: 'security',
    name: 'Security',
    icon: 'shield',
    hue: '#B7F04D',
    description: 'Generate strong passwords locally — they never leave your device.',
  },
  {
    slug: 'utilities',
    name: 'Utilities',
    icon: 'utility',
    hue: '#FF8FB1',
    description: 'Practical everyday utilities like QR codes.',
  },
];

export function getCategory(slug) {
  return categories.find((c) => c.slug === slug);
}
