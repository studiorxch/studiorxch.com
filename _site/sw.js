// app/sw.js
// Kill switch service worker for /app/sw.js

self.addEventListener('install', (event) => {
  // Immediately trigger activation
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // 1. Delete ALL caches this service worker created
  caches.keys().then(keys => keys.forEach(key => caches.delete(key)));

  // 2. Unregister this service worker so it never comes back
  self.registration.unregister();

  // 3. Take control of all clients NOW
  return clients.claim();
});

// 4. Override fetch — return network directly (no cache)
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
