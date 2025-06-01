import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface WebPushDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PushLog {
  timestamp: number;
  message: string;
  type: 'info' | 'error' | 'success';
}

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

const WebPushDemo: React.FC<WebPushDemoProps> = ({ isOpen, onClose }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [logs, setLogs] = useState<PushLog[]>([]);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    // 檢查瀏覽器是否支援 Web Push API
    setIsSupported(
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window
    );
  }, []);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        addLog('已獲得通知權限', 'success');
        return true;
      } else {
        addLog('未獲得通知權限', 'error');
        return false;
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      addLog(`請求權限失敗: ${errorMessage}`, 'error');
      return false;
    }
  };

  const subscribePush = async () => {
    try {
      // 請求通知權限
      const hasPermission = await requestPermission();
      if (!hasPermission) return;

      // 註冊 Service Worker
      const registration = await navigator.serviceWorker.register('/push-worker.js');
      
      // 訂閱推送服務
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'YOUR_PUBLIC_VAPID_KEY' // 需要替換為實際的 VAPID 公鑰
      });

      // 儲存訂閱資訊
      const subscriptionJson = pushSubscription.toJSON();
      setSubscription(subscriptionJson as PushSubscription);
      addLog('已訂閱推送服務', 'success');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      addLog(`訂閱推送服務失敗: ${errorMessage}`, 'error');
    }
  };

  const unsubscribePush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);
        addLog('已取消訂閱推送服務', 'success');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      addLog(`取消訂閱失敗: ${errorMessage}`, 'error');
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

  const codeExample = `// 註冊 Service Worker
const registration = await navigator.serviceWorker.register('/push-worker.js');

// 請求通知權限
const permission = await Notification.requestPermission();

// 訂閱推送服務
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: 'YOUR_PUBLIC_VAPID_KEY'
});

// Service Worker 中處理推送事件
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icon.png',
    badge: '/badge.png'
  };
  
  event.waitUntil(
    self.registration.showNotification('推送通知', options)
  );
});

// 取消訂閱
const subscription = await registration.pushManager.getSubscription();
if (subscription) {
  await subscription.unsubscribe();
}`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Web Push API 展示"
      description="此 API 允許網頁應用程式接收推送通知，即使用戶未開啟網頁也能收到通知。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        {!isSupported ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
            ⚠️ 您的瀏覽器不支援 Web Push API
          </div>
        ) : (
          <>
            <div className="flex space-x-2">
              <button
                onClick={subscribePush}
                disabled={!!subscription}
                className={`px-4 py-2 rounded ${
                  subscription
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {subscription ? '已訂閱' : '訂閱推送'}
              </button>
              <button
                onClick={unsubscribePush}
                disabled={!subscription}
                className={`px-4 py-2 rounded ${
                  !subscription
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                取消訂閱
              </button>
            </div>

            {subscription && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-bold mb-2">訂閱資訊：</h4>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(subscription, null, 2)}
                </pre>
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
              <p>* Web Push API 的應用場景：</p>
              <ul className="list-disc list-inside ml-4">
                <li>即時通知</li>
                <li>社交媒體更新</li>
                <li>新聞推送</li>
                <li>系統公告</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </DemoModal>
  );
};

export default WebPushDemo; 