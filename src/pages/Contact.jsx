import { Link, useSearchParams } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { COMPANY } from '../data/site'
import { INTEREST_OPTIONS } from '../../shared/formSchemas'
import { PageHero, Reveal } from '../components/Primitives'
import ContactForm from '../components/forms/ContactForm'
import { Icon } from '../components/Icons'

const CONTACT_LD = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Nexora TechSolutions',
  mainEntity: {
    '@type': 'Organization',
    name: COMPANY.legal,
    email: COMPANY.email,
    telephone: '+1-678-925-8885',
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${COMPANY.address.street}, ${COMPANY.address.unit}`,
      addressLocality: COMPANY.address.city,
      addressRegion: COMPANY.address.stateCode,
      postalCode: COMPANY.address.zip,
      addressCountry: COMPANY.address.countryCode,
    },
  },
}

export default function Contact() {
  const [params] = useSearchParams()

  // `?interest=AI%20%26%20automation` pre-selects the dropdown from a CTA.
  const requested = params.get('interest')
  const defaultInterest = INTEREST_OPTIONS.includes(requested) ? requested : undefined

  useSeo({
    title: 'Contact',
    description:
      'Start a conversation with Nexora TechSolutions. Tell us what you are trying to build, change or fix — we reply within one business day.',
    path: '/contact',
    jsonLd: CONTACT_LD,
  })

  return (
    <>
      <PageHero
        crumb="Contact"
        eyebrow="Start a conversation"
        title="Tell us what you are trying to build, change or fix."
        emphasis={['build']}
        lede="Every enquiry is read by someone who could work on it. Expect a reply within one business day — and an honest answer about whether we are the right team."
      />

      <section>
        <div className="wrap">
          <div className="contact-grid">
            <Reveal variant="reveal-left" className="contact-aside">
              <div className="contact-method">
                <span className="ci">{Icon.mail(18)}</span>
                <div>
                  <h4>Email</h4>
                  <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                </div>
              </div>

              <div className="contact-method">
                <span className="ci">{Icon.phone(18)}</span>
                <div>
                  <h4>Phone</h4>
                  <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
                </div>
              </div>

              <div className="contact-method">
                <span className="ci">{Icon.pin(18)}</span>
                <div>
                  <h4>Office</h4>
                  <address className="postal">
                    {COMPANY.address.lines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </address>
                  <a
                    className="link-arrow"
                    href={COMPANY.address.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Maps {Icon.arrow(13)}
                  </a>
                </div>
              </div>

              <div className="contact-method">
                <span className="ci">{Icon.calendar(18)}</span>
                <div>
                  <h4>Hours</h4>
                  <p>{COMPANY.hours}</p>
                </div>
              </div>

              <div className="split-panel" style={{ marginTop: 6 }}>
                <p className="badge-pill" style={{ marginBottom: 6 }}>
                  <span className="live-dot" aria-hidden /> What happens next
                </p>
                <dl style={{ margin: 0 }}>
                  <div className="kv-row">
                    <dt>Step 1</dt>
                    <dd>We read it properly</dd>
                  </div>
                  <div className="kv-row">
                    <dt>Step 2</dt>
                    <dd>Reply within 1 business day</dd>
                  </div>
                  <div className="kv-row">
                    <dt>Step 3</dt>
                    <dd>A 30-minute discovery call</dd>
                  </div>
                  <div className="kv-row">
                    <dt>Step 4</dt>
                    <dd>Written scope, or an honest no</dd>
                  </div>
                </dl>
              </div>
            </Reveal>

            <Reveal variant="reveal-right">
              <ContactForm defaultInterest={defaultInterest} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Office map ---------- */}
      <section className="impact" style={{"padding":"0px"}} aria-labelledby="office-heading">
            <iframe style={{"height":"450px", "width":"100%"}}
              src={COMPANY.address.embedUrl}
              title={`Map showing the Nexora TechSolutions office at ${COMPANY.address.oneLine}`}
              // Deferred until the visitor scrolls here, so the page's initial
              // load makes no request to Google.
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
      </section>
    </>
  )
}
