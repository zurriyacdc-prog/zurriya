import { SESSIONS }    from '@/lib/portal-mock';
import { RatingStars } from '@/components/portal/ui/RatingStars';

export default function SessionsPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';

  const TYPE_COLORS: Record<string, string> = {
    'Individual Therapy': 'bg-teal-pale text-teal',
    'Parent Training':    'bg-sage-pale text-sage',
    'Group Therapy':      'bg-gold-pale text-gold',
  };

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-ink">{isAr ? 'سجل الجلسات' : 'Sessions'}</h1>
        <p className="text-sm text-ink-2 mt-0.5">
          {isAr ? 'كل جلسة علاجية موثقة' : 'A complete record of every therapy session'}
        </p>
      </div>

      {/* Session cards */}
      <div className="space-y-3">
        {SESSIONS.map((s) => {
          const typeLabel = isAr ? s.typeAr : s.typeEn;
          const typeClass = TYPE_COLORS[s.typeEn] ?? 'bg-paper text-ink-2';

          return (
            <div key={s.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              {/* Top strip */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink">{isAr ? s.dateAr : s.date}</span>
                  <span className="text-ink-2/40">·</span>
                  <span className="text-sm text-ink-2">{s.time}</span>
                </div>
                <span className="text-xs font-medium text-ink-2">{s.durationMin} {isAr ? 'دقيقة' : 'min'}</span>
              </div>

              <div className="px-5 py-4">
                {/* Therapist */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {(isAr ? s.therapistAr : s.therapistEn).replace('Dr. ', '').charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">{isAr ? s.therapistAr : s.therapistEn}</p>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${typeClass}`}>
                      {typeLabel}
                    </span>
                  </div>
                </div>

                {/* Engagement */}
                <div className="flex items-center gap-2 mb-3">
                  <RatingStars score={s.engagementScore} />
                  <span className="text-xs text-ink-2">{s.engagementScore} · {isAr ? 'مستوى التفاعل' : 'Engagement'}</span>
                </div>

                {/* Note */}
                <p className="text-xs text-ink-2 leading-relaxed bg-paper rounded-xl px-4 py-3">
                  {isAr ? s.noteAr : s.noteEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
