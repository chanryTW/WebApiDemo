import React, { useCallback } from 'react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: React.ReactNode;
  codeExample?: string;
}

const DemoModal: React.FC<DemoModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  codeExample
}) => {
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">演示</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              {children}
            </div>
          </div>

          {codeExample && (
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-700">程式碼範例</h4>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto custom-scrollbar">
                <code>{codeExample}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoModal; 