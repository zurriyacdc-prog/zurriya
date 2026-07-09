'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export function Footer() {
  const locale = useLocale();
  const isAr   = locale === 'ar';

  const navLinks = [
    { label: isAr ? 'الرئيسية' : 'Home',     href: '#home'     },
    { label: isAr ? 'خدماتنا' : 'Services',  href: '#services' },
    { label: isAr ? 'من نحن'  : 'About',     href: '#about'    },
    { label: isAr ? 'فريقنا'  : 'Our Team',  href: '#team'     },
    { label: isAr ? 'تواصل'   : 'Contact',   href: '#contact'  },
  ];

  return (
    <footer className="bg-night border-t border-white/5">
      <div className="max-w-content mx-auto px-6 py-16">
        <div className={`grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr] gap-12 ${isAr ? 'rtl:text-right' : ''}`}>
          {/* Brand */}
          <div className={`flex flex-col gap-5 ${isAr ? 'items-end' : ''}`}>
            <div className="bg-paper rounded-2xl p-2 shadow-sm w-fit">
              <Image
                src="/logo/logo.png"
                alt="Zurriya Child Development Center"
                width={96}
                height={96}
                className="h-16 w-auto"
              />
            </div>
            <p className="text-white/45 text-sm leading-relaxed max-w-[210px]">
              {isAr ? 'خطواتٌ صغيرة.. بأيدٍ ثابتة' : 'Small steps, held steady.'}
            </p>
            <div className={`flex items-center gap-2 text-white/35 text-xs ${isAr ? 'flex-row-reverse' : ''}`}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
              </svg>
              {isAr ? 'ياسمين 6، التجمع الخامس، القاهرة' : 'Yasmin 6, New Cairo, Cairo'}
            </div>
          </div>

          {/* Nav */}
          <div className={`flex flex-col gap-3 ${isAr ? 'items-end' : ''}`}>
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/25 mb-2">
              {isAr ? 'التصفح' : 'Navigate'}
            </p>
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-white/45 hover:text-white/80 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div className={`flex flex-col gap-3 ${isAr ? 'items-end' : ''}`}>
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/25 mb-2">
              {isAr ? 'تواصل' : 'Connect'}
            </p>
            <a href="mailto:info@zurriya.com" className="text-sm text-white/45 hover:text-white/80 transition-colors">
              info@zurriya.com
            </a>
            <a href="tel:+200000000000" className="text-sm text-white/45 hover:text-white/80 transition-colors" dir="ltr">
              +20 000 000 0000
            </a>

            <div className={`flex gap-2.5 mt-2 ${isAr ? 'flex-row-reverse' : ''}`}>
              {[
                { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                { label: 'Facebook',  path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/35 hover:border-teal/50 hover:text-teal-light transition-colors">
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d={s.path}/></svg>
                </a>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-white/5">
              <Link href={`/${isAr ? 'en' : 'ar'}`} className="text-xs text-white/25 hover:text-white/50 transition-colors">
                {isAr ? 'Switch to English →' : 'عربي →'}
              </Link>
            </div>
          </div>
        </div>

        <div className={`mt-12 pt-5 border-t border-white/5 ${isAr ? 'rtl:text-right' : ''}`}>
          <p className="text-xs text-white/20">
            {isAr ? '© 2024 ذرية. جميع الحقوق محفوظة.' : '© 2024 Zurriya. All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
