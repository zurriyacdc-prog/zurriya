import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';
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

  const [profileResult, notifsResult] = await Promise.all([
    user
      ? supabase.from('profiles').select('name_en, name_ar').eq('id', user.id).single()
      : Promise.resolve({ data: null }),
    user
      ? adminClient
          .from('notifications')
          .select('id, type, title_en, title_ar, body_en, body_ar, is_read, created_at')
          .eq('parent_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50)
      : Promise.resolve({ data: [] }),
  ]);

  return (
    <ParentShell
      locale={locale}
      nameEn={profileResult.data?.name_en ?? 'Parent'}
      nameAr={profileResult.data?.name_ar ?? 'ولي الأمر'}
      notifications={notifsResult.data ?? []}
    >
      {children}
    </ParentShell>
  );
}
