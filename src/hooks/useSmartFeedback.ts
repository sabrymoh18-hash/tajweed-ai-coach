import { FEEDBACK, Letter } from '../data/constants';

export function useSmartFeedback() {
  const generateFeedback = (
    bars: number[], 
    duration: number, 
    letter?: Letter | null
  ) => {
    // 1. Calculate Voice Stability (variance in wave forms)
    const activeBars = bars.filter(b => b > 10);
    const avgVol = activeBars.length > 0 ? activeBars.reduce((a, b) => a + b, 0) / activeBars.length : 0;
    
    // 2. Base score logic
    let score = 0;
    const tips: string[] = [];

    if (activeBars.length === 0 || avgVol < 15) {
      score = Math.floor(Math.random() * 20) + 30; // Very low
      tips.push("الصوت كان منخفضاً جداً أو لم يتم التقاطه بوضوح. حاول الاقتراب من الميكروفون.");
    } else {
      // Simulate realistic AI assessment based on volume and duration
      const stabilityScore = Math.min(100, avgVol * 1.5);
      const durationScore = Math.min(100, duration > 2000 ? 95 : duration > 1000 ? 80 : 60);
      score = Math.floor((stabilityScore * 0.4) + (durationScore * 0.6));
      
      // Randomize slightly for human feel
      score += Math.floor(Math.random() * 10) - 5; 
      score = Math.max(0, Math.min(100, score));

      if (score >= 90) {
        tips.push(FEEDBACK[0].body); // Excellent continuity
      } else if (score >= 75) {
        tips.push(FEEDBACK[3].body); // Good, watch pitch
      } else {
        tips.push(FEEDBACK[1].body); // Diaphragm issue
      }
    }

    // 3. Contextual advice based on letter if provided
    if (letter) {
      if (['ق', 'ط', 'ب', 'ج', 'د'].includes(letter.letter)) {
        tips.push(`لاحظنا التدرب على حرف القلقلة (${letter.letter}). تذكر أن تعطيه نبرة انفجارية واضحة خاصة عند الوقف.`);
      } else if (letter.zone === 'nasal') {
        tips.push(`أثناء نطق حرف الغنة (${letter.letter})، تأكد من توجيه جزء من الهواء نحو الخيشوم لزمن حركتين.`);
      } else if (letter.zone === 'throat_high') {
        tips.push(`مخرج (${letter.letter}) يحتاج لاحتكاك خفيف في أقصى الحلق دون مبالغة في الخشونة.`);
      }
    }

    // Default generic advice if tips array is too small
    if (tips.length < 2 && score > 50) {
      tips.push(FEEDBACK[4].body);
    }

    return { score, tips };
  };

  return { generateFeedback };
}
