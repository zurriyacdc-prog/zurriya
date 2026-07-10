'use client';

import { useState, useCallback } from 'react';

// ─── Shared style ────────────────────────────────────────────────────────────
const inputCls = 'w-full border border-border rounded-xl px-3 py-2.5 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors placeholder:text-ink-2/40';
const taCls   = inputCls + ' resize-none';

// ─── Field wrapper ───────────────────────────────────────────────────────────
function F({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-ink leading-snug">{label}</label>
      {note && <p className="text-xs text-ink-2/55 leading-relaxed">{note}</p>}
      {children}
    </div>
  );
}

// ─── Text input ──────────────────────────────────────────────────────────────
function TF({ label, note, k, d, s, placeholder = '' }: { label: string; note?: string; k: string; d: Rec; s: Setter; placeholder?: string; isAr?: boolean }) {
  return (
    <F label={label} note={note}>
      <input type="text" className={inputCls} value={d[k] as string || ''} onChange={e => s(k, e.target.value)} placeholder={placeholder} />
    </F>
  );
}

// ─── Date input ──────────────────────────────────────────────────────────────
function DateF({ label, k, d, s }: { label: string; k: string; d: Rec; s: Setter }) {
  return (
    <F label={label}>
      <input type="date" className={inputCls} value={d[k] as string || ''} onChange={e => s(k, e.target.value)} />
    </F>
  );
}

// ─── Textarea ────────────────────────────────────────────────────────────────
function TAF({ label, note, k, d, s, rows = 3, placeholder = '' }: { label: string; note?: string; k: string; d: Rec; s: Setter; rows?: number; placeholder?: string; isAr?: boolean }) {
  return (
    <F label={label} note={note}>
      <textarea className={taCls} rows={rows} value={d[k] as string || ''} onChange={e => s(k, e.target.value)} placeholder={placeholder} />
    </F>
  );
}

// ─── Radio / single-select ───────────────────────────────────────────────────
type Opt = { v: string; ar: string; en: string };
function RadioF({ label, note, k, d, s, opts, isAr }: { label: string; note?: string; k: string; d: Rec; s: Setter; opts: Opt[]; isAr: boolean }) {
  return (
    <F label={label} note={note}>
      <div className="flex flex-wrap gap-2">
        {opts.map(o => (
          <label key={o.v} className={`flex items-center gap-1.5 cursor-pointer px-3 py-2 rounded-lg border text-sm transition-colors select-none ${d[k] === o.v ? 'bg-teal-pale border-teal text-teal-dark font-medium' : 'border-border hover:border-teal/40'}`}>
            <input type="radio" className="sr-only" checked={d[k] === o.v} onChange={() => s(k, o.v)} />
            {isAr ? o.ar : o.en}
          </label>
        ))}
      </div>
    </F>
  );
}

