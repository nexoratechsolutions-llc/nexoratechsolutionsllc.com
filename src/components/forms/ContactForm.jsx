import { Link } from 'react-router-dom'
import { contactSchema, INTEREST_OPTIONS, BUDGET_OPTIONS, TIMELINE_OPTIONS } from '../../../shared/formSchemas'
import { useSecureForm } from '../../hooks/useSecureForm'
import Turnstile from '../Turnstile'
import {
  TextField,
  SelectField,
  TextAreaField,
  ConsentField,
  Honeypot,
  FormAlert,
  SubmitRow,
  SuccessPanel,
} from '../Field'

const INITIAL = {
  name: '',
  email: '',
  phone: '',
  company: '',
  interest: '',
  budget: '',
  timeline: '',
  message: '',
  consent: false,
  company_website: '',
  turnstileToken: '',
}

export default function ContactForm({ defaultInterest }) {
  const form = useSecureForm({
    schema: contactSchema,
    formType: 'contact',
    initialValues: defaultInterest ? { ...INITIAL, interest: defaultInterest } : INITIAL,
  })

  if (form.isSuccess) {
    return (
      <div className="form-card">
        <SuccessPanel reference={form.reference} title="Message received." onReset={form.reset}>
          Thank you — we read every enquiry ourselves and reply within one business day. If it is urgent, call
          us directly on +1 (678) 925-8885.
        </SuccessPanel>
      </div>
    )
  }

  return (
    <form className="form-card" onSubmit={form.handleSubmit} noValidate>
      {form.serverError && (
        <FormAlert kind="err" title="We could not send that">
          {form.serverError}
        </FormAlert>
      )}

      <div className="form-grid">
        <TextField form={form} name="name" label="Full name" required autoComplete="name" placeholder="Jane Okafor" />
        <TextField
          form={form}
          name="email"
          label="Work email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="jane@company.com"
        />
        <TextField
          form={form}
          name="phone"
          label="Phone"
          type="tel"
          optional
          autoComplete="tel"
          inputMode="tel"
          placeholder="+1 555 000 0000"
        />
        <TextField form={form} name="company" label="Company" optional autoComplete="organization" placeholder="Acme Health" />

        <SelectField form={form} name="interest" label="What brings you here?" options={INTEREST_OPTIONS} required full />

        <SelectField form={form} name="budget" label="Indicative budget" options={BUDGET_OPTIONS} optional />
        <SelectField form={form} name="timeline" label="Timeline" options={TIMELINE_OPTIONS} optional />

        <TextAreaField
          form={form}
          name="message"
          label="What are you trying to build, change or fix?"
          required
          placeholder="A few sentences on the problem, who it affects, and what you have tried so far. The more specific, the more useful our first reply will be."
          hint="Minimum 20 characters."
        />

        <Turnstile
          ref={form.turnstileRef}
          onVerify={form.setTurnstileToken}
          error={form.touched.turnstileToken ? form.errors.turnstileToken : ''}
          action="contact-form"
        />

        <ConsentField form={form}>
          I agree that Nexora may store and use these details to respond to my enquiry, as described in the{' '}
          <Link to="/privacy">Privacy Policy</Link>.
        </ConsentField>
      </div>

      <Honeypot form={form} />
      <SubmitRow form={form} label="Send message" />
    </form>
  )
}
