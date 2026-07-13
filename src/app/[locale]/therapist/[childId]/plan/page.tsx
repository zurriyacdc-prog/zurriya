import { createClient } from '@/lib/supabase/server';
import PlanClient      from './PlanClient';

export default async function TherapistPlanPage({
  params: { locale, childId },
}: { params: { locale: string; childId: string } }) {
  const supabase = await createClient();
  const { data: goals } = await supabase
    .from('goals')
    .select('*, objectives(*)')
    .eq('child_id', childId)
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  const allGoals = (goals ?? []).map((g: Record<string, unknown>) => ({
    ...g,
    objectives: (Array.isArray(g.objectives) ? g.objectives : []).sort(
      (a: Record<string, unknown>, b: Record<string, unknown>) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0)
    ),
  }));

  return <PlanClient goals={allGoals as Parameters<typeof PlanClient>[0]['goals']} locale={locale} childId={childId} />;
}
