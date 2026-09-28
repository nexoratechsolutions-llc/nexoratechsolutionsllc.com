# Nexora TechSolutions LLC — website

React 18 + Vite 6 site for both practices — **Technical** (Nexora TechSolutions) and **Medical** (Nexora Medical) — with light/dark themes. Every route is prerendered to static HTML at build time, and the site deploys to Vercel.

## Commands

On Windows, double-click **`start.bat`**. On first run it installs dependencies, then starts the dev server and opens the browser.

```bash
npm install
npm run dev       # dev server (client-rendered), http://localhost:5173
npm run build     # client build → SSR build → prerender every route into dist/
npm run preview   # serve dist/ locally
```

## Pages

| Path | Page |
| --- | --- |
| `/` | Gateway — choose a practice |
| `/technical` | Technical home |
| `/technical/about` · `/process` · `/services` · `/ai-solutions` · `/consulting` · `/contact` | Technical pages |
| `/medical` | Medical home |
| `/medical/coaching` · `/rotations` · `/research` · `/match` · `/junior-scientist` · `/faq` · `/contact` | Medical pages |
| `/admin` · `/admin/login` | **Admin Portal** — view and manage all form submissions with Supabase |
| anything else | 404 (served with a real 404 status on Vercel) |

The Medical pages re-tint the site green (`data-view="medical"` on `<html>`).

## Where things live

```
src/data/site.js        contact details, address, social links, nav, production URL  ← edit these here
src/data/technical.js   all Technical copy
src/data/medical.js     all Medical copy (programs, FAQ, pricing…)
src/lib/seo.js          per-route title/description, JSON-LD, sitemap, robots
src/pages/…             one file per page
src/components/…        header, footer, loader, shared blocks
src/styles/…            tokens (light/dark/medical), base, components, pages, loader
scripts/prerender.js    writes dist/<route>.html, 404.html, sitemap.xml, robots.txt
scripts/brand/          templates for og-*.png and app icons (node scripts/brand/render.mjs)
```

## Loader

The boot loader (inline in `index.html`, dismissed by `src/main.jsx` after a 1.5 s minimum) and the route loader (`src/components/PageLoader.jsx` + `src/styles/loader.css`) are taken from the `www.nexora.com` project.

## Theme

`public/theme-boot.js` runs before the first paint. It uses the visitor's saved choice, otherwise the OS setting. The header toggle switches themes with a circular View Transition where the browser supports it, and saves the choice.

## SEO

- **Prerendered HTML** for every route: full page content, so crawlers and social previews see it without running JS.
- Per page: `<title>`, meta description, canonical, robots, Open Graph, Twitter card.
- **JSON-LD**: Organization, WebSite, WebPage/AboutPage/ContactPage/FAQPage, BreadcrumbList, plus Service / Course entries (Junior Scientist includes its price).
- `sitemap.xml` and `robots.txt` are generated from `ROUTES` in `src/lib/seo.js`, so they never drift from the real pages.
- Visible breadcrumbs, a single `<h1>` per page, semantic landmarks, and crawlable `<a href>` links in the header and footer.
- Social cards: `public/og-technical.png` and `public/og-medical.png` (1200×630).
- **To add a page:** add its `<Route>` in `src/App.jsx` and an entry in `ROUTES` in `src/lib/seo.js`.

After going live, submit `https://<domain>/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

## Deploy to Vercel

1. Push the repo and import it in Vercel. `vercel.json` sets the framework, build command and output directory.
2. If the live domain is not `https://www.nexoratechsolutionsllc.com`, set `VITE_SITE_URL` (see `.env.example`). Then run `node scripts/brand/render.mjs` so the domain shown on the social cards matches.
3. `cleanUrls` serves `/technical/about` from `technical/about.html`. Unknown paths get `404.html` with a 404 status.

## Contact form (sends email)

The forms post to `/api/contact` (`api/contact.js`). That function sends each submission through Gmail SMTP to the company inbox, with the visitor's address set as Reply-To. Under `npm run dev` and `npm run preview`, `vite-plugins/api-dev.js` runs the same function locally.

Set these **server-only** variables. For local runs, put them in `.env` (gitignored; see `.env.example`). On Vercel, add them under **Settings → Environment Variables**:

| Variable | Value |
| --- | --- |
| `GMAIL_USER` | the Gmail account that sends |
| `GMAIL_APP_PASSWORD` | its 16-character Google app password |
| `CONTACT_TO` | inbox that receives submissions (default `minchu@nexoratechsolutionsllc.com`) |

| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key (**required on Vercel**) |
| `VITE_TURNSTILE_SITE_KEY` | Turnstile site key. It is public and ends up in the page |
| `FORM_TOKEN_SECRET` | signs the anti-CSRF form token (**required on Vercel**; use a long random value) |
| `ALLOWED_ORIGINS` | extra origins allowed to call `/api` cross-origin, comma-separated (the site itself is always allowed) |
| `CONTACT_DRY_RUN` | `1` = test the whole flow locally without sending (ignored on Vercel) |

### Protection

**Signed form token (anti-CSRF).** When the form appears, it fetches a token from `GET /api/form-token`, an HMAC signed with `FORM_TOKEN_SECRET`. The API refuses a submission when the token is:
- missing or forged;
- expired (older than 2 h);
- already used — each token sends at most one message;
- issued less than 3 s before sending. This minimum fill time uses the server's own clock, so it can't be faked.

**Origins.** Same-site requests are always accepted. Origins in `ALLOWED_ORIGINS` also get CORS, including the preflight. Every other origin is refused.

**Cloudflare Turnstile.** A widget sits in each form, and every submission is verified server-side. In the Turnstile dashboard, list every hostname you use: your domain, `*.vercel.app` preview domains, and `localhost`.

**Duplicate submissions.** Five layers stop the same message going out twice:
- a synchronous lock, so a double-click sends one request;
- a submission ID the server remembers, so retries never send twice;
- the same email + message within 1 hour is recognised, in the browser and on the server;
- a 30-second cooldown after each send, which survives a reload;
- "already being sent" detection for concurrent requests.

**Rate limits (server).** Waits are shown to the visitor as a live countdown.

| Limit | Value |
| --- | --- |
| Attempts per IP | 20 per 10 min |
| Sends per IP | 3 per 10 min, 10 per day |
| Sends per email address | 3 per hour |

**Bots.** A hidden honeypot field and a minimum fill time catch simple bots. Only same-origin posts are accepted.

**Safety.** The recipient is fixed on the server, so the endpoint can't be used to send email anywhere else. If sending fails, the form offers a pre-filled email-app link and your phone number.

**Limitation.** The rate limits and duplicate memory live in each serverless instance and reset on a cold start. Turnstile is the hard gate. For limits shared across all instances, add a store such as Upstash Redis / Vercel KV.

## Map

Both contact pages end with a full-width Google Map of the office (`src/components/OfficeMap.jsx`). It uses Google's keyless embed. To use the official Maps Embed API instead, set `VITE_GOOGLE_MAPS_EMBED_KEY`.

## Motion

- **Scroll entrance effects** (`src/components/Reveal.jsx`): `effect` accepts `up`, `down`, `left`, `right`, `zoom`, `flip`, `blur` or `split`. Add `stagger` to animate a grid's children one after another.
- **Headlines** rise in word by word (`WordReveal.jsx`).
- **Stats** count up from zero (`CountUp.jsx`).
- **Timing:** all of these wait until the boot loader lifts.
- **Accessibility:** they are disabled for visitors who prefer reduced motion.
- **SEO:** prerendered HTML always contains the final numbers and text, so search engines see the real figures.

## Admin Portal & Supabase Integration

The site includes a comprehensive, pro-designed Admin Portal at `/admin` (or `/admin/login`).

### Features
- **Form Submissions Storage**: All website contact form submissions automatically send notification emails via Gmail SMTP and save structured records to Supabase (`public.form_submissions`).
- **Live Realtime Sync**: Connects to Supabase Realtime via WebSockets so new inbound submissions appear instantly without page reload.
- **KPI Metrics**: Live counts of Total, New/Unread, In Progress, Contacted/Resolved, Starred, and Email Delivery Rate.
- **Search & Filters**: Search across name, email, phone, topic, and message text; filter by Form category (Medical vs. Technical), status, and starred flag; sort by newest/oldest/alphabetical.
- **Detail Drawer & Notes**: View full customer inquiries, technical metadata, email delivery status, toggle status flags, write internal team notes, and compose instant email replies.
- **Data Export**: 1-click export of filtered or complete submissions to CSV and JSON formats.
- **Security & RLS**: PostgreSQL Row-Level Security allows public visitors only to submit forms (`INSERT`), while restricting data retrieval (`SELECT`), updates (`UPDATE`), and deletions (`DELETE`) strictly to authenticated administrators.
- **Credential Self-Management**: Built-in modal to securely update admin password.

### Admin Credentials
- **Portal URL**: `/admin` or `/admin/login`
- **Default Email**: `admin@nexoratechsolutionsllc.com`
- **Default Password**: `AdminPassword123!@#`

