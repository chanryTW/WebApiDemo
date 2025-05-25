import React, { useRef, useState } from 'react';
import DemoModal from '../DemoModal';

const AudioTrackListDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [tracks, setTracks] = useState<any[]>([]);

  const loadTracks = () => {
    const video = videoRef.current;
    if (!video) return;
    const list = (video as any).audioTracks ? Array.from((video as any).audioTracks) : [];
    setTracks(list);
  };

  const toggleTrack = (i: number) => {
    const video = videoRef.current;
    if (!video || !(video as any).audioTracks) return;
    const track = (video as any).audioTracks[i];
    track.enabled = !track.enabled;
    setTracks(Array.from((video as any).audioTracks));
  };

  const codeExample = `// 取得 audio tracks
const video = document.querySelector('video');
const tracks = video.audioTracks;
for (let i = 0; i < tracks.length; i++) {
  tracks[i].enabled = false; // 停用
}`;

  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="AudioTrackList 演示" description="多軌音訊切換範例" codeExample={codeExample}>
      <div className="space-y-4">
        <video ref={videoRef} src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" controls className="w-full" onLoadedMetadata={loadTracks} />
        <div>
          {tracks.length === 0 ? '此影片無多軌 audio tracks（請用支援的影片測試）' : (
            <ul className="list-disc pl-5">
              {tracks.map((t, i) => (
                <li key={i}>
                  軌道 {i + 1}：{t.label || '無標籤'}
                  <button onClick={() => toggleTrack(i)} className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs">{t.enabled ? '停用' : '啟用'}</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="text-sm text-gray-600 mt-4">此 API 僅在支援多軌音訊的瀏覽器與影片檔案下可用。</div>
      </div>
    </DemoModal>
  );
};

export default AudioTrackListDemo; 