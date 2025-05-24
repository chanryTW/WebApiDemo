import React, { useEffect, useRef, useState } from 'react';
import DemoModal from '../DemoModal';
import { mat4 } from 'gl-matrix';

interface WebGLDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const WebGLDemo: React.FC<WebGLDemoProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string>('');
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const animationRef = useRef<number>(0);
  const angleRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      setError('您的瀏覽器不支援 WebGL');
      return;
    }

    // 頂點著色器程式
    const vertexShaderSource = `
      attribute vec4 aVertexPosition;
      attribute vec4 aVertexColor;
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      varying lowp vec4 vColor;
      void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
      }
    `;

    // 片段著色器程式
    const fragmentShaderSource = `
      varying lowp vec4 vColor;
      void main() {
        gl_FragColor = vColor;
      }
    `;

    // 創建著色器程式
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    const shaderProgram = gl.createProgram()!;
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      setError('無法初始化著色器程式');
      return;
    }

    // 獲取屬性位置
    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      },
    };

    // 創建立方體頂點
    const positions = [
      // 前面
      -1.0, -1.0,  1.0,
       1.0, -1.0,  1.0,
       1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,
      // 後面
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0, -1.0, -1.0,
      // 頂面
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
       1.0,  1.0,  1.0,
       1.0,  1.0, -1.0,
      // 底面
      -1.0, -1.0, -1.0,
       1.0, -1.0, -1.0,
       1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,
      // 右面
       1.0, -1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0,  1.0,  1.0,
       1.0, -1.0,  1.0,
      // 左面
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0,
    ];

    // 創建頂點緩衝區
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // 創建顏色數據
    const faceColors = [
      [1.0, 0.0, 0.0, 1.0],    // 前面: 紅色
      [0.0, 1.0, 0.0, 1.0],    // 後面: 綠色
      [0.0, 0.0, 1.0, 1.0],    // 頂面: 藍色
      [1.0, 1.0, 0.0, 1.0],    // 底面: 黃色
      [1.0, 0.0, 1.0, 1.0],    // 右面: 紫色
      [0.0, 1.0, 1.0, 1.0],    // 左面: 青色
    ];

    let colors: number[] = [];
    for (let j = 0; j < faceColors.length; ++j) {
      const c = faceColors[j];
      colors = colors.concat(c, c, c, c);
    }

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // 創建索引緩衝區
    const indices = [
      0,  1,  2,    0,  2,  3,    // 前面
      4,  5,  6,    4,  6,  7,    // 後面
      8,  9,  10,   8,  10, 11,   // 頂面
      12, 13, 14,   12, 14, 15,   // 底面
      16, 17, 18,   16, 18, 19,   // 右面
      20, 21, 22,   20, 22, 23,   // 左面
    ];

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // 渲染函數
    const render = () => {
      if (!gl) return;

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clearDepth(1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const fieldOfView = 45 * Math.PI / 180;
      const aspect = canvas.clientWidth / canvas.clientHeight;
      const zNear = 0.1;
      const zFar = 100.0;
      const projectionMatrix = mat4.create();
      mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

      const modelViewMatrix = mat4.create();
      mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]);
      mat4.rotate(modelViewMatrix, modelViewMatrix, angleRef.current, [0, 1, 0]);

      // 設置頂點位置
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        3,
        gl.FLOAT,
        false,
        0,
        0
      );
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

      // 設置頂點顏色
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        4,
        gl.FLOAT,
        false,
        0,
        0
      );
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);

      // 綁定索引緩衝區
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

      // 使用著色器程式
      gl.useProgram(programInfo.program);

      // 設置矩陣
      gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix
      );
      gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix
      );

      // 繪製
      gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

      // 更新旋轉角度
      angleRef.current += rotationSpeed * 0.02;
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [rotationSpeed]);

  const codeExample = `// 獲取 WebGL 上下文
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

// 創建著色器
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

// 創建著色器程式
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

// 設置頂點數據
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// 渲染
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, 3);`;

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title="WebGL API 演示"
      codeExample={codeExample}
    >
      <div className="space-y-6">
        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            3D 立方體渲染
          </h3>
          <div className="space-y-4">
            <canvas
              ref={canvasRef}
              width="400"
              height="400"
              className="w-full bg-black rounded-lg"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                旋轉速度：{rotationSpeed}
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={rotationSpeed}
                onChange={(e) => setRotationSpeed(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
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
              此演示展示了 WebGL 的基本功能：
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>3D 圖形渲染（立方體）</li>
              <li>動畫效果（旋轉）</li>
              <li>著色器程式的使用</li>
              <li>頂點和片段著色</li>
            </ul>
          </div>
        </div>
      </div>
    </DemoModal>
  );
};

export default WebGLDemo; 