import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import CategoryPage from './pages/CategoryPage';
import { setOpenDemoModal } from './data/apiCategories';

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

  return (
    <Router>
      <div className="w-screen min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Web API Demo 網頁 API 演示</h1>
          
          <Navigation />
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Routes>
              <Route path="/" element={
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    歡迎使用 Web API 演示
                  </h2>
                  <p className="text-gray-600">
                    請從上方選擇一個 API 分類開始探索
                  </p>
                </div>
              } />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
            </Routes>
          </div>
        </div>
      </div>

      {React.isValidElement(demoComponent) &&
        React.cloneElement(demoComponent, {
          isOpen: true,
          onClose: handleCloseDemoModal
        })
      }
    </Router>
  );
}

export default App;
