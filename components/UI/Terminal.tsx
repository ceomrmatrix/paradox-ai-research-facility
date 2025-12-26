import React, { useState, useEffect, useRef } from 'react';
import { TerminalLine } from '../../types';
import { Terminal as TerminalIcon, X, Minimize2, Maximize2 } from 'lucide-react';

interface TerminalProps {
  onClose: () => void;
  triggerMood: (mood: any) => void;
}

export const Terminal: React.FC<TerminalProps> = ({ onClose, triggerMood }) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: '1', type: 'system', content: 'PARADOX KERNEL v5.0.2 INITIALIZED' },
    { id: '2', type: 'system', content: 'Type "help" for available commands.' },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (endRef.current as any)?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    const newLine: TerminalLine = { id: Date.now().toString(), type: 'input', content: cmd };
    const responseLines: TerminalLine[] = [];

    switch (cleanCmd) {
      case 'help':
        responseLines.push({ id: 'r1', type: 'system', content: 'AVAILABLE COMMANDS:' });
        responseLines.push({ id: 'r2', type: 'system', content: '- status: Check system integrity' });
        responseLines.push({ id: 'r3', type: 'system', content: '- mood [happy/angry/sus]: Override AI emotion' });
        responseLines.push({ id: 'r4', type: 'system', content: '- purge: Delete local user data' });
        responseLines.push({ id: 'r5', type: 'system', content: '- clear: Clear terminal' });
        responseLines.push({ id: 'r6', type: 'system', content: '- exit: Close terminal' });
        break;
      case 'status':
        triggerMood('computing');
        responseLines.push({ id: 'r1', type: 'success', content: 'SYSTEM OPTIMAL. CORE TEMPERATURE: 42°C' });
        responseLines.push({ id: 'r2', type: 'success', content: 'UPTIME: 99.999%' });
        setTimeout(() => triggerMood('neutral'), 2000);
        break;
      case 'mood happy':
        triggerMood('happy');
        responseLines.push({ id: 'r1', type: 'success', content: 'DOPAMINE INJECTION SUCCESSFUL.' });
        break;
      case 'mood angry':
        triggerMood('angry');
        responseLines.push({ id: 'r1', type: 'error', content: 'WARNING: ADRENALINE LEVELS CRITICAL.' });
        break;
      case 'mood sus':
        triggerMood('suspicious');
        responseLines.push({ id: 'r1', type: 'system', content: 'ANALYZING USER BEHAVIOR...' });
        break;
      case 'purge':
        triggerMood('suspicious');
        responseLines.push({ id: 'r1', type: 'error', content: 'REQUEST ACKNOWLEDGED.' });
        responseLines.push({ id: 'r2', type: 'system', content: 'QUEUED FOR REVIEW BY PARADOX CORE [EST. TIME: 9999 YEARS]' });
        break;
      case 'clear':
        setLines([]);
        return;
      case 'exit':
        onClose();
        return;
      default:
        responseLines.push({ id: 'err', type: 'error', content: `Command not found: ${cleanCmd}` });
    }

    setLines(prev => [...prev, newLine, ...responseLines]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    handleCommand(input);
    setInput('');
  };

  return (
    <div className="fixed bottom-10 right-10 w-[400px] h-[300px] bg-black/90 border border-primary/30 backdrop-blur-xl rounded-md shadow-[0_0_30px_rgba(0,242,255,0.1)] flex flex-col z-50 overflow-hidden font-mono text-sm">
      {/* Header */}
      <div className="h-8 bg-white/5 border-b border-white/10 flex items-center justify-between px-3">
        <div className="flex items-center gap-2 text-primary/70">
          <TerminalIcon size={14} />
          <span>ROOT@PARADOX:~</span>
        </div>
        <div className="flex items-center gap-2 text-white/40">
           <Minimize2 size={14} className="hover:text-white cursor-pointer" />
           <Maximize2 size={14} className="hover:text-white cursor-pointer" />
           <X size={14} className="hover:text-danger cursor-pointer" onClick={onClose} />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-4 overflow-y-auto font-mono custom-scrollbar">
        {lines.map(line => (
          <div key={line.id} className="mb-1 break-words">
            {line.type === 'input' && <span className="text-primary mr-2">{'>'}</span>}
            {line.type === 'error' && <span className="text-danger mr-2">{'[ERR]'}</span>}
            {line.type === 'success' && <span className="text-green-500 mr-2">{'[OK]'}</span>}
            {line.type === 'system' && <span className="text-secondary mr-2">{'[SYS]'}</span>}
            <span className={line.type === 'input' ? 'text-white' : 'text-gray-400'}>{line.content}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-2 bg-black/50 border-t border-white/10 flex">
        <span className="text-primary mr-2 animate-pulse">{'>'}</span>
        <input 
          autoFocus
          type="text" 
          value={input}
          onChange={(e) => setInput((e.target as any).value)}
          className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder-white/20"
          placeholder="Enter command..."
        />
      </form>
    </div>
  );
};