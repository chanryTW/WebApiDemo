import React, { useState } from 'react';
import DemoModal from '../DemoModal';

interface WebCryptoDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CryptoLog {
  timestamp: number;
  message: string;
  type: 'info' | 'error' | 'success';
}

const WebCryptoDemo: React.FC<WebCryptoDemoProps> = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const [logs, setLogs] = useState<CryptoLog[]>([]);
  const [encryptedData, setEncryptedData] = useState<ArrayBuffer | null>(null);
  const [decryptedText, setDecryptedText] = useState('');
  const [key, setKey] = useState<CryptoKey | null>(null);

  const addLog = (message: string, type: 'info' | 'error' | 'success') => {
    setLogs(prev => [{
      timestamp: Date.now(),
      message,
      type
    }, ...prev].slice(0, 5));
  };

  const generateKey = async () => {
    try {
      const key = await window.crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256
        },
        true,
        ['encrypt', 'decrypt']
      );
      setKey(key);
      addLog('已生成加密金鑰', 'success');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      addLog(`生成金鑰失敗: ${errorMessage}`, 'error');
    }
  };

  const encrypt = async () => {
    if (!key || !text) {
      addLog('請先生成金鑰並輸入文字', 'error');
      return;
    }

    try {
      const encodedText = new TextEncoder().encode(text);
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
      const combinedData = new Uint8Array(iv.length + encryptedData.byteLength);
      combinedData.set(iv);
      combinedData.set(new Uint8Array(encryptedData), iv.length);
      
      setEncryptedData(combinedData.buffer);
      addLog('加密完成', 'success');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      addLog(`加密失敗: ${errorMessage}`, 'error');
    }
  };

  const decrypt = async () => {
    if (!key || !encryptedData) {
      addLog('請先加密文字', 'error');
      return;
    }

    try {
      const data = new Uint8Array(encryptedData);
      const iv = data.slice(0, 12);
      const encryptedContent = data.slice(12);

      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv
        },
        key,
        encryptedContent
      );

      const decryptedText = new TextDecoder().decode(decryptedData);
      setDecryptedText(decryptedText);
      addLog('解密完成', 'success');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      addLog(`解密失敗: ${errorMessage}`, 'error');
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const codeExample = `// 生成加密金鑰
const key = await window.crypto.subtle.generateKey(
  {
    name: 'AES-GCM',
    length: 256
  },
  true,
  ['encrypt', 'decrypt']
);

// 加密文字
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

// 解密文字
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
      title="Web Crypto API 展示"
      description="此 API 提供加密和解密功能，支援多種加密演算法，適合處理敏感資料。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex space-x-2">
            <button
              onClick={generateKey}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              生成金鑰
            </button>
            <button
              onClick={encrypt}
              disabled={!key}
              className={`px-4 py-2 rounded ${
                !key
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              加密
            </button>
            <button
              onClick={decrypt}
              disabled={!encryptedData}
              className={`px-4 py-2 rounded ${
                !encryptedData
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              解密
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                輸入要加密的文字：
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="請輸入文字..."
              />
            </div>

            {encryptedData && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-bold mb-2">加密結果：</h4>
                <div className="text-xs font-mono break-all">
                  {Array.from(new Uint8Array(encryptedData))
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('')}
                </div>
              </div>
            )}

            {decryptedText && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-bold mb-2">解密結果：</h4>
                <div className="break-all">{decryptedText}</div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-bold mb-2">操作日誌：</h4>
          {logs.length === 0 ? (
            <p className="text-gray-500">尚無日誌</p>
          ) : (
            <div className="space-y-2">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    log.type === 'error'
                      ? 'bg-red-100'
                      : log.type === 'success'
                      ? 'bg-green-100'
                      : 'bg-white'
                  }`}
                >
                  <span className="text-sm text-gray-500">
                    {formatTime(log.timestamp)}
                  </span>
                  <p
                    className={
                      log.type === 'error'
                        ? 'text-red-600'
                        : log.type === 'success'
                        ? 'text-green-600'
                        : ''
                    }
                  >
                    {log.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600">
          <p>* Web Crypto API 的應用場景：</p>
          <ul className="list-disc list-inside ml-4">
            <li>加密敏感資料</li>
            <li>生成安全金鑰</li>
            <li>數位簽章</li>
            <li>雜湊運算</li>
          </ul>
        </div>
      </div>
    </DemoModal>
  );
};

export default WebCryptoDemo; 