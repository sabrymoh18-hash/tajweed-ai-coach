'use client';
import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';

// Components
import { Dashboard } from '../components/Dashboard';
import { MakharijRadar } from '../components/MakharijRadar';
import { Breathwork } from '../components/Breathwork';
import { TajweedRules } from '../components/TajweedRules';
import { Feedback } from '../components/Feedback';
import { Leaderboard } from '../components/Leaderboard';
import { TuhfaFullText } from '../components/TuhfaFullText';

export default function Home() {
  const { screen, stats, setStats, setScreen } = useStore();
  const [mounted, setMounted] = useState(false);

  // Fix hydration issues with Zustand persist
  useEffect(() => {
    setMounted(true);
    
    // Update last visit and check for streak
    const today = new Date().toDateString();
    if (stats.lastVisit !== today) {
      setStats((prev) => {
        let newStreak = prev.streak;
        if (prev.lastVisit) {
          const lastDate = new Date(prev.lastVisit);
          const diff = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
          if (diff === 1) newStreak++;
          else if (diff > 1) newStreak = 0; // Reset streak if missed a day
        } else {
          newStreak = 1; // First visit
        }
        return { ...prev, lastVisit: today, streak: newStreak };
      });
    }
  }, [stats.lastVisit, setStats]);

  if (!mounted) {
    return <div className="min-h-screen bg-[#0a1a12] flex items-center justify-center text-green-500">جاري التحميل...</div>;
  }

  return (
    <main className="min-h-[100dvh] pb-24 relative overflow-x-hidden pt-safe selection:bg-green-500/30">
      {/* Background Decorative Blobs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-green-500/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-700/5 blur-[120px] pointer-events-none" />

      {/* Dynamic Screen Routing */}
      <div className="relative z-10 px-4">
        {screen === 'dashboard'   && <Dashboard />}
        {screen === 'makharij'    && <MakharijRadar />}
        {screen === 'breathwork'  && <Breathwork />}
        {screen === 'tajweed'     && <TajweedRules />}
        {screen === 'feedback'    && <Feedback />}
        {screen === 'leaderboard' && <Leaderboard />}
        {screen === 'tuhfa'       && <TuhfaFullText />}
      </div>

      {/* Navigation Bar (Mobile & Desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-4 bg-gradient-to-t from-[#0a1a12] via-[#0a1a12]/90 to-transparent backdrop-blur-sm">
        <div className="max-w-md mx-auto flex items-center justify-between glass px-6 py-3 rounded-2xl shadow-2xl shadow-black/50 border border-green-900/30">
          <button onClick={() => setScreen('dashboard')} className={`flex flex-col items-center gap-1 transition-all ${screen === 'dashboard' ? 'text-green-400 scale-110' : 'text-gray-500 hover:text-gray-300'}`}>
            <i className="fa-solid fa-house text-lg"></i>
            <span className="text-[10px] font-bold">الرئيسية</span>
          </button>
          
          <button onClick={() => setScreen('makharij')} className={`flex flex-col items-center gap-1 transition-all ${screen === 'makharij' ? 'text-green-400 scale-110' : 'text-gray-500 hover:text-gray-300'}`}>
            <i className="fa-solid fa-radar text-lg"></i>
            <span className="text-[10px] font-bold">المخارج</span>
          </button>
          
          <div className="relative -top-6">
            <button onClick={() => setScreen('breathwork')} className={`w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-lg shadow-green-900/50 transition-transform hover:scale-110 ${screen === 'breathwork' ? 'bg-green-500 text-white' : 'bg-[#1a3a28] text-green-400 border-2 border-green-900'}`}>
              <i className="fa-solid fa-microphone"></i>
            </button>
          </div>

          <button onClick={() => setScreen('leaderboard')} className={`flex flex-col items-center gap-1 transition-all ${screen === 'leaderboard' ? 'text-yellow-400 scale-110' : 'text-gray-500 hover:text-gray-300'}`}>
            <i className="fa-solid fa-trophy text-lg"></i>
            <span className="text-[10px] font-bold">الشرف</span>
          </button>
          
          <button onClick={() => setScreen('tajweed')} className={`flex flex-col items-center gap-1 transition-all ${screen === 'tajweed' ? 'text-green-400 scale-110' : 'text-gray-500 hover:text-gray-300'}`}>
            <i className="fa-solid fa-book-quran text-lg"></i>
            <span className="text-[10px] font-bold">الأحكام</span>
          </button>
        </div>
      </nav>
    </main>
  );
}
