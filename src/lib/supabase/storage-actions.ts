'use server';

import { adminClient } from './admin';

const BUCKET = 'zurriya-files';

async function ensureBucket() {
  const { error } = await adminClient.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 52428800, // 50 MB
  });
  if (error && !error.message.toLowerCase().includes('already exists')) {
    console.error('[storage] bucket create error:', error.message);
  }
}

/**
 * Returns a short-lived signed URL for a direct browser → Supabase upload,
 * plus the resulting public URL for storing in the DB.
 */
export async function getSignedUploadUrl(
  childId: string,
  folder: 'gallery' | 'reports' | 'avatars',
  filename: string,
): Promise<{ signedUrl: string; publicUrl: string } | { error: string }> {
  await ensureBucket();

  const ext  = filename.split('.').pop() ?? 'bin';
  const path = `children/${childId}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await adminClient.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error) return { error: error.message };

  const { data: pub } = adminClient.storage.from(BUCKET).getPublicUrl(path);
  return { signedUrl: data.signedUrl, publicUrl: pub.publicUrl };
}
