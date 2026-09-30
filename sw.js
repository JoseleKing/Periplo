// Service worker de Periplo. Al compilar, vite.config.ts inyecta la lista de ficheros
// y una versión nueva, así que cada build invalida la caché anterior.
const PRECACHE = __PRECACHE__
const CACHE = `periplo-${__VERSION__}`

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((claves) => Promise.all(claves.filter((c) => c !== CACHE).map((c) => caches.delete(c))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return

  // La página: primero la red (para recibir versiones nuevas) y, sin conexión, la caché.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((respuesta) => {
          const copia = respuesta.clone()
          caches.open(CACHE).then((cache) => cache.put('./', copia))
          return respuesta
        })
        .catch(() => caches.match('./')),
    )
    return
  }

  // Recursos con hash: la caché basta.
  event.respondWith(caches.match(request).then((enCache) => enCache ?? fetch(request)))
})
