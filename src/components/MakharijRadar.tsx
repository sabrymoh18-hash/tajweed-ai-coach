import React, { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { useAudio } from '../hooks/useAudio';
import { useSmartFeedback } from '../hooks/useSmartFeedback';
import { ZONES, ALL_LETTERS, Letter } from '../data/constants';
import { Waveform } from './ui/Waveform';
import { VocalTract3D } from './VocalTract3D';

export function MakharijRadar() {
  const { setScreen, addXP, setLastFeedback, micPermitted } = useStore();
  const { active, bars, permitted, start, stop } = useAudio();
  const { generateFeedback } = useSmartFeedback();
  
  const [selLetter, setSelLetter] = useState<Letter>(ALL_LETTERS[0]);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const zone = ZONES[selLetter.zone];

  // Helper for polar coordinates
  const getPolar = (l: Letter, i: number) => {
    const rMap:Record<string,number> = { jawf:15, throat_low:30, throat_mid:40, throat_high:50, tongue_q:65, tongue_k:70, tongue_mid:75, tongue_side:80, tongue_tip:85, tongue_gum:90, tongue_btw:95, tongue_edge:98, lips_f:100, lips:100, nasal:100 };
    const r = rMap[l.zone] || 50;
    const a = (i * (360 / 28)) * (Math.PI / 180);
    const x = 50 + (r/2) * Math.cos(a);
    const y = 50 + (r/2) * Math.sin(a);
    return { x, y };
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleStartMic = async () => {
    await start();
    setSessionStartTime(Date.now());
  };

  const handleStopMic = () => {
    stop();
  };

  const speak = (text: string) => {
    // Stop any currently playing MP3
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // 1. Attempt to play real recorded MP3 first
    const audio = new Audio(`/audio/${text}.mp3`);
    audioRef.current = audio;
    
    audio.play().then(() => {
      // Success! MP3 is playing.
      addXP(10);
      showToast('اكتسبت +10 XP للاستماع!');
    }).catch(() => {
      // 2. Fallback to Browser TTS if MP3 is missing
      if (!window.speechSynthesis) {
        showToast('متصفحك لا يدعم تشغيل الصوت');
        return;
      }
      window.speechSynthesis.cancel();
      
      const doSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        const arabicVoice = voices.find(v =>
          v.lang.startsWith('ar') ||
          v.name.toLowerCase().includes('arabic') ||
          v.name.toLowerCase().includes('majed') ||
          v.name.toLowerCase().includes('tarik')
        );
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'ar-SA';
        u.rate = 0.6;
        if (arabicVoice) u.voice = arabicVoice;
        window.speechSynthesis.speak(u);
      };
      
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => { doSpeak(); window.speechSynthesis.onvoiceschanged = null; };
      } else {
        doSpeak();
      }
      
      addXP(10);
      showToast('اكتسبت +10 XP للاستماع! (صوت آلي)');
    });
  };

  const handleGenFeedback = () => {
    const duration = Date.now() - sessionStartTime;
    stop();
    const feedback = generateFeedback(bars, duration, selLetter);
    setLastFeedback(feedback);
    addXP(50);
    setScreen('feedback');
  };

  return (
    <div className="screen-in max-w-5xl mx-auto">
      <div className="glass p-5 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => { stop(); setScreen('dashboard'); }} className="btn-outline px-4 py-2 text-sm flex items-center gap-2">
            <i className="fa-solid fa-arrow-right"></i> العودة
          </button>
          <div>
            <h2 className="text-lg font-black">رادار المخارج 📡</h2>
            <p className="text-xs" style={{ color:'var(--muted)' }}>المركز للحلق، والأطراف للشفتين</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Radar Container */}
          <div className="radar-container bg-black/20">
            <div className="radar-sweep"></div>
            {ALL_LETTERS.map((l, i) => {
              const pos = getPolar(l, i);
              const isActive = selLetter.letter === l.letter;
              const lZone = ZONES[l.zone];
              return (
                <button key={i} onClick={() => setSelLetter(l)}
                  className={`radar-blip ${isActive ? 'active' : ''}`}
                  style={{
                    left: `${pos.x}%`, top: `${pos.y}%`,
                    background: isActive ? lZone.bg : 'var(--bg)',
                    borderColor: isActive ? lZone.color : 'var(--border)',
                    color: isActive ? lZone.color : 'var(--text)',
                    borderWidth: isActive ? 2 : 1,
                    borderStyle: 'solid'
                  }}>
                  {l.letter}
                </button>
              );
            })}
          </div>

          {/* Info Panel & 3D */}
          <div className="space-y-4">
            
            {/* 3D Visualization */}
            <div className="h-[250px] w-full rounded-3xl overflow-hidden shadow-2xl border-2" style={{ borderColor: zone.border }}>
              <VocalTract3D color={zone.color} active={active} />
            </div>

            <div className="card p-6 text-center shadow-lg relative overflow-hidden" style={{ borderColor:zone.border, background:zone.bg }}>
              <div className="absolute inset-0 opacity-20" style={{ background:`radial-gradient(circle at center, ${zone.color}, transparent 70%)` }}></div>
              <div className="relative z-10">
                <div className="text-7xl font-black mb-3 drop-shadow-lg" style={{ color:zone.color, fontFamily:'serif', lineHeight:1 }}>{selLetter.letter}</div>
                <div className="font-bold text-lg mb-1">{selLetter.name}</div>
                <span className="badge text-xs mb-4" style={{ background:'#fff', color:zone.color, borderColor:zone.border }}>{zone.name}</span>
                <p className="text-sm leading-relaxed" style={{ color:'var(--text2)' }}>{selLetter.tip}</p>
                <button onClick={() => speak(selLetter.listen)} className="btn-primary mt-4 px-5 py-2.5 text-sm flex items-center justify-center gap-2 mx-auto shadow-lg hover:scale-105 transition-all"
                  style={{ background:zone.color, color:'#fff' }}>
                  <i className="fa-solid fa-headphones text-lg"></i> استمع للنطق الصحيح
                </button>
              </div>
            </div>

            {/* Mic Analysis */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold">المقرئ الذكي (AI)</span>
                <span className="badge text-xs" style={{ background:active?'#fee2e2':'var(--bg)', color:active?'var(--red)':'var(--muted)', borderColor:active?'rgba(185,28,28,.2)':'var(--border)' }}>
                  {active ? '● يستمع للتحليل' : 'الميكروفون متوقف'}
                </span>
              </div>
              
              <Waveform bars={bars} active={active} />
              
              {(permitted === false || micPermitted === false) && <p className="text-xs text-center mt-2" style={{ color:'var(--red)' }}>يرجى السماح بالميكروفون في المتصفح</p>}
              
              <div className="flex gap-2 mt-4">
                {!active ? (
                  <button onClick={handleStartMic} className="flex-1 btn-primary py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-1">
                    <i className="fa-solid fa-microphone"></i> ابدأ التلاوة
                  </button>
                ) : (
                  <>
                    <button onClick={handleStopMic} className="flex-1 py-3 rounded-xl text-sm font-bold border flex items-center justify-center gap-2 hover:bg-red-50/10 transition-all" style={{ borderColor:'rgba(185,28,28,.25)', color:'var(--red)', background:'transparent' }}>
                      <i className="fa-solid fa-stop"></i> إيقاف
                    </button>
                    <button onClick={handleGenFeedback} className="flex-1 btn-primary py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 hover:-translate-y-1 transition-all">
                      <i className="fa-solid fa-wand-magic-sparkles"></i> تحليل ذكي
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast popup internal to Makharij Radar */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in">
          <div className="px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3" style={{ background:'linear-gradient(135deg, #0f2d1a, #1a3a28)', border:'1.5px solid rgba(42,122,78,0.4)' }}>
            <span className="text-sm font-semibold" style={{ color:'#e2f4ea' }}>{toastMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
