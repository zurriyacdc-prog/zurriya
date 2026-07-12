import { TIMELINE } from '@/lib/portal-mock';

const TYPE_STYLES: Record<string, string> = {
  teal:  'bg-teal-pale   text-teal   border-teal/20',
  coral: 'bg-coral-pale  text-coral  border-coral/20',
  sage:  'bg-sage-pale   text-sage   border-sage/20',
  gold:  'bg-gold-pale   text-gold   border-gold/20',
};

const DOT_STYLES: Record<string, string> = {
  teal:  'bg-teal',
  coral: 'bg-coral',
  sage:  'bg-sage',
  gold:  'bg-gold',
};

export default function JourneyPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';

  // Group by month
  const groups: Record<string, typeof TIMELINE> = {};
  TIMELINE.forEach((e) => {
    const key = isAr ? e.dateAr.split(' ').slice(1).join(' ') : e.date.split(' ').slice(0, 2).join(' ');
    // Use simple month+year as group key
    const monthKey = isAr
      ? `${e.dateAr.split(' ')[1]} ${e.dateAr.split(' ')[2]}`
      : `${e.date.split(' ')[0]} ${e.date.split(' ')[2]}`;
    if (!groups[monthKey]) groups[monthKey] = [];
    groups[monthKey].push(e);
  });

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-ink">{isAr ? 'رحلة التطور' : 'Journey'}</h1>
        <p className="text-sm text-ink-2 mt-0.5">
          {isAr ? 'كل الأحداث المهمة في مسيرة طفلك' : "Every milestone in your child's journey"}
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(groups).map(([month, events]) => (
          <div key={month}>
            <h2 className="text-xs font-bold text-ink-2/50 tracking-widest uppercase mb-4">{month}</h2>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute start-[11px] top-3 bottom-3 w-0.5 bg-border" />

              <ul className="space-y-5">
                {events.map((evt) => (
                  <li key={evt.id} className="flex gap-4">
                    {/* Dot */}
                    <div className={`w-6 h-6 rounded-full flex-shrink-0 ${DOT_STYLES[evt.typeColor]} flex items-center justify-center z-10`}>
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>

                    {/* Card */}
                    <div className="flex-1 bg-white rounded-2xl border border-border shadow-sm p-4 -mt-0.5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${TYPE_STYLES[evt.typeColor]}`}>
                          {isAr ? evt.typeAr : evt.typeEn}
                        </span>
                        <span className="text-[11px] text-ink-2/50 flex-shrink-0">
                          {isAr ? evt.dateAr : evt.date}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-ink">{isAr ? evt.titleAr : evt.titleEn}</p>
                      <p className="text-xs text-ink-2 mt-1 leading-relaxed">{isAr ? evt.descAr : evt.descEn}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
