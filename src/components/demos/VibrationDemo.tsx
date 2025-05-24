import React, { useState } from 'react';
import DemoModal from '../DemoModal';

interface VibrationDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const VibrationDemo: React.FC<VibrationDemoProps> = ({ isOpen, onClose }) => {
  const [customDuration, setCustomDuration] = useState<number>(200);
  const [customPattern, setCustomPattern] = useState<string>('200,100,200');
  const [error, setError] = useState<string | null>(null);

  const isSupported = 'vibrate' in navigator;

  const vibrate = (pattern: number | number[]) => {
    try {
      navigator.vibrate(pattern);
      setError(null);
    } catch (err) {
      setError('震動失敗：' + (err instanceof Error ? err.message : '未知錯誤'));
    }
  };

  const handleCustomPatternChange = (value: string) => {
    // 只允許數字和逗號
    if (/^[\d,]*$/.test(value)) {
      setCustomPattern(value);
    }
  };

  const handleCustomPatternSubmit = () => {
    const pattern = customPattern.split(',').map(Number);
    if (pattern.some(isNaN)) {
      setError('請輸入有效的數字模式');
      return;
    }
    vibrate(pattern);
  };

  const codeExample = `// 單次震動（毫秒）
navigator.vibrate(200);

// 震動模式：震動 200ms，暫停 100ms，再震動 200ms
navigator.vibrate([200, 100, 200]);

// 停止震動
navigator.vibrate(0);

// 檢查是否支援震動
const isSupported = 'vibrate' in navigator;`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Vibration API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        {!isSupported ? (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center gap-2 text-yellow-700">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              此瀏覽器不支援 Vibration API
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">預設震動模式</h4>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => vibrate(200)}
                  className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  短震動 (200ms)
                </button>
                <button
                  onClick={() => vibrate(1000)}
                  className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  長震動 (1000ms)
                </button>
                <button
                  onClick={() => vibrate([200, 100, 200])}
                  className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  雙震動
                </button>
                <button
                  onClick={() => vibrate(0)}
                  className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  停止震動
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">自訂單次震動</h4>
                <div className="flex gap-2">
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="100"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(Number(e.target.value))}
                    className="flex-1"
                  />
                  <button
                    onClick={() => vibrate(customDuration)}
                    className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    震動 {customDuration}ms
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">自訂震動模式</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPattern}
                    onChange={(e) => handleCustomPatternChange(e.target.value)}
                    placeholder="例如：200,100,200"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  />
                  <button
                    onClick={handleCustomPatternSubmit}
                    className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    執行
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  輸入以逗號分隔的數字，表示震動和暫停的毫秒數
                </p>
              </div>
            </div>
          </div>
        )}

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

export default VibrationDemo; 