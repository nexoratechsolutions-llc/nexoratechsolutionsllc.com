/**
 * POST /api/contact — sends a contact-form submission to the company inbox.
 *
 * Runs as a Vercel serverless function in production, and in-process under
 * `npm run dev` / `npm run preview` via vite-plugins/api-dev.js.
 *
 * Server-only configuration (never in client code):
 *   GMAIL_USER            the Gmail account that sends
 *   GMAIL_APP_PASSWORD    its 16-character app password
 *   CONTACT_TO            inbox that receives submissions (default below)
 *   TURNSTILE_SECRET_KEY  Cloudflare Turnstile secret; required on Vercel
 *   FORM_TOKEN_SECRET     signs the anti-CSRF form token; required on Vercel
 *   ALLOWED_ORIGINS       extra origins allowed to call the API (see _lib/security.js)
 *   CONTACT_DRY_RUN=1     local testing only: run everything except the send
 *
 * Defences, cheapest first:
 *   1. origin check: same-site, or listed in ALLOWED_ORIGINS (with CORS)
 *   2. attempt limit per IP (any request)
 *   3. honeypot field (bots are told "ok" and dropped)
 *   3b. signed form token from /api/form-token: valid signature, not expired,
 *       not used before, and issued at least 3 s ago (server-trusted fill time)
 *   4. field validation
 *   5. duplicate detection: the same submissionId, or the same email+message,
 *      is acknowledged again without sending a second email
 *   6. send limits per IP and per sender email
 *   7. Cloudflare Turnstile verification
 *
 * The recipient is fixed server-side and the visitor's address is only ever
 * used as Reply-To, so this endpoint cannot be used to send mail anywhere else.
 *
 * Limits and duplicate memory are per server instance (they reset on a cold
 * start). Turnstile is the hard gate; the limits are a brake on top of it.
 */
import { createHash } from 'node:crypto'
import nodemailer from 'nodemailer'
import { applyCors, checkOrigin, formTokenSecret, handlePreflight, verifyFormToken, FORM_TOKEN_TTL_MS } from './_lib/security.js'
import { saveSubmission } from './_lib/supabase.js'

const DEFAULT_TO = 'minchu@nexoratechsolutionsllc.com'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const TURNSTILE_ACTION = 'contact'

const MIN = 60 * 1000
const HOUR = 60 * MIN
const LIMITS = {
  attemptsPerIp: { max: 20, windowMs: 10 * MIN }, // every POST, including mistakes
  sendsPerIp: { max: 3, windowMs: 10 * MIN },
  sendsPerIpDay: { max: 10, windowMs: 24 * HOUR },
  sendsPerEmail: { max: 3, windowMs: HOUR },
}
const DUPLICATE_WINDOW_MS = HOUR

/* ---------- in-memory state (per instance) ---------- */

const buckets = new Map() // key → timestamps[]
const seen = new Map() // submissionId / content hash → timestamp
const inFlight = new Set() // keys of submissions being sent right now
const usedTokens = new Map() // form-token nonce → time it was spent

function recent(key, windowMs, now) {
  const list = (buckets.get(key) || []).filter((t) => now - t < windowMs)
  if (list.length) buckets.set(key, list)
  else buckets.delete(key)
  return list
}

/** Seconds until another request under this limit would be allowed, or 0. */
function retryAfter(key, { max, windowMs }, now) {
  const list = recent(key, windowMs, now)
  return list.length >= max ? Math.ceil((list[0] + windowMs - now) / 1000) : 0
}

function record(key, now) {
  const list = buckets.get(key) || []
  list.push(now)
  buckets.set(key, list)
}

function prune(now) {
  if (Math.random() > 0.05) return // occasional sweep keeps memory bounded
  for (const [k, t] of seen) if (now - t > DUPLICATE_WINDOW_MS) seen.delete(k)
  for (const [k, t] of usedTokens) if (now - t > FORM_TOKEN_TTL_MS) usedTokens.delete(k)
  for (const [k, list] of buckets) {
    const live = list.filter((t) => now - t < 24 * HOUR)
    if (live.length) buckets.set(k, live)
    else buckets.delete(k)
  }
}

/* ---------- helpers ---------- */

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}')
  let raw = ''
  for await (const chunk of req) {
    raw += chunk
    if (raw.length > 50_000) throw new Error('Payload too large')
  }
  return JSON.parse(raw || '{}')
}

const clean = (v, max) => String(v ?? '').replace(/\u0000/g, '').trim().slice(0, max)
const oneLine = (v) => v.replace(/[\r\n]+/g, ' ')
const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const contentKey = (email, message) =>
  'h:' + createHash('sha256').update(`${email.toLowerCase()}\n${message.replace(/\s+/g, ' ').toLowerCase()}`).digest('hex')

function send(res, status, body, headers = {}) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v)
  res.end(JSON.stringify(body))
}

