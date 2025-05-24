import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface NetworkInfoDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NetworkInfo {
  type: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

const NetworkInfoDemo: React.FC<NetworkInfoDemoProps> = ({ isOpen, onClose }) => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // @ts-expect-error: Network Information API 類型定義
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (!connection) {
      setError('此瀏覽器不支援 Network Information API');
      return;
    }

    const updateNetworkInfo = () => {
      setNetworkInfo({
        type: connection.type || '未知',
        effectiveType: connection.effectiveType || '未知',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false
      });
    };

    updateNetworkInfo();

    connection.addEventListener('change', updateNetworkInfo);
    return () => {
      connection.removeEventListener('change', updateNetworkInfo);
    };
  }, []);

  const getConnectionTypeIcon = (type: string) => {
    switch (type) {
      case 'wifi':
        return (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1.41 1.13L0 2.54l4.39 4.39C2.69 8.31 1.26 9.92 0 11.68c2.44 3.26 6.09 5.31 10 5.31 1.47 0 2.89-.24 4.22-.68l3.67 3.67 1.41-1.41L1.41 1.13zM12 15c-2.21 0-4-1.79-4-4 0-.73.21-1.41.56-2l5.44 5.44c-.59.35-1.27.56-2 .56zm-7.2-9.2l1.94 1.94C4.98 8.83 3.34 10.14 2 11.68c1.66 2.22 3.96 3.81 6.57 4.29l1.91 1.91C8.27 18.44 5.61 17.56 3.43 16 1.82 14.81.55 13.31 0 11.68c1.2-1.61 2.83-3.05 4.8-4.08zm17.09 5.88c-.42.56-.89 1.09-1.41 1.58l1.41 1.41c.78-.71 1.48-1.5 2.1-2.36-2.44-3.26-6.09-5.31-10-5.31l-2.1.18 1.51 1.51L12 9c2.21 0 4 1.79 4 4 0 .73-.21 1.41-.56 2l2.05 2.05c.98-.86 1.81-1.91 2.4-3.05v-.01z" />
          </svg>
        );
      case 'cellular':
        return (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 4h3v16h-3V4zM5 14h3v6H5v-6zm6-5h3v11h-3V9z" />
          </svg>
        );
      case 'ethernet':
        return (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 15h2v3h2v-3h2v3h2v-3h2v3h2v-3h1c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2zm0-11h10v7H7V4z" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        );
    }
  };

  const getEffectiveTypeColor = (type: string) => {
    switch (type) {
      case 'slow-2g':
        return 'text-red-500';
      case '2g':
        return 'text-orange-500';
      case '3g':
        return 'text-yellow-500';
      case '4g':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const codeExample = `// 獲取網路連線資訊
const connection = navigator.connection || 
                  navigator.mozConnection || 
                  navigator.webkitConnection;

// 監聽網路狀態變化
connection.addEventListener('change', () => {
  console.log('連線類型：', connection.type);
  console.log('有效連線類型：', connection.effectiveType);
  console.log('下載速度：', connection.downlink, 'Mbps');
  console.log('往返時間：', connection.rtt, 'ms');
  console.log('省流量模式：', connection.saveData);
});`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Network Information API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        {error ? (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center gap-2 text-yellow-700">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        ) : networkInfo ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="text-blue-500">
                  {getConnectionTypeIcon(networkInfo.type)}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">連線類型</h4>
                  <p className="text-lg font-semibold text-gray-900">
                    {networkInfo.type === 'unknown' ? '未知' : networkInfo.type}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-500 mb-1">有效連線類型</h4>
              <p className={`text-lg font-semibold ${getEffectiveTypeColor(networkInfo.effectiveType)}`}>
                {networkInfo.effectiveType.toUpperCase()}
              </p>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-500 mb-1">下載速度</h4>
              <p className="text-lg font-semibold text-gray-900">
                {networkInfo.downlink} Mbps
              </p>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-500 mb-1">往返時間 (RTT)</h4>
              <p className="text-lg font-semibold text-gray-900">
                {networkInfo.rtt} ms
              </p>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-500 mb-1">省流量模式</h4>
              <p className="text-lg font-semibold text-gray-900">
                {networkInfo.saveData ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    開啟
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-600">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    關閉
                  </span>
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-32">
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              載入中...
            </div>
          </div>
        )}
      </div>
    </DemoModal>
  );
};

export default NetworkInfoDemo; 