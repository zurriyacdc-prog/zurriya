import type { Metadata, Viewport } from 'next';
import { getLocale } from 'next-intl/server';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: {
    default: 'Zurriya | Small Steps, Held Steady.',
    template: '%s | Zurriya',
  },
  description:
    'Zurriya is a child and adolescent development center in Cairo, Egypt — offering comprehensive assessments, individualized intervention, and parent partnership programs.',
  icons: {
    icon: '/logo/logo.png',
    apple: '/logo/logo.png',
    shortcut: '/logo/logo.png',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const isAr = locale === 'ar';

  return (
    <html lang={locale} dir={isAr ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