function tooMany(res, seconds, error) {
  return send(res, 429, { ok: false, code: 'rate_limited', retryAfter: seconds, error }, { 'Retry-After': String(seconds) })
}

async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    // Locally the check is optional; on Vercel a missing secret is a misconfiguration.
    if (process.env.VERCEL) return { ok: false, config: true }
    console.warn('[contact] TURNSTILE_SECRET_KEY not set — skipping bot check (local only)')
    return { ok: true }
  }
  if (!token || typeof token !== 'string' || token.length > 2048) return { ok: false, codes: ['missing-input-response'] }

  const form = new URLSearchParams({ secret, response: token })
  if (ip && ip !== 'unknown') form.set('remoteip', ip)
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(8000),
    })
    const data = await r.json()
    if (!data.success) return { ok: false, codes: data['error-codes'] || [] }
    if (data.action && data.action !== TURNSTILE_ACTION) return { ok: false, codes: ['action-mismatch'] }
    return { ok: true }
  } catch (err) {
    console.error('[contact] Turnstile verify failed:', err?.message || err)
    return { ok: false, codes: ['verify-unavailable'] }
  }
}

/* ---------- handler ---------- */

export default async function handler(req, res) {
  if (handlePreflight(req, res, 'POST')) return
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return send(res, 405, { ok: false, error: 'Method not allowed.' })
  }

  // Same-site, or an origin listed in ALLOWED_ORIGINS.
  const origin = checkOrigin(req)
  if (!origin.ok) return send(res, 403, { ok: false, error: 'Forbidden.' })
  applyCors(res, origin.cors)

  const now = Date.now()
  prune(now)
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()

  // 1. Attempt limit — counts every POST, so nobody can hammer the endpoint.
  const attemptKey = `attempt:${ip}`
  const attemptWait = retryAfter(attemptKey, LIMITS.attemptsPerIp, now)
  if (attemptWait) return tooMany(res, attemptWait, 'Too many attempts. Please wait a few minutes and try again.')
  record(attemptKey, now)

  let body
  try {
    body = await readJson(req)
  } catch {
    return send(res, 400, { ok: false, error: 'Invalid request.' })
  }

  // 2. Bots that filled the hidden field: pretend it worked.
  if (clean(body.website, 200)) return send(res, 200, { ok: true })

  // 2b. Signed form token — proves the request came from our form, and when it was opened.
  let secret
  try {
    secret = formTokenSecret()
  } catch (err) {
    console.error('[contact]', err.message)
    return send(res, 500, { ok: false, error: 'The form is not fully configured yet. Please email or call us.' })
  }
  let tokenNonce = null
  if (secret) {
    const check = verifyFormToken(secret, body.formToken, usedTokens, now)
    if (!check.ok) {
      if (check.reason === 'too_fast') {
        return tooMany(res, Math.ceil(check.waitMs / 1000), 'That was quick! Please take a moment and send again.')
      }
      return send(res, 403, {
        ok: false,
        code: 'form_token',
        error:
          check.reason === 'expired'
            ? 'This form was open for a long time, so we refreshed it. Please press Send again.'
            : 'Your form session could not be verified. Please press Send again.',
      })
    }
    tokenNonce = check.nonce
  } else {
    console.warn('[contact] FORM_TOKEN_SECRET not set — skipping form token check (local only)')
  }

  // 3. Validation.
  const data = {
    name: oneLine(clean(body.name, 120)),
    email: oneLine(clean(body.email, 254)),
    phone: oneLine(clean(body.phone, 40)),
    topic: oneLine(clean(body.topic, 120)),
    form: oneLine(clean(body.form, 120)) || 'Website enquiry',
    page: oneLine(clean(body.page, 200)),
    message: clean(body.message, 5000),
  }
  const errors = {}
  if (data.name.length < 2) errors.name = 'Please enter your name.'
  if (!EMAIL_RE.test(data.email)) errors.email = 'Please enter a valid email address.'
  if (data.message.length < 10) errors.message = 'Please write at least 10 characters.'
  if (Object.keys(errors).length) return send(res, 422, { ok: false, error: 'Please check the form.', fields: errors })

  // 4. Duplicates: a retried request, or the same message sent again. Acknowledge, don't resend.
  const idKey = /^[A-Za-z0-9-]{8,64}$/.test(String(body.submissionId || '')) ? `id:${body.submissionId}` : null
  const hashKey = contentKey(data.email, data.message)
  if ((idKey && seen.has(idKey)) || seen.has(hashKey)) {
    if (tokenNonce) usedTokens.set(tokenNonce, now)
    return send(res, 200, { ok: true, duplicate: true })
  }
  // The same submission arriving twice at once (double-click, retry race).
  if ((idKey && inFlight.has(idKey)) || inFlight.has(hashKey)) {
    return send(res, 409, { ok: false, code: 'in_progress', error: 'This message is already being sent.' })
  }
  const lockKeys = [hashKey, idKey].filter(Boolean)
  lockKeys.forEach((k) => inFlight.add(k))
  try {
    return await deliver(res, { now, ip, data, body, idKey, hashKey, tokenNonce })
  } finally {
    lockKeys.forEach((k) => inFlight.delete(k))
  }
}

