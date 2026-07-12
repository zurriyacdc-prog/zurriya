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

  const tempPassword = Math.random().toString(36).slice(-10) + 'Zr1!';

  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { name_en: nameEn, name_ar: nameAr || nameEn, role },
  });

  if (error) return { error: error.message };

  // Upsert profile in case trigger was slow
  await adminClient.from('profiles').upsert({
    id: data.user.id,
    role: role as 'parent' | 'therapist' | 'admin',
    name_en: nameEn,
    name_ar: nameAr || nameEn,
    is_active: true,
  });

  revalidatePath('/[locale]/admin', 'layout');
  return { success: true, tempPassword };
}

export async function toggleUserStatus(userId: string, isActive: boolean) {
  await adminClient.from('profiles').update({ is_active: isActive }).eq('id', userId);
  revalidatePath('/[locale]/admin/users');
}

export async function createChild(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await adminClient.from('children').insert({
    name_en:       formData.get('name_en') as string,
    name_ar:       formData.get('name_ar') as string || formData.get('name_en') as string,
    age:           Number(formData.get('age')),
    diagnosis_en:  formData.get('diagnosis_en') as string,
    diagnosis_ar:  formData.get('diagnosis_ar') as string || formData.get('diagnosis_en') as string,
    status:        'active',
    avatar_emoji:  '👦',
    created_by:    user.id,
  });

  if (error) return { error: error.message };
  revalidatePath('/[locale]/admin/children');
  return { success: true };
}

export async function archiveChild(childId: string) {
  await adminClient.from('children').update({ status: 'archived' }).eq('id', childId);
  revalidatePath('/[locale]/admin/children');
}

export async function saveRelationship(childId: string, parentId: string | null, therapistId: string | null) {
  // Delete existing then insert fresh
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
