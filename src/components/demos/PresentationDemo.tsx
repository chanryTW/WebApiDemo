import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface PresentationDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PresentationLog {
  timestamp: number;
  message: string;
  type: 'info' | 'error' | 'success';
}

// 添加型別定義
declare global {
  interface Window {
    PresentationRequest: typeof PresentationRequest;
  }
  interface PresentationRequest {
    new(urls: string[]): PresentationRequest;
    start(): Promise<PresentationConnection>;
  }
  interface PresentationConnection {
    addEventListener(type: string, listener: (event: any) => void): void;
    removeEventListener(type: string, listener: (event: any) => void): void;
    terminate(): void;
    send(data: string): void;
  }
}

const PresentationDemo: React.FC<PresentationDemoProps> = ({ isOpen, onClose }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [logs, setLogs] = useState<PresentationLog[]>([]);
  const [connection, setConnection] = useState<PresentationConnection | null>(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 3;

  useEffect(() => {
    // 檢查瀏覽器是否支援 Presentation API
    setIsSupported('PresentationRequest' in window);
  }, []);

  const startPresentation = async () => {
    try {
      const request = new PresentationRequest(['presentation.html']);
      const presentationConnection = await request.start();
      setConnection(presentationConnection);
      
      presentationConnection.addEventListener('connect', () => {
        addLog('簡報已開始', 'success');
        sendSlideContent(1);
      });

      presentationConnection.addEventListener('close', () => {
        addLog('簡報已結束', 'info');
        setConnection(null);
      });

      presentationConnection.addEventListener('terminate', () => {
        addLog('簡報已終止', 'info');
        setConnection(null);
      });

      presentationConnection.addEventListener('message', (event: MessageEvent) => {
        addLog(`收到訊息: ${event.data}`, 'info');
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      addLog(`無法啟動簡報: ${errorMessage}`, 'error');
    }
  };

  const stopPresentation = () => {
    if (connection) {
      connection.terminate();
      setConnection(null);
      addLog('已停止簡報', 'info');
    }
  };

  const nextSlide = () => {
    if (currentSlide < totalSlides) {
      setCurrentSlide(prev => {
        const next = prev + 1;
        sendSlideContent(next);
        return next;
      });
    }
  };

  const previousSlide = () => {
    if (currentSlide > 1) {
      setCurrentSlide(prev => {
        const next = prev - 1;
        sendSlideContent(next);
        return next;
      });
    }
  };

  const sendSlideContent = (slideNumber: number) => {
    if (!connection) return;

    try {
      const content = {
        type: 'slide',
        number: slideNumber,
        content: `這是第 ${slideNumber} 張投影片的內容`
      };
      connection.send(JSON.stringify(content));
      addLog(`已切換到第 ${slideNumber} 張投影片`, 'success');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      addLog(`發送投影片內容失敗: ${errorMessage}`, 'error');
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

  const codeExample = `// 建立簡報請求
const request = new PresentationRequest(['presentation.html']);

// 開始簡報
const connection = await request.start();

// 監聽連接事件
connection.addEventListener('connect', () => {
  console.log('簡報已開始');
});

// 監聽關閉事件
connection.addEventListener('close', () => {
  console.log('簡報已結束');
});

// 發送訊息到簡報顯示器
connection.send(JSON.stringify({
  type: 'slide',
  number: 1,
  content: '投影片內容'
}));

// 接收來自簡報顯示器的訊息
connection.addEventListener('message', (event) => {
  console.log('收到訊息:', event.data);
});

// 結束簡報
connection.terminate();`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Presentation API 展示"
      description="此 API 允許網頁內容在第二顯示器上進行簡報展示。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        {!isSupported ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
            ⚠️ 您的瀏覽器不支援 Presentation API
          </div>
        ) : (
          <>
            <div className="flex space-x-2">
              <button
                onClick={startPresentation}
                disabled={!!connection}
                className={`px-4 py-2 rounded ${
                  connection
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {connection ? '簡報進行中' : '開始簡報'}
              </button>
              <button
                onClick={stopPresentation}
                disabled={!connection}
                className={`px-4 py-2 rounded ${
                  !connection
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                停止簡報
              </button>
            </div>

            {connection && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-bold mb-2">投影片控制：</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={previousSlide}
                    disabled={currentSlide <= 1}
                    className={`px-4 py-2 rounded ${
                      currentSlide <= 1
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    上一頁
                  </button>
                  <span className="px-4 py-2">
                    {currentSlide} / {totalSlides}
                  </span>
                  <button
                    onClick={nextSlide}
                    disabled={currentSlide >= totalSlides}
                    className={`px-4 py-2 rounded ${
                      currentSlide >= totalSlides
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    下一頁
                  </button>
                </div>
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
              <p>* Presentation API 的應用場景：</p>
              <ul className="list-disc list-inside ml-4">
                <li>簡報展示</li>
                <li>多螢幕顯示</li>
                <li>數位看板</li>
                <li>遠端展示</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </DemoModal>
  );
};

export default PresentationDemo; 