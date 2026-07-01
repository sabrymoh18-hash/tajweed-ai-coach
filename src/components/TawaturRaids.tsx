import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export function TawaturRaids() {
  const { setScreen } = useStore();
  const [phase, setPhase] = useState<'lobby' | 'sync' | 'result'>('lobby');
  const [countdown, setCountdown] = useState(5);
  const [syncPower, setSyncPower] = useState(0);

  useEffect(() => {
    let t: any;
    if (phase === 'lobby') {
      t = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            setPhase('sync');
            return 5;
          }
          return c - 1;
        });
      }, 1000);
    } else if (phase === 'sync') {
      t = setInterval(() => {
        setSyncPower((p) => {
          if (p >= 100) {
            setPhase('result');
            return 100;
          }
          return p + Math.random() * 15;
        });
      }, 500);
    }
    return () => clearInterval(t);
  }, [phase]);

  return (
    <div className="min-h-[100dvh] bg-[#050a08] text-white p-4 relative overflow-hidden flex flex-col">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[conic-gradient(from_0deg,transparent,#00ff88,transparent)] animate-[spin_4s_linear_infinite]" style={{ mixBlendMode: 'screen' }}></div>
      </div>

      <div className="relative z-10 flex items-center justify-between mb-8">
        <button onClick={() => setScreen('dashboard')} className="text-white/50 hover:text-white transition-colors">
          <i className="fa-solid fa-arrow-right text-xl"></i>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-red-500">Live Server</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        {phase === 'lobby' && (
          <div className="text-center animate-in zoom-in duration-500">
            <h1 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">غرفة التواتر 🌍</h1>
            <p className="text-gray-400 mb-12">بانتظار اكتمال الدائرة لبدء التلاوة المتزامنة...</p>
            
            <div className="relative w-64 h-64 mx-auto mb-8">
              {/* Central Orb */}
              <div className="absolute inset-0 border-4 border-dashed border-gray-700 rounded-full animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute inset-4 border-2 border-dashed border-gray-600 rounded-full animate-[spin_8s_linear_reverse_infinite]"></div>
              <div className="absolute inset-0 flex items-center justify-center text-7xl font-black text-white">{countdown}</div>
              
              {/* Users */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=1`} className="w-12 h-12 rounded-full border-2 border-green-500 bg-black" alt="user"/>
                <span className="text-[10px] mt-1 text-green-400">أنت</span>
              </div>
              <div className="absolute top-1/2 -right-4 -translate-y-1/2 flex flex-col items-center">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=2`} className="w-10 h-10 rounded-full border-2 border-gray-600 bg-black" alt="user"/>
              </div>
              <div className="absolute bottom-0 left-1/4 flex flex-col items-center opacity-50">
                <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center"><i className="fa-solid fa-spinner fa-spin text-xs"></i></div>
              </div>
            </div>
          </div>
        )}

        {phase === 'sync' && (
          <div className="text-center w-full animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold mb-8 text-green-400 animate-pulse">اقرأ الآن!</h2>
            <div className="font-serif text-3xl leading-loose mb-12 text-white">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ<br/>
              الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
            </div>
            
            <div className="w-full max-w-sm mx-auto">
              <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 px-1">
                <span>طاقة التواتر الجماعية</span>
                <span className="text-green-400">{Math.floor(syncPower)}%</span>
              </div>
              <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-700 shadow-inner">
                <div className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-300" style={{ width: `${syncPower}%` }}></div>
              </div>
            </div>
          </div>
        )}

        {phase === 'result' && (
          <div className="text-center animate-in zoom-in duration-700">
            <i className="fa-solid fa-gem text-6xl text-cyan-400 mb-6 drop-shadow-[0_0_30px_rgba(34,211,238,0.6)]"></i>
            <h2 className="text-4xl font-black mb-2 text-white">اكتمل التواتر!</h2>
            <p className="text-gray-400 mb-8">حصلت المجموعة على إجازة "الفاتحة"</p>
            
            <button onClick={() => setScreen('dashboard')} className="px-8 py-3 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              عودة للوحة الشرف
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
