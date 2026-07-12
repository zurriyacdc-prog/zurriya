'use client';

import { useState }    from 'react';
import { LONG_TERM_GOALS, SHORT_TERM_GOALS } from '@/lib/portal-mock';
import { ProgressBar } from '@/components/portal/ui/ProgressBar';

export default function PlanPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  const [tab, setTab] = useState<'long' | 'short'>('long');

  const goals = tab === 'long' ? LONG_TERM_GOALS : SHORT_TERM_GOALS;

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-ink">{isAr ? 'خطة العلاج' : 'Treatment Plan'}</h1>
        <p className="text-sm text-ink-2 mt-0.5">
          {isAr ? 'أهداف وخطوات رحلة طفلك' : "Your child's goals and milestones"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-paper border border-border rounded-xl p-1 mb-6">
        {([['long', 'Long-term Goals', 'الأهداف طويلة المدى'], ['short', 'Short-term Goals', 'الأهداف قصيرة المدى']] as const).map(([key, en, ar]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
              tab === key ? 'bg-white text-teal shadow-sm' : 'text-ink-2/60 hover:text-ink'
            }`}
          >
            {isAr ? ar : en}
          </button>
        ))}
      </div>

      {/* Goal cards */}
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            {/* Header */}
            <div className={`${goal.colorClass} px-5 py-4 flex items-start gap-3`}>
              <div className={`${goal.iconBg} w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <span className="text-base">{goal.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-ink text-sm leading-snug">
                  {isAr ? goal.titleAr : goal.titleEn}
                </h3>
                <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                  {isAr ? goal.descAr : goal.descEn}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="px-5 py-4 border-b border-border/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-ink-2">{isAr ? 'التقدم' : 'Progress'}</span>
                <span className="text-xs font-bold text-teal">{goal.pct}%</span>
              </div>
              <ProgressBar pct={goal.pct} />
            </div>

            {/* Objectives */}
            {goal.objectives.length > 0 && (
              <div className="px-5 py-4">
                <p className="text-[11px] font-bold text-ink-2/50 tracking-wider uppercase mb-3">
                  {isAr ? `الأهداف الفرعية (${goal.objectives.filter(o => o.done).length}/${goal.objectives.length})`
                          : `Objectives (${goal.objectives.filter(o => o.done).length}/${goal.objectives.length})`}
                </p>
                <ul className="space-y-2.5">
                  {goal.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${
                        obj.done ? 'bg-sage text-white' : 'border-2 border-border'
                      }`}>
                        {obj.done && (
                          <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                        )}
                      </div>
                      <span className={`text-xs leading-relaxed ${obj.done ? 'text-ink-2 line-through opacity-60' : 'text-ink-2'}`}>
                        {isAr ? obj.textAr : obj.textEn}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
