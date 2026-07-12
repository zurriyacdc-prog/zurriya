'use client';

import Link             from 'next/link';
import { usePathname }  from 'next/navigation';
import { CHILD }        from '@/lib/portal-mock';

const TABS = [
  { segEn: '',            labelEn: 'Overview',  labelAr: 'نظرة عامة' },
  { segEn: '/plan',       labelEn: 'Plan',      labelAr: 'الخطة'      },
  { segEn: '/sessions',   labelEn: 'Sessions',  labelAr: 'الجلسات'   },
  { segEn: '/reports',    labelEn: 'Files',     labelAr: 'الملفات'   },
  { segEn: '/gallery',    labelEn: 'Gallery',   labelAr: 'الصور'     },
  { segEn: '/timeline',   labelEn: 'Timeline',  labelAr: 'التسلسل'   },
  { segEn: '/reinforcers',labelEn: 'Reinf.',    labelAr: 'المعززات'  },
] as const;

export default function ChildLayout({
  children,
  params: { locale, childId },
}: {
  children: React.ReactNode;
  params: { locale: string; childId: string };
}) {
  const isAr    = locale === 'ar';
  const base    = `/${locale}/therapist/${childId}`;
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Child profile banner */}
      <div className="bg-white border-b border-border px-5 py-4 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <Link href={`/${locale}/therapist`} className="text-ink-2/60 hover:text-teal transition-colors">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={isAr ? 'rotate-180' : ''}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </Link>
          <div className="w-10 h-10 rounded-full bg-teal-pale flex items-center justify-center">
            <span className="text-xl">👦</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-ink">{isAr ? CHILD.nameAr : CHILD.nameEn}</p>
              <span className="text-xs text-ink-2/60">
                {isAr ? `${CHILD.age} سنوات · ${CHILD.genderAr}` : `Age ${CHILD.age} · ${CHILD.genderEn}`}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sage-pale text-sage">
                {isAr ? CHILD.statusAr : CHILD.statusEn}
              </span>
            </div>
            <p className="text-xs text-ink-2/60 mt-0.5">{CHILD.id}</p>
          </div>
          <button className="text-ink-2/40 hover:text-ink transition-colors">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
            </svg>
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {TABS.map((t) => {
            const href   = `${base}${t.segEn}`;
            const active = t.segEn === ''
              ? pathname === base
              : pathname.startsWith(href);
            return (
              <Link
                key={t.segEn}
                href={href}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? 'bg-teal text-white'
                    : 'text-ink-2/60 hover:text-ink hover:bg-paper'
                }`}
              >
                {isAr ? t.labelAr : t.labelEn}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
