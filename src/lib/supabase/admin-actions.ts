'use server';

import { revalidatePath } from 'next/cache';
import { adminClient } from './admin';
import { createClient } from './server';

export async function createUser(formData: FormData) {
  const nameEn = formData.get('name_en') as string;
  const nameAr = formData.get('name_ar') as string;
  const email  = formData.get('email') as string;
  const role   = formData.get('role') as string;

  if (!email || !nameEn) return { error: 'Name and email are required' };

  const tempPassword = Math.random().toString(36).slice(-8) + 'Zr1!';

  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { name_en: nameEn, name_ar: nameAr || nameEn, role },
  });

  if (error) return { error: error.message };

  await adminClient.from('profiles').upsert({
    id: data.user.id,
    role,
    name_en: nameEn,
    name_ar: nameAr || nameEn,
    is_active: true,
  });

  revalidatePath('/[locale]/admin', 'layout');
  return { success: true, tempPassword };
}

export async function deleteUser(userId: string) {
  const { error } = await adminClient.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };
  await adminClient.from('profiles').delete().eq('id', userId);
  revalidatePath('/[locale]/admin/users');
  return { success: true };
}

export async function resetUserPassword(userId: string) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const base  = Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const newPassword = base + 'Zr1!';

  const { error } = await adminClient.auth.admin.updateUserById(userId, { password: newPassword });
  if (error) return { error: error.message };
  return { success: true, newPassword };
}

export async function toggleUserStatus(userId: string, isActive: boolean) {
  await adminClient.from('profiles').update({ is_active: isActive }).eq('id', userId);
  revalidatePath('/[locale]/admin/users');
}

export async function createChild(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const nameEn      = formData.get('name_en') as string;
  const nameAr      = formData.get('name_ar') as string;
  const diagnosisEn = formData.get('diagnosis_en') as string;
  const diagnosisAr = formData.get('diagnosis_ar') as string;
  const parentId    = formData.get('parent_id') as string || null;
  const therapistId = formData.get('therapist_id') as string || null;

  const { data: child, error } = await adminClient
    .from('children')
    .insert({
      name_en:      nameEn,
      name_ar:      nameAr || nameEn,
      age:          Number(formData.get('age')),
      diagnosis_en: diagnosisEn,
      diagnosis_ar: diagnosisAr || diagnosisEn,
      status:       'active',
      avatar_emoji: '👦',
      created_by:   user.id,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };

  // Auto-create relationship if parent or therapist selected
  if (child && (parentId || therapistId)) {
    await adminClient.from('child_relationships').insert({
      child_id:     child.id,
      parent_id:    parentId,
      therapist_id: therapistId,
    });
  }

  revalidatePath('/[locale]/admin/children');
  return { success: true };
}

export async function archiveChild(childId: string) {
  await adminClient.from('children').update({ status: 'archived' }).eq('id', childId);
  revalidatePath('/[locale]/admin/children');
}

export async function saveRelationship(childId: string, parentId: string | null, therapistId: string | null) {
  await adminClient.from('child_relationships').delete().eq('child_id', childId);
  if (parentId || therapistId) {
    await adminClient.from('child_relationships').insert({
      child_id:     childId,
      parent_id:    parentId   || null,
      therapist_id: therapistId || null,
    });
  }
  revalidatePath('/[locale]/admin/relations');
  return { success: true };
}
