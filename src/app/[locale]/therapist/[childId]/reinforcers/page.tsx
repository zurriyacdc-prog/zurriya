import { createClient }    from '@/lib/supabase/server';
import ReinforcersClient  from './ReinforcersClient';

export default async function TherapistReinforcersPage({
  params: { locale, childId },
}: { params: { locale: string; childId: string } }) {
  const supabase = await createClient();
  const { data: reinforcers } = await supabase
    .from('reinforcers')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: true });

  return <ReinforcersClient reinforcers={reinforcers ?? []} locale={locale} childId={childId} />;
}
