import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface ServiceWorkersDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ServiceWorkerInfo {
  status: string;
  state: string;
  scriptURL: string;
}

const ServiceWorkersDemo: React.FC<ServiceWorkersDemoProps> = ({ isOpen, onClose }) => {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [workerInfo, setWorkerInfo] = useState<ServiceWorkerInfo | null>(null);
  const [offlineStatus, setOfflineStatus] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      setMessage('Service Worker 可用');
    } else {
      setMessage('此瀏覽器不支援 Service Worker');
    }

    window.addEventListener('online', () => setOfflineStatus(false));
    window.addEventListener('offline', () => setOfflineStatus(true));

    return () => {
      window.removeEventListener('online', () => setOfflineStatus(false));
      window.removeEventListener('offline', () => setOfflineStatus(true));
    };
  }, []);

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        setRegistration(reg);
        setMessage('Service Worker 註冊成功');

        const worker = reg.active || reg.installing || reg.waiting;
        if (worker) {
          setWorkerInfo({
            status: worker.state,
            state: reg.active ? '活躍' : reg.installing ? '安裝中' : '等待中',
            scriptURL: worker.scriptURL
          });
        }
      } catch (error) {
        setMessage(`註冊失敗: ${error}`);
      }
    }
  };

  const unregisterServiceWorker = async () => {
    if (registration) {
      try {
        await registration.unregister();
        setRegistration(null);
        setWorkerInfo(null);
        setMessage('Service Worker 已註銷');
      } catch (error) {
        setMessage(`註銷失敗: ${error}`);
      }
    }
  };

  const codeExample = `// 註冊 Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker 註冊成功：', registration);
    })
    .catch(error => {
      console.log('Service Worker 註冊失敗：', error);
    });
}

// Service Worker 檔案 (sw.js)
const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Service Workers API 演示"
      description="展示如何使用 Service Workers 實現離線功能和快取管理。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Service Worker 狀態</h4>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">{message}</p>
            <p className="text-sm text-gray-600">
              網路狀態：{offlineStatus ? '離線' : '在線'}
            </p>
            {workerInfo && (
              <div className="text-sm text-gray-600">
                <p>狀態：{workerInfo.status}</p>
                <p>狀態描述：{workerInfo.state}</p>
                <p className="truncate">腳本位置：{workerInfo.scriptURL}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={registerServiceWorker}
            disabled={!!registration}
            className={`px-4 py-2 rounded-lg text-white ${
              registration ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            註冊 Service Worker
          </button>
          <button
            onClick={unregisterServiceWorker}
            disabled={!registration}
            className={`px-4 py-2 rounded-lg text-white ${
              !registration ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            註銷 Service Worker
          </button>
        </div>

        <div className="text-sm text-gray-600">
          <p>提示：</p>
          <ul className="list-disc list-inside">
            <li>註冊 Service Worker 後，可以嘗試切換網路狀態</li>
            <li>Service Worker 可以攔截網路請求並提供離線支援</li>
            <li>Service Worker 可以管理快取和推送通知</li>
            <li>Service Worker 需要在 HTTPS 或 localhost 環境下運行</li>
          </ul>
        </div>
      </div>
    </DemoModal>
  );
};

export default ServiceWorkersDemo; 