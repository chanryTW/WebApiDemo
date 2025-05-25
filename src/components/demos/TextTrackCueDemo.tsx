import React, { useRef, useState } from 'react';
import DemoModal from '../DemoModal';

const TextTrackCueDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cues, setCues] = useState<any[]>([]);
  const [text, setText] = useState('Hello Cue!');

  const loadCues = () => {
    const video = videoRef.current;
    if (!video) return;
    const tracks = (video as any).textTracks;
    if (tracks && tracks[0]) {
      setCues(Array.from(tracks[0].cues || []));
    }
  };

  const addCue = () => {
    const video = videoRef.current;
    if (!video) return;
    const tracks = (video as any).textTracks;
    if (tracks && tracks[0]) {
      const cue = new window.VTTCue(1, 5, text);
      tracks[0].addCue(cue);
      setCues(Array.from(tracks[0].cues));
    }
  };

  const removeCue = (i: number) => {
    const video = videoRef.current;
    if (!video) return;
    const tracks = (video as any).textTracks;
    if (tracks && tracks[0]) {
      tracks[0].removeCue(tracks[0].cues[i]);
      setCues(Array.from(tracks[0].cues));
    }
  };

  const codeExample = `// 動態新增字幕 cue
const video = document.querySelector('video');
const track = video.textTracks[0];
const cue = new VTTCue(1, 5, 'Hello Cue!');
track.addCue(cue);
// ...
track.removeCue(cue);`;

  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="TextTrackCue 演示" description="字幕 cue 動態新增/移除範例" codeExample={codeExample}>
      <div className="space-y-4">
        <video ref={videoRef} controls className="w-full" onLoadedMetadata={loadCues}>
          <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
          <track label="English" kind="subtitles" srcLang="en" src="https://interactive-examples.mdn.mozilla.net/media/examples/fragments.vtt" default />
        </video>
        <div className="flex gap-2 mt-2">
          <input value={text} onChange={e => setText(e.target.value)} className="border p-1 rounded w-48" placeholder="cue 內容" />
          <button onClick={addCue} className="px-3 py-1 bg-blue-500 text-white rounded">新增 cue</button>
        </div>
        <div>
          {cues.length === 0 ? '目前無字幕 cue' : (
            <ul className="list-disc pl-5">
              {cues.map((c, i) => (
                <li key={i}>
                  {c.text}（{c.startTime}~{c.endTime}秒）
                  <button onClick={() => removeCue(i)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-xs">移除</button>
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

export default TextTrackCueDemo; 