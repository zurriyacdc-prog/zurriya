'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from './server';
import { adminClient } from './admin';

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ── Sessions ─────────────────────────────────────────────────────────────────
export async function recordSession(formData: FormData) {
  const user = await getUser();
  if (!user) return { error: 'Unauthorized' };

  const childId = formData.get('child_id') as string;
  const { error } = await adminClient.from('sessions').insert({
    child_id:         childId,
    therapist_id:     user.id,
    session_date:     formData.get('session_date') as string,
    type:             formData.get('type') as string,
    duration_minutes: Number(formData.get('duration_minutes') || 60),
    engagement_score: Number(formData.get('engagement_score') || 0) || null,
    notes_en:         formData.get('notes_en') as string || null,
    notes_ar:         formData.get('notes_ar') as string || null,
  });

  if (error) return { error: error.message };
  revalidatePath(`/[locale]/therapist/${childId}/sessions`);
  revalidatePath(`/[locale]/parent/sessions`);
  return { success: true };
}

// ── Timeline events ───────────────────────────────────────────────────────────
export async function addTimelineEvent(formData: FormData) {
  const user = await getUser();
  if (!user) return { error: 'Unauthorized' };

  const childId = formData.get('child_id') as string;
  const { error } = await adminClient.from('timeline_events').insert({
    child_id:        childId,
    type:            formData.get('type') as string,
    title_en:        formData.get('title_en') as string,
    title_ar:        formData.get('title_ar') as string || formData.get('title_en') as string,
    description_en:  formData.get('description_en') as string || null,
    description_ar:  formData.get('description_ar') as string || null,
    event_date:      formData.get('event_date') as string,
    created_by:      user.id,
  });

  if (error) return { error: error.message };
  revalidatePath(`/[locale]/therapist/${childId}/timeline`);
  revalidatePath(`/[locale]/parent/journey`);
  return { success: true };
}

export async function deleteTimelineEvent(eventId: string, childId: string) {
  await adminClient.from('timeline_events').delete().eq('id', eventId);
  revalidatePath(`/[locale]/therapist/${childId}/timeline`);
  revalidatePath(`/[locale]/parent/journey`);
}

// ── Goals ────────────────────────────────────────────────────────────────────
export async function addGoal(formData: FormData) {
  const user = await getUser();
  if (!user) return { error: 'Unauthorized' };

  const childId = formData.get('child_id') as string;
  const { error } = await adminClient.from('goals').insert({
    child_id:   childId,
    type:       formData.get('type') as string,
    title_en:   formData.get('title_en') as string,
    title_ar:   formData.get('title_ar') as string || formData.get('title_en') as string,
    domain:     formData.get('domain') as string || null,
    color:      formData.get('color') as string || '#1B5E6E',
    progress:   0,
    is_active:  true,
    created_by: user.id,
  });

  if (error) return { error: error.message };
  revalidatePath(`/[locale]/therapist/${childId}/plan`);
  revalidatePath(`/[locale]/parent/plan`);
  return { success: true };
}

export async function updateGoalProgress(goalId: string, progress: number, childId: string) {
  await adminClient.from('goals').update({ progress }).eq('id', goalId);
  revalidatePath(`/[locale]/therapist/${childId}/plan`);
  revalidatePath(`/[locale]/parent/plan`);
}

export async function addObjective(goalId: string, textEn: string, textAr: string, childId: string) {
  const { data: existing } = await adminClient.from('objectives').select('sort_order').eq('goal_id', goalId).order('sort_order', { ascending: false }).limit(1).single();
  await adminClient.from('objectives').insert({
    goal_id:    goalId,
    text_en:    textEn,
    text_ar:    textAr || textEn,
    is_done:    false,
    sort_order: (existing?.sort_order ?? 0) + 1,
  });
  revalidatePath(`/[locale]/therapist/${childId}/plan`);
  revalidatePath(`/[locale]/parent/plan`);
}

export async function toggleObjective(objectiveId: string, isDone: boolean, childId: string) {
  await adminClient.from('objectives').update({ is_done: isDone }).eq('id', objectiveId);
  revalidatePath(`/[locale]/therapist/${childId}/plan`);
  revalidatePath(`/[locale]/parent/plan`);
}

export async function deleteObjective(objectiveId: string, childId: string) {
  await adminClient.from('objectives').delete().eq('id', objectiveId);
  revalidatePath(`/[locale]/therapist/${childId}/plan`);
  revalidatePath(`/[locale]/parent/plan`);
}

