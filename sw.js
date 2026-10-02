const CACHE='pm-pwa-v10';
const ASSETS=['./','./index.html','./config.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./logopaymer.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(async c=>{for(const a of ASSETS){try{await c.add(a)}catch(_){}}}).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const x=r.clone();caches.open(CACHE).then(c=>c.put(e.request,x));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));});

self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting()});
