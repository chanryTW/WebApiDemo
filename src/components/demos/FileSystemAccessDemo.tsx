import React, { useState } from 'react';
import DemoSection from '../DemoSection';

const FileSystemAccessDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const [filename, setFilename] = useState('');

  const handleOpen = async () => {
    // @ts-ignore
    const [fileHandle] = await window.showOpenFilePicker();
    const file = await fileHandle.getFile();
    setFilename(file.name);
    setContent(await file.text());
  };

  const handleSave = async () => {
    // @ts-ignore
    const opts = { types: [{ description: 'Text Files', accept: { 'text/plain': ['.txt'] } }] };
    // @ts-ignore
    const handle = await window.showSaveFilePicker(opts);
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
    setFilename(handle.name);
  };

  return (
    <DemoSection title="File System Access API" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-2">
        <button className="btn" onClick={handleOpen}>開啟檔案</button>
        <button className="btn ml-2" onClick={handleSave}>儲存檔案</button>
        <div className="mt-2">目前檔案：{filename}</div>
        <textarea className="w-full border rounded p-2 mt-2" rows={6} value={content} onChange={e => setContent(e.target.value)} />
      </div>
    </DemoSection>
  );
};

export default FileSystemAccessDemo; 