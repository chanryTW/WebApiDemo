import React, { useState } from 'react';
import DemoSection from '../DemoSection';

const KEY = 'webapidemo-session-key';

const SessionStorageDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [value, setValue] = useState('');
  const [stored, setStored] = useState(() => sessionStorage.getItem(KEY) || '');

  const handleSave = () => {
    sessionStorage.setItem(KEY, value);
    setStored(value);
  };

  const handleClear = () => {
    sessionStorage.removeItem(KEY);
    setStored('');
  };

  return (
    <DemoSection title="Session Storage API" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-2">
        <input
          className="border px-2 py-1 rounded"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="輸入要儲存的值"
        />
        <button className="ml-2 btn" onClick={handleSave}>儲存</button>
        <button className="ml-2 btn" onClick={handleClear}>清除</button>
        <div className="mt-2">目前 sessionStorage: <span className="font-mono">{stored}</span></div>
      </div>
    </DemoSection>
  );
};

export default SessionStorageDemo; 