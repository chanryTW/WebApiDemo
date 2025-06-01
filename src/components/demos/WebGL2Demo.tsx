import React, { useEffect, useRef, useState } from 'react';
import DemoModal from '../DemoModal';

interface WebGL2DemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const WebGL2Demo: React.FC<WebGL2DemoProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState('');
  const animationRef = useRef<number | undefined>(undefined);
  const rotationRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    setIsSupported(!!gl);

    if (!gl) {
      setError('您的瀏覽器不支援 WebGL2');
      return;
    }

    // 頂點著色器程式
    const vertexShaderSource = `#version 300 es
      in vec4 aPosition;
      in vec4 aColor;
      out vec4 vColor;
      uniform float uRotation;
      
      void main() {
        float rad = uRotation * 3.14159 / 180.0;
        float c = cos(rad);
        float s = sin(rad);
        mat4 rotation = mat4(
          c, -s, 0, 0,
          s, c, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
        );
        gl_Position = rotation * aPosition;
        vColor = aColor;
      }
    `;

    // 片段著色器程式
    const fragmentShaderSource = `#version 300 es
      precision mediump float;
      in vec4 vColor;
      out vec4 fragColor;
      
      void main() {
        fragColor = vColor;
      }
    `;

    // 編譯著色器
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) {
      setError('創建頂點著色器失敗');
      return;
    }
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) {
      setError('創建片段著色器失敗');
      return;
    }
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // 創建著色器程式
    const program = gl.createProgram();
    if (!program) {
      setError('創建著色器程式失敗');
      return;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // 設置頂點數據
    const positions = new Float32Array([
      -0.5, -0.5,  // 左下
       0.5, -0.5,  // 右下
       0.0,  0.5   // 頂點
    ]);

    const colors = new Float32Array([
      1.0, 0.0, 0.0, 1.0,  // 紅
      0.0, 1.0, 0.0, 1.0,  // 綠
      0.0, 0.0, 1.0, 1.0   // 藍
    ]);

    // 創建並綁定頂點緩衝區
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // 創建並綁定顏色緩衝區
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    const aColor = gl.getAttribLocation(program, 'aColor');
    gl.enableVertexAttribArray(aColor);
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);

    // 獲取旋轉角度的 uniform 位置
    const uRotation = gl.getUniformLocation(program, 'uRotation');

    // 渲染函數
    const render = () => {
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      rotationRef.current = (rotationRef.current + 1) % 360;
      gl.uniform1f(uRotation, rotationRef.current);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const codeExample = `// 獲取 WebGL2 上下文
const gl = canvas.getContext('webgl2');

// 創建並編譯著色器
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

// 創建著色器程式
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

// 設置頂點數據
const positions = new Float32Array([
  -0.5, -0.5,
   0.5, -0.5,
   0.0,  0.5
]);

// 創建並綁定緩衝區
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

// 設置頂點屬性
const aPosition = gl.getAttribLocation(program, 'aPosition');
gl.enableVertexAttribArray(aPosition);
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

// 渲染
gl.clearColor(0.0, 0.0, 0.0, 0.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, 3);`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="WebGL2 API 展示"
      description="此 API 提供了基於 OpenGL ES 3.0 的 3D 圖形渲染功能，支援更多現代化的圖形特性。"
      codeExample={codeExample}
    >
      <div className="space-y-4">
        {!isSupported ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
            ⚠️ 您的瀏覽器不支援 WebGL2 API
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            ❌ {error}
          </div>
        ) : (
          <>
            <div className="bg-gray-800 p-4 rounded-lg flex justify-center">
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="border border-gray-700"
              />
            </div>

            <div className="text-sm text-gray-600">
              <p>* WebGL2 API 的應用場景：</p>
              <ul className="list-disc list-inside ml-4">
                <li>3D 遊戲開發</li>
                <li>視覺化應用</li>
                <li>3D 建模工具</li>
                <li>虛擬實境</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </DemoModal>
  );
};

export default WebGL2Demo; 