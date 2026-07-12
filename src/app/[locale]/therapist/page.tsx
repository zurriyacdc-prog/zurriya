import Link                from 'next/link';
import { CHILDREN_LIST }  from '@/lib/portal-mock';
import { ProgressBar }    from '@/components/portal/ui/ProgressBar';

export default function TherapistDashboard({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  const base = `/${locale}/therapist`;

  const active   = CHILDREN_LIST.filter((c) => c.statusEn === 'Active').length;
  const onHold   = CHILDREN_LIST.filter((c) => c.statusEn === 'On Hold').length;

  return (
    <div className="p-5 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink">{isAr ? 'الأطفال' : 'Children'}</h1>
          <p className="text-sm text-ink-2 mt-0.5">
            {isAr ? `${CHILDREN_LIST.length} طفل · ${active} نشط · ${onHold} متوقف`
                   : `${CHILDREN_LIST.length} total · ${active} active · ${onHold} on hold`}
          </p>
        </div>
        <Link
          href={`${base}/new`}
          className="flex items-center gap-2 bg-teal text-white text-sm font-semibold rounded-xl px-4 py-2.5 hover:bg-teal-dark transition-colors shadow-sm"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          {isAr ? 'إضافة طفل' : 'Add Child'}
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {[
          ['All', 'الكل',     `(${CHILDREN_LIST.length})`],
          ['Active', 'نشط',   `(${active})`],
          ['On Hold', 'متوقف', `(${onHold})`],
        ].map(([en, ar, count]) => (
          <button
            key={en}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
              en === 'All'
                ? 'bg-teal text-white'
                : 'bg-white border border-border text-ink-2 hover:border-teal/40'
            }`}
          >
            {isAr ? ar : en} {count}
          </button>
        ))}
      </div>

      {/* Children list */}
      <div className="space-y-3">
        {CHILDREN_LIST.map((child) => (
          <Link
            key={child.id}
            href={`${base}/${child.id}`}
            className="flex items-center gap-4 bg-white rounded-2xl border border-border shadow-sm px-5 py-4 hover:border-teal/30 hover:shadow-md transition-all group"
          >
            {/* Avatar */}
            <div className="w-11 h-11 rounded-full bg-teal-pale flex items-center justify-center flex-shrink-0">
              <span className="text-lg">👦</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-ink">{isAr ? child.nameAr : child.nameEn}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  child.statusEn === 'Active' ? 'bg-sage-pale text-sage' : 'bg-gold-pale text-gold'
                }`}>
                  {isAr ? child.statusAr : child.statusEn}
                </span>
              </div>
              <p className="text-xs text-ink-2/60">
                {isAr ? `${child.age} سنوات · ${child.diagnosisAr}` : `Age ${child.age} · ${child.diagnosisEn}`}
              </p>
              {/* Progress */}
              <div className="flex items-center gap-2 mt-2">
                <ProgressBar pct={child.progress} height="h-1.5" />
                <span className="text-xs font-semibold text-teal flex-shrink-0">{child.progress}%</span>
              </div>
            </div>

            {/* Chevron */}
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={`text-ink-2/30 group-hover:text-teal transition-colors flex-shrink-0 ${isAr ? 'rotate-180' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6"/>
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
