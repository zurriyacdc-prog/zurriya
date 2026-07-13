import { redirect }         from 'next/navigation';
import { getParentChildId } from '@/lib/supabase/portal-data';
import { createClient }     from '@/lib/supabase/server';

const TYPE_MAP: Record<string, [string, string, string]> = {
  'Individual': ['Individual Therapy', 'علاج فردي',    'bg-teal-pale text-teal'],
  'Group':      ['Group Therapy',      'علاج جماعي',   'bg-sage-pale text-sage'],
  'Home Visit': ['Home Visit',         'زيارة منزلية', 'bg-gold-pale text-gold'],
  'Assessment': ['Assessment',         'تقييم',        'bg-coral-pale text-coral'],
};

export default async function ParentSessionsPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr    = locale === 'ar';
  const childId = await getParentChildId();
  if (!childId) redirect(`/${locale}/parent`);

  const supabase = await createClient();

  const [{ data: sessions }, { data: rel }] = await Promise.all([
    supabase.from('sessions').select('*').eq('child_id', childId).order('session_date', { ascending: false }),
    supabase.from('child_relationships').select('therapist_id').eq('child_id', childId).single(),
  ]);

  let therapistName = '';
  if (rel?.therapist_id) {
    const { data: tp } = await supabase.from('profiles').select('name_en, name_ar').eq('id', rel.therapist_id).single();
    therapistName = isAr ? (tp?.name_ar || tp?.name_en || '') : (tp?.name_en || tp?.name_ar || '');
  }

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-ink">{isAr ? 'سجل الجلسات' : 'Sessions'}</h1>
        <p className="text-sm text-ink-2 mt-0.5">
          {isAr ? 'كل جلسة علاجية موثقة' : 'A complete record of every therapy session'}
        </p>
      </div>

      {sessions?.length === 0 && (
        <div className="bg-white rounded-2xl border border-border p-10 text-center">
          <div className="text-4xl mb-3">📅</div>
          <p className="text-sm text-ink-2/60">{isAr ? 'لا توجد جلسات مسجلة بعد' : 'No sessions recorded yet'}</p>
        </div>
      )}

      <div className="space-y-3">
        {sessions?.map((s) => {
          const [enLabel, arLabel, typeClass] = TYPE_MAP[s.type] ?? ['Session', 'جلسة', 'bg-paper text-ink-2'];
          const therapist = therapistName;
          const initials  = therapist.replace(/^Dr\.\s*/, '').charAt(0) || 'T';
          return (
            <div key={s.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink">
                    {new Date(s.session_date).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <span className="text-xs font-medium text-ink-2">{s.duration_minutes} {isAr ? 'دقيقة' : 'min'}</span>
              </div>
              <div className="px-5 py-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{initials}</span>
                  </div>
                  <div>
                    {therapist && <p className="text-sm font-medium text-ink">{therapist}</p>}
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${typeClass}`}>
                      {isAr ? arLabel : enLabel}
                    </span>
                  </div>
                </div>
                {s.engagement_score && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((n) => (
                        <svg key={n} width="14" height="14" viewBox="0 0 24 24"
                          fill={n <= s.engagement_score ? '#EFA530' : 'none'}
                          stroke={n <= s.engagement_score ? '#EFA530' : '#C0B9B1'}
                          strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-ink-2">{s.engagement_score} · {isAr ? 'مستوى التفاعل' : 'Engagement'}</span>
                  </div>
                )}
                {(isAr ? s.notes_ar : s.notes_en) && (
                  <p className="text-xs text-ink-2 leading-relaxed bg-paper rounded-xl px-4 py-3">
                    {isAr ? s.notes_ar : s.notes_en}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
