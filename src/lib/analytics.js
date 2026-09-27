/**
 * ANALYTICS — architecture prête, aucun tracking par défaut.
 * Pour activer : site.analytics.enabled = true + script respectueux de la vie privée
 * (Plausible, Umami, Matomo auto-hébergé…). Les événements sont mis en file
 * d'attente jusqu'à ce qu'un collecteur soit branché.
 */
import { site } from '../data/site.js';

const queue = [];

export function track(event, data = {}) {
  const payload = { event, data, ts: Date.now(), path: location.pathname };
  if (!site.analytics.enabled) {
    queue.push(payload);
    return;
  }
  // Point de branchement futur (ex. window.plausible?.(event, { props: data }))
  queue.push(payload);
}

export function getQueue() {
  return queue;
}
