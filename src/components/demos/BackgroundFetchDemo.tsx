import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface BackgroundFetchDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FetchLog {
  timestamp: number;
  message: string;
  type: 'info' | 'error' | 'success';
}

const BackgroundFetchDemo: React.FC<BackgroundFetchDemoProps> = ({ isOpen, onClose }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [logs, setLogs] = useState<FetchLog[]>([]);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // 檢查瀏覽器是否支援 Background Fetch API
    const checkSupport = async () => {
      const supported = 'BackgroundFetchManager' in window && 'serviceWorker' in navigator;
      setIsSupported(supported);
    };
    checkSupport();
  }, []);

  const startBackgroundFetch = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // 開始下載大型檔案
      const fetch = await registration.backgroundFetch.fetch(
        'large-file-download',
        ['https://example.com/large-file.zip'],
        {
          title: '下載大型檔案',
          icons: [{
            sizes: '192x192',
            src: '/icon-192.png',
            type: 'image/png'
          }],
          downloadTotal: 100 * 1024 * 1024 // 假設檔案大小為 100MB
        }
      );

      setIsDownloading(true);
      addLog('開始背景下載', 'info');

      fetch.addEventListener('progress', () => {
        const progress = Math.round((fetch.downloaded / fetch.downloadTotal) * 100);
        setDownloadProgress(progress);
        addLog(`下載進度: ${progress}%`, 'info');
      });

      fetch.addEventListener('success', () => {
        setIsDownloading(false);
        setDownloadProgress(100);
        addLog('下載完成', 'success');
      });

      fetch.addEventListener('fail', () => {
        setIsDownloading(false);
        addLog('下載失敗', 'error');
      });
    } catch (err) {
      addLog('無法啟動背景下載', 'error');
      setIsDownloading(false);
    }
  };

  const addLog = (message: string, type: 'info' | 'error' | 'success') => {
    setLogs(prev => [{
      timestamp: Date.now(),
      message,
      type
    }, ...prev].slice(0, 5));
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const codeExample = `// 在 Service Worker 中註冊背景下載
self.addEventListener('backgroundfetchsuccess', (event) => {
  const bgFetch = event.registration;
  
  event.waitUntil(async function() {
    // 取得下載的檔案
    const records = await bgFetch.matchAll();
    const promises = records.map(async (record) => {
      const response = await record.responseReady;
      const cache = await caches.open(bgFetch.id);
      await cache.put(record.request, response);
    });
    
    await Promise.all(promises);
    
    // 顯示通知
    const title = '下載完成';
    const options = {
      body: \`\${bgFetch.id} 已完成下載\`,
      icon: '/icon.png'
    };
    
    self.registration.showNotification(title, options);
  }());
});

// 在主執行緒中啟動背景下載
const startBackgroundFetch = async () => {
  const registration = await navigator.serviceWorker.ready;
  const bgFetch = await registration.backgroundFetch.fetch(
    'my-fetch',
    ['https://example.com/large-file.zip'],
    {
      title: '下載大型檔案',
      icons: [{
        sizes: '192x192',
        src: '/icon-192.png',
        type: 'image/png'
      }],
      downloadTotal: 100 * 1024 * 1024
    }
  );
  
  bgFetch.addEventListener('progress', () => {
    const progress = Math.round(
      (bgFetch.downloaded / bgFetch.downloadTotal) * 100
    );
    console.log(\`下載進度: \${progress}%\`);
  });
};`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Background Fetch API 展示"
      description="此 API 允許在背景下載大型檔案，即使用戶離開網頁也能繼續下載。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        {!isSupported ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
            ⚠️ 您的瀏覽器不支援 Background Fetch API
          </div>
        ) : (
          <>
            <div className="flex space-x-2">
              <button
                onClick={startBackgroundFetch}
                disabled={isDownloading}
                className={`px-4 py-2 rounded ${
                  isDownloading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isDownloading ? '下載中...' : '開始背景下載'}
              </button>
            </div>

            {isDownloading && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-bold mb-2">下載進度：</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${downloadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {downloadProgress}% 完成
                </p>
              </div>
            )}

            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-bold mb-2">操作日誌：</h4>
              {logs.length === 0 ? (
                <p className="text-gray-500">尚無日誌</p>
              ) : (
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded ${
                        log.type === 'error'
                          ? 'bg-red-100'
                          : log.type === 'success'
                          ? 'bg-green-100'
                          : 'bg-white'
                      }`}
                    >
                      <span className="text-sm text-gray-500">
                        {formatTime(log.timestamp)}
                      </span>
                      <p
                        className={
                          log.type === 'error'
                            ? 'text-red-600'
                            : log.type === 'success'
                            ? 'text-green-600'
                            : ''
                        }
                      >
                        {log.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-sm text-gray-600">
              <p>* Background Fetch API 的應用場景：</p>
              <ul className="list-disc list-inside ml-4">
                <li>下載大型檔案</li>
                <li>離線播放清單同步</li>
                <li>遊戲資源預載</li>
                <li>影片下載</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg text-sm">
              <p>
                📝 提示：背景下載會在系統通知區域顯示進度，
                即使關閉瀏覽器也能繼續下載。下載完成後會收到通知。
              </p>
            </div>
          </>
        )}
      </div>
    </DemoModal>
  );
};

export default BackgroundFetchDemo; 