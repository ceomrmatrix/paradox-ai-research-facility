import React, { useEffect, useRef, useState } from 'react';
import { Mood, Position } from '../../types';
import { Zap, Activity, Music, Heart, Binary, MessageSquare } from 'lucide-react';

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
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [notes, setNotes] = useState<FloatingNote[]>([]);
  const [thought, setThought] = useState<string | null>(null);
  const [showThought, setShowThought] = useState(false);

  // Eye Tracking Logic
  useEffect(() => {
    if (mood === 'sleep' || mood === 'glitch' || mood === 'listening') {
        setEyeOffset({ x: 0, y: 0 });
        return;
    }

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = mousePos.x - cx;
    const dy = mousePos.y - cy;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(20, Math.hypot(dx, dy) / 30); 

    setEyeOffset({
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    });

  }, [mousePos, mood]);

  // Random Idle Behavior & Thoughts
  useEffect(() => {
    let timeout: any;
    
    const runIdleLoop = () => {
        const action = Math.random();
        
        // 30% chance to look around if neutral
        if (action < 0.3 && mood === 'neutral') {
            const randX = (Math.random() - 0.5) * 30;
            const randY = (Math.random() - 0.5) * 30;
            setEyeOffset({ x: randX, y: randY });
        } else if (mood !== 'sleep' && mood !== 'glitch') {
            setBlink(true);
            setTimeout(() => setBlink(false), 150);
        }

        // Random Thought Generation (15% chance per cycle)
        if (Math.random() < 0.15 && mood === 'neutral' && !thought) {
            const txt = PHRASES[Math.floor(Math.random() * PHRASES.length)];
            setThought(txt);
            setShowThought(true);
            
            // Keep visible for 4s, then fade out
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

  // Music Notes Spawner (Listening)
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

  // Mood Styles (Helpers)
  const getEyeStyles = () => {
    const base = "absolute transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.6)] flex items-center justify-center";
    if (mood === 'love') return `${base} w-20 h-20 bg-transparent text-primary animate-pulse`;
    
    let styles = `${base} bg-white`;
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

  return (
    <div className={`
      fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
      w-[600px] h-[600px] pointer-events-none z-0
      transition-opacity duration-1000
      ${mood === 'angry' ? 'animate-[shake_0.2s_infinite]' : ''}
      ${mood === 'listening' ? 'animate-bob' : ''}
      ${mood === 'glitch' ? 'animate-glitch' : ''}
    `}>
       {/* Holographic Glow */}
       <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[100px] transition-colors duration-500 
            ${mood === 'angry' ? 'bg-red-900/20' : mood === 'love' ? 'bg-pink-500/20' : 'bg-primary/10'}`}></div>

      <div className="relative w-full h-full flex flex-col items-center justify-center">
        
        {/* Thought Bubble - High Contrast & No Floating Animation for better readability */}
        {thought && (
            <div 
              className={`
                absolute -top-16 -right-24 max-w-[240px] 
                bg-black border border-primary 
                p-4 rounded-xl shadow-[0_0_25px_rgba(0,242,255,0.2)] 
                z-[100] transition-all duration-500 ease-in-out
                ${showThought ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
              `}
            >
                <div className="text-white font-mono text-sm leading-relaxed typing-effect drop-shadow-md">
                  {thought}
                </div>
                {/* Bubble tail */}
                <div className="absolute bottom-0 -left-2 w-4 h-4 bg-black border-l border-b border-primary transform rotate-45 translate-y-1/2"></div>
            </div>
        )}

        {/* Floating Notes */}
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
            <div ref={leftEyeRef} className={getEyeStyles()} style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px) ${mood === 'glitch' ? 'translateY(-10px)' : ''}` }}>
                {mood === 'love' && <Heart fill="currentColor" size={60} />}
            </div>
          </div>
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div ref={rightEyeRef} className={getEyeStyles()} style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px) ${mood === 'angry' ? 'rotate(45deg)' : mood === 'glitch' ? 'translateY(10px)' : ''}` }}>
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