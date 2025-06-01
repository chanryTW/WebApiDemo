import React, { useState, useEffect, useRef } from 'react';
import DemoModal from '../DemoModal';

interface MutationObserverDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MutationRecord {
  type: string;
  target: string;
  addedNodes: number;
  removedNodes: number;
  attributeName?: string;
  oldValue?: string;
  timestamp: number;
}

const MutationObserverDemo: React.FC<MutationObserverDemoProps> = ({ isOpen, onClose }) => {
  const [mutations, setMutations] = useState<MutationRecord[]>([]);
  const [isObserving, setIsObserving] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const [text, setText] = useState('這是初始文字');
  const [bgColor, setBgColor] = useState('bg-blue-100');
  const [showExtra, setShowExtra] = useState(false);

  useEffect(() => {
    if (isOpen && targetRef.current) {
      observerRef.current = new MutationObserver((mutationsList) => {
        const newMutations = mutationsList.map(mutation => ({
          type: mutation.type,
          target: (mutation.target as Element).tagName.toLowerCase(),
          addedNodes: mutation.addedNodes.length,
          removedNodes: mutation.removedNodes.length,
          attributeName: mutation.attributeName || undefined,
          oldValue: mutation.oldValue || undefined,
          timestamp: Date.now()
        }));

        setMutations(prev => [...newMutations, ...prev].slice(0, 5));
      });
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isOpen]);

  const startObserving = () => {
    if (targetRef.current && observerRef.current) {
      observerRef.current.observe(targetRef.current, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true
      });
      setIsObserving(true);
    }
  };

  const stopObserving = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      setIsObserving(false);
    }
  };

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getMutationDescription = (mutation: MutationRecord): string => {
    switch (mutation.type) {
      case 'childList':
        return `子節點變化 (新增: ${mutation.addedNodes}, 移除: ${mutation.removedNodes})`;
      case 'attributes':
        return `屬性變化 (${mutation.attributeName})`;
      case 'characterData':
        return '文字內容變化';
      default:
        return mutation.type;
    }
  };

  const codeExample = `// 建立 MutationObserver 實例
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    console.log('變化類型:', mutation.type);
    console.log('目標元素:', mutation.target);
    
    if (mutation.type === 'childList') {
      console.log('新增節點:', mutation.addedNodes.length);
      console.log('移除節點:', mutation.removedNodes.length);
    } else if (mutation.type === 'attributes') {
      console.log('變更屬性:', mutation.attributeName);
      console.log('舊值:', mutation.oldValue);
    }
  });
});

// 開始觀察
observer.observe(targetElement, {
  attributes: true,      // 監測屬性變化
  childList: true,      // 監測子節點變化
  characterData: true,  // 監測文字內容變化
  subtree: true,        // 監測所有後代節點
  attributeOldValue: true,  // 記錄屬性舊值
  characterDataOldValue: true  // 記錄文字內容舊值
});

// 停止觀察
observer.disconnect();`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Mutation Observer API 展示"
      description="此 API 用於監測 DOM 變化，包括元素的屬性變化、子節點變化和文字內容變化。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        <div className="flex space-x-2 mb-4">
          {!isObserving ? (
            <button
              onClick={startObserving}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              開始監測
            </button>
          ) : (
            <button
              onClick={stopObserving}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              停止監測
            </button>
          )}
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-bold mb-2">監測狀態：</h4>
          <p className="text-sm">
            {isObserving ? '🔍 正在監測 DOM 變化' : '⏸️ 監測已暫停'}
          </p>
        </div>

        <div
          ref={targetRef}
          className={`p-4 rounded-lg ${bgColor} transition-colors duration-300`}
        >
          <h4 className="font-bold mb-2">測試區域：</h4>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <button
                onClick={() => setText(prev => prev + '!')}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                新增驚嘆號
              </button>
              <button
                onClick={() => setBgColor(prev =>
                  prev === 'bg-blue-100' ? 'bg-green-100' : 'bg-blue-100'
                )}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                切換背景色
              </button>
              <button
                onClick={() => setShowExtra(prev => !prev)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                切換額外內容
              </button>
            </div>
            <p>{text}</p>
            {showExtra && (
              <div className="mt-2 p-2 bg-white rounded">
                這是動態新增的內容
              </div>
            )}
          </div>
        </div>

        {mutations.length > 0 && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-bold mb-2">最近的變化：</h4>
            <div className="space-y-2">
              {mutations.map((mutation, index) => (
                <div key={index} className="border-b border-gray-300 pb-2">
                  <p className="font-medium">變化 #{mutations.length - index}</p>
                  <div className="text-sm text-gray-600">
                    <p>時間: {formatTime(mutation.timestamp)}</p>
                    <p>類型: {getMutationDescription(mutation)}</p>
                    <p>目標: {mutation.target}</p>
                    {mutation.attributeName && (
                      <p>屬性: {mutation.attributeName}</p>
                    )}
                    {mutation.oldValue && (
                      <p>舊值: {mutation.oldValue}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p>* Mutation Observer API 的應用場景：</p>
          <ul className="list-disc list-inside ml-4">
            <li>監控表單元素變化</li>
            <li>追蹤動態內容更新</li>
            <li>實現自動保存功能</li>
            <li>偵測第三方腳本修改</li>
          </ul>
        </div>
      </div>
    </DemoModal>
  );
};

export default MutationObserverDemo; 