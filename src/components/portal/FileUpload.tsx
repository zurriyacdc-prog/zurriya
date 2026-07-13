'use client';

import { useRef, useState } from 'react';
import { getSignedUploadUrl } from '@/lib/supabase/storage-actions';

type Folder = 'gallery' | 'reports' | 'avatars';

type Props = {
  childId: string;
  folder: Folder;
  accept: string;
  label?: string;
  labelAr?: string;
  locale?: string;
  onUploaded: (url: string, size: string) => void;
  className?: string;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileUpload({
  childId, folder, accept,
  label = 'Upload file', labelAr = 'رفع ملف',
  locale = 'en', onUploaded, className = '',
}: Props) {
  const isAr   = locale === 'ar';
  const ref    = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('uploading');
    setProgress(10);
    setErrorMsg('');

    const result = await getSignedUploadUrl(childId, folder, file.name);
    if ('error' in result) {
      setStatus('error');
      setErrorMsg(result.error);
      return;
    }

    setProgress(40);

    try {
      const res = await fetch(result.signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed');
      return;
    }

    setProgress(100);
    setStatus('idle');
    if (ref.current) ref.current.value = '';
    onUploaded(result.publicUrl, formatSize(file.size));
  }

  return (
    <div className={className}>
      <label className={`flex items-center justify-center gap-2 cursor-pointer rounded-xl border-2 border-dashed px-4 py-3 text-sm font-medium transition-colors ${
        status === 'uploading'
          ? 'border-teal/40 text-teal/60 cursor-not-allowed'
          : 'border-border text-ink-2/60 hover:border-teal/40 hover:text-teal'
      }`}>
        <input ref={ref} type="file" accept={accept} onChange={handleChange}
          disabled={status === 'uploading'} className="sr-only" />
        {status === 'uploading' ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {progress < 100
              ? (isAr ? `جارٍ الرفع... ${progress}%` : `Uploading... ${progress}%`)
              : (isAr ? 'اكتمل ✓' : 'Done ✓')}
          </>
        ) : (
          <>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
            </svg>
            {isAr ? labelAr : label}
          </>
        )}
      </label>
      {status === 'error' && (
        <p className="text-xs text-coral mt-1">{errorMsg}</p>
      )}
    </div>
  );
}
