/**
 * GET /api/form-token — issues a signed, short-lived anti-CSRF token.
 *
 * The contact form fetches one when it appears and sends it back with the
 * submission. The server trusts the token's issue time (not the browser's) for
 * the minimum-fill-time check, and each token can send at most one message.
 */
import { applyCors, checkOrigin, formTokenSecret, handlePreflight, issueFormToken, FORM_TOKEN_TTL_MS } from './_lib/security.js'

const LIMIT = { max: 60, windowMs: 10 * 60 * 1000 }
const hits = new Map() // ip → timestamps (per instance)

function send(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

export default function handler(req, res) {
  if (handlePreflight(req, res, 'GET')) return
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return send(res, 405, { ok: false, error: 'Method not allowed.' })
  }

  const origin = checkOrigin(req)
  if (!origin.ok) return send(res, 403, { ok: false, error: 'Forbidden.' })
  applyCors(res, origin.cors)

  const now = Date.now()
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()
  const recent = (hits.get(ip) || []).filter((t) => now - t < LIMIT.windowMs)
  if (recent.length >= LIMIT.max) {
    res.setHeader('Retry-After', String(Math.ceil((recent[0] + LIMIT.windowMs - now) / 1000)))
    return send(res, 429, { ok: false, code: 'rate_limited', error: 'Too many requests.' })
  }
  recent.push(now)
  hits.set(ip, recent)

  let secret
  try {
    secret = formTokenSecret()
  } catch (err) {
    console.error('[form-token]', err.message)
    return send(res, 500, { ok: false, error: 'The form is not fully configured yet.' })
  }
  // Locally without a secret the token is optional; hand out a placeholder.
  if (!secret) return send(res, 200, { ok: true, token: '', expiresIn: 0 })

  return send(res, 200, { ok: true, token: issueFormToken(secret, now), expiresIn: Math.floor(FORM_TOKEN_TTL_MS / 1000) })
}
