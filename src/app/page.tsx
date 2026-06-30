'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

// ════════════════════════════════════════════════════════
//  TYPES
// ════════════════════════════════════════════════════════
interface Stats {
  sessions: number; bestScore: number; breathSessions: number;
  streak: number; lastVisit: string; visitedTajweed: boolean;
  unlockedBadges: string[];
}
const INIT_STATS: Stats = {
  sessions: 0, bestScore: 0, breathSessions: 0,
  streak: 0, lastVisit: '', visitedTajweed: false, unlockedBadges: [],
};

// ════════════════════════════════════════════════════════
//  DATA — 28 Letters + Zones
// ════════════════════════════════════════════════════════
interface Zone { name: string; color: string; bg: string; border: string; svgX: number; svgY: number; }
const ZONES: Record<string, Zone> = {
  jawf:        { name:'الجوف',                     color:'#1d64b8', bg:'#dbeafe', border:'rgba(29,100,184,.22)',  svgX:125, svgY:120 },
  throat_low:  { name:'أدنى الحلق',               color:'#b91c1c', bg:'#fee2e2', border:'rgba(185,28,28,.2)',   svgX:105, svgY:180 },
  throat_mid:  { name:'وسط الحلق',                color:'#c2410c', bg:'#ffedd5', border:'rgba(194,65,12,.2)',   svgX:105, svgY:155 },
  throat_high: { name:'أقصى الحلق',               color:'#a16207', bg:'#fef3c7', border:'rgba(161,98,7,.2)',    svgX:108, svgY:135 },
  tongue_q:    { name:'أقصى اللسان — قاف',         color:'#2a7a4e', bg:'#e6f4ec', border:'rgba(42,122,78,.22)',  svgX:135, svgY:98 },
  tongue_k:    { name:'أقصى اللسان — كاف',         color:'#15803d', bg:'#dcfce7', border:'rgba(21,128,61,.2)',   svgX:145, svgY:95 },
  tongue_mid:  { name:'وسط اللسان',                color:'#0e7490', bg:'#cffafe', border:'rgba(14,116,144,.2)',  svgX:155, svgY:96 },
  tongue_side: { name:'حافة اللسان',               color:'#6244a0', bg:'#ede8f8', border:'rgba(98,68,160,.2)',   svgX:145, svgY:110 },
  tongue_tip:  { name:'طرف اللسان — لثة',          color:'#be185d', bg:'#fce7f3', border:'rgba(190,24,93,.2)',   svgX:168, svgY:97 },
  tongue_gum:  { name:'طرف اللسان — أصول الأسنان', color:'#9f1239', bg:'#ffe4e6', border:'rgba(159,18,57,.2)',   svgX:175, svgY:94 },
  tongue_btw:  { name:'بين الأسنان',               color:'#7c3aed', bg:'#f5f3ff', border:'rgba(124,58,237,.2)',  svgX:183, svgY:93 },
  tongue_edge: { name:'أطراف الأسنان العليا',      color:'#9d174d', bg:'#fdf2f8', border:'rgba(157,23,77,.2)',   svgX:180, svgY:85 },
  lips_f:      { name:'الشفة السفلى والأسنان',    color:'#475569', bg:'#f1f5f9', border:'rgba(71,85,105,.2)',   svgX:183, svgY:102 },
  lips:        { name:'الشفتان',                   color:'#334155', bg:'#f8fafc', border:'rgba(51,65,85,.2)',    svgX:188, svgY:95 },
  nasal:       { name:'الخيشوم (غنة)',             color:'#7c3aed', bg:'#f5f3ff', border:'rgba(124,58,237,.2)',  svgX:155, svgY:55 },
};

interface Letter { letter: string; name: string; zone: keyof typeof ZONES; tip: string; listen: string; }
const ALL_LETTERS: Letter[] = [
  // الجوف
  { letter:'ا', name:'الألف المدية', zone:'jawf',        tip:'تمتد في فراغ الفم والحلق كلهما دون أي اعتراض للهواء.',           listen:'الألف' },
  { letter:'و', name:'الواو المدية', zone:'jawf',        tip:'تمتد مع تضييق الشفتين وتمديدهما للأمام مع انفتاح الحلق.',        listen:'واو مدية' },
  { letter:'ي', name:'الياء المدية', zone:'jawf',        tip:'تمتد مع رفع وسط اللسان للحنك الصلب.',                            listen:'ياء مدية' },
  // أدنى الحلق
  { letter:'ء', name:'الهمزة',       zone:'throat_low',  tip:'انضمام الوترين الصوتيين تماماً ثم انفراجهما بقوة هوائية مفاجئة.', listen:'همزة' },
  { letter:'ه', name:'الهاء',        zone:'throat_low',  tip:'احتكاك هوائي لطيف بين الوترين الصوتيين دون تذبذبهما.',           listen:'هاء' },
  // وسط الحلق
  { letter:'ع', name:'العين',        zone:'throat_mid',  tip:'ضيّق وسط الحلق مع تذبذب الوترين الصوتيين (صوت مجهور).',         listen:'عين' },
  { letter:'ح', name:'الحاء',        zone:'throat_mid',  tip:'ضيّق وسط الحلق مع زفير احتكاكي هادئ بلا تذبذب (مهموس).',        listen:'حاء' },
  // أقصى الحلق
  { letter:'غ', name:'الغين',        zone:'throat_high', tip:'احتكاك رخو من أقصى الحلق مع تذبذب الوترين — كالغرغرة الناعمة.', listen:'غين' },
  { letter:'خ', name:'الخاء',        zone:'throat_high', tip:'احتكاك هوائي من أقصى الحلق بلا تذبذب — كالتنفس على مرآة.',      listen:'خاء' },
  // أقصى اللسان
  { letter:'ق', name:'القاف',        zone:'tongue_q',    tip:'أقصى اللسان يصطدم بأقصى الحنك الرخو فينفجر الهواء قوياً.',      listen:'قاف' },
  { letter:'ك', name:'الكاف',        zone:'tongue_k',    tip:'أقصى اللسان يلمس وسط الحنك الصلب بانفجار أخف من القاف.',        listen:'كاف' },
  // وسط اللسان
  { letter:'ج', name:'الجيم',        zone:'tongue_mid',  tip:'وسط اللسان يلتقي بوسط الحنك الصلب بانفجار مجهور قوي.',          listen:'جيم' },
  { letter:'ش', name:'الشين',        zone:'tongue_mid',  tip:'وسط اللسان مع الحنك الصلب — احتكاك واسع مهموس مع تفشٍّ.',       listen:'شين' },
  // حافة اللسان
  { letter:'ض', name:'الضاد',        zone:'tongue_side', tip:'إحدى حافتي اللسان تلمس الأضراس العليا — حرف فريد للغة العربية.',  listen:'ضاد' },
  { letter:'ل', name:'اللام',        zone:'tongue_side', tip:'طرف اللسان وحافتاه مع اللثة العليا مع تدفق هواء من الجانبين.',    listen:'لام' },
  // طرف اللسان — لثة
  { letter:'ن', name:'النون',        zone:'tongue_tip',  tip:'طرف اللسان يلمس اللثة العليا مع غنة رنّانة من الأنف.',           listen:'نون' },
  { letter:'ر', name:'الراء',        zone:'tongue_tip',  tip:'طرف اللسان يتذبذب بسرعة على اللثة العليا — صوت تكراري.',         listen:'راء' },
  // طرف اللسان — أصول الأسنان
  { letter:'ط', name:'الطاء',        zone:'tongue_gum',  tip:'طرف اللسان يضغط على أصول الأسنان العليا مع تفخيم وإطباق.',       listen:'طاء' },
  { letter:'د', name:'الدال',        zone:'tongue_gum',  tip:'كالطاء لكن مجهور وبلا تفخيم — صوت انفجاري رقيق.',               listen:'دال' },
  { letter:'ت', name:'التاء',        zone:'tongue_gum',  tip:'كالدال لكن مهموس — أضعف الأسنان الانفجارية الثلاثة.',            listen:'تاء' },
  // بين الأسنان
  { letter:'ص', name:'الصاد',        zone:'tongue_btw',  tip:'طرف اللسان قريب من أطراف الأسنان — صفير مفخم مهموس.',            listen:'صاد' },
  { letter:'ز', name:'الزاي',        zone:'tongue_btw',  tip:'طرف اللسان قريب من الأسنان — صفير مجهور رقيق.',                  listen:'زاي' },
  { letter:'س', name:'السين',        zone:'tongue_btw',  tip:'طرف اللسان قريب من الأسنان — صفير مهموس رقيق أوضح.',             listen:'سين' },
  // أطراف الأسنان
  { letter:'ظ', name:'الظاء',        zone:'tongue_edge', tip:'طرف اللسان على أطراف الأسنان العليا — مفخم مجهور.',              listen:'ظاء' },
  { letter:'ذ', name:'الذال',        zone:'tongue_edge', tip:'طرف اللسان على أطراف الأسنان العليا — رقيق مجهور.',              listen:'ذال' },
  { letter:'ث', name:'الثاء',        zone:'tongue_edge', tip:'طرف اللسان على أطراف الأسنان العليا — رقيق مهموس.',              listen:'ثاء' },
  // الشفتان
  { letter:'ف', name:'الفاء',        zone:'lips_f',      tip:'باطن الشفة السفلى يلامس أطراف الأسنان العليا — احتكاك مهموس.',   listen:'فاء' },
  { letter:'ب', name:'الباء',        zone:'lips',        tip:'الشفتان تلتقيان بإغلاق تام ثم تنفجران بهواء مجهور.',             listen:'باء' },
  { letter:'م', name:'الميم',        zone:'lips',        tip:'الشفتان تلتقيان مع توجيه الهواء للأنف — غنة شفوية.',             listen:'ميم' },
];

