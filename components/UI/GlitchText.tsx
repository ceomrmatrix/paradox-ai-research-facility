import React from 'react';

interface GlitchTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'span';
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, as = 'span', className = '' }) => {
  const Component = as;

  return (
    <Component className={`relative inline-block group ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -ml-[2px] text-primary opacity-0 group-hover:opacity-70 group-hover:animate-glitch clip-path-top" aria-hidden="true">
        {text}
      </span>
      <span className="absolute top-0 left-0 ml-[2px] text-danger opacity-0 group-hover:opacity-70 group-hover:animate-glitch animation-delay-100 clip-path-bottom" aria-hidden="true">
        {text}
      </span>
    </Component>
  );
};
