const CACHE_NAME = 'burger-run-cache-v1';
const urlsToCache = [
  '/', // La página principal
  '/index.html',
  // --- IMÁGENES (rutas relativas) ---
  '/descarga%20(1).png',
  '/burger%20run%20logo.png',
  '/player.png',
  '/hamburger_411275.png',
  '/camera.png',
  // --- AUDIOS (rutas relativas) ---
  '/City%20Echoes.mp3',
  '/spawn.MP3',
  '/beep.MP3',
  '/lose.mp3',
  // --- FUENTES (si las quieres offline, necesitarías descargarlas o usar un CDN que cachee) ---
  'https://fonts.googleapis.com/css2?family=VT323&display=swap',
  'https://fonts.gstatic.com/s/vt323/v17/pxiKyp4j6v_D_uE_0j_z.woff2' // Ejemplo de WOFF2 para VT323
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
