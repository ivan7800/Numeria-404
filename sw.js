const CACHE_PREFIX="numeria404-";
const CACHE=`${CACHE_PREFIX}v2.2.0`;
const APP_SHELL=[
  "./","./index.html","./css/app.v2.2.0.css","./js/numeria.runtime.v2.2.0.js",
  "./manifest.webmanifest","./assets/icons/icon.svg","./assets/icons/icon-192.png","./assets/icons/icon-512.png","./assets/icons/icon-maskable-512.png"
];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
async function networkFirst(request,fallback){
  const cache=await caches.open(CACHE);
  try{
    const response=await fetch(request,{cache:"no-store"});
    if(response && response.ok) await cache.put(request,response.clone());
    return response;
  }catch(error){
    return (await caches.match(request)) || (fallback ? await caches.match(fallback) : undefined) || Response.error();
  }
}
self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET") return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin) return;
  if(request.mode==="navigate"){event.respondWith(networkFirst(request,"./index.html"));return;}
  const critical=/\.(?:js|css)$/.test(url.pathname);
  if(critical){event.respondWith(networkFirst(request));return;}
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{
    if(response && response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}
    return response;
  })));
});
