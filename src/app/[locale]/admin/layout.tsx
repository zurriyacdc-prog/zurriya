'use client';

import { PortalShell, NavItem } from '@/components/portal/PortalShell';
import {
  LayoutDashboard, Users, Baby, Link2,
} from 'lucide-react';

export default function AdminLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const base = `/${locale}/admin`;

  const navItems: NavItem[] = [
    { href: base,                labelEn: 'Dashboard',     labelAr: 'لوحة التحكم',       icon: <LayoutDashboard size={18} /> },
    { href: `${base}/users`,     labelEn: 'Users',         labelAr: 'المستخدمون',         icon: <Users size={18} />           },
    { href: `${base}/children`,  labelEn: 'Children',      labelAr: 'الأطفال',            icon: <Baby size={18} />            },
    { href: `${base}/relations`, labelEn: 'Relationships', labelAr: 'العلاقات',           icon: <Link2 size={18} />           },
  ];

  return (
    <PortalShell
      locale={locale}
      portal="admin"
      navItems={navItems}
      titleEn="Control Center"
      titleAr="مركز التحكم"
      userNameEn="Yusuf Abdelatti"
      userNameAr="يوسف عبد العاطي"
      userRole="Administrator"
    >
      {children}
    </PortalShell>
  );
}
