import React, { useState } from 'react';
import DemoModal from '../DemoModal';

const WebSerialDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [port, setPort] = useState<SerialPort | null>(null);
  const [received, setReceived] = useState('');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const connect = async () => {
    setError('');
    try {
      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate: 9600 });
      setPort(port);
      setIsConnected(true);
      const reader = port.readable.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) setReceived((prev) => prev + new TextDecoder().decode(value));
      }
      reader.releaseLock();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const send = async () => {
    if (!port) return;
    try {
      const writer = port.writable.getWriter();
      await writer.write(new TextEncoder().encode(input + '\n'));
      writer.releaseLock();
      setInput('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const disconnect = async () => {
    if (port) {
      await port.close();
      setPort(null);
      setIsConnected(false);
    }
  };

  const codeExample = `// 取得 Serial Port
const port = await navigator.serial.requestPort();
await port.open({ baudRate: 9600 });

// 寫入資料
const writer = port.writable.getWriter();
await writer.write(new TextEncoder().encode('Hello\n'));
writer.releaseLock();

// 讀取資料
const reader = port.readable.getReader();
const { value, done } = await reader.read();
console.log(new TextDecoder().decode(value));
reader.releaseLock();`;

  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="Web Serial API 演示" description="Serial 串列埠通訊範例" codeExample={codeExample}>
      <div className="space-y-4">
        <button onClick={connect} disabled={isConnected} className="px-4 py-2 bg-blue-500 text-white rounded">連接裝置</button>
        <button onClick={disconnect} disabled={!isConnected} className="px-4 py-2 bg-gray-500 text-white rounded ml-2">斷開連接</button>
        <div>
          <input value={input} onChange={e => setInput(e.target.value)} className="border p-2 mr-2" placeholder="輸入要發送的資料" />
          <button onClick={send} disabled={!isConnected} className="px-4 py-2 bg-green-500 text-white rounded">發送</button>
        </div>
        <div className="bg-gray-100 p-2 rounded h-32 overflow-auto">{received || '尚未接收資料'}</div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="text-sm text-gray-600 mt-4">此 API 僅在支援的瀏覽器（如 Chrome）且 HTTPS 下可用。</div>
      </div>
    </DemoModal>
  );
};

export default WebSerialDemo; 