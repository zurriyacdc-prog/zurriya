import { createClient } from './server';

/** Get the child linked to the currently logged-in parent */
export async function getMyChildAsParent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: rel } = await supabase
    .from('child_relationships')
    .select('child_id')
    .eq('parent_id', user.id)
    .single();

  if (!rel?.child_id) return null;

  const { data: child } = await supabase
    .from('children')
    .select('*')
    .eq('id', rel.child_id)
    .single();

  return child;
}

/** Get all children linked to the currently logged-in therapist */
export async function getMyChildrenAsTherapist() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: rels } = await supabase
    .from('child_relationships')
    .select('child_id')
    .eq('therapist_id', user.id);

  if (!rels?.length) return [];

  const ids = rels.map(r => r.child_id);
  const { data: children } = await supabase
    .from('children')
    .select('*')
    .in('id', ids)
    .order('name_en');

  return children ?? [];
}

/** Get therapist profile for a given child */
export async function getChildTherapist(childId: string) {
  const supabase = await createClient();
  const { data: rel } = await supabase
    .from('child_relationships')
    .select('therapist_id')
    .eq('child_id', childId)
    .single();

  if (!rel?.therapist_id) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('name_en, name_ar, role')
    .eq('id', rel.therapist_id)
    .single();

  return profile;
}
