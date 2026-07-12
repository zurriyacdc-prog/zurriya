// ─── Zurriya Portal — Mock Data ──────────────────────────────────────────────
// Replace with Supabase queries when backend is wired up.

export type Lang = 'en' | 'ar';

// ─── Child ────────────────────────────────────────────────────────────────────

export const CHILD = {
  id:        'ZR-00012',
  nameEn:    'Omar Youssef',
  nameAr:    'عمر يوسف',
  age:       6,
  genderEn:  'Male',
  genderAr:  'ذكر',
  photo:     '/mock/child-omar.jpg',
  diagnosisEn: 'Autism Spectrum Disorder (ASD)',
  diagnosisAr: 'اضطراب طيف التوحد',
  programEn:   'Social Communication & Play Skills',
  programAr:   'التواصل الاجتماعي ومهارات اللعب',
  startDate:   '12 Mar 2024',
  startDateAr: '١٢ مارس ٢٠٢٤',
  statusEn:    'Active',
  statusAr:    'نشط',
  therapist:   {
    nameEn: 'Dr. Sara Mahmoud',
    nameAr: 'د. سارة محمود',
    titleEn: 'BCBA, QBA',
    titleAr: 'محللة سلوك معتمدة',
    photo:  '/mock/therapist-sara.jpg',
  },
  overallProgress: 72,
  progressByDomain: [
    { domainEn: 'Communication',  domainAr: 'التواصل',       pct: 75 },
    { domainEn: 'Social Skills',  domainAr: 'المهارات الاجتماعية', pct: 70 },
    { domainEn: 'Behavior',       domainAr: 'السلوك',         pct: 65 },
    { domainEn: 'Daily Living',   domainAr: 'الحياة اليومية', pct: 80 },
  ],
  statsEn: { activeGoals: 12, sessions: 18, reports: 6, completedGoals: 8 },
  statsAr: { activeGoals: '١٢', sessions: '١٨', reports: '٦', completedGoals: '٨' },
  recentUpdateEn: 'Great improvement in initiating conversation and play interaction.',
  recentUpdateAr: 'تحسن ملحوظ في بدء المحادثة والتفاعل في اللعب.',
};

// ─── Journey Timeline ─────────────────────────────────────────────────────────

export type TimelineEvent = {
  id: string;
  date: string;
  dateAr: string;
  typeEn: string;
  typeAr: string;
  typeColor: 'teal' | 'coral' | 'sage' | 'gold';
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
};

export const TIMELINE: TimelineEvent[] = [
  {
    id: 't1',
    date: 'May 20, 2024',   dateAr: '٢٠ مايو ٢٠٢٤',
    typeEn: 'Goal Achieved', typeAr: 'هدف محقق', typeColor: 'sage',
    titleEn: 'Goal Achieved',        titleAr: 'تم تحقيق الهدف',
    descEn:  'Omar can now greet others independently.',
    descAr:  'يستطيع عمر الآن تحية الآخرين بشكل مستقل.',
  },
  {
    id: 't2',
    date: 'May 10, 2024',   dateAr: '١٠ مايو ٢٠٢٤',
    typeEn: 'New Skill',     typeAr: 'مهارة جديدة', typeColor: 'teal',
    titleEn: 'New Skill Introduced',  titleAr: 'مهارة جديدة أضيفت',
    descEn:  'Working on turn-taking during play.',
    descAr:  'العمل على التناوب خلال اللعب.',
  },
  {
    id: 't3',
    date: 'May 2, 2024',    dateAr: '٢ مايو ٢٠٢٤',
    typeEn: 'Milestone',     typeAr: 'معلم بارز', typeColor: 'coral',
    titleEn: 'Session Milestone',     titleAr: 'معلم الجلسات',
    descEn:  'Completed 15 sessions!',
    descAr:  'اكتمل ١٥ جلسة!',
  },
  {
    id: 't4',
    date: 'Apr 28, 2024',   dateAr: '٢٨ أبريل ٢٠٢٤',
    typeEn: 'Assessment',    typeAr: 'تقييم', typeColor: 'gold',
    titleEn: 'Assessment Completed',  titleAr: 'اكتمل التقييم',
    descEn:  'VB-MAPP Assessment completed.',
    descAr:  'اكتمل تقييم VB-MAPP.',
  },
  {
    id: 't5',
    date: 'Apr 15, 2024',   dateAr: '١٥ أبريل ٢٠٢٤',
    typeEn: 'New Goal',      typeAr: 'هدف جديد', typeColor: 'teal',
    titleEn: 'New Goal Added',        titleAr: 'هدف جديد أضيف',
    descEn:  'Improve eye contact during interaction.',
    descAr:  'تحسين التواصل البصري أثناء التفاعل.',
  },
  {
    id: 't6',
    date: 'Mar 20, 2024',   dateAr: '٢٠ مارس ٢٠٢٤',
    typeEn: 'Treatment Plan', typeAr: 'خطة العلاج', typeColor: 'teal',
    titleEn: 'Treatment Plan Created', titleAr: 'إنشاء خطة العلاج',
    descEn:  'Initial treatment plan established with 12 goals.',
    descAr:  'وُضعت خطة العلاج الأولية مع ١٢ هدفاً.',
  },
  {
    id: 't7',
    date: 'Mar 12, 2024',   dateAr: '١٢ مارس ٢٠٢٤',
    typeEn: 'Intake',        typeAr: 'تسجيل', typeColor: 'sage',
    titleEn: 'Intake Completed',      titleAr: 'اكتمال التسجيل',
    descEn:  'Omar joined the Zurriya family.',
    descAr:  'انضم عمر إلى عائلة ذرية.',
  },
];