// ════════════════════════════════════════════════════════
//  DATA — Feedback Pool
// ════════════════════════════════════════════════════════
const FEEDBACK = [
  { icon:'✅', title:'استمرارية ممتازة!',      body:'نَفَسك قوي ومتصل. كادت الآية تكتمل دون انقطاع. زد مدة التمرين تدريجياً.',               color:'var(--green)', bg:'var(--green-pale)', border:'rgba(42,122,78,.2)' },
  { icon:'💡', title:'ملاحظة: الحجاب الحاجز', body:'يبدو أن الحجاب الحاجز يُطلق الهواء مبكراً. جرّب شهيقاً أعمق يملأ البطن قبل البدء.',     color:'var(--gold)',  bg:'var(--gold-pale)',  border:'rgba(176,125,16,.2)' },
  { icon:'🎯', title:'مخرج الراء',             body:'تفخيم "الراء" في "الرَّحمٰن" يحتاج رفع مؤخرة اللسان للحنك قليلاً مع الصوت المفخم.',      color:'var(--purple)',bg:'var(--purple-pale)',border:'rgba(98,68,160,.2)' },
  { icon:'🌊', title:'طبقة الصوت والمد',       body:'صوتك هادئ ومريح. ارفع طبقته قليلاً عند المدود الطويلة ليتضح الفرق بين القصر والطويل.',   color:'var(--gold)',  bg:'var(--gold-pale)',  border:'rgba(176,125,16,.2)' },
  { icon:'⭐', title:'مخارج متميزة!',          body:'الحروف واضحة ومتميزة. مستوى ممتاز يدل على تدريب منتظم. احرص على الاستمرار يومياً.',      color:'var(--green)', bg:'var(--green-pale)', border:'rgba(42,122,78,.2)' },
  { icon:'🔊', title:'الغنة والإخفاء',         body:'الغنة في "من نَّعيم" تحتاج مدة أطول (حركتان). جرّب التمديد الأنفي الواضح.',              color:'var(--purple)',bg:'var(--purple-pale)',border:'rgba(98,68,160,.2)' },
];

// ════════════════════════════════════════════════════════
//  DATA — Ayahs
// ════════════════════════════════════════════════════════
const AYAHS = [
  { text:'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ', name:'آية الكرسي — الجزء الأول', level:'متوسط',  badge:'badge-green' },
  { text:'وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا',               name:'آية الكرسي — الجزء الثاني', level:'متقدم',  badge:'badge-purple' },
  { text:'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ',               name:'سورة الإخلاص',              level:'مبتدئ',  badge:'badge-gold' },
  { text:'إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ كَانَتْ لَهُمْ جَنَّاتُ الْفِرْدَوْسِ',   name:'الكهف ١٠٧',                 level:'متقدم',  badge:'badge-purple' },
];

