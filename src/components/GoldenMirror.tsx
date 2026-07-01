import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Waveform } from './ui/Waveform';

export function GoldenMirror() {
  const { setScreen } = useStore();
  const [recording, setRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // Mock audio data for the "Perfect AI Waveform"
  const perfectBars = Array.from({ length: 40 }, () => Math.random() * 80 + 20);
  const [userBars, setUserBars] = useState<number[]>(Array(40).fill(10));

  useEffect(() => {
    let interval: any;
    if (recording) {
      interval = setInterval(() => {
        setUserBars(prev => {
          const newBars = [...prev.slice(1), Math.random() * 80 + 10];
          return newBars;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [recording]);

  const handleRecord = () => {
    if (recording) {
      setRecording(false);
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        setScore(Math.floor(Math.random() * 20) + 80); // random score 80-100
      }, 2000);
    } else {
      setScore(null);
      setRecording(true);
      setUserBars(Array(40).fill(10));
    }
  };

  return (
    <div className="screen-in max-w-2xl mx-auto pt-6 px-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setScreen('dashboard')} className="btn-outline px-4 py-2 text-sm flex items-center gap-2">
          <i className="fa-solid fa-arrow-right"></i> العودة
        </button>
        <div>
          <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-700">المرآة الذهبية ✨</h2>
          <p className="text-[10px] text-gray-500 font-bold">استنسخ صوتك المثالي وقارن</p>
        </div>
      </div>

      <div className="card p-6 mb-6 text-center border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-50/50 to-transparent">
        <h3 className="font-bold mb-2">الآية المحددة للتحدي:</h3>
        <p className="font-serif text-2xl font-black leading-loose text-gray-800 bg-white p-4 rounded-xl shadow-inner border border-gray-100">
          وَالضُّحَىٰ ۝ وَاللَّيْلِ إِذَا سَجَىٰ
        </p>
      </div>

      <div className="space-y-6 mb-8 relative">
        {/* The Connection Line */}
        <div className="absolute left-1/2 top-10 bottom-10 w-0.5 bg-gray-200 -translate-x-1/2 z-0"></div>

        {/* Perfect Waveform (The Mirror) */}
        <div className="card p-4 relative z-10 bg-[#fef3c7] border-2 border-yellow-400/50 shadow-lg shadow-yellow-500/10">
          <div className="flex justify-between items-center mb-2 px-2">
            <span className="text-xs font-black text-yellow-800 uppercase tracking-widest"><i className="fa-solid fa-robot mr-1"></i> التجويد المثالي (صوتك المستنسخ)</span>
            <button className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md">
              <i className="fa-solid fa-play text-xs"></i>
            </button>
          </div>
          <div className="h-20 bg-white/50 rounded-xl flex items-end gap-1 px-2 py-4">
            {perfectBars.map((h, i) => (
              <div key={i} className="flex-1 bg-yellow-500 rounded-full transition-all duration-300" style={{ height: `${h}%`, opacity: 0.8 }} />
            ))}
          </div>
        </div>

        {/* User Waveform */}
        <div className="card p-4 relative z-10 border-2 border-blue-400/50 shadow-lg shadow-blue-500/10" style={{ background: recording ? '#eff6ff' : '#fff' }}>
          <div className="flex justify-between items-center mb-2 px-2">
            <span className="text-xs font-black text-blue-800 uppercase tracking-widest"><i className="fa-solid fa-user mr-1"></i> قراءتك المباشرة</span>
            <div className={`w-3 h-3 rounded-full ${recording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
          </div>
          <div className="h-20 bg-black/5 rounded-xl flex items-end gap-1 px-2 py-4 overflow-hidden relative">
            {analyzing && (
              <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[1px] flex items-center justify-center z-20">
                <span className="font-bold text-blue-700 animate-pulse"><i className="fa-solid fa-microchip mr-2"></i> جاري التطابق...</span>
              </div>
            )}
            {userBars.map((h, i) => (
              <div key={i} className="flex-1 bg-blue-500 rounded-full transition-all duration-100" style={{ height: `${h}%`, opacity: recording ? 0.8 : 0.3 }} />
            ))}
          </div>
        </div>
      </div>

      {score !== null && (
        <div className="card p-6 text-center animate-in zoom-in slide-in-from-bottom-4 duration-500 mb-6 border-2 border-green-500 bg-green-50">
          <div className="text-5xl font-black text-green-600 mb-2">{score}%</div>
          <div className="font-bold text-gray-700">نسبة التطابق مع المرآة الذهبية!</div>
          <p className="text-xs text-gray-500 mt-2">حصلت على +{score} XP</p>
        </div>
      )}

      <button 
        onClick={handleRecord}
        disabled={analyzing}
        className={`w-full py-4 rounded-2xl font-black text-white text-lg transition-all duration-300 shadow-xl flex items-center justify-center gap-3 ${recording ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02]'}`}
      >
        {recording ? (
          <><i className="fa-solid fa-stop"></i> إيقاف والمطابقة</>
        ) : (
          <><i className="fa-solid fa-microphone"></i> ابدأ المحاكاة</>
        )}
      </button>

    </div>
  );
}
