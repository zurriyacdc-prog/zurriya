import Link from 'next/link';

export default function TherapistMorePage({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  const base  = `/${locale}/therapist`;

  const links = [
    { href: `/${locale}/parent`,     labelEn: 'Parent Portal Preview', labelAr: 'معاينة بوابة الأسرة', icon: '👁️' },
    { href: `${base}`,              labelEn: 'My Children',        labelAr: 'أطفالي',            icon: '👦' },
  ];

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-ink mb-6">{isAr ? 'المزيد' : 'More'}</h1>

      <div className="space-y-3">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-center gap-4 bg-white rounded-2xl border border-border shadow-sm px-5 py-4 hover:border-teal/30 hover:shadow-md transition-all"
          >
            <span className="text-2xl">{l.icon}</span>
            <span className="text-sm font-semibold text-ink">{isAr ? l.labelAr : l.labelEn}</span>
            <svg className="ms-auto text-ink-2/30" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={isAr ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}/>
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
