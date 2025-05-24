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
  demo?: () => void;
}

export interface ApiCategory {
  id: string;
  name: string;
  description: string;
  apis: ApiInfo[];
}

export const categories: ApiCategory[] = [
  {
    id: 'storage',
    name: '儲存相關 API',
    description: '包含 LocalStorage、SessionStorage、IndexedDB 等儲存相關的 API',
    apis: [
      {
        id: 'localStorage',
        name: 'Local Storage',
        description: '提供網頁本地持久化儲存功能',
        browserSupport: {
          chrome: '4.0',
          firefox: '3.5',
          safari: '4.0',
          edge: '8.0'
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
        description: '存取用戶的攝像頭、麥克風等媒體設備',
        browserSupport: {
          chrome: '47.0',
          firefox: '44.0',
          safari: '11.0',
          edge: '12.0'
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
        description: '獲取用戶地理位置資訊',
        browserSupport: {
          chrome: '5.0',
          firefox: '3.5',
          safari: '5.0',
          edge: '9.0'
        }
      }
    ]
  }
]; 