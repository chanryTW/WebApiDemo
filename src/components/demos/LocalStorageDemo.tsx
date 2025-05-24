import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface LocalStorageDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const LocalStorageDemo: React.FC<LocalStorageDemoProps> = ({ isOpen, onClose }) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [items, setItems] = useState<{ key: string; value: string }[]>([]);

  useEffect(() => {
    updateItemsList();
  }, []);

  const updateItemsList = () => {
    const newItems = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        newItems.push({
          key,
          value: localStorage.getItem(key) || ''
        });
      }
    }
    setItems(newItems);
  };

  const handleSave = () => {
    if (key && value) {
      localStorage.setItem(key, value);
      setKey('');
      setValue('');
      updateItemsList();
    }
  };

  const handleDelete = (key: string) => {
    localStorage.removeItem(key);
    updateItemsList();
  };

  const handleClear = () => {
    localStorage.clear();
    updateItemsList();
  };

  const codeExample = `// 儲存資料
localStorage.setItem('key', 'value');

// 讀取資料
const value = localStorage.getItem('key');

// 刪除特定項目
localStorage.removeItem('key');

// 清除所有資料
localStorage.clear();

// 取得所有鍵值
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
}`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Local Storage API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="輸入鍵名"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="輸入值"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={!key || !value}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            儲存
          </button>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h5 className="font-semibold text-gray-900">已儲存的項目</h5>
            <button
              onClick={handleClear}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              清除全部
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
            {items.map((item) => (
              <div key={item.key} className="p-3 flex justify-between items-center bg-white">
                <div>
                  <div className="font-medium text-gray-900">{item.key}</div>
                  <div className="text-sm text-gray-600">{item.value}</div>
                </div>
                <button
                  onClick={() => handleDelete(item.key)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  刪除
                </button>
              </div>
            ))}
            {items.length === 0 && (
              <div className="p-3 text-center text-gray-500 bg-gray-50">
                尚無儲存的項目
              </div>
            )}
          </div>
        </div>
      </div>
    </DemoModal>
  );
};

export default LocalStorageDemo; 