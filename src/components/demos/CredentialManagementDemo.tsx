import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface CredentialManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Credential {
  id: string;
  name: string;
  iconURL?: string;
  type: string;
}

interface PasswordCredential {
  id: string;
  name: string;
  iconURL?: string;
  password: string;
  type: 'password';
}

interface CredentialRequestOptions {
  password?: boolean;
  mediation?: 'optional' | 'required' | 'silent';
}

interface CredentialsContainer {
  store: (credential: PasswordCredential) => Promise<void>;
  get: (options: CredentialRequestOptions) => Promise<PasswordCredential | null>;
  preventSilentAccess: () => Promise<void>;
}

declare global {
  interface Window {
    PasswordCredential: new (init: { id: string; password: string; name?: string; iconURL?: string }) => PasswordCredential;
  }
  interface Navigator {
    readonly credentials: CredentialsContainer;
  }
}

const CredentialManagementDemo: React.FC<CredentialManagementProps> = ({ isOpen, onClose }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // 檢查瀏覽器支援
    setIsSupported('credentials' in navigator && 'PasswordCredential' in window);
  }, []);

  const storeCredential = async () => {
    if (!isSupported || !username || !password) return;

    try {
      const cred = new window.PasswordCredential({
        id: username,
        password: password,
        name: username,
        iconURL: 'https://example.com/icon.png'
      });

      await navigator.credentials.store(cred);
      setCredentials(prev => [...prev, {
        id: username,
        name: username,
        type: 'password'
      }]);

      setUsername('');
      setPassword('');
      setError('');
    } catch (err) {
      setError(`錯誤：${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const getCredential = async () => {
    if (!isSupported) return;

    try {
      const cred = await navigator.credentials.get({
        password: true,
        mediation: 'optional'
      });

      if (cred) {
        setUsername(cred.id);
        setPassword((cred as PasswordCredential).password);
        setError('');
      } else {
        setError('沒有找到已儲存的憑證');
      }
    } catch (err) {
      setError(`錯誤：${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const preventSilentAccess = async () => {
    if (!isSupported) return;

    try {
      await navigator.credentials.preventSilentAccess();
      setError('已停用自動登入');
    } catch (err) {
      setError(`錯誤：${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const codeExample = `
// 儲存密碼憑證
const cred = new PasswordCredential({
  id: 'user@example.com',
  password: 'secretpass',
  name: 'John Doe',
  iconURL: 'https://example.com/icon.png'
});

await navigator.credentials.store(cred);

// 獲取已儲存的憑證
const cred = await navigator.credentials.get({
  password: true,
  mediation: 'optional'
});

if (cred) {
  console.log('用戶名：', cred.id);
  console.log('密碼：', cred.password);
}

// 防止自動登入
await navigator.credentials.preventSilentAccess();
  `.trim();

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Credential Management API 示範"
      description="展示如何使用 Credential Management API 管理用戶憑證。"
    >
      <div className="space-y-4">
        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="text-yellow-800">
            瀏覽器支援：{isSupported ? '✅ 支援' : '❌ 不支援'}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">儲存新憑證</h3>
            <div className="space-y-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="用戶名"
                className="w-full p-2 border rounded-md"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密碼"
                className="w-full p-2 border rounded-md"
              />
              <button
                onClick={storeCredential}
                disabled={!isSupported || !username || !password}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                儲存憑證
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">已儲存的憑證</h3>
            <div className="space-y-2">
              <button
                onClick={getCredential}
                disabled={!isSupported}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                獲取憑證
              </button>
              <button
                onClick={preventSilentAccess}
                disabled={!isSupported}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                停用自動登入
              </button>
            </div>
          </div>

          {credentials.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">憑證列表</h3>
              <div className="space-y-2">
                {credentials.map((cred) => (
                  <div
                    key={cred.id}
                    className="p-4 bg-gray-100 rounded-md"
                  >
                    <p>ID: {cred.id}</p>
                    <p>名稱: {cred.name}</p>
                    <p>類型: {cred.type}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <div className="mt-6">
          <p className="font-medium mb-2">使用範例：</p>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>{codeExample}</code>
          </pre>
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-800">
            注意：此 API 需要在安全的上下文（HTTPS）中使用。
            在本地開發環境中，某些功能可能無法正常運作。
          </p>
        </div>
      </div>
    </DemoModal>
  );
};

export default CredentialManagementDemo; 