import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface LongTasksDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LongTask {
  name: string;
  duration: number;
  startTime: number;
  attribution: string[];
}

interface TaskAttribution {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
  containerType: string;
  containerSrc: string;
  containerId: string;
  containerName: string;
}

const LongTasksDemo: React.FC<LongTasksDemoProps> = ({ isOpen, onClose }) => {
  const [longTasks, setLongTasks] = useState<LongTask[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 設置 PerformanceObserver 來監測長任務
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const tasks = entries.map(entry => ({
          name: entry.name,
          duration: entry.duration,
          startTime: entry.startTime,
          attribution: (entry as any).attribution?.map((item: TaskAttribution) => item.name) || []
        }));
        setLongTasks(prev => [...prev, ...tasks]);
      });

      observer.observe({ entryTypes: ['longtask'] });

      return () => {
        observer.disconnect();
      };
    }
  }, [isOpen]);

  // 模擬一個長任務
  const simulateLongTask = () => {
    setIsSimulating(true);
    const startTime = performance.now();

    // 執行一個耗時的計算
    while (performance.now() - startTime < 100) {
      // 空迴圈，模擬阻塞主線程
    }

    setIsSimulating(false);
  };

  const formatTime = (time: number): string => {
    return `${time.toFixed(2)}ms`;
  };

  const codeExample = `// 設置 PerformanceObserver 來監測長任務
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach(entry => {
    console.log('檢測到長任務：', {
      名稱: entry.name,
      持續時間: entry.duration,
      開始時間: entry.startTime,
      歸因: entry.attribution.map(item => item.name)
    });
  });
});

// 開始觀察長任務
observer.observe({ entryTypes: ['longtask'] });

// 模擬一個長任務
function simulateLongTask() {
  const startTime = performance.now();
  while (performance.now() - startTime < 100) {
    // 空迴圈，阻塞主線程
  }
}`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Long Tasks API 展示"
      description="此 API 用於識別可能阻塞主線程超過 50 毫秒的長時間執行任務。這些任務可能會影響使用者體驗，造成介面卡頓。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-bold mb-2">長任務監測：</h4>
          <button
            onClick={simulateLongTask}
            disabled={isSimulating}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isSimulating ? '正在執行...' : '模擬長任務'}
          </button>

          <div className="mt-4 space-y-4">
            {longTasks.map((task, index) => (
              <div key={index} className="border-b border-gray-300 pb-2">
                <p className="font-medium">長任務 #{index + 1}</p>
                <div className="text-sm text-gray-600">
                  <p>持續時間: {formatTime(task.duration)}</p>
                  <p>開始時間: {formatTime(task.startTime)}</p>
                  <p>歸因: {task.attribution.join(', ') || '未知'}</p>
                </div>
              </div>
            ))}
            {longTasks.length === 0 && (
              <p className="text-gray-600">尚未檢測到長任務。點擊上方按鈕來模擬一個長任務。</p>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>* Long Tasks API 的應用：</p>
          <ul className="list-disc list-inside ml-4">
            <li>識別影響效能的程式碼</li>
            <li>監測主線程阻塞情況</li>
            <li>優化使用者體驗</li>
            <li>追蹤第三方腳本影響</li>
          </ul>
        </div>
      </div>
    </DemoModal>
  );
};

export default LongTasksDemo; 