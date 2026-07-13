import Link      from 'next/link';
import { notFound } from 'next/navigation';
import { adminClient } from '@/lib/supabase/admin';
import DocsClient from './DocsClient';

export default async function AdminChildDocsPage({
  params: { locale, childId },
}: { params: { locale: string; childId: string } }) {
  const isAr = locale === 'ar';

  const [{ data: child }, { data: reports }] = await Promise.all([
    adminClient.from('children').select('id, name_en, name_ar').eq('id', childId).single(),
    adminClient.from('reports').select('id, title_en, title_ar, type, file_url, file_size, created_at')
      .eq('child_id', childId).order('created_at', { ascending: false }),
  ]);

  if (!child) notFound();

  const childName = isAr ? child.name_ar : child.name_en;

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link href={`/${locale}/admin/children`}
          className="text-ink-2/60 hover:text-teal transition-colors">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            className={isAr ? 'rotate-180' : ''}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-ink">{isAr ? 'ملفات الطفل' : 'Child Documents'}</h1>
          <p className="text-sm text-ink-2 mt-0.5">{childName}</p>
        </div>
      </div>

      <DocsClient
        reports={reports ?? []}
        locale={locale}
        childId={childId}
        childName={childName}
      />
    </div>
  );
}
