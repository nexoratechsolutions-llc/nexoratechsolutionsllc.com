# Nexora TechSolutions — website

React 18 + Vite marketing site for Nexora TechSolutions LLC, with hardened
serverless form handling, deployed on Vercel.

---

## Quick start (Windows)

Double-click one of these in the project folder:

| File | What it does |
| --- | --- |
| `start.bat` | Installs dependencies if needed, then runs the dev server and opens http://localhost:5173 |
| `build.bat` | Builds to `dist/` and serves the production bundle at http://localhost:4173 |
| `deploy.bat` | Menu: preview deploy, production deploy, or `vercel dev` (the only mode where the forms work locally) |

Or from a terminal:

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # -> dist/
npm run preview    # serve dist/ at :4173
npm run lint
```

> **The forms work in `npm run dev`.** A small Vite plugin
> ([`vite-plugins/apiDevServer.js`](vite-plugins/apiDevServer.js)) mounts the
> `api/` folder as dev middleware, so `/api/form-token` and `/api/contact` run
> in-process exactly as they do on Vercel. You do not need `vercel dev` for
> day-to-day work — it stays available via `deploy.bat` → option 3 if you want
> to check something against the real Vercel runtime.
>
> Put your secrets in `.env` (or `.env.local`); the dev server loads every key
> into `process.env`, not just the `VITE_` ones, so the API handlers can read
> `FORM_TOKEN_SECRET`, `TURNSTILE_SECRET_KEY` and `GMAIL_*`.

---

## Pages

| Route | Page |
| --- | --- |
| `/` | Home — hero, about, process, impact, services, AI, IMG teaser, why |
| `/about` | Company, operating model, timeline, leadership |
| `/process` | The five-phase delivery cycle in full |
| `/services` | Six capabilities, each with detail and stack |
| `/ai-solutions` | AI agents, case studies, industries, build method |
| `/consulting` | Business analysis, SAFe training, staffing |
| `/img-pathway` | Nexora IMG Pathway — tracks, cycle, tiers, FAQ, assessment form |
| `/careers` | Open roles, how we work, application form |
| `/contact` | Contact form and contact details |
| `/privacy`, `/terms` | Legal |
| anything else | 404 |

---

## Project layout

```
api/                    Vercel serverless functions (Node)
  contact.js            POST — handles all three forms
  form-token.js         GET  — issues the signed anti-CSRF token
  _lib/                 security, rate limiting, token signing, mailer
shared/
  formSchemas.js        zod schemas used by BOTH client and server
src/
  components/           Header, Footer, primitives, icons, form fields
    forms/              ContactForm, ImgAssessmentForm, CareersForm
  pages/                One file per route
  hooks/                Motion, theme, form state machine
  lib/                  API client, SEO helper
  data/site.js          All site copy and navigation
  styles/               tokens.css, components.css, effects.css
