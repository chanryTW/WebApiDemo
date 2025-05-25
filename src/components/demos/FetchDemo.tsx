import React, { useState } from 'react';
import DemoSection from '../DemoSection';

const FetchDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [result, setResult] = useState('');

  const handleFetch = async () => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setResult('Fetch 失敗: ' + e);
    }
  };

  return (
    <DemoSection title="Fetch API" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-2">
        <input className="border px-2 py-1 rounded" value={url} onChange={e => setUrl(e.target.value)} placeholder="API URL" />
        <button className="ml-2 btn" onClick={handleFetch}>Fetch</button>
        <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-x-auto">{result}</pre>
      </div>
    </DemoSection>
  );
};

export default FetchDemo; 