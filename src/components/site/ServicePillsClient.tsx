'use client';

import { useState } from 'react';

type Exp = {
  en: { title: string; body: string; forLabel: string };
  ar: { title: string; body: string; forLabel: string };
};

const PILL_CLASS: Record<string, string> = {
  teal:  'bg-teal-pale border border-teal/20 text-teal-dark hover:bg-teal/10',
  coral: 'bg-coral-pale border border-coral/20 text-coral-dark hover:bg-coral/10',
  sage:  'bg-sage-pale border border-sage/20 text-sage-dark hover:bg-sage/10',
};

const MODAL_ACCENT: Record<string, string> = {
  teal:  'bg-teal text-white',
  coral: 'bg-coral text-white',
  sage:  'bg-sage text-white',
};

const EXPS: Record<string, Exp[]> = {
  assessments: [
    {
      en: {
        title: 'Developmental Assessments',
        body: 'A comprehensive evaluation of how your child is growing compared to typical milestones for their age. We look at motor skills, language, social interaction, and cognitive development — giving you a full picture of your child\'s strengths and areas that may benefit from extra support.',
        forLabel: 'When to consider it: Your child seems behind peers in talking, walking, or social play. You\'ve noticed delays in reaching milestones like first words or walking. You want a thorough professional evaluation of your child\'s overall development.',
      },
      ar: {
        title: 'التقييمات النمائية',
        body: 'تقييم شامل لنمو طفلك مقارنةً بما يُتوقع لعمره. نفحص المهارات الحركية واللغة والتفاعل الاجتماعي والنمو المعرفي — ليمنحك صورة متكاملة عن نقاط قوة طفلك والمجالات التي قد تستفيد من دعم إضافي.',
        forLabel: 'متى تفكر في الحجز: إذا لاحظت تأخرًا في الكلام أو المشي أو اللعب مقارنةً بأقران طفلك. إذا لم يصل طفلك إلى معالم متوقعة. إذا أردت تقييمًا مهنيًا متكاملًا لتنمية طفلك.',
      },
    },
    {
      en: {
        title: 'Psychological Assessments',
        body: 'An in-depth evaluation of your child\'s emotional well-being, behavior patterns, and mental health. We explore how your child feels, thinks, and copes with everyday life — helping us understand what\'s behind behaviors or emotions that worry you.',
        forLabel: 'When to consider it: Your child seems unusually anxious, sad, or angry. There are significant behavioral changes at home or school. You want to understand the emotional side of your child\'s development.',
      },
      ar: {
        title: 'التقييمات النفسية',
        body: 'تقييم متعمق للصحة النفسية لطفلك وأنماط سلوكه وحالته العاطفية. نستكشف كيف يشعر وكيف يفكر وكيف يتعامل مع تحديات الحياة — مما يساعدنا على فهم جذور السلوكيات أو المشاعر التي تُقلقك.',
        forLabel: 'متى تفكر في الحجز: إذا بدا طفلك قلقًا أو حزينًا أو غاضبًا بشكل غير معتاد. إذا طرأت تغيرات سلوكية ملحوظة في المنزل أو المدرسة.',
      },
    },
    {
      en: {
        title: 'Cognitive Assessments',
        body: 'Tests that measure how your child thinks, reasons, learns, and processes information. We evaluate attention, memory, problem-solving, and processing speed — giving a detailed understanding of how your child\'s mind works and how they learn best.',
        forLabel: 'When to consider it: Your child struggles to follow multi-step instructions. They have difficulty remembering things or concentrating. Teachers have noted learning difficulties in the classroom.',
      },
      ar: {
        title: 'التقييمات المعرفية',
        body: 'اختبارات تقيس طريقة تفكير طفلك واستدلاله وتعلّمه ومعالجته للمعلومات. نُقيّم الانتباه والذاكرة وحل المشكلات وسرعة المعالجة — لنحصل على فهم دقيق لكيفية عمل عقل طفلك وأفضل طرق تعلّمه.',
        forLabel: 'متى تفكر في الحجز: إذا كان طفلك يعاني من اتباع التعليمات متعددة الخطوات. إذا كان لديه صعوبة في التذكر أو التركيز. إذا لاحظ المعلمون صعوبات في التعلّم.',
      },
    },
    {
      en: {
        title: 'Intelligence (IQ) Assessments',
        body: 'A standardized assessment of your child\'s intellectual abilities — measuring verbal reasoning, visual-spatial skills, working memory, and processing speed. Helps us understand your child\'s intellectual potential and how to best support their learning and development.',
        forLabel: 'When to consider it: You want to understand your child\'s intellectual strengths and challenges. Your child may be gifted or need additional academic support. School placement decisions require objective evaluation.',
      },
      ar: {
        title: 'تقييم الذكاء (IQ)',
        body: 'تقييم معياري لقدرات طفلك الذهنية — يقيس التفكير اللفظي والمهارات البصرية المكانية والذاكرة العاملة وسرعة المعالجة. يساعدنا على فهم إمكانات طفلك وأفضل طريقة لدعم تعلّمه ونموه.',
        forLabel: 'متى تفكر في الحجز: إذا أردت فهم نقاط قوة طفلك الذهنية وتحدياته. إذا كان طفلك موهوبًا أو يحتاج دعمًا أكاديميًا إضافيًا. إذا كانت هناك قرارات توجيه مدرسي.',
      },
    },
    {
      en: {
        title: 'Behavioral Assessments',
        body: 'A structured evaluation of specific behaviors — what triggers them, how frequent they are, and how they impact your child\'s daily life. We use observations, questionnaires, and interviews with you and teachers to get the complete picture.',
        forLabel: 'When to consider it: Your child has frequent meltdowns or outbursts. There are repetitive behaviors that interfere with daily life. Behaviors at school are causing concern for teachers.',
      },
      ar: {
        title: 'التقييمات السلوكية',
        body: 'تقييم منظم لسلوكيات محددة — ما الذي يُثيرها وكم مرة تحدث وكيف تؤثر في حياة طفلك. نستخدم الملاحظة المباشرة والاستبيانات والمقابلات معك ومع المعلمين للحصول على الصورة الكاملة.',
        forLabel: 'متى تفكر في الحجز: إذا كان طفلك يعاني من نوبات غضب متكررة. إذا كانت هناك سلوكيات تكرارية تُعيق الحياة اليومية.',
      },
    },
    {
      en: {
        title: 'Adaptive Functioning Assessments',
        body: 'Measures how independently and effectively your child manages everyday tasks compared to peers their age — things like dressing, communicating needs, following routines, and navigating social situations. Helps us understand how much support your child needs in real life.',
        forLabel: 'When to consider it: Your child needs more help than expected with basic daily tasks. Dressing, eating, or hygiene are significantly delayed. Your child struggles to function independently compared to peers.',
      },
      ar: {
        title: 'تقييم المهارات التكيفية',
        body: 'يقيس مدى استقلالية طفلك وفعاليته في المهام اليومية مقارنةً بأقرانه — كارتداء الملابس والتعبير عن احتياجاته واتباع الروتين والتعامل مع المواقف الاجتماعية. يُساعدنا على فهم مقدار الدعم الذي يحتاجه في الحياة الفعلية.',
        forLabel: 'متى تفكر في الحجز: إذا كان طفلك يحتاج مساعدة أكثر من المتوقع في المهام الأساسية. إذا كانت مهارات الاستقلالية متأخرة بشكل ملحوظ.',
      },
    },
    {
      en: {
        title: 'School Readiness Evaluations',
        body: 'An assessment of whether your child has the skills needed to start and succeed in school — including attention span, following instructions, early literacy and number concepts, social skills with peers, and emotional regulation in a group setting.',
        forLabel: 'When to consider it: Your child is approaching school age and you\'re unsure if they\'re ready. Teachers have expressed concerns about readiness. You want to identify gaps before school starts.',
      },
      ar: {
        title: 'تقييم الاستعداد المدرسي',
        body: 'تقييم لمدى امتلاك طفلك المهارات اللازمة للبدء في المدرسة والنجاح فيها — يشمل مدة الانتباه واتباع التعليمات والمفاهيم الأولية للقراءة والأرقام والمهارات الاجتماعية والتنظيم العاطفي في بيئة جماعية.',
        forLabel: 'متى تفكر في الحجز: إذا اقترب طفلك من سن المدرسة ولم تكن متأكدًا من جاهزيته. إذا أردت تحديد أي فجوات قبل بدء الدراسة.',
      },
    },
    {
      en: {
        title: 'Executive Function Assessments',
        body: 'Evaluation of the mental skills your child uses to plan, organize, manage time, control impulses, and switch between tasks. These "manager of the brain" skills are critical for success at school and in daily life — and weaknesses here often explain struggles that have no obvious cause.',
        forLabel: 'When to consider it: Your child has difficulty starting or finishing tasks. They seem disorganized, forgetful, or impulsive. They struggle to transition between activities.',
      },
      ar: {
        title: 'تقييم الوظائف التنفيذية',
        body: 'تقييم للمهارات الذهنية التي يستخدمها طفلك للتخطيط والتنظيم وإدارة الوقت وضبط الاندفاعية والتنقل بين المهام. هذه "مهارات مدير الدماغ" أساسية للنجاح في المدرسة والحياة — وضعفها يُفسّر كثيرًا من الصعوبات.',
        forLabel: 'متى تفكر في الحجز: إذا كان طفلك يجد صعوبة في البدء بالمهام أو إكمالها. إذا بدا مشتتًا أو ناسيًا أو متسرعًا.',
      },
    },
    {
      en: {
        title: 'Attention, Memory, and Learning Assessments',
        body: 'A focused evaluation of how your child pays attention, retains information, and acquires new knowledge. We identify whether challenges in school are related to attention difficulties (like ADHD), memory weaknesses, or specific learning disabilities — so we can target the right support.',
        forLabel: 'When to consider it: Your child struggles to stay focused during lessons or homework. They forget things quickly or fall behind despite working hard.',
      },
      ar: {
        title: 'تقييم الانتباه والذاكرة ومهارات التعلّم',
        body: 'تقييم مُركّز على كيفية انتباه طفلك واحتفاظه بالمعلومات واكتسابه للمعرفة. نُحدد ما إذا كانت الصعوبات المدرسية مرتبطة بالانتباه (مثل ADHD) أو ضعف الذاكرة أو صعوبات تعلّمية — لنوجّه الدعم بدقة.',
        forLabel: 'متى تفكر في الحجز: إذا كان طفلك يعاني من التركيز خلال الدروس. إذا ينسى الأشياء بسرعة أو يتأخر أكاديميًا رغم الجهد.',
      },
    },
    {
      en: {
        title: 'Autism and Neurodevelopmental Screening',
        body: 'A structured evaluation to identify signs of autism spectrum disorder (ASD) or other neurodevelopmental conditions such as ADHD, intellectual disability, or developmental delays. Early identification means earlier support — which makes a significant difference in long-term outcomes.',
        forLabel: 'When to consider it: Your child doesn\'t make consistent eye contact or respond to their name. They have limited or unusual communication. Social interaction seems different from peers, or they have strong repetitive behaviors.',
      },
      ar: {
        title: 'فحوص اضطراب طيف التوحّد والاضطرابات النمائية العصبية',
        body: 'تقييم منظم للكشف عن علامات اضطراب طيف التوحد أو حالات نمائية عصبية أخرى كاضطراب نقص الانتباه أو الإعاقة الذهنية أو التأخرات النمائية. التشخيص المبكر يعني دعمًا مبكرًا — وهو ما يُحدث فارقًا كبيرًا في النتائج.',
        forLabel: 'متى تفكر في الحجز: إذا كان طفلك لا يحافظ على التواصل البصري. إذا كانت أنماط تواصله محدودة. إذا كان لديه سلوكيات تكرارية قوية.',
      },
    },
  ],
  intervention: [
    {
      en: {
        title: 'Applied Behavior Analysis (ABA)',
        body: 'A science-based approach using positive reinforcement to teach new skills and reduce behaviors that interfere with learning or daily life. ABA breaks complex skills into small, manageable steps — making learning achievable and measurable. It\'s one of the most thoroughly researched interventions for autism and developmental challenges.',
        forLabel: 'Best for: Teaching communication, self-care, and social skills. Reducing repetitive or disruptive behaviors. Building independence in daily routines.',
      },
      ar: {
        title: 'تحليل السلوك التطبيقي (ABA)',
        body: 'نهج قائم على العلم يستخدم التعزيز الإيجابي لتعليم مهارات جديدة وتقليل السلوكيات المُعيقة. يُجزّئ ABA المهارات المعقدة إلى خطوات صغيرة — مما يجعل التعلّم قابلًا للتحقيق والقياس. وهو من أكثر التدخلات المُثبتة بحثيًا للتوحد والتحديات النمائية.',
        forLabel: 'الأنسب لـ: تعليم مهارات التواصل والعناية بالنفس والمهارات الاجتماعية. تقليل السلوكيات التكرارية أو المُعيقة. بناء الاستقلالية في الروتين اليومي.',
      },
    },
    {
      en: {
        title: 'Behavioral Intervention',
        body: 'Evidence-based strategies to understand and change specific behaviors — reducing harmful or disruptive behaviors and replacing them with adaptive, positive alternatives. We work with you to create consistent strategies across home, school, and any environment where the behavior occurs.',
        forLabel: 'Best for: Managing aggression, self-injurious behavior, or frequent tantrums. Building better responses to frustration. Creating consistent routines that reduce behavioral triggers.',
      },
      ar: {
        title: 'التدخل السلوكي',
        body: 'استراتيجيات مبنية على الأدلة لفهم السلوكيات وتغييرها — تقليل السلوكيات الضارة واستبدالها ببدائل إيجابية. نعمل معك لوضع استراتيجيات متسقة في المنزل والمدرسة وأي بيئة يحدث فيها السلوك.',
        forLabel: 'الأنسب لـ: إدارة العدوانية أو إيذاء الذات أو نوبات الغضب المتكررة. بناء استجابات أفضل للإحباط. إنشاء روتين متسق يُقلل مُثيرات السلوك.',
      },
    },
    {
      en: {
        title: 'Cognitive Training',
        body: 'Targeted exercises that strengthen how your child thinks, reasons, and processes information. Like physical training for the brain, cognitive training builds mental skills — improving attention, memory, problem-solving, and the speed at which your child processes what they see and hear.',
        forLabel: 'Best for: Improving working memory and mental agility. Strengthening reasoning and problem-solving. Supporting academic performance by building foundational cognitive skills.',
      },
      ar: {
        title: 'التدريب المعرفي',
        body: 'تمارين موجّهة تُقوّي طريقة تفكير طفلك واستدلاله ومعالجته للمعلومات. كالتدريب الجسدي لكن للعقل — يُنمّي الانتباه والذاكرة وحل المشكلات وسرعة المعالجة.',
        forLabel: 'الأنسب لـ: تحسين الذاكرة العاملة والمرونة الذهنية. تعزيز الاستدلال وحل المشكلات. دعم الأداء الأكاديمي بالمهارات المعرفية الأساسية.',
      },
    },
    {
      en: {
        title: 'Executive Function Training',
        body: 'Building the "control tower" skills your child needs to plan ahead, stay organized, manage time, control impulses, and switch smoothly between tasks. These skills are foundational for success at school, home, and in social life — and can be significantly improved with structured training.',
        forLabel: 'Best for: Children who struggle with disorganization, procrastination, or impulsivity. Managing ADHD-related challenges. Preparing for more demanding academic years.',
      },
      ar: {
        title: 'تدريب الوظائف التنفيذية',
        body: 'تطوير مهارات "برج المراقبة" التي يحتاجها طفلك للتخطيط المسبق والبقاء منظمًا وإدارة الوقت وضبط الاندفاعية والتنقل بسلاسة. هذه المهارات أساسية للنجاح في المدرسة والمنزل والحياة الاجتماعية.',
        forLabel: 'الأنسب لـ: الأطفال الذين يعانون من التشتت أو التسويف أو الاندفاعية. إدارة تحديات اضطراب نقص الانتباه. التحضير لسنوات دراسية أكثر تطلبًا.',
      },
    },
    {
      en: {
        title: 'Attention and Memory Training',
        body: 'Structured activities that improve your child\'s ability to sustain attention, filter distractions, and remember instructions and information. Training is tailored to your child\'s specific challenges — whether it\'s staying on task, following multi-step directions, or retaining what they\'ve learned.',
        forLabel: 'Best for: Children with attention difficulties or ADHD. Improving school performance related to concentration and recall. Helping children who forget instructions quickly or struggle to stay focused.',
      },
      ar: {
        title: 'تدريب الانتباه والذاكرة',
        body: 'أنشطة مُنظّمة تُحسّن قدرة طفلك على الحفاظ على الانتباه وتصفية المشتتات وتذكر التعليمات والمعلومات. التدريب مُصمَّم وفق التحديات المحددة لطفلك.',
        forLabel: 'الأنسب لـ: الأطفال ذوي صعوبات الانتباه أو ADHD. تحسين الأداء المدرسي المرتبط بالتركيز. مساعدة الأطفال الذين ينسون التعليمات بسرعة.',
      },
    },
    {
      en: {
        title: 'Social Skills Development',
        body: 'Teaching your child the social skills they need to connect with others — from making eye contact and starting conversations, to reading social cues, sharing, taking turns, and building genuine friendships. We use role-play, social stories, and real-life practice to make skills stick.',
        forLabel: 'Best for: Children who struggle to make or keep friends. Children with autism or social anxiety. Building confidence in group settings like school or playgroups.',
      },
      ar: {
        title: 'تنمية المهارات الاجتماعية',
        body: 'تعليم طفلك المهارات الاجتماعية للتواصل مع الآخرين — من التواصل البصري وبدء المحادثات إلى قراءة الإشارات الاجتماعية والمشاركة والانتظار وبناء الصداقات. نستخدم لعب الأدوار والقصص الاجتماعية والتطبيق الفعلي.',
        forLabel: 'الأنسب لـ: الأطفال الذين يجدون صعوبة في تكوين الصداقات. أطفال التوحد أو القلق الاجتماعي. بناء الثقة في البيئات الجماعية.',
      },
    },
    {
      en: {
        title: 'Emotional Regulation Skills',
        body: 'Helping your child recognize, understand, and manage their emotions — so they can respond to challenging situations in healthy, appropriate ways rather than being overwhelmed. We teach practical tools for calming, identifying feelings, and building emotional resilience.',
        forLabel: 'Best for: Children prone to emotional outbursts or meltdowns. Children with anxiety, big mood swings, or difficulty calming down. Building emotional intelligence alongside academic skills.',
      },
      ar: {
        title: 'تنمية مهارات التنظيم الانفعالي',
        body: 'مساعدة طفلك على التعرف على مشاعره وفهمها وإدارتها — ليتمكن من الاستجابة للمواقف الصعبة بطريقة صحية بدلًا من الانهيار. نُعلّم أدوات عملية للتهدئة وتسمية المشاعر وبناء المرونة الانفعالية.',
        forLabel: 'الأنسب لـ: الأطفال الميالين لنوبات العواطف. الأطفال الذين يعانون من القلق أو تقلبات الحالة المزاجية. بناء الذكاء العاطفي.',
      },
    },
    {
      en: {
        title: 'Communication and Functional Skills Support',
        body: 'Building the skills your child needs to communicate effectively and function independently. This includes expressive language (expressing needs and thoughts), receptive language (understanding others), and functional communication through any means — speech, gestures, pictures, or devices.',
        forLabel: 'Best for: Children with limited verbal communication. Improving ability to express needs and reduce frustration. Building functional communication alongside other therapies.',
      },
      ar: {
        title: 'دعم مهارات التواصل والمهارات الوظيفية',
        body: 'تطوير مهارات التواصل الفعّال والاستقلالية في الحياة اليومية — يشمل اللغة التعبيرية (التعبير عن الاحتياجات) واللغة الاستقبالية (فهم الآخرين) والتواصل الوظيفي بأي وسيلة تناسب طفلك.',
        forLabel: 'الأنسب لـ: الأطفال ذوي التواصل اللفظي المحدود. تحسين التعبير عن الاحتياجات وتقليل الإحباط.',
      },
    },
    {
      en: {
        title: 'Daily Living and Independence Skills',
        body: 'Teaching practical life skills that help your child manage themselves as independently as possible — personal hygiene, dressing, meal basics, household routines, community navigation, and self-management. Greater independence leads to greater confidence and quality of life.',
        forLabel: 'Best for: Children who need support developing self-care routines. Building independence for school, adolescence, or adulthood. Children with developmental disabilities who benefit from structured skill teaching.',
      },
      ar: {
        title: 'مهارات الحياة اليومية والاستقلالية',
        body: 'تعليم مهارات حياتية عملية تُساعد طفلك على إدارة نفسه باستقلالية — النظافة الشخصية وارتداء الملابس وأساسيات الطعام والروتين المنزلي والتنقل في المجتمع. الاستقلالية الأكبر تعني ثقة أعمق وجودة حياة أفضل.',
        forLabel: 'الأنسب لـ: الأطفال الذين يحتاجون دعمًا في روتين العناية بالنفس. بناء الاستقلالية للمدرسة أو المراهقة أو البلوغ.',
      },
    },
    {
      en: {
        title: 'School Readiness Programs',
        body: 'Preparing your child for the demands of a classroom environment — building early academic skills (letters, numbers, colors), developing the attention span needed for structured learning, learning to follow group instructions, and building the social-emotional skills to thrive with peers and teachers.',
        forLabel: 'Best for: Preschool and kindergarten-age children who may not be ready for the classroom. Children with developmental delays who need extra preparation. Building the foundations that make school a positive experience.',
      },
      ar: {
        title: 'برامج الاستعداد المدرسي',
        body: 'تهيئة طفلك لمتطلبات بيئة الفصل — ببناء المهارات الأكاديمية المبكرة وتطوير مدة الانتباه وتعلّم اتباع التعليمات الجماعية وبناء المهارات الاجتماعية العاطفية للازدهار مع الأقران والمعلمين.',
        forLabel: 'الأنسب لـ: أطفال ما قبل المدرسة غير المستعدين للفصل. الأطفال ذوو التأخرات النمائية. بناء الأسس التي تجعل تجربة المدرسة إيجابية.',
      },
    },
    {
      en: {
        title: 'Learning Support',
        body: 'Individualized support targeting specific learning difficulties — reading, writing, spelling, or math — using evidence-based strategies tailored to how your child learns. We identify the root cause of the difficulty and build targeted skills rather than generic tutoring.',
        forLabel: 'Best for: Children with dyslexia, dyscalculia, or other specific learning difficulties. Academic struggles not explained by effort or intelligence alone. Supporting children who work hard but still fall behind.',
      },
      ar: {
        title: 'الدعم الأكاديمي والتعلّمي',
        body: 'دعم فردي لصعوبات تعلّمية محددة — القراءة أو الكتابة أو الإملاء أو الرياضيات — باستراتيجيات مُصمَّمة وفق طريقة تعلّم طفلك. نُحدد السبب الجذري ونبني مهارات موجّهة.',
        forLabel: 'الأنسب لـ: الأطفال ذوو عسر القراءة أو الحساب أو صعوبات تعلّمية نوعية. دعم الأطفال الذين يبذلون جهدًا كبيرًا لكنهم لا يزالون يتأخرون.',
      },
    },
    {
      en: {
        title: 'Skill Development Programs',
        body: 'Comprehensive, structured programs targeting specific areas of development — combining multiple evidence-based strategies into a cohesive plan. Programs are individualized to your child\'s profile, regularly reviewed, and adjusted as they progress to ensure every session moves them meaningfully forward.',
        forLabel: 'Best for: Children who need structured, ongoing intervention across multiple skill areas. Long-term development programs with clear milestones. Creating a comprehensive framework rather than one-off sessions.',
      },
      ar: {
        title: 'برامج تنمية المهارات',
        body: 'برامج شاملة ومنظمة تستهدف مجالات نمائية محددة — تجمع استراتيجيات متعددة في خطة متماسكة مُخصصة لطفلك، تُراجع بانتظام وتُعدَّل مع تقدمه.',
        forLabel: 'الأنسب لـ: الأطفال الذين يحتاجون تدخلًا مستمرًا في مجالات متعددة. برامج التطوير طويلة الأمد بمراحل واضحة.',
      },
    },
    {
      en: {
        title: 'Individual Development Plans',
        body: 'A personalized roadmap designed specifically for your child — detailing their unique strengths, current challenges, therapy goals, the strategies we\'ll use, and how we\'ll measure progress. Created collaboratively with you and evolves as your child grows, ensuring every aspect of care is intentional and aligned with your family\'s priorities.',
        forLabel: 'Best for: Children receiving multiple types of support who need a unified plan. Families who want clear goals, timelines, and measurable outcomes. Creating shared ownership between parents and clinicians.',
      },
      ar: {
        title: 'الخطط التنموية الفردية',
        body: 'خارطة طريق شخصية مُصمَّمة خصيصًا لطفلك — تُفصّل نقاط قوته وتحدياته الحالية وأهداف العلاج والاستراتيجيات وكيفية قياس التقدم. تُبنى بالتشارك معك وتتطور مع نموه.',
        forLabel: 'الأنسب لـ: الأطفال الذين يتلقون دعمًا متعددًا ويحتاجون خطة موحدة. الأسر التي تريد أهدافًا وجداول ونتائج قابلة للقياس.',
      },
    },
  ],
  partnership: [
    {
      en: {
        title: 'Parent Guidance',
        body: 'Expert advice, information, and education to help you understand your child\'s diagnosis, developmental needs, and progress. We give you the knowledge to feel informed and confident — so you can make the best decisions for your child and communicate effectively with schools and other professionals.',
        forLabel: 'Best for: Parents feeling overwhelmed after a new diagnosis. Families who want to understand the "why" behind their child\'s behaviors. Preparing for school meetings or navigating the education system.',
      },
      ar: {
        title: 'إرشاد الوالدين',
        body: 'نصائح ومعلومات وتثقيف متخصص لمساعدتك على فهم تشخيص طفلك واحتياجاته النمائية وتقدمه. نمنحك المعرفة لتكون مطّلعًا وواثقًا — حتى تتخذ أفضل القرارات لطفلك.',
        forLabel: 'الأنسب لـ: الوالدين الذين يشعرون بالضياع بعد تشخيص جديد. الأسر التي تريد فهم "السبب" وراء سلوكيات طفلها. التحضير لاجتماعات المدرسة.',
      },
    },
    {
      en: {
        title: 'Parent Coaching',
        body: 'Hands-on, practical training where you learn and practice evidence-based strategies with guidance from our specialists. Unlike parent guidance (which focuses on understanding), coaching focuses on doing — you practice techniques in real situations so you can implement them confidently at home.',
        forLabel: 'Best for: Parents who want to be active participants in their child\'s therapy. Extending the benefits of therapy into home routines. Learning how to handle challenging behaviors in real time.',
      },
      ar: {
        title: 'تدريب الوالدين',
        body: 'تدريب عملي تتعلم فيه وتطبق استراتيجيات مبنية على الأدلة بتوجيه من متخصصينا. على عكس الإرشاد (المُركّز على الفهم)، التدريب يُركّز على التطبيق — تُمارس الأساليب في مواقف حقيقية لتتمكن من تطبيقها بثقة في المنزل.',
        forLabel: 'الأنسب لـ: الوالدين الذين يريدون المشاركة الفاعلة في علاج طفلهم. تمديد فوائد العلاج إلى الروتين المنزلي.',
      },
    },
    {
      en: {
        title: 'Home Program Development',
        body: 'A customized set of daily activities, routines, and strategies designed for you to use consistently at home — complementing what your child works on in sessions. We create a practical, realistic plan that fits your family\'s schedule, so progress doesn\'t stop when the session ends.',
        forLabel: 'Best for: Maximizing progress by reinforcing session goals at home. Families who want structured guidance for home activities. Children who benefit from consistent repetition across environments.',
      },
      ar: {
        title: 'تطوير البرامج المنزلية',
        body: 'مجموعة مُخصصة من الأنشطة والروتين والاستراتيجيات اليومية للاستخدام في المنزل — مُكمِّلة لما يعمل عليه طفلك في الجلسات. نضع خطة عملية تناسب جدول أسرتك حتى لا يتوقف التقدم.',
        forLabel: 'الأنسب لـ: تعظيم التقدم بتعزيز أهداف الجلسة في المنزل. الأسر التي تريد توجيهًا منظمًا للأنشطة المنزلية.',
      },
    },
    {
      en: {
        title: 'Progress Reviews',
        body: 'Regular structured meetings where we review your child\'s progress toward their goals, share what the data shows, discuss what\'s working and what isn\'t, and adjust the plan as needed. You\'re fully informed about where your child stands — not just at annual checkups, but consistently throughout treatment.',
        forLabel: 'Best for: Parents who want regular, transparent updates. Adjusting therapy goals as your child grows. Shared decision-making about the direction of treatment.',
      },
      ar: {
        title: 'متابعة التقدم وقياس أثره',
        body: 'اجتماعات دورية منظمة نُراجع فيها تقدم طفلك نحو أهدافه ونشارك ما تُظهره البيانات ونناقش ما يسير بشكل جيد وما لا يسير، ونعدّل الخطة حسب الحاجة.',
        forLabel: 'الأنسب لـ: الوالدين الذين يريدون تحديثات منتظمة وشفافة. تعديل أهداف العلاج مع نمو طفلك. المشاركة في اتخاذ قرارات العلاج.',
      },
    },
    {
      en: {
        title: 'Practical Strategies for Daily Life',
        body: 'Concrete, easy-to-use strategies for managing the everyday challenges of raising a child with developmental needs — from morning routines to mealtimes, homework struggles to bedtime difficulties. These are practical tools you can apply immediately, not abstract theories.',
        forLabel: 'Best for: Reducing daily struggles like getting ready for school or transitions. Managing mealtime or sensory challenges at home. Making everyday life smoother for the whole family.',
      },
      ar: {
        title: 'استراتيجيات عملية للحياة اليومية',
        body: 'استراتيجيات ملموسة وسهلة الاستخدام لإدارة تحديات يومية تربية طفل ذي احتياجات نمائية — من روتين الصباح إلى أوقات الوجبات والواجبات وروتين النوم. أدوات عملية تُطبّقها فورًا.',
        forLabel: 'الأنسب لـ: تقليل صعوبات الاستعداد للمدرسة أو الانتقالات. إدارة تحديات أوقات الطعام أو الحساسية الحسية. تسهيل الحياة اليومية للأسرة بأكملها.',
      },
    },
    {
      en: {
        title: 'Collaborative Goal Setting',
        body: 'Working together with you to identify and prioritize the goals that matter most to your child and family. You know your child best — their personality, daily routines, what brings them joy. We bring the clinical expertise; you bring the family insight. Together we set goals that are meaningful and aligned with real life.',
        forLabel: 'Best for: Families who want their priorities reflected in the therapy plan. Ensuring goals are relevant to your child\'s actual daily life. Creating shared ownership between families and clinicians.',
      },
      ar: {
        title: 'تحديد الأهداف بالتشارك مع الأسرة',
        body: 'العمل معًا لتحديد الأهداف الأكثر أهمية وترتيبها. أنت تعرف طفلك أكثر من أي شخص — شخصيته وروتينه وما يُسعده. نحن نجلب الخبرة السريرية؛ أنت تجلب معرفة الأسرة. معًا نضع أهدافًا ذات معنى.',
        forLabel: 'الأنسب لـ: الأسر التي تريد أن تنعكس أولوياتها في خطة العلاج. ضمان أن تكون الأهداف ذات صلة بالحياة الفعلية. خلق ملكية مشتركة بين الأسر والمتخصصين.',
      },
    },
  ],
};

