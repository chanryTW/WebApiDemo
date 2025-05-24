import React, { useRef, useState } from 'react';
import DemoModal from '../DemoModal';

interface PictureInPictureDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const PictureInPictureDemo: React.FC<PictureInPictureDemoProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPiPActive, setIsPiPActive] = useState(false);
  const [error, setError] = useState('');

  const togglePiP = async () => {
    try {
      if (!document.pictureInPictureEnabled) {
        throw new Error('您的瀏覽器不支援畫中畫功能');
      }

      if (!videoRef.current) return;

      if (!document.pictureInPictureElement) {
        await videoRef.current.requestPictureInPicture();
        setIsPiPActive(true);
      } else {
        await document.exitPictureInPicture();
        setIsPiPActive(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '啟動畫中畫模式失敗');
    }
  };

  const codeExample = `// 檢查瀏覽器支援
if (document.pictureInPictureEnabled) {
  // 進入畫中畫模式
  await videoElement.requestPictureInPicture();

  // 監聽畫中畫事件
  videoElement.addEventListener('enterpictureinpicture', (event) => {
    console.log('進入畫中畫模式');
  });

  videoElement.addEventListener('leavepictureinpicture', (event) => {
    console.log('離開畫中畫模式');
  });

  // 退出畫中畫模式
  if (document.pictureInPictureElement) {
    await document.exitPictureInPicture();
  }
}`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Picture-in-Picture API 演示"
      description="展示如何讓視頻在浮動視窗中播放，即使切換到其他標籤頁也能繼續觀看。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}
          </div>
        )}

        <div className="relative">
          <video
            ref={videoRef}
            controls
            className="w-full rounded-lg shadow-lg"
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            onPlay={() => setError('')}
          />
          
          <button
            onClick={togglePiP}
            className={`absolute bottom-4 right-4 px-4 py-2 rounded-md text-white ${
              isPiPActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isPiPActive ? '退出畫中畫' : '開啟畫中畫'}
          </button>
        </div>

        <div className="text-sm text-gray-600">
          <p>提示：</p>
          <ul className="list-disc list-inside">
            <li>點擊播放按鈕開始播放視頻</li>
            <li>點擊「開啟畫中畫」按鈕啟動浮動視窗</li>
            <li>切換到其他標籤頁，視頻將繼續在浮動視窗中播放</li>
            <li>點擊「退出畫中畫」或浮動視窗上的關閉按鈕返回正常模式</li>
          </ul>
        </div>
      </div>
    </DemoModal>
  );
};

export default PictureInPictureDemo; 