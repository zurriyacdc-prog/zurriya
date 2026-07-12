import { createClient } from '@/lib/supabase/server';
import ParentShell from '@/components/portal/ParentShell';

export default async function ParentPortalLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from('profiles').select('name_en, name_ar').eq('id', user.id).single()
    : { data: null };

  return (
    <ParentShell
      locale={locale}
      nameEn={profile?.name_en ?? 'Parent'}
      nameAr={profile?.name_ar ?? 'ولي الأمر'}
    >
      {children}
    </ParentShell>
  );
}
