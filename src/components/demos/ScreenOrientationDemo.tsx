import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface ScreenOrientationDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrientationState {
  type: string;
  angle: number;
  timestamp: number;
}

declare global {
  interface ScreenOrientation {
    lock(orientation: OrientationType): Promise<void>;
    unlock(): void;
  }
}

const ScreenOrientationDemo: React.FC<ScreenOrientationDemoProps> = ({ isOpen, onClose }) => {
  const [orientationState, setOrientationState] = useState<OrientationState>({
    type: screen.orientation.type,
    angle: screen.orientation.angle,
    timestamp: Date.now()
  });
  const [orientationHistory, setOrientationHistory] = useState<OrientationState[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const handleOrientationChange = () => {
        const newState = {
          type: screen.orientation.type,
          angle: screen.orientation.angle,
          timestamp: Date.now()
        };
        setOrientationState(newState);
        setOrientationHistory(prev => [newState, ...prev].slice(0, 5));
      };

      screen.orientation.addEventListener('change', handleOrientationChange);

      return () => {
        screen.orientation.removeEventListener('change', handleOrientationChange);
      };
    }
  }, [isOpen]);

  const lockOrientation = async (orientation: OrientationType) => {
    try {
      await screen.orientation.lock(orientation);
      setIsLocked(true);
    } catch (error) {
      console.error('無法鎖定螢幕方向:', error);
    }
  };

  const unlockOrientation = () => {
    try {
      screen.orientation.unlock();
      setIsLocked(false);
    } catch (error) {
      console.error('無法解除鎖定螢幕方向:', error);
    }
  };

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getOrientationDescription = (type: string): string => {
    switch (type) {
      case 'portrait-primary':
        return '直向（主要）';
      case 'portrait-secondary':
        return '直向（次要）';
      case 'landscape-primary':
        return '橫向（主要）';
      case 'landscape-secondary':
        return '橫向（次要）';
      default:
        return type;
    }
  };

  const codeExample = `// 監聽螢幕方向變化
screen.orientation.addEventListener('change', () => {
  console.log('螢幕方向:', screen.orientation.type);
  console.log('旋轉角度:', screen.orientation.angle);
});

// 鎖定螢幕方向
async function lockOrientation() {
  try {
    await screen.orientation.lock('landscape-primary');
    console.log('已鎖定為橫向');
  } catch (error) {
    console.error('無法鎖定螢幕方向:', error);
  }
}

// 解除鎖定
screen.orientation.unlock();`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Screen Orientation API 展示"
      description="此 API 用於監測和控制螢幕方向，支援鎖定特定方向和監聽方向變化事件。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-bold mb-2">當前螢幕方向：</h4>
          <div className="space-y-2">
            <p>類型: {getOrientationDescription(orientationState.type)}</p>
            <p>角度: {orientationState.angle}°</p>
            <p>狀態: {isLocked ? '🔒 已鎖定' : '🔓 未鎖定'}</p>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-bold mb-2">方向控制：</h4>
          <div className="space-x-2">
            {!isLocked ? (
              <>
                <button
                  onClick={() => lockOrientation('portrait-primary')}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  鎖定直向
                </button>
                <button
                  onClick={() => lockOrientation('landscape-primary')}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  鎖定橫向
                </button>
              </>
            ) : (
              <button
                onClick={unlockOrientation}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                解除鎖定
              </button>
            )}
          </div>
        </div>

        {orientationHistory.length > 0 && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-bold mb-2">方向變化歷史：</h4>
            <div className="space-y-2">
              {orientationHistory.map((state, index) => (
                <div key={index} className="border-b border-gray-300 pb-2">
                  <p className="font-medium">變化 #{orientationHistory.length - index}</p>
                  <div className="text-sm text-gray-600">
                    <p>時間: {formatTime(state.timestamp)}</p>
                    <p>類型: {getOrientationDescription(state.type)}</p>
                    <p>角度: {state.angle}°</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p>* Screen Orientation API 的應用場景：</p>
          <ul className="list-disc list-inside ml-4">
            <li>遊戲畫面方向控制</li>
            <li>影片播放器方向鎖定</li>
            <li>閱讀模式方向設定</li>
            <li>回應式設計適配</li>
          </ul>
        </div>
      </div>
    </DemoModal>
  );
};

export default ScreenOrientationDemo; 