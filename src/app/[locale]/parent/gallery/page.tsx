'use client';

import { useState }   from 'react';
import { GALLERY }    from '@/lib/portal-mock';

export default function GalleryPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr   = locale === 'ar';
  const [tab, setTab] = useState<'photo' | 'video'>('photo');

  const filtered = GALLERY.filter((g) => g.type === tab);

  // Group by month
  const groups: Record<string, typeof filtered> = {};
  filtered.forEach((item) => {
    const key = isAr ? item.monthAr : item.month;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-ink">{isAr ? 'معرض النمو' : 'Growth Gallery'}</h1>
        <p className="text-sm text-ink-2 mt-0.5">
          {isAr ? 'لحظات رحلة طفلك موثقة بالصور والفيديو' : "Moments from your child's journey"}
        </p>
      </div>

      {/* Photo / Video tabs */}
      <div className="flex bg-paper border border-border rounded-xl p-1 mb-6">
        {([['photo', 'Photos', 'الصور'], ['video', 'Videos', 'الفيديوهات']] as const).map(([key, en, ar]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === key ? 'bg-white text-teal shadow-sm' : 'text-ink-2/60 hover:text-ink'
            }`}
          >
            <span>{key === 'photo' ? '📸' : '🎥'}</span>
            {isAr ? ar : en}
          </button>
        ))}
      </div>

      {/* Grouped grid */}
      {Object.keys(groups).length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🎥</p>
          <p className="text-sm text-ink-2">{isAr ? 'لا توجد فيديوهات حتى الآن' : 'No videos yet'}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groups).map(([month, items]) => (
            <div key={month}>
              <h2 className="text-xs font-bold text-ink-2/50 tracking-widest uppercase mb-3">{month}</h2>
              <div className="grid grid-cols-3 gap-2">
                {items.map((item) => (
                  <div key={item.id} className="relative aspect-square rounded-2xl overflow-hidden bg-linen group cursor-pointer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt={isAr ? item.captionAr : item.captionEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-ink/20">
                        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow">
                          <svg width="16" height="16" fill="currentColor" className="text-teal ms-0.5" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    )}
                    {/* Caption overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent px-2 pt-4 pb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-[10px] font-medium leading-tight">
                        {isAr ? item.captionAr : item.captionEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
