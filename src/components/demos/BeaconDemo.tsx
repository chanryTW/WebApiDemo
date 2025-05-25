import React, { useState } from 'react';
import DemoSection from '../DemoSection';

const BeaconDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('https://httpbin.org/post');
  const [status, setStatus] = useState('');

  const handleSend = () => {
    if ('sendBeacon' in navigator) {
      const ok = navigator.sendBeacon(url, 'Web API Demo 測試資料');
      setStatus(ok ? '已送出 Beacon！' : '送出失敗');
    } else {
      setStatus('此瀏覽器不支援 Beacon API');
    }
  };

  return (
    <DemoSection title="Beacon API" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-2">
        <input className="border px-2 py-1 rounded" value={url} onChange={e => setUrl(e.target.value)} placeholder="API URL" />
        <button className="ml-2 btn" onClick={handleSend}>送出 Beacon</button>
        <div className="mt-2">{status}</div>
      </div>
    </DemoSection>
  );
};

export default BeaconDemo; 