/** Single source of truth for site copy and navigation. */

export const COMPANY = {
  name: 'Nexora TechSolutions',
  legal: 'Nexora TechSolutions LLC',
  founded: '2026',
  email: 'minchu@nexoratechsolutionsllc.com',
  phone: '+1 (678) 925-8885',
  phoneHref: 'tel:+16789258885',
  tagline: 'Where connection becomes capability.',
  hours: 'Mon–Fri, 9:00–18:00 ET',

  /** Registered office. Kept structured so JSON-LD and the UI stay in step. */
  address: {
    street: '11535 Park Woods Circle',
    unit: 'Suite B',
    city: 'Alpharetta',
    state: 'Georgia',
    stateCode: 'GA',
    zip: '30005',
    country: 'United States',
    countryCode: 'US',
    /** Single-line form, for meta tags and plain-text contexts. */
    oneLine: '11535 Park Woods Circle, Suite B, Alpharetta, Georgia 30005',
    /** Display lines, so the address renders the way post is addressed. */
    lines: ['11535 Park Woods Circle, Suite B', 'Alpharetta, GA 30005', 'United States'],
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent('11535 Park Woods Circle, Suite B, Alpharetta, GA 30005'),
    /**
     * Embed source for the map iframe.
     *
     * Uses the official Maps Embed API when VITE_GOOGLE_MAPS_EMBED_KEY is set,
     * and otherwise the keyless `output=embed` URL — so the map works with no
     * Google Cloud billing account, and upgrades cleanly when you add a key.
     */
    get embedUrl() {
      const query = encodeURIComponent('11535 Park Woods Circle, Suite B, Alpharetta, GA 30005')
      const key = import.meta.env?.VITE_GOOGLE_MAPS_EMBED_KEY
      return key
        ? `https://www.google.com/maps/embed/v1/place?key=${key}&q=${query}&zoom=15`
        : `https://maps.google.com/maps?q=${query}&z=15&output=embed`
    },
  },
}

export const NAV = [
  { to: '/about', label: 'About' },
  { to: '/process', label: 'Process' },
  { to: '/services', label: 'Services' },
  { to: '/ai-solutions', label: 'AI Solutions' },
  { to: '/consulting', label: 'Consulting' },
  { to: '/img-pathway', label: 'IMG Pathway' },
  { to: '/careers', label: 'Careers' },
]

export const HERO_STATS = [
  { value: 25, suffix: '+', label: 'Years combined team expertise' },
  { value: 5, suffix: '', label: 'Phase delivery cycle' },
  { value: 7, suffix: '', label: 'Certified SAFe disciplines' },
  { value: 5, suffix: '', label: 'Industries served' },
]

export const MARQUEE_ITEMS = [
  'Java', '.NET', 'Python', 'TypeScript', 'React', 'Angular', 'Vue.js',
  'AWS', 'Azure', 'Google Cloud', 'Kubernetes', 'Terraform', 'PostgreSQL',
  'MongoDB', 'TensorFlow', 'PyTorch', 'LangChain', 'Jenkins', 'Prometheus',
]

export const ABOUT_CELLS = [
  {
    n: '1',
    title: 'Established in 2026',
    body: 'Nexora launches backed by a leadership team with decades of enterprise IT experience across multiple technology cycles.',
  },
  {
    n: '2',
    title: 'Specialization',
    body: 'Software development, AI-driven solutions, and business process optimization, delivered as one coherent practice.',
  },
  {
    n: '3',
    title: 'Experienced team',
    body: 'Development, testing, DevOps, AI, and IT consulting professionals who have shipped in regulated, high-stakes environments.',
  },
  {
    n: '4',
    title: 'Commitment',
    body: 'Excellence, client satisfaction, and continuous innovation — measured in outcomes, not just deliverables.',
  },
]

