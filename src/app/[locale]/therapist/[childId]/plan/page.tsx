'use client';

import { useState }    from 'react';
import { LONG_TERM_GOALS, SHORT_TERM_GOALS } from '@/lib/portal-mock';
import { ProgressBar } from '@/components/portal/ui/ProgressBar';

export default function TherapistPlanPage({
  params: { locale, childId },
}: {
  params: { locale: string; childId: string };
}) {
  const isAr = locale === 'ar';
  const [tab, setTab] = useState<'long' | 'short'>('long');
  const goals = tab === 'long' ? LONG_TERM_GOALS : SHORT_TERM_GOALS;

  return (
    <div className="p-5 md:p-8 space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-ink">{isAr ? 'خطة العلاج' : 'Treatment Plan'}</h2>
        <button className="flex items-center gap-1.5 bg-teal text-white text-xs font-semibold rounded-xl px-3.5 py-2 hover:bg-teal-dark transition-colors">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          {isAr ? 'إضافة هدف' : 'Add Goal'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-paper border border-border rounded-xl p-1">
        {([['long', 'Long-term Goals', 'الأهداف طويلة المدى'], ['short', 'Short-term Goals', 'الأهداف قصيرة المدى']] as const).map(([key, en, ar]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              tab === key ? 'bg-white text-teal shadow-sm' : 'text-ink-2/60'
            }`}
          >
            {isAr ? ar : en}
          </button>
        ))}
      </div>

      {/* Goals */}
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className={`${goal.colorClass} px-5 py-4 flex items-start gap-3`}>
              <div className={`${goal.iconBg} w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <span className="text-base">{goal.emoji}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-ink">{isAr ? goal.titleAr : goal.titleEn}</h3>
                <p className="text-xs text-ink-2 mt-1 leading-relaxed">{isAr ? goal.descAr : goal.descEn}</p>
              </div>
              {/* Edit button */}
              <button className="text-ink-2/40 hover:text-teal transition-colors flex-shrink-0">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
            </div>

            <div className="px-5 py-4 border-b border-border/60">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-ink-2">{isAr ? 'التقدم' : 'Progress'}</span>
                <span className="text-xs font-bold text-teal">{goal.pct}%</span>
              </div>
              <ProgressBar pct={goal.pct} />
            </div>

            {/* Objectives */}
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold text-ink-2/50 tracking-wider uppercase">
                  {isAr ? `الأهداف الفرعية (${goal.objectives.filter(o=>o.done).length}/${goal.objectives.length})`
                          : `Objectives (${goal.objectives.filter(o=>o.done).length}/${goal.objectives.length})`}
                </p>
                <button className="text-[11px] text-teal font-semibold hover:underline">
                  {isAr ? '+ إضافة' : '+ Add'}
                </button>
              </div>
              <ul className="space-y-2.5">
                {goal.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <button className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors ${
                      obj.done ? 'bg-sage text-white' : 'border-2 border-border hover:border-teal'
                    }`}>
                      {obj.done && (
                        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                      )}
                    </button>
                    <span className={`text-xs leading-relaxed flex-1 ${obj.done ? 'text-ink-2 line-through opacity-60' : 'text-ink-2'}`}>
                      {isAr ? obj.textAr : obj.textEn}
                    </span>
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
