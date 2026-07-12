import Link           from 'next/link';
import { CHILD }      from '@/lib/portal-mock';
import { ProgressBar } from '@/components/portal/ui/ProgressBar';
import { ProgressRing } from '@/components/portal/ui/ProgressRing';

export default function ParentHome({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  const base = `/${locale}/parent`;
  const c    = CHILD;

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto space-y-6">

      {/* ── Page title ── */}
      <div>
        <h1 className="text-xl font-bold text-ink">
          {isAr ? 'الملف الشخصي' : 'My Child'}
        </h1>
        <p className="text-sm text-ink-2 mt-0.5">
          {isAr ? 'نظرة عامة على رحلة طفلك' : "An overview of your child's journey"}
        </p>
      </div>

      {/* ── Child profile card ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        {/* Teal banner */}
        <div className="bg-teal h-16 relative" />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-8 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-pale border-4 border-white flex items-center justify-center shadow-sm">
              <span className="text-2xl">👦</span>
            </div>
            <span className="text-[11px] font-semibold text-ink-2/60 bg-paper px-2 py-1 rounded-lg border border-border">
              {c.id}
            </span>
          </div>

          <h2 className="text-lg font-bold text-ink">{isAr ? c.nameAr : c.nameEn}</h2>
          <p className="text-sm text-ink-2 mt-0.5">
            {isAr ? `${c.age} سنوات · ${c.genderAr}` : `Age ${c.age} · ${c.genderEn}`}
          </p>

          {/* Details grid */}
          <div className="grid grid-cols-1 gap-3 mt-5">
            {[
              { labelEn: 'Therapist',      labelAr: 'المعالج',       valEn: c.therapist.nameEn,  valAr: c.therapist.nameAr,    sub: c.therapist.titleEn },
              { labelEn: 'Program',        labelAr: 'البرنامج',       valEn: c.programEn,         valAr: c.programAr },
              { labelEn: 'Diagnosis',      labelAr: 'التشخيص',       valEn: c.diagnosisEn,       valAr: c.diagnosisAr },
              { labelEn: 'Start Date',     labelAr: 'تاريخ البدء',   valEn: c.startDate,         valAr: c.startDateAr },
            ].map(({ labelEn, labelAr, valEn, valAr, sub }) => (
              <div key={labelEn} className="flex items-start justify-between gap-3 py-2.5 border-b border-border/60 last:border-0">
                <span className="text-xs text-ink-2/60 font-medium w-24 flex-shrink-0 pt-0.5">
                  {isAr ? labelAr : labelEn}
                </span>
                <div className="text-end">
                  <span className="text-sm font-medium text-ink">{isAr ? valAr : valEn}</span>
                  {sub && <p className="text-xs text-ink-2/60 mt-0.5">{sub}</p>}
                </div>
              </div>
            ))}
          </div>

          <Link
            href={`${base}/journey`}
            className="mt-5 w-full flex items-center justify-center gap-2 bg-teal text-white text-sm font-semibold rounded-xl py-3 hover:bg-teal-dark transition-colors"
          >
            {isAr ? 'عرض الملف الكامل' : 'View Full Profile'}
          </Link>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { labelEn: 'Active Goals',      labelAr: 'الأهداف النشطة',  val: c.statsEn.activeGoals,    valAr: c.statsAr.activeGoals,    icon: '🎯', color: 'bg-teal-pale text-teal'   },
          { labelEn: 'Sessions',          labelAr: 'الجلسات',          val: c.statsEn.sessions,       valAr: c.statsAr.sessions,       icon: '📅', color: 'bg-sage-pale text-sage'   },
          { labelEn: 'Reports',           labelAr: 'التقارير',         val: c.statsEn.reports,        valAr: c.statsAr.reports,        icon: '📄', color: 'bg-coral-pale text-coral'  },
        ].map((s) => (
          <div key={s.labelEn} className={`${s.color} rounded-2xl p-4 flex flex-col items-center gap-1 text-center`}>
            <span className="text-xl">{s.icon}</span>
            <span className="text-2xl font-bold">{isAr ? s.valAr : s.val}</span>
            <span className="text-[11px] font-medium opacity-70 leading-tight">{isAr ? s.labelAr : s.labelEn}</span>
          </div>
        ))}
      </div>

      {/* ── Overall Progress ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-ink">{isAr ? 'التقدم العام' : 'Overall Progress'}</h3>
          <span className="text-xs text-ink-2/60">{isAr ? 'آخر ٣ أشهر' : 'Last 3 Months'}</span>
        </div>

        <div className="flex items-center gap-6 mb-6">
          <div className="relative flex-shrink-0">
            <ProgressRing pct={c.overallProgress} size={84} stroke={8} />
            <div className="absolute inset-0 flex items-center justify-center rotate-90">
              <span className="text-lg font-bold text-ink">{c.overallProgress}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-sage">{isAr ? 'تقدم رائع!' : 'Making great progress!'}</p>
            <p className="text-xs text-ink-2 mt-1 leading-relaxed">
              {isAr ? c.recentUpdateAr : c.recentUpdateEn}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {c.progressByDomain.map((d) => (
            <div key={d.domainEn}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-ink-2">{isAr ? d.domainAr : d.domainEn}</span>
                <span className="text-xs font-semibold text-ink">{d.pct}%</span>
              </div>
              <ProgressBar pct={d.pct} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick links ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        {[
          { href: `${base}/journey`,     labelEn: 'Journey Timeline',    labelAr: 'رحلة التطور',    subEn: 'Latest: New Skill Introduced',    subAr: 'آخر تحديث: مهارة جديدة',   emoji: '🗺️' },
          { href: `${base}/plan`,        labelEn: 'Treatment Plan',      labelAr: 'خطة العلاج',     subEn: '3 Long-term Goals',               subAr: '٣ أهداف طويلة المدى',       emoji: '📋' },
          { href: `${base}/reports`,     labelEn: 'Reports Library',     labelAr: 'مكتبة التقارير', subEn: '6 Documents',                     subAr: '٦ وثائق',                   emoji: '📄' },
          { href: `${base}/sessions`,    labelEn: 'Session History',     labelAr: 'سجل الجلسات',    subEn: '18 Sessions',                     subAr: '١٨ جلسة',                   emoji: '📅' },
          { href: `${base}/gallery`,     labelEn: 'Growth Gallery',      labelAr: 'معرض النمو',     subEn: '24 Photos, 6 Videos',             subAr: '٢٤ صورة، ٦ فيديوهات',      emoji: '📸' },
          { href: `${base}/reinforcers`, labelEn: 'Favorite Reinforcers',labelAr: 'المعززات المفضلة',subEn: '8 Items',                        subAr: '٨ عناصر',                   emoji: '❤️' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 px-5 py-4 border-b border-border/60 last:border-0 hover:bg-paper transition-colors"
          >
            <span className="text-xl flex-shrink-0">{item.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink">{isAr ? item.labelAr : item.labelEn}</p>
              <p className="text-xs text-ink-2/60 mt-0.5">{isAr ? item.subAr : item.subEn}</p>
            </div>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={`text-ink-2/40 flex-shrink-0 ${isAr ? 'rotate-180' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6"/>
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
