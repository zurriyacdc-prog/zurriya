import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
});

// ─── Email helpers ────────────────────────────────────────────────────────────
function v(x: unknown): string {
  if (x === null || x === undefined || x === '') return '—';
  if (typeof x === 'boolean') return x ? '✓ Yes / نعم' : '✗ No / لا';
  if (Array.isArray(x)) return x.filter(Boolean).join(', ') || '—';
  if (typeof x === 'object') return JSON.stringify(x, null, 2);
  return String(x);
}
function row(label: string, value: unknown) {
  return `<tr>
    <td style="padding:7px 14px;font-weight:600;color:#1B5E6E;width:42%;vertical-align:top;border-bottom:1px solid #e8e8e8;font-size:13px">${label}</td>
    <td style="padding:7px 14px;color:#333;border-bottom:1px solid #e8e8e8;font-size:13px;white-space:pre-wrap">${v(value)}</td>
  </tr>`;
}
function sec(title: string, rows: string) {
  return `<div style="margin-bottom:24px">
    <h2 style="background:#1B5E6E;color:#fff;padding:10px 16px;margin:0;font-size:14px;font-family:Arial,sans-serif;letter-spacing:.5px">${title}</h2>
    <table style="width:100%;border-collapse:collapse;background:#fff">${rows}</table>
  </div>`;
}
function tableSection(title: string, headers: string[], rows: Record<string, string>[] | undefined) {
  if (!rows?.length) return '';
  const ths = headers.map(h => `<th style="padding:8px 12px;text-align:left;font-weight:600;color:#1B5E6E;border:1px solid #ddd;background:#f0f7f8;font-size:12px">${h}</th>`).join('');
  const trs = rows.map(r =>
    `<tr>${Object.values(r).map(c => `<td style="padding:7px 12px;border:1px solid #ddd;font-size:12px">${c || '—'}</td>`).join('')}</tr>`
  ).join('');
  return `<div style="margin-bottom:24px">
    <h2 style="background:#1B5E6E;color:#fff;padding:10px 16px;margin:0;font-size:14px;font-family:Arial,sans-serif">${title}</h2>
    <table style="width:100%;border-collapse:collapse;background:#fff"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>
  </div>`;
}

// ─── Print document builder ───────────────────────────────────────────────────
const LABELS: Record<string, string> = {
  yes: 'Yes / نعم', no: 'No / لا', idk: "Don't know / لا أعرف",
  partial: 'Partially / جزئياً', unsure: 'Not sure / لست متأكداً',
  male: 'Male / ذكر', female: 'Female / أنثى',
  family: 'Family / الأسرة', pediatrician: 'Pediatrician / طبيب أطفال',
  psychiatrist: 'Psychiatrist / طبيب نفسي', school: 'School / المدرسة',
  center: 'Another center / مركز آخر', social: 'Social media / وسائل التواصل',
  personal: 'Personal recommendation / توصية شخصية',
  married: 'Married / متزوجان', separated: 'Separated / منفصلان',
  divorced: 'Divorced / مطلقان', widowed: 'Widowed / تُرمل', other: 'Other / أخرى',
  phone: 'Phone call / اتصال هاتفي', whatsapp: 'WhatsApp / واتساب', email: 'Email / بريد إلكتروني',
  ar: 'Arabic / العربية', en: 'English / الإنجليزية', both: 'Both / كلتاهما',
  vaginal: 'Vaginal / طبيعية', assisted: 'Assisted (vacuum/forceps) / بمساعدة',
  'planned-cs': 'Planned C-section / قيصرية مخططة', 'emergency-cs': 'Emergency C-section / قيصرية طارئة',
  independent: 'Fully independent / مستقل تماماً', dayonly: 'Daytime only / نهاراً فقط',
  diapers: 'Uses diapers / يستخدم الحفاضات', resists: 'Resists toilet / يقاوم الحمام',
  constipation: 'Constipation / إمساك',
  public: 'Public / حكومية', private: 'Private/International / خاصة',
  inclusion: 'Inclusion / دمج', special: 'Special education / تربية خاصة',
  home: 'Homeschooling / تعليم منزلي', none: 'None / لا',
  cooperative: 'Cooperatively / بشكل تعاوني', parallel: 'Parallel play / لعب موازٍ',
  watches: 'Only watches / يراقب فقط', avoids: 'Avoids them / يتجنبهم',
  consistent: 'Consistent / ثابت', fleeting: 'Fleeting / لحظي',
  rare: 'Rare / نادر', absent: 'Absent / معدوم',
  always: 'Always / دائماً', sometimes: 'Sometimes / أحياناً', never: 'Never / أبداً',
  limited: 'Limited / محدود',
  above: 'Above expected / فوق المتوقع', as: 'As expected / كما هو متوقع',
  below: 'Below expected / دون المتوقع', struggling: 'Clearly struggling / يعاني بوضوح',
  over: 'Over-responsive / فرط الاستجابة', under: 'Under-responsive / قلة الاستجابة',
  clinical: 'Clinical review/supervision only / للمراجعة الإكلينيكية فقط',
  training: 'Anonymized for team training / مجهولة الهوية للتدريب',
  '1': '1', '2': '2', '3': '3', '4': '4', '5': '5',
  // complication types
  bleeding: 'Bleeding / نزيف', bp: 'High BP/Pre-eclampsia / ارتفاع ضغط الدم',
  diabetes: 'Gestational diabetes / سكري الحمل', infection: 'Infection/fever / عدوى أو حرارة',
  threatened: 'Threatened miscarriage / تهديد بالإجهاض', stress: 'Severe stress/trauma / ضغط نفسي شديد',
  accident: 'Accident or fall / حادث أو سقوط',
  // first month
  jaundice: 'Jaundice / صفراء', seizures: 'Seizures / تشنجات',
  breathing: 'Breathing difficulty / صعوبة في التنفس', feeding: 'Feeding difficulty / صعوبة في الرضاعة',
  sleepy: 'Excessive sleepiness / نوم مفرط',
  // medical events
  hospitalization: 'Hospitalization / دخول المستشفى', surgery: 'Surgery / جراحة',
  headinjury: 'Head injury / إصابة بالرأس', febrile: 'Febrile seizures / تشنجات حرارية',
  meningitis: 'Meningitis/encephalitis / التهاب سحائي', earinfections: 'Ear infections / التهابات أذن',
  chronic: 'Chronic illness / مرض مزمن',
  // family history
  autism: 'Autism / توحد', adhd: 'ADHD / فرط حركة', intellectual: 'Intellectual disability / إعاقة ذهنية',
  learning: 'Learning difficulties / صعوبات تعلم', langdelay: 'Language delay / تأخر لغوي',
  epilepsy: 'Epilepsy / صرع', depression: 'Depression / اكتئاب', anxiety: 'Anxiety / قلق',
  bipolar: 'Bipolar / ثنائي القطب', schizophrenia: 'Schizophrenia / فصام',
  addiction: 'Addiction / إدمان', genetic: 'Genetic disorder / اضطراب جيني',
  sensory: 'Sensory impairment / إعاقة حسية',
  // sleep issues
  fallasleep: 'Difficulty falling asleep / صعوبة في الخلود للنوم',
  waking: 'Frequent night waking / استيقاظ متكرر',
  parentbed: "Sleeps in parents' bed / ينام في سرير الوالدين",
  nightmares: 'Nightmares / كوابيس',
  // eating
  varied: 'Varied diet / أطعمة متنوعة',
  textures: 'Refuses certain textures / يرفض قوامات معينة',
  colors: 'Refuses certain colors / يرفض ألواناً معينة',
  nonfood: 'Eats non-food items / يأكل غير الطعام',
  overeats: 'Overeats / يفرط في الأكل',
  needsfed: 'Needs to be fed / يحتاج لمن يطعمه',
  bottle: 'Uses a bottle / يستخدم الرضاعة',
  // communication
  spoken: 'Spoken words/sentences / كلمات منطوقة',
  singlewords: 'Single words / كلمات فردية',
  sounds: 'Sounds only / أصوات فقط',
  gestures: 'Gestures/pointing / إيماءات',
  pulls: "Pulls adult's hand / يسحب يد الكبير",
  pecs: 'PECS cards / بطاقات PECS',
  aac: 'AAC device / جهاز AAC',
  sign: 'Sign language / لغة إشارة',
  // repetitive behaviors
  flapping: 'Hand flapping / رفرفة اليدين', rocking: 'Rocking / التأرجح',
  spinning: 'Spinning / الدوران', tiptoe: 'Toe-walking / مشي أطراف الأصابع',
  lining: 'Lining up objects / صف الأشياء', wheels: 'Spinning wheels / تدوير العجلات',
  echolalia: 'Echolalia / مصاداة', narrowinterests: 'Narrow interests / اهتمامات ضيقة',
  routine: 'Insistence on routine / الإصرار على الروتين',
  changesdistress: 'Distress at changes / الانزعاج من التغيرات',
  rituals: 'Rigid rituals / طقوس جامدة',
  // recent events
  moved: 'Moving home / انتقال لمنزل جديد', schoolchange: 'Changing schools / تغيير المدرسة',
  newsibling: 'New sibling / مولود جديد', death: 'Death in family / وفاة في الأسرة',
  separation: 'Parents\' separation / انفصال الوالدين', illness: 'Serious illness / مرض خطير',
  travel: 'Travel/relocation / سفر أو انتقال', caregiverloss: 'Loss of caregiver / فقدان مربية',
  financial: 'Financial hardship / ضائقة مالية',
  // school contact
  'school-contact': 'Consent to contact school / الموافقة على التواصل مع المدرسة',
  specialists: 'Consent to contact other specialists / الموافقة على التواصل مع المختصين',
  'none-contact': 'No consent at this time / لا موافقة الآن',
};

