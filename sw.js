/**
 * SOLSERVA GREENTECH - Progressive Web App (PWA) Service Worker
 * Version: 3.4.0 (Universal Clean URL & Offline Routing Edition)
 */

const CACHE_NAME = 'solserva-pwa-v20';

const STATIC_ASSETS = [
  '/',
  '/services/',
  '/solutions/',
  '/epc-partners/',
  '/how-it-works/',
  '/calculator/',
  '/about/',
  '/resources/',
  '/contact/',
  '/privacy-policy/',
  '/terms/',
  '/service-scope/',
  '/manifest.json',
  '/assets/css/base.css',
  '/assets/css/layout.css',
  '/assets/css/components.css',
  '/assets/css/sections.css',
  '/assets/css/style.css',
  '/assets/js/nav.js',
  '/assets/js/modals.js',
  '/assets/js/calculator.js',
  '/assets/js/forms.js',
  '/assets/js/main.js',
  '/assets/images/favicon-64.png',
  '/assets/images/icon-192.png',
  '/assets/images/hero-solar.webp',
  '/assets/images/og-image.png',
  '/assets/images/solserva-green-energy-emblem.svg',
  '/assets/images/stick-logger-with-usb-connector.webp',
  '/assets/images/solserva-greentech-stick-logger.webp',
  '/assets/images/stick-logger-with-green-connector.png',
  '/assets/images/solserva-stick-logger-junction-box.webp'
];

// 1. Install Event - Cache Core Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[PWA ServiceWorker] Pre-cache notice:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event - Clean Up Stale Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[PWA ServiceWorker] Purging outdated cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 3.1 Handle HTML navigation
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return networkResponse;
          }
          // If server returned 404 (e.g. static local server missing rewrite rule), check cache
          return caches.match(request, { ignoreSearch: true }).then((cached) => {
            if (cached) return cached;
            const altPath = url.pathname.endsWith('/') ? url.pathname.slice(0, -1) : url.pathname + '/';
            return caches.match(altPath).then((altCached) => altCached || networkResponse);
          });
        })
        .catch(() => {
          return caches.match(request, { ignoreSearch: true }).then((cached) => {
            if (cached) return cached;
            const altPath = url.pathname.endsWith('/') ? url.pathname.slice(0, -1) : url.pathname + '/';
            return caches.match(altPath).then((altCached) => altCached || caches.match('/'));
          });
        })
    );
    return;
  }

  // 3.2 Handle JavaScript & CSS Code Assets
  const isCodeAsset = url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.search.includes('v=');
  if (isCodeAsset) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(request, { ignoreSearch: true }))
    );
    return;
  }

  // 3.3 Handle Static Media & Images
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
