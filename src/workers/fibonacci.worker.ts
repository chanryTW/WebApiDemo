// 計算斐波那契數列第 n 項
const fibonacci = (n: number): number => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

// 監聽主執行緒的訊息
self.addEventListener('message', (e: MessageEvent) => {
  const n = e.data;
  
  // 開始計時
  const startTime = performance.now();
  
  // 計算斐波那契數列
  const result = fibonacci(n);
  
  // 計算耗時
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  // 將結果發送回主執行緒
  self.postMessage({
    n,
    result,
    duration
  });
}); 