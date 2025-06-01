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

const WebPushDemo: React.FC<WebPushDemoProps> = ({ isOpen, onClose }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [logs, setLogs] = useState<PushLog[]>([]);

  useEffect(() => {
    // 檢查瀏覽器是否支援 Web Push API
    const checkSupport = () => {
      const supported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
      setIsSupported(supported);
    };
    checkSupport();
  }, []);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        addLog('已獲得通知權限', 'success');
        await subscribePush();
      } else {
        addLog('通知權限被拒絕', 'error');
      }
    } catch (err) {
      addLog('請求權限失敗', 'error');
    }
  };

  const subscribePush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'YOUR_PUBLIC_VAPID_KEY' // 需要替換為實際的 VAPID key
      });
      
      setSubscription(subscription);
      addLog('成功訂閱推送服務', 'success');
      
      // 在實際應用中，這裡會將訂閱資訊發送到伺服器
      console.log('Push Subscription:', subscription);
    } catch (err) {
      addLog('訂閱推送服務失敗', 'error');
    }
  };

  const unsubscribePush = async () => {
    if (subscription) {
      try {
        await subscription.unsubscribe();
        setSubscription(null);
        addLog('已取消訂閱推送服務', 'info');
      } catch (err) {
        addLog('取消訂閱失敗', 'error');
      }
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

  const codeExample = `// 請求通知權限並訂閱推送服務
const subscribePush = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'YOUR_PUBLIC_VAPID_KEY'
      });
      
      // 將訂閱資訊發送到伺服器
      await fetch('/api/push/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription)
      });
    }
  } catch (err) {
    console.error('訂閱推送服務失敗:', err);
  }
};

// 在 Service Worker 中處理推送事件
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icon.png',
    badge: '/badge.png'
  };
  
  event.waitUntil(
    self.registration.showNotification('推送通知', options)
  );
});`;

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
                onClick={requestPermission}
                disabled={!!subscription}
                className={`px-4 py-2 rounded ${
                  subscription
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {subscription ? '已訂閱推送服務' : '訂閱推送服務'}
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

            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-bold mb-2">訂閱狀態：</h4>
              <p>
                {subscription
                  ? '✅ 已訂閱推送服務'
                  : '❌ 尚未訂閱推送服務'}
              </p>
            </div>

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
                <li>新訊息提醒</li>
                <li>系統公告</li>
                <li>社交互動通知</li>
                <li>重要更新提示</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </DemoModal>
  );
};

export default WebPushDemo; 