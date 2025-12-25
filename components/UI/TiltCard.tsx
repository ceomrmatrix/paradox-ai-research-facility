import React, { useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', glowColor = '#00f2ff' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = (cardRef.current as any).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
    const rotateY = ((x - centerX) / centerX) * 10;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`
        relative bg-surface border border-white/10 backdrop-blur-md 
        transition-all duration-200 ease-out transform-style-3d group
        ${className}
      `}
      style={{ transform }}
    >
        {/* Corner Accents */}
        <div className={`absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 transition-colors duration-300 ${isHovering ? 'border-primary' : 'border-white/20'}`} />
        <div className={`absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 transition-colors duration-300 ${isHovering ? 'border-primary' : 'border-white/20'}`} />

      {/* Content */}
      <div className="relative z-10 translate-z-[20px]">
        {children}
      </div>

      {/* Glow Effect */}
      <div 
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
        style={{
            background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)`
        }}
      />
    </div>
  );
};