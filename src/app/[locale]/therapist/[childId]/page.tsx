import Link             from 'next/link';
import { CHILD }        from '@/lib/portal-mock';
import { ProgressBar }  from '@/components/portal/ui/ProgressBar';
import { ProgressRing } from '@/components/portal/ui/ProgressRing';

export default function TherapistChildProfile({
  params: { locale, childId },
}: {
  params: { locale: string; childId: string };
}) {
  const isAr = locale === 'ar';
  const base = `/${locale}/therapist/${childId}`;
  const c    = CHILD;

  return (
    <div className="p-5 md:p-8 space-y-5 max-w-2xl mx-auto">

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { labelEn: 'Active Goals',     labelAr: 'الأهداف النشطة',  val: c.statsEn.activeGoals,    valAr: c.statsAr.activeGoals,    color: 'bg-teal-pale   text-teal'   },
          { labelEn: 'Sessions',         labelAr: 'الجلسات',          val: c.statsEn.sessions,       valAr: c.statsAr.sessions,       color: 'bg-sage-pale   text-sage'   },
          { labelEn: 'Completed Goals',  labelAr: 'الأهداف المحققة',  val: c.statsEn.completedGoals, valAr: c.statsAr.completedGoals, color: 'bg-coral-pale  text-coral'  },
          { labelEn: 'Reports',          labelAr: 'التقارير',         val: c.statsEn.reports,        valAr: c.statsAr.reports,        color: 'bg-gold-pale   text-gold'   },
        ].map((s) => (
          <div key={s.labelEn} className={`${s.color} rounded-2xl px-4 py-3 flex items-center gap-3`}>
            <span className="text-2xl font-bold">{isAr ? s.valAr : s.val}</span>
            <span className="text-xs font-medium opacity-70 leading-tight">{isAr ? s.labelAr : s.labelEn}</span>
          </div>
        ))}
      </div>

      {/* Diagnosis & Program */}
      <div className="bg-white rounded-2xl border border-border shadow-sm divide-y divide-border/60">
        {[
          { icon: '🔍', labelEn: 'Diagnosis', labelAr: 'التشخيص', valEn: c.diagnosisEn, valAr: c.diagnosisAr },
          { icon: '📚', labelEn: 'Program',   labelAr: 'البرنامج', valEn: c.programEn,   valAr: c.programAr   },
          { icon: '👩‍⚕️', labelEn: 'Therapist', labelAr: 'المعالج',  valEn: c.therapist.nameEn, valAr: c.therapist.nameAr },
          { icon: '📅', labelEn: 'Start Date',labelAr: 'تاريخ البدء',valEn: c.startDate, valAr: c.startDateAr },
        ].map(({ icon, labelEn, labelAr, valEn, valAr }) => (
          <div key={labelEn} className="flex items-center gap-3 px-5 py-3.5">
            <span className="text-base flex-shrink-0">{icon}</span>
            <span className="text-xs text-ink-2/60 w-20 flex-shrink-0">{isAr ? labelAr : labelEn}</span>
            <span className="text-sm font-medium text-ink">{isAr ? valAr : valEn}</span>
          </div>
        ))}
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
        <h3 className="text-sm font-semibold text-ink mb-4">{isAr ? 'التقدم العام' : 'Overall Progress'}</h3>
        <div className="flex items-center gap-5 mb-5">
          <div className="relative flex-shrink-0">
            <ProgressRing pct={c.overallProgress} size={72} stroke={7} />
            <div className="absolute inset-0 flex items-center justify-center rotate-90">
              <span className="text-base font-bold text-ink">{c.overallProgress}%</span>
            </div>
          </div>
          <div className="flex-1 space-y-2.5">
            {c.progressByDomain.map((d) => (
              <div key={d.domainEn}>
                <div className="flex justify-between mb-1">
                  <span className="text-[11px] text-ink-2">{isAr ? d.domainAr : d.domainEn}</span>
                  <span className="text-[11px] font-semibold text-teal">{d.pct}%</span>
                </div>
                <ProgressBar pct={d.pct} height="h-1.5" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action shortcuts */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { href: `${base}/plan`,      labelEn: 'Treatment Plan',   labelAr: 'خطة العلاج',   emoji: '📋', color: 'bg-teal-pale   text-teal'  },
          { href: `${base}/sessions`,  labelEn: 'Record Session',   labelAr: 'تسجيل جلسة',   emoji: '➕', color: 'bg-coral-pale  text-coral'  },
          { href: `${base}/timeline`,  labelEn: 'Add Event',        labelAr: 'إضافة حدث',    emoji: '🗓️', color: 'bg-sage-pale   text-sage'   },
          { href: `${base}/reports`,   labelEn: 'Upload Report',    labelAr: 'رفع تقرير',    emoji: '📤', color: 'bg-gold-pale   text-gold'   },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className={`${a.color} rounded-2xl p-4 flex items-center gap-3 hover:opacity-80 transition-opacity`}
          >
            <span className="text-xl">{a.emoji}</span>
            <span className="text-sm font-semibold">{isAr ? a.labelAr : a.labelEn}</span>
          </Link>
        ))}
      </div>

      {/* Parent preview link */}
      <Link
        href={`/${locale}/parent`}
        className="flex items-center gap-3 bg-white border border-teal/20 rounded-2xl px-5 py-4 hover:bg-teal-pale/30 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-teal-pale flex items-center justify-center">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-teal">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-teal">{isAr ? 'معاينة كما يراه ولي الأمر' : 'Preview as Parent'}</p>
          <p className="text-xs text-ink-2/60 mt-0.5">{isAr ? 'تحقق من تجربة الأسرة' : "See what the family sees"}</p>
        </div>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={`text-teal/60 ${isAr ? 'rotate-180' : ''}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6"/>
        </svg>
      </Link>
    </div>
  );
}
