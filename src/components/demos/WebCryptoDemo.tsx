import React, { useState } from 'react';
import DemoModal from '../DemoModal';

interface WebCryptoDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const WebCryptoDemo: React.FC<WebCryptoDemoProps> = ({ isOpen, onClose }) => {
  const [plaintext, setPlaintext] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [error, setError] = useState('');

  const generateKey = async () => {
    try {
      const newKey = await window.crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256
        },
        true,
        ['encrypt', 'decrypt']
      );
      setKey(newKey);
      setError('');
    } catch (err) {
      setError('生成金鑰失敗：' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const encrypt = async () => {
    if (!key) {
      setError('請先生成金鑰');
      return;
    }

    try {
      const encodedText = new TextEncoder().encode(plaintext);
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv
        },
        key,
        encodedText
      );

      // 將 IV 和加密數據合併
      const combined = new Uint8Array(iv.length + encryptedData.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encryptedData), iv.length);

      // 轉換為 Base64
      const base64 = btoa(String.fromCharCode(...combined));
      setEncryptedText(base64);
      setError('');
    } catch (err) {
      setError('加密失敗：' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const decrypt = async () => {
    if (!key) {
      setError('請先生成金鑰');
      return;
    }

    try {
      // 從 Base64 解碼
      const combined = new Uint8Array(
        atob(encryptedText)
          .split('')
          .map(c => c.charCodeAt(0))
      );

      // 分離 IV 和加密數據
      const iv = combined.slice(0, 12);
      const encryptedData = combined.slice(12);

      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv
        },
        key,
        encryptedData
      );

      const text = new TextDecoder().decode(decryptedData);
      setDecryptedText(text);
      setError('');
    } catch (err) {
      setError('解密失敗：' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const codeExample = `// 生成 AES-GCM 金鑰
const key = await window.crypto.subtle.generateKey(
  {
    name: 'AES-GCM',
    length: 256
  },
  true,
  ['encrypt', 'decrypt']
);

// 加密
const encodedText = new TextEncoder().encode('要加密的文字');
const iv = window.crypto.getRandomValues(new Uint8Array(12));
const encryptedData = await window.crypto.subtle.encrypt(
  {
    name: 'AES-GCM',
    iv
  },
  key,
  encodedText
);

// 解密
const decryptedData = await window.crypto.subtle.decrypt(
  {
    name: 'AES-GCM',
    iv
  },
  key,
  encryptedData
);
const decryptedText = new TextDecoder().decode(decryptedData);`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Web Crypto API 演示"
      description="展示使用 AES-GCM 演算法進行加密和解密的過程。"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div>
          <button
            onClick={generateKey}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            生成新金鑰
          </button>
          <div className="mt-2 text-sm text-gray-600">
            {key ? '已生成金鑰' : '尚未生成金鑰'}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            輸入文字
          </label>
          <textarea
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            className="w-full h-24 p-2 border rounded"
            placeholder="請輸入要加密的文字"
          />
          <button
            onClick={encrypt}
            disabled={!key || !plaintext}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            加密
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            加密結果
          </label>
          <textarea
            value={encryptedText}
            onChange={(e) => setEncryptedText(e.target.value)}
            className="w-full h-24 p-2 border rounded"
            placeholder="加密後的文字將顯示在這裡"
          />
          <button
            onClick={decrypt}
            disabled={!key || !encryptedText}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            解密
          </button>
        </div>

        {decryptedText && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              解密結果
            </label>
            <div className="p-2 bg-gray-100 rounded">
              {decryptedText}
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center">
            {error}
          </div>
        )}
      </div>
    </DemoModal>
  );
};

export default WebCryptoDemo; 