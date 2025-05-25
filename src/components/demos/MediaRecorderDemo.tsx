import React, { useRef, useState } from 'react';
import DemoModal from '../DemoModal';

const MediaRecorderDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    setError('');
    setAudioUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunks.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
      };
      mediaRecorder.start();
      setRecording(true);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
      else setError(String(e));
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const codeExample = `// 錄製音訊
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const recorder = new MediaRecorder(stream);
recorder.ondataavailable = e => { /* 處理音訊資料 */ };
recorder.start();
// ...
recorder.stop();`;

  return (
    <DemoModal isOpen={isOpen} onClose={onClose} title="MediaRecorder API 演示" description="錄音與播放範例" codeExample={codeExample}>
      <div className="space-y-4">
        <button onClick={recording ? stopRecording : startRecording} className={`px-4 py-2 rounded text-white ${recording ? 'bg-red-500' : 'bg-blue-500'}`}>{recording ? '停止錄音' : '開始錄音'}</button>
        {audioUrl && (
          <div>
            <audio src={audioUrl} controls className="w-full" />
            <a href={audioUrl} download="record.webm" className="text-blue-600 underline ml-2">下載音訊</a>
          </div>
        )}
        {error && <div className="text-red-500">{error}</div>}
        <div className="text-sm text-gray-600 mt-4">此 API 僅在支援的瀏覽器（如 Chrome、Firefox）且 HTTPS 下可用。</div>
      </div>
    </DemoModal>
  );
};

export default MediaRecorderDemo; 