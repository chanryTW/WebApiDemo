import React from 'react';

export interface ApiInfo {
  id: string;
  name: string;
  description: string;
  browserSupport: {
    chrome: string;
    firefox: string;
    safari: string;
    edge: string;
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
      }
    ]
  },
  {
    id: 'performance',
    name: '效能與背景處理',
    description: '優化應用效能和背景任務處理',
    apis: [
      {
        id: 'webWorkers',
        name: 'Web Workers API',
        description: '在背景執行複雜的計算任務，避免阻塞主執行緒，提升應用程式效能',
        browserSupport: {
          chrome: '4.0',
          firefox: '3.5',
          safari: '4.0',
          edge: '12.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Web_Workers_API',
        canIUseUrl: 'https://caniuse.com/webworkers',
        demo: () => {
          import('../components/demos/WebWorkersDemo').then(module => {
            openDemo(module.default);
          });
        }
      },
      {
        id: 'backgroundTasks',
        name: 'Background Tasks API',
        description: '使用 requestIdleCallback 在瀏覽器空閒時執行低優先級任務，提升應用效能',
        browserSupport: {
          chrome: '47.0',
          firefox: '55.0',
          safari: '15.4',
          edge: '79.0'
        },
        mdnUrl: 'https://developer.mozilla.org/zh-TW/docs/Web/API/Background_Tasks_API',
        canIUseUrl: 'https://caniuse.com/requestidlecallback',
        demo: () => {
          import('../components/demos/BackgroundTasksDemo').then(module => {
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
      }
    ]
  },
  {
    id: 'interaction',
    name: '互動與觀察',
    description: '處理用戶互動和元素觀察',
    apis: [
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
      }
    ]
  },
  {
    id: 'systemIntegration',
    name: '系統整合',
    description: '與系統功能整合',
    apis: [
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
        browserSupport: { chrome: 'N/A', firefox: 'N/A', safari: 'N/A', edge: 'N/A' },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Proximity_Sensor_API',
        canIUseUrl: 'https://caniuse.com/?search=proximity',
        demo: () => { import('../components/demos/ProximitySensorDemo').then(module => { openDemo(module.default); }); }
      },
      {
        id: 'magnetometer',
        name: 'Magnetometer API',
        description: '偵測地磁感應數值',
        browserSupport: { chrome: '67.0', firefox: 'N/A', safari: 'N/A', edge: '79.0' },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Magnetometer',
        canIUseUrl: 'https://caniuse.com/?search=magnetometer',
        demo: () => { import('../components/demos/MagnetometerDemo').then(module => { openDemo(module.default); }); }
      },
      {
        id: 'accelerometer',
        name: 'Accelerometer API',
        description: '偵測加速度數值',
        browserSupport: { chrome: '67.0', firefox: 'N/A', safari: 'N/A', edge: '79.0' },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Accelerometer',
        canIUseUrl: 'https://caniuse.com/?search=accelerometer',
        demo: () => { import('../components/demos/AccelerometerDemo').then(module => { openDemo(module.default); }); }
      },
      {
        id: 'gyroscope',
        name: 'Gyroscope API',
        description: '偵測陀螺儀數值',
        browserSupport: { chrome: '67.0', firefox: 'N/A', safari: 'N/A', edge: '79.0' },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Gyroscope',
        canIUseUrl: 'https://caniuse.com/?search=gyroscope',
        demo: () => { import('../components/demos/GyroscopeDemo').then(module => { openDemo(module.default); }); }
      },
      {
        id: 'offscreenCanvas',
        name: 'OffscreenCanvas API',
        description: '在 worker 執行 canvas 繪圖',
        browserSupport: { chrome: '69.0', firefox: '44.0', safari: 'N/A', edge: '79.0' },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas',
        canIUseUrl: 'https://caniuse.com/?search=offscreenCanvas',
        demo: () => { import('../components/demos/OffscreenCanvasDemo').then(module => { openDemo(module.default); }); }
      },
      {
        id: 'imageBitmap',
        name: 'ImageBitmap API',
        description: '高效載入與繪製圖片',
        browserSupport: { chrome: '50.0', firefox: '53.0', safari: 'N/A', edge: '79.0' },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap',
        canIUseUrl: 'https://caniuse.com/?search=imagebitmap',
        demo: () => { import('../components/demos/ImageBitmapDemo').then(module => { openDemo(module.default); }); }
      },
      {
        id: 'canvas',
        name: 'Canvas API',
        description: '基本 2D 繪圖操作',
        browserSupport: { chrome: '4.0', firefox: '3.6', safari: '4.0', edge: '9.0' },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API',
        canIUseUrl: 'https://caniuse.com/?search=canvas',
        demo: () => { import('../components/demos/CanvasDemo').then(module => { openDemo(module.default); }); }
      },
      {
        id: 'svg',
        name: 'SVG API',
        description: 'SVG 圖形繪製與互動',
        browserSupport: { chrome: '4.0', firefox: '3.0', safari: '3.2', edge: '9.0' },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/SVG',
        canIUseUrl: 'https://caniuse.com/svg',
        demo: () => { import('../components/demos/SvgDemo').then(module => { openDemo(module.default); }); }
      },
      {
        id: 'webgl2',
        name: 'WebGL2 API',
        description: 'WebGL2 基本繪圖',
        browserSupport: { chrome: '56.0', firefox: '51.0', safari: '15.0', edge: '79.0' },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext',
        canIUseUrl: 'https://caniuse.com/webgl2',
        demo: () => { import('../components/demos/WebGL2Demo').then(module => { openDemo(module.default); }); }
      },
      {
        id: 'nfc',
        name: 'NFC API',
        description: 'NFC 標籤讀取',
        browserSupport: { chrome: '89.0', firefox: 'N/A', safari: 'N/A', edge: 'N/A' },
        mdnUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_NFC_API',
        canIUseUrl: 'https://caniuse.com/mdn-api_navigator_nfc',
        demo: () => { import('../components/demos/NFCDemo').then(module => { openDemo(module.default); }); }
      }
    ]
  }
];

export const categories = apiCategories; 