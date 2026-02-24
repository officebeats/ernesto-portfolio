const CACHE_NAME = "ernesto-portfolio-v1.1"; // Bumped version for new strategy

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./logos/pwa-icon-512.png",
];

// Media extensions for strict cache-first policy
const MEDIA_EXTS = [".png", ".jpg", ".jpeg", ".svg", ".mp4", ".webp"];

self.addEventListener("install", (event) => {
  self.skipWaiting(); // Force activate new worker instantly
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Pre-cache core assets
      return cache.addAll(ASSETS_TO_CACHE);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("PWA SW: Purging old cache", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => self.clients.claim()), // Take control of clients immediately
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Exclude non-GET requests and external domains (unless specific CDN)
  if (
    event.request.method !== "GET" ||
    !url.origin.includes(self.location.origin)
  ) {
    return;
  }

  // Determine ifrequest is for a heavy media asset
  const isMedia = MEDIA_EXTS.some((ext) =>
    url.pathname.toLowerCase().endsWith(ext),
  );

  if (isMedia) {
    // Media Strategy: Strict Cache-First (Save bandwidth on mobile)
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        // If not in cache, fetch and then dynamically cache it
        return fetch(event.request).then((networkResponse) => {
          // Clone the response before caching
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        });
      }),
    );
  } else {
    // Core Assets Strategy: Stale-While-Revalidate (Instant load, background update)
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Kick off a network request to update the cache in the background
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Offline fallback logic could go here if network fails
            console.log("PWA SW: Network fetch failed, relying on cache.");
          });

        // Return the cached response immediately if we have it,
        // otherwise wait for the network response.
        return cachedResponse || fetchPromise;
      }),
    );
  }
});
