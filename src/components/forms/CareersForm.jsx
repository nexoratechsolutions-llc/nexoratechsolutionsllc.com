import { Link } from 'react-router-dom'
import { careersSchema, ROLE_OPTIONS } from '../../../shared/formSchemas'
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
  role: '',
  portfolio: '',
  message: '',
  consent: false,
  company_website: '',
  turnstileToken: '',
}

export default function CareersForm({ preselectedRole }) {
  const form = useSecureForm({
    schema: careersSchema,
    formType: 'careers',
    initialValues: preselectedRole ? { ...INITIAL, role: preselectedRole } : INITIAL,
  })

  if (form.isSuccess) {
    return (
      <div className="form-card">
        <SuccessPanel reference={form.reference} title="Application received." onReset={form.reset}>
          Thank you for applying. We review every application ourselves and reply either way, usually within
          five business days.
        </SuccessPanel>
      </div>
    )
  }

  return (
    <form className="form-card" onSubmit={form.handleSubmit} noValidate id="apply">
      {form.serverError && (
        <FormAlert kind="err" title="We could not send that">
          {form.serverError}
        </FormAlert>
      )}

      <div className="form-grid">
        <TextField form={form} name="name" label="Full name" required autoComplete="name" placeholder="Sam Torres" />
        <TextField
          form={form}
          name="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
        />
        <TextField form={form} name="phone" label="Phone" type="tel" optional autoComplete="tel" inputMode="tel" />
        <SelectField form={form} name="role" label="Role" options={ROLE_OPTIONS} required />

        <TextField
          form={form}
          name="portfolio"
          label="Portfolio, GitHub or LinkedIn"
          optional
          full
          type="url"
          placeholder="https://github.com/yourname"
          hint="Full https:// link. Skip it if you would rather we read the note below first."
        />

        <TextAreaField
          form={form}
          name="message"
          label="Why this role, and what have you shipped?"
          required
          placeholder="One project you owned end to end, what it had to do, and what you would change about how you built it."
          hint="We read these properly. Minimum 20 characters."
        />

        <Turnstile
          ref={form.turnstileRef}
          onVerify={form.setTurnstileToken}
          error={form.touched.turnstileToken ? form.errors.turnstileToken : ''}
          action="careers-form"
        />

        <ConsentField form={form}>
          I agree that Nexora may store these details to process my application, as described in the{' '}
          <Link to="/privacy">Privacy Policy</Link>.
        </ConsentField>
      </div>

      <Honeypot form={form} />
      <SubmitRow form={form} label="Submit application" busyLabel="Submitting…" />
    </form>
  )
}
