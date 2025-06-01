import React, { useState } from 'react';
import DemoModal from '../DemoModal';

interface TouchEventsDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TouchPoint {
  identifier: number;
  pageX: number;
  pageY: number;
}

const TouchEventsDemo: React.FC<TouchEventsDemoProps> = ({ isOpen, onClose }) => {
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const [lastEvent, setLastEvent] = useState<string>('');

  const handleTouchStart = (event: React.TouchEvent) => {
    event.preventDefault();
    const points = Array.from(event.touches).map(touch => ({
      identifier: touch.identifier,
      pageX: touch.pageX,
      pageY: touch.pageY
    }));
    setTouchPoints(points);
    setLastEvent('touchstart');
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    event.preventDefault();
    const points = Array.from(event.touches).map(touch => ({
      identifier: touch.identifier,
      pageX: touch.pageX,
      pageY: touch.pageY
    }));
    setTouchPoints(points);
    setLastEvent('touchmove');
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    event.preventDefault();
    const points = Array.from(event.touches).map(touch => ({
      identifier: touch.identifier,
      pageX: touch.pageX,
      pageY: touch.pageY
    }));
    setTouchPoints(points);
    setLastEvent('touchend');
  };

  const codeExample = `// 監聽觸控事件
element.addEventListener('touchstart', (event) => {
  event.preventDefault();
  const touch = event.touches[0];
  console.log('觸控開始：', {
    x: touch.pageX,
    y: touch.pageY
  });
});

element.addEventListener('touchmove', (event) => {
  event.preventDefault();
  const touch = event.touches[0];
  console.log('觸控移動：', {
    x: touch.pageX,
    y: touch.pageY
  });
});

element.addEventListener('touchend', (event) => {
  event.preventDefault();
  console.log('觸控結束');
});`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Touch Events API 演示"
      description="展示如何處理觸控事件，包括觸控開始、移動和結束。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        <div
          className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            {touchPoints.length === 0 ? (
              <p>在此區域觸控以查看效果</p>
            ) : (
              touchPoints.map(point => (
                <div
                  key={point.identifier}
                  className="absolute w-8 h-8 bg-blue-500 rounded-full opacity-50 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: point.pageX,
                    top: point.pageY
                  }}
                />
              ))
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">觸控資訊</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>最後事件：{lastEvent}</p>
            <p>觸控點數量：{touchPoints.length}</p>
            {touchPoints.map(point => (
              <p key={point.identifier}>
                觸控點 {point.identifier}: ({point.pageX}, {point.pageY})
              </p>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>提示：</p>
          <ul className="list-disc list-inside">
            <li>使用觸控裝置在上方區域觸控</li>
            <li>支援多點觸控</li>
            <li>可以觀察觸控點的座標變化</li>
          </ul>
        </div>
      </div>
    </DemoModal>
  );
};

export default TouchEventsDemo; 