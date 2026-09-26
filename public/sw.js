// Bottomless Service Worker — Zero Permissions, 100% Offline Calm
const CACHE_NAME = 'bottomless-v1';

self.addEventListener('install', (event) => {
  const scope = self.registration.scope;
  const assets = [
    scope,
    scope + 'index.html',
    scope + 'manifest.json',
    scope + 'favicon.svg',
    scope + 'icon-192.png',
    scope + 'icon-512.png'
  ];
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets).catch(() => {});
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match(self.registration.scope) || caches.match(self.registration.scope + 'index.html');
        }
      });
    })
  );
});
