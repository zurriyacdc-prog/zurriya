'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { addReport, deleteReport } from '@/lib/supabase/therapist-actions';
import FileUpload from '@/components/portal/FileUpload';

type Report = {
  id: string; title_en: string | null; title_ar: string | null;
  type: string; file_url: string | null; file_size: string | null;
  created_at: string;
};

const TYPE_OPTS = [
  ['intake',     'Intake',     'استمارة تسجيل'],
  ['assessment', 'Assessment', 'تقييم'],
  ['progress',   'Progress',   'تقرير تقدم'],
  ['plan',       'Plan',       'خطة علاجية'],
  ['speech',     'Speech',     'تقرير نطق'],
  ['behavior',   'Behavior',   'تقرير سلوك'],
  ['other',      'Other',      'أخرى'],
] as const;

export default function DocsClient({
  reports, locale, childId, childName,
}: { reports: Report[]; locale: string; childId: string; childName: string }) {
  const isAr  = locale === 'ar';
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [adding, setAdding]             = useState(false);
  const [uploadedUrl, setUploadedUrl]   = useState('');
  const [uploadedSize, setUploadedSize] = useState('');
  const [error, setError]               = useState('');
  const [isPending, startTransition]    = useTransition();

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (!uploadedUrl) { setError(isAr ? 'يرجى رفع ملف أولاً' : 'Please upload a file first'); return; }
    const fd = new FormData(formRef.current!);
    fd.set('child_id', childId);
    fd.set('file_url', uploadedUrl);
    fd.set('file_size', uploadedSize);
    startTransition(async () => {
      const res = await addReport(fd);
      if (res?.error) { setError(res.error); return; }
      setAdding(false);
      setUploadedUrl('');
      setUploadedSize('');
      formRef.current?.reset();
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذا الملف؟' : 'Delete this document?')) return;
    startTransition(async () => {
      await deleteReport(id, childId);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-ink">{isAr ? `ملفات ${childName}` : `${childName}'s Documents`}</h2>
        <button onClick={() => { setAdding(!adding); setError(''); setUploadedUrl(''); setUploadedSize(''); }}
          className="flex items-center gap-1.5 bg-teal text-white text-xs font-semibold rounded-xl px-3 py-2 hover:bg-teal-dark transition-colors">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          {isAr ? 'رفع ملف' : 'Upload'}
        </button>
      </div>

      {adding && (
        <form ref={formRef} onSubmit={handleAdd}
          className="bg-teal-pale border border-teal/20 rounded-2xl p-5 space-y-3">
          {error && <p className="text-xs text-coral">{error}</p>}

          <div className="grid grid-cols-2 gap-3">
            <input name="title_en" placeholder="Title (EN)"
              className="text-sm bg-white border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" />
            <input name="title_ar" dir="rtl" placeholder="العنوان بالعربية"
              className="text-sm bg-white border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" />
          </div>

          <select name="type" required
            className="w-full text-sm bg-white border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20">
            {TYPE_OPTS.map(([val, en, ar]) => (
              <option key={val} value={val}>{isAr ? ar : en}</option>
            ))}
          </select>

          <FileUpload
            childId={childId} folder="reports"
            accept=".pdf,.doc,.docx,.html,.htm,.jpg,.jpeg,.png,image/*"
            label="Choose file" labelAr="اختر ملفاً"
            locale={locale}
            onUploaded={(url, size) => { setUploadedUrl(url); setUploadedSize(size); }}
          />
          {uploadedUrl && (
            <p className="text-xs text-sage flex items-center gap-1">
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              {isAr ? 'تم الرفع' : 'File ready'} · {uploadedSize}
            </p>
          )}

          <div className="flex gap-2">
            <button type="submit" disabled={isPending}
              className="flex-1 bg-teal text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-60">
              {isPending ? '...' : (isAr ? 'حفظ' : 'Save')}
            </button>
            <button type="button" onClick={() => setAdding(false)}
              className="px-4 py-2 text-sm text-ink-2 bg-white border border-border rounded-xl">
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </form>
      )}

      {reports.length === 0 && !adding ? (
        <div className="bg-white rounded-2xl border border-border p-10 text-center">
          <p className="text-3xl mb-3">📄</p>
          <p className="text-sm text-ink-2/60">{isAr ? 'لا توجد ملفات بعد' : 'No documents yet'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {reports.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-border shadow-sm px-5 py-3.5 flex items-center gap-3">
              <span className="text-xl flex-shrink-0">📄</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">
                  {isAr ? (r.title_ar || r.title_en || '—') : (r.title_en || r.title_ar || '—')}
                </p>
                <p className="text-xs text-ink-2/60 mt-0.5">
                  {r.type} {r.file_size ? `· ${r.file_size}` : ''} · {new Date(r.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {r.file_url && (
                  <a href={r.file_url} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-semibold text-teal hover:text-teal-dark px-2.5 py-1.5 rounded-lg hover:bg-teal-pale transition-colors">
                    {isAr ? 'فتح' : 'Open'}
                  </a>
                )}
                <button onClick={() => handleDelete(r.id)} disabled={isPending}
                  className="text-ink-2/30 hover:text-coral p-1 transition-colors">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
