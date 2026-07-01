import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Screen = 'dashboard' | 'makharij' | 'breathwork' | 'tajweed' | 'feedback' | 'leaderboard' | 'tuhfa';

export interface Stats {
  sessions: number;
  bestScore: number;
  breathSessions: number;
  streak: number;
  lastVisit: string;
  visitedTajweed: boolean;
  unlockedBadges: string[];
  xp: number;
  level: number;
}

export const INIT_STATS: Stats = {
  sessions: 0,
  bestScore: 0,
  breathSessions: 0,
  streak: 0,
  lastVisit: '',
  visitedTajweed: false,
  unlockedBadges: [],
  xp: 0,
  level: 1,
};

interface AppState {
  // Global View State
  screen: Screen;
  setScreen: (screen: Screen) => void;
  
  // App State
  stats: Stats;
  setStats: (updater: (prev: Stats) => Stats) => void;
  addXP: (points: number) => void;

  // Feedback/Session State
  lastFeedback: { score: number; tips: string[] } | null;
  setLastFeedback: (feedback: { score: number; tips: string[] } | null) => void;

  // Audio / Mic Global Permission
  micPermitted: boolean | null;
  setMicPermitted: (permitted: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      screen: 'dashboard',
      setScreen: (screen) => set({ screen }),
      
      stats: INIT_STATS,
      setStats: (updater) => set((state) => ({ stats: updater(state.stats) })),
      
      addXP: (points) => set((state) => {
        const newXp = (state.stats.xp || 0) + points;
        const newLevel = Math.floor(newXp / 100) + 1;
        return {
          stats: {
            ...state.stats,
            xp: newXp,
            level: newLevel,
          }
        };
      }),

      lastFeedback: null,
      setLastFeedback: (lastFeedback) => set({ lastFeedback }),

      micPermitted: null,
      setMicPermitted: (micPermitted) => set({ micPermitted }),
    }),
    {
      name: 'tajweed-storage',
      partialize: (state) => ({ stats: state.stats }), // Only persist stats
    }
  )
);
