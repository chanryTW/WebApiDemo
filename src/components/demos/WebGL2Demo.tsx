import DemoModal from '../DemoModal';
import React, { useRef, useEffect } from 'react';

const WebGL2Demo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current && 'WebGL2RenderingContext' in window) {
      const gl = canvasRef.current.getContext('webgl2');
      if (gl) {
        gl.clearColor(0.2, 0.4, 0.8, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
    }
  }, [isOpen]);
  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="WebGL2 API 演示" description="WebGL2 基本繪圖">
      <canvas ref={canvasRef} width={200} height={200} style={{border:'1px solid #ccc'}} />
      <div>（需支援 WebGL2 的瀏覽器）</div>
    </DemoModal>
  );
};
export default WebGL2Demo; 