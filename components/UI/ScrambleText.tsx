import React, { useState, useEffect, useRef } from 'react';

interface ScrambleTextProps {
  text: string;
  className?: string;
  speed?: number;
  reveal?: boolean; // If true, auto reveals on mount
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export const ScrambleText: React.FC<ScrambleTextProps> = ({ text, className = '', speed = 30, reveal = false }) => {
  const [display, setDisplay] = useState(reveal ? '' : text);
  const intervalRef = useRef<any>(null);

  const scramble = () => {
    let iteration = 0;
    
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplay(prev => 
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      iteration += 1 / 3;
    }, speed);
  };

  useEffect(() => {
    if (reveal) scramble();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <span 
      className={`${className} font-mono cursor-pointer`}
      onMouseEnter={scramble}
    >
      {display}
    </span>
  );
};