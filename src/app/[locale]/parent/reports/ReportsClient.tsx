'use client';

import { useState } from 'react';

type Report = {
  id: string; type: string; name_en: string; name_ar: string;
  file_url: string | null; file_size: string | null; created_at: string;
};

const TABS = ['all', 'assessment', 'progress', 'plan', 'other'] as const;
const TAB_LABELS: Record<string, [string, string]> = {
  all:        ['All',          'الكل'],
  assessment: ['Assessments',  'التقييمات'],
  progress:   ['Progress',     'التقدم'],
  plan:       ['Plans',        'الخطط'],
  other:      ['Other',        'أخرى'],
};

function getExt(url: string | null): string {
  if (!url) return 'FILE';
  return (url.split('.').pop()?.split('?')[0] ?? 'FILE').toUpperCase().slice(0, 4);
}

function makeDownloadUrl(fileUrl: string, name: string): string {
  const ext = fileUrl.split('.').pop()?.split('?')[0]?.toLowerCase() ?? 'pdf';
  return `/api/download?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(`${name}.${ext}`)}`;
}

export default function ReportsClient({ reports, locale }: { reports: Report[]; locale: string }) {
  const isAr = locale === 'ar';
  const [tab, setTab] = useState<typeof TABS[number]>('all');

  const filtered = tab === 'all' ? reports : reports.filter((r) => r.type === tab);

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              tab === t ? 'bg-teal text-white shadow-sm' : 'bg-white border border-border text-ink-2 hover:border-teal/40'
            }`}
          >
            {isAr ? TAB_LABELS[t]![1] : TAB_LABELS[t]![0]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-4xl mb-3">📂</p>
            <p className="text-sm text-ink-2">{isAr ? 'لا توجد وثائق في هذه الفئة' : 'No documents in this category'}</p>
          </div>
        )}
        {filtered.map((r, idx) => (
          <div
            key={r.id}
            className={`flex items-center gap-4 px-5 py-4 hover:bg-paper transition-colors ${
              idx !== filtered.length - 1 ? 'border-b border-border/60' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-coral-pale flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-coral">{getExt(r.file_url)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink truncate">{isAr ? r.name_ar : r.name_en}</p>
              <p className="text-xs text-ink-2/60 mt-0.5">
                {new Date(r.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                {r.file_size && ` · ${r.file_size}`}
              </p>
            </div>
            {r.file_url && (
              <a
                href={makeDownloadUrl(r.file_url, isAr ? r.name_ar : r.name_en)}
                className="w-9 h-9 rounded-full bg-paper border border-border flex items-center justify-center text-ink-2/60 hover:text-teal hover:border-teal/40 transition-colors flex-shrink-0"
                title={isAr ? 'تنزيل' : 'Download'}
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
              </a>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
