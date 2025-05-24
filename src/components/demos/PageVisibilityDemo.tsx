import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface PageVisibilityDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VisibilityEvent {
  timestamp: number;
  state: 'visible' | 'hidden';
}

const PageVisibilityDemo: React.FC<PageVisibilityDemoProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [events, setEvents] = useState<VisibilityEvent[]>([]);
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const newState = !document.hidden;
      setIsVisible(newState);
      setEvents(prev => [
        {
          timestamp: Date.now(),
          state: newState ? 'visible' as const : 'hidden' as const
        },
        ...prev
      ].slice(0, 5));
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isVisible) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isVisible]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatSeconds = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const codeExample = `// 檢查頁面當前可見狀態
const isHidden = document.hidden;

// 監聽頁面可見性變化
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('頁面隱藏');
    // 暫停視訊播放、動畫等
  } else {
    console.log('頁面可見');
    // 恢復視訊播放、動畫等
  }
});`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Page Visibility API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-700">
            切換到其他分頁或最小化視窗，觀察頁面可見性狀態的變化
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`
            p-6 rounded-lg border-2 transition-colors duration-300
            ${isVisible 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
            }
          `}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-medium ${
                isVisible ? 'text-green-700' : 'text-yellow-700'
              }`}>
                當前狀態
              </h3>
              <span className={`
                px-3 py-1 rounded-full text-sm font-medium
                ${isVisible 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
                }
              `}>
                {isVisible ? '可見' : '隱藏'}
              </span>
            </div>

            <div className={`
              flex items-center gap-3 p-4 rounded-lg
              ${isVisible ? 'bg-green-100' : 'bg-yellow-100'}
            `}>
              <svg
                className={`h-8 w-8 ${isVisible ? 'text-green-500' : 'text-yellow-500'}`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                {isVisible ? (
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                ) : (
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                )}
              </svg>
              <div>
                <div className={`font-medium ${
                  isVisible ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  {isVisible ? '頁面可見中' : '頁面已隱藏'}
                </div>
                <div className={`text-sm ${
                  isVisible ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {isVisible 
                    ? '使用者正在查看此頁面' 
                    : '使用者切換到其他分頁或最小化視窗'
                  }
                </div>
              </div>
            </div>

            {isVisible && (
              <div className="mt-4 text-center">
                <div className="text-sm text-green-600">可見時間</div>
                <div className="text-2xl font-bold text-green-700">
                  {formatSeconds(timer)}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              狀態變更記錄
            </h3>
            <div className="space-y-3">
              {events.length === 0 ? (
                <div className="text-gray-500 text-center py-4">
                  尚無狀態變更記錄
                </div>
              ) : (
                events.map((event, index) => (
                  <div
                    key={index}
                    className={`
                      flex items-center justify-between p-3 rounded-lg
                      ${event.state === 'visible' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                      }
                    `}
                  >
                    <span className="font-medium">
                      {event.state === 'visible' ? '變為可見' : '變為隱藏'}
                    </span>
                    <span className="text-sm">
                      {formatTime(event.timestamp)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DemoModal>
  );
};

export default PageVisibilityDemo; 