export default function ServicePillsClient({
  items,
  cardId,
  accent,
  locale,
}: {
  items: readonly string[];
  cardId: string;
  accent: string;
  locale: string;
}) {
  const isAr = locale === 'ar';
  const exps = EXPS[cardId] ?? [];
  const [selected, setSelected] = useState<Exp | null>(null);

  const pillCls = PILL_CLASS[accent] ?? PILL_CLASS.teal;
  const accentCls = MODAL_ACCENT[accent] ?? MODAL_ACCENT.teal;

  return (
    <>
      <ul className="flex flex-wrap gap-2 rtl:flex-row-reverse">
        {items.map((item, i) => (
          <li key={item}>
            <button
              type="button"
              onClick={() => setSelected(exps[i] ?? null)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${pillCls}`}
            >
              <span className="w-1 h-1 rounded-full bg-current opacity-60 flex-shrink-0" />
              {item}
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelected(null)}
        >
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Accent header bar */}
            <div className={`${accentCls} px-7 pt-7 pb-5`}>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute top-4 end-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
              <p className="text-white/60 text-[11px] font-semibold tracking-widest uppercase mb-1">
                {isAr ? 'خدمة' : 'Service'}
              </p>
              <h3 className="text-white font-heading text-xl leading-snug pe-8">
                {isAr ? selected.ar.title : selected.en.title}
              </h3>
            </div>

            {/* Body */}
            <div className="px-7 py-6 space-y-5 max-h-[60vh] overflow-y-auto">
              <p className="text-ink-2 text-sm leading-relaxed">
                {isAr ? selected.ar.body : selected.en.body}
              </p>
              <div className="border-t border-border pt-4">
                <p className="text-[11px] font-bold tracking-widest uppercase text-ink-2/40 mb-2">
                  {isAr ? 'متى ينطبق هذا؟' : 'When does this apply?'}
                </p>
                <p className="text-xs text-ink-2/70 leading-relaxed">
                  {isAr ? selected.ar.forLabel : selected.en.forLabel}
                </p>
              </div>
              <a
                href={`#contact`}
                onClick={() => setSelected(null)}
                className={`block w-full text-center text-sm font-semibold py-3 rounded-xl transition-colors ${
                  accent === 'teal' ? 'bg-teal text-white hover:bg-teal-dark' :
                  accent === 'coral' ? 'bg-coral text-white hover:bg-coral-dark' :
                  'bg-sage text-white hover:bg-sage-dark'
                }`}
              >
                {isAr ? 'احجز استشارة' : 'Book a Consultation'}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
