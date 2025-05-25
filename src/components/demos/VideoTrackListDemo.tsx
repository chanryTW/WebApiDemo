import React, { useRef, useState } from 'react';
import DemoModal from '../DemoModal';

const VideoTrackListDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [tracks, setTracks] = useState<Partial<VideoTrack>[]>([]);

  const loadTracks = () => {
    const video = videoRef.current;
    if (!video) return;
    const list = (video as any).videoTracks ? Array.from((video as any).videoTracks) : [];
    setTracks(list);
  };

  const toggleTrack = (i: number) => {
    const video = videoRef.current;
    if (!video || !(video as any).videoTracks) return;
    const track = (video as any).videoTracks[i];
    track.enabled = !track.enabled;
    setTracks(Array.from((video as any).videoTracks));
  };

  const codeExample = `// 取得 video tracks
const video = document.querySelector('video');
const tracks = video.videoTracks;
for (let i = 0; i < tracks.length; i++) {
  tracks[i].enabled = false; // 停用
}`;

  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="VideoTrackList 演示" description="多軌影片切換範例" codeExample={codeExample}>
      <div className="space-y-4">
        <video ref={videoRef} src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" controls className="w-full" onLoadedMetadata={loadTracks} />
        <div>
          {tracks.length === 0 ? '此影片無多軌 video tracks（請用支援的影片測試）' : (
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
        <div className="text-sm text-gray-600 mt-4">此 API 僅在支援多軌影片的瀏覽器與影片檔案下可用。</div>
      </div>
    </DemoModal>
  );
};

export default VideoTrackListDemo; 