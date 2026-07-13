'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { addReinforcer, toggleReinforcer, deleteReinforcer } from '@/lib/supabase/therapist-actions';

type Reinforcer = {
  id: string; name_en: string; name_ar: string;
  emoji: string; category: string; is_favorite: boolean;
};

const CATS = ['toys', 'foods', 'activities', 'songs'] as const;
const CAT_LABELS: Record<string, [string, string, string]> = {
  toys:       ['Toys',       'الألعاب',  '🧸'],
  foods:      ['Foods',      'الطعام',   '🍎'],
  activities: ['Activities', 'الأنشطة', '🎨'],
  songs:      ['Songs',      'الأغاني', '🎵'],
};

const EMOJIS = ['🧸','🎯','🎨','🎵','🍎','🍫','🚗','⚽','🎲','📚','🪅','🎀','🌟','🦋','🐾'];

export default function ReinforcersClient({
  reinforcers, locale, childId,
}: { reinforcers: Reinforcer[]; locale: string; childId: string }) {
  const isAr  = locale === 'ar';
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [cat, setCat]                = useState<typeof CATS[number]>('toys');
  const [adding, setAdding]          = useState(false);
  const [selectedEmoji, setEmoji]    = useState('🧸');
  const [error, setError]            = useState('');
  const [isPending, startTransition] = useTransition();

  const items = reinforcers.filter((r) => r.category === cat);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const fd = new FormData(formRef.current!);
    fd.set('child_id', childId);
    fd.set('category', cat);
    fd.set('emoji', selectedEmoji);
    startTransition(async () => {
      const result = await addReinforcer(fd);
      if (result?.error) { setError(result.error); return; }
      setAdding(false);
      formRef.current?.reset();
      setEmoji('🧸');
      router.refresh();
    });
  }

  function handleToggle(id: string, currentFav: boolean) {
    startTransition(async () => {
      await toggleReinforcer(id, !currentFav, childId);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!confirm(isAr ? 'هل أنت متأكد من الحذف؟' : 'Delete this reinforcer?')) return;
    startTransition(async () => {
      await deleteReinforcer(id, childId);
      router.refresh();
    });
  }

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-ink">{isAr ? 'المعززات المفضلة' : 'Reinforcers'}</h2>
        <button onClick={() => setAdding(!adding)}
          className="flex items-center gap-1.5 bg-teal text-white text-xs font-semibold rounded-xl px-3.5 py-2 hover:bg-teal-dark transition-colors">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          {isAr ? 'إضافة' : 'Add'}
        </button>
      </div>

      <p className="text-xs text-ink-2/60 mb-4 bg-sage-pale border border-sage/20 rounded-xl px-4 py-3">
        🔄 {isAr ? 'التغييرات هنا تنعكس فوراً على بوابة الأسرة.' : 'Changes here are reflected immediately in the Family Portal.'}
      </p>

      {adding && (
        <form ref={formRef} onSubmit={handleAdd} className="bg-teal-pale border border-teal/20 rounded-2xl p-4 mb-5 space-y-3">
          {error && <p className="text-xs text-coral">{error}</p>}
          <div>
            <p className="text-xs font-semibold text-ink-2/60 mb-2">{isAr ? 'اختر رمزًا' : 'Choose emoji'}</p>
            <div className="flex flex-wrap gap-1.5">
              {EMOJIS.map((em) => (
                <button key={em} type="button" onClick={() => setEmoji(em)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                    selectedEmoji === em ? 'bg-teal text-white' : 'bg-white border border-border'
                  }`}>
                  {em}
                </button>
              ))}
            </div>
          </div>
          <input required name="name_en" type="text" placeholder={isAr ? 'الاسم (إنجليزي)' : 'Name (English)'}
            className="w-full text-sm bg-white border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" />
          <input name="name_ar" type="text" dir="rtl" placeholder="الاسم (عربي)"
            className="w-full text-sm bg-white border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" />
          <p className="text-xs text-ink-2/60">{isAr ? 'الفئة' : 'Category'}: {CAT_LABELS[cat]![isAr ? 1 : 0]}</p>
          <div className="flex gap-2">
            <button type="submit" disabled={isPending}
              className="flex-1 bg-teal text-white text-sm font-semibold py-2 rounded-xl disabled:opacity-60">
              {isPending ? '...' : (isAr ? 'إضافة' : 'Add')}
            </button>
            <button type="button" onClick={() => setAdding(false)}
              className="px-4 py-2 text-sm text-ink-2 bg-white border border-border rounded-xl">
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </form>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
        {CATS.map((c) => {
          const [en, ar, icon] = CAT_LABELS[c]!;
          return (
            <button key={c} onClick={() => setCat(c)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                cat === c ? 'bg-teal text-white' : 'bg-white border border-border text-ink-2'
              }`}>
              {icon} {isAr ? ar : en}
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-4xl mb-3">{CAT_LABELS[cat]![2]}</p>
          <p className="text-sm text-ink-2/60">{isAr ? 'لا توجد معززات. أضف واحدًا!' : 'No reinforcers. Add one!'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-border shadow-sm p-4 flex flex-col items-center gap-2 relative group">
              <button onClick={() => handleToggle(r.id, r.is_favorite)} disabled={isPending} className="absolute top-3 end-3">
                <svg width="18" height="18" viewBox="0 0 24 24"
                  fill={r.is_favorite ? '#E0623A' : 'none'}
                  stroke={r.is_favorite ? '#E0623A' : '#C0B9B1'} strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </button>
              <button onClick={() => handleDelete(r.id)} disabled={isPending}
                className="absolute top-3 start-3 opacity-0 group-hover:opacity-100 transition-opacity text-ink-2/30 hover:text-coral">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
              <div className="w-14 h-14 rounded-2xl bg-teal-pale flex items-center justify-center">
                <span className="text-3xl">{r.emoji}</span>
              </div>
              <p className="text-sm font-semibold text-ink text-center">{isAr ? r.name_ar : r.name_en}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
