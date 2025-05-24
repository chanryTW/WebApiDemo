import React, { useState, useEffect, useRef } from 'react';
import DemoModal from '../DemoModal';

interface WebAudioDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const WebAudioDemo: React.FC<WebAudioDemoProps> = ({ isOpen, onClose }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(440);
  const [volume, setVolume] = useState(0.5);
  const [waveform, setWaveform] = useState<OscillatorType>('sine');

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startOscillator();
    } else {
      stopOscillator();
    }
  }, [isPlaying, frequency, waveform]);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  const startOscillator = () => {
    if (!audioContextRef.current) return;

    oscillatorRef.current = audioContextRef.current.createOscillator();
    gainNodeRef.current = audioContextRef.current.createGain();

    oscillatorRef.current.type = waveform;
    oscillatorRef.current.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    gainNodeRef.current.gain.value = volume;

    oscillatorRef.current.connect(gainNodeRef.current);
    gainNodeRef.current.connect(analyserRef.current!);
    analyserRef.current!.connect(audioContextRef.current.destination);

    oscillatorRef.current.start();
    drawWaveform();
  };

  const stopOscillator = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    
    if (!canvas || !analyser) return;
    
    const canvasCtx = canvas.getContext('2d')!;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyser.getByteTimeDomainData(dataArray);
      
      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
      canvasCtx.beginPath();

      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  const codeExample = `// 創建音訊上下文
const audioContext = new AudioContext();

// 創建振盪器
const oscillator = audioContext.createOscillator();
oscillator.type = 'sine'; // 'sine', 'square', 'sawtooth', 'triangle'
oscillator.frequency.setValueAtTime(440, audioContext.currentTime);

// 創建音量控制節點
const gainNode = audioContext.createGain();
gainNode.gain.value = 0.5;

// 連接節點
oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);

// 開始播放
oscillator.start();

// 停止播放
oscillator.stop();`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Web Audio API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            音訊合成器控制
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                波形
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['sine', 'square', 'sawtooth', 'triangle'] as OscillatorType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setWaveform(type)}
                    className={`
                      px-4 py-2 rounded-md text-sm font-medium
                      ${waveform === type
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                頻率: {frequency} Hz
              </label>
              <input
                type="range"
                min="20"
                max="2000"
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                音量: {Math.round(volume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`
                w-full px-4 py-2 rounded-md text-sm font-medium text-white
                ${isPlaying
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
                }
              `}
            >
              {isPlaying ? '停止' : '播放'}
            </button>
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            波形可視化
          </h3>
          <canvas
            ref={canvasRef}
            width="600"
            height="200"
            className="w-full bg-gray-200 rounded-lg"
          />
        </div>
      </div>
    </DemoModal>
  );
};

export default WebAudioDemo; 