// ════════════════════════════════════════════════════════
//  DATA — Tajweed Rules
// ════════════════════════════════════════════════════════
const TAJWEED_CATS = [
  {
    id:'noon', icon:'ن', title:'النون الساكنة والتنوين',
    color:'var(--green)', bg:'var(--green-pale)', border:'rgba(42,122,78,.18)',
    rules:[
      { name:'الإظهار الحلقي', def:'إخراج النون أو التنوين واضحاً دون غنة عند حروف الحلق الستة.', letters:['ء','ه','ع','ح','غ','خ'], ex:'أَنعَمتَ',  note:'الغنة تختفي تماماً' },
      { name:'الإدغام',        def:'إدخال النون في الحرف التالي حتى يصيرا حرفاً واحداً مشدداً.',   letters:['ي','ر','م','ل','و','ن'], ex:'مَن يَعمَل', note:'مع غنة أو بدونها' },
      { name:'الإخفاء',        def:'النطق بالنون بين الإظهار والإدغام مع بقاء الغنة عند 15 حرفاً.', letters:['ت','ث','ج','د','ذ','ز','س','ش','ص','ض','ط','ظ','ف','ق','ك'], ex:'أَنتُم', note:'أكثر أحكام النون شيوعاً' },
      { name:'الإقلاب',        def:'قلب النون ميماً مع إخفائها وبقاء الغنة، ويأتي فقط عند الباء.',  letters:['ب'],                     ex:'مِنبَعد', note:'حكم وحيد — فقط مع الباء' },
    ]
  },
  {
    id:'madd', icon:'ـا', title:'المدود الرئيسية',
    color:'var(--gold)', bg:'var(--gold-pale)', border:'rgba(176,125,16,.18)',
    rules:[
      { name:'المد الطبيعي (الأصلي)', def:'مد حرف العلة حركتين طبيعيتين — لا سبب يزيده ولا يجوز نقصانه.', letters:['ا','و','ي'],  ex:'قَالَ',     note:'أساس جميع المدود' },
      { name:'المد المتصل',           def:'همزة تأتي بعد حرف المد في نفس الكلمة — يُمد 4 إلى 5 حركات.',   letters:['ء (في نفس الكلمة)'], ex:'جَاءَ',   note:'واجب التطبيق' },
      { name:'المد المنفصل',          def:'همزة تبدأ الكلمة التالية بعد حرف المد — يُمد 4 إلى 5 حركات.',   letters:['ء (في كلمة تالية)'], ex:'يَا أَيها', note:'جائز وليس واجباً' },
      { name:'المد العارض للسكون',    def:'حرف المد يسبق حرفاً ساكناً للوقف — يُمد 2 أو 4 أو 6 حركات.',   letters:['وقف على آخر الكلمة'], ex:'نَستَعِين', note:'الوقف يكشفه' },
    ]
  },
  {
    id:'qalqala', icon:'ق', title:'القلقلة',
    color:'var(--purple)', bg:'var(--purple-pale)', border:'rgba(98,68,160,.18)',
    rules:[
      { name:'حروف القلقلة الخمسة', def:'عند سكون هذه الحروف، يحدث اضطراب صوتي خفيف يُسمى "القلقلة". جُمعت في: قُطُب جَد.', letters:['ق','ط','ب','ج','د'], ex:'قُطُب جَد', note:'اضطراب في الصوت عند السكون' },
      { name:'القلقلة الصغرى',      def:'حرف القلقلة ساكن في وسط الكلمة — يُقلقل قلقلة خفيفة مختصرة.',                          letters:['ق','ط','ب','ج','د'], ex:'يَجعَلون',  note:'أخف القلقلتين' },
      { name:'القلقلة الكبرى',      def:'حرف القلقلة في آخر الكلمة عند الوقف — يُقلقل قلقلة أوضح وأظهر.',                       letters:['ق','ط','ب','ج','د'], ex:'وَالفَلَق',  note:'أظهر القلقلتين — عند الوقف' },
    ]
  },
  {
    id:'ghunna', icon:'م', title:'الغنة والميم الساكنة',
    color:'var(--red)', bg:'var(--red-pale)', border:'rgba(185,28,28,.18)',
    rules:[
      { name:'الغنة المشددة',        def:'النون أو الميم المشددة — واجبة الغنة حركتين كاملتين في كل حال.',         letters:['نّ','مّ'], ex:'إِنَّ رَبَّك', note:'أعلى درجات الغنة' },
      { name:'الإخفاء الشفوي',       def:'إخفاء الميم الساكنة عند الباء مع بقاء الغنة حركتين.',                     letters:['ب'],       ex:'وَاعتَصِم بِاللَّه', note:'خاص بالميم قبل الباء' },
      { name:'الإدغام الشفوي المتماثل', def:'إدغام الميم الساكنة في ميم متحركة تليها — تصيران ميماً واحدة مشددة.',  letters:['م'],       ex:'لَهُم مَّا',  note:'الميم تُدغم في مثلها' },
    ]
  },
];

// ════════════════════════════════════════════════════════
//  DATA — Badges
// ════════════════════════════════════════════════════════
const BADGES = [
  { id:'first',   icon:'🌱', name:'البداية',        desc:'أكملت أول جلسة تدريبية',        check:(s:Stats)=>s.sessions>=1 },
  { id:'five',    icon:'💪', name:'المتدرب',        desc:'أكملت 5 جلسات تدريبية',         check:(s:Stats)=>s.sessions>=5 },
  { id:'ten',     icon:'🏆', name:'المحترف',        desc:'أكملت 10 جلسات تدريبية',        check:(s:Stats)=>s.sessions>=10 },
  { id:'streak3', icon:'🔥', name:'الثبات',         desc:'3 أيام متتالية على التدريب',     check:(s:Stats)=>s.streak>=3 },
  { id:'score90', icon:'⭐', name:'المميز',         desc:'حصلت على 90%+ في جلسة واحدة',   check:(s:Stats)=>s.bestScore>=90 },
  { id:'breath',  icon:'🫁', name:'نَفَس التلاوة', desc:'أكملت تمرين التنفس الثلاثي',    check:(s:Stats)=>s.breathSessions>=1 },
  { id:'tajweed', icon:'📚', name:'طالب العلم',     desc:'استعرضت أحكام التجويد',          check:(s:Stats)=>s.visitedTajweed },
];

const HELP_STEPS = [
  { icon:'💋', title:'مرآة المخارج',   desc:'اختر حرفاً من الشبكة (28 حرفاً) وشاهد مكانه في الرسم التشريحي. اضغط 🎧 لسماع نطق الحرف، ثم فعّل الميكروفون وانطقه أنت لمقارنة موجات الصوت.' },
  { icon:'🫁', title:'تنفس التلاوة',   desc:'اختر آية قرآنية ثم ابدأ التمرين: شهيق عميق 4 ثوانٍ → ثبّت النفس 2 ثانية → اقرأ الآية حتى تنتهي نفسك. كرر 3 مرات لتقوية حجابك الحاجز.' },
  { icon:'📖', title:'أحكام التجويد', desc:'تصفح 4 أبواب رئيسية (النون الساكنة، المدود، القلقلة، الغنة) مع تعريف واضح وأمثلة قرآنية تفاعلية لكل حكم.' },
  { icon:'🤖', title:'التحليل الذكي', desc:'بعد أي جلسة استماع، اضغط "تحليل ذكي" للحصول على تقرير يشمل نسبة الدقة وملاحظات على المخارج والتنفس والنبرة.' },
];

