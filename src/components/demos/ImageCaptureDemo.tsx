import React, { useState, useEffect, useRef } from 'react';
import DemoModal from '../DemoModal';

interface ImageCaptureDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CaptureLog {
  timestamp: number;
  message: string;
  type: 'info' | 'error' | 'success';
}

// 添加型別定義
declare global {
  interface Window {
    ImageCapture: typeof ImageCapture;
  }
  class ImageCapture {
    constructor(track: MediaStreamTrack);
    takePhoto(): Promise<Blob>;
    getPhotoCapabilities(): Promise<PhotoCapabilities>;
    setOptions(options: PhotoSettings): Promise<void>;
  }
  interface PhotoCapabilities {
    brightness?: {
      min: number;
      max: number;
      step: number;
    };
    contrast?: {
      min: number;
      max: number;
      step: number;
    };
  }
  interface PhotoSettings {
    brightness?: number;
    contrast?: number;
  }
}

const ImageCaptureDemo: React.FC<ImageCaptureDemoProps> = ({ isOpen, onClose }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [logs, setLogs] = useState<CaptureLog[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [imageCapture, setImageCapture] = useState<ImageCapture | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 檢查瀏覽器是否支援 ImageCapture API
    setIsSupported('ImageCapture' in window);
  }, []);

  useEffect(() => {
    return () => {
      // 清理資源
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const track = mediaStream.getVideoTracks()[0];
      const imageCaptureInstance = new ImageCapture(track);
      setImageCapture(imageCaptureInstance);
      
      addLog('相機已啟動', 'success');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      addLog(`無法啟動相機: ${errorMessage}`, 'error');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setImageCapture(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      addLog('相機已關閉', 'info');
    }
  };

  const takePhoto = async () => {
    if (!imageCapture) return;

    try {
      const blob = await imageCapture.takePhoto();
      const url = URL.createObjectURL(blob);
      setCapturedImage(url);
      addLog('已拍攝照片', 'success');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      addLog(`拍攝照片失敗: ${errorMessage}`, 'error');
    }
  };

  const adjustCamera = async () => {
    if (!imageCapture) return;

    try {
      const capabilities = await imageCapture.getPhotoCapabilities();
      
      await imageCapture.setOptions({
        brightness: capabilities.brightness?.max ?? 0,
        contrast: capabilities.contrast?.max ?? 0
      });
      
      addLog('已調整相機設定', 'success');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      addLog(`調整相機設定失敗: ${errorMessage}`, 'error');
    }
  };

  const addLog = (message: string, type: 'info' | 'error' | 'success') => {
    setLogs(prev => [{
      timestamp: Date.now(),
      message,
      type
    }, ...prev].slice(0, 5));
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const codeExample = `// 取得相機串流
const stream = await navigator.mediaDevices.getUserMedia({
  video: { facingMode: 'user' }
});

// 建立 ImageCapture 實例
const track = stream.getVideoTracks()[0];
const imageCapture = new ImageCapture(track);

// 拍攝照片
const blob = await imageCapture.takePhoto();
const url = URL.createObjectURL(blob);
const img = new Image();
img.src = url;

// 取得相機功能
const capabilities = await imageCapture.getPhotoCapabilities();
console.log('相機功能:', capabilities);

// 調整相機設定
await imageCapture.setOptions({
  brightness: capabilities.brightness.max,
  contrast: capabilities.contrast.max
});`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="ImageCapture API 展示"
      description="此 API 提供了進階的相機控制功能，包括拍照和調整相機設定。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        {!isSupported ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
            ⚠️ 您的瀏覽器不支援 ImageCapture API
          </div>
        ) : (
          <>
            <div className="flex space-x-2">
              <button
                onClick={startCamera}
                disabled={!!stream}
                className={`px-4 py-2 rounded ${
                  stream
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {stream ? '相機已開啟' : '開啟相機'}
              </button>
              <button
                onClick={stopCamera}
                disabled={!stream}
                className={`px-4 py-2 rounded ${
                  !stream
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                關閉相機
              </button>
              <button
                onClick={takePhoto}
                disabled={!imageCapture}
                className={`px-4 py-2 rounded ${
                  !imageCapture
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                拍照
              </button>
              <button
                onClick={adjustCamera}
                disabled={!imageCapture}
                className={`px-4 py-2 rounded ${
                  !imageCapture
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                調整設定
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-bold mb-2">相機預覽：</h4>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-bold mb-2">拍攝結果：</h4>
                {capturedImage ? (
                  <img
                    src={capturedImage}
                    alt="拍攝的照片"
                    className="w-full rounded-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    尚未拍攝照片
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-bold mb-2">操作日誌：</h4>
              {logs.length === 0 ? (
                <p className="text-gray-500">尚無日誌</p>
              ) : (
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded ${
                        log.type === 'error'
                          ? 'bg-red-100'
                          : log.type === 'success'
                          ? 'bg-green-100'
                          : 'bg-white'
                      }`}
                    >
                      <span className="text-sm text-gray-500">
                        {formatTime(log.timestamp)}
                      </span>
                      <p
                        className={
                          log.type === 'error'
                            ? 'text-red-600'
                            : log.type === 'success'
                            ? 'text-green-600'
                            : ''
                        }
                      >
                        {log.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-sm text-gray-600">
              <p>* ImageCapture API 的應用場景：</p>
              <ul className="list-disc list-inside ml-4">
                <li>網頁相機應用</li>
                <li>視訊會議截圖</li>
                <li>文件掃描</li>
                <li>相機參數調整</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </DemoModal>
  );
};

export default ImageCaptureDemo; 