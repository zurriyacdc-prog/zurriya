'use client';

import { useState }      from 'react';
import { REINFORCERS }   from '@/lib/portal-mock';

const CATS = ['toys', 'foods', 'activities', 'songs'] as const;

const CAT_LABELS: Record<typeof CATS[number], [string, string, string]> = {
  toys:       ['Toys',       'الألعاب',    '🧸'],
  foods:      ['Foods',      'الطعام',     '🍎'],
  activities: ['Activities', 'الأنشطة',   '🎨'],
  songs:      ['Songs',      'الأغاني',   '🎵'],
};

export default function ReinforcersPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  const [cat, setCat] = useState<typeof CATS[number]>('toys');
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(REINFORCERS.filter((r) => r.isFavorite).map((r) => r.id))
  );

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
      <div className="mb-6">
        <h1 className="text-xl font-bold text-ink">{isAr ? 'المعززات المفضلة' : 'Favorite Reinforcers'}</h1>
        <p className="text-sm text-ink-2 mt-0.5">
          {isAr ? 'ما يحبه طفلك ويحفزه' : "What motivates and delights your child"}
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
        {CATS.map((c) => {
          const [en, ar, icon] = CAT_LABELS[c];
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                cat === c
                  ? 'bg-teal text-white shadow-sm'
                  : 'bg-white border border-border text-ink-2 hover:border-teal/40'
              }`}
            >
              <span>{icon}</span>
              {isAr ? ar : en}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((r) => {
          const isFav = favorites.has(r.id);
          return (
            <div key={r.id} className="bg-white rounded-2xl border border-border shadow-sm p-4 flex flex-col items-center gap-2 relative">
              <button
                onClick={() => toggle(r.id)}
                className="absolute top-3 end-3"
              >
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

      {/* Add hint */}
      <button className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border text-sm font-medium text-ink-2 hover:border-teal/40 hover:text-teal transition-colors">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
        </svg>
        {isAr ? 'اقتراح معزز جديد' : 'Suggest a Reinforcer'}
      </button>
    </div>
  );
}
