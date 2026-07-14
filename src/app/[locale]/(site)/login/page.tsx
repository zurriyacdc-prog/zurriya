'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr   = locale === 'ar';
  const router = useRouter();
  const search = useSearchParams();
  const next   = search.get('next') ?? `/${locale}/parent`;
  const err    = search.get('error');

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(err ? (isAr ? 'حدث خطأ في المصادقة' : 'Authentication error') : '');

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError || !data.user) {
      setError(isAr ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Incorrect email or password');
      setLoading(false);
      return;
    }

    // Fetch role and redirect
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single<{ role: string }>();

    const role  = profile?.role ?? 'parent';
    const dest  = role === 'admin' ? 'admin' : role === 'therapist' ? 'therapist' : 'parent';
    router.push(next.includes(`/${dest}`) ? next : `/${locale}/${dest}`);
  };

  return (
    <div className="min-h-dvh bg-paper flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-lg border border-border px-8 py-8 space-y-5">
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold text-ink">
              {isAr ? 'مرحباً بعودتك' : 'Welcome back'}
            </h1>
            <p className="text-sm text-ink-2/60">
              {isAr ? 'سجّل دخولك للوصول إلى بوابتك' : 'Sign in to access your portal'}
            </p>
          </div>

          {/* No sign-up notice */}
          <div className="bg-teal-pale border border-teal/20 rounded-2xl px-4 py-3.5 text-center space-y-1">
            <p className="text-xs font-semibold text-teal-dark">
              {isAr ? 'لا يوجد تسجيل ذاتي' : 'No self-registration'}
            </p>
            <p className="text-[11px] text-ink-2/70 leading-relaxed">
              {isAr
                ? 'البوابات تُنشأ من قِبَل المركز فقط. ستتلقى بريدك الإلكتروني وكلمة المرور من فريقنا بعد الاستشارة الأولى.'
                : 'Portals are created by the center only. You receive your email and password from our team after your initial consultation.'}
            </p>
          </div>

          {error && (
            <div className="bg-coral/10 border border-coral/20 rounded-xl px-4 py-3 text-sm text-coral font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide">
                {isAr ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                dir="ltr"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm text-ink placeholder:text-ink-2/30 focus:outline-none focus:ring-2 focus:ring-teal/25 focus:border-teal transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink-2/60 uppercase tracking-wide">
                {isAr ? 'كلمة المرور' : 'Password'}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir="ltr"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm text-ink placeholder:text-ink-2/30 focus:outline-none focus:ring-2 focus:ring-teal/25 focus:border-teal transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal text-white font-semibold text-sm hover:bg-teal-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? (isAr ? 'جارٍ تسجيل الدخول...' : 'Signing in...')
                : (isAr ? 'تسجيل الدخول' : 'Sign in')}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-ink-2/40 mt-6">
          {isAr ? 'بوابة زرية — للمجتمعات العلاجية' : 'Zurriya Portal — For therapeutic communities'}
        </p>
      </div>
    </div>
  );
}
