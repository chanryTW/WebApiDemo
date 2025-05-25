import DemoModal from '../DemoModal';
import React, { useRef, useEffect } from 'react';

const codeExample = `// 取得 OffscreenCanvas
const canvas = document.querySelector('canvas');
const offscreen = canvas.transferControlToOffscreen();
const ctx = offscreen.getContext('2d');
ctx.fillStyle = 'blue';
ctx.fillRect(10, 10, 100, 100);`;

const OffscreenCanvasDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current && 'OffscreenCanvas' in window) {
      const offscreen = canvasRef.current.transferControlToOffscreen();
      const ctx = offscreen.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(10, 10, 100, 100);
      }
    }
  }, [isOpen]);
  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="OffscreenCanvas API 演示" description="在 worker 執行 canvas 繪圖" codeExample={codeExample}>
      <canvas ref={canvasRef} width={200} height={200} style={{border:'1px solid #ccc'}} />
      <div>（需支援 OffscreenCanvas 的瀏覽器）</div>
    </DemoModal>
  );
};
export default OffscreenCanvasDemo; 