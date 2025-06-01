import React, { useState } from 'react';
import DemoModal from '../DemoModal';

interface CORSDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const CORSDemo: React.FC<CORSDemoProps> = ({ isOpen, onClose }) => {
  const [selectedExample, setSelectedExample] = useState<'simple' | 'preflight'>('simple');

  const simpleRequestExample = `
// 簡單請求（不會觸發預檢請求）
fetch('https://api.example.com/data', {
  method: 'GET',
  headers: {
    'Content-Type': 'text/plain'
  }
});`;

  const preflightRequestExample = `
// 需要預檢請求的複雜請求
fetch('https://api.example.com/data', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'value'
  },
  body: JSON.stringify({ key: 'value' })
});`;

  const serverConfigExample = `
// Node.js Express 伺服器 CORS 配置
const express = require('express');
const cors = require('cors');
const app = express();

// 允許所有來源
app.use(cors());

// 或自定義 CORS 選項
app.use(cors({
  origin: ['https://allowed-origin.com'],
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400 // 預檢請求的快取時間（秒）
}));`;

  const codeExample = `
// 簡單請求示例
${simpleRequestExample}

// 預檢請求示例
${preflightRequestExample}

// 伺服器端配置
${serverConfigExample}

// 使用 Credentials
fetch('https://api.example.com/data', {
  credentials: 'include' // 包含 cookies
});

// 處理 CORS 錯誤
try {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
} catch (error) {
  if (error instanceof TypeError && error.message.includes('CORS')) {
    console.error('CORS 錯誤：無法訪問資源');
  }
}`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Cross-Origin Resource Sharing (CORS) 展示"
      description="CORS 是一種安全機制，允許網頁從不同源存取資源。"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedExample('simple')}
            className={`px-4 py-2 rounded ${
              selectedExample === 'simple'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            簡單請求
          </button>
          <button
            onClick={() => setSelectedExample('preflight')}
            className={`px-4 py-2 rounded ${
              selectedExample === 'preflight'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            預檢請求
          </button>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold mb-2">
            {selectedExample === 'simple' ? '簡單請求示例' : '預檢請求示例'}
          </h3>
          <pre className="text-sm bg-gray-800 text-white p-4 rounded overflow-x-auto">
            {selectedExample === 'simple' ? simpleRequestExample : preflightRequestExample}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold mb-2">伺服器配置示例</h3>
          <pre className="text-sm bg-gray-800 text-white p-4 rounded overflow-x-auto">
            {serverConfigExample}
          </pre>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">
            注意：CORS 是伺服器端的安全機制，瀏覽器會自動執行。客戶端無法繞過 CORS 限制，必須由伺服器正確配置。
          </p>
        </div>

        <div className="text-sm text-gray-600">
          <p>* CORS 請求類型：</p>
          <ul className="list-disc list-inside ml-4">
            <li>簡單請求：不會觸發預檢請求</li>
            <li>預檢請求：使用 OPTIONS 方法進行預檢</li>
            <li>帶憑證的請求：包含 cookies 等認證資訊</li>
          </ul>
        </div>

        <div className="text-sm text-gray-600">
          <p>* 常見 CORS 標頭：</p>
          <ul className="list-disc list-inside ml-4">
            <li>Access-Control-Allow-Origin</li>
            <li>Access-Control-Allow-Methods</li>
            <li>Access-Control-Allow-Headers</li>
            <li>Access-Control-Allow-Credentials</li>
            <li>Access-Control-Max-Age</li>
          </ul>
        </div>
      </div>
    </DemoModal>
  );
};

export default CORSDemo; 