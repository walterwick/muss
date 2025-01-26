const CACHE_NAME = 'music-player-v1';
const OFFLINE_URLS = [
  '/',
  '/index.html',
  'https://walterwick.de/pic/1e28t5wucm0b1.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(OFFLINE_URLS))
  );
});

self.addEventListener('fetch', event => {
  // Müzik dosyaları için özel cache stratejisi
  if (event.request.url.endsWith('.mp3')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => 
        cache.match(event.request).then(response => 
          response || fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
        )
      )
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
