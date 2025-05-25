import DemoModal from '../DemoModal';
import React, { useRef, useEffect } from 'react';

const codeExample = `// 取得 2D 繪圖上下文
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'green';
ctx.fillRect(20, 20, 80, 80);
ctx.font = '16px sans-serif';
ctx.fillStyle = 'white';
ctx.fillText('Canvas API', 25, 65);`;

const CanvasDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(20, 20, 80, 80);
        ctx.font = '16px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText('Canvas API', 25, 65);
      }
    }
  }, [isOpen]);
  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="Canvas API 演示" description="基本 2D 繪圖操作" codeExample={codeExample}>
      <canvas ref={canvasRef} width={120} height={120} style={{border:'1px solid #ccc'}} />
    </DemoModal>
  );
};
export default CanvasDemo; 