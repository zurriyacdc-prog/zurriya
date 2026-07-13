import { redirect }         from 'next/navigation';
import { getParentChildId } from '@/lib/supabase/portal-data';
import { createClient }     from '@/lib/supabase/server';
import PlanClient           from './PlanClient';

export default async function ParentPlanPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr    = locale === 'ar';
  const childId = await getParentChildId();
  if (!childId) redirect(`/${locale}/parent`);

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

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-ink">{isAr ? 'خطة العلاج' : 'Treatment Plan'}</h1>
        <p className="text-sm text-ink-2 mt-0.5">
          {isAr ? 'أهداف وخطوات رحلة طفلك' : "Your child's goals and milestones"}
        </p>
      </div>
      <PlanClient goals={allGoals as Parameters<typeof PlanClient>[0]['goals']} locale={locale} />
    </div>
  );
}