public/                 Icons, manifest, robots, sitemap, theme boot script
vercel.json             Security headers, SPA rewrites, caching
```

---

## Security

Form submissions pass seven checks server-side, in this order:

1. **Method allow-list** — only `POST` (plus `OPTIONS` preflight).
2. **Origin allow-list + required custom header** — `X-Nexora-Request: 1`.
   A browser cannot set a custom header cross-origin without a preflight that
   the origin check already fails, which is what blocks CSRF here.
3. **Per-IP rate limit** — 5 submissions per 10 minutes.
4. **Byte-capped body read** — 16 KB ceiling, enforced *before* parsing.
5. **Honeypot + minimum fill time** — a filled hidden field, or a submission
   less than 2.5 s after the form token was issued, is treated as a bot.
6. **Schema re-validation** — the same zod rules the browser used. Client-side
   validation here is a UX feature, never a security control.
7. **Cloudflare Turnstile** — the widget token is redeemed with `siteverify`.
   Cloudflare redeems each token exactly once, so a replayed token comes back
   as `timeout-or-duplicate`. This runs *last*, after schema validation, so a
   simple typo in a field does not burn the visitor's captcha token.
8. **CR/LF stripping and HTML escaping** before any value reaches an email.

Also in place:

- Strict CSP, HSTS, `X-Frame-Options: DENY`, `Referrer-Policy`,
  `Permissions-Policy` and COOP/CORP — all set in `vercel.json`.
- No third-party analytics, ad trackers or tracking cookies. The only browser
  storage is the light/dark theme preference.
- Error responses never leak provider internals; failures are logged server-side.

### Known limit: rate limiting is per-instance

`api/_lib/rateLimit.js` keeps counters in memory, so on Vercel it limits per
warm lambda instance, not globally. That stops casual flooding and duplicate
submits, but not a distributed attack. For production hardening, back it with
Vercel KV or Upstash Redis — `rateLimit(key, limit, windowMs)` is designed as a
drop-in swap.

---

## Environment variables

Copy `.env.example` to `.env.local` for local work, and set the same keys in the
Vercel dashboard for deployment. **Never prefix a secret with `VITE_`** — that
prefix bundles the value into the client.

| Variable | Required | Purpose |
| --- | --- | --- |
| `FORM_TOKEN_SECRET` | **yes, in production** | Signs the anti-CSRF form tokens. Without it, each lambda instance generates its own ephemeral secret, so tokens break as instances recycle. |
| `GMAIL_USER` | yes* | Google account that sends the notification emails. |
| `GMAIL_APP_PASSWORD` | yes* | Its app password — **not** the account password. Spaces are display-only and stripped in code. |
| `CONTACT_TO_EMAIL` | no | Where submissions are delivered. |

\* With no Gmail credentials set, submissions are validated and logged but not
emailed. That is the intended local-dev mode; in production, set them.
| `ALLOWED_ORIGINS` | yes | Comma-separated origins permitted to POST. Any `localhost`/`127.0.0.1` origin is accepted automatically outside production, so the dev port does not matter. |
| `TURNSTILE_SECRET_KEY` | **yes** | Cloudflare Turnstile secret. **Fails closed** — if it is unset, every submission is rejected with 503 rather than silently skipping bot protection. |
| `VITE_TURNSTILE_SITE_KEY` | no | Overrides the site key baked into `src/lib/turnstile.js`. The site key is public; it ships in the page by design. |
| `VITE_GOOGLE_MAPS_EMBED_KEY` | no | Switches the contact-page map to the official Maps Embed API. Without it the keyless embed URL is used, which works fine and needs no Google Cloud billing. |

Generate the token secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Email delivery

Notifications are sent over Gmail SMTP ([`api/_lib/mailer.js`](api/_lib/mailer.js)).
With no credentials configured, submissions are logged instead — the local-dev
mode.

### Gmail SMTP

Sends over `smtp.gmail.com:465` (implicit TLS) using an app password. The
transport is built per invocation rather than pooled, because a serverless
instance is frozen between requests and a held-open socket would be dead by the
next one.

To create the app password:

1. Turn on **2-Step Verification** for the Google account — app passwords do not
   exist without it.
2. Go to <https://myaccount.google.com/apppasswords>, create one, and copy the
   16 characters.
3. Set `GMAIL_USER` and `GMAIL_APP_PASSWORD`.

Gmail rewrites `From` to the authenticated account whatever you ask for, so the
notification is sent as `GMAIL_USER` with `Reply-To` set to the enquirer — hit
reply and it goes straight back to them.

**Limits.** A free Gmail account allows roughly 500 messages a day (about 2,000
on Workspace). That is ample for a contact form.

**Caveat for serverless.** Google frequently blocks app-password SMTP logins
coming from cloud data-centre IPs, which is what Vercel functions run on. If you
see intermittent `534` errors in production that you cannot reproduce locally,
that is why — a transactional email API (Resend, Postmark, SendGrid) avoids it
because it is plain HTTPS with no login heuristics.

### If delivery fails

If the send fails, the API does **not** pretend the message was received. It
returns 502 with the reference number and a direct email address, and writes the
whole submission to the function logs so the enquiry is recoverable rather than
silently lost. Search the logs for `MAIL SEND FAILED` to retrieve one.

### Troubleshooting "Could not verify the form"

That message means the browser could not get a token from `/api/form-token`.
It is almost always an environment problem rather than a form bug:

- **The API is not being served.** Historically this happened when `npm run dev`
  served only the UI. The dev plugin now mounts `api/` in-process, so check the
  startup banner lists `api: /api/contact, /api/form-token`.
- **The origin is not allowed.** The API answers 403 if `Origin` is not in
  `ALLOWED_ORIGINS`. Localhost is exempt outside production.
- **`FORM_TOKEN_SECRET` changed between issuing and submitting**, which
  invalidates tokens already in a visitor's open tab. Reloading fixes it.

The form now distinguishes "we could not reach the server" from "the server
turned us down", because telling someone to reload when the API is down does
not help them.

### Troubleshooting `534 5.7.14` from Gmail

`EAUTH / 534-5.7.14 … Please log in via your web browser` means Google rejected
the credential, not that the code is wrong. Usual causes:

- The app password was revoked, or regenerated and not updated here.
- 2-Step Verification was switched off, which invalidates **every** existing app
  password for that account.
- The value is the account password rather than an app password.
- The account is flagged and needs an interactive web sign-in to clear.

Fix it by signing in to the account in a browser, confirming 2-Step Verification
is on, then generating a fresh app password.

---

## Cloudflare Turnstile

All three forms carry a Turnstile widget ([`src/components/Turnstile.jsx`](src/components/Turnstile.jsx)),
verified server-side in [`api/_lib/turnstile.js`](api/_lib/turnstile.js).

- The widget follows the site's light/dark toggle and is rebuilt when it changes.
- Each form passes a distinct `action` (`contact-form`, `img-form`, `careers-form`),
  which shows up in Turnstile analytics so you can see which form gets hit.
- Tokens are single-use. After any rejected submission the widget is reset
  automatically, otherwise the retry would fail as a duplicate.
- The API script loads on demand, so pages without a form never fetch it.

### Add your hostnames

In the Cloudflare dashboard, under **Turnstile → your widget → Settings**, the
hostname list must include every origin the widget renders on:

- your production domain (e.g. `nexoratechsolutions.com`, `www.nexoratechsolutions.com`)
- `localhost` — **required for local development**, otherwise the widget shows
  *"Unable to connect to website"* on `localhost` and `127.0.0.1`
- your `*.vercel.app` preview domain, if you use preview deployments

### CSP

`vercel.json` already allows Turnstile: `challenges.cloudflare.com` is permitted
in `script-src`, `connect-src` and `frame-src`. If you tighten the CSP, keep all
three or the challenge iframe is blocked.

### Testing without solving a challenge

Cloudflare publishes keys that always give a fixed outcome:

| Site key | Behaviour |
| --- | --- |
| `1x00000000000000000000AA` | always passes, visible |
| `2x00000000000000000000AB` | always blocks |
| `3x00000000000000000000FF` | forces an interactive challenge |

| Secret key | Behaviour |
| --- | --- |
| `1x0000000000000000000000000000000AA` | always passes |
| `2x0000000000000000000000000000000AA` | always fails |

---

## Deploying to Vercel

1. Push the repository to GitHub/GitLab and import it in Vercel — it detects
   Vite and uses `vercel.json` as-is. Or run `deploy.bat` and pick option 2.
2. Add the environment variables above under **Settings → Environment Variables**.
3. Add your domain and set `ALLOWED_ORIGINS` to match it exactly.
4. Wire up email: set `GMAIL_USER`, `GMAIL_APP_PASSWORD` and `CONTACT_TO_EMAIL`,
   then submit a test form and confirm it arrives.

### Before going live

- [ ] Contact details in `src/data/site.js` are live: office at
      11535 Park Woods Circle, Suite B, Alpharetta, GA 30005,
      phone +1 (678) 925-8885, email `minchu@nexoratechsolutionsllc.com`.
- [ ] **Domain mismatch:** the contact email is on `nexoratechsolutionsllc.com`,
      but canonical URLs, the sitemap and `ALLOWED_ORIGINS` still point at
      `nexoratechsolutions.com`. Decide which is the live domain and make them
      match, or form submissions will be blocked by the origin check.
- [ ] Replace the `https://www.nexoratechsolutions.com` origin in
      `src/lib/seo.js`, `public/sitemap.xml`, `public/robots.txt` and
      `index.html`.
