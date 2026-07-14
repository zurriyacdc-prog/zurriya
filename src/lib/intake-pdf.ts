import path from 'path';

const PDFDocument = require('pdfkit') as typeof import('pdfkit');

const TEAL  = '#1B5E6E';
const LTEAL = '#e0f0f3';
const GRAY  = '#888';
const BLACK = '#1a1a1a';
const FONT  = path.join(process.cwd(), 'public/fonts/Amiri-Regular.ttf');

const LABELS: Record<string, string> = {
  yes: 'Yes', no: 'No', idk: "Don't know", partial: 'Partially', unsure: 'Not sure',
  male: 'Male', female: 'Female',
  married: 'Married', separated: 'Separated', divorced: 'Divorced', widowed: 'Widowed', other: 'Other',
  phone: 'Phone call', whatsapp: 'WhatsApp', email: 'Email',
  ar: 'Arabic', en: 'English', both: 'Both',
  vaginal: 'Vaginal', assisted: 'Assisted', 'planned-cs': 'Planned C-section', 'emergency-cs': 'Emergency C-section',
  independent: 'Fully independent', dayonly: 'Daytime only', diapers: 'Uses diapers', resists: 'Resists toilet',
  public: 'Public', private: 'Private/International',
  inclusion: 'Inclusion', special: 'Special education', home: 'Homeschooling', none: 'None',
  cooperative: 'Cooperatively', parallel: 'Parallel play', watches: 'Only watches', avoids: 'Avoids them',
  consistent: 'Consistent', fleeting: 'Fleeting', rare: 'Rare', absent: 'Absent',
  always: 'Always', sometimes: 'Sometimes', never: 'Never', limited: 'Limited',
  above: 'Above expected', as: 'As expected', below: 'Below expected', struggling: 'Clearly struggling',
  over: 'Over-responsive', under: 'Under-responsive', clinical: 'Clinical review only', training: 'Anonymized for training',
  jaundice: 'Jaundice', seizures: 'Seizures', breathing: 'Breathing difficulty', feeding: 'Feeding difficulty',
  hospitalization: 'Hospitalization', surgery: 'Surgery', headinjury: 'Head injury',
  autism: 'Autism', adhd: 'ADHD', intellectual: 'Intellectual disability', learning: 'Learning difficulties',
  spoken: 'Spoken words/sentences', singlewords: 'Single words', sounds: 'Sounds only', gestures: 'Gestures/pointing',
  flapping: 'Hand flapping', rocking: 'Rocking', spinning: 'Spinning', echolalia: 'Echolalia',
};

function fv(x: unknown): string {
  if (x === null || x === undefined || x === '') return '—';
  if (typeof x === 'boolean') return x ? 'Yes' : 'No';
  if (Array.isArray(x)) {
    const mapped = x.filter(Boolean).map((i) => LABELS[String(i)] || String(i));
    return mapped.join(', ') || '—';
  }
  if (typeof x === 'string') return LABELS[x] || x || '—';
  return '—';
}

interface BuildState {
  doc: InstanceType<typeof PDFDocument>;
  pageW: number;
  margin: number;
  col: number;
}

function sectionHeader(s: BuildState, title: string) {
  s.doc.moveDown(0.4);
  const y = s.doc.y;
  s.doc.rect(s.margin, y, s.pageW, 16).fill(TEAL);
  s.doc.fillColor('#fff').fontSize(9.5).font(FONT)
    .text(title, s.margin + 6, y + 3, { width: s.pageW - 10 });
  s.doc.fillColor(BLACK).moveDown(0.1);
}

function subHeader(s: BuildState, title: string) {
  s.doc.moveDown(0.2);
  const y = s.doc.y;
  s.doc.rect(s.margin, y, s.pageW, 13).fill(LTEAL);
  s.doc.fillColor(TEAL).fontSize(8.5).font(FONT)
    .text(title, s.margin + 6, y + 2.5, { width: s.pageW - 10 });
  s.doc.fillColor(BLACK).moveDown(0.1);
}

function row(s: BuildState, label: string, value: unknown) {
  const val = fv(value);
  if (val === '—' && !label.includes('*')) return;
  const lblW = 140;
  const valW = s.col - lblW - 8;
  const y = s.doc.y;
  s.doc.fontSize(8).font(FONT)
    .fillColor(GRAY).text(label, s.margin, y, { width: lblW, continued: false })
    .fillColor(BLACK).text(val, s.margin + lblW + 4, y, { width: valW });
  s.doc.moveDown(0.08);
}

