import React, { useState } from 'react';
import DemoModal from '../DemoModal';

interface ClipboardDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const ClipboardDemo: React.FC<ClipboardDemoProps> = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus({
        type: 'success',
        message: '文字已成功複製到剪貼簿！'
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: '複製失敗：' + (err instanceof Error ? err.message : '未知錯誤')
      });
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setPastedText(text);
      setStatus({
        type: 'success',
        message: '已從剪貼簿貼上文字！'
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: '貼上失敗：' + (err instanceof Error ? err.message : '未知錯誤')
      });
    }
  };

  const codeExample = `// 寫入剪貼簿
await navigator.clipboard.writeText('要複製的文字');

// 從剪貼簿讀取
const text = await navigator.clipboard.readText();

// 複製圖片或其他格式（需要額外權限）
const imageBlob = await navigator.clipboard.read();

// 寫入多種格式
await navigator.clipboard.write([
  new ClipboardItem({
    'text/plain': new Blob(['Hello World'], { type: 'text/plain' }),
    'image/png': imageBlob
  })
]);`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Clipboard API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            要複製的文字
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              placeholder="輸入要複製的文字"
            />
            <button
              onClick={handleCopy}
              disabled={!text}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              複製
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            從剪貼簿貼上
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={pastedText}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
              placeholder="點擊貼上按鈕從剪貼簿讀取文字"
            />
            <button
              onClick={handlePaste}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              貼上
            </button>
          </div>
        </div>

        {status && (
          <div className={`p-4 rounded-md ${
            status.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-2">
              {status.type === 'success' ? (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {status.message}
            </div>
          </div>
        )}
      </div>
    </DemoModal>
  );
};

export default ClipboardDemo; 