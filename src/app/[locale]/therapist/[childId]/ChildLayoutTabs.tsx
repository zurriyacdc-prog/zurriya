'use client';

import Link             from 'next/link';
import { usePathname }  from 'next/navigation';
import { AvatarDisplay } from '@/components/portal/AvatarPicker';

const TABS = [
  { seg: '',             labelEn: 'Overview',  labelAr: 'نظرة عامة' },
  { seg: '/plan',        labelEn: 'Plan',      labelAr: 'الخطة'      },
  { seg: '/sessions',    labelEn: 'Sessions',  labelAr: 'الجلسات'   },
  { seg: '/reports',     labelEn: 'Files',     labelAr: 'الملفات'   },
  { seg: '/gallery',     labelEn: 'Gallery',   labelAr: 'الصور'     },
  { seg: '/timeline',    labelEn: 'Timeline',  labelAr: 'التسلسل'   },
  { seg: '/reinforcers', labelEn: 'Reinf.',    labelAr: 'المعززات'  },
] as const;

type Child = {
  id: string; name_en: string; name_ar: string;
  age: number; status: string; avatar_emoji: string;
  diagnosis_en: string; diagnosis_ar: string;
};

export default function ChildLayoutTabs({
  child, locale,
}: { child: Child; locale: string }) {
  const isAr    = locale === 'ar';
  const base    = `/${locale}/therapist/${child.id}`;
  const pathname = usePathname();

  const statusColor = child.status === 'active' ? 'bg-sage-pale text-sage'
    : child.status === 'on_hold' ? 'bg-gold-pale text-gold'
    : 'bg-paper text-ink-2';

  const statusLabel = {
    active: isAr ? 'نشط' : 'Active',
    on_hold: isAr ? 'موقوف' : 'On Hold',
    discharged: isAr ? 'مُخرَّج' : 'Discharged',
    archived: isAr ? 'مؤرشف' : 'Archived',
  }[child.status] ?? child.status;

  return (
    <div className="bg-white border-b border-border px-5 py-4 flex-shrink-0">
      <div className="flex items-center gap-3 mb-4">
        <Link href={`/${locale}/therapist`} className="text-ink-2/60 hover:text-teal transition-colors">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={isAr ? 'rotate-180' : ''}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </Link>
        <AvatarDisplay avatar={child.avatar_emoji || '👦'} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-ink">{isAr ? child.name_ar : child.name_en}</p>
            <span className="text-xs text-ink-2/60">{isAr ? `${child.age} سنوات` : `Age ${child.age}`}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor}`}>
              {statusLabel}
            </span>
          </div>
          <p className="text-xs text-ink-2/60 mt-0.5 truncate">
            {isAr ? child.diagnosis_ar : child.diagnosis_en}
          </p>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto scrollbar-hide -mx-1 px-1">
        {TABS.map((t) => {
          const href   = `${base}${t.seg}`;
          const active = t.seg === '' ? pathname === base : pathname.startsWith(href);
          return (
            <Link key={t.seg} href={href}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                active ? 'bg-teal text-white' : 'text-ink-2/60 hover:text-ink hover:bg-paper'
              }`}>
              {isAr ? t.labelAr : t.labelEn}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
