'use client';

import { PortalShell, NavItem } from './PortalShell';
import { Users, MoreHorizontal } from 'lucide-react';

export default function TherapistShell({
  children, locale, nameEn, nameAr,
}: {
  children: React.ReactNode; locale: string; nameEn: string; nameAr: string;
}) {
  const base = `/${locale}/therapist`;
  const navItems: NavItem[] = [
    { href: base,           labelEn: 'My Children', labelAr: 'أطفالي',  icon: <Users size={18} />          },
    { href: `${base}/more`, labelEn: 'More',        labelAr: 'المزيد',  icon: <MoreHorizontal size={18} /> },
  ];
  return (
    <PortalShell locale={locale} portal="therapist" navItems={navItems}
      titleEn="Therapist Portal" titleAr="بوابة المعالج"
      userNameEn={nameEn} userNameAr={nameAr} userRole="Therapist">
      {children}
    </PortalShell>
  );
}
