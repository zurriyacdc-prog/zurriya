'use client';

import { useState }       from 'react';
import { CHILDREN_LIST, USERS } from '@/lib/portal-mock';
import { ProgressBar }    from '@/components/portal/ui/ProgressBar';

export default function AdminChildrenPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  const [creating, setCreating] = useState(false);
  const [search, setSearch]     = useState('');

  const filtered = CHILDREN_LIST.filter((c) =>
    (isAr ? c.nameAr : c.nameEn).toLowerCase().includes(search.toLowerCase())
  );

  const parents    = USERS.filter((u) => u.role === 'parent');
  const therapists = USERS.filter((u) => u.role === 'therapist');

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">{isAr ? 'الأطفال' : 'Children'}</h1>
          <p className="text-sm text-ink-2 mt-0.5">{CHILDREN_LIST.length} {isAr ? 'طفل مسجل' : 'registered children'}</p>
        </div>
        <button
          onClick={() => setCreating(!creating)}
          className="flex items-center gap-1.5 bg-teal text-white text-sm font-semibold rounded-xl px-4 py-2.5 hover:bg-teal-dark transition-colors shadow-sm"
        >
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          {isAr ? 'إضافة طفل' : 'Add Child'}
        </button>
      </div>

      {/* Create form */}
      {creating && (
        <div className="bg-teal-pale border border-teal/20 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-teal">{isAr ? 'طفل جديد' : 'New Child'}</h3>

          <div className="grid grid-cols-2 gap-3">
            <input placeholder={isAr ? 'اسم الطفل' : "Child's name"} className="text-sm bg-white rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" style={{direction:isAr?'rtl':'ltr'}} />
            <input placeholder={isAr ? 'العمر' : 'Age'} type="number" className="text-sm bg-white rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" />
          </div>

          <input placeholder={isAr ? 'التشخيص' : 'Diagnosis'} className="w-full text-sm bg-white rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" style={{direction:isAr?'rtl':'ltr'}} />

          {/* Assign parent */}
          <div>
            <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-1.5">{isAr ? 'ولي الأمر' : 'Assign Parent'}</label>
            <select className="w-full text-sm bg-white rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20">
              <option value="">{isAr ? '— اختر ولي الأمر —' : '— Select parent —'}</option>
              {parents.map((p) => <option key={p.id} value={p.id}>{isAr ? p.nameAr : p.nameEn}</option>)}
            </select>
          </div>

          {/* Assign therapist */}
          <div>
            <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block mb-1.5">{isAr ? 'المعالج' : 'Assign Therapist'}</label>
            <select className="w-full text-sm bg-white rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20">
              <option value="">{isAr ? '— اختر المعالج —' : '— Select therapist —'}</option>
              {therapists.map((t) => <option key={t.id} value={t.id}>{isAr ? t.nameAr : t.nameEn}</option>)}
            </select>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setCreating(false)} className="flex-1 py-2.5 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-dark">{isAr ? 'إنشاء الملف' : 'Create Profile'}</button>
            <button onClick={() => setCreating(false)} className="px-4 py-2.5 rounded-xl border border-border text-sm text-ink-2">{isAr ? 'إلغاء' : 'Cancel'}</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="absolute top-1/2 -translate-y-1/2 start-3.5 text-ink-2/40">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={isAr ? 'بحث عن طفل...' : 'Search children...'}
          className="w-full ps-10 pe-4 py-2.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
          style={{ direction: isAr ? 'rtl' : 'ltr' }}
        />
      </div>

      {/* Children list */}
      <div className="space-y-3">
        {filtered.map((child) => (
          <div key={child.id} className="bg-white rounded-2xl border border-border shadow-sm px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-teal-pale flex items-center justify-center flex-shrink-0">
              <span className="text-lg">👦</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="text-sm font-semibold text-ink">{isAr ? child.nameAr : child.nameEn}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${child.statusEn==='Active'?'bg-sage-pale text-sage':'bg-gold-pale text-gold'}`}>
                  {isAr ? child.statusAr : child.statusEn}
                </span>
              </div>
              <p className="text-xs text-ink-2/60">
                {isAr ? `${child.age} سنوات · ${child.diagnosisAr}` : `Age ${child.age} · ${child.diagnosisEn}`}
                <span className="mx-1.5 opacity-50">·</span>
                <span className="font-mono text-[10px]">{child.id}</span>
              </p>
              <div className="flex items-center gap-2 mt-2">
                <ProgressBar pct={child.progress} height="h-1.5" />
                <span className="text-[11px] font-semibold text-teal">{child.progress}%</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-ink-2/40 hover:text-teal p-1.5 transition-colors">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              <button className="text-ink-2/40 hover:text-coral p-1.5 transition-colors">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
