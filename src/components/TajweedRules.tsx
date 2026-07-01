import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { TAJWEED_CATS } from '../data/constants';

export function TajweedRules() {
  const { setScreen } = useStore();
  const [openCat, setOpenCat] = useState<string | null>('noon'); // Open Noon by default to show Tuhfa
  const [activeRule, setActiveRule] = useState<number | null>(null);

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ar-SA';
    u.rate = 0.65;
    u.pitch = 0.9; // Deeper pitch for poetry
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="screen-in max-w-2xl mx-auto pt-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setScreen('dashboard')} className="btn-outline px-4 py-2 text-sm flex items-center gap-2"><i className="fa-solid fa-arrow-right"></i> العودة</button>
        <div><h2 className="text-xl font-black">مستكشف التحفة 📜</h2></div>
      </div>

      <div className="card p-5 mb-6 text-center" style={{ background: 'linear-gradient(135deg, #0f2d1a, #1a3a28)', border: '1px solid rgba(42,122,78,0.4)' }}>
        <i className="fa-solid fa-feather-pointed text-3xl mb-3" style={{ color: 'var(--gold)' }}></i>
        <h3 className="text-lg font-bold text-white mb-1">منظومة تحفة الأطفال</h3>
        <p className="text-sm text-green-200/80">اكتشف أحكام التجويد بأسلوب شعري أصيل يسهل حفظه</p>
      </div>

      <div className="space-y-4 pb-8">
        {TAJWEED_CATS.map((cat) => (
          <div key={cat.id} className="card overflow-hidden transition-all duration-300" style={{ border: openCat === cat.id ? `2px solid ${cat.color}` : `1px solid var(--border)` }}>
            <button onClick={() => setOpenCat(openCat === cat.id ? null : cat.id)} className="w-full flex items-center justify-between p-5 text-right hover:bg-black/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg" style={{ background: cat.bg, color: cat.color }}>
                  {cat.icon}
                </div>
                <span className="font-bold text-lg">{cat.title}</span>
              </div>
              <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${openCat === cat.id ? 'rotate-180' : ''}`}></i>
            </button>
            
            {openCat === cat.id && (
              <div className="p-5 border-t border-black/5 bg-white/50 space-y-6">
                {cat.rules.map((r, i) => {
                  const rule = r as any;
                  return (
                  <div key={i} className="relative transition-all duration-500">
                    
                    {/* The Tuhfa Verse Card */}
                    {rule.tuhfa ? (
                      <div 
                        onClick={() => setActiveRule(activeRule === i ? null : i)}
                        className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 border-2 ${activeRule === i ? 'shadow-lg scale-[1.02]' : 'hover:scale-[1.01] hover:shadow-md'}`}
                        style={{ borderColor: activeRule === i ? cat.color : 'transparent', background: activeRule === i ? cat.bg : '#fff', boxShadow: activeRule === i ? `0 10px 30px ${cat.color}20` : '0 2px 10px rgba(0,0,0,0.05)' }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="badge text-xs font-bold" style={{ background: '#fff', color: cat.color, border: `1px solid ${cat.color}40` }}>{rule.name}</span>
                          <button onClick={(e) => { e.stopPropagation(); speak(rule.tuhfa as string); }} className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform" style={{ background: cat.color }}>
                            <i className="fa-solid fa-play text-xs"></i>
                          </button>
                        </div>
                        
                        <div className="text-center font-serif font-bold text-lg leading-loose whitespace-pre-wrap text-gray-800 drop-shadow-sm" style={{ lineHeight: '2.5' }}>
                          {rule.tuhfa}
                        </div>
                      </div>
                    ) : (
                      // Fallback for non-tuhfa rules
                      <div onClick={() => setActiveRule(activeRule === i ? null : i)} className="cursor-pointer border-b pb-4">
                        <h4 className="font-bold mb-1" style={{ color: cat.color }}>{rule.name}</h4>
                      </div>
                    )}

                    {/* Expandable Explanation */}
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeRule === i ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                      <div className="pl-4 border-r-4 py-2" style={{ borderColor: cat.color }}>
                        <p className="text-sm mb-4 leading-relaxed font-medium opacity-90">{rule.def}</p>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-black/5 rounded-xl p-3">
                            <span className="text-[10px] uppercase font-bold opacity-50 block mb-2">الحروف</span>
                            <div className="flex flex-wrap gap-1.5">
                              {rule.letters.map((l: string, li: number) => <span key={li} className="w-7 h-7 flex items-center justify-center rounded bg-white shadow-sm font-bold text-sm text-gray-700">{l}</span>)}
                            </div>
                          </div>
                          <div className="bg-black/5 rounded-xl p-3 flex flex-col justify-between">
                            <span className="text-[10px] uppercase font-bold opacity-50 block mb-1">مثال تطبيقي</span>
                            <div className="flex items-center justify-between">
                              <span className="font-serif font-black text-xl text-gray-800">{rule.ex}</span>
                              <button onClick={(e) => { e.stopPropagation(); speak(rule.ex); }} className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 hover:text-green-600 transition-colors">
                                <i className="fa-solid fa-volume-high text-[10px]"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        {rule.note && (
                          <div className="mt-3 bg-yellow-50/50 rounded-lg p-2.5 text-xs font-bold flex items-center gap-2 text-yellow-800 border border-yellow-200/50">
                            <i className="fa-solid fa-lightbulb text-yellow-500 text-sm"></i> 
                            {rule.note}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                )})}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
