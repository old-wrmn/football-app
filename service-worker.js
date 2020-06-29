const CACHE_NAME = "football-v12";
const urlsToCache = [
  "/",
  "/nav.html",
  "/index.html",
  "/match.html",
  "/manifest.json",
  "/pages/home.html",
  "/pages/about.html",
  "/pages/saved.html",
  "/pages/top_scorers.html",
  "/css/style.css",
  "/css/materialize.min.css",
  "/js/materialize.min.js",
  "/js/nav.js",
  "/js/api.js",
  "/js/idb.js",
  "/js/db.js",
  "/js/main.js",
  "/js/match.js",
  "img/icons/icon-72x72.png",
  "img/icons/icon-96x96.png",
  "img/icons/icon-128x128.png",
  "img/icons/icon-144x144.png",
  "img/icons/icon-152x152.png",
  "img/icons/icon-192x192.png",
  "img/icons/icon-384x384.png",
  "img/icons/icon-512x512.png",
  "/img/post-1.png"
];
 
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function(event) {
  const the_url = "https://api.football-data.org/v2/competitions/ELC/matches?status=SCHEDULED";
  const url_s = "https://api.football-data.org/v2/competitions/ELC/scorers";
  const url_id = "https://api.football-data.org/v2/matches/";
  if (event.request.url.indexOf(the_url) > -1 || event.request.url.indexOf(url_s) > -1 || event.request.url.indexOf(url_id) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request.url, response.clone());
          return response;
        })
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch (event.request);
      })
    )
  }
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName != CACHE_NAME) {
              console.log("ServiceWorker: cache " + cacheName + " dihapus");
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
});
