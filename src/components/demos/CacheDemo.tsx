import React, { useState } from 'react';
import DemoSection from '../DemoSection';

const CacheDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');

  const handleAdd = async () => {
    if ('caches' in window) {
      const cache = await caches.open('webapidemo');
      await cache.add(url);
      setStatus('已加入快取！');
    } else {
      setStatus('此瀏覽器不支援 Cache API');
    }
  };

  const handleMatch = async () => {
    if ('caches' in window) {
      const cache = await caches.open('webapidemo');
      const res = await cache.match(url);
      setStatus(res ? '已找到快取！' : '查無快取');
    } else {
      setStatus('此瀏覽器不支援 Cache API');
    }
  };

  return (
    <DemoSection title="Cache API" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-2">
        <input className="border px-2 py-1 rounded" value={url} onChange={e => setUrl(e.target.value)} placeholder="輸入網址" />
        <button className="ml-2 btn" onClick={handleAdd}>加入快取</button>
        <button className="ml-2 btn" onClick={handleMatch}>查詢快取</button>
        <div className="mt-2">{status}</div>
      </div>
    </DemoSection>
  );
};

export default CacheDemo; 