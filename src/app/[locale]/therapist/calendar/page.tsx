import { redirect } from 'next/navigation';

export default function TherapistCalendarPage({ params: { locale } }: { params: { locale: string } }) {
  redirect(`/${locale}/therapist`);
}
