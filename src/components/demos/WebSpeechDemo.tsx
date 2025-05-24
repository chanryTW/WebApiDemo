import React, { useState, useEffect, useRef } from 'react';
import DemoModal from '../DemoModal';

interface WebSpeechDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Voice {
  name: string;
  lang: string;
}

interface RecognitionResult {
  text: string;
  isFinal: boolean;
  timestamp: number;
}

interface SpeechRecognitionEvent {
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface WebkitSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

const WebSpeechDemo: React.FC<WebSpeechDemoProps> = ({ isOpen, onClose }) => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [pitch, setPitch] = useState<number>(1);
  const [rate, setRate] = useState<number>(1);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognitionResults, setRecognitionResults] = useState<RecognitionResult[]>([]);
  const [error, setError] = useState<string>('');

  const recognitionRef = useRef<WebkitSpeechRecognition | null>(null);

  useEffect(() => {
    // 檢查瀏覽器支援
    if (!('speechSynthesis' in window)) {
      setError('您的瀏覽器不支援語音合成 API');
      return;
    }

    // 載入可用的語音
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const voiceList = availableVoices
        .filter(voice => voice.lang.startsWith('zh') || voice.lang.startsWith('en'))
        .map(voice => ({
          name: voice.name,
          lang: voice.lang
        }));
      setVoices(voiceList);
      if (voiceList.length > 0) {
        setSelectedVoice(voiceList[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // 初始化語音辨識
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition as new () => WebkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'zh-TW';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const results = Array.from({ length: event.results.length }, (_, i) => ({
          text: event.results[i][0].transcript,
          isFinal: event.results[i].isFinal,
          timestamp: Date.now()
        }));
        setRecognitionResults(prev => [...results, ...prev].slice(0, 5));
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(`語音辨識錯誤: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setError('您的瀏覽器不支援語音辨識 API');
    }

    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSpeak = () => {
    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoiceObj = window.speechSynthesis.getVoices()
      .find(voice => voice.name === selectedVoice);
    
    if (selectedVoiceObj) {
      utterance.voice = selectedVoiceObj;
    }
    
    utterance.pitch = pitch;
    utterance.rate = rate;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setError('語音合成時發生錯誤');
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setError('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const codeExample = `// 語音合成
const utterance = new SpeechSynthesisUtterance('要說的文字');
utterance.voice = speechSynthesis.getVoices()[0];
utterance.pitch = 1; // 音調
utterance.rate = 1;  // 速度
speechSynthesis.speak(utterance);

// 語音辨識
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'zh-TW';

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  console.log('辨識結果：', transcript);
};

recognition.start();`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Web Speech API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">
              語音合成
            </h3>
            
            <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  選擇語音
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  輸入文字
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  placeholder="輸入要轉換成語音的文字..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    音調 ({pitch.toFixed(1)})
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={pitch}
                    onChange={(e) => setPitch(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    速度 ({rate.toFixed(1)})
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <button
                onClick={handleSpeak}
                disabled={isSpeaking || !text.trim()}
                className={`
                  w-full px-4 py-2 rounded-md text-white font-medium
                  ${isSpeaking
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                  }
                `}
              >
                {isSpeaking ? '正在說話...' : '開始說話'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">
              語音辨識
            </h3>
            
            <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
              <button
                onClick={toggleListening}
                className={`
                  w-full px-4 py-2 rounded-md text-white font-medium
                  ${isListening
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
                  }
                `}
              >
                {isListening ? '停止辨識' : '開始辨識'}
              </button>

              <div className="space-y-2">
                {recognitionResults.map((result, index) => (
                  <div
                    key={index}
                    className={`
                      p-3 rounded-lg border
                      ${result.isFinal
                        ? 'bg-green-50 border-green-200'
                        : 'bg-yellow-50 border-yellow-200'
                      }
                    `}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`
                        text-sm font-medium
                        ${result.isFinal ? 'text-green-700' : 'text-yellow-700'}
                      `}>
                        {result.isFinal ? '最終結果' : '臨時結果'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(result.timestamp)}
                      </span>
                    </div>
                    <p className={`
                      text-sm
                      ${result.isFinal ? 'text-green-600' : 'text-yellow-600'}
                    `}>
                      {result.text}
                    </p>
                  </div>
                ))}

                {recognitionResults.length === 0 && isListening && (
                  <div className="text-center py-8 text-gray-500">
                    正在聆聽...請說話
                  </div>
                )}

                {recognitionResults.length === 0 && !isListening && (
                  <div className="text-center py-8 text-gray-500">
                    尚無辨識結果
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoModal>
  );
};

export default WebSpeechDemo; 