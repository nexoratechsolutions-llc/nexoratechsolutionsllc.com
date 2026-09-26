import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchFormToken, submitForm } from '../lib/api'

/**
 * Form state machine shared by every form on the site.
 *
 * Responsibilities: hold values, validate with the shared zod schema on blur
 * and on submit, attach the signed anti-CSRF token, and surface server-side
 * field errors alongside client-side ones.
 *
 * @param {object}   options
 * @param {import('zod').ZodSchema} options.schema  Shared schema for this form.
 * @param {object}   options.initialValues
 * @param {string}   options.formType               'contact' | 'img' | 'careers'
 */
export function useSecureForm({ schema, initialValues, formType }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [serverError, setServerError] = useState('')
  const [reference, setReference] = useState('')

  const tokenRef = useRef('')
  const mounted = useRef(true)
  /** Handle on the Turnstile widget, so we can reset its single-use token. */
  const turnstileRef = useRef(null)
  /** Why the last token fetch failed, if it did: 'unreachable' | 'rejected'. */
  const tokenFailureRef = useRef(null)

  // Grab a token as soon as the form mounts; its timestamp doubles as the
  // "when did this person start filling the form" clock.
  useEffect(() => {
    mounted.current = true
    fetchFormToken().then(({ token, reason }) => {
      if (!mounted.current) return
      if (token) tokenRef.current = token
      tokenFailureRef.current = reason || null
    })
    return () => {
      mounted.current = false
    }
  }, [])

  const validateField = useCallback(
    (name, allValues) => {
      // Stub the machine-checked fields so validating a text input never
      // reports "you haven't solved the captcha yet".
      const candidate = {
        ...allValues,
        formType,
        formToken: 'x'.repeat(24),
        turnstileToken: 'x'.repeat(24),
        company_website: '',
      }
      const result = schema.safeParse(candidate)
      if (result.success) return ''
      const issue = result.error.issues.find((i) => i.path[0] === name)
      return issue ? issue.message : ''
    },
    [schema, formType]
  )

  const setValue = useCallback(
    (name, value) => {
      setValues((prev) => {
        const next = { ...prev, [name]: value }
        // Only re-validate a field the visitor has already left once, so we
        // never scold someone mid-word.
        setErrors((prevErrors) => {
          if (!prevErrors[name] && !touched[name]) return prevErrors
          return { ...prevErrors, [name]: validateField(name, next) }
        })
        return next
      })
      setServerError('')
    },
    [touched, validateField]
  )

  const handleChange = useCallback(
    (e) => {
      const { name, type, value, checked } = e.target
      setValue(name, type === 'checkbox' ? checked : value)
    },
    [setValue]
  )

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target
      setTouched((prev) => ({ ...prev, [name]: true }))
      setErrors((prev) => ({ ...prev, [name]: validateField(name, values) }))
    },
    [validateField, values]
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setStatus('idle')
    setServerError('')
    setReference('')
    turnstileRef.current?.reset()
    fetchFormToken().then(({ token, reason }) => {
      if (!mounted.current) return
      if (token) tokenRef.current = token
      tokenFailureRef.current = reason || null
    })
  }, [initialValues])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      if (status === 'submitting') return

      setServerError('')

      // Make sure we have a token; a visitor on a flaky connection may not.
      if (!tokenRef.current) {
        const { token, reason } = await fetchFormToken()
        if (token) tokenRef.current = token
        tokenFailureRef.current = reason || null
      }

      const payload = {
        ...values,
        formType,
        formToken: tokenRef.current || '',
        turnstileToken: values.turnstileToken || '',
        company_website: values.company_website || '',
      }

      const result = schema.safeParse(payload)
      if (!result.success) {
        const fieldErrors = {}
        for (const issue of result.error.issues) {
          const key = issue.path[0]
          if (key && !fieldErrors[key]) fieldErrors[key] = issue.message
        }
        // A missing token is our problem, not the visitor's — don't show it as
        // a field error, and say something they can actually act on.
        if (fieldErrors.formToken) {
          delete fieldErrors.formToken
          setServerError(
            tokenFailureRef.current === 'unreachable'
              ? 'We could not reach our server, so this form could not be secured. Check your connection and try again — or email minchu@nexoratechsolutionsllc.com directly.'
              : 'Could not verify the form. Please reload the page and try again.'
          )
        }
        setErrors(fieldErrors)
        setTouched(Object.keys(fieldErrors).reduce((acc, k) => ({ ...acc, [k]: true }), {}))
        setStatus('error')

        const firstKey = Object.keys(fieldErrors)[0]
        if (firstKey === 'turnstileToken') {
          // The widget is an iframe with no focusable input of ours, so just
          // bring it into view.
          document.querySelector('.turnstile-field')?.scrollIntoView({
            block: 'center',
            behavior: 'smooth',
          })
        } else if (firstKey) {
          const el = document.querySelector(`[name="${firstKey}"]`)
          el?.focus({ preventScroll: false })
          el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
        }
        return
      }

      setStatus('submitting')
      const response = await submitForm(result.data)
      if (!mounted.current) return

      if (response.ok) {
        setStatus('success')
        setReference(response.reference || '')
        return
      }

      if (response.fieldErrors) {
        setErrors(response.fieldErrors)
        setTouched(Object.keys(response.fieldErrors).reduce((acc, k) => ({ ...acc, [k]: true }), {}))
      }
      setServerError(response.error || 'Something went wrong. Please try again.')
      setStatus('error')

      // Cloudflare redeems a Turnstile token exactly once, so whatever the
      // server rejected, the token we just sent is now spent. Reset the widget
      // and clear it, or the retry fails with "duplicate token".
      turnstileRef.current?.reset()
      setValues((prev) => ({ ...prev, turnstileToken: '' }))

      // A rejected token is single-use from the server's view — get a new one.
      const { token: fresh, reason } = await fetchFormToken()
      if (!mounted.current) return
      if (fresh) tokenRef.current = fresh
      tokenFailureRef.current = reason || null
    },
    [values, schema, formType, status]
  )

  /** Passed to <Turnstile onVerify={...}> to keep the token in form state. */
  const setTurnstileToken = useCallback((token) => {
    setValues((prev) => ({ ...prev, turnstileToken: token || '' }))
    if (token) setErrors((prev) => ({ ...prev, turnstileToken: '' }))
  }, [])

  return {
    values,
    errors,
    touched,
    status,
    serverError,
    reference,
    setValue,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    turnstileRef,
    setTurnstileToken,
    isSubmitting: status === 'submitting',
    isSuccess: status === 'success',
  }
}
