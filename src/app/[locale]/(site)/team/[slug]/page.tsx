import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import Link from 'next/link';
import { getMemberBySlug, teamMembers } from '@/content/team';
import { TeamAvatar } from '@/components/TeamAvatar';
import type { Metadata } from 'next';

type Props = {
  params: { locale: string; slug: string };
};

export async function generateStaticParams() {
  const locales = ['en', 'ar'];
  return teamMembers.flatMap((m) =>
    locales.map((locale) => ({ locale, slug: m.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const member = getMemberBySlug(params.slug);
  if (!member) return { title: 'Not Found' };

  const isAr  = params.locale === 'ar';
  const name  = member.name[isAr ? 'ar' : 'en'];
  const title = member.titles[isAr ? 'ar' : 'en'][0];

  return {
    title: `${name} — ${title} | Zurriya`,
    description: member.teaser[isAr ? 'ar' : 'en'],
  };
}

export default async function TeamMemberPage({ params }: Props) {
  const member = getMemberBySlug(params.slug);
  if (!member) notFound();

  const locale = await getLocale();
  const lang   = locale as 'en' | 'ar';
  const isAr   = locale === 'ar';

  const isTeal = member.slug === 'yusuf-abdelatti';
  const accentBg     = isTeal ? 'bg-teal'       : 'bg-coral';
  const accentPale   = isTeal ? 'bg-teal-pale'   : 'bg-coral-pale';
  const accentBorder = isTeal ? 'border-teal/20' : 'border-coral/20';

  const backLabel = isAr ? '← العودة إلى الفريق' : '← Back to Team';

  return (
    <main className={`bg-paper min-h-screen ${isAr ? 'rtl' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* ── Hero band ── */}
      <section className={`${accentBg} text-white`}>
        <div className="max-w-content mx-auto px-6 pt-20 md:pt-28 pb-12 md:pb-16">
          {/* Back link */}
          <Link
            href={`/${locale}#team`}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 text-sm font-medium transition-colors mb-10"
          >
            {backLabel}
          </Link>

          <div className={`flex flex-col sm:flex-row items-start gap-5 sm:gap-8 ${isAr ? 'sm:rtl:flex-row-reverse' : ''}`}>
            <TeamAvatar
              photo={member.photo}
              initials={member.initials}
              name={member.name[lang]}
              size="lg"
            />

            <div className={`flex-1 min-w-0 ${isAr ? 'rtl:text-right' : ''}`}>
              <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight">
                {member.name[lang]}
              </h1>
              <div className={`flex flex-wrap gap-2 mt-4 ${isAr ? 'rtl:flex-row-reverse' : ''}`}>
                {member.titles[lang].map((title) => (
                  <span
                    key={title}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-white/90"
                  >
                    {title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="max-w-content mx-auto px-6 py-12 md:py-20">

        {/* Placeholder state */}
        {member.isPlaceholder ? (
          <div className="max-w-xl mx-auto text-center flex flex-col items-center gap-8 py-16">
            <div className={`w-16 h-16 rounded-full ${accentPale} flex items-center justify-center`}>
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className={isTeal ? 'text-teal' : 'text-coral'}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className={isAr ? 'rtl:text-right' : ''}>
              <h2 className="font-heading text-3xl text-ink mb-4">
                {isAr ? 'السيرة الذاتية قريباً' : 'Full Profile Coming Soon'}
              </h2>
              <p className="text-ink-2 text-lg leading-relaxed">
                {isAr
                  ? `ستتوفر السيرة الكاملة لـ${member.name[lang]} قريباً. تواصل معنا لمزيد من المعلومات.`
                  : `${member.name[lang]}'s full profile will be available soon. Contact us for more information.`}
              </p>
            </div>
            <Link
              href={`/${locale}#contact`}
              className={`inline-flex items-center gap-2 ${accentBg} text-white text-sm font-semibold rounded-full px-7 py-3.5 hover:opacity-90 transition-opacity shadow-lg`}
            >
              {isAr ? 'تواصل معنا' : 'Get in Touch'}
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className={isAr ? 'rotate-180' : ''}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-14 md:gap-20">

            {/* ── Sidebar ── */}
            <aside className={`lg:sticky lg:top-24 self-start flex flex-col gap-8 ${isAr ? 'rtl:text-right' : ''}`}>
              {/* Education */}
              <div>
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-ink-2/50 mb-3">
                  {isAr ? 'التعليم' : 'Education'}
                </p>
                <ul className="flex flex-col gap-3">
                  {member.education[lang].map((edu) => (
                    <li key={edu} className="text-sm text-ink-2 leading-relaxed">
                      {edu}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Focus areas */}
              <div>
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-ink-2/50 mb-3">
                  {isAr ? 'مجالات التخصص' : 'Focus Areas'}
                </p>
                <ul className={`flex flex-col gap-2 ${isAr ? 'rtl:text-right' : ''}`}>
                  {member.focusAreas[lang].map((area) => (
                    <li
                      key={area}
                      className={`flex items-start gap-2 text-sm text-ink-2 leading-relaxed ${isAr ? 'rtl:flex-row-reverse' : ''}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${accentBg}`} />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <Link
                href={`/${locale}#contact`}
                className={`inline-flex items-center justify-center gap-2 ${accentBg} text-white text-sm font-semibold rounded-full px-6 py-3.5 hover:opacity-90 transition-opacity shadow-lg shadow-black/10`}
              >
                {isAr ? 'احجز استشارة' : 'Book a Consultation'}
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className={isAr ? 'rotate-180' : ''}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                </svg>
              </Link>
            </aside>

            {/* ── Main content ── */}
            <div className={`flex flex-col gap-12 ${isAr ? 'rtl:text-right' : ''}`}>

              {/* Bio intro */}
              <div>
                <p className={`text-xl md:text-2xl text-ink leading-relaxed font-medium`}>
                  {member.bio[lang]}
                </p>
              </div>

              {/* Approach */}
              <Section
                label={isAr ? 'النهج الإكلينيكي' : 'Clinical Approach'}
                accentBorder={accentBorder}
                dotClass={isTeal ? 'bg-teal' : 'bg-coral'}
              >
                {member.approach[lang].split('\n\n').map((para, i) => (
                  <p key={i} className="text-ink-2 leading-relaxed">{para}</p>
                ))}
              </Section>

              {/* Experience */}
              <Section
                label={isAr ? 'الخبرة المهنية' : 'Professional Experience'}
                accentBorder={accentBorder}
                dotClass={isTeal ? 'bg-teal' : 'bg-coral'}
              >
                {member.experience[lang].split('\n\n').map((para, i) => (
                  <p key={i} className="text-ink-2 leading-relaxed">{para}</p>
                ))}
              </Section>

              {/* Assessment & Technology */}
              <Section
                label={isAr ? 'التقييم والتقنيات العلاجية' : 'Assessment & Therapeutic Technology'}
                accentBorder={accentBorder}
                dotClass={isTeal ? 'bg-teal' : 'bg-coral'}
              >
                {member.assessmentTech[lang].split('\n\n').map((para, i) => (
                  <p key={i} className="text-ink-2 leading-relaxed">{para}</p>
                ))}
              </Section>

              {/* Work with families */}
              <Section
                label={isAr ? 'العمل مع الأسر' : 'Working with Families'}
                accentBorder={accentBorder}
                dotClass={isTeal ? 'bg-teal' : 'bg-coral'}
              >
                <p className="text-ink-2 leading-relaxed">{member.familyWork[lang]}</p>
              </Section>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// ─── Section component ────────────────────────────────────

type SectionProps = {
  label: string;
  accentBorder: string;
  dotClass: string;
  children: React.ReactNode;
};

function Section({ label, accentBorder, dotClass, children }: SectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className={`w-1 h-6 rounded-full ${dotClass} opacity-80`} />
        <h2 className="font-heading text-2xl text-ink">{label}</h2>
      </div>
      <div className={`border-s-2 ${accentBorder} ps-5 flex flex-col gap-3`}>
        {children}
      </div>
    </div>
  );
}
