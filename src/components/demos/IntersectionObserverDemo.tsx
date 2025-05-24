import React, { useRef, useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface IntersectionObserverDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const IntersectionObserverDemo: React.FC<IntersectionObserverDemoProps> = ({ isOpen, onClose }) => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const itemId = Number(entry.target.getAttribute('data-item-id'));
          setVisibleItems((prev) => {
            const newSet = new Set(prev);
            if (entry.isIntersecting) {
              newSet.add(itemId);
            } else {
              newSet.delete(itemId);
            }
            return newSet;
          });
        });
      },
      {
        root: containerRef.current,
        threshold: 0.5
      }
    );

    const elements = containerRef.current.querySelectorAll('.observed-item');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const codeExample = `// 創建 Intersection Observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('元素進入可見範圍');
    } else {
      console.log('元素離開可見範圍');
    }
  });
}, {
  // 觀察的容器元素，預設為視窗
  root: document.querySelector('#container'),
  // 元素可見比例的閾值，0 到 1 之間
  threshold: 0.5
});

// 開始觀察目標元素
observer.observe(targetElement);

// 停止觀察
observer.disconnect();`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Intersection Observer API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-700">
            向下捲動觀察區域，查看元素進入和離開可見範圍的狀態變化
          </p>
        </div>

        <div
          ref={containerRef}
          className="h-64 overflow-y-auto p-4 border border-gray-200 rounded-lg bg-white"
        >
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              data-item-id={i}
              className={`observed-item mb-4 p-4 rounded-lg transition-all duration-300 ${
                visibleItems.has(i)
                  ? 'bg-green-100 border-green-200'
                  : 'bg-gray-50 border-gray-100'
              } border`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">
                  元素 #{i + 1}
                </span>
                <span
                  className={`px-2 py-1 text-sm rounded-full ${
                    visibleItems.has(i)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {visibleItems.has(i) ? '可見' : '不可見'}
                </span>
              </div>
              <p className={`mt-2 text-sm ${
                visibleItems.has(i) ? 'text-green-600' : 'text-gray-500'
              }`}>
                {visibleItems.has(i)
                  ? '此元素目前在可見範圍內'
                  : '此元素目前在可見範圍外'}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">目前可見的元素：</h4>
          <div className="flex flex-wrap gap-2">
            {visibleItems.size === 0 ? (
              <span className="text-gray-500">無</span>
            ) : (
              Array.from(visibleItems).sort().map((id) => (
                <span
                  key={id}
                  className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-sm"
                >
                  元素 #{id + 1}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </DemoModal>
  );
};

export default IntersectionObserverDemo; 