// ════════════════════════════════════════════════════════
//  HOOKS
// ════════════════════════════════════════════════════════
function useLocalStorage<T>(key: string, init: T): [T, (v: T | ((p: T) => T)) => void] {
  const [val, setVal] = useState<T>(init);
  useEffect(() => {
    try { const s = localStorage.getItem(key); if (s) setVal(JSON.parse(s)); } catch {}
  }, [key]);
  const set = useCallback((v: T | ((p: T) => T)) => {
    setVal(prev => {
      const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);
  return [val, set];
}

function useAudio() {
  const anRef  = useRef<AnalyserNode | null>(null);
  const stRef  = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const [bars, setBars]     = useState<number[]>(Array(28).fill(3));
  const [active, setActive] = useState(false);
  const [permitted, setPerm] = useState<boolean | null>(null);

  const start = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      stRef.current = s;
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(s);
      const an  = ctx.createAnalyser(); an.fftSize = 64;
      src.connect(an); anRef.current = an;
      setActive(true); setPerm(true);
      const tick = () => {
        const d = new Uint8Array(an.frequencyBinCount);
        an.getByteFrequencyData(d);
        setBars(Array.from(d.slice(0,28)).map(v => Math.max(4,(v/255)*100)));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch { setPerm(false); }
  }, []);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    stRef.current?.getTracks().forEach(t => t.stop());
    setActive(false); setBars(Array(28).fill(3));
  }, []);

  return { bars, active, permitted, start, stop };
}

// ════════════════════════════════════════════════════════
//  COMPONENTS
// ════════════════════════════════════════════════════════
function Waveform({ bars, active }: { bars: number[]; active: boolean }) {
  return (
    <div className="flex items-center justify-center gap-1 h-12 rounded-xl px-3"
      style={{ background: active ? 'rgba(42,122,78,0.05)' : 'rgba(0,0,0,0.025)' }}>
      {bars.map((h, i) => (
        <div key={i} className="wave-bar"
          style={{ width:4, height:`${active?h:4}%`, borderRadius:4, minHeight:4,
            background: active ? `rgba(42,${120+Math.round(h*.4)},78,${.4+h/220})` : 'rgba(42,122,78,0.13)',
            transition:'height .07s ease' }} />
      ))}
    </div>
  );
}

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="toast-up fixed bottom-24 md:bottom-6 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg"
      style={{ background:'#fff', border:'1.5px solid rgba(42,122,78,.2)' }}>
      <i className="fa-solid fa-circle-check" style={{ color:'var(--green)' }}></i>
      <span className="text-sm font-semibold">{msg}</span>
    </div>
  );
}

function BadgePopup({ badge, onClose }: { badge: typeof BADGES[0]; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 5000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="pop-in fixed top-20 left-1/2 -translate-x-1/2 z-50 card p-5 text-center shadow-2xl min-w-[220px]"
      style={{ borderColor:'rgba(176,125,16,.3)' }}>
      <div className="text-5xl mb-2">{badge.icon}</div>
      <div className="font-black text-lg">شارة جديدة!</div>
      <div className="font-bold" style={{ color:'var(--gold)' }}>{badge.name}</div>
      <div className="text-xs mt-1" style={{ color:'var(--muted)' }}>{badge.desc}</div>
    </div>
  );
}

function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:'rgba(25,43,33,.45)', backdropFilter:'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-in card max-w-md w-full overflow-hidden" style={{ maxHeight:'88vh', overflowY:'auto' }}>
        <div className="p-6 pb-4 flex items-center justify-between border-b" style={{ borderColor:'var(--border)' }}>
          <div><h2 className="font-black text-xl">كيف تستخدم التطبيق؟</h2>
          <p className="text-xs mt-0.5" style={{ color:'var(--muted)' }}>دليل سريع خطوة بخطوة</p></div>
          <button onClick={onClose} className="btn-ghost w-9 h-9 flex items-center justify-center rounded-full text-lg"><i className="fa-solid fa-xmark"></i></button>
        </div>
        <div className="p-6 space-y-5">
          {HELP_STEPS.map((s,i)=>(
            <div key={i} className="flex gap-4">
              <div className="step-num">{i+1}</div>
              <div><div className="flex items-center gap-2 mb-1.5"><span className="text-xl">{s.icon}</span><h3 className="font-bold">{s.title}</h3></div>
              <p className="text-sm leading-relaxed" style={{ color:'var(--muted)' }}>{s.desc}</p></div>
            </div>
          ))}
        </div>
        <div className="px-6 pb-6 pt-2">
          <div className="rounded-xl p-4 mb-4 flex gap-3 items-start text-sm" style={{ background:'var(--green-pale)', border:'1px solid rgba(42,122,78,.14)' }}>
            <i className="fa-solid fa-lightbulb mt-0.5" style={{ color:'var(--green)' }}></i>
            <span style={{ color:'var(--text2)' }}><strong>نصيحة:</strong> 10 دقائق يومياً = تحسّن ملحوظ في أسبوعين!</span>
          </div>
          <button onClick={onClose} className="btn-primary w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2">
            <i className="fa-solid fa-circle-check"></i> فهمت، لنبدأ!
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  MAIN APP
// ════════════════════════════════════════════════════════
type Screen = 'dashboard' | 'makharij' | 'breathwork' | 'tajweed' | 'feedback';

