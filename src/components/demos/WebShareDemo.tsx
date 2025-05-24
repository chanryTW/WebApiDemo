import React, { useState } from 'react';
import DemoModal from '../DemoModal';

interface WebShareDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const WebShareDemo: React.FC<WebShareDemoProps> = ({ isOpen, onClose }) => {
  const [error, setError] = useState<string>('');
  const [shareResult, setShareResult] = useState<string>('');
  const [title, setTitle] = useState<string>('分享測試標題');
  const [text, setText] = useState<string>('這是一段要分享的測試文字內容。');
  const [url, setUrl] = useState<string>(window.location.href);

  const checkShareSupport = () => {
    if (!navigator.share) {
      setError('您的瀏覽器不支援 Web Share API');
      return false;
    }
    return true;
  };

  const shareContent = async () => {
    if (!checkShareSupport()) return;

    try {
      setError('');
      setShareResult('');

      await navigator.share({
        title,
        text,
        url
      });

      setShareResult('內容已成功分享！');
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError('分享被取消');
        } else {
          setError(error.message);
        }
      } else {
        setError('分享過程中發生錯誤');
      }
    }
  };

  const shareFiles = async () => {
    if (!checkShareSupport()) return;

    try {
      setError('');
      setShareResult('');

      // 檢查是否支援檔案分享
      if (!navigator.canShare || !navigator.canShare({ files: [] })) {
        throw new Error('您的瀏覽器不支援檔案分享');
      }

      // 建立示範圖片
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 150;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#3B82F6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Web Share API Demo', canvas.width / 2, canvas.height / 2);
      }

      // 將 canvas 轉換為 blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png');
      });

      // 建立檔案
      const file = new File([blob], 'web-share-demo.png', { type: 'image/png' });

      // 分享檔案
      await navigator.share({
        files: [file],
        title,
        text
      });

      setShareResult('檔案已成功分享！');
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError('分享被取消');
        } else {
          setError(error.message);
        }
      } else {
        setError('分享過程中發生錯誤');
      }
    }
  };

  const codeExample = `// 檢查是否支援分享功能
if (navigator.share) {
  try {
    // 分享文字內容
    await navigator.share({
      title: '分享標題',
      text: '分享文字',
      url: 'https://example.com'
    });
    
    // 分享檔案
    if (navigator.canShare && navigator.canShare({ files })) {
      await navigator.share({
        files,
        title: '分享標題',
        text: '分享文字'
      });
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('分享被取消');
    } else {
      console.error('分享失敗:', err);
    }
  }
} else {
  console.log('瀏覽器不支援分享功能');
}`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Web Share API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div className="p-6 border rounded-lg bg-white space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                標題
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="輸入分享標題"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                文字內容
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
                rows={3}
                placeholder="輸入分享內容"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="輸入分享連結"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={shareContent}
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
            >
              分享內容
            </button>
            <button
              onClick={shareFiles}
              className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600"
            >
              分享圖片
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {shareResult && (
            <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
              {shareResult}
            </div>
          )}
        </div>

        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            說明
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              此演示展示了 Web Share API 的功能：
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>分享文字內容、標題和 URL</li>
              <li>分享檔案（示範圖片）</li>
              <li>檢查瀏覽器支援狀態</li>
              <li>處理分享結果和錯誤</li>
            </ul>
            <p className="mt-4 text-yellow-600">
              注意：Web Share API 僅在支援的平台和瀏覽器上可用，且通常需要 HTTPS 連接。
            </p>
          </div>
        </div>
      </div>
    </DemoModal>
  );
};

export default WebShareDemo; 