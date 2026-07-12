import { createClient } from '@/lib/supabase/server';
import TherapistShell from '@/components/portal/TherapistShell';

export default async function TherapistPortalLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from('profiles').select('name_en, name_ar').eq('id', user.id).single()
    : { data: null };

  return (
    <TherapistShell
      locale={locale}
      nameEn={profile?.name_en ?? 'Therapist'}
      nameAr={profile?.name_ar ?? 'معالج'}
    >
      {children}
    </TherapistShell>
  );
}
