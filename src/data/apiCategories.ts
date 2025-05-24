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

export const categories: ApiCategory[] = [
  {
    id: 'storage',
    name: '儲存相關',
    description: '包含 LocalStorage、SessionStorage、IndexedDB 等儲存相關的 API',
    apis: [
      {
        id: 'localStorage',
        name: 'Local Storage',
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
      }
    ]
  },
  {
    id: 'media',
    name: '媒體相關',
    description: '包含音訊、視訊、WebRTC 等媒體相關的 API',
    apis: [
      {
        id: 'mediaDevices',
        name: 'Media Devices',
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
      }
    ]
  },
  {
    id: 'sharing',
    name: '分享相關',
    description: '包含 Web Share API 等分享功能相關的 API',
    apis: [
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
    id: 'sensors',
    name: '感應器',
    description: '包含地理位置、陀螺儀、加速度計等感應器相關的 API',
    apis: [
      {
        id: 'geolocation',
        name: 'Geolocation',
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
      }
    ]
  },
  {
    id: 'system',
    name: '系統相關',
    description: '包含剪貼簿、全螢幕、電池狀態、震動、網路狀態等系統相關的 API',
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
      }
    ]
  },
  {
    id: 'interaction',
    name: '互動相關',
    description: '包含元素觀察、指針事件、語音辨識等互動相關的 API',
    apis: [
      {
        id: 'intersectionObserver',
        name: 'Intersection Observer',
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
        name: 'Resize Observer',
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
        name: 'Page Visibility',
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
        id: 'pointerEvents',
        name: 'Pointer Events',
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
        id: 'webSpeech',
        name: 'Web Speech',
        description: '提供語音識別和語音合成功能，可用於語音指令、文字轉語音等應用',
        browserSupport: {
          chrome: '33.0',
          firefox: 'N/A',
          safari: '7.0',
          edge: '79.0'
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
    id: 'fileAndMedia',
    name: '檔案與多媒體',
    description: '包含檔案操作、拖放功能、音訊處理等相關的 API',
    apis: [
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
      }
    ]
  },
  {
    id: 'background',
    name: '背景處理',
    description: '包含網頁通知、背景執行緒等在背景執行的功能',
    apis: [
      {
        id: 'notifications',
        name: 'Web Notifications',
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
        id: 'webWorkers',
        name: 'Web Workers',
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
      }
    ]
  }
]; 