function buildPrintDoc(d: Record<string, unknown>): string {
  const isAr = (d.locale as string) === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  function L(ar: string, en: string) { return isAr ? ar : en; }

  function pv(x: unknown): string {
    if (x === null || x === undefined || x === '') return '—';
    if (typeof x === 'boolean') return x ? '✓' : '—';
    if (Array.isArray(x)) return x.filter(Boolean).map(i => LABELS[String(i)] || String(i)).join('\n') || '—';
    if (typeof x === 'string') return LABELS[x] || x;
    return '—';
  }

  function frow(label: string, value: unknown): string {
    const display = pv(value).replace(/\n/g, '<br>');
    return `<tr>
      <td class="lbl">${label}</td>
      <td class="val">${display}</td>
    </tr>`;
  }

  function ft(rows: string): string {
    return `<table class="ft">${rows}</table>`;
  }

  function psec(titleAr: string, titleEn: string, content: string): string {
    return `<div class="sec"><div class="sec-hdr">${L(titleAr, titleEn)}</div>${content}</div>`;
  }

  function subhdr(ar: string, en: string): string {
    return `<div class="sub-hdr">${L(ar, en)}</div>`;
  }

  function dtable(headers: string[], rows: Record<string, unknown>[] | undefined): string {
    const filtered = (rows || []).filter(r => Object.values(r).some(v => v && String(v).trim()));
    if (!filtered.length) return `<p class="empty">${L('لا توجد بيانات', 'No data provided')}</p>`;
    const ths = headers.map(h => `<th>${h}</th>`).join('');
    const trs = filtered.map(r => `<tr>${Object.values(r).map(c => `<td>${c ? String(c) : '—'}</td>`).join('')}</tr>`).join('');
    return `<table class="dt"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
  }

  const childName = (d.childFullName as string) || L('غير محدد', 'Not specified');
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

  // Milestones table
  const MS = [
    { k: 'headControl', ar: 'التحكم في الرأس', en: 'Head control' },
    { k: 'sitting', ar: 'الجلوس دون سند', en: 'Sitting without support' },
    { k: 'crawling', ar: 'الحبو', en: 'Crawling' },
    { k: 'walking', ar: 'المشي باستقلالية', en: 'Walking independently' },
    { k: 'firstWord', ar: 'أول كلمة ذات معنى', en: 'First meaningful word' },
    { k: 'twoWords', ar: 'جملة من كلمتين', en: 'Two-word sentence' },
    { k: 'sentences', ar: 'جمل كاملة', en: 'Full sentences' },
    { k: 'toiletDay', ar: 'التحكم في الحمام (نهاراً)', en: 'Daytime toilet control' },
    { k: 'toiletNight', ar: 'التحكم في الحمام (ليلاً)', en: 'Nighttime toilet control' },
    { k: 'feeding', ar: 'إطعام نفسه بالملعقة', en: 'Self-feeding with spoon' },
    { k: 'dressing', ar: 'ارتداء ملابسه', en: 'Dressing self' },
  ];
  const milestonesHtml = `<table class="dt">
    <thead><tr>
      <th>${L('المهارة', 'Skill')}</th>
      <th style="text-align:center">${L('العمر عند الإتقان', 'Age at Mastery')}</th>
      <th style="text-align:center">${L('لم يتقنها بعد', 'Not Yet')}</th>
    </tr></thead>
    <tbody>${MS.map(m => `<tr>
      <td>${L(m.ar, m.en)}</td>
      <td style="text-align:center">${(d[`ms_${m.k}`] as string) || '—'}</td>
      <td style="text-align:center">${d[`ms_${m.k}_notyet`] ? '✓' : ''}</td>
    </tr>`).join('')}</tbody>
  </table>`;

  // Concern ratings table
  const CONCERN_ROWS = [
    { k: 'communication', ar: 'التواصل والنطق', en: 'Communication & Speech' },
    { k: 'social', ar: 'التفاعل الاجتماعي', en: 'Social Interaction' },
    { k: 'behavior', ar: 'السلوك', en: 'Behavior' },
    { k: 'selfReliance', ar: 'الاعتماد على النفس', en: 'Self-Reliance' },
    { k: 'academic', ar: 'التحصيل الدراسي', en: 'Academic Achievement' },
    { k: 'motor', ar: 'المهارات الحركية', en: 'Motor Skills' },
    { k: 'sensory', ar: 'الاستجابات الحسية', en: 'Sensory Responses' },
    { k: 'food', ar: 'الطعام والتغذية', en: 'Food & Nutrition' },
    { k: 'sleep', ar: 'النوم', en: 'Sleep' },
    { k: 'toilet', ar: 'التدريب على الحمام', en: 'Toilet Training' },
    { k: 'attention', ar: 'الانتباه والتركيز', en: 'Attention & Focus' },
    { k: 'emotional', ar: 'التنظيم الانفعالي', en: 'Emotional Regulation' },
  ];
  const ratings = (d.concernRatings as Record<string, string>) || {};
  const concernHtml = `<table class="dt">
    <thead><tr>
      <th>${L('المجال', 'Area')}</th>
      ${['1','2','3','4','5'].map(n => `<th style="text-align:center;width:36px">${n}</th>`).join('')}
    </tr></thead>
    <tbody>${CONCERN_ROWS.map(r => `<tr>
      <td>${L(r.ar, r.en)}</td>
      ${['1','2','3','4','5'].map(n => `<td style="text-align:center;font-size:14px">${ratings[r.k] === n ? '●' : '○'}</td>`).join('')}
    </tr>`).join('')}</tbody>
  </table>`;

  // Sensory table
  const SENSORY_ROWS = [
    { k: 'sound', ar: 'الصوت / الضجيج', en: 'Sound/noise' },
    { k: 'light', ar: 'الضوء / البصري', en: 'Light/visual' },
    { k: 'touch', ar: 'اللمس / ملصقات الملابس', en: 'Touch/clothing tags' },
    { k: 'foodTexture', ar: 'قوام الطعام', en: 'Food texture' },
    { k: 'taste', ar: 'التذوق', en: 'Taste' },
    { k: 'smell', ar: 'الشم', en: 'Smell' },
    { k: 'movement', ar: 'الحركة / التأرجح / الدوران', en: 'Movement/swinging/spinning' },
    { k: 'pain', ar: 'الألم', en: 'Pain' },
    { k: 'temperature', ar: 'درجة الحرارة', en: 'Temperature' },
  ];
  const sensory = (d.sensoryProfile as Record<string, string>) || {};
  const sensoryHtml = `<table class="dt">
    <thead><tr>
      <th>${L('الحاسة', 'Sense')}</th>
      <th style="text-align:center">${L('فرط الاستجابة (يتجنب)', 'Over-responsive (avoids)')}</th>
      <th style="text-align:center">${L('قلة الاستجابة (يبحث)', 'Under-responsive (seeks)')}</th>
      <th style="text-align:center">${L('لا توجد صعوبات', 'No difficulty')}</th>
    </tr></thead>
    <tbody>${SENSORY_ROWS.map(r => `<tr>
      <td>${L(r.ar, r.en)}</td>
      <td style="text-align:center;font-size:14px">${sensory[r.k] === 'over' ? '●' : '○'}</td>
      <td style="text-align:center;font-size:14px">${sensory[r.k] === 'under' ? '●' : '○'}</td>
      <td style="text-align:center;font-size:14px">${sensory[r.k] === 'none' ? '●' : '○'}</td>
    </tr>`).join('')}</tbody>
  </table>`;

  // Academic performance table
  const ACAD_ROWS = [
    { k: 'reading', ar: 'القراءة', en: 'Reading' },
    { k: 'writing', ar: 'الكتابة', en: 'Writing' },
    { k: 'math', ar: 'الرياضيات', en: 'Math' },
    { k: 'routine', ar: 'الالتزام بروتين الفصل', en: 'Following classroom routine' },
    { k: 'peers', ar: 'التعامل مع الأقران', en: 'Peer relationships' },
  ];
  const acad = (d.academicPerformance as Record<string, string>) || {};
  const acadHtml = `<table class="dt">
    <thead><tr>
      <th>${L('المادة', 'Subject')}</th>
      <th style="text-align:center">${L('فوق المتوقع', 'Above expected')}</th>
      <th style="text-align:center">${L('كما هو متوقع', 'As expected')}</th>
      <th style="text-align:center">${L('دون المتوقع', 'Below expected')}</th>
      <th style="text-align:center">${L('يعاني بوضوح', 'Clearly struggling')}</th>
    </tr></thead>
    <tbody>${ACAD_ROWS.map(r => `<tr>
      <td>${L(r.ar, r.en)}</td>
      <td style="text-align:center;font-size:14px">${acad[r.k] === 'above' ? '●' : '○'}</td>
      <td style="text-align:center;font-size:14px">${acad[r.k] === 'as' ? '●' : '○'}</td>
      <td style="text-align:center;font-size:14px">${acad[r.k] === 'below' ? '●' : '○'}</td>
      <td style="text-align:center;font-size:14px">${acad[r.k] === 'struggling' ? '●' : '○'}</td>
    </tr>`).join('')}</tbody>
  </table>`;

  const css = `
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,Tahoma,'Arial Unicode MS',sans-serif;font-size:10pt;color:#1a1a1a;background:#fff;direction:${dir}}
    .page{max-width:210mm;margin:0 auto;padding:10mm 15mm}
    .hdr{background:#1B5E6E;color:#fff;padding:16px 20px;margin-bottom:14px;border-radius:4px}
    .hdr h1{font-size:18pt;font-weight:700;margin-bottom:4px}
    .hdr p{font-size:9pt;opacity:.85;margin:2px 0}
    .hdr .meta{margin-top:8px;font-size:9pt;opacity:.9;display:flex;gap:20px;flex-wrap:wrap}
    .conf{display:inline-block;border:2px solid rgba(255,255,255,.6);padding:2px 10px;font-size:8pt;letter-spacing:1px;text-transform:uppercase;margin-top:6px}
    .sec{margin-bottom:14px;page-break-inside:avoid;break-inside:avoid}
    .sec-hdr{background:#1B5E6E;color:#fff;padding:7px 12px;font-size:10pt;font-weight:700;letter-spacing:.3px}
    .sub-hdr{padding:5px 12px;background:#e0f0f3;color:#1B5E6E;font-weight:700;font-size:9.5pt;border-top:2px solid #1B5E6E;margin-top:0}
    .ft{width:100%;border-collapse:collapse;border:1px solid #ddd}
    .ft tr:nth-child(even){background:#f7fafa}
    .ft td{padding:5px 10px;vertical-align:top;border-bottom:1px solid #e8e8e8;font-size:9.5pt;line-height:1.5}
    .lbl{width:38%;font-weight:600;color:#1B5E6E;min-width:130px}
    .val{color:#1a1a1a;white-space:pre-wrap;word-break:break-word}
    .dt{width:100%;border-collapse:collapse;border:1px solid #ddd}
    .dt thead tr{background:#dff0f3}
    .dt th{padding:6px 8px;font-size:9pt;font-weight:700;color:#1B5E6E;border:1px solid #ddd;text-align:start}
    .dt td{padding:5px 8px;font-size:9pt;border:1px solid #e0e0e0;vertical-align:top}
    .dt tr:nth-child(even) td{background:#f7fafa}
    .empty{padding:6px 10px;color:#999;font-size:9pt;font-style:italic;border:1px solid #ddd}
    .footer{margin-top:18px;border-top:2px solid #1B5E6E;padding-top:8px;display:flex;justify-content:space-between;font-size:8pt;color:#555;flex-wrap:wrap;gap:6px}
    @media print{
      body{font-size:9pt}
      .page{padding:5mm 8mm;max-width:100%}
      .sec{page-break-inside:avoid;break-inside:avoid}
      .hdr{border-radius:0}
      @page{size:A4;margin:8mm}
    }
    @media screen{
      body{background:#e8e8e8}
      .page{margin:20px auto;background:#fff;box-shadow:0 2px 20px rgba(0,0,0,.15);border-radius:4px;overflow:hidden}
    }`;

  return `<!DOCTYPE html>
<html dir="${dir}" lang="${isAr ? 'ar' : 'en'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Zurriya Intake — ${childName}</title>
<style>${css}</style>
</head>
<body>
<div class="page">

<div class="hdr">
  <h1>ذرية &nbsp;·&nbsp; Zurriya</h1>
  <p>${L('استمارة تسجيل وبيانات الطفل', 'Child Registration &amp; Intake Form')}</p>
  <div class="meta">
    <span><strong>${L('الطفل:', 'Child:')}</strong>&nbsp;${childName}</span>
    <span><strong>${L('تاريخ الاستلام:', 'Received:')}</strong>&nbsp;${today}</span>
    ${d.formDate ? `<span><strong>${L('تاريخ التعبئة:', 'Completed:')}</strong>&nbsp;${d.formDate}</span>` : ''}
  </div>
  <div class="conf">${L('سري وخاص', 'Strictly Confidential')}</div>
</div>

${psec('١. البيانات الأساسية', '1. Basic Information', ft([
  frow(L('اسم الطفل رباعياً', "Child's Full Name"), d.childFullName),
  frow(L('تاريخ الميلاد', 'Date of Birth'), d.dob),
  frow(L('العمر', 'Age'), d.age),
  frow(L('الجنس', 'Sex'), d.sex),
  frow(L('الجنسية', 'Nationality'), d.nationality),
  frow(L('الرقم القومي / جواز السفر', 'National ID / Passport'), d.nationalId),
  frow(L('لغات المنزل', 'Home Languages'), d.homeLanguages),
  frow(L('لغات أخرى', 'Other Languages'), d.otherLanguages),
  frow(L('جهة الإحالة', 'Referral Source'), d.referralSource),
  frow(L('الطبيب المحيل', 'Referring Doctor'), d.referringDoctor),
  frow(L('من أكمل الاستمارة', 'Completed By'), d.completedBy),
].join('')))}

${psec('٢. الوالدان والوضع الأسري', '2. Parents & Family Status',
  subhdr('الأم / ولي الأمر الأول', 'Mother / Primary Guardian') +
  ft([
    frow(L('الاسم', 'Full Name'), d.motherName),
    frow(L('السن', 'Age'), d.motherAge),
    frow(L('المهنة', 'Occupation'), d.motherOccupation),
    frow(L('المؤهل الدراسي', 'Education'), d.motherEducation),
    frow(L('رقم الموبايل', 'Mobile'), d.motherPhone),
    frow(L('البريد الإلكتروني', 'Email'), d.motherEmail),
  ].join('')) +
  subhdr('الأب / ولي الأمر الثاني', 'Father / Secondary Guardian') +
  ft([
    frow(L('الاسم', 'Full Name'), d.fatherName),
    frow(L('السن', 'Age'), d.fatherAge),
    frow(L('المهنة', 'Occupation'), d.fatherOccupation),
    frow(L('المؤهل الدراسي', 'Education'), d.fatherEducation),
    frow(L('رقم الموبايل', 'Mobile'), d.fatherPhone),
    frow(L('البريد الإلكتروني', 'Email'), d.fatherEmail),
  ].join('')) +
  subhdr('الوضع الأسري والقانوني', 'Family & Legal Status') +
  ft([
    frow(L('الحالة الاجتماعية', 'Marital Status'), d.maritalStatus),
    frow(L('حق الحضانة القانونية', 'Legal Custody'), d.legalCustody),
    frow(L('المخوَّل بالموافقة على العلاج', 'Consent Authority'), d.consentAuthority),
    frow(L('يعيش مع', 'Child Lives With'), d.childLivesWith),
    frow(L('مقدم الرعاية الأساسي', 'Primary Caregiver'), d.primaryCaregiver),
    frow(L('ملاحظات الرعاية', 'Caregiver Notes'), d.caregiverNote),
    frow(L('وسيلة التواصل المفضلة', 'Preferred Contact'), d.preferredContact),
    frow(L('لغة التقارير المفضلة', 'Preferred Report Language'), d.preferredReportLang),
  ].join('')) +
  subhdr('جهة اتصال الطوارئ', 'Emergency Contact') +
  ft([
    frow(L('الاسم', 'Name'), d.emergencyName),
    frow(L('صلة القرابة', 'Relationship'), d.emergencyRelation),
    frow(L('رقم الموبايل', 'Mobile'), d.emergencyPhone),
  ].join(''))
)}

${psec('٣. سبب الزيارة والشكوى الحالية', '3. Reason for Visit',
  ft([
    frow(L('المخاوف الرئيسية', 'Main Concern'), d.mainConcern),
    frow(L('متى لوحظت المشكلة أول مرة', 'When First Noticed'), d.whenNoticed),
    frow(L('لماذا تقرر طلب المساعدة الآن', 'Why Seeking Help Now'), d.whyNow),
    frow(L('الهدف الأهم لطفلكم', 'Main Goal for Child'), d.mainGoal),
    frow(L('ما جربتم من قبل', 'Previous Attempts'), d.previousAttempts),
    frow(L('متابعة مع متخصصين آخرين', 'Currently Seeing Specialists'), d.currentSpecialists),
    frow(L('بيانات التواصل مع المختص', 'Specialist Contact'), d.specialistContact),
    frow(L('المجال الأكثر إلحاحاً', 'Most Urgent Area'), d.mostUrgentConcern),
  ].join('')) +
  subhdr('تقييم مجالات القلق (١ = لا قلق | ٥ = قلق شديد)', 'Areas of Concern (1 = no concern | 5 = severe)') +
  concernHtml
)}

${psec('٤. تاريخ الحمل والولادة', '4. Pregnancy & Birth History', ft([
  frow(L('عمر الأم وقت الحمل', "Mother's Age During Pregnancy"), d.motherAgeAtPregnancy),
  frow(L('حمل مخطط', 'Planned Pregnancy'), d.plannedPregnancy),
  frow(L('مضاعفات أثناء الحمل', 'Pregnancy Complications'), d.pregnancyComplications),
  frow(L('أنواع المضاعفات', 'Complication Types'), d.complicationList),
  frow(L('تفاصيل المضاعفات', 'Complication Details'), d.complicationDetails),
  frow(L('أدوية أو مواد خلال الحمل', 'Medications/Substances During Pregnancy'), d.medications),
  frow(L('عمر الحمل عند الولادة (أسابيع)', 'Gestational Age (weeks)'), d.gestationalAge),
  frow(L('نوع الولادة', 'Delivery Type'), d.deliveryType),
  frow(L('سبب الولادة القيصرية', 'C-Section Reason'), d.csectionReason),
  frow(L('وزن الطفل عند الميلاد', 'Birth Weight'), d.birthWeight),
  frow(L('درجة أبجار', 'Apgar Score'), d.apgarScore),
  frow(L('بكى الطفل مباشرة بعد الولادة', 'Baby Cried Immediately'), d.babyCried),
  frow(L('دخل الطفل الحضانة الطبية', 'Went to NICU'), d.nicu),
  frow(L('تفاصيل الحضانة الطبية', 'NICU Details'), d.nicuDetails),
  frow(L('مشكلات الشهر الأول', 'First Month Issues'), d.firstMonthIssues),
  frow(L('ملاحظات إضافية', 'Additional Notes'), d.pregnancyNotes),
].join('')))}

${psec('٥. مراحل النمو والتطور', '5. Developmental Milestones',
  milestonesHtml +
  ft([
    frow(L('تراجع في المهارات', 'Skill Regression'), d.skillRegression),
    frow(L('تفاصيل التراجع', 'Regression Details'), d.skillRegressionDetails),
    frow(L('أحداث في تلك الفترة', 'Events During That Period'), d.regressionContext),
  ].join(''))
)}

${psec('٦. التاريخ الطبي', '6. Medical History',
  subhdr('التشخيصات الحالية', 'Current Diagnoses') +
  dtable(
    [L('التشخيص', 'Diagnosis'), L('التاريخ', 'Date'), L('الجهة أو الطبيب', 'Physician/Institution')],
    d.currentDiagnoses as Record<string, unknown>[]
  ) +
  ft([
    frow(L('الأحداث الطبية', 'Medical Events'), d.medicalEvents),
    frow(L('تفاصيل الأحداث', 'Event Details'), d.medicalEventDetails),
    frow(L('الحساسية', 'Allergies'), d.allergies),
    frow(L('اختبار السمع', 'Hearing Test'), d.hearingTest),
    frow(L('نتيجة وتاريخ اختبار السمع', 'Hearing Test Result & Date'), d.hearingTestResult),
    frow(L('اختبار البصر', 'Vision Test'), d.visionTest),
    frow(L('نتيجة وتاريخ اختبار البصر', 'Vision Test Result & Date'), d.visionTestResult),
    frow(L('التطعيمات محدثة', 'Vaccinations Up to Date'), d.vaccinations),
  ].join('')) +
  subhdr('الأدوية الحالية', 'Current Medications') +
  dtable(
    [L('الدواء', 'Medication'), L('الجرعة', 'Dosage'), L('من وصفه', 'Prescribed By'), L('منذ متى', 'Since')],
    d.currentMedications as Record<string, unknown>[]
  ) +
  ft([
    frow(L('التاريخ العائلي', 'Family History'), d.familyHistory),
    frow(L('صلة القرابة', 'Relationship'), d.familyHistoryRelation),
    frow(L('زواج أقارب', 'Consanguineous Marriage'), d.consanguineousMarriage),
    frow(L('درجة القرابة', 'Degree of Relation'), d.consanguineousDetails),
  ].join(''))
)}

${psec('٧. السلوك', '7. Behavior',
  subhdr('النوم', 'Sleep') +
  ft([
    frow(L('موعد النوم المعتاد', 'Usual Bedtime'), d.sleepBedtime),
    frow(L('موعد الاستيقاظ', 'Wake Time'), d.sleepWakeTime),
    frow(L('إجمالي ساعات النوم', 'Total Sleep Hours'), d.sleepHours),
    frow(L('مشكلات النوم', 'Sleep Issues'), d.sleepIssues),
  ].join('')) +
  subhdr('الطعام', 'Food/Eating') +
  ft([
    frow(L('عادات الأكل', 'Eating Habits'), d.eatingHabits),
    frow(L('عدد الأطعمة المقبولة تقريباً', 'Approx. # of Accepted Foods'), d.foodCount),
  ].join('')) +
  subhdr('التدريب على الحمام', 'Toilet Training') +
  ft([frow(L('وضع التدريب على الحمام', 'Toilet Training Status'), d.toiletTraining)].join('')) +
  subhdr('السلوكيات الصعبة', 'Challenging Behaviors') +
  dtable(
    [L('السلوك', 'Behavior'), L('كم مرة', 'How Often'), L('كم تدوم', 'How Long'), L('الشدة ١-٥', 'Severity 1-5')],
    d.challengingBehaviors as Record<string, unknown>[]
  ) +
  ft([
    frow(L('ماذا يفعل عند الرفض', 'When Refused Something'), d.wantsMotivator),
    frow(L('ما يحدث قبل السلوك', 'Before Challenging Behavior'), d.behaviorBefore),
    frow(L('ما يحدث بعد السلوك', 'After Challenging Behavior'), d.behaviorAfter),
    frow(L('مخاوف على السلامة', 'Safety Concerns'), d.safetyConcerns),
    frow(L('تفاصيل السلامة', 'Safety Details'), d.safetyDetails),
  ].join(''))
)}

${psec('٨. التواصل والتفاعل الاجتماعي', '8. Communication & Social Interaction', ft([
  frow(L('طرق التواصل', 'Communication Methods'), d.communicationMethods),
  frow(L('عدد الكلمات تقريباً', 'Approximate Word Count'), d.wordCount),
  frow(L('أطول جملة', 'Longest Sentence'), d.longestSentence),
  frow(L('تعليمة خطوة واحدة', 'Follows One-Step Instruction'), d.followsOneStep),
  frow(L('تعليمة خطوتين', 'Follows Two-Step Instruction'), d.followsTwoStep),
  frow(L('يستجيب لاسمه', 'Responds When Called By Name'), d.respondsToName),
  frow(L('التواصل البصري', 'Eye Contact'), d.eyeContact),
  frow(L('يشير للأشياء ليريكم', 'Points to Show (not request)'), d.points),
  frow(L('يحضر أشياء لمشاركتكم', 'Brings Things to Share'), d.bringsThing),
  frow(L('ينظر حيث تشيرون', 'Looks Where You Point'), d.looksWhere),
  frow(L('يلعب مع الأطفال', 'Plays With Other Children'), d.playsWithChildren),
  frow(L('اللعب الخيالي', 'Pretend Play'), d.pretendPlay),
  frow(L('يُظهر المودة لأفراد الأسرة', 'Shows Affection to Family'), d.showsAffection),
  frow(L('السلوكيات النمطية', 'Repetitive Behaviors'), d.repetitiveBehaviors),
  frow(L('النشاط أو الاهتمام المفضل', 'Favorite Activity/Interest'), d.favoriteTopic),
].join('')))}

${psec('٩. التعليم', '9. Education',
  ft([
    frow(L('اسم المدرسة أو الحضانة', 'School/Nursery Name'), d.schoolName),
    frow(L('نوع المدرسة', 'School Type'), d.schoolType),
    frow(L('الصف أو الفصل', 'Grade/Class'), d.gradeClass),
    frow(L('ساعات يومياً', 'Hours Per Day'), d.hoursPerDay),
    frow(L('لغة الدراسة', 'Language of Instruction'), d.instructionLanguage),
    frow(L('مدرس ظل', 'Shadow Teacher'), d.shadowTeacher),
    frow(L('ساعات الظل أسبوعياً', 'Shadow Hours/Week'), d.shadowHours),
    frow(L('خطة تعليمية فردية (IEP)', 'IEP / Formal Accommodations'), d.iep),
    frow(L('مخاوف المدرسة أو المعلم', 'Concerns Raised By School'), d.schoolConcerns),
    frow(L('هل غيّر المدرسة', 'Has Child Changed Schools'), d.schoolChanges),
    frow(L('طُلب منه المغادرة أو رُفض', 'Expelled/Refused Admission'), d.expelledOrRefused),
    frow(L('تفاصيل', 'Details'), d.expelledDetails),
  ].join('')) +
  subhdr('الأداء الدراسي', 'Academic Performance') +
  acadHtml
)}

${psec('١٠. المتطلبات الحسية', '10. Sensory Profile',
  sensoryHtml +
  ft([frow(L('ملاحظات حسية إضافية', 'Additional Sensory Notes'), d.sensoryNotes)].join(''))
)}

${psec('١١. التقييمات والتقارير السابقة', '11. Previous Assessments & Reports',
  subhdr('التقييمات السابقة', 'Previous Assessments') +
  dtable(
    [L('التقييم / الاختبار', 'Assessment/Test'), L('التاريخ', 'Date'), L('بواسطة', 'Conducted By'), L('النتيجة أو التشخيص', 'Result/Diagnosis')],
    d.previousAssessments as Record<string, unknown>[]
  ) +
  subhdr('العلاج السابق أو الحالي', 'Previous/Current Therapy') +
  dtable(
    [L('النوع', 'Type'), L('الجهة', 'Provider'), L('بداية', 'Start Date'), L('جلسات أسبوعياً', 'Sessions/Week'), L('مستمر؟', 'Ongoing?')],
    d.previousTherapy as Record<string, unknown>[]
  ) +
  ft([frow(L('سيحضر التقارير السابقة', 'Will Bring Previous Reports'), d.willBringReports)].join(''))
)}

${psec('١٢. الأسرة والبيئة المحيطة', '12. Family & Home Environment',
  subhdr('الإخوة والأخوات', 'Siblings') +
  dtable(
    [L('الاسم', 'Name'), L('العمر', 'Age'), L('أي مخاوف نمائية أو سلوكية', 'Developmental/Behavioral Concerns')],
    d.siblings as Record<string, unknown>[]
  ) +
  ft([
    frow(L('من يعيش في المنزل', 'Who Lives at Home'), d.homeResidents),
    frow(L('وقت الشاشات يومياً', 'Daily Screen Time'), d.screenTime),
    frow(L('روتين يومي ثابت', 'Consistent Daily Routine'), d.dailyRoutine),
    frow(L('أحداث حياتية حديثة', 'Recent Life Events'), d.recentEvents),
    frow(L('تفاصيل الأحداث واستجابة الطفل', 'Event Details & Child\'s Response'), d.recentEventDetails),
    frow(L('اعتبارات ثقافية أو دينية', 'Cultural/Religious Considerations'), d.culturalConsiderations),
  ].join(''))
)}

${psec('١٣. أولويات الأسرة وتوقعاتها', '13. Family Priorities & Expectations', ft([
  frow(L('الهدف الأول (الأهم)', 'Top Goal 1 (most important)'), d.topGoal1),
  frow(L('الهدف الثاني', 'Top Goal 2'), d.topGoal2),
  frow(L('الهدف الثالث', 'Top Goal 3'), d.topGoal3),
  frow(L('ما تأملون أن نقدمه', 'What You Hope We Can Offer'), d.hopeFor),
  frow(L('ما يقلقكم أكثر شيء', 'What Worries You Most'), d.worries),
  frow(L('أيام متاحة أسبوعياً', 'Days/Week Available'), d.daysPerWeek),
  frow(L('الوالدان موافقان على طلب الدعم', 'Both Parents Agree'), d.parentsAgree),
  frow(L('أي شيء آخر', 'Anything Else'), d.additionalInfo),
].join('')))}

${psec('١٤. الموافقة والسياسات', '14. Consent, Confidentiality & Policies', ft([
  frow(L('السرية — المعلومات محفوظة بسرية', 'Confidentiality — Info Kept Confidential'), d.consent_conf1),
  frow(L('استثناءات السرية للسلامة / القانون', 'Confidentiality — Safety/Law Exceptions'), d.consent_conf2),
  frow(L('الموافقة على التقييم', 'Consent to Assessment'), d.consent_assess1),
  frow(L('يؤكد الصلاحية القانونية', 'Confirms Legal Authority'), d.consent_assess2),
  frow(L('سيتسلم تقريراً مكتوباً', 'Will Receive Written Report'), d.consent_assess3),
  frow(L('الموافقة على التواصل مع جهات أخرى', 'Consent to Contact Other Parties'), d.consent_communicate),
  frow(L('الموافقة على التسجيل', 'Recording Consent'), d.consent_recording),
  frow(L('يفهم رسوم الجلسات', 'Understands Session Fees'), d.consent_fees1),
  frow(L('سياسة الإلغاء', 'Cancellation Policy'), d.consent_fees2),
  frow(L('سياسة الغياب المتكرر', 'Repeated Absence Policy'), d.consent_fees3),
  frow(L('الاحتفاظ بالبيانات', 'Data Retention Policy'), d.consent_dataRetention),
  frow(L('اسم ولي الأمر', "Guardian's Name"), d.guardianName),
  frow(L('صلة القرابة بالطفل', 'Relationship to Child'), d.guardianRelation),
  frow(L('التوقيع', 'Signature (typed)'), d.guardianSignature),
  frow(L('التاريخ', 'Date'), d.signatureDate),
  frow(L('توقيع ولي الأمر الثاني', "Second Guardian's Signature"), d.guardian2Signature),
  frow(L('التاريخ', 'Date'), d.signature2Date),
].join('')))}

<div class="footer">
  <span>ذرية — Zurriya Child Development Center</span>
  <span>zurriyacdc@gmail.com &nbsp;·&nbsp; +20 104 158 2668</span>
  <span>${L('سري وخاص', 'Strictly Confidential')}</span>
</div>

</div>
</body>
</html>`;
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const d = await req.json();
    const childName = (d.childFullName as string) || 'غير محدد / Not specified';
    const dateStr = new Date().toLocaleDateString('en-GB');
    const safeChild = childName.replace(/[/\\:*?"<>|]/g, '').trim().substring(0, 40);
    const filename = `Zurriya-Intake-${safeChild}-${new Date().toISOString().split('T')[0]}.html`;

    const emailHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#f2f2f2;padding:20px;margin:0">
<div style="max-width:860px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1)">
<div style="background:#1B5E6E;color:#fff;padding:24px;text-align:center">
  <h1 style="margin:0;font-size:22px;letter-spacing:1px">ذرية — Zurriya</h1>
  <p style="margin:6px 0 0;font-size:13px;opacity:.8">Child Registration &amp; Intake Form / استمارة تسجيل وبيانات الطفل</p>
  <p style="margin:6px 0 0;font-size:12px;opacity:.6">Received: ${new Date().toLocaleString('en-GB')}</p>
</div>
<div style="padding:24px">
${sec('1. Basic Information / البيانات الأساسية', [
  row("Child's Full Name / اسم الطفل", d.childFullName),
  row("Date of Birth / تاريخ الميلاد", d.dob),
  row("Age / العمر", d.age),
  row("Sex / الجنس", d.sex),
  row("Nationality / الجنسية", d.nationality),
  row("National ID / الرقم القومي", d.nationalId),
  row("Home Languages / لغات المنزل", d.homeLanguages),
  row("Other Languages / لغات أخرى", d.otherLanguages),
  row("Referral Source / جهة الإحالة", d.referralSource),
  row("Referring Doctor / الطبيب المحيل", d.referringDoctor),
  row("Completed By / من أكمل الاستمارة", d.completedBy),
  row("Date Completed / تاريخ التعبئة", d.formDate),
].join(''))}
${sec('2. Mother / الأم', [row("Name",d.motherName),row("Age",d.motherAge),row("Occupation",d.motherOccupation),row("Education",d.motherEducation),row("Phone",d.motherPhone),row("Email",d.motherEmail)].join(''))}
${sec('2. Father / الأب', [row("Name",d.fatherName),row("Age",d.fatherAge),row("Occupation",d.fatherOccupation),row("Education",d.fatherEducation),row("Phone",d.fatherPhone),row("Email",d.fatherEmail)].join(''))}
${sec('2. Family & Legal / الوضع الأسري', [row("Marital Status",d.maritalStatus),row("Legal Custody",d.legalCustody),row("Consent Authority",d.consentAuthority),row("Child Lives With",d.childLivesWith),row("Primary Caregiver",d.primaryCaregiver),row("Preferred Contact",d.preferredContact),row("Preferred Report Language",d.preferredReportLang),row("Emergency Contact",d.emergencyName),row("Emergency Relation",d.emergencyRelation),row("Emergency Phone",d.emergencyPhone)].join(''))}
${sec('3. Reason for Visit / سبب الزيارة', [row("Main Concern",d.mainConcern),row("When Noticed",d.whenNoticed),row("Why Now",d.whyNow),row("Main Goal",d.mainGoal),row("Previous Attempts",d.previousAttempts),row("Current Specialists",d.currentSpecialists),row("Specialist Contact",d.specialistContact),row("Most Urgent",d.mostUrgentConcern)].join(''))}
${d.concernRatings && Object.keys(d.concernRatings).length ? sec('3. Concern Ratings / تقييم القلق (١-٥)', Object.entries(d.concernRatings).map(([k,val])=>row(k,val as string)).join('')) : ''}
${sec('4. Pregnancy & Birth / الحمل والولادة', [row("Mother's Age",d.motherAgeAtPregnancy),row("Planned",d.plannedPregnancy),row("Complications",d.pregnancyComplications),row("Complication Types",d.complicationList),row("Complication Details",d.complicationDetails),row("Medications/Substances",d.medications),row("Gestational Age",d.gestationalAge),row("Delivery Type",d.deliveryType),row("C-Section Reason",d.csectionReason),row("Birth Weight",d.birthWeight),row("Apgar Score",d.apgarScore),row("Baby Cried",d.babyCried),row("NICU",d.nicu),row("NICU Details",d.nicuDetails),row("First Month Issues",d.firstMonthIssues),row("Additional Notes",d.pregnancyNotes)].join(''))}
${sec('5. Milestones / مراحل النمو', ['headControl','sitting','crawling','walking','firstWord','twoWords','sentences','toiletDay','toiletNight','feeding','dressing'].map(k=>row(k,`${d[`ms_${k}`]||''}${d[`ms_${k}_notyet`]?' (Not yet)':''}`)).concat([row("Regression",d.skillRegression),row("Regression Details",d.skillRegressionDetails),row("Events During",d.regressionContext)]).join(''))}
${tableSection('6. Diagnoses / التشخيصات',['Diagnosis','Date','Physician/Institution'],d.currentDiagnoses as Record<string,string>[])}
${sec('6. Medical / الطبي', [row("Medical Events",d.medicalEvents),row("Details",d.medicalEventDetails),row("Allergies",d.allergies),row("Hearing Test",d.hearingTest),row("Hearing Result",d.hearingTestResult),row("Vision Test",d.visionTest),row("Vision Result",d.visionTestResult),row("Vaccinations",d.vaccinations),row("Family History",d.familyHistory),row("Family Relation",d.familyHistoryRelation),row("Consanguineous",d.consanguineousMarriage),row("Consanguinity Details",d.consanguineousDetails)].join(''))}
${tableSection('6. Medications / الأدوية',['Medication','Dosage','Prescribed By','Since'],d.currentMedications as Record<string,string>[])}
${sec('7. Behavior / السلوك', [row("Bedtime",d.sleepBedtime),row("Wake Time",d.sleepWakeTime),row("Sleep Hours",d.sleepHours),row("Sleep Issues",d.sleepIssues),row("Eating Habits",d.eatingHabits),row("Food Count",d.foodCount),row("Toilet Training",d.toiletTraining),row("When Refused",d.wantsMotivator),row("Before Behavior",d.behaviorBefore),row("After Behavior",d.behaviorAfter),row("Safety Concerns",d.safetyConcerns),row("Safety Details",d.safetyDetails)].join(''))}
${d.challengingBehaviors?.length ? tableSection('7. Challenging Behaviors / السلوكيات الصعبة',['Behavior','How Often','How Long','Severity 1-5'],d.challengingBehaviors) : ''}
${sec('8. Communication / التواصل', [row("Methods",d.communicationMethods),row("Word Count",d.wordCount),row("Longest Sentence",d.longestSentence),row("One-Step Instruction",d.followsOneStep),row("Two-Step Instruction",d.followsTwoStep),row("Responds to Name",d.respondsToName),row("Eye Contact",d.eyeContact),row("Points to Show",d.points),row("Brings Things",d.bringsThing),row("Looks Where Pointed",d.looksWhere),row("Plays With Children",d.playsWithChildren),row("Pretend Play",d.pretendPlay),row("Shows Affection",d.showsAffection),row("Repetitive Behaviors",d.repetitiveBehaviors),row("Favorite Activity",d.favoriteTopic)].join(''))}
${sec('9. Education / التعليم', [row("School Name",d.schoolName),row("School Type",d.schoolType),row("Grade/Class",d.gradeClass),row("Hours/Day",d.hoursPerDay),row("Instruction Language",d.instructionLanguage),row("Shadow Teacher",d.shadowTeacher),row("Shadow Hours/Week",d.shadowHours),row("IEP",d.iep),row("School Concerns",d.schoolConcerns),row("School Changes",d.schoolChanges),row("Expelled/Refused",d.expelledOrRefused),row("Details",d.expelledDetails)].join(''))}
${d.sensoryProfile && Object.keys(d.sensoryProfile).length ? sec('10. Sensory / الحسي', Object.entries(d.sensoryProfile).map(([k,val])=>row(k,val as string)).join('')) : ''}
${d.sensoryNotes ? sec('10. Sensory Notes', row("Notes",d.sensoryNotes)) : ''}
${tableSection('11. Previous Assessments / التقييمات السابقة',['Assessment','Date','Conducted By','Result'],d.previousAssessments as Record<string,string>[])}
${tableSection('11. Therapy / العلاج',['Type','Provider','Start Date','Sessions/Week','Ongoing'],d.previousTherapy as Record<string,string>[])}
${sec('11. Reports', row("Will Bring Reports",d.willBringReports))}
${tableSection('12. Siblings / الإخوة',['Name','Age','Concerns'],d.siblings as Record<string,string>[])}
${sec('12. Home / المنزل', [row("Who Lives at Home",d.homeResidents),row("Screen Time",d.screenTime),row("Daily Routine",d.dailyRoutine),row("Recent Events",d.recentEvents),row("Event Details",d.recentEventDetails),row("Cultural/Religious",d.culturalConsiderations)].join(''))}
${sec('13. Priorities / الأولويات', [row("Goal 1",d.topGoal1),row("Goal 2",d.topGoal2),row("Goal 3",d.topGoal3),row("Hopes",d.hopeFor),row("Worries",d.worries),row("Days/Week",d.daysPerWeek),row("Both Parents Agree",d.parentsAgree),row("Anything Else",d.additionalInfo)].join(''))}
${sec('14. Consent / الموافقة', [row("Confidentiality 1",d.consent_conf1),row("Confidentiality 2",d.consent_conf2),row("Consent to Assessment 1",d.consent_assess1),row("Consent to Assessment 2",d.consent_assess2),row("Consent to Assessment 3",d.consent_assess3),row("Contact Other Parties",d.consent_communicate),row("Recording",d.consent_recording),row("Fees",d.consent_fees1),row("Cancellation",d.consent_fees2),row("Absence",d.consent_fees3),row("Data Retention",d.consent_dataRetention),row("Guardian Name",d.guardianName),row("Relationship",d.guardianRelation),row("Signature",d.guardianSignature),row("Date",d.signatureDate),row("Second Signature",d.guardian2Signature),row("Second Date",d.signature2Date)].join(''))}
</div>
<div style="background:#1B5E6E;color:#fff;text-align:center;padding:12px;font-size:12px;opacity:.85">
  ذرية — Zurriya Child Development Center · zurriyacdc@gmail.com · +20 104 158 2668
</div>
</div>
</body></html>`;

    const printDoc = buildPrintDoc(d);

    await transporter.sendMail({
      from: `"Zurriya Intake Form" <${process.env.GMAIL_USER}>`,
      to: 'zurriyacdc@gmail.com',
      subject: `📋 Intake Form — ${childName} — ${dateStr}`,
      html: emailHtml,
      attachments: [{
        filename,
        content: Buffer.from(printDoc, 'utf8'),
        contentType: 'text/html; charset=utf-8',
      }],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Intake email error:', err);
    return NextResponse.json({ error: 'Failed to send intake form' }, { status: 500 });
  }
}
