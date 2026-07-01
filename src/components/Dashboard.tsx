import React from 'react';
import { useStore } from '../store/useStore';

export function Dashboard() {
  const { stats, setScreen } = useStore();

  const xpProgress = (stats.xp || 0) % 100;

  const SKILL_TREE = [
    { id: 'makharij',      levelReq: 1, icon: 'fa-radar',       title: 'الأساس الصوتي (المخارج)', desc: 'تعلم مخارج الحروف الأساسية بدقة عبر الرادار الثلاثي الأبعاد.', c: 'var(--green)', bg: 'var(--green-pale)' },
    { id: 'breathwork',    levelReq: 2, icon: 'fa-lungs',       title: 'هندسة الهواء (التنفس)', desc: 'تحكم في نَفَسِك لإطالة التلاوة وإتقان الوقف والابتداء.', c: 'var(--gold)', bg: 'var(--gold-pale)' },
    { id: 'tajweed',       levelReq: 3, icon: 'fa-book-quran',  title: 'الأحكام (مستكشف التحفة)', desc: 'اكتشف أحكام النون والميم عبر أبيات تحفة الأطفال التفاعلية.', c: 'var(--purple)', bg: 'var(--purple-pale)' },
    { id: 'tuhfa',         levelReq: 3, icon: 'fa-scroll',      title: 'متن التحفة الشامل', desc: 'اقرأ متن تحفة الأطفال كاملاً كمرجع شامل لكل الأحكام.', c: 'var(--blue)', bg: 'var(--blue-pale)' },
    { id: 'golden_mirror', levelReq: 4, icon: 'fa-microphone-lines', title: 'المرآة الذهبية (AI)', desc: 'قارن نطقك بصوتك المستنسخ ذكياً بتجويد مثالي 100%.', c: '#b07d10', bg: '#fef3c7' },
    { id: 'tawatur',       levelReq: 5, icon: 'fa-globe',       title: 'تحديات التواتر (MMO)', desc: 'غرف تلاوة جماعية متزامنة لفتح أسرار الإجازات النادرة.', c: 'var(--red)', bg: 'var(--red-pale)' },
  ];

  return (
    <div className="screen-in max-w-3xl mx-auto pb-8">
      {/* Header Profile */}
      <div className="flex items-center gap-4 mb-8 pt-4 px-2">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-green-900 flex items-center justify-center shadow-lg border-2 border-green-100 relative">
          <i className="fa-solid fa-user text-white text-xl"></i>
          <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
            Lvl {stats.level}
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-black mb-1">مرحباً بك 🌟</h1>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 overflow-hidden relative mt-2">
            <div className="bg-green-600 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${xpProgress}%` }}></div>
          </div>
          <p className="text-[10px] text-gray-500 mt-1 font-bold">{100 - xpProgress} XP للمستوى التالي</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-8 px-2">
        {[
          { label:'جلساتك', val:stats.sessions, icon:'fa-headphones', color:'var(--green)' },
          { label:'أيام متتالية', val:stats.streak, icon:'fa-fire', color:'var(--red)' },
          { label:'إجمالي XP', val:stats.xp || 0, icon:'fa-star', color:'var(--gold)' }
        ].map((s, i) => (
          <div key={i} className="card p-3 text-center relative overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background:s.color, opacity:0.5 }}/>
            <i className={`fa-solid ${s.icon} text-lg mb-1 opacity-80`} style={{ color:s.color }}></i>
            <div className="text-xl font-black mb-0.5 leading-none">{s.val}</div>
            <div className="text-[9px] font-bold opacity-60">{s.label}</div>
          </div>
        ))}
      </div>

      {/* The Skill Tree */}
      <div className="px-2">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <i className="fa-solid fa-network-wired text-green-600"></i>
          شجرة المهارات (المسار التعليمي)
        </h3>
        
        <div className="relative pr-4 space-y-6 before:absolute before:inset-0 before:mr-10 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
          {SKILL_TREE.map((node, i) => {
            const isUnlocked = stats.level >= node.levelReq;
            
            return (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Connector Line */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors duration-300 ${isUnlocked ? 'bg-green-500' : 'bg-gray-300'}`}>
                  {isUnlocked ? <i className="fa-solid fa-check text-white text-sm"></i> : <i className="fa-solid fa-lock text-white text-sm"></i>}
                </div>
                
                {/* Node Card */}
                <button 
                  onClick={() => isUnlocked && setScreen(node.id as any)}
                  disabled={!isUnlocked}
                  className={`card w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 text-right transition-all duration-300 ${isUnlocked ? 'hover:-translate-y-1 hover:shadow-lg cursor-pointer' : 'opacity-60 cursor-not-allowed grayscale'}`}
                  style={{ borderColor: isUnlocked ? node.c : 'transparent' }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner" style={{ background: isUnlocked ? node.bg : '#eee', color: isUnlocked ? node.c : '#999' }}>
                      <i className={`fa-solid ${node.icon}`}></i>
                    </div>
                    <div>
                      <span className="font-black text-md block leading-none mb-1">{node.title}</span>
                      {!isUnlocked && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">يتطلب المستوى {node.levelReq}</span>}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">{node.desc}</p>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
