import { createClient } from './server';
import { adminClient } from './admin';

/** Find the active child linked to this parent (handles multiple rows safely) */
async function resolveParentChild(userId: string) {
  const { data: rels } = await adminClient
    .from('child_relationships')
    .select('child_id, therapist_id')
    .eq('parent_id', userId);

  if (!rels?.length) return null;

  const ids = rels.map(r => r.child_id);
  const { data: child } = await adminClient
    .from('children')
    .select('id')
    .in('id', ids)
    .neq('status', 'archived')
    .limit(1)
    .maybeSingle();

  if (!child) return null;
  return rels.find(r => r.child_id === child.id) ?? null;
}

export async function getParentChildId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const rel = await resolveParentChild(user.id);
  return rel?.child_id ?? null;
}

/** Get the child linked to the currently logged-in parent */
export async function getMyChildAsParent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const rel = await resolveParentChild(user.id);
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
  const { data: rel } = await adminClient
    .from('child_relationships')
    .select('therapist_id')
    .eq('child_id', childId)
    .single();

  if (!rel?.therapist_id) return null;

  const { data: profile } = await adminClient
    .from('profiles')
    .select('name_en, name_ar, role')
    .eq('id', rel.therapist_id)
    .single();

  return profile;
}
