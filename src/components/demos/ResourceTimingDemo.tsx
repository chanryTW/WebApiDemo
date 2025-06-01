import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface ResourceTimingDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ResourceMetrics {
  name: string;
  entryType: string;
  initiatorType: string;
  duration: number;
  transferSize: number;
  decodedBodySize: number;
}

const ResourceTimingDemo: React.FC<ResourceTimingDemoProps> = ({ isOpen, onClose }) => {
  const [resources, setResources] = useState<ResourceMetrics[]>([]);
  const [testImage, setTestImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // 載入測試圖片以展示資源計時
      const imageUrl = 'https://picsum.photos/200/300';
      const img = new Image();
      img.src = imageUrl;
      setTestImage(imageUrl);

      // 等待圖片載入後獲取資源計時資訊
      img.onload = () => {
        const entries = performance.getEntriesByType('resource');
        const metrics = entries.map(entry => ({
          name: entry.name.split('/').pop() || entry.name,
          entryType: entry.entryType,
          initiatorType: (entry as PerformanceResourceTiming).initiatorType,
          duration: entry.duration,
          transferSize: (entry as PerformanceResourceTiming).transferSize,
          decodedBodySize: (entry as PerformanceResourceTiming).decodedBodySize
        }));
        setResources(metrics);
      };
    }
  }, [isOpen]);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (time: number): string => {
    return `${time.toFixed(2)}ms`;
  };

  const codeExample = `// 獲取所有資源的計時資訊
const entries = performance.getEntriesByType('resource');

// 遍歷每個資源的計時資訊
entries.forEach(entry => {
  console.log('資源名稱:', entry.name);
  console.log('載入時間:', entry.duration);
  console.log('傳輸大小:', entry.transferSize);
  console.log('解碼大小:', entry.decodedBodySize);
  console.log('資源類型:', entry.initiatorType);
});

// 清除資源計時資料
performance.clearResourceTimings();

// 設定緩衝區大小
performance.setResourceTimingBufferSize(150);`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Resource Timing API 展示"
      description="此 API 提供了網頁資源（圖片、腳本、樣式表等）的詳細載入時間和大小資訊。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        {testImage && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-bold mb-2">測試圖片：</h4>
            <img src={testImage} alt="測試資源" className="w-32 h-32 object-cover rounded" />
          </div>
        )}

        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-bold mb-2">資源載入資訊：</h4>
          <div className="space-y-4">
            {resources.map((resource, index) => (
              <div key={index} className="border-b border-gray-300 pb-2">
                <p className="font-medium">{resource.name}</p>
                <div className="text-sm text-gray-600">
                  <p>資源類型: {resource.initiatorType}</p>
                  <p>載入時間: {formatTime(resource.duration)}</p>
                  <p>傳輸大小: {formatSize(resource.transferSize)}</p>
                  <p>解碼大小: {formatSize(resource.decodedBodySize)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>* 資源計時 API 可以幫助我們：</p>
          <ul className="list-disc list-inside ml-4">
            <li>監測資源載入效能</li>
            <li>識別載入緩慢的資源</li>
            <li>分析資源大小和壓縮效果</li>
            <li>優化資源載入策略</li>
          </ul>
        </div>
      </div>
    </DemoModal>
  );
};

export default ResourceTimingDemo; 