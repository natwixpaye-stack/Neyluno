/** Formatage des tailles de fichiers et des nombres (fonctions pures, testables). */

export function formatBytes(bytes, decimals = 1) {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** i;
  const str = value >= 100 || i === 0 ? String(Math.round(value)) : value.toFixed(decimals);
  return `${str} ${units[i]}`;
}

/** Nombre avec un nombre "raisonnable" de décimales, sans zéros inutiles. */
export function formatNumber(value, maxDecimals = 4) {
  if (!Number.isFinite(value)) return '—';
  const factor = 10 ** maxDecimals;
  const rounded = Math.round(value * factor) / factor;
  return rounded.toLocaleString('en-US', { maximumFractionDigits: maxDecimals });
}

export function formatPercent(value, maxDecimals = 2) {
  if (!Number.isFinite(value)) return '—';
  return `${formatNumber(value, maxDecimals)} %`;
}
