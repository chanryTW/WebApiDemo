import React, { useState } from 'react';
import DemoModal from '../DemoModal';

interface MouseEventsDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MousePosition {
  x: number;
  y: number;
}

const MouseEventsDemo: React.FC<MouseEventsDemoProps> = ({ isOpen, onClose }) => {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [buttonPressed, setButtonPressed] = useState<number | null>(null);
  const [lastEvent, setLastEvent] = useState<string>('');
  const [isInside, setIsInside] = useState<boolean>(false);

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
    setLastEvent('mousemove');
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    setButtonPressed(event.button);
    setLastEvent('mousedown');
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    setButtonPressed(null);
    setLastEvent('mouseup');
  };

  const handleMouseEnter = (event: React.MouseEvent) => {
    setIsInside(true);
    setLastEvent('mouseenter');
  };

  const handleMouseLeave = (event: React.MouseEvent) => {
    setIsInside(false);
    setLastEvent('mouseleave');
  };

  const getButtonName = (button: number | null): string => {
    switch (button) {
      case 0:
        return '左鍵';
      case 1:
        return '中鍵';
      case 2:
        return '右鍵';
      default:
        return '無';
    }
  };

  const codeExample = `// 監聽滑鼠事件
element.addEventListener('mousemove', (event) => {
  console.log('滑鼠移動：', {
    x: event.clientX,
    y: event.clientY
  });
});

element.addEventListener('mousedown', (event) => {
  console.log('滑鼠按下：', {
    button: event.button, // 0: 左鍵, 1: 中鍵, 2: 右鍵
    x: event.clientX,
    y: event.clientY
  });
});

element.addEventListener('mouseup', (event) => {
  console.log('滑鼠放開');
});

element.addEventListener('mouseenter', (event) => {
  console.log('滑鼠進入元素');
});

element.addEventListener('mouseleave', (event) => {
  console.log('滑鼠離開元素');
});`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Mouse Events API 演示"
      description="展示如何處理滑鼠事件，包括移動、點擊、進入和離開等事件。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        <div
          className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 relative cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            {isInside ? (
              <div
                className="absolute w-6 h-6 bg-blue-500 rounded-full opacity-50 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: position.x,
                  top: position.y
                }}
              />
            ) : (
              <p>將滑鼠移入此區域</p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">滑鼠事件資訊</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>最後事件：{lastEvent}</p>
            <p>滑鼠位置：({Math.round(position.x)}, {Math.round(position.y)})</p>
            <p>按下的按鍵：{getButtonName(buttonPressed)}</p>
            <p>滑鼠在元素內：{isInside ? '是' : '否'}</p>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>提示：</p>
          <ul className="list-disc list-inside">
            <li>在上方區域移動滑鼠</li>
            <li>點擊左鍵、中鍵或右鍵</li>
            <li>觀察滑鼠進入和離開區域的效果</li>
          </ul>
        </div>
      </div>
    </DemoModal>
  );
};

export default MouseEventsDemo; 