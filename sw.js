const CACHE = 'sexur-v1';
const FILES = [
  '/F/',
  '/F/index.html',
  '/F/sexur.webp',
  '/F/bsexur.webp',
  '/F/ads.webp'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
