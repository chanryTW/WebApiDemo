import React, { useState } from 'react';
import DemoModal from '../DemoModal';

const WebNFCDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [readResult, setReadResult] = useState('');
  const [error, setError] = useState('');

  const writeNFC = async () => {
    setError('');
    try {
      const ndef = new (window as any).NDEFReader();
      await ndef.write(message);
      setReadResult('寫入成功！');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const readNFC = async () => {
    setError('');
    try {
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();
      ndef.onreading = (event: any) => {
        const decoder = new TextDecoder();
        let text = '';
        for (const record of event.message.records) {
          text += decoder.decode(record.data);
        }
        setReadResult(text || '無資料');
      };
    } catch (e: any) {
      setError(e.message);
    }
  };

  const codeExample = `// 寫入 NFC
const ndef = new NDEFReader();
await ndef.write('Hello NFC');

// 讀取 NFC
def.onreading = event => {
  for (const record of event.message.records) {
    console.log(new TextDecoder().decode(record.data));
  }
};
await ndef.scan();`;

  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="Web NFC API 演示" description="NFC 標籤讀寫範例" codeExample={codeExample}>
      <div className="space-y-4">
        <input value={message} onChange={e => setMessage(e.target.value)} className="border p-2 w-full" placeholder="輸入要寫入的文字" />
        <div className="flex gap-2">
          <button onClick={writeNFC} className="px-4 py-2 bg-blue-500 text-white rounded">寫入 NFC</button>
          <button onClick={readNFC} className="px-4 py-2 bg-green-500 text-white rounded">讀取 NFC</button>
        </div>
        <div className="bg-gray-100 p-2 rounded h-20 overflow-auto">{readResult || '尚未讀取/寫入'}</div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="text-sm text-gray-600 mt-4">此 API 僅在支援的瀏覽器（如 Chrome Android）且 HTTPS 下可用。</div>
      </div>
    </DemoModal>
  );
};

export default WebNFCDemo; 