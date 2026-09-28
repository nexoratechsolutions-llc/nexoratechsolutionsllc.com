/** Content for the Medical practice (Nexora Medical). */

export const medStats = [
  { value: '4', label: 'Program tracks' },
  { value: '3', label: 'USMLE Steps covered' },
  { value: '25+', label: 'Individual programs' },
  { value: '9–12', label: 'Grades for Junior Scientist' },
]

export const friction = [
  { title: 'No single roadmap', text: 'Exams, rotations, research and applications get handled as separate errands. The sequencing between them is where most of the lost time actually goes.' },
  { title: 'Fixed deadlines, no retries', text: 'The application calendar does not move. A decision taken late in one track quietly closes options in another, often before anyone notices.' },
  { title: 'Score plateaus', text: "Study hours climb while practice scores stay flat — usually because the volume changed and the method didn't." },
  { title: 'Thin U.S. exposure', text: 'Clinical experience and letters get arranged too late to strengthen the application that needed them.' },
  { title: 'Research started late', text: 'Publication timelines run in months, not weeks. A late start rarely lands inside the submission window it was meant for.' },
  { title: 'Interviews left to instinct', text: 'The interview is treated as the easy part that comes after the hard parts — and it is the part that decides the outcome.' },
]

export const tracks = [
  {
    icon: 'book',
    to: '/medical/coaching',
    kicker: '01 · USMLE Coaching',
    title: 'Step 1, Step 2 CK and Step 3',
    text: 'Crash courses close to test day, six-month mastery programs from the basics, and one-on-one tutoring when you need someone working problems alongside you.',
  },
  {
    icon: 'clipboard',
    to: '/medical/rotations',
    kicker: '02 · Clinical Rotations',
    title: 'U.S. experience that turns into letters',
    text: 'Hands-on placements secured early enough to count — and guidance on leaving each one with a letter that says something specific about you.',
  },
  {
    icon: 'flask',
    to: '/medical/research',
    kicker: '03 · Research',
    title: 'An academic profile that holds up',
    text: 'Opportunity matching, publication strategy and a plan for how each paper shows up on ERAS — from a first co-authorship to a 12-month fellowship.',
  },
  {
    icon: 'target',
    to: '/medical/match',
    kicker: '04 · Residency Match',
    title: 'ERAS to Match Day — and SOAP',
    text: 'Every piece of the application, reviewed against the cycle calendar so nothing is left to the last two weeks.',
  },
]

export const coachingPrograms = [
  { pills: [{ label: 'Recorded' }, { label: '10 days' }], title: 'Step 1 High-Yield Crash Course', text: 'A focused ten-day run through the highest-yield Step 1 concepts, recorded so you can work it around your own study blocks.' },
  { pills: [{ label: 'Live', live: true }, { label: '7 days' }], title: 'Step 2 CK Live Crash Course', text: 'Seven live days of clinical reasoning, management algorithms and question strategy in the final stretch before your exam.' },
  { pills: [{ label: 'Live', live: true }, { label: '8 days' }], title: 'Step 3 Live Crash Course', text: 'Eight live days covering the MCQ content and CCS case simulations, with a plan for both exam days.' },
  { pills: [{ label: '6 months' }, { label: 'From the basics' }], title: 'Step 1 Mastery', text: 'A structured six-month program that rebuilds foundations system by system, with scheduled self-assessments to track movement.' },
  { pills: [{ label: 'NBME-style' }, { label: 'Step 1 & Step 2' }], title: 'NBME-Style Coaching', text: 'Coaching built around how NBME questions are written — reading the stem, spotting the trap, and fixing the reasoning behind wrong answers.' },
  { pills: [{ label: '1:1', live: true }, { label: 'Done-with-you' }], title: 'One-on-One Tutoring', text: 'A tutor works through your weak areas with you, session by session, and adjusts the plan when your practice scores say it should.' },
]

export const rotationPrograms = [
  { pills: [{ label: 'USCE' }], title: 'Rotation placements', text: 'Externships, clerkships and observerships matched to your specialty goals and application timeline.' },
  { pills: [{ label: 'LORs' }], title: 'Letters of recommendation', text: 'Guidance on how to earn a strong U.S. letter during the rotation — and how to ask for it.' },
  { pills: [{ label: 'Browse' }], title: 'Placement list', text: 'A list of available rotations by specialty, location and dates. Ask us for the current list on your guidance call.' },
]

