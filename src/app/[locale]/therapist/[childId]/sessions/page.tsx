import { createClient } from '@/lib/supabase/server';
import SessionsClient  from './SessionsClient';

export default async function TherapistSessionsPage({
  params: { locale, childId },
}: { params: { locale: string; childId: string } }) {
  const supabase = await createClient();
  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .eq('child_id', childId)
    .order('session_date', { ascending: false });

  return <SessionsClient sessions={sessions ?? []} locale={locale} childId={childId} />;
}
