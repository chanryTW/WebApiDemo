import React, { useState } from 'react';
import DemoModal from '../DemoModal';

interface WheelEventsDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WheelInfo {
  deltaX: number;
  deltaY: number;
  deltaZ: number;
  deltaMode: number;
}

const WheelEventsDemo: React.FC<WheelEventsDemoProps> = ({ isOpen, onClose }) => {
  const [wheelInfo, setWheelInfo] = useState<WheelInfo | null>(null);
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const [lastEvent, setLastEvent] = useState<string>('');

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    setLastEvent('wheel');
    setWheelInfo({
      deltaX: event.deltaX,
      deltaY: event.deltaY,
      deltaZ: event.deltaZ,
      deltaMode: event.deltaMode
    });

    setScrollPosition(prev => ({
      x: Math.max(0, Math.min(200, prev.x + event.deltaX)),
      y: Math.max(0, Math.min(200, prev.y + event.deltaY))
    }));
  };

  const getDeltaModeName = (mode: number): string => {
    switch (mode) {
      case 0:
        return 'PIXEL';
      case 1:
        return 'LINE';
      case 2:
        return 'PAGE';
      default:
        return '未知';
    }
  };

  const codeExample = `// 監聽滾輪事件
element.addEventListener('wheel', (event) => {
  event.preventDefault(); // 防止頁面滾動
  console.log('滾輪事件：', {
    deltaX: event.deltaX, // 水平滾動量
    deltaY: event.deltaY, // 垂直滾動量
    deltaZ: event.deltaZ, // Z軸滾動量
    deltaMode: event.deltaMode // 0: PIXEL, 1: LINE, 2: PAGE
  });
});`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Wheel Events API 演示"
      description="展示如何處理滾輪事件，包括滾動方向和距離。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        <div
          className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 relative overflow-hidden"
          onWheel={handleWheel}
        >
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p>在此區域使用滾輪</p>
              <div
                className="mt-4 w-8 h-8 bg-blue-500 rounded-full mx-auto"
                style={{
                  transform: `translate(${scrollPosition.x}px, ${scrollPosition.y}px)`
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">滾輪事件資訊</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>最後事件：{lastEvent}</p>
            {wheelInfo && (
              <>
                <p>水平滾動量：{wheelInfo.deltaX.toFixed(2)}</p>
                <p>垂直滾動量：{wheelInfo.deltaY.toFixed(2)}</p>
                <p>Z軸滾動量：{wheelInfo.deltaZ.toFixed(2)}</p>
                <p>滾動模式：{getDeltaModeName(wheelInfo.deltaMode)}</p>
              </>
            )}
            <p>目前位置：({Math.round(scrollPosition.x)}, {Math.round(scrollPosition.y)})</p>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>提示：</p>
          <ul className="list-disc list-inside">
            <li>使用滑鼠滾輪在上方區域滾動</li>
            <li>觀察藍色圓點的移動</li>
            <li>如果有觸控板，可以嘗試雙指滾動</li>
            <li>某些設備支援水平滾動</li>
          </ul>
        </div>
      </div>
    </DemoModal>
  );
};

export default WheelEventsDemo; 