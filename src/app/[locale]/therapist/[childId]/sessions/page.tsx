'use client';

import { useState }    from 'react';
import { SESSIONS }    from '@/lib/portal-mock';
import { RatingStars } from '@/components/portal/ui/RatingStars';

export default function TherapistSessionsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const isAr = locale === 'ar';
  const [recording, setRecording] = useState(false);
  const [score, setScore] = useState(4);

  if (recording) {
    return (
      <div className="p-5 md:p-8 max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setRecording(false)} className="text-ink-2/60 hover:text-teal">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={isAr ? 'rotate-180' : ''}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2 className="text-base font-bold text-ink">{isAr ? 'تسجيل جلسة' : 'Record Session'}</h2>
          <button className="ms-auto text-sm font-semibold text-teal hover:text-teal-dark transition-colors">
            {isAr ? 'حفظ' : 'Save'}
          </button>
        </div>

        <div className="space-y-4">
          {/* Date */}
          <div className="bg-white rounded-2xl border border-border shadow-sm px-5 py-4">
            <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-2">{isAr ? 'تاريخ الجلسة' : 'Session Date'}</label>
            <input type="date" defaultValue="2024-05-20" className="w-full text-sm text-ink bg-paper rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal transition-colors" />
          </div>

          {/* Type & Duration */}
          <div className="bg-white rounded-2xl border border-border shadow-sm px-5 py-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-2">{isAr ? 'نوع الجلسة' : 'Session Type'}</label>
              <select className="w-full text-sm text-ink bg-paper rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal">
                <option>{isAr ? 'علاج فردي' : 'Individual Therapy'}</option>
                <option>{isAr ? 'تدريب الأسرة' : 'Parent Training'}</option>
                <option>{isAr ? 'علاج جماعي' : 'Group Therapy'}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-2">{isAr ? 'المدة' : 'Duration'}</label>
              <select className="w-full text-sm text-ink bg-paper rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal">
                <option>45 {isAr ? 'دقيقة' : 'minutes'}</option>
                <option>60 {isAr ? 'دقيقة' : 'minutes'}</option>
                <option>90 {isAr ? 'دقيقة' : 'minutes'}</option>
              </select>
            </div>
          </div>

          {/* Engagement */}
          <div className="bg-white rounded-2xl border border-border shadow-sm px-5 py-4">
            <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-3">{isAr ? 'مستوى التفاعل' : 'Engagement Score'}</label>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[1,2,3,4,5].map((n) => (
                  <button key={n} onClick={() => setScore(n)}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill={n <= score ? '#EFA530' : 'none'} stroke={n <= score ? '#EFA530' : '#C0B9B1'} strokeWidth="1.5" className="transition-colors">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                    </svg>
                  </button>
                ))}
              </div>
              <span className="text-sm font-semibold text-ink">{score}.0 {isAr ? '— ممتاز' : '— Great'}</span>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-border shadow-sm px-5 py-4">
            <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-2">{isAr ? 'ملاحظات الجلسة' : 'Session Notes'}</label>
            <textarea
              rows={4}
              placeholder={isAr ? 'أضف ملاحظاتك هنا...' : 'Add your notes here...'}
              className="w-full text-sm text-ink bg-paper rounded-xl border border-border px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal transition-colors"
              style={{ direction: isAr ? 'rtl' : 'ltr' }}
            />
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-2xl border border-border shadow-sm px-5 py-4">
            <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-3">{isAr ? 'المرفقات' : 'Attachments'}</label>
            <button className="w-full flex flex-col items-center gap-2 py-6 border-2 border-dashed border-border rounded-xl text-ink-2/60 hover:border-teal/40 hover:text-teal transition-colors text-sm">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              {isAr ? 'رفع ملفات' : 'Upload files'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-ink">{isAr ? 'الجلسات' : 'Sessions'}</h2>
        <button
          onClick={() => setRecording(true)}
          className="flex items-center gap-1.5 bg-teal text-white text-xs font-semibold rounded-xl px-3.5 py-2 hover:bg-teal-dark transition-colors"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          {isAr ? 'تسجيل جلسة' : 'Record Session'}
        </button>
      </div>

      <div className="space-y-3">
        {SESSIONS.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-ink">{isAr ? s.dateAr : s.date}</span>
                <span className="text-ink-2/40 text-xs">·</span>
                <span className="text-xs text-ink-2">{s.time}</span>
              </div>
              <span className="text-xs text-ink-2/60">{s.durationMin} {isAr ? 'دق' : 'min'}</span>
            </div>
            <div className="px-5 py-3.5 flex items-start gap-3">
              <div>
                <p className="text-sm font-medium text-ink">{isAr ? s.typeAr : s.typeEn}</p>
                <div className="flex items-center gap-2 mt-1">
                  <RatingStars score={s.engagementScore} />
                  <span className="text-xs text-ink-2/60">{s.engagementScore}</span>
                </div>
                <p className="text-xs text-ink-2 mt-2 leading-relaxed">{isAr ? s.noteAr : s.noteEn}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
