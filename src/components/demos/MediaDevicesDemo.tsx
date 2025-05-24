import React, { useState, useRef, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface MediaDevicesDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const MediaDevicesDemo: React.FC<MediaDevicesDemoProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');

  useEffect(() => {
    // 列出所有可用的媒體設備
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
      })
      .catch(err => {
        setError('無法取得媒體設備列表：' + err.message);
      });

    // 組件卸載時停止所有串流
    return () => {
      stopStream();
    };
  }, []);

  const startStream = async () => {
    try {
      // 停止現有的串流
      stopStream();

      // 開始新的串流
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setActiveStream(stream);
      setError('');
    } catch (err: any) {
      setError('無法啟動攝影機：' + err.message);
    }
  };

  const stopStream = () => {
    if (activeStream) {
      activeStream.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setActiveStream(null);
    }
  };

  const handleCameraChange = (deviceId: string) => {
    setSelectedCamera(deviceId);
    if (activeStream) {
      startStream();
    }
  };

  const codeExample = `// 列出所有媒體設備
const devices = await navigator.mediaDevices.enumerateDevices();
const cameras = devices.filter(device => device.kind === 'videoinput');

// 啟動攝影機串流
const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    deviceId: selectedCamera ? { exact: selectedCamera } : undefined
  }
});

// 將串流連接到視訊元素
videoElement.srcObject = stream;

// 停止串流
stream.getTracks().forEach(track => track.stop());`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={() => {
        stopStream();
        onClose();
      }}
      title="Media Devices API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <select
              value={selectedCamera}
              onChange={(e) => handleCameraChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            >
              {devices.map(device => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `攝影機 ${devices.indexOf(device) + 1}`}
                </option>
              ))}
            </select>
            <button
              onClick={activeStream ? stopStream : startStream}
              className={`px-4 py-2 rounded-md text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                activeStream
                  ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
                  : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
              }`}
            >
              {activeStream ? '停止預覽' : '開始預覽'}
            </button>
          </div>

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

          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
            {!activeStream && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                尚未開啟攝影機預覽
              </div>
            )}
          </div>
        </div>
      </div>
    </DemoModal>
  );
};

export default MediaDevicesDemo; 