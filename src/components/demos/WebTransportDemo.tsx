import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface WebTransportDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TransportLog {
  timestamp: number;
  message: string;
  type: 'info' | 'error' | 'success';
}

const WebTransportDemo: React.FC<WebTransportDemoProps> = ({ isOpen, onClose }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [transport, setTransport] = useState<WebTransport | null>(null);
  const [logs, setLogs] = useState<TransportLog[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 檢查瀏覽器是否支援 WebTransport API
    setIsSupported('WebTransport' in window);
  }, []);

  const connectTransport = async () => {
    try {
      const url = 'https://example.com:4433/webtransport';
      const transport = new WebTransport(url);
      
      addLog('正在建立連接...', 'info');
      await transport.ready;
      addLog('連接已建立', 'success');
      
      setTransport(transport);

      transport.closed
        .then(() => {
          addLog('連接已關閉', 'info');
          setTransport(null);
        })
        .catch((err: unknown) => {
          const errorMessage = err instanceof Error ? err.message : '未知錯誤';
          addLog(`連接錯誤: ${errorMessage}`, 'error');
          setTransport(null);
        });

      // 設置數據接收處理
      receiveData(transport);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      addLog(`無法建立連接: ${errorMessage}`, 'error');
    }
  };

  const receiveData = async (transport: WebTransport) => {
    try {
      const reader = transport.datagrams.readable.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        const text = new TextDecoder().decode(value);
        addLog(`收到數據: ${text}`, 'info');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      addLog(`接收數據時發生錯誤: ${errorMessage}`, 'error');
    }
  };

  const sendMessage = async () => {
    if (!transport || !message.trim()) return;

    try {
      const writer = transport.datagrams.writable.getWriter();
      const data = new TextEncoder().encode(message);
      await writer.write(data);
      writer.releaseLock();
      
      addLog(`已發送訊息: ${message}`, 'success');
      setMessage('');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      addLog(`發送訊息失敗: ${errorMessage}`, 'error');
    }
  };

  const disconnectTransport = async () => {
    if (transport) {
      try {
        await transport.close();
        addLog('已斷開連接', 'info');
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : '未知錯誤';
        addLog(`斷開連接時發生錯誤: ${errorMessage}`, 'error');
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

  const codeExample = `// 建立 WebTransport 連接
const transport = new WebTransport('https://example.com:4433/webtransport');

// 等待連接就緒
await transport.ready;
console.log('連接已建立');

// 監聽連接狀態
transport.closed.then(() => {
  console.log('連接已關閉');
}).catch((error) => {
  console.error('連接錯誤:', error);
});

// 發送數據
const writer = transport.datagrams.writable.getWriter();
const data = new TextEncoder().encode('Hello WebTransport!');
await writer.write(data);
writer.releaseLock();

// 接收數據
const reader = transport.datagrams.readable.getReader();
while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  const text = new TextDecoder().decode(value);
  console.log('收到數據:', text);
}

// 關閉連接
await transport.close();`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="WebTransport API 展示"
      description="此 API 提供了一個基於 HTTP/3 的雙向通訊協議，支援可靠和不可靠的數據傳輸。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        {!isSupported ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
            ⚠️ 您的瀏覽器不支援 WebTransport API
          </div>
        ) : (
          <>
            <div className="flex space-x-2">
              <button
                onClick={connectTransport}
                disabled={!!transport}
                className={`px-4 py-2 rounded ${
                  transport
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {transport ? '已連接' : '建立連接'}
              </button>
              <button
                onClick={disconnectTransport}
                disabled={!transport}
                className={`px-4 py-2 rounded ${
                  !transport
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                斷開連接
              </button>
            </div>

            {transport && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="輸入要發送的訊息..."
                  className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className={`px-4 py-2 rounded ${
                    !message.trim()
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  發送
                </button>
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
              <p>* WebTransport API 的應用場景：</p>
              <ul className="list-disc list-inside ml-4">
                <li>即時遊戲</li>
                <li>視訊串流</li>
                <li>即時數據傳輸</li>
                <li>大型檔案傳輸</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </DemoModal>
  );
};

export default WebTransportDemo; 