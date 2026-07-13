'use client';

import { useState } from 'react';

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

export default function ReinforcersClient({ reinforcers, locale }: { reinforcers: Reinforcer[]; locale: string }) {
  const isAr = locale === 'ar';
  const [cat, setCat] = useState<typeof CATS[number]>('toys');

  const items = reinforcers.filter((r) => r.category === cat);

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
        {CATS.map((c) => {
          const [en, ar, icon] = CAT_LABELS[c]!;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                cat === c ? 'bg-teal text-white shadow-sm' : 'bg-white border border-border text-ink-2 hover:border-teal/40'
              }`}
            >
              <span>{icon}</span>
              {isAr ? ar : en}
            </button>
          );
        })}
      </div>

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