export const VALUES = [
  {
    icon: 'compass',
    title: 'Assessment before advice',
    body: 'We establish where things actually stand before recommending anything. A plan written without a baseline is a guess with formatting.',
  },
  {
    icon: 'calendar',
    title: 'Dated checkpoints',
    body: 'Every phase closes with a decision point. Problems surface while there is still runway to solve them, not at the retrospective.',
  },
  {
    icon: 'user',
    title: 'One accountable owner',
    body: 'A named point of contact carries the engagement end to end. Escalation never means re-explaining the context to someone new.',
  },
  {
    icon: 'chart',
    title: 'Evidence over optimism',
    body: 'Plans adjust on measured signals — test results, deployment metrics, stakeholder feedback — rather than on how the last meeting felt.',
  },
]

export const TIMELINE = [
  {
    year: '2026 · Q1',
    title: 'Nexora TechSolutions LLC is founded',
    body: 'A leadership team with decades of combined enterprise delivery experience formalises a single practice covering software, AI, cloud and delivery leadership.',
  },
  {
    year: '2026 · Q2',
    title: 'Five-phase delivery cycle codified',
    body: 'Discovery, Design, Development, Testing and Deployment are defined as one connected cycle with feedback loops back to the client at each phase boundary.',
  },
  {
    year: '2026 · Q3',
    title: 'AI agent practice established',
    body: 'Purpose-built agent architectures on AWS, Azure and Google Cloud, applied first in healthcare intake and retail personalisation.',
  },
  {
    year: '2026 · Q4',
    title: 'Nexora IMG Pathway launches',
    body: 'The same operating model — assessment, dated checkpoints, single ownership — extended to international medical graduates pursuing U.S. residency.',
  },
]

export const PROCESS_STEPS = [
  { n: '01', title: 'Discovery', body: 'Understand objectives & constraints' },
  { n: '02', title: 'Design', body: 'Architecture & sprint planning' },
  { n: '03', title: 'Development', body: 'Full-stack build, incrementally' },
  { n: '04', title: 'Testing', body: 'Manual, automated, CI/CD-gated' },
  { n: '05', title: 'Deployment', body: 'DevOps-driven go-live & support' },
]

