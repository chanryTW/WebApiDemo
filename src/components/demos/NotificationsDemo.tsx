import React, { useState, useEffect } from "react";
import DemoModal from "../DemoModal";

interface NotificationsDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

// 擴展 NotificationOptions 型別以包含額外的屬性
interface ExtendedNotificationOptions extends NotificationOptions {
  vibrate?: number[];
  renotify?: boolean;
  requireInteraction?: boolean;
  actions?: {
    action: string;
    title: string;
  }[];
}

const NotificationsDemo: React.FC<NotificationsDemoProps> = ({
  isOpen,
  onClose,
}) => {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [title, setTitle] = useState("測試通知");
  const [body, setBody] = useState("這是一則測試通知訊息");
  const [icon, setIcon] = useState("/favicon.ico");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setPermission(Notification.permission);
  }, []);

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      setError("");
    } catch {
      setError("請求通知權限時發生錯誤");
    }
  };

  const showNotification = () => {
    try {
      if (!("Notification" in window)) {
        setError("此瀏覽器不支援通知功能");
        return;
      }

      if (permission !== "granted") {
        setError("尚未取得通知權限");
        return;
      }

      const options: ExtendedNotificationOptions = {
        body,
        icon,
        badge: icon,
        vibrate: [200, 100, 200],
        tag: "demo-notification",
        renotify: true,
        requireInteraction: true,
        actions: [
          {
            action: "confirm",
            title: "確認",
          },
          {
            action: "cancel",
            title: "取消",
          },
        ],
      };

      const notification = new Notification(title, options);

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      notification.onshow = () => {
        console.log("通知已顯示");
      };

      notification.onclose = () => {
        console.log("通知已關閉");
      };

      notification.onerror = () => {
        setError("顯示通知時發生錯誤");
      };

      setError("");
    } catch {
      setError("建立通知時發生錯誤");
    }
  };

  const codeExample = `// 檢查瀏覽器支援
if (!('Notification' in window)) {
  console.log('此瀏覽器不支援通知功能');
}

// 請求權限
const permission = await Notification.requestPermission();

// 如果已取得權限，可以發送通知
if (permission === 'granted') {
  const notification = new Notification('通知標題', {
    body: '通知內容',
    icon: '/path/to/icon.png',
    vibrate: [200, 100, 200],
    actions: [
      {
        action: 'confirm',
        title: '確認'
      }
    ]
  });

  // 監聽通知事件
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
}`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Web Notifications API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            通知權限狀態
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span
                className={`
                inline-block w-3 h-3 rounded-full
                ${
                  permission === "granted"
                    ? "bg-green-500"
                    : permission === "denied"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }
              `}
              />
              <span className="text-gray-700">
                {permission === "granted"
                  ? "已允許"
                  : permission === "denied"
                  ? "已拒絕"
                  : "未決定"}
              </span>
            </div>
            {permission !== "granted" && (
              <button
                onClick={requestPermission}
                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
              >
                請求權限
              </button>
            )}
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700 mb-4">通知設定</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                標題
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                placeholder="輸入通知標題"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                內容
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                rows={3}
                placeholder="輸入通知內容"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                圖示網址
              </label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                placeholder="輸入圖示網址"
              />
            </div>

            <button
              onClick={showNotification}
              disabled={permission !== "granted"}
              className={`
                w-full px-4 py-2 rounded-md text-sm font-medium text-white
                ${
                  permission === "granted"
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-400 cursor-not-allowed"
                }
              `}
            >
              發送通知
            </button>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </DemoModal>
  );
};

export default NotificationsDemo;
