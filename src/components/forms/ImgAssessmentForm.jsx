import { Link } from 'react-router-dom'
import {
  imgSchema,
  IMG_TRACK_OPTIONS,
  IMG_STAGE_OPTIONS,
  VISA_OPTIONS,
} from '../../../shared/formSchemas'
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
  country: '',
  gradYear: '',
  stage: '',
  track: '',
  visa: '',
  message: '',
  consent: false,
  company_website: '',
  turnstileToken: '',
}

export default function ImgAssessmentForm() {
  const form = useSecureForm({ schema: imgSchema, formType: 'img', initialValues: INITIAL })

  if (form.isSuccess) {
    return (
      <div className="form-card">
        <SuccessPanel reference={form.reference} title="Assessment request received." onReset={form.reset}>
          We will be in touch within one business day to schedule your call. Bring your score report and
          timeline — the first conversation is more useful when we can look at real numbers.
        </SuccessPanel>
      </div>
    )
  }

  return (
    <form className="form-card" onSubmit={form.handleSubmit} noValidate id="assessment">
      {form.serverError && (
        <FormAlert kind="err" title="We could not send that">
          {form.serverError}
        </FormAlert>
      )}

      <div className="form-grid">
        <TextField form={form} name="name" label="Full name" required autoComplete="name" placeholder="Dr. Amara Nwosu" />
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
        <TextField
          form={form}
          name="phone"
          label="Phone / WhatsApp"
          type="tel"
          optional
          autoComplete="tel"
          inputMode="tel"
          placeholder="+1 555 000 0000"
        />
        <TextField
          form={form}
          name="country"
          label="Country of medical school"
          required
          autoComplete="country-name"
          placeholder="India"
        />
        <TextField
          form={form}
          name="gradYear"
          label="Year of graduation"
          required
          inputMode="numeric"
          maxLength={4}
          placeholder="2023"
          hint="Four digits. Expected year is fine if you have not graduated yet."
        />
        <SelectField form={form} name="visa" label="Visa situation" options={VISA_OPTIONS} optional />

        <SelectField form={form} name="stage" label="Where are you now?" options={IMG_STAGE_OPTIONS} required />
        <SelectField form={form} name="track" label="Which track do you need?" options={IMG_TRACK_OPTIONS} required />

        <TextAreaField
          form={form}
          name="message"
          label="Tell us about your profile and target"
          required
          placeholder="Scores and attempt history, target specialty, any U.S. clinical experience or research so far, and what you want the next twelve months to achieve."
          hint="Honest detail here makes the assessment call far more useful. Minimum 20 characters."
        />

        <Turnstile
          ref={form.turnstileRef}
          onVerify={form.setTurnstileToken}
          error={form.touched.turnstileToken ? form.errors.turnstileToken : ''}
          action="img-form"
        />

        <ConsentField form={form}>
          I agree that Nexora may store and use these details to assess my profile and respond, as described in
          the <Link to="/privacy">Privacy Policy</Link>.
        </ConsentField>
      </div>

      <Honeypot form={form} />
      <SubmitRow form={form} label="Request assessment call" busyLabel="Submitting…" />
    </form>
  )
}
