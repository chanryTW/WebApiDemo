const CACHE_NAME = 'web-api-demo-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo.svg'
];

// 安裝 Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('快取已開啟');
        return cache.addAll(urlsToCache);
      })
  );
});

// 啟動 Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('移除舊的快取：', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 攔截網路請求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果在快取中找到回應，則返回快取的回應
        if (response) {
          return response;
        }

        // 複製請求，因為請求是一個流，只能使用一次
        const fetchRequest = event.request.clone();

        // 嘗試從網路獲取回應
        return fetch(fetchRequest).then(
          response => {
            // 檢查回應是否有效
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 複製回應，因為回應是一個流，只能使用一次
            const responseToCache = response.clone();

            // 將回應加入快取
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
}); 