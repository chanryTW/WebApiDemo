import DemoModal from '../DemoModal';
import React, { useState, useEffect } from 'react';

const codeExample = `// 檢查支援
if ('ProximitySensor' in window) {
  const sensor = new ProximitySensor();
  sensor.addEventListener('reading', () => {
    console.log('距離:', sensor.distance);
    console.log('是否接近:', sensor.near);
  });
  sensor.start();
}`;

const ProximitySensorDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [proximity, setProximity] = useState<{distance: number, near: boolean} | null>(null);
  useEffect(() => {
    let sensor: any;
    if ('ProximitySensor' in window) {
      // @ts-expect-error: 型別不在標準 window 內
      sensor = new (window as any).ProximitySensor();
      sensor.addEventListener('reading', () => setProximity({distance: sensor.distance, near: sensor.near}));
      sensor.start();
    }
    return () => { if(sensor && sensor.stop) sensor.stop(); };
  }, []);
  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="Proximity Sensor API 演示" description="偵測裝置與物體的距離" codeExample={codeExample}>
      <div>目前距離: {proximity ? `${proximity.distance} cm` : '不支援或尚未偵測'}</div>
      <div>是否接近: {proximity ? (proximity.near ? '是' : '否') : '-'}</div>
    </DemoModal>
  );
};
export default ProximitySensorDemo; 