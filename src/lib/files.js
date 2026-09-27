/** Validation de fichiers — messages d'erreur clairs, en français. */
import { site } from '../data/site.js';

export const MAX_FILE_BYTES = site.limits.maxFileMB * 1024 * 1024;

/**
 * Valide un fichier.
 * @param {File} file
 * @param {{acceptTypes?: string[], acceptExts?: string[], maxBytes?: number, label?: string}} rules
 * @returns {{ok: true} | {ok: false, error: string}}
 */
export function validateFile(file, { acceptTypes = [], acceptExts = [], maxBytes = MAX_FILE_BYTES, label = 'ce fichier' } = {}) {
  if (!file) return { ok: false, error: 'Aucun fichier sélectionné.' };

  const name = (file.name || '').toLowerCase();
  const ext = name.includes('.') ? name.slice(name.lastIndexOf('.')) : '';

  if (file.size === 0) {
    return { ok: false, error: `« ${file.name} » est vide (0 octet). Vérifiez le fichier et réessayez.` };
  }

  if (file.size > maxBytes) {
    return { ok: false, error: `« ${file.name} » dépasse la limite de ${Math.round(maxBytes / 1024 / 1024)} Mo. Réduisez le fichier ou découpez-le.` };
  }

  if (acceptTypes.length || acceptExts.length) {
    const typeOk = acceptTypes.includes(file.type) || (file.type === '' && acceptExts.includes(ext));
    const extOk = acceptExts.includes(ext);
    if (!typeOk && !extOk) {
      const expected = [...acceptExts].join(', ') || acceptTypes.join(', ');
      return {
        ok: false,
        error: `Format non pris en charge : « ${file.name} ». Formats acceptés : ${expected}.`,
      };
    }
  }

  return { ok: true };
}

/** Taille lisible par un humain (délègue à formatBytes pour rester DRY). */
export { formatBytes } from './format.js';
