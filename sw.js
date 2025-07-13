// Service Worker para PWA offline con versión dinámica
const CACHE_VERSION = '0.0.76';
const CACHE_NAME = `contactosdiarios-${CACHE_VERSION}`;

// Determinar la base URL dinámicamente
const isGitHubPages = self.location.hostname === 'sasogu.github.io';
const BASE = isGitHubPages ? '/ContactosDiarios/' : '/';

const toCache = [
  BASE,
  BASE + 'index.html',
  BASE + 'icon-192.png',
  BASE + 'icon-512.png',
  BASE + 'vite.svg',
  BASE + 'manifest.webmanifest',
  // Los assets de Vite se cachearán dinámicamente
];

self.addEventListener('install', event => {
  console.log('SW: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Caching files');
        return cache.addAll(toCache);
      })
      .then(() => {
        console.log('SW: Installed successfully');
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', event => {
  console.log('SW: Activating...');
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => {
          console.log('SW: Deleting old cache:', k);
          return caches.delete(k);
        })
      ))
      .then(() => {
        console.log('SW: Activated successfully');
        return self.clients.claim();
      })
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
