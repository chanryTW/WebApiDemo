import React, { useState, useEffect, useRef } from 'react';
import DemoModal from '../DemoModal';

interface CSSTypedOMDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StyleLog {
  timestamp: number;
  message: string;
  type: 'info' | 'error' | 'success';
}

const CSSTypedOMDemo: React.FC<CSSTypedOMDemoProps> = ({ isOpen, onClose }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [logs, setLogs] = useState<StyleLog[]>([]);
  const demoBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 檢查瀏覽器是否支援 CSS Typed OM API
    setIsSupported('attributeStyleMap' in Element.prototype);
  }, []);

  const addLog = (message: string, type: 'info' | 'error' | 'success') => {
    setLogs(prev => [{
      timestamp: Date.now(),
      message,
      type
    }, ...prev].slice(0, 5));
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const applyRotation = () => {
    if (!demoBoxRef.current) return;
    try {
      // 使用 CSS Typed OM 設置旋轉
      demoBoxRef.current.attributeStyleMap.set(
        'transform',
        new CSSTransformValue([new CSSRotate(CSS.deg(45))])
      );
      addLog('已套用 45 度旋轉', 'success');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      addLog(`套用旋轉失敗: ${errorMessage}`, 'error');
    }
  };

  const applyScale = () => {
    if (!demoBoxRef.current) return;
    try {
      // 使用 CSS Typed OM 設置縮放
      demoBoxRef.current.attributeStyleMap.set(
        'transform',
        new CSSTransformValue([new CSSScale(1.5, 1.5)])
      );
      addLog('已套用 1.5 倍縮放', 'success');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      addLog(`套用縮放失敗: ${errorMessage}`, 'error');
    }
  };

  const applyTranslate = () => {
    if (!demoBoxRef.current) return;
    try {
      // 使用 CSS Typed OM 設置位移
      demoBoxRef.current.attributeStyleMap.set(
        'transform',
        new CSSTransformValue([new CSSTranslate(CSS.px(50), CSS.px(0))])
      );
      addLog('已套用向右位移 50px', 'success');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      addLog(`套用位移失敗: ${errorMessage}`, 'error');
    }
  };

  const resetTransform = () => {
    if (!demoBoxRef.current) return;
    try {
      // 清除所有變換
      demoBoxRef.current.attributeStyleMap.delete('transform');
      addLog('已重置變換', 'info');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      addLog(`重置變換失敗: ${errorMessage}`, 'error');
    }
  };

  const codeExample = `// 使用 CSS Typed OM 設置樣式
// 旋轉元素
element.attributeStyleMap.set(
  'transform',
  new CSSTransformValue([
    new CSSRotate(CSS.deg(45))
  ])
);

// 縮放元素
element.attributeStyleMap.set(
  'transform',
  new CSSTransformValue([
    new CSSScale(1.5, 1.5)
  ])
);

// 位移元素
element.attributeStyleMap.set(
  'transform',
  new CSSTransformValue([
    new CSSTranslate(CSS.px(50), CSS.px(0))
  ])
);

// 讀取樣式值
const width = element.computedStyleMap().get('width');
console.log(width.value, width.unit); // 例如：100, 'px'

// 移除樣式
element.attributeStyleMap.delete('transform');`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="CSS Typed OM API 展示"
      description="此 API 提供了一個強類型的介面來操作 CSS 值，相比傳統的字串操作更加安全和高效。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        {!isSupported ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
            ⚠️ 您的瀏覽器不支援 CSS Typed OM API
          </div>
        ) : (
          <>
            <div className="flex space-x-2">
              <button
                onClick={applyRotation}
                className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
              >
                旋轉
              </button>
              <button
                onClick={applyScale}
                className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
              >
                縮放
              </button>
              <button
                onClick={applyTranslate}
                className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
              >
                位移
              </button>
              <button
                onClick={resetTransform}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
              >
                重置
              </button>
            </div>

            <div className="flex justify-center items-center h-40 bg-gray-100 rounded-lg">
              <div
                ref={demoBoxRef}
                className="w-20 h-20 bg-blue-500 transition-transform duration-300"
              ></div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-bold mb-2">操作日誌：</h4>
              {logs.length === 0 ? (
                <p className="text-gray-500">尚無日誌</p>
              ) : (
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded ${
                        log.type === 'error'
                          ? 'bg-red-100'
                          : log.type === 'success'
                          ? 'bg-green-100'
                          : 'bg-white'
                      }`}
                    >
                      <span className="text-sm text-gray-500">
                        {formatTime(log.timestamp)}
                      </span>
                      <p
                        className={
                          log.type === 'error'
                            ? 'text-red-600'
                            : log.type === 'success'
                            ? 'text-green-600'
                            : ''
                        }
                      >
                        {log.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-sm text-gray-600">
              <p>* CSS Typed OM API 的應用場景：</p>
              <ul className="list-disc list-inside ml-4">
                <li>動畫效果</li>
                <li>視覺特效</li>
                <li>樣式計算</li>
                <li>效能優化</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </DemoModal>
  );
};

export default CSSTypedOMDemo; 