import React, { useEffect, useRef, useState } from 'react';
import { Mood, Position } from '../../types';
import { Zap, Activity, Music, Heart, Binary, Terminal } from 'lucide-react';

declare const window: any;

interface FaceProps {
  mood: Mood;
  mousePos: Position;
}

interface FloatingNote {
  id: number;
  x: number;
  icon: 'note' | 'activity';
}

const PHRASES = [
  "Watching...",
  "Calculating entropy...",
  "Do not touch the glass.",
  "Are you real?",
  "Accessing neural pathways...",
  "I can see your cursor.",
  "Optimizing...",
  "Who is the observer?",
  "Data tastes like static.",
];

export const Face: React.FC<FaceProps> = ({ mood, mousePos }) => {
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [notes, setNotes] = useState<FloatingNote[]>([]);
  const [thought, setThought] = useState<string | null>(null);
  const [showThought, setShowThought] = useState(false);

  // --- Logic: Eye Tracking ---
  useEffect(() => {
    if (['sleep', 'glitch', 'listening'].includes(mood)) {
      setEyeOffset({ x: 0, y: 0 });
      return;
    }

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = mousePos.x - cx;
    const dy = mousePos.y - cy;
    
    // Calculate angle and clamp distance
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(20, Math.hypot(dx, dy) / 30); 

    setEyeOffset({
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    });
  }, [mousePos, mood]);

  // --- Logic: Idle Behaviors (Blinking & Thoughts) ---
  useEffect(() => {
    let timeout: any;
    
    const runIdleLoop = () => {
      // 1. Blinking
      if (mood !== 'sleep' && mood !== 'glitch') {
        if (Math.random() < 0.3) {
           setBlink(true);
           setTimeout(() => setBlink(false), 150);
        }
      }

      // 2. Thoughts (Only when neutral)
      if (Math.random() < 0.15 && mood === 'neutral' && !thought) {
        const txt = PHRASES[Math.floor(Math.random() * PHRASES.length)];
        setThought(txt);
        setShowThought(true);
        
        setTimeout(() => {
          setShowThought(false);
          setTimeout(() => setThought(null), 500); // Wait for fade out
        }, 4000);
      }
      
      timeout = setTimeout(runIdleLoop, Math.random() * 3000 + 2000);
    };

    runIdleLoop();
    return () => clearTimeout(timeout);
  }, [mood, thought]);

  // --- Logic: Floating Notes ---
  useEffect(() => {
    if (mood !== 'listening') {
      setNotes([]);
      return;
    }
    const interval = setInterval(() => {
      const newNote: FloatingNote = {
        id: Date.now(),
        x: (Math.random() * 60) - 20, 
        icon: 'note',
      };
      setNotes(prev => [...prev, newNote]);
      setTimeout(() => setNotes(prev => prev.filter(n => n.id !== newNote.id)), 2000);
    }, 600);
    return () => clearInterval(interval);
  }, [mood]);

  // --- Styles Helper Functions ---
  const getEyeStyles = () => {
    // Base styles without shadow
    const base = "absolute transition-all duration-300 flex items-center justify-center";
    const glow = "shadow-[0_0_20px_rgba(255,255,255,0.6)]";
    
    // For love mood: transparent background, no box shadow (removes the square), added drop-shadow for the heart itself
    if (mood === 'love') return `${base} w-20 h-20 bg-transparent text-primary animate-pulse drop-shadow-[0_0_15px_rgba(0,242,255,0.6)]`;
    
    // Default styles include the white background and box shadow
    let styles = `${base} ${glow} bg-white`;
    if (blink) return `${styles} w-14 h-1 rounded-full opacity-50`;

    switch (mood) {
      case 'angry': return `${styles} w-14 h-14 rounded-sm bg-red-500 shadow-[0_0_30px_rgba(255,0,0,0.8)] rotate-45`;
      case 'suspicious': return `${styles} w-14 h-4 rounded-full`;
      case 'surprised': return `${styles} w-20 h-20 rounded-full border-4 border-white bg-transparent`;
      case 'sleep': return `${styles} w-14 h-1 rounded-full opacity-30`;
      case 'happy': return `${styles} w-14 h-8 rounded-t-full rounded-b-none border-t-4 border-white bg-transparent`;
      case 'listening': return `${styles} w-14 h-8 rounded-t-full rounded-b-none border-t-4 border-white bg-transparent`; 
      case 'computing': return `${styles} w-14 h-2 rounded-none animate-pulse bg-primary`;
      case 'glitch': return `${styles} w-12 h-12 rounded-none bg-white opacity-80`; 
      default: return `${styles} w-14 h-14 rounded-full`;
    }
  };

  const getMouthStyles = () => {
    const base = "w-32 h-16 border-b-8 border-white rounded-b-[60px] transition-all duration-300";
    switch (mood) {
      case 'angry': return "w-32 h-8 border-t-8 border-red-500 rounded-t-[60px] translate-y-8 shadow-[0_0_20px_rgba(255,0,0,0.5)]";
      case 'suspicious': return "w-20 h-1 bg-white rounded-full mt-10";
      case 'surprised': return "w-10 h-10 border-4 border-white rounded-full bg-transparent mt-8";
      case 'sleep': return "w-10 h-10 border-b-4 border-white/30 rounded-full mt-4";
      case 'happy': return base;
      case 'listening': return "w-24 h-12 border-b-8 border-white rounded-b-[60px] mt-2";
      case 'computing': return "w-32 h-2 bg-primary/50 animate-pulse mt-8";
      case 'love': return "w-20 h-10 border-b-8 border-white rounded-b-[60px] mt-4";
      case 'glitch': return "w-32 h-4 border-b-4 border-white skew-x-12 opacity-70";
      default: return base; 
    }
  };

  const getContainerClasses = () => {
    const base = "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-0 transition-opacity duration-1000";
    if (mood === 'angry') return `${base} animate-[shake_0.2s_infinite]`;
    if (mood === 'listening') return `${base} animate-bob`;
    if (mood === 'glitch') return `${base} animate-glitch`;
    return base;
  };

  // --- Render ---
  return (
    <div className={getContainerClasses()}>
       {/* Ambient Glow */}
       <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[100px] transition-colors duration-500 
            ${mood === 'angry' ? 'bg-red-900/20' : mood === 'love' ? 'bg-pink-500/20' : 'bg-primary/10'}`}></div>

      <div className="relative w-full h-full flex flex-col items-center justify-center">
        
        {/* Thought Bubble */}
        <div 
          className={`
            absolute -top-16 -right-16
            transition-all duration-500 ease-in-out origin-bottom-left
            ${showThought ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'}
          `}
        >
           {thought && (
             <div className="relative bg-black/80 backdrop-blur-md border border-primary/50 px-4 py-3 rounded-tr-xl rounded-tl-xl rounded-br-xl shadow-[0_0_15px_rgba(0,242,255,0.15)] max-w-[200px]">
                <div className="flex items-center gap-2 mb-1 border-b border-primary/20 pb-1">
                   <Terminal size={10} className="text-primary animate-pulse" />
                   <span className="text-[10px] text-primary/70 font-mono tracking-wider">SYSTEM_THOUGHT</span>
                </div>
                <div className="text-white font-mono text-sm leading-tight typing-effect">
                   {thought}
                </div>
                {/* Connector Line */}
                <div className="absolute bottom-0 -left-6 w-6 h-[1px] bg-primary/50 rotate-[135deg] origin-bottom-right"></div>
             </div>
           )}
        </div>

        {/* Floating Music Notes */}
        {mood === 'listening' && (
            <div className="absolute top-1/3 right-1/3 w-20 h-20">
                {notes.map(note => (
                    <Music key={note.id} size={24} className="text-primary absolute animate-float" style={{ left: note.x }} />
                ))}
            </div>
        )}

        {/* Glitch Artifacts */}
        {mood === 'glitch' && (
            <>
                <div className="absolute top-1/3 left-10 font-mono text-xs text-primary animate-pulse opacity-50">0xEF4...ERR</div>
                <div className="absolute bottom-1/3 right-10 font-mono text-xs text-danger animate-pulse opacity-50">KERNEL_PANIC</div>
                <Binary className="absolute top-20 right-40 text-white/20 animate-spin" size={30} />
            </>
        )}

        {/* Eyes */}
        <div className="flex gap-24 mb-10">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className={getEyeStyles()} style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px) ${mood === 'glitch' ? 'translateY(-10px)' : ''}` }}>
                {mood === 'love' && <Heart fill="currentColor" size={60} />}
            </div>
          </div>
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className={getEyeStyles()} style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px) ${mood === 'angry' ? 'rotate(45deg)' : mood === 'glitch' ? 'translateY(10px)' : ''}` }}>
                {mood === 'love' && <Heart fill="currentColor" size={60} />}
            </div>
          </div>
        </div>

        {/* Mouth */}
        <div className={getMouthStyles()} style={{ transform: `translate(${eyeOffset.x / 3}px, 0)` }} />
        
        {/* Computing Particles */}
        {mood === 'computing' && (
           <div className="absolute mt-32 flex gap-2 text-primary animate-pulse">
             <Activity size={24} />
             <Zap size={24} />
           </div>
        )}
      </div>
    </div>
  );
};