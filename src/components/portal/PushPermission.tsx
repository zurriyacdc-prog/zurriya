'use client';

import { useEffect } from 'react';

function urlBase64ToUint8Array(base64: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64     = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw     = window.atob(b64);
  const buf     = new ArrayBuffer(raw.length);
  const output  = new Uint8Array(buf);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return buf;
}

async function saveSubscription(subscription: PushSubscription, locale: string) {
  await fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription: subscription.toJSON(), locale }),
  });
}

async function registerAndSubscribe(locale: string) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidKey) return; // VAPID not configured yet

  const reg = await navigator.serviceWorker.register('/sw.js');
  await navigator.serviceWorker.ready;

  const existing = await reg.pushManager.getSubscription();
  if (existing) {
    await saveSubscription(existing, locale);
    return;
  }

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidKey),
  });
  await saveSubscription(sub, locale);
}

async function askPermissionAndRegister(locale: string) {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') await registerAndSubscribe(locale);
}

export default function PushPermission({ locale }: { locale: string }) {
  useEffect(() => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      registerAndSubscribe(locale).catch(() => {});
      return;
    }

    if (Notification.permission === 'default') {
      const timer = setTimeout(() => {
        askPermissionAndRegister(locale).catch(() => {});
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [locale]);

  return null;
}
