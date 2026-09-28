/** Content for the Technical practice (Nexora TechSolutions). */

export const techStats = [
  { value: '25+', label: 'Years combined team expertise' },
  { value: '5', label: 'Phase delivery cycle' },
  { value: '7', label: 'Certified SAFe disciplines' },
  { value: '5', label: 'Industries served' },
]

export const aboutCells = [
  {
    title: 'Established in 2026',
    text: 'Nexora launches backed by a leadership team with decades of enterprise IT experience across multiple technology cycles.',
  },
  {
    title: 'Specialization',
    text: 'Software development, AI‑driven solutions, and business process optimization, delivered as one coherent practice.',
  },
  {
    title: 'Experienced team',
    text: 'Development, testing, DevOps, AI, and IT consulting professionals who have shipped in regulated, high‑stakes environments.',
  },
  {
    title: 'Commitment',
    text: 'Excellence, client satisfaction, and continuous innovation — measured in outcomes, not just deliverables.',
  },
]

export const deliverySteps = [
  { title: 'Discovery', text: 'Understand objectives & constraints' },
  { title: 'Design', text: 'Architecture & sprint planning' },
  { title: 'Development', text: 'Full‑stack build, incrementally' },
  { title: 'Testing', text: 'Manual, automated, CI/CD‑gated' },
  { title: 'Deployment', text: 'DevOps‑driven go‑live & support' },
]

export const phases = [
  {
    tag: 'Phase 01 · Discovery & Planning',
    title: "Understanding the client's world first",
    items: [
      { h: 'Stakeholder engagement', p: 'We work directly with stakeholders to understand business objectives and the real constraints behind them.' },
      { h: 'Market & feasibility research', p: "Competitor analysis and feasibility studies ground the roadmap in what's actually achievable." },
      { h: 'Requirements & backlog', p: 'Business analysts define functional and non‑functional requirements, then build and prioritize the product backlog for incremental delivery.' },
      { h: 'Frequent check‑ins', p: 'Short feedback cycles keep the plan flexible enough to absorb evolving priorities without losing momentum.' },
    ],
  },
  {
    tag: 'Phase 02 · Solution Design',
    title: 'Designing the blueprint',
    items: [
      { h: 'Architecture & sprint planning', p: 'System blueprints, workflows and wireframes are designed alongside a concrete sprint plan, with security and scalability considered from day one.' },
      { h: 'Iterative design reviews', p: 'Regular reviews bring stakeholder feedback into the design before a single line of production code is written.' },
    ],
    chipsLabel: 'Technology stack',
    chips: ['Java', '.NET', 'Python', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'AWS', 'Azure', 'Google Cloud', 'MySQL', 'PostgreSQL', 'MongoDB'],
  },
  {
    tag: 'Phase 03 · Development',
    title: 'Building the solution',
    items: [
      { h: 'Full‑stack delivery', p: 'Frontend, backend and database integration handled as one continuous build, not disconnected handoffs.' },
      { h: 'Incremental & automated', p: 'Incremental coding with continuous integration keeps features shipping steadily rather than in large, risky batches.' },
      { h: 'AI‑driven automation', p: 'Process automation, chatbot development and intelligent agents are built in where they remove real friction.' },
      { h: 'Sprint discipline', p: 'Regular sprint reviews and retrospectives keep functionality — and the team — honest about progress.' },
    ],
    chipsLabel: 'Development tooling',
    chips: ['Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub', 'GitLab', 'Bitbucket'],
  },
  {
    tag: 'Phase 04 · Quality Assurance',
    title: 'Testing, before it ever reaches a client',
    items: [
      { h: 'Comprehensive coverage', p: 'Manual and automated testing verify performance, security and usability — not just that the build compiles.' },
      { h: 'Full testing spectrum', p: 'Regression, unit, integration and system testing run throughout the development cycle, not only at the end.' },
      { h: 'CI/CD‑gated', p: 'Automated testing is embedded directly in the CI/CD pipeline, so nothing regresses silently.' },
    ],
    chipsLabel: 'Testing tools',
    chips: ['Selenium', 'JMeter', 'TestNG', 'Postman', 'Cypress', 'Appium', 'Cucumber', 'Jest', 'Mocha', 'Chai'],
  },
  {
    tag: 'Phase 05 · Deployment & Beyond',
    title: 'Go‑live, then continuous improvement',
    items: [
      { h: 'DevOps‑driven rollout', p: 'Automated pipelines integrate cloud and on‑premise infrastructure, with full system verification before production release.' },
      { h: 'Client training', p: 'Structured training ensures the team on the other side can actually run what we built.' },
      { h: 'Continuous deployment', p: 'Iterative release cycles minimize disruption instead of forcing one high‑risk cutover.' },
      { h: 'Post‑launch support', p: 'Performance monitoring, feature enhancements and AI‑driven analytics for predictive maintenance keep the system improving after go‑live, with regular backlog grooming as needs evolve.' },
    ],
    chipsLabel: 'Implementation & monitoring',
    chips: ['Terraform', 'Ansible', 'Chef', 'Puppet', 'Prometheus', 'Grafana', 'New Relic', 'Splunk'],
  },
]