// ─── Goals / Treatment Plan ───────────────────────────────────────────────────

export type Goal = {
  id: string;
  colorClass: string;
  iconBg: string;
  emoji: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  pct: number;
  objectives: { textEn: string; textAr: string; done: boolean }[];
};

export const LONG_TERM_GOALS: Goal[] = [
  {
    id: 'g1', colorClass: 'bg-teal-pale', iconBg: 'bg-teal', emoji: '💬',
    titleEn: 'Improve Communication', titleAr: 'تحسين التواصل',
    descEn:  'Omar will use functional communication to express needs and wants.',
    descAr:  'سيستخدم عمر التواصل الوظيفي للتعبير عن احتياجاته ورغباته.',
    pct: 75,
    objectives: [
      { textEn: 'Use 10 functional words across 3 settings.',         textAr: 'استخدام ١٠ كلمات وظيفية في ٣ بيئات.', done: true },
      { textEn: 'Use a 2-word phrase to request preferred items.',     textAr: 'استخدام عبارة من كلمتين لطلب العناصر المفضلة.', done: true },
      { textEn: 'Answer simple WH questions with 80% accuracy.',      textAr: 'الإجابة على أسئلة بسيطة بدقة ٨٠٪.', done: true },
      { textEn: 'Initiate communication in different situations.',     textAr: 'بدء التواصل في مواقف مختلفة.', done: false },
    ],
  },
  {
    id: 'g2', colorClass: 'bg-sage-pale', iconBg: 'bg-sage', emoji: '🤝',
    titleEn: 'Enhance Social Skills',  titleAr: 'تعزيز المهارات الاجتماعية',
    descEn:  'Omar will engage in social interactions with peers and adults.',
    descAr:  'سيشارك عمر في التفاعلات الاجتماعية مع الأقران والبالغين.',
    pct: 60,
    objectives: [
      { textEn: 'Greet peers spontaneously.',   textAr: 'تحية الأقران تلقائياً.', done: true },
      { textEn: 'Initiate parallel play.',       textAr: 'بدء اللعب المتوازي.', done: false },
      { textEn: 'Take turns in a group game.',   textAr: 'التناوب في لعبة جماعية.', done: false },
    ],
  },
  {
    id: 'g3', colorClass: 'bg-coral-pale', iconBg: 'bg-coral', emoji: '⭐',
    titleEn: 'Increase Independence',  titleAr: 'تعزيز الاستقلالية',
    descEn:  'Omar will complete daily living tasks with minimal support.',
    descAr:  'سيُنجز عمر مهام الحياة اليومية بدعم أدنى.',
    pct: 75,
    objectives: [
      { textEn: 'Dress independently.',                  textAr: 'الارتداء باستقلالية.', done: true },
      { textEn: 'Unpack school bag without prompting.',  textAr: 'تفريغ الحقيبة المدرسية دون تذكير.', done: false },
    ],
  },
];

export const SHORT_TERM_GOALS: Goal[] = [
  {
    id: 'sg1', colorClass: 'bg-gold-pale', iconBg: 'bg-gold', emoji: '👁️',
    titleEn: 'Eye Contact During Interaction', titleAr: 'التواصل البصري أثناء التفاعل',
    descEn:  'Maintain eye contact for 3+ seconds when spoken to.',
    descAr:  'الحفاظ على التواصل البصري لمدة ٣ ثوانٍ أو أكثر عند التحدث إليه.',
    pct: 50,
    objectives: [
      { textEn: 'Look at speaker when name is called.',  textAr: 'النظر إلى المتحدث عند مناداة الاسم.', done: true },
      { textEn: 'Maintain contact in structured play.',  textAr: 'الحفاظ على التواصل في اللعب المنظم.', done: false },
    ],
  },
];

