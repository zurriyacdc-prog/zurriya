import { redirect } from 'next/navigation';

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  redirect(`/${locale}#about`);
}
