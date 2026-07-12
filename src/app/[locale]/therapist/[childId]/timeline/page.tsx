'use client';

import { useState }  from 'react';
import { TIMELINE }  from '@/lib/portal-mock';

const EVENT_TYPES = [
  { en: 'Goal Achieved',       ar: 'هدف محقق',      color: 'bg-sage-pale  text-sage'   },
  { en: 'New Skill',           ar: 'مهارة جديدة',    color: 'bg-teal-pale  text-teal'   },
  { en: 'Session Milestone',   ar: 'معلم الجلسات',   color: 'bg-coral-pale text-coral'  },
  { en: 'Assessment',          ar: 'تقييم',          color: 'bg-gold-pale  text-gold'   },
  { en: 'New Goal',            ar: 'هدف جديد',       color: 'bg-teal-pale  text-teal'   },
  { en: 'Treatment Plan',      ar: 'خطة العلاج',     color: 'bg-teal-pale  text-teal'   },
];

const DOT: Record<string, string> = {
  teal: 'bg-teal', coral: 'bg-coral', sage: 'bg-sage', gold: 'bg-gold',
};

export default function TherapistTimelinePage({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  const [adding, setAdding] = useState(false);
  const [selType, setSelType] = useState(EVENT_TYPES[0]);

  if (adding) {
    return (
      <div className="p-5 md:p-8 max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setAdding(false)} className="text-ink-2/60 hover:text-teal">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={isAr ? 'rotate-180' : ''}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2 className="text-base font-bold text-ink">{isAr ? 'إضافة حدث' : 'Add Timeline Event'}</h2>
          <button
            onClick={() => setAdding(false)}
            className="ms-auto text-sm font-semibold text-teal hover:text-teal-dark"
          >
            {isAr ? 'حفظ' : 'Save'}
          </button>
        </div>

        <div className="space-y-4">
          {/* Event type */}
          <div className="bg-white rounded-2xl border border-border shadow-sm px-5 py-4">
            <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-3">{isAr ? 'نوع الحدث' : 'Event Type'}</label>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((t) => (
                <button
                  key={t.en}
                  onClick={() => setSelType(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selType.en === t.en ? t.color + ' ring-2 ring-offset-1 ring-teal/30' : 'bg-paper border border-border text-ink-2'
                  }`}
                >
                  {isAr ? t.ar : t.en}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="bg-white rounded-2xl border border-border shadow-sm px-5 py-4">
            <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-2">{isAr ? 'العنوان' : 'Title'}</label>
            <input
              type="text"
              placeholder={isAr ? 'عنوان الحدث' : 'Event title'}
              className="w-full text-sm text-ink bg-paper rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
              style={{ direction: isAr ? 'rtl' : 'ltr' }}
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-border shadow-sm px-5 py-4">
            <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-2">{isAr ? 'الوصف' : 'Description'}</label>
            <textarea
              rows={3}
              placeholder={isAr ? 'وصف الحدث...' : 'Describe what happened...'}
              className="w-full text-sm text-ink bg-paper rounded-xl border border-border px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
              style={{ direction: isAr ? 'rtl' : 'ltr' }}
            />
          </div>

          {/* Date */}
          <div className="bg-white rounded-2xl border border-border shadow-sm px-5 py-4">
            <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-2">{isAr ? 'التاريخ' : 'Event Date'}</label>
            <input type="date" defaultValue="2024-05-20" className="w-full text-sm text-ink bg-paper rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal" />
          </div>

          {/* Photo attach */}
          <div className="bg-white rounded-2xl border border-border shadow-sm px-5 py-4">
            <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-3">{isAr ? 'صور مرفقة (اختياري)' : 'Attachments (optional)'}</label>
            <button className="w-full flex flex-col items-center gap-2 py-5 border-2 border-dashed border-border rounded-xl text-ink-2/60 hover:border-teal/40 hover:text-teal text-sm transition-colors">
              <span className="text-2xl">📸</span>
              {isAr ? 'إضافة صورة' : 'Add photo'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-ink">{isAr ? 'سجل الرحلة' : 'Journey Timeline'}</h2>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 bg-teal text-white text-xs font-semibold rounded-xl px-3.5 py-2 hover:bg-teal-dark transition-colors"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          {isAr ? 'إضافة حدث' : 'Add Event'}
        </button>
      </div>

      <div className="relative">
        <div className="absolute start-[11px] top-3 bottom-3 w-0.5 bg-border" />
        <ul className="space-y-5">
          {TIMELINE.map((evt) => (
            <li key={evt.id} className="flex gap-4">
              <div className={`w-6 h-6 rounded-full flex-shrink-0 ${DOT[evt.typeColor]} flex items-center justify-center z-10`}>
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <div className="flex-1 bg-white rounded-2xl border border-border shadow-sm p-4 -mt-0.5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-[11px] font-semibold text-ink-2/60">{isAr ? evt.dateAr : evt.date}</span>
                  <button className="text-ink-2/40 hover:text-teal transition-colors">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                </div>
                <p className="text-sm font-semibold text-ink">{isAr ? evt.titleAr : evt.titleEn}</p>
                <p className="text-xs text-ink-2 mt-1 leading-relaxed">{isAr ? evt.descAr : evt.descEn}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
