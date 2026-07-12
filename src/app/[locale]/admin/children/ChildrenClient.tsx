'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createChild, archiveChild } from '@/lib/supabase/admin-actions';

type Child = { id: string; name_en: string; name_ar: string; age: number; diagnosis_en: string; diagnosis_ar: string; status: string };
type Profile = { id: string; name_en: string; name_ar: string; role: string };

export default function ChildrenClient({ locale, children, parents, therapists }: {
  locale: string; children: Child[]; parents: Profile[]; therapists: Profile[];
}) {
  const isAr = locale === 'ar';
  const router = useRouter();
  const [creating, setCreating]   = useState(false);
  const [search, setSearch]       = useState('');
  const [feedback, setFeedback]   = useState('');
  const [isPending, startTransition] = useTransition();

  const filtered = children.filter((c) =>
    (isAr ? c.name_ar : c.name_en).toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createChild(fd);
      if (res?.error) {
        setFeedback(`Error: ${res.error}`);
      } else {
        setFeedback(isAr ? 'تم إضافة الطفل بنجاح' : 'Child profile created');
        setCreating(false);
        router.refresh();
      }
    });
  };

  const handleArchive = (id: string) => {
    if (!confirm(isAr ? 'هل تريد أرشفة هذا الطفل؟' : 'Archive this child?')) return;
    startTransition(async () => {
      await archiveChild(id);
      router.refresh();
    });
  };

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">{isAr ? 'الأطفال' : 'Children'}</h1>
          <p className="text-sm text-ink-2 mt-0.5">{children.length} {isAr ? 'طفل مسجل' : 'registered children'}</p>
        </div>
        <button onClick={() => { setCreating(!creating); setFeedback(''); }}
          className="flex items-center gap-1.5 bg-teal text-white text-sm font-semibold rounded-xl px-4 py-2.5 hover:bg-teal-dark transition-colors shadow-sm">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          {isAr ? 'إضافة طفل' : 'Add Child'}
        </button>
      </div>

      {feedback && (
        <div className={`text-sm rounded-xl px-4 py-3 ${feedback.startsWith('Error') ? 'bg-coral/10 text-coral border border-coral/20' : 'bg-sage-pale text-sage border border-sage/20'}`}>
          {feedback}
        </div>
      )}

      {creating && (
        <form onSubmit={handleCreate} className="bg-teal-pale border border-teal/20 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-teal">{isAr ? 'طفل جديد' : 'New Child'}</h3>
          <div className="grid grid-cols-2 gap-3">
            <input name="name_en" required placeholder="Name (EN)"
              className="text-sm bg-white rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" />
            <input name="name_ar" placeholder="الاسم بالعربية" dir="rtl"
              className="text-sm bg-white rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input name="age" type="number" min="1" max="18" required placeholder={isAr ? 'العمر' : 'Age'}
              className="text-sm bg-white rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" />
            <input name="diagnosis_en" required placeholder="Diagnosis (EN)"
              className="text-sm bg-white rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" />
          </div>
          <input name="diagnosis_ar" placeholder="التشخيص بالعربية" dir="rtl"
            className="w-full text-sm bg-white rounded-xl border border-border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-ink-2/60 mb-1 block">{isAr ? 'ولي الأمر' : 'Parent (optional)'}</label>
              <select name="parent_id" className="w-full text-sm bg-white rounded-xl border border-border px-3 py-2">
                <option value="">—</option>
                {parents.map(p => <option key={p.id} value={p.id}>{p.name_en}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-ink-2/60 mb-1 block">{isAr ? 'المعالج' : 'Therapist (optional)'}</label>
              <select name="therapist_id" className="w-full text-sm bg-white rounded-xl border border-border px-3 py-2">
                <option value="">—</option>
                {therapists.map(t => <option key={t.id} value={t.id}>{t.name_en}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={isPending}
              className="flex-1 py-2.5 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-dark disabled:opacity-60">
              {isPending ? '...' : (isAr ? 'إنشاء الملف' : 'Create Profile')}
            </button>
            <button type="button" onClick={() => setCreating(false)}
              className="px-4 py-2.5 rounded-xl border border-border text-sm text-ink-2">
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </form>
      )}

      <div className="relative">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          className="absolute top-1/2 -translate-y-1/2 start-3.5 text-ink-2/40">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={isAr ? 'بحث...' : 'Search children...'}
          className="w-full ps-10 pe-4 py-2.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/20"
          style={{ direction: isAr ? 'rtl' : 'ltr' }} />
      </div>

      <div className="space-y-3">
        {filtered.length ? filtered.map((child) => (
          <div key={child.id} className="bg-white rounded-2xl border border-border shadow-sm px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-teal-pale flex items-center justify-center flex-shrink-0 text-lg">👦</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-semibold text-ink">{isAr ? child.name_ar : child.name_en}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${child.status === 'active' ? 'bg-sage-pale text-sage' : 'bg-gold-pale text-gold'}`}>
                  {child.status}
                </span>
              </div>
              <p className="text-xs text-ink-2/60">
                {isAr ? `${child.age} سنوات · ${child.diagnosis_ar}` : `Age ${child.age} · ${child.diagnosis_en}`}
              </p>
            </div>
            <button onClick={() => handleArchive(child.id)} disabled={isPending}
              className="text-ink-2/40 hover:text-coral p-1.5 transition-colors">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
              </svg>
            </button>
          </div>
        )) : (
          <div className="bg-white rounded-2xl border border-border shadow-sm p-8 text-center">
            <p className="text-sm text-ink-2/50">{isAr ? 'لا يوجد أطفال مسجلون بعد' : 'No children registered yet'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
