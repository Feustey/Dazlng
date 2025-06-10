const CACHE_NAME = 'daznode-v1';
const STATIC_CACHE = 'daznode-static-v1';
const API_CACHE = 'daznode-api-v1';

// Ressources à mettre en cache automatiquement
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/assets/images/logo-daznode.svg',
  '/assets/images/dazia-illustration.png'
];

// Endpoints API à mettre en cache
const API_ENDPOINTS = [
  '/api/user',
  '/api/dazno/',
  '/api/auth/me'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Supprimer les anciens caches
          if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Gestion des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') {
    return;
  }

  // Stratégie pour les API endpoints (Stale While Revalidate)
  if (API_ENDPOINTS.some(endpoint => url.pathname.startsWith(endpoint))) {
    event.respondWith(
      caches.open(API_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        
        // Fetch en arrière-plan pour revalidation
        const fetchPromise = fetch(request).then((response) => {
          if (response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        }).catch(() => {
          // Si le fetch échoue, retourner la version cached si disponible
          return cachedResponse;
        });

        // Retourner le cache immédiatement si disponible, sinon attendre le fetch
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Stratégie pour les assets statiques (Cache First)
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'image' ||
      url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(request).then((response) => {
          // Mettre en cache seulement les réponses valides
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Stratégie pour les pages HTML (Network First avec fallback)
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request).then((response) => {
        // Mettre en cache la page si elle se charge avec succès
        if (response.ok) {
          const responseToCache = response.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      }).catch(() => {
        // Si le réseau échoue, essayer de servir depuis le cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback vers la page d'accueil si rien n'est trouvé
          return caches.match('/');
        });
      })
    );
    return;
  }
});

// Nettoyage périodique du cache
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_CLEANUP') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.open(cacheName).then((cache) => {
              return cache.keys().then((requests) => {
                // Supprimer les entrées anciennes (plus de 7 jours)
                const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
                return Promise.all(
                  requests.map((request) => {
                    return cache.match(request).then((response) => {
                      if (response) {
                        const dateHeader = response.headers.get('date');
                        if (dateHeader) {
                          const responseDate = new Date(dateHeader).getTime();
                          if (responseDate < oneWeekAgo) {
                            return cache.delete(request);
                          }
                        }
                      }
                    });
                  })
                );
              });
            });
          })
        );
      })
    );
  }
});

// Pré-cache de ressources importantes
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PRECACHE_RESOURCES') {
    const resources = event.data.resources || [];
    event.waitUntil(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(resources);
      })
    );
  }
});

// Log des performances du cache
function logCacheHit(request, source) {
  if (self.clients) {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'CACHE_HIT',
          url: request.url,
          source: source,
          timestamp: Date.now()
        });
      });
    });
  }
} 