'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  addGoal, addObjective, toggleObjective, updateGoalProgress,
  deleteGoal, deleteObjective, editGoal,
} from '@/lib/supabase/therapist-actions';
import { ProgressBar } from '@/components/portal/ui/ProgressBar';

type Objective = { id: string; text_en: string; text_ar: string; is_done: boolean };
type Goal = {
  id: string; type: string; title_en: string; title_ar: string;
  progress: number; color?: string; domain?: string; objectives: Objective[];
};

const DOMAINS = ['communication','motor','cognitive','social','sensory','behavior','daily_living'];
const DOMAIN_COLORS: Record<string, string> = {
  communication: 'bg-teal-pale', motor: 'bg-sage-pale', cognitive: 'bg-gold-pale',
  social: 'bg-coral-pale', sensory: 'bg-linen',
};

export default function PlanClient({
  goals, locale, childId,
}: { goals: Goal[]; locale: string; childId: string }) {
  const isAr = locale === 'ar';
  const router  = useRouter();
  const goalFormRef = useRef<HTMLFormElement>(null);
  const objFormRef  = useRef<Record<string, HTMLFormElement | null>>({});
  const editFormRef = useRef<Record<string, HTMLFormElement | null>>({});

  const [tab, setTab]                   = useState<'long' | 'short'>('long');
  const [addingGoal, setAddingGoal]     = useState(false);
  const [addingObjFor, setAddingObjFor] = useState<string | null>(null);
  const [editingGoal, setEditingGoal]   = useState<string | null>(null);
  const [error, setError]               = useState('');
  const [isPending, startTransition]    = useTransition();

  const filtered = goals.filter((g) => g.type === (tab === 'long' ? 'long_term' : 'short_term'));

  function handleAddGoal(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const fd = new FormData(goalFormRef.current!);
    fd.set('child_id', childId);
    fd.set('type', tab === 'long' ? 'long_term' : 'short_term');
    startTransition(async () => {
      const result = await addGoal(fd);
      if (result?.error) { setError(result.error); return; }
      setAddingGoal(false);
      router.refresh();
    });
  }

  function handleEditGoal(goalId: string, e: React.FormEvent) {
    e.preventDefault();
    const form = editFormRef.current[goalId];
    if (!form) return;
    const fd = new FormData(form);
    startTransition(async () => {
      await editGoal(goalId, fd, childId);
      setEditingGoal(null);
      router.refresh();
    });
  }

  function handleDeleteGoal(goalId: string) {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذا الهدف وجميع أهدافه الفرعية؟' : 'Delete this goal and all its objectives?')) return;
    startTransition(async () => {
      await deleteGoal(goalId, childId);
      router.refresh();
    });
  }

  function handleAddObjective(goalId: string, e: React.FormEvent) {
    e.preventDefault();
    const form = objFormRef.current[goalId];
    if (!form) return;
    const textEn = (form.elements.namedItem('text_en') as HTMLInputElement).value.trim();
    const textAr = (form.elements.namedItem('text_ar') as HTMLInputElement).value.trim();
    if (!textEn && !textAr) return;
    startTransition(async () => {
      await addObjective(goalId, textEn || textAr, textAr || textEn, childId);
      setAddingObjFor(null);
      router.refresh();
    });
  }

  function handleToggleObjective(goalId: string, objId: string, isDone: boolean, allObjectives: Objective[]) {
    // Auto-compute progress: count how many will be done after this toggle
    const newDone = allObjectives.filter((o) => (o.id === objId ? isDone : o.is_done)).length;
    const newProgress = allObjectives.length > 0 ? Math.round((newDone / allObjectives.length) * 100) : 0;
    startTransition(async () => {
      await toggleObjective(objId, isDone, childId);
      await updateGoalProgress(goalId, newProgress, childId);
      router.refresh();
    });
  }

  function handleDeleteObjective(objId: string) {
    startTransition(async () => {
      await deleteObjective(objId, childId);
      router.refresh();
    });
  }

  function handleProgressChange(goalId: string, value: number) {
    startTransition(async () => {
      await updateGoalProgress(goalId, value, childId);
      router.refresh();
    });
  }

  return (
    <div className="p-5 md:p-8 space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-ink">{isAr ? 'خطة العلاج' : 'Treatment Plan'}</h2>
        <button onClick={() => setAddingGoal(true)}
          className="flex items-center gap-1.5 bg-teal text-white text-xs font-semibold rounded-xl px-3.5 py-2 hover:bg-teal-dark transition-colors">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          {isAr ? 'إضافة هدف' : 'Add Goal'}
        </button>
      </div>

      <div className="flex bg-paper border border-border rounded-xl p-1">
        {([['long', 'Long-term', 'طويلة المدى'], ['short', 'Short-term', 'قصيرة المدى']] as const).map(([key, en, ar]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              tab === key ? 'bg-white text-teal shadow-sm' : 'text-ink-2/60'
            }`}>
            {isAr ? ar : en}
          </button>
        ))}
      </div>

      {/* Add goal form */}
      {addingGoal && (
        <div className="bg-teal-pale border border-teal/20 rounded-2xl p-5">
          <p className="text-sm font-bold text-ink mb-3">
            {isAr ? `إضافة هدف ${tab === 'long' ? 'طويل' : 'قصير'} المدى` : `Add ${tab === 'long' ? 'Long' : 'Short'}-term Goal`}
          </p>
          {error && <p className="text-xs text-coral mb-3">{error}</p>}
          <form ref={goalFormRef} onSubmit={handleAddGoal} className="space-y-3">
            <input required name="title_en" type="text" placeholder="Goal title (English)"
              className="w-full text-sm bg-white border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" />
            <input name="title_ar" type="text" dir="rtl" placeholder="عنوان الهدف (عربي)"
              className="w-full text-sm bg-white border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20" />
            <select name="domain"
              className="w-full text-sm bg-white border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/20">
              <option value="">{isAr ? 'المجال (اختياري)' : 'Domain (optional)'}</option>
              {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <div className="flex gap-2">
              <button type="submit" disabled={isPending}
                className="flex-1 bg-teal text-white text-sm font-semibold py-2 rounded-xl disabled:opacity-60">
                {isPending ? '...' : (isAr ? 'حفظ' : 'Save')}
              </button>
              <button type="button" onClick={() => setAddingGoal(false)}
                className="px-4 py-2 text-sm text-ink-2 bg-white border border-border rounded-xl">
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {filtered.length === 0 && !addingGoal && (
        <div className="bg-white rounded-2xl border border-border p-10 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-sm text-ink-2/60">{isAr ? 'لا توجد أهداف. أضف أول هدف!' : 'No goals yet. Add the first one!'}</p>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((goal) => {
          const colorBg = DOMAIN_COLORS[goal.domain ?? ''] ?? 'bg-paper';
          const doneCount = goal.objectives.filter((o) => o.is_done).length;
          const isEditing = editingGoal === goal.id;
          return (
            <div key={goal.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              {/* Goal header */}
              <div className={`${colorBg} px-5 py-4 flex items-start gap-3`}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: goal.color ? `${goal.color}22` : '#1B5E6E22' }}>
                  <span className="text-base">🎯</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-ink">{isAr ? goal.title_ar : goal.title_en}</h3>
                  {goal.domain && <p className="text-xs text-ink-2 mt-0.5 capitalize">{goal.domain}</p>}
                </div>
                {/* Edit + Delete goal */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setEditingGoal(isEditing ? null : goal.id)}
                    disabled={isPending}
                    title={isAr ? 'تعديل' : 'Edit'}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-2/50 hover:text-teal hover:bg-white/60 transition-colors">
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    disabled={isPending}
                    title={isAr ? 'حذف الهدف' : 'Delete goal'}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-2/50 hover:text-coral hover:bg-white/60 transition-colors">
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Inline edit form */}
              {isEditing && (
                <form
                  ref={(el) => { editFormRef.current[goal.id] = el; }}
                  onSubmit={(e) => handleEditGoal(goal.id, e)}
                  className="px-5 py-4 bg-teal-pale/50 border-b border-teal/20 space-y-2">
                  <input name="title_en" defaultValue={goal.title_en} required
                    placeholder="Goal title (English)"
                    className="w-full text-sm bg-white border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal/20" />
                  <input name="title_ar" defaultValue={goal.title_ar} dir="rtl"
                    placeholder="عنوان الهدف (عربي)"
                    className="w-full text-sm bg-white border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal/20" />
                  <select name="domain" defaultValue={goal.domain ?? ''}
                    className="w-full text-sm bg-white border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal/20">
                    <option value="">{isAr ? 'المجال (اختياري)' : 'Domain (optional)'}</option>
                    {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <div className="flex gap-2">
                    <button type="submit" disabled={isPending}
                      className="flex-1 bg-teal text-white text-xs font-semibold py-2 rounded-xl disabled:opacity-60">
                      {isPending ? '...' : (isAr ? 'حفظ التعديل' : 'Save changes')}
                    </button>
                    <button type="button" onClick={() => setEditingGoal(null)}
                      className="px-3 py-2 text-xs text-ink-2 bg-white border border-border rounded-xl">
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                  </div>
                </form>
              )}

              {/* Progress */}
              <div className="px-5 py-4 border-b border-border/60">
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-ink-2">{isAr ? 'التقدم' : 'Progress'}</span>
                  <span className="text-xs font-bold text-teal">{goal.progress}%</span>
                </div>
                <ProgressBar pct={goal.progress} />
                <div className="flex items-center gap-2 mt-3">
                  <input type="range" min={0} max={100} step={5} defaultValue={goal.progress}
                    disabled={isPending}
                    onChange={(e) => handleProgressChange(goal.id, Number(e.target.value))}
                    className="flex-1 accent-teal" />
                </div>
              </div>

              {/* Objectives */}
              <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-bold text-ink-2/50 tracking-wider uppercase">
                    {isAr ? `الأهداف الفرعية (${doneCount}/${goal.objectives.length})` : `Objectives (${doneCount}/${goal.objectives.length})`}
                  </p>
                  <button onClick={() => setAddingObjFor(addingObjFor === goal.id ? null : goal.id)}
                    className="text-[11px] text-teal font-semibold hover:underline">
                    {isAr ? '+ إضافة' : '+ Add'}
                  </button>
                </div>

                {addingObjFor === goal.id && (
                  <form ref={(el) => { objFormRef.current[goal.id] = el; }}
                    onSubmit={(e) => handleAddObjective(goal.id, e)}
                    className="bg-teal-pale border border-teal/20 rounded-xl p-3 mb-3 space-y-2">
                    <input name="text_en" type="text" placeholder="Objective (English)"
                      className="w-full text-xs bg-white border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal/20" />
                    <input name="text_ar" type="text" dir="rtl" placeholder="الهدف الفرعي (عربي)"
                      className="w-full text-xs bg-white border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal/20" />
                    <button type="submit" disabled={isPending}
                      className="w-full bg-teal text-white text-xs font-semibold py-1.5 rounded-lg disabled:opacity-60">
                      {isAr ? 'إضافة' : 'Add'}
                    </button>
                  </form>
                )}

                <ul className="space-y-2.5">
                  {goal.objectives.map((obj) => (
                    <li key={obj.id} className="flex items-start gap-2 group">
                      <button
                        onClick={() => handleToggleObjective(goal.id, obj.id, !obj.is_done, goal.objectives)}
                        disabled={isPending}
                        className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors ${
                          obj.is_done ? 'bg-sage text-white' : 'border-2 border-border hover:border-teal'
                        }`}>
                        {obj.is_done && (
                          <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                        )}
                      </button>
                      <span className={`text-xs leading-relaxed flex-1 ${obj.is_done ? 'text-ink-2 line-through opacity-60' : 'text-ink-2'}`}>
                        {isAr ? obj.text_ar : obj.text_en}
                      </span>
                      <button
                        onClick={() => handleDeleteObjective(obj.id)}
                        disabled={isPending}
                        title={isAr ? 'حذف' : 'Delete'}
                        className="opacity-0 group-hover:opacity-100 w-5 h-5 flex-shrink-0 flex items-center justify-center text-ink-2/30 hover:text-coral transition-all mt-0.5">
                        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
