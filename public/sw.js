// Zurriya PWA Service Worker — handles push notifications

self.addEventListener('push', function (event) {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) {}

  const title = data.title || 'Zurriya';
  const options = {
    body:  data.body  || '',
    icon:  data.icon  || '/logo/logo.png',
    badge: data.badge || '/logo/logo.png',
    data:  { url: data.url || '/' },
    vibrate: [200, 100, 200],
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const target = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (const client of list) {
        if (client.url === target && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(target);
    })
  );
});

// Minimal fetch handler — just pass through (no caching strategy yet)
self.addEventListener('fetch', function () {});
