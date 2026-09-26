/**
 * Notification email for a validated form submission.
 *
 * Delivered over Gmail SMTP (GMAIL_USER + GMAIL_APP_PASSWORD). With no
 * credentials set, the submission is still accepted and recorded in the
 * function logs, so nothing is silently lost.
 */
import nodemailer from 'nodemailer'
import { escapeHtml, sanitizeHeaderValue } from './security.js'
import { FIELD_LABELS } from '../../shared/formSchemas.js'

const FORM_TITLES = {
  contact: 'New enquiry — nexoratechsolutionsllc.com',
  img: 'IMG Pathway assessment request',
  careers: 'Careers application',
}

/** Fields rendered in the email, in order, per form type. */
const FIELD_ORDER = {
  contact: ['name', 'email', 'phone', 'company', 'interest', 'budget', 'timeline', 'message'],
  img: ['name', 'email', 'phone', 'country', 'gradYear', 'stage', 'track', 'visa', 'message'],
  careers: ['name', 'email', 'phone', 'role', 'portfolio', 'message'],
}

function buildHtml(data, meta) {
  const rows = (FIELD_ORDER[data.formType] || [])
    .filter((key) => data[key] !== undefined && data[key] !== '')
    .map((key) => {
      const label = escapeHtml(FIELD_LABELS[key] || key)
      const value = escapeHtml(data[key]).replace(/\n/g, '<br>')
      return `<tr>
        <td style="padding:10px 14px;border-bottom:1px solid #E1D9C6;color:#948C79;font:600 12px/1.4 monospace;text-transform:uppercase;letter-spacing:.06em;vertical-align:top;white-space:nowrap">${label}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #E1D9C6;color:#1B1912;font:400 14px/1.6 system-ui,sans-serif">${value}</td>
      </tr>`
    })
    .join('')

  return `<!doctype html>
<html><body style="margin:0;background:#F7F4EC;padding:28px;font-family:system-ui,-apple-system,sans-serif">
  <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #E1D9C6;border-radius:14px;overflow:hidden">
    <div style="padding:22px 26px;border-bottom:1px solid #E1D9C6">
      <div style="font:600 12px/1 monospace;letter-spacing:.14em;text-transform:uppercase;color:#B5602A">Nexora TechSolutions</div>
      <h1 style="margin:10px 0 0;font:600 20px/1.3 Georgia,serif;color:#1B1912">${escapeHtml(
        FORM_TITLES[data.formType] || 'Website submission'
      )}</h1>
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">${rows}</table>
    <div style="padding:16px 26px;background:#EFE9D9;color:#6B6558;font:400 12px/1.6 monospace">
      Received ${escapeHtml(meta.receivedAt)}<br>
      Source IP ${escapeHtml(meta.ip)} &middot; Ref ${escapeHtml(meta.ref)}
    </div>
  </div>
</body></html>`
}

function buildText(data, meta) {
  const lines = (FIELD_ORDER[data.formType] || [])
    .filter((key) => data[key] !== undefined && data[key] !== '')
    .map((key) => `${FIELD_LABELS[key] || key}: ${data[key]}`)

  return [
    FORM_TITLES[data.formType] || 'Website submission',
    '',
    ...lines,
    '',
    `Received ${meta.receivedAt} | IP ${meta.ip} | Ref ${meta.ref}`,
  ].join('\n')
}

/* ------------------------------------------------------------------ */
/* Transports                                                          */
/* ------------------------------------------------------------------ */

/**
 * Gmail SMTP over implicit TLS.
 *
 * Built per invocation rather than pooled: a serverless instance is frozen
 * between requests, so a held-open socket would be dead by the next one.
 */
export function gmailTransport() {
  const user = process.env.GMAIL_USER
  // Google shows app passwords in groups of four; the spaces are display only.
  const pass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '')
  if (!user || !pass) return null

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  })
}

async function sendViaGmail({ to, subject, html, text, replyTo }) {
  const transport = gmailTransport()
  if (!transport) return null

  // Gmail rewrites From to the authenticated account regardless of what we ask
  // for, so send as that account and route replies to the enquirer instead.
  const user = process.env.GMAIL_USER

  try {
    const info = await transport.sendMail({
      from: `"Nexora Website" <${user}>`,
      to,
      replyTo,
      subject,
      html,
      text,
    })
    return { delivered: true, transport: 'gmail', id: info.messageId }
  } catch (err) {
    console.error('[nexora] Gmail SMTP send failed', err?.code || '', String(err?.message || err).slice(0, 300))
    return { delivered: false, reason: 'smtp-error', transport: 'gmail' }
  } finally {
    transport.close()
  }
}

/**
 * Sends the notification over Gmail SMTP. With no Gmail credentials set, the
 * submission is logged instead of emailed, so nothing is lost.
 *
 * @returns {Promise<{delivered:boolean, transport?:string, reason?:string}>}
 */
export async function sendNotification(data, meta) {
  const to = process.env.CONTACT_TO_EMAIL || 'minchu@nexoratechsolutionsllc.com'

  const message = {
    to,
    subject: sanitizeHeaderValue(`${FORM_TITLES[data.formType] || 'Website submission'} — ${data.name}`),
    html: buildHtml(data, meta),
    text: buildText(data, meta),
    // Hitting reply in the mail client goes straight back to the enquirer.
    replyTo: sanitizeHeaderValue(data.email),
  }

  const gmail = await sendViaGmail(message)
  if (gmail?.delivered) return gmail

  if (!gmail) {
    console.info('[nexora] Submission accepted (no mail transport configured, email skipped)', {
      formType: data.formType,
      ref: meta.ref,
      receivedAt: meta.receivedAt,
    })
    return { delivered: false, reason: 'email-not-configured' }
  }

  // The send failed. Write the whole submission to the logs so the enquiry is
  // recoverable rather than silently lost.
  console.error('[nexora] MAIL SEND FAILED — submission preserved below', {
    ref: meta.ref,
    receivedAt: meta.receivedAt,
    ip: meta.ip,
    reason: gmail.reason,
    submission: buildText(data, meta),
  })

  return { delivered: false, reason: gmail.reason || 'send-failed' }
}
