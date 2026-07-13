import { createClient } from '@/lib/supabase/server';
import TimelineClient  from './TimelineClient';

export default async function TherapistTimelinePage({
  params: { locale, childId },
}: { params: { locale: string; childId: string } }) {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from('timeline_events')
    .select('*')
    .eq('child_id', childId)
    .order('event_date', { ascending: false });

  return <TimelineClient events={events ?? []} locale={locale} childId={childId} />;
}
