/**
 * V4.1 — tiny i18n runtime.
 * Dictionary-driven (src/data/translations.js), localStorage-persisted,
 * English fallback for every missing key. No dependency, no network.
 */
import { DICT } from '../data/translations.js';

const KEY = 'qt-lang';

export function getLang() {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'fr' ? 'fr' : 'en';
  } catch {
    return 'en';
  }
}

export function setLang(lang) {
  try {
    localStorage.setItem(KEY, lang === 'fr' ? 'fr' : 'en');
  } catch {
    /* storage unavailable — session-only */
  }
  // Strings are rendered on the fly by the tools; dispatch for any live listener.
  window.dispatchEvent(new CustomEvent('qt-langchange', { detail: { lang: getLang() } }));
}

/** Translate a key; always falls back to English, never throws. */
export function t(key, vars = null) {
  const lang = getLang();
  let out = DICT[lang]?.[key] ?? DICT.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, String(v));
  }
  return out;
}
