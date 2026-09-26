/**
 * Request-level security helpers for the Nexora API routes.
 * Node runtime (Vercel Serverless Functions).
 */

/** Hard security headers on every API response. */
export function applySecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('X-Robots-Tag', 'noindex, nofollow')
  // API responses are JSON only — deny any attempt to frame or embed them.
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'; sandbox")
}

/** Origins permitted to call the API. */
function allowedOrigins() {
  const configured = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)

  // Vercel injects the deployment host; allow the site to call itself.
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null

  return [...configured, ...(vercelUrl ? [vercelUrl] : [])]
}

/** Any loopback origin, on any port — development only. */
function isLocalDevOrigin(origin) {
  if (process.env.NODE_ENV === 'production') return false
  try {
    const { hostname, protocol } = new URL(origin)
    return protocol === 'http:' && (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]')
  } catch {
    return false
  }
}

/**
 * Same-origin enforcement. Browsers cannot forge Origin, so a strict check
 * here is the primary CSRF defence for these JSON endpoints.
 * Returns the echo-able origin, or null when the request must be rejected.
 */
export function checkOrigin(req) {
  const origin = req.headers.origin
  const list = allowedOrigins()

  // No Origin header: same-origin non-CORS request (e.g. curl, server-side).
  // We still require the custom header below, which browsers cannot set
  // cross-origin without a successful preflight.
  if (!origin) return ''

  // Whatever port the dev server lands on, local development should just work.
  // This is inert in production, where NODE_ENV is 'production'.
  if (isLocalDevOrigin(origin)) return origin

  return list.includes(origin) ? origin : null
}

/**
 * Requires the custom `X-Nexora-Request` header. A cross-origin form POST or
 * an <img>/<form> CSRF attempt cannot set custom headers without a preflight
 * that our origin check would already fail.
 */
export function hasCustomHeader(req) {
  return req.headers['x-nexora-request'] === '1'
}

/** Best-effort client IP, preferring Vercel's trusted header. */
export function clientIp(req) {
  const real = req.headers['x-real-ip']
  if (typeof real === 'string' && real) return real

  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string' && fwd) return fwd.split(',')[0].trim()

  return req.socket?.remoteAddress || 'unknown'
}

/**
 * Reads and parses a JSON body with a hard byte ceiling, so an oversized
 * payload is dropped before it is ever parsed.
 */
export async function readJsonBody(req, maxBytes) {
  // Vercel may have parsed it already; re-check the size in that case.
  if (req.body && typeof req.body === 'object') {
    const size = Buffer.byteLength(JSON.stringify(req.body))
    if (size > maxBytes) throw new PayloadError('Payload too large.', 413)
    return req.body
  }

  const chunks = []
  let total = 0

  for await (const chunk of req) {
    total += chunk.length
    if (total > maxBytes) {
      req.destroy()
      throw new PayloadError('Payload too large.', 413)
    }
    chunks.push(chunk)
  }

  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) throw new PayloadError('Empty request body.', 400)

  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new PayloadError('Malformed request body.', 400)
    }
    return parsed
  } catch (err) {
    if (err instanceof PayloadError) throw err
    throw new PayloadError('Malformed JSON.', 400)
  }
}

export class PayloadError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.name = 'PayloadError'
    this.status = status
  }
}

/** Escapes a value for safe interpolation into an HTML email. */
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Strips CR/LF so user input can never inject email headers. */
export function sanitizeHeaderValue(value) {
  return String(value ?? '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, 200)
}

export function json(res, status, payload) {
  applySecurityHeaders(res)
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}
