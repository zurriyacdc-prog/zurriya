'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateChildAvatar } from '@/lib/supabase/therapist-actions';
import FileUpload from './FileUpload';

const EMOJIS = [
  '👦','👧','🧒','👶','🐻','🐼','🦁','🐸','🌟','🌈','🦋','🐬','🦊','🐨','🦄','🐙',
];

type Props = {
  childId: string;
  currentAvatar: string;
  locale: string;
};

function isUrl(s: string) {
  return s.startsWith('http') || s.startsWith('/');
}

export function AvatarDisplay({ avatar, size = 'md' }: { avatar: string; size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'lg' ? 'w-16 h-16 text-3xl' : size === 'sm' ? 'w-8 h-8 text-base' : 'w-10 h-10 text-xl';
  if (isUrl(avatar)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={avatar} alt="child avatar" className={`${dim} rounded-full object-cover`} />
    );
  }
  return (
    <div className={`${dim} rounded-full bg-teal-pale flex items-center justify-center`}>
      {avatar || '👦'}
    </div>
  );
}

export default function AvatarPicker({ childId, currentAvatar, locale }: Props) {
  const isAr  = locale === 'ar';
  const router = useRouter();

  const [open, setOpen]              = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError]            = useState('');

  function pick(value: string) {
    setError('');
    startTransition(async () => {
      await updateChildAvatar(childId, value);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={isPending}
        title={isAr ? 'تغيير الصورة الرمزية' : 'Change avatar'}
        className="group relative"
      >
        <AvatarDisplay avatar={currentAvatar} size="md" />
        <div className="absolute inset-0 rounded-full bg-ink/0 group-hover:bg-ink/20 transition-colors flex items-center justify-center">
          <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">✎</span>
        </div>
      </button>

      {open && (
        <div className="absolute start-0 top-12 z-50 bg-white border border-border rounded-2xl shadow-xl p-4 w-64">
          <p className="text-xs font-bold text-ink-2/60 uppercase tracking-wide mb-3">
            {isAr ? 'اختر رمزاً أو ارفع صورة' : 'Pick emoji or upload photo'}
          </p>

          {error && <p className="text-xs text-coral mb-2">{error}</p>}

          {/* Emoji grid */}
          <div className="grid grid-cols-8 gap-1 mb-3">
            {EMOJIS.map((em) => (
              <button
                key={em}
                onClick={() => pick(em)}
                disabled={isPending}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-lg hover:bg-teal-pale transition-colors ${
                  currentAvatar === em ? 'bg-teal-pale ring-2 ring-teal' : ''
                }`}
              >
                {em}
              </button>
            ))}
          </div>

          {/* Image upload */}
          <div className="border-t border-border/60 pt-3">
            <p className="text-xs text-ink-2/60 mb-2">{isAr ? 'أو ارفع صورة' : 'Or upload a photo'}</p>
            <FileUpload
              childId={childId} folder="avatars"
              accept="image/*"
              label="Upload photo" labelAr="ارفع صورة"
              locale={locale}
              onUploaded={(url) => pick(url)}
            />
          </div>

          <button
            onClick={() => setOpen(false)}
            className="mt-2 w-full text-xs text-ink-2/60 hover:text-ink py-1"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      )}
    </div>
  );
}
