/**
 * Cloudflare Turnstile script loader.
 *
 * The API script is fetched once per page load, on demand, so routes without a
 * form never pay for it. Explicit rendering (`render=explicit`) keeps control
 * in React rather than letting the script scan the DOM for widgets itself.
 */

const SCRIPT_ID = 'cf-turnstile-script'
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

/**
 * The site key is public by design — it is visible in the rendered widget on
 * every page. Only the secret key is sensitive, and that lives server-side.
 */
export const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_TURNSTILE_SITE_KEY || '0x4AAAAAAFDaVaUwNuzcjB9t'

let loadPromise = null

/** Resolves with `window.turnstile` once the API is ready. */
export function loadTurnstile() {
  if (typeof window === 'undefined') return Promise.reject(new Error('no-window'))
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID)

    const settle = () => {
      if (window.turnstile) resolve(window.turnstile)
      else reject(new Error('turnstile-unavailable'))
    }

    const fail = () => {
      // Allow a later retry (e.g. the visitor reconnects and resubmits).
      loadPromise = null
      reject(new Error('turnstile-script-failed'))
    }

    if (existing) {
      existing.addEventListener('load', settle, { once: true })
      existing.addEventListener('error', fail, { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.addEventListener('load', settle, { once: true })
    script.addEventListener('error', fail, { once: true })
    document.head.appendChild(script)
  })

  return loadPromise
}
