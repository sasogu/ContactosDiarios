// Service Worker para PWA offline con versión dinámica
const CACHE_VERSION = '0.0.86';
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
  // Archivos JavaScript del proyecto
  BASE + 'src/main.js',
  BASE + 'src/counter.js',
  BASE + 'src/version.js',
  BASE + 'src/style.css',
  // Los assets compilados de Vite se cachearán dinámicamente
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

// Endpoint para obtener la versión del service worker
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'GET_VERSION') {
    console.log('SW: Enviando versión:', CACHE_VERSION);
    event.ports[0].postMessage({
      type: 'VERSION_RESPONSE',
      version: CACHE_VERSION
    });
  }
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  // Solo cachea peticiones dentro del scope de la app
  if (!event.request.url.includes(BASE)) return;
  
  event.respondWith(
    caches.match(event.request).then(resp =>
      resp || fetch(event.request).then(fetchResp => {
        // Cachea nuevos assets generados por Vite y archivos JS
        if (
          fetchResp &&
          fetchResp.status === 200 &&
          fetchResp.type === 'basic' &&
          event.request.url.includes(BASE) &&
          (
            // Archivos JavaScript
            event.request.url.endsWith('.js') ||
            // Assets con hash de Vite
            /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)(\?.*)?$/i.test(event.request.url) ||
            // Archivos estáticos
            event.request.url.includes('/assets/') ||
            // Otros recursos de la app
            event.request.url.includes(BASE)
          )
        ) {
          const respClone = fetchResp.clone();
          caches.open(CACHE_NAME).then(cache => {
            console.log('SW: Cacheando:', event.request.url);
            cache.put(event.request, respClone);
          });
        }
        return fetchResp;
      })
    ).catch(() => {
      // Fallback para navegación
      if (event.request.mode === 'navigate') {
        return caches.match(BASE + 'index.html');
      }
      // Para otros recursos, intentar servir desde cache
      return caches.match(event.request);
    })
  );
});
