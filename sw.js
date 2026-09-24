/* tutti.frutti · service worker mínimo para que el juego se pueda instalar como app.
   Siempre pide primero la versión nueva a la red (así cada deploy se ve al
   instante) y solo usa lo guardado si no hay conexión. Nada de Firebase,
   anuncios ni otros sitios pasa por acá. */
const CACHE = "tuttifrutti-v1";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/.netlify/")) return;
  event.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(cache => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then(hit => hit || caches.match("/jugar.html")))
  );
});
