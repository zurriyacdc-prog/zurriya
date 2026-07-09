export type TeamMember = {
  slug: string;
  initials: string;
  photo?: string; // path under /public, e.g. "/team/yusuf-abdelatti.jpg"
  name: { en: string; ar: string };
  titles: { en: string[]; ar: string[] };
  teaser: { en: string; ar: string };
  isPlaceholder?: boolean;
  // Full profile
  bio: { en: string; ar: string };
  education: { en: string[]; ar: string[] };
  approach: { en: string; ar: string };
  experience: { en: string; ar: string };
  assessmentTech: { en: string; ar: string };
  focusAreas: { en: string[]; ar: string[] };
  familyWork: { en: string; ar: string };
};

export const teamMembers: TeamMember[] = [
  {
    slug: 'yusuf-abdelatti',
    initials: 'YA',
    photo: '/team/yusuf-abdelatti.jpg',
    name: {
      en: 'Yusuf Abdelatti',
      ar: 'يوسف عبد العاطي',
    },
    titles: {
      en: ['Psychologist', 'Child Development Specialist', 'Behavior Modification Specialist', 'Neurofeedback Therapist'],
      ar: ['عالم نفس', 'أخصائي تنمية الطفل', 'أخصائي تعديل السلوك', 'معالج بالنيوروفيدباك'],
    },
    teaser: {
      en: 'Yusuf Abdelatti is a psychologist, child development specialist, and behavior modification specialist with dual honours degrees in Psychology and over 1,700 hours of clinical experience in assessment, behavioral intervention, and neurofeedback. He currently leads the Mental Health and Psychological Support Department across multiple early childhood educational settings.',
      ar: 'يوسف عبد العاطي عالم نفس وأخصائي تنمية طفل وأخصائي تعديل سلوك، يحمل درجتي شرف في علم النفس، وتجاوزت ساعاته الإكلينيكية 1,700 ساعة في التقييم والتدخل السلوكي والنيوروفيدباك. يتولى حالياً قيادة قسم الصحة النفسية والدعم النفسي في عدة بيئات تعليمية للطفولة المبكرة.',
    },
    bio: {
      en: 'Yusuf Abdelatti is a psychologist, child development specialist, family counselor, psychotherapist, behavior modification specialist, neurofeedback therapist, and psychometric assessor whose work centers on helping children, families, and educational systems create meaningful, evidence-based, and sustainable change.',
      ar: 'يوسف عبد العاطي عالم نفس وأخصائي تنمية طفل ومستشار أسري ومعالج نفسي وأخصائي تعديل سلوك ومعالج بالنيوروفيدباك ومقيّم سيكومتري، يتمحور عمله حول مساعدة الأطفال والأسر والأنظمة التعليمية على إحداث تغيير حقيقي ومستدام قائم على الأدلة العلمية.',
    },
    education: {
      en: [
        'Dual Honours BSc in Psychology — London South Bank University & British University in Egypt',
        'MSc in Psychology (in progress) — Liverpool John Moores University',
      ],
      ar: [
        'بكالوريوس مزدوج بامتياز في علم النفس — جامعة لندن ساوث بانك والجامعة البريطانية في مصر',
        'ماجستير علم النفس (قيد الإنجاز) — جامعة ليفربول جون مورز',
      ],
    },
    approach: {
      en: 'Yusuf believes every child\'s behavior is shaped by a dynamic interaction of developmental, cognitive, emotional, environmental, educational, and family factors. Rather than focusing narrowly on managing behaviors, his work centers on understanding the mechanisms behind them — while empowering families and educators to become active participants in the intervention itself. His clinical practice draws on Cognitive Behavioral Therapy (CBT), Acceptance and Commitment Therapy (ACT), Dialectical Behavior Therapy (DBT), Behavior Modification, Neurofeedback, Biofeedback, and cognitive rehabilitation — integrated into individualized plans rather than applied as a single fixed model.',
      ar: 'يرى يوسف أن سلوك كل طفل يتشكّل من تفاعل ديناميكي بين عوامل نمائية ومعرفية وانفعالية وبيئية وتعليمية وأسرية. لا يقتصر عمله على إدارة السلوكيات، بل يتعمق في فهم الآليات الكامنة وراءها، ويعمل على تمكين الأسر والمعلمين ليكونوا شركاء فاعلين في التدخل ذاته. تستند ممارسته الإكلينيكية إلى العلاج المعرفي السلوكي (CBT)، وعلاج القبول والالتزام (ACT)، والعلاج السلوكي الجدلي (DBT)، وتعديل السلوك، والنيوروفيدباك، والبيوفيدباك، وإعادة التأهيل المعرفي — مدمجةً في خطط فردية لا في نموذج ثابت.',
    },
    experience: {
      en: 'Yusuf has worked across psychiatric hospitals, outpatient mental health services, schools, nurseries, and private practice, giving him a multidisciplinary view of children\'s needs from clinical, educational, and family-systems perspectives. His early clinical training included internships at Dr. Gamal Mady Abou El Azayem Psychiatric Hospital and Dr. Hany ElHennawy Psychiatric Center, where he also received supervised training in Neurofeedback and Biofeedback.\n\nHe later focused on supporting children within their natural environments — home, school, and early childhood settings — first as part of a School Counseling Team, then as Psychologist and Behavior Modification Specialist within early childhood educational settings. He currently serves as Supervisor of the Mental Health and Psychological Support Department, leading psychological services across multiple early childhood educational settings, overseeing behavioral intervention programs, developmental follow-up, teacher support, and parent education initiatives.\n\nAcross these roles, Yusuf has accumulated more than 1,700 hours of psychotherapy, parenting consultation, behavioral intervention, and psychological support.',
      ar: 'عمل يوسف في المستشفيات النفسية والخدمات النفسية الخارجية والمدارس وروضات الأطفال والعيادات الخاصة، مما منحه رؤية متعددة التخصصات لاحتياجات الأطفال من منظور إكلينيكي وتعليمي وأسري. شملت تدريباته الإكلينيكية المبكرة تدريباً في مستشفى الدكتور جمال ماضي أبو العزايم ومركز الدكتور هاني الحناوي، حيث تلقّى أيضاً تدريبه المشرف عليه في النيوروفيدباك والبيوفيدباك.\n\nتركّز عمله لاحقاً على دعم الأطفال في بيئاتهم الطبيعية — المنزل والمدرسة ومرحلة الطفولة المبكرة — أولاً ضمن فريق الإرشاد المدرسي، ثم بصفة عالم نفس وأخصائي تعديل سلوك في بيئات الطفولة المبكرة. يشغل حالياً منصب المشرف على قسم الصحة النفسية والدعم النفسي، ويقود الخدمات النفسية عبر عدة مؤسسات تعليمية للطفولة المبكرة.\n\nتجاوزت ساعاته التراكمية في العلاج النفسي والاستشارات الأسرية والتدخل السلوكي والدعم النفسي 1,700 ساعة.',
    },
    assessmentTech: {
      en: 'A central part of Yusuf\'s work is comprehensive psychological assessment — considering developmental history, cognitive ability, emotional functioning, behavior, environment, and family dynamics together, rather than judging a child by an isolated symptom. He conducts standardized cognitive, behavioral, personality, and clinical assessments to support diagnosis, intervention planning, and progress monitoring.\n\nHe also incorporates Neurofeedback and Biofeedback where clinically indicated, supporting attention, self-regulation, and executive function. He works as a Scientific Development Team Member at Cognitive Suite, contributing to the design of evidence-based cognitive assessment and training tools — reflecting his broader interest in combining psychological science with technology to make effective child-focused care more accessible.',
      ar: 'يُشكّل التقييم النفسي الشامل محوراً أساسياً في عمل يوسف — إذ يأخذ في الاعتبار التاريخ النمائي والقدرة المعرفية والأداء الانفعالي والسلوك والبيئة وديناميكيات الأسرة معاً، دون الاكتفاء بأعراض معزولة. يجري تقييمات موحّدة معرفية وسلوكية وشخصية وإكلينيكية لدعم التشخيص وتخطيط التدخل ومتابعة التقدم.\n\nيدمج النيوروفيدباك والبيوفيدباك حين يستدعي ذلك سريرياً لدعم الانتباه والتنظيم الذاتي والوظائف التنفيذية. كما يعمل عضواً في فريق التطوير العلمي بـ Cognitive Suite، مساهماً في تصميم أدوات تقييم وتدريب معرفي قائمة على الأدلة.',
    },
    focusAreas: {
      en: [
        'ADHD and executive functioning difficulties',
        'Emotional and behavioral regulation',
        'Developmental delays',
        'School adjustment and learning-related difficulties',
        'Cognitive training (attention, working memory, processing efficiency)',
      ],
      ar: [
        'اضطراب نقص الانتباه وفرط النشاط وصعوبات الوظائف التنفيذية',
        'التنظيم الانفعالي والسلوكي',
        'التأخر النمائي',
        'التكيف المدرسي وصعوبات التعلم',
        'التدريب المعرفي (الانتباه، الذاكرة العاملة، كفاءة المعالجة)',
      ],
    },
    familyWork: {
      en: 'Yusuf considers parent consultation a core part of treatment, not an add-on. He works directly with parents to build their understanding of child development, behavioral principles, and practical, evidence-based parenting strategies — and works with teachers and schools in the same way, since lasting progress depends on consistency across every environment surrounding the child.',
      ar: 'يعتبر يوسف استشارة الوالدين جزءاً أساسياً من العلاج لا إضافةً اختيارية. يعمل مباشرةً مع الأهل لبناء فهمهم لتنمية الطفل والمبادئ السلوكية واستراتيجيات التربية العملية المبنية على الأدلة — ويتعامل مع المعلمين والمدارس بالطريقة ذاتها، إذ يعتمد التقدم المستدام على الاتساق في كل بيئة محيطة بالطفل.',
    },
  },
  {
    slug: 'ziad-hamdy',
    initials: 'ZH',
    photo: '/team/ziad-hamdy.jpg',
    name: {
      en: 'Ziad Hamdy',
      ar: 'زياد حمدي',
    },
    titles: {
      en: ['Clinical Psychologist', 'Certified ABAT (QABA)', 'Academic Therapist', 'Clinical Supervisor'],
      ar: ['عالم نفس إكلينيكي', 'معالج سلوكي معتمد ABAT/QABA', 'معالج أكاديمي', 'مشرف إكلينيكي'],
    },
    teaser: {
      en: 'Ziad Hamdy is a Clinical Psychologist, Certified ABAT (QABA), assessment and IQ psychologist, academic therapist, and clinical supervisor with over 2,000 hours of behavioral intervention, assessment, and academic instruction across Egypt and the UAE. He works with children on the autism spectrum and across a wide range of developmental, learning, emotional, and behavioral needs.',
      ar: 'زياد حمدي عالم نفس إكلينيكي وأخصائي معتمد في تحليل السلوك التطبيقي (ABAT/QABA) ومقيّم نفسي ومعرفي ومعالج أكاديمي ومشرف إكلينيكي، تجاوزت ساعاته التراكمية 2,000 ساعة في التدخل السلوكي والتقييم والتعليم الأكاديمي عبر مصر والإمارات. يعمل مع الأطفال على طيف التوحد وعبر طيف واسع من الاحتياجات النمائية والتعليمية والانفعالية والسلوكية.',
    },
    bio: {
      en: 'Ziad Hamdy is a Clinical Psychologist, Certified Applied Behavior Analysis Technician (ABAT/QABA), assessment and IQ psychologist, academic therapist, and clinical supervisor whose work spans behavior therapy, psychological and cognitive assessment, individualized academic intervention, and the supervision and training of clinical teams. He works with children on the autism spectrum and across a wide range of developmental, learning, emotional, and behavioral needs — in clinical, school, and home settings, and across both Egypt and the United Arab Emirates.\n\nHis work centers on helping children, families, and schools create meaningful, evidence-based, and lasting change — not by managing behavior in isolation, but by understanding what drives it and building the conditions for real, generalizable growth.',
      ar: 'زياد حمدي عالم نفس إكلينيكي وأخصائي معتمد في تحليل السلوك التطبيقي (ABAT/QABA) ومقيّم نفسي ومعرفي ومعالج أكاديمي ومشرف إكلينيكي؛ يشمل عمله العلاج السلوكي والتقييم النفسي والمعرفي والتدخل الأكاديمي الفردي والإشراف على الفرق الإكلينيكية وتدريبها. يعمل مع الأطفال على طيف التوحد وعبر طيف واسع من الاحتياجات النمائية والتعليمية والانفعالية والسلوكية — في البيئات الإكلينيكية والمدرسية والمنزلية، وعبر مصر والإمارات العربية المتحدة.\n\nيتمحور عمله حول مساعدة الأطفال والأسر والمدارس على إحداث تغيير حقيقي ومستدام قائم على الأدلة العلمية — لا بإدارة السلوك بمعزل عن سياقه، بل بفهم ما يقوده وبناء شروط النمو الحقيقي القابل للتعميم.',
    },
    education: {
      en: [
        'BSc in Clinical Psychology (Honours) — dual degree, The British University in Egypt (BUE) & London South Bank University (LSBU)',
        'MSc in Psychology (in progress) — Liverpool John Moores University (LJMU)',
        'Applied Behavior Analysis Technician (ABAT) — QABA Board, 2025',
        'RBT 40-Hour Training — BACB / APF, 2024',
        'Diploma in Diagnostic and Psychological Assessments — Dr. Hoda ElMohamedy, 2025',
        'Currently pursuing: Qualified Behavior Analyst (QBA) — QABA Board',
      ],
      ar: [
        'بكالوريوس في علم النفس الإكلينيكي بامتياز — درجة مزدوجة، الجامعة البريطانية في مصر (BUE) وجامعة لندن ساوث بانك (LSBU)',
        'ماجستير علم النفس (قيد الإنجاز) — جامعة ليفربول جون مورز (LJMU)',
        'أخصائي تحليل السلوك التطبيقي المعتمد (ABAT) — مجلس QABA، 2025',
        'تدريب RBT لمدة 40 ساعة — BACB / APF، 2024',
        'دبلوم التقييمات التشخيصية والنفسية — د. هدى المحمدي، 2025',
        'قيد الحصول على: اعتماد المحلل السلوكي المؤهل (QBA) — مجلس QABA',
      ],
    },
    approach: {
      en: 'Ziad believes a child\'s behavior is never random — it is shaped by a dynamic interaction of developmental, cognitive, emotional, environmental, educational, and family factors. Rather than treating a symptom in isolation, his work begins with understanding the function and mechanism behind a behavior, and then designing an intervention around the whole child.\n\nHis practice is grounded in Applied Behavior Analysis (ABA) and enriched by Cognitive Behavioral Therapy (CBT) and Acceptance and Commitment Therapy (ACT), alongside function-based behavior intervention, Functional Communication Training (FCT), Discrete Trial Training (DTT), and structured academic instruction. These are integrated into individualized, data-driven plans rather than applied as a single fixed model. Central to his approach is empowering parents, teachers, and support staff to become active participants in the intervention — because lasting progress depends on consistency across every environment surrounding the child.',
      ar: 'يرى زياد أن سلوك الطفل ليس عشوائياً أبداً — بل يتشكّل من تفاعل ديناميكي بين عوامل نمائية ومعرفية وانفعالية وبيئية وتعليمية وأسرية. لا يُعالج الأعراض بمعزل عن سياقها؛ بل ينطلق من فهم وظيفة السلوك وآلياته الكامنة، ثم يُصمّم التدخل حول الطفل بأكمله.\n\nتستند ممارسته إلى تحليل السلوك التطبيقي (ABA)، مُعزَّزةً بالعلاج المعرفي السلوكي (CBT) وعلاج القبول والالتزام (ACT)، إلى جانب التدخل السلوكي الوظيفي والتدريب على التواصل الوظيفي (FCT) والتدريب بالمحاولات المنفصلة (DTT) والتعليم الأكاديمي المنظّم — مدمجةً في خطط فردية قائمة على البيانات لا في نموذج ثابت. يقوم نهجه على تمكين الأهل والمعلمين وفرق الدعم ليكونوا شركاء فاعلين في التدخل — لأن التقدم المستدام يعتمد على الاتساق في كل بيئة محيطة بالطفل.',
    },
    experience: {
      en: 'Ziad has worked across specialized centers, schools, hospitals, and private practice, giving him a multidisciplinary view of children\'s needs from clinical, educational, and family-systems perspectives. He currently practices independently in Egypt as a behavior therapist and assessment psychologist, providing ABA intervention, IQ and diagnostic assessment, and parent consultation.\n\nMost recently, at Osraty for Physio and Rehab (Dubai, UAE), he served as Learning Support Assistant (LSA) Supervisor and ABA Therapist — responsible for the tracking and supervision of over 80 Learning Support Assistants, conducting performance evaluations, overseeing recruitment, and coordinating multidisciplinary support alongside SEN teachers and inclusion leaders. He delivered individualized ABA programs directly across three settings: the clinic, schools, and children\'s homes.\n\nAt Chance Foundation (Egypt), Ziad advanced through a clear progression over roughly eighteen months: from ABA Therapist and Case Manager, to Senior ABA Therapist and Academic Therapist, to Lead Therapist of the Advanced Intervention Unit and Inclusion Support Unit — overseeing both units and their ABA therapists and shadow teachers, directing clinical supervision, staff training, recruitment, and case management. Throughout this progression he also served as Assessment Psychologist, administering standardized IQ and diagnostic assessments including the Stanford-Binet Fifth Edition and translating results into intervention plans and family feedback.\n\nAcross his leadership roles, Ziad has conducted more than 200 interviews for therapists and shadow teachers, and has designed and delivered numerous training workshops covering core ABA strategies, Functional Communication Training (FCT), prompting, reinforcement, and data collection. His earlier training includes work at Blue Mood Center for Children with Special Needs, psychological assessment during Egyptian Military Service, a clinical internship at Dr. Gamal Abo El-Azayem Hospital for Mental Health, and a Volunteer Therapist role at 360 Clinics.\n\nAcross these roles, Ziad has accumulated more than 2,000 combined hours of direct behavioral intervention, academic instruction, psychological and cognitive assessment, and parent consultation.',
      ar: 'عمل زياد عبر مراكز متخصصة ومدارس ومستشفيات وعيادات خاصة، مما منحه رؤية متعددة التخصصات لاحتياجات الأطفال من منظور إكلينيكي وتعليمي وأسري. يمارس حالياً عمله بشكل مستقل في مصر بوصفه معالجاً سلوكياً ومقيّماً نفسياً، يقدم تدخلات ABA وتقييمات الذكاء والتشخيص واستشارات الأسرة.\n\nفي أحدث تجاربه، عمل في مركز أسرتي لإعادة التأهيل (دبي، الإمارات) مشرفاً على مساعدي الدعم التعليمي (LSA) ومعالجاً سلوكياً. أشرف على أكثر من 80 مساعداً، وأجرى تقييمات أداء، وأشرف على التوظيف، ونسّق الدعم المتعدد التخصصات مع معلمي التربية الخاصة وقادة الإدماج، وقدّم برامج ABA الفردية مباشرةً في ثلاث بيئات: العيادة والمدارس والمنازل.\n\nفي مؤسسة Chance (مصر)، اتّسم مساره بتقدم واضح على مدى نحو ثمانية عشر شهراً: بدأ معالجاً ABA ومديراً للحالات، ثم ارتقى إلى معالج ABA أول ومعالج أكاديمي، فقائداً لوحدة التدخل المتقدم ووحدة دعم الإدماج — مشرفاً على المعالجين والمعلمين المرافقين وقائداً للإشراف الإكلينيكي وتدريب الكوادر وإدارة الحالات. شغل بالتوازي دور مقيّم نفسي، مطبّقاً اختبارات الذكاء والتشخيص الموحّدة — بما فيها ستانفورد-بينيه الإصدار الخامس — ومترجماً نتائجها إلى خطط تدخل وتغذية راجعة للأسر.\n\nعلى مستوى القيادة، أجرى زياد أكثر من 200 مقابلة لتوظيف المعالجين والمعلمين المرافقين، وصمّم ورش تدريبية شاملة تغطي استراتيجيات ABA الأساسية والتدريب على التواصل الوظيفي وجمع البيانات. تشمل خبراته السابقة العمل في مركز Blue Mood، والتقييم النفسي خلال الخدمة العسكرية، والتدريب الإكلينيكي في مستشفى الدكتور جمال أبو العزايم، والعمل التطوعي في عيادات 360 Clinics.\n\nتجاوزت ساعاته التراكمية في التدخل السلوكي المباشر والتعليم الأكاديمي والتقييم النفسي واستشارات الأسرة 2,000 ساعة.',
    },
    assessmentTech: {
      en: 'A central part of Ziad\'s work is comprehensive psychological and cognitive assessment — considering a child\'s developmental history, cognitive ability, behavior, environment, and family dynamics together, rather than judging the child by an isolated score or symptom. He administers and interprets Stanford-Binet Fifth Edition IQ assessments and conducts curriculum-based and behavioral assessment using VB-MAPP, ABLLS-R, AFLS, PEAK, and Functional Behavior Assessment (FBA).\n\nThis assessment work feeds directly into diagnosis support, individualized intervention and IEP planning, progress monitoring, and clear, practical feedback and referral recommendations for families. He also designs and delivers training for clinical staff in assessment administration, data collection, and evidence-based intervention strategies.',
      ar: 'يُشكّل التقييم النفسي والمعرفي الشامل محوراً مركزياً في عمل زياد — إذ يأخذ في الاعتبار التاريخ النمائي للطفل وقدرته المعرفية وسلوكه وبيئته وديناميكيات أسرته معاً، بدلاً من الاكتفاء بتقييم درجة أو عَرَض بمعزل. يُطبّق مقياس ستانفورد-بينيه للذكاء — الإصدار الخامس — ويُجري التقييمات المنهجية والسلوكية باستخدام VB-MAPP وABLLS-R وAFLS وPEAK وتقييم السلوك الوظيفي (FBA).\n\nيُغذّي هذا العمل التقييمي مباشرةً دعمَ التشخيص وتخطيطَ التدخل الفردي وبرامجَ IEP ومتابعةَ التقدم وتقديمَ التوصيات العملية والإحالات للأسر. كما يُصمّم ورش تدريبية للكوادر الإكلينيكية في تطبيق أدوات التقييم وجمع البيانات واستراتيجيات التدخل المبنية على الأدلة.',
    },
    focusAreas: {
      en: [
        'Applied Behavior Analysis (ABA)',
        'IQ and comprehensive cognitive assessment',
        'Autism spectrum, ADHD, and learning difficulties',
        'Individualized academic intervention',
        'Clinical supervision and team development',
        'Behavioral assessment and intervention planning (ABLLS-R, VB-MAPP, PEAK, AFLS)',
      ],
      ar: [
        'تحليل السلوك التطبيقي (ABA)',
        'تقييم الذكاء والتقييم المعرفي الشامل',
        'طيف التوحد واضطراب نقص الانتباه وصعوبات التعلم',
        'التدخل الأكاديمي الفردي',
        'الإشراف الإكلينيكي وتطوير الفرق',
        'التقييم السلوكي والتخطيط للتدخل (ABLLS-R وVB-MAPP وPEAK وAFLS)',
      ],
    },
    familyWork: {
      en: 'Ziad considers parent consultation a core part of treatment, not an add-on. He works directly with parents to build their understanding of child development, behavioral principles, and practical, evidence-based strategies they can use at home — and works with teachers, shadow staff, and schools in the same way. Having supervised support teams and partnered with schools in both the UAE and Egypt, he understands that meaningful change only holds when it is consistent across the clinic, the classroom, and the home.',
      ar: 'يعتبر زياد استشارة الوالدين جزءاً أساسياً من العلاج لا إضافةً اختيارية. يعمل مباشرةً مع الأهل لبناء فهمهم لتنمية الطفل والمبادئ السلوكية واستراتيجيات التربية العملية المبنية على الأدلة — ويتعامل مع المعلمين والمعلمين المرافقين والمدارس بالطريقة ذاتها. بحكم إشرافه على فرق الدعم وشراكته مع مدارس في الإمارات ومصر، يُدرك أن التغيير الحقيقي لا يثبت إلا حين يكون متسقاً عبر العيادة والفصل الدراسي والمنزل.',
    },
  },
];

export function getMemberBySlug(slug: string): TeamMember | undefined {
  return teamMembers.find((m) => m.slug === slug);
}
