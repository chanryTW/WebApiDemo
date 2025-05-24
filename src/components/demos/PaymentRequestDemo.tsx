import React, { useState } from 'react';
import DemoModal from '../DemoModal';

interface PaymentRequestDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentRequestDemo: React.FC<PaymentRequestDemoProps> = ({ isOpen, onClose }) => {
  const [error, setError] = useState<string>('');
  const [paymentResult, setPaymentResult] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const makePayment = async () => {
    if (!window.PaymentRequest) {
      setError('您的瀏覽器不支援 Payment Request API');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');
      setPaymentResult('');

      // 定義支付方式
      const supportedPaymentMethods = [
        {
          supportedMethods: 'basic-card',
          data: {
            supportedNetworks: ['visa', 'mastercard'],
            supportedTypes: ['credit', 'debit']
          }
        }
      ];

      // 定義支付詳情
      const paymentDetails = {
        total: {
          label: '總計',
          amount: {
            currency: 'TWD',
            value: '299.00'
          }
        },
        displayItems: [
          {
            label: '商品價格',
            amount: {
              currency: 'TWD',
              value: '299.00'
            }
          }
        ]
      };

      // 定義其他選項
      const options = {
        requestPayerName: true,
        requestPayerEmail: true,
        requestPayerPhone: true,
        requestShipping: false
      };

      // 建立支付請求
      const paymentRequest = new PaymentRequest(
        supportedPaymentMethods,
        paymentDetails,
        options
      );

      // 檢查是否可以進行支付
      const canMakePayment = await paymentRequest.canMakePayment();
      if (!canMakePayment) {
        throw new Error('無法使用此支付方式');
      }

      // 顯示支付介面
      const paymentResponse = await paymentRequest.show();
      
      // 模擬處理支付
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 完成支付
      await paymentResponse.complete('success');
      
      setPaymentResult('支付成功！');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('支付過程中發生錯誤');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const codeExample = `// 定義支付方式
const supportedPaymentMethods = [
  {
    supportedMethods: 'basic-card',
    data: {
      supportedNetworks: ['visa', 'mastercard'],
      supportedTypes: ['credit', 'debit']
    }
  }
];

// 定義支付詳情
const paymentDetails = {
  total: {
    label: '總計',
    amount: {
      currency: 'TWD',
      value: '299.00'
    }
  }
};

// 建立支付請求
const paymentRequest = new PaymentRequest(
  supportedPaymentMethods,
  paymentDetails,
  {
    requestPayerName: true,
    requestPayerEmail: true
  }
);

// 檢查是否可以支付
const canMakePayment = await paymentRequest.canMakePayment();

if (canMakePayment) {
  try {
    const response = await paymentRequest.show();
    // 處理支付
    await response.complete('success');
  } catch (err) {
    console.error('支付失敗:', err);
  }
}`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Request API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div className="p-6 border rounded-lg bg-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  測試商品
                </h3>
                <p className="text-sm text-gray-500">
                  用於測試支付功能的虛擬商品
                </p>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                NT$299
              </div>
            </div>

            <div className="border-t pt-4">
              <button
                onClick={makePayment}
                disabled={isProcessing}
                className={`
                  w-full px-4 py-2 rounded-md text-sm font-medium text-white
                  ${isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'}
                `}
              >
                {isProcessing ? '處理中...' : '立即購買'}
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            {paymentResult && (
              <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
                {paymentResult}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            說明
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              此演示展示了 Payment Request API 的基本功能：
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>定義支付方式（信用卡、簽帳卡）</li>
              <li>設置支付金額和貨幣</li>
              <li>請求付款人資訊（姓名、電子郵件、電話）</li>
              <li>處理支付流程和結果</li>
            </ul>
            <p className="mt-4 text-yellow-600">
              注意：這是一個測試演示，不會進行實際的金融交易。在實際應用中，您需要整合真實的支付處理系統。
            </p>
          </div>
        </div>
      </div>
    </DemoModal>
  );
};

export default PaymentRequestDemo; 