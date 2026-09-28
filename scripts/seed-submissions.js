import { saveSubmission } from '../api/_lib/supabase.js'

async function seed() {
  console.log('Seeding sample submissions...')

  const samples = [
    {
      name: 'Dr. Priya Sharma',
      email: 'priya.sharma@aims.edu',
      phone: '+1 (415) 890-1234',
      topic: 'USMLE Step 1 Coaching',
      form: 'Medical enquiry',
      page: '/medical/contact',
      message: 'Hello Nexora team, I am an IMG preparing for USMLE Step 1 with a target exam date in 5 months. I would like to schedule a diagnostic session and enroll in 1-on-1 mentorship.',
      submissionId: 'sample-med-001',
      ip: '198.51.100.12',
      emailSent: true,
    },
    {
      name: 'Marcus Vance',
      email: 'm.vance@apexlogistics.com',
      phone: '+1 (312) 555-0198',
      topic: 'Custom Software Development',
      form: 'Technical enquiry',
      page: '/technical/contact',
      message: 'We are seeking an engineering partner to architect an automated dispatch routing system with AI predictive arrival times. We have detailed RFPs ready for review.',
      submissionId: 'sample-tech-002',
      ip: '203.0.113.45',
      emailSent: true,
    },
    {
      name: 'Elena Rostova',
      email: 'elena.rostova@biomed-research.org',
      phone: '+1 (617) 555-8822',
      topic: 'Junior Scientist Program',
      form: 'Medical enquiry',
      page: '/medical/junior-scientist',
      message: 'I am interested in enrolling in the Junior Scientist Program to gain first-author peer-reviewed publication credentials for the upcoming NRMP Match cycle.',
      submissionId: 'sample-med-003',
      ip: '198.51.100.89',
      emailSent: true,
    },
    {
      name: 'David Chen',
      email: 'david@synthetica-health.io',
      phone: '+1 (206) 555-3341',
      topic: 'AI & Machine Learning Solutions',
      form: 'Technical enquiry',
      page: '/technical/ai-solutions',
      message: 'We would like to explore your HIPAA-compliant LLM fine-tuning and agentic workflow consulting for clinical decision support note parsing.',
      submissionId: 'sample-tech-004',
      ip: '192.0.2.14',
      emailSent: true,
    },
  ]

  for (const s of samples) {
    const res = await saveSubmission(s)
    console.log(`Saved: ${s.name} (${s.form}) ->`, res)
  }

  console.log('Seeding finished!')
}

seed()
