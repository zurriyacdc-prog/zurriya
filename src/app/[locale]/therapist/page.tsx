import Link            from 'next/link';
import { redirect }   from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function TherapistDashboard({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  // Get all children assigned to this therapist
  const { data: rels } = await supabase
    .from('child_relationships')
    .select('child_id')
    .eq('therapist_id', user.id);

  const childIds = (rels ?? []).map(r => r.child_id);

  const raw = childIds.length > 0
    ? (await supabase.from('children').select('id, name_en, name_ar, age, diagnosis_en, diagnosis_ar, status').in('id', childIds).order('name_en')).data ?? []
    : [];

  // Active/on-hold first, archived at bottom
  const children = [
    ...raw.filter(c => c.status !== 'archived'),
    ...raw.filter(c => c.status === 'archived'),
  ];

  const activeCount  = children.filter(c => c.status === 'active').length;
  const onHoldCount  = children.filter(c => c.status === 'on_hold').length;

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">{isAr ? 'أطفالي' : 'My Children'}</h1>
          <p className="text-sm text-ink-2 mt-0.5">
            {children.length} {isAr ? 'طفل' : 'children'} · {activeCount} {isAr ? 'نشط' : 'active'} · {onHoldCount} {isAr ? 'موقوف' : 'on hold'}
          </p>
        </div>
      </div>

      {children.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border shadow-sm p-10 text-center space-y-3">
          <div className="text-4xl">👦</div>
          <p className="text-sm font-semibold text-ink">{isAr ? 'لا يوجد أطفال معينون لك بعد' : 'No children assigned yet'}</p>
          <p className="text-xs text-ink-2/60">{isAr ? 'تواصل مع المدير لتعيين الأطفال' : 'Contact your admin to get children assigned'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {children.map((child) => {
            const isArchived = child.status === 'archived';
            const statusColor = child.status === 'active' ? 'bg-sage-pale text-sage'
              : child.status === 'on_hold' ? 'bg-gold-pale text-gold'
              : 'bg-ink/10 text-ink-2/60';
            const statusLabel = isAr
              ? (child.status === 'active' ? 'نشط' : child.status === 'on_hold' ? 'موقوف' : 'مؤرشف')
              : child.status;
            return (
            <Link
              key={child.id}
              href={`/${locale}/therapist/${child.id}`}
              className={`flex items-center gap-4 bg-white rounded-2xl border border-border shadow-sm px-5 py-4 hover:border-teal/30 hover:shadow-md transition-all ${isArchived ? 'opacity-50' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isArchived ? 'bg-ink/10 grayscale' : 'bg-teal-pale'}`}>
                <span className="text-lg">👦</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-ink">{isAr ? child.name_ar : child.name_en}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor}`}>
                    {statusLabel}
                  </span>
                </div>
                <p className="text-xs text-ink-2/60">
                  {isAr ? `${child.age} سنوات · ${child.diagnosis_ar}` : `Age ${child.age} · ${child.diagnosis_en}`}
                </p>
              </div>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                className={`text-ink-2/40 flex-shrink-0 ${isAr ? 'rotate-180' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6"/>
              </svg>
            </Link>
          );
          })}
        </div>
      )}
    </div>
  );
}
