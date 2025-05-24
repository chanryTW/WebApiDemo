import React, { useState } from 'react';
import DemoModal from '../DemoModal';

interface DragAndDropDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DraggableItem {
  id: number;
  text: string;
  color: string;
}

interface DroppedFile {
  name: string;
  type: string;
  size: number;
}

const DragAndDropDemo: React.FC<DragAndDropDemoProps> = ({ isOpen, onClose }) => {
  const [items, setItems] = useState<DraggableItem[]>([
    { id: 1, text: '拖放我 1', color: 'bg-blue-100 border-blue-200' },
    { id: 2, text: '拖放我 2', color: 'bg-green-100 border-green-200' },
    { id: 3, text: '拖放我 3', color: 'bg-yellow-100 border-yellow-200' },
    { id: 4, text: '拖放我 4', color: 'bg-purple-100 border-purple-200' },
    { id: 5, text: '拖放我 5', color: 'bg-pink-100 border-pink-200' }
  ]);

  const [droppedFiles, setDroppedFiles] = useState<DroppedFile[]>([]);
  const [draggedItem, setDraggedItem] = useState<DraggableItem | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: DraggableItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    // 設置拖曳時的預覽圖片
    if (e.dataTransfer.setDragImage) {
      const elem = e.currentTarget;
      e.dataTransfer.setDragImage(elem, 20, 20);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (!draggedItem) return;

    const dragIndex = items.findIndex(item => item.id === draggedItem.id);
    if (dragIndex === dropIndex) return;

    const newItems = [...items];
    const [removed] = newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, removed);
    setItems(newItems);
  };

  const handleFileDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).map(file => ({
      name: file.name,
      type: file.type || '未知',
      size: file.size
    }));
    setDroppedFiles(prev => [...prev, ...files]);
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const codeExample = `// 拖曳元素
element.draggable = true;
element.ondragstart = (e) => {
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', '要傳遞的資料');
};

// 放置區域
dropZone.ondragover = (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
};

dropZone.ondrop = (e) => {
  e.preventDefault();
  const data = e.dataTransfer.getData('text/plain');
  // 處理放置的資料
};

// 檔案拖放
dropZone.ondrop = (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  // 處理放置的檔案
};`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Drag and Drop API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            列表排序
          </h3>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={() => setDragOverIndex(null)}
                className={`
                  p-4 rounded-lg border-2 cursor-move
                  ${item.color}
                  ${dragOverIndex === index ? 'border-dashed border-blue-500' : ''}
                  ${draggedItem?.id === item.id ? 'opacity-50' : ''}
                  transition-all duration-200
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.text}</span>
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            檔案拖放區域
          </h3>
          <div
            onDragOver={handleFileDragOver}
            onDrop={handleFileDrop}
            className="p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:border-gray-400 transition-colors duration-200"
          >
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mt-2 text-gray-600">
                將檔案拖放到這裡
              </p>
            </div>

            {droppedFiles.length > 0 && (
              <div className="mt-6 space-y-2">
                <h4 className="font-medium text-gray-700">已放置的檔案：</h4>
                {droppedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          類型：{file.type} | 大小：{formatSize(file.size)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DemoModal>
  );
};

export default DragAndDropDemo; 