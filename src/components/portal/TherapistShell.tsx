'use client';

import { PortalShell, NavItem } from './PortalShell';
import { LayoutDashboard, Users, CalendarDays, MoreHorizontal } from 'lucide-react';

export default function TherapistShell({
  children, locale, nameEn, nameAr,
}: {
  children: React.ReactNode; locale: string; nameEn: string; nameAr: string;
}) {
  const base = `/${locale}/therapist`;
  const navItems: NavItem[] = [
    { href: base,               labelEn: 'Dashboard', labelAr: 'لوحة التحكم', icon: <LayoutDashboard size={18} /> },
    { href: `${base}/children`, labelEn: 'Children',  labelAr: 'الأطفال',     icon: <Users size={18} />           },
    { href: `${base}/calendar`, labelEn: 'Calendar',  labelAr: 'التقويم',     icon: <CalendarDays size={18} />    },
    { href: `${base}/more`,     labelEn: 'More',      labelAr: 'المزيد',      icon: <MoreHorizontal size={18} />  },
  ];
  return (
    <PortalShell locale={locale} portal="therapist" navItems={navItems}
      titleEn="Therapist Portal" titleAr="بوابة المعالج"
      userNameEn={nameEn} userNameAr={nameAr} userRole="Therapist">
      {children}
    </PortalShell>
  );
}
