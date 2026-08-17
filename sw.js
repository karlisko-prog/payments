/* Ledus kase — bezsaistes režīms */
var CACHE = "ledus-kase-v2";
var ASSETS = ["./", "./index.html", "./manifest.webmanifest",
              "./icon-192.png", "./icon-512.png", "./icon-180.png", "./icon-maskable.png"];

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); })
      .then(function(){ return self.skipWaiting(); })
      .catch(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ if(k!==CACHE) return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

/* Vispirms tīkls (lai vienmēr dabū jaunāko versiju), bez tīkla — no kešatmiņas */
self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET") return;
  e.respondWith(
    fetch(req).then(function(res){
      if(res && res.status===200 && res.type==="basic"){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(req, copy); }).catch(function(){});
      }
      return res;
    }).catch(function(){
      return caches.match(req).then(function(r){
        return r || caches.match("./index.html") || caches.match("./");
      });
    })
  );
});
