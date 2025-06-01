import React, { useState } from 'react';
import DemoModal from '../DemoModal';

interface BadgingDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const BadgingDemo: React.FC<BadgingDemoProps> = ({ isOpen, onClose }) => {
  const [badgeCount, setBadgeCount] = useState<number>(0);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  // 檢查瀏覽器是否支援 Badging API
  React.useEffect(() => {
    setIsSupported('setAppBadge' in navigator);
  }, []);

  // 設置標記數字
  const setBadge = async () => {
    try {
      if ('setAppBadge' in navigator) {
        await navigator.setAppBadge(badgeCount);
      }
    } catch (error) {
      console.error('設置標記失敗:', error);
    }
  };

  // 清除標記
  const clearBadge = async () => {
    try {
      if ('clearAppBadge' in navigator) {
        await navigator.clearAppBadge();
        setBadgeCount(0);
      }
    } catch (error) {
      console.error('清除標記失敗:', error);
    }
  };

  const codeExample = `
// 檢查瀏覽器支援
if ('setAppBadge' in navigator) {
  // 設置標記數字
  await navigator.setAppBadge(42);
  
  // 清除標記
  await navigator.clearAppBadge();
}

// 使用 Notification API 時自動更新標記
const notification = new Notification('新訊息', {
  badge: '/path/to/badge.png'  // 設置標記圖示
});
`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Badging API 示範"
      description="Badging API 允許網頁應用程式在其圖示上顯示標記，通常用於顯示未讀訊息數量或通知數量。"
    >
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-md">
            <p className="text-yellow-700">
              注意：Badging API 目前主要支援在 PWA 或已安裝的網頁應用程式中使用。
              在普通網頁中可能無法看到效果。
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">瀏覽器支援狀態：</h3>
            <p className={isSupported ? "text-green-600" : "text-red-600"}>
              {isSupported ? "✓ 支援 Badging API" : "✗ 不支援 Badging API"}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">示範操作：</h3>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={badgeCount}
                onChange={(e) => setBadgeCount(Number(e.target.value))}
                className="border rounded px-2 py-1 w-20"
                min="0"
              />
              <button
                onClick={setBadge}
                disabled={!isSupported}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              >
                設置標記
              </button>
              <button
                onClick={clearBadge}
                disabled={!isSupported}
                className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              >
                清除標記
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">程式碼範例：</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              <code>{codeExample}</code>
            </pre>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">使用場景：</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>顯示未讀訊息數量</li>
              <li>顯示待處理的通知數量</li>
              <li>顯示購物車中的商品數量</li>
              <li>顯示待辦事項的數量</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">注意事項：</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>需要在 HTTPS 環境下使用</li>
              <li>僅在 PWA 或已安裝的網頁應用程式中有效</li>
              <li>不同作業系統的顯示方式可能不同</li>
              <li>某些平台可能不支援或限制使用</li>
            </ul>
          </div>
        </div>
    </DemoModal>
  );
};

export default BadgingDemo; 