export default function TherapistCalendarPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-ink mb-2">{isAr ? 'التقويم' : 'Calendar'}</h1>
      <p className="text-sm text-ink-2 mb-8">{isAr ? 'جدول الجلسات القادمة' : 'Upcoming session schedule'}</p>

      <div className="bg-white rounded-2xl border border-border shadow-sm p-8 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-teal-pale flex items-center justify-center">
          <svg width="28" height="28" fill="none" stroke="#1B5E6E" strokeWidth="1.5" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <p className="text-sm font-semibold text-ink">
          {isAr ? 'التقويم التفاعلي قادم قريباً' : 'Interactive calendar coming soon'}
        </p>
        <p className="text-xs text-ink-2/60 max-w-xs">
          {isAr
            ? 'سيتضمن هذا القسم جدولة الجلسات وإدارة المواعيد.'
            : 'This section will include session scheduling and appointment management.'}
        </p>
      </div>
    </div>
  );
}
