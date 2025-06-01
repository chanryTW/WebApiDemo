import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface WakeLockDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WakeLockLog {
  timestamp: number;
  message: string;
  type: 'info' | 'error' | 'success';
}

const WakeLockDemo: React.FC<WakeLockDemoProps> = ({ isOpen, onClose }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [logs, setLogs] = useState<WakeLockLog[]>([]);

  useEffect(() => {
    // 檢查瀏覽器是否支援 Wake Lock API
    setIsSupported('wakeLock' in navigator);

    // 監聽螢幕喚醒狀態變化
    const handleVisibilityChange = async () => {
      if (wakeLock && document.visibilityState === 'visible') {
        try {
          await requestWakeLock();
        } catch (err) {
          addLog('重新請求喚醒鎖定失敗', 'error');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [wakeLock]);

  const requestWakeLock = async () => {
    try {
      const lock = await navigator.wakeLock.request('screen');
      setWakeLock(lock);
      addLog('成功獲取喚醒鎖定', 'success');

      lock.addEventListener('release', () => {
        setWakeLock(null);
        addLog('喚醒鎖定已釋放', 'info');
      });
    } catch (err) {
      addLog('請求喚醒鎖定失敗', 'error');
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLock) {
      try {
        await wakeLock.release();
        setWakeLock(null);
        addLog('已手動釋放喚醒鎖定', 'info');
      } catch (err) {
        addLog('釋放喚醒鎖定失敗', 'error');
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

  const codeExample = `// 請求螢幕喚醒鎖定
const requestWakeLock = async () => {
  try {
    const wakeLock = await navigator.wakeLock.request('screen');
    console.log('喚醒鎖定已啟用');

    wakeLock.addEventListener('release', () => {
      console.log('喚醒鎖定已釋放');
    });
  } catch (err) {
    console.error('無法請求喚醒鎖定:', err);
  }
};

// 釋放喚醒鎖定
const releaseWakeLock = async () => {
  if (wakeLock) {
    try {
      await wakeLock.release();
      console.log('喚醒鎖定已手動釋放');
    } catch (err) {
      console.error('釋放喚醒鎖定失敗:', err);
    }
  }
};`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Wake Lock API 展示"
      description="此 API 可以防止裝置進入休眠狀態，適用於需要持續顯示的應用場景。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        {!isSupported ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
            ⚠️ 您的瀏覽器不支援 Wake Lock API
          </div>
        ) : (
          <>
            <div className="flex space-x-2">
              <button
                onClick={requestWakeLock}
                disabled={!!wakeLock}
                className={`px-4 py-2 rounded ${
                  wakeLock
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {wakeLock ? '喚醒鎖定已啟用' : '請求喚醒鎖定'}
              </button>
              <button
                onClick={releaseWakeLock}
                disabled={!wakeLock}
                className={`px-4 py-2 rounded ${
                  !wakeLock
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                釋放喚醒鎖定
              </button>
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
              <p>* Wake Lock API 的應用場景：</p>
              <ul className="list-disc list-inside ml-4">
                <li>簡報播放</li>
                <li>遊戲進行中</li>
                <li>影片播放</li>
                <li>導航應用</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </DemoModal>
  );
};

export default WakeLockDemo; 