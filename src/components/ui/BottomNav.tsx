import React from 'react';
import { useStore, Screen } from '../../store/useStore';
import { motion } from 'framer-motion';

export function BottomNav() {
  const { screen, setScreen, stats } = useStore();

  const NAV_ITEMS: { id: Screen; icon: string; label: string; reqLvl: number; color: string }[] = [
    { id: 'dashboard', icon: 'fa-house', label: 'الرئيسية', reqLvl: 1, color: 'text-green-400' },
    { id: 'makharij', icon: 'fa-tower-broadcast', label: 'المخارج', reqLvl: 1, color: 'text-emerald-400' },
    { id: 'tajweed', icon: 'fa-book-quran', label: 'الأحكام', reqLvl: 3, color: 'text-purple-400' },
    { id: 'golden_mirror', icon: 'fa-microphone-lines', label: 'المرآة', reqLvl: 4, color: 'text-yellow-500' },
    { id: 'tawatur', icon: 'fa-globe', label: 'التواتر', reqLvl: 5, color: 'text-red-500' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe pt-2 bg-gradient-to-t from-black via-black/90 to-transparent backdrop-blur-md">
      <div className="max-w-md mx-auto bg-[#11241a]/90 border border-green-900/50 rounded-2xl shadow-2xl flex justify-between items-center p-2 mb-2 relative overflow-hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = screen === item.id;
          const isUnlocked = stats.level >= item.reqLvl;

          return (
            <button
              key={item.id}
              onClick={() => isUnlocked && setScreen(item.id)}
              disabled={!isUnlocked}
              className={`relative flex flex-col items-center justify-center w-14 h-12 transition-all duration-300 ${
                !isUnlocked ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:bg-white/5 rounded-xl'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-0 bg-white/10 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <i
                className={`fa-solid ${item.icon} text-lg z-10 transition-transform duration-300 ${
                  isActive ? `scale-110 ${item.color} drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]` : 'text-gray-400'
                }`}
              ></i>
              <span
                className={`text-[9px] font-bold mt-1 z-10 transition-all duration-300 ${
                  isActive ? item.color : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
