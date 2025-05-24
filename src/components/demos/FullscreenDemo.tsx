import React, { useRef, useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface FullscreenDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const FullscreenDemo: React.FC<FullscreenDemoProps> = ({ isOpen, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const enterFullscreen = async () => {
    try {
      if (containerRef.current) {
        await containerRef.current.requestFullscreen();
        setError(null);
      }
    } catch (err) {
      setError('進入全螢幕失敗：' + (err instanceof Error ? err.message : '未知錯誤'));
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setError(null);
      }
    } catch (err) {
      setError('退出全螢幕失敗：' + (err instanceof Error ? err.message : '未知錯誤'));
    }
  };

  const codeExample = `// 進入全螢幕
await element.requestFullscreen();

// 退出全螢幕
await document.exitFullscreen();

// 監聽全螢幕狀態變化
document.addEventListener('fullscreenchange', () => {
  const isFullscreen = document.fullscreenElement !== null;
  console.log('全螢幕狀態：', isFullscreen);
});

// 檢查是否支援全螢幕
const isSupported = document.fullscreenEnabled;

// 獲取當前全螢幕的元素
const fullscreenElement = document.fullscreenElement;`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Fullscreen API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div 
          ref={containerRef}
          className={`relative p-6 rounded-lg ${
            isFullscreen 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex items-center justify-center'
              : 'bg-gradient-to-r from-blue-100 to-purple-100 min-h-[200px] flex items-center justify-center'
          }`}
        >
          <div className="text-center">
            <h3 className={`text-2xl font-bold mb-4 ${isFullscreen ? 'text-white' : 'text-gray-800'}`}>
              {isFullscreen ? '目前處於全螢幕模式' : '點擊下方按鈕進入全螢幕'}
            </h3>
            <button
              onClick={isFullscreen ? exitFullscreen : enterFullscreen}
              className={`px-6 py-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isFullscreen
                  ? 'bg-white text-purple-600 hover:bg-gray-100 focus:ring-white'
                  : 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-600'
              }`}
            >
              {isFullscreen ? '退出全螢幕' : '進入全螢幕'}
            </button>
          </div>

          {isFullscreen && (
            <div className="absolute top-4 right-4">
              <p className={`text-sm ${isFullscreen ? 'text-white' : 'text-gray-600'}`}>
                按 ESC 鍵也可以退出全螢幕
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 text-red-700">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}
      </div>
    </DemoModal>
  );
};

export default FullscreenDemo; 