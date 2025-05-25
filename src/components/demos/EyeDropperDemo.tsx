import React, { useState } from 'react';
import DemoModal from '../DemoModal';

const EyeDropperDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [color, setColor] = useState('');
  const [error, setError] = useState('');

  const pickColor = async () => {
    setError('');
    try {
      const eyeDropper = new (window as any).EyeDropper();
      const result = await eyeDropper.open();
      setColor(result.sRGBHex);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const codeExample = `// 啟動 EyeDropper 並取得顏色
const eyeDropper = new EyeDropper();
const result = await eyeDropper.open();
console.log(result.sRGBHex);`;

  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="EyeDropper API 演示" description="取色器 API 使用範例" codeExample={codeExample}>
      <div className="space-y-4">
        <button onClick={pickColor} className="px-4 py-2 bg-blue-500 text-white rounded">啟動取色器</button>
        {color && (
          <div className="flex items-center gap-2">
            <span>選取顏色：</span>
            <span className="w-6 h-6 rounded" style={{ background: color, border: '1px solid #ccc' }} />
            <span>{color}</span>
          </div>
        )}
        {error && <div className="text-red-500">{error}</div>}
        <div className="text-sm text-gray-600 mt-4">此 API 僅在支援的瀏覽器（如 Chrome 95+）且 HTTPS 下可用。</div>
      </div>
    </DemoModal>
  );
};

export default EyeDropperDemo; 