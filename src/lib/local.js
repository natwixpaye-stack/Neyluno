/** Local-only state: recent tools, favorites, saved workflows. No account, no server. */
import { site } from '../data/site.js';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
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
  return read(site.storageKeys.recents, []);
}

export function pushRecent(slug) {
  const list = getRecents().filter((e) => e.slug !== slug);
  list.unshift({ slug, ts: Date.now() });
  write(site.storageKeys.recents, list.slice(0, 8));
}

/* ---------- Favorites ---------- */
export function getFavorites() {
  return read(site.storageKeys.favorites, []);
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
  return read(site.storageKeys.workflows, []);
}

export function saveWorkflows(list) {
  write(site.storageKeys.workflows, list.slice(0, 20));
}
