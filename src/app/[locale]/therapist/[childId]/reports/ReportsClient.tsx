'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { addReport, deleteReport } from '@/lib/supabase/therapist-actions';
import FileUpload from '@/components/portal/FileUpload';

type Report = {
  id: string; type: string; name_en: string; name_ar: string;
  file_url: string | null; file_size: string | null; created_at: string;
};

const TABS = ['all', 'assessment', 'progress', 'plan', 'speech', 'behavior', 'other'] as const;
const TAB_LABELS: Record<string, [string, string]> = {
  all:        ['All',       'الكل'],
  assessment: ['Assessment','التقييم'],
  progress:   ['Progress',  'التقدم'],
  plan:       ['Plan',      'الخطة'],
  speech:     ['Speech',    'النطق'],
  behavior:   ['Behavior',  'السلوك'],
  other:      ['Other',     'أخرى'],
};

function getExt(url: string | null): string {
  if (!url) return 'FILE';
  return (url.split('.').pop() ?? 'FILE').toUpperCase().slice(0, 4);
}

export default function ReportsClient({
  reports, locale, childId,
}: { reports: Report[]; locale: string; childId: string }) {
  const isAr  = locale === 'ar';
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [tab, setTab]                = useState<typeof TABS[number]>('all');
  const [uploading, setUploading]    = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [uploadedSize, setUploadedSize] = useState('');
  const [error, setError]            = useState('');
  const [isPending, startTransition] = useTransition();

  const filtered = tab === 'all' ? reports : reports.filter((r) => r.type === tab);

  function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!uploadedUrl) { setError(isAr ? 'يرجى رفع ملف أولاً' : 'Please upload a file first'); return; }
    const fd = new FormData(formRef.current!);
    fd.set('child_id', childId);
    fd.set('file_url', uploadedUrl);
    fd.set('file_size', uploadedSize);
    startTransition(async () => {
      const result = await addReport(fd);
      if (result?.error) { setError(result.error); return; }
      setUploading(false);
      setUploadedUrl('');
      setUploadedSize('');
      formRef.current?.reset();
      router.refresh();
    });
  }

  function handleDelete(reportId: string) {
    if (!confirm(isAr ? 'هل أنت متأكد من الحذف؟' : 'Delete this document?')) return;
    startTransition(async () => {
      await deleteReport(reportId, childId);
      router.refresh();
    });
  }

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-ink">{isAr ? 'التقارير والوثائق' : 'Reports & Documents'}</h2>
        <button onClick={() => setUploading(!uploading)}
          className="flex items-center gap-1.5 bg-teal text-white text-xs font-semibold rounded-xl px-3.5 py-2 hover:bg-teal-dark transition-colors">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          {isAr ? 'إضافة وثيقة' : 'Add Document'}
        </button>
      </div>

      {uploading && (
        <form ref={formRef} onSubmit={handleUpload} className="bg-teal-pale border border-teal/20 rounded-2xl p-5 mb-5 space-y-3">
          <p className="text-sm font-bold text-ink">{isAr ? 'إضافة وثيقة' : 'Add Document'}</p>
          {error && <p className="text-xs text-coral mb-1">{error}</p>}
          <select name="type" defaultValue="progress"
            className="w-full text-sm bg-white border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20">
            <option value="assessment">{isAr ? 'تقييم' : 'Assessment'}</option>
            <option value="progress">{isAr ? 'تقرير تقدم' : 'Progress Report'}</option>
            <option value="plan">{isAr ? 'خطة علاج' : 'Treatment Plan'}</option>
            <option value="speech">{isAr ? 'تقرير نطق' : 'Speech Report'}</option>
            <option value="behavior">{isAr ? 'تقرير سلوك' : 'Behavior Report'}</option>
            <option value="other">{isAr ? 'أخرى' : 'Other'}</option>
          </select>
          <input required name="name_en" type="text" placeholder={isAr ? 'الاسم (إنجليزي)' : 'Document name (English)'}
            className="w-full text-sm bg-white border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" />
          <input name="name_ar" type="text" dir="rtl" placeholder="الاسم (عربي)"
            className="w-full text-sm bg-white border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" />
          <FileUpload
            childId={childId} folder="reports"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.html,.htm,image/*"
            label="Choose file (PDF, Word, Image)"
            labelAr="اختر ملفاً (PDF، Word، صورة)"
            locale={locale}
            onUploaded={(url, size) => { setUploadedUrl(url); setUploadedSize(size ?? ''); }}
          />
          {uploadedUrl && (
            <p className="text-xs text-sage flex items-center gap-1">
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              {isAr ? 'تم الرفع بنجاح' : 'File uploaded'}
            </p>
          )}
          <div className="flex gap-2">
            <button type="submit" disabled={isPending}
              className="flex-1 bg-teal text-white text-sm font-semibold py-2 rounded-xl disabled:opacity-60">
              {isPending ? '...' : (isAr ? 'حفظ' : 'Save')}
            </button>
            <button type="button" onClick={() => setUploading(false)}
              className="px-4 py-2 text-sm text-ink-2 bg-white border border-border rounded-xl">
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </form>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              tab === t ? 'bg-teal text-white' : 'bg-white border border-border text-ink-2'
            }`}>
            {isAr ? TAB_LABELS[t]![1] : TAB_LABELS[t]![0]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-4xl mb-3">📂</p>
            <p className="text-sm text-ink-2/60">{isAr ? 'لا توجد وثائق في هذه الفئة' : 'No documents in this category'}</p>
          </div>
        )}
        {filtered.map((r, idx) => (
          <div key={r.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-paper transition-colors ${idx !== filtered.length-1 ? 'border-b border-border/60' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-coral-pale flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-coral">{getExt(r.file_url)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink truncate">{isAr ? r.name_ar : r.name_en}</p>
              <p className="text-xs text-ink-2/60 mt-0.5">
                {new Date(r.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                {r.file_size && ` · ${r.file_size}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {r.file_url && (
                <a href={r.file_url} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-paper border border-border flex items-center justify-center text-ink-2/60 hover:text-teal transition-colors">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                </a>
              )}
              <button onClick={() => handleDelete(r.id)} disabled={isPending}
                className="w-8 h-8 rounded-lg bg-paper border border-border flex items-center justify-center text-ink-2/60 hover:text-coral transition-colors">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
