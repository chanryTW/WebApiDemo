// 安裝 Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker 已安裝');
});

// 啟動 Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker 已啟動');
});

// 處理推送事件
self.addEventListener('push', (event) => {
  try {
    const data = event.data.json();
    const options = {
      body: data.body || '新通知',
      icon: data.icon || '/icon.png',
      badge: data.badge || '/badge.png',
      data: data.data || {},
      actions: data.actions || [],
      tag: data.tag || 'default',
      renotify: data.renotify || false,
      requireInteraction: data.requireInteraction || false,
      silent: data.silent || false,
      timestamp: data.timestamp || Date.now()
    };

    event.waitUntil(
      self.registration.showNotification(data.title || '推送通知', options)
    );
  } catch (err) {
    console.error('處理推送通知時發生錯誤:', err);
    
    // 如果無法解析 JSON，則顯示純文字通知
    const text = event.data ? event.data.text() : '收到新通知';
    event.waitUntil(
      self.registration.showNotification('推送通知', {
        body: text,
        icon: '/icon.png',
        badge: '/badge.png'
      })
    );
  }
});

// 處理通知點擊事件
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // 如果通知中包含 URL，則開啟該 URL
  const url = event.notification.data.url;
  if (url) {
    event.waitUntil(
      clients.openWindow(url)
    );
  } else {
    // 否則開啟應用程式主頁
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((windowClients) => {
        // 如果已有開啟的視窗，則切換到該視窗
        for (let client of windowClients) {
          if (client.url && 'focus' in client) {
            return client.focus();
          }
        }
        // 如果沒有開啟的視窗，則開啟新視窗
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
}); 