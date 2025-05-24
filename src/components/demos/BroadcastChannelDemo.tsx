import React, { useState, useEffect, useCallback } from 'react';
import DemoModal from '../DemoModal';

interface BroadcastChannelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  type: 'text' | 'notification';
  content: string;
  timestamp: number;
}

const BroadcastChannelDemo: React.FC<BroadcastChannelProps> = ({ isOpen, onClose }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState('');

  // 初始化 BroadcastChannel
  useEffect(() => {
    setIsSupported('BroadcastChannel' in window);

    if ('BroadcastChannel' in window) {
      const broadcastChannel = new BroadcastChannel('web_api_demo');
      setChannel(broadcastChannel);

      const handleMessage = (event: MessageEvent) => {
        const message: Message = event.data;
        setMessages(prev => [...prev, message].slice(-10)); // 只保留最近的10條消息
      };

      broadcastChannel.onmessage = handleMessage;
      broadcastChannel.onmessageerror = () => {
        setError('接收消息時發生錯誤');
      };

      // 發送通知告知新標籤頁已加入
      broadcastChannel.postMessage({
        type: 'notification',
        content: '新的標籤頁已連接',
        timestamp: Date.now()
      });

      return () => {
        broadcastChannel.close();
      };
    }
  }, []);

  // 發送消息
  const sendMessage = useCallback(() => {
    if (!channel || !message.trim()) return;

    try {
      const messageObj: Message = {
        type: 'text',
        content: message,
        timestamp: Date.now()
      };
      
      channel.postMessage(messageObj);
      setMessages(prev => [...prev, messageObj].slice(-10));
      setMessage('');
      setError('');
    } catch (err) {
      setError(`發送消息時發生錯誤：${err instanceof Error ? err.message : String(err)}`);
    }
  }, [channel, message]);

  // 格式化時間戳
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const codeExample = `
// 創建一個新的 BroadcastChannel
const channel = new BroadcastChannel('my_channel');

// 監聽消息
channel.onmessage = (event) => {
  console.log('收到消息：', event.data);
};

// 發送消息
channel.postMessage({
  type: 'text',
  content: '你好！',
  timestamp: Date.now()
});

// 關閉頻道
channel.close();
  `.trim();

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Broadcast Channel API 示範"
      description="展示如何使用 Broadcast Channel API 在不同標籤頁之間進行通訊。"
    >
      <div className="space-y-4">
        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="text-yellow-800">
            瀏覽器支援：{isSupported ? '✅ 支援' : '❌ 不支援'}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">發送消息</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="輸入要發送的消息"
                className="flex-1 p-2 border rounded-md"
                disabled={!isSupported}
              />
              <button
                onClick={sendMessage}
                disabled={!isSupported || !message.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                發送
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">消息記錄</h3>
            <div className="bg-gray-100 p-4 rounded-md space-y-2 max-h-[300px] overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center">
                  尚無消息。請在多個標籤頁中打開此示範並發送消息。
                </p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      msg.type === 'notification'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-white border'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium">
                        {msg.type === 'notification' ? '系統通知' : '消息'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">{msg.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <div className="mt-6">
          <p className="font-medium mb-2">使用範例：</p>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>{codeExample}</code>
          </pre>
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-800">
            提示：在多個標籤頁中打開此示範，並嘗試發送消息來觀察效果。
            所有連接到同一頻道的標籤頁都會收到消息。
          </p>
        </div>
      </div>
    </DemoModal>
  );
};

export default BroadcastChannelDemo; 