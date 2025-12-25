export type Mood = 'neutral' | 'suspicious' | 'angry' | 'happy' | 'sleep' | 'surprised' | 'computing' | 'listening' | 'glitch' | 'love';

export interface Position {
  x: number;
  y: number;
}

export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'system' | 'error' | 'success';
  content: string;
}