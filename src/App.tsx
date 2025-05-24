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
      <div className="w-screen min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Web API Demo 網頁 API 演示
            </Link>
          </h1>
          
          <Navigation />
          
          <div className="bg-white rounded-lg shadow-md p-6">
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
