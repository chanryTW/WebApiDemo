import React, { useState, useRef } from 'react';
import DemoSection from '../DemoSection';

const WS_URL = 'wss://echo.websocket.org';

const WebSocketDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [msg, setMsg] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const ws = useRef<WebSocket | null>(null);

  const connect = () => {
    ws.current = new window.WebSocket(WS_URL);
    ws.current.onopen = () => setLog(l => [...l, '已連線']);
    ws.current.onmessage = e => setLog(l => [...l, '收到訊息: ' + e.data]);
    ws.current.onclose = () => setLog(l => [...l, '連線關閉']);
  };

  const send = () => {
    ws.current?.send(msg);
    setLog(l => [...l, '送出: ' + msg]);
  };

  const close = () => {
    ws.current?.close();
  };

  return (
    <DemoSection title="WebSocket API" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-2">
        <button className="btn" onClick={connect}>連線</button>
        <button className="btn ml-2" onClick={close}>關閉</button>
        <input className="border px-2 py-1 rounded ml-2" value={msg} onChange={e => setMsg(e.target.value)} placeholder="訊息" />
        <button className="ml-2 btn" onClick={send}>送出</button>
        <div className="mt-2 h-32 overflow-y-auto bg-gray-100 p-2 rounded">
          {log.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>
    </DemoSection>
  );
};

export default WebSocketDemo; 