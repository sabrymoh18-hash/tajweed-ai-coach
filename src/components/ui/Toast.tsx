import React from 'react';

interface ToastProps {
  message: string;
}

export function Toast({ message }: ToastProps) {
  if (!message) return null;
  
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div 
        className="px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3"
        style={{ background:'linear-gradient(135deg, #0f2d1a, #1a3a28)', border:'1.5px solid rgba(42,122,78,0.4)', backdropFilter:'blur(12px)' }}
      >
        <i className="fa-solid fa-circle-check text-green-400 text-lg"></i>
        <span className="text-sm font-semibold" style={{ color:'#e2f4ea' }}>{message}</span>
      </div>
    </div>
  );
}
