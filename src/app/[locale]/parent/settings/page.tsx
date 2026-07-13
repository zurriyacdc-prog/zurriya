import { createClient } from '@/lib/supabase/server';
import ChangePasswordForm from '@/components/portal/ChangePasswordForm';

export default async function ParentSettingsPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from('profiles').select('name_en, name_ar').eq('id', user.id).single()
    : { data: null };

  return (
    <div className="p-5 md:p-8 max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">{isAr ? 'الإعدادات' : 'Settings'}</h1>
        <p className="text-sm text-ink-2 mt-0.5">{isAr ? profile?.name_ar : profile?.name_en}</p>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-bold text-ink">{isAr ? 'تغيير كلمة المرور' : 'Change Password'}</h2>
        <ChangePasswordForm locale={locale} />
      </div>
    </div>
  );
}
