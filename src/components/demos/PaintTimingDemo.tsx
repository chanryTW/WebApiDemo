import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface PaintTimingDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaintMetrics {
  name: string;
  startTime: number;
  duration: number;
}

const PaintTimingDemo: React.FC<PaintTimingDemoProps> = ({ isOpen, onClose }) => {
  const [paintMetrics, setPaintMetrics] = useState<PaintMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // 等待一下以確保能獲取到所有繪製指標
      setTimeout(() => {
        const entries = performance.getEntriesByType('paint');
        const metrics = entries.map(entry => ({
          name: entry.name,
          startTime: entry.startTime,
          duration: entry.duration
        }));
        setPaintMetrics(metrics);
        setIsLoading(false);
      }, 1000);
    }
  }, [isOpen]);

  const formatTime = (time: number): string => {
    return `${time.toFixed(2)}ms`;
  };

  const getPaintName = (name: string): string => {
    switch (name) {
      case 'first-paint':
        return '首次繪製 (FP)';
      case 'first-contentful-paint':
        return '首次內容繪製 (FCP)';
      default:
        return name;
    }
  };

  const getDescription = (name: string): string => {
    switch (name) {
      case 'first-paint':
        return '瀏覽器首次將像素渲染到螢幕的時間點，代表頁面開始顯示內容的時刻。';
      case 'first-contentful-paint':
        return '瀏覽器首次渲染任何文字、圖片、非空白 canvas 或 SVG 的時間點，代表使用者可以看到實際內容的時刻。';
      default:
        return '';
    }
  };

  const codeExample = `// 監聽繪製時間點
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach(entry => {
    if (entry.name === 'first-paint') {
      console.log('首次繪製 (FP):', entry.startTime);
    }
    if (entry.name === 'first-contentful-paint') {
      console.log('首次內容繪製 (FCP):', entry.startTime);
    }
  });
});

// 開始觀察繪製指標
observer.observe({ entryTypes: ['paint'] });

// 直接獲取繪製指標
const paintMetrics = performance.getEntriesByType('paint');
paintMetrics.forEach(metric => {
  console.log(\`\${metric.name}: \${metric.startTime}ms\`);
});`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Paint Timing API 展示"
      description="此 API 提供了關於網頁渲染過程中的關鍵時間點資訊，包括首次繪製 (FP) 和首次內容繪製 (FCP)。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-bold mb-2">繪製時間指標：</h4>
          {isLoading ? (
            <p className="text-blue-600">正在收集繪製指標...</p>
          ) : (
            <div className="space-y-4">
              {paintMetrics.map((metric, index) => (
                <div key={index} className="border-b border-gray-300 pb-4">
                  <p className="font-medium">{getPaintName(metric.name)}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {getDescription(metric.name)}
                  </p>
                  <div className="text-sm text-gray-600 mt-2">
                    <p>開始時間: {formatTime(metric.startTime)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600">
          <p>* Paint Timing API 的重要性：</p>
          <ul className="list-disc list-inside ml-4">
            <li>衡量使用者感知的頁面載入速度</li>
            <li>識別頁面渲染效能問題</li>
            <li>優化首次視覺內容的呈現</li>
            <li>提升使用者體驗</li>
          </ul>
        </div>
      </div>
    </DemoModal>
  );
};

export default PaintTimingDemo; 