import React, { useRef, useState } from 'react';
import DemoModal from '../DemoModal';

const HTMLMediaElementDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const changeVolume = (v: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = v;
    setVolume(v);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  const seek = (sec: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime += sec;
  };

  const codeExample = `// 控制 HTMLMediaElement
const audio = document.querySelector('audio');
audio.play();
audio.pause();
audio.volume = 0.5;
audio.muted = true;
audio.currentTime += 5;`;

  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="HTMLMediaElement 演示" description="音訊元素控制範例" codeExample={codeExample}>
      <div className="space-y-4">
        <audio ref={audioRef} src="https://www.w3schools.com/html/horse.mp3" preload="auto" className="w-full" />
        <div className="flex gap-2 flex-wrap">
          <button onClick={togglePlay} className="px-4 py-2 bg-blue-500 text-white rounded">{playing ? '暫停' : '播放'}</button>
          <button onClick={() => seek(-5)} className="px-4 py-2 bg-gray-500 text-white rounded">倒退 5 秒</button>
          <button onClick={() => seek(5)} className="px-4 py-2 bg-gray-500 text-white rounded">快轉 5 秒</button>
          <button onClick={toggleMute} className="px-4 py-2 bg-yellow-500 text-white rounded">{muted ? '取消靜音' : '靜音'}</button>
          <input type="range" min={0} max={1} step={0.01} value={volume} onChange={e => changeVolume(Number(e.target.value))} className="w-32" />
        </div>
      </div>
    </DemoModal>
  );
};

export default HTMLMediaElementDemo; 