// ─── Checkbox / multi-select ─────────────────────────────────────────────────
function CheckF({ label, note, k, d, tog, opts, isAr }: { label: string; note?: string; k: string; d: Rec; tog: Toggler; opts: Opt[]; isAr: boolean }) {
  const vals: string[] = (d[k] as string[]) || [];
  return (
    <F label={label} note={note}>
      <div className="flex flex-wrap gap-2">
        {opts.map(o => {
          const on = vals.includes(o.v);
          return (
            <label key={o.v} className={`flex items-center gap-1.5 cursor-pointer px-3 py-2 rounded-lg border text-sm transition-colors select-none ${on ? 'bg-teal-pale border-teal text-teal-dark font-medium' : 'border-border hover:border-teal/40'}`}>
              <span className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded border flex-shrink-0 ${on ? 'bg-teal border-teal' : 'border-ink-2/40'}`}>
                {on && <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1 4.5l2.5 2.5 4.5-4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>}
              </span>
              <input type="checkbox" className="sr-only" checked={on} onChange={() => tog(k, o.v)} />
              {isAr ? o.ar : o.en}
            </label>
          );
        })}
      </div>
    </F>
  );
}

// ─── Single consent checkbox ─────────────────────────────────────────────────
function ConsentBox({ label, k, d, s }: { label: string; k: string; d: Rec; s: Setter }) {
  const on = !!d[k];
  return (
    <label className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg border transition-colors ${on ? 'border-teal bg-teal-pale/60' : 'border-border hover:border-teal/30'}`}>
      <span className={`inline-flex items-center justify-center w-4 h-4 rounded border mt-0.5 flex-shrink-0 ${on ? 'bg-teal border-teal' : 'border-ink-2/40'}`}>
        {on && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>}
      </span>
      <input type="checkbox" className="sr-only" checked={on} onChange={e => s(k, e.target.checked)} />
      <span className="text-sm text-ink leading-snug">{label}</span>
    </label>
  );
}

// ─── 1-5 Rating table ────────────────────────────────────────────────────────
type RRow = { key: string; ar: string; en: string };
function RatingTable({ label, note, rows, stateKey, d, s, isAr }: { label: string; note?: string; rows: RRow[]; stateKey: string; d: Rec; s: Setter; isAr: boolean }) {
  const obj: Record<string, string> = (d[stateKey] as Record<string, string>) || {};
  const setCell = (key: string, val: string) => s(stateKey, { ...obj, [key]: val });
  return (
    <F label={label} note={note}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-teal-pale">
              <th className="p-2 text-start font-semibold text-ink border border-border/60 min-w-[160px]">{isAr ? 'المجال' : 'Area'}</th>
              {['1','2','3','4','5'].map(n => <th key={n} className="p-2 text-center font-bold text-teal border border-border/60 w-10">{n}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.key} className="even:bg-linen/30">
                <td className="p-2 border border-border/60">{isAr ? r.ar : r.en}</td>
                {['1','2','3','4','5'].map(n => (
                  <td key={n} className="p-2 text-center border border-border/60">
                    <input type="radio" name={`${stateKey}_${r.key}`} value={n} checked={obj[r.key] === n} onChange={() => setCell(r.key, n)} className="accent-teal w-4 h-4" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </F>
  );
}

// ─── 3-col sensory table ─────────────────────────────────────────────────────
function SensoryTable({ rows, stateKey, d, s, isAr }: { rows: RRow[]; stateKey: string; d: Rec; s: Setter; isAr: boolean }) {
  const obj: Record<string, string> = (d[stateKey] as Record<string, string>) || {};
  const cols = isAr
    ? [{ v: 'over', l: 'فرط الاستجابة (يتجنب)' }, { v: 'under', l: 'قلة الاستجابة (يبحث)' }, { v: 'none', l: 'لا توجد صعوبات' }]
    : [{ v: 'over', l: 'Over-responsive (avoids)' }, { v: 'under', l: 'Under-responsive (seeks)' }, { v: 'none', l: 'No difficulty' }];
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-teal-pale">
            <th className="p-2 text-start font-semibold text-ink border border-border/60 min-w-[130px]">{isAr ? 'الحاسة' : 'Sense'}</th>
            {cols.map(c => <th key={c.v} className="p-2 text-center font-semibold text-teal border border-border/60">{c.l}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.key} className="even:bg-linen/30">
              <td className="p-2 border border-border/60">{isAr ? r.ar : r.en}</td>
              {cols.map(c => (
                <td key={c.v} className="p-2 text-center border border-border/60">
                  <input type="radio" name={`${stateKey}_${r.key}`} value={c.v} checked={obj[r.key] === c.v} onChange={() => s(stateKey, { ...obj, [r.key]: c.v })} className="accent-teal w-4 h-4" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Dynamic table (fixed rows) ──────────────────────────────────────────────
type ColDef = { key: string; ar: string; en: string };
function DynTable({ label, note, cols, stateKey, d, s, isAr, numRows = 4 }: { label: string; note?: string; cols: ColDef[]; stateKey: string; d: Rec; s: Setter; isAr: boolean; numRows?: number }) {
  const empty = () => Object.fromEntries(cols.map(c => [c.key, '']));
  const rows: Record<string, string>[] = ((d[stateKey] as Record<string, string>[]) || Array.from({ length: numRows }, empty));
  const pad = rows.length < numRows ? [...rows, ...Array.from({ length: numRows - rows.length }, empty)] : rows;
  return (
    <F label={label} note={note}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-teal-pale">
              {cols.map(c => <th key={c.key} className="p-2 text-start font-semibold text-ink border border-border/60">{isAr ? c.ar : c.en}</th>)}
            </tr>
          </thead>
          <tbody>
            {pad.map((row, i) => (
              <tr key={i} className="even:bg-linen/20">
                {cols.map(c => (
                  <td key={c.key} className="border border-border/60 p-0.5">
                    <input type="text" className="w-full px-2 py-1.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-teal/30 rounded" value={row[c.key] || ''} onChange={e => { const next = [...pad]; next[i] = { ...next[i], [c.key]: e.target.value }; s(stateKey, next); }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </F>
  );
}

// ─── Milestones table ────────────────────────────────────────────────────────
const MILESTONES: RRow[] = [
  { key: 'headControl', ar: 'التحكم في الرأس', en: 'Head control' },
  { key: 'sitting', ar: 'الجلوس دون سند', en: 'Sitting without support' },
  { key: 'crawling', ar: 'الحبو', en: 'Crawling' },
  { key: 'walking', ar: 'المشي باستقلالية', en: 'Walking independently' },
  { key: 'firstWord', ar: 'أول كلمة ذات معنى', en: 'First meaningful word' },
  { key: 'twoWords', ar: 'جملة من كلمتين', en: 'Two-word sentence' },
  { key: 'sentences', ar: 'جمل كاملة', en: 'Full sentences' },
  { key: 'toiletDay', ar: 'التحكم في الحمام (نهاراً)', en: 'Daytime toilet control' },
  { key: 'toiletNight', ar: 'التحكم في الحمام (ليلاً)', en: 'Nighttime toilet control' },
  { key: 'feeding', ar: 'إطعام نفسه بالملعقة', en: 'Self-feeding with spoon' },
  { key: 'dressing', ar: 'ارتداء ملابسه', en: 'Dressing himself/herself' },
];
function MilestonesTable({ d, s, isAr }: { d: Rec; s: Setter; isAr: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-teal-pale">
            <th className="p-2 text-start font-semibold text-ink border border-border/60 min-w-[180px]">{isAr ? 'المهارة' : 'Skill'}</th>
            <th className="p-2 text-center font-semibold text-teal border border-border/60">{isAr ? 'العمر عند الإتقان' : 'Age at Mastery'}</th>
            <th className="p-2 text-center font-semibold text-teal border border-border/60">{isAr ? 'لم يتقنها بعد' : 'Not Yet'}</th>
          </tr>
        </thead>
        <tbody>
          {MILESTONES.map(m => (
            <tr key={m.key} className="even:bg-linen/20">
              <td className="p-2 border border-border/60">{isAr ? m.ar : m.en}</td>
              <td className="p-0.5 border border-border/60">
                <input type="text" className="w-full px-2 py-1.5 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-teal/30 rounded" value={d[`ms_${m.key}`] as string || ''} onChange={e => s(`ms_${m.key}`, e.target.value)} placeholder={isAr ? 'شهر / سنة' : 'months/yrs'} />
              </td>
              <td className="p-2 text-center border border-border/60">
                <input type="checkbox" className="accent-teal w-4 h-4" checked={!!d[`ms_${m.key}_notyet`]} onChange={e => s(`ms_${m.key}_notyet`, e.target.checked)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Challenging behaviors table ─────────────────────────────────────────────
const CB_ROWS = [
  { ar: 'نوبات الغضب', en: 'Tantrums' },
  { ar: 'العدوان تجاه الآخرين', en: 'Aggression toward others' },
  { ar: 'إيذاء الذات (ضرب / عض / ضرب الرأس)', en: 'Self-injury (hitting/biting self, head-banging)' },
  { ar: 'إتلاف الممتلكات', en: 'Property destruction' },
  { ar: 'الهروب / الشريد', en: 'Running off / wandering' },
  { ar: 'الصراخ', en: 'Screaming' },
  { ar: 'رفض التعليمات', en: 'Refusing instructions' },
];
function ChallengeTable({ d, s, isAr }: { d: Rec; s: Setter; isAr: boolean }) {
  const empty = () => ({ behavior: '', frequency: '', duration: '', severity: '' });
  const rows: Record<string, string>[] = (d.challengingBehaviors as Record<string, string>[]) || CB_ROWS.map((r, i) => ({ behavior: isAr ? r.ar : r.en, frequency: '', duration: '', severity: '' }));
  return (
    <F label={isAr ? 'السلوكيات الصعبة (إذا وُجدت، يرجى ملء التفاصيل)' : 'Challenging Behaviors — fill in if present'}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-teal-pale">
              <th className="p-2 text-start font-semibold text-ink border border-border/60 min-w-[160px]">{isAr ? 'السلوك' : 'Behavior'}</th>
              <th className="p-2 text-center font-semibold text-teal border border-border/60">{isAr ? 'كم مرة؟' : 'How often?'}</th>
              <th className="p-2 text-center font-semibold text-teal border border-border/60">{isAr ? 'كم تدوم؟' : 'How long?'}</th>
              <th className="p-2 text-center font-semibold text-teal border border-border/60">{isAr ? 'الشدة ١-٥' : 'Severity 1-5'}</th>
            </tr>
          </thead>
          <tbody>
            {CB_ROWS.map((r, i) => {
              const row = rows[i] || empty();
              return (
                <tr key={i} className="even:bg-linen/20">
                  <td className="p-2 border border-border/60">{isAr ? r.ar : r.en}</td>
                  {(['frequency', 'duration', 'severity'] as const).map(k => (
                    <td key={k} className="p-0.5 border border-border/60">
                      <input type="text" className="w-full px-2 py-1.5 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-teal/30 rounded" value={row[k] || ''} onChange={e => { const next = [...rows]; while (next.length <= i) next.push(empty()); next[i] = { ...next[i], [k]: e.target.value }; s('challengingBehaviors', next); }} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </F>
  );
}

// ─── Academic performance table ──────────────────────────────────────────────
const ACAD_COLS = [
  { v: 'above', ar: 'فوق المتوقع', en: 'Above expected' },
  { v: 'as', ar: 'كما هو متوقع', en: 'As expected' },
  { v: 'below', ar: 'دون المتوقع', en: 'Below expected' },
  { v: 'struggling', ar: 'يعاني بوضوح', en: 'Clearly struggling' },
];
const ACAD_ROWS: RRow[] = [
  { key: 'reading', ar: 'القراءة', en: 'Reading' },
  { key: 'writing', ar: 'الكتابة', en: 'Writing' },
  { key: 'math', ar: 'الرياضيات', en: 'Math' },
  { key: 'routine', ar: 'الالتزام بروتين الفصل', en: 'Following classroom routine' },
  { key: 'peers', ar: 'التعامل مع الأقران', en: 'Peer relationships' },
];
function AcademicTable({ d, s, isAr }: { d: Rec; s: Setter; isAr: boolean }) {
  const obj: Record<string, string> = (d.academicPerformance as Record<string, string>) || {};
  return (
    <F label={isAr ? 'الأداء الدراسي' : 'Academic Performance'}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-teal-pale">
              <th className="p-2 text-start font-semibold text-ink border border-border/60 min-w-[140px]">{isAr ? 'المادة' : 'Subject'}</th>
              {ACAD_COLS.map(c => <th key={c.v} className="p-2 text-center font-semibold text-teal border border-border/60">{isAr ? c.ar : c.en}</th>)}
            </tr>
          </thead>
          <tbody>
            {ACAD_ROWS.map(r => (
              <tr key={r.key} className="even:bg-linen/20">
                <td className="p-2 border border-border/60">{isAr ? r.ar : r.en}</td>
                {ACAD_COLS.map(c => (
                  <td key={c.v} className="p-2 text-center border border-border/60">
                    <input type="radio" name={`acad_${r.key}`} value={c.v} checked={obj[r.key] === c.v} onChange={() => s('academicPerformance', { ...obj, [r.key]: c.v })} className="accent-teal w-4 h-4" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </F>
  );
}

// ─── Type aliases ────────────────────────────────────────────────────────────
type Rec = Record<string, unknown>;
type Setter = (k: string, v: unknown) => void;
type Toggler = (k: string, v: string) => void;

// ─── Section separator ───────────────────────────────────────────────────────
function SectionNote({ text }: { text: string }) {
  return <p className="text-xs text-ink-2/55 bg-teal-pale/60 border border-teal/15 rounded-lg px-3 py-2 leading-relaxed">{text}</p>;
}

// ─── Main form component ─────────────────────────────────────────────────────

const TOTAL = 14;

export function IntakeForm({ locale }: { locale: string }) {
  const isAr = locale === 'ar';

  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Rec>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const s: Setter = useCallback((k, v) => setData(p => ({ ...p, [k]: v })), []);
  const tog: Toggler = useCallback((k, v) => setData(p => {
    const arr = Array.isArray(p[k]) ? [...(p[k] as string[])] : [];
    return { ...p, [k]: arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v] };
  }), []);

  const next = () => setStep(s => Math.min(s + 1, TOTAL - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const submit = async () => {
    setStatus('sending');
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  };

  // ── Section titles ──
  const titles = [
    { ar: 'البيانات الأساسية',           en: '1. Basic Information' },
    { ar: 'بيانات الوالدين والوضع الأسري', en: '2. Parents & Family Status' },
    { ar: 'سبب الزيارة والشكوى الحالية',  en: '3. Reason for Visit' },
    { ar: 'تاريخ الحمل والولادة',          en: '4. Pregnancy & Birth History' },
    { ar: 'مراحل النمو والتطور',           en: '5. Developmental Milestones' },
    { ar: 'التاريخ الطبي',                 en: '6. Medical History' },
    { ar: 'السلوك',                        en: '7. Behavior' },
    { ar: 'التواصل والتفاعل الاجتماعي',   en: '8. Communication & Social Interaction' },
    { ar: 'التعليم',                        en: '9. Education' },
    { ar: 'المتطلبات الحسية',              en: '10. Sensory Profile' },
    { ar: 'التقييمات والتقارير السابقة',   en: '11. Previous Assessments & Reports' },
    { ar: 'الأسرة والبيئة المحيطة',       en: '12. Family & Home Environment' },
    { ar: 'أولويات الأسرة وتوقعاتها',     en: '13. Family Priorities & Expectations' },
    { ar: 'الموافقة والسياسات',           en: '14. Consent, Confidentiality & Policies' },
  ];

  // ── YES / NO / IDK opts ──
  const yesNo: Opt[] = [{ v: 'yes', ar: 'نعم', en: 'Yes' }, { v: 'no', ar: 'لا', en: 'No' }];
  const yesNoIdk: Opt[] = [...yesNo, { v: 'idk', ar: 'لا أعرف', en: "Don't know" }];
  const yesNoPartial: Opt[] = [...yesNo, { v: 'partial', ar: 'جزئياً', en: 'Partially' }];
  const alwaysSometimesNever: Opt[] = [{ v: 'always', ar: 'دائماً', en: 'Always' }, { v: 'sometimes', ar: 'أحياناً', en: 'Sometimes' }, { v: 'never', ar: 'أبداً', en: 'Never' }];

  // ── Section content ──
  const sections: React.ReactNode[] = [

    /* ── Section 1: Basic Info ── */
    <div key="s1" className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <TF k="childFullName" d={data} s={s} isAr={isAr} label={isAr ? 'اسم الطفل رباعياً (كما في شهادة الميلاد)' : "Child's Full Name (four-part, as on birth certificate)"} />
      <DateF k="dob" d={data} s={s} label={isAr ? 'تاريخ الميلاد' : 'Date of Birth'} />
      <TF k="age" d={data} s={s} isAr={isAr} label={isAr ? 'العمر (بالسنوات / الشهور)' : 'Age (years / months)'} placeholder={isAr ? 'مثال: 4 سنوات و3 شهور' : 'e.g. 4 years 3 months'} />
      <RadioF k="sex" d={data} s={s} isAr={isAr} label={isAr ? 'الجنس' : 'Sex'} opts={[{ v: 'male', ar: 'ذكر', en: 'Male' }, { v: 'female', ar: 'أنثى', en: 'Female' }]} />
      <TF k="nationality" d={data} s={s} isAr={isAr} label={isAr ? 'الجنسية' : 'Nationality'} />
      <TF k="nationalId" d={data} s={s} isAr={isAr} label={isAr ? 'الرقم القومي / جواز السفر' : 'National ID / Passport Number'} />
      <TF k="homeLanguages" d={data} s={s} isAr={isAr} label={isAr ? 'اللغة (أو اللغات) المستخدمة في المنزل' : 'Language(s) spoken at home'} />
      <TF k="otherLanguages" d={data} s={s} isAr={isAr} label={isAr ? 'لغات أخرى يتعرض لها الطفل' : 'Other languages the child is exposed to'} />
      <div className="sm:col-span-2">
        <RadioF k="referralSource" d={data} s={s} isAr={isAr} label={isAr ? 'جهة الإحالة' : 'Referral Source'} opts={[
          { v: 'family', ar: 'الأسرة', en: 'Family' },
          { v: 'pediatrician', ar: 'طبيب أطفال', en: 'Pediatrician' },
          { v: 'psychiatrist', ar: 'طبيب نفسي', en: 'Psychiatrist' },
          { v: 'school', ar: 'المدرسة', en: 'School' },
          { v: 'center', ar: 'مركز آخر', en: 'Another center' },
          { v: 'social', ar: 'وسائل التواصل', en: 'Social media' },
          { v: 'personal', ar: 'توصية شخصية', en: 'Personal recommendation' },
        ]} />
      </div>
      <TF k="referringDoctor" d={data} s={s} isAr={isAr} label={isAr ? 'اسم الطبيب أو المختص المحيل (إن وُجد)' : 'Name of referring doctor/specialist (if any)'} />
      <DateF k="formDate" d={data} s={s} label={isAr ? 'تاريخ تعبئة الاستمارة' : 'Date form completed'} />
      <div className="sm:col-span-2">
        <TF k="completedBy" d={data} s={s} isAr={isAr} label={isAr ? 'اسم من قام بالتعبئة' : 'Name of person completing the form'} />
      </div>
    </div>,

    /* ── Section 2: Parents ── */
    <div key="s2" className="flex flex-col gap-6">
      <h3 className="font-heading text-lg text-teal border-b border-teal/20 pb-2">{isAr ? 'الأم / ولي الأمر الأول' : 'Mother / Primary Guardian'}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TF k="motherName" d={data} s={s} isAr={isAr} label={isAr ? 'الاسم بالكامل' : 'Full name'} />
        <TF k="motherAge" d={data} s={s} isAr={isAr} label={isAr ? 'السن' : 'Age'} />
        <TF k="motherOccupation" d={data} s={s} isAr={isAr} label={isAr ? 'المهنة' : 'Occupation'} />
        <TF k="motherEducation" d={data} s={s} isAr={isAr} label={isAr ? 'المؤهل الدراسي' : 'Educational qualification'} />
        <TF k="motherPhone" d={data} s={s} isAr={isAr} label={isAr ? 'رقم الموبايل' : 'Mobile number'} />
        <TF k="motherEmail" d={data} s={s} isAr={isAr} label={isAr ? 'البريد الإلكتروني' : 'Email'} />
      </div>
      <h3 className="font-heading text-lg text-teal border-b border-teal/20 pb-2">{isAr ? 'الأب / ولي الأمر الثاني' : 'Father / Secondary Guardian'}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TF k="fatherName" d={data} s={s} isAr={isAr} label={isAr ? 'الاسم بالكامل' : 'Full name'} />
        <TF k="fatherAge" d={data} s={s} isAr={isAr} label={isAr ? 'السن' : 'Age'} />
        <TF k="fatherOccupation" d={data} s={s} isAr={isAr} label={isAr ? 'المهنة' : 'Occupation'} />
        <TF k="fatherEducation" d={data} s={s} isAr={isAr} label={isAr ? 'المؤهل الدراسي' : 'Educational qualification'} />
        <TF k="fatherPhone" d={data} s={s} isAr={isAr} label={isAr ? 'رقم الموبايل' : 'Mobile number'} />
        <TF k="fatherEmail" d={data} s={s} isAr={isAr} label={isAr ? 'البريد الإلكتروني' : 'Email'} />
      </div>
      <h3 className="font-heading text-lg text-teal border-b border-teal/20 pb-2">{isAr ? 'الوضع الأسري والقانوني' : 'Family & Legal Status'}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <RadioF k="maritalStatus" d={data} s={s} isAr={isAr} label={isAr ? 'الحالة الاجتماعية للوالدين' : "Parents' marital status"} opts={[
          { v: 'married', ar: 'متزوجان', en: 'Married' }, { v: 'separated', ar: 'منفصلان', en: 'Separated' },
          { v: 'divorced', ar: 'مطلقان', en: 'Divorced' }, { v: 'widowed', ar: 'تُرمل', en: 'Widowed' }, { v: 'other', ar: 'أخرى', en: 'Other' },
        ]} />
        <TF k="legalCustody" d={data} s={s} isAr={isAr} label={isAr ? 'من له حق الحضانة القانونية للطفل؟' : 'Who has legal custody of the child?'} />
        <TF k="consentAuthority" d={data} s={s} isAr={isAr} label={isAr ? 'من المخوّل بالموافقة على التقييم والعلاج؟' : 'Who is authorized to consent to assessment and treatment?'} />
        <TF k="childLivesWith" d={data} s={s} isAr={isAr} label={isAr ? 'مع من يعيش الطفل؟' : 'Who does the child live with?'} />
        <TF k="primaryCaregiver" d={data} s={s} isAr={isAr} label={isAr ? 'من يقدم الرعاية الأساسية للطفل خلال اليوم؟' : "Who is the child's primary daytime caregiver?"} />
        <TF k="caregiverNote" d={data} s={s} isAr={isAr} label={isAr ? 'هل يرعى الطفل مربية / قريب / سائق؟ يرجى التوضيح' : 'Is the child cared for by a nanny/relative/driver? Please explain'} />
        <RadioF k="preferredContact" d={data} s={s} isAr={isAr} label={isAr ? 'وسيلة التواصل المفضلة' : 'Preferred contact method'} opts={[
          { v: 'phone', ar: 'اتصال هاتفي', en: 'Phone call' }, { v: 'whatsapp', ar: 'واتساب', en: 'WhatsApp' }, { v: 'email', ar: 'بريد إلكتروني', en: 'Email' },
        ]} />
        <RadioF k="preferredReportLang" d={data} s={s} isAr={isAr} label={isAr ? 'لغة التقارير المفضلة' : 'Preferred report language'} opts={[
          { v: 'ar', ar: 'العربية', en: 'Arabic' }, { v: 'en', ar: 'الإنجليزية', en: 'English' }, { v: 'both', ar: 'كلتاهما', en: 'Both' },
        ]} />
      </div>
      <h3 className="font-heading text-base text-ink/70 border-b border-border pb-2">{isAr ? 'جهة اتصال للطوارئ (بخلاف ما سبق)' : 'Emergency Contact (other than above)'}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <TF k="emergencyName" d={data} s={s} isAr={isAr} label={isAr ? 'الاسم' : 'Name'} />
        <TF k="emergencyRelation" d={data} s={s} isAr={isAr} label={isAr ? 'صلة القرابة' : 'Relationship'} />
        <TF k="emergencyPhone" d={data} s={s} isAr={isAr} label={isAr ? 'رقم الموبايل' : 'Mobile number'} />
      </div>
    </div>,

    /* ── Section 3: Reason for Visit ── */
    <div key="s3" className="flex flex-col gap-5">
      <TAF k="mainConcern" d={data} s={s} isAr={isAr} rows={4} label={isAr ? 'بكلماتكم أنتم، ما الذي دفعكم للحضور إلينا اليوم؟' : 'In your own words, what brought you to us today?'} />
      <TF k="whenNoticed" d={data} s={s} isAr={isAr} label={isAr ? 'متى لاحظتم هذه المشكلة لأول مرة؟ (عمر الطفل حينها)' : 'When did you first notice this issue? (child\'s age at the time)'} />
      <TAF k="whyNow" d={data} s={s} isAr={isAr} rows={3} label={isAr ? 'ما الذي جعلكم تقررون طلب المساعدة الآن تحديداً؟' : 'What made you decide to seek help specifically now?'} />
      <TAF k="mainGoal" d={data} s={s} isAr={isAr} rows={3} label={isAr ? 'ما أهم هدف تتمنونه لطفلكم؟' : 'What is the most important goal you hope for your child?'} />
      <TAF k="previousAttempts" d={data} s={s} isAr={isAr} rows={3} label={isAr ? 'ما الذي جربتموه من قبل؟ ما الذي نجح، وما الذي لم ينجح؟' : 'What have you tried before? What worked, and what didn\'t?'} />
      <TAF k="currentSpecialists" d={data} s={s} isAr={isAr} rows={2} label={isAr ? 'هل يتابع الطفل حالياً مع أي متخصص آخر؟ (تخاطب / وظيفي / طبيعي / طب نفسي / مخ وأعصاب)' : 'Is the child currently seeing any other specialist? (Speech / OT / Physiotherapy / Psychiatry / Neurology)'} />
      <TF k="specialistContact" d={data} s={s} isAr={isAr} label={isAr ? 'اسم المختص وبيانات التواصل معه' : 'Specialist\'s name and contact information'} />
      <SectionNote text={isAr ? 'يرجى تقييم كل مجال من ١ (لا قلق على الإطلاق) إلى ٥ (قلق شديد). ضع علامة في خانة واحدة فقط لكل سطر.' : 'Please rate each area from 1 (no concern at all) to 5 (severe concern). Mark one box per row.'} />
      <RatingTable label={isAr ? 'مجالات القلق' : 'Areas of Concern'} rows={[
        { key: 'communication', ar: 'التواصل والنطق', en: 'Communication & Speech' },
        { key: 'social', ar: 'التفاعل الاجتماعي', en: 'Social Interaction' },
        { key: 'behavior', ar: 'السلوك', en: 'Behavior' },
        { key: 'selfReliance', ar: 'الاعتماد على النفس', en: 'Self-Reliance / Independence' },
        { key: 'academic', ar: 'التحصيل الدراسي', en: 'Academic Achievement' },
        { key: 'motor', ar: 'المهارات الحركية', en: 'Motor Skills' },
        { key: 'sensory', ar: 'الاستجابات الحسية', en: 'Sensory Responses' },
        { key: 'food', ar: 'الطعام والتغذية', en: 'Food & Nutrition' },
        { key: 'sleep', ar: 'النوم', en: 'Sleep' },
        { key: 'toilet', ar: 'التدريب على الحمام', en: 'Toilet Training' },
        { key: 'attention', ar: 'الانتباه والتركيز', en: 'Attention & Focus' },
        { key: 'emotional', ar: 'التنظيم الانفعالي', en: 'Emotional Regulation' },
      ]} stateKey="concernRatings" d={data} s={s} isAr={isAr} />
      <TF k="mostUrgentConcern" d={data} s={s} isAr={isAr} label={isAr ? 'أي المجالات السابقة هو الأكثر إلحاحاً بالنسبة لكم؟' : 'Which of the above areas is most urgent for you?'} />
    </div>,

    /* ── Section 4: Pregnancy & Birth ── */
    <div key="s4" className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <TF k="motherAgeAtPregnancy" d={data} s={s} isAr={isAr} label={isAr ? 'عمر الأم وقت هذا الحمل' : "Mother's age during this pregnancy"} />
      <RadioF k="plannedPregnancy" d={data} s={s} isAr={isAr} label={isAr ? 'هل كان الحمل مخططاً له؟' : 'Was the pregnancy planned?'} opts={yesNo} />
      <div className="sm:col-span-2">
        <RadioF k="pregnancyComplications" d={data} s={s} isAr={isAr} label={isAr ? 'هل حدثت أي مضاعفات أثناء الحمل؟' : 'Were there any complications during pregnancy?'} opts={yesNo} />
      </div>
      <div className="sm:col-span-2">
        <CheckF k="complicationList" d={data} tog={tog} isAr={isAr} label={isAr ? 'أنواع المضاعفات (اختر كل ما ينطبق)' : 'Complication types (select all that apply)'} opts={[
          { v: 'bleeding', ar: 'نزيف', en: 'Bleeding' },
          { v: 'bp', ar: 'ارتفاع ضغط الدم / تسمم الحمل', en: 'High BP / Pre-eclampsia' },
          { v: 'diabetes', ar: 'سكري الحمل', en: 'Gestational diabetes' },
          { v: 'infection', ar: 'عدوى أو حرارة', en: 'Infection or fever' },
          { v: 'threatened', ar: 'تهديد بالإجهاض', en: 'Threatened miscarriage' },
          { v: 'stress', ar: 'ضغط نفسي شديد أو صدمة', en: 'Severe stress or trauma' },
          { v: 'accident', ar: 'حادث أو سقوط', en: 'Accident or fall' },
        ]} />
      </div>
      <div className="sm:col-span-2">
        <TAF k="complicationDetails" d={data} s={s} isAr={isAr} rows={2} label={isAr ? 'تفاصيل المضاعفات (إن وُجدت)' : 'Complication details (if applicable)'} />
      </div>
      <div className="sm:col-span-2">
        <TAF k="medications" d={data} s={s} isAr={isAr} rows={2} label={isAr ? 'أي أدوية أو مكملات أو تدخين أو كحول أو مواد أخرى خلال الحمل' : 'Any medications, supplements, smoking, alcohol, or other substances during pregnancy'} />
      </div>
      <TF k="gestationalAge" d={data} s={s} isAr={isAr} label={isAr ? 'عمر الحمل عند الولادة (بالأسابيع)' : 'Gestational age at birth (weeks)'} />
      <RadioF k="deliveryType" d={data} s={s} isAr={isAr} label={isAr ? 'نوع الولادة' : 'Type of delivery'} opts={[
        { v: 'vaginal', ar: 'طبيعية', en: 'Vaginal' },
        { v: 'assisted', ar: 'بمساعدة (شفط / جفت)', en: 'Assisted (vacuum/forceps)' },
        { v: 'planned-cs', ar: 'قيصرية مخططة', en: 'Planned C-section' },
        { v: 'emergency-cs', ar: 'قيصرية طارئة', en: 'Emergency C-section' },
      ]} />
      <TF k="csectionReason" d={data} s={s} isAr={isAr} label={isAr ? 'سبب الولادة القيصرية (إن وُجد)' : 'Reason for C-section, if applicable'} />
      <TF k="birthWeight" d={data} s={s} isAr={isAr} label={isAr ? 'وزن الطفل عند الميلاد' : 'Birth weight'} />
      <TF k="apgarScore" d={data} s={s} isAr={isAr} label={isAr ? 'درجة أبجار (إن عُرفت)' : 'Apgar score (if known)'} />
      <RadioF k="babyCried" d={data} s={s} isAr={isAr} label={isAr ? 'هل بكى الطفل مباشرة بعد الولادة؟' : 'Did the baby cry immediately after birth?'} opts={yesNoIdk} />
      <RadioF k="nicu" d={data} s={s} isAr={isAr} label={isAr ? 'هل دخل الطفل الحضانة الطبية / العناية المركزة؟' : 'Did the baby go to the incubator/NICU?'} opts={yesNoIdk} />
      <div className="sm:col-span-2">
        <TF k="nicuDetails" d={data} s={s} isAr={isAr} label={isAr ? 'إذا نعم: كم يوماً؟ ولماذا؟' : 'If yes: for how many days and why?'} />
      </div>
      <div className="sm:col-span-2">
        <CheckF k="firstMonthIssues" d={data} tog={tog} isAr={isAr} label={isAr ? 'خلال الشهر الأول، هل عانى الطفل من أي مما يلي؟' : 'During the first month, did the baby experience any of the following?'} opts={[
          { v: 'jaundice', ar: 'صفراء استدعت العلاج', en: 'Jaundice requiring treatment' },
          { v: 'seizures', ar: 'تشنجات', en: 'Seizures' },
          { v: 'breathing', ar: 'صعوبة في التنفس', en: 'Breathing difficulty' },
          { v: 'feeding', ar: 'صعوبة في الرضاعة', en: 'Feeding difficulty' },
          { v: 'sleepy', ar: 'نوم مفرط', en: 'Excessive sleepiness' },
          { v: 'none', ar: 'لا شيء', en: 'None' },
        ]} />
      </div>
      <div className="sm:col-span-2">
        <TAF k="pregnancyNotes" d={data} s={s} isAr={isAr} rows={3} label={isAr ? 'أي شيء آخر عن الحمل أو الولادة أو الشهور الأولى ترون أنه مهم' : 'Anything else about the pregnancy, birth, or first months you feel is important'} />
      </div>
    </div>,

    /* ── Section 5: Milestones ── */
    <div key="s5" className="flex flex-col gap-5">
      <SectionNote text={isAr ? 'يرجى كتابة العمر (بالشهر أو السنة) الذي أتقن فيه طفلكم كل مهارة. إذا لم تكونوا متأكدين، اكتبوا "تقريباً" أو "لا أعرف".' : 'Please write the age (months or years) your child mastered each skill. If unsure, write "approximately" or "don\'t know."'} />
      <MilestonesTable d={data} s={s} isAr={isAr} />
      <RadioF k="skillRegression" d={data} s={s} isAr={isAr} label={isAr ? 'هل فقد طفلكم في أي وقت مهارة كان يتقنها من قبل؟ (مثلاً: كف عن الكلام، كف عن الاستجابة لاسمه)' : 'Has your child ever lost a skill they had previously mastered? (e.g., stopped saying words, stopped responding to name)'} opts={[{ v: 'yes', ar: 'نعم', en: 'Yes' }, { v: 'no', ar: 'لا', en: 'No' }, { v: 'unsure', ar: 'لست متأكداً', en: 'Not sure' }]} />
      <TAF k="skillRegressionDetails" d={data} s={s} isAr={isAr} rows={3} label={isAr ? 'إذا نعم: ما المهارة (أو المهارات)، في أي عمر، وعلى مدى أي فترة زمنية؟' : 'If yes: which skill(s), at what age, and over what period of time?'} />
      <TAF k="regressionContext" d={data} s={s} isAr={isAr} rows={2} label={isAr ? 'هل حدث مرض أو إصابة أو حدث كبير في تلك الفترة؟' : 'Did any illness, injury, or major event occur during that period?'} />
    </div>,

    /* ── Section 6: Medical History ── */
    <div key="s6" className="flex flex-col gap-5">
      <DynTable label={isAr ? 'التشخيصات الحالية' : 'Current Diagnoses'} cols={[
        { key: 'diagnosis', ar: 'التشخيص', en: 'Diagnosis' },
        { key: 'date', ar: 'التاريخ', en: 'Date' },
        { key: 'physician', ar: 'الجهة أو الطبيب المشخِّص', en: 'Diagnosing Physician or Institution' },
      ]} stateKey="currentDiagnoses" d={data} s={s} isAr={isAr} numRows={4} />
      <CheckF k="medicalEvents" d={data} tog={tog} isAr={isAr} label={isAr ? 'الأحداث الطبية (اختر كل ما ينطبق)' : 'Medical Events (select all that apply)'} opts={[
        { v: 'hospitalization', ar: 'دخول المستشفى', en: 'Hospitalization' },
        { v: 'surgery', ar: 'عمليات جراحية', en: 'Surgeries' },
        { v: 'headinjury', ar: 'إصابة بالرأس / فقدان وعي', en: 'Head injury / loss of consciousness' },
        { v: 'seizures', ar: 'تشنجات أو نوبات', en: 'Seizures or convulsions' },
        { v: 'febrile', ar: 'تشنجات حرارية', en: 'Febrile seizures' },
        { v: 'meningitis', ar: 'التهاب سحائي / التهاب دماغ', en: 'Meningitis / encephalitis' },
        { v: 'earinfections', ar: 'التهابات أذن متكررة', en: 'Recurrent ear infections' },
        { v: 'chronic', ar: 'مرض مزمن', en: 'Chronic illness' },
        { v: 'none', ar: 'لا شيء مما سبق', en: 'None of the above' },
      ]} />
      <TAF k="medicalEventDetails" d={data} s={s} isAr={isAr} rows={2} label={isAr ? 'يرجى ذكر التفاصيل والتواريخ لأي بند تم اختياره أعلاه' : 'Please provide details and dates for any item selected above'} />
      <DynTable label={isAr ? 'الأدوية الحالية' : 'Current Medications'} cols={[
        { key: 'medication', ar: 'الدواء', en: 'Medication' },
        { key: 'dosage', ar: 'الجرعة', en: 'Dosage' },
        { key: 'prescribedBy', ar: 'من وصفه', en: 'Prescribed by' },
        { key: 'since', ar: 'منذ متى', en: 'Since when' },
      ]} stateKey="currentMedications" d={data} s={s} isAr={isAr} numRows={4} />
      <TF k="allergies" d={data} s={s} isAr={isAr} label={isAr ? 'الحساسية (طعام، أدوية، بيئية)' : 'Allergies (food, medication, environmental)'} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <RadioF k="hearingTest" d={data} s={s} isAr={isAr} label={isAr ? 'هل أجرى طفلكم اختبار سمع رسمياً؟' : 'Has your child had a formal hearing test?'} opts={yesNoIdk} />
        <TF k="hearingTestResult" d={data} s={s} isAr={isAr} label={isAr ? 'التاريخ والنتيجة' : 'Date and result'} />
        <RadioF k="visionTest" d={data} s={s} isAr={isAr} label={isAr ? 'هل أجرى طفلكم اختبار نظر رسمياً؟' : 'Has your child had a formal vision test?'} opts={yesNoIdk} />
        <TF k="visionTestResult" d={data} s={s} isAr={isAr} label={isAr ? 'التاريخ والنتيجة' : 'Date and result'} />
      </div>
      <SectionNote text={isAr ? 'نسأل عن ذلك لأن مشكلات السمع والبصر قد تبدو شبيهة جداً بالصعوبات النمائية أو السلوكية. قد نطلب إجراءهما قبل بدء التقييم.' : 'We ask because hearing and vision problems can closely resemble developmental or behavioral difficulties. We may ask you to complete these tests before starting the assessment.'} />
      <RadioF k="vaccinations" d={data} s={s} isAr={isAr} label={isAr ? 'هل تطعيمات الطفل منتظمة؟' : "Are the child's vaccinations up to date?"} opts={yesNoPartial} />
      <h3 className="font-heading text-base text-ink/70 border-b border-border pb-2">{isAr ? 'التاريخ العائلي' : 'Family History'}</h3>
      <SectionNote text={isAr ? 'يرجى وضع علامة إذا كان أي قريب بالدم (والد، أخ، جد، عم/خال، ابن عم/خال) يعاني من أي مما يلي:' : 'Please check if any blood relative (parent, sibling, grandparent, aunt/uncle, cousin) has any of the following:'} />
      <CheckF k="familyHistory" d={data} tog={tog} isAr={isAr} label={isAr ? 'التاريخ العائلي' : 'Family History'} opts={[
        { v: 'autism', ar: 'توحد', en: 'Autism' },
        { v: 'adhd', ar: 'فرط حركة وتشتت انتباه', en: 'ADHD' },
        { v: 'intellectual', ar: 'إعاقة ذهنية', en: 'Intellectual disability' },
        { v: 'learning', ar: 'صعوبات تعلم / عسر قراءة', en: 'Learning difficulties / dyslexia' },
        { v: 'langdelay', ar: 'تأخر لغوي', en: 'Language delay' },
        { v: 'epilepsy', ar: 'صرع', en: 'Epilepsy' },
        { v: 'depression', ar: 'اكتئاب', en: 'Depression' },
        { v: 'anxiety', ar: 'قلق', en: 'Anxiety' },
        { v: 'bipolar', ar: 'اضطراب وجداني ثنائي القطب', en: 'Bipolar disorder' },
        { v: 'schizophrenia', ar: 'فصام', en: 'Schizophrenia' },
        { v: 'addiction', ar: 'إدمان', en: 'Addiction' },
        { v: 'genetic', ar: 'اضطراب جيني أو كروموسومي', en: 'Genetic or chromosomal disorder' },
        { v: 'sensory', ar: 'إعاقة سمعية أو بصرية', en: 'Hearing or visual impairment' },
        { v: 'none', ar: 'لا يوجد', en: 'None' },
      ]} />
      <TF k="familyHistoryRelation" d={data} s={s} isAr={isAr} label={isAr ? 'يرجى تحديد صلة القرابة' : 'Please specify the relationship'} />
      <RadioF k="consanguineousMarriage" d={data} s={s} isAr={isAr} label={isAr ? 'هل بين الوالدين صلة قرابة (زواج أقارب)؟' : 'Are the parents blood-related (consanguineous marriage)?'} opts={yesNo} />
      <TF k="consanguineousDetails" d={data} s={s} isAr={isAr} label={isAr ? 'إذا نعم، درجة القرابة' : 'If yes, degree of relation'} />
    </div>,

    /* ── Section 7: Behavior ── */
    <div key="s7" className="flex flex-col gap-5">
      <h3 className="font-heading text-base text-teal border-b border-teal/20 pb-2">{isAr ? 'النوم' : 'Sleep'}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <TF k="sleepBedtime" d={data} s={s} isAr={isAr} label={isAr ? 'موعد النوم المعتاد' : 'Usual bedtime'} placeholder="e.g. 9:00 PM" />
        <TF k="sleepWakeTime" d={data} s={s} isAr={isAr} label={isAr ? 'موعد الاستيقاظ' : 'Wake time'} placeholder="e.g. 7:00 AM" />
        <TF k="sleepHours" d={data} s={s} isAr={isAr} label={isAr ? 'إجمالي ساعات النوم' : 'Total hours of sleep'} />
      </div>
      <CheckF k="sleepIssues" d={data} tog={tog} isAr={isAr} label={isAr ? 'مشكلات النوم (اختر كل ما ينطبق)' : 'Sleep issues (select all that apply)'} opts={[
        { v: 'fallasleep', ar: 'صعوبة في الخلود للنوم', en: 'Difficulty falling asleep' },
        { v: 'waking', ar: 'استيقاظ متكرر ليلاً', en: 'Frequent night waking' },
        { v: 'parentbed', ar: 'ينام في سرير الوالدين', en: "Sleeps in parents' bed" },
        { v: 'nightmares', ar: 'كوابيس / رعب ليلي', en: 'Nightmares / night terrors' },
        { v: 'none', ar: 'لا توجد صعوبات', en: 'No difficulties' },
      ]} />
      <h3 className="font-heading text-base text-teal border-b border-teal/20 pb-2">{isAr ? 'الطعام' : 'Food / Eating'}</h3>
      <CheckF k="eatingHabits" d={data} tog={tog} isAr={isAr} label={isAr ? 'عادات الأكل (اختر كل ما ينطبق)' : 'Eating habits (select all that apply)'} opts={[
        { v: 'varied', ar: 'يتناول أطعمة متنوعة', en: 'Eats a varied diet' },
        { v: 'limited', ar: 'نطاق محدود جداً', en: 'Very limited range' },
        { v: 'textures', ar: 'يرفض قوامات معينة', en: 'Refuses certain textures' },
        { v: 'colors', ar: 'يرفض ألواناً معينة', en: 'Refuses certain colors' },
        { v: 'nonfood', ar: 'يأكل مواد غير غذائية (ورق، تراب، شعر)', en: 'Eats non-food items (paper, dirt, hair)' },
        { v: 'overeats', ar: 'يفرط في الأكل', en: 'Overeats' },
        { v: 'needsfed', ar: 'يحتاج لمن يطعمه', en: 'Needs to be fed' },
        { v: 'bottle', ar: 'يستخدم الرضاعة', en: 'Uses a bottle' },
      ]} />
      <TF k="foodCount" d={data} s={s} isAr={isAr} label={isAr ? 'كم عدد الأطعمة المختلفة التي يقبلها طفلكم تقريباً؟' : 'Approximately how many different foods does your child accept?'} />
      <h3 className="font-heading text-base text-teal border-b border-teal/20 pb-2">{isAr ? 'التدريب على الحمام' : 'Toilet Training'}</h3>
      <RadioF k="toiletTraining" d={data} s={s} isAr={isAr} label={isAr ? 'وضع التدريب على الحمام' : 'Toilet training status'} opts={[
        { v: 'independent', ar: 'مستقل تماماً', en: 'Fully independent' },
        { v: 'dayonly', ar: 'مستقل نهاراً فقط', en: 'Independent during the day only' },
        { v: 'diapers', ar: 'يستخدم الحفاضات', en: 'Uses diapers' },
        { v: 'resists', ar: 'يقاوم الحمام', en: 'Resists the toilet' },
        { v: 'constipation', ar: 'إمساك / احتباس', en: 'Constipation / withholding' },
      ]} />
      <h3 className="font-heading text-base text-teal border-b border-teal/20 pb-2">{isAr ? 'السلوكيات الصعبة' : 'Challenging Behaviors'}</h3>
      <ChallengeTable d={data} s={s} isAr={isAr} />
      <TAF k="wantsMotivator" d={data} s={s} isAr={isAr} rows={3} label={isAr ? 'ماذا يفعل طفلكم عندما يريد شيئاً لا يستطيع الحصول عليه؟' : 'What does your child do when they want something they can\'t have?'} />
      <TAF k="behaviorBefore" d={data} s={s} isAr={isAr} rows={2} label={isAr ? 'ما الذي يحدث عادةً قبل السلوك الصعب مباشرة؟' : 'What typically happens right before the challenging behavior?'} />
      <TAF k="behaviorAfter" d={data} s={s} isAr={isAr} rows={2} label={isAr ? 'ماذا تفعلون أنتم أو غيركم عادةً بعد السلوك مباشرة؟' : 'What do you or others typically do right after the behavior?'} />
      <RadioF k="safetyConcerns" d={data} s={s} isAr={isAr} label={isAr ? 'هل توجد مخاوف مباشرة على سلامة الطفل أو الآخرين؟' : 'Are there any immediate safety concerns for the child or others?'} opts={yesNo} />
      <TAF k="safetyDetails" d={data} s={s} isAr={isAr} rows={2} label={isAr ? 'إذا نعم، يرجى التوضيح' : 'If yes, please explain'} />
    </div>,

    /* ── Section 8: Communication & Social ── */
    <div key="s8" className="flex flex-col gap-5">
      <CheckF k="communicationMethods" d={data} tog={tog} isAr={isAr} label={isAr ? 'كيف يتواصل طفلكم؟ (اختر كل ما ينطبق)' : 'How does your child communicate? (select all that apply)'} opts={[
        { v: 'spoken', ar: 'كلمات / جمل منطوقة', en: 'Spoken words/sentences' },
        { v: 'singlewords', ar: 'كلمات فردية', en: 'Single words' },
        { v: 'sounds', ar: 'أصوات فقط', en: 'Sounds only' },
        { v: 'gestures', ar: 'إيماءات / إشارة', en: 'Gestures/pointing' },
        { v: 'pulls', ar: 'يسحب يد الكبير', en: "Pulls an adult's hand" },
        { v: 'pecs', ar: 'بطاقات PECS', en: 'PECS cards' },
        { v: 'aac', ar: 'جهاز أو تطبيق تواصل بديل', en: 'AAC device or app' },
        { v: 'sign', ar: 'لغة إشارة', en: 'Sign language' },
        { v: 'none', ar: 'لا يتواصل بشكل مقصود', en: 'Does not communicate intentionally' },
      ]} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TF k="wordCount" d={data} s={s} isAr={isAr} label={isAr ? 'كم عدد الكلمات التي يستخدمها طفلكم تقريباً؟ (أفضل تقدير)' : 'Approximately how many words does your child use? (best estimate)'} />
        <TF k="longestSentence" d={data} s={s} isAr={isAr} label={isAr ? 'أطول جملة نطق بها طفلكم' : 'The longest sentence your child has spoken'} />
      </div>
      <h3 className="font-heading text-base text-teal border-b border-teal/20 pb-2">{isAr ? 'الفهم' : 'Comprehension'}</h3>
      <RadioF k="followsOneStep" d={data} s={s} isAr={isAr} label={isAr ? 'ينفذ تعليمة من خطوة واحدة (مثل: «أعطني الكرة»)' : 'Follows a one-step instruction ("give me the ball")'} opts={alwaysSometimesNever} />
      <RadioF k="followsTwoStep" d={data} s={s} isAr={isAr} label={isAr ? 'ينفذ تعليمة من خطوتين (مثل: «خذ حذاءك وضعه عند الباب»)' : 'Follows a two-step instruction ("take your shoes and put them by the door")'} opts={alwaysSometimesNever} />
      <RadioF k="respondsToName" d={data} s={s} isAr={isAr} label={isAr ? 'يستجيب عند مناداته باسمه' : 'Responds when called by name'} opts={alwaysSometimesNever} />
      <h3 className="font-heading text-base text-teal border-b border-teal/20 pb-2">{isAr ? 'التفاعل الاجتماعي واللعب' : 'Social Interaction & Play'}</h3>
      <RadioF k="eyeContact" d={data} s={s} isAr={isAr} label={isAr ? 'التواصل البصري' : 'Eye contact'} opts={[{ v: 'consistent', ar: 'ثابت', en: 'Consistent' }, { v: 'fleeting', ar: 'لحظي', en: 'Fleeting' }, { v: 'rare', ar: 'نادر', en: 'Rare' }, { v: 'absent', ar: 'معدوم', en: 'Absent' }]} />
      <RadioF k="points" d={data} s={s} isAr={isAr} label={isAr ? 'يشير إلى الأشياء ليريكم إياها (لا ليطلبها)' : 'Points to things to show you (not to request)'} opts={yesNo} />
      <RadioF k="bringsThing" d={data} s={s} isAr={isAr} label={isAr ? 'يحضر أشياء ليشارككم الاهتمام بها' : 'Brings you things to share interest'} opts={yesNo} />
      <RadioF k="looksWhere" d={data} s={s} isAr={isAr} label={isAr ? 'ينظر إلى حيث تشيرون' : 'Looks where you point'} opts={yesNo} />
      <RadioF k="playsWithChildren" d={data} s={s} isAr={isAr} label={isAr ? 'يلعب مع الأطفال الآخرين' : 'Plays with other children'} opts={[
        { v: 'cooperative', ar: 'نعم، بشكل تعاوني', en: 'Yes, cooperatively' },
        { v: 'parallel', ar: 'يلعب بجوارهم (لعب موازٍ)', en: 'Plays alongside them (parallel play)' },
        { v: 'watches', ar: 'يراقب فقط', en: 'Only watches' },
        { v: 'avoids', ar: 'يتجنبهم', en: 'Avoids them' },
      ]} />
      <RadioF k="pretendPlay" d={data} s={s} isAr={isAr} label={isAr ? 'اللعب الخيالي (مثل: إطعام دمية، اعتبار مكعب سيارة)' : 'Pretend play (feeding a doll, treating a block as a car)'} opts={[{ v: 'yes', ar: 'نعم', en: 'Yes' }, { v: 'limited', ar: 'محدود', en: 'Limited' }, { v: 'no', ar: 'لا', en: 'No' }]} />
      <RadioF k="showsAffection" d={data} s={s} isAr={isAr} label={isAr ? 'يُظهر المودة لأفراد الأسرة' : 'Shows affection to family members'} opts={[{ v: 'yes', ar: 'نعم', en: 'Yes' }, { v: 'limited', ar: 'محدود', en: 'Limited' }, { v: 'no', ar: 'لا', en: 'No' }]} />
      <h3 className="font-heading text-base text-teal border-b border-teal/20 pb-2">{isAr ? 'السلوكيات النمطية والاهتمامات' : 'Repetitive Behaviors & Interests'}</h3>
      <CheckF k="repetitiveBehaviors" d={data} tog={tog} isAr={isAr} label={isAr ? 'اختر كل ما ينطبق' : 'Select all that apply'} opts={[
        { v: 'flapping', ar: 'رفرفة اليدين', en: 'Hand flapping' },
        { v: 'rocking', ar: 'التأرجح', en: 'Rocking' },
        { v: 'spinning', ar: 'الدوران', en: 'Spinning' },
        { v: 'tiptoe', ar: 'المشي على أطراف الأصابع', en: 'Toe-walking' },
        { v: 'lining', ar: 'صف الأشياء', en: 'Lining up objects' },
        { v: 'wheels', ar: 'تدوير العجلات', en: 'Spinning wheels/objects' },
        { v: 'echolalia', ar: 'تكرار الكلمات أو العبارات (المصاداة)', en: 'Repeating words or phrases (echolalia)' },
        { v: 'narrowinterests', ar: 'التعلق الشديد بموضوع محدد', en: 'Intense, narrow interests' },
        { v: 'routine', ar: 'الإصرار على الروتين والثبات', en: 'Insistence on routine and sameness' },
        { v: 'changesdistress', ar: 'الانزعاج الشديد من التغيرات البسيطة', en: 'Severe distress at minor changes' },
        { v: 'rituals', ar: 'طقوس جامدة', en: 'Rigid rituals' },
        { v: 'none', ar: 'لا شيء مما سبق', en: 'None of the above' },
      ]} />
      <TAF k="favoriteTopic" d={data} s={s} isAr={isAr} rows={3} label={isAr ? 'يرجى وصف النشاط أو الاهتمام المفضل لدى طفلكم' : "Please describe your child's favorite activity or interest"} />
    </div>,

    /* ── Section 9: Education ── */
    <div key="s9" className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TF k="schoolName" d={data} s={s} isAr={isAr} label={isAr ? 'اسم المدرسة / الحضانة الحالية' : 'Current school/nursery name'} />
        <RadioF k="schoolType" d={data} s={s} isAr={isAr} label={isAr ? 'النوع' : 'Type'} opts={[
          { v: 'public', ar: 'حكومية', en: 'Public' },
          { v: 'private', ar: 'خاصة / دولية', en: 'Private/International' },
          { v: 'inclusion', ar: 'دمج', en: 'Inclusion' },
          { v: 'special', ar: 'مدرسة تربية خاصة', en: 'Special education school' },
          { v: 'home', ar: 'تعليم منزلي', en: 'Homeschooling' },
          { v: 'none', ar: 'غير ملتحق', en: 'Not enrolled' },
        ]} />
        <TF k="gradeClass" d={data} s={s} isAr={isAr} label={isAr ? 'الصف / الفصل' : 'Grade/Class'} />
        <TF k="hoursPerDay" d={data} s={s} isAr={isAr} label={isAr ? 'عدد الساعات يومياً' : 'Hours per day'} />
        <TF k="instructionLanguage" d={data} s={s} isAr={isAr} label={isAr ? 'لغة الدراسة' : 'Language of instruction'} />
        <RadioF k="shadowTeacher" d={data} s={s} isAr={isAr} label={isAr ? 'هل يوجد مدرس ظل؟' : 'Is there a shadow teacher?'} opts={yesNo} />
        <TF k="shadowHours" d={data} s={s} isAr={isAr} label={isAr ? 'عدد الساعات أسبوعياً (إن وُجد)' : 'Hours per week (if yes)'} />
        <RadioF k="iep" d={data} s={s} isAr={isAr} label={isAr ? 'هل لدى الطفل خطة تعليمية فردية (IEP) أو تيسيرات رسمية؟' : 'Does the child have an IEP or formal accommodations?'} opts={yesNoIdk} />
      </div>
      <SectionNote text={isAr ? 'إذا نعم، يرجى إحضار نسخة من الخطة التعليمية الفردية إلى الجلسة الاستشارية.' : 'If yes, please bring a copy of the IEP to the consultation session.'} />
      <AcademicTable d={data} s={s} isAr={isAr} />
      <TAF k="schoolConcerns" d={data} s={s} isAr={isAr} rows={3} label={isAr ? 'ما المخاوف التي أثارتها المدرسة أو المعلمة معكم؟' : 'What concerns has the school or teacher raised with you?'} />
      <TF k="schoolChanges" d={data} s={s} isAr={isAr} label={isAr ? 'هل غير الطفل مدرسته من قبل؟ إذا نعم، لماذا؟' : 'Has the child changed schools before? If yes, why?'} />
      <RadioF k="expelledOrRefused" d={data} s={s} isAr={isAr} label={isAr ? 'هل سبق أن طُلب من الطفل مغادرة مدرسة أو رُفض قبوله فيها؟' : 'Has the child ever been asked to leave a school or been refused admission?'} opts={yesNo} />
      <TAF k="expelledDetails" d={data} s={s} isAr={isAr} rows={2} label={isAr ? 'إذا نعم، يرجى التوضيح' : 'If yes, please explain'} />
    </div>,

    /* ── Section 10: Sensory Profile ── */
    <div key="s10" className="flex flex-col gap-5">
      <SectionNote text={isAr ? '«فرط الاستجابة» يعني أن الطفل ينزعج أو يتجنب هذه المثيرات. «قلة الاستجابة» تعني أنه لا يلاحظها، أو يسعى بنشاط للحصول على هذا الإحساس.' : '"Over-responsive" means the child is bothered by or avoids the sensation. "Under-responsive" means they don\'t notice it, or actively seek it out.'} />
      <SensoryTable rows={[
        { key: 'sound', ar: 'الصوت / الضجيج', en: 'Sound/noise' },
        { key: 'light', ar: 'الضوء / البصري', en: 'Light/visual' },
        { key: 'touch', ar: 'اللمس / ملصقات الملابس', en: 'Touch/clothing tags' },
        { key: 'foodTexture', ar: 'قوام الطعام', en: 'Food texture' },
        { key: 'taste', ar: 'التذوق', en: 'Taste' },
        { key: 'smell', ar: 'الشم', en: 'Smell' },
        { key: 'movement', ar: 'الحركة / التأرجح / الدوران', en: 'Movement/swinging/spinning' },
        { key: 'pain', ar: 'الألم', en: 'Pain' },
        { key: 'temperature', ar: 'درجة الحرارة', en: 'Temperature' },
      ]} stateKey="sensoryProfile" d={data} s={s} isAr={isAr} />
      <TAF k="sensoryNotes" d={data} s={s} isAr={isAr} rows={3} label={isAr ? 'يرجى وصف أي سلوك حسي يثير قلقكم بشكل خاص' : 'Please describe any sensory behavior of particular concern to you'} />
    </div>,

    /* ── Section 11: Previous Assessments ── */
    <div key="s11" className="flex flex-col gap-5">
      <SectionNote text={isAr ? 'أمثلة: اختبار الذكاء (ستانفورد بينيه، ويكسلر)، ADOS-2، CARS، VB-MAPP، ABLLS-R، تقييم تخاطب، تقييم علاج وظيفي، رسم مخ، أشعة رنين، تحاليل جينية، اختبار سمع.' : 'Examples: IQ test (Stanford-Binet, Wechsler), ADOS-2, CARS, VB-MAPP, ABLLS-R, speech assessment, occupational therapy assessment, EEG, MRI, genetic testing, hearing test.'} />
      <DynTable label={isAr ? 'التقييمات والاختبارات السابقة' : 'Previous Assessments & Reports'} cols={[
        { key: 'assessment', ar: 'التقييم / الاختبار', en: 'Assessment/Test' },
        { key: 'date', ar: 'التاريخ', en: 'Date' },
        { key: 'conductedBy', ar: 'بواسطة', en: 'Conducted by' },
        { key: 'result', ar: 'النتيجة أو التشخيص', en: 'Result or Diagnosis' },
      ]} stateKey="previousAssessments" d={data} s={s} isAr={isAr} numRows={5} />
      <h3 className="font-heading text-base text-teal border-b border-teal/20 pb-2">{isAr ? 'العلاج السابق أو الحالي' : 'Previous or Current Therapy'}</h3>
      <DynTable label={isAr ? 'نوع العلاج والجهة' : 'Therapy details'} note={isAr ? 'ABA، تخاطب، علاج وظيفي، علاج طبيعي، علاج نفسي / إرشاد، أخرى' : 'ABA, Speech Therapy, Occupational Therapy, Physiotherapy, Psychotherapy/Counseling, Other'} cols={[
        { key: 'type', ar: 'النوع', en: 'Type' },
        { key: 'provider', ar: 'الجهة', en: 'Provider' },
        { key: 'startDate', ar: 'بداية', en: 'Start Date' },
        { key: 'sessionsPerWeek', ar: 'جلسات أسبوعياً', en: 'Sessions/Week' },
        { key: 'ongoing', ar: 'مستمر؟', en: 'Ongoing?' },
      ]} stateKey="previousTherapy" d={data} s={s} isAr={isAr} numRows={5} />
      <SectionNote text={isAr ? 'هذا يُحدث فرقاً كبيراً جداً. يرجى إحضار الأصول أو صور واضحة من كل تقرير لديكم، حتى القديمة منها.' : 'This makes a very big difference. Please bring the originals or clear copies of every report you have, even older ones.'} />
      <ConsentBox k="willBringReports" d={data} s={s} label={isAr ? 'سأحضر نسخاً من جميع التقارير السابقة إلى الجلسة الاستشارية الأولى.' : 'I will bring copies of all previous reports to the first consultation session.'} />
    </div>,

    /* ── Section 12: Family & Home ── */
    <div key="s12" className="flex flex-col gap-5">
      <DynTable label={isAr ? 'الإخوة والأخوات' : 'Siblings'} cols={[
        { key: 'name', ar: 'الاسم', en: 'Name' },
        { key: 'age', ar: 'العمر', en: 'Age' },
        { key: 'concerns', ar: 'أي مخاوف نمائية أو سلوكية؟', en: 'Any developmental or behavioral concerns?' },
      ]} stateKey="siblings" d={data} s={s} isAr={isAr} numRows={4} />
      <h3 className="font-heading text-base text-teal border-b border-teal/20 pb-2">{isAr ? 'البيئة المنزلية' : 'Home Environment'}</h3>
      <TF k="homeResidents" d={data} s={s} isAr={isAr} label={isAr ? 'من يعيش في المنزل مع الطفل؟' : 'Who lives at home with the child?'} />
      <TF k="screenTime" d={data} s={s} isAr={isAr} label={isAr ? 'عدد ساعات استخدام الشاشات يومياً تقريباً (تلفاز، تابلت، موبايل)' : 'Approximate daily screen time (TV, tablet, phone)'} />
      <RadioF k="dailyRoutine" d={data} s={s} isAr={isAr} label={isAr ? 'هل لدى الطفل روتين يومي ثابت؟' : 'Does the child have a consistent daily routine?'} opts={[{ v: 'yes', ar: 'نعم', en: 'Yes' }, { v: 'somewhat', ar: 'إلى حد ما', en: 'Somewhat' }, { v: 'no', ar: 'لا', en: 'No' }]} />
      <h3 className="font-heading text-base text-teal border-b border-teal/20 pb-2">{isAr ? 'أحداث حياتية حديثة' : 'Recent Life Events'}</h3>
      <SectionNote text={isAr ? 'هل مر الطفل بأي من التالي خلال العامين الماضيين؟' : 'Has the child experienced any of the following in the past two years?'} />
      <CheckF k="recentEvents" d={data} tog={tog} isAr={isAr} label={isAr ? 'أحداث حياتية (اختر كل ما ينطبق)' : 'Recent life events (select all that apply)'} opts={[
        { v: 'moved', ar: 'الانتقال إلى منزل جديد', en: 'Moving to a new home' },
        { v: 'schoolchange', ar: 'تغيير المدرسة', en: 'Changing schools' },
        { v: 'newsibling', ar: 'مولود جديد', en: 'New sibling' },
        { v: 'death', ar: 'وفاة في العائلة', en: 'Death in the family' },
        { v: 'separation', ar: 'انفصال أو طلاق الوالدين', en: "Parents' separation or divorce" },
        { v: 'illness', ar: 'مرض خطير في العائلة', en: 'Serious illness in the family' },
        { v: 'travel', ar: 'سفر أو انتقال للخارج', en: 'Travel or relocation abroad' },
        { v: 'caregiverloss', ar: 'فقدان مقدم رعاية أو مربية', en: 'Loss of a caregiver/nanny' },
        { v: 'financial', ar: 'ضائقة مالية', en: 'Financial hardship' },
        { v: 'none', ar: 'لا شيء', en: 'None' },
      ]} />
      <TAF k="recentEventDetails" d={data} s={s} isAr={isAr} rows={3} label={isAr ? 'يرجى وصف ما تم اختياره أعلاه، وكيف كان رد فعل الطفل؟' : 'Please describe what was selected above, and how the child responded to it'} />
      <h3 className="font-heading text-base text-teal border-b border-teal/20 pb-2">{isAr ? 'اعتبارات ثقافية ودينية' : 'Cultural & Religious Considerations'}</h3>
      <TAF k="culturalConsiderations" d={data} s={s} isAr={isAr} rows={3} label={isAr ? 'هل هناك ما يخص قيم أسرتكم أو ثقافتكم أو ممارستكم الدينية ينبغي أن نعلمه لنتعامل مع طفلكم على أفضل وجه؟' : "Is there anything about your family's values, culture, or religious practice we should understand to work with your child in the best possible way?"} />
    </div>,

    /* ── Section 13: Priorities ── */
    <div key="s13" className="flex flex-col gap-5">
      <SectionNote text={isAr ? 'لو استطعنا تغيير ثلاثة أشياء خلال الستة أشهر القادمة، ما هي؟ يرجى ترتيبها حسب الأولوية بالنسبة لكم (١ = الأهم).' : 'If we could change three things over the next six months, what would they be? Please rank them in order of importance to you (1 = most important).'} />
      <TF k="topGoal1" d={data} s={s} isAr={isAr} label={isAr ? '١ — الهدف الأول (الأهم)' : '1 — Top Goal (most important)'} />
      <TF k="topGoal2" d={data} s={s} isAr={isAr} label={isAr ? '٢ — الهدف الثاني' : '2 — Second Goal'} />
      <TF k="topGoal3" d={data} s={s} isAr={isAr} label={isAr ? '٣ — الهدف الثالث' : '3 — Third Goal'} />
      <TAF k="hopeFor" d={data} s={s} isAr={isAr} rows={3} label={isAr ? 'ما الذي تأملون أن نقدمه لطفلكم؟' : 'What do you hope we can offer your child?'} />
      <TAF k="worries" d={data} s={s} isAr={isAr} rows={3} label={isAr ? 'ما الذي يقلقكم أكثر شيء بشأن بدء هذه الرحلة؟' : 'What worries you most about starting this journey?'} />
      <RadioF k="daysPerWeek" d={data} s={s} isAr={isAr} label={isAr ? 'كم يوماً أسبوعياً تستطيعون فعلياً الحضور للجلسات؟' : 'How many days per week can you realistically attend sessions?'} opts={[
        { v: '1', ar: '١', en: '1' }, { v: '2', ar: '٢', en: '2' },
        { v: '3', ar: '٣', en: '3' }, { v: '4', ar: '٤', en: '4' },
        { v: '5', ar: '٥', en: '5' }, { v: 'unsure', ar: 'غير متأكد', en: 'Not sure' },
      ]} />
      <RadioF k="parentsAgree" d={data} s={s} isAr={isAr} label={isAr ? 'هل الوالدان متفقان على طلب هذا الدعم؟' : 'Do both parents agree on seeking this support?'} opts={yesNoPartial} />
      <TAF k="additionalInfo" d={data} s={s} isAr={isAr} rows={4} label={isAr ? 'هل هناك ما تودّون إخبارنا به بشكل خاص ولم تكتبوه أعلاه؟' : "Is there anything else you'd especially like to tell us that you haven't written above?"} />
    </div>,

    /* ── Section 14: Consent ── */
    <div key="s14" className="flex flex-col gap-5">
      <SectionNote text={isAr ? 'يرجى قراءة كل بند ووضع علامة للدلالة على موافقتكم. التوقيع مطلوب في نهاية الصفحة.' : 'Please read each item and check to indicate your agreement. Signature is required at the end.'} />

      <h3 className="font-heading text-base text-teal border-b border-teal/20 pb-2">{isAr ? 'السرية' : 'Confidentiality'}</h3>
      <ConsentBox k="consent_conf1" d={data} s={s} label={isAr ? 'أفهم أن جميع المعلومات التي أشاركها مع «ذرية» تُحفظ بسرية تامة وتُخزَّن بشكل آمن.' : 'I understand that all information I share with Zurriya is kept strictly confidential and stored securely.'} />
      <ConsentBox k="consent_conf2" d={data} s={s} label={isAr ? 'أفهم أن السرية لن تُخترق إلا في حالة وجود خطر جسيم على الطفل أو شخص آخر، أو إذا اقتضى القانون ذلك.' : 'I understand that confidentiality will only be breached in the case of serious risk to the child or another person, or if required by law.'} />

      <h3 className="font-heading text-base text-teal border-b border-teal/20 pb-2">{isAr ? 'الموافقة على التقييم والعلاج' : 'Consent to Assessment & Treatment'}</h3>
      <ConsentBox k="consent_assess1" d={data} s={s} label={isAr ? 'أوافق على إجراء التقييم النفسي و/أو السلوكي لطفلي.' : 'I consent to my child undergoing psychological and/or behavioral assessment.'} />
      <ConsentBox k="consent_assess2" d={data} s={s} label={isAr ? 'أؤكد بأنني أملك الصلاحية القانونية لمنح هذه الموافقة.' : 'I confirm that I hold the legal authority to grant this consent.'} />
      <ConsentBox k="consent_assess3" d={data} s={s} label={isAr ? 'أفهم أن نتائج التقييم ستُشرح لي وأنني سأتسلم تقريراً مكتوباً.' : 'I understand the assessment results will be explained to me and that I will receive a written report.'} />

      <h3 className="font-heading text-base text-teal border-b border-teal/20 pb-2">{isAr ? 'الموافقة على التواصل مع جهات أخرى' : 'Consent to Communicate with Other Parties'}</h3>
      <RadioF k="consent_communicate" d={data} s={s} isAr={isAr} label={isAr ? 'اختر ما ينطبق' : 'Choose one'} opts={[
        { v: 'school', ar: 'أوافق على تواصل «ذرية» مع مدرسة طفلي للحصول على معلومات تخص التقييم.', en: "I consent to Zurriya contacting my child's school to obtain assessment-relevant information." },
        { v: 'specialists', ar: 'أوافق على تواصل «ذرية» مع المختصين الآخرين المتابعين لطفلي حالياً.', en: "I consent to Zurriya contacting other specialists currently treating my child." },
        { v: 'none', ar: 'لا أوافق على أي من ذلك في الوقت الحالي.', en: 'I do not consent to any of the above at this time.' },
      ]} />

      <h3 className="font-heading text-base text-teal border-b border-teal/20 pb-2">{isAr ? 'التصوير والتسجيل (اختياري — حق الرفض مكفول)' : 'Photography & Recording (optional — you have the right to decline)'}</h3>
      <RadioF k="consent_recording" d={data} s={s} isAr={isAr} label={isAr ? 'اختر ما ينطبق' : 'Choose one'} opts={[
        { v: 'clinical', ar: 'أوافق على تسجيل الجلسات بالفيديو لأغراض المراجعة الإكلينيكية والإشراف فقط.', en: 'I consent to sessions being video recorded solely for clinical review and supervision purposes.' },
        { v: 'training', ar: 'أوافق على استخدام مقاطع أو بيانات مجهولة الهوية لتدريب الفريق.', en: 'I consent to anonymized clips or data being used for team training.' },
        { v: 'none', ar: 'لا أوافق على أي تسجيل.', en: 'I do not consent to any recording.' },
      ]} />
      <SectionNote text={isAr ? 'رفض التسجيل لن يؤثر إطلاقاً على الخدمة المقدمة لطفلكم.' : "Declining recording will not affect the service provided to your child in any way."} />

      <h3 className="font-heading text-base text-teal border-b border-teal/20 pb-2">{isAr ? 'الحضور والإلغاء والرسوم' : 'Attendance, Cancellation & Fees'}</h3>
      <ConsentBox k="consent_fees1" d={data} s={s} label={isAr ? 'أفهم رسوم الجلسات وجدول السداد كما شُرح لي.' : 'I understand the session fees and payment schedule as explained to me.'} />
      <ConsentBox k="consent_fees2" d={data} s={s} label={isAr ? 'أفهم أن الإلغاء يتطلب إخطاراً قبل 24 ساعة على الأقل، وأن الإلغاء المتأخر قد يُحتسب.' : 'I understand that cancellation requires at least 24 hours\' notice, and that late cancellation may be charged.'} />
      <ConsentBox k="consent_fees3" d={data} s={s} label={isAr ? 'أفهم أن تكرار الغياب قد يؤدي إلى إعطاء موعد طفلي لأسرة أخرى.' : 'I understand that repeated absence may result in my child\'s slot being given to another family.'} />

      <h3 className="font-heading text-base text-teal border-b border-teal/20 pb-2">{isAr ? 'الاحتفاظ بالبيانات' : 'Data Retention'}</h3>
      <ConsentBox k="consent_dataRetention" d={data} s={s} label={isAr ? 'أفهم أن سجلات طفلي ستُحفظ بشكل آمن للمدة التي تقتضيها المعايير المهنية، وأن لي حق طلب نسخة من التقرير في أي وقت.' : "I understand that my child's records will be securely retained for the period required by professional standards, and that I have the right to request a copy of the report at any time."} />

      <h3 className="font-heading text-base text-teal border-b border-teal/20 pb-2">{isAr ? 'الإقرار والتوقيع' : 'Declaration & Signature'}</h3>
      <p className="text-sm text-ink-2 leading-relaxed border border-border/60 bg-linen/50 rounded-xl px-4 py-3">
        {isAr
          ? 'أُقر بأن المعلومات التي قدمتها في هذه الاستمارة صحيحة وكاملة على حد علمي.'
          : 'I declare that the information provided in this form is true and complete to the best of my knowledge.'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TF k="guardianName" d={data} s={s} isAr={isAr} label={isAr ? 'اسم ولي الأمر' : "Guardian's name"} />
        <TF k="guardianRelation" d={data} s={s} isAr={isAr} label={isAr ? 'صلة القرابة بالطفل' : 'Relationship to the child'} />
        <TF k="guardianSignature" d={data} s={s} isAr={isAr} label={isAr ? 'التوقيع (اكتب اسمك الكامل كتوقيع)' : 'Signature (type your full name as signature)'} />
        <DateF k="signatureDate" d={data} s={s} label={isAr ? 'التاريخ' : 'Date'} />
        <TF k="guardian2Signature" d={data} s={s} isAr={isAr} label={isAr ? 'توقيع ولي الأمر الثاني (إن وُجد)' : "Second guardian's signature (if applicable)"} />
        <DateF k="signature2Date" d={data} s={s} label={isAr ? 'التاريخ' : 'Date'} />
      </div>
    </div>,
  ];

  // ── Intro screen ──
  if (!started) {
    const bullets = isAr
      ? [
          { icon: '📋', text: '١٤ قسماً تشمل كل جوانب نمو طفلكم ومستوى نموه' },
          { icon: '⏱️', text: 'الوقت المتوقع: ٣٠ إلى ٤٥ دقيقة — يمكنكم أخذ وقتكم كاملاً' },
          { icon: '🏠', text: 'يمكنكم تعبئتها من المنزل بهدوء قبل الزيارة الأولى' },
          { icon: '❓', text: 'إذا لم تعرفوا إجابة ما، اكتبوا «لا أعرف» أو «لا ينطبق» — لا توجد إجابات خاطئة' },
          { icon: '🔒', text: 'جميع المعلومات سرية تماماً ومحمية ولن تُشارك مع أي جهة دون إذنكم' },
        ]
      : [
          { icon: '📋', text: '14 sections covering every aspect of your child\'s development' },
          { icon: '⏱️', text: 'Expected time: 30–45 minutes — take all the time you need' },
          { icon: '🏠', text: 'Best completed from home, calmly, before the first visit' },
          { icon: '❓', text: 'If you\'re unsure of an answer, write "I don\'t know" or "N/A" — there are no wrong answers' },
          { icon: '🔒', text: 'All information is strictly confidential and will never be shared without your permission' },
        ];

    return (
      <div className="max-w-2xl mx-auto" dir={isAr ? 'rtl' : 'ltr'}>
        {/* Logo + center name */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-2xl shadow-sm border border-border p-3 mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/logo.png" alt="Zurriya" className="h-20 w-auto mx-auto" />
          </div>
          <h1 className="font-heading text-2xl md:text-3xl text-ink leading-tight">
            {isAr ? (
              <>مركز <span className="text-teal font-black">ذرية</span> لتنمية الأطفال</>
            ) : (
              <><span className="text-teal font-black">Zurriya</span> Child Development Center</>
            )}
          </h1>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
          {/* Teal banner */}
          <div className="bg-teal px-8 py-6 text-center">
            <h2 className="font-heading text-xl text-white leading-snug">
              {isAr
                ? 'مرحباً بكم — هذه الاستمارة هي أساس رحلتكم معنا'
                : 'Welcome — This form is the foundation of your journey with us'}
            </h2>
            <p className="text-white/75 text-sm mt-2 leading-relaxed">
              {isAr
                ? 'إجاباتكم الدقيقة تساعدنا على فهم طفلكم بعمق قبل اللقاء الأول، وتوفير وقت ثمين نكرّسه كلّه لطفلكم.'
                : 'Your detailed answers help us understand your child deeply before the first meeting, saving precious time we can dedicate entirely to your child.'}
            </p>
          </div>

          {/* Bullets */}
          <div className="px-8 py-7 flex flex-col gap-4">
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-ink-2/50 mb-1 text-start">
              {isAr ? 'ما الذي ستجدون في هذه الاستمارة؟' : 'What to expect'}
            </p>
            {bullets.map((b, i) => (
              <div key={i} className="flex items-start gap-3 rtl:flex-row-reverse">
                <span className="text-xl flex-shrink-0 mt-0.5">{b.icon}</span>
                <p className="text-sm text-ink-2 leading-relaxed text-start">{b.text}</p>
              </div>
            ))}
          </div>

          {/* Encouragement */}
          <div className="mx-8 mb-6 bg-coral-pale border border-coral/20 rounded-2xl px-5 py-4 text-center">
            <p className="text-sm font-semibold text-coral-dark">
              {isAr
                ? '💚 إقدامكم على هذه الخطوة هو أفضل شيء تفعلونه لطفلكم اليوم.'
                : '💚 Taking this step is one of the best things you can do for your child today.'}
            </p>
          </div>

          {/* CTA */}
          <div className="px-8 pb-8">
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="w-full flex items-center justify-center gap-3 rtl:flex-row-reverse bg-teal text-white font-semibold text-base rounded-2xl py-4 hover:bg-teal-dark transition-colors shadow-md shadow-teal/25"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="rtl:rotate-180 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
              </svg>
              {isAr ? 'ابدأ الاستمارة' : 'Start the Form'}
            </button>
            <p className="text-center text-xs text-ink-2/40 mt-3">
              {isAr ? 'سري وخاص · Strictly Confidential' : 'Strictly Confidential · سري وخاص'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Success screen ──
  if (status === 'done') {
    return (
      <div className="max-w-xl mx-auto text-center py-24 flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-teal flex items-center justify-center">
          <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
        </div>
        <h2 className="font-heading text-3xl text-ink">{isAr ? 'تم استلام استمارتك' : 'Form Received'}</h2>
        <p className="text-ink-2 text-base leading-relaxed">
          {isAr
            ? 'شكراً لكم. استمارتكم في طريقها إلى فريق ذرية. سنتواصل معكم خلال يوم إلى يومين عمل.'
            : "Thank you. Your form has been sent to the Zurriya team. We'll be in touch within 1–2 business days."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-xs font-bold tracking-[0.15em] uppercase text-teal mb-2">{isAr ? 'سري وخاص' : 'Strictly Confidential'}</p>
        <h1 className="font-heading text-2xl md:text-3xl text-ink">{isAr ? 'استمارة تسجيل وبيانات الطفل' : 'Child Registration & Intake Form'}</h1>
        <p className="mt-2 text-sm text-ink-2/70 max-w-lg mx-auto leading-relaxed">
          {isAr
            ? 'يرجى تعبئة هذه الاستمارة بأكبر قدر ممكن من التفصيل قبل الجلسة الاستشارية الأولى. إذا كان السؤال لا ينطبق، اكتب «لا ينطبق» ولا تتركه فارغاً. جميع المعلومات سرية تماماً.'
            : 'Please complete this form in as much detail as possible before the first consultation session. If a question doesn\'t apply, write "N/A" rather than leaving it blank. All information is kept strictly confidential.'}
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-teal">{isAr ? `القسم ${step + 1} من ${TOTAL}` : `Section ${step + 1} of ${TOTAL}`}</span>
          <span className="text-xs text-ink-2/50">{titles[step][isAr ? 'ar' : 'en']}</span>
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-teal rounded-full transition-all duration-300" style={{ width: `${((step + 1) / TOTAL) * 100}%` }} />
        </div>
      </div>

      {/* Section card */}
      <div className="bg-white rounded-3xl border border-border shadow-sm p-7 md:p-10">
        {/* Halfway motivational banner — shown at section 8 (step 7) */}
        {step === 7 && (
          <div className={`bg-teal-pale border border-teal/20 rounded-2xl px-5 py-4 mb-6 flex items-center gap-4 ${isAr ? 'flex-row-reverse text-right' : ''}`}>
            <span className="text-3xl flex-shrink-0">💚</span>
            <div>
              <p className="font-semibold text-teal-dark text-sm leading-snug">
                {isAr ? 'أنتم في المنتصف — أحسنتم!' : "You're halfway there — great work!"}
              </p>
              <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                {isAr
                  ? 'كل إجابة تكتبونها تقربنا من فهم أعمق لطفلكم. إقدامكم على هذه الخطوة يصنع فرقاً حقيقياً.'
                  : 'Every answer brings us closer to a deeper understanding of your child. The effort you\'re putting in makes a real difference.'}
              </p>
            </div>
          </div>
        )}
        <h2 className="font-heading text-xl md:text-2xl text-ink mb-6">{titles[step][isAr ? 'ar' : 'en']}</h2>
        {sections[step]}
      </div>

      {/* Navigation */}
      <div className={`flex items-center mt-5 gap-3 ${isAr ? 'flex-row-reverse' : ''}`}>
        {step > 0 && (
          <button type="button" onClick={back} className="flex items-center gap-2 text-sm font-semibold text-ink-2 border border-border hover:border-teal/40 hover:text-teal rounded-full px-5 py-2.5 transition-colors">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className={isAr ? '' : 'rotate-180'}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
            {isAr ? 'السابق' : 'Back'}
          </button>
        )}

        <div className="flex-1" />

        {step < TOTAL - 1 ? (
          <button type="button" onClick={next} className="flex items-center gap-2 text-sm font-semibold bg-teal text-white rounded-full px-6 py-2.5 hover:bg-teal-dark transition-colors shadow-sm shadow-teal/25">
            {isAr ? 'التالي' : 'Next'}
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className={isAr ? 'rotate-180' : ''}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
          </button>
        ) : (
          <button type="button" onClick={submit} disabled={status === 'sending'} className="flex items-center gap-2 text-sm font-semibold bg-teal text-white rounded-full px-7 py-2.5 hover:bg-teal-dark transition-colors shadow-sm shadow-teal/25 disabled:opacity-60">
            {status === 'sending' ? (isAr ? 'جارٍ الإرسال...' : 'Sending...') : (isAr ? 'إرسال الاستمارة' : 'Submit Form')}
          </button>
        )}
      </div>

      {status === 'error' && (
        <p className="mt-4 text-sm text-red-600 text-center">
          {isAr ? 'حدث خطأ. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.' : 'Something went wrong. Please try again or contact us directly.'}
        </p>
      )}

      {/* Section dots */}
      <div className="flex justify-center gap-1 mt-6 flex-wrap">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <button key={i} type="button" onClick={() => setStep(i)} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-teal w-5' : i < step ? 'bg-teal/40' : 'bg-border'}`} aria-label={`Section ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}
