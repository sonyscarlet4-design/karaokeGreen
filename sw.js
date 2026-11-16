const CACHE_NAME = 'karaoke-green-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './cocteles.html',
    './promos.html',
    './styles.css',
    './script.js',
    './canciones.json',
    './manifest.json',
    './verdek.webp'
];

// Instalación: Guardar recursos clave en caché
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activación: Limpiar cachés antiguas si las hubiera
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.claim();
});

// Intercepción de solicitudes para soporte offline
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(cachedResponse => {
            return cachedResponse || fetch(e.request).catch(() => {
                // Aquí podrías retornar una página de respaldo offline si fuera necesario
            });
        })
    );
});