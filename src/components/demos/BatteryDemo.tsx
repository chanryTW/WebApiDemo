import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface BatteryDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BatteryStatus {
  charging: boolean;
  level: number;
  chargingTime: number;
  dischargingTime: number;
}

const BatteryDemo: React.FC<BatteryDemoProps> = ({ isOpen, onClose }) => {
  const [batteryStatus, setBatteryStatus] = useState<BatteryStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getBatteryInfo = async () => {
      try {
        // @ts-ignore: Battery API 類型定義
        const battery = await navigator.getBattery();
        
        const updateBatteryInfo = () => {
          setBatteryStatus({
            charging: battery.charging,
            level: battery.level,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime
          });
        };

        // 初始化電池狀態
        updateBatteryInfo();

        // 監聽電池狀態變化
        battery.addEventListener('chargingchange', updateBatteryInfo);
        battery.addEventListener('levelchange', updateBatteryInfo);
        battery.addEventListener('chargingtimechange', updateBatteryInfo);
        battery.addEventListener('dischargingtimechange', updateBatteryInfo);

        return () => {
          battery.removeEventListener('chargingchange', updateBatteryInfo);
          battery.removeEventListener('levelchange', updateBatteryInfo);
          battery.removeEventListener('chargingtimechange', updateBatteryInfo);
          battery.removeEventListener('dischargingtimechange', updateBatteryInfo);
        };
      } catch (err) {
        setError('無法獲取電池資訊：' + (err instanceof Error ? err.message : '此瀏覽器可能不支援 Battery API'));
      }
    };

    getBatteryInfo();
  }, []);

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return '無法計算';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} 小時 ${minutes} 分鐘`;
  };

  const codeExample = `// 獲取電池資訊
const battery = await navigator.getBattery();

// 監聽電池狀態變化
battery.addEventListener('chargingchange', () => {
  console.log('充電狀態：', battery.charging);
});

battery.addEventListener('levelchange', () => {
  console.log('電量：', battery.level * 100 + '%');
});

battery.addEventListener('chargingtimechange', () => {
  console.log('充電完成時間：', battery.chargingTime);
});

battery.addEventListener('dischargingtimechange', () => {
  console.log('剩餘使用時間：', battery.dischargingTime);
});`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Battery API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        {error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 text-red-700">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        ) : batteryStatus ? (
          <div className="space-y-4">
            <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`absolute inset-y-0 left-0 transition-all duration-1000 ${
                  batteryStatus.charging ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${batteryStatus.level * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                {Math.round(batteryStatus.level * 100)}%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">充電狀態</h4>
                <p className="text-lg font-semibold text-gray-900">
                  {batteryStatus.charging ? (
                    <span className="flex items-center gap-2 text-green-600">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      正在充電
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-blue-600">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 11a1 1 0 011-1h2.5a1 1 0 01.94.658l1.2 3.36a1 1 0 01-.94 1.342H5V16a1 1 0 01-2 0v-1H2a1 1 0 01-1-1v-3zm17 0a1 1 0 00-1-1h-2.5a1 1 0 00-.94.658l-1.2 3.36a1 1 0 00.94 1.342H15v1a1 1 0 102 0v-1h1a1 1 0 001-1v-3z" />
                      </svg>
                      使用電池中
                    </span>
                  )}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  {batteryStatus.charging ? '充電完成時間' : '剩餘使用時間'}
                </h4>
                <p className="text-lg font-semibold text-gray-900">
                  {batteryStatus.charging 
                    ? formatTime(batteryStatus.chargingTime)
                    : formatTime(batteryStatus.dischargingTime)
                  }
                </p>
              </div>
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

export default BatteryDemo; 