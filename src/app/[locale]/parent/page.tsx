import Link            from 'next/link';
import { redirect }    from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { adminClient }  from '@/lib/supabase/admin';
import { ProgressBar }  from '@/components/portal/ui/ProgressBar';
import { ProgressRing } from '@/components/portal/ui/ProgressRing';
import { AvatarDisplay } from '@/components/portal/AvatarPicker';

export default async function ParentHome({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  const base  = `/${locale}/parent`;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  // Use adminClient to bypass RLS — parent users can't read child_relationships via RLS
  const { data: rel } = await adminClient
    .from('child_relationships')
    .select('child_id, therapist_id')
    .eq('parent_id', user.id)
    .single();

  if (!rel?.child_id) {
    return (
      <div className="p-8 max-w-md mx-auto text-center space-y-4 mt-16">
        <div className="text-5xl">👋</div>
        <h1 className="text-xl font-bold text-ink">{isAr ? 'مرحباً بك' : 'Welcome'}</h1>
        <p className="text-sm text-ink-2 leading-relaxed">
          {isAr
            ? 'لم يتم ربط حسابك بملف طفل بعد. يرجى التواصل مع مركز زرية.'
            : "Your account hasn't been linked to a child profile yet. Please contact the Zurriya team."}
        </p>
      </div>
    );
  }

  // Fetch child + therapist + counts in parallel
  const [{ data: child }, therapistResult, { count: goalCount }, { count: sessionCount }, { count: reportCount }] =
    await Promise.all([
      supabase.from('children').select('*').eq('id', rel.child_id).single(),
      rel.therapist_id
        ? supabase.from('profiles').select('name_en, name_ar').eq('id', rel.therapist_id).single()
        : Promise.resolve({ data: null, error: null }),
      supabase.from('goals').select('*', { count: 'exact', head: true }).eq('child_id', rel.child_id).eq('is_active', true),
      supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('child_id', rel.child_id),
      supabase.from('reports').select('*', { count: 'exact', head: true }).eq('child_id', rel.child_id),
    ]);

  if (!child) redirect(`/${locale}/parent`);

  const therapistProfile = therapistResult?.data;

  const quickLinks = [
    { href: `${base}/journey`,     labelEn: 'Journey Timeline',     labelAr: 'رحلة التطور',     emoji: '🗺️' },
    { href: `${base}/plan`,        labelEn: 'Treatment Plan',       labelAr: 'خطة العلاج',      emoji: '📋' },
    { href: `${base}/reports`,     labelEn: 'Reports Library',      labelAr: 'مكتبة التقارير',  emoji: '📄' },
    { href: `${base}/sessions`,    labelEn: 'Session History',      labelAr: 'سجل الجلسات',     emoji: '📅' },
    { href: `${base}/gallery`,     labelEn: 'Growth Gallery',       labelAr: 'معرض النمو',      emoji: '📸' },
    { href: `${base}/reinforcers`, labelEn: 'Favorite Reinforcers', labelAr: 'المعززات المفضلة', emoji: '❤️' },
  ];

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">{isAr ? 'الملف الشخصي' : 'My Child'}</h1>
        <p className="text-sm text-ink-2 mt-0.5">{isAr ? 'نظرة عامة على رحلة طفلك' : "An overview of your child's journey"}</p>
      </div>

      {/* Child profile card */}
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="bg-teal h-16" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-8 mb-4">
            <div className="rounded-2xl border-4 border-white shadow-sm">
              <AvatarDisplay avatar={child.avatar_emoji || '👦'} size="lg" />
            </div>
            <span className="text-[11px] font-semibold text-ink-2/60 bg-paper px-2 py-1 rounded-lg border border-border font-mono">
              {child.id.slice(0, 8).toUpperCase()}
            </span>
          </div>

          <h2 className="text-lg font-bold text-ink">{isAr ? child.name_ar : child.name_en}</h2>
          <p className="text-sm text-ink-2 mt-0.5">{isAr ? `${child.age} سنوات` : `Age ${child.age}`}</p>

          <div className="grid grid-cols-1 gap-0 mt-5">
            {[
              { labelEn: 'Therapist',  labelAr: 'المعالج',  val: therapistProfile
                  ? (isAr ? (therapistProfile.name_ar || therapistProfile.name_en || '') : (therapistProfile.name_en || therapistProfile.name_ar || ''))
                  : (isAr ? 'لم يتم التعيين بعد' : 'Not assigned yet') },
              { labelEn: 'Diagnosis',  labelAr: 'التشخيص',  val: isAr ? child.diagnosis_ar : child.diagnosis_en },
              { labelEn: 'Status',     labelAr: 'الحالة',   val: isAr ? (child.status === 'active' ? 'نشط' : child.status) : child.status },
            ].map(({ labelEn, labelAr, val }) => (
              <div key={labelEn} className="flex items-center justify-between py-2.5 border-b border-border/60 last:border-0">
                <span className="text-xs text-ink-2/60 font-medium">{isAr ? labelAr : labelEn}</span>
                <span className="text-sm font-medium text-ink">{val}</span>
              </div>
            ))}
          </div>

          <Link href={`${base}/journey`}
            className="mt-5 w-full flex items-center justify-center gap-2 bg-teal text-white text-sm font-semibold rounded-xl py-3 hover:bg-teal-dark transition-colors">
            {isAr ? 'عرض رحلة التطور' : 'View Journey'}
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { labelEn: 'Active Goals', labelAr: 'الأهداف',  val: goalCount ?? 0,    icon: '🎯', color: 'bg-teal-pale text-teal'  },
          { labelEn: 'Sessions',     labelAr: 'الجلسات',   val: sessionCount ?? 0, icon: '📅', color: 'bg-sage-pale text-sage'  },
          { labelEn: 'Reports',      labelAr: 'التقارير',  val: reportCount ?? 0,  icon: '📄', color: 'bg-coral-pale text-coral' },
        ].map((s) => (
          <div key={s.labelEn} className={`${s.color} rounded-2xl p-4 flex flex-col items-center gap-1 text-center`}>
            <span className="text-xl">{s.icon}</span>
            <span className="text-2xl font-bold">{s.val}</span>
            <span className="text-[11px] font-medium opacity-70 leading-tight">{isAr ? s.labelAr : s.labelEn}</span>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        {quickLinks.map((item) => (
          <Link key={item.href} href={item.href}
            className="flex items-center gap-4 px-5 py-4 border-b border-border/60 last:border-0 hover:bg-paper transition-colors">
            <span className="text-xl flex-shrink-0">{item.emoji}</span>
            <span className="flex-1 text-sm font-medium text-ink">{isAr ? item.labelAr : item.labelEn}</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              className={`text-ink-2/40 flex-shrink-0 ${isAr ? 'rotate-180' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6"/>
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
