import { useState, useRef, useEffect, useCallback } from 'react';

export function useAudio() {
  const [active, setActive] = useState(false);
  const [bars, setBars] = useState<number[]>(Array(20).fill(5));
  const [permitted, setPermitted] = useState<boolean | null>(null);
  
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const reqRef = useRef<number | null>(null);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setPermitted(true);
      setActive(true);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextCtor();
      audioCtxRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const update = () => {
        analyser.getByteFrequencyData(dataArray);
        const newBars = Array.from(dataArray).slice(0, 20).map(v => Math.max(5, (v / 255) * 100));
        setBars(newBars);
        reqRef.current = requestAnimationFrame(update);
      };
      update();
    } catch (e) {
      console.error(e);
      setPermitted(false);
      setActive(false);
    }
  };

  const stop = useCallback(() => {
    setActive(false);
    setBars(Array(20).fill(5));
    if (reqRef.current) cancelAnimationFrame(reqRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  }, []);

  // Cleanup to fix Memory/Mic Leak
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { active, bars, permitted, start, stop };
}
