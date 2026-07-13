'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { addGalleryItem, deleteGalleryItem } from '@/lib/supabase/therapist-actions';

type GalleryItem = {
  id: string; media_type: string; url: string;
  caption_en: string | null; caption_ar: string | null;
  taken_at: string | null; created_at?: string;
};

export default function GalleryClient({
  items, locale, childId,
}: { items: GalleryItem[]; locale: string; childId: string }) {
  const isAr  = locale === 'ar';
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [tab, setTab]                = useState<'photo' | 'video'>('photo');
  const [uploading, setUploading]    = useState(false);
  const [error, setError]            = useState('');
  const [isPending, startTransition] = useTransition();

  const filtered = items.filter((g) => g.media_type === tab);
  const groups: Record<string, GalleryItem[]> = {};
  filtered.forEach((item) => {
    const key = new Date(item.taken_at ?? item.created_at ?? Date.now()).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' });
    if (!groups[key]) groups[key] = [];
    groups[key]!.push(item);
  });

  function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const fd = new FormData(formRef.current!);
    fd.set('child_id', childId);
    fd.set('media_type', tab);
    fd.set('taken_at', new Date().toISOString());
    startTransition(async () => {
      const result = await addGalleryItem(fd);
      if (result?.error) { setError(result.error); return; }
      setUploading(false);
      formRef.current?.reset();
      router.refresh();
    });
  }

  function handleDelete(itemId: string) {
    if (!confirm(isAr ? 'هل أنت متأكد من الحذف؟' : 'Delete this item?')) return;
    startTransition(async () => {
      await deleteGalleryItem(itemId, childId);
      router.refresh();
    });
  }

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-ink">{isAr ? 'معرض النمو' : 'Growth Media'}</h2>
        <button onClick={() => setUploading(!uploading)}
          className="flex items-center gap-1.5 bg-teal text-white text-xs font-semibold rounded-xl px-3.5 py-2 hover:bg-teal-dark transition-colors">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          {isAr ? 'إضافة' : 'Add'}
        </button>
      </div>

      <div className="flex bg-paper border border-border rounded-xl p-1 mb-5">
        {(['photo', 'video'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t ? 'bg-white text-teal shadow-sm' : 'text-ink-2/60'
            }`}>
            {t === 'photo' ? '📸' : '🎥'} {isAr ? (t === 'photo' ? 'الصور' : 'الفيديو') : (t === 'photo' ? 'Photos' : 'Videos')}
          </button>
        ))}
      </div>

      {uploading && (
        <form ref={formRef} onSubmit={handleUpload} className="bg-teal-pale border border-teal/20 rounded-2xl p-5 mb-5 space-y-3">
          <p className="text-sm font-bold text-ink">{isAr ? `إضافة ${tab === 'photo' ? 'صورة' : 'فيديو'}` : `Add ${tab === 'photo' ? 'Photo' : 'Video'}`}</p>
          {error && <p className="text-xs text-coral">{error}</p>}
          <input required name="url" type="url" placeholder={isAr ? 'رابط الملف...' : 'File URL...'}
            className="w-full text-sm bg-white border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" />
          <input name="caption_en" type="text" placeholder={isAr ? 'وصف (إنجليزي)' : 'Caption (English)'}
            className="w-full text-sm bg-white border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" />
          <input name="caption_ar" type="text" dir="rtl" placeholder="وصف (عربي)"
            className="w-full text-sm bg-white border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" />
          <div className="flex gap-2">
            <button type="submit" disabled={isPending}
              className="flex-1 bg-teal text-white text-sm font-semibold py-2 rounded-xl disabled:opacity-60">
              {isPending ? '...' : (isAr ? 'إضافة' : 'Add')}
            </button>
            <button type="button" onClick={() => setUploading(false)}
              className="px-4 py-2 text-sm text-ink-2 bg-white border border-border rounded-xl">
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </form>
      )}

      {Object.keys(groups).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">{tab === 'photo' ? '📸' : '🎥'}</p>
          <p className="text-sm text-ink-2/60">{isAr ? 'لا توجد وسائط بعد' : `No ${tab === 'photo' ? 'photos' : 'videos'} yet`}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groups).map(([month, monthItems]) => (
            <div key={month}>
              <h3 className="text-xs font-bold text-ink-2/50 tracking-widest uppercase mb-3">{month}</h3>
              <div className="grid grid-cols-3 gap-2">
                {monthItems.map((item) => (
                  <div key={item.id} className="relative aspect-square rounded-2xl overflow-hidden bg-linen group cursor-pointer">
                    {item.media_type === 'photo' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.url} alt={item.caption_en ?? ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-ink/10 flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center">
                          <svg width="14" height="14" fill="currentColor" className="text-teal ms-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isPending}
                      className="absolute top-2 end-2 w-7 h-7 rounded-full bg-ink/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-coral/80"
                    >
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
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
