import { NextIntlClientProvider } from 'next-intl';
import { getMessages }            from 'next-intl/server';
import { notFound }               from 'next/navigation';
import { Fraunces, Inter, Cairo } from 'next/font/google';
import { routing }                from '../../../i18n/routing';
import { LocaleAttributes }       from '@/components/LocaleAttributes';

const fraunces = Fraunces({ subsets: ['latin'],           variable: '--font-fraunces', display: 'swap' });
const inter    = Inter   ({ subsets: ['latin'],           variable: '--font-inter',    display: 'swap' });
const cairo    = Cairo   ({ subsets: ['arabic', 'latin'], variable: '--font-cairo',    display: 'swap' });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as 'en' | 'ar')) notFound();

  const messages = await getMessages();
  const isArabic = locale === 'ar';

  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleAttributes locale={locale} />
      <div
        lang={locale}
        dir={isArabic ? 'rtl' : 'ltr'}
        className={`${fraunces.variable} ${inter.variable} ${cairo.variable} flex min-h-screen flex-col`}
      >
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
