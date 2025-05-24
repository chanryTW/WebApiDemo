import React, { useState, useRef, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface WebAnimationsDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const WebAnimationsDemo: React.FC<WebAnimationsDemoProps> = ({ isOpen, onClose }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [animation, setAnimation] = useState<Animation | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    if (boxRef.current) {
      const keyframes = [
        { transform: 'translate(0)', backgroundColor: '#3B82F6' },
        { transform: 'translate(200px)', backgroundColor: '#EF4444' },
        { transform: 'translate(0)', backgroundColor: '#3B82F6' }
      ];

      const options = {
        duration: 2000,
        iterations: Infinity,
        easing: 'ease-in-out'
      };

      const anim = boxRef.current.animate(keyframes, options);
      setAnimation(anim);

      return () => {
        anim.cancel();
      };
    }
  }, []);

  const handlePlayPause = () => {
    if (animation) {
      if (animation.playState === 'paused') {
        animation.play();
        setIsPaused(false);
      } else {
        animation.pause();
        setIsPaused(true);
      }
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (animation) {
      animation.playbackRate = speed;
      setPlaybackRate(speed);
    }
  };

  const handleReverse = () => {
    if (animation) {
      animation.reverse();
    }
  };

  const codeExample = `// 創建動畫
const keyframes = [
  { transform: 'translate(0)', backgroundColor: 'blue' },
  { transform: 'translate(200px)', backgroundColor: 'red' },
  { transform: 'translate(0)', backgroundColor: 'blue' }
];

const options = {
  duration: 2000,
  iterations: Infinity,
  easing: 'ease-in-out'
};

// 啟動動畫
const animation = element.animate(keyframes, options);

// 控制動畫
animation.pause();  // 暫停
animation.play();   // 播放
animation.reverse(); // 反轉
animation.playbackRate = 2; // 設置播放速度`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Web Animations API 演示"
      description="展示使用 Web Animations API 控制元素動畫的功能。"
      codeExample={codeExample}
    >
      <div className="space-y-8">
        <div className="flex justify-center p-8 bg-gray-100 rounded-lg relative overflow-hidden">
          <div
            ref={boxRef}
            className="w-16 h-16 bg-blue-500 rounded-lg shadow-lg"
          />
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handlePlayPause}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isPaused ? '播放' : '暫停'}
          </button>
          <button
            onClick={handleReverse}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            反轉
          </button>
          <div className="flex items-center gap-2">
            <span className="text-gray-700">速度：</span>
            <select
              value={playbackRate}
              onChange={(e) => handleSpeedChange(Number(e.target.value))}
              className="px-2 py-1 border rounded"
            >
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="2">2x</option>
              <option value="4">4x</option>
            </select>
          </div>
        </div>
      </div>
    </DemoModal>
  );
};

export default WebAnimationsDemo; 