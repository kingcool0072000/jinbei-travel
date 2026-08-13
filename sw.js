// ponytail: cache-first same-origin only; amap tiles/REST are cross-origin (need network), so offline = panels readable, map blank.
const CACHE = 'jinbei-travel-v5';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return; // 高德CDN/REST走网络，不缓存
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
    const cp = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, cp));
    return resp;
  }).catch(() => caches.match('./index.html'))));
});
