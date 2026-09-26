import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { loadTurnstile, TURNSTILE_SITE_KEY } from '../lib/turnstile'
import { useTheme } from '../hooks/useTheme'
import { Icon } from './Icons'

/**
 * Cloudflare Turnstile widget.
 *
 * Calls `onVerify(token)` when solved and `onVerify('')` whenever the token
 * stops being valid (expired, errored, or reset), so the parent form's state
 * can never hold a stale token.
 *
 * The parent gets a `reset()` handle via ref — Turnstile tokens are single-use,
 * so the widget must be reset after any rejected submission.
 */
const Turnstile = forwardRef(function Turnstile({ onVerify, error, action }, ref) {
  const hostRef = useRef(null)
  const widgetIdRef = useRef(null)
  const turnstileRef = useRef(null)
  const onVerifyRef = useRef(onVerify)
  const [status, setStatus] = useState('loading') // loading | ready | failed
  // Set when Turnstile itself reports a problem (blocked network, hostname not
  // on the widget's allowlist, challenge timed out).
  const [widgetError, setWidgetError] = useState(false)
  const { theme } = useTheme()

  // Keep the latest callback without making it a render dependency, so the
  // widget is not torn down and rebuilt every time the parent re-renders.
  useEffect(() => {
    onVerifyRef.current = onVerify
  }, [onVerify])

  useImperativeHandle(ref, () => ({
    reset() {
      const turnstile = turnstileRef.current
      const id = widgetIdRef.current
      if (turnstile && id !== null) {
        try {
          turnstile.reset(id)
        } catch {
          /* widget already gone — nothing to reset */
        }
      }
      onVerifyRef.current?.('')
    },
  }))

  useEffect(() => {
    let cancelled = false

    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !hostRef.current) return
        turnstileRef.current = turnstile

        widgetIdRef.current = turnstile.render(hostRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme,
          action,
          retry: 'auto',
          'refresh-expired': 'auto',
          callback: (token) => {
            setWidgetError(false)
            onVerifyRef.current?.(token)
          },
          'expired-callback': () => onVerifyRef.current?.(''),
          'timeout-callback': () => onVerifyRef.current?.(''),
          'error-callback': () => {
            setWidgetError(true)
            onVerifyRef.current?.('')
            // Returning true lets Turnstile handle its own retry.
            return true
          },
        })

        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('failed')
      })

    return () => {
      cancelled = true
      const turnstile = turnstileRef.current
      const id = widgetIdRef.current
      if (turnstile && id !== null) {
        try {
          turnstile.remove(id)
        } catch {
          /* already removed */
        }
      }
      widgetIdRef.current = null
    }
    // Re-rendering on theme change is intentional: Turnstile bakes the theme in
    // at render time, so the widget must be rebuilt to follow the site toggle.
  }, [theme, action])

  return (
    <div className="field full turnstile-field" data-invalid={error ? 'true' : 'false'}>
      <div className="label-row">
        <span className="turnstile-label">
          Human verification <span className="req" aria-hidden>*</span>
        </span>
      </div>

      <div className="turnstile-host" ref={hostRef} />

      {status === 'loading' && (
        <p className="field-hint turnstile-status">
          <span className="spinner" aria-hidden /> Loading verification…
        </p>
      )}

      {status === 'failed' && (
        <p className="field-error" role="alert">
          {Icon.alert(13)} Verification could not load. Check your connection or any content
          blocker, then reload the page.
        </p>
      )}

      {status === 'ready' && widgetError && (
        <p className="field-error" role="alert">
          {Icon.alert(13)} Verification could not complete. If it does not retry on its own, reload
          the page — or email{' '}
          <a href="mailto:minchu@nexoratechsolutionsllc.com">minchu@nexoratechsolutionsllc.com</a> and we
          will pick it up from there.
        </p>
      )}

      {status !== 'failed' && !widgetError && error && (
        <p className="field-error" role="alert">
          {Icon.alert(13)} {error}
        </p>
      )}
    </div>
  )
})

export default Turnstile
