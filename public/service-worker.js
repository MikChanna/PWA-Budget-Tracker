const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/favicon.ico",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// install
self.addEventListener("install", function (evt) {
  // pre cache data
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("files pre-cahed successfully!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

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

// self.addEventListener("fetch", function (evt) {
//   // code to handle requests goes here
//   evt.respondWith(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.match(evt.request).then((response) => {
//         return response || fetch(evt.request);
//       });
//     })
//   );
// });
