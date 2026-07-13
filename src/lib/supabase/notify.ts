'use server';

import { adminClient } from './admin';

type NotifPayload = {
  childId: string;
  type: string;
  titleEn: string;
  titleAr: string;
  bodyEn?: string;
  bodyAr?: string;
};

export async function notifyParent({ childId, type, titleEn, titleAr, bodyEn, bodyAr }: NotifPayload) {
  // Find the parent linked to this child
  const { data: rel } = await adminClient
    .from('child_relationships')
    .select('parent_id')
    .eq('child_id', childId)
    .not('parent_id', 'is', null)
    .limit(1)
    .maybeSingle();

  if (!rel?.parent_id) return;

  // Insert in-app notification (fast, awaited)
  await adminClient.from('notifications').insert({
    child_id: childId,
    parent_id: rel.parent_id,
    type,
    title_en: titleEn,
    title_ar: titleAr,
    body_en:  bodyEn ?? null,
    body_ar:  bodyAr ?? null,
  });

  // Send push in parallel — don't block the action on it
  sendPush(rel.parent_id, { titleEn, titleAr, bodyEn: bodyEn ?? '', bodyAr: bodyAr ?? '' }).catch(() => {});
}

async function sendPush(
  userId: string,
  msg: { titleEn: string; titleAr: string; bodyEn: string; bodyAr: string },
) {
  const publicKey  = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject    = process.env.VAPID_SUBJECT;
  if (!publicKey || !privateKey || !subject) return; // VAPID not configured yet

  const { data: subs } = await adminClient
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth, locale')
    .eq('user_id', userId);

  if (!subs?.length) return;

  const webpush = (await import('web-push')).default;
  webpush.setVapidDetails(subject, publicKey, privateKey);

  await Promise.allSettled(
    subs.map(async (sub) => {
      const isAr    = sub.locale === 'ar';
      const payload = JSON.stringify({
        title: isAr ? msg.titleAr : msg.titleEn,
        body:  isAr ? msg.bodyAr  : msg.bodyEn,
        icon:  '/logo/logo.png',
        badge: '/logo/logo.png',
        url:   `/${sub.locale}/parent`,
      });
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload,
        );
      } catch (err: unknown) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 410 || status === 404) {
          // Expired subscription — clean it up
          await adminClient.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
        }
      }
    }),
  );
}
