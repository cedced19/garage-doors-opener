this.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('garage-doors-opener-clock-<%= time %>').then(function(cache) {
        return cache.addAll([
          '/',
          '/favicon.ico',
          '/stylesheets/admin-styles.min.css',
          '/javascripts/admin/build.js'
        ]);
      })
    );
  });
  
  this.addEventListener('fetch', function(event) {
    if (event.request.method !== 'GET') {
      return;
    }
    var get = function () {
      return fetch(event.request).then(function(response) {
        return caches.open('garage-doors-opener-clock-<%= time %>').then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    };
  
    event.respondWith(
      caches
        .match(event.request)
        .then(function(cached) {
          // get the latest updates from API
          if (/api/.test(event.request.url)) {
            return get().catch(function () {
              return cached;
            });
          }
  
          // the cached value could be undefined
          if (typeof cached == 'undefined') {
              return get();
          }
  
          return cached;
        })
        .catch(get)
    );
  });
  
  this.addEventListener('activate', function(event) {
    var cacheWhitelist = ['garage-doors-opener-clock-<%= time %>'];
  
    event.waitUntil(
      caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (cacheWhitelist.indexOf(key) === -1) {
            return caches.delete(key);
          }
        }));
      })
    );
  });