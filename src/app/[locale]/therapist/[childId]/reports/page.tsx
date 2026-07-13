import { createClient } from '@/lib/supabase/server';
import ReportsClient  from './ReportsClient';

export default async function TherapistReportsPage({
  params: { locale, childId },
}: { params: { locale: string; childId: string } }) {
  const supabase = await createClient();
  const { data: reports } = await supabase
    .from('reports')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: false });

  return <ReportsClient reports={reports ?? []} locale={locale} childId={childId} />;
}
