import React, { useState } from 'react';
import DemoModal from '../DemoModal';

interface GeolocationDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

const GeolocationDemo: React.FC<GeolocationDemoProps> = ({ isOpen, onClose }) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('您的瀏覽器不支援地理位置功能');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
        setLoading(false);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('使用者拒絕提供地理位置權限');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('無法取得地理位置資訊');
            break;
          case error.TIMEOUT:
            setError('請求地理位置超時');
            break;
          default:
            setError('發生未知錯誤');
        }
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const codeExample = `// 檢查瀏覽器支援
if (navigator.geolocation) {
  // 取得當前位置
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const accuracy = position.coords.accuracy;
    },
    (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.error('使用者拒絕提供地理位置權限');
          break;
        case error.POSITION_UNAVAILABLE:
          console.error('無法取得地理位置資訊');
          break;
        case error.TIMEOUT:
          console.error('請求地理位置超時');
          break;
      }
    },
    {
      enableHighAccuracy: true, // 使用高精確度
      timeout: 5000,           // 逾時時間（毫秒）
      maximumAge: 0           // 快取時間（毫秒）
    }
  );
}`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Geolocation API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div className="flex justify-center">
          <button
            onClick={getLocation}
            disabled={loading}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                取得位置中...
              </>
            ) : (
              '取得目前位置'
            )}
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

        {location && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <h5 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              位置資訊
            </h5>
            <div className="space-y-2 text-green-700">
              <p className="flex items-center gap-2">
                <span className="font-medium">緯度：</span>
                <span>{location.latitude}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium">經度：</span>
                <span>{location.longitude}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium">精確度：</span>
                <span>{Math.round(location.accuracy)} 公尺</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium">時間戳記：</span>
                <span>{new Date(location.timestamp).toLocaleString()}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </DemoModal>
  );
};

export default GeolocationDemo; 