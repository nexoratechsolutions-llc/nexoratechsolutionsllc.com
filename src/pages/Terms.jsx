import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { COMPANY } from '../data/site'
import { PageHero } from '../components/Primitives'

const UPDATED = '22 September 2026'

export default function Terms() {
  useSeo({
    title: 'Terms of Service',
    description:
      'The terms governing use of the Nexora TechSolutions website and any enquiry submitted through it.',
    path: '/terms',
  })

  return (
    <>
      <PageHero
        crumb="Terms"
        eyebrow="Legal"
        title="Terms of Service"
        lede="The terms that govern use of this website. Engagement contracts are separate and take precedence."
      />

      <section>
        <div className="wrap">
          <div className="legal reveal">
            <p className="updated">Last updated · {UPDATED}</p>

            <div>
              <h2>1. Agreement</h2>
              <p>
                By using this website you agree to these terms. If you do not agree with them, please do not use
                the site. The site is operated by {COMPANY.legal}.
              </p>
            </div>

            <div>
              <h2>2. What this site is</h2>
              <p>
                This website describes Nexora&apos;s services and lets you contact us. Nothing on it is an
                offer, a quote, a contract, or professional advice of any kind. Any engagement between us is
                governed by a separate signed agreement, which takes precedence over anything written here.
              </p>
            </div>

            <div>
              <h2>3. IMG Pathway — no guarantee of outcome</h2>
              <p>
                The Nexora IMG Pathway is an educational and mentorship service. We do not guarantee a residency
                match, an interview invitation, a particular USMLE score, a visa outcome, or a placement at any
                programme. We are not affiliated with the NRMP, the ECFMG, the NBME, ERAS, or any residency
                programme, and we do not represent any of them.
              </p>
              <p>
                Any figures, examples or timelines shown are illustrative. Your outcome depends on factors
                outside our control, including your own preparation.
              </p>
            </div>

            <div>
              <h2>4. Case studies and statistics</h2>
              <p>
                Case studies and percentage figures on this site illustrate the kind of results the described
                work produced in a specific context. They are not a prediction, a benchmark or a commitment for
                any future engagement.
              </p>
            </div>

            <div>
              <h2>5. Acceptable use</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Submit false, misleading or impersonating information through any form.</li>
                <li>Attempt to probe, scan or breach the security of the site or its APIs.</li>
                <li>Use automated tools to scrape, flood or overload the site or its endpoints.</li>
                <li>Use the contact forms to send unsolicited commercial messages.</li>
                <li>Introduce malicious code or attempt to interfere with the service for others.</li>
              </ul>
              <p>We may block access where we reasonably believe any of the above is happening.</p>
            </div>

            <div>
              <h2>6. Intellectual property</h2>
              <p>
                All content on this site — text, design, code, graphics and marks — belongs to {COMPANY.legal}{' '}
                or its licensors, and may not be copied, republished or used commercially without written
                permission. Third-party names and technology marks referenced on this site belong to their
                respective owners and are used descriptively.
              </p>
            </div>

            <div>
              <h2>7. Third-party links</h2>
              <p>
                Where we link to another site, we do not control it and are not responsible for its content or
                its privacy practices.
              </p>
            </div>

            <div>
              <h2>8. Availability</h2>
              <p>
                We aim to keep the site available but do not guarantee uninterrupted access. We may change,
                suspend or withdraw any part of it without notice.
              </p>
            </div>

            <div>
              <h2>9. Limitation of liability</h2>
              <p>
                To the maximum extent permitted by law, Nexora is not liable for indirect, incidental, special
                or consequential loss arising from your use of this website, including lost profits, lost data
                or business interruption. Nothing here limits liability that cannot lawfully be limited.
              </p>
            </div>

            <div>
              <h2>10. Privacy</h2>
              <p>
                Our handling of the information you submit is described in the{' '}
                <Link to="/privacy">Privacy Policy</Link>, which forms part of these terms.
              </p>
            </div>

            <div>
              <h2>11. Governing law</h2>
              <p>
                These terms are governed by the laws of the State of Delaware, United States, without regard to
                conflict-of-law rules. Disputes are subject to the exclusive jurisdiction of its courts.
              </p>
            </div>

            <div>
              <h2>12. Contact</h2>
              <p>
                Questions about these terms: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> or{' '}
                <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
