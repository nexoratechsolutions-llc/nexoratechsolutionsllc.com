/**
 * Cloudflare Turnstile server-side verification.
 *
 * The widget token proves nothing until it is redeemed here — a bot can post
 * any string it likes in the `turnstileToken` field. Cloudflare redeems each
 * token exactly once, so a replayed token is rejected as `timeout-or-duplicate`.
 */
import crypto from 'node:crypto'

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const TIMEOUT_MS = 8000

/** Cloudflare's error codes, mapped to something a visitor can act on. */
const MESSAGES = {
  'missing-input-response': 'Please complete the human verification below.',
  'invalid-input-response': 'Verification failed. Please try the check again.',
  'timeout-or-duplicate': 'That verification has already been used. Please complete the check again.',
  'invalid-input-secret': 'Verification is misconfigured on our side. Please email us directly.',
  'missing-input-secret': 'Verification is misconfigured on our side. Please email us directly.',
  'bad-request': 'Verification failed. Please reload the page and try again.',
  'internal-error': 'Verification is temporarily unavailable. Please try again in a moment.',
}

function messageFor(codes) {
  for (const code of codes) {
    if (MESSAGES[code]) return MESSAGES[code]
  }
  return 'Verification failed. Please complete the check again.'
}

/**
 * @param {string} token   The `cf-turnstile-response` value from the browser.
 * @param {string} ip      Client IP, passed to Cloudflare for extra signal.
 * @returns {Promise<{ok:boolean, status?:number, error?:string, codes?:string[]}>}
 */
export async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY

  if (!secret) {
    // Fail closed. Silently accepting here would disable the protection the
    // site claims to have, which is worse than a visible outage.
    console.error('[nexora] TURNSTILE_SECRET_KEY is not set — rejecting submission.')
    return {
      ok: false,
      status: 503,
      error: 'Verification is not configured on our side. Please email minchu@nexoratechsolutionsllc.com directly.',
    }
  }

  if (typeof token !== 'string' || token.length < 10 || token.length > 2048) {
    return { ok: false, status: 400, error: MESSAGES['missing-input-response'] }
  }

  const body = new URLSearchParams()
  body.append('secret', secret)
  body.append('response', token)
  if (ip && ip !== 'unknown') body.append('remoteip', ip)
  // Lets a retried request redeem the same token instead of failing as a duplicate.
  body.append('idempotency_key', crypto.randomUUID())

  let response
  try {
    response = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (err) {
    console.error('[nexora] Turnstile siteverify unreachable', err?.name || err)
    return {
      ok: false,
      status: 503,
      error: 'Could not reach the verification service. Please try again in a moment.',
    }
  }

  if (!response.ok) {
    console.error('[nexora] Turnstile siteverify HTTP', response.status)
    return { ok: false, status: 502, error: MESSAGES['internal-error'] }
  }

  const result = await response.json().catch(() => null)
  if (!result) {
    return { ok: false, status: 502, error: MESSAGES['internal-error'] }
  }

  if (result.success !== true) {
    const codes = Array.isArray(result['error-codes']) ? result['error-codes'] : []
    console.warn('[nexora] Turnstile rejected a submission', { codes, ip })
    // A misconfigured secret is our fault, not the visitor's — surface it as 5xx.
    const ours = codes.includes('invalid-input-secret') || codes.includes('missing-input-secret')
    return { ok: false, status: ours ? 503 : 400, error: messageFor(codes), codes }
  }

  return { ok: true, hostname: result.hostname, action: result.action }
}
