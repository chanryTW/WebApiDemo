# Web API Demo 網頁 API 演示

展示了 Web API 的使用方法和實際應用場景。
This project demonstrates the usage and practical applications of Web APIs.

## 功能特點 Features

### 系統相關 API System-related APIs
- 剪貼簿 API (Clipboard API)
- 全螢幕 API (Fullscreen API)
- 電池狀態 API (Battery Status API)
- 震動 API (Vibration API)
- 網路資訊 API (Network Information API)

### 互動相關 API Interaction APIs
- 交叉觀察器 API (Intersection Observer API)
- 尺寸觀察器 API (Resize Observer API)
- 頁面可見度 API (Page Visibility API)
- 指針事件 API (Pointer Events API)
- 網頁語音 API (Web Speech API)

### 檔案與多媒體 API File and Media APIs
- 檔案 API (File API)
- 拖放 API (Drag and Drop API)
- 網頁音訊 API (Web Audio API)

### 背景處理 API Background Processing APIs
- 網頁通知 API (Web Notifications API)
- 網頁工作者 API (Web Workers API)

## 技術棧 Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite

## 開始使用 Getting Started

### 系統需求 Requirements

- Node.js 16.0 或更高版本 (or higher)
- npm 7.0 或更高版本 (or higher)

### 安裝 Installation

```bash
# 複製專案 Clone the repository
git clone https://github.com/yourusername/web-api-demo.git

# 進入專案目錄 Navigate to the project directory
cd web-api-demo

# 安裝依賴 Install dependencies
npm install
```

### 開發 Development

```bash
# 啟動開發伺服器 Start development server
npm run dev
```

## 專案結構 Project Structure

```
web-api-demo/
├── src/
│   ├── components/
│   │   ├── demos/          # API 演示組件 (API demo components)
│   │   └── common/         # 共用組件 (Common components)
│   │   
│   ├── workers/           # Web Workers
│   ├── data/             # 靜態資料 (Static data)
│   ├── pages/            # 頁面組件 (Page components)
│   └── App.tsx           # 應用程式入口 (Application entry)
├── public/              # 靜態資源 (Static assets)
└── index.html          # HTML 模板 (HTML template)
```