/** Every tool named across the delivery phases, for the home-page marquee. */
export const stackChips = phases.flatMap((p) => p.chips || [])

export const agileDevops = [
  { title: 'Agile methodology', text: 'Rapid iterations and continuous feedback keep products aligned with client needs as market demands shift.' },
  { title: 'DevOps infrastructure', text: 'Continuous integration, deployment automation and sophisticated infrastructure management reduce downtime.' },
  { title: 'Integrated tech stack', text: 'CI/CD pipelines, automated testing, Docker/Kubernetes containerization and Terraform/Ansible infrastructure‑as‑code.' },
  { title: 'Business impact', text: 'Faster release cycles, reduced operational risk, and resilient systems that scale — a measurable competitive edge.' },
]

export const services = [
  { icon: 'code', title: 'Software Development', text: 'Full‑stack builds across Java, .NET, Python and modern JS frameworks, with database integration handled end‑to‑end.' },
  { icon: 'shield', title: 'Quality Assurance', text: 'Regression, unit, integration and system testing woven into CI/CD, not bolted on at the end.' },
  { icon: 'cloud', title: 'DevOps & Cloud', text: 'CI/CD pipelines, infrastructure‑as‑code and container orchestration across AWS, Azure and Google Cloud.' },
  { icon: 'network', title: 'AI & Automation', text: 'Process automation, intelligent agents, and generative AI solutions built on TensorFlow, PyTorch and LangChain.' },
  { icon: 'doc', title: 'Business Analysis & PM', text: 'Requirement gathering, risk assessment and product lifecycle management under Agile, SAFe, Scrum and Lean.' },
  { icon: 'people', title: 'Training & Staffing', text: 'Specialized upskilling programs and end‑to‑end recruitment to help teams build in‑house capability.' },
]

export const aiStats = [
  { value: 71, tone: 'accent', title: 'of global leaders', text: 'report their organization has incorporated AI into at least one business process.' },
  { value: 60, tone: 'accent2', title: 'engagement increase', text: 'seen from a custom AI chatbot delivering real‑time, personalized recommendations.' },
  { value: 35, tone: 'sand', title: 'conversion lift', text: 'from AI‑generated marketing campaigns with automated, targeted content.' },
]

export const navigatorAgents = ['Intake Coordination Agent', 'Clinical Assessment Agent', 'Care Planning & Compliance Agent']

export const genAiSteps = [
  { title: 'Identify the challenge', text: 'Pain points and AI‑driven opportunities mapped directly to the need for personalized engagement and automated content.' },
  { title: 'Train the team', text: 'Hands‑on training in LLMs, NLP and AI‑driven automation using TensorFlow, PyTorch, OpenAI and LangChain.' },
  { title: 'Build the solution', text: 'A custom AI chatbot for real‑time recommendations, plus automated marketing content generation.' },
  { title: 'Deploy to the cloud', text: 'Seamless deployment across AWS, Azure and Google Cloud, scaling without infrastructure bottlenecks.' },
  { title: 'Measure the result', text: 'Customer engagement up 60%, sales conversion up 35%.' },
]

export const industries = [
  { title: 'Healthcare', text: 'Patient engagement & predictive diagnostics' },
  { title: 'Finance', text: 'Fraud detection & automated advisory' },
  { title: 'Legal & Compliance', text: 'Document analysis & legal research' },
  { title: 'HR & Recruitment', text: 'Candidate screening & onboarding' },
  { title: 'E‑commerce & Retail', text: 'Personalized shopping experiences' },
]

export const certifications = [
  'SAFe® Practice Consultant (SPC) & Agilist (SA)',
  'SAFe® Scrum Master (SSM) & Advanced Scrum Master (SASM)',
  'Release Train Engineer (RTE)',
  'Agile Product Management (APM) & POPM',
  'Lean Portfolio Management (LPM) · PMP',
]

export const whyUs = [
  { icon: 'spark', title: 'Licensed educators', text: 'Certified professionals across Project Management, Business Analysis, AI and technical domains.' },
  { icon: 'trophy', title: 'Proven track record', text: 'Delivered success shown through real case studies and satisfied clients.' },
  { icon: 'people', title: 'Dedicated team', text: 'A committed team of professionals accountable for project success end‑to‑end.' },
]

export const techTopics = [
  'Software development',
  'Quality assurance & testing',
  'DevOps & cloud',
  'AI & automation',
  'Business analysis & project management',
  'SAFe® / PMP training',
  'Training & staffing',
  'Something else',
]
