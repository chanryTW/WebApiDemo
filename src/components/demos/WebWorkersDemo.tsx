import React, { useState, useRef, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface WebWorkersDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WorkerResult {
  n: number;
  result: number;
  duration: number;
}

const WebWorkersDemo: React.FC<WebWorkersDemoProps> = ({ isOpen, onClose }) => {
  const [number, setNumber] = useState(35);
  const [calculating, setCalculating] = useState(false);
  const [results, setResults] = useState<WorkerResult[]>([]);
  const [error, setError] = useState<string>('');
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const calculateWithoutWorker = () => {
    const fibonacci = (n: number): number => {
      if (n <= 1) return n;
      return fibonacci(n - 1) + fibonacci(n - 2);
    };

    const startTime = performance.now();
    const result = fibonacci(number);
    const endTime = performance.now();
    const duration = endTime - startTime;

    setResults(prev => [{
      n: number,
      result,
      duration
    }, ...prev].slice(0, 5));
  };

  const calculateWithWorker = () => {
    try {
      setCalculating(true);
      setError('');

      // 創建新的 Worker
      if (!workerRef.current) {
        workerRef.current = new Worker(
          new URL('../../workers/fibonacci.worker.ts', import.meta.url)
        );
      }

      // 監聽 Worker 的回應
      workerRef.current.onmessage = (e: MessageEvent<WorkerResult>) => {
        setResults(prev => [e.data, ...prev].slice(0, 5));
        setCalculating(false);
      };

      // 監聽 Worker 的錯誤
      workerRef.current.onerror = (e) => {
        setError('Worker 執行時發生錯誤：' + e.message);
        setCalculating(false);
      };

      // 發送數字給 Worker 計算
      workerRef.current.postMessage(number);
    } catch {
      setError('建立 Worker 時發生錯誤');
      setCalculating(false);
    }
  };

  const codeExample = `// 創建 Web Worker
const worker = new Worker('path/to/worker.js');

// 發送訊息給 Worker
worker.postMessage(data);

// 接收 Worker 的回應
worker.onmessage = (e) => {
  const result = e.data;
  console.log('收到結果：', result);
};

// 處理錯誤
worker.onerror = (e) => {
  console.error('Worker 錯誤：', e.message);
};

// 終止 Worker
worker.terminate();

// Worker 檔案 (worker.js) 內容：
self.addEventListener('message', (e) => {
  // 執行複雜計算
  const result = complexCalculation(e.data);
  
  // 將結果發送回主執行緒
  self.postMessage(result);
});`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Web Workers API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            斐波那契數列計算
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                輸入數字 (建議 30-40)：{number}
              </label>
              <input
                type="range"
                min="1"
                max="45"
                value={number}
                onChange={(e) => setNumber(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={calculateWithWorker}
                disabled={calculating}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium text-white
                  ${calculating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                  }
                `}
              >
                {calculating ? '計算中...' : '使用 Worker 計算'}
              </button>

              <button
                onClick={calculateWithoutWorker}
                disabled={calculating}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md text-sm font-medium hover:bg-yellow-600"
              >
                不使用 Worker 計算
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            計算結果
          </h3>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className="p-3 bg-white rounded-md shadow-sm"
              >
                <div className="text-sm text-gray-600">
                  計算 fibonacci({result.n})
                </div>
                <div className="font-mono text-lg">
                  結果：{result.result}
                </div>
                <div className="text-sm text-gray-500">
                  耗時：{result.duration.toFixed(2)} 毫秒
                </div>
              </div>
            ))}
            {results.length === 0 && (
              <div className="text-gray-500 text-center py-4">
                尚未進行計算
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            說明
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              此演示展示了 Web Workers 的優勢：
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>使用 Worker 計算時，主執行緒不會被阻塞，頁面保持響應</li>
              <li>不使用 Worker 時，計算過程會阻塞主執行緒，導致頁面卡頓</li>
              <li>可以比較兩種方式的執行時間差異</li>
            </ul>
          </div>
        </div>
      </div>
    </DemoModal>
  );
};

export default WebWorkersDemo; 