import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface WebMidiDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MidiDevice {
  id: string;
  name: string;
  manufacturer: string;
  type: 'input' | 'output';
}

interface MidiNote {
  note: number;
  velocity: number;
  timestamp: number;
}

const WebMidiDemo: React.FC<WebMidiDemoProps> = ({ isOpen, onClose }) => {
  const [devices, setDevices] = useState<MidiDevice[]>([]);
  const [activeNotes, setActiveNotes] = useState<MidiNote[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      setError('您的瀏覽器不支援 Web MIDI API');
      return;
    }

    const initializeMIDI = async () => {
      try {
        const midiAccess = await navigator.requestMIDIAccess();

        const updateDevices = () => {
          const deviceList: MidiDevice[] = [];
          midiAccess.inputs.forEach(input => {
            deviceList.push({
              id: input.id,
              name: input.name || '未知設備',
              manufacturer: input.manufacturer || '未知製造商',
              type: 'input'
            });
          });
          midiAccess.outputs.forEach(output => {
            deviceList.push({
              id: output.id,
              name: output.name || '未知設備',
              manufacturer: output.manufacturer || '未知製造商',
              type: 'output'
            });
          });
          setDevices(deviceList);
        };

        // 監聽 MIDI 設備連接狀態變化
        midiAccess.addEventListener('statechange', updateDevices);

        // 設置 MIDI 輸入事件處理
        midiAccess.inputs.forEach(input => {
          input.onmidimessage = (event: MIDIMessageEvent) => {
            if (event.data) {
              const [command, note, velocity] = event.data;
              // MIDI 音符開始事件
              if (command === 144 && velocity > 0) {
                setActiveNotes(prev => [...prev, {
                  note,
                  velocity,
                  timestamp: Date.now()
                }]);
              }
              // MIDI 音符結束事件
              else if (command === 128 || (command === 144 && velocity === 0)) {
                setActiveNotes(prev => prev.filter(n => n.note !== note));
              }
            }
          };
        });

        updateDevices();
      } catch (err) {
        setError('無法訪問 MIDI 設備：' + (err instanceof Error ? err.message : String(err)));
      }
    };

    initializeMIDI();
  }, []);

  const getNoteColor = (note: number) => {
    const hue = (note * 360 / 127) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  const codeExample = `// 請求訪問 MIDI 設備
if (navigator.requestMIDIAccess) {
  try {
    const midiAccess = await navigator.requestMIDIAccess();
    
    // 列出所有 MIDI 設備
    midiAccess.inputs.forEach(input => {
      console.log('輸入設備:', input.name);
    });

    // 監聽 MIDI 輸入事件
    midiAccess.inputs.forEach(input => {
      input.addEventListener('midimessage', (event) => {
        const [command, note, velocity] = event.data;
        
        // 處理音符按下事件
        if (command === 144 && velocity > 0) {
          console.log('音符按下:', note, '力度:', velocity);
        }
        // 處理音符釋放事件
        else if (command === 128 || (command === 144 && velocity === 0)) {
          console.log('音符釋放:', note);
        }
      });
    });

    // 監聽設備連接狀態變化
    midiAccess.addEventListener('statechange', (event) => {
      console.log('MIDI 設備狀態改變:', event.port.name, event.port.state);
    });
  } catch (err) {
    console.error('無法訪問 MIDI 設備:', err);
  }
}`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Web MIDI API 演示"
      description="展示如何連接和使用 MIDI 音樂設備，包括接收音符事件和設備狀態監控。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        {error ? (
          <div className="text-red-500 text-center">
            {error}
          </div>
        ) : (
          <>
            <div className="border rounded-md p-4">
              <h3 className="font-medium text-gray-700 mb-2">已連接的 MIDI 設備：</h3>
              {devices.length === 0 ? (
                <div className="text-gray-500 text-center">
                  未檢測到 MIDI 設備，請連接設備後重試
                </div>
              ) : (
                <div className="space-y-2">
                  {devices.map(device => (
                    <div
                      key={device.id}
                      className="bg-gray-50 p-3 rounded-md flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{device.name}</div>
                        <div className="text-sm text-gray-600">
                          製造商：{device.manufacturer}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        device.type === 'input' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {device.type === 'input' ? '輸入' : '輸出'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-medium text-gray-700 mb-2">即時 MIDI 音符顯示：</h3>
              <div className="h-32 bg-gray-100 rounded-md relative">
                {activeNotes.map(note => (
                  <div
                    key={`${note.note}-${note.timestamp}`}
                    className="absolute h-8 rounded-md transition-all duration-200"
                    style={{
                      backgroundColor: getNoteColor(note.note),
                      left: `${(note.note / 127) * 100}%`,
                      top: `${(1 - note.velocity / 127) * 100}%`,
                      width: '8px',
                      transform: 'translateX(-50%)',
                      opacity: 0.8
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>提示：</p>
              <ul className="list-disc list-inside">
                <li>連接 MIDI 鍵盤或控制器到電腦</li>
                <li>按下按鍵可以看到即時音符顯示</li>
                <li>音符位置表示音高，高度表示力度</li>
                <li>顏色根據音符音高自動變化</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </DemoModal>
  );
};

export default WebMidiDemo; 