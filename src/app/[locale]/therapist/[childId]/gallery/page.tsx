'use client';

import { useState }  from 'react';
import { GALLERY }   from '@/lib/portal-mock';

export default function TherapistGalleryPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  const [tab, setTab] = useState<'photo'|'video'>('photo');

  const filtered = GALLERY.filter((g) => g.type === tab);
  const groups: Record<string, typeof filtered> = {};
  filtered.forEach((item) => {
    const key = isAr ? item.monthAr : item.month;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-ink">{isAr ? 'معرض النمو' : 'Growth Media'}</h2>
        <button className="flex items-center gap-1.5 bg-teal text-white text-xs font-semibold rounded-xl px-3.5 py-2 hover:bg-teal-dark transition-colors">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          {isAr ? 'رفع' : 'Upload'}
        </button>
      </div>

      <div className="flex bg-paper border border-border rounded-xl p-1 mb-5">
        {(['photo', 'video'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t ? 'bg-white text-teal shadow-sm' : 'text-ink-2/60'
            }`}
          >
            {t === 'photo' ? '📸' : '🎥'} {isAr ? (t === 'photo' ? 'الصور' : 'الفيديو') : (t === 'photo' ? 'Photos' : 'Videos')}
          </button>
        ))}
      </div>

      {Object.entries(groups).map(([month, items]) => (
        <div key={month} className="mb-6">
          <h3 className="text-xs font-bold text-ink-2/50 tracking-widest uppercase mb-3">{month}</h3>
          <div className="grid grid-cols-3 gap-2">
            {items.map((item) => (
              <div key={item.id} className="relative aspect-square rounded-2xl overflow-hidden bg-linen group cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={isAr ? item.captionAr : item.captionEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-ink/20">
                    <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center">
                      <svg width="14" height="14" fill="currentColor" className="text-teal ms-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* Upload placeholder */}
            <button className="aspect-square rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-ink-2/40 hover:border-teal/40 hover:text-teal transition-colors">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
