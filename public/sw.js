// AI Music registers no service worker. Another local app (ViralThumblify) can leave
// one on http://localhost:3000 that serves its cached /_next/static chunks to this app.
// The browser re-fetches /sw.js on navigation, picks up this file, and it removes itself.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const windows = await self.clients.matchAll({ type: "window" });
      windows.forEach((client) => client.navigate(client.url));
    })(),
  );
});
