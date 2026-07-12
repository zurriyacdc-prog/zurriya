import { redirect } from 'next/navigation';

export default function TherapistChildrenPage({ params: { locale } }: { params: { locale: string } }) {
  redirect(`/${locale}/therapist`);
}
