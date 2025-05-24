import React, { useState, useRef, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface WebRTCDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const WebRTCDemo: React.FC<WebRTCDemoProps> = ({ isOpen, onClose }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [error, setError] = useState<string>('');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [offer, setOffer] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<string>('未連接');

  useEffect(() => {
    // 清理函數
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [localStream]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setLocalStream(stream);
      setError('');
    } catch {
      setError('無法存取攝影機和麥克風');
    }
  };

  const createPeerConnection = () => {
    try {
      const configuration: RTCConfiguration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      };

      const pc = new RTCPeerConnection(configuration);

      // 添加本地串流
      if (localStream) {
        localStream.getTracks().forEach(track => {
          pc.addTrack(track, localStream);
        });
      }

      // 監聽遠端串流
      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // 監聽連接狀態變化
      pc.onconnectionstatechange = () => {
        setConnectionStatus(pc.connectionState);
      };

      // 監聽 ICE 候選者
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('新的 ICE 候選者：', event.candidate);
        }
      };

      peerConnectionRef.current = pc;
      setError('');
    } catch {
      setError('建立點對點連接時發生錯誤');
    }
  };

  const createOffer = async () => {
    try {
      if (!peerConnectionRef.current) {
        createPeerConnection();
      }

      const pc = peerConnectionRef.current;
      if (!pc) return;

      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);
      
      setOffer(JSON.stringify(offerDescription));
      setError('');
    } catch {
      setError('建立 Offer 時發生錯誤');
    }
  };

  const handleAnswerInput = async () => {
    try {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      const answerDescription = JSON.parse(answer);
      await pc.setRemoteDescription(new RTCSessionDescription(answerDescription));
      setError('');
    } catch {
      setError('設置 Answer 時發生錯誤');
    }
  };

  const createAnswer = async () => {
    try {
      if (!peerConnectionRef.current) {
        createPeerConnection();
      }

      const pc = peerConnectionRef.current;
      if (!pc) return;

      const offerDescription = JSON.parse(offer);
      await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));
      
      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);
      
      setAnswer(JSON.stringify(answerDescription));
      setError('');
    } catch {
      setError('建立 Answer 時發生錯誤');
    }
  };

  const codeExample = `// 建立 RTCPeerConnection
const pc = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
});

// 獲取本地媒體串流
const stream = await navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
});

// 添加本地串流到連接
stream.getTracks().forEach(track => {
  pc.addTrack(track, stream);
});

// 監聽遠端串流
pc.ontrack = (event) => {
  videoElement.srcObject = event.streams[0];
};

// 建立 Offer
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);

// 發送 Offer 到遠端 (通過信令伺服器)
sendToRemotePeer(offer);

// 接收 Answer
const answer = await receiveFromRemotePeer();
await pc.setRemoteDescription(answer);`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="WebRTC API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            本地視訊
          </h3>
          <div className="space-y-4">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full bg-black rounded-lg"
            />
            <button
              onClick={startCamera}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
            >
              開啟攝影機
            </button>
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            遠端視訊
          </h3>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full bg-black rounded-lg"
          />
        </div>

        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            連接控制
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-gray-700">
                  連接狀態：
                </span>
                <span className={`
                  text-sm font-medium
                  ${connectionStatus === 'connected' ? 'text-green-500' :
                    connectionStatus === 'connecting' ? 'text-yellow-500' :
                    'text-red-500'}
                `}>
                  {connectionStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={createOffer}
                  disabled={!localStream}
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium text-white
                    ${localStream
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-gray-400 cursor-not-allowed'}
                  `}
                >
                  建立 Offer
                </button>
                <button
                  onClick={createAnswer}
                  disabled={!offer}
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium text-white
                    ${offer
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-400 cursor-not-allowed'}
                  `}
                >
                  建立 Answer
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offer SDP
                </label>
                <textarea
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                  rows={4}
                  placeholder="貼上遠端的 Offer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer SDP
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                  rows={4}
                  placeholder="貼上遠端的 Answer"
                />
                <button
                  onClick={handleAnswerInput}
                  disabled={!answer}
                  className={`
                    mt-2 w-full px-4 py-2 rounded-md text-sm font-medium text-white
                    ${answer
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-gray-400 cursor-not-allowed'}
                  `}
                >
                  設置 Answer
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            說明
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              此演示展示了 WebRTC 的基本功能：
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>獲取本地媒體串流（視訊和音訊）</li>
              <li>建立點對點連接</li>
              <li>交換 SDP（連接描述）</li>
              <li>即時視訊通話</li>
            </ul>
            <p className="mt-4 text-yellow-600">
              注意：此演示需要手動複製貼上 SDP 資訊。在實際應用中，這個過程通常由信令伺服器自動完成。
            </p>
          </div>
        </div>
      </div>
    </DemoModal>
  );
};

export default WebRTCDemo; 