'use client';

import { useState } from 'react';
import { REPORTS }  from '@/lib/portal-mock';

export default function TherapistReportsPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  const [tab, setTab] = useState<'all'|'assessments'|'reports'|'documents'>('all');

  const filtered = tab === 'all' ? REPORTS : REPORTS.filter((r) =>
    tab === 'assessments' ? r.type === 'assessment' :
    tab === 'reports'     ? r.type === 'report'     : r.type === 'document'
  );

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-ink">{isAr ? 'التقارير والوثائق' : 'Reports & Documents'}</h2>
        <button className="flex items-center gap-1.5 bg-teal text-white text-xs font-semibold rounded-xl px-3.5 py-2 hover:bg-teal-dark transition-colors">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
          </svg>
          {isAr ? 'رفع وثيقة' : 'Upload'}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
        {(['all','assessments','reports','documents'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              tab === t ? 'bg-teal text-white' : 'bg-white border border-border text-ink-2'
            }`}
          >
            {isAr
              ? { all: 'الكل', assessments: 'التقييمات', reports: 'التقارير', documents: 'الوثائق' }[t]
              : { all: 'All',  assessments: 'Assessments', reports: 'Reports', documents: 'Documents' }[t]
            }
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {filtered.map((r, idx) => (
          <div key={r.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-paper transition-colors ${idx !== filtered.length-1 ? 'border-b border-border/60' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-coral-pale flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-coral">{r.ext}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink truncate">{isAr ? r.nameAr : r.nameEn}</p>
              <p className="text-xs text-ink-2/60 mt-0.5">{isAr ? r.dateAr : r.date} · {r.size}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-lg bg-paper border border-border flex items-center justify-center text-ink-2/60 hover:text-teal transition-colors">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
              </button>
              <button className="w-8 h-8 rounded-lg bg-paper border border-border flex items-center justify-center text-ink-2/60 hover:text-coral transition-colors">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
