'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { recordSession } from '@/lib/supabase/therapist-actions';

type Session = {
  id: string; session_date: string; type: string;
  duration_minutes: number; engagement_score: number | null;
  notes_en: string | null; notes_ar: string | null;
};

const SESSION_TYPES = [
  { value: 'Individual', en: 'Individual Therapy', ar: 'علاج فردي',    color: 'bg-teal-pale  text-teal'  },
  { value: 'Group',      en: 'Group Therapy',      ar: 'علاج جماعي',   color: 'bg-sage-pale  text-sage'  },
  { value: 'Home Visit', en: 'Home Visit',          ar: 'زيارة منزلية', color: 'bg-gold-pale  text-gold'  },
  { value: 'Assessment', en: 'Assessment',          ar: 'تقييم',        color: 'bg-coral-pale text-coral' },
];

export default function SessionsClient({
  sessions, locale, childId,
}: { sessions: Session[]; locale: string; childId: string }) {
  const isAr = locale === 'ar';
  const router  = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [recording, setRecording]   = useState(false);
  const [score, setScore]           = useState(4);
  const [error, setError]           = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const fd = new FormData(formRef.current!);
    fd.set('child_id', childId);
    fd.set('engagement_score', String(score));
    startTransition(async () => {
      const result = await recordSession(fd);
      if (result?.error) { setError(result.error); return; }
      setRecording(false);
      setScore(4);
      router.refresh();
    });
  }

  if (recording) {
    const today = new Date().toISOString().split('T')[0];
    return (
      <div className="p-5 md:p-8 max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setRecording(false)} className="text-ink-2/60 hover:text-teal">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={isAr ? 'rotate-180' : ''}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2 className="text-base font-bold text-ink">{isAr ? 'تسجيل جلسة' : 'Record Session'}</h2>
        </div>

        {error && <p className="text-sm text-coral bg-coral-pale rounded-xl px-4 py-3 mb-4">{error}</p>}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl border border-border shadow-sm px-5 py-4">
            <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-2">{isAr ? 'تاريخ الجلسة' : 'Session Date'}</label>
            <input required type="date" name="session_date" defaultValue={today}
              className="w-full text-sm text-ink bg-paper rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal" />
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm px-5 py-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-2">{isAr ? 'نوع الجلسة' : 'Session Type'}</label>
              <select name="type" defaultValue="Individual Therapy"
                className="w-full text-sm text-ink bg-paper rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20">
                {SESSION_TYPES.map((t) => <option key={t.value} value={t.value}>{isAr ? t.ar : t.en}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-2">{isAr ? 'المدة (دقيقة)' : 'Duration (minutes)'}</label>
              <select name="duration_minutes" defaultValue="60"
                className="w-full text-sm text-ink bg-paper rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20">
                {[30, 45, 60, 90].map((d) => <option key={d} value={d}>{d} {isAr ? 'دقيقة' : 'minutes'}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm px-5 py-4">
            <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-3">{isAr ? 'مستوى التفاعل' : 'Engagement Score'}</label>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[1,2,3,4,5].map((n) => (
                  <button key={n} type="button" onClick={() => setScore(n)}>
                    <svg width="28" height="28" viewBox="0 0 24 24"
                      fill={n <= score ? '#EFA530' : 'none'}
                      stroke={n <= score ? '#EFA530' : '#C0B9B1'} strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                    </svg>
                  </button>
                ))}
              </div>
              <span className="text-sm font-semibold text-ink">{score}.0</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm px-5 py-4">
            <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-2">{isAr ? 'ملاحظات (عربي)' : 'Notes (Arabic)'}</label>
            <textarea name="notes_ar" rows={3} dir="rtl"
              placeholder="ملاحظاتك بالعربية..."
              className="w-full text-sm text-ink bg-paper rounded-xl border border-border px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-teal/20" />
          </div>
          <div className="bg-white rounded-2xl border border-border shadow-sm px-5 py-4">
            <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-2">{isAr ? 'ملاحظات (إنجليزي)' : 'Notes (English)'}</label>
            <textarea name="notes_en" rows={3}
              placeholder="Your notes in English..."
              className="w-full text-sm text-ink bg-paper rounded-xl border border-border px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-teal/20" />
          </div>

          <button type="submit" disabled={isPending}
            className="w-full bg-teal text-white font-semibold py-3 rounded-2xl hover:bg-teal-dark transition-colors disabled:opacity-60">
            {isPending ? (isAr ? 'جارٍ الحفظ...' : 'Saving...') : (isAr ? 'حفظ الجلسة' : 'Save Session')}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-ink">{isAr ? 'الجلسات' : 'Sessions'}</h2>
        <button onClick={() => setRecording(true)}
          className="flex items-center gap-1.5 bg-teal text-white text-xs font-semibold rounded-xl px-3.5 py-2 hover:bg-teal-dark transition-colors">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          {isAr ? 'تسجيل جلسة' : 'Record Session'}
        </button>
      </div>

      {sessions.length === 0 && (
        <div className="bg-white rounded-2xl border border-border p-10 text-center">
          <div className="text-4xl mb-3">📅</div>
          <p className="text-sm text-ink-2/60">{isAr ? 'لا توجد جلسات بعد. سجّل الجلسة الأولى!' : 'No sessions yet. Record the first one!'}</p>
        </div>
      )}

      <div className="space-y-3">
        {sessions.map((s) => {
          const typeInfo = SESSION_TYPES.find((t) => t.value === s.type) ?? SESSION_TYPES[0]!;
          return (
            <div key={s.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                <span className="text-sm font-semibold text-ink">
                  {new Date(s.session_date).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="text-xs text-ink-2/60">{s.duration_minutes} {isAr ? 'دق' : 'min'}</span>
              </div>
              <div className="px-5 py-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${typeInfo.color}`}>
                    {isAr ? typeInfo.ar : typeInfo.en}
                  </span>
                  {s.engagement_score && (
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((n) => (
                        <svg key={n} width="12" height="12" viewBox="0 0 24 24"
                          fill={n <= s.engagement_score! ? '#EFA530' : 'none'}
                          stroke={n <= s.engagement_score! ? '#EFA530' : '#C0B9B1'} strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                        </svg>
                      ))}
                    </div>
                  )}
                </div>
                {(isAr ? s.notes_ar : s.notes_en) && (
                  <p className="text-xs text-ink-2 leading-relaxed">{isAr ? s.notes_ar : s.notes_en}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
