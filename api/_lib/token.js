/**
 * Short-lived, HMAC-signed form tokens.
 *
 * Purpose: prove that a submission came from a page this server rendered a
 * moment ago, and that a human plausibly spent time filling it in. Combined
 * with the Origin check in security.js this covers CSRF and the cheapest
 * category of scripted spam.
 */
import crypto from 'node:crypto'

const TOKEN_TTL_MS = 2 * 60 * 60 * 1000 // 2 hours — long enough for a slow form fill
const MIN_FILL_MS = 2500 // Anything faster than this is not a person typing

function secret() {
  const fromEnv = process.env.FORM_TOKEN_SECRET
  if (fromEnv && fromEnv.length >= 16) return fromEnv

  // Dev fallback: a per-instance random secret. Tokens stay valid for the life
  // of the instance, which is fine locally and fails closed in production
  // (where you must set FORM_TOKEN_SECRET).
  if (!globalThis.__nexoraDevSecret) {
    globalThis.__nexoraDevSecret = crypto.randomBytes(32).toString('hex')
    if (process.env.NODE_ENV === 'production') {
      console.warn('[nexora] FORM_TOKEN_SECRET is unset — using an ephemeral per-instance secret.')
    }
  }
  return globalThis.__nexoraDevSecret
}

function sign(payload) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url')
}

/** Issues `<issuedAt>.<nonce>.<signature>`. */
export function issueToken() {
  const issuedAt = Date.now().toString(36)
  const nonce = crypto.randomBytes(9).toString('base64url')
  const payload = `${issuedAt}.${nonce}`
  return `${payload}.${sign(payload)}`
}

/**
 * @returns {{valid:boolean, reason?:string}}
 */
export function verifyToken(token) {
  if (typeof token !== 'string' || token.length > 300) {
    return { valid: false, reason: 'malformed' }
  }

  const parts = token.split('.')
  if (parts.length !== 3) return { valid: false, reason: 'malformed' }

  const [issuedAt, nonce, signature] = parts
  const expected = sign(`${issuedAt}.${nonce}`)

  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { valid: false, reason: 'signature' }
  }

  const issued = parseInt(issuedAt, 36)
  if (!Number.isFinite(issued)) return { valid: false, reason: 'malformed' }

  const age = Date.now() - issued
  if (age > TOKEN_TTL_MS) return { valid: false, reason: 'expired' }
  if (age < 0) return { valid: false, reason: 'future' }
  if (age < MIN_FILL_MS) return { valid: false, reason: 'too-fast' }

  return { valid: true }
}
