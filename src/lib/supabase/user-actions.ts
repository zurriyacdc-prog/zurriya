'use server';

import { createClient } from './server';

export async function changeOwnPassword(currentPassword: string, newPassword: string) {
  if (newPassword.length < 8) return { error: 'Password must be at least 8 characters' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return { error: 'Not authenticated' };

  // Re-authenticate to verify current password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (signInError) return { error: 'Current password is incorrect' };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };
  return { success: true };
}
