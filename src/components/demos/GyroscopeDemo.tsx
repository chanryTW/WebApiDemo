import DemoModal from '../DemoModal';
import React, { useState, useEffect } from 'react';

const codeExample = `// 檢查支援
if ('Gyroscope' in window) {
  const sensor = new Gyroscope();
  sensor.addEventListener('reading', () => {
    console.log('X:', sensor.x);
    console.log('Y:', sensor.y);
    console.log('Z:', sensor.z);
  });
  sensor.start();
}`;

const GyroscopeDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [gyro, setGyro] = useState<{x:number, y:number, z:number} | null>(null);
  useEffect(() => {
    let sensor: any;
    if ('Gyroscope' in window) {
      // @ts-expect-error: 型別不在標準 window 內
      sensor = new (window as any).Gyroscope();
      sensor.addEventListener('reading', () => setGyro({x: sensor.x, y: sensor.y, z: sensor.z}));
      sensor.start();
    }
    return () => { if(sensor && sensor.stop) sensor.stop(); };
  }, []);
  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="Gyroscope API 演示" description="偵測陀螺儀數值" codeExample={codeExample}>
      <div>X: {gyro ? gyro.x : '-'}</div>
      <div>Y: {gyro ? gyro.y : '-'}</div>
      <div>Z: {gyro ? gyro.z : '-'}</div>
    </DemoModal>
  );
};
export default GyroscopeDemo; 