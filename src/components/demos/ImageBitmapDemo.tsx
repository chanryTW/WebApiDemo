import DemoModal from '../DemoModal';
import React, { useRef, useEffect } from 'react';

const codeExample = `// 載入圖片並建立 ImageBitmap
const img = new Image();
img.src = '圖片網址';
img.onload = () => {
  createImageBitmap(img).then(bitmap => {
    ctx.drawImage(bitmap, 0, 0, 100, 100);
  });
};`;

const ImageBitmapDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current && 'createImageBitmap' in window) {
      const ctx = canvasRef.current.getContext('2d');
      const img = new window.Image();
      img.src = 'https://developer.mozilla.org/static/img/web-docs-sprite.22a6a085cf14.svg';
      img.onload = () => {
        window.createImageBitmap(img).then(bitmap => {
          if (ctx) ctx.drawImage(bitmap, 0, 0, 100, 100);
        });
      };
    }
  }, [isOpen]);
  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="ImageBitmap API 演示" description="高效載入與繪製圖片" codeExample={codeExample}>
      <canvas ref={canvasRef} width={200} height={200} style={{border:'1px solid #ccc'}} />
      <div>（需支援 createImageBitmap 的瀏覽器）</div>
    </DemoModal>
  );
};
export default ImageBitmapDemo; 