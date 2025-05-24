import React, { useRef, useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface ResizeObserverDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ElementSize {
  width: number;
  height: number;
}

const ResizeObserverDemo: React.FC<ResizeObserverDemoProps> = ({ isOpen, onClose }) => {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!elementRef.current) return;

    observerRef.current = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
        
        // 設置調整大小狀態
        setIsResizing(true);
        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current);
        }
        resizeTimeoutRef.current = setTimeout(() => {
          setIsResizing(false);
        }, 150);
      }
    });

    observerRef.current.observe(elementRef.current);

    return () => {
      observerRef.current?.disconnect();
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  const codeExample = `// 創建 Resize Observer
const observer = new ResizeObserver(entries => {
  entries.forEach(entry => {
    const { width, height } = entry.contentRect;
    console.log('元素尺寸變化：', { width, height });
  });
});

// 開始觀察目標元素
observer.observe(targetElement);

// 停止觀察
observer.disconnect();`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Resize Observer API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-700">
            拖曳右下角調整方塊大小，觀察尺寸變化
          </p>
        </div>

        <div className="relative">
          <div
            ref={elementRef}
            className={`
              min-w-[200px] min-h-[150px] 
              w-full h-48 
              resize overflow-auto 
              p-4 rounded-lg
              transition-colors duration-200
              ${isResizing 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-white border-gray-200'
              }
              border-2
            `}
          >
            <div className="pointer-events-none select-none">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className={`h-5 w-5 ${isResizing ? 'text-blue-500' : 'text-gray-400'}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span className={`font-medium ${isResizing ? 'text-blue-600' : 'text-gray-600'}`}>
                  {isResizing ? '正在調整大小...' : '可調整大小的元素'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className={`text-sm ${isResizing ? 'text-blue-600' : 'text-gray-500'}`}>
                  寬度：{Math.round(size.width)}px
                </div>
                <div className={`text-sm ${isResizing ? 'text-blue-600' : 'text-gray-500'}`}>
                  高度：{Math.round(size.height)}px
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-2 right-2 pointer-events-none">
            <svg
              className={`h-5 w-5 ${isResizing ? 'text-blue-500' : 'text-gray-400'}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M7 7h.01M7 10h.01M7 13h.01M10 7h.01M10 10h.01M10 13h.01M13 7h.01M13 10h.01M13 13h.01" />
            </svg>
          </div>
        </div>

        <div className={`
          p-4 rounded-lg transition-colors duration-200
          ${isResizing ? 'bg-blue-50' : 'bg-gray-50'}
        `}>
          <h4 className={`font-medium mb-2 ${isResizing ? 'text-blue-700' : 'text-gray-700'}`}>
            即時尺寸資訊
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className={`
              p-3 rounded-lg
              ${isResizing 
                ? 'bg-blue-100 border-blue-200' 
                : 'bg-white border-gray-200'
              }
              border
            `}>
              <div className="text-sm text-gray-500">寬度</div>
              <div className={`text-lg font-semibold ${isResizing ? 'text-blue-600' : 'text-gray-700'}`}>
                {Math.round(size.width)}px
              </div>
            </div>
            <div className={`
              p-3 rounded-lg
              ${isResizing 
                ? 'bg-blue-100 border-blue-200' 
                : 'bg-white border-gray-200'
              }
              border
            `}>
              <div className="text-sm text-gray-500">高度</div>
              <div className={`text-lg font-semibold ${isResizing ? 'text-blue-600' : 'text-gray-700'}`}>
                {Math.round(size.height)}px
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoModal>
  );
};

export default ResizeObserverDemo; 