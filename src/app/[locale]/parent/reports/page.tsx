import { redirect }         from 'next/navigation';
import { getParentChildId } from '@/lib/supabase/portal-data';
import { createClient }     from '@/lib/supabase/server';
import ReportsClient        from './ReportsClient';

export default async function ParentReportsPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr    = locale === 'ar';
  const childId = await getParentChildId();
  if (!childId) redirect(`/${locale}/parent`);

  const supabase = await createClient();
  const { data: reports } = await supabase
    .from('reports')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: false });

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-ink">{isAr ? 'التقارير والوثائق' : 'Reports'}</h1>
        <p className="text-sm text-ink-2 mt-0.5">
          {isAr ? 'جميع وثائق طفلك في مكان واحد' : "All your child's documents in one place"}
        </p>
      </div>
      <ReportsClient reports={reports ?? []} locale={locale} />
    </div>
  );
}
