import React from 'react';
import { useStore } from '../store/useStore';

const TUHFA_TEXT = [
  { section: 'المقدمة', verses: [
    'يَقُولُ رَاجِي رَحْمَةِ الْغَفُورِ ** دَوْمًا سُلَيْمَانُ هُوَ الجَمْزُورِي',
    'الْحَمْدُ للهِ مُصَلِّيًا عَلَى ** مُحَمَّدٍ وَآلِهِ وَمَنْ تَلَا',
    'وَبَعْدُ: هَذَا النَّظْمُ لِلْمُرِيدِ ** فِي النُّونِ والتَّنْوِينِ وَالْمُدُودِ',
    'سَمَّيْتُهُ بِتُحْفَةِ الأَطْفَالِ ** عَنْ شَيْخِنَا الْمِيهِيِّ ذِي الْكَمَالِ',
    'أَرْجُو بِهِ أَنْ يَنْفَعَ الطُّلَّابَا ** وَالأَجْرَ وَالْقَبُولَ وَالثَّوَابَا'
  ]},
  { section: 'أحكام النون الساكنة والتنوين', verses: [
    'لِلنُّونِ إِنْ تَسْكُنْ وَلِلتَّنْوِينِ ** أَرْبَعُ أَحْكَامٍ فَخُذْ تَبْيِينِي',
    'فَالأَوَّلُ الإِظْهَارُ قَبْلَ أَحْرُفِ ** لِلْحَلْقِ سِتٌّ رُتِّبَتْ فَلْتَعْرِفِ',
    'هَمْزٌ فَهَاءٌ ثُمَّ عَيْنٌ حَاءُ ** مُهْمَلَتَانِ ثُمَّ غَيْنٌ خَاءُ',
    'وَالثَّانـِي إِدْغَامٌ بِسِتَّةٍ أَتَتْ ** فِي يَرْمَلُونَ عِنْدَهُم قَدْ ثَبَتَتْ',
    'لَكِنَّهَا قِسْمَانِ قِسْمٌ يُدْغَمَا ** فِيهِ بِغُنَّةٍ بِيَنْمُو عُلِمَا',
    'إِلَّا إِذَا كَانَا بِكِلْمَةٍ فَلَا ** تُدْغِمْ كَدُنْيَا ثُمَّ صِنْوَانٍ تَلَا',
    'وَالثَّانـِي إِدْغَامٌ بِغَيْرِ غُنَّةْ ** فِي اللَّامِ وَالرَّا ثُمَّ كَرِّرَنَّهْ',
    'وَالثَّالِثُ الإِقْلَابُ عِنْدَ الْبَاءِ ** مِيمًا بِغُنَّةٍ مَعَ الإِخْفَاءِ',
    'وَالرَّابِعُ الإِخْفَاءُ عِنْدَ الْفَاضِلِ ** مِنَ الحُرُوفِ وَاجِبٌ لِلْفَاضِلِ',
    'فِي خَمْسَةٍ مِنْ بَعْدِ عَشْرٍ رَمْزُهَا ** فِي كِلْمِ هَذَا البَيْتِ قَد ضَمَّنْتُهَا',
    'صِفْ ذَا ثَنَا كَمْ جَادَ شَخْصٌ قَدْ سَمَا ** دُمْ طَيِّبًا زِدْ فِي تُقًى ضَعْ ظَالِمَا'
  ]},
  { section: 'أحكام الميم والنون المشددتين', verses: [
    'وَغُنَّ مِيمًا ثُمَّ نُونًا شُدِّدَا ** وَسَمِّ كُلًّا حَرْفَ غُنَّةٍ بَدَا'
  ]},
  { section: 'أحكام الميم الساكنة', verses: [
    'وَالْمِيمُ إِنْ تَسْكُنْ تَجِي قَبْلَ الْهِجَا ** لاَ أَلِفٍ لَيِّنَةٍ لِذِي الْحِجَا',
    'أَحْكَامُهَا ثَلاَثَةٌ لِمَنْ ضَبَطْ ** إِخْفَاءٌ ادْغَامٌ وَإِظْهَارٌ فَقَطْ',
    'فَالأَوَّلُ الإِخْفَاءُ عِنْدَ الْبَاءِ ** وَسَمِّهِ الشَّفْوِيَّ لِلْقُرَّاءِ',
    'وَالثَّانـِي إِدْغَامٌ بِمِثْلِهَا أَتَى ** وَسَمِّ إِدْغَامًا صَغِيرًا يَا فَتَى',
    'وَالثَّالِثُ الإِظْهَارُ فِي الْبَقِيَّةْ ** مِنْ أَحْرُفٍ وَسَمِّهَا شَفْوِيَّةْ',
    'وَاحْذَرْ لَدَى وَاوٍ وَفَا أَنْ تَخْتَفِي ** لِقُرْبِهَا وَالاتِّحَادِ فَاعْرِفِ'
  ]}
];

export function TuhfaFullText() {
  const { setScreen } = useStore();

  return (
    <div className="screen-in max-w-3xl mx-auto pt-6">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => setScreen('dashboard')} className="btn-outline px-4 py-2 text-sm flex items-center gap-2">
          <i className="fa-solid fa-arrow-right"></i> العودة
        </button>
        <div><h2 className="text-xl font-black">متن تحفة الأطفال 📜</h2></div>
      </div>

      <div className="card p-6 mb-8 text-center bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]" style={{ backgroundColor: '#fcfaf5', border: '1px solid #e2d9c3' }}>
        <h1 className="text-3xl font-black text-green-900 mb-2 font-serif" style={{ lineHeight: 1.5 }}>مَتْنُ تُحْفَةِ الأَطْفَالِ</h1>
        <h2 className="text-lg font-bold text-gray-700 mb-4">للشيخ سُلَيْمَان الْجَمْزُورِي (رحمه الله)</h2>
        <div className="w-16 h-1 bg-green-700 mx-auto rounded-full"></div>
      </div>

      <div className="space-y-8 pb-12">
        {TUHFA_TEXT.map((section, idx) => (
          <div key={idx} className="relative">
            <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 border border-green-300">
                {idx + 1}
              </span>
              {section.section}
            </h3>
            
            <div className="space-y-4 pr-11 border-r-2 border-green-200">
              {section.verses.map((verse, vIdx) => {
                const parts = verse.split(' ** ');
                return (
                  <div key={vIdx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    {parts.length === 2 ? (
                      <div className="flex flex-col md:flex-row md:items-center justify-between font-serif text-xl font-bold text-gray-800 leading-loose">
                        <div className="text-right md:flex-1">{parts[0]}</div>
                        <div className="hidden md:block text-green-300 px-4">❀</div>
                        <div className="text-left md:flex-1">{parts[1]}</div>
                      </div>
                    ) : (
                      <div className="text-center font-serif text-xl font-bold text-gray-800 leading-loose">{verse}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}
