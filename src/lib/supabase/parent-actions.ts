'use server';

import { createClient } from './server';
import { adminClient } from './admin';

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function markAllNotificationsRead() {
  const user = await getUser();
  if (!user) return;
  await adminClient
    .from('notifications')
    .update({ is_read: true })
    .eq('parent_id', user.id)
    .eq('is_read', false);
}
