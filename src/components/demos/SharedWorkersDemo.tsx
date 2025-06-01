import React, { useState, useEffect, useRef } from 'react';
import DemoModal from '../DemoModal';

interface SharedWorkersDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WorkerMessage {
  timestamp: number;
  message: string;
  type: 'sent' | 'received';
}

const SharedWorkersDemo: React.FC<SharedWorkersDemoProps> = ({ isOpen, onClose }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [messages, setMessages] = useState<WorkerMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const workerRef = useRef<SharedWorker | null>(null);

  useEffect(() => {
    // 檢查瀏覽器是否支援 Shared Workers
    setIsSupported('SharedWorker' in window);

    if ('SharedWorker' in window) {
      // 建立 Shared Worker 實例
      workerRef.current = new SharedWorker('/workers/shared-worker.js', { name: 'message-worker' });

      // 設定訊息處理器
      workerRef.current.port.onmessage = (event) => {
        const receivedMessage = event.data;
        addMessage(receivedMessage, 'received');
      };

      // 啟動通訊埠
      workerRef.current.port.start();

      return () => {
        if (workerRef.current) {
          workerRef.current.port.close();
        }
      };
    }
  }, []);

  const sendMessage = () => {
    if (workerRef.current && inputMessage.trim()) {
      workerRef.current.port.postMessage(inputMessage);
      addMessage(inputMessage, 'sent');
      setInputMessage('');
    }
  };

  const addMessage = (message: string, type: 'sent' | 'received') => {
    setMessages(prev => [{
      timestamp: Date.now(),
      message,
      type
    }, ...prev].slice(0, 10));
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const codeExample = `// 建立 Shared Worker
const worker = new SharedWorker('/workers/shared-worker.js', {
  name: 'message-worker'
});

// 設定訊息處理器
worker.port.onmessage = (event) => {
  console.log('收到訊息:', event.data);
};

// 啟動通訊埠
worker.port.start();

// 發送訊息
worker.port.postMessage('Hello from the main thread!');

// shared-worker.js
const connections = new Set();

self.onconnect = (event) => {
  const port = event.ports[0];
  connections.add(port);
  
  port.onmessage = (e) => {
    // 廣播訊息給所有連接的頁面
    connections.forEach((connection) => {
      if (connection !== port) {
        connection.postMessage(e.data);
      }
    });
  };
  
  port.start();
};`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Shared Workers API 展示"
      description="此 API 允許多個瀏覽器視窗、標籤頁或 iframe 共享同一個 Worker，實現跨頁面通訊。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        {!isSupported ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
            ⚠️ 您的瀏覽器不支援 Shared Workers API
          </div>
        ) : (
          <>
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="輸入訊息..."
                className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim()}
                className={`px-4 py-2 rounded ${
                  !inputMessage.trim()
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                發送
              </button>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-bold mb-2">訊息記錄：</h4>
              {messages.length === 0 ? (
                <p className="text-gray-500">尚無訊息</p>
              ) : (
                <div className="space-y-2">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded ${
                        msg.type === 'sent'
                          ? 'bg-blue-100 ml-8'
                          : 'bg-white mr-8'
                      }`}
                    >
                      <span className="text-sm text-gray-500">
                        {formatTime(msg.timestamp)}
                      </span>
                      <p className={msg.type === 'sent' ? 'text-blue-600' : ''}>
                        {msg.type === 'sent' ? '已發送: ' : '已收到: '}
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-sm text-gray-600">
              <p>* Shared Workers API 的應用場景：</p>
              <ul className="list-disc list-inside ml-4">
                <li>跨頁面即時通訊</li>
                <li>資料同步</li>
                <li>共享計算資源</li>
                <li>狀態管理</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg text-sm">
              <p>
                📝 提示：請開啟多個瀏覽器視窗或標籤頁來測試跨頁面通訊功能。
                每個頁面發送的訊息都會被其他頁面接收到。
              </p>
            </div>
          </>
        )}
      </div>
    </DemoModal>
  );
};

export default SharedWorkersDemo; 