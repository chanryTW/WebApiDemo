import React from 'react';
import { ApiInfo } from '../data/apiCategories';

interface BrowserBadgeProps {
  browser: string;
  version: string;
}

const BrowserBadge: React.FC<BrowserBadgeProps> = ({ browser, version }) => (
  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
    <img 
      src={`/browsers/${browser}.svg`} 
      alt={browser} 
      className="w-4 h-4"
    />
    <span className="text-sm">{version}+</span>
  </div>
);

interface ApiCardProps {
  api: ApiInfo;
}

const ApiCard: React.FC<ApiCardProps> = ({ api }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4 border border-gray-200">
      <h3 className="text-xl font-semibold mb-2">{api.name}</h3>
      <p className="text-gray-600 mb-4">{api.description}</p>
      
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-500 mb-2">瀏覽器支援</h4>
        <div className="flex gap-2">
          <BrowserBadge browser="chrome" version={api.browserSupport.chrome} />
          <BrowserBadge browser="firefox" version={api.browserSupport.firefox} />
          <BrowserBadge browser="safari" version={api.browserSupport.safari} />
          <BrowserBadge browser="edge" version={api.browserSupport.edge} />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <a
          href={api.mdnUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          MDN 文件
        </a>
        <a
          href={api.canIUseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 hover:underline"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
          </svg>
          Can I Use
        </a>
      </div>

      {api.demo && (
        <button
          onClick={api.demo}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Demo
        </button>
      )}
    </div>
  );
};

export default ApiCard; 