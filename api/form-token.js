/**
 * GET /api/form-token
 * Issues the short-lived signed token that every form submission must carry.
 */
import { issueToken } from './_lib/token.js'
import { rateLimit, applyRateHeaders } from './_lib/rateLimit.js'
import { applySecurityHeaders, checkOrigin, clientIp, json } from './_lib/security.js'

const LIMIT = 40
const WINDOW_MS = 10 * 60 * 1000

export default function handler(req, res) {
  applySecurityHeaders(res)

  const origin = checkOrigin(req)
  if (origin === null) return json(res, 403, { ok: false, error: 'Origin not allowed.' })
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Vary', 'Origin')

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Nexora-Request')
    res.setHeader('Access-Control-Max-Age', '600')
    return res.status(204).end()
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS')
    return json(res, 405, { ok: false, error: 'Method not allowed.' })
  }

  const limited = rateLimit(`token:${clientIp(req)}`, LIMIT, WINDOW_MS)
  applyRateHeaders(res, LIMIT, limited)
  if (!limited.allowed) {
    return json(res, 429, { ok: false, error: 'Too many requests. Please wait a moment.' })
  }

  return json(res, 200, { ok: true, token: issueToken() })
}
