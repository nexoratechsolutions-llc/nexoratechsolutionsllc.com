import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { COMPANY } from '../data/site'
import { PageHero } from '../components/Primitives'

const UPDATED = '22 September 2026'

export default function Privacy() {
  useSeo({
    title: 'Privacy Policy',
    description:
      'How Nexora TechSolutions LLC collects, uses, stores and protects the information you submit through this website.',
    path: '/privacy',
  })

  return (
    <>
      <PageHero
        crumb="Privacy"
        eyebrow="Legal"
        title="Privacy Policy"
        lede="What we collect through this website, why, and what we do not do with it."
      />

      <section>
        <div className="wrap">
          <div className="legal reveal">
            <p className="updated">Last updated · {UPDATED}</p>

            <div>
              <h2>1. Who we are</h2>
              <p>
                {COMPANY.legal} (&quot;Nexora&quot;, &quot;we&quot;) operates this website. For any question
                about this policy or the data we hold, write to{' '}
                <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
              </p>
            </div>

            <div>
              <h2>2. What we collect</h2>
              <p>We collect only what you choose to send us through a form on this site:</p>
              <ul>
                <li>
                  <strong>Contact form</strong> — name, email address, optional phone number and company, your
                  area of interest, optional budget and timeline, and your message.
                </li>
                <li>
                  <strong>IMG Pathway assessment request</strong> — name, email address, optional phone number,
                  country of medical school, graduation year, current stage, track requested, optional visa
                  situation, and your message.
                </li>
                <li>
                  <strong>Careers application</strong> — name, email address, optional phone number, the role
                  applied for, an optional portfolio link, and your message.
                </li>
                <li>
                  <strong>Technical data attached to a submission</strong> — the originating IP address and a
                  timestamp, retained with the enquiry for abuse prevention.
                </li>
              </ul>
              <p>
                We do not run advertising trackers, third-party analytics or behavioural profiling on this site,
                and we set no tracking cookies of our own.
              </p>
            </div>

            <div>
              <h2>3. Third-party embeds</h2>
              <p>Two parts of this site load content from other companies:</p>
              <ul>
                <li>
                  <strong>Cloudflare Turnstile</strong> — the &quot;human verification&quot; check on our
                  forms. It is a privacy-focused alternative to a CAPTCHA: Cloudflare states that it does
                  not use it to track visitors across sites or serve advertising. It runs on every page
                  that has a form.
                </li>
                <li>
                  <strong>Google Maps</strong> — the office map on the contact page. It loads only when
                  you scroll to it, so simply opening the page contacts nobody. Once it loads, Google
                  receives your IP address and may set its own cookies, under{' '}
                  <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank">
                    Google&apos;s privacy policy
                  </a>
                  . To avoid it entirely, use the &quot;Get directions&quot; link instead, which only
                  opens Google Maps if you click it.
                </li>
              </ul>
            </div>

            <div>
              <h2>4. Local storage</h2>
              <p>
                The site stores one value in your browser&apos;s local storage: your light or dark theme choice.
                It never leaves your device, is not sent to us, and clearing your browser data removes it.
              </p>
            </div>

            <div>
              <h2>5. Why we process it</h2>
              <ul>
                <li>To answer the enquiry you sent — the reason you submitted the form.</li>
                <li>To assess an IMG Pathway profile and prepare for an assessment call.</li>
                <li>To evaluate a job application.</li>
                <li>
                  To protect the site from spam and abuse, which is our legitimate interest in keeping the
                  service available.
                </li>
              </ul>
              <p>
                We do not sell, rent or trade your details, and we do not add you to a marketing list because
                you contacted us.
              </p>
            </div>

            <div>
              <h2>6. How long we keep it</h2>
              <ul>
                <li>General enquiries — up to 24 months from the last contact.</li>
                <li>IMG Pathway assessment requests — up to 36 months, since a residency journey spans cycles.</li>
                <li>Careers applications — up to 12 months, unless you ask us to keep them on file longer.</li>
                <li>Abuse-prevention logs — up to 90 days.</li>
              </ul>
            </div>

            <div>
              <h2>7. Who else sees it</h2>
              <p>
                Submissions are delivered to Nexora staff by email (Google, as our mail provider), and this
                site is hosted on Vercel. Cloudflare processes the verification check described above. All
                process data on our instruction only. We disclose data otherwise only where the law requires
                it.
              </p>
            </div>

            <div>
              <h2>8. How it is protected</h2>
              <ul>
                <li>All traffic is served over HTTPS with HSTS enabled.</li>
                <li>A strict Content Security Policy restricts what the page is allowed to load or execute.</li>
                <li>Form submissions are rate-limited, origin-checked and validated server-side.</li>
                <li>Access to submitted data is limited to staff who need it to respond.</li>
              </ul>
            </div>

            <div>
              <h2>9. Your rights</h2>
              <p>
                You can ask us for a copy of what we hold about you, ask us to correct it, or ask us to delete
                it. Email <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> and we will respond within 30
                days. If you are in a jurisdiction with a supervisory authority for data protection, you may
                also complain to it.
              </p>
            </div>

            <div>
              <h2>10. Children</h2>
              <p>
                This site is intended for business and professional use. We do not knowingly collect information
                from anyone under 16.
              </p>
            </div>

            <div>
              <h2>11. Changes</h2>
              <p>
                If this policy changes materially, we will update the date at the top and, where the change
                affects data already submitted, contact the people affected.
              </p>
              <p>
                See also our <Link to="/terms">Terms of Service</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
