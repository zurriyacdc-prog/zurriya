import { createClient } from '@/lib/supabase/server';
import AdminShell from '@/components/portal/AdminShell';

export default async function AdminLayout({
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
    <AdminShell
      locale={locale}
      nameEn={profile?.name_en ?? 'Admin'}
      nameAr={profile?.name_ar ?? 'مدير'}
    >
      {children}
    </AdminShell>
  );
}
