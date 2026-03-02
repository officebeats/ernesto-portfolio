/**
 * Service Worker - Ernesto Rodriguez Portfolio
 * Version: 2.5 - Optimized for performance
 * Caching strategies: Network-first (navigate), Cache-first (fonts/media), Stale-while-revalidate (assets)
 */

const CACHE_NAME = 'portfolio-cache-v2.6';

// Core assets to cache immediately
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './logos/pwa-icon-512.png',
  './switch.mp3'
];

// Media extensions for cache-first strategy
const MEDIA_EXTS = ['.png', '.jpg', '.jpeg', '.svg', '.mp4', '.webm', '.gif', '.ico'];

// External origins to cache (fonts)
const FONT_ORIGINS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://unpkg.com'
];

// Offline fallback HTML
const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Offline — Ernesto Rodriguez</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
      display:flex;align-items:center;justify-content:center;min-height:100dvh;
      background:#050505;color:#fff;text-align:center;padding:2rem}
    h1{font-size:clamp(1.5rem,4vw,2.5rem);margin-bottom:1rem;letter-spacing:-0.02em}
    p{color:#a0a0a0;font-size:1rem;max-width:400px;line-height:1.6}
    .dot{display:inline-block;width:8px;height:8px;border-radius:50%;
      background:#009270;margin-right:0.5rem;animation:pulse 2s ease-in-out infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
    button{margin-top:2rem;padding:0.75rem 2rem;background:#009270;color:#fff;
      border:none;border-radius:10px;font-size:0.875rem;font-weight:600;
      cursor:pointer;min-height:48px;touch-action:manipulation}
    button:active{transform:scale(0.97)}
  </style>
</head>
<body>
  <div>
    <h1><span class="dot"></span>You're Offline</h1>
    <p>It looks like you've lost your connection. The portfolio will reload automatically when you're back online.</p>
    <button onclick="location.reload()">Try Again</button>
  </div>
  <script>window.addEventListener("online",()=>location.reload())</script>
</body>
</html>`;

// ============================================
// Install Event - Precache critical assets
// ============================================
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Activate immediately
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('PWA SW: Precaching critical assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('PWA SW: Installation complete');
      })
      .catch(err => {
        console.error('PWA SW: Precache failed:', err);
      })
  );
});

// ============================================
// Activate Event - Cleanup old caches
// ============================================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Enable navigation preload for faster first paint
      if (self.registration.navigationPreload) {
        try {
          await self.registration.navigationPreload.enable();
        } catch (e) {
          console.log('PWA SW: Navigation preload not supported');
        }
      }

      // Delete old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('PWA SW: Deleting old cache:', name);
            return caches.delete(name);
          })
      );

      // Take control immediately
      await self.clients.claim();
      console.log('PWA SW: Activated and controlling clients');
    })()
  );
});

// ============================================
// Fetch Event - Handle all requests
// ============================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Check if same origin or allowed external
  const isSameOrigin = url.origin === self.location.origin;
  const isFont = FONT_ORIGINS.some(origin => url.origin === origin);
  const isNpm = url.origin === 'https://unpkg.com';

  // Skip other cross-origin requests
  if (!isSameOrigin && !isFont && !isNpm) return;

  // ----------------------
  // Navigation requests (HTML)
  // ----------------------
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Try network first
          const response = await fetch(request);
          
          // Cache the fresh response
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, response.clone());
          
          return response;
        } catch (error) {
          // Network failed - try cache
          const cached = await caches.match(request);
          if (cached) return cached;
          
          // Return offline page
          return new Response(OFFLINE_HTML, {
            headers: { 'Content-Type': 'text/html' }
          });
        }
      })()
    );
    return;
  }

  // ----------------------
  // Font requests - Cache first (rarely change)
  // ----------------------
  if (isFont || isNpm) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) {
          // Return cached, update in background
          fetch(request).then(response => {
            if (response.ok) {
              caches.open(CACHE_NAME).then(cache => 
                cache.put(request, response)
              );
            }
          }).catch(() => {});
          return cached;
        }
        
        // Not cached, fetch and cache
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => 
              cache.put(request, clone)
            );
          }
          return response;
        }).catch(() => {
          // Return fallback for fonts if offlineisFont) {

          if (            return new Response('', { status: 200 });
          }
        });
      })
    );
    return;
  }

  // ----------------------
  // Media assets - Cache first (large, save bandwidth)
  // ----------------------
  const isMedia = MEDIA_EXTS.some(ext => 
    url.pathname.toLowerCase().endsWith(ext)
  );

  if (isMedia) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => 
              cache.put(request, clone)
            );
          }
          return response;
        });
      })
    );
    return;
  }

  // ----------------------
  // Core assets (JS, CSS) - Stale while revalidate
  // ----------------------
  event.respondWith(
    caches.match(request).then(cached => {
      const fetchPromise = fetch(request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => 
              cache.put(request, clone)
            );
          }
          return response;
        })
        .catch(() => {
          console.log('PWA SW: Network failed for:', request.url);
        });

      // Return cached immediately, update in background
      return cached || fetchPromise;
    })
  );
});

// ============================================
// Background Sync (for future use)
// ============================================
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-analytics') {
    console.log('PWA SW: Background sync triggered');
  }
});

// ============================================
// Push Notifications (for future use)
// ============================================
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'New update available',
      icon: './logos/pwa-icon-512.png',
      badge: './logos/pwa-icon-512.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || './'
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Ernesto Rodriguez', options)
    );
  }
});
