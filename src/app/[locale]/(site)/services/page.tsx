import { redirect } from 'next/navigation';

export default function ServicesPage({ params: { locale } }: { params: { locale: string } }) {
  redirect(`/${locale}#services`);
}
