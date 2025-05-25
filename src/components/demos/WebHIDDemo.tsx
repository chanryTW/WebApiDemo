import React, { useState } from 'react';
import DemoModal from '../DemoModal';

const WebHIDDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [devices, setDevices] = useState<any[]>([]);
  const [error, setError] = useState('');

  const requestDevice = async () => {
    setError('');
    try {
      const devices = await (navigator as any).hid.requestDevice({ filters: [] });
      setDevices(devices);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const codeExample = `// 取得 HID 裝置
const devices = await navigator.hid.requestDevice({ filters: [] });
console.log(devices);`;

  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="WebHID API 演示" description="HID 裝置連接範例" codeExample={codeExample}>
      <div className="space-y-4">
        <button onClick={requestDevice} className="px-4 py-2 bg-blue-500 text-white rounded">連接 HID 裝置</button>
        <div className="bg-gray-100 p-2 rounded h-32 overflow-auto">
          {devices.length === 0 ? '尚未連接裝置' : (
            <ul className="list-disc pl-5">
              {devices.map((d, i) => (
                <li key={i}>{d.productName || '未知裝置'} (vendorId: {d.vendorId}, productId: {d.productId})</li>
              ))}
            </ul>
          )}
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="text-sm text-gray-600 mt-4">此 API 僅在支援的瀏覽器（如 Chrome 89+）且 HTTPS 下可用。</div>
      </div>
    </DemoModal>
  );
};

export default WebHIDDemo; 