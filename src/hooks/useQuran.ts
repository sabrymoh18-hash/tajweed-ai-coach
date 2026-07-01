import { useState, useEffect } from 'react';
import { AYAHS } from '../data/constants';

export interface Ayah {
  text: string;
  name: string;
  level: string;
  badge: string;
  audioUrl?: string;
}

export function useQuran() {
  const [ayahs, setAyahs] = useState<Ayah[]>(AYAHS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // We can expand this later to fetch from api.alquran.cloud 
  // For now, we simulate fetching extended ayahs if the user wants to practice more.
  
  const fetchRandomAyahs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call to alquran.cloud
      // Random page from 1 to 604
      const page = Math.floor(Math.random() * 604) + 1;
      const res = await fetch(`https://api.alquran.cloud/v1/page/${page}/ar.alafasy`);
      const data = await res.json();
      
      if (data.code === 200 && data.data.ayahs.length > 0) {
        // Grab top 3 ayahs from the page
        const newAyahs = data.data.ayahs.slice(0, 3).map((a: any) => ({
          text: a.text,
          name: `سورة ${data.data.surahs[Object.keys(data.data.surahs)[0]].name} — آية ${a.numberInSurah}`,
          level: a.text.length > 100 ? 'متقدم' : 'متوسط',
          badge: a.text.length > 100 ? 'badge-purple' : 'badge-green',
          audioUrl: a.audio
        }));
        setAyahs([...AYAHS, ...newAyahs]);
      }
    } catch (err) {
      console.error('Failed to fetch ayahs', err);
      setError('تعذر جلب آيات جديدة، يرجى التحقق من الاتصال.');
    } finally {
      setLoading(false);
    }
  };

  return { ayahs, fetchRandomAyahs, loading, error };
}
