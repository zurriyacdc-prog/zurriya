import { createClient } from '@/lib/supabase/server';
import ChildrenClient from './ChildrenClient';

export default async function AdminChildrenPage({ params: { locale } }: { params: { locale: string } }) {
  const supabase = await createClient();
  const [{ data: children }, { data: profiles }] = await Promise.all([
    supabase.from('children').select('id, name_en, name_ar, age, diagnosis_en, diagnosis_ar, status').neq('status', 'archived').order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, name_en, name_ar, role').order('name_en'),
  ]);

  return (
    <ChildrenClient
      locale={locale}
      children={children ?? []}
      parents={(profiles ?? []).filter(p => p.role === 'parent')}
      therapists={(profiles ?? []).filter(p => p.role === 'therapist')}
    />
  );
}
