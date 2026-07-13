'use client';

import { useState, useTransition } from 'react';
import { changeOwnPassword } from '@/lib/supabase/user-actions';

export default function ChangePasswordForm({ locale }: { locale: string }) {
  const isAr = locale === 'ar';
  const [current,  setCurrent]  = useState('');
  const [next,     setNext]     = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [msg,      setMsg]      = useState('');
  const [ok,       setOk]       = useState(false);
  const [pending,  startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) { setMsg(isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match'); setOk(false); return; }
    if (next.length < 8)  { setMsg(isAr ? 'يجب أن تكون 8 أحرف على الأقل' : 'At least 8 characters required'); setOk(false); return; }
    startTransition(async () => {
      const res = await changeOwnPassword(current, next);
      if (res?.error) { setMsg(res.error); setOk(false); }
      else { setMsg(isAr ? 'تم تغيير كلمة المرور بنجاح ✓' : 'Password changed successfully ✓'); setOk(true); setCurrent(''); setNext(''); setConfirm(''); }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
      {msg && (
        <div className={`text-sm rounded-xl px-4 py-3 ${ok ? 'bg-sage-pale text-sage border border-sage/20' : 'bg-coral/10 text-coral border border-coral/20'}`}>
          {msg}
        </div>
      )}
      {[
        { id: 'current',  label: isAr ? 'كلمة المرور الحالية' : 'Current password',  val: current,  set: setCurrent  },
        { id: 'next',     label: isAr ? 'كلمة المرور الجديدة' : 'New password',      val: next,     set: setNext     },
        { id: 'confirm',  label: isAr ? 'تأكيد كلمة المرور'   : 'Confirm new password', val: confirm, set: setConfirm },
      ].map(({ id, label, val, set }) => (
        <div key={id} className="space-y-1.5">
          <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide block">{label}</label>
          <input
            type="password" value={val} onChange={e => set(e.target.value)} required dir="ltr"
            className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:ring-2 focus:ring-teal/25 focus:border-teal"
          />
        </div>
      ))}
      <button type="submit" disabled={pending}
        className="w-full py-3 rounded-xl bg-teal text-white font-semibold text-sm hover:bg-teal-dark transition-colors disabled:opacity-60">
        {pending ? '...' : (isAr ? 'تغيير كلمة المرور' : 'Change Password')}
      </button>
    </form>
  );
}
