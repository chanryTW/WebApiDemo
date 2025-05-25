import React, { useRef, useState } from 'react';
import DemoModal from '../DemoModal';

const MediaSourceDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState('');

  const loadVideo = () => {
    setError('');
    try {
      const mediaSource = new MediaSource();
      const video = videoRef.current;
      if (!video) return;
      video.src = URL.createObjectURL(mediaSource);
      mediaSource.addEventListener('sourceopen', () => {
        const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8,vorbis"');
        fetch('https://storage.googleapis.com/webfundamentals-assets/videos/chrome.webm')
          .then(r => r.arrayBuffer())
          .then(buf => {
            sourceBuffer.appendBuffer(buf);
          });
      });
    } catch (e) {
      if (e instanceof Error) setError(e.message);
      else setError(String(e));
    }
  };

  const codeExample = `// 動態串流影片
const mediaSource = new MediaSource();
video.src = URL.createObjectURL(mediaSource);
mediaSource.addEventListener('sourceopen', () => {
  const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8,vorbis"');
  fetch('影片網址').then(r => r.arrayBuffer()).then(buf => {
    sourceBuffer.appendBuffer(buf);
  });
});`;

  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="MediaSource API 演示" description="動態串流影片範例" codeExample={codeExample}>
      <div className="space-y-4">
        <video ref={videoRef} controls className="w-full bg-black rounded" width={320} height={180} />
        <button onClick={loadVideo} className="px-4 py-2 bg-blue-500 text-white rounded">載入影片</button>
        {error && <div className="text-red-500">{error}</div>}
        <div className="text-sm text-gray-600 mt-4">此 API 僅在支援的瀏覽器（如 Chrome、Edge）且 HTTPS 下可用。</div>
      </div>
    </DemoModal>
  );
};

export default MediaSourceDemo; 