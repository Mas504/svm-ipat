const CACHE = 'svm-ipat-v085';
const FILES = ['./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install', event => {
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(url=>new Request(url,{cache:'reload'})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('svm-ipat-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
 const req=event.request, url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope)) return;
 if(req.mode==='navigate') {
 event.respondWith(fetch(req).then(response=>{if(!response.ok) throw Error('navigation failed'); return response;}).catch(()=>caches.open(CACHE).then(c=>c.match('./index.html'))));
 } else if(FILES.some(f=>new URL(f,self.registration.scope).href===url.href)) {
 event.respondWith(caches.open(CACHE).then(c=>c.match(req)).then(hit=>hit||fetch(req)));
 }
});
