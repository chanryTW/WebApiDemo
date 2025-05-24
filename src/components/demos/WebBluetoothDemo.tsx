import React, { useState, useEffect, useCallback } from 'react';
import DemoModal from '../DemoModal';

interface WebBluetoothDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BluetoothDeviceInfo {
  device: BluetoothDevice;
  services: string[];
  characteristics: {
    service: string;
    uuid: string;
    properties: string[];
  }[];
}

const WebBluetoothDemo: React.FC<WebBluetoothDemoProps> = ({ isOpen, onClose }) => {
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<string>('未連接');
  const [deviceInfo, setDeviceInfo] = useState<BluetoothDeviceInfo | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // 檢查瀏覽器支援
  const isSupported = 'bluetooth' in navigator;

  // 斷開連接
  const disconnect = useCallback(async () => {
    if (deviceInfo?.device.gatt?.connected) {
      try {
        await deviceInfo.device.gatt.disconnect();
        setStatus('已斷開連接');
        setDeviceInfo(null);
        setBatteryLevel(null);
        setError('');
      } catch {
        setError('斷開連接時發生錯誤');
      }
    }
  }, [deviceInfo]);

  // 監聽設備斷開連接
  useEffect(() => {
    if (deviceInfo?.device) {
      const handleDisconnect = () => {
        setStatus('設備已斷開連接');
        setDeviceInfo(null);
        setBatteryLevel(null);
      };

      deviceInfo.device.addEventListener('gattserverdisconnected', handleDisconnect);

      return () => {
        deviceInfo.device.removeEventListener('gattserverdisconnected', handleDisconnect);
      };
    }
  }, [deviceInfo]);

  // 清理函數
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // 掃描並連接設備
  const scanDevice = async () => {
    if (!isSupported) {
      setError('您的瀏覽器不支援 Web Bluetooth API');
      return;
    }

    try {
      setIsScanning(true);
      setError('');
      setStatus('正在掃描...');

      // 請求選擇藍牙設備
      const device = await navigator.bluetooth.requestDevice({
        // 接受所有可用的藍牙設備
        acceptAllDevices: true,
        // 或者指定特定服務
        // filters: [
        //   { services: ['battery_service'] }
        // ],
        optionalServices: [
          'battery_service',
          'device_information'
        ]
      });

      setStatus('正在連接...');

      // 連接到 GATT 伺服器
      const server = await device.gatt?.connect();
      if (!server) throw new Error('無法連接到設備');

      // 獲取所有可用的服務
      const services = await server.getPrimaryServices();
      const servicesInfo: string[] = [];
      const characteristicsInfo: BluetoothDeviceInfo['characteristics'] = [];

      // 遍歷所有服務和特徵
      for (const service of services) {
        servicesInfo.push(service.uuid);
        const characteristics = await service.getCharacteristics();
        
        for (const characteristic of characteristics) {
          characteristicsInfo.push({
            service: service.uuid,
            uuid: characteristic.uuid,
            properties: Object.entries(characteristic.properties)
              .filter(([, value]) => value)
              .map(([key]) => key)
          });

          // 如果是電池服務，讀取電池電量
          if (service.uuid === 'battery_service' &&
              characteristic.uuid === 'battery_level') {
            try {
              const value = await characteristic.readValue();
              setBatteryLevel(value.getUint8(0));
            } catch {
              console.log('無法讀取電池電量');
            }
          }
        }
      }

      setDeviceInfo({
        device,
        services: servicesInfo,
        characteristics: characteristicsInfo
      });
      
      setStatus('已連接');
      setError('');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('連接設備時發生錯誤');
      }
      setStatus('未連接');
    } finally {
      setIsScanning(false);
    }
  };

  const codeExample = `// 請求選擇藍牙設備
const device = await navigator.bluetooth.requestDevice({
  // 接受所有設備或使用過濾器
  acceptAllDevices: true,
  // filters: [{ services: ['battery_service'] }],
  optionalServices: ['battery_service']
});

// 連接到設備
const server = await device.gatt.connect();

// 獲取服務
const service = await server.getPrimaryService('battery_service');

// 獲取特徵
const characteristic = await service.getCharacteristic('battery_level');

// 讀取值
const value = await characteristic.readValue();
const batteryLevel = value.getUint8(0);

// 監聽特徵值變化
characteristic.addEventListener('characteristicvaluechanged', (event) => {
  const value = event.target.value;
  const newLevel = value.getUint8(0);
  console.log('電池電量:', newLevel);
});

// 開始通知
await characteristic.startNotifications();`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Web Bluetooth API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div className="p-6 border rounded-lg bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-gray-900">
                藍牙設備連接
              </h3>
              <p className="text-sm text-gray-500">
                掃描並連接附近的藍牙設備
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`
                h-3 w-3 rounded-full
                ${status === '已連接' ? 'bg-green-500' :
                  status === '正在掃描...' || status === '正在連接...' ? 'bg-yellow-500' :
                  'bg-red-500'}
              `} />
              <span className="text-sm font-medium text-gray-700">
                {status}
              </span>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={scanDevice}
              disabled={!isSupported || isScanning || status === '正在連接...'}
              className={`
                flex-1 px-4 py-2 rounded-md text-sm font-medium text-white
                ${(!isSupported || isScanning || status === '正在連接...')
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'}
              `}
            >
              {isScanning ? '掃描中...' : '掃描設備'}
            </button>
            <button
              onClick={disconnect}
              disabled={!deviceInfo?.device.gatt?.connected}
              className={`
                flex-1 px-4 py-2 rounded-md text-sm font-medium text-white
                ${!deviceInfo?.device.gatt?.connected
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600'}
              `}
            >
              斷開連接
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {deviceInfo && (
            <div className="space-y-4 border-t pt-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  設備資訊
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    名稱：{deviceInfo.device.name || '未知'}
                  </p>
                  <p>
                    ID：{deviceInfo.device.id}
                  </p>
                  {batteryLevel !== null && (
                    <p>
                      電池電量：{batteryLevel}%
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  可用服務
                </h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {deviceInfo.services.map((service, index) => (
                    <li key={index}>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  可用特徵
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {deviceInfo.characteristics.map((char, index) => (
                    <li key={index} className="space-y-1">
                      <div>UUID：{char.uuid}</div>
                      <div>服務：{char.service}</div>
                      <div>
                        屬性：{char.properties.join(', ')}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            說明
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              此演示展示了 Web Bluetooth API 的功能：
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>掃描並連接藍牙設備</li>
              <li>讀取設備資訊和服務</li>
              <li>讀取電池電量（如果支援）</li>
              <li>列出所有可用的特徵</li>
            </ul>
            <p className="mt-4 text-yellow-600">
              注意：Web Bluetooth API 需要在支援的瀏覽器中使用，且某些功能可能需要 HTTPS 連接。並非所有藍牙設備都支援所有功能。
            </p>
          </div>
        </div>
      </div>
    </DemoModal>
  );
};

export default WebBluetoothDemo; 