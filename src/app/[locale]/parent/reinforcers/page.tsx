import { redirect }           from 'next/navigation';
import { getParentChildId }   from '@/lib/supabase/portal-data';
import { createClient }       from '@/lib/supabase/server';
import ReinforcersClient      from './ReinforcersClient';

export default async function ParentReinforcersPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr    = locale === 'ar';
  const childId = await getParentChildId();
  if (!childId) redirect(`/${locale}/parent`);

  const supabase = await createClient();
  const { data: reinforcers } = await supabase
    .from('reinforcers')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: true });

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-ink">{isAr ? 'المعززات المفضلة' : 'Favorite Reinforcers'}</h1>
        <p className="text-sm text-ink-2 mt-0.5">
          {isAr ? 'ما يحبه طفلك ويحفزه' : "What motivates and delights your child"}
        </p>
      </div>
      <ReinforcersClient reinforcers={reinforcers ?? []} locale={locale} childId={childId} />
    </div>
  );
}
