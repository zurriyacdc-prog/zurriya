import { redirect }         from 'next/navigation';
import { getParentChildId } from '@/lib/supabase/portal-data';
import { createClient }     from '@/lib/supabase/server';
import GalleryClient        from './GalleryClient';

export default async function ParentGalleryPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr    = locale === 'ar';
  const childId = await getParentChildId();
  if (!childId) redirect(`/${locale}/parent`);

  const supabase = await createClient();
  const { data: items } = await supabase
    .from('gallery')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: false });

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-ink">{isAr ? 'معرض النمو' : 'Growth Gallery'}</h1>
        <p className="text-sm text-ink-2 mt-0.5">
          {isAr ? 'لحظات رحلة طفلك موثقة بالصور والفيديو' : "Moments from your child's journey"}
        </p>
      </div>
      <GalleryClient items={items ?? []} locale={locale} />
    </div>
  );
}
