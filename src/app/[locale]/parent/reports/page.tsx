'use client';

import { useState }  from 'react';
import { REPORTS }   from '@/lib/portal-mock';

const TABS = ['all', 'assessments', 'reports', 'documents'] as const;

export default function ReportsPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  const [tab, setTab] = useState<typeof TABS[number]>('all');

  const tabLabels: Record<typeof TABS[number], [string, string]> = {
    all:         ['All',         'الكل'],
    assessments: ['Assessments', 'التقييمات'],
    reports:     ['Reports',     'التقارير'],
    documents:   ['Documents',   'الوثائق'],
  };

  const filtered = tab === 'all' ? REPORTS : REPORTS.filter((r) => r.type === tab.slice(0, -1) as 'assessment' | 'report' | 'document');

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-ink">{isAr ? 'التقارير والوثائق' : 'Reports'}</h1>
        <p className="text-sm text-ink-2 mt-0.5">
          {isAr ? 'جميع وثائق طفلك في مكان واحد' : "All your child's documents in one place"}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              tab === t
                ? 'bg-teal text-white shadow-sm'
                : 'bg-white border border-border text-ink-2 hover:border-teal/40'
            }`}
          >
            {isAr ? tabLabels[t][1] : tabLabels[t][0]}
          </button>
        ))}
      </div>

      {/* Report list */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {filtered.map((r, idx) => (
          <div
            key={r.id}
            className={`flex items-center gap-4 px-5 py-4 hover:bg-paper transition-colors ${
              idx !== filtered.length - 1 ? 'border-b border-border/60' : ''
            }`}
          >
            {/* Icon */}
            <div className={`w-10 h-10 rounded-xl ${r.color.replace('text-', 'bg-').replace('teal', 'teal-pale').replace('coral', 'coral-pale')} flex items-center justify-center flex-shrink-0`}>
              <span className={`text-xs font-bold ${r.color}`}>{r.ext}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink truncate">{isAr ? r.nameAr : r.nameEn}</p>
              <p className="text-xs text-ink-2/60 mt-0.5">{isAr ? r.dateAr : r.date} · {r.size}</p>
            </div>

            {/* Download */}
            <button className="w-9 h-9 rounded-full bg-paper border border-border flex items-center justify-center text-ink-2/60 hover:text-teal hover:border-teal/40 transition-colors flex-shrink-0">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-4xl mb-3">📂</p>
            <p className="text-sm text-ink-2">{isAr ? 'لا توجد وثائق في هذه الفئة' : 'No documents in this category'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
