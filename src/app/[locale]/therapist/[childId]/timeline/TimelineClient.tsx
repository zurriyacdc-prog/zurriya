'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { addTimelineEvent, deleteTimelineEvent } from '@/lib/supabase/therapist-actions';

type TimelineEvent = {
  id: string; type: string; title_en: string; title_ar: string;
  description_en: string | null; description_ar: string | null; event_date: string;
};

const EVENT_TYPES = [
  { value: 'goal_achieved', en: 'Goal Achieved',  ar: 'هدف محقق',     color: 'bg-sage-pale  text-sage'  },
  { value: 'new_skill',     en: 'New Skill',       ar: 'مهارة جديدة',  color: 'bg-teal-pale  text-teal'  },
  { value: 'milestone',     en: 'Milestone',       ar: 'إنجاز',        color: 'bg-gold-pale  text-gold'  },
  { value: 'assessment',    en: 'Assessment',      ar: 'تقييم',        color: 'bg-coral-pale text-coral' },
  { value: 'new_goal',      en: 'New Goal',        ar: 'هدف جديد',     color: 'bg-teal-pale  text-teal'  },
  { value: 'treatment_plan',en: 'Treatment Plan',  ar: 'خطة العلاج',   color: 'bg-ink/10 text-ink'       },
  { value: 'note',          en: 'Note',            ar: 'ملاحظة',       color: 'bg-paper text-ink-2'      },
];

export default function TimelineClient({
  events, locale, childId,
}: { events: TimelineEvent[]; locale: string; childId: string }) {
  const isAr = locale === 'ar';
  const router  = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [adding, setAdding]          = useState(false);
  const [selType, setSelType]        = useState(EVENT_TYPES[0]!);
  const [error, setError]            = useState('');
  const [isPending, startTransition] = useTransition();

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const fd = new FormData(formRef.current!);
    fd.set('child_id', childId);
    fd.set('type', selType.value);
    startTransition(async () => {
      const result = await addTimelineEvent(fd);
      if (result?.error) { setError(result.error); return; }
      setAdding(false);
      router.refresh();
    });
  }

  function handleDelete(eventId: string) {
    startTransition(async () => {
      await deleteTimelineEvent(eventId, childId);
      router.refresh();
    });
  }

  if (adding) {
    const today = new Date().toISOString().split('T')[0];
    return (
      <div className="p-5 md:p-8 max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setAdding(false)} className="text-ink-2/60 hover:text-teal">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={isAr ? 'rotate-180' : ''}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2 className="text-base font-bold text-ink">{isAr ? 'إضافة حدث' : 'Add Timeline Event'}</h2>
        </div>

        {error && <p className="text-sm text-coral bg-coral-pale rounded-xl px-4 py-3 mb-4">{error}</p>}

        <form ref={formRef} onSubmit={handleAdd} className="space-y-4">
          <div className="bg-white rounded-2xl border border-border shadow-sm px-5 py-4">
            <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-3">{isAr ? 'نوع الحدث' : 'Event Type'}</label>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((t) => (
                <button key={t.value} type="button" onClick={() => setSelType(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selType.value === t.value ? t.color + ' ring-2 ring-offset-1 ring-teal/30' : 'bg-paper border border-border text-ink-2'
                  }`}>
                  {isAr ? t.ar : t.en}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm px-5 py-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-2">{isAr ? 'العنوان (عربي)' : 'Title (Arabic)'}</label>
              <input required name="title_ar" type="text" dir="rtl" placeholder="عنوان الحدث بالعربي"
                className="w-full text-sm text-ink bg-paper rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-2">{isAr ? 'العنوان (إنجليزي)' : 'Title (English)'}</label>
              <input required name="title_en" type="text" placeholder="Event title in English"
                className="w-full text-sm text-ink bg-paper rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm px-5 py-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-2">{isAr ? 'الوصف (عربي)' : 'Description (Arabic)'}</label>
              <textarea name="description_ar" rows={2} dir="rtl" placeholder="وصف اختياري..."
                className="w-full text-sm text-ink bg-paper rounded-xl border border-border px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-teal/20" />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-2">{isAr ? 'الوصف (إنجليزي)' : 'Description (English)'}</label>
              <textarea name="description_en" rows={2} placeholder="Optional description..."
                className="w-full text-sm text-ink bg-paper rounded-xl border border-border px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-teal/20" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm px-5 py-4">
            <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-2">{isAr ? 'التاريخ' : 'Event Date'}</label>
            <input required type="date" name="event_date" defaultValue={today}
              className="w-full text-sm text-ink bg-paper rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" />
          </div>

          <button type="submit" disabled={isPending}
            className="w-full bg-teal text-white font-semibold py-3 rounded-2xl hover:bg-teal-dark transition-colors disabled:opacity-60">
            {isPending ? (isAr ? 'جارٍ الحفظ...' : 'Saving...') : (isAr ? 'إضافة الحدث' : 'Add Event')}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-ink">{isAr ? 'سجل الرحلة' : 'Journey Timeline'}</h2>
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 bg-teal text-white text-xs font-semibold rounded-xl px-3.5 py-2 hover:bg-teal-dark transition-colors">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          {isAr ? 'إضافة حدث' : 'Add Event'}
        </button>
      </div>

      {events.length === 0 && (
        <div className="bg-white rounded-2xl border border-border p-10 text-center">
          <div className="text-4xl mb-3">🗺️</div>
          <p className="text-sm text-ink-2/60">{isAr ? 'لا توجد أحداث بعد' : 'No events yet'}</p>
        </div>
      )}

      <div className="relative">
        <div className="absolute start-[11px] top-3 bottom-3 w-0.5 bg-border" />
        <ul className="space-y-5">
          {events.map((evt) => {
            const typeInfo = EVENT_TYPES.find((t) => t.value === evt.type) ?? EVENT_TYPES[6]!;
            return (
              <li key={evt.id} className="flex gap-4">
                <div className={`w-6 h-6 rounded-full flex-shrink-0 ${typeInfo.color.split(' ')[0]} flex items-center justify-center z-10`}>
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <div className="flex-1 bg-white rounded-2xl border border-border shadow-sm p-4 -mt-0.5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[11px] font-semibold text-ink-2/60">
                      {new Date(evt.event_date).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <button
                      onClick={() => handleDelete(evt.id)}
                      disabled={isPending}
                      className="text-ink-2/30 hover:text-coral transition-colors"
                      title={isAr ? 'حذف' : 'Delete'}
                    >
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeInfo.color}`}>
                    {isAr ? typeInfo.ar : typeInfo.en}
                  </span>
                  <p className="text-sm font-semibold text-ink mt-2">{isAr ? evt.title_ar : evt.title_en}</p>
                  {(isAr ? evt.description_ar : evt.description_en) && (
                    <p className="text-xs text-ink-2 mt-1 leading-relaxed">{isAr ? evt.description_ar : evt.description_en}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
