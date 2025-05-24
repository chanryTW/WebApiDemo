import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navigation from './components/Navigation';
import CategoryPage from './pages/CategoryPage';
import { setOpenDemoModal, categories } from './data/apiCategories';

// 獲取 base URL
const baseUrl = import.meta.env.BASE_URL;

function App() {
  const [demoComponent, setDemoComponent] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    setOpenDemoModal((component: React.ReactNode) => {
      setDemoComponent(component);
    });
  }, []);

  const handleCloseDemoModal = () => {
    setDemoComponent(null);
  };

  const HomePage = () => (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Web API 演示
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          這個專案展示了現代網頁 API 的使用方法和實際應用場景。點擊任一 API 卡片來查看演示。
        </p>
      </div>

      {categories.map((category) => (
        <div key={category.id} className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
            {category.name}
            <span className="text-gray-500 text-sm">
              {' '}
              {category.description}
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.apis.map((api) => (
              <div
                key={api.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-medium text-gray-800">
                      {api.name}
                    </h4>
                    {api.demo && (
                      <button
                        onClick={api.demo}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Demo
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {api.description}
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">瀏覽器支援：</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="w-16 text-gray-600">Chrome:</span>
                        <span className={api.browserSupport.chrome === 'N/A' ? 'text-red-500' : 'text-green-500'}>
                          {api.browserSupport.chrome}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-16 text-gray-600">Firefox:</span>
                        <span className={api.browserSupport.firefox === 'N/A' ? 'text-red-500' : 'text-green-500'}>
                          {api.browserSupport.firefox}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-16 text-gray-600">Safari:</span>
                        <span className={api.browserSupport.safari === 'N/A' ? 'text-red-500' : 'text-green-500'}>
                          {api.browserSupport.safari}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-16 text-gray-600">Edge:</span>
                        <span className={api.browserSupport.edge === 'N/A' ? 'text-red-500' : 'text-green-500'}>
                          {api.browserSupport.edge}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex space-x-4 text-sm">
                    <a
                      href={api.mdnUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      MDN 文件
                    </a>
                    <a
                      href={api.canIUseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Can I use
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Router basename={baseUrl}>
      <div className="w-screen h-screen overflow-y-auto bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200 p-8">
        <div className="max-w-7xl mx-auto relative">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              <Link to="/" className="hover:text-blue-200 transition-colors">
                Web API Demo 網頁 API 演示
              </Link>
            </h1>
            <a
              href="https://github.com/chanryTW/WebApiDemo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
          
          <Navigation />
          
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
            </Routes>
          </div>
        </div>
      </div>

      {React.isValidElement(demoComponent) &&
        React.cloneElement(demoComponent as React.ReactElement<{
          isOpen?: boolean;
          onClose?: () => void;
        }>, {
          isOpen: true,
          onClose: handleCloseDemoModal
        })
      }
    </Router>
  );
}

export default App;
