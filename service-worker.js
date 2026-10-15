const CACHE_PREFIX="cct-pwa-";
const CACHE_NAME=`${CACHE_PREFIX}v3`;
const APP_SHELL=[
  "./",
  "./index.html",
  "./styles.css",
  "./script.js",
  "./manifest.webmanifest",
  "./icon.svg",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./audio/voices.js",
  "./audio/nathan/1.mp3",
  "./audio/nathan/2.mp3",
  "./audio/nathan/3.mp3",
  "./audio/nathan/4.mp3",
  "./audio/nathan/5.mp3",
  "./audio/nathan/6.mp3",
  "./audio/nathan/7.mp3",
  "./audio/nathan/8.mp3",
  "./audio/nathan/9.mp3",
  "./audio/enhancednathan/1.mp3",
  "./audio/enhancednathan/2.mp3",
  "./audio/enhancednathan/3.mp3",
  "./audio/enhancednathan/4.mp3",
  "./audio/enhancednathan/5.mp3",
  "./audio/enhancednathan/6.mp3",
  "./audio/enhancednathan/7.mp3",
  "./audio/enhancednathan/8.mp3",
  "./audio/enhancednathan/9.mp3",
  "./audio/samantha/1.mp3",
  "./audio/samantha/2.mp3",
  "./audio/samantha/3.mp3",
  "./audio/samantha/4.mp3",
  "./audio/samantha/5.mp3",
  "./audio/samantha/6.mp3",
  "./audio/samantha/7.mp3",
  "./audio/samantha/8.mp3",
  "./audio/samantha/9.mp3",
  "./audio/siri4/1.mp3",
  "./audio/siri4/2.mp3",
  "./audio/siri4/3.mp3",
  "./audio/siri4/4.mp3",
  "./audio/siri4/5.mp3",
  "./audio/siri4/6.mp3",
  "./audio/siri4/7.mp3",
  "./audio/siri4/8.mp3",
  "./audio/siri4/9.mp3"
];

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache=>{
        const coreAssets=APP_SHELL.filter(url=>!url.endsWith(".mp3"));
        const audioAssets=APP_SHELL.filter(url=>url.endsWith(".mp3"));
        // Atomically cache core application shell
        await cache.addAll(coreAssets);
        // Non-blocking resilient caching for voice packs
        await Promise.allSettled(audioAssets.map(url=>cache.add(url)));
      })
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(names=>Promise.all(
        names
          .filter(name=>name.startsWith(CACHE_PREFIX) && name!==CACHE_NAME)
          .map(name=>caches.delete(name))
      ))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET") return;

  const requestUrl=new URL(request.url);
  if(requestUrl.origin!==self.location.origin) return;

  // Cache-first strategy for immutable audio files
  if(requestUrl.pathname.endsWith(".mp3")){
    event.respondWith(
      caches.match(request).then(cachedResponse=>{
        if(cachedResponse) return cachedResponse;
        return fetch(request).then(response=>{
          if(response.ok){
            const copy=response.clone();
            void caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));
          }
          return response;
        });
      })
    );
    return;
  }

  // Network-first for navigation
  if(request.mode==="navigate"){
    event.respondWith(
      fetch(request)
        .then(response=>{
          if(response.ok){
            const copy=response.clone();
            void caches.open(CACHE_NAME).then(cache=>cache.put("./index.html",copy));
          }
          return response;
        })
        .catch(()=>caches.match("./index.html"))
    );
    return;
  }

  // Stale-while-revalidate for other assets
  event.respondWith(
    caches.match(request).then(cachedResponse=>{
      const networkResponse=fetch(request)
        .then(response=>{
          if(response.ok){
            const copy=response.clone();
            void caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));
          }
          return response;
        })
        .catch(()=>cachedResponse);

      return cachedResponse || networkResponse;
    })
  );
});
