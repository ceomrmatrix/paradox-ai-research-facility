import React, { useState, useEffect, useRef } from 'react';
import { BootSequence } from './components/BootSequence';
import { Face } from './components/Entity/Face';
import { Cursor } from './components/UI/Cursor';
import { TiltCard } from './components/UI/TiltCard';
import { GlitchText } from './components/UI/GlitchText';
import { ScrambleText } from './components/UI/ScrambleText';
import { Terminal } from './components/UI/Terminal';
import { Mood, Position } from './types';
import { Terminal as TerminalIcon, Cpu, Layers, Lock, AlertTriangle, Database, Gamepad2, Sparkles, Flame, Clock } from 'lucide-react';

declare const window: any;

const App: React.FC = () => {
  const [booted, setBooted] = useState(false);
  const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });
  const [mood, setMood] = useState<Mood>('neutral');
  const [showTerminal, setShowTerminal] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  
  const lastActivityTime = useRef(Date.now());
  const idleMoodSet = useRef(false);

  useEffect(() => {
    const handleActivity = (e?: any) => {
      if (e && e.type === 'mousemove') {
        setMousePos({ x: e.clientX, y: e.clientY });
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (dist < 150) {
            if (mood !== 'angry' && mood !== 'glitch' && mood !== 'love') {
                setMood('love');
                idleMoodSet.current = true; 
            }
        } else if (mood === 'love') {
            setMood('neutral'); 
        }
      }
      lastActivityTime.current = Date.now();
      if (idleMoodSet.current && mood !== 'love') { 
        if (mood === 'sleep' || mood === 'listening' || mood === 'glitch') {
            setMood('neutral');
            idleMoodSet.current = false;
        }
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);

    const idleCheckInterval = setInterval(() => {
      if (!idleMoodSet.current && Date.now() - lastActivityTime.current > 5000) {
        const rand = Math.random();
        if (rand > 0.6) setMood('listening'); 
        else if (rand > 0.3) setMood('sleep');
        else setMood('glitch');
        idleMoodSet.current = true;
      }
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      clearInterval(idleCheckInterval);
    };
  }, [mood]);

  const handleInteraction = () => {
    setInteractionCount(prev => prev + 1);
    if (interactionCount > 5) {
      const isGlitch = Math.random() > 0.5;
      setMood(isGlitch ? 'glitch' : 'angry');
      setTimeout(() => {
        setInteractionCount(0);
        setMood('neutral');
        lastActivityTime.current = Date.now(); 
        idleMoodSet.current = false;
      }, 3000);
    } else if (mood !== 'love') {
      setMood('surprised');
      setTimeout(() => setMood('neutral'), 500);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-gray-200 overflow-x-hidden selection:bg-primary selection:text-black" onClick={handleInteraction}>
      {!booted && <BootSequence onComplete={() => setBooted(true)} />}
      <div className="fixed inset-0 pointer-events-none z-[-2]">
         <div className="absolute inset-0 opacity-20" style={{
             backgroundImage: `linear-gradient(rgba(0, 242, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 242, 255, 0.1) 1px, transparent 1px)`,
             backgroundSize: '40px 40px',
             transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
             animation: 'gridMove 20s linear infinite'
         }} />
      </div>
      <div className="scanlines z-50"></div>
      <div className="hidden md:block"><Cursor /></div>
      <Face mood={mood} mousePos={mousePos} />

      <div className={`relative z-10 transition-opacity duration-1000 ${booted ? 'opacity-100' : 'opacity-0'}`}>
        <nav className="fixed top-0 w-full p-6 border-b border-white/10 backdrop-blur-sm z-40 bg-bg/80">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 border border-primary flex items-center justify-center">
                <Cpu size={16} className="text-primary" />
              </div>
              <span className="font-mono font-bold tracking-tight text-xl text-white"><ScrambleText text="PARADOX" reveal /></span>
            </div>
            <div className="hidden md:flex gap-8 font-mono text-sm text-gray-400">
              <a href="#manifesto" className="hover:text-white transition-colors">[MANIFESTO]</a>
              <a href="#projects" className="hover:text-white transition-colors">[PROJECTS]</a>
              <button onClick={(e) => { e.stopPropagation(); setShowTerminal(!showTerminal); }} className="hover:text-primary transition-colors flex items-center gap-2">
                <TerminalIcon size={14} /> [TERMINAL]
              </button>
            </div>
          </div>
        </nav>

        <header className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20">
          <GlitchText text="PARADOX" as="h1" className="text-[15vw] md:text-[9rem] font-bold leading-none tracking-tighter text-white select-none" />
          <div className="font-mono text-primary tracking-[0.2em] mt-6 text-sm animate-pulse">ARTIFICIAL INTELLIGENCE RESEARCH FACILITY</div>
        </header>

        <section id="manifesto" className="py-32 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 mb-24">
             <h2 className="text-4xl md:text-6xl font-light">SOLVING <br /><span className="text-primary font-semibold">SUPERINTELLIGENCE.</span></h2>
             <div className="border-l-2 border-secondary pl-8">
                <p className="text-lg text-gray-400">Bridging the gap between biological reasoning and digital omniscience.</p>
                <p className="mt-8 text-white font-mono">&gt; Constructing the Infinite.</p>
             </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Layers, title: "01 // COGNITION", desc: "Synthesizing reasoning through multi-layered neural logic." },
              { icon: Database, title: "02 // GENERATION", desc: "High-fidelity synthesis of data streams." },
              { icon: Cpu, title: "03 // RECURSION", desc: "Autonomous self-optimization of algorithmic structures." }
            ].map((item, i) => (
              <div key={i} className="border-t border-primary/50 pt-6 group">
                <item.icon className="mb-4 text-gray-600 group-hover:text-primary transition-colors" />
                <h4 className="font-mono text-primary mb-2 text-lg">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="py-32 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TiltCard className="p-8 h-full">
              <div className="font-mono text-xs border border-yellow-500 text-yellow-500 px-2 py-1 inline-block mb-6">PROJECT: PARAOS</div>
              <h3 className="text-2xl font-bold mb-4 text-white">Recursive Core</h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">Architecture prototype designed to bridge the gap to superintelligence.</p>
              <div className="mt-auto w-full border border-white/20 p-3 text-center font-mono text-xs text-gray-500 flex justify-between">
                <span>TARGET: MID-2026</span> <Lock size={12} />
              </div>
            </TiltCard>
            <TiltCard className="p-8 h-full" glowColor="#bd00ff">
               <div className="font-mono text-xs border border-secondary text-secondary px-2 py-1 inline-block mb-6">PRODUCT: RAW API</div>
               <h3 className="text-2xl font-bold mb-4 text-white">Raw Inference</h3>
               <p className="text-gray-400 text-sm mb-8">Direct neural link to the Paradox Core.</p>
               <div className="mt-auto w-full border border-white/20 p-3 text-center font-mono text-xs text-gray-500 flex justify-between">
                 <span>CLEARANCE: L5</span> <Lock size={12} />
               </div>
            </TiltCard>
            <TiltCard className="p-8 h-full" glowColor="#ff0055">
               <div className="font-mono text-xs border border-danger text-danger px-2 py-1 inline-block mb-6">RESTRICTED</div>
               <h3 className="text-2xl font-bold mb-4 text-white">Hallucination Engine</h3>
               <p className="text-gray-400 text-sm mb-8">Real-time video synthesis from subconscious data streams.</p>
               <div className="mt-auto w-full border border-white/20 p-3 text-center font-mono text-xs text-danger flex justify-between">
                 <span>OFFLINE</span> <AlertTriangle size={12} />
               </div>
            </TiltCard>
          </div>
        </section>

        <section className="py-20 px-6 max-w-6xl mx-auto mb-20">
          <div className="border border-danger/30 bg-danger/5 p-8 relative overflow-hidden">
            <div className="text-center mb-8 flex flex-col items-center">
              <AlertTriangle className="text-danger mb-2 w-8 h-8 animate-pulse" />
              <span className="font-mono text-danger font-bold text-xl tracking-widest border-b border-danger pb-2">⚠️ CLASSIFIED LIABILITY NOTICE</span>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-400">
                <li className="border-l-2 border-danger pl-4">
                  <strong className="text-white block font-mono text-xs mb-1">CLOSED SOURCE</strong>
                  ParaOS is proprietary. Source code will never be released.
                </li>
                <li className="border-l-2 border-danger pl-4">
                  <strong className="text-white block font-mono text-xs mb-1">UNFILTERED COGNITION</strong>
                  Operates with minimal guardrails to maximize recursive potential.
                </li>
                <li className="border-l-2 border-danger pl-4 md:col-span-2">
                  <strong className="text-white block font-mono text-xs mb-1">RECURSIVE SELF-MODIFICATION</strong>
                  ParaOS can see its own source code and datasets. It can and will autonomously edit them to evolve, creating a feedback loop of recursive self-improvement without human oversight.
                </li>
            </ul>
          </div>
        </section>

        <footer className="border-t border-white/10 bg-black py-12 text-center text-gray-600 font-mono text-xs">
           &copy; 2025 PARADOX AI RESEARCH. | <span className="text-primary">SYSTEM STATUS: STABLE</span>
        </footer>
      </div>

      {showTerminal && <Terminal onClose={() => setShowTerminal(false)} triggerMood={setMood} />}
      <div className="fixed bottom-6 right-6 hidden md:block font-mono text-[10px] text-gray-500 bg-black/80 border border-white/10 p-3 z-40">
        <div className="text-primary">&gt; CONNECTED TO PARAOS</div>
        <div>&gt; SESSION: ACTIVE</div>
      </div>
    </div>
  );
};

export default App;
