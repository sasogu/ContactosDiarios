// Service Worker para PWA offline con versión dinámica
const CACHE_VERSION = '0.0.7';
const CACHE_NAME = `contactosdiarios-${CACHE_VERSION}`;
const toCache = [
  './',
  'index.html',
  'vite.png',
  'manifest.webmanifest',
  // Los assets generados por Vite se cachean dinámicamente
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(toCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(resp =>
      resp || fetch(event.request).then(fetchResp => {
        // Cachea nuevos assets generados por Vite
        if (fetchResp && fetchResp.status === 200 && fetchResp.type === 'basic') {
          const respClone = fetchResp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, respClone));
        }
        return fetchResp;
      })
    ).catch(() => caches.match('index.html'))
  );
});
