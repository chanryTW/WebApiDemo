import React, { useEffect, useState } from 'react';
import DemoModal from '../DemoModal';
interface AmbientLightDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const AmbientLightDemo: React.FC<AmbientLightDemoProps> = ({ isOpen, onClose }) => {
  const [illuminance, setIlluminance] = useState<number | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string>('');
  const [permission, setPermission] = useState<PermissionState>('prompt');

  useEffect(() => {
    // 檢查瀏覽器支援
    if (!('AmbientLightSensor' in window)) {
      setIsSupported(false);
      setError('您的瀏覽器不支援 Ambient Light Sensor API');
      return;
    }

    // 檢查權限
    navigator.permissions.query({ name: 'ambient-light-sensor' })
      .then(result => {
        setPermission(result.state);
        result.addEventListener('change', () => {
          setPermission(result.state);
        });
      })
      .catch(err => {
        setError('無法檢查感測器權限');
        console.error(err);
      });

    // 初始化感測器
    try {
      const sensor = new window.AmbientLightSensor();
      
      sensor.addEventListener('reading', () => {
        setIlluminance(sensor.illuminance);
      });

      sensor.addEventListener('error', (event: Error) => {
        setError(`感測器錯誤：${event.message}`);
      });

      sensor.start();

      return () => {
        sensor.stop();
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : '初始化感測器時發生錯誤');
    }
  }, []);

  const getLightLevel = (value: number): string => {
    if (value < 50) return '非常暗';
    if (value < 100) return '暗';
    if (value < 400) return '室內照明';
    if (value < 1000) return '陰天';
    if (value < 10000) return '晴天';
    if (value < 50000) return '直射陽光';
    return '極強光線';
  };

  const codeExample = `
// 檢查瀏覽器支援
if ('AmbientLightSensor' in window) {
  // 請求權限
  navigator.permissions.query({ name: 'ambient-light-sensor' })
    .then(result => {
      if (result.state === 'granted') {
        // 創建感測器實例
        const sensor = new AmbientLightSensor();
        
        // 監聽讀數變化
        sensor.addEventListener('reading', () => {
          console.log('環境光線強度：', sensor.illuminance, 'lux');
        });

        // 監聽錯誤
        sensor.addEventListener('error', error => {
          console.error('感測器錯誤：', error);
        });

        // 啟動感測器
        sensor.start();
      }
    });
}

// 使用選項配置感測器
const sensor = new AmbientLightSensor({
  frequency: 1, // 每秒更新一次
});

// 停止感測器
sensor.stop();

// 檢查感測器是否在運行
console.log('感測器運行狀態：', sensor.activated);`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Ambient Light Sensor API Demo"
      description="展示如何使用 Ambient Light Sensor API 來讀取環境光線強度。這個 API 允許網頁應用程式獲取裝置周圍的光線強度資訊。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        {!isSupported ? (
          <div className="text-red-500">
            {error}
          </div>
        ) : (
          <>
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">環境光線感測器</h3>
                  <p className="text-sm text-gray-600">
                    權限狀態：
                    <span className={`
                      ${permission === 'granted' ? 'text-green-600' : ''}
                      ${permission === 'denied' ? 'text-red-600' : ''}
                      ${permission === 'prompt' ? 'text-yellow-600' : ''}
                    `}>
                      {permission === 'granted' ? '已授權' : ''}
                      {permission === 'denied' ? '已拒絕' : ''}
                      {permission === 'prompt' ? '未決定' : ''}
                    </span>
                  </p>
                </div>
                <div className={`
                  w-3 h-3 rounded-full
                  ${permission === 'granted' ? 'bg-green-500' : ''}
                  ${permission === 'denied' ? 'bg-red-500' : ''}
                  ${permission === 'prompt' ? 'bg-yellow-500' : ''}
                `} />
              </div>

              {illuminance !== null && permission === 'granted' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-600">光線強度：</span>
                    <span className="text-2xl font-mono">{illuminance.toFixed(1)} lux</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{
                        width: `${Math.min((illuminance / 500) * 100, 100)}%`
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 text-right">
                    光線環境：{getLightLevel(illuminance)}
                  </p>
                </div>
              )}

              {error && (
                <div className="text-red-500 text-sm">
                  {error}
                </div>
              )}
            </div>

            <div className="text-sm text-gray-600">
              <p>應用場景：</p>
              <ul className="list-disc list-inside space-y-1">
                <li>自動調整螢幕亮度</li>
                <li>根據環境光線調整介面主題</li>
                <li>相機應用的曝光控制</li>
                <li>智慧家居光線控制</li>
                <li>節能應用</li>
              </ul>
            </div>

            <div className="text-sm text-gray-600">
              <p>注意事項：</p>
              <ul className="list-disc list-inside space-y-1">
                <li>需要使用支援的裝置和瀏覽器</li>
                <li>需要用戶授權存取感測器</li>
                <li>某些裝置可能不支援或讀數不準確</li>
                <li>建議在 HTTPS 環境下使用</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </DemoModal>
  );
};

export default AmbientLightDemo; 