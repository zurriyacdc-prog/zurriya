'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type FormState = { name: string; phone: string; email: string; message: string };
type FormErrors = Partial<Record<keyof FormState, string>>;

export function ContactForm({ locale }: { locale: string }) {
  const t = useTranslations('contact.form');
  const [form, setForm] = useState<FormState>({ name: '', phone: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = t('errorName');
    if (!form.email.trim()) errs.email = t('errorEmailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t('errorEmailInvalid');
    if (!form.message.trim()) errs.message = t('errorMessage');
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('send failed');
      setSubmitted(true);
    } catch {
      setErrors({ message: locale === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof FormState]) setErrors((p) => ({ ...p, [name]: undefined }));
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-5 py-6 rtl:items-end">
        <div className="w-12 h-12 rounded-full bg-sage/20 border border-sage/30 flex items-center justify-center">
          <svg width="20" height="20" fill="none" stroke="#78A870" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div className="rtl:text-right">
          <h3 className="font-heading text-2xl text-ink mb-2">{t('successTitle')}</h3>
          <p className="text-ink-2 leading-relaxed max-w-sm">{t('successBody')}</p>
        </div>
      </div>
    );
  }

  const input =
    'w-full rounded-xl border border-border bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-2/40 focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet/60 transition-all duration-150';
  const label = 'block text-[10px] font-semibold tracking-[0.12em] uppercase text-ink-2/60 mb-2';
  const errMsg = 'mt-1.5 text-xs text-red-400';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className={label}>{t('name')}</label>
          <input id="name" name="name" type="text" autoComplete="name" placeholder={t('namePlaceholder')} value={form.name} onChange={handleChange} className={input} />
          {errors.name && <p className={errMsg}>{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="phone" className={label}>{t('phone')}</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder={t('phonePlaceholder')} value={form.phone} onChange={handleChange} className={input} dir="ltr" />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={label}>{t('email')}</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder={t('emailPlaceholder')} value={form.email} onChange={handleChange} className={input} dir="ltr" />
        {errors.email && <p className={errMsg}>{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="message" className={label}>{t('message')}</label>
        <textarea id="message" name="message" rows={5} placeholder={t('messagePlaceholder')} value={form.message} onChange={handleChange} className={`${input} resize-none`} />
        {errors.message && <p className={errMsg}>{errors.message}</p>}
      </div>

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 bg-ink text-paper text-sm font-medium rounded-full px-8 py-3.5 hover:bg-night-light transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {submitting ? (
            <>
              <svg className="animate-spin" width="14" height="14" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t('submitting')}
            </>
          ) : (
            <>
              {t('submit')}
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="rtl:rotate-180">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
