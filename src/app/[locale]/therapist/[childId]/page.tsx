import Link            from 'next/link';
import { notFound }   from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function TherapistChildOverview({
  params: { locale, childId },
}: {
  params: { locale: string; childId: string };
}) {
  const isAr = locale === 'ar';
  const base  = `/${locale}/therapist/${childId}`;
  const supabase = await createClient();

  const [{ data: child }, { count: goalCount }, { count: sessionCount }, { count: reportCount }, { data: rel }] =
    await Promise.all([
      supabase.from('children').select('*').eq('id', childId).single(),
      supabase.from('goals').select('*', { count: 'exact', head: true }).eq('child_id', childId).eq('is_active', true),
      supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('child_id', childId),
      supabase.from('reports').select('*', { count: 'exact', head: true }).eq('child_id', childId),
      supabase.from('child_relationships').select('parent_id').eq('child_id', childId).single(),
    ]);

  if (!child) notFound();

  const stats = [
    { labelEn: 'Active Goals', labelAr: 'أهداف نشطة', val: goalCount ?? 0,    icon: '🎯', color: 'bg-teal-pale text-teal'  },
    { labelEn: 'Sessions',     labelAr: 'الجلسات',     val: sessionCount ?? 0, icon: '📅', color: 'bg-sage-pale text-sage'  },
    { labelEn: 'Reports',      labelAr: 'التقارير',    val: reportCount ?? 0,  icon: '📄', color: 'bg-coral-pale text-coral' },
    { labelEn: 'Status',       labelAr: 'الحالة',      val: child.status,      icon: '✅', color: 'bg-gold-pale text-gold'  },
  ];

  const shortcuts = [
    { href: `${base}/sessions`, labelEn: 'Record Session', labelAr: 'تسجيل جلسة', icon: '📝', color: 'bg-teal text-white' },
    { href: `${base}/timeline`, labelEn: 'Add Event',      labelAr: 'إضافة حدث',  icon: '📌', color: 'bg-sage text-white' },
    { href: `${base}/reports`,  labelEn: 'Upload Report',  labelAr: 'رفع تقرير',  icon: '📤', color: 'bg-coral text-white' },
    { href: `/${locale}/parent`, labelEn: 'Parent View',   labelAr: 'عرض الأهل',  icon: '👁️', color: 'bg-ink/10 text-ink'  },
  ];

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.labelEn} className={`${s.color} rounded-2xl p-4 flex items-center gap-3`}>
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-xl font-bold">{s.val}</p>
              <p className="text-xs font-medium opacity-70">{isAr ? s.labelAr : s.labelEn}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
        <h3 className="text-sm font-semibold text-ink-2/60 uppercase tracking-widest mb-4">
          {isAr ? 'معلومات الطفل' : 'Child Info'}
        </h3>
        <div className="space-y-0">
          {[
            { labelEn: 'Diagnosis',  labelAr: 'التشخيص',   val: isAr ? child.diagnosis_ar : child.diagnosis_en },
            { labelEn: 'Age',        labelAr: 'العمر',      val: isAr ? `${child.age} سنوات` : `${child.age} years` },
            { labelEn: 'Status',     labelAr: 'الحالة',     val: child.status },
            { labelEn: 'Child ID',   labelAr: 'رقم الملف', val: child.id.slice(0, 8).toUpperCase() },
          ].map(({ labelEn, labelAr, val }) => (
            <div key={labelEn} className="flex items-center justify-between py-2.5 border-b border-border/60 last:border-0">
              <span className="text-xs text-ink-2/60">{isAr ? labelAr : labelEn}</span>
              <span className="text-sm font-medium text-ink">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        {shortcuts.map((s) => (
          <Link key={s.href} href={s.href}
            className={`${s.color} rounded-2xl px-4 py-4 flex items-center gap-3 shadow-sm hover:opacity-90 transition-opacity`}>
            <span className="text-xl">{s.icon}</span>
            <span className="text-sm font-semibold leading-tight">{isAr ? s.labelAr : s.labelEn}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
