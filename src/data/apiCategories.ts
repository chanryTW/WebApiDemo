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
    name: '儲存相關 API',
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
    name: '媒體相關 API',
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
    name: '分享相關 API',
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
    name: '感應器 API',
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
  }
]; 