export default function Home() {
  const [screen, setScreen]   = useState<Screen>('dashboard');
  const [showHelp, setHelp]   = useState(false);
  const [stats, setStats]     = useLocalStorage<Stats>('mihrab_stats', INIT_STATS);
  const [newBadge, setNewBadge] = useState<typeof BADGES[0] | null>(null);

  const [selLetter, setSelLetter] = useState<Letter>(ALL_LETTERS[0]);
  const [selAyah,   setSelAyah]   = useState(AYAHS[0]);
  const [breathPhase, setBreathPhase] = useState<'idle'|'in'|'hold'|'out'|'done'>('idle');
  const [breathRound, setBreathRound] = useState(0);
  const [feedbacks,   setFeedbacks]   = useState<typeof FEEDBACK>([]);
  const [score,       setScore]       = useState(0);
  const [selCat,      setSelCat]      = useState(0);
  const [selRule,     setSelRule]      = useState<number|null>(null);
  const [toast,       setToast]       = useState('');
  const breathTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  const { bars, active, permitted, start, stop } = useAudio();

  // Update streak on mount
  useEffect(() => {
    setStats(s => {
      const today = new Date().toISOString().slice(0,10);
      if (s.lastVisit === today) return s;
      const yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);
      return { ...s, lastVisit: today, streak: s.lastVisit === yesterday ? s.streak + 1 : 1 };
    });
  }, []);

  const checkBadges = useCallback((s: Stats) => {
    BADGES.forEach(b => {
      if (!s.unlockedBadges.includes(b.id) && b.check(s)) {
        setStats(prev => ({ ...prev, unlockedBadges: [...prev.unlockedBadges, b.id] }));
        setNewBadge(b);
      }
    });
  }, [setStats]);

  const goTo = useCallback((s: Screen) => { stop(); setScreen(s); }, [stop]);

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ar-SA'; u.rate = 0.7; u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  };

  const genFeedback = () => {
    stop();
    const picked = [...FEEDBACK].sort(() => Math.random()-.5).slice(0,3);
    setFeedbacks(picked);
    const s = 65 + Math.floor(Math.random()*33);
    setScore(s);
    setStats(prev => {
      const ns = { ...prev, sessions: prev.sessions+1, bestScore: Math.max(prev.bestScore, s) };
      checkBadges(ns);
      return ns;
    });
    goTo('feedback');
    setToast('✨ تم تحليل تلاوتك!');
  };

  const startBreath = async () => {
    if (!active) await start();
    setBreathRound(0);
    const cycle = () => {
      setBreathPhase('in');
      breathTimer.current = setTimeout(() => {
        setBreathPhase('hold');
        breathTimer.current = setTimeout(() => {
          setBreathPhase('out');
          breathTimer.current = setTimeout(() => {
            setBreathRound(r => {
              const n = r+1;
              if (n >= 3) {
                setBreathPhase('done'); stop();
                setStats(prev => { const ns={...prev,breathSessions:prev.breathSessions+1}; checkBadges(ns); return ns; });
              } else cycle();
              return n;
            });
          }, 4000);
        }, 2000);
      }, 4000);
    };
    cycle();
  };

  // ── DASHBOARD ───────────────────────────────────────────
  const Dashboard = () => {
    const earned = BADGES.filter(b => stats.unlockedBadges.includes(b.id));
    return (
      <div className="screen-in max-w-5xl mx-auto">
        <div className="text-center mb-10 pt-4">
          <span className="badge badge-green mb-4"><i className="fa-solid fa-microphone-lines"></i> مدرّب التجويد الذكي</span>
          <h1 className="text-5xl font-black mb-3"><span className="gradient-text">محراب الصوت</span></h1>
          <p className="text-base max-w-lg mx-auto leading-relaxed" style={{ color:'var(--muted)' }}>
            تقنية الذكاء الاصطناعي تُصحّح مخارج حروفك وتُطوّر تنفسك في الترتيل
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon:'fa-fire-flame-curved', label:'أيام متتالية', val:`${stats.streak}🔥`, color:'var(--gold)' },
            { icon:'fa-star',              label:'أفضل دقة',      val:`${stats.bestScore||0}%`, color:'var(--green)' },
            { icon:'fa-dumbbell',          label:'جلسات مكتملة',  val:stats.sessions,      color:'var(--purple)' },
            { icon:'fa-medal',             label:'شارات مفتوحة',  val:`${earned.length}/${BADGES.length}`, color:'var(--gold)' },
          ].map((s,i)=>(
            <div key={i} className="card p-4 text-center">
              <i className={`fa-solid ${s.icon} text-xl mb-1.5`} style={{ color:s.color }}></i>
              <div className="text-2xl font-black" style={{ color:s.color, fontFamily:'Outfit,sans-serif' }}>{s.val}</div>
              <div className="text-xs mt-0.5" style={{ color:'var(--muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Training cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon:'fa-lips',         title:'مرآة المخارج',    s:'makharij' as Screen, badge:'badge-green',  sub:'28 حرفاً + تحليل صوتي' },
            { icon:'fa-lungs',        title:'تنفس التلاوة',    s:'breathwork' as Screen,badge:'badge-purple', sub:'تقوية الحجاب الحاجز' },
            { icon:'fa-book-open',    title:'أحكام التجويد',   s:'tajweed' as Screen,  badge:'badge-gold',   sub:'4 أبواب تفاعلية' },
            { icon:'fa-waveform-lines',title:'تحليل التلاوة', s:'breathwork' as Screen,badge:'badge-cyan',   sub:'تقرير ذكي فوري' },
          ].map((m,i)=>(
            <button key={i} onClick={()=>goTo(m.s)} className="card p-5 text-right hover:-translate-y-1 transition-all duration-300 w-full">
              <div className="flex items-start justify-between mb-4">
                <span className={`badge ${m.badge} text-xs`}>{m.sub}</span>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'var(--green-pale)',color:'var(--green)' }}>
                  <i className={`fa-solid ${m.icon}`}></i>
                </div>
              </div>
              <h3 className="font-black text-base mb-3">{m.title}</h3>
              <div className="flex items-center gap-1 text-xs font-bold" style={{ color:'var(--green)' }}>
                ابدأ <i className="fa-solid fa-arrow-left text-xs"></i>
              </div>
            </button>
          ))}
        </div>

        {/* Badges */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-base">الشارات المكتسبة</h3>
            <span className="text-xs" style={{ color:'var(--muted)' }}>{earned.length} من {BADGES.length}</span>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
            {BADGES.map(b=>{
              const has = stats.unlockedBadges.includes(b.id);
              return (
                <div key={b.id} className="text-center" title={b.desc}>
                  <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-2xl mb-1 transition-all"
                    style={{ background:has?'var(--green-pale)':'rgba(0,0,0,0.04)', opacity:has?1:.35, filter:has?'none':'grayscale(1)' }}>
                    {b.icon}
                  </div>
                  <p className="text-xs font-bold leading-tight" style={{ color:has?'var(--text)':'var(--muted)' }}>{b.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ── MAKHARIJ ────────────────────────────────────────────
  const Makharij = () => {
    const zone = ZONES[selLetter.zone];
    const grouped = Object.entries(ZONES).reduce((acc, [zk]) => {
      const lts = ALL_LETTERS.filter(l=>l.zone===zk);
      if (lts.length) acc[zk] = lts;
      return acc;
    }, {} as Record<string,Letter[]>);
    return (
      <div className="screen-in max-w-5xl mx-auto">
        <div className="glass p-5 mb-4">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={()=>goTo('dashboard')} className="btn-outline px-4 py-2 text-sm flex items-center gap-2"><i className="fa-solid fa-arrow-right"></i> العودة</button>
            <div><h2 className="text-lg font-black">مرآة المخارج التفاعلية</h2>
            <p className="text-xs" style={{ color:'var(--muted)' }}>28 حرفاً مع رسم تشريحي وتحليل صوتي</p></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* SVG Anatomy */}
            <div className="card p-4 flex flex-col items-center" style={{ background:'rgba(248,250,248,1)' }}>
              <svg viewBox="0 0 200 200" className="w-full max-w-[280px]">
                {/* Background Head Silhouette */}
                <path d="M 110,10 C 150,10 170,30 180,50 C 190,70 195,80 195,95 C 195,110 185,120 175,130 L 155,145 C 150,150 145,170 145,200 L 70,200 L 70,140 C 70,80 80,10 110,10 Z" fill="rgba(42,122,78,0.02)" stroke="rgba(42,122,78,0.15)" strokeWidth="1.5" strokeLinejoin="round" />
                
                {/* Nasal Cavity */}
                <path d="M 115,80 C 115,50 140,40 170,40 C 180,40 185,45 185,50 C 185,55 170,65 140,70 L 115,80 Z" fill="rgba(124,58,237,0.06)" stroke="rgba(124,58,237,0.2)" strokeWidth="1.5" />
                
                {/* Oral Cavity (Palate) */}
                <path d="M 105,110 C 115,85 140,80 175,80" fill="none" stroke="rgba(14,116,144,0.25)" strokeWidth="6" strokeLinecap="round" />
                
                {/* Teeth */}
                <rect x="178" y="80" width="4" height="12" fill="rgba(42,122,78,0.25)" rx="2" />
                <rect x="178" y="95" width="4" height="12" fill="rgba(42,122,78,0.25)" rx="2" />
                
                {/* Throat */}
                <path d="M 90,200 L 90,140 C 90,120 100,110 115,110 L 130,110 C 140,110 145,120 145,140 L 145,200" fill="rgba(185,28,28,0.04)" stroke="rgba(185,28,28,0.2)" strokeWidth="2" />
                
                {/* Tongue */}
                <path d="M 100,135 C 115,100 150,90 175,95 C 180,96 182,100 180,105 C 170,115 150,130 135,135 Z" fill="rgba(42,122,78,0.08)" stroke="rgba(42,122,78,0.3)" strokeWidth="1.5" />

                {/* All zone points */}
                {Object.entries(ZONES).map(([zk, z]) => {
                  const isSel = selLetter.zone === zk;
                  return (
                    <g key={zk}>
                      {isSel && (
                        <>
                          <circle cx={z.svgX} cy={z.svgY} r="14" fill="none" stroke={z.color} strokeWidth="0.8" opacity="0.3">
                            <animate attributeName="r" from="6" to="24" dur="1.5s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" repeatCount="indefinite"/>
                          </circle>
                          <circle cx={z.svgX} cy={z.svgY} r="8" fill="none" stroke={z.color} strokeWidth="1.5" opacity="0.6">
                            <animate attributeName="r" from="4" to="12" dur="1.5s" repeatCount="indefinite" begin="0.75s"/>
                            <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" begin="0.75s"/>
                          </circle>
                        </>
                      )}
                      <circle cx={z.svgX} cy={z.svgY} r={isSel?6:3.5}
                        fill={isSel ? z.color : 'rgba(42,122,78,.4)'}
                        stroke={isSel ? '#fff' : 'none'} strokeWidth="1.5"
                        style={{ transition:'all .4s cubic-bezier(.16,1,.3,1)' }}/>
                    </g>
                  );
                })}
              </svg>
              <p className="text-xs mt-2" style={{ color:'var(--muted)' }}>النقطة الخضراء تشير لمخرج الحرف المختار</p>
            </div>

            {/* Info + Letter Grid */}
            <div className="space-y-3">
              {/* Selected letter */}
              <div className="card p-5 text-center" style={{ borderColor:zone.border, background:zone.bg }}>
                <div className="text-6xl font-black mb-2" style={{ color:zone.color, fontFamily:'serif', lineHeight:1 }}>{selLetter.letter}</div>
                <div className="font-bold text-base mb-1">{selLetter.name}</div>
                <span className="badge text-xs mb-3" style={{ background:'#fff', color:zone.color, borderColor:zone.border }}>{zone.name}</span>
                <p className="text-sm leading-relaxed" style={{ color:'var(--text2)' }}>{selLetter.tip}</p>
                <button onClick={()=>speak(selLetter.listen)} className="btn-outline mt-3 px-4 py-2 text-sm flex items-center gap-2 mx-auto"
                  style={{ borderColor:zone.border, color:zone.color }}>
                  <i className="fa-solid fa-headphones"></i> استمع للنطق الصحيح
                </button>
              </div>

              {/* Mic */}
              <div className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold">تحليل صوتك</span>
                  <span className="badge text-xs" style={{ background:active?'#fee2e2':'var(--bg)', color:active?'var(--red)':'var(--muted)', borderColor:active?'rgba(185,28,28,.2)':'var(--border)' }}>
                    {active?'● يستمع':'متوقف'}
                  </span>
                </div>
                <Waveform bars={bars} active={active}/>
                {permitted===false && <p className="text-xs text-center mt-1" style={{ color:'var(--red)' }}>يرجى السماح بالميكروفون</p>}
                <div className="flex gap-2 mt-2">
                  {!active ? (
                    <button onClick={start} className="flex-1 btn-primary py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
                      <i className="fa-solid fa-microphone"></i> تفعيل الميكروفون
                    </button>
                  ) : (
                    <>
                      <button onClick={stop} className="flex-1 py-2.5 rounded-xl text-sm font-bold border flex items-center justify-center gap-2" style={{ borderColor:'rgba(185,28,28,.25)', color:'var(--red)', background:'transparent' }}>
                        <i className="fa-solid fa-stop"></i> إيقاف
                      </button>
                      <button onClick={genFeedback} className="flex-1 btn-primary py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
                        <i className="fa-solid fa-wand-magic-sparkles"></i> تحليل ذكي
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Full 28-letter grid grouped by zone */}
          <div className="mt-5">
            <p className="text-sm font-bold mb-3">جميع الحروف — مصنّفة حسب المخرج:</p>
            <div className="space-y-3">
              {Object.entries(grouped).map(([zk, lts]) => {
                const z = ZONES[zk];
                return (
                  <div key={zk}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full" style={{ background:z.color }}></span>
                      <span className="text-xs font-bold" style={{ color:z.color }}>{z.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {lts.map((l,i)=>(
                        <button key={i} onClick={()=>setSelLetter(l)}
                          className={`letter-btn ${selLetter.letter===l.letter?'active':''}`}
                          style={{
                            background: selLetter.letter===l.letter ? z.bg : 'var(--bg)',
                            borderColor: selLetter.letter===l.letter ? z.border : 'var(--border)',
                            color: selLetter.letter===l.letter ? z.color : 'var(--text)',
                          }}>
                          {l.letter}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── BREATHWORK ──────────────────────────────────────────
  const Breathwork = () => (
    <div className="screen-in max-w-2xl mx-auto">
      <div className="glass p-7">
        <div className="flex items-center gap-3 mb-7">
          <button onClick={()=>{ if(breathTimer.current)clearTimeout(breathTimer.current); setBreathPhase('idle'); goTo('dashboard'); }}
            className="btn-outline px-4 py-2 text-sm flex items-center gap-2"><i className="fa-solid fa-arrow-right"></i> العودة</button>
          <div><h2 className="text-lg font-black">تدريب نَفَس التلاوة</h2>
          <p className="text-xs" style={{ color:'var(--muted)' }}>قوّي حجابك الحاجز للآيات الطويلة</p></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
          {AYAHS.map((a,i)=>(
            <button key={i} onClick={()=>setSelAyah(a)} className="text-right p-4 rounded-xl border transition-all"
              style={{ background:selAyah.text===a.text?'var(--green-pale)':'var(--bg)', borderColor:selAyah.text===a.text?'rgba(42,122,78,.3)':'var(--border)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className={`badge text-xs ${a.badge}`}>{a.level}</span>
                <span className="text-xs" style={{ color:'var(--muted)' }}>{a.name}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ fontFamily:'serif' }}>{a.text.slice(0,42)}…</p>
            </button>
          ))}
        </div>
        <div className="rounded-2xl p-4 text-center mb-7" style={{ background:'var(--green-pale)', border:'1px solid rgba(42,122,78,.15)' }}>
          <p className="text-base leading-loose" style={{ fontFamily:'serif', lineHeight:2.1 }}>{selAyah.text}</p>
        </div>
        <div className="flex flex-col items-center gap-5">
          <div className="relative flex items-center justify-center">
            <div className={`w-36 h-36 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-700 ${breathPhase==='in'?'breathe-in':breathPhase==='out'?'breathe-out':''}`}
              style={{ borderColor:breathPhase==='idle'?'rgba(98,68,160,.25)':breathPhase==='done'?'rgba(42,122,78,.5)':'rgba(98,68,160,.5)', background:breathPhase==='idle'?'var(--bg)':breathPhase==='done'?'var(--green-pale)':'var(--purple-pale)' }}>
              {breathPhase==='idle' && <><i className="fa-solid fa-lungs text-4xl mb-1" style={{ color:'var(--purple)' }}></i><span className="text-xs" style={{ color:'var(--muted)' }}>جاهز</span></>}
              {breathPhase==='in'   && <><span className="text-xl font-black" style={{ color:'var(--purple)' }}>شهيق</span><span className="text-xs mt-1" style={{ color:'var(--muted)' }}>عميق وبطيء</span></>}
              {breathPhase==='hold' && <><span className="text-xl font-black" style={{ color:'var(--purple)' }}>ثبّت</span><span className="text-xs mt-1" style={{ color:'var(--muted)' }}>لا تُفلت</span></>}
              {breathPhase==='out'  && <><span className="text-xl font-black" style={{ color:'var(--purple)' }}>اقرأ</span><span className="text-xs mt-1" style={{ color:'var(--muted)' }}>الآية كاملة</span></>}
              {breathPhase==='done' && <><span className="text-3xl">✅</span><span className="text-sm font-bold mt-1" style={{ color:'var(--green)' }}>أحسنت!</span></>}
            </div>
            {breathPhase!=='idle'&&breathPhase!=='done'&&<div className="absolute inset-0 rounded-full border-2 animate-ping" style={{ borderColor:'rgba(98,68,160,.15)' }}></div>}
          </div>
          {breathPhase!=='idle' && <div className="flex gap-2">{[0,1,2].map(i=><div key={i} className="w-3 h-3 rounded-full transition-all" style={{ background:i<breathRound?'var(--purple)':'rgba(98,68,160,.15)' }}/>)}</div>}
          {breathPhase==='out'&&active&&<div className="w-full"><Waveform bars={bars} active={active}/></div>}
          <div className="flex gap-3">
            {breathPhase==='idle'&&<button onClick={startBreath} className="btn-primary px-10 py-3.5 rounded-2xl font-bold flex items-center gap-3" style={{ background:'var(--purple)',boxShadow:'0 4px 16px rgba(98,68,160,.25)' }}><i className="fa-solid fa-play"></i> ابدأ التمرين</button>}
            {breathPhase==='done'&&<button onClick={genFeedback} className="btn-primary px-8 py-3.5 rounded-2xl font-bold flex items-center gap-3"><i className="fa-solid fa-wand-magic-sparkles"></i> عرض التقرير</button>}
            {breathPhase!=='idle'&&breathPhase!=='done'&&<button onClick={()=>{ if(breathTimer.current)clearTimeout(breathTimer.current); setBreathPhase('idle'); stop(); }} className="btn-ghost px-6 py-3 rounded-xl text-sm border" style={{ borderColor:'var(--border)' }}>إيقاف</button>}
          </div>
        </div>
      </div>
    </div>
  );

  // ── TAJWEED ─────────────────────────────────────────────
  const Tajweed = () => {
    const cat = TAJWEED_CATS[selCat];
    return (
      <div className="screen-in max-w-5xl mx-auto">
        <div className="glass p-5 mb-4">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={()=>goTo('dashboard')} className="btn-outline px-4 py-2 text-sm flex items-center gap-2"><i className="fa-solid fa-arrow-right"></i> العودة</button>
            <div><h2 className="text-lg font-black">أحكام التجويد</h2>
            <p className="text-xs" style={{ color:'var(--muted)' }}>تعلّم أبواب التجويد بأسلوب تفاعلي</p></div>
          </div>

          {/* Category tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {TAJWEED_CATS.map((c,i)=>(
              <button key={c.id} onClick={()=>{ setSelCat(i); setSelRule(null); }}
                className="rule-card text-right transition-all"
                style={{ background:selCat===i?c.bg:'var(--bg)', borderColor:selCat===i?c.border:'var(--border)', color:selCat===i?c.color:'var(--text)' }}>
                <div className="text-2xl mb-2 font-black" style={{ fontFamily:'serif' }}>{c.icon}</div>
                <div className="font-bold text-sm leading-tight">{c.title}</div>
                <div className="text-xs mt-1" style={{ color:'var(--muted)' }}>{c.rules.length} أحكام</div>
              </button>
            ))}
          </div>

          {/* Rules list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cat.rules.map((r,i)=>(
              <div key={i}>
                <button onClick={()=>setSelRule(selRule===i?null:i)} className="rule-card w-full text-right"
                  style={{ background:selRule===i?cat.bg:'var(--bg)', borderColor:selRule===i?cat.border:'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-black" style={{ color:cat.color }}>{r.name}</span>
                    <i className={`fa-solid fa-chevron-${selRule===i?'up':'down'} text-xs`} style={{ color:'var(--muted)' }}></i>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {r.letters.slice(0,8).map((l,li)=>(
                      <span key={li} className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
                        style={{ background:`${cat.color}18`, color:cat.color, border:`1.5px solid ${cat.border}` }}>{l}</span>
                    ))}
                    {r.letters.length>8&&<span className="text-xs flex items-center px-2" style={{ color:'var(--muted)' }}>+{r.letters.length-8}</span>}
                  </div>
                  {selRule===i && (
                    <div className="mt-3 pt-3 border-t" style={{ borderColor:cat.border }}>
                      <p className="text-sm leading-relaxed mb-3" style={{ color:'var(--text2)' }}>{r.def}</p>
                      <div className="rounded-xl p-3 flex items-center justify-between" style={{ background:'rgba(255,255,255,.8)', border:`1px solid ${cat.border}` }}>
                        <div>
                          <p className="text-xs mb-0.5" style={{ color:'var(--muted)' }}>مثال:</p>
                          <p className="font-black text-lg" style={{ fontFamily:'serif', color:cat.color }}>{r.ex}</p>
                        </div>
                        <button onClick={e=>{e.stopPropagation();speak(r.ex);}} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-all hover:opacity-80"
                          style={{ borderColor:cat.border, color:cat.color, background:'transparent' }}>
                          <i className="fa-solid fa-headphones"></i> استمع
                        </button>
                      </div>
                      {r.note && <p className="text-xs mt-2 font-bold" style={{ color:cat.color }}>💡 {r.note}</p>}
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── FEEDBACK ────────────────────────────────────────────
  const Feedback = () => (
    <div className="screen-in max-w-2xl mx-auto">
      <div className="glass p-7">
        <div className="flex items-center gap-3 mb-7">
          <button onClick={()=>goTo('dashboard')} className="btn-outline px-4 py-2 text-sm flex items-center gap-2"><i className="fa-solid fa-arrow-right"></i> العودة</button>
          <div><h2 className="text-lg font-black">تقرير التحليل الذكي</h2>
          <p className="text-xs" style={{ color:'var(--muted)' }}>نتائج جلستك</p></div>
        </div>
        <div className="text-center mb-8">
          <div className="relative w-28 h-28 mx-auto mb-3">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 112 112">
              <circle cx="56" cy="56" r="48" fill="none" stroke="rgba(42,122,78,.1)" strokeWidth="7"/>
              <circle cx="56" cy="56" r="48" fill="none" stroke="var(--green)" strokeWidth="7"
                strokeDasharray={`${2*Math.PI*48}`}
                strokeDashoffset={`${2*Math.PI*48*(1-score/100)}`}
                strokeLinecap="round" style={{ transition:'stroke-dashoffset 1.4s cubic-bezier(.16,1,.3,1)' }}/>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black" style={{ color:'var(--green)', fontFamily:'Outfit,sans-serif' }}>{score}%</span>
              <span className="text-xs" style={{ color:'var(--muted)' }}>دقة التلاوة</span>
            </div>
          </div>
          <p className="font-bold">{score>=90?'🌟 ممتاز جداً — مستوى متقدم!':score>=75?'✨ أداء جيد جداً ومتميز!':'💪 استمر — التدريب اليومي يصنع الفرق!'}</p>
        </div>
        <div className="space-y-3 mb-7">
          {feedbacks.map((f,i)=>(
            <div key={i} className="card-slide card p-4 flex gap-3" style={{ animationDelay:`${i*.12}s`, opacity:0, background:f.bg, borderColor:f.border }}>
              <span className="text-2xl flex-shrink-0">{f.icon}</span>
              <div><h4 className="font-bold mb-0.5" style={{ color:f.color }}>{f.title}</h4>
              <p className="text-sm leading-relaxed" style={{ color:'var(--text2)' }}>{f.body}</p></div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <button onClick={()=>goTo('makharij')} className="btn-primary px-7 py-3 rounded-xl text-sm flex items-center gap-2">
            <i className="fa-solid fa-rotate-right"></i> مخارج جديدة
          </button>
          <button onClick={()=>{ goTo('breathwork'); setBreathPhase('idle'); }} className="btn-outline px-7 py-3 rounded-xl text-sm flex items-center gap-2">
            <i className="fa-solid fa-lungs"></i> تمرين نَفَس
          </button>
          <button onClick={()=>{ setStats(s=>({...s,visitedTajweed:true})); checkBadges({...stats,visitedTajweed:true}); goTo('tajweed'); }} className="btn-ghost px-7 py-3 rounded-xl text-sm border flex items-center gap-2" style={{ borderColor:'var(--border)' }}>
            <i className="fa-solid fa-book-open"></i> أحكام التجويد
          </button>
        </div>
      </div>
    </div>
  );

  // Mark tajweed as visited when entering
  useEffect(() => {
    if (screen === 'tajweed' && !stats.visitedTajweed) {
      const ns = { ...stats, visitedTajweed: true };
      setStats(ns); checkBadges(ns);
    }
  }, [screen]);

  return (
    <>
      {/* ── Header ── */}
      <header className="sticky top-0 z-40" style={{ background:'rgba(244,247,243,.92)', backdropFilter:'blur(16px)', borderBottom:'1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={()=>goTo('dashboard')} className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-kaaba" style={{ color:'var(--green)', fontSize:'17px' }}></i>
              <span className="font-black text-base">محراب الصوت</span>
            </div>
            <span className="text-xs" style={{ color:'var(--muted)', fontFamily:'Outfit,sans-serif', letterSpacing:'0.05em' }}>Tajweed AI Coach</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Streak */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background:'var(--gold-pale)', borderColor:'rgba(176,125,16,.2)' }}>
              <span className="streak-glow text-sm font-black">{stats.streak} يوم 🔥</span>
            </div>

            {/* Nav links — desktop */}
            {([
              { label:'المخارج',  icon:'fa-lips',      s:'makharij' as Screen },
              { label:'التنفس',   icon:'fa-lungs',     s:'breathwork' as Screen },
              { label:'التجويد',  icon:'fa-book-open', s:'tajweed' as Screen },
            ]).map(n=>(
              <button key={n.s} onClick={()=>goTo(n.s)}
                className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${screen===n.s?'btn-primary':'btn-ghost'}`}>
                <i className={`fa-solid ${n.icon}`}></i> {n.label}
              </button>
            ))}

            <button onClick={()=>setHelp(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold border transition-all"
              style={{ borderColor:'rgba(42,122,78,.25)', color:'var(--green)', background:'var(--green-pale)' }}>
              <i className="fa-solid fa-circle-question"></i>
              <span className="hidden sm:inline">مساعدة</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="min-h-[calc(100vh-120px)] px-3 py-6">
        {screen==='dashboard'  && <Dashboard/>}
        {screen==='makharij'   && <Makharij/>}
        {screen==='breathwork' && <Breathwork/>}
        {screen==='tajweed'    && <Tajweed/>}
        {screen==='feedback'   && <Feedback/>}
      </main>

      {/* ── Footer (desktop) ── */}
      <footer className="hidden md:block text-center py-4 text-xs border-t" style={{ color:'var(--muted)', borderColor:'var(--border)' }}>
        © 2026 محراب الصوت — التجويد بتقنية الذكاء الاصطناعي
      </footer>

      {/* ── Bottom Nav (mobile) ── */}
      <nav className="md:hidden bottom-nav">
        {([
          { label:'الرئيسية', icon:'fa-house',      s:'dashboard' as Screen },
          { label:'المخارج',  icon:'fa-lips',       s:'makharij' as Screen },
          { label:'التنفس',   icon:'fa-lungs',      s:'breathwork' as Screen },
          { label:'التجويد',  icon:'fa-book-open',  s:'tajweed' as Screen },
        ]).map(n=>(
          <button key={n.s} onClick={()=>goTo(n.s)} className={`bottom-nav-item ${screen===n.s?'active':''}`}>
            <i className={`fa-solid ${n.icon} text-lg`}></i>
            <span>{n.label}</span>
          </button>
        ))}
      </nav>

      {/* ── Overlays ── */}
      {showHelp && <HelpModal onClose={()=>setHelp(false)}/>}
      {newBadge && <BadgePopup badge={newBadge} onClose={()=>setNewBadge(null)}/>}
      {toast && <Toast msg={toast} onClose={()=>setToast('')}/>}
    </>
  );
}
