const CACHE_NAME = "static-cache-v3";
const DATA_CACHE_NAME = "data-cache-v4";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./index.js",
  "./icons/icon-192x192.png",
  "./icons/icon-512x512.png",
];

// install
self.addEventListener("install", function (evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("pre-cached successfully!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

// activate
self.addEventListener("activate", function (evt) {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// fetch
self.addEventListener("fetch", function (evt) {
  const { url } = evt.request;
  if (url.includes("/api/transaction")) {
    evt.respondWith(
      caches
        .open(DATA_CACHE_NAME)
        .then((cache) => {
          return fetch(evt.request)
            .then((response) => {
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }
              return response;
            })
            .catch((err) => {
              return cache.match(evt.request);
            });
        })
        .catch((err) => console.log(err))
    );
  } else {
    evt.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(evt.request).then((response) => {
          return response || fetch(evt.request);
        });
      })
    );
  }
});
