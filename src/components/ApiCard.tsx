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

      {api.demo && (
        <button
          onClick={api.demo}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          試用 Demo
        </button>
      )}
    </div>
  );
};

export default ApiCard; 