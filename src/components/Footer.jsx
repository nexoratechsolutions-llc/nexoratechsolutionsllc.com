import { Link } from 'react-router-dom'
import BrandMark from './BrandMark'
import SocialLinks from './SocialLinks'
import { Mail, MapPin, Phone } from './Icons'
import { PRACTICES, SITE } from '../data/site'

const year = new Date().getFullYear()

function Copyright() {
  return (
    <span suppressHydrationWarning>
      © {year} {SITE.legalName}. All rights reserved.
    </span>
  )
}

export default function Footer({ practice }) {
  if (!practice) {
    return (
      <footer className="site-footer compact">
        <div className="wrap footer-bottom">
          <span className="footer-legal">
            <Copyright />
            <span className="footer-addr">{SITE.address.oneLine}</span>
          </span>
          <span className="footer-direct">
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <a href={SITE.phoneHref}>{SITE.phone}</a>
            <SocialLinks size={14} className="small" />
          </span>
        </div>
      </footer>
    )
  }

  const tech = PRACTICES.technical
  const med = PRACTICES.medical

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="brand" to="/">
              <BrandMark size={28} ring={false} />
              <span className="brand-word">
                Nex<b>ora</b> TechSolutions
              </span>
            </Link>
            <p>{SITE.legalName} · Technology services and medical education, since {SITE.founded}.</p>
            <div className="footer-contact">
              <a href={SITE.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="footer-address">
                <MapPin size={16} />
                <address>
                  {SITE.address.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </address>
              </a>
              <a href={SITE.phoneHref}>
                <Phone size={16} /> {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`}>
                <Mail size={16} /> {SITE.email}
              </a>
            </div>
            <SocialLinks />
          </div>

          <div className="footer-cols">
            <nav className="footer-col" aria-label="Technical practice">
              <h2>Technical</h2>
              <Link to={tech.base}>Overview</Link>
              {tech.nav.map((n) => (
                <Link key={n.to} to={n.to}>
                  {n.label}
                </Link>
              ))}
              <Link to={tech.cta.to}>Contact</Link>
            </nav>
            <nav className="footer-col" aria-label="Medical practice">
              <h2>Medical</h2>
              <Link to={med.base}>Overview</Link>
              {med.nav.map((n) => (
                <Link key={n.to} to={n.to}>
                  {n.label === 'Coaching' ? 'USMLE Coaching' : n.label}
                </Link>
              ))}
              <Link to="/medical/faq">FAQ</Link>
              <Link to={med.cta.to}>Book a call</Link>
            </nav>
            <nav className="footer-col" aria-label="More">
              <h2>Nexora</h2>
              <Link to="/">Choose a practice</Link>
              <Link to={practice === 'medical' ? tech.base : med.base}>
                {practice === 'medical' ? 'Nexora TechSolutions' : 'Nexora Medical'}
              </Link>
              <a href="/sitemap.xml">Sitemap</a>
            </nav>
          </div>
        </div>
        <div className="footer-bottom">
          <Copyright />
          <span>{SITE.tagline}</span>
        </div>
      </div>
    </footer>
  )
}
