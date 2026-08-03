// MUSLIM LIFE OS™ - Service Worker
// Offline-First PWA | Version 1.0.0
// Caches core assets for instant load and offline use. Supabase calls are network-first with fallback.

const CACHE_NAME = 'muslim-life-os-v1.0.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './supabase.js',
  './manifest.json',
  // Add critical fonts or additional CSS/JS if bundled locally in future
  'https://cdn.tailwindcss.com', // Note: For production, self-host Tailwind or use PostCSS build
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js'
];

const OFFLINE_FALLBACK = './index.html';

// Install: Cache core shell
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Muslim Life OS Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating new Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch strategy: Cache First for static, Network First for dynamic/API with offline fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET or chrome-extension
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // For Supabase API (realtime/rest) - Network first, fallback to cache if offline
  if (url.hostname.includes('supabase.co') || url.pathname.includes('/rest/') || url.pathname.includes('/realtime/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Optionally cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match(OFFLINE_FALLBACK)))
    );
    return;
  }

  // Static assets & app shell: Cache First, update in background (Stale-While-Revalidate)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse); // If network fails, return cached

      return cachedResponse || fetchPromise;
    })
  );
});

// Optional: Background sync for pending writes when back online (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pending-ibadah') {
    event.waitUntil(syncPendingData());
  }
});

async function syncPendingData() {
  // Placeholder: In real app, read from IndexedDB 'pending' store and POST to Supabase
  console.log('[SW] Background sync triggered for pending ibadah data');
}