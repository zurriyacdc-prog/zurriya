'use client';

import { useState } from 'react';
import { CHILDREN_LIST, USERS } from '@/lib/portal-mock';

export default function AdminRelationsPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  const [search, setSearch] = useState('');

  const parents    = USERS.filter((u) => u.role === 'parent');
  const therapists = USERS.filter((u) => u.role === 'therapist');

  const filtered = CHILDREN_LIST.filter((c) =>
    (isAr ? c.nameAr : c.nameEn).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-ink">{isAr ? 'إدارة العلاقات' : 'Relationships'}</h1>
        <p className="text-sm text-ink-2 mt-0.5">
          {isAr ? 'تعيين ولي الأمر والمعالج لكل طفل' : 'Assign parent & therapist to each child'}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          className="absolute top-1/2 -translate-y-1/2 start-3.5 text-ink-2/40">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isAr ? 'بحث عن طفل...' : 'Search children...'}
          className="w-full ps-10 pe-4 py-2.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
          style={{ direction: isAr ? 'rtl' : 'ltr' }}
        />
      </div>

      {/* Relationship cards */}
      <div className="space-y-4">
        {filtered.map((child) => (
          <div key={child.id} className="bg-white rounded-2xl border border-border shadow-sm p-5 space-y-4">
            {/* Child header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-pale flex items-center justify-center flex-shrink-0">
                <span className="text-lg">👦</span>
              </div>
              <div>
                <p className="text-sm font-bold text-ink">{isAr ? child.nameAr : child.nameEn}</p>
                <p className="text-xs text-ink-2/60">
                  {isAr ? `${child.age} سنوات · ${child.diagnosisAr}` : `Age ${child.age} · ${child.diagnosisEn}`}
                </p>
              </div>
            </div>

            {/* Assignment dropdowns */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-ink-2/60 uppercase tracking-wide block mb-1.5">
                  {isAr ? 'ولي الأمر' : 'Parent'}
                </label>
                <select
                  defaultValue={parents[0]?.id}
                  className="w-full text-sm bg-paper border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal/20"
                >
                  <option value="">{isAr ? '— بدون —' : '— None —'}</option>
                  {parents.map((p) => (
                    <option key={p.id} value={p.id}>{isAr ? p.nameAr : p.nameEn}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-ink-2/60 uppercase tracking-wide block mb-1.5">
                  {isAr ? 'المعالج' : 'Therapist'}
                </label>
                <select
                  defaultValue={therapists[0]?.id}
                  className="w-full text-sm bg-paper border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal/20"
                >
                  <option value="">{isAr ? '— بدون —' : '— None —'}</option>
                  {therapists.map((t) => (
                    <option key={t.id} value={t.id}>{isAr ? t.nameAr : t.nameEn}</option>
                  ))}
                </select>
              </div>
            </div>

            <button className="w-full py-2 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-dark transition-colors">
              {isAr ? 'حفظ التعيين' : 'Save Assignment'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
