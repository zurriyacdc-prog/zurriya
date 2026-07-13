'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { addReinforcer } from '@/lib/supabase/therapist-actions';

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

const EMOJIS = ['⭐','🎯','🍫','🧸','🎮','🎵','🌈','🚗','🦁','🎨','🍕','🏆','🎉','🐶','🍦','💪','🎪','🌟','🍭','🎸'];

export default function ReinforcersClient({
  reinforcers, locale, childId,
}: { reinforcers: Reinforcer[]; locale: string; childId: string }) {
  const isAr = locale === 'ar';
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [cat, setCat]               = useState<typeof CATS[number]>('toys');
  const [adding, setAdding]         = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState('⭐');
  const [error, setError]           = useState('');
  const [isPending, startTransition] = useTransition();

  const items = reinforcers.filter((r) => r.category === cat);

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const fd = new FormData(formRef.current!);
    fd.set('child_id', childId);
    fd.set('category', cat);
    fd.set('emoji', pickedEmoji);
    startTransition(async () => {
      const res = await addReinforcer(fd);
      if (res?.error) { setError(res.error); return; }
      setAdding(false);
      setPickedEmoji('⭐');
      formRef.current?.reset();
      router.refresh();
    });
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATS.map((c) => {
            const [en, ar, icon] = CAT_LABELS[c]!;
            return (
              <button key={c} onClick={() => setCat(c)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  cat === c ? 'bg-teal text-white shadow-sm' : 'bg-white border border-border text-ink-2 hover:border-teal/40'
                }`}>
                <span>{icon}</span>
                {isAr ? ar : en}
              </button>
            );
          })}
        </div>
        <button onClick={() => { setAdding(!adding); setError(''); }}
          className="flex-shrink-0 ms-3 flex items-center gap-1.5 bg-teal text-white text-xs font-semibold rounded-xl px-3 py-2 hover:bg-teal-dark transition-colors">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          {isAr ? 'اقتراح' : 'Suggest'}
        </button>
      </div>

      {adding && (
        <form ref={formRef} onSubmit={handleAdd}
          className="bg-teal-pale border border-teal/20 rounded-2xl p-4 mb-5 space-y-3">
          <p className="text-sm font-bold text-teal">
            {isAr ? `اقتراح معزز — ${CAT_LABELS[cat]![1]}` : `Suggest reinforcer — ${CAT_LABELS[cat]![0]}`}
          </p>
          {error && <p className="text-xs text-coral">{error}</p>}

          <div className="grid grid-cols-2 gap-2">
            <input name="name_en" required placeholder="Name (EN)"
              className="text-sm bg-white rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" />
            <input name="name_ar" placeholder="الاسم بالعربية" dir="rtl"
              className="text-sm bg-white rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" />
          </div>

          <div>
            <p className="text-xs text-ink-2/60 mb-2">{isAr ? 'اختر رمزاً' : 'Pick an emoji'}</p>
            <div className="flex flex-wrap gap-1.5">
              {EMOJIS.map((em) => (
                <button key={em} type="button" onClick={() => setPickedEmoji(em)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-colors ${
                    pickedEmoji === em ? 'bg-teal text-white' : 'bg-white border border-border hover:border-teal/40'
                  }`}>
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={isPending}
              className="flex-1 bg-teal text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-60">
              {isPending ? '...' : (isAr ? 'إرسال' : 'Submit')}
            </button>
            <button type="button" onClick={() => setAdding(false)}
              className="px-4 py-2 text-sm text-ink-2 bg-white border border-border rounded-xl">
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-10 text-center">
          <p className="text-4xl mb-3">{CAT_LABELS[cat]![2]}</p>
          <p className="text-sm text-ink-2/60">{isAr ? 'لا توجد معززات في هذه الفئة' : 'No reinforcers in this category'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-border shadow-sm p-4 flex flex-col items-center gap-2 relative">
              {r.is_favorite && (
                <div className="absolute top-3 end-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#E0623A" stroke="#E0623A" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </div>
              )}
              <div className="w-14 h-14 rounded-2xl bg-teal-pale flex items-center justify-center">
                <span className="text-3xl">{r.emoji}</span>
              </div>
              <p className="text-sm font-semibold text-ink text-center">{isAr ? r.name_ar : r.name_en}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
