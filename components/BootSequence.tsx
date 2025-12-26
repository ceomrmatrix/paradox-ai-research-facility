import React, { useEffect, useState, useRef } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  "BIOS CHECK... OK",
  "LOADING KERNEL 5.10.2...",
  "ALLOCATING MEMORY BLOCKS...",
  "MOUNTING VIRTUAL FILE SYSTEM...",
  "INITIALIZING NEURAL NETWORKS...",
  "CONNECTING TO PARAOS CORE...",
  "DECRYPTING SECURE ZONES...",
  "ESTABLISHING UPLINK...",
  "ACCESS GRANTED."
];

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: any;

    const runSequence = () => {
      if (currentIndex >= BOOT_LOGS.length) {
        timeoutId = setTimeout(() => {
          if (onCompleteRef.current) onCompleteRef.current();
        }, 500);
        return;
      }

      setLogs(prev => {
        const msg = BOOT_LOGS[currentIndex];
        if (prev.includes(msg)) return prev;
        return [...prev, msg];
      });
      
      setProgress(((currentIndex + 1) / BOOT_LOGS.length) * 100);
      currentIndex++;

      const delay = Math.random() * 200 + 100; 
      timeoutId = setTimeout(runSequence, delay);
    };

    timeoutId = setTimeout(runSequence, 200);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[10000] flex flex-col justify-end p-8 font-mono text-primary text-sm cursor-none select-none">
      <div className="mb-4 space-y-1">
        {logs.map((log, i) => (
          /* Fixed the > error here by using {'>'} */
          <div key={i} className="opacity-80 animate-pulse-fast">
            {'>'} {log}
          </div>
        ))}
      </div>
      
      <div className="w-full h-1 bg-gray-900 mt-4 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary shadow-[0_0_10px_#00f2ff] transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="mt-2 text-right text-xs text-gray-500">
        PARADOX SYSTEMS v1.0
      </div>
    </div>
  );
};
