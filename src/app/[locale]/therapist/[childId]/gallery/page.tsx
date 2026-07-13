import { createClient } from '@/lib/supabase/server';
import GalleryClient  from './GalleryClient';

export default async function TherapistGalleryPage({
  params: { locale, childId },
}: { params: { locale: string; childId: string } }) {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from('gallery')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: false });

  return <GalleryClient items={items ?? []} locale={locale} childId={childId} />;
}
