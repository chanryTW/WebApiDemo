import React, { useState } from 'react';
import DemoModal from '../DemoModal';

interface WebShareDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const WebShareDemo: React.FC<WebShareDemoProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('分享標題');
  const [text, setText] = useState('分享內容');
  const [url, setUrl] = useState(window.location.href);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const isSupported = 'share' in navigator;

  const handleShare = async () => {
    if (!isSupported) {
      setError('您的瀏覽器不支援 Web Share API');
      return;
    }

    try {
      await navigator.share({
        title,
        text,
        url
      });
      setSuccess('分享成功！');
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      if (err instanceof Error) {
        // 用戶取消分享不顯示錯誤
        if (err.name === 'AbortError') return;
        setError(err.message);
      } else {
        setError('分享時發生錯誤');
      }
      setSuccess('');
    }
  };

  const codeExample = `// 檢查瀏覽器支援
if (navigator.share) {
  try {
    await navigator.share({
      title: '分享標題',
      text: '分享內容',
      url: 'https://example.com'
    });
    console.log('分享成功');
  } catch (err) {
    if (err.name === 'AbortError') {
      // 用戶取消分享
      return;
    }
    console.error('分享失敗:', err);
  }
} else {
  console.log('瀏覽器不支援 Web Share API');
}`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Web Share API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分享標題
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分享內容
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分享連結
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            />
          </div>
        </div>

        {!isSupported && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center gap-2 text-yellow-700">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              您的瀏覽器不支援 Web Share API
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

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2 text-green-700">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleShare}
            disabled={!isSupported}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            分享
          </button>
        </div>
      </div>
    </DemoModal>
  );
};

export default WebShareDemo; 