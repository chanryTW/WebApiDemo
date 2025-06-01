import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface PermissionsDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PermissionStatus {
  name: string;
  state: PermissionState;
  error?: string;
}

const PermissionsDemo: React.FC<PermissionsDemoProps> = ({ isOpen, onClose }) => {
  const [permissions, setPermissions] = useState<PermissionStatus[]>([]);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('permissions' in navigator);
  }, []);

  const permissionNames = [
    'geolocation',
    'notifications',
    'push',
    'microphone',
    'camera',
    'clipboard-read',
    'clipboard-write'
  ];

  const checkPermission = async (name: string) => {
    try {
      const status = await navigator.permissions.query({ name: name as PermissionName });
      setPermissions(prev => [
        ...prev.filter(p => p.name !== name),
        { name, state: status.state }
      ]);

      status.addEventListener('change', () => {
        setPermissions(prev => [
          ...prev.filter(p => p.name !== name),
          { name, state: status.state }
        ]);
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      setPermissions(prev => [
        ...prev.filter(p => p.name !== name),
        { name, state: 'denied', error: errorMessage }
      ]);
    }
  };

  const checkAllPermissions = () => {
    setPermissions([]);
    permissionNames.forEach(name => checkPermission(name));
  };

  const getStateColor = (state: PermissionState) => {
    switch (state) {
      case 'granted':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'denied':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'prompt':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStateIcon = (state: PermissionState) => {
    switch (state) {
      case 'granted':
        return '✅';
      case 'denied':
        return '❌';
      case 'prompt':
        return '❓';
      default:
        return '❔';
    }
  };

  const codeExample = `// 檢查特定權限的狀態
const checkPermission = async (name) => {
  try {
    const status = await navigator.permissions.query({ name });
    console.log(\`\${name} permission: \${status.state}\`);
    
    // 監聽權限狀態變化
    status.addEventListener('change', () => {
      console.log(\`\${name} permission changed to: \${status.state}\`);
    });
  } catch (error) {
    console.error(\`Error checking \${name} permission:, \${error}\`);
  }
};

// 檢查多個權限
const permissions = [
  'geolocation',
  'notifications',
  'push',
  'microphone',
  'camera',
  'clipboard-read',
  'clipboard-write'
];

permissions.forEach(permission => checkPermission(permission));`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Permissions API 展示"
      description="此 API 提供了一個統一的介面來查詢和管理網頁應用程式的權限狀態。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        {!isSupported ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
            ⚠️ 您的瀏覽器不支援 Permissions API
          </div>
        ) : (
          <>
            <button
              onClick={checkAllPermissions}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              檢查所有權限
            </button>

            <div className="grid gap-4">
              {permissions.map(({ name, state, error }) => (
                <div
                  key={name}
                  className={`p-4 rounded border ${getStateColor(state)}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{name}</span>
                      <span className="ml-2">{getStateIcon(state)}</span>
                    </div>
                    <span className="text-sm">{state}</span>
                  </div>
                  {error && (
                    <p className="text-sm text-red-600 mt-2">
                      錯誤：{error}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-600">
              <p>* Permissions API 的應用場景：</p>
              <ul className="list-disc list-inside ml-4">
                <li>檢查和監控權限狀態</li>
                <li>根據權限狀態調整功能</li>
                <li>提供更好的使用者體驗</li>
                <li>權限管理系統</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </DemoModal>
  );
};

export default PermissionsDemo; 