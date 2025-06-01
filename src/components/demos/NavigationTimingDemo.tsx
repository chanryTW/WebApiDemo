import React, { useState, useEffect } from 'react';
import DemoModal from '../DemoModal';

interface NavigationTimingDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TimingMetrics {
  navigationStart: number;
  redirectStart: number;
  redirectEnd: number;
  fetchStart: number;
  domainLookupStart: number;
  domainLookupEnd: number;
  connectStart: number;
  connectEnd: number;
  secureConnectionStart: number;
  requestStart: number;
  responseStart: number;
  responseEnd: number;
  domLoading: number;
  domInteractive: number;
  domContentLoadedEventStart: number;
  domContentLoadedEventEnd: number;
  domComplete: number;
  loadEventStart: number;
  loadEventEnd: number;
}

const NavigationTimingDemo: React.FC<NavigationTimingDemoProps> = ({ isOpen, onClose }) => {
  const [timingMetrics, setTimingMetrics] = useState<TimingMetrics | null>(null);

  useEffect(() => {
    if (isOpen) {
      const timing = performance.timing;
      const navigationStart = timing.navigationStart;

      const metrics: TimingMetrics = {
        navigationStart: 0, // 基準時間點
        redirectStart: timing.redirectStart - navigationStart,
        redirectEnd: timing.redirectEnd - navigationStart,
        fetchStart: timing.fetchStart - navigationStart,
        domainLookupStart: timing.domainLookupStart - navigationStart,
        domainLookupEnd: timing.domainLookupEnd - navigationStart,
        connectStart: timing.connectStart - navigationStart,
        connectEnd: timing.connectEnd - navigationStart,
        secureConnectionStart: timing.secureConnectionStart - navigationStart,
        requestStart: timing.requestStart - navigationStart,
        responseStart: timing.responseStart - navigationStart,
        responseEnd: timing.responseEnd - navigationStart,
        domLoading: timing.domLoading - navigationStart,
        domInteractive: timing.domInteractive - navigationStart,
        domContentLoadedEventStart: timing.domContentLoadedEventStart - navigationStart,
        domContentLoadedEventEnd: timing.domContentLoadedEventEnd - navigationStart,
        domComplete: timing.domComplete - navigationStart,
        loadEventStart: timing.loadEventStart - navigationStart,
        loadEventEnd: timing.loadEventEnd - navigationStart,
      };

      setTimingMetrics(metrics);
    }
  }, [isOpen]);

  const formatTime = (time: number): string => {
    return `${time.toFixed(2)}ms`;
  };

  const renderTimingPhase = (label: string, start: number, end: number) => {
    if (start === 0 && end === 0) return null;
    const duration = end - start;
    return (
      <div className="timing-phase">
        <h4>{label}</h4>
        <p>開始: {formatTime(start)} | 結束: {formatTime(end)} | 持續: {formatTime(duration)}</p>
      </div>
    );
  };

  const codeExample = `// 獲取導航時間資訊
const timing = performance.timing;
const navigationStart = timing.navigationStart;

// 計算各階段時間
const dnsTime = timing.domainLookupEnd - timing.domainLookupStart;
const tcpTime = timing.connectEnd - timing.connectStart;
const requestTime = timing.responseEnd - timing.requestStart;
const domProcessingTime = timing.domComplete - timing.domLoading;
const pageLoadTime = timing.loadEventEnd - timing.loadEventStart;`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="Navigation Timing API 展示"
      description="此 API 提供了詳細的頁面載入時間資訊，包括 DNS 查詢、連線建立、請求處理等階段的時間數據。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        {timingMetrics && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="space-y-4">
              {renderTimingPhase('重導向', timingMetrics.redirectStart, timingMetrics.redirectEnd)}
              <hr />
              {renderTimingPhase('DNS 查詢', timingMetrics.domainLookupStart, timingMetrics.domainLookupEnd)}
              <hr />
              {renderTimingPhase('TCP 連線', timingMetrics.connectStart, timingMetrics.connectEnd)}
              <hr />
              {renderTimingPhase('請求處理', timingMetrics.requestStart, timingMetrics.responseEnd)}
              <hr />
              {renderTimingPhase('DOM 處理', timingMetrics.domLoading, timingMetrics.domComplete)}
              <hr />
              {renderTimingPhase('頁面載入', timingMetrics.loadEventStart, timingMetrics.loadEventEnd)}
            </div>

            <p className="text-sm text-gray-600 mt-4">
              * 所有時間都是相對於導航開始時間計算
            </p>
          </div>
        )}
      </div>
    </DemoModal>
  );
};

export default NavigationTimingDemo; 