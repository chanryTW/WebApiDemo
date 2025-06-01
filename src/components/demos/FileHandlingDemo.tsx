import React, { useState } from 'react';
import DemoModal from '../DemoModal';

interface FileHandlingDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LaunchParams {
  files: FileSystemFileHandle[];
}

interface LaunchQueue {
  setConsumer(callback: (params: LaunchParams) => void): void;
}

declare global {
  interface Window {
    launchQueue?: LaunchQueue;
  }
}

const FileHandlingDemo: React.FC<FileHandlingDemoProps> = ({ isOpen, onClose }) => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [launchQueue, setLaunchQueue] = useState<LaunchQueue | null>(null);

  // 檢查瀏覽器是否支援 File Handling API
  React.useEffect(() => {
    setIsSupported('launchQueue' in window);
    if ('launchQueue' in window && window.launchQueue) {
      setLaunchQueue(window.launchQueue);
    }
  }, []);

  // 處理檔案開啟請求
  React.useEffect(() => {
    if (launchQueue) {
      launchQueue.setConsumer((launchParams: LaunchParams) => {
        if (!launchParams.files.length) {
          return;
        }
        // 處理檔案
        Promise.all(
          launchParams.files.map((handle: FileSystemFileHandle) => handle.getFile())
        ).then((files) => {
          console.log('Launched with files:', files);
        });
      });
    }
  }, [launchQueue]);

  const codeExample = `
// 在 manifest.json 中註冊檔案類型
{
  "file_handlers": [
    {
      "action": "/open-txt",
      "accept": {
        "text/plain": [".txt"]
      }
    },
    {
      "action": "/open-image",
      "accept": {
        "image/*": [".jpg", ".jpeg", ".png"]
      }
    }
  ]
}

// 在應用程式中處理檔案開啟請求
if ('launchQueue' in window) {
  launchQueue.setConsumer((launchParams) => {
    if (!launchParams.files.length) {
      return;
    }
    
    // 處理檔案
    Promise.all(
      launchParams.files.map((handle) => handle.getFile())
    ).then((files) => {
      console.log('Launched with files:', files);
    });
  });
}
`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="File Handling API 示範"
      description="File Handling API 允許網頁應用程式註冊為特定檔案類型的處理程式，使用者可以直接用網頁應用程式開啟這些檔案。"
    >
      <div className="space-y-4">
        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="text-yellow-700">
            注意：File Handling API 目前僅在已安裝的 PWA 中支援，且需要在 manifest.json 中註冊檔案類型。
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">瀏覽器支援狀態：</h3>
          <p className={isSupported ? "text-green-600" : "text-red-600"}>
            {isSupported ? "✓ 支援 File Handling API" : "✗ 不支援 File Handling API"}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">程式碼範例：</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>{codeExample}</code>
          </pre>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">使用場景：</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>文字編輯器應用程式處理 .txt 檔案</li>
            <li>圖片編輯器應用程式處理圖片檔案</li>
            <li>PDF 閱讀器應用程式處理 PDF 檔案</li>
            <li>音樂播放器應用程式處理音訊檔案</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">實作步驟：</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>在 manifest.json 中註冊要處理的檔案類型</li>
            <li>將網頁應用程式安裝為 PWA</li>
            <li>實作檔案處理邏輯</li>
            <li>測試檔案開啟功能</li>
          </ol>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">注意事項：</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>需要在 HTTPS 環境下使用</li>
            <li>僅支援已安裝的 PWA</li>
            <li>需要在 manifest.json 中正確配置</li>
            <li>使用者需要將應用程式設為預設程式</li>
            <li>不同作業系統的行為可能不同</li>
          </ul>
        </div>
      </div>
    </DemoModal>
  );
};

export default FileHandlingDemo; 