// ─── Reports ──────────────────────────────────────────────────────────────────

export type Report = {
  id: string;
  type: 'assessment' | 'report' | 'document';
  ext: string;
  nameEn: string;
  nameAr: string;
  date: string;
  dateAr: string;
  size: string;
  color: string;
};

export const REPORTS: Report[] = [
  { id: 'r1', type: 'assessment', ext: 'PDF', nameEn: 'VB-MAPP Assessment',      nameAr: 'تقييم VB-MAPP',           date: 'May 2024', dateAr: 'مايو ٢٠٢٤',   size: '2.4 MB', color: 'text-coral'   },
  { id: 'r2', type: 'report',     ext: 'PDF', nameEn: 'Progress Report – Q2',     nameAr: 'تقرير التقدم – الربع الثاني', date: 'Apr 2024', dateAr: 'أبريل ٢٠٢٤', size: '1.8 MB', color: 'text-coral'   },
  { id: 'r3', type: 'report',     ext: 'PDF', nameEn: 'Session Summary – April',  nameAr: 'ملخص الجلسة – أبريل',     date: 'Apr 2024', dateAr: 'أبريل ٢٠٢٤', size: '0.9 MB', color: 'text-coral'   },
  { id: 'r4', type: 'document',   ext: 'PDF', nameEn: 'IEP Plan',                 nameAr: 'خطة التعليم الفردية',      date: 'Mar 2024', dateAr: 'مارس ٢٠٢٤',  size: '3.1 MB', color: 'text-coral'   },
  { id: 'r5', type: 'assessment', ext: 'PDF', nameEn: 'Behavior Assessment',      nameAr: 'تقييم السلوك',             date: 'Mar 2024', dateAr: 'مارس ٢٠٢٤',  size: '1.6 MB', color: 'text-coral'   },
  { id: 'r6', type: 'assessment', ext: 'PDF', nameEn: 'Sensory Profile 2',        nameAr: 'الملف الحسي ٢',            date: 'Mar 2024', dateAr: 'مارس ٢٠٢٤',  size: '2.0 MB', color: 'text-teal'    },
];

// ─── Sessions ─────────────────────────────────────────────────────────────────

export type Session = {
  id: string;
  date: string;
  dateAr: string;
  time: string;
  therapistEn: string;
  therapistAr: string;
  typeEn: string;
  typeAr: string;
  engagementScore: number;
  noteEn: string;
  noteAr: string;
  durationMin: number;
};

export const SESSIONS: Session[] = [
  { id: 's1', date: 'May 20, 2024', dateAr: '٢٠ مايو ٢٠٢٤',  time: '10:00 AM', therapistEn: 'Dr. Sara Mahmoud', therapistAr: 'د. سارة محمود', typeEn: 'Individual Therapy', typeAr: 'علاج فردي', engagementScore: 4.5, noteEn: 'Omar was more engaged today and used spontaneous phrases during play. Great progress in requesting items.', noteAr: 'كان عمر أكثر تفاعلاً اليوم واستخدم عبارات تلقائية أثناء اللعب. تقدم رائع في طلب العناصر.', durationMin: 60 },
  { id: 's2', date: 'May 17, 2024', dateAr: '١٧ مايو ٢٠٢٤', time: '10:00 AM', therapistEn: 'Dr. Sara Mahmoud', therapistAr: 'د. سارة محمود', typeEn: 'Individual Therapy', typeAr: 'علاج فردي', engagementScore: 4.0, noteEn: 'Good session. Worked on eye contact and turn-taking. Some resistance at start.', noteAr: 'جلسة جيدة. عمل على التواصل البصري والتناوب. بعض المقاومة في البداية.', durationMin: 60 },
  { id: 's3', date: 'May 13, 2024', dateAr: '١٣ مايو ٢٠٢٤', time: '10:00 AM', therapistEn: 'Dr. Sara Mahmoud', therapistAr: 'د. سارة محمود', typeEn: 'Individual Therapy', typeAr: 'علاج فردي', engagementScore: 3.5, noteEn: 'Slightly lower engagement — Omar was tired. Still achieved 3 of 4 objectives.', noteAr: 'مشاركة أقل قليلاً — كان عمر متعباً. حقق ٣ من ٤ أهداف.', durationMin: 45 },
  { id: 's4', date: 'May 8, 2024',  dateAr: '٨ مايو ٢٠٢٤',  time: '10:00 AM', therapistEn: 'Dr. Sara Mahmoud', therapistAr: 'د. سارة محمود', typeEn: 'Parent Training',    typeAr: 'تدريب الأسرة', engagementScore: 5.0, noteEn: 'Excellent parent training session. Family demonstrated all home strategies correctly.', noteAr: 'جلسة تدريب ممتازة للأسرة. أتقنت الأسرة جميع استراتيجيات المنزل.', durationMin: 60 },
  { id: 's5', date: 'May 6, 2024',  dateAr: '٦ مايو ٢٠٢٤',  time: '10:00 AM', therapistEn: 'Dr. Sara Mahmoud', therapistAr: 'د. سارة محمود', typeEn: 'Individual Therapy', typeAr: 'علاج فردي', engagementScore: 4.0, noteEn: 'Strong performance in communication goals. Play skills improving.', noteAr: 'أداء قوي في أهداف التواصل. تتحسن مهارات اللعب.', durationMin: 60 },
];

