import React from 'react';
import { getTranslations, getLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { ContactForm } from '@/components/ContactForm';
import { TeamAvatar } from '@/components/TeamAvatar';
import { assessmentItems, interventionItems, partnershipItems } from '@/content/services';
import { teamMembers } from '@/content/team';
import ServicePillsClient from '@/components/site/ServicePillsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zurriya | Small Steps, Held Steady.',
  description: 'Child and adolescent development center in New Cairo. Evidence-based assessments, individualized interventions, and family partnership.',
};

// ─── Icon components ──────────────────────────────────────

function IconAssessment() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="4" width="20" height="26" rx="3" stroke="currentColor" strokeWidth="2"/>
      <rect x="13" y="2" width="10" height="5" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="13" y1="15" x2="23" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="13" y1="19" x2="23" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="13" y1="23" x2="19" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="29" cy="29" r="6" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M26.5 29l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconIntervention() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="16" r="7" stroke="currentColor" strokeWidth="2"/>
      <path d="M17 16h6M20 13v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="29" cy="12" r="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M27.5 12.5l1 1 2-2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconPartnership() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="13" cy="14" r="5" stroke="currentColor" strokeWidth="2"/>
      <circle cx="27" cy="14" r="5" stroke="currentColor" strokeWidth="2"/>
      <path d="M4 34c0-5.523 4.477-9 9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M36 34c0-5.523-4.477-9-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 25c3.866 0 7 2.686 7 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 25c-3.866 0-7 2.686-7 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 20v-4M18 18l2-2 2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────

