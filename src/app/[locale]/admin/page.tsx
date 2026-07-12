import Link              from 'next/link';
import { USERS, CHILDREN_LIST } from '@/lib/portal-mock';

export default function AdminDashboard({ params: { locale } }: { params: { locale: string } }) {
  const isAr  = locale === 'ar';
  const base  = `/${locale}/admin`;

  const stats = [
    { labelEn: 'Total Users',     labelAr: 'المستخدمون',    val: USERS.length,          icon: '👥', color: 'bg-teal-pale  text-teal'   },
    { labelEn: 'Children',        labelAr: 'الأطفال',       val: CHILDREN_LIST.length,  icon: '👦', color: 'bg-sage-pale  text-sage'   },
    { labelEn: 'Therapists',      labelAr: 'المعالجون',     val: USERS.filter(u=>u.role==='therapist').length, icon: '⚕️', color: 'bg-coral-pale text-coral' },
    { labelEn: 'Parents',         labelAr: 'أولياء الأمور', val: USERS.filter(u=>u.role==='parent').length,    icon: '👨‍👩‍👦', color: 'bg-gold-pale  text-gold'   },
  ];

  const quickLinks = [
    { href: `${base}/users/new`,    labelEn: 'Create New Account',  labelAr: 'إنشاء حساب جديد',    icon: '➕' },
    { href: `${base}/children/new`, labelEn: 'Add New Child',       labelAr: 'إضافة طفل جديد',     icon: '👦' },
    { href: `/${locale}/parent`,    labelEn: 'Preview Parent Portal', labelAr: 'معاينة بوابة الأسرة', icon: '👁️' },
    { href: `/${locale}/therapist`, labelEn: 'Preview Therapist Portal', labelAr: 'معاينة بوابة المعالج', icon: '👁️' },
  ];

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">{isAr ? 'مركز التحكم' : 'Control Center'}</h1>
        <p className="text-sm text-ink-2 mt-0.5">
          {isAr ? 'إدارة المنصة بالكامل من مكان واحد' : 'Manage the entire platform from one place'}
        </p>
      </div>

      {/* Stats */}
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

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-ink-2/60 uppercase tracking-widest mb-3">{isAr ? 'إجراءات سريعة' : 'Quick Actions'}</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="bg-white rounded-2xl border border-border shadow-sm px-4 py-4 flex items-center gap-3 hover:border-teal/30 hover:shadow-md transition-all group"
            >
              <span className="text-xl">{l.icon}</span>
              <span className="text-xs font-semibold text-ink leading-tight">{isAr ? l.labelAr : l.labelEn}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent users */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-ink-2/60 uppercase tracking-widest">{isAr ? 'المستخدمون الأخيرون' : 'Recent Users'}</h2>
          <Link href={`${base}/users`} className="text-xs text-teal font-semibold hover:underline">{isAr ? 'عرض الكل' : 'View all'}</Link>
        </div>
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          {USERS.map((u, idx) => (
            <div key={u.id} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-paper transition-colors ${idx!==USERS.length-1?'border-b border-border/60':''}`}>
              <div className="w-8 h-8 rounded-full bg-teal-pale flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-teal">{(isAr?u.nameAr:u.nameEn).charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{isAr?u.nameAr:u.nameEn}</p>
                <p className="text-xs text-ink-2/60">{u.email}</p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${
                u.role==='admin'     ? 'bg-night text-white' :
                u.role==='therapist' ? 'bg-teal-pale text-teal' :
                                       'bg-sage-pale text-sage'
              }`}>
                {u.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
