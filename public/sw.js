var CACHE_STATIC = 'static-v2';
var CACHE_DYNAMIC = 'dynamic-v2';

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC)
          .then(function(cache) {
            cache.add('/');
            cache.add('/index.html');
            cache.add('/offline.html');
            cache.add('/src/js/app.js');
            cache.add('/src/js/feed.js');
            cache.add('/src/js/promise.js');
            cache.add('/src/js/fetch.js');
            cache.add('/src/js/material.min.js');
            cache.add('/src/css/app.css');
            cache.add('/src/css/feed.css');
            cache.add('/src/images/main-image-lg.jpg');
            cache.add('/src/images/main-image-sm.jpg');
            cache.add('https://fonts.googleapis.com/css?family=Roboto:400);700" rel="stylesheet');
            cache.add('https://fonts.googleapis.com/icon?family=Material+Icons');
            cache.add('https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css');
          })
  );
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
        .then(function(keyList){
          return Promise.all(keyList.map(function(key) {
            if (key !== CACHE_STATIC && key !== CACHE_DYNAMIC) {
              console.log("SW removing old cache " + key);
              return caches.delete(key);
            }
          }));
        })
  );
  return self.clients.claim();
});

// Dynamic caching
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
          .then(function(response) {
            if(response) {
              return response;
            } else {
              return fetch(event.request)
                  .then(function(res) {
                    return caches.open(CACHE_DYNAMIC)
                        .then(function(cache) {
                          cache.put(event.request.url, res.clone());
                          return res;
                        })
                  })
                  .catch(function(err) {
                      return caches.open(CACHE_STATIC)
                                   .then(function(cache) {
                                     return cache.match('/offline.html');
                                   });
                  });

            }
          })
        );
});

// Cache only strategy
// No dynamic caching
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request)
//   );
// });