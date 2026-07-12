'use client';

import { useState }    from 'react';
import { REINFORCERS } from '@/lib/portal-mock';

const CATS = ['toys', 'foods', 'activities', 'songs'] as const;
const CAT_LABELS: Record<typeof CATS[number], [string, string, string]> = {
  toys:       ['Toys',       'الألعاب',  '🧸'],
  foods:      ['Foods',      'الطعام',   '🍎'],
  activities: ['Activities', 'الأنشطة', '🎨'],
  songs:      ['Songs',      'الأغاني', '🎵'],
};

export default function TherapistReinforcersPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  const [cat, setCat] = useState<typeof CATS[number]>('toys');
  const [favorites, setFavorites] = useState(new Set(REINFORCERS.filter(r=>r.isFavorite).map(r=>r.id)));
  const [adding, setAdding] = useState(false);

  const items = REINFORCERS.filter((r) => r.category === cat);
  const toggle = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-ink">{isAr ? 'المعززات المفضلة' : 'Favorite Reinforcers'}</h2>
        <button
          onClick={() => setAdding(!adding)}
          className="flex items-center gap-1.5 bg-teal text-white text-xs font-semibold rounded-xl px-3.5 py-2 hover:bg-teal-dark transition-colors"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          {isAr ? 'إضافة' : 'Add'}
        </button>
      </div>

      {adding && (
        <div className="bg-teal-pale border border-teal/20 rounded-2xl px-5 py-4 mb-5 flex gap-3">
          <input
            placeholder={isAr ? 'اسم المعزز' : 'Reinforcer name'}
            className="flex-1 text-sm text-ink bg-white rounded-xl border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal/20"
            style={{ direction: isAr ? 'rtl' : 'ltr' }}
          />
          <button onClick={() => setAdding(false)} className="text-xs font-semibold text-teal bg-white border border-teal/30 rounded-xl px-3">
            {isAr ? 'إضافة' : 'Add'}
          </button>
        </div>
      )}

      <p className="text-xs text-ink-2/60 mb-4 bg-sage-pale border border-sage/20 rounded-xl px-4 py-3">
        🔄 {isAr
          ? 'التغييرات هنا تنعكس فوراً على بوابة الأسرة.'
          : 'Changes here are reflected immediately in the Family Portal.'}
      </p>

      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
        {CATS.map((c) => {
          const [en, ar, icon] = CAT_LABELS[c];
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                cat === c ? 'bg-teal text-white' : 'bg-white border border-border text-ink-2'
              }`}
            >
              {icon} {isAr ? ar : en}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((r) => {
          const isFav = favorites.has(r.id);
          return (
            <div key={r.id} className="bg-white rounded-2xl border border-border shadow-sm p-4 flex flex-col items-center gap-2 relative">
              <button onClick={() => toggle(r.id)} className="absolute top-3 end-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? '#E0623A' : 'none'} stroke={isFav ? '#E0623A' : '#C0B9B1'} strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </button>
              <div className="w-14 h-14 rounded-2xl bg-teal-pale flex items-center justify-center">
                <span className="text-3xl">{r.emoji}</span>
              </div>
              <p className="text-sm font-semibold text-ink text-center">{isAr ? r.nameAr : r.nameEn}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
