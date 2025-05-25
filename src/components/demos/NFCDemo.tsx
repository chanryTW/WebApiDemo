import DemoModal from '../DemoModal';
import React, { useState } from 'react';

const codeExample = `// 讀取 NFC 標籤
const ndef = new NDEFReader();
await ndef.scan();
ndef.onreading = event => {
  for (const record of event.message.records) {
    console.log(record);
  }
};`;

const NFCDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const handleRead = async () => {
    if ('NDEFReader' in window) {
      try {
        // @ts-expect-error: 型別不在標準 window 內
        const ndef = new (window as any).NDEFReader();
        await ndef.scan();
        ndef.onreading = (event: {message: {records: any[]}}) => {
          setMessage('NFC 資料: ' + JSON.stringify(event.message.records));
        };
      } catch (e) {
        setMessage('NFC 讀取失敗: ' + e);
      }
    } else {
      setMessage('本瀏覽器不支援 Web NFC');
    }
  };
  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="NFC API 演示" description="NFC 標籤讀取" codeExample={codeExample}>
      <button onClick={handleRead}>開始讀取 NFC</button>
      <div>{message}</div>
    </DemoModal>
  );
};
export default NFCDemo; 