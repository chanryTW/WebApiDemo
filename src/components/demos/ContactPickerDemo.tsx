import React, { useState } from 'react';
import DemoModal from '../DemoModal';

interface ContactPickerDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Contact {
  name: string[];
  email: string[];
  tel: string[];
  address: string[];
  icon: string[];
}

const ContactPickerDemo: React.FC<ContactPickerDemoProps> = ({ isOpen, onClose }) => {
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [error, setError] = useState('');
  const [isSupported, setIsSupported] = useState(() => 'contacts' in navigator && 'ContactsManager' in window);

  const selectContacts = async () => {
    try {
      if (!isSupported) {
        throw new Error('您的瀏覽器不支援 Contact Picker API');
      }

      // @ts-expect-error: Contact Picker API 的類型定義可能不存在
      const contacts = await navigator.contacts.select([
        'name',
        'email',
        'tel',
        'address',
        'icon'
      ], {
        multiple: true
      });

      setSelectedContacts(contacts);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '選擇聯絡人時發生錯誤');
    }
  };

  const codeExample = `// 檢查瀏覽器支援
if ('contacts' in navigator && 'ContactsManager' in window) {
  try {
    // 請求選擇聯絡人
    const contacts = await navigator.contacts.select([
      'name',
      'email',
      'tel',
      'address',
      'icon'
    ], {
      multiple: true // 允許選擇多個聯絡人
    });

    // 處理選擇的聯絡人
    contacts.forEach(contact => {
      console.log('姓名:', contact.name);
      console.log('電子郵件:', contact.email);
      console.log('電話:', contact.tel);
      console.log('地址:', contact.address);
    });
  } catch (err) {
    console.error('選擇聯絡人時發生錯誤:', err);
  }
}`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Contact Picker API 演示"
      description="展示如何安全地訪問用戶的通訊錄並選擇聯絡人資訊。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        {!isSupported ? (
          <div className="text-red-500 text-center">
            您的瀏覽器不支援 Contact Picker API
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <button
                onClick={selectContacts}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                選擇聯絡人
              </button>
            </div>

            {error && (
              <div className="text-red-500 text-center">
                {error}
              </div>
            )}

            {selectedContacts.length > 0 && (
              <div className="border rounded-md p-4 space-y-4">
                <h3 className="font-medium text-gray-700">已選擇的聯絡人：</h3>
                <div className="space-y-4">
                  {selectedContacts.map((contact, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-md space-y-2"
                    >
                      {contact.icon && contact.icon[0] && (
                        <img
                          src={contact.icon[0]}
                          alt="聯絡人照片"
                          className="w-12 h-12 rounded-full"
                        />
                      )}
                      <div>
                        <span className="font-medium">姓名：</span>
                        {contact.name && contact.name[0]}
                      </div>
                      {contact.email && contact.email[0] && (
                        <div>
                          <span className="font-medium">電子郵件：</span>
                          {contact.email[0]}
                        </div>
                      )}
                      {contact.tel && contact.tel[0] && (
                        <div>
                          <span className="font-medium">電話：</span>
                          {contact.tel[0]}
                        </div>
                      )}
                      {contact.address && contact.address[0] && (
                        <div>
                          <span className="font-medium">地址：</span>
                          {contact.address[0]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-sm text-gray-600">
              <p>提示：</p>
              <ul className="list-disc list-inside">
                <li>點擊「選擇聯絡人」按鈕開啟系統的聯絡人選擇器</li>
                <li>您可以選擇一個或多個聯絡人</li>
                <li>只有在支援的瀏覽器和安全的環境（HTTPS）下才能使用</li>
                <li>需要用戶明確授權才能訪問聯絡人資訊</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </DemoModal>
  );
};

export default ContactPickerDemo; 