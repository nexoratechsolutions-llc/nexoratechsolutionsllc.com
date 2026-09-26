import { useId } from 'react'
import { Icon } from './Icons'

/**
 * Shared field shell: label, control, error and hint, wired for screen readers.
 * `form` is the object returned by useSecureForm.
 */
function Shell({ id, label, required, optional, hint, error, showError, children, full, count }) {
  return (
    <div className={`field${full ? ' full' : ''}`} data-invalid={showError ? 'true' : 'false'}>
      <div className="label-row">
        <label htmlFor={id}>
          {label}
          {required && (
            <span className="req" aria-hidden>
              *
            </span>
          )}
          {optional && <span className="opt">optional</span>}
        </label>
        {count != null && <span className="char-count">{count}</span>}
      </div>
      {children}
      {showError ? (
        <p className="field-error" id={`${id}-error`} role="alert">
          {Icon.alert(13)} {error}
        </p>
      ) : hint ? (
        <p className="field-hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}

function useFieldState(form, name) {
  const error = form.errors[name]
  const showError = Boolean(error && form.touched[name])
  return { error, showError }
}

export function TextField({
  form,
  name,
  label,
  type = 'text',
  placeholder,
  hint,
  required,
  optional,
  full,
  autoComplete,
  inputMode,
  maxLength,
}) {
  const id = useId()
  const { error, showError } = useFieldState(form, name)

  return (
    <Shell
      id={id}
      label={label}
      required={required}
      optional={optional}
      hint={hint}
      error={error}
      showError={showError}
      full={full}
    >
      <input
        id={id}
        name={name}
        type={type}
        value={form.values[name] ?? ''}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        required={required}
        aria-required={required || undefined}
        aria-invalid={showError || undefined}
        aria-describedby={showError ? `${id}-error` : hint ? `${id}-hint` : undefined}
      />
    </Shell>
  )
}

export function SelectField({ form, name, label, options, placeholder = 'Please choose…', required, optional, hint, full }) {
  const id = useId()
  const { error, showError } = useFieldState(form, name)

  return (
    <Shell
      id={id}
      label={label}
      required={required}
      optional={optional}
      hint={hint}
      error={error}
      showError={showError}
      full={full}
    >
      <select
        id={id}
        name={name}
        value={form.values[name] ?? ''}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        required={required}
        aria-required={required || undefined}
        aria-invalid={showError || undefined}
        aria-describedby={showError ? `${id}-error` : hint ? `${id}-hint` : undefined}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </Shell>
  )
}

export function TextAreaField({ form, name, label, placeholder, hint, required, max = 4000, rows = 6 }) {
  const id = useId()
  const { error, showError } = useFieldState(form, name)
  const value = form.values[name] ?? ''

  return (
    <Shell
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      showError={showError}
      full
      count={`${value.length}/${max}`}
    >
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        placeholder={placeholder}
        maxLength={max}
        required={required}
        aria-required={required || undefined}
        aria-invalid={showError || undefined}
        aria-describedby={showError ? `${id}-error` : hint ? `${id}-hint` : undefined}
      />
    </Shell>
  )
}

export function ConsentField({ form, name = 'consent', children }) {
  const id = useId()
  const { error, showError } = useFieldState(form, name)

  return (
    <div className="field full" data-invalid={showError ? 'true' : 'false'}>
      <label className="checkline" htmlFor={id}>
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={Boolean(form.values[name])}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          aria-invalid={showError || undefined}
          aria-describedby={showError ? `${id}-error` : undefined}
        />
        <span>{children}</span>
      </label>
      {showError && (
        <p className="field-error" id={`${id}-error`} role="alert">
          {Icon.alert(13)} {error}
        </p>
      )}
    </div>
  )
}

/**
 * Hidden decoy input. Automated form-fillers populate every field they find;
 * a value here means the submission is discarded server-side.
 */
export function Honeypot({ form }) {
  return (
    <div className="honeypot" aria-hidden>
      <label htmlFor="company_website">Company website (leave blank)</label>
      <input
        id="company_website"
        name="company_website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={form.values.company_website ?? ''}
        onChange={form.handleChange}
      />
    </div>
  )
}

export function FormAlert({ kind, title, children }) {
  return (
    <div className={`alert alert-${kind}`} role={kind === 'err' ? 'alert' : 'status'}>
      {kind === 'err' ? Icon.alert(17) : Icon.check(17)}
      <div>
        {title && <h4>{title}</h4>}
        <p>{children}</p>
      </div>
    </div>
  )
}

export function SubmitRow({ form, label = 'Send message', busyLabel = 'Sending…' }) {
  return (
    <div className="form-foot">
      <button type="submit" className="btn btn-primary btn-lg" disabled={form.isSubmitting}>
        {form.isSubmitting ? (
          <>
            <span className="spinner" aria-hidden /> {busyLabel}
          </>
        ) : (
          <>
            {label}
            <span className="arrow" aria-hidden>
              {Icon.arrow(14)}
            </span>
          </>
        )}
      </button>
      <p className="form-note">
        {Icon.lock(13)} Encrypted in transit · never sold or shared
      </p>
    </div>
  )
}

export function SuccessPanel({ reference, title, children, onReset }) {
  return (
    <div className="form-success" role="status">
      <div className="tick">{Icon.check(26)}</div>
      <h3>{title}</h3>
      <p>{children}</p>
      {reference && (
        <p className="field-hint" style={{ fontFamily: 'var(--font-mono)' }}>
          Reference {reference}
        </p>
      )}
      <button type="button" className="btn btn-ghost" onClick={onReset} style={{ marginTop: 8 }}>
        Send another
      </button>
    </div>
  )
}
