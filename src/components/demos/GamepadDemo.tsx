import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface GamepadDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GamepadState {
  id: string;
  buttons: { pressed: boolean }[];
  axes: number[];
}

const GamepadDemo: React.FC<GamepadDemoProps> = ({ isOpen, onClose }) => {
  const [gamepads, setGamepads] = useState<GamepadState[]>([]);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('getGamepads' in navigator)) {
      setIsSupported(false);
      return;
    }

    const handleGamepadConnected = (e: GamepadEvent) => {
      console.log('Gamepad connected:', e.gamepad);
    };

    const handleGamepadDisconnected = (e: GamepadEvent) => {
      console.log('Gamepad disconnected:', e.gamepad);
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    const updateGamepads = () => {
      const pads = navigator.getGamepads();
      const gamepadStates: GamepadState[] = [];

      for (const pad of pads) {
        if (pad) {
          gamepadStates.push({
            id: pad.id,
            buttons: pad.buttons.map(btn => ({ pressed: btn.pressed })),
            axes: Array.from(pad.axes)
          });
        }
      }

      setGamepads(gamepadStates);
      requestAnimationFrame(updateGamepads);
    };

    const frameId = requestAnimationFrame(updateGamepads);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
      cancelAnimationFrame(frameId);
    };
  }, []);

  const codeExample = `// 監聽手把連接事件
window.addEventListener('gamepadconnected', (e) => {
  console.log('手把已連接:', e.gamepad);
});

// 監聽手把斷開事件
window.addEventListener('gamepaddisconnected', (e) => {
  console.log('手把已斷開:', e.gamepad);
});

// 獲取所有已連接的手把
const gamepads = navigator.getGamepads();

// 讀取手把狀態
for (const gamepad of gamepads) {
  if (gamepad) {
    // 按鈕狀態
    gamepad.buttons.forEach((button, index) => {
      console.log(\`按鈕 \${index}: \${button.pressed}\`);
    });

    // 搖桿軸狀態
    gamepad.axes.forEach((axis, index) => {
      console.log(\`軸 \${index}: \${axis}\`);
    });
  }
}`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Gamepad API 演示"
      description="展示遊戲手把的連接狀態和輸入數據。"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        {!isSupported ? (
          <div className="text-red-500 text-center">
            您的瀏覽器不支援 Gamepad API
          </div>
        ) : gamepads.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>尚未偵測到遊戲手把</p>
            <p className="mt-2">請連接遊戲手把並按下任意按鈕</p>
          </div>
        ) : (
          gamepads.map((gamepad, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-medium">手把 {index + 1}</h3>
              <div className="text-sm text-gray-600">{gamepad.id}</div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">按鈕狀態</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {gamepad.buttons.map((button, btnIndex) => (
                      <div
                        key={btnIndex}
                        className={`w-8 h-8 rounded flex items-center justify-center ${
                          button.pressed ? 'bg-green-500 text-white' : 'bg-gray-200'
                        }`}
                      >
                        {btnIndex}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">軸狀態</h4>
                  <div className="space-y-2">
                    {gamepad.axes.map((axis, axisIndex) => (
                      <div key={axisIndex} className="flex items-center gap-2">
                        <span className="w-6">#{axisIndex}</span>
                        <div className="flex-1 h-4 bg-gray-200 rounded overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{
                              width: `${((axis + 1) / 2) * 100}%`
                            }}
                          />
                        </div>
                        <span className="w-12 text-right">{axis.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DemoModal>
  );
};

export default GamepadDemo; 