export const PROCESS_BLOCKS = [
  {
    tag: 'Phase 01 · Discovery & Planning',
    title: "Understanding the client's world first",
    items: [
      {
        h: 'Stakeholder engagement',
        p: 'We work directly with stakeholders to understand business objectives and the real constraints behind them.',
      },
      {
        h: 'Market & feasibility research',
        p: "Competitor analysis and feasibility studies ground the roadmap in what's actually achievable.",
      },
      {
        h: 'Requirements & backlog',
        p: 'Business analysts define functional and non-functional requirements, then build and prioritize the product backlog for incremental delivery.',
      },
      {
        h: 'Frequent check-ins',
        p: 'Short feedback cycles keep the plan flexible enough to absorb evolving priorities without losing momentum.',
      },
    ],
  },
  {
    tag: 'Phase 02 · Solution Design',
    title: 'Designing the blueprint',
    items: [
      {
        h: 'Architecture & sprint planning',
        p: 'System blueprints, workflows and wireframes are designed alongside a concrete sprint plan, with security and scalability considered from day one.',
      },
      {
        h: 'Iterative design reviews',
        p: 'Regular reviews bring stakeholder feedback into the design before a single line of production code is written.',
      },
    ],
    chipLabel: 'Technology stack',
    chips: [
      'Java', '.NET', 'Python', 'JavaScript', 'TypeScript', 'React', 'Angular',
      'Vue.js', 'AWS', 'Azure', 'Google Cloud', 'MySQL', 'PostgreSQL', 'MongoDB',
    ],
  },
  {
    tag: 'Phase 03 · Development',
    title: 'Building the solution',
    items: [
      {
        h: 'Full-stack delivery',
        p: 'Frontend, backend and database integration handled as one continuous build, not disconnected handoffs.',
      },
      {
        h: 'Incremental & automated',
        p: 'Incremental coding with continuous integration keeps features shipping steadily rather than in large, risky batches.',
      },
      {
        h: 'AI-driven automation',
        p: 'Process automation, chatbot development and intelligent agents are built in where they remove real friction.',
      },
      {
        h: 'Sprint discipline',
        p: 'Regular sprint reviews and retrospectives keep functionality — and the team — honest about progress.',
      },
    ],
    chipLabel: 'Development tooling',
    chips: ['Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub', 'GitLab', 'Bitbucket'],
  },
  {
    tag: 'Phase 04 · Quality Assurance',
    title: 'Testing, before it ever reaches a client',
    items: [
      {
        h: 'Comprehensive coverage',
        p: 'Manual and automated testing verify performance, security and usability — not just that the build compiles.',
      },
      {
        h: 'Full testing spectrum',
        p: 'Regression, unit, integration and system testing run throughout the development cycle, not only at the end.',
      },
      {
        h: 'CI/CD-gated',
        p: 'Automated testing is embedded directly in the CI/CD pipeline, so nothing regresses silently.',
      },
    ],
    chipLabel: 'Testing tools',
    chips: ['Selenium', 'JMeter', 'TestNG', 'Postman', 'Cypress', 'Appium', 'Cucumber', 'Jest', 'Mocha', 'Chai'],
  },
  {
    tag: 'Phase 05 · Deployment & Beyond',
    title: 'Go-live, then continuous improvement',
    items: [
      {
        h: 'DevOps-driven rollout',
        p: 'Automated pipelines integrate cloud and on-premise infrastructure, with full system verification before production release.',
      },
      {
        h: 'Client training',
        p: 'Structured training ensures the team on the other side can actually run what we built.',
      },
      {
        h: 'Continuous deployment',
        p: 'Iterative release cycles minimize disruption instead of forcing one high-risk cutover.',
      },
      {
        h: 'Post-launch support',
        p: 'Performance monitoring, feature enhancements and AI-driven analytics for predictive maintenance keep the system improving after go-live, with regular backlog grooming as needs evolve.',
      },
    ],
    chipLabel: 'Implementation & monitoring',
    chips: ['Terraform', 'Ansible', 'Chef', 'Puppet', 'Prometheus', 'Grafana', 'New Relic', 'Splunk'],
  },
]

export const IMPACT_CELLS = [
  {
    title: 'Agile methodology',
    body: 'Rapid iterations and continuous feedback keep products aligned with client needs as market demands shift.',
  },
  {
    title: 'DevOps infrastructure',
    body: 'Continuous integration, deployment automation and sophisticated infrastructure management reduce downtime.',
  },
  {
    title: 'Integrated tech stack',
    body: 'CI/CD pipelines, automated testing, Docker/Kubernetes containerization and Terraform/Ansible infrastructure-as-code.',
  },
  {
    title: 'Business impact',
    body: 'Faster release cycles, reduced operational risk, and resilient systems that scale — a measurable competitive edge.',
  },
]

