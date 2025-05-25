import React, { useState } from 'react';
import DemoSection from '../DemoSection';

const DB_NAME = 'webapidemo-indexeddb';
const STORE_NAME = 'kv';

function openDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function setItem(key: string, value: string) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put(value, key);
  return tx.complete;
}

async function getItem(key: string) {
  const db = await openDB();
  return new Promise<string | null>((resolve, reject) => {
    const req = db.transaction(STORE_NAME).objectStore(STORE_NAME).get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

const IndexedDBDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');

  const handleSave = async () => {
    await setItem(key, value);
    setResult('已儲存！');
  };

  const handleRead = async () => {
    const val = await getItem(key);
    setResult(val ?? '查無資料');
  };

  return (
    <DemoSection title="IndexedDB API" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-2">
        <input className="border px-2 py-1 rounded" value={key} onChange={e => setKey(e.target.value)} placeholder="Key" />
        <input className="border px-2 py-1 rounded ml-2" value={value} onChange={e => setValue(e.target.value)} placeholder="Value" />
        <button className="ml-2 btn" onClick={handleSave}>儲存</button>
        <button className="ml-2 btn" onClick={handleRead}>讀取</button>
        <div className="mt-2">{result}</div>
      </div>
    </DemoSection>
  );
};

export default IndexedDBDemo; 