export const researchPrograms = [
  { flag: true, pills: [{ label: 'Flagship', live: true }, { label: '12 months' }], title: 'Research Catalyst', text: 'A year-long, mentored program that takes you from research question to submitted manuscript, with abstracts and presentations along the way.' },
  { pills: [{ label: 'Live', live: true }, { label: 'Mentored' }], title: 'Original Research', text: 'Design and run your own study with a mentor who reviews each stage: question, methods, data, and write-up.' },
  { pills: [{ label: 'Co-author → Lead author' }], title: 'Get Published', text: 'Join active projects as a contributor and work up to lead authorship. Authorship follows ICMJE criteria and is earned, never sold.' },
  { flag: true, pills: [{ label: 'Live', live: true }, { label: 'Grades 9–12' }], title: 'Junior Scientist Program', text: 'Real, mentored medical research for high-school students, from reading their first paper to writing their own.', link: { to: '/medical/junior-scientist', label: 'See the full program' } },
  { pills: [{ label: '12 months' }, { label: 'Placement' }], title: 'J-1 Research Fellowship Placement', text: 'Support to find and secure a year-long research fellowship at a U.S. institution.' },
  { pills: [{ label: 'Live', live: true }, { label: 'Per outreach cycle' }], title: 'Strategic Networking', text: 'A structured outreach plan to reach researchers and faculty in your target specialty, with messaging you can actually send.' },
]

export const matchPrograms = [
  { pills: [{ label: 'Framework' }], title: 'Match Mentorship', text: 'Recorded masterclasses and a clear framework for planning your whole cycle.' },
  { pills: [{ label: 'ERAS' }], title: 'ERAS CV', text: 'A full CV overhaul so experiences read clearly to program directors.' },
  { pills: [{ label: 'Writing' }], title: 'Personal Statement', text: 'Develop a statement that sounds like you and explains why this specialty.' },
  { pills: [{ label: 'Editing' }], title: 'LOR Editing', text: 'Review and editing support for your letters of recommendation.' },
  { pills: [{ label: 'Mock interviews', live: true }], title: 'Interview Preparation', text: 'Mock interviews with feedback and a strategy for the questions that come up every year.' },
  { pills: [{ label: 'Advanced' }], title: 'Advanced Interviewing', text: 'A deeper course for candidates who want to stand out in difficult interviews.' },
  { pills: [{ label: 'Signals' }], title: 'Program Signaling Strategy', text: 'Plan where your gold and silver signals go for the best return.' },
  { pills: [{ label: 'Real-time', live: true }], title: 'SOAP Support', text: 'Real-time guidance through the Supplemental Offer and Acceptance Program week.' },
]

export const cycleSteps = [
  { title: 'Assess', text: 'Profile review, score baseline, visa and timeline constraints on the table before any plan is written.' },
  { title: 'Prepare', text: 'Step preparation with a method that gets adjusted when the checkpoint score says it should be.' },
  { title: 'Build', text: "Clinical experience and research placed early enough to appear in this cycle's application." },
  { title: 'Apply', text: 'CV, personal statement, letters, programme list and signals assembled against the ERAS calendar.' },
  { title: 'Match', text: 'Interview rehearsal, ranking strategy, and real-time support through SOAP if it comes to that.' },
]

/* ---------- Junior Scientist ---------- */

export const juniorStats = [
  { value: '2 hrs', label: 'per week — one ~90-min live call plus light homework' },
  { value: '6–8 mo', label: 'typical time to a publication' },
  { value: '9–12', label: "grades it's built for (motivated undergrads welcome)" },
  { value: '1 mo', label: 'trial with refundable deposit' },
]

export const juniorProblems = [
  { title: 'No real mentor', text: 'Working researchers rarely have time to teach a teenager, so students get busywork with no guidance.' },
  { title: 'Resume padding', text: 'Pay-to-publish journals and a week of shadowing impress parents, but not the people reading applications.' },
  { title: 'No skills that carry', text: 'Students never learn to read a paper, design a study or write one — so nothing transfers to college.' },
]

export const juniorFeatures = [
  { title: 'One real project', text: 'Students join an actual medical study and carry their part for months.' },
  { title: 'Weekly live mentorship', text: 'A physician-researcher critiques the work every week, the way a real lab does.' },
  { title: 'The full arc, in order', text: 'Reading, judging evidence, study design, data, and writing — in sequence.' },
  { title: 'Present and defend', text: 'Students explain their work and field hard questions each week.' },
  { title: 'AI, used properly', text: 'Draft and critique with AI, then check every claim against the evidence.' },
  { title: 'Every session recorded', text: "A busy school week doesn't mean a lost session." },
]

export const curriculum = [
  { when: '01 · Weeks 1–6', title: 'Read a paper without fear' },
  { when: '02 · Weeks 1–6', title: 'Tell strong evidence from weak' },
  { when: '03 · Weeks 6–14', title: 'Design a study' },
  { when: '04 · Weeks 14–22', title: 'Handle data & statistics' },
  { when: '05 · Ongoing', title: 'Do research ethically' },
  { when: '06 · Ongoing', title: 'Use AI like a scientist' },
  { when: '07 · Weeks 22–28', title: 'Write for publication' },
  { when: '08 · Weeks 28+', title: 'Present, submit & apply' },
]

