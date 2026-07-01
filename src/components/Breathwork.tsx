import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { useQuran } from '../hooks/useQuran';

export function Breathwork() {
  const { setScreen, addXP, setStats } = useStore();
  const { ayahs, fetchRandomAyahs, loading } = useQuran();
  
  const [phase, setPhase] = useState<0|1|2|3>(0);
  const [ayahIdx, setAyahIdx] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timers on unmount to fix the memory/race-condition
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const runPhase = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    setPhase(1); // Inhale
    timerRef.current = setTimeout(() => {
      setPhase(2); // Hold
      timerRef.current = setTimeout(() => {
        setPhase(3); // Exhale/Recite
        timerRef.current = setTimeout(() => {
          setPhase(0); // Reset
          addXP(50);
          setStats((prev) => ({ ...prev, breathSessions: prev.breathSessions + 1 }));
        }, 8000); // Exhale duration
      }, 2000); // Hold duration
    }, 4000); // Inhale duration
  };

  const cancelSession = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase(0);
  };

  const a = ayahs[ayahIdx];

  return (
    <div className="screen-in max-w-lg mx-auto text-center pt-8">
      <div className="flex items-center justify-between mb-8 px-4">
        <button onClick={() => { cancelSession(); setScreen('dashboard'); }} className="btn-outline px-4 py-2 text-sm flex items-center gap-2">
          <i className="fa-solid fa-arrow-right"></i> العودة
        </button>
        <h2 className="text-xl font-black">تنفس التلاوة 🫁</h2>
      </div>

      <div className="mb-10 min-h-[140px] px-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <button onClick={() => setAyahIdx((i) => Math.max(0, i-1))} className="opacity-50 hover:opacity-100 p-2"><i className="fa-solid fa-chevron-right"></i></button>
          <span className={`badge text-xs ${a.badge}`}>{a.name} • {a.level}</span>
          <button onClick={() => setAyahIdx((i) => Math.min(ayahs.length-1, i+1))} className="opacity-50 hover:opacity-100 p-2"><i className="fa-solid fa-chevron-left"></i></button>
        </div>
        <p className="text-2xl font-bold leading-relaxed mb-4 font-serif" style={{ color: phase===3 ? 'var(--green)' : 'var(--text)' }}>
          {a.text}
        </p>
        
        {ayahIdx === ayahs.length - 1 && (
          <button onClick={fetchRandomAyahs} disabled={loading} className="text-xs btn-outline py-1 px-3 mx-auto mt-2 opacity-70 hover:opacity-100">
            {loading ? 'جاري جلب آيات...' : 'جلب المزيد من الآيات من الويب 🌐'}
          </button>
        )}
      </div>

      <div className="relative w-64 h-64 mx-auto mb-12 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-dashed" style={{ borderColor:'rgba(42,122,78,.2)' }}></div>
        <div 
          className="absolute rounded-full transition-all ease-in-out" 
          style={{ 
            background: phase===1 ? 'var(--green-pale)' : phase===2 ? 'var(--gold-pale)' : phase===3 ? 'var(--purple-pale)' : 'transparent',
            inset: phase===1 ? '0' : phase===2 ? '0' : phase===3 ? '25%' : '40%',
            transitionDuration: phase===1 ? '4000ms' : phase===2 ? '2000ms' : phase===3 ? '8000ms' : '500ms'
          }}
        ></div>
        <div className="relative z-10">
          <div className="text-4xl mb-2">{phase===0?'🧘‍♂️':phase===1?'🌬️':phase===2?'⏳':phase===3?'🗣️':''}</div>
          <div className="font-black text-xl">
            {phase===0 && 'مستعد؟'}
            {phase===1 && 'شهيق عميق...'}
            {phase===2 && 'ثبّت النفس'}
            {phase===3 && 'اقرأ بتمهل...'}
          </div>
          {phase !== 0 && (
            <div className="text-xs font-bold mt-2 opacity-70">
              {phase===1 && '4 ثوان'}
              {phase===2 && 'ثانيتان'}
              {phase===3 && 'حتى ينتهي نَفَسك'}
            </div>
          )}
        </div>
      </div>

      {phase === 0 ? (
        <button onClick={runPhase} className="btn-primary px-8 py-4 text-lg rounded-2xl shadow-xl shadow-green-900/20 hover:scale-105 transition-all">
          <i className="fa-solid fa-play ml-2"></i> ابدأ التمرين
        </button>
      ) : (
        <button onClick={cancelSession} className="btn-outline px-6 py-2 text-sm text-red-500 border-red-200 hover:bg-red-50">
          إلغاء التمرين
        </button>
      )}
    </div>
  );
}
