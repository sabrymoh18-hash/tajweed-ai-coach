import React from 'react';
import { useStore } from '../store/useStore';

export function Dashboard() {
  const { stats, setScreen } = useStore();

  const xpProgress = (stats.xp || 0) % 100;

  const MENUS = [
    { icon:'fa-radar', title:'رادار المخارج', s:'makharij' as const, c:'var(--green)', bg:'var(--green-pale)' },
    { icon:'fa-book-quran', title:'أحكام التجويد', s:'tajweed' as const, c:'var(--purple)', bg:'var(--purple-pale)' },
    { icon:'fa-scroll', title:'متن تحفة الأطفال', s:'tuhfa' as const, c:'#b07d10', bg:'#fef3c7' },
    { icon:'fa-lungs', title:'تنفس التلاوة', s:'breathwork' as const, c:'var(--gold)', bg:'var(--gold-pale)' },
    { icon:'fa-trophy', title:'لوحة الشرف', s:'leaderboard' as const, c:'var(--red)', bg:'var(--red-pale)' },
  ];

  return (
    <div className="screen-in max-w-md mx-auto">
      {/* Header Profile */}
      <div className="flex items-center gap-4 mb-8 pt-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-green-900 flex items-center justify-center shadow-lg border-2 border-green-100">
          <i className="fa-solid fa-user text-white text-xl"></i>
        </div>
        <div>
          <h1 className="text-2xl font-black mb-1">مرحباً بك 🌟</h1>
          <p className="text-sm opacity-80 font-medium">جاهز لرحلة التلاوة اليوم؟</p>
        </div>
      </div>

      {/* XP Level Bar */}
      <div className="card p-4 mb-6 relative overflow-hidden">
        <div className="flex justify-between items-end mb-2">
          <span className="font-bold text-sm">المستوى {stats.level}</span>
          <span className="text-xs opacity-70">{stats.xp || 0} XP</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden relative">
          <div className="bg-green-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${xpProgress}%` }}></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {[
          { label:'جلساتك', val:stats.sessions, icon:'fa-headphones', color:'var(--green)' },
          { label:'أفضل دقة', val:`${stats.bestScore}%`, icon:'fa-bullseye', color:'var(--gold)' },
          { label:'أيام متتالية', val:stats.streak, icon:'fa-fire', color:'var(--red)' },
          { label:'تمرين التنفس', val:stats.breathSessions, icon:'fa-wind', color:'var(--purple)' }
        ].map((s, i) => (
          <div key={i} className="card p-4 text-center relative overflow-hidden hover:-translate-y-1 transition-all duration-300">
            <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background:s.color, opacity:0.5 }}/>
            <i className={`fa-solid ${s.icon} text-2xl mb-2 opacity-80`} style={{ color:s.color }}></i>
            <div className="text-2xl font-black mb-1">{s.val}</div>
            <div className="text-xs font-bold opacity-60">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Action Cards */}
      <div className="space-y-3">
        <h3 className="font-bold mb-3 px-1">خطتك التدريبية</h3>
        {MENUS.map((m, i) => (
          <button 
            key={i} 
            onClick={() => setScreen(m.s)} 
            className="card p-5 text-right hover:-translate-y-2 transition-all duration-300 w-full group relative overflow-hidden flex items-center justify-between"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background:'linear-gradient(135deg,rgba(42,122,78,0.06),transparent)' }}/>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ background:m.bg, color:m.c }}>
                <i className={`fa-solid ${m.icon} text-xl`}></i>
              </div>
              <span className="font-black text-lg">{m.title}</span>
            </div>
            <i className="fa-solid fa-chevron-left opacity-30 group-hover:opacity-100 transition-opacity relative z-10"></i>
          </button>
        ))}
      </div>
    </div>
  );
}
