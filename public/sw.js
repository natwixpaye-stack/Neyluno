/* Neyluno service worker — app-shell caching only.
 * Rules:
 *  - GET + same-origin only.
 *  - /_astro/* hashed assets: cache-first (immutable).
 *  - HTML navigations: network-first, cached fallback (works offline once visited).
 *  - Everything else same-origin: stale-while-revalidate.
 *  - User files are NEVER fetched (pure client-side Blobs) so they can never
 *    land in the cache. No analytics, no third-party requests.
 */
const VERSION = 'qt-v4.1.0';
const STATIC = `qt-static-${VERSION}`;

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(STATIC)
      .then((c) => c.addAll(['/']))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== STATIC).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // never proxy/cache external content

  // Immutable hashed build assets
  if (url.pathname.startsWith('/_astro/')) {
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            const copy = res.clone();
            if (res.ok) caches.open(STATIC).then((c) => c.put(req, copy));
            return res;
          })
      )
    );
    return;
  }

  // Navigations: fresh when online, cached copy offline
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(STATIC).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match('/')))
    );
    return;
  }

  // Other same-origin GETs: stale-while-revalidate
  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(STATIC).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});
