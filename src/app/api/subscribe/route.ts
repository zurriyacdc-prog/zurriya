import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const body = await request.json();
  const { subscription, locale } = body as {
    subscription: { endpoint: string; keys: { p256dh: string; auth: string } };
    locale?: string;
  };

  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return new NextResponse('Invalid subscription', { status: 400 });
  }

  await adminClient.from('push_subscriptions').upsert(
    {
      user_id:  user.id,
      endpoint: subscription.endpoint,
      p256dh:   subscription.keys.p256dh,
      auth:     subscription.keys.auth,
      locale:   locale ?? 'en',
    },
    { onConflict: 'user_id,endpoint' },
  );

  return new NextResponse('OK', { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const { endpoint } = await request.json() as { endpoint: string };
  if (!endpoint) return new NextResponse('Missing endpoint', { status: 400 });

  await adminClient
    .from('push_subscriptions')
    .delete()
    .eq('user_id', user.id)
    .eq('endpoint', endpoint);

  return new NextResponse('OK', { status: 200 });
}
