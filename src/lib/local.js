/** Local-only state: recent tools, favorites, saved workflows. No account, no server. */
import { site } from '../data/site.js';

/** Read a JSON array from localStorage; corrupt or wrong-shaped data yields []. */
function readArray(key, keep) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(keep);
  } catch {
    return [];
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — degrade silently */
  }
}

/* ---------- Recent tools ---------- */
export function getRecents() {
  return readArray(site.storageKeys.recents, (e) => e && typeof e === 'object' && typeof e.slug === 'string');
}

export function pushRecent(slug) {
  const list = getRecents().filter((e) => e.slug !== slug);
  list.unshift({ slug, ts: Date.now() });
  write(site.storageKeys.recents, list.slice(0, 8));
}

/* ---------- Favorites ---------- */
export function getFavorites() {
  return readArray(site.storageKeys.favorites, (s) => typeof s === 'string');
}

export function isFavorite(slug) {
  return getFavorites().includes(slug);
}

export function toggleFavorite(slug) {
  const favs = getFavorites();
  const i = favs.indexOf(slug);
  if (i >= 0) favs.splice(i, 1);
  else favs.push(slug);
  write(site.storageKeys.favorites, favs);
  return i < 0; // true if now favorite
}

/* ---------- Saved workflows ---------- */
export function getSavedWorkflows() {
  return readArray(
    site.storageKeys.workflows,
    (w) => w && typeof w === 'object' && typeof w.name === 'string' && Array.isArray(w.steps)
  );
}

export function saveWorkflows(list) {
  write(site.storageKeys.workflows, (Array.isArray(list) ? list : []).slice(0, 20));
}
