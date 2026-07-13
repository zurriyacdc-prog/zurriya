'use client';

import { useState }     from 'react';
import Link             from 'next/link';
import { usePathname }  from 'next/navigation';
import { signOut }      from '@/lib/supabase/auth-actions';
import Image         from 'next/image';
import {
  LayoutDashboard, Map, FileText, CalendarDays, ImageIcon,
  Heart, Users, UserCog, Settings, LogOut, Menu, X,
  ClipboardList, Plus, ChevronRight, BarChart3, ShieldCheck,
} from 'lucide-react';

export type NavItem = {
  href:    string;
  labelEn: string;
  labelAr: string;
  icon:    React.ReactNode;
};

type Props = {
  locale:    string;
  portal:    'parent' | 'therapist' | 'admin';
  navItems:  NavItem[];
  titleEn:   string;
  titleAr:   string;
  children:  React.ReactNode;
  /** Shown at bottom of sidebar — current logged-in user */
  userNameEn?: string;
  userNameAr?: string;
  userRole?:   string;
  fab?:        React.ReactNode;
  /** Extra elements rendered in the mobile top bar (e.g. notification bell) */
  headerExtra?: React.ReactNode;
};

export function PortalShell({
  locale, portal, navItems, titleEn, titleAr, children,
  userNameEn = 'Sara Mahmoud', userNameAr = 'سارة محمود',
  userRole = '', fab, headerExtra,
}: Props) {
  const isAr     = locale === 'ar';
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const otherLocale = isAr ? 'en' : 'ar';
  const otherLocalePath = pathname.replace(`/${locale}/`, `/${otherLocale}/`);

  const portalColors: Record<string, string> = {
    parent:    'bg-teal',
    therapist: 'bg-teal',
    admin:     'bg-night',
  };
  const headerBg = portalColors[portal] ?? 'bg-teal';

  function isActive(href: string) {
    return pathname === href || (href !== `/${locale}/${portal}` && pathname.startsWith(href));
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo + portal name */}
      <div className={`${headerBg} px-5 py-5 flex items-center gap-3`}>
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
          <Image src="/logo/logo.png" alt="Zurriya" width={40} height={40} className="object-contain" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">
            {isAr ? 'ذرية' : 'Zurriya'}
          </p>
          <p className="text-white/60 text-[11px] leading-tight mt-0.5">
            {isAr ? titleAr : titleEn}
          </p>
        </div>
        {/* Close on mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="ms-auto text-white/60 hover:text-white md:hidden"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-teal-pale text-teal'
                      : 'text-ink-2 hover:bg-paper hover:text-ink'
                  }`}
                >
                  <span className={`flex-shrink-0 ${active ? 'text-teal' : 'text-ink-2/60'}`}>
                    {item.icon}
                  </span>
                  <span>{isAr ? item.labelAr : item.labelEn}</span>
                  {active && (
                    <span className="ms-auto w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Language + Settings */}
      <div className="px-3 pb-2 space-y-0.5">
        <Link
          href={`/${locale}/${portal}/settings`}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-ink-2 hover:bg-paper transition-colors"
        >
          <Settings size={16} className="text-ink-2/60" />
          <span>{isAr ? 'الإعدادات' : 'Settings'}</span>
        </Link>
        <Link
          href={otherLocalePath}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-ink-2 hover:bg-paper transition-colors"
        >
          <span className="text-base">🌐</span>
          <span>{isAr ? 'English' : 'العربية'}</span>
        </Link>
      </div>

      {/* User footer */}
      <div className="border-t border-border mx-3 pt-3 pb-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-teal-pale flex items-center justify-center flex-shrink-0">
            <span className="text-teal text-xs font-bold">
              {(isAr ? userNameAr : userNameEn).charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-ink truncate">
              {isAr ? userNameAr : userNameEn}
            </p>
            {userRole && (
              <p className="text-[10px] text-ink-2 truncate">{userRole}</p>
            )}
          </div>
          <form action={signOut.bind(null, locale)}>
            <button type="submit" className="text-ink-2/40 hover:text-ink-2 transition-colors" title={isAr ? 'تسجيل الخروج' : 'Sign out'}>
              <LogOut size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-paper">
      {/* ── Desktop sidebar ──────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col w-60 flex-shrink-0 bg-white border-e border-border z-20`}
      >
        {sidebarContent}
      </aside>

      {/* ── Mobile sidebar overlay ────────────────────────────── */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-ink/30 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 start-0 w-64 bg-white z-40 flex flex-col md:hidden shadow-2xl">
            {sidebarContent}
          </aside>
        </>
      )}

      {/* ── Main content area ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className={`${headerBg} md:hidden flex items-center gap-3 px-4 py-3 flex-shrink-0 safe-area-pt`}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white/70 hover:text-white transition-colors"
          >
            <Menu size={22} />
          </button>
          <div className="flex-1 flex items-center gap-2">
            <Image src="/logo/logo.png" alt="Zurriya" width={28} height={28} className="opacity-90" />
            <span className="text-white font-bold text-sm">{isAr ? titleAr : titleEn}</span>
          </div>
          {headerExtra}
          <Link
            href={otherLocalePath}
            className="text-white/70 hover:text-white text-xs font-semibold border border-white/30 rounded-full px-2.5 py-1"
          >
            {isAr ? 'EN' : 'عربي'}
          </Link>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto overscroll-y-contain" style={{ WebkitOverflowScrolling: 'touch' } as never}>
          {children}
        </main>

        {/* ── Mobile bottom navigation ─────────────────────────── */}
        <nav className="md:hidden bg-white border-t border-border flex-shrink-0 safe-area-pb">
          <ul className="flex items-center">
            {navItems.slice(0, 5).map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href} className="flex-1">
                  <Link
                    href={item.href}
                    className={`flex flex-col items-center gap-0.5 py-2 px-1 text-[10px] font-medium transition-colors ${
                      active ? 'text-teal' : 'text-ink-2/60'
                    }`}
                  >
                    <span className={`${active ? 'text-teal' : 'text-ink-2/50'}`}>
                      {item.icon}
                    </span>
                    <span className="truncate max-w-[56px] text-center leading-tight">
                      {isAr ? item.labelAr : item.labelEn}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* FAB (therapist only) */}
      {fab}
    </div>
  );
}

// ─── Re-exported icon wrappers (keeps page files icon-import-free) ────────────
export { LayoutDashboard, Map, FileText, CalendarDays, ImageIcon, Heart,
         Users, UserCog, Settings, LogOut, ClipboardList, Plus, ChevronRight,
         BarChart3, ShieldCheck };
