import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface IdleDetectionDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IdleState {
  userState: string;
  screenState: string;
  timestamp: number;
}

const IdleDetectionDemo: React.FC<IdleDetectionDemoProps> = ({ isOpen, onClose }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<PermissionState>('prompt');
  const [idleStates, setIdleStates] = useState<IdleState[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    // 檢查瀏覽器支援
    if ('IdleDetector' in window) {
      setIsSupported(true);
      // 檢查權限狀態
      navigator.permissions.query({ name: 'idle-detection' as PermissionName })
        .then(result => {
          setPermission(result.state);
          result.addEventListener('change', () => {
            setPermission(result.state);
          });
        });
    }
  }, []);

  const startMonitoring = async () => {
    if (!isSupported) return;

    try {
      // 請求權限
      const permissionResult = await navigator.permissions.query({ name: 'idle-detection' as PermissionName });
      if (permissionResult.state === 'granted') {
        setIsMonitoring(true);

        // 建立 IdleDetector 實例
        const idleDetector = new (window as any).IdleDetector();

        // 監聽狀態變化
        idleDetector.addEventListener('change', () => {
          const newState: IdleState = {
            userState: idleDetector.userState,
            screenState: idleDetector.screenState,
            timestamp: Date.now()
          };
          setIdleStates(prev => [newState, ...prev].slice(0, 5));
        });

        // 開始監測
        await idleDetector.start({
          threshold: 60000, // 60 秒後判定為閒置
          signal: new AbortController().signal
        });
      }
    } catch (error) {
      console.error('Idle Detection 錯誤:', error);
    }
  };

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getStateDescription = (state: IdleState): string => {
    const userStateText = state.userState === 'idle' ? '閒置' : '活動中';
    const screenStateText = state.screenState === 'locked' ? '已鎖定' : '未鎖定';
    return `使用者: ${userStateText}, 螢幕: ${screenStateText}`;
  };

  const codeExample = `// 檢查瀏覽器支援
if ('IdleDetector' in window) {
  try {
    // 請求權限
    const state = await navigator.permissions
      .query({ name: 'idle-detection' });
    
    if (state.state === 'granted') {
      // 建立 IdleDetector 實例
      const idleDetector = new IdleDetector();
      
      // 監聽狀態變化
      idleDetector.addEventListener('change', () => {
        console.log('使用者狀態:', idleDetector.userState);
        console.log('螢幕狀態:', idleDetector.screenState);
      });
      
      // 開始監測
      await idleDetector.start({
        threshold: 60000, // 60 秒後判定為閒置
        signal: new AbortController().signal
      });
    }
  } catch (error) {
    console.error('Idle Detection 錯誤:', error);
  }
}`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Idle Detection API 展示"
      description="此 API 用於檢測使用者是否處於閒置狀態，可用於實作節能模式、自動登出等功能。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-bold mb-2">API 狀態：</h4>
          <div className="space-y-2">
            <p>瀏覽器支援: {isSupported ? '✅ 支援' : '❌ 不支援'}</p>
            <p>權限狀態: {
              permission === 'granted' ? '✅ 已授權' :
              permission === 'denied' ? '❌ 已拒絕' :
              '⚠️ 未決定'
            }</p>
          </div>
        </div>

        {isSupported && permission === 'granted' && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-bold mb-2">閒置監測：</h4>
            {!isMonitoring ? (
              <button
                onClick={startMonitoring}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                開始監測
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-blue-600">正在監測使用者活動...</p>
                {idleStates.map((state, index) => (
                  <div key={index} className="border-b border-gray-300 pb-2">
                    <p className="font-medium">狀態更新 #{idleStates.length - index}</p>
                    <div className="text-sm text-gray-600">
                      <p>時間: {formatTime(state.timestamp)}</p>
                      <p>{getStateDescription(state)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p>* Idle Detection API 的應用場景：</p>
          <ul className="list-disc list-inside ml-4">
            <li>實作自動登出功能</li>
            <li>暫停非必要的背景任務</li>
            <li>節省系統資源</li>
            <li>調整應用程式行為</li>
          </ul>
        </div>
      </div>
    </DemoModal>
  );
};

export default IdleDetectionDemo; 