'use client';

import { PortalShell, NavItem } from './PortalShell';
import NotificationBell from './NotificationBell';
import PushPermission from './PushPermission';
import { LayoutDashboard, Map, FileText, CalendarDays, ImageIcon, Heart } from 'lucide-react';

type Notif = {
  id: string;
  type: string;
  title_en: string;
  title_ar: string;
  body_en: string | null;
  body_ar: string | null;
  is_read: boolean;
  created_at: string;
};

export default function ParentShell({
  children, locale, nameEn, nameAr, notifications = [],
}: {
  children: React.ReactNode;
  locale: string;
  nameEn: string;
  nameAr: string;
  notifications?: Notif[];
}) {
  const base = `/${locale}/parent`;
  const navItems: NavItem[] = [
    { href: base,                  labelEn: 'Home',        labelAr: 'الرئيسية',   icon: <LayoutDashboard size={18} /> },
    { href: `${base}/journey`,     labelEn: 'Journey',     labelAr: 'رحلتنا',     icon: <Map size={18} />            },
    { href: `${base}/plan`,        labelEn: 'Plan',        labelAr: 'خطة العلاج', icon: <FileText size={18} />       },
    { href: `${base}/reports`,     labelEn: 'Reports',     labelAr: 'التقارير',   icon: <FileText size={18} />       },
    { href: `${base}/sessions`,    labelEn: 'Sessions',    labelAr: 'الجلسات',    icon: <CalendarDays size={18} />   },
    { href: `${base}/gallery`,     labelEn: 'Gallery',     labelAr: 'الصور',      icon: <ImageIcon size={18} />      },
    { href: `${base}/reinforcers`, labelEn: 'Reinforcers', labelAr: 'المعززات',   icon: <Heart size={18} />          },
  ];

  return (
    <>
      <PushPermission locale={locale} />
      <PortalShell
        locale={locale}
        portal="parent"
        navItems={navItems}
        titleEn="Family Portal"
        titleAr="بوابة الأسرة"
        userNameEn={nameEn}
        userNameAr={nameAr}
        userRole="Parent"
        headerExtra={
          <NotificationBell notifications={notifications} locale={locale} />
        }
      >
        {children}
      </PortalShell>
    </>
  );
}
