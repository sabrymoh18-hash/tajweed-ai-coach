import React from 'react';

interface WaveformProps {
  bars: number[];
  active: boolean;
}

export function Waveform({ bars, active }: WaveformProps) {
  return (
    <div className="flex items-center justify-center gap-1 h-20 bg-black/5 rounded-xl border border-black/5">
      {bars.map((h, i) => (
        <div 
          key={i} 
          className="w-1.5 rounded-full transition-all duration-75"
          style={{ 
            height: `${h}%`, 
            background: active ? 'var(--green)' : 'var(--muted)',
            opacity: active ? Math.max(0.3, h/100) : 0.2
          }}
        />
      ))}
    </div>
  );
}
