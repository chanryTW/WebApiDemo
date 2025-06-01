import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface BackgroundSyncDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SyncLog {
  timestamp: number;
  status: string;
  message: string;
}

const BackgroundSyncDemo: React.FC<BackgroundSyncDemoProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // 檢查瀏覽器是否支援 Background Sync API
    const checkSupport = async () => {
      const supported = 'serviceWorker' in navigator && 'sync' in (await navigator.serviceWorker.ready);
      setIsSupported(supported);
    };
    checkSupport();
  }, []);

  const registerSync = async () => {
    try {
      // 確保 Service Worker 已註冊
      const registration = await navigator.serviceWorker.ready;
      
      // 註冊同步任務
      await registration.sync.register('example-sync');
      
      setIsRegistered(true);
      addLog('已註冊同步任務');
    } catch (error) {
      addLog('註冊同步任務失敗', 'error');
    }
  };

  const addLog = (message: string, status: string = 'info') => {
    setLogs(prev => [{
      timestamp: Date.now(),
      status,
      message
    }, ...prev].slice(0, 5));
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const codeExample = `// 在 Service Worker 中處理同步事件
self.addEventListener('sync', (event) => {
  if (event.tag === 'example-sync') {
    event.waitUntil(
      // 執行同步任務，例如發送暫存的資料
      syncData()
    );
  }
});

// 註冊同步任務
if ('serviceWorker' in navigator && 'sync' in registration) {
  navigator.serviceWorker.ready.then((registration) => {
    registration.sync.register('example-sync');
  });
}`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Background Sync API 展示"
      description="此 API 允許在網路連線恢復時執行延遲的資料同步任務。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        {!isSupported ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
            ⚠️ 您的瀏覽器不支援 Background Sync API
          </div>
        ) : (
          <>
            <div className="flex space-x-2">
              <button
                onClick={registerSync}
                disabled={isRegistered}
                className={`px-4 py-2 rounded ${
                  isRegistered
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isRegistered ? '已註冊同步任務' : '註冊同步任務'}
              </button>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-bold mb-2">同步任務日誌：</h4>
              {logs.length === 0 ? (
                <p className="text-gray-500">尚無日誌</p>
              ) : (
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded ${
                        log.status === 'error' ? 'bg-red-100' : 'bg-white'
                      }`}
                    >
                      <span className="text-sm text-gray-500">
                        {formatTime(log.timestamp)}
                      </span>
                      <p className={log.status === 'error' ? 'text-red-600' : ''}>
                        {log.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-sm text-gray-600">
              <p>* Background Sync API 的應用場景：</p>
              <ul className="list-disc list-inside ml-4">
                <li>離線表單提交</li>
                <li>延遲資料上傳</li>
                <li>離線訊息發送</li>
                <li>資料自動同步</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </DemoModal>
  );
};

export default BackgroundSyncDemo; 