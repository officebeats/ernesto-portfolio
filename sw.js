const CACHE_NAME = "ernesto-portfolio-v2.1-pwa";

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

// Google Fonts CDN for runtime caching
const FONT_ORIGINS = [
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
];

// Lightweight offline fallback
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

// ————— Install —————
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)),
  );
});

// ————— Activate (Navigation Preload + Cache Purge) —————
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Enable Navigation Preload for faster first-paint
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }

      // Purge old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log("PWA SW: Purging old cache", name);
            return caches.delete(name);
          }
        }),
      );

      // Take control immediately
      await self.clients.claim();
    })(),
  );
});

// ————— Fetch —————
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET and cross-origin (except fonts)
  if (event.request.method !== "GET") return;

  const isSameOrigin = url.origin === self.location.origin;
  const isFont = FONT_ORIGINS.some((origin) => url.origin === origin);

  if (!isSameOrigin && !isFont) return;

  // Navigation requests — Network-first with preload + offline fallback
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // Use navigation preload response if available
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) return preloadResponse;

          return await fetch(event.request);
        } catch {
          // Network failed — try cache, then offline fallback
          const cached = await caches.match(event.request);
          if (cached) return cached;

          return new Response(OFFLINE_HTML, {
            headers: { "Content-Type": "text/html" },
          });
        }
      })(),
    );
    return;
  }

  // Font requests — Cache-first (fonts rarely change)
  if (isFont) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          const clone = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, clone));
          return response;
        });
      }),
    );
    return;
  }

  // Media assets — Cache-first (save bandwidth on mobile)
  const isMedia = MEDIA_EXTS.some((ext) =>
    url.pathname.toLowerCase().endsWith(ext),
  );

  if (isMedia) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          const clone = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, clone));
          return response;
        });
      }),
    );
    return;
  }

  // Core assets — Stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          console.log("PWA SW: Network failed, relying on cache.");
        });

      return cached || fetchPromise;
    }),
  );
});
