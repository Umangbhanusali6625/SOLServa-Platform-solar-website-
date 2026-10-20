/**
 * SOLSERVA GREENTECH - Progressive Web App (PWA) Service Worker
 * Version: 2.0.0
 */

const CACHE_NAME = 'solserva-pwa-v2';

const STATIC_ASSETS = [
  './',
  './index.html',
  './about.html',
  './services.html',
  './solutions.html',
  './epc-partners.html',
  './how-it-works.html',
  './calculator.html',
  './resources.html',
  './contact.html',
  './manifest.json',
  './assets/css/base.css',
  './assets/css/components.css',
  './assets/css/layout.css',
  './assets/css/sections.css',
  './assets/css/style.css',
  './assets/js/main.js',
  './assets/js/nav.js',
  './assets/js/modals.js',
  './assets/js/calculator.js',
  './assets/js/forms.js',
  './assets/images/Logo.png',
  './assets/images/icon-192.png',
  './assets/images/icon-512.png'
];

// 1. Install Event - Cache Core Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[PWA ServiceWorker] Pre-cache warning:', err);
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
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event - Network First with Cache Fallback for Pages, Cache First for Static Assets
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle HTML navigation (Network first, fallback to cached index)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('./index.html');
          });
        })
    );
    return;
  }

  // Handle Static Assets (Stale-While-Revalidate)
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