export async function deleteGoal(goalId: string, childId: string) {
  await adminClient.from('objectives').delete().eq('goal_id', goalId);
  await adminClient.from('goals').delete().eq('id', goalId);
  revalidatePath(`/[locale]/therapist/${childId}/plan`);
  revalidatePath(`/[locale]/parent/plan`);
}

export async function editGoal(goalId: string, formData: FormData, childId: string) {
  await adminClient.from('goals').update({
    title_en: formData.get('title_en') as string,
    title_ar: formData.get('title_ar') as string || formData.get('title_en') as string,
    domain:   formData.get('domain') as string || null,
  }).eq('id', goalId);
  revalidatePath(`/[locale]/therapist/${childId}/plan`);
  revalidatePath(`/[locale]/parent/plan`);
}

// ── Reinforcers ──────────────────────────────────────────────────────────────
export async function addReinforcer(formData: FormData) {
  const user = await getUser();
  if (!user) return { error: 'Unauthorized' };

  const childId = formData.get('child_id') as string;
  const { error } = await adminClient.from('reinforcers').insert({
    child_id:   childId,
    name_en:    formData.get('name_en') as string,
    name_ar:    formData.get('name_ar') as string || formData.get('name_en') as string,
    emoji:      formData.get('emoji') as string || '⭐',
    category:   formData.get('category') as string,
    is_favorite: false,
    created_by: user.id,
  });

  if (error) return { error: error.message };
  revalidatePath(`/[locale]/therapist/${childId}/reinforcers`);
  revalidatePath(`/[locale]/parent/reinforcers`);
  return { success: true };
}

export async function toggleReinforcer(id: string, isFavorite: boolean, childId: string) {
  await adminClient.from('reinforcers').update({ is_favorite: isFavorite }).eq('id', id);
  revalidatePath(`/[locale]/therapist/${childId}/reinforcers`);
  revalidatePath(`/[locale]/parent/reinforcers`);
}

export async function deleteReinforcer(id: string, childId: string) {
  await adminClient.from('reinforcers').delete().eq('id', id);
  revalidatePath(`/[locale]/therapist/${childId}/reinforcers`);
  revalidatePath(`/[locale]/parent/reinforcers`);
}

// ── Reports ──────────────────────────────────────────────────────────────────
export async function addReport(formData: FormData) {
  const user = await getUser();
  if (!user) return { error: 'Unauthorized' };

  const childId = formData.get('child_id') as string;
  const { error } = await adminClient.from('reports').insert({
    child_id:    childId,
    uploaded_by: user.id,
    type:        formData.get('type') as string || 'other',
    name_en:     formData.get('name_en') as string,
    name_ar:     formData.get('name_ar') as string || formData.get('name_en') as string,
    file_url:    formData.get('file_url') as string,
    file_size:   formData.get('file_size') as string || null,
  });

  if (error) return { error: error.message };
  revalidatePath(`/[locale]/therapist/${childId}/reports`);
  revalidatePath(`/[locale]/parent/reports`);
  return { success: true };
}

export async function deleteReport(reportId: string, childId: string) {
  await adminClient.from('reports').delete().eq('id', reportId);
  revalidatePath(`/[locale]/therapist/${childId}/reports`);
  revalidatePath(`/[locale]/parent/reports`);
}

// ── Gallery ──────────────────────────────────────────────────────────────────
export async function addGalleryItem(formData: FormData) {
  const user = await getUser();
  if (!user) return { error: 'Unauthorized' };

  const childId = formData.get('child_id') as string;
  const { error } = await adminClient.from('gallery').insert({
    child_id:    childId,
    uploaded_by: user.id,
    media_type:  formData.get('media_type') as string || 'photo',
    url:         formData.get('url') as string,
    caption_en:  formData.get('caption_en') as string || null,
    caption_ar:  formData.get('caption_ar') as string || null,
    taken_at:    formData.get('taken_at') as string || new Date().toISOString(),
  });

  if (error) return { error: error.message };
  revalidatePath(`/[locale]/therapist/${childId}/gallery`);
  revalidatePath(`/[locale]/parent/gallery`);
  return { success: true };
}

export async function deleteGalleryItem(itemId: string, childId: string) {
  await adminClient.from('gallery').delete().eq('id', itemId);
  revalidatePath(`/[locale]/therapist/${childId}/gallery`);
  revalidatePath(`/[locale]/parent/gallery`);
}

// ── Child avatar ──────────────────────────────────────────────────────────────
export async function updateChildAvatar(childId: string, avatarUrl: string) {
  await adminClient.from('children').update({ avatar_emoji: avatarUrl }).eq('id', childId);
  revalidatePath(`/[locale]/therapist/${childId}`);
  revalidatePath(`/[locale]/parent`);
}