/** Steps 5–7: send limits, Turnstile, then the email itself. */
async function deliver(res, { now, ip, data, body, idKey, hashKey, tokenNonce }) {
  // 5. Send limits — per visitor and per sender address.
  const emailKey = `email:${data.email.toLowerCase()}`
  const sendWait = Math.max(
    retryAfter(`send:${ip}`, LIMITS.sendsPerIp, now),
    retryAfter(`sendday:${ip}`, LIMITS.sendsPerIpDay, now),
    retryAfter(emailKey, LIMITS.sendsPerEmail, now)
  )
  if (sendWait) {
    return tooMany(
      res,
      sendWait,
      "You've sent several messages recently. Please wait a little before sending another, or call us directly."
    )
  }

  // 6. Cloudflare Turnstile.
  const human = await verifyTurnstile(body.turnstileToken, ip)
  if (!human.ok) {
    if (human.config) {
      console.error('[contact] TURNSTILE_SECRET_KEY is not set on the server')
      return send(res, 500, { ok: false, error: 'The form is not fully configured yet. Please email or call us.' })
    }
    return send(res, 403, {
      ok: false,
      code: 'turnstile',
      error: human.codes?.includes('timeout-or-duplicate')
        ? 'The security check expired. Please complete it again and resend.'
        : 'We could not verify the security check. Please complete it again and resend.',
    })
  }

  // 7. Send.
  const dryRun = process.env.CONTACT_DRY_RUN === '1' && !process.env.VERCEL
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!dryRun && (!user || !pass)) {
    console.error('[contact] GMAIL_USER / GMAIL_APP_PASSWORD are not set')
    return send(res, 500, { ok: false, error: 'Email is not configured on the server yet.' })
  }

  const rows = [
    ['Name', data.name],
    ['Email', data.email],
    ['Phone', data.phone || '—'],
    ['Topic', data.topic || '—'],
    ['Form', data.form],
    ['Page', data.page || '—'],
  ]
  const text = `${data.message}\n\n—\n${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n`
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1B1912;line-height:1.55">
      <h2 style="margin:0 0 12px;font-size:18px">${escapeHtml(data.form)}</h2>
      <table cellpadding="6" style="border-collapse:collapse;margin-bottom:16px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="color:#6B6558;padding-right:14px">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`
          )
          .join('')}
      </table>
      <div style="white-space:pre-wrap;border-left:3px solid #B5602A;padding:4px 0 4px 14px">${escapeHtml(data.message)}</div>
      <p style="color:#948C79;font-size:12px;margin-top:20px">Sent from the contact form on the Nexora website. Reply to this email to answer ${escapeHtml(data.name)} directly.</p>
    </div>`
  const mail = {
    from: { name: 'Nexora Website', address: user || 'dry-run@localhost' },
    to: process.env.CONTACT_TO || DEFAULT_TO,
    replyTo: { name: data.name, address: data.email },
    subject: `${data.form}: ${data.topic || 'New message'} — ${data.name}`,
    text,
    html,
  }

  let emailSent = false
  let emailError = null

  try {
    if (dryRun) {
      console.log(`[contact] DRY RUN — would send "${mail.subject}" to ${mail.to}`)
      emailSent = true
    } else {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user, pass },
      })
      await transporter.sendMail(mail)
      emailSent = true
    }
  } catch (err) {
    console.error('[contact] send failed:', err?.message || err)
    emailError = err?.message || 'SMTP send failed'
  }

  // Always save submission to Supabase database
  try {
    await saveSubmission({
      name: data.name,
      email: data.email,
      phone: data.phone,
      topic: data.topic,
      form: data.form,
      page: data.page,
      message: data.message,
      submissionId: body.submissionId,
      ip,
      emailSent,
      emailError,
    })
  } catch (dbErr) {
    console.error('[contact] Supabase save failed:', dbErr?.message || dbErr)
  }

  if (!emailSent && !dryRun) {
    return send(res, 502, { ok: false, error: "We couldn't deliver your email immediately, but your message has been saved into our system and our team will get back to you shortly." })
  }

  // Remember it only once it has really gone. The form token is now spent.
  if (tokenNonce) usedTokens.set(tokenNonce, now)
  if (idKey) seen.set(idKey, now)
  seen.set(hashKey, now)
  record(`send:${ip}`, now)
  record(`sendday:${ip}`, now)
  record(emailKey, now)
  return send(res, 200, { ok: true })
}
