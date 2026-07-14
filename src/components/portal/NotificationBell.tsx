'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { markAllNotificationsRead } from '@/lib/supabase/parent-actions';

type Notif = {
  id: string;
  type: string;
  title_en: string;
  title_ar: string;
  body_en: string | null;
  body_ar: string | null;
  is_read: boolean;
  created_at: string;
};

const TYPE_ICON: Record<string, string> = {
  session:    '📅',
  goal:       '🎯',
  objective:  '✅',
  gallery:    '🖼️',
  report:     '📄',
  timeline:   '🗓️',
  reinforcer: '🌟',
};

function timeAgo(dateStr: string, isAr: boolean): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return isAr ? 'الآن' : 'Just now';
  if (mins < 60) return isAr ? `منذ ${mins} دقيقة` : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return isAr ? `منذ ${hrs} ساعة` : `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return isAr ? `منذ ${days} يوم` : `${days}d ago`;
}

export default function NotificationBell({
  notifications: initial,
  locale,
}: {
  notifications: Notif[];
  locale: string;
}) {
  const isAr = locale === 'ar';
  const router = useRouter();
  const [open, setOpen]             = useState(false);
  const [notifs, setNotifs]         = useState(initial);
  const [, startTransition]         = useTransition();

  const unread = notifs.filter((n) => !n.is_read).length;

  function handleOpen() {
    setOpen(true);
    if (unread === 0) return;
    setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
    startTransition(async () => {
      await markAllNotificationsRead();
      router.refresh();
    });
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="relative text-white/70 hover:text-white transition-colors"
        aria-label={isAr ? 'الإشعارات' : 'Notifications'}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -end-1 min-w-[16px] h-4 bg-coral rounded-full text-[9px] font-bold text-white flex items-center justify-center px-0.5 leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-ink/30 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-0 bg-ink/20 z-40 hidden md:block" onClick={() => setOpen(false)} />
          <div
            className={`fixed inset-y-0 ${isAr ? 'left-0' : 'right-0'} w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-white flex-shrink-0 safe-area-pt">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-ink">
                  {isAr ? 'الإشعارات' : 'Notifications'}
                </h2>
                {notifs.length > 0 && (
                  <span className="text-[11px] text-ink-2/50">{notifs.length}</span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-paper text-ink-2/60 hover:text-ink transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* List */}
            <div className={`flex-1 overflow-y-auto divide-y divide-border safe-area-pb ${isAr ? 'text-right' : ''}`}>
              {notifs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                  <span className="text-4xl mb-3">🔔</span>
                  <p className="text-sm font-semibold text-ink mb-1">
                    {isAr ? 'لا توجد إشعارات بعد' : 'No notifications yet'}
                  </p>
                  <p className="text-xs text-ink-2/50">
                    {isAr
                      ? 'ستظهر هنا التحديثات من المعالج'
                      : 'Updates from your therapist will appear here'}
                  </p>
                </div>
              ) : (
                notifs.map((n) => (
                  <div
                    key={n.id}
                    className={`px-5 py-4 flex items-start gap-3 transition-colors ${
                      !n.is_read ? 'bg-teal-pale/40' : 'hover:bg-paper/60'
                    } ${isAr ? 'flex-row-reverse' : ''}`}
                  >
                    <span className="text-xl flex-shrink-0 mt-0.5">
                      {TYPE_ICON[n.type] ?? '📋'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink leading-snug">
                        {isAr ? n.title_ar : n.title_en}
                      </p>
                      {(isAr ? n.body_ar : n.body_en) && (
                        <p className="text-xs text-ink-2/70 mt-0.5 leading-relaxed">
                          {isAr ? n.body_ar : n.body_en}
                        </p>
                      )}
                      <p className="text-[10px] text-ink-2/40 mt-1">
                        {timeAgo(n.created_at, isAr)}
                      </p>
                    </div>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-teal flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
