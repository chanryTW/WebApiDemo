import React, { useRef, useState } from 'react';
import DemoModal from '../DemoModal';

const TextTrackListDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [tracks, setTracks] = useState<any[]>([]);

  const loadTracks = () => {
    const video = videoRef.current;
    if (!video) return;
    const list = (video as any).textTracks ? Array.from((video as any).textTracks) : [];
    setTracks(list);
  };

  const toggleTrack = (i: number) => {
    const video = videoRef.current;
    if (!video || !(video as any).textTracks) return;
    const track = (video as any).textTracks[i];
    track.mode = track.mode === 'showing' ? 'hidden' : 'showing';
    setTracks(Array.from((video as any).textTracks));
  };

  const codeExample = `// 取得 text tracks
const video = document.querySelector('video');
const tracks = video.textTracks;
for (let i = 0; i < tracks.length; i++) {
  tracks[i].mode = 'showing'; // 顯示字幕
}`;

  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="TextTrackList 演示" description="字幕/章節切換範例" codeExample={codeExample}>
      <div className="space-y-4">
        <video ref={videoRef} controls className="w-full" onLoadedMetadata={loadTracks}>
          <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
          <track label="English" kind="subtitles" srcLang="en" src="https://interactive-examples.mdn.mozilla.net/media/examples/fragments.vtt" default />
        </video>
        <div>
          {tracks.length === 0 ? '此影片無字幕/章節 tracks（請用支援的影片測試）' : (
            <ul className="list-disc pl-5">
              {tracks.map((t, i) => (
                <li key={i}>
                  軌道 {i + 1}：{t.label || t.language || '無標籤'}
                  <button onClick={() => toggleTrack(i)} className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs">{t.mode === 'showing' ? '隱藏' : '顯示'}</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="text-sm text-gray-600 mt-4">此 API 僅在支援字幕的瀏覽器與影片檔案下可用。</div>
      </div>
    </DemoModal>
  );
};

export default TextTrackListDemo; 