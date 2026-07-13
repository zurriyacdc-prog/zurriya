import { adminClient } from '@/lib/supabase/admin';
import ChildrenClient from './ChildrenClient';

export default async function AdminChildrenPage({ params: { locale } }: { params: { locale: string } }) {
  const [{ data: active }, { data: archived }, { data: profiles }] = await Promise.all([
    adminClient.from('children').select('id, name_en, name_ar, age, diagnosis_en, diagnosis_ar, status, avatar_emoji').neq('status', 'archived').order('created_at', { ascending: false }),
    adminClient.from('children').select('id, name_en, name_ar, age, diagnosis_en, diagnosis_ar, status, avatar_emoji').eq('status', 'archived').order('name_en'),
    adminClient.from('profiles').select('id, name_en, name_ar, role').order('name_en'),
  ]);

  return (
    <ChildrenClient
      locale={locale}
      childList={active ?? []}
      archivedList={archived ?? []}
      parents={(profiles ?? []).filter(p => p.role === 'parent')}
      therapists={(profiles ?? []).filter(p => p.role === 'therapist')}
    />
  );
}
