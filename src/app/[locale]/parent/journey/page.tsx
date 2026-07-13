import { redirect }         from 'next/navigation';
import { getParentChildId } from '@/lib/supabase/portal-data';
import { createClient }     from '@/lib/supabase/server';

const TYPE_CONFIG: Record<string, { color: string; dot: string; labelEn: string; labelAr: string }> = {
  goal_achieved:  { color: 'bg-sage-pale text-sage',     dot: 'bg-sage',     labelEn: 'Goal Achieved',   labelAr: 'هدف محقق'     },
  new_skill:      { color: 'bg-teal-pale text-teal',     dot: 'bg-teal',     labelEn: 'New Skill',       labelAr: 'مهارة جديدة'  },
  milestone:      { color: 'bg-gold-pale text-gold',     dot: 'bg-gold',     labelEn: 'Milestone',       labelAr: 'إنجاز'        },
  assessment:     { color: 'bg-coral-pale text-coral',   dot: 'bg-coral',    labelEn: 'Assessment',      labelAr: 'تقييم'        },
  new_goal:       { color: 'bg-teal-pale text-teal',     dot: 'bg-teal',     labelEn: 'New Goal',        labelAr: 'هدف جديد'     },
  treatment_plan: { color: 'bg-ink/10 text-ink',         dot: 'bg-ink',      labelEn: 'Treatment Plan',  labelAr: 'خطة العلاج'   },
  intake:         { color: 'bg-coral-pale text-coral',   dot: 'bg-coral',    labelEn: 'Intake',          labelAr: 'التسجيل'      },
  note:           { color: 'bg-paper text-ink-2',        dot: 'bg-ink-2/40', labelEn: 'Note',            labelAr: 'ملاحظة'       },
};

export default async function ParentJourneyPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr    = locale === 'ar';
  const childId = await getParentChildId();
  if (!childId) redirect(`/${locale}/parent`);

  const supabase = await createClient();
  const { data: events } = await supabase
    .from('timeline_events')
    .select('*')
    .eq('child_id', childId)
    .order('event_date', { ascending: false });

  // Group by month+year
  const groups: Record<string, typeof events> = {};
  for (const e of events ?? []) {
    const date = new Date(e.event_date);
    const key  = `${date.getFullYear()}-${date.getMonth()}`;
    if (!groups[key]) groups[key] = [];
    groups[key]!.push(e);
  }

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-ink">{isAr ? 'رحلة التطور' : 'Journey Timeline'}</h1>
        <p className="text-sm text-ink-2 mt-0.5">{events?.length ?? 0} {isAr ? 'حدث مسجل' : 'recorded events'}</p>
      </div>

      {events?.length === 0 && (
        <div className="bg-white rounded-2xl border border-border p-10 text-center">
          <div className="text-4xl mb-3">🗺️</div>
          <p className="text-sm text-ink-2/60">{isAr ? 'لا توجد أحداث مسجلة بعد' : 'No events recorded yet'}</p>
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(groups).map(([, groupEvents]) => {
          const first = new Date(groupEvents![0]!.event_date);
          const monthLabel = first.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' });
          return (
            <div key={groupEvents![0]!.event_date}>
              <p className="text-xs font-bold text-ink-2/50 uppercase tracking-widest mb-4">{monthLabel}</p>
              <div className="space-y-4 ps-4 border-s-2 border-border">
                {groupEvents!.map((e) => {
                  const cfg = TYPE_CONFIG[e.type] ?? TYPE_CONFIG.note!;
                  return (
                    <div key={e.id} className="relative">
                      <div className={`absolute -start-[21px] top-3 w-3 h-3 rounded-full border-2 border-white ${cfg.dot}`} />
                      <div className="bg-white rounded-2xl border border-border shadow-sm p-4 ms-2">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.color}`}>
                            {isAr ? cfg.labelAr : cfg.labelEn}
                          </span>
                          <span className="text-[11px] text-ink-2/50 flex-shrink-0">
                            {new Date(e.event_date).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-ink">{isAr ? e.title_ar : e.title_en}</p>
                        {(isAr ? e.description_ar : e.description_en) && (
                          <p className="text-xs text-ink-2/70 mt-1 leading-relaxed">{isAr ? e.description_ar : e.description_en}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
