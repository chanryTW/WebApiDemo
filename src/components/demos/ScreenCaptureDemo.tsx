import React, { useState, useRef } from 'react';
import DemoModal from '../DemoModal';

interface ScreenCaptureDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScreenCaptureDemo: React.FC<ScreenCaptureDemoProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // 設置錄影
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: 'video/webm'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = '螢幕錄影.webm';
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError('');

      // 監聽串流結束
      stream.getVideoTracks()[0].onended = () => {
        stopCapture();
      };
    } catch (err) {
      setError('無法啟動螢幕擷取：' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const stopCapture = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const codeExample = `// 啟動螢幕擷取
const stream = await navigator.mediaDevices.getDisplayMedia({
  video: {
    cursor: 'always'
  },
  audio: false
});

// 將串流顯示在視訊元素中
videoElement.srcObject = stream;

// 開始錄影
const mediaRecorder = new MediaRecorder(stream);
const chunks = [];

mediaRecorder.ondataavailable = (e) => {
  if (e.data.size > 0) {
    chunks.push(e.data);
  }
};

mediaRecorder.onstop = () => {
  const blob = new Blob(chunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  // 下載影片
  const a = document.createElement('a');
  a.href = url;
  a.download = '螢幕錄影.webm';
  a.click();
};

mediaRecorder.start();

// 停止擷取
stream.getTracks().forEach(track => track.stop());`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Screen Capture API 演示"
      description="展示螢幕內容擷取和錄製功能。"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex justify-center gap-4">
          {!isRecording ? (
            <button
              onClick={startCapture}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              開始擷取螢幕
            </button>
          ) : (
            <button
              onClick={stopCapture}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              停止擷取
            </button>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-center">
            {error}
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p>提示：</p>
          <ul className="list-disc list-inside">
            <li>點擊「開始擷取螢幕」後選擇要分享的內容</li>
            <li>停止分享後會自動下載錄製的影片</li>
            <li>影片格式為 WebM，支援大部分現代瀏覽器</li>
          </ul>
        </div>
      </div>
    </DemoModal>
  );
};

export default ScreenCaptureDemo; 