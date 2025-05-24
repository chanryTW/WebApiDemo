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
  }
];

export const categories = apiCategories; 