import { createClient } from '@/lib/supabase/server';
import RelationsClient from './RelationsClient';

export default async function AdminRelationsPage({ params: { locale } }: { params: { locale: string } }) {
  const supabase = await createClient();
  const [{ data: children }, { data: profiles }, { data: relationships }] = await Promise.all([
    supabase.from('children').select('id, name_en, name_ar, age, diagnosis_en, diagnosis_ar').neq('status', 'archived').order('name_en'),
    supabase.from('profiles').select('id, name_en, name_ar, role').order('name_en'),
    supabase.from('child_relationships').select('child_id, parent_id, therapist_id'),
  ]);

  return (
    <RelationsClient
      locale={locale}
      children={children ?? []}
      parents={(profiles ?? []).filter(p => p.role === 'parent')}
      therapists={(profiles ?? []).filter(p => p.role === 'therapist')}
      relationships={relationships ?? []}
    />
  );
}
