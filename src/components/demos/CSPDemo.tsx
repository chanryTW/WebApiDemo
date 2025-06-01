import React, { useState } from 'react';
import DemoModal from '../DemoModal';

interface CSPDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const CSPDemo: React.FC<CSPDemoProps> = ({ isOpen, onClose }) => {
  const [showXSS, setShowXSS] = useState(false);
  const [showInlineScript, setShowInlineScript] = useState(false);

  const maliciousScript = `
<script>
  alert('XSS 攻擊示範');
</script>
  `;

  const inlineScript = `
<script>
  document.body.style.backgroundColor = 'red';
</script>
  `;

  const cspHeader = `
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'nonce-random123';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  `;

  const cspMeta = `
<meta 
  http-equiv="Content-Security-Policy" 
  content="default-src 'self'; script-src 'self' 'nonce-random123'; style-src 'self' 'unsafe-inline';"
>
  `;

  const codeExample = `// 在 HTTP 標頭中設置 CSP
${cspHeader}

// 或在 HTML 中使用 meta 標籤
${cspMeta}

// 使用 nonce 允許特定的內聯腳本
<script nonce="random123">
  // 這個腳本會被執行
  console.log('安全的內聯腳本');
</script>

// 違反 CSP 的範例
<script>
  // 這個腳本會被阻擋
  alert('不安全的內聯腳本');
</script>

// 監聽 CSP 違規事件
document.addEventListener('securitypolicyviolation', (e) => {
  console.log('CSP 違規:', {
    violatedDirective: e.violatedDirective,
    blockedURI: e.blockedURI,
    originalPolicy: e.originalPolicy
  });
});`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Content Security Policy (CSP) 展示"
      description="CSP 是一個額外的安全層，用於檢測和減輕特定類型的攻擊，包括跨站腳本 (XSS) 和資料注入攻擊。"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold mb-2">CSP 標頭示例</h3>
          <pre className="text-sm bg-gray-800 text-white p-4 rounded overflow-x-auto">
            {cspHeader}
          </pre>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-bold mb-2">XSS 攻擊示範</h3>
            <button
              onClick={() => setShowXSS(!showXSS)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              {showXSS ? '隱藏' : '顯示'} XSS 程式碼
            </button>
            {showXSS && (
              <pre className="mt-2 text-sm bg-red-100 text-red-800 p-4 rounded">
                {maliciousScript}
              </pre>
            )}
          </div>

          <div>
            <h3 className="font-bold mb-2">內聯腳本示範</h3>
            <button
              onClick={() => setShowInlineScript(!showInlineScript)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {showInlineScript ? '隱藏' : '顯示'} 內聯腳本
            </button>
            {showInlineScript && (
              <pre className="mt-2 text-sm bg-blue-100 text-blue-800 p-4 rounded">
                {inlineScript}
              </pre>
            )}
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">
            注意：CSP 需要在伺服器端設置 HTTP 標頭或在 HTML 中使用 meta 標籤才能生效。
            此示範僅展示 CSP 的設置方式和常見用例。
          </p>
        </div>

        <div className="text-sm text-gray-600">
          <p>* CSP 的主要功能：</p>
          <ul className="list-disc list-inside ml-4">
            <li>防止 XSS 攻擊</li>
            <li>控制資源載入來源</li>
            <li>限制內聯腳本執行</li>
            <li>防止點擊劫持</li>
            <li>監控和報告違規</li>
          </ul>
        </div>

        <div className="text-sm text-gray-600">
          <p>* CSP 常見指令：</p>
          <ul className="list-disc list-inside ml-4">
            <li>default-src：預設載入策略</li>
            <li>script-src：JavaScript 來源限制</li>
            <li>style-src：CSS 來源限制</li>
            <li>img-src：圖片來源限制</li>
            <li>connect-src：HTTP 請求限制</li>
            <li>frame-src：框架來源限制</li>
          </ul>
        </div>
      </div>
    </DemoModal>
  );
};

export default CSPDemo; 