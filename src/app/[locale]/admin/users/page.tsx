import { createClient } from '@/lib/supabase/server';
import UsersPageClient from './UsersClient';

export default async function AdminUsersPage({ params: { locale } }: { params: { locale: string } }) {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from('profiles')
    .select('id, name_en, name_ar, role, is_active')
    .order('created_at', { ascending: false });

  return <UsersPageClient locale={locale} users={users ?? []} />;
}
