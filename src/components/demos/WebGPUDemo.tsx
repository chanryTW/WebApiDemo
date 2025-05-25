import React, { useEffect, useRef, useState } from 'react';
import DemoModal from '../DemoModal';

const WebGPUDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(!!(navigator.gpu));
    if (!navigator.gpu) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    (async () => {
      const adapter = await (navigator as any).gpu.requestAdapter();
      const device = await adapter.requestDevice();
      const context = (canvas as any).getContext('webgpu');
      const format = 'bgra8unorm';
      context.configure({ device, format });
      const encoder = device.createCommandEncoder();
      const textureView = context.getCurrentTexture().createView();
      const renderPass = encoder.beginRenderPass({
        colorAttachments: [{
          view: textureView,
          clearValue: { r: 0.2, g: 0.6, b: 0.9, a: 1 },
          loadOp: 'clear',
          storeOp: 'store',
        }],
      });
      renderPass.end();
      device.queue.submit([encoder.finish()]);
    })();
  }, [isOpen]);

  const codeExample = `// 取得 WebGPU Adapter
const adapter = await navigator.gpu.requestAdapter();
const device = await adapter.requestDevice();
const context = canvas.getContext('webgpu');
// ...更多初始化與繪圖程式碼...`;

  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="WebGPU API 演示" description="WebGPU 初始化與繪圖範例" codeExample={codeExample}>
      <div className="space-y-4">
        <div>{supported ? '此瀏覽器支援 WebGPU。' : '此瀏覽器不支援 WebGPU。'}</div>
        <canvas ref={canvasRef} width={300} height={150} className="border rounded" />
        <div className="text-sm text-gray-600 mt-4">WebGPU 目前僅在部分瀏覽器（如 Chrome 113+）且啟用旗標下可用。</div>
      </div>
    </DemoModal>
  );
};

export default WebGPUDemo; 