export default async function HomePage() {
  const locale  = await getLocale();
  const lang    = locale as 'en' | 'ar';
  const t       = await getTranslations('home');
  const tAbout  = await getTranslations('about');
  const tSvc    = await getTranslations('services');
  const tCon    = await getTranslations('contact');
  const isAr    = locale === 'ar';

  const tagline   = isAr ? 'خطواتٌ صغيرة.. بأيدٍ ثابتة' : 'Small steps, held steady.';
  const bookLabel = isAr ? 'احجز استشارة' : 'Book a Consultation';

  // ── service card config ──
  const serviceCards = [
    {
      id: 'assessments',
      heading: tSvc('assessments.heading'),
      intro:   tSvc('assessments.intro'),
      closing: tSvc('assessments.closing'),
      items:   assessmentItems[lang],
      icon:    <IconAssessment />,
      accent:  'teal' as const,
      bg:      'bg-teal-pale',
      iconBg:  'bg-teal text-white',
      tag:     isAr ? '٠١' : '01',
    },
    {
      id: 'intervention',
      heading: tSvc('intervention.heading'),
      intro:   tSvc('intervention.intro'),
      closing: tSvc('intervention.closing'),
      items:   interventionItems[lang],
      icon:    <IconIntervention />,
      accent:  'coral' as const,
      bg:      'bg-coral-pale',
      iconBg:  'bg-coral text-white',
      tag:     isAr ? '٠٢' : '02',
    },
    {
      id: 'partnership',
      heading: tSvc('partnership.heading'),
      intro:   tSvc('partnership.intro'),
      closing: tSvc('partnership.closing'),
      items:   partnershipItems[lang],
      icon:    <IconPartnership />,
      accent:  'sage' as const,
      bg:      'bg-sage-pale',
      iconBg:  'bg-sage text-white',
      tag:     isAr ? '٠٣' : '03',
    },
  ] as const;

  // ── values ──
  const values = [
    { key: 'integrity',     icon: '⚖️', color: 'border-teal/30 bg-teal-pale/60' },
    { key: 'compassion',    icon: '🌿', color: 'border-coral/30 bg-coral-pale/60' },
    { key: 'excellence',    icon: '🔬', color: 'border-teal/30 bg-teal-pale/60' },
    { key: 'family',        icon: '🤝', color: 'border-sage/30 bg-sage-pale/60' },
    { key: 'growth',        icon: '📈', color: 'border-coral/30 bg-coral-pale/60' },
    { key: 'responsibility',icon: '🛡️', color: 'border-teal/30 bg-teal-pale/60' },
  ] as const;

  return (
    <>
      {/* ════════════════════════════════════════════════════════
          HERO — split layout
      ════════════════════════════════════════════════════════ */}
      <section id="home" className="bg-paper">
        <div className="max-w-content mx-auto px-6 py-10 md:py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center">

          {/* ── Left: text ── */}
          <div className="flex flex-col gap-6 rtl:items-start rtl:text-right">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-teal-pale border border-teal/20 rounded-full px-4 py-1.5 w-fit rtl:flex-row-reverse">
              <span className="w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" />
              <span className="text-xs font-semibold text-teal tracking-wide">
                {isAr ? 'مركز تنمية الطفل والمراهق · التجمع الخامس' : 'Child & Adolescent Development · New Cairo'}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-[2.6rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] text-ink leading-[1.08] tracking-tight">
              {isAr ? (
                <>
                  <span className="text-gradient-teal">خطواتٌ</span>
                  {' '}صغيرة..{' '}
                  <br />
                  <span className="text-gradient-coral">بأيدٍ</span>
                  {' '}ثابتة.
                </>
              ) : (
                <>
                  <span className="text-gradient-teal">Small</span>
                  {' '}steps,{' '}
                  <br />
                  <span className="text-gradient-coral">held</span>
                  {' '}steady.
                </>
              )}
            </h1>

            {/* Subtext */}
            <p className="text-ink-2 text-base md:text-lg lg:text-xl leading-relaxed max-w-lg">
              {t('hero.positioning')}
            </p>

            {/* CTAs */}
            <div className={`flex flex-wrap gap-3 pt-2 rtl:flex-row-reverse`}>
              <a
                href={`/${locale}#contact`}
                className="inline-flex items-center gap-2 bg-teal text-white text-sm font-semibold rounded-full px-7 py-3.5 hover:bg-teal-dark transition-colors shadow-lg shadow-teal/25"
              >
                {bookLabel}
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="rtl:rotate-180">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                </svg>
              </a>
              <a
                href={`/${locale}#services`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-teal border-2 border-teal/30 rounded-full px-7 py-3.5 hover:border-teal hover:bg-teal-pale transition-colors"
              >
                {isAr ? 'خدماتنا' : 'Our Services'}
              </a>
            </div>

            {/* Location pill */}
            <div className={`flex items-center gap-2 text-sm text-ink-2 rtl:flex-row-reverse`}>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
              </svg>
              {isAr ? 'ياسمين 6، التجمع الخامس، القاهرة' : 'Yasmin 6, New Cairo, Cairo'}
            </div>
          </div>

          {/* ── Right: visual card with logo as hero ── */}
          <div className="flex items-center justify-center py-4 px-4">
            <div className="w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-teal/15 border border-border bg-white">
              {/* Logo showcase — cream bg matches the logo's own background */}
              <div className="bg-paper px-8 pt-10 pb-8 flex flex-col items-center text-center gap-2">
                <Image
                  src="/logo/logo.png"
                  alt="Zurriya Child Development Center"
                  width={320}
                  height={320}
                  className="w-full max-w-[240px] h-auto"
                  priority
                />
              </div>

              {/* Info strip */}
              <div className="bg-white px-8 py-6 border-t border-border/60 flex flex-col gap-4">
                {[
                  { dot: 'bg-teal',  text: isAr ? 'مبني على الأدلة العلمية' : 'Evidence-Based Practice' },
                  { dot: 'bg-coral', text: isAr ? 'الأسرة شريك أساسي'       : 'Family-Centered Care' },
                  { dot: 'bg-sage',  text: isAr ? 'مقرنا التجمع الخامس'     : 'Based in New Cairo' },
                ].map((item) => (
                  <div key={item.text} className={`flex items-center gap-3 rtl:flex-row-reverse`}>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.dot}`} />
                    <span className="text-sm text-ink-2 font-medium">{item.text}</span>
                  </div>
                ))}
                <div className="mt-1 pt-4 border-t border-border">
                  <p className="text-xs text-ink-2/60 italic text-center leading-relaxed">
                    {isAr ? '"الثقة تسبق العلاج"' : '"Trust before treatment"'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          PILLARS — dark teal
      ════════════════════════════════════════════════════════ */}
      <section className="bg-teal-dark px-6 py-16">
        <div className="max-w-content mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 rtl:sm:divide-x-reverse">
            {[
              {
                number: isAr ? '٠١' : '01',
                head:   isAr ? 'مبني على الأدلة العلمية' : 'Evidence-Based',
                body:   isAr ? 'كل تقييم وتدخل يستند إلى أحدث الأبحاث العلمية والحكم الإكلينيكي المتخصص' : 'Every assessment and intervention grounded in current research',
              },
              {
                number: isAr ? '٠٢' : '02',
                head:   isAr ? 'الأسرة شريك أساسي' : 'Family-Centered',
                body:   isAr ? 'نؤمن أن الوالدين شريكان فاعلان في رحلة نمو طفلهم وتطوره' : 'Parents are active partners throughout every step of the journey',
              },
              {
                number: isAr ? '٠٣' : '03',
                head:   isAr ? 'نتابع التقدم ونقيس أثره' : 'Measurable Outcomes',
                body:   isAr ? 'نُتابع التقدم الفعلي لطفلك ونُكيّف الخطة وفق احتياجاته المتطورة' : 'Progress is tracked and plans adapt to ensure real results',
              },
            ].map((p) => (
              <div key={p.number} className={`flex flex-col gap-3 px-6 md:px-8 py-7 md:py-8 rtl:text-right`}>
                <span className="font-heading text-4xl text-white/15 leading-none select-none">{p.number}</span>
                <h3 className="font-heading text-xl text-white">{p.head}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SERVICES — visual cards
      ════════════════════════════════════════════════════════ */}
      <section id="services" className="bg-linen px-6 py-14 md:py-20 lg:py-28">
        <div className="max-w-content mx-auto">
          <div className={`mb-12 rtl:text-right`}>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-teal mb-3">
              {isAr ? 'ما نقدمه' : 'What We Offer'}
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-ink leading-tight">
              {tSvc('hero.heading')}
            </h2>
            <p className="mt-3 text-ink-2 text-base md:text-lg max-w-xl leading-relaxed">
              {tSvc('hero.subheading')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceCards.map((card) => (
              <div
                key={card.id}
                id={card.id}
                className="flex flex-col rounded-3xl overflow-hidden bg-white border border-border shadow-sm card-lift"
              >
                <div className={`${card.bg} px-7 pt-8 pb-6 border-b border-border/60`}>
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 ${card.iconBg} shadow-sm`}>
                    {card.icon}
                  </div>
                  <div className={`flex items-center justify-between rtl:flex-row-reverse`}>
                    <h3 className="font-heading text-xl text-ink leading-snug pe-2">
                      {card.heading}
                    </h3>
                    <span className="font-heading text-3xl text-ink/8 select-none flex-shrink-0">
                      {card.tag}
                    </span>
                  </div>
                  <p className="mt-2 text-ink-2 text-sm leading-relaxed">{card.intro}</p>
                </div>

                <div className="flex-1 px-7 py-6">
                  <ServicePillsClient
                    items={card.items}
                    cardId={card.id}
                    accent={card.accent}
                    locale={locale}
                  />
                </div>

                <div className="px-7 pb-7">
                  <p className={`text-xs text-ink-2 italic leading-relaxed border-t border-border pt-4 rtl:text-right`}>
                    {card.closing}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          PORTAL — family app marketing
      ════════════════════════════════════════════════════════ */}
      <section id="portal" className="relative overflow-hidden bg-teal-dark px-6 py-14 md:py-20 lg:py-28">
        {/* Decorative radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 75% 40%, rgba(74,158,173,0.25) 0%, transparent 65%)' }}
          aria-hidden="true"
        />

        <div className="relative max-w-content mx-auto">
          {/* Section header */}
          <div className={`mb-14 rtl:text-right`}>
            <div className={`inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5`}>
              <span className="text-base">📱</span>
              <span className="text-xs font-semibold text-white/80 tracking-wide">
                {isAr ? 'بوابة زرية العائلية' : 'Zurriya Family Portal'}
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white leading-tight max-w-2xl">
              {isAr
                ? 'رحلة طفلك... بين يديك'
                : 'Your child\'s journey, in your hands.'}
            </h2>
            <p className="mt-4 text-white/60 text-base md:text-lg max-w-xl leading-relaxed">
              {isAr
                ? 'بوابة زرية العائلية تضعك في قلب رحلة علاج طفلك — وصول فوري إلى تقدمه وجلساته وخططه، في مكان واحد.'
                : 'The Zurriya Family Portal puts you at the center of your child\'s therapy — real-time access to progress, sessions, plans, and every milestone.'}
            </p>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start rtl:text-right`}>
            {/* Left: feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: '📊',
                  en: { title: 'Live Progress Tracking', body: 'Goals, milestones, and progress — updated after every session so you\'re never out of the loop.' },
                  ar: { title: 'متابعة التقدم لحظة بلحظة', body: 'أهداف ومراحل وتقدم — يُحدَّث بعد كل جلسة حتى لا يفوتك شيء.' },
                },
                {
                  icon: '📅',
                  en: { title: 'Full Session History', body: 'What was covered, therapist notes, and engagement ratings — a complete log you can revisit anytime.' },
                  ar: { title: 'سجل الجلسات الكامل', body: 'ما تناولته كل جلسة وملاحظات المعالج — سجل متكامل يمكنك الرجوع إليه في أي وقت.' },
                },
                {
                  icon: '🎯',
                  en: { title: 'Personalized Goal Plans', body: 'Know exactly what your child is working on and why — written for families, not just clinicians.' },
                  ar: { title: 'خطط الأهداف المخصصة', body: 'اعرف بالضبط ما يعمل عليه طفلك ولماذا — مكتوبة للأسر وليس فقط للمتخصصين.' },
                },
                {
                  icon: '🖼️',
                  en: { title: 'Memory Gallery', body: 'Photos and moments from your child\'s sessions, shared directly with you by the therapy team.' },
                  ar: { title: 'معرض الذكريات', body: 'صور ولحظات من جلسات طفلك، تُشارَك معك مباشرةً من الفريق العلاجي.' },
                },
                {
                  icon: '🌟',
                  en: { title: 'Reinforcers List', body: 'A personalized list of what motivates your child most — kept updated so home strategies stay aligned.' },
                  ar: { title: 'قائمة المعززات', body: 'قائمة مخصصة بما يُحفّز طفلك أكثر ما يكون — تُحدَّث باستمرار لتنسيق الاستراتيجيات المنزلية.' },
                },
                {
                  icon: '📄',
                  en: { title: 'All Documents, One Place', body: 'Assessments, reports, plans — all stored securely in the app. No more folders, no more lost papers.' },
                  ar: { title: 'كل الوثائق في مكان واحد', body: 'تقييمات وتقارير وخطط — محفوظة بأمان في التطبيق. لا مزيد من الملفات المتناثرة.' },
                },
                {
                  icon: '🗓️',
                  en: { title: 'Journey Timeline', body: 'A visual log of every milestone and achievement — watch your child\'s story unfold over time.' },
                  ar: { title: 'جدول رحلة الطفل', body: 'سجل مرئي لكل مرحلة وإنجاز — شاهد قصة تطور طفلك تتكشّف بمرور الوقت.' },
                },
                {
                  icon: '💬',
                  en: { title: 'Arabic & English', body: 'Fully bilingual — switch between Arabic and English anytime with a single tap.' },
                  ar: { title: 'عربي وإنجليزي', body: 'ثنائي اللغة بالكامل — انتقل بين العربية والإنجليزية في أي وقت بنقرة واحدة.' },
                },
              ].map((f) => (
                <div
                  key={f.en.title}
                  className="bg-white/8 border border-white/12 rounded-2xl p-5 hover:bg-white/12 transition-colors"
                >
                  <span className="text-2xl block mb-3">{f.icon}</span>
                  <p className="text-white font-semibold text-sm mb-1.5 leading-snug">
                    {isAr ? f.ar.title : f.en.title}
                  </p>
                  <p className="text-white/50 text-xs leading-relaxed">
                    {isAr ? f.ar.body : f.en.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Right: story + PWA callout */}
            <div className="flex flex-col gap-8 lg:sticky lg:top-24">
              {/* Origin story */}
              <div className="bg-white/8 border border-white/12 rounded-3xl p-7">
                <div className="w-10 h-10 rounded-2xl bg-coral/20 flex items-center justify-center mb-5">
                  <span className="text-xl">💡</span>
                </div>
                <p className="font-heading text-lg text-white leading-snug mb-4">
                  {isAr ? 'لماذا بنينا البوابة؟' : 'Why we built this'}
                </p>
                <p className="text-white/60 text-sm leading-relaxed mb-3">
                  {isAr
                    ? 'رأينا والدين يصلون حاملين ملفات متناثرة، يتساءلون عمّا حدث في جلسة الأسبوع الماضي، غير متأكدين من كيفية المساعدة في المنزل.'
                    : 'We\'ve sat with too many parents arriving with folders of loose papers, wondering what happened last session, unsure how to support their child at home.'}
                </p>
                <p className="text-white/60 text-sm leading-relaxed">
                  {isAr
                    ? 'العلاج لا ينتهي عند باب العيادة. أنت شريك في هذه الرحلة — والبوابة هي جسر التواصل بينكم.'
                    : 'Therapy doesn\'t end at the clinic door. You\'re a partner in this journey — and the portal is the bridge that keeps you connected.'}
                </p>
              </div>

              {/* PWA install callout */}
              <div className="bg-coral/15 border border-coral/25 rounded-3xl p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-coral/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">⬇️</span>
                  </div>
                  <p className="font-semibold text-white text-sm">
                    {isAr ? 'يعمل مثل تطبيق أصيل' : 'Works like a native app'}
                  </p>
                </div>
                <p className="text-white/60 text-xs leading-relaxed mb-4">
                  {isAr
                    ? 'لا تحتاج إلى متجر التطبيقات. اضغط على زر المشاركة في متصفحك ثم "أضف إلى الشاشة الرئيسية" — يُنصَّب فورًا كتطبيق مستقل، متاح بالعربية والإنجليزية.'
                    : 'No App Store needed. Tap your browser\'s share button and \'Add to Home Screen\' — it installs instantly as a standalone app, available in Arabic and English.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    isAr ? 'يعمل بدون إنترنت جزئيًا' : 'Works offline (partial)',
                    isAr ? 'شاشة كاملة بدون متصفح' : 'Full-screen, no browser bar',
                    isAr ? 'آمن ومشفّر' : 'Secure & private',
                  ].map((tag) => (
                    <span key={tag} className="text-[11px] text-white/60 bg-white/10 rounded-full px-2.5 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          ABOUT — mission + approach
      ════════════════════════════════════════════════════════ */}
      <section id="about" className="bg-paper px-6 py-14 md:py-20 lg:py-28">
        <div className="max-w-content mx-auto">
          <div className={`grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-14 md:gap-20 rtl:text-right`}>
            <div className="lg:sticky lg:top-24 self-start">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-coral mb-3">
                {isAr ? 'من نحن' : 'Who We Are'}
              </p>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-ink leading-tight mb-6">
                {tAbout('mission.heading')}
              </h2>
              <div className="w-10 h-1 bg-coral rounded-full mb-6 rtl:ms-auto" />

              {/* Trust before treatment callout */}
              <div className="bg-teal-pale border border-teal/20 rounded-2xl p-5">
                <p className="font-heading text-lg text-teal leading-snug">
                  {isAr ? '"الثقة تسبق العلاج"' : '"Trust before treatment"'}
                </p>
                <p className="text-sm text-teal-dark/70 mt-2 leading-relaxed">
                  {isAr
                    ? 'مبدأنا الذي يحكم كل تقييم وكل توصية'
                    : 'The principle that guides every assessment and every recommendation'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5 text-ink-2 text-base md:text-[17px] leading-relaxed">
              <p>{tAbout('mission.p1')}</p>
              <p>{tAbout('mission.p2')}</p>
              <p>{tAbout('mission.p3')}</p>

              <div className="mt-4 border-t border-border pt-8 flex flex-col gap-5">
                <h3 className="font-heading text-2xl text-ink">{tAbout('approach.heading')}</h3>
                <p>{tAbout('approach.p1')}</p>
                <p>{tAbout('approach.p2')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          VALUES
      ════════════════════════════════════════════════════════ */}
      <section className="bg-night-2 px-6 py-14 md:py-20 lg:py-28">
        <div className="max-w-content mx-auto">
          <div className={`mb-14 rtl:text-right`}>
            <div className={`flex items-center gap-3 mb-4 rtl:flex-row-reverse`}>
              <div className="h-px w-8 bg-coral/40" />
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-coral/80">
                {isAr ? 'ما يحركنا' : 'What Drives Us'}
              </p>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
              {tAbout('values.heading')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v) => {
              type ValueKey = 'integrity' | 'compassion' | 'excellence' | 'family' | 'growth' | 'responsibility';
              const key = v.key as ValueKey;
              return (
                <div
                  key={v.key}
                  className={`rounded-2xl border p-6 flex flex-col gap-3 ${v.color} rtl:text-right`}
                >
                  <span className="text-2xl">{v.icon}</span>
                  <h3 className="font-heading text-lg text-white">
                    {tAbout(`values.${key}.title`)}
                  </h3>
                  <p className="text-sm text-white/55 leading-relaxed">
                    {tAbout(`values.${key}.body`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          TEAM
      ════════════════════════════════════════════════════════ */}
      <section id="team" className="bg-linen px-6 py-14 md:py-20 lg:py-28">
        <div className="max-w-content mx-auto">
          <div className={`mb-12 rtl:text-right`}>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-sage mb-3">
              {isAr ? 'فريقنا' : 'Our Team'}
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-ink leading-tight">
              {isAr ? 'تعرّف على المختصين' : 'Meet the Specialists'}
            </h2>
            <p className="mt-3 text-ink-2 text-base md:text-lg max-w-xl leading-relaxed">
              {isAr
                ? 'فريق من علماء النفس المتخصصين في تنمية الطفل والمراهق.'
                : 'A dedicated team of psychologists specializing in child and adolescent development.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 max-w-2xl">
            {teamMembers.map((member) => {
              const colorBg   = member.slug === 'yusuf-abdelatti' ? 'bg-teal text-white' : 'bg-coral text-white';
              const arrowColor = member.slug === 'yusuf-abdelatti' ? 'text-teal' : 'text-coral';

              return (
                <Link
                  key={member.slug}
                  href={`/${locale}/team/${member.slug}`}
                  className={`bg-white rounded-3xl overflow-hidden border border-border shadow-sm card-lift flex flex-col group rtl:text-right`}
                >
                  {/* Avatar band */}
                  <div className={`${colorBg} px-8 py-8 flex items-center gap-5 rtl:flex-row-reverse`}>
                    <TeamAvatar
                      photo={member.photo}
                      initials={member.initials}
                      name={member.name[lang]}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-xl text-white leading-snug">{member.name[lang]}</p>
                      <p className="text-white/75 text-sm mt-0.5">{member.titles[lang][0]}</p>
                    </div>
                    <svg
                      width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"
                      viewBox="0 0 24 24"
                      className="text-white/50 group-hover:text-white transition-colors flex-shrink-0 rtl:rotate-180"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                    </svg>
                  </div>

                  {/* Details */}
                  <div className="px-8 py-6 flex-1 flex flex-col gap-3">
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-ink-2/50 mb-1.5">
                        {isAr ? 'التخصصات' : 'Specializations'}
                      </p>
                      <div className={`flex flex-wrap gap-1.5 rtl:flex-row-reverse`}>
                        {member.titles[lang].slice(0, 2).map((title) => (
                          <span
                            key={title}
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              member.slug === 'yusuf-abdelatti'
                                ? 'bg-teal-pale text-teal-dark'
                                : 'bg-coral-pale text-coral-dark'
                            }`}
                          >
                            {title}
                          </span>
                        ))}
                        {member.titles[lang].length > 2 && (
                          <span className="text-xs text-ink-2/50 py-1">
                            +{member.titles[lang].length - 2} {isAr ? 'المزيد' : 'more'}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-ink-2 text-sm leading-relaxed line-clamp-3">
                      {member.teaser[lang]}
                    </p>

                    <p className={`text-xs font-semibold mt-auto pt-2 ${arrowColor} group-hover:underline`}>
                      {isAr ? 'عرض الملف الكامل' : 'View full profile'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          VISION — Dhurriyyah etymology moment
      ════════════════════════════════════════════════════════ */}
      <section className="bg-night px-6 py-24 md:py-36 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-coral/40" />
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-coral/80">
              {isAr ? 'رؤيتنا' : 'Our Vision'}
            </p>
            <div className="h-px w-10 bg-coral/40" />
          </div>

          {/* Dhurriyyah — the word as a visual centrepiece */}
          <div className="flex flex-col items-center gap-3">
            <p
              className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white/10 select-none leading-none"
              aria-hidden="true"
            >
              ذرية
            </p>
            <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/25">
              {isAr ? 'ذُرِّيَّة — من القرآن الكريم' : 'Dhurriyyah — from the Holy Quran'}
            </p>
          </div>

          <blockquote className={`font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white leading-[1.3] tracking-tight max-w-2xl rtl:text-right`}>
            {isAr
              ? 'النسل والأجيال المتعاقبة التي تنبثق من الجذر.'
              : 'Offspring. Progeny. The generations that grow from a root.'}
          </blockquote>

          <div className={`flex flex-col gap-4 text-white/50 text-base md:text-lg leading-relaxed max-w-2xl rtl:text-right`}>
            <p>{tAbout('vision.p1')}</p>
            <p>{tAbout('vision.p2')}</p>
          </div>

          <div className="flex flex-col items-center gap-3 pt-4">
            <div className="w-px h-10 bg-white/10" />
            <p className="font-heading text-xl text-white/40 italic">{tagline}</p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CONTACT
      ════════════════════════════════════════════════════════ */}
      <section id="contact" className="bg-paper px-6 py-14 md:py-20 lg:py-28">
        <div className="max-w-content mx-auto">
          <div className={`mb-14 rtl:text-right`}>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-teal mb-3">
              {isAr ? 'تواصل معنا' : 'Get In Touch'}
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-ink leading-tight">
              {tCon('hero.heading')}
            </h2>
            <p className="mt-3 text-ink-2 text-base md:text-lg max-w-xl leading-relaxed">
              {tCon('hero.subheading')}
            </p>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-14 items-start rtl:text-right`}>
            {/* Form */}
            <div className="bg-white rounded-3xl border border-border shadow-sm p-8 md:p-10">
              <ContactForm locale={locale} />
            </div>

            {/* Info sidebar */}
            <div className="flex flex-col gap-8 lg:sticky lg:top-24">
              <h3 className="font-heading text-2xl text-ink">{tCon('info.heading')}</h3>

              <div className="flex flex-col gap-6">
                {(
                  [
                    {
                      label: tCon('info.addressLabel'),
                      content: (
                        <p className="text-ink/80 text-sm leading-relaxed">
                          {isAr ? 'ياسمين 6، التجمع الخامس، القاهرة، مصر' : 'Yasmin 6, New Cairo, Cairo, Egypt'}
                        </p>
                      ),
                      icon: (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                        </svg>
                      ),
                      color: 'text-teal',
                    },
                    {
                      label: tCon('info.phoneLabel'),
                      content: (
                        <div className="flex flex-col gap-1">
                          <a href="tel:+201041582668" className="text-ink/80 text-sm hover:text-teal transition-colors" dir="ltr">+20 104 158 2668</a>
                          <a href="tel:+201041582271" className="text-ink/50 text-sm hover:text-teal transition-colors" dir="ltr">+20 104 158 2271</a>
                        </div>
                      ),
                      icon: (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
                        </svg>
                      ),
                      color: 'text-coral',
                    },
                    {
                      label: isAr ? 'واتساب' : 'WhatsApp',
                      content: (
                        <a
                          href="https://wa.me/201041582668"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#25D366] text-sm hover:underline"
                          dir="ltr"
                        >
                          +20 104 158 2668
                        </a>
                      ),
                      icon: (
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      ),
                      color: 'text-[#25D366]',
                    },
                    {
                      label: tCon('info.emailLabel'),
                      content: (
                        <a href="mailto:zurriyacdc@gmail.com" className="text-ink/80 text-sm hover:text-teal transition-colors break-all">
                          zurriyacdc@gmail.com
                        </a>
                      ),
                      icon: (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                        </svg>
                      ),
                      color: 'text-sage',
                    },
                    {
                      label: tCon('info.hoursLabel'),
                      content: (
                        <p className="text-ink/80 text-sm leading-relaxed">{tCon('info.hoursValue')}</p>
                      ),
                      icon: (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      ),
                      color: 'text-gold',
                    },
                  ] as Array<{ label: string; content: React.ReactNode; icon: React.ReactNode; color: string }>
                ).map(({ label, content, icon, color }) => (
                  <div key={label} className={`flex items-start gap-4 rtl:flex-row-reverse`}>
                    <span className={`mt-0.5 flex-shrink-0 ${color}`}>{icon}</span>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-ink-2/50 mb-1">{label}</p>
                      {content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="rounded-2xl overflow-hidden border border-border bg-teal-pale/50 h-44 flex flex-col items-center justify-center gap-2">
                <svg width="22" height="22" fill="none" stroke="#1B5E6E" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                </svg>
                <span className="text-xs text-teal font-medium">
                  {isAr ? 'ياسمين 6، التجمع الخامس' : 'Yasmin 6, New Cairo'}
                </span>
                <span className="text-[10px] text-ink-2/40">
                  {tCon('mapPlaceholder')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
