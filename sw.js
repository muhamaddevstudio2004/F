const CACHE = 'sexur-v2';
const FILES = [
  '/',
  '/index.html',
  '/sexur.webp',
  '/bsexur.webp',
  '/fsexur.webp',
  '/ads.webp',
  '/sexur.png',
  '/sexurb.png',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