// ─── Gallery ──────────────────────────────────────────────────────────────────

export type GalleryItem = {
  id: string;
  src: string;
  type: 'photo' | 'video';
  month: string;
  monthAr: string;
  captionEn: string;
  captionAr: string;
};

export const GALLERY: GalleryItem[] = [
  { id: 'g1', src: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop', type: 'photo', month: 'May 2024', monthAr: 'مايو ٢٠٢٤', captionEn: 'Building with blocks', captionAr: 'البناء بالمكعبات' },
  { id: 'g2', src: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&h=400&fit=crop', type: 'photo', month: 'May 2024', monthAr: 'مايو ٢٠٢٤', captionEn: 'Play session', captionAr: 'جلسة اللعب' },
  { id: 'g3', src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=400&fit=crop', type: 'photo', month: 'May 2024', monthAr: 'مايو ٢٠٢٤', captionEn: 'Group activity', captionAr: 'نشاط جماعي' },
  { id: 'g4', src: 'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=400&h=400&fit=crop', type: 'photo', month: 'Apr 2024', monthAr: 'أبريل ٢٠٢٤', captionEn: 'Focused learning', captionAr: 'التعلم المركّز' },
  { id: 'g5', src: 'https://images.unsplash.com/photo-1599651438604-fc7f533fb11e?w=400&h=400&fit=crop', type: 'photo', month: 'Apr 2024', monthAr: 'أبريل ٢٠٢٤', captionEn: 'Craft activity', captionAr: 'نشاط حرفي' },
  { id: 'g6', src: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=400&h=400&fit=crop', type: 'photo', month: 'Apr 2024', monthAr: 'أبريل ٢٠٢٤', captionEn: 'Sensory play', captionAr: 'اللعب الحسي' },
  { id: 'g7', src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=400&fit=crop', type: 'photo', month: 'Mar 2024', monthAr: 'مارس ٢٠٢٤', captionEn: 'First session', captionAr: 'الجلسة الأولى' },
  { id: 'g8', src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', type: 'photo', month: 'Mar 2024', monthAr: 'مارس ٢٠٢٤', captionEn: 'Art therapy', captionAr: 'العلاج بالفن' },
  { id: 'g9', src: 'https://images.unsplash.com/photo-1505816014357-96b5ff457e9a?w=400&h=400&fit=crop', type: 'video', month: 'Mar 2024', monthAr: 'مارس ٢٠٢٤', captionEn: 'Play progress video', captionAr: 'فيديو تقدم اللعب' },
];

// ─── Reinforcers ──────────────────────────────────────────────────────────────

export type Reinforcer = {
  id: string;
  emoji: string;
  nameEn: string;
  nameAr: string;
  category: 'toys' | 'foods' | 'activities' | 'songs';
  isFavorite: boolean;
};

export const REINFORCERS: Reinforcer[] = [
  { id: 'rf1', emoji: '🧱', nameEn: 'Building Blocks', nameAr: 'مكعبات البناء',    category: 'toys',       isFavorite: true },
  { id: 'rf2', emoji: '🚗', nameEn: 'Toy Cars',        nameAr: 'سيارات لعبة',       category: 'toys',       isFavorite: true },
  { id: 'rf3', emoji: '🫧', nameEn: 'Bubbles',          nameAr: 'فقاعات',            category: 'toys',       isFavorite: false },
  { id: 'rf4', emoji: '🧩', nameEn: 'Puzzles',          nameAr: 'ألغاز',             category: 'toys',       isFavorite: false },
  { id: 'rf5', emoji: '🍎', nameEn: 'Apple slices',     nameAr: 'شرائح تفاح',        category: 'foods',      isFavorite: true },
  { id: 'rf6', emoji: '🧃', nameEn: 'Juice box',        nameAr: 'عصير في علبة',      category: 'foods',      isFavorite: false },
  { id: 'rf7', emoji: '🍿', nameEn: 'Popcorn',          nameAr: 'فشار',              category: 'foods',      isFavorite: true },
  { id: 'rf8', emoji: '🎨', nameEn: 'Drawing',          nameAr: 'الرسم',             category: 'activities', isFavorite: true },
  { id: 'rf9', emoji: '🏃', nameEn: 'Running games',    nameAr: 'العاب الجري',       category: 'activities', isFavorite: false },
  { id: 'rf10', emoji: '🎵', nameEn: 'Baby Shark',       nameAr: 'بيبي شارك',         category: 'songs',      isFavorite: true },
  { id: 'rf11', emoji: '🎶', nameEn: 'Wheels on Bus',    nameAr: 'عجلات الباص',       category: 'songs',      isFavorite: false },
];

// ─── Therapist — Children List ────────────────────────────────────────────────

export const CHILDREN_LIST = [
  { id: 'ZR-00012', nameEn: 'Omar Youssef',  nameAr: 'عمر يوسف',   age: 6,  diagnosisEn: 'ASD',           diagnosisAr: 'توحد',      statusEn: 'Active',   statusAr: 'نشط',    progress: 72 },
  { id: 'ZR-00008', nameEn: 'Lina Ahmed',    nameAr: 'لينا أحمد',  age: 4,  diagnosisEn: 'Speech Delay',  diagnosisAr: 'تأخر كلام', statusEn: 'Active',   statusAr: 'نشط',    progress: 60 },
  { id: 'ZR-00015', nameEn: 'Youssef Ali',   nameAr: 'يوسف علي',   age: 5,  diagnosisEn: 'ADHD',          diagnosisAr: 'نشاط زائد', statusEn: 'Active',   statusAr: 'نشط',    progress: 48 },
  { id: 'ZR-00003', nameEn: 'Mariam Hassan', nameAr: 'مريم حسن',   age: 3,  diagnosisEn: 'Global Delay',  diagnosisAr: 'تأخر عام',  statusEn: 'Active',   statusAr: 'نشط',    progress: 30 },
  { id: 'ZR-00021', nameEn: 'Adam Mohamed',  nameAr: 'آدم محمد',   age: 7,  diagnosisEn: 'ASD',           diagnosisAr: 'توحد',      statusEn: 'Active',   statusAr: 'نشط',    progress: 80 },
  { id: 'ZR-00017', nameEn: 'Hamza Tarek',   nameAr: 'حمزة طارق',  age: 6,  diagnosisEn: 'Learning Delay',diagnosisAr: 'تأخر تعلم', statusEn: 'On Hold',  statusAr: 'متوقف',  progress: 55 },
];

// ─── Admin — Users ────────────────────────────────────────────────────────────

export const USERS = [
  { id: 'u1', nameEn: 'Dr. Sara Mahmoud', nameAr: 'د. سارة محمود', email: 'sara@zurriya.com',    role: 'therapist', statusEn: 'Active', statusAr: 'نشط',   joinedDate: 'Jan 2024' },
  { id: 'u2', nameEn: 'Ahmed Youssef',    nameAr: 'أحمد يوسف',     email: 'ahmed@gmail.com',     role: 'parent',    statusEn: 'Active', statusAr: 'نشط',   joinedDate: 'Mar 2024' },
  { id: 'u3', nameEn: 'Yusuf Abdelatti', nameAr: 'يوسف عبد العاطي', email: 'admin@zurriya.com', role: 'admin',     statusEn: 'Active', statusAr: 'نشط',   joinedDate: 'Jan 2024' },
  { id: 'u4', nameEn: 'Hana Khaled',      nameAr: 'هناء خالد',     email: 'hana@gmail.com',      role: 'parent',    statusEn: 'Active', statusAr: 'نشط',   joinedDate: 'Apr 2024' },
  { id: 'u5', nameEn: 'Dr. Rania Omar',   nameAr: 'د. رانيا عمر',  email: 'rania@zurriya.com',   role: 'therapist', statusEn: 'Active', statusAr: 'نشط',   joinedDate: 'Feb 2024' },
];