- [ ] Set `FORM_TOKEN_SECRET`, `ALLOWED_ORIGINS` and `TURNSTILE_SECRET_KEY`.
- [ ] Add your production domain **and** `localhost` to the Turnstile widget's
      hostname allowlist in the Cloudflare dashboard.
- [ ] Rotate the Turnstile secret key if it has ever been shared in plain text
      (chat, email, a screenshot). The site key is public and does not matter.
- [ ] Have counsel review `/privacy` and `/terms` — they are a solid starting
      draft, not legal advice, and the governing-law clause names Delaware as a
      placeholder.
- [ ] Confirm the team bios and the statistics on `/ai-solutions`, which are
      illustrative figures carried over from the source design.

---

## Theme

The site ships **dark by default**, regardless of the visitor's OS setting. The
toggle in the header switches to light and that choice is remembered in
`localStorage`, overriding the default on later visits.

Two places must agree on this, or the page flashes the wrong theme before React
mounts: [`public/theme-boot.js`](public/theme-boot.js), which runs before first
paint, and [`src/hooks/useTheme.js`](src/hooks/useTheme.js). Change the default
in both.

---

## Contact details and the office map

Everything lives in `COMPANY` in [`src/data/site.js`](src/data/site.js) — the
address is structured rather than a single string, so the rendered block and
the `PostalAddress` JSON-LD cannot drift apart.

The contact page embeds a Google Map of the office. It is `loading="lazy"`, so
opening the page contacts nobody until the visitor scrolls to it. `frame-src` in
`vercel.json` permits `www.google.com` and `maps.google.com`; the keyless embed
URL redirects from one to the other, so both are needed.

**Privacy note.** The map and Turnstile are the only third-party embeds on the
site, and both are disclosed in `/privacy`. Once the map loads, Google receives
the visitor's IP and may set cookies. If you need consent-before-load for EU
visitors, switch the iframe to render only after a click — the address and
"Get directions" link already stand on their own without it.

---

## Accessibility and motion

- Skip link, focus-visible rings throughout, and focus moved to `<main>` on
  navigation.
- The mobile drawer traps focus, closes on `Escape`, and restores focus to the
  toggle.
- Every form field has a real `<label>`, `aria-invalid` and `aria-describedby`;
  errors are announced with `role="alert"`.
- All motion sits behind `prefers-reduced-motion`. Headline and counter
  animations carry completion guards, so text and numbers can never be stuck
  invisible or at zero if an animation does not run.
- The FAQ is built on native `<details>`, so it works without JavaScript.

---

## Notes

- Animation is CSS and `requestAnimationFrame` only — no animation library — to
  keep the bundle small. Total first load is roughly 75 KB gzipped.
- Routes are code-split; only the home page ships in the initial chunk.
- `shared/formSchemas.js` is deliberately outside `src/` so the browser bundle
  and the serverless function import the exact same validation rules.
