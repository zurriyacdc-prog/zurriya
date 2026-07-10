'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const locale = useLocale();
  const isAr   = locale === 'ar';
  const otherLocale = isAr ? 'en' : 'ar';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navItems = [
    { label: isAr ? 'الرئيسية' : 'Home',       href: `/${locale}`           },
    { label: isAr ? 'خدماتنا'  : 'Services',    href: `/${locale}#services`  },
    { label: isAr ? 'من نحن'   : 'About',       href: `/${locale}#about`     },
    { label: isAr ? 'فريقنا'   : 'Our Team',    href: `/${locale}#team`      },
    { label: isAr ? 'تواصل'    : 'Contact',     href: `/${locale}#contact`   },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-paper/95 backdrop-blur-md shadow-md shadow-ink/5 border-b border-border'
          : 'bg-paper border-b border-transparent'
      }`}
    >
      <nav className="max-w-content mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href={`/${locale}`} className="shrink-0">
          <Image
            src="/logo/logo.png"
            alt="Zurriya Child Development Center"
            width={120}
            height={120}
            className="h-11 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-sm font-medium text-ink-2 hover:text-teal transition-colors duration-150"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={`/${otherLocale}`}
            className="text-sm font-semibold text-ink-2 hover:text-teal transition-colors border border-border hover:border-teal/40 rounded-full px-4 py-1.5"
          >
            {isAr ? 'EN' : 'عربي'}
          </Link>
          <a
            href={`/${locale}#contact`}
            className="text-sm font-semibold bg-teal text-white rounded-full px-5 py-2 hover:bg-teal-dark transition-colors shadow-sm shadow-teal/20"
          >
            {isAr ? 'احجز استشارة' : 'Book a Consultation'}
          </a>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          <Link href={`/${otherLocale}`} className="text-sm font-semibold text-ink-2 border border-border rounded-full px-3 py-1">
            {isAr ? 'EN' : 'عربي'}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
            className="p-2 text-ink rounded-lg hover:bg-teal-pale transition-colors"
          >
            {mobileOpen ? (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="3" x2="15" y2="15"/><line x1="15" y1="3" x2="3" y2="15"/>
              </svg>
            ) : (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="2" y1="5" x2="16" y2="5"/><line x1="2" y1="10" x2="16" y2="10"/><line x1="2" y1="15" x2="16" y2="15"/>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-paper border-t border-border px-6 py-6 text-start">
          <ul className="flex flex-col gap-5 mb-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-ink-2 hover:text-teal transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={`/${locale}#contact`}
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center bg-teal text-white text-sm font-semibold rounded-full px-6 py-3 hover:bg-teal-dark transition-colors w-full"
          >
            {isAr ? 'احجز استشارة' : 'Book a Consultation'}
          </a>
        </div>
      )}
    </header>
  );
}
