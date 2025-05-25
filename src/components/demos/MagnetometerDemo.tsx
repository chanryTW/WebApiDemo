import DemoModal from '../DemoModal';
import React, { useState, useEffect } from 'react';

const codeExample = `// 檢查支援
if ('Magnetometer' in window) {
  const sensor = new Magnetometer();
  sensor.addEventListener('reading', () => {
    console.log('X:', sensor.x);
    console.log('Y:', sensor.y);
    console.log('Z:', sensor.z);
  });
  sensor.start();
}`;

const MagnetometerDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [mag, setMag] = useState<{x:number, y:number, z:number} | null>(null);
  useEffect(() => {
    let sensor: any;
    if ('Magnetometer' in window) {
      // @ts-expect-error: 型別不在標準 window 內
      sensor = new (window as any).Magnetometer();
      sensor.addEventListener('reading', () => setMag({x: sensor.x, y: sensor.y, z: sensor.z}));
      sensor.start();
    }
    return () => { if(sensor && sensor.stop) sensor.stop(); };
  }, []);
  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="Magnetometer API 演示" description="偵測地磁感應數值" codeExample={codeExample}>
      <div>X: {mag ? mag.x : '-'}</div>
      <div>Y: {mag ? mag.y : '-'}</div>
      <div>Z: {mag ? mag.z : '-'}</div>
    </DemoModal>
  );
};
export default MagnetometerDemo; 