import DemoModal from '../DemoModal';
import React, { useState, useEffect } from 'react';
// @ts-expect-error: raw-loader 用於顯示原始碼
import code from '!!raw-loader!./AccelerometerDemo.tsx';

const codeExample = `// 檢查支援
if ('Accelerometer' in window) {
  const sensor = new Accelerometer();
  sensor.addEventListener('reading', () => {
    console.log('X:', sensor.x);
    console.log('Y:', sensor.y);
    console.log('Z:', sensor.z);
  });
  sensor.start();
}`;

const AccelerometerDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [acc, setAcc] = useState<{x:number, y:number, z:number} | null>(null);
  useEffect(() => {
    let sensor: any;
    if ('Accelerometer' in window) {
      // @ts-expect-error: 型別不在標準 window 內
      sensor = new (window as any).Accelerometer();
      sensor.addEventListener('reading', () => setAcc({x: sensor.x, y: sensor.y, z: sensor.z}));
      sensor.start();
    }
    return () => { if(sensor && sensor.stop) sensor.stop(); };
  }, []);
  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="Accelerometer API 演示" description="偵測加速度數值" codeExample={codeExample}>
      <div>X: {acc ? acc.x : '-'}</div>
      <div>Y: {acc ? acc.y : '-'}</div>
      <div>Z: {acc ? acc.z : '-'}</div>
      <h4 style={{marginTop:16}}>程式範例</h4>
      <pre style={{background:'#222',color:'#fff',padding:8,overflowX:'auto'}}><code>{code}</code></pre>
    </DemoModal>
  );
};
export default AccelerometerDemo; 