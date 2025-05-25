import React, { useRef, useState } from 'react';
import DemoModal from '../DemoModal';

const CanvasCaptureMediaStreamDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 300, 150);
    ctx.fillStyle = '#4f46e5';
    ctx.fillRect(20, 20, 100, 100);
    ctx.fillStyle = '#f59e42';
    ctx.beginPath();
    ctx.arc(200, 75, 50, 0, 2 * Math.PI);
    ctx.fill();
  };

  const startRecording = () => {
    setVideoUrl(null);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const stream = canvas.captureStream();
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunks.current = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'video/webm' });
      setVideoUrl(URL.createObjectURL(blob));
    };
    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const codeExample = `// 將 canvas 畫面轉為 MediaStream 並錄製
const canvas = document.querySelector('canvas');
const stream = canvas.captureStream();
const recorder = new MediaRecorder(stream);
recorder.ondataavailable = e => { /* 處理影片資料 */ };
recorder.start();
// ...
recorder.stop();`;

  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="Canvas Capture MediaStream API 演示" description="Canvas 畫面錄影範例" codeExample={codeExample}>
      <div className="space-y-4">
        <canvas ref={canvasRef} width={300} height={150} className="border rounded bg-gray-50" />
        <button onClick={draw} className="px-4 py-2 bg-green-500 text-white rounded">繪製圖形</button>
        <button onClick={recording ? stopRecording : startRecording} className={`px-4 py-2 rounded text-white ${recording ? 'bg-red-500' : 'bg-blue-500'} ml-2`}>{recording ? '停止錄影' : '開始錄影'}</button>
        {videoUrl && (
          <div>
            <video src={videoUrl} controls className="w-full mt-2" />
            <a href={videoUrl} download="canvas-record.webm" className="text-blue-600 underline ml-2">下載影片</a>
          </div>
        )}
        <div className="text-sm text-gray-600 mt-4">此 API 僅在支援的瀏覽器（如 Chrome、Firefox）且 HTTPS 下可用。</div>
      </div>
    </DemoModal>
  );
};

export default CanvasCaptureMediaStreamDemo; 