import React, { useState, useRef } from 'react';
import DemoModal from '../DemoModal';

interface FileApiDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FileInfo {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  preview?: string;
}

const FileApiDemo: React.FC<FileApiDemoProps> = ({ isOpen, onClose }) => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList) => {
    try {
      const newFiles: FileInfo[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const fileInfo: FileInfo = {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified
        };

        // 如果是圖片，創建預覽
        if (file.type.startsWith('image/')) {
          fileInfo.preview = await readFileAsDataURL(file);
        }

        newFiles.push(fileInfo);
      }

      setFiles(prev => [...prev, ...newFiles]);
      setError('');
    } catch {
      setError('讀取檔案時發生錯誤');
    }
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const codeExample = `// 使用 FileReader 讀取檔案
const file = input.files[0];
const reader = new FileReader();

// 讀取為 Data URL（適合圖片預覽）
reader.onload = (e) => {
  const dataUrl = e.target.result;
  console.log('檔案內容：', dataUrl);
};
reader.readAsDataURL(file);

// 讀取為文字
reader.onload = (e) => {
  const text = e.target.result;
  console.log('檔案內容：', text);
};
reader.readAsText(file);

// 檔案資訊
console.log('檔案名稱：', file.name);
console.log('檔案類型：', file.type);
console.log('檔案大小：', file.size);
console.log('最後修改：', file.lastModified);`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="File API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative p-8 border-2 border-dashed rounded-lg text-center
            ${dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleChange}
            className="hidden"
          />

          <div className="space-y-4">
            <svg
              className={`w-12 h-12 mx-auto ${dragActive ? 'text-blue-500' : 'text-gray-400'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>

            <div className="space-y-2">
              <p className={`text-lg ${dragActive ? 'text-blue-500' : 'text-gray-600'}`}>
                {dragActive ? '放開以上傳檔案' : '拖放檔案到這裡，或'}
              </p>
              {!dragActive && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  點擊選擇檔案
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">
            已選擇的檔案
          </h3>

          {files.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              尚未選擇任何檔案
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-start space-x-4">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <div className="text-sm text-gray-500">
                        <p>類型：{file.type || '未知'}</p>
                        <p>大小：{formatSize(file.size)}</p>
                        <p>修改時間：{formatDate(file.lastModified)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DemoModal>
  );
};

export default FileApiDemo; 