export const SERVICES = [
  {
    slug: 'software-development',
    icon: 'code',
    title: 'Software Development',
    body: 'Full-stack builds across Java, .NET, Python and modern JS frameworks, with database integration handled end-to-end.',
    detail: [
      'Greenfield product builds and legacy modernisation, delivered incrementally rather than as one high-risk cutover.',
      'API design, service decomposition and data modelling handled by the same team that ships the interface.',
      'Accessibility, performance budgets and security review built into definition of done — not filed as follow-up tickets.',
    ],
    stack: ['Java', '.NET', 'Python', 'TypeScript', 'React', 'Angular', 'Vue.js', 'PostgreSQL', 'MongoDB'],
  },
  {
    slug: 'quality-assurance',
    icon: 'shield',
    title: 'Quality Assurance',
    body: 'Regression, unit, integration and system testing woven into CI/CD, not bolted on at the end.',
    detail: [
      'Test strategy written alongside the architecture, so coverage follows risk rather than convenience.',
      'Automated regression suites gated in the pipeline, with manual exploratory passes where judgement matters.',
      'Performance, security and usability verification as first-class checks, each with a pass threshold agreed up front.',
    ],
    stack: ['Selenium', 'Cypress', 'Jest', 'TestNG', 'JMeter', 'Postman', 'Appium', 'Cucumber'],
  },
  {
    slug: 'devops-cloud',
    icon: 'clock',
    title: 'DevOps & Cloud',
    body: 'CI/CD pipelines, infrastructure-as-code and container orchestration across AWS, Azure and Google Cloud.',
    detail: [
      'Pipelines that build, test, scan and deploy without a human holding the handle.',
      'Infrastructure defined in code and reviewed like code, so environments stop drifting apart.',
      'Observability wired in before launch — metrics, logs and alerts that point at a cause, not just a symptom.',
    ],
    stack: ['Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'Prometheus', 'Grafana', 'Splunk'],
  },
  {
    slug: 'ai-automation',
    icon: 'network',
    title: 'AI & Automation',
    body: 'Process automation, intelligent agents, and generative AI solutions built on TensorFlow, PyTorch and LangChain.',
    detail: [
      'Agent architectures scoped against a real operational bottleneck, with a measurable before-and-after.',
      'Retrieval, tool use and evaluation harnesses built in from the start, so quality is observable rather than anecdotal.',
      'Human-in-the-loop checkpoints wherever the cost of a wrong answer is higher than the cost of a pause.',
    ],
    stack: ['TensorFlow', 'PyTorch', 'OpenAI', 'Hugging Face', 'LangChain', 'AWS', 'Azure', 'Google Cloud'],
  },
  {
    slug: 'business-analysis',
    icon: 'doc',
    title: 'Business Analysis & PM',
    body: 'Requirement gathering, risk assessment and product lifecycle management under Agile, SAFe, Scrum and Lean.',
    detail: [
      'Functional and non-functional requirements written to be testable, not to be signed off.',
      'Backlog construction and prioritisation tied to business outcomes with explicit trade-offs recorded.',
      'Risk registers that are reviewed on a cadence rather than produced once and archived.',
    ],
    stack: ['Agile', 'SAFe', 'Scrum', 'Lean', 'Jira', 'Confluence'],
  },
  {
    slug: 'training-staffing',
    icon: 'people',
    title: 'Training & Staffing',
    body: 'Specialized upskilling programs and end-to-end recruitment to help teams build in-house capability.',
    detail: [
      'Hands-on training built around your stack and your codebase, not a generic curriculum.',
      'Certification tracks across SAFe, project management, business analysis and AI engineering.',
      'End-to-end recruitment and workforce management for teams scaling a capability they intend to keep.',
    ],
    stack: ['SAFe', 'PMP', 'Scrum', 'AI Engineering', 'Business Analysis'],
  },
]

export const AI_STATS = [
  {
    pct: 71,
    color: 'var(--accent)',
    title: 'of global leaders',
    body: 'report their organization has incorporated AI into at least one business process.',
  },
  {
    pct: 60,
    color: 'var(--accent2)',
    title: 'engagement increase',
    body: 'seen from a custom AI chatbot delivering real-time, personalized recommendations.',
  },
  {
    pct: 35,
    color: '#D8CBA6',
    title: 'conversion lift',
    body: 'from AI-generated marketing campaigns with automated, targeted content.',
  },
]

export const GENAI_STEPS = [
  {
    n: '01',
    title: 'Identify the challenge',
    body: 'Pain points and AI-driven opportunities mapped directly to the need for personalized engagement and automated content.',
  },
  {
    n: '02',
    title: 'Train the team',
    body: 'Hands-on training in LLMs, NLP and AI-driven automation using TensorFlow, PyTorch, OpenAI and LangChain.',
  },
  {
    n: '03',
    title: 'Build the solution',
    body: 'A custom AI chatbot for real-time recommendations, plus automated marketing content generation.',
  },
  {
    n: '04',
    title: 'Deploy to the cloud',
    body: 'Seamless deployment across AWS, Azure and Google Cloud, scaling without infrastructure bottlenecks.',
  },
  {
    n: '05',
    title: 'Measure the result',
    body: 'Customer engagement up 60%, sales conversion up 35%.',
  },
]

export const INDUSTRIES = [
  { name: 'Healthcare', body: 'Patient engagement & predictive diagnostics' },
  { name: 'Finance', body: 'Fraud detection & automated advisory' },
  { name: 'Legal & Compliance', body: 'Document analysis & legal research' },
  { name: 'HR & Recruitment', body: 'Candidate screening & onboarding' },
  { name: 'E-commerce & Retail', body: 'Personalized shopping experiences' },
]

export const CONSULT_COLS = [
  {
    tag: 'Delivery Leadership',
    title: 'Business Analysis, Project & Product Management',
    body: 'Certified professionals guide business process optimization, stakeholder engagement and strategic decision-making — with deep expertise in product lifecycle management, requirement gathering, risk assessment and market strategy.',
    note: 'Methodologies: Agile · SAFe · Scrum · Lean',
  },
  {
    tag: 'Certified Training',
    title: 'Elite Program & Project Management Training',
    body: 'Hands-on training led by certified SAFe experts, bridging the gap between theory and practical application — covering end-to-end project lifecycle, enterprise agility, strategic planning and risk assessment.',
    certs: [
      'SAFe® Practice Consultant (SPC) & Agilist (SA)',
      'SAFe® Scrum Master (SSM) & Advanced Scrum Master (SASM)',
      'Release Train Engineer (RTE)',
      'Agile Product Management (APM) & POPM',
      'Lean Portfolio Management (LPM) · PMP',
    ],
  },
  {
    tag: 'Workforce',
    title: 'Training & Staffing Solutions',
    body: 'Specialized training programs across IT, AI, Business Analysis, HR and Project Management, paired with end-to-end recruitment and workforce management.',
    extra: 'We upskill professionals with industry-relevant expertise and help businesses build skilled teams for long-term success.',
  },
]

export const WHY_CARDS = [
  {
    icon: 'sun',
    title: 'Licensed educators',
    body: 'Certified professionals across Project Management, Business Analysis, AI and technical domains.',
  },
  {
    icon: 'trophy',
    title: 'Proven track record',
    body: 'Delivered success shown through real case studies and satisfied clients.',
  },
  {
    icon: 'team',
    title: 'Dedicated team',
    body: 'A committed team of professionals accountable for project success end-to-end.',
  },
]

export const TEAM = [
  {
    initial: 'A',
    name: 'Arun Sundaram',
    role: 'Managing Partner, Delivery',
    cred: 'SAFe® SPC · PMP',
    bio: 'Two decades running enterprise programmes in regulated environments, from core banking migrations to hospital systems integration.',
    bg: 'linear-gradient(135deg,#B5602A,#8A431A)',
  },
  {
    initial: 'M',
    name: 'Meera Raghavan',
    role: 'Head of AI Engineering',
    cred: 'MS Computer Science',
    bio: 'Builds agent architectures that survive contact with production — evaluation harnesses, guardrails and the monitoring to prove they work.',
    bg: 'linear-gradient(135deg,#2E5C4E,#1B382E)',
  },
  {
    initial: 'D',
    name: 'Daniel Okoye',
    role: 'Principal, Platform & DevOps',
    cred: 'CKA · AWS Solutions Architect',
    bio: 'Turns brittle release processes into pipelines teams trust, with infrastructure defined in code and observability built in before launch.',
    bg: 'linear-gradient(135deg,#6B6558,#3D392F)',
  },
]

/* ---- IMG Pathway ---- */

export const IMG_FRICTIONS = [
  {
    n: '01',
    title: 'No single roadmap',
    body: 'Exams, rotations, research and applications get handled as separate errands. The sequencing between them is where most of the lost time actually goes.',
  },
  {
    n: '02',
    title: 'Fixed deadlines, no retries',
    body: 'The application calendar does not move. A decision taken late in one track quietly closes options in another, often before anyone notices.',
  },
  {
    n: '03',
    title: 'Score plateaus',
    body: "Study hours climb while practice scores stay flat — usually because the volume changed and the method didn't.",
  },
  {
    n: '04',
    title: 'Thin U.S. exposure',
    body: 'Clinical experience and letters get arranged too late to strengthen the application that needed them.',
  },
  {
    n: '05',
    title: 'Research started late',
    body: 'Publication timelines run in months, not weeks. A late start rarely lands inside the submission window it was meant for.',
  },
  {
    n: '06',
    title: 'Interviews left to instinct',
    body: 'The interview is treated as the easy part that comes after the hard parts — and it is the part that decides the outcome.',
  },
]

export const IMG_TRACKS = [
  {
    icon: 'book',
    title: 'USMLE Step preparation',
    body: 'A diagnostic first, then a study plan built around your real timeline, with scheduled score checkpoints across Step 1, Step 2 CK and Step 3.',
  },
  {
    icon: 'layers',
    title: 'Match mentorship',
    body: 'A roadmap shaped by your scores, specialty, visa situation and year of graduation — reviewed on a fixed cadence, not only when something goes wrong.',
  },
  {
    icon: 'file',
    title: 'ERAS application support',
    body: 'CV structure, personal statement development, letter strategy and programme signalling — assembled against the cycle calendar rather than in the last fortnight.',
  },
  {
    icon: 'person',
    title: 'Interview preparation',
    body: "Mock interviews with recorded feedback, frameworks for the questions that recur every year, and rehearsal for the ones that don't.",
  },
  {
    icon: 'steth',
    title: 'U.S. clinical experience',
    body: 'Guidance on securing observerships and externships — and on turning them into letters that say something specific about you.',
  },
  {
    icon: 'search',
    title: 'Research & publication',
    body: "Mentored project scoping, honest authorship conversations, and publication timing planned backwards from your target specialty's deadlines.",
  },
]

export const IMG_CYCLE = [
  {
    n: '01',
    title: 'Assess',
    body: 'Profile review, score baseline, visa and timeline constraints on the table before any plan is written.',
  },
  {
    n: '02',
    title: 'Prepare',
    body: 'Step preparation with a method that gets adjusted when the checkpoint score says it should be.',
  },
  {
    n: '03',
    title: 'Build',
    body: "Clinical experience and research placed early enough to appear in this cycle's application.",
  },
  {
    n: '04',
    title: 'Apply',
    body: 'CV, personal statement, letters, programme list and signals assembled against the ERAS calendar.',
  },
  {
    n: '05',
    title: 'Match',
    body: 'Interview rehearsal, ranking strategy, and real-time support through SOAP if it comes to that.',
  },
]

export const IMG_COMPARE = {
  usual: [
    'A question bank, a course and an editor, each unaware of the others.',
    'Advice arrives when you ask for it, which is usually after the decision.',
    'Exam strategy disconnected from application strategy.',
    'Rotations and research treated as add-ons rather than scheduled inputs.',
    'No one accountable when a deadline slips.',
  ],
  ours: [
    'A single roadmap covering exams, experience, application and interviews.',
    'Scheduled checkpoints, so problems surface while there is still time to fix them.',
    'Every track timed against the cycle calendar it has to land in.',
    'Plans adjusted on evidence — scores, feedback, interview invites — not on optimism.',
    'One named point of contact who owns the outcome end to end.',
  ],
}

export const IMG_FAQ = [
  {
    q: "I've already had an unsuccessful cycle. Is it too late?",
    a: "No. A cycle that didn't go your way is diagnostic information most first-time applicants don't have. The starting point is working out which part of the application actually underperformed — the score, the experience, the programme list, or the interview — and rebuilding from there rather than repeating the same submission.",
  },
  {
    q: 'Do you only take strong scorers?',
    a: 'No. The plan is built from where you stand now, including attempt history and time since graduation. What we ask for is a realistic conversation about which specialties and programme tiers your profile can reach in this cycle, and what it would take to widen that.',
  },
  {
    q: 'How is this different from a question bank subscription?',
    a: "A question bank gives you material. This gives you sequence, review and accountability around it. You still do the studying; what changes is that someone checks whether the method is producing score movement and reshapes the plan when it isn't.",
  },
  {
    q: 'Can I take one track instead of the whole pathway?',
    a: "Yes. Individual tracks — interview preparation ahead of a season, or personal statement and CV work alone — can be taken on their own. The assessment call will tell you honestly whether a single track is enough for what you're trying to do.",
  },
  {
    q: 'How do I start?',
    a: "Get in touch by email or phone and we'll set up an assessment call. It covers where your profile stands today, what the next twelve months would need to look like, and which parts of the pathway are worth paying for in your case.",
  },
]

export const IMG_TIERS = [
  {
    name: 'Single Track',
    for: 'One gap, clearly identified',
    featured: false,
    items: [
      'One track of your choice',
      'Diagnostic call and written plan',
      'Scheduled review checkpoints',
      'Direct access to your track mentor',
    ],
  },
  {
    name: 'Cycle Programme',
    for: 'One full application cycle',
    featured: true,
    items: [
      'All six tracks, sequenced as one plan',
      'Named point of contact throughout',
      'Fortnightly checkpoint reviews',
      'ERAS assembly against the cycle calendar',
      'Interview rehearsal with recorded feedback',
      'SOAP support if it comes to that',
    ],
  },
  {
    name: 'Multi-Cycle',
    for: 'Rebuilding after an unmatched year',
    featured: false,
    items: [
      'Everything in the Cycle Programme',
      'Post-cycle diagnostic of what underperformed',
      'Research and clinical experience placed a year ahead',
      'Specialty and programme-tier strategy review',
    ],
  },
]

/* ---- Careers ---- */

export const OPEN_ROLES = [
  { title: 'Senior Full-Stack Engineer', team: 'Engineering', location: 'Remote (US)', type: 'Full-time' },
  { title: 'AI/ML Engineer', team: 'AI Practice', location: 'Remote (US)', type: 'Full-time' },
  { title: 'DevOps / Platform Engineer', team: 'Platform', location: 'Remote (US)', type: 'Full-time' },
  { title: 'QA Automation Engineer', team: 'Quality', location: 'Remote (Global)', type: 'Contract' },
  { title: 'Business Analyst', team: 'Delivery', location: 'Remote (US)', type: 'Full-time' },
  { title: 'SAFe Program Consultant', team: 'Consulting', location: 'Hybrid · US', type: 'Full-time' },
  { title: 'IMG Pathway Mentor (MD/DO)', team: 'IMG Pathway', location: 'Remote (US)', type: 'Part-time' },
]

export const BENEFITS = [
  {
    icon: 'compass',
    title: 'Ownership, not tickets',
    body: 'Engineers carry a problem from discovery through production, including the decision about what not to build.',
  },
  {
    icon: 'calendar',
    title: 'Sustainable cadence',
    body: 'Incremental delivery exists so nobody has to absorb a big-bang release weekend. We hold to that.',
  },
  {
    icon: 'chart',
    title: 'Certification funded',
    body: 'SAFe, cloud and AI engineering certifications are paid for, with study time inside working hours.',
  },
  {
    icon: 'user',
    title: 'Remote-first, genuinely',
    body: 'Written-first communication, recorded decisions, and meetings that survive being missed.',
  },
]
