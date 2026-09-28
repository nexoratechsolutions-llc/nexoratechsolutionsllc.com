/**
 * Shared request security for the /api functions.
 * (Files under api/_lib are helpers; Vercel does not expose them as routes.)
 *
 *   FORM_TOKEN_SECRET  HMAC key for anti-CSRF form tokens (required on Vercel)
 *   ALLOWED_ORIGINS    comma-separated extra origins allowed to call the API
 *                      cross-origin, e.g. http://localhost:3000. The site's own
 *                      origin is always allowed.
 */
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

/* ---------- origins & CORS ---------- */

function allowedOrigins() {
  return String(process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim().replace(/\/+$/, '').toLowerCase())
    .filter(Boolean)
}

/**
 * Same-origin requests always pass. A different origin passes only when it is
 * listed in ALLOWED_ORIGINS, and then gets CORS headers. Requests without an
 * Origin header (non-browser clients) pass here; the form token, Turnstile and
 * rate limits still apply to them.
 */
export function checkOrigin(req) {
  const origin = req.headers.origin
  if (!origin) return { ok: true, cors: null }
  let url
  try {
    url = new URL(origin)
  } catch {
    return { ok: false, cors: null }
  }
  if (url.host === req.headers.host) return { ok: true, cors: null }
  const listed = allowedOrigins().includes(url.origin.toLowerCase())
  return { ok: listed, cors: listed ? url.origin : null }
}

export function applyCors(res, corsOrigin) {
  if (!corsOrigin) return
  res.setHeader('Access-Control-Allow-Origin', corsOrigin)
  res.setHeader('Vary', 'Origin')
}

/** Answers a CORS preflight. Returns true when the request was handled. */
export function handlePreflight(req, res, methods) {
  if (req.method !== 'OPTIONS') return false
  const { ok, cors } = checkOrigin(req)
  if (!ok) {
    res.statusCode = 403
    res.end()
    return true
  }
  applyCors(res, cors)
  res.setHeader('Access-Control-Allow-Methods', `${methods}, OPTIONS`)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Max-Age', '600')
  res.statusCode = 204
  res.end()
  return true
}

/* ---------- signed form tokens (anti-CSRF + trusted fill time) ---------- */

export const FORM_TOKEN_TTL_MS = 2 * 60 * 60 * 1000 // a form left open longer must refresh
export const MIN_FILL_MS = 3000 // faster than a person can fill the form

/** The signing secret, or null when unset (allowed locally only). */
export function formTokenSecret() {
  const secret = process.env.FORM_TOKEN_SECRET
  if (secret) return secret
  if (process.env.VERCEL) throw new Error('FORM_TOKEN_SECRET is not set')
  return null
}

const sign = (secret, payload) => createHmac('sha256', secret).update(payload).digest('base64url')

/** Token format: v1.<issuedAtMs>.<nonce>.<hmac> */
export function issueFormToken(secret, now = Date.now()) {
  const payload = `v1.${now}.${randomBytes(12).toString('base64url')}`
  return `${payload}.${sign(secret, payload)}`
}

/**
 * Checks signature, age and single use. Returns { ok, nonce } or
 * { ok: false, reason } with reason: invalid | expired | used | too_fast (+ waitMs).
 */
export function verifyFormToken(secret, token, usedNonces, now = Date.now()) {
  if (typeof token !== 'string' || token.length > 200) return { ok: false, reason: 'invalid' }
  const parts = token.split('.')
  if (parts.length !== 4 || parts[0] !== 'v1') return { ok: false, reason: 'invalid' }
  const [, issued, nonce, sig] = parts
  const expected = Buffer.from(sign(secret, `v1.${issued}.${nonce}`))
  const given = Buffer.from(sig)
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return { ok: false, reason: 'invalid' }

  const issuedAt = Number(issued)
  if (!Number.isFinite(issuedAt) || issuedAt > now + 30_000) return { ok: false, reason: 'invalid' }
  const age = now - issuedAt
  if (age > FORM_TOKEN_TTL_MS) return { ok: false, reason: 'expired' }
  if (usedNonces.has(nonce)) return { ok: false, reason: 'used' }
  if (age < MIN_FILL_MS) return { ok: false, reason: 'too_fast', waitMs: MIN_FILL_MS - age }
  return { ok: true, nonce }
}
