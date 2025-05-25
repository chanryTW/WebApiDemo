import React, { useState, useRef } from 'react';
import DemoSection from '../DemoSection';

const EventSourceDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('https://stream.wikimedia.org/v2/stream/recentchange');
  const [log, setLog] = useState<string[]>([]);
  const es = useRef<EventSource | null>(null);

  const connect = () => {
    es.current = new window.EventSource(url);
    es.current.onopen = () => setLog(l => [...l, '已連線']);
    es.current.onmessage = e => setLog(l => [...l, '訊息: ' + e.data]);
    es.current.onerror = () => setLog(l => [...l, '連線錯誤']);
  };

  const close = () => {
    es.current?.close();
    setLog(l => [...l, '連線關閉']);
  };

  return (
    <DemoSection title="Server-Sent Events (EventSource)" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-2">
        <input className="border px-2 py-1 rounded" value={url} onChange={e => setUrl(e.target.value)} placeholder="SSE URL" />
        <button className="ml-2 btn" onClick={connect}>連線</button>
        <button className="ml-2 btn" onClick={close}>關閉</button>
        <div className="mt-2 h-32 overflow-y-auto bg-gray-100 p-2 rounded">
          {log.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>
    </DemoSection>
  );
};

export default EventSourceDemo; 