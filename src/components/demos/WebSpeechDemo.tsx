import React, { useState, useEffect, useCallback } from 'react';
import DemoModal from '../DemoModal';

interface WebSpeechProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: SpeechRecognitionResult;
    };
    length: number;
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: () => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const WebSpeechDemo: React.FC<WebSpeechProps> = ({ isOpen, onClose }) => {
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(false);
  const [isSpeechSynthesisSupported, setIsSpeechSynthesisSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [textToSpeak, setTextToSpeak] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // 檢查瀏覽器支援
    setIsSpeechRecognitionSupported('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    setIsSpeechSynthesisSupported('speechSynthesis' in window);
  }, []);

  const startListening = useCallback(() => {
    if (!isSpeechRecognitionSupported) return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    
    recognition.lang = 'zh-TW';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1][0];
      setTranscript(result.transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(`錯誤：${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (err) {
      setError(`錯誤：${err instanceof Error ? err.message : String(err)}`);
    }
  }, [isSpeechRecognitionSupported]);

  const stopListening = useCallback(() => {
    if (!isSpeechRecognitionSupported) return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.stop();
    setIsListening(false);
  }, [isSpeechRecognitionSupported]);

  const speak = useCallback(() => {
    if (!isSpeechSynthesisSupported || !textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'zh-TW';
    
    window.speechSynthesis.speak(utterance);
  }, [isSpeechSynthesisSupported, textToSpeak]);

  const codeExample = `
// 語音識別
const recognition = new SpeechRecognition();
recognition.lang = 'zh-TW';
recognition.continuous = true;
recognition.interimResults = true;

recognition.onresult = (event) => {
  const transcript = event.results[event.results.length - 1][0].transcript;
  console.log('識別結果：', transcript);
};

recognition.start();

// 語音合成
const utterance = new SpeechSynthesisUtterance('要說的文字');
utterance.lang = 'zh-TW';
window.speechSynthesis.speak(utterance);
  `.trim();

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Web Speech API 示範"
      description="展示如何使用 Web Speech API 進行語音識別和語音合成。"
    >
      <div className="space-y-4">
        <div className="bg-yellow-50 p-4 rounded-md space-y-2">
          <p className="text-yellow-800">
            語音識別支援：{isSpeechRecognitionSupported ? '✅ 支援' : '❌ 不支援'}
          </p>
          <p className="text-yellow-800">
            語音合成支援：{isSpeechSynthesisSupported ? '✅ 支援' : '❌ 不支援'}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">語音識別</h3>
            <div className="space-x-4 mb-2">
              <button
                onClick={startListening}
                disabled={!isSpeechRecognitionSupported || isListening}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isListening ? '正在聆聽...' : '開始聆聽'}
              </button>
              <button
                onClick={stopListening}
                disabled={!isSpeechRecognitionSupported || !isListening}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                停止聆聽
              </button>
            </div>
            <div className="bg-gray-100 p-4 rounded-md min-h-[100px]">
              {transcript || '（尚未有識別結果）'}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">語音合成</h3>
            <div className="space-y-2">
              <textarea
                value={textToSpeak}
                onChange={(e) => setTextToSpeak(e.target.value)}
                placeholder="輸入要朗讀的文字"
                className="w-full p-2 border rounded-md"
                rows={3}
              />
              <button
                onClick={speak}
                disabled={!isSpeechSynthesisSupported || !textToSpeak}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                朗讀文字
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <div className="mt-6">
          <p className="font-medium mb-2">使用範例：</p>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>{codeExample}</code>
          </pre>
        </div>
      </div>
    </DemoModal>
  );
};

export default WebSpeechDemo; 