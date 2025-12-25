import React, { useEffect, useState } from 'react';

declare const window: any;

export const Cursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: any) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      const t = target as any;
      const isHoverable = t.closest('button') || 
                          t.closest('a') || 
                          t.closest('.hover-target') ||
                          t.tagName === 'INPUT';
      setHovered(!!isHoverable);
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <>
      {/* Main Cursor Ring */}
      <div 
        className="fixed pointer-events-none z-[9999] transition-transform duration-100 ease-out mix-blend-exclusion"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) scale(${clicked ? 0.8 : hovered ? 1.5 : 1})`,
        }}
      >
        <div className={`
          w-8 h-8 rounded-full border border-primary/60
          ${hovered ? 'bg-primary/10 border-primary' : ''}
          transition-all duration-300
        `} />
      </div>

      {/* Center Dot */}
      <div 
        className="fixed pointer-events-none z-[9999] w-1 h-1 bg-primary rounded-full mix-blend-exclusion"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)'
        }}
      />
    </>
  );
};