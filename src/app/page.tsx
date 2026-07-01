'use client';
import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { AnimatePresence, motion } from 'framer-motion';

// Components
import { Dashboard } from '../components/Dashboard';
import { MakharijRadar } from '../components/MakharijRadar';
import { Breathwork } from '../components/Breathwork';
import { TajweedRules } from '../components/TajweedRules';
import { Feedback } from '../components/Feedback';
import { Leaderboard } from '../components/Leaderboard';
import { TuhfaFullText } from '../components/TuhfaFullText';
import { GoldenMirror } from '../components/GoldenMirror';
import { TawaturRaids } from '../components/TawaturRaids';
import { BottomNav } from '../components/ui/BottomNav';

export default function Home() {
  const { screen, stats, setStats } = useStore();
  const [mounted, setMounted] = useState(false);

  // Fix hydration issues with Zustand persist
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
            transition={{ duration: 0.3 }}
          >
            {screen === 'dashboard'   && <Dashboard />}
            {screen === 'makharij'    && <MakharijRadar />}
            {screen === 'breathwork'  && <Breathwork />}
            {screen === 'tajweed'     && <TajweedRules />}
            {screen === 'feedback'    && <Feedback />}
            {screen === 'leaderboard' && <Leaderboard />}
            {screen === 'tuhfa'       && <TuhfaFullText />}
            {screen === 'golden_mirror' && <GoldenMirror />}
            {screen === 'tawatur'     && <TawaturRaids />}
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav />
    </main>
  );
}
