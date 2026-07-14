'use client';

import { useState } from 'react';

type GalleryItem = {
  id: string; media_type: string; url: string;
  caption_en: string | null; caption_ar: string | null;
  taken_at: string | null; created_at?: string;
};

export default function GalleryClient({ items, locale }: { items: GalleryItem[]; locale: string }) {
  const isAr = locale === 'ar';
  const [tab, setTab] = useState<'photo' | 'video'>('photo');

  const filtered = items.filter((g) => g.media_type === tab);

  const groups: Record<string, GalleryItem[]> = {};
  filtered.forEach((item) => {
    const date = new Date(item.taken_at ?? item.created_at ?? Date.now());
    const key = date.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' });
    if (!groups[key]) groups[key] = [];
    groups[key]!.push(item);
  });

  return (
    <>
      <div className="flex bg-paper border border-border rounded-xl p-1 mb-6">
        {([['photo', 'Photos', 'الصور', '📸'], ['video', 'Videos', 'الفيديوهات', '🎥']] as const).map(([key, en, ar, icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === key ? 'bg-white text-teal shadow-sm' : 'text-ink-2/60 hover:text-ink'
            }`}
          >
            <span>{icon}</span>
            {isAr ? ar : en}
          </button>
        ))}
      </div>

      {Object.keys(groups).length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">{tab === 'photo' ? '📸' : '🎥'}</p>
          <p className="text-sm text-ink-2">{isAr ? 'لا توجد وسائط بعد' : `No ${tab === 'photo' ? 'photos' : 'videos'} yet`}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groups).map(([month, monthItems]) => (
            <div key={month}>
              <h2 className="text-xs font-bold text-ink-2/50 tracking-widest uppercase mb-3">{month}</h2>
              <div className="grid grid-cols-3 gap-2">
                {monthItems.map((item) => {
                  const caption = (isAr ? item.caption_ar : item.caption_en) ?? '';
                  const ext = item.media_type === 'video' ? 'mp4' : 'jpg';
                  const filename = caption ? `${caption}.${ext}` : `zurriya-${item.id.slice(0, 8)}.${ext}`;
                  const downloadHref = `/api/download?url=${encodeURIComponent(item.url)}&filename=${encodeURIComponent(filename)}`;
                  return (
                    <div key={item.id} className="relative aspect-square rounded-2xl overflow-hidden bg-linen group">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 block"
                      >
                        {item.media_type === 'photo' ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.url}
                            alt={caption}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-ink/10 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow">
                              <svg width="16" height="16" fill="currentColor" className="text-teal ms-0.5" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        )}
                      </a>

                      {/* Download button — top-right corner */}
                      <a
                        href={downloadHref}
                        download={filename}
                        onClick={(e) => e.stopPropagation()}
                        title={isAr ? 'تنزيل' : 'Download'}
                        className="absolute top-1.5 end-1.5 w-7 h-7 rounded-full bg-ink/50 hover:bg-ink/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <svg width="13" height="13" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                      </a>

                      {caption && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent px-2 pt-4 pb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <p className="text-white text-[10px] font-medium leading-tight">{caption}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
