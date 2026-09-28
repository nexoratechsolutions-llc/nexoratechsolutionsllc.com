/**
 * POST /api/verify-turnstile — verifies Cloudflare Turnstile token for admin login.
 */
import { applyCors, checkOrigin, handlePreflight } from './_lib/security.js'

function send(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}')
  let raw = ''
  for await (const chunk of req) {
    raw += chunk
    if (raw.length > 10_000) throw new Error('Payload too large')
  }
  return JSON.parse(raw || '{}')
}

export default async function handler(req, res) {
  if (handlePreflight(req, res, 'POST')) return
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return send(res, 405, { ok: false, error: 'Method not allowed.' })
  }

  const origin = checkOrigin(req)
  if (!origin.ok) return send(res, 403, { ok: false, error: 'Forbidden.' })
  applyCors(res, origin.cors)

  let body
  try {
    body = await readJson(req)
  } catch {
    return send(res, 400, { ok: false, error: 'Invalid request.' })
  }

  const token = body.token
  const action = body.action || 'admin-login'
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()

  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    if (process.env.VERCEL) {
      console.error('[verify-turnstile] TURNSTILE_SECRET_KEY is not set')
      return send(res, 500, { ok: false, error: 'Security check is not configured.' })
    }
    console.warn('[verify-turnstile] TURNSTILE_SECRET_KEY not set — skipping check (local only)')
    return send(res, 200, { ok: true })
  }

  if (!token || typeof token !== 'string') {
    return send(res, 400, { ok: false, error: 'Missing security verification token.' })
  }

  const params = new URLSearchParams({ secret, response: token })
  if (ip && ip !== 'unknown') params.set('remoteip', ip)

  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: params,
      signal: AbortSignal.timeout(8000),
    })
    const data = await r.json()
    if (!data.success) {
      const isExpired = (data['error-codes'] || []).includes('timeout-or-duplicate')
      return send(res, 403, {
        ok: false,
        error: isExpired
          ? 'Security check expired. Please complete it again.'
          : 'Security check failed. Please try again.',
      })
    }

    if (data.action && data.action !== action) {
      return send(res, 403, { ok: false, error: 'Action mismatch in security check.' })
    }

    return send(res, 200, { ok: true })
  } catch (err) {
    console.error('[verify-turnstile] Cloudflare verify error:', err?.message || err)
    return send(res, 502, { ok: false, error: 'Security verification service temporarily unavailable.' })
  }
}
