import React, { useState } from 'react';
import DemoSection from '../DemoSection';

const XMLHttpRequestDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [result, setResult] = useState('');

  const handleRequest = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => setResult(xhr.responseText);
    xhr.onerror = () => setResult('請求失敗');
    xhr.send();
  };

  return (
    <DemoSection title="XMLHttpRequest API" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-2">
        <input className="border px-2 py-1 rounded" value={url} onChange={e => setUrl(e.target.value)} placeholder="API URL" />
        <button className="ml-2 btn" onClick={handleRequest}>送出請求</button>
        <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-x-auto">{result}</pre>
      </div>
    </DemoSection>
  );
};

export default XMLHttpRequestDemo; 