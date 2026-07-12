import type { Metadata } from 'next';
import { IntakeForm } from '@/components/IntakeForm';

export const metadata: Metadata = {
  title: 'Zurriya — Child Registration Form',
  description: 'Confidential child intake and registration form for Zurriya Child Development Center.',
  robots: 'noindex,nofollow',
};

export default function IntakePage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <main className="bg-linen min-h-screen py-10 px-4">
      <IntakeForm locale={locale} />
    </main>
  );
}
