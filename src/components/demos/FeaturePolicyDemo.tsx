import React, { useState } from 'react';
import DemoModal from '../DemoModal';

interface FeaturePolicyDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeaturePolicyDemo: React.FC<FeaturePolicyDemoProps> = ({ isOpen, onClose }) => {
  const [selectedFeature, setSelectedFeature] = useState<string>('camera');

  const features = {
    'camera': '控制相機使用權限',
    'microphone': '控制麥克風使用權限',
    'geolocation': '控制地理位置使用權限',
    'autoplay': '控制自動播放媒體',
    'fullscreen': '控制全螢幕模式',
    'payment': '控制支付請求',
    'usb': '控制 USB 設備存取',
    'accelerometer': '控制加速度感應器',
    'gyroscope': '控制陀螺儀'
  };

  const headerExample = `
// 使用 HTTP 標頭設置
Feature-Policy: ${selectedFeature} 'self' https://trusted-site.com;
Permissions-Policy: ${selectedFeature}=(self "https://trusted-site.com")`;

  const iframeExample = `
<!-- 在 iframe 上設置 -->
<iframe
  src="https://example.com"
  allow="${selectedFeature} 'self'; fullscreen 'self'"
></iframe>`;

  const checkExample = `
// 檢查特定功能的權限
const status = await navigator.permissions.query({
  name: '${selectedFeature}'
});
console.log(status.state); // 'granted', 'denied', 或 'prompt'

// 檢查功能是否啟用
if (document.featurePolicy) {
  const isAllowed = document.featurePolicy.allowsFeature('${selectedFeature}');
  console.log('${selectedFeature} 是否允許:', isAllowed);
  
  // 獲取允許使用此功能的源列表
  const allowlist = document.featurePolicy.getAllowlistForFeature('${selectedFeature}');
  console.log('允許清單:', allowlist);
}`;

  const codeExample = `
// HTTP 標頭設置
${headerExample}

// iframe 設置
${iframeExample}

// JavaScript 檢查
${checkExample}

// 常見的 Feature Policy 指令：
Feature-Policy: 
  camera 'none';                    // 禁用相機
  microphone 'self';               // 只允許同源使用麥克風
  geolocation *;                   // 允許所有源使用地理位置
  autoplay 'self' https://example.com;  // 允許特定源自動播放
  
// 新的 Permissions Policy 語法：
Permissions-Policy: 
  camera=(),                      // 禁用相機
  microphone=(self),              // 只允許同源使用麥克風
  geolocation=*,                  // 允許所有源使用地理位置
  autoplay=(self "https://example.com")  // 允許特定源自動播放`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Feature Policy API 展示"
      description="Feature Policy（現在也稱為 Permissions Policy）允許網站控制瀏覽器功能和 API 的使用。"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(features).map(([feature, description]) => (
            <button
              key={feature}
              onClick={() => setSelectedFeature(feature)}
              className={`p-3 rounded text-left ${
                selectedFeature === feature
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="font-bold">{feature}</div>
              <div className="text-sm">{description}</div>
            </button>
          ))}
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold mb-2">HTTP 標頭設置</h3>
          <pre className="text-sm bg-gray-800 text-white p-4 rounded overflow-x-auto">
            {headerExample}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold mb-2">iframe 設置</h3>
          <pre className="text-sm bg-gray-800 text-white p-4 rounded overflow-x-auto">
            {iframeExample}
          </pre>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">
            注意：Feature Policy 正在逐漸被 Permissions Policy 取代。
            兩者的主要區別在於語法格式，但功能基本相同。
          </p>
        </div>

        <div className="text-sm text-gray-600">
          <p>* 常見用途：</p>
          <ul className="list-disc list-inside ml-4">
            <li>限制敏感 API 的使用</li>
            <li>防止第三方內容濫用功能</li>
            <li>實施安全性最佳實踐</li>
            <li>控制 iframe 的權限</li>
          </ul>
        </div>

        <div className="text-sm text-gray-600">
          <p>* 最佳實踐：</p>
          <ul className="list-disc list-inside ml-4">
            <li>預設禁用不需要的功能</li>
            <li>只允許必要的源訪問功能</li>
            <li>定期審查權限策略</li>
            <li>使用最新的 Permissions Policy 語法</li>
          </ul>
        </div>
      </div>
    </DemoModal>
  );
};

export default FeaturePolicyDemo; 