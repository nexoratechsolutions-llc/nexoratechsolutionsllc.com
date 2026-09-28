import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

/** Public site key — safe in the browser. Empty means the check is switched off. */
export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || ''
export const TURNSTILE_ACTION = 'contact' // must match api/contact.js

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
let scriptPromise = null

/** Loads Cloudflare's script once, on the first page that shows a form. */
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = SCRIPT_SRC
      s.async = true
      s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile missing')))
      s.onerror = () => {
        scriptPromise = null
        s.remove()
        reject(new Error('turnstile failed to load'))
      }
      document.head.appendChild(s)
    })
  }
  return scriptPromise
}

/**
 * Cloudflare Turnstile widget. Reports a token through onToken (null when it
 * expires or errors). Tokens are single-use, so the parent calls reset()
 * after every submission.
 */
const Turnstile = forwardRef(function Turnstile({ onToken, onError, action = TURNSTILE_ACTION }, ref) {
  const box = useRef(null)
  const widgetId = useRef(null)
  const handlers = useRef({ onToken, onError })
  handlers.current = { onToken, onError }

  useImperativeHandle(ref, () => ({
    reset() {
      handlers.current.onToken?.(null)
      if (widgetId.current != null) window.turnstile?.reset(widgetId.current)
    },
  }))

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return
    let cancelled = false
    loadTurnstile()
      .then((ts) => {
        if (cancelled || !box.current) return
        widgetId.current = ts.render(box.current, {
          sitekey: TURNSTILE_SITE_KEY,
          action: action || TURNSTILE_ACTION,
          theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
          size: 'flexible',
          'refresh-expired': 'auto',
          callback: (token) => handlers.current.onToken?.(token),
          'expired-callback': () => handlers.current.onToken?.(null),
          'error-callback': (code) => {
            handlers.current.onToken?.(null)
            handlers.current.onError?.(String(code || 'error'))
          },
        })
      })
      .catch(() => !cancelled && handlers.current.onError?.('load'))

    return () => {
      cancelled = true
      if (widgetId.current != null) {
        try {
          window.turnstile?.remove(widgetId.current)
        } catch {
          /* already gone */
        }
        widgetId.current = null
      }
    }
  }, [])

  if (!TURNSTILE_SITE_KEY) return null
  return <div className="turnstile" ref={box} />
})

export default Turnstile
