import React from 'react';

export interface ApiInfo {
  id: string;
  name: string;
  description: string;
  browserSupport: {
    chrome?: string;
    firefox?: string;
    safari?: string;
    edge?: string;
  };
  mdnUrl: string;
  canIUseUrl: string;
  demo?: () => void;
}

export interface ApiCategory {
  id: string;
  name: string;
  description: string;
  apis: ApiInfo[];
  browserSupport?: {
    chrome?: string;
    firefox?: string;
    safari?: string;
    edge?: string;
  };
  mdnUrl?: string;
  canIUseUrl?: string;
  demo?: () => void;
}

// 這個函數會在 App.tsx 中被設定
let openDemoModal: ((component: React.ReactNode) => void) | null = null;

export const setOpenDemoModal = (fn: (component: React.ReactNode) => void) => {
  openDemoModal = fn;
};

// 動態引入 Demo 組件
const openDemo = async (DemoComponent: React.ComponentType<{ isOpen: boolean; onClose: () => void }>) => {
  if (openDemoModal) {
    openDemoModal(
      React.createElement(DemoComponent, {
        isOpen: true,
        onClose: () => {
          if (openDemoModal) {
            openDemoModal(null);
          }
        }
      })
    );
  }
};

export const apiCategories: ApiCategory[] = [
  {
    id: 'multimedia',
    name: '多媒體與串流',
    description: '處理音訊、視訊、螢幕分享等多媒體功能',
    apis: [
      {
        id: 'mediaDevices',
        name: 'Media Devices API',
        description: '存取用戶的鏡頭、麥克風等媒體設備，可用於視訊通話、錄音等功能',
        browserSupport: {
          chrome: '47.0',
          firefox: '44.0',
          safari: '11.0',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/MediaDevices',
        canIUseUrl: 'https://caniuse.com/stream',
        demo: () => {
          import('../components/demos/MediaDevicesDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'webAudio',
        name: 'Web Audio API',
        description: '提供強大的音訊處理和合成功能，可用於音效、音樂播放等應用',
        browserSupport: {
          chrome: '14.0',
          firefox: '25.0',
          safari: '6.0',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Web_Audio_API',
        canIUseUrl: 'https://caniuse.com/audio-api',
        demo: () => {
          import('../components/demos/WebAudioDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'screenCapture',
        name: 'Screen Capture API',
        description: '允許擷取螢幕內容、視窗或特定標籤頁面，適用於螢幕錄製和直播',
        browserSupport: {
          chrome: '72.0',
          firefox: '66.0',
          safari: '13.0',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Screen_Capture_API',
        canIUseUrl: 'https://caniuse.com/mdn-api_mediadevices_getdisplaymedia',
        demo: () => {
          import('../components/demos/ScreenCaptureDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'pictureInPicture',
        name: 'Picture-in-Picture API',
        description: '允許視頻在浮動視窗中播放，即使用戶切換到其他標籤頁或應用程式',
        browserSupport: {
          chrome: '70.0',
          firefox: '69.0',
          safari: '13.0',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Picture-in-Picture_API',
        canIUseUrl: 'https://caniuse.com/picture-in-picture',
        demo: () => {
          import('../components/demos/PictureInPictureDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'webMidi',
        name: 'Web MIDI API',
        description: '允許網頁應用與 MIDI 音樂設備互動，支援音樂創作和演奏',
        browserSupport: {
          chrome: '43.0',
          firefox: 'N/A',
          safari: 'N/A',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Web_MIDI_API',
        canIUseUrl: 'https://caniuse.com/midi',
        demo: () => {
          import('../components/demos/WebMidiDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'mediaRecorder',
        name: 'MediaRecorder API',
        description: '錄製音訊與視訊媒體串流',
        browserSupport: {
          chrome: '49.0',
          firefox: '25.0',
          safari: '14.1',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/MediaRecorder',
        canIUseUrl: 'https://caniuse.com/mediarecorder',
        demo: () => {
          import('../components/demos/MediaRecorderDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'htmlMediaElement',
        name: 'HTMLMediaElement',
        description: '控制 <audio>、<video> 元素的播放、暫停、音量等',
        browserSupport: {
          chrome: '4.0',
          firefox: '3.5',
          safari: '4.0',
          edge: '9.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/HTMLMediaElement',
        canIUseUrl: 'https://caniuse.com/audio-api',
        demo: () => {
          import('../components/demos/HTMLMediaElementDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'mediaSource',
        name: 'MediaSource API',
        description: '動態串流媒體資源，支援自訂緩衝區',
        browserSupport: {
          chrome: '23.0',
          firefox: '42.0',
          safari: '13.1',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/MediaSource',
        canIUseUrl: 'https://caniuse.com/mediasource',
        demo: () => {
          import('../components/demos/MediaSourceDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'audioContext',
        name: 'AudioContext',
        description: 'Web Audio API 的核心，負責音訊處理流程',
        browserSupport: {
          chrome: '10.0',
          firefox: '25.0',
          safari: '6.0',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/AudioContext',
        canIUseUrl: 'https://caniuse.com/audio-api',
        demo: () => {
          import('../components/demos/AudioContextDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'videoTrackList',
        name: 'VideoTrackList',
        description: '管理 <video> 元素的多軌影片串流',
        browserSupport: {
          chrome: '23.0',
          firefox: '28.0',
          safari: 'N/A',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/VideoTrackList',
        canIUseUrl: 'https://caniuse.com/mdn-api_videotracklist',
        demo: () => {
          import('../components/demos/VideoTrackListDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'audioTrackList',
        name: 'AudioTrackList',
        description: '管理 <audio> 或 <video> 元素的多軌音訊串流',
        browserSupport: {
          chrome: '23.0',
          firefox: '28.0',
          safari: 'N/A',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/AudioTrackList',
        canIUseUrl: 'https://caniuse.com/mdn-api_audiotracklist',
        demo: () => {
          import('../components/demos/AudioTrackListDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'textTrackList',
        name: 'TextTrackList',
        description: '管理 <video> 元素的字幕、章節等文字軌',
        browserSupport: {
          chrome: '23.0',
          firefox: '28.0',
          safari: 'N/A',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/TextTrackList',
        canIUseUrl: 'https://caniuse.com/mdn-api_texttracklist',
        demo: () => {
          import('../components/demos/TextTrackListDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'textTrackCue',
        name: 'TextTrackCue',
        description: '代表 <track> 元素中的單一 cue（字幕、章節等）',
        browserSupport: {
          chrome: '23.0',
          firefox: '28.0',
          safari: 'N/A',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/TextTrackCue',
        canIUseUrl: 'https://caniuse.com/mdn-api_texttrackcue',
        demo: () => {
          import('../components/demos/TextTrackCueDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'canvasCaptureMediaStream',
        name: 'Canvas Capture MediaStream API',
        description: '將 <canvas> 畫面轉為 MediaStream，可用於錄影或串流',
        browserSupport: {
          chrome: '53.0',
          firefox: '41.0',
          safari: 'N/A',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/HTMLCanvasElement/captureStream',
        canIUseUrl: 'https://caniuse.com/mdn-api_htmlcanvaselement_capturestream',
        demo: () => {
          import('../components/demos/CanvasCaptureMediaStreamDemo').then(module => {
            openDemo(module.default);
          });
        }
      }
    ]
  },
  {
    id: 'deviceAccess',
    name: '裝置存取',
    description: '存取裝置硬體功能、感應器和系統資訊',
    apis: [
      {
        id: 'geolocation',
        name: 'Geolocation API',
        description: '獲取用戶地理位置資訊，可用於地圖定位、位置服務等功能',
        browserSupport: {
          chrome: '5.0',
          firefox: '3.5',
          safari: '5.0',
          edge: '9.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Geolocation_API',
        canIUseUrl: 'https://caniuse.com/geolocation',
        demo: () => {
          import('../components/demos/GeolocationDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'deviceMotion',
        name: 'Device Motion & Orientation API',
        description: '讀取裝置的加速度、旋轉和方向數據，適合開發動作感應遊戲和擴增實境應用',
        browserSupport: {
          chrome: '7.0',
          firefox: '6.0',
          safari: '5.0',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/DeviceMotionEvent',
        canIUseUrl: 'https://caniuse.com/deviceorientation',
        demo: () => {
          import('../components/demos/DeviceMotionDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'battery',
        name: 'Battery API',
        description: '提供裝置電池狀態的資訊，包括電量、充電狀態等',
        browserSupport: {
          chrome: '38.0',
          firefox: '31.0',
          safari: 'N/A',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Battery_Status_API',
        canIUseUrl: 'https://caniuse.com/battery-status',
        demo: () => {
          import('../components/demos/BatteryDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'vibration',
        name: 'Vibration API',
        description: '控制裝置的震動功能，可用於遊戲、通知等互動效果',
        browserSupport: {
          chrome: '32.0',
          firefox: '16.0',
          safari: 'N/A',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Vibration_API',
        canIUseUrl: 'https://caniuse.com/vibration',
        demo: () => {
          import('../components/demos/VibrationDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'webBluetooth',
        name: 'Web Bluetooth API',
        description: '透過藍牙連接和控制周邊設備',
        browserSupport: {
          chrome: '56.0',
          firefox: 'N/A',
          safari: 'N/A',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Web_Bluetooth_API',
        canIUseUrl: 'https://caniuse.com/web-bluetooth',
        demo: () => {
          import('../components/demos/WebBluetoothDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'contactPicker',
        name: 'Contact Picker API',
        description: '允許網頁應用安全地訪問用戶的通訊錄，選擇聯絡人資訊',
        browserSupport: {
          chrome: '80.0',
          firefox: 'N/A',
          safari: 'N/A',
          edge: '80.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Contact_Picker_API',
        canIUseUrl: 'https://caniuse.com/mdn-api_contactsmanager',
        demo: () => {
          import('../components/demos/ContactPickerDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'ambientLight',
        name: 'Ambient Light Sensor API',
        description: '讀取環境光線強度，可用於自動調整螢幕亮度等功能',
        browserSupport: {
          chrome: '85.0',
          firefox: 'N/A',
          safari: 'N/A',
          edge: '85.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/AmbientLightSensor',
        canIUseUrl: 'https://caniuse.com/ambient-light',
        demo: () => {
          import('../components/demos/AmbientLightDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'usb',
        name: 'USB API',
        description: '允許網頁應用程式與 USB 裝置進行通訊',
        browserSupport: {
          chrome: '61.0',
          firefox: 'N/A',
          safari: 'N/A',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/USB',
        canIUseUrl: 'https://caniuse.com/webusb',
        demo: () => {
          import('../components/demos/USBDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'webSerial',
        name: 'Web Serial API',
        description: '讓網頁與串列埠裝置（如 Arduino）通訊',
        browserSupport: {
          chrome: '89.0',
          firefox: 'N/A',
          safari: 'N/A',
          edge: '89.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Serial',
        canIUseUrl: 'https://caniuse.com/mdn-api_serial',
        demo: () => {
          import('../components/demos/WebSerialDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'webNfc',
        name: 'Web NFC API',
        description: '讓網頁讀寫 NFC 標籤，適合物聯網、票證應用',
        browserSupport: {
          chrome: '89.0',
          firefox: 'N/A',
          safari: 'N/A',
          edge: 'N/A'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Web_NFC_API',
        canIUseUrl: 'https://caniuse.com/mdn-api_navigator_nfc',
        demo: () => {
          import('../components/demos/WebNFCDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'webHid',
        name: 'WebHID API',
        description: '讓網頁與 HID 裝置（如遊戲搖桿、特殊鍵盤）互動',
        browserSupport: {
          chrome: '89.0',
          firefox: 'N/A',
          safari: 'N/A',
          edge: '89.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/WebHID_API',
        canIUseUrl: 'https://caniuse.com/mdn-api_hid',
        demo: () => {
          import('../components/demos/WebHIDDemo').then(module => {
            openDemo(module.default);
          });
        }
      }
    ]
  },
  {
    id: 'storage',
    name: '儲存與檔案',
    description: '管理資料儲存和檔案操作',
    apis: [
      {
        id: 'localStorage',
        name: 'Local Storage API',
        description: '提供網頁本地持久化儲存功能，可以儲存字串形式的鍵值對資料',
        browserSupport: {
          chrome: '4.0',
          firefox: '3.5',
          safari: '4.0',
          edge: '8.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Window/localStorage',
        canIUseUrl: 'https://caniuse.com/namevalue-storage',
        demo: () => {
          import('../components/demos/LocalStorageDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'fileApi',
        name: 'File API',
        description: '提供檔案的讀取和操作功能，支援檔案預覽、上傳等功能',
        browserSupport: {
          chrome: '7.0',
          firefox: '3.6',
          safari: '6.0',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/File_API',
        canIUseUrl: 'https://caniuse.com/fileapi',
        demo: () => {
          import('../components/demos/FileApiDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'dragAndDrop',
        name: 'Drag and Drop API',
        description: '實現元素的拖放功能，支援檔案拖放、元素排序等互動',
        browserSupport: {
          chrome: '4.0',
          firefox: '3.5',
          safari: '3.1',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/HTML_Drag_and_Drop_API',
        canIUseUrl: 'https://caniuse.com/dragndrop',
        demo: () => {
          import('../components/demos/DragAndDropDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'sessionStorage',
        name: 'Session Storage API',
        description: '提供網頁 session 持久化儲存功能，可以儲存字串形式的鍵值對資料',
        browserSupport: {
          chrome: '5.0',
          firefox: '2.0',
          safari: '4.0',
          edge: '8.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Window/sessionStorage',
        canIUseUrl: 'https://caniuse.com/namevalue-storage',
        demo: () => {
          import('../components/demos/SessionStorageDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'indexedDB',
        name: 'IndexedDB API',
        description: '提供結構化資料的本地儲存，支援大量資料與索引',
        browserSupport: {
          chrome: '12.0',
          firefox: '4.0',
          safari: '10.1',
          edge: '10.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/IndexedDB_API',
        canIUseUrl: 'https://caniuse.com/indexeddb',
        demo: () => {
          import('../components/demos/IndexedDBDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'fileSystemAccess',
        name: 'File System Access API',
        description: '讓網頁直接存取本機檔案系統，讀寫檔案',
        browserSupport: {
          chrome: '86.0',
          firefox: 'N/A',
          safari: 'N/A',
          edge: '86.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/File_System_Access_API',
        canIUseUrl: 'https://caniuse.com/file-system-access',
        demo: () => {
          import('../components/demos/FileSystemAccessDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'cache',
        name: 'Cache API',
        description: '讓網頁快取資源，支援離線與 PWA',
        browserSupport: {
          chrome: '40.0',
          firefox: '39.0',
          safari: '11.1',
          edge: '17.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Cache',
        canIUseUrl: 'https://caniuse.com/cache-api',
        demo: () => {
          import('../components/demos/CacheDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'cookieStore',
        name: 'Cookie Store API',
        description: '讓網頁以 Promise 方式存取 cookie',
        browserSupport: {
          chrome: '86.0',
          firefox: 'N/A',
          safari: 'N/A',
          edge: '86.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/CookieStore',
        canIUseUrl: 'https://caniuse.com/cookie-store-api',
        demo: () => {
          import('../components/demos/CookieStoreDemo').then(module => {
            openDemo(module.default);
          });
        }
      }
    ]
  },
  {
    id: 'communication',
    name: '通訊與連接',
    description: '實現網頁間通訊和外部連接',
    apis: [
      {
        id: 'webrtc',
        name: 'WebRTC API',
        description: '實現瀏覽器間的點對點通訊，支援視訊、音訊和資料傳輸',
        browserSupport: {
          chrome: '23.0',
          firefox: '22.0',
          safari: '11.0',
          edge: '15.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/WebRTC_API',
        canIUseUrl: 'https://caniuse.com/rtcpeerconnection',
        demo: () => {
          import('../components/demos/WebRTCDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'broadcastChannel',
        name: 'Broadcast Channel API',
        description: '允許同源的不同瀏覽器視窗、標籤頁和 iframe 之間進行即時通訊',
        browserSupport: {
          chrome: '54.0',
          firefox: '38.0',
          safari: '15.4',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Broadcast_Channel_API',
        canIUseUrl: 'https://caniuse.com/broadcastchannel',
        demo: () => {
          import('../components/demos/BroadcastChannelDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'webShare',
        name: 'Web Share API',
        description: '提供原生的分享功能，可以分享文字、連結到其他應用程式',
        browserSupport: {
          chrome: '89.0',
          firefox: 'N/A',
          safari: '12.0',
          edge: '89.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Navigator/share',
        canIUseUrl: 'https://caniuse.com/web-share',
        demo: () => {
          import('../components/demos/WebShareDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'webSocket',
        name: 'WebSocket API',
        description: '提供雙向即時通訊功能',
        browserSupport: {
          chrome: '16.0',
          firefox: '11.0',
          safari: '6.0',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/WebSocket',
        canIUseUrl: 'https://caniuse.com/websockets',
        demo: () => {
          import('../components/demos/WebSocketDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'fetch',
        name: 'Fetch API',
        description: '現代化的 HTTP 請求 API',
        browserSupport: {
          chrome: '42.0',
          firefox: '39.0',
          safari: '10.1',
          edge: '14.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Fetch_API',
        canIUseUrl: 'https://caniuse.com/fetch',
        demo: () => {
          import('../components/demos/FetchDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'xmlHttpRequest',
        name: 'XMLHttpRequest',
        description: '傳統的 AJAX 請求 API',
        browserSupport: {
          chrome: '1.0',
          firefox: '1.0',
          safari: '1.0',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/XMLHttpRequest',
        canIUseUrl: 'https://caniuse.com/xmlhttprequest',
        demo: () => {
          import('../components/demos/XMLHttpRequestDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'beacon',
        name: 'Beacon API',
        description: '用於非同步、可靠地將資料傳送到伺服器',
        browserSupport: {
          chrome: '39.0',
          firefox: '31.0',
          safari: '11.1',
          edge: '14.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Beacon_API',
        canIUseUrl: 'https://caniuse.com/beacon',
        demo: () => {
          import('../components/demos/BeaconDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'eventSource',
        name: 'Server-Sent Events (EventSource)',
        description: '單向伺服器推播事件給瀏覽器',
        browserSupport: {
          chrome: '6.0',
          firefox: '6.0',
          safari: '5.0',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/EventSource',
        canIUseUrl: 'https://caniuse.com/eventsource',
        demo: () => {
          import('../components/demos/EventSourceDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'webtransport',
        name: 'WebTransport API',
        description: '基於 HTTP/3 的雙向通訊協議，支援可靠和不可靠的資料傳輸。',
        browserSupport: {
          chrome: '97.0',
          edge: '97.0'
        },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/WebTransport',
        canIUseUrl: 'https://caniuse.com/webtransport',
        demo: () => import('../components/demos/WebTransportDemo')
      },
      {
        id: 'webpush',
        name: 'Web Push API',
        description: '允許網頁應用程式接收推送通知，即使用戶未開啟網頁也能收到通知。',
        browserSupport: {
          chrome: 'yes',
          firefox: 'yes',
          safari: 'no',
          edge: 'yes'
        },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Push_API',
        canIUseUrl: 'https://caniuse.com/push-api',
        demo: () => import('../components/demos/WebPushDemo')
      }
    ]
  },
  {
    id: 'performance',
    name: '效能與背景處理',
    description: '優化應用效能和背景任務處理',
    apis: [
      {
        id: 'navigationTiming',
        name: 'Navigation Timing API',
        description: '測量網頁導航和載入時間的詳細資訊',
        browserSupport: {
          chrome: '6.0',
          firefox: '7.0',
          safari: '8.0',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Navigation_timing_API',
        canIUseUrl: 'https://caniuse.com/nav-timing',
        demo: () => {
          import('../components/demos/NavigationTimingDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'resourceTiming',
        name: 'Resource Timing API',
        description: '測量網頁資源（圖片、腳本、樣式表等）的載入時間和大小',
        browserSupport: {
          chrome: '25.0',
          firefox: '31.0',
          safari: '11.0',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Resource_Timing_API',
        canIUseUrl: 'https://caniuse.com/resource-timing',
        demo: () => {
          import('../components/demos/ResourceTimingDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'userTiming',
        name: 'User Timing API',
        description: '提供自定義性能標記和測量功能，用於追蹤特定操作的執行時間',
        browserSupport: {
          chrome: '25.0',
          firefox: '31.0',
          safari: '11.0',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/User_Timing_API',
        canIUseUrl: 'https://caniuse.com/user-timing',
        demo: () => {
          import('../components/demos/UserTimingDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'paintTiming',
        name: 'Paint Timing API',
        description: '提供網頁渲染過程中的關鍵時間點資訊，如首次繪製和首次內容繪製',
        browserSupport: {
          chrome: '60.0',
          firefox: '63.0',
          safari: '14.0',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Paint_Timing_API',
        canIUseUrl: 'https://caniuse.com/paint-timing',
        demo: () => {
          import('../components/demos/PaintTimingDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'longTasks',
        name: 'Long Tasks API',
        description: '識別可能阻塞主線程超過 50 毫秒的長時間執行任務',
        browserSupport: {
          chrome: '58.0',
          firefox: '58.0',
          safari: '15.0',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Long_Tasks_API',
        canIUseUrl: 'https://caniuse.com/longtasks',
        demo: () => {
          import('../components/demos/LongTasksDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'idleDetection',
        name: 'Idle Detection API',
        description: '檢測使用者是否處於閒置狀態，可用於實作節能模式、自動登出等功能',
        browserSupport: {
          chrome: '94.0',
          firefox: 'N/A',
          safari: 'N/A',
          edge: '94.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Idle_Detection_API',
        canIUseUrl: 'https://caniuse.com/idle-detection',
        demo: () => {
          import('../components/demos/IdleDetectionDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'performance',
        name: 'Performance API',
        description: '測量網頁效能，包括載入時間、資源使用等',
        browserSupport: {
          chrome: '6.0',
          firefox: '7.0',
          safari: '8.0',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Performance_API',
        canIUseUrl: 'https://caniuse.com/mdn-api_performance',
        demo: () => {
          import('../components/demos/PerformanceDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'backgroundSync',
        name: 'Background Sync API',
        description: '允許在網路連線恢復時執行延遲的資料同步任務',
        browserSupport: {
          chrome: '49.0',
          firefox: 'N/A',
          safari: 'N/A',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Background_Sync_API',
        canIUseUrl: 'https://caniuse.com/background-sync',
        demo: () => {
          import('../components/demos/BackgroundSyncDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'backgroundFetch',
        name: 'Background Fetch API',
        description: '允許在背景下載大型檔案，即使用戶離開網頁也能繼續下載',
        browserSupport: {
          chrome: '71.0',
          firefox: 'N/A',
          safari: 'N/A',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Background_Fetch_API',
        canIUseUrl: 'https://caniuse.com/background-fetch',
        demo: () => {
          import('../components/demos/BackgroundFetchDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'sharedWorkers',
        name: 'Shared Workers API',
        description: '允許多個瀏覽器視窗、標籤頁或 iframe 共享同一個 Worker，實現跨頁面通訊',
        browserSupport: {
          chrome: '4.0',
          firefox: '29.0',
          safari: 'N/A',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/SharedWorker',
        canIUseUrl: 'https://caniuse.com/sharedworkers',
        demo: () => {
          import('../components/demos/SharedWorkersDemo').then(module => {
            openDemo(module.default);
          });
        }
      }
    ]
  },
  {
    id: 'graphics',
    name: '圖形與動畫',
    description: '處理圖形渲染和動畫效果',
    apis: [
      {
        id: 'webgl',
        name: 'WebGL API',
        description: '基於 OpenGL ES 的 3D 圖形渲染 API',
        browserSupport: {
          chrome: '9.0',
          firefox: '4.0',
          safari: '5.1',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/WebGL_API',
        canIUseUrl: 'https://caniuse.com/webgl',
        demo: () => {
          import('../components/demos/WebGLDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'webAnimations',
        name: 'Web Animations API',
        description: '提供強大的 JavaScript 動畫控制功能，可以精確控制動畫的播放、暫停和時間軸',
        browserSupport: {
          chrome: '36.0',
          firefox: '48.0',
          safari: '13.1',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Web_Animations_API',
        canIUseUrl: 'https://caniuse.com/web-animation',
        demo: () => {
          import('../components/demos/WebAnimationsDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'webGpu',
        name: 'WebGPU API',
        description: '新一代高效能圖形與運算 API，適合 3D 遊戲與科學運算',
        browserSupport: {
          chrome: '113.0',
          firefox: 'N/A',
          safari: 'N/A',
          edge: '113.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/WebGPU_API',
        canIUseUrl: 'https://caniuse.com/webgpu',
        demo: () => {
          import('../components/demos/WebGPUDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'css-typed-om',
        name: 'CSS Typed OM API',
        description: '提供強型別的 CSS 值操作介面，可以更有效地讀取和修改元素樣式。',
        browserSupport: {
          chrome: '66.0',
          firefox: '118.0',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/CSS_Typed_OM_API',
        canIUseUrl: 'https://caniuse.com/css-typed-om',
        demo: () => import('../components/demos/CSSTypedOMDemo')
      },
      {
        id: 'image-capture',
        name: 'ImageCapture API',
        description: '提供對相機硬體的進階控制，包括拍照和調整相機設定。',
        browserSupport: {
          chrome: '59.0',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/ImageCapture',
        canIUseUrl: 'https://caniuse.com/imagecapture',
        demo: () => import('../components/demos/ImageCaptureDemo')
      }
    ]
  },
  {
    id: 'interaction',
    name: '互動與觀察',
    description: '處理用戶互動和元素觀察',
    apis: [
      {
        id: 'mutationObserver',
        name: 'Mutation Observer API',
        description: '監測 DOM 變化，包括元素的屬性變化、子節點變化和文字內容變化',
        browserSupport: {
          chrome: '18.0',
          firefox: '14.0',
          safari: '6.0',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/MutationObserver',
        canIUseUrl: 'https://caniuse.com/mutationobserver',
        demo: () => {
          import('../components/demos/MutationObserverDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'gamepad',
        name: 'Gamepad API',
        description: '支援連接遊戲手把裝置，讀取按鈕狀態和軸的數值，適合開發網頁遊戲',
        browserSupport: {
          chrome: '21.0',
          firefox: '29.0',
          safari: '10.1',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Gamepad_API',
        canIUseUrl: 'https://caniuse.com/gamepad',
        demo: () => {
          import('../components/demos/GamepadDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'touchEvents',
        name: 'Touch Events API',
        description: '處理觸控裝置的觸控事件，支援多點觸控',
        browserSupport: {
          chrome: '22.0',
          firefox: '18.0',
          safari: '3.2',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Touch_events',
        canIUseUrl: 'https://caniuse.com/touch',
        demo: () => {
          import('../components/demos/TouchEventsDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'pointerEvents',
        name: 'Pointer Events API',
        description: '統一處理滑鼠、觸控和手寫筆等各種指針輸入，提供更好的跨裝置互動體驗',
        browserSupport: {
          chrome: '55.0',
          firefox: '59.0',
          safari: '13.0',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Pointer_events',
        canIUseUrl: 'https://caniuse.com/pointer',
        demo: () => {
          import('../components/demos/PointerEventsDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'intersectionObserver',
        name: 'Intersection Observer API',
        description: '監測元素進入或離開視窗可見範圍，常用於實現無限捲動、延遲載入等功能',
        browserSupport: {
          chrome: '51.0',
          firefox: '55.0',
          safari: '12.2',
          edge: '15.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Intersection_Observer_API',
        canIUseUrl: 'https://caniuse.com/intersectionobserver',
        demo: () => {
          import('../components/demos/IntersectionObserverDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'resizeObserver',
        name: 'Resize Observer API',
        description: '監測元素大小變化，可用於響應式設計、動態布局調整等場景',
        browserSupport: {
          chrome: '64.0',
          firefox: '69.0',
          safari: '13.1',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Resize_Observer_API',
        canIUseUrl: 'https://caniuse.com/resizeobserver',
        demo: () => {
          import('../components/demos/ResizeObserverDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'pageVisibility',
        name: 'Page Visibility API',
        description: '檢測網頁是否可見，可用於暫停視訊播放、停止動畫等功能',
        browserSupport: {
          chrome: '33.0',
          firefox: '18.0',
          safari: '7.0',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Page_Visibility_API',
        canIUseUrl: 'https://caniuse.com/pagevisibility',
        demo: () => {
          import('../components/demos/PageVisibilityDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'webSpeech',
        name: 'Web Speech API',
        description: '提供語音識別和語音合成功能，支援多種語言',
        browserSupport: {
          chrome: '33.0',
          firefox: '44.0',
          safari: '7.0',
          edge: '14.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Web_Speech_API',
        canIUseUrl: 'https://caniuse.com/speech-synthesis',
        demo: () => {
          import('../components/demos/WebSpeechDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'eyeDropper',
        name: 'EyeDropper API',
        description: '讓使用者從畫面上取色，適合設計工具',
        browserSupport: {
          chrome: '95.0',
          firefox: 'N/A',
          safari: 'N/A',
          edge: '95.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/EyeDropper_API',
        canIUseUrl: 'https://caniuse.com/mdn-api_eyedropper',
        demo: () => {
          import('../components/demos/EyeDropperDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'mouseEvents',
        name: 'Mouse Events API',
        description: '處理滑鼠事件，包括點擊、移動、滾輪等',
        browserSupport: {
          chrome: '1.0',
          firefox: '1.0',
          safari: '1.0',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/MouseEvent',
        canIUseUrl: 'https://caniuse.com/mdn-api_mouseevent',
        demo: () => {
          import('../components/demos/MouseEventsDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'keyboardEvents',
        name: 'Keyboard Events API',
        description: '處理鍵盤事件，包括按鍵按下、放開等',
        browserSupport: {
          chrome: '1.0',
          firefox: '1.0',
          safari: '1.0',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/KeyboardEvent',
        canIUseUrl: 'https://caniuse.com/mdn-api_keyboardevent',
        demo: () => {
          import('../components/demos/KeyboardEventsDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'wheelEvents',
        name: 'Wheel Events API',
        description: '處理滑鼠滾輪事件，支援水平和垂直滾動',
        browserSupport: {
          chrome: '31.0',
          firefox: '17.0',
          safari: '7.0',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/WheelEvent',
        canIUseUrl: 'https://caniuse.com/mdn-api_wheelevent',
        demo: () => {
          import('../components/demos/WheelEventsDemo').then(module => {
            openDemo(module.default);
          });
        }
      }
    ]
  },
  {
    id: 'systemIntegration',
    name: '系統整合',
    description: '與系統功能整合',
    apis: [
      {
        id: 'screenOrientation',
        name: 'Screen Orientation API',
        description: '監測和控制螢幕方向，支援鎖定特定方向和監聽方向變化事件',
        browserSupport: {
          chrome: '38.0',
          firefox: '43.0',
          safari: '12.1',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Screen_Orientation_API',
        canIUseUrl: 'https://caniuse.com/screen-orientation',
        demo: () => {
          import('../components/demos/ScreenOrientationDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'clipboard',
        name: 'Clipboard API',
        description: '提供對系統剪貼簿的讀寫功能，可以複製和貼上文字、圖片等內容',
        browserSupport: {
          chrome: '66.0',
          firefox: '63.0',
          safari: '13.1',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Clipboard_API',
        canIUseUrl: 'https://caniuse.com/async-clipboard',
        demo: () => {
          import('../components/demos/ClipboardDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'fullscreen',
        name: 'Fullscreen API',
        description: '允許將網頁元素全螢幕顯示，適用於影片播放、遊戲等場景',
        browserSupport: {
          chrome: '15.0',
          firefox: '9.0',
          safari: '5.1',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Fullscreen_API',
        canIUseUrl: 'https://caniuse.com/fullscreen',
        demo: () => {
          import('../components/demos/FullscreenDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'notifications',
        name: 'Web Notifications API',
        description: '發送系統級的通知訊息，即使用戶切換到其他應用程式也能收到提醒',
        browserSupport: {
          chrome: '22.0',
          firefox: '22.0',
          safari: '6.0',
          edge: '14.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Notifications_API',
        canIUseUrl: 'https://caniuse.com/notifications',
        demo: () => {
          import('../components/demos/NotificationsDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'networkInfo',
        name: 'Network Information API',
        description: '提供網路連線狀態的資訊，包括連線類型、速度等',
        browserSupport: {
          chrome: '61.0',
          firefox: 'N/A',
          safari: 'N/A',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Network_Information_API',
        canIUseUrl: 'https://caniuse.com/netinfo',
        demo: () => {
          import('../components/demos/NetworkInfoDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'webLocks',
        name: 'Web Locks API',
        description: '提供資源鎖定機制，防止多個標籤頁或工作者同時訪問相同資源',
        browserSupport: {
          chrome: '69.0',
          firefox: '69.0',
          safari: 'N/A',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Web_Locks_API',
        canIUseUrl: 'https://caniuse.com/web-locks',
        demo: () => {
          import('../components/demos/WebLocksDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'wakeLock',
        name: 'Wake Lock API',
        description: '防止裝置進入休眠狀態，適用於需要持續顯示的應用場景',
        browserSupport: {
          chrome: '84.0',
          firefox: 'N/A',
          safari: 'N/A',
          edge: '84.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Wake_Lock_API',
        canIUseUrl: 'https://caniuse.com/wake-lock',
        demo: () => {
          import('../components/demos/WakeLockDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'presentation',
        name: 'Presentation API',
        description: '允許網頁內容在第二顯示器上進行簡報展示。',
        browserSupport: {
          chrome: '48.0',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Presentation_API',
        canIUseUrl: 'https://caniuse.com/presentation',
        demo: () => import('../components/demos/PresentationDemo')
      }
    ]
  },
  {
    id: 'security',
    name: '安全與支付',
    description: '處理安全性和支付相關功能',
    apis: [
      {
        id: 'webCrypto',
        name: 'Web Crypto API',
        description: '提供加密和解密功能，支援多種加密演算法，適合處理敏感資料',
        browserSupport: {
          chrome: '37.0',
          firefox: '34.0',
          safari: '7.0',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Web_Crypto_API',
        canIUseUrl: 'https://caniuse.com/cryptography',
        demo: () => {
          import('../components/demos/WebCryptoDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'paymentRequest',
        name: 'Payment Request API',
        description: '提供標準化的支付介面，簡化網上支付流程',
        browserSupport: {
          chrome: '61.0',
          firefox: 'N/A',
          safari: '11.1',
          edge: '15.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Payment_Request_API',
        canIUseUrl: 'https://caniuse.com/payment-request',
        demo: () => {
          import('../components/demos/PaymentRequestDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'credentialManagement',
        name: 'Credential Management API',
        description: '管理和存儲用戶憑證，簡化登入流程',
        browserSupport: {
          chrome: '51.0',
          firefox: 'N/A',
          safari: 'N/A',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Credential_Management_API',
        canIUseUrl: 'https://caniuse.com/credential-management',
        demo: () => {
          import('../components/demos/CredentialManagementDemo').then(module => {
            openDemo(module.default);
          });
        }
      }
    ]
  },
  {
    id: 'sensorAndDrawing',
    name: '感測器與繪圖',
    description: '裝置感測器與繪圖相關 Web API',
    apis: [
      {
        id: 'proximitySensor',
        name: 'Proximity Sensor API',
        description: '偵測裝置與物體的距離',
        browserSupport: {
          chrome: 'N/A',
          firefox: 'N/A',
          safari: 'N/A',
          edge: 'N/A'
        },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Proximity_Sensor_API',
        canIUseUrl: 'https://caniuse.com/?search=proximity',
        demo: () => {
          import('../components/demos/ProximitySensorDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'magnetometer',
        name: 'Magnetometer API',
        description: '偵測地磁感應數值',
        browserSupport: {
          chrome: '67.0',
          firefox: 'N/A',
          safari: 'N/A',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Magnetometer',
        canIUseUrl: 'https://caniuse.com/?search=magnetometer',
        demo: () => {
          import('../components/demos/MagnetometerDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'accelerometer',
        name: 'Accelerometer API',
        description: '偵測加速度數值',
        browserSupport: {
          chrome: '67.0',
          firefox: 'N/A',
          safari: 'N/A',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Accelerometer',
        canIUseUrl: 'https://caniuse.com/?search=accelerometer',
        demo: () => {
          import('../components/demos/AccelerometerDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'gyroscope',
        name: 'Gyroscope API',
        description: '偵測陀螺儀數值',
        browserSupport: {
          chrome: '67.0',
          firefox: 'N/A',
          safari: 'N/A',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Gyroscope',
        canIUseUrl: 'https://caniuse.com/?search=gyroscope',
        demo: () => {
          import('../components/demos/GyroscopeDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'offscreenCanvas',
        name: 'OffscreenCanvas API',
        description: '在 worker 執行 canvas 繪圖',
        browserSupport: {
          chrome: '69.0',
          firefox: '44.0',
          safari: 'N/A',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas',
        canIUseUrl: 'https://caniuse.com/?search=offscreenCanvas',
        demo: () => {
          import('../components/demos/OffscreenCanvasDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'imageBitmap',
        name: 'ImageBitmap API',
        description: '高效載入與繪製圖片',
        browserSupport: {
          chrome: '50.0',
          firefox: '53.0',
          safari: 'N/A',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap',
        canIUseUrl: 'https://caniuse.com/?search=imagebitmap',
        demo: () => {
          import('../components/demos/ImageBitmapDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'canvas',
        name: 'Canvas API',
        description: '基本 2D 繪圖操作',
        browserSupport: {
          chrome: '4.0',
          firefox: '3.6',
          safari: '4.0',
          edge: '9.0'
        },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API',
        canIUseUrl: 'https://caniuse.com/?search=canvas',
        demo: () => {
          import('../components/demos/CanvasDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'svg',
        name: 'SVG API',
        description: 'SVG 圖形繪製與互動',
        browserSupport: {
          chrome: '4.0',
          firefox: '3.0',
          safari: '3.2',
          edge: '9.0'
        },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/SVG',
        canIUseUrl: 'https://caniuse.com/svg',
        demo: () => {
          import('../components/demos/SvgDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'webgl2',
        name: 'WebGL2 API',
        description: 'WebGL2 基本繪圖',
        browserSupport: {
          chrome: '56.0',
          firefox: '51.0',
          safari: '15.0',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext',
        canIUseUrl: 'https://caniuse.com/webgl2',
        demo: () => {
          import('../components/demos/WebGL2Demo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'nfc',
        name: 'NFC API',
        description: 'NFC 標籤讀取',
        browserSupport: {
          chrome: '89.0',
          firefox: 'N/A',
          safari: 'N/A',
          edge: 'N/A'
        },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_NFC_API',
        canIUseUrl: 'https://caniuse.com/mdn-api_navigator_nfc',
        demo: () => {
          import('../components/demos/NFCDemo').then(module => {
            openDemo(module.default);
          });
        }
      }
    ]
  }
];

export const categories = apiCategories; 