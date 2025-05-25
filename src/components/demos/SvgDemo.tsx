import DemoModal from '../DemoModal';
import React from 'react';

const codeExample = `<svg width="120" height="120">
  <circle cx="60" cy="60" r="50" fill="orange" stroke="black" stroke-width="4" />
  <text x="60" y="65" text-anchor="middle" font-size="18" fill="white">SVG</text>
</svg>`;

const SvgDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <DemoModal isOpen={isOpen} onClose={onClose} title="SVG API 演示" description="SVG 圖形繪製與互動" codeExample={codeExample}>
    <svg width="120" height="120" style={{border:'1px solid #ccc'}}>
      <circle cx="60" cy="60" r="50" fill="orange" stroke="black" strokeWidth="4" />
      <text x="60" y="65" textAnchor="middle" fontSize="18" fill="white">SVG</text>
    </svg>
  </DemoModal>
);
export default SvgDemo; 