const CACHE='pm-shell-v80';
const SHELL=[
  './',
  './index.html',
  './yonetimindex.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(c=>c.addAll(SHELL))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(
        keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
      ))
      .then(()=>self.clients.claim())
  );
});

async function staleWhileRevalidate(req,fallback){
  const cache=await caches.open(CACHE);
  const cached=await cache.match(req);

  const network=fetch(req,{cache:'no-cache'})
    .then(res=>{
      if(res&&res.ok)cache.put(req,res.clone());
      return res;
    })
    .catch(()=>null);

  if(cached){
    network.catch(()=>{});
    return cached;
  }

  const res=await network;
  if(res)return res;

  return fallback?cache.match(fallback):Response.error();
}

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;

  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;

  if(req.mode==='navigate'){
    event.respondWith(
      staleWhileRevalidate(
        req,
        url.pathname.toLowerCase().includes('yonetimindex')
          ?'./yonetimindex.html'
          :'./index.html'
      )
    );
    return;
  }

  event.respondWith(staleWhileRevalidate(req));
});
