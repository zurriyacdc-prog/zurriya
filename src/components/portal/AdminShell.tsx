'use client';

import { PortalShell, NavItem } from './PortalShell';
import { LayoutDashboard, Users, Baby, Link2 } from 'lucide-react';

export default function AdminShell({
  children, locale, nameEn, nameAr,
}: {
  children: React.ReactNode; locale: string; nameEn: string; nameAr: string;
}) {
  const base = `/${locale}/admin`;
  const navItems: NavItem[] = [
    { href: base,                labelEn: 'Dashboard',     labelAr: 'لوحة التحكم', icon: <LayoutDashboard size={18} /> },
    { href: `${base}/users`,     labelEn: 'Users',         labelAr: 'المستخدمون',  icon: <Users size={18} />           },
    { href: `${base}/children`,  labelEn: 'Children',      labelAr: 'الأطفال',     icon: <Baby size={18} />            },
    { href: `${base}/relations`, labelEn: 'Relationships', labelAr: 'العلاقات',    icon: <Link2 size={18} />           },
  ];
  return (
    <PortalShell locale={locale} portal="admin" navItems={navItems}
      titleEn="Control Center" titleAr="مركز التحكم"
      userNameEn={nameEn} userNameAr={nameAr} userRole="Administrator">
      {children}
    </PortalShell>
  );
}
