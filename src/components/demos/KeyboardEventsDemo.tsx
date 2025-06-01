import React, { useState } from 'react';
import DemoModal from '../DemoModal';

interface KeyboardEventsDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface KeyInfo {
  key: string;
  code: string;
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
  repeat: boolean;
}

const KeyboardEventsDemo: React.FC<KeyboardEventsDemoProps> = ({ isOpen, onClose }) => {
  const [lastEvent, setLastEvent] = useState<string>('');
  const [keyInfo, setKeyInfo] = useState<KeyInfo | null>(null);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const handleKeyDown = (event: React.KeyboardEvent) => {
    event.preventDefault();
    setLastEvent('keydown');
    setKeyInfo({
      key: event.key,
      code: event.code,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      metaKey: event.metaKey,
      repeat: event.repeat
    });
    setPressedKeys(prev => new Set([...prev, event.code]));
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    event.preventDefault();
    setLastEvent('keyup');
    setKeyInfo({
      key: event.key,
      code: event.code,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      metaKey: event.metaKey,
      repeat: event.repeat
    });
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(event.code);
      return newSet;
    });
  };

  const codeExample = `// 監聽鍵盤事件
element.addEventListener('keydown', (event) => {
  console.log('按鍵按下：', {
    key: event.key,
    code: event.code,
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    shiftKey: event.shiftKey,
    metaKey: event.metaKey,
    repeat: event.repeat
  });
});

element.addEventListener('keyup', (event) => {
  console.log('按鍵放開：', {
    key: event.key,
    code: event.code
  });
});`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Keyboard Events API 演示"
      description="展示如何處理鍵盤事件，包括按鍵按下、放開等事件。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        <div
          className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 relative focus:outline-none"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        >
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p>點擊此區域並按下任意按鍵</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {Array.from(pressedKeys).map(key => (
                  <span
                    key={key}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
                  >
                    {key}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">鍵盤事件資訊</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>最後事件：{lastEvent}</p>
            {keyInfo && (
              <>
                <p>按鍵：{keyInfo.key}</p>
                <p>按鍵代碼：{keyInfo.code}</p>
                <p>修飾鍵：
                  {[
                    keyInfo.altKey && 'Alt',
                    keyInfo.ctrlKey && 'Ctrl',
                    keyInfo.shiftKey && 'Shift',
                    keyInfo.metaKey && 'Meta'
                  ].filter(Boolean).join(', ') || '無'}
                </p>
                <p>重複按鍵：{keyInfo.repeat ? '是' : '否'}</p>
              </>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>提示：</p>
          <ul className="list-disc list-inside">
            <li>點擊上方區域以獲得焦點</li>
            <li>按下任意按鍵查看事件資訊</li>
            <li>可以同時按下多個按鍵</li>
            <li>嘗試使用修飾鍵（Alt、Ctrl、Shift、Meta）</li>
          </ul>
        </div>
      </div>
    </DemoModal>
  );
};

export default KeyboardEventsDemo; 