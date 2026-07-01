import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function Feedback() {
  const { setScreen, lastFeedback, stats, setStats } = useStore();

  useEffect(() => {
    if (lastFeedback) {
      setStats((prev) => {
        const best = Math.max(prev.bestScore, lastFeedback.score);
        return { ...prev, bestScore: best, sessions: prev.sessions + 1 };
      });
    }
  }, [lastFeedback, setStats]);

  if (!lastFeedback) {
    return (
      <div className="screen-in max-w-lg mx-auto text-center pt-10">
        <p>لا يوجد تقييم حالي. قم بتسجيل تلاوتك أولاً!</p>
        <button onClick={() => setScreen('dashboard')} className="btn-primary mt-4 px-6 py-2">العودة</button>
      </div>
    );
  }

  const { score, tips } = lastFeedback;
  const isExcellent = score >= 90;

  return (
    <div className="screen-in max-w-lg mx-auto pt-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setScreen('dashboard')} className="btn-outline px-4 py-2 text-sm flex items-center gap-2"><i className="fa-solid fa-arrow-right"></i> الرئيسية</button>
        <div><h2 className="text-xl font-black">التحليل الذكي (AI) 🤖</h2></div>
      </div>

      <div className="card p-8 text-center mb-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ background: isExcellent ? 'var(--green)' : 'var(--gold)' }}></div>
        <div className="relative z-10">
          <div className="text-8xl font-black drop-shadow-md mb-2" style={{ color: isExcellent ? 'var(--green)' : 'var(--gold)', fontFamily:'serif' }}>
            {score}<span className="text-4xl">%</span>
          </div>
          <div className="font-bold text-xl mb-4">
            {isExcellent ? 'تلاوة ممتازة ومخارج متقنة! 🌟' : 'أداء جيد، يحتاج لمزيد من التدريب 💪'}
          </div>
        </div>
      </div>

      <h3 className="font-bold mb-4 px-2 text-lg">تقرير المقرئ الذكي:</h3>
      <div className="space-y-3">
        {tips.map((tip, i) => (
          <div key={i} className="card p-4 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background:'var(--green-pale)', color:'var(--green)' }}>
              <i className="fa-solid fa-check"></i>
            </div>
            <div>
              <p className="text-sm font-semibold leading-relaxed">{tip}</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setScreen('makharij')} className="btn-primary w-full py-4 mt-8 text-lg font-bold shadow-lg hover:scale-[1.02] transition-all">
        <i className="fa-solid fa-rotate-right ml-2"></i> تدرب مرة أخرى
      </button>
    </div>
  );
}
