import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface WebLocksProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Lock {
  name: string;
  mode: 'exclusive' | 'shared';
  clientId: string;
}

interface LockManager {
  request: (name: string, options: LockOptions, callback: (lock: Lock | null) => Promise<void>) => Promise<void>;
  query: () => Promise<{ held: Lock[]; pending: Lock[] }>;
}

interface LockOptions {
  mode?: 'exclusive' | 'shared';
  ifAvailable?: boolean;
  steal?: boolean;
  timeout?: number;
}

declare global {
  interface Navigator {
    locks: LockManager;
  }
}

const WebLocksDemo: React.FC<WebLocksProps> = ({ isOpen, onClose }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [lockStatus, setLockStatus] = useState<string>('未鎖定');
  const [error, setError] = useState<string>('');
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    // 檢查瀏覽器是否支援 Web Locks API
    setIsSupported('locks' in navigator);
  }, []);

  const acquireLock = async () => {
    if (!isSupported) return;

    try {
      await navigator.locks.request('my_resource', { timeout: 5000 }, async (lock: Lock | null) => {
        if (lock) {
          setLockStatus('已獲得鎖');
          setCounter(prev => prev + 1);
          
          // 模擬一些需要鎖保護的操作
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          setLockStatus('未鎖定');
        } else {
          setError('無法獲得鎖（超時）');
        }
      });
    } catch (err) {
      setError(`錯誤：${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const queryLocks = async () => {
    if (!isSupported) return;

    try {
      const locks = await navigator.locks.query();
      console.log('當前鎖狀態：', locks);
    } catch (err) {
      setError(`錯誤：${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const codeExample = `
// 請求一個鎖
await navigator.locks.request('my_resource', async lock => {
  if (lock) {
    // 在這裡執行需要鎖保護的操作
    await performSensitiveOperation();
  }
});

// 查詢當前鎖的狀態
const lockState = await navigator.locks.query();
console.log(lockState);
  `.trim();

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Web Locks API 示範"
      description="展示如何使用 Web Locks API 來協調多個標籤頁或工作者之間的資源訪問。"
    >
      <div className="space-y-4">
        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="text-yellow-800">
            瀏覽器支援：{isSupported ? '✅ 支援' : '❌ 不支援'}
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-medium">當前狀態：</p>
          <p>鎖定狀態：{lockStatus}</p>
          <p>操作次數：{counter}</p>
          {error && (
            <p className="text-red-500">{error}</p>
          )}
        </div>

        <div className="space-x-4">
          <button
            onClick={acquireLock}
            disabled={!isSupported}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            請求鎖
          </button>
          <button
            onClick={queryLocks}
            disabled={!isSupported}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          >
            查詢鎖狀態
          </button>
        </div>

        <div className="mt-6">
          <p className="font-medium mb-2">使用範例：</p>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>{codeExample}</code>
          </pre>
        </div>

        <div className="bg-blue-50 p-4 rounded-md mt-4">
          <p className="text-sm text-blue-800">
            提示：在多個標籤頁中打開此示範，嘗試同時請求鎖來觀察效果。
            鎖會在 2 秒後自動釋放。
          </p>
        </div>
      </div>
    </DemoModal>
  );
};

export default WebLocksDemo; 