import React, { useState } from 'react';
import DemoModal from '../DemoModal';

interface SRIDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const SRIDemo: React.FC<SRIDemoProps> = ({ isOpen, onClose }) => {
  const [selectedExample, setSelectedExample] = useState<'script' | 'style'>('script');

  const scriptExample = `
<script 
  src="https://example.com/js/library.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous"
></script>`;

  const styleExample = `
<link 
  rel="stylesheet"
  href="https://example.com/css/styles.css"
  integrity="sha384-Q2XxX9z5jxZyYWP4Q1VUsmYqXKvABZ8WjxZNyXX5Pu6f3qH9R3ZVa9UKeFdZ3uY"
  crossorigin="anonymous"
>`;

  const generateHashExample = `// 使用 OpenSSL 生成 hash
openssl dgst -sha384 -binary filename.js | openssl base64 -A

// 使用 shasum 生成 hash
cat filename.js | openssl dgst -sha384 -binary | openssl base64 -A`;

  const codeExample = `// 為腳本添加 SRI
${scriptExample}

// 為樣式表添加 SRI
${styleExample}

// 生成 SRI hash
${generateHashExample}

// 多重 hash 支援
<script 
  src="https://example.com/js/library.js"
  integrity="sha256-hash1 sha384-hash2 sha512-hash3"
  crossorigin="anonymous"
></script>

// 報告違規
<script 
  src="https://example.com/js/library.js"
  integrity="sha384-hash"
  crossorigin="anonymous"
  onerror="console.error('SRI 驗證失敗')"
></script>`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Subresource Integrity (SRI) 展示"
      description="SRI 允許瀏覽器驗證其獲取的資源（例如從 CDN）是否被篡改。"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedExample('script')}
            className={`px-4 py-2 rounded ${
              selectedExample === 'script'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            腳本範例
          </button>
          <button
            onClick={() => setSelectedExample('style')}
            className={`px-4 py-2 rounded ${
              selectedExample === 'style'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            樣式表範例
          </button>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold mb-2">
            {selectedExample === 'script' ? '腳本 SRI 示例' : '樣式表 SRI 示例'}
          </h3>
          <pre className="text-sm bg-gray-800 text-white p-4 rounded overflow-x-auto">
            {selectedExample === 'script' ? scriptExample : styleExample}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold mb-2">生成 Hash 值</h3>
          <pre className="text-sm bg-gray-800 text-white p-4 rounded overflow-x-auto">
            {generateHashExample}
          </pre>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">
            注意：使用 SRI 時，資源必須通過 HTTPS 提供，並且需要設置 crossorigin 屬性。
            如果 hash 值不匹配，瀏覽器將拒絕載入資源。
          </p>
        </div>

        <div className="text-sm text-gray-600">
          <p>* SRI 的主要功能：</p>
          <ul className="list-disc list-inside ml-4">
            <li>驗證外部資源完整性</li>
            <li>防止 CDN 被劫持</li>
            <li>確保資源未被篡改</li>
            <li>支援多重 hash 算法</li>
          </ul>
        </div>

        <div className="text-sm text-gray-600">
          <p>* 最佳實踐：</p>
          <ul className="list-disc list-inside ml-4">
            <li>優先使用 sha384 hash 算法</li>
            <li>總是設置 crossorigin 屬性</li>
            <li>為關鍵資源提供備用來源</li>
            <li>定期更新 hash 值</li>
            <li>監控載入失敗事件</li>
          </ul>
        </div>
      </div>
    </DemoModal>
  );
};

export default SRIDemo; 