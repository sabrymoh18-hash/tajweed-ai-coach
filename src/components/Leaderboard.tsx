import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

interface LeaderboardUser {
  id: string;
  name: string;
  xp: number;
  level: number;
  avatar: string;
  isCurrentUser?: boolean;
}

const GHOST_USERS: LeaderboardUser[] = [
  { id: '1', name: 'أحمد محمود', xp: 2450, level: 25, avatar: '👨' },
  { id: '2', name: 'فاطمة علي', xp: 2120, level: 22, avatar: '🧕' },
  { id: '3', name: 'عمر خالد', xp: 1890, level: 19, avatar: '🧔' },
  { id: '4', name: 'سارة يوسف', xp: 1540, level: 16, avatar: '👩' },
  { id: '5', name: 'طارق زياد', xp: 1200, level: 13, avatar: '👨‍🦱' },
];

export function Leaderboard() {
  const { setScreen, stats } = useStore();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    const currentUser: LeaderboardUser = {
      id: 'me',
      name: 'أنت (البطل)',
      xp: stats.xp || 0,
      level: stats.level || 1,
      avatar: '🌟',
      isCurrentUser: true,
    };
    
    const combined = [...GHOST_USERS, currentUser].sort((a, b) => b.xp - a.xp);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUsers(combined);
  }, [stats]);

  return (
    <div className="screen-in max-w-lg mx-auto pt-6">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => setScreen('dashboard')} className="btn-outline px-4 py-2 text-sm flex items-center gap-2"><i className="fa-solid fa-arrow-right"></i> العودة</button>
        <div><h2 className="text-xl font-black">لوحة الشرف 🏆</h2></div>
      </div>

      <div className="card p-6 text-center mb-8" style={{ background: 'linear-gradient(135deg, #1f2937, #111827)' }}>
        <i className="fa-solid fa-crown text-4xl text-yellow-500 mb-3 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"></i>
        <h3 className="text-white font-bold text-lg mb-1">تنافس مع القراء حول العالم!</h3>
        <p className="text-gray-400 text-sm">استمر في التلاوة لزيادة الـ XP الخاص بك وتسلق الترتيب.</p>
      </div>

      <div className="space-y-3">
        {users.map((u, i) => (
          <div 
            key={u.id} 
            className={`card p-4 flex items-center gap-4 transition-all duration-300 ${u.isCurrentUser ? 'scale-105 shadow-lg border-green-500 z-10 relative' : ''}`}
            style={u.isCurrentUser ? { background: 'var(--green-pale)', borderWidth: '2px' } : {}}
          >
            <div className="font-black text-xl w-8 text-center" style={{ color: i===0 ? '#eab308' : i===1 ? '#94a3b8' : i===2 ? '#b45309' : 'var(--text2)' }}>
              #{i + 1}
            </div>
            
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner bg-black/5">
              {u.avatar}
            </div>
            
            <div className="flex-1">
              <h4 className="font-bold text-lg">{u.name}</h4>
              <p className="text-xs opacity-70">المستوى {u.level}</p>
            </div>
            
            <div className="text-right">
              <div className="font-black text-lg text-green-600">{u.xp}</div>
              <div className="text-xs font-bold opacity-50">XP</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
