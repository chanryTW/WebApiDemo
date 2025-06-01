import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface PerformanceDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PerformanceMetrics {
  navigationStart: number;
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  resourceCount: number;
  memoryUsage: {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  } | null;
}

const PerformanceDemo: React.FC<PerformanceDemoProps> = ({ isOpen, onClose }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [marks, setMarks] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      const timing = performance.timing;
      const memory = (performance as any).memory;
      const resources = performance.getEntriesByType('resource');
      const paint = performance.getEntriesByType('paint');

      setMetrics({
        navigationStart: timing.navigationStart,
        loadTime: timing.loadEventEnd - timing.navigationStart,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
        resourceCount: resources.length,
        memoryUsage: memory ? {
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
          totalJSHeapSize: memory.totalJSHeapSize,
          usedJSHeapSize: memory.usedJSHeapSize
        } : null
      });
    }
  }, [isOpen]);

  const addPerformanceMark = () => {
    const markName = `mark_${Date.now()}`;
    performance.mark(markName);
    setMarks(prev => [...prev, markName]);
  };

  const measureBetweenMarks = () => {
    if (marks.length >= 2) {
      const start = marks[marks.length - 2];
      const end = marks[marks.length - 1];
      const measureName = `measure_${start}_${end}`;
      
      try {
        performance.measure(measureName, start, end);
        const measure = performance.getEntriesByName(measureName)[0];
        alert(`兩個標記之間的時間：${measure.duration.toFixed(2)}ms`);
      } catch (error) {
        console.error('測量失敗：', error);
      }
    } else {
      alert('需要至少兩個標記才能測量時間');
    }
  };

  const clearPerformanceData = () => {
    performance.clearMarks();
    performance.clearMeasures();
    setMarks([]);
  };

  const formatBytes = (bytes: number) => {
    const units = ['Bytes', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  const codeExample = `// 基本效能測量
const timing = performance.timing;
const loadTime = timing.loadEventEnd - timing.navigationStart;
const domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;

// 新增效能標記
performance.mark('startProcess');
// ... 執行一些操作 ...
performance.mark('endProcess');

// 測量兩個標記之間的時間
performance.measure('processTime', 'startProcess', 'endProcess');
const measurements = performance.getEntriesByName('processTime');
console.log('處理時間：', measurements[0].duration);

// 獲取資源載入資訊
const resources = performance.getEntriesByType('resource');
console.log('載入的資源數量：', resources.length);

// 獲取繪製時間
const paint = performance.getEntriesByType('paint');
const firstPaint = paint.find(entry => entry.name === 'first-paint');
console.log('首次繪製時間：', firstPaint.startTime);

// 清除效能數據
performance.clearMarks();
performance.clearMeasures();`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Performance API 演示"
      description="展示如何使用 Performance API 測量網頁效能。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">頁面效能指標</h4>
          {metrics && (
            <div className="space-y-2 text-sm text-gray-600">
              <p>頁面載入時間：{metrics.loadTime.toFixed(2)}ms</p>
              <p>DOM 內容載入時間：{metrics.domContentLoaded.toFixed(2)}ms</p>
              <p>首次繪製時間：{metrics.firstPaint.toFixed(2)}ms</p>
              <p>資源載入數量：{metrics.resourceCount}</p>
              {metrics.memoryUsage && (
                <div>
                  <p>記憶體使用狀況：</p>
                  <ul className="list-disc list-inside pl-4">
                    <li>JS 堆積大小限制：{formatBytes(metrics.memoryUsage.jsHeapSizeLimit)}</li>
                    <li>總 JS 堆積大小：{formatBytes(metrics.memoryUsage.totalJSHeapSize)}</li>
                    <li>已使用 JS 堆積：{formatBytes(metrics.memoryUsage.usedJSHeapSize)}</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex space-x-4">
            <button
              onClick={addPerformanceMark}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              新增標記
            </button>
            <button
              onClick={measureBetweenMarks}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              測量時間
            </button>
            <button
              onClick={clearPerformanceData}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              清除數據
            </button>
          </div>
          {marks.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">已新增的標記：</p>
              <div className="mt-2 space-y-1">
                {marks.map((mark, index) => (
                  <div key={mark} className="text-sm text-gray-600">
                    {index + 1}. {mark}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600">
          <p>提示：</p>
          <ul className="list-disc list-inside">
            <li>點擊「新增標記」來建立時間標記</li>
            <li>新增兩個以上的標記後，可以測量它們之間的時間</li>
            <li>使用「清除數據」來重置所有標記</li>
            <li>觀察頁面效能指標來了解網站載入情況</li>
          </ul>
        </div>
      </div>
    </DemoModal>
  );
};

export default PerformanceDemo; 