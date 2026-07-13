import { createClient }   from '@/lib/supabase/server';
import { redirect }        from 'next/navigation';
import ChildLayoutTabs     from './ChildLayoutTabs';

export default async function ChildLayout({
  children,
  params: { locale, childId },
}: {
  children: React.ReactNode;
  params: { locale: string; childId: string };
}) {
  const supabase = await createClient();
  const { data: child } = await supabase
    .from('children')
    .select('*')
    .eq('id', childId)
    .single();

  if (!child) redirect(`/${locale}/therapist`);

  return (
    <div className="flex flex-col h-full">
      <ChildLayoutTabs child={child} locale={locale} />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
