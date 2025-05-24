import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface DeviceMotionDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MotionData {
  acceleration: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    alpha: number;
    beta: number;
    gamma: number;
  };
}

const DeviceMotionDemo: React.FC<DeviceMotionDemoProps> = ({ isOpen, onClose }) => {
  const [motionData, setMotionData] = useState<MotionData>({
    acceleration: { x: 0, y: 0, z: 0 },
    rotation: { alpha: 0, beta: 0, gamma: 0 }
  });
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!window.DeviceMotionEvent || !window.DeviceOrientationEvent) {
      setIsSupported(false);
      return;
    }

    const handleMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (acceleration) {
        setMotionData(prev => ({
          ...prev,
          acceleration: {
            x: acceleration.x ?? 0,
            y: acceleration.y ?? 0,
            z: acceleration.z ?? 0
          }
        }));
      }
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      setMotionData(prev => ({
        ...prev,
        rotation: {
          alpha: event.alpha ?? 0,
          beta: event.beta ?? 0,
          gamma: event.gamma ?? 0
        }
      }));
    };

    const requestPermission = async () => {
      try {
        // @ts-expect-error: DeviceMotionEvent 的類型定義中可能沒有 requestPermission
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
          // @ts-expect-error: DeviceMotionEvent 的類型定義中可能沒有 requestPermission
          const permission = await DeviceMotionEvent.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
            window.addEventListener('deviceorientation', handleOrientation);
          } else {
            setError('使用者拒絕了動作感應權限');
          }
        } else {
          window.addEventListener('devicemotion', handleMotion);
          window.addEventListener('deviceorientation', handleOrientation);
        }
      } catch (err) {
        setError('請求權限失敗：' + (err instanceof Error ? err.message : String(err)));
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const formatNumber = (num: number) => {
    return num.toFixed(2);
  };

  const codeExample = `// 監聽裝置動作事件
window.addEventListener('devicemotion', (event) => {
  const acceleration = event.accelerationIncludingGravity;
  console.log('加速度：', {
    x: acceleration.x,
    y: acceleration.y,
    z: acceleration.z
  });
});

// 監聽裝置方向事件
window.addEventListener('deviceorientation', (event) => {
  console.log('旋轉：', {
    alpha: event.alpha,  // z 軸旋轉角度 (0-360)
    beta: event.beta,    // x 軸旋轉角度 (-180-180)
    gamma: event.gamma   // y 軸旋轉角度 (-90-90)
  });
});

// 在 iOS 13+ 上請求權限
if (typeof DeviceMotionEvent.requestPermission === 'function') {
  const permission = await DeviceMotionEvent.requestPermission();
  if (permission === 'granted') {
    // 開始監聽事件
  }
}`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Device Motion API 演示"
      description="展示裝置的動作感應和方向感應功能。"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        {!isSupported ? (
          <div className="text-red-500 text-center">
            您的裝置或瀏覽器不支援動作感應功能
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">加速度感應</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>X 軸：</span>
                    <span>{formatNumber(motionData.acceleration.x)} m/s²</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{
                        width: `${Math.min(Math.abs(motionData.acceleration.x) * 10, 100)}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span>Y 軸：</span>
                    <span>{formatNumber(motionData.acceleration.y)} m/s²</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{
                        width: `${Math.min(Math.abs(motionData.acceleration.y) * 10, 100)}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span>Z 軸：</span>
                    <span>{formatNumber(motionData.acceleration.z)} m/s²</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all"
                      style={{
                        width: `${Math.min(Math.abs(motionData.acceleration.z) * 10, 100)}%`
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">方向感應</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Alpha (Z)：</span>
                    <span>{formatNumber(motionData.rotation.alpha)}°</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all"
                      style={{
                        width: `${(motionData.rotation.alpha / 360) * 100}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span>Beta (X)：</span>
                    <span>{formatNumber(motionData.rotation.beta)}°</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 transition-all"
                      style={{
                        width: `${((motionData.rotation.beta + 180) / 360) * 100}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span>Gamma (Y)：</span>
                    <span>{formatNumber(motionData.rotation.gamma)}°</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-full bg-pink-500 transition-all"
                      style={{
                        width: `${((motionData.rotation.gamma + 90) / 180) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>提示：</p>
              <ul className="list-disc list-inside">
                <li>請拿起您的行動裝置並移動，以查看數值變化</li>
                <li>如果使用電腦，可能無法看到數值變化</li>
                <li>某些瀏覽器可能需要允許動作感應權限</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </DemoModal>
  );
};

export default DeviceMotionDemo; 