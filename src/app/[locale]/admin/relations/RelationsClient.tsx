'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveRelationship } from '@/lib/supabase/admin-actions';

type Child    = { id: string; name_en: string; name_ar: string; age: number; diagnosis_en: string; diagnosis_ar: string };
type Profile  = { id: string; name_en: string; name_ar: string };
type Rel      = { child_id: string; parent_id: string | null; therapist_id: string | null };

export default function RelationsClient({ locale, childList, parents, therapists, relationships }: {
  locale: string; childList: Child[]; parents: Profile[]; therapists: Profile[]; relationships: Rel[];
}) {
  const isAr = locale === 'ar';
  const router = useRouter();
  const [search, setSearch]       = useState('');
  const [saved, setSaved]         = useState<string>('');
  const [isPending, startTransition] = useTransition();

  const children = childList;
  const relMap = Object.fromEntries(relationships.map(r => [r.child_id, r]));

  const filtered = children.filter(c =>
    (isAr ? c.name_ar : c.name_en).toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (childId: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parentId    = fd.get('parent_id') as string || null;
    const therapistId = fd.get('therapist_id') as string || null;
    startTransition(async () => {
      await saveRelationship(childId, parentId, therapistId);
      setSaved(childId);
      setTimeout(() => setSaved(''), 2000);
      router.refresh();
    });
  };

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-ink">{isAr ? 'إدارة العلاقات' : 'Relationships'}</h1>
        <p className="text-sm text-ink-2 mt-0.5">{isAr ? 'تعيين ولي الأمر والمعالج لكل طفل' : 'Assign parent & therapist to each child'}</p>
      </div>

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

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-border p-8 text-center">
          <p className="text-sm text-ink-2/50">{isAr ? 'لا يوجد أطفال' : 'No children yet — add one in the Children tab'}</p>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((child) => {
          const rel = relMap[child.id];
          return (
            <form key={child.id} onSubmit={(e) => handleSave(child.id, e)} className="bg-white rounded-2xl border border-border shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-pale flex items-center justify-center flex-shrink-0 text-lg">👦</div>
                <div>
                  <p className="text-sm font-bold text-ink">{isAr ? child.name_ar : child.name_en}</p>
                  <p className="text-xs text-ink-2/60">{isAr ? `${child.age} سنوات · ${child.diagnosis_ar}` : `Age ${child.age} · ${child.diagnosis_en}`}</p>
                </div>
                {saved === child.id && (
                  <span className="ms-auto text-xs text-sage font-semibold">✓ {isAr ? 'تم الحفظ' : 'Saved'}</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-ink-2/60 uppercase tracking-wide block mb-1.5">{isAr ? 'ولي الأمر' : 'Parent'}</label>
                  <select name="parent_id" defaultValue={rel?.parent_id ?? ''}
                    className="w-full text-sm bg-paper border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal/20">
                    <option value="">{isAr ? '— بدون —' : '— None —'}</option>
                    {parents.map(p => <option key={p.id} value={p.id}>{isAr ? p.name_ar : p.name_en}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-ink-2/60 uppercase tracking-wide block mb-1.5">{isAr ? 'المعالج' : 'Therapist'}</label>
                  <select name="therapist_id" defaultValue={rel?.therapist_id ?? ''}
                    className="w-full text-sm bg-paper border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal/20">
                    <option value="">{isAr ? '— بدون —' : '— None —'}</option>
                    {therapists.map(t => <option key={t.id} value={t.id}>{isAr ? t.name_ar : t.name_en}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" disabled={isPending}
                className="w-full py-2 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-dark disabled:opacity-60 transition-colors">
                {isPending ? '...' : (isAr ? 'حفظ التعيين' : 'Save Assignment')}
              </button>
            </form>
          );
        })}
      </div>
    </div>
  );
}