function tableRows(
  s: BuildState,
  headers: string[],
  rows: Record<string, unknown>[] | undefined,
) {
  if (!rows?.length) return;
  const colW = s.col / headers.length;
  let y = s.doc.y;
  s.doc.rect(s.margin, y, s.col, 13).fill('#dff0f3');
  headers.forEach((h, i) => {
    s.doc.fillColor(TEAL).fontSize(7.5).font(FONT)
      .text(h, s.margin + i * colW + 3, y + 2.5, { width: colW - 6 });
  });
  s.doc.fillColor(BLACK).moveDown(0.05);

  rows.forEach((r, ri) => {
    const vals = Object.values(r);
    y = s.doc.y;
    if (ri % 2 === 1) s.doc.rect(s.margin, y, s.col, 12).fill('#f7fafa');
    vals.forEach((c, i) => {
      s.doc.fillColor(BLACK).fontSize(7.5).font(FONT)
        .text(String(c || '—'), s.margin + i * colW + 3, y + 2, { width: colW - 6 });
    });
    s.doc.moveDown(0.05);
  });
}

export function buildIntakePdf(d: Record<string, unknown>): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({ size: 'A4', margin: 40, compress: true, info: {
      Title: `Zurriya Intake — ${d.childFullName || 'Unknown'}`,
      Author: 'Zurriya CDC',
    }});
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.registerFont('Amiri', FONT);

    const margin = 40;
    const pageW  = doc.page.width - margin * 2;
    const col    = pageW;
    const s: BuildState = { doc, pageW, margin, col };

    const childName = String(d.childFullName || 'Not specified');
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

    // ─── Cover header ────────────────────────────────────────────────────────
    doc.rect(margin, 40, pageW, 56).fill(TEAL);
    doc.fillColor('#fff')
      .font(FONT).fontSize(20).text('Zurriya — ذرية', margin + 10, 50, { width: pageW })
      .fontSize(10).text('Child Registration & Intake Form / استمارة تسجيل وبيانات الطفل', margin + 10, 74)
      .fontSize(8.5).fillColor('rgba(255,255,255,0.75)')
      .text(`Child: ${childName}     Received: ${today}`, margin + 10, 88);
    doc.fillColor(BLACK);
    doc.y = 40 + 56 + 8;

    // ─── 1. Basic Information ─────────────────────────────────────────────────
    sectionHeader(s, '1. Basic Information / البيانات الأساسية');
    row(s, "Child's Full Name", d.childFullName);
    row(s, 'Date of Birth', d.dob);
    row(s, 'Age', d.age);
    row(s, 'Sex', d.sex);
    row(s, 'Nationality', d.nationality);
    row(s, 'National ID / Passport', d.nationalId);
    row(s, 'Home Languages', d.homeLanguages);
    row(s, 'Other Languages', d.otherLanguages);
    row(s, 'Referral Source', d.referralSource);
    row(s, 'Referring Doctor', d.referringDoctor);
    row(s, 'Completed By', d.completedBy);
    row(s, 'Date Completed', d.formDate);

    // ─── 2. Parents & Family ─────────────────────────────────────────────────
    sectionHeader(s, '2. Parents & Family / الوالدان والوضع الأسري');
    subHeader(s, 'Mother / الأم');
    row(s, 'Full Name', d.motherName);   row(s, 'Age', d.motherAge);
    row(s, 'Occupation', d.motherOccupation); row(s, 'Education', d.motherEducation);
    row(s, 'Mobile', d.motherPhone);     row(s, 'Email', d.motherEmail);
    subHeader(s, 'Father / الأب');
    row(s, 'Full Name', d.fatherName);   row(s, 'Age', d.fatherAge);
    row(s, 'Occupation', d.fatherOccupation); row(s, 'Education', d.fatherEducation);
    row(s, 'Mobile', d.fatherPhone);     row(s, 'Email', d.fatherEmail);
    subHeader(s, 'Family & Legal Status / الوضع الأسري والقانوني');
    row(s, 'Marital Status', d.maritalStatus); row(s, 'Legal Custody', d.legalCustody);
    row(s, 'Consent Authority', d.consentAuthority); row(s, 'Child Lives With', d.childLivesWith);
    row(s, 'Primary Caregiver', d.primaryCaregiver); row(s, 'Caregiver Notes', d.caregiverNote);
    row(s, 'Preferred Contact', d.preferredContact); row(s, 'Report Language', d.preferredReportLang);
    subHeader(s, 'Emergency Contact / جهة اتصال الطوارئ');
    row(s, 'Name', d.emergencyName); row(s, 'Relationship', d.emergencyRelation); row(s, 'Mobile', d.emergencyPhone);

    // ─── 3. Reason for Visit ─────────────────────────────────────────────────
    sectionHeader(s, '3. Reason for Visit / سبب الزيارة');
    row(s, 'Main Concern', d.mainConcern); row(s, 'When First Noticed', d.whenNoticed);
    row(s, 'Why Seeking Help Now', d.whyNow); row(s, 'Main Goal', d.mainGoal);
    row(s, 'Previous Attempts', d.previousAttempts); row(s, 'Currently Seeing Specialists', d.currentSpecialists);
    row(s, 'Specialist Contact', d.specialistContact); row(s, 'Most Urgent Area', d.mostUrgentConcern);
    const ratings = (d.concernRatings as Record<string, string>) || {};
    if (Object.keys(ratings).length) {
      subHeader(s, 'Concern Ratings (1 = no concern, 5 = severe)');
      Object.entries(ratings).forEach(([k, v]) => row(s, k, v));
    }

    // ─── 4. Pregnancy & Birth ────────────────────────────────────────────────
    sectionHeader(s, '4. Pregnancy & Birth / الحمل والولادة');
    row(s, "Mother's Age During Pregnancy", d.motherAgeAtPregnancy);
    row(s, 'Planned Pregnancy', d.plannedPregnancy); row(s, 'Complications', d.pregnancyComplications);
    row(s, 'Complication Types', d.complicationList); row(s, 'Complication Details', d.complicationDetails);
    row(s, 'Medications/Substances', d.medications); row(s, 'Gestational Age (weeks)', d.gestationalAge);
    row(s, 'Delivery Type', d.deliveryType); row(s, 'C-Section Reason', d.csectionReason);
    row(s, 'Birth Weight', d.birthWeight); row(s, 'Apgar Score', d.apgarScore);
    row(s, 'Baby Cried Immediately', d.babyCried); row(s, 'NICU', d.nicu);
    row(s, 'NICU Details', d.nicuDetails); row(s, 'First Month Issues', d.firstMonthIssues);
    row(s, 'Additional Notes', d.pregnancyNotes);

    // ─── 5. Developmental Milestones ─────────────────────────────────────────
    sectionHeader(s, '5. Developmental Milestones / مراحل النمو');
    const MS = [
      ['headControl', 'Head Control'], ['sitting', 'Sitting without support'],
      ['crawling', 'Crawling'], ['walking', 'Walking independently'],
      ['firstWord', 'First meaningful word'], ['twoWords', 'Two-word sentence'],
      ['sentences', 'Full sentences'], ['toiletDay', 'Daytime toilet control'],
      ['toiletNight', 'Nighttime toilet control'], ['feeding', 'Self-feeding with spoon'],
      ['dressing', 'Dressing self'],
    ];
    MS.forEach(([k, label]) => {
      const age   = d[`ms_${k}`] as string | undefined;
      const notYet = d[`ms_${k}_notyet`] as boolean | undefined;
      row(s, label!, notYet ? 'Not yet' : (age || '—'));
    });
    row(s, 'Skill Regression', d.skillRegression);
    row(s, 'Regression Details', d.skillRegressionDetails);
    row(s, 'Events During That Period', d.regressionContext);

    // ─── 6. Medical History ──────────────────────────────────────────────────
    sectionHeader(s, '6. Medical History / التاريخ الطبي');
    subHeader(s, 'Current Diagnoses');
    tableRows(s, ['Diagnosis', 'Date', 'Physician / Institution'], d.currentDiagnoses as Record<string, unknown>[]);
    row(s, 'Medical Events', d.medicalEvents); row(s, 'Event Details', d.medicalEventDetails);
    row(s, 'Allergies', d.allergies); row(s, 'Hearing Test', d.hearingTest);
    row(s, 'Hearing Result & Date', d.hearingTestResult); row(s, 'Vision Test', d.visionTest);
    row(s, 'Vision Result & Date', d.visionTestResult); row(s, 'Vaccinations Up to Date', d.vaccinations);
    subHeader(s, 'Current Medications');
    tableRows(s, ['Medication', 'Dosage', 'Prescribed By', 'Since'], d.currentMedications as Record<string, unknown>[]);
    row(s, 'Family History', d.familyHistory); row(s, 'Relationship', d.familyHistoryRelation);
    row(s, 'Consanguineous Marriage', d.consanguineousMarriage); row(s, 'Degree of Relation', d.consanguineousDetails);

    // ─── 7. Behavior ─────────────────────────────────────────────────────────
    sectionHeader(s, '7. Behavior / السلوك');
    subHeader(s, 'Sleep');
    row(s, 'Usual Bedtime', d.sleepBedtime); row(s, 'Wake Time', d.sleepWakeTime);
    row(s, 'Total Sleep Hours', d.sleepHours); row(s, 'Sleep Issues', d.sleepIssues);
    subHeader(s, 'Food & Eating');
    row(s, 'Eating Habits', d.eatingHabits); row(s, 'Approx. # Accepted Foods', d.foodCount);
    subHeader(s, 'Toilet Training');
    row(s, 'Status', d.toiletTraining);
    subHeader(s, 'Challenging Behaviors');
    tableRows(s, ['Behavior', 'How Often', 'How Long', 'Severity 1-5'], d.challengingBehaviors as Record<string, unknown>[]);
    row(s, 'When Refused Something', d.wantsMotivator); row(s, 'Before Challenging Behavior', d.behaviorBefore);
    row(s, 'After Challenging Behavior', d.behaviorAfter); row(s, 'Safety Concerns', d.safetyConcerns);
    row(s, 'Safety Details', d.safetyDetails);

    // ─── 8. Communication ────────────────────────────────────────────────────
    sectionHeader(s, '8. Communication & Social Interaction / التواصل');
    row(s, 'Communication Methods', d.communicationMethods); row(s, 'Approximate Word Count', d.wordCount);
    row(s, 'Longest Sentence', d.longestSentence); row(s, 'Follows One-Step Instruction', d.followsOneStep);
    row(s, 'Follows Two-Step Instruction', d.followsTwoStep); row(s, 'Responds When Called', d.respondsToName);
    row(s, 'Eye Contact', d.eyeContact); row(s, 'Points to Show', d.points);
    row(s, 'Brings Things to Share', d.bringsThing); row(s, 'Looks Where You Point', d.looksWhere);
    row(s, 'Plays With Other Children', d.playsWithChildren); row(s, 'Pretend Play', d.pretendPlay);
    row(s, 'Shows Affection to Family', d.showsAffection); row(s, 'Repetitive Behaviors', d.repetitiveBehaviors);
    row(s, 'Favorite Activity/Interest', d.favoriteTopic);

    // ─── 9. Education ────────────────────────────────────────────────────────
    sectionHeader(s, '9. Education / التعليم');
    row(s, 'School/Nursery Name', d.schoolName); row(s, 'School Type', d.schoolType);
    row(s, 'Grade/Class', d.gradeClass); row(s, 'Hours Per Day', d.hoursPerDay);
    row(s, 'Language of Instruction', d.instructionLanguage); row(s, 'Shadow Teacher', d.shadowTeacher);
    row(s, 'Shadow Hours/Week', d.shadowHours); row(s, 'IEP/Accommodations', d.iep);
    row(s, 'School Concerns', d.schoolConcerns); row(s, 'Changed Schools', d.schoolChanges);
    row(s, 'Expelled/Refused Admission', d.expelledOrRefused); row(s, 'Details', d.expelledDetails);
    const acad = (d.academicPerformance as Record<string, string>) || {};
    if (Object.keys(acad).length) {
      subHeader(s, 'Academic Performance');
      const ACAD = ['reading','writing','math','routine','peers'];
      ACAD.forEach((k) => acad[k] && row(s, k.charAt(0).toUpperCase() + k.slice(1), acad[k]));
    }

    // ─── 10. Sensory Profile ─────────────────────────────────────────────────
    sectionHeader(s, '10. Sensory Profile / المتطلبات الحسية');
    const sensory = (d.sensoryProfile as Record<string, string>) || {};
    const SENS = ['sound','light','touch','foodTexture','taste','smell','movement','pain','temperature'];
    SENS.forEach((k) => sensory[k] && row(s, k.charAt(0).toUpperCase() + k.slice(1), sensory[k]));
    row(s, 'Additional Sensory Notes', d.sensoryNotes);

    // ─── 11. Previous Assessments ────────────────────────────────────────────
    sectionHeader(s, '11. Previous Assessments & Reports / التقييمات السابقة');
    subHeader(s, 'Previous Assessments');
    tableRows(s, ['Assessment/Test', 'Date', 'Conducted By', 'Result/Diagnosis'], d.previousAssessments as Record<string, unknown>[]);
    subHeader(s, 'Previous/Current Therapy');
    tableRows(s, ['Type', 'Provider', 'Start Date', 'Sessions/Week', 'Ongoing?'], d.previousTherapy as Record<string, unknown>[]);
    row(s, 'Will Bring Previous Reports', d.willBringReports);

    // ─── 12. Family & Home ───────────────────────────────────────────────────
    sectionHeader(s, '12. Family & Home Environment / الأسرة والبيئة');
    subHeader(s, 'Siblings');
    tableRows(s, ['Name', 'Age', 'Developmental/Behavioral Concerns'], d.siblings as Record<string, unknown>[]);
    row(s, 'Who Lives at Home', d.homeResidents); row(s, 'Daily Screen Time', d.screenTime);
    row(s, 'Consistent Daily Routine', d.dailyRoutine); row(s, 'Recent Life Events', d.recentEvents);
    row(s, 'Event Details & Child\'s Response', d.recentEventDetails);
    row(s, 'Cultural/Religious Considerations', d.culturalConsiderations);

    // ─── 13. Priorities ──────────────────────────────────────────────────────
    sectionHeader(s, '13. Family Priorities & Expectations / الأولويات');
    row(s, 'Top Goal 1 (most important)', d.topGoal1); row(s, 'Top Goal 2', d.topGoal2);
    row(s, 'Top Goal 3', d.topGoal3); row(s, 'What You Hope We Can Offer', d.hopeFor);
    row(s, 'What Worries You Most', d.worries); row(s, 'Days/Week Available', d.daysPerWeek);
    row(s, 'Both Parents Agree', d.parentsAgree); row(s, 'Anything Else', d.additionalInfo);

    // ─── 14. Consent ─────────────────────────────────────────────────────────
    sectionHeader(s, '14. Consent, Confidentiality & Policies / الموافقة');
    row(s, 'Confidentiality 1', d.consent_conf1); row(s, 'Confidentiality 2', d.consent_conf2);
    row(s, 'Consent to Assessment 1', d.consent_assess1); row(s, 'Consent to Assessment 2', d.consent_assess2);
    row(s, 'Consent to Assessment 3', d.consent_assess3); row(s, 'Contact Other Parties', d.consent_communicate);
    row(s, 'Recording Consent', d.consent_recording); row(s, 'Fees', d.consent_fees1);
    row(s, 'Cancellation Policy', d.consent_fees2); row(s, 'Repeated Absence', d.consent_fees3);
    row(s, 'Data Retention', d.consent_dataRetention);
    row(s, 'Guardian Name', d.guardianName); row(s, 'Relationship to Child', d.guardianRelation);
    row(s, 'Signature (typed)', d.guardianSignature); row(s, 'Date', d.signatureDate);
    row(s, 'Second Guardian Signature', d.guardian2Signature); row(s, 'Date', d.signature2Date);

    // ─── Footer ──────────────────────────────────────────────────────────────
    doc.moveDown(0.8);
    doc.rect(margin, doc.y, pageW, 1).fill(TEAL);
    doc.moveDown(0.3);
    doc.fillColor(GRAY).fontSize(7.5).font(FONT)
      .text('Zurriya Child Development Center  ·  zurriyacdc@gmail.com  ·  +20 104 158 2668  ·  Strictly Confidential', margin, doc.y, { align: 'center', width: pageW });

    doc.end();
  });
}
