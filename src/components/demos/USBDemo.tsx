import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface USBDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface USBDeviceInfo {
  device: USBDevice;
  name: string;
  serialNumber: string | null;
  manufacturerName: string | null;
  productName: string | null;
  productId: number;
  vendorId: number;
}

const USBDemo: React.FC<USBDemoProps> = ({ isOpen, onClose }) => {
  const [devices, setDevices] = useState<USBDeviceInfo[]>([]);
  const [error, setError] = useState<string>('');
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('usb' in navigator)) {
      setIsSupported(false);
      setError('您的瀏覽器不支援 Web USB API');
    }
  }, []);

  const requestDevice = async () => {
    try {
      setError('');
      const device = await navigator.usb.requestDevice({
        filters: [] // 接受所有裝置
      });

      const deviceInfo: USBDeviceInfo = {
        device,
        name: device.productName || '未知裝置',
        serialNumber: device.serialNumber,
        manufacturerName: device.manufacturerName,
        productName: device.productName,
        productId: device.productId,
        vendorId: device.vendorId
      };

      setDevices(prev => [...prev, deviceInfo]);

      // 嘗試開啟裝置
      await device.open();
      // 選擇設定
      await device.selectConfiguration(1);
      // 宣告介面
      await device.claimInterface(0);

    } catch (err) {
      setError(err instanceof Error ? err.message : '連接 USB 裝置時發生錯誤');
    }
  };

  const disconnectDevice = async (device: USBDevice) => {
    try {
      await device.close();
      setDevices(prev => prev.filter(d => d.device !== device));
    } catch (err) {
      setError(err instanceof Error ? err.message : '斷開 USB 裝置時發生錯誤');
    }
  };

  const listDevices = async () => {
    try {
      setError('');
      const allDevices = await navigator.usb.getDevices();
      const deviceInfos: USBDeviceInfo[] = allDevices.map(device => ({
        device,
        name: device.productName || '未知裝置',
        serialNumber: device.serialNumber,
        manufacturerName: device.manufacturerName,
        productName: device.productName,
        productId: device.productId,
        vendorId: device.vendorId
      }));
      setDevices(deviceInfos);
    } catch (err) {
      setError(err instanceof Error ? err.message : '取得 USB 裝置清單時發生錯誤');
    }
  };

  const codeExample = `
// 請求存取 USB 裝置
const device = await navigator.usb.requestDevice({
  filters: [
    {
      vendorId: 0x2341, // Arduino
      productId: 0x0043  // Uno
    }
  ]
});

// 開啟裝置連接
await device.open();
// 選擇設定
await device.selectConfiguration(1);
// 宣告介面
await device.claimInterface(0);

// 傳送資料到裝置
const data = new Uint8Array([0x01, 0x02, 0x03]);
await device.transferOut(1, data);

// 從裝置接收資料
const result = await device.transferIn(1, 64);
console.log(new Uint8Array(result.data.buffer));

// 列出所有已授權的裝置
const devices = await navigator.usb.getDevices();

// 監聽裝置連接/斷開事件
navigator.usb.addEventListener('connect', event => {
  console.log('USB 裝置已連接:', event.device);
});

navigator.usb.addEventListener('disconnect', event => {
  console.log('USB 裝置已斷開:', event.device);
});`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Web USB API Demo"
      description="展示如何使用 Web USB API 來與 USB 裝置進行通訊。這個 API 允許網頁應用程式直接與 USB 裝置互動。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        {!isSupported ? (
          <div className="text-red-500">
            您的瀏覽器不支援 Web USB API。
            請使用支援的瀏覽器（如 Chrome）來測試此功能。
          </div>
        ) : (
          <>
            <div className="flex space-x-4">
              <button
                onClick={requestDevice}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                連接新裝置
              </button>
              <button
                onClick={listDevices}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                列出已連接裝置
              </button>
            </div>

            {devices.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">已連接的裝置：</h3>
                {devices.map((deviceInfo, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-100 rounded space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{deviceInfo.name}</p>
                        <p className="text-sm text-gray-600">
                          製造商：{deviceInfo.manufacturerName || '未知'}
                        </p>
                        <p className="text-sm text-gray-600">
                          產品名稱：{deviceInfo.productName || '未知'}
                        </p>
                        <p className="text-sm text-gray-600">
                          序號：{deviceInfo.serialNumber || '未知'}
                        </p>
                        <p className="text-sm text-gray-600">
                          廠商 ID：0x{deviceInfo.vendorId.toString(16).padStart(4, '0')}
                        </p>
                        <p className="text-sm text-gray-600">
                          產品 ID：0x{deviceInfo.productId.toString(16).padStart(4, '0')}
                        </p>
                      </div>
                      <button
                        onClick={() => disconnectDevice(deviceInfo.device)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                      >
                        斷開連接
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="text-red-500">
                錯誤：{error}
              </div>
            )}

            <div className="mt-4 text-sm text-gray-600">
              <p>注意事項：</p>
              <ul className="list-disc list-inside">
                <li>需要在支援 Web USB API 的瀏覽器中使用</li>
                <li>需要使用者手動授權存取 USB 裝置</li>
                <li>某些 USB 裝置可能需要安裝驅動程式</li>
                <li>並非所有 USB 裝置都支援此 API</li>
                <li>需要在安全的上下文（HTTPS）中運行</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </DemoModal>
  );
};

export default USBDemo; 