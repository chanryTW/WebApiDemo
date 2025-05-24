import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface BackgroundTasksDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Task {
  id: number;
  status: 'pending' | 'running' | 'completed';
  startTime?: number;
  endTime?: number;
  result?: number;
}

const BackgroundTasksDemo: React.FC<BackgroundTasksDemoProps> = ({ isOpen, onClose }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSupported, setIsSupported] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!('requestIdleCallback' in window)) {
      setIsSupported(false);
    }
  }, []);

  const addTask = () => {
    const newTask: Task = {
      id: Date.now(),
      status: 'pending'
    };
    setTasks(prev => [...prev, newTask]);
  };

  const processTask = (task: Task) => {
    // 模擬耗時計算
    let result = 0;
    for (let i = 0; i < 2000000; i++) {
      result += Math.sqrt(i);
    }
    return result;
  };

  useEffect(() => {
    if (!isSupported || isProcessing) return;

    const pendingTask = tasks.find(t => t.status === 'pending');
    if (!pendingTask) return;

    setIsProcessing(true);

    // @ts-expect-error: requestIdleCallback 的類型定義可能不存在
    window.requestIdleCallback((deadline) => {
      setTasks(prev => prev.map(task => {
        if (task.id === pendingTask.id) {
          const startTime = performance.now();
          const result = processTask(task);
          const endTime = performance.now();
          
          return {
            ...task,
            status: 'completed',
            startTime,
            endTime,
            result
          };
        }
        return task;
      }));
      setIsProcessing(false);
    });
  }, [tasks, isSupported, isProcessing]);

  const codeExample = `// 檢查瀏覽器是否支援
if ('requestIdleCallback' in window) {
  // 在瀏覽器空閒時執行任務
  requestIdleCallback((deadline) => {
    // deadline.timeRemaining() 返回當前空閒時間
    // deadline.didTimeout 表示是否超時
    while (deadline.timeRemaining() > 0 && tasks.length > 0) {
      processNextTask();
    }
  }, {
    timeout: 1000 // 可選的超時時間
  });
}`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Background Tasks API 演示"
      description="展示如何使用 requestIdleCallback 在瀏覽器空閒時執行低優先級任務。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        {!isSupported ? (
          <div className="text-red-500 text-center">
            您的瀏覽器不支援 Background Tasks API
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <button
                onClick={addTask}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                添加背景任務
              </button>
              <span className="text-sm text-gray-600">
                總任務數: {tasks.length}
              </span>
            </div>

            <div className="border rounded-md p-4 h-64 overflow-y-auto bg-gray-50">
              {tasks.length === 0 ? (
                <div className="text-gray-500 text-center">
                  尚未添加任何任務。點擊上方按鈕添加任務。
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-md ${
                        task.status === 'completed'
                          ? 'bg-green-100'
                          : task.status === 'running'
                          ? 'bg-yellow-100'
                          : 'bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>任務 #{task.id}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            task.status === 'completed'
                              ? 'bg-green-200 text-green-800'
                              : task.status === 'running'
                              ? 'bg-yellow-200 text-yellow-800'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {task.status === 'completed'
                            ? '已完成'
                            : task.status === 'running'
                            ? '執行中'
                            : '等待中'}
                        </span>
                      </div>
                      {task.status === 'completed' && (
                        <div className="mt-2 text-sm text-gray-600">
                          <div>執行時間: {(task.endTime! - task.startTime!).toFixed(2)} ms</div>
                          <div>計算結果: {task.result!.toFixed(2)}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-sm text-gray-600">
              <p>提示：</p>
              <ul className="list-disc list-inside">
                <li>點擊「添加背景任務」按鈕來創建新任務</li>
                <li>任務會在瀏覽器空閒時自動執行</li>
                <li>灰色表示等待中，黃色表示執行中，綠色表示已完成</li>
                <li>每個任務都會進行一些耗時的數學計算</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </DemoModal>
  );
};

export default BackgroundTasksDemo; 