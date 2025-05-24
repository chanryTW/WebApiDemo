import React, { useState, useRef, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface PointerEventsDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PointerInfo {
  pointerId: number;
  pointerType: string;
  pressure: number;
  tiltX: number;
  tiltY: number;
  x: number;
  y: number;
}

interface PointerEventLog {
  type: string;
  info: PointerInfo;
  timestamp: number;
}

const PointerEventsDemo: React.FC<PointerEventsDemoProps> = ({ isOpen, onClose }) => {
  const [activePointers, setActivePointers] = useState<Map<number, PointerInfo>>(new Map());
  const [events, setEvents] = useState<PointerEventLog[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        contextRef.current = context;
      }
    }
  }, []);

  const addEvent = (type: string, e: React.PointerEvent) => {
    setEvents(prev => [{
      type,
      info: {
        pointerId: e.pointerId,
        pointerType: e.pointerType,
        pressure: e.pressure,
        tiltX: e.tiltX,
        tiltY: e.tiltY,
        x: e.clientX,
        y: e.clientY
      },
      timestamp: Date.now()
    }, ...prev].slice(0, 5));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);

    setActivePointers(prev => {
      const next = new Map(prev);
      next.set(e.pointerId, {
        pointerId: e.pointerId,
        pointerType: e.pointerType,
        pressure: e.pressure,
        tiltX: e.tiltX,
        tiltY: e.tiltY,
        x,
        y
      });
      return next;
    });

    addEvent('pointerdown', e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activePointers.has(e.pointerId)) {
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();

      setActivePointers(prev => {
        const next = new Map(prev);
        next.set(e.pointerId, {
          pointerId: e.pointerId,
          pointerType: e.pointerType,
          pressure: e.pressure,
          tiltX: e.tiltX,
          tiltY: e.tiltY,
          x,
          y
        });
        return next;
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setActivePointers(prev => {
      const next = new Map(prev);
      next.delete(e.pointerId);
      return next;
    });
    addEvent('pointerup', e);
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    setActivePointers(prev => {
      const next = new Map(prev);
      next.delete(e.pointerId);
      return next;
    });
    addEvent('pointercancel', e);
  };

  const clearCanvas = () => {
    if (canvasRef.current && contextRef.current) {
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  };

  const getPointerTypeIcon = (type: string) => {
    switch (type) {
      case 'mouse':
        return (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
          </svg>
        );
      case 'pen':
        return (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        );
      case 'touch':
        return (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const codeExample = `// 監聽指針事件
element.addEventListener('pointerdown', (event) => {
  console.log('指針類型：', event.pointerType);
  console.log('壓力：', event.pressure);
  console.log('傾斜角度 X：', event.tiltX);
  console.log('傾斜角度 Y：', event.tiltY);
});

// 捕獲指針
element.setPointerCapture(event.pointerId);

// 釋放指針
element.releasePointerCapture(event.pointerId);`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Pointer Events API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-700">
            使用滑鼠、觸控或手寫筆在下方畫布上繪製，觀察不同類型指針的事件資訊
          </p>
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-64 bg-white border-2 border-gray-200 rounded-lg touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          />
          <button
            onClick={clearCanvas}
            className="absolute top-2 right-2 p-2 bg-white rounded-md shadow-sm hover:bg-gray-50 border border-gray-200"
          >
            <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              活動中的指針
            </h3>
            <div className="space-y-3">
              {activePointers.size === 0 ? (
                <div className="text-gray-500 text-center py-4">
                  無活動中的指針
                </div>
              ) : (
                Array.from(activePointers.values()).map((pointer) => (
                  <div
                    key={pointer.pointerId}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-blue-500">
                        {getPointerTypeIcon(pointer.pointerType)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">
                          ID: {pointer.pointerId}
                        </div>
                        <div className="text-sm text-gray-500">
                          類型: {pointer.pointerType}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>壓力: {pointer.pressure.toFixed(2)}</div>
                      <div>傾斜: {pointer.tiltX}°, {pointer.tiltY}°</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              最近的事件
            </h3>
            <div className="space-y-3">
              {events.length === 0 ? (
                <div className="text-gray-500 text-center py-4">
                  尚無事件記錄
                </div>
              ) : (
                events.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-blue-500">
                        {getPointerTypeIcon(event.info.pointerType)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">
                          {event.type}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {event.info.pointerId}, 類型: {event.info.pointerType}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatTime(event.timestamp)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DemoModal>
  );
};

export default PointerEventsDemo; 