import React, { useRef, useState } from 'react';
import DemoModal from '../DemoModal';

const AudioContextDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const [playing, setPlaying] = useState(false);
  const [freq, setFreq] = useState(440);

  const start = () => {
    if (!audioCtxRef.current) audioCtxRef.current = new window.AudioContext();
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(ctx.destination);
    osc.start();
    oscillatorRef.current = osc;
    setPlaying(true);
  };

  const stop = () => {
    oscillatorRef.current?.stop();
    oscillatorRef.current?.disconnect();
    oscillatorRef.current = null;
    setPlaying(false);
  };

  const changeFreq = (f: number) => {
    setFreq(f);
    if (oscillatorRef.current) oscillatorRef.current.frequency.value = f;
  };

  const codeExample = `// 產生純音
const ctx = new AudioContext();
const osc = ctx.createOscillator();
osc.type = 'sine';
osc.frequency.value = 440;
osc.connect(ctx.destination);
osc.start();
// ...
osc.stop();`;

  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="AudioContext 演示" description="純音產生與頻率調整範例" codeExample={codeExample}>
      <div className="space-y-4">
        <div className="flex gap-2 items-center">
          <button onClick={playing ? stop : start} className={`px-4 py-2 rounded text-white ${playing ? 'bg-red-500' : 'bg-blue-500'}`}>{playing ? '停止' : '播放'}</button>
          <input type="range" min={100} max={2000} value={freq} onChange={e => changeFreq(Number(e.target.value))} className="w-48" />
          <span>{freq} Hz</span>
        </div>
        <div className="text-sm text-gray-600 mt-4">此 API 僅在支援的瀏覽器（如 Chrome、Firefox、Safari）下可用。</div>
      </div>
    </DemoModal>
  );
};

export default AudioContextDemo; 