export const studies = [
  { tag: 'Dermatology · AI', title: 'Can a phone photo measure skin-disease severity?', text: 'Testing whether smartphone images can score severity as well as a specialist, across all skin tones.' },
  { tag: 'Public health', title: 'A simple vaccine-safety screening tool', text: 'Designing and testing a short screening questionnaire that parents and health workers can actually understand.' },
  { tag: 'Engineering · Muscle disease', title: 'Can a video measure muscle strength?', text: 'A phone-camera approach to tracking strength from a sit-to-stand movement.' },
  { tag: 'Trial design', title: 'Designing a fair clinical trial', text: 'How to run an experiment that gives an honest answer — and how not to fool yourself.' },
  { tag: 'Medical writing', title: 'Case reports to journal standard', text: 'Writing up unusual patient cases to published reporting guidelines — often the fastest route to a first publication.' },
]

export const compareRows = [
  { k: 'Who teaches', us: 'A physician-researcher, directly', them: 'A coordinator, grad student, or no one' },
  { k: 'The work', us: 'One real study, owned for months', them: "Busywork or a name on someone else's project" },
  { k: 'Skills', us: 'Read, design, analyze, write, present', them: 'Few that carry past the program' },
  { k: 'Result', us: 'A path to a peer-reviewed paper and abstracts', them: 'A certificate or pay-to-publish listing' },
  { k: 'Built for', us: 'High schoolers, grades 9–12', them: 'Mostly medical students' },
  { k: 'Risk to start', us: 'One-month trial, refundable deposit', them: 'Paid up front, no guarantee' },
]

export const yearCompare = {
  without: {
    tag: 'Without the program',
    title: 'Another line on the application',
    items: [
      'An activity that fills space and teaches little.',
      'An application that blends in with thousands of others.',
      'Still no idea how real research works.',
      'Nothing they can point to as their own.',
    ],
  },
  with: {
    tag: 'With the program',
    title: 'Proof of real work',
    items: [
      'A real study, carried from question to finished paper.',
      'A paper and abstracts with their name on them, if earned.',
      'Skills that carry into college and a medical career.',
      "An application built on proof, with a physician's letter behind it.",
    ],
  },
}

export const juniorPrice = {
  amount: 4000,
  currency: 'USD',
  label: 'High school research fellowship',
  includes: [
    'A real role on a physician-led study',
    'Weekly one-on-one and small-group mentorship',
    'Training in reading, writing, interviewing and presenting',
    'A transparent, ICMJE-based path to authorship if earned',
    'A signed Certificate of Contribution on completion',
  ],
}

export const priceNotes = [
  { title: 'What the fee buys', text: 'A year of structured mentorship, training and a genuine role on a study — tuition, the way any serious research mentorship carries a fee.' },
  { title: 'What it does not buy', text: "A publication, a conference acceptance, or authorship. Those depend on your child's work meeting ICMJE criteria and passing peer review. Anyone guaranteeing a byline for a fee is selling something that would hurt your child." },
  { title: 'Possible separate costs', text: 'Conference registration and travel, if your child presents, are set by the organizer and disclosed in advance. They are never a condition of authorship.' },
  { title: 'Start with a trial', text: "One month, with a deposit that comes back if it isn't the right fit." },
]

/* ---------- Why Nexora Medical ---------- */

export const whyMedical = {
  usual: {
    tag: 'The usual approach',
    title: 'Buying pieces separately',
    items: [
      'A question bank, a course and an editor, each unaware of the others.',
      'Advice arrives when you ask for it, which is usually after the decision.',
      'Exam strategy disconnected from application strategy.',
      'Rotations and research treated as add-ons rather than scheduled inputs.',
      'No one accountable when a deadline slips.',
    ],
  },
  ours: {
    tag: 'Nexora Medical',
    title: 'One programme, one owner',
    items: [
      'A single roadmap covering exams, experience, application and interviews.',
      'Scheduled checkpoints, so problems surface while there is still time to fix them.',
      'Every track timed against the cycle calendar it has to land in.',
      'Plans adjusted on evidence — scores, feedback, interview invites — not on optimism.',
      'One named point of contact who owns the outcome end to end.',
    ],
  },
}

export const faqs = [
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
  {
    q: 'How much time does the Junior Scientist Program take each week?',
    a: 'About two hours: one live call of roughly ninety minutes plus a small piece of work between sessions. It works because of consistency, not long hours.',
  },
  {
    q: 'Will my child definitely get published?',
    a: "Publication is the goal, and it usually takes six to eight months of consistent work — but it is earned, not guaranteed. Results depend on your child's effort and on independent peer review.",
  },
  {
    q: 'Is everything online?',
    a: 'Coaching, research mentorship and Match support run online through live calls, and sessions are recorded. Clinical rotations are in-person at U.S. sites.',
  },
]

export const medTopics = [
  'USMLE coaching',
  'Clinical rotations',
  'Research & publications',
  'Residency Match support',
  'Junior Scientist Program',
  'Not sure yet — help me plan',
]
