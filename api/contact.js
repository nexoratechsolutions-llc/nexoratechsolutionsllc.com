/**
 * POST /api/contact
 * Single hardened endpoint behind the contact, IMG assessment and careers forms.
 *
 * Defence in depth, in order of execution:
 *   1. Method allow-list
 *   2. Origin allow-list + required custom header (CSRF)
 *   3. Per-IP rate limit
 *   4. Byte-capped body read, then strict JSON parse
 *   5. Honeypot + timing check via the signed form token
 *   6. Schema re-validation with the exact rules the client used
 *   7. Cloudflare Turnstile token redeemed with siteverify
 *   8. CR/LF stripping + HTML escaping before the value reaches an email
 */
import crypto from 'node:crypto'
import { SCHEMA_BY_TYPE, MAX_BODY_BYTES } from '../shared/formSchemas.js'
import { verifyToken } from './_lib/token.js'
import { verifyTurnstile } from './_lib/turnstile.js'
import { rateLimit, applyRateHeaders } from './_lib/rateLimit.js'
import { sendNotification } from './_lib/mailer.js'
import {
  applySecurityHeaders,
  checkOrigin,
  hasCustomHeader,
  clientIp,
  readJsonBody,
  PayloadError,
  json,
} from './_lib/security.js'

const LIMIT = 5
const WINDOW_MS = 10 * 60 * 1000

export const config = {
  api: { bodyParser: { sizeLimit: '16kb' } },
}

export default async function handler(req, res) {
  applySecurityHeaders(res)

  /* 2. Origin / CSRF ------------------------------------------------- */
  const origin = checkOrigin(req)
  if (origin === null) {
    return json(res, 403, { ok: false, error: 'Origin not allowed.' })
  }
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Vary', 'Origin')

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Nexora-Request')
    res.setHeader('Access-Control-Max-Age', '600')
    return res.status(204).end()
  }

  /* 1. Method -------------------------------------------------------- */
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS')
    return json(res, 405, { ok: false, error: 'Method not allowed.' })
  }

  if (!hasCustomHeader(req)) {
    return json(res, 403, { ok: false, error: 'Request rejected.' })
  }

  const contentType = String(req.headers['content-type'] || '')
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return json(res, 415, { ok: false, error: 'Content-Type must be application/json.' })
  }

  /* 3. Rate limit ---------------------------------------------------- */
  const ip = clientIp(req)
  const limited = rateLimit(`submit:${ip}`, LIMIT, WINDOW_MS)
  applyRateHeaders(res, LIMIT, limited)
  if (!limited.allowed) {
    return json(res, 429, {
      ok: false,
      error: `Too many submissions. Please try again in about ${Math.ceil(limited.retryAfter / 60)} minute(s).`,
    })
  }

  /* 4. Body ---------------------------------------------------------- */
  let body
  try {
    body = await readJsonBody(req, MAX_BODY_BYTES)
  } catch (err) {
    const status = err instanceof PayloadError ? err.status : 400
    return json(res, status, { ok: false, error: err.message || 'Invalid request body.' })
  }

  const schema = SCHEMA_BY_TYPE[body.formType]
  if (!schema) {
    return json(res, 400, { ok: false, error: 'Unknown form type.' })
  }

  /* 5a. Honeypot ----------------------------------------------------- */
  // A filled hidden field means a bot. Respond as if accepted so the bot
  // gets no signal, but do nothing with it.
  if (typeof body.company_website === 'string' && body.company_website.trim() !== '') {
    console.warn('[nexora] Honeypot triggered', { ip, formType: body.formType })
    return json(res, 200, { ok: true, message: 'Thank you — your message has been received.' })
  }

  /* 5b. Signed token + minimum fill time ------------------------------ */
  const token = verifyToken(body.formToken)
  if (!token.valid) {
    const message =
      token.reason === 'expired'
        ? 'This form has been open a while. Please reload the page and resubmit.'
        : token.reason === 'too-fast'
          ? 'That was submitted unusually fast. Please try again.'
          : 'Could not verify this submission. Please reload the page and try again.'
    return json(res, 400, { ok: false, error: message })
  }

  /* 6. Schema -------------------------------------------------------- */
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const fieldErrors = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return json(res, 422, {
      ok: false,
      error: 'Please correct the highlighted fields.',
      fieldErrors,
    })
  }

  /* 7. Turnstile ----------------------------------------------------- */
  // Last check before dispatch: it costs a network round trip, and a token is
  // redeemable only once, so a field-level rejection above must not burn it.
  const captcha = await verifyTurnstile(parsed.data.turnstileToken, ip)
  if (!captcha.ok) {
    return json(res, captcha.status || 400, {
      ok: false,
      error: captcha.error,
      fieldErrors: { turnstileToken: captcha.error },
    })
  }

  /* 8. Dispatch ------------------------------------------------------ */
  const data = parsed.data
  const meta = {
    ip,
    ref: crypto.randomBytes(5).toString('hex').toUpperCase(),
    receivedAt: new Date().toISOString(),
  }

  try {
    const result = await sendNotification(data, meta)

    // A configured transport that failed means nobody received this. Saying
    // "thank you, we'll be in touch" would leave the visitor waiting for a
    // reply that is never coming, so tell them and give a direct address.
    // `email-not-configured` is the deliberate local-dev mode and still passes.
    if (!result.delivered && result.reason !== 'email-not-configured') {
      return json(res, 502, {
        ok: false,
        error:
          'Your message reached us but could not be delivered to our inbox. Please email minchu@nexoratechsolutionsllc.com directly — quote reference ' +
          meta.ref +
          '.',
      })
    }

    return json(res, 200, {
      ok: true,
      reference: meta.ref,
      delivered: result.delivered,
      message: 'Thank you — your message has been received.',
    })
  } catch (err) {
    // Never leak provider internals to the client.
    console.error('[nexora] Notification dispatch failed', err)
    return json(res, 502, {
      ok: false,
      error: 'We could not deliver your message right now. Please email minchu@nexoratechsolutionsllc.com directly.',
    })
  }
}
