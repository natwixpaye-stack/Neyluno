/**
 * V4.1 — i18n dictionaries (foundation).
 * Keys are stable identifiers; `en` is the source of truth and the fallback.
 * Coverage is deliberately honest: only strings rendered by JavaScript are
 * translated today. Static page copy stays English-first (documented in Settings).
 */
export const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français (partiel)' },
];

export const DICT = {
  en: {
    // file engine (fileui.js)
    'file.processing': 'Processing…',
    'file.done': 'Done',
    'file.failed': 'Failed',
    'file.cancelled': 'Cancelled',
    'file.download': 'Download',
    'file.downloaded': 'Downloaded ✓',
    'file.retry': 'Retry',
    'file.cancel': 'Cancel',
    'file.stopping': 'Stopping…',
    'file.zipPrep': 'Preparing ZIP…',
    'file.zipReady': 'Download all (ZIP)',
    'file.zipDone': 'file(s) downloaded as a ZIP.',
    'file.zipNone': 'No files ready to download yet.',
    'file.zipFail': 'Creating the ZIP failed — please download the files one by one.',
    // search palette
    'search.emptyBefore': 'No tool found for',
    'search.emptyAfter': 'Try “compress”, “convert”, “pdf”, “qr”…',
    'search.flowGroup': 'Flow — understood from your sentence',
    'search.flowWorkflow': 'opens in the Workflow builder, nothing runs automatically',
    // handoff
    'handoff.continue': 'Continue with',
    'handoff.from': 'from the previous tool?',
    'handoff.use': 'Use this file',
  },
  fr: {
    'file.processing': 'Traitement…',
    'file.done': 'Terminé',
    'file.failed': 'Échec',
    'file.cancelled': 'Annulé',
    'file.download': 'Télécharger',
    'file.downloaded': 'Téléchargé ✓',
    'file.retry': 'Réessayer',
    'file.cancel': 'Annuler',
    'file.stopping': 'Arrêt…',
    'file.zipPrep': 'Préparation du ZIP…',
    'file.zipReady': 'Tout télécharger (ZIP)',
    'file.zipDone': 'fichier(s) téléchargé(s) en ZIP.',
    'file.zipNone': 'Aucun fichier prêt à être téléchargé pour le moment.',
    'file.zipFail': 'La création du ZIP a échoué — téléchargez les fichiers un par un.',
    'search.emptyBefore': 'Aucun outil trouvé pour',
    'search.emptyAfter': 'Essayez « compress », « convert », « pdf », « qr »…',
    'search.flowGroup': 'Flow — compris à partir de votre phrase',
    'search.flowWorkflow': "s'ouvre dans le constructeur de workflow, rien n'est exécuté automatiquement",
    'handoff.continue': 'Continuer avec',
    'handoff.from': "depuis l'outil précédent ?",
    'handoff.use': 'Utiliser ce fichier',
  },
};
