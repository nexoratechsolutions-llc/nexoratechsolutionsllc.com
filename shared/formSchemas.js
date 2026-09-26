/**
 * Form contracts shared by the browser and the serverless API.
 *
 * The client uses these for instant feedback; the API re-validates with the
 * exact same rules, because client-side validation is a UX feature and never
 * a security control.
 */
import { z } from 'zod'

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

// Rejects the CR/LF that header-injection payloads rely on.
// eslint-disable-next-line no-control-regex -- matching control characters is the point
const noControlChars = (v) => !/[\u0000-\u001F\u007F]/.test(v)

const name = z
  .string()
  .trim()
  .min(2, 'Please enter at least 2 characters.')
  .max(80, 'Please keep this under 80 characters.')
  .refine(noControlChars, 'Invalid characters.')
  .refine((v) => /^[\p{L}\p{M}][\p{L}\p{M}'’.\- ]*$/u.test(v), 'Letters, spaces, hyphens and apostrophes only.')

const email = z
  .string()
  .trim()
  .min(5, 'Please enter your email address.')
  .max(254, 'That email address is too long.')
  .email('That does not look like a valid email address.')
  .refine(noControlChars, 'Invalid characters.')

const phone = z
  .string()
  .trim()
  .max(32, 'That phone number is too long.')
  .refine((v) => v === '' || /^[+()\d][\d\s()+.-]{5,31}$/.test(v), 'Please enter a valid phone number.')
  .optional()
  .or(z.literal(''))

const company = z
  .string()
  .trim()
  .max(120, 'Please keep this under 120 characters.')
  .refine(noControlChars, 'Invalid characters.')
  .optional()
  .or(z.literal(''))

const message = z
  .string()
  .trim()
  .min(20, 'Please give us at least 20 characters of context.')
  .max(4000, 'Please keep your message under 4000 characters.')
  // Blocks the crude "paste 12 links" spam pattern.
  .refine((v) => (v.match(/https?:\/\//gi) || []).length <= 3, 'Please include no more than 3 links.')

/** Anti-bot fields every form carries. */
const botFields = {
  /** Honeypot — must stay empty; real users never see it. */
  company_website: z.literal('').optional().default(''),
  /** HMAC-signed token issued by /api/form-token. */
  formToken: z.string().min(10, 'Session expired — please reload the page.').max(300),
  /**
   * Cloudflare Turnstile response. Present once the widget solves; the server
   * exchanges it with siteverify, so its shape here is only a sanity check.
   */
  turnstileToken: z
    .string()
    .min(10, 'Please complete the human verification below.')
    .max(2048, 'Verification token is malformed.'),
}

/* ------------------------------------------------------------------ */
/* Option sets (also drive the <select> menus)                          */
/* ------------------------------------------------------------------ */

export const INTEREST_OPTIONS = [
  'Software development',
  'AI & automation',
  'DevOps & cloud',
  'Quality assurance',
  'Business analysis & PM',
  'Training & staffing',
  'Nexora IMG Pathway',
  'Something else',
]

export const BUDGET_OPTIONS = [
  'Under $25k',
  '$25k – $75k',
  '$75k – $250k',
  '$250k+',
  'Not sure yet',
]

export const TIMELINE_OPTIONS = ['Immediately', 'Within 1–3 months', 'Within 3–6 months', 'Just exploring']

export const IMG_TRACK_OPTIONS = [
  'Full pathway (all six tracks)',
  'USMLE Step preparation',
  'Match mentorship',
  'ERAS application support',
  'Interview preparation',
  'U.S. clinical experience',
  'Research & publication',
  'Not sure — need an assessment',
]

export const IMG_STAGE_OPTIONS = [
  'Pre-Step 1',
  'Step 1 passed',
  'Step 2 CK passed',
  'Step 3 passed',
  'Applied before, unmatched',
  'Currently in a cycle',
]

export const VISA_OPTIONS = ['J-1 expected', 'H-1B needed', 'U.S. citizen / permanent resident', 'Not sure yet']

export const ROLE_OPTIONS = [
  'Senior Full-Stack Engineer',
  'AI/ML Engineer',
  'DevOps / Platform Engineer',
  'QA Automation Engineer',
  'Business Analyst',
  'SAFe Program Consultant',
  'IMG Pathway Mentor (MD/DO)',
  'Open application',
]

/* ------------------------------------------------------------------ */
/* Schemas                                                             */
/* ------------------------------------------------------------------ */

export const contactSchema = z.object({
  formType: z.literal('contact'),
  name,
  email,
  phone,
  company,
  interest: z.enum(INTEREST_OPTIONS, { errorMap: () => ({ message: 'Please choose an area of interest.' }) }),
  budget: z.enum(BUDGET_OPTIONS).optional().or(z.literal('')),
  timeline: z.enum(TIMELINE_OPTIONS).optional().or(z.literal('')),
  message,
  consent: z.literal(true, { errorMap: () => ({ message: 'Please confirm before submitting.' }) }),
  ...botFields,
})

export const imgSchema = z.object({
  formType: z.literal('img'),
  name,
  email,
  phone,
  country: z
    .string()
    .trim()
    .min(2, 'Please enter your country of medical school.')
    .max(60, 'Please keep this under 60 characters.')
    .refine(noControlChars, 'Invalid characters.'),
  gradYear: z
    .string()
    .trim()
    .regex(/^(19|20)\d{2}$/, 'Enter a four-digit year, e.g. 2023.')
    .refine((v) => Number(v) <= new Date().getFullYear() + 8, 'That graduation year looks too far ahead.'),
  stage: z.enum(IMG_STAGE_OPTIONS, { errorMap: () => ({ message: 'Please select your current stage.' }) }),
  track: z.enum(IMG_TRACK_OPTIONS, { errorMap: () => ({ message: 'Please select a track.' }) }),
  visa: z.enum(VISA_OPTIONS).optional().or(z.literal('')),
  message,
  consent: z.literal(true, { errorMap: () => ({ message: 'Please confirm before submitting.' }) }),
  ...botFields,
})

export const careersSchema = z.object({
  formType: z.literal('careers'),
  name,
  email,
  phone,
  role: z.enum(ROLE_OPTIONS, { errorMap: () => ({ message: 'Please choose a role.' }) }),
  portfolio: z
    .string()
    .trim()
    .max(200, 'That link is too long.')
    .refine(
      (v) => v === '' || /^https:\/\/[\w.-]+\.[a-z]{2,}(\/[\w\-./?%&=+#@:]*)?$/i.test(v),
      'Please use a full https:// link.'
    )
    .optional()
    .or(z.literal('')),
  message,
  consent: z.literal(true, { errorMap: () => ({ message: 'Please confirm before submitting.' }) }),
  ...botFields,
})

/** Discriminated union the API route dispatches on. */
export const submissionSchema = z.discriminatedUnion('formType', [contactSchema, imgSchema, careersSchema])

export const SCHEMA_BY_TYPE = {
  contact: contactSchema,
  img: imgSchema,
  careers: careersSchema,
}

/** Human labels for the notification email, per form type. */
export const FIELD_LABELS = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  company: 'Company',
  interest: 'Area of interest',
  budget: 'Budget',
  timeline: 'Timeline',
  country: 'Country of medical school',
  gradYear: 'Graduation year',
  stage: 'Current stage',
  track: 'Track requested',
  visa: 'Visa situation',
  role: 'Role',
  portfolio: 'Portfolio / LinkedIn',
  message: 'Message',
}

/** Max accepted JSON body, in bytes. Generous for the 4000-char message. */
export const MAX_BODY_BYTES = 16 * 1024
