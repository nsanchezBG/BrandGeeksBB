const CACHE_NAME = 'burger-run-cache-v8'; // Incrementa la versión de la caché para forzar la actualización
// Las rutas ahora incluyen /BrandGeeksBB/ para que el Service Worker las cachee correctamente
const urlsToCache = [
  '/BrandGeeksBB/', // La página principal de la subcarpeta
  '/BrandGeeksBB/index.html',
  // --- IMÁGENES (rutas relativas a la raíz del repositorio de Pages) ---
  '/BrandGeeksBB/descarga%20(1).png',
  '/BrandGeeksBB/burger%20run%20logo.png',
  '/BrandGeeksBB/player.png', // El player original (negro)
  '/BrandGeeksBB/hamburger_411275.png',
  '/BrandGeeksBB/camera.png',
  '/BrandGeeksBB/player%20icono%20desktop.png', // El icono blanco de la PWA
  '/BrandGeeksBB/player-blink.png', // ¡NUEVO: La imagen de parpadeo!
  // --- AUDIOS (rutas relativas a la raíz del repositorio de Pages) ---
  '/BrandGeeksBB/City%20Echoes.mp3',
  '/BrandGeeksBB/spawn.MP3',
  '/BrandGeeksBB/beep.MP3',
  '/BrandGeeksBB/lose.mp3',
  '/BrandGeeksBB/manifest.json', // Asegurarse de cachear el manifest también
  // --- FUENTES (URLs externas, se cachean si el CDN lo permite, pero es mejor descargarlas y hacerlas relativas) ---
  'https://fonts.googleapis.com/css2?family=VT323&display=swap',
  'https://fonts.gstatic.com/s/vt323/v17/pxiKyp4j6v_D_uE_0j_z.woff2' 
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Cache:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching all content');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('[Service Worker] Cache installation failed:', error);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          console.log('[Service Worker] Serving from cache:', event.request.url);
          return response;
        }
        console.log('[Service Worker] Fetching from network:', event.request.url);
        return fetch(event.request);
      })
      .catch((error) => {
        console.error('[Service Worker] Fetch failed:', error);
        // Puedes devolver una página offline si la solicitud falla y no está en caché
        // return caches.match('/BrandGeeksBB/offline.html'); // Si tuvieras una página offline
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating new Service Worker:', CACHE_NAME);
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
