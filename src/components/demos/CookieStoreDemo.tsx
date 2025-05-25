import React, { useState } from 'react';
import DemoSection from '../DemoSection';

const CookieStoreDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');

  const handleSet = async () => {
    // @ts-ignore
    if ('cookieStore' in window) {
      // @ts-ignore
      await window.cookieStore.set(key, value);
      setResult('已設定 cookie');
    } else {
      setResult('此瀏覽器不支援 Cookie Store API');
    }
  };

  const handleGet = async () => {
    // @ts-ignore
    if ('cookieStore' in window) {
      // @ts-ignore
      const cookie = await window.cookieStore.get(key);
      setResult(cookie ? cookie.value : '查無 cookie');
    } else {
      setResult('此瀏覽器不支援 Cookie Store API');
    }
  };

  return (
    <DemoSection title="Cookie Store API" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-2">
        <input className="border px-2 py-1 rounded" value={key} onChange={e => setKey(e.target.value)} placeholder="Key" />
        <input className="border px-2 py-1 rounded ml-2" value={value} onChange={e => setValue(e.target.value)} placeholder="Value" />
        <button className="ml-2 btn" onClick={handleSet}>設定</button>
        <button className="ml-2 btn" onClick={handleGet}>查詢</button>
        <div className="mt-2">{result}</div>
      </div>
    </DemoSection>
  );
};

export default CookieStoreDemo; 