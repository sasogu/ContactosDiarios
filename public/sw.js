// Service Worker para PWA offline con versión dinámica y rutas absolutas para GitHub Pages
const CACHE_VERSION = '0.0.8';
const CACHE_NAME = `contactosdiarios-${CACHE_VERSION}`;
const BASE = '/ContactosDiarios/';
const toCache = [
  BASE,
  BASE + 'index.html',
  BASE + 'vite192.png',
  BASE + 'manifest.webmanifest',
  // Añade aquí tus assets principales generados por Vite si los conoces, ej:
  // BASE + 'assets/index-xxxx.js',
  // BASE + 'assets/style-xxxx.css',
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
  // Solo cachea peticiones dentro del scope de la app
  if (!event.request.url.includes(BASE)) return;
  event.respondWith(
    caches.match(event.request).then(resp =>
      resp || fetch(event.request).then(fetchResp => {
        // Cachea nuevos assets generados por Vite
        if (
          fetchResp &&
          fetchResp.status === 200 &&
          fetchResp.type === 'basic' &&
          event.request.url.includes(BASE)
        ) {
          const respClone = fetchResp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, respClone));
        }
        return fetchResp;
      })
    ).catch(() => caches.match(BASE + 'index.html'))
  );
});
