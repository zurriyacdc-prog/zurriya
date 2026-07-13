'use client';

import { useState } from 'react';
import { ProgressBar } from '@/components/portal/ui/ProgressBar';

type Objective = { id: string; text_en: string; text_ar: string; is_done: boolean };
type Goal      = {
  id: string; type: string; title_en: string; title_ar: string;
  progress: number; color?: string; domain?: string;
  objectives: Objective[];
};

const DOMAIN_COLORS: Record<string, string> = {
  communication: 'bg-teal-pale',
  motor:         'bg-sage-pale',
  cognitive:     'bg-gold-pale',
  social:        'bg-coral-pale',
  sensory:       'bg-linen',
};

export default function PlanClient({ goals, locale }: { goals: Goal[]; locale: string }) {
  const isAr = locale === 'ar';
  const [tab, setTab] = useState<'long' | 'short'>('long');

  const filtered = goals.filter((g) => g.type === (tab === 'long' ? 'long_term' : 'short_term'));

  return (
    <>
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

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-border p-10 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-sm text-ink-2/60">{isAr ? 'لا توجد أهداف في هذه الفئة بعد' : 'No goals in this category yet'}</p>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((goal) => {
          const colorBg  = DOMAIN_COLORS[goal.domain ?? ''] ?? 'bg-paper';
          const doneCount = goal.objectives.filter((o) => o.is_done).length;
          return (
            <div key={goal.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className={`${colorBg} px-5 py-4 flex items-start gap-3`}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: goal.color ? `${goal.color}22` : '#1B5E6E22' }}>
                  <span className="text-base">🎯</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-ink text-sm leading-snug">
                    {isAr ? goal.title_ar : goal.title_en}
                  </h3>
                  {goal.domain && (
                    <p className="text-xs text-ink-2 mt-0.5 capitalize">{goal.domain}</p>
                  )}
                </div>
              </div>

              <div className="px-5 py-4 border-b border-border/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-ink-2">{isAr ? 'التقدم' : 'Progress'}</span>
                  <span className="text-xs font-bold text-teal">{goal.progress}%</span>
                </div>
                <ProgressBar pct={goal.progress} />
              </div>

              {goal.objectives.length > 0 && (
                <div className="px-5 py-4">
                  <p className="text-[11px] font-bold text-ink-2/50 tracking-wider uppercase mb-3">
                    {isAr ? `الأهداف الفرعية (${doneCount}/${goal.objectives.length})` : `Objectives (${doneCount}/${goal.objectives.length})`}
                  </p>
                  <ul className="space-y-2.5">
                    {goal.objectives.map((obj) => (
                      <li key={obj.id} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${
                          obj.is_done ? 'bg-sage text-white' : 'border-2 border-border'
                        }`}>
                          {obj.is_done && (
                            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                          )}
                        </div>
                        <span className={`text-xs leading-relaxed ${obj.is_done ? 'text-ink-2 line-through opacity-60' : 'text-ink-2'}`}>
                          {isAr ? obj.text_ar : obj.text_en}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
