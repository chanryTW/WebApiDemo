import React, { useState } from 'react';
import DemoModal from '../DemoModal';

interface ReferrerPolicyDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReferrerPolicyDemo: React.FC<ReferrerPolicyDemoProps> = ({ isOpen, onClose }) => {
  const [selectedPolicy, setSelectedPolicy] = useState<string>('no-referrer');

  const policies = {
    'no-referrer': '不發送 Referer 標頭',
    'no-referrer-when-downgrade': '當從 HTTPS 降級到 HTTP 時不發送',
    'origin': '只發送來源（協議、主機和端口）',
    'origin-when-cross-origin': '跨源時只發送來源',
    'same-origin': '只在同源請求時發送',
    'strict-origin': '只在安全等級相同或更高時發送來源',
    'strict-origin-when-cross-origin': '跨源時只在安全等級相同或更高時發送來源',
    'unsafe-url': '總是發送完整 URL（不安全）'
  };

  const metaTagExample = `
<!-- 使用 meta 標籤設置 -->
<meta name="referrer" content="${selectedPolicy}">`;

  const headerExample = `
// 使用 HTTP 標頭設置
Referrer-Policy: ${selectedPolicy}`;

  const htmlExample = `
<!-- 在 HTML 元素上設置 -->
<a href="https://example.com" referrerpolicy="${selectedPolicy}">連結</a>
<img src="image.jpg" referrerpolicy="${selectedPolicy}">
<iframe src="page.html" referrerpolicy="${selectedPolicy}">`;

  const fetchExample = `
// 在 fetch 請求中設置
fetch('https://api.example.com/data', {
  referrerPolicy: '${selectedPolicy}'
});`;

  const codeExample = `
// Meta 標籤設置
${metaTagExample}

// HTTP 標頭設置
${headerExample}

// HTML 元素設置
${htmlExample}

// Fetch API 設置
${fetchExample}

// 讀取當前頁面的 referrer
console.log(document.referrer);

// 檢查瀏覽器支援的策略
const supportedPolicies = document.createElement('img').referrerPolicy;
console.log('支援的 Referrer Policy:', supportedPolicies);`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Referrer Policy API 展示"
      description="Referrer Policy 控制瀏覽器在發送請求時如何處理 Referer 標頭。"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(policies).map(([policy, description]) => (
            <button
              key={policy}
              onClick={() => setSelectedPolicy(policy)}
              className={`p-3 rounded text-left ${
                selectedPolicy === policy
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="font-bold">{policy}</div>
              <div className="text-sm">{description}</div>
            </button>
          ))}
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Meta 標籤設置</h3>
          <pre className="text-sm bg-gray-800 text-white p-4 rounded overflow-x-auto">
            {metaTagExample}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold mb-2">HTTP 標頭設置</h3>
          <pre className="text-sm bg-gray-800 text-white p-4 rounded overflow-x-auto">
            {headerExample}
          </pre>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">
            注意：選擇適當的 Referrer Policy 對於保護用戶隱私和防止資訊洩露很重要。
            建議使用較嚴格的策略，如 'strict-origin-when-cross-origin'。
          </p>
        </div>

        <div className="text-sm text-gray-600">
          <p>* 使用場景：</p>
          <ul className="list-disc list-inside ml-4">
            <li>保護用戶隱私</li>
            <li>防止敏感資訊通過 URL 洩露</li>
            <li>控制跨源請求中的資訊傳遞</li>
            <li>符合安全性要求</li>
          </ul>
        </div>

        <div className="text-sm text-gray-600">
          <p>* 最佳實踐：</p>
          <ul className="list-disc list-inside ml-4">
            <li>對敏感頁面使用嚴格策略</li>
            <li>避免使用 'unsafe-url'</li>
            <li>考慮使用多層策略</li>
            <li>定期審查 referrer 策略</li>
          </ul>
        </div>
      </div>
    </DemoModal>
  );
};

export default ReferrerPolicyDemo; 