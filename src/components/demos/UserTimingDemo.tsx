import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface UserTimingDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TimingMeasure {
  name: string;
  duration: number;
  startTime: number;
  detail: unknown;
}

const UserTimingDemo: React.FC<UserTimingDemoProps> = ({ isOpen, onClose }) => {
  const [measures, setMeasures] = useState<TimingMeasure[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // 模擬一些耗時操作並記錄其性能
  const simulateOperations = () => {
    setIsSimulating(true);
    performance.clearMarks();
    performance.clearMeasures();

    // 第一個操作
    performance.mark('操作1開始');
    setTimeout(() => {
      performance.mark('操作1結束');
      performance.measure('操作1', '操作1開始', '操作1結束');

      // 第二個操作
      performance.mark('操作2開始');
      setTimeout(() => {
        performance.mark('操作2結束');
        performance.measure('操作2', '操作2開始', '操作2結束');

        // 第三個操作
        performance.mark('操作3開始');
        setTimeout(() => {
          performance.mark('操作3結束');
          performance.measure('操作3', '操作3開始', '操作3結束');

          // 獲取所有測量結果
          const entries = performance.getEntriesByType('measure');
          const newMeasures = entries.map(entry => ({
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime,
            detail: null
          }));
          setMeasures(newMeasures);
          setIsSimulating(false);
        }, 500);
      }, 800);
    }, 1000);
  };

  useEffect(() => {
    if (isOpen) {
      simulateOperations();
    }
    return () => {
      performance.clearMarks();
      performance.clearMeasures();
    };
  }, [isOpen]);

  const formatTime = (time: number): string => {
    return `${time.toFixed(2)}ms`;
  };

  const codeExample = `// 設置性能標記
performance.mark('操作開始');

// 執行一些操作...
doSomething();

// 設置結束標記
performance.mark('操作結束');

// 測量兩個標記之間的時間
performance.measure('操作耗時', '操作開始', '操作結束');

// 獲取測量結果
const entries = performance.getEntriesByType('measure');
entries.forEach(entry => {
  console.log(\`\${entry.name}: \${entry.duration}ms\`);
});

// 清除標記和測量
performance.clearMarks();
performance.clearMeasures();`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="User Timing API 展示"
      description="此 API 允許開發者在程式碼中設置自定義的性能標記和測量，用於追蹤特定操作的執行時間。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-bold mb-2">模擬操作測量：</h4>
          {isSimulating ? (
            <p className="text-blue-600">正在執行測量...</p>
          ) : (
            <div className="space-y-4">
              {measures.map((measure, index) => (
                <div key={index} className="border-b border-gray-300 pb-2">
                  <p className="font-medium">{measure.name}</p>
                  <div className="text-sm text-gray-600">
                    <p>開始時間: {formatTime(measure.startTime)}</p>
                    <p>持續時間: {formatTime(measure.duration)}</p>
                  </div>
                </div>
              ))}
              <button
                onClick={simulateOperations}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                重新測量
              </button>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600">
          <p>* User Timing API 的主要用途：</p>
          <ul className="list-disc list-inside ml-4">
            <li>測量特定 JavaScript 操作的執行時間</li>
            <li>追蹤應用程式中的關鍵性能指標</li>
            <li>分析不同程式碼區塊的效能</li>
            <li>建立自定義的性能監測點</li>
          </ul>
        </div>
      </div>
    </DemoModal>
  );
};

export default UserTimingDemo; 