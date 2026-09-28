import { useEffect, useId, useRef, useState } from 'react'
import Turnstile, { TURNSTILE_SITE_KEY } from './Turnstile'
import { ArrowRight, Send } from './Icons'
import { SITE } from '../data/site'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const EMPTY = { name: '', email: '', phone: '', message: '' }

const COOLDOWN_MS = 30 * 1000 // after a successful send, before another is allowed
const DUPLICATE_MS = 60 * 60 * 1000 // same message again within this window is blocked
const WAIT_KEY = 'nexora-contact-wait'
const SENT_KEY = 'nexora-contact-sent'

/* ---------- small helpers ---------- */

function validate(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address.'
  if (v.message.trim().length < 10) e.message = 'A sentence or two helps us prepare — at least 10 characters.'
  return e
}


/** 45 → "45s", 3516 → "58m 36s". */
const formatWait = (s) => (s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`)

const newId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`

/** Cheap fingerprint of a message, for spotting an exact resend. */
function fingerprint(values) {
  const s = `${values.email.trim().toLowerCase()}\n${values.message.replace(/\s+/g, ' ').trim().toLowerCase()}`
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return String(h >>> 0)
}

// Browser storage can be unavailable (private mode, blocked); every access is guarded.
const store = {
  get(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key))
      return v ?? fallback
    } catch {
      return fallback
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* non-fatal */
    }
  },
}

/**
 * Contact form, used on both contact pages. Submits to /api/contact.
 *
 * Protection against double and duplicate submissions:
 *  - a synchronous lock, so a double-click can never fire two requests;
 *  - a submission id sent with each request, so a retry is recognised server-side;
 *  - the same email + message is refused for an hour (here and on the server);
 *  - a short cooldown after each successful send, kept across reloads;
 *  - server rate limits (429) show a live countdown and disable the button.
 * Plus a signed anti-CSRF form token (/api/form-token, which also gives the
 * server a trusted fill time), Cloudflare Turnstile and a honeypot field.
 */
export default function ContactForm({ topics, subjectPrefix, messageLabel = 'How can we help?', messagePlaceholder }) {
  const uid = useId()
  const formRef = useRef(null)
  const successRef = useRef(null)
  const turnstileRef = useRef(null)
  const lock = useRef(false)
  const formToken = useRef('')
  const submissionId = useRef('')

  const [values, setValues] = useState({ ...EMPTY, topic: topics[0] })
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | error
  const [serverError, setServerError] = useState('')
  const [offerFallback, setOfferFallback] = useState(true) // show the "call us" fallback
  const [sent, setSent] = useState(null) // { name, email, topic, duplicate } once delivered
  const [cardHeight, setCardHeight] = useState(0)
  const [token, setToken] = useState(null)
  const [tsError, setTsError] = useState('')
  const [blockedUntil, setBlockedUntil] = useState(0)
  const [now, setNow] = useState(0)

  const id = (k) => `${uid}-${k}`

  /** Fetches a fresh signed form token; each one can send a single message. */
  const refreshFormToken = async () => {
    formToken.current = ''
    try {
      const res = await fetch('/api/form-token', { cache: 'no-store' })
      const data = await res.json()
      if (res.ok && data.ok) formToken.current = data.token || ''
    } catch {
      /* the server will ask for a refresh when the form is sent */
    }
  }

  useEffect(() => {
    refreshFormToken()
    submissionId.current = newId()
    // A cooldown or rate-limit wait survives a page reload.
    const wait = Number(store.get(WAIT_KEY, 0))
    if (wait > Date.now()) setBlockedUntil(wait)
  }, [])

  // Tick once a second while a wait is running, for the countdown.
  useEffect(() => {
    if (!blockedUntil) return
    setNow(Date.now())
    const t = setInterval(() => {
      const n = Date.now()
      setNow(n)
      if (n >= blockedUntil) {
        setBlockedUntil(0)
        clearInterval(t)
      }
    }, 1000)
    return () => clearInterval(t)
  }, [blockedUntil])

  const waitSeconds = blockedUntil ? Math.max(0, Math.ceil((blockedUntil - (now || Date.now())) / 1000)) : 0
  const blocked = waitSeconds > 0

  const blockFor = (ms) => {
    const until = Date.now() + ms
    setBlockedUntil(until)
    store.set(WAIT_KEY, until)
  }

  // After a successful send, bring the confirmation into view and focus it.
  useEffect(() => {
    if (!sent) return
    const el = successRef.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.closest('.form-card')?.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' })
    el.focus({ preventScroll: true })
  }, [sent])

  const startOver = () => {
    setSent(null)
    setStatus('idle')
    setErrors({})
    setToken(null)
    setTsError('')
    refreshFormToken()
    submissionId.current = newId()
    requestAnimationFrame(() => formRef.current?.querySelector(`#${CSS.escape(id('name'))}`)?.focus())
  }

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
    if (status === 'error') setStatus('idle')
  }

  const focusFirst = (found) => {
    const first = Object.keys(found)[0]
    if (first) formRef.current?.querySelector(`#${CSS.escape(id(first))}`)?.focus()
  }

  const fail = (message, fallback = true) => {
    setServerError(message)
    setOfferFallback(fallback)
    setStatus('error')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    // The ref flips synchronously, so a second click in the same instant is ignored.
    if (lock.current || blocked) return

    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      focusFirst(found)
      return
    }

    // The exact same message was already sent recently.
    const fp = fingerprint(values)
    const history = store.get(SENT_KEY, []).filter((x) => x && Date.now() - x.at < DUPLICATE_MS)
    if (history.some((x) => x.h === fp)) {
      fail(
        "You've already sent us this exact message — we have it and will reply soon. Change the message to send something new.",
        false
      )
      return
    }

    if (TURNSTILE_SITE_KEY && !token) {
      setTsError('Please complete the security check above the button.')
      return
    }

    lock.current = true
    setStatus('sending')
    setServerError('')
    setTsError('')
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 20000)
    let consumedToken = false

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          form: subjectPrefix,
          page: window.location.pathname,
          formToken: formToken.current,
          submissionId: submissionId.current,
          turnstileToken: token || '',
          website: honeypot,
        }),
        signal: controller.signal,
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok && data.ok) {
        store.set(SENT_KEY, [...history, { h: fp, at: Date.now() }].slice(-10))
        blockFor(COOLDOWN_MS)
        setCardHeight(formRef.current?.offsetHeight || 0)
        setSent({
          name: values.name.trim().split(/\s+/)[0],
          email: values.email.trim(),
          topic: values.topic,
          duplicate: Boolean(data.duplicate),
        })
        setValues({ ...EMPTY, topic: topics[0] })
        setHoneypot('')
        setStatus('idle')
        return
      }

      // The form token was stale or missing: get a new one for the next press.
      if (data.code === 'form_token') refreshFormToken()
      // Anything past the server's Turnstile step may have used up the Turnstile token.
      consumedToken = (res.status === 403 && data.code !== 'form_token') || res.status >= 500
      if (res.status === 429) {
        const secs = Number(data.retryAfter) || Number(res.headers.get('Retry-After')) || 60
        blockFor(secs * 1000)
      }
      if (data.fields) {
        setErrors(data.fields)
        focusFirst(data.fields)
      }
      fail(data.error || 'Something went wrong while sending.')
    } catch {
      consumedToken = true
      fail("We couldn't reach the server. Check your connection and try again.")
    } finally {
      clearTimeout(timer)
      if (consumedToken) turnstileRef.current?.reset()
      lock.current = false
    }
  }

  const field = (k) => ({
    id: id(k),
    name: k,
    value: values[k],
    onChange: set(k),
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? id(`${k}-err`) : undefined,
  })

  const sending = status === 'sending'

  if (sent) {
    return (
      <div
        className="form-card success-card"
        role="status"
        aria-live="polite"
        style={cardHeight ? { minHeight: cardHeight } : undefined}
      >
        <svg className="success-check" viewBox="0 0 64 64" aria-hidden="true">
          <circle className="ring" cx="32" cy="32" r="29" />
          <path className="tick" d="M19 33.5l8.5 8.5L45.5 23" />
        </svg>
        <h2 ref={successRef} tabIndex={-1}>
          Thank you, {sent.name}!
        </h2>
        <span className="pill live">{sent.topic}</span>
        <p className="success-lede">
          {sent.duplicate ? (
            <>
              We already have this message, so there's no need to send it again. We'll reply to <b>{sent.email}</b>.
            </>
          ) : (
            <>
              Your message has been sent to our team. We'll reply to <b>{sent.email}</b>.
            </>
          )}
        </p>
        <p className="success-help">
          Need us sooner? Call <a href={SITE.phoneHref}>{SITE.phone}</a>.
        </p>
        <button type="button" className="btn btn-ghost" onClick={startOver} disabled={blocked}>
          {blocked ? (
            `Send another message in ${formatWait(waitSeconds)}`
          ) : (
            <>
              Send another message <ArrowRight size={16} className="arrow" />
            </>
          )}
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} className="form-card" onSubmit={onSubmit} noValidate aria-busy={sending}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor={id('name')}>Full name</label>
          <input type="text" autoComplete="name" required maxLength={120} {...field('name')} />
          {errors.name && <span className="err" id={id('name-err')}>{errors.name}</span>}
        </div>
        <div className="field">
          <label htmlFor={id('email')}>Email</label>
          <input type="email" autoComplete="email" inputMode="email" required maxLength={254} {...field('email')} />
          {errors.email && <span className="err" id={id('email-err')}>{errors.email}</span>}
        </div>
        <div className="field">
          <label htmlFor={id('phone')}>
            Phone <span className="opt">(optional)</span>
          </label>
          <input type="tel" autoComplete="tel" inputMode="tel" maxLength={40} {...field('phone')} />
        </div>
        <div className="field">
          <label htmlFor={id('topic')}>Topic</label>
          <select {...field('topic')}>
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="field full">
          <label htmlFor={id('message')}>{messageLabel}</label>
          <textarea rows={6} required maxLength={5000} placeholder={messagePlaceholder} {...field('message')} />
          {errors.message && <span className="err" id={id('message-err')}>{errors.message}</span>}
        </div>

        {TURNSTILE_SITE_KEY && (
          <div className="field full turnstile-field">
            <Turnstile
              ref={turnstileRef}
              onToken={(t) => {
                setToken(t)
                if (t) setTsError('')
              }}
              onError={(code) =>
                setTsError(
                  code === 'load'
                    ? "The security check couldn't load. Check your connection, or call us directly."
                    : 'The security check hit a problem. It will retry automatically — or refresh the page.'
                )
              }
            />
            {tsError && (
              <span className="err" role="alert">
                {tsError}
              </span>
            )}
          </div>
        )}

        {/* Honeypot: invisible to people, tempting to bots. */}
        <div className="hp" aria-hidden="true">
          <label htmlFor={id('website')}>Leave this field empty</label>
          <input
            id={id('website')}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>
      </div>

      <div className="form-foot">
        <button type="submit" className="btn btn-primary btn-lg" disabled={sending || blocked}>
          {sending ? (
            <>
              <span className="spinner" aria-hidden="true" /> Sending…
            </>
          ) : blocked ? (
            `Please wait ${formatWait(waitSeconds)}`
          ) : (
            <>
              Send message <Send size={17} />
            </>
          )}
        </button>
        <p className="form-note">
          {blocked
            ? 'To prevent duplicate messages, the form pauses briefly between sends.'
            : 'Your message goes straight to our team, and we reply by email.'}
        </p>
      </div>

      <div aria-live="polite">
        {status === 'error' && (
          <p className={`form-status ${offerFallback ? 'bad' : 'info'}`}>
            {serverError}
            {offerFallback && (
              <>
                {' '}
                Or call us on <a href={SITE.phoneHref}>{SITE.phone}</a>.
              </>
            )}
          </p>
        )}
      </div>
    </form>
  )
}
