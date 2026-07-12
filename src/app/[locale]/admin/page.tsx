import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboard({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  const base  = `/${locale}/admin`;
  const supabase = await createClient();

  const [{ count: userCount }, { count: childCount }, { data: profiles }, { data: recentUsers }] =
    await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('children').select('*', { count: 'exact', head: true }).neq('status', 'archived'),
      supabase.from('profiles').select('role'),
      supabase.from('profiles').select('id, name_en, name_ar, role').order('created_at', { ascending: false }).limit(5),
    ]);

  const therapistCount = profiles?.filter(p => p.role === 'therapist').length ?? 0;
  const parentCount    = profiles?.filter(p => p.role === 'parent').length ?? 0;

  const stats = [
    { labelEn: 'Total Users',    labelAr: 'المستخدمون',    val: userCount ?? 0,   icon: '👥', color: 'bg-teal-pale text-teal'  },
    { labelEn: 'Children',       labelAr: 'الأطفال',       val: childCount ?? 0,  icon: '👦', color: 'bg-sage-pale text-sage'  },
    { labelEn: 'Therapists',     labelAr: 'المعالجون',     val: therapistCount,   icon: '⚕️', color: 'bg-coral-pale text-coral' },
    { labelEn: 'Parents',        labelAr: 'أولياء الأمور', val: parentCount,      icon: '👨‍👩‍👦', color: 'bg-gold-pale text-gold'  },
  ];

  const quickLinks = [
    { href: `${base}/users`,     labelEn: 'Manage Users',            labelAr: 'إدارة المستخدمين',    icon: '👥' },
    { href: `${base}/children`,  labelEn: 'Manage Children',         labelAr: 'إدارة الأطفال',       icon: '👦' },
    { href: `${base}/relations`, labelEn: 'Assign Relationships',    labelAr: 'تعيين العلاقات',      icon: '🔗' },
    { href: `/${locale}/parent`, labelEn: 'Preview Parent Portal',   labelAr: 'معاينة بوابة الأسرة', icon: '👁️' },
  ];

  const ROLE_STYLES: Record<string, string> = {
    admin:     'bg-night text-white',
    therapist: 'bg-teal-pale text-teal',
    parent:    'bg-sage-pale text-sage',
  };

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">{isAr ? 'مركز التحكم' : 'Control Center'}</h1>
        <p className="text-sm text-ink-2 mt-0.5">
          {isAr ? 'إدارة المنصة بالكامل من مكان واحد' : 'Manage the entire platform from one place'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.labelEn} className={`${s.color} rounded-2xl p-4 flex items-center gap-3`}>
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-2xl font-bold">{s.val}</p>
              <p className="text-xs font-medium opacity-70">{isAr ? s.labelAr : s.labelEn}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-ink-2/60 uppercase tracking-widest mb-3">
          {isAr ? 'إجراءات سريعة' : 'Quick Actions'}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((l) => (
            <Link key={l.href} href={l.href}
              className="bg-white rounded-2xl border border-border shadow-sm px-4 py-4 flex items-center gap-3 hover:border-teal/30 hover:shadow-md transition-all">
              <span className="text-xl">{l.icon}</span>
              <span className="text-xs font-semibold text-ink leading-tight">{isAr ? l.labelAr : l.labelEn}</span>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-ink-2/60 uppercase tracking-widest">
            {isAr ? 'المستخدمون الأخيرون' : 'Recent Users'}
          </h2>
          <Link href={`${base}/users`} className="text-xs text-teal font-semibold hover:underline">
            {isAr ? 'عرض الكل' : 'View all'}
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          {recentUsers?.length ? recentUsers.map((u, idx) => (
            <div key={u.id} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-paper transition-colors ${idx !== recentUsers.length - 1 ? 'border-b border-border/60' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-teal-pale flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-teal">
                  {(isAr ? u.name_ar : u.name_en).charAt(0)}
                </span>
              </div>
              <p className="flex-1 text-sm font-medium text-ink truncate">{isAr ? u.name_ar : u.name_en}</p>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${ROLE_STYLES[u.role] ?? ''}`}>
                {u.role}
              </span>
            </div>
          )) : (
            <p className="text-sm text-ink-2/50 text-center py-8">
              {isAr ? 'لا يوجد مستخدمون بعد' : 'No users yet'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
