import { Link } from 'react-router-dom'
import { COMPANY } from '../data/site'
import { Logo } from './Primitives'
import { Icon } from './Icons'

const COLUMNS = [
  {
    heading: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/process', label: 'Process' },
      { to: '/careers', label: 'Careers' },
    ],
  },
  {
    heading: 'Capabilities',
    links: [
      { to: '/services', label: 'Services' },
      { to: '/ai-solutions', label: 'AI Solutions' },
      { to: '/consulting', label: 'Consulting' },
      { to: '/img-pathway', label: 'IMG Pathway' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { to: '/privacy', label: 'Privacy Policy' },
      { to: '/terms', label: 'Terms of Service' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="brand" to="/" aria-label="Nexora TechSolutions — home">
              <Logo size={26} />
              <span className="brand-word" style={{ marginLeft: '-6px' }}>
                &nbsp;TechSolutions
              </span>
            </Link>
            <p>
              {COMPANY.legal} · Pioneering software, AI and delivery solutions since {COMPANY.founded}.
            </p>
            <address className="postal">
              {COMPANY.address.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
            <div className="social-row">
              <a href="https://www.linkedin.com" aria-label="Nexora on LinkedIn" rel="noopener noreferrer nofollow" target="_blank">
                {Icon.linkedin(15)}
              </a>
              <a href="https://x.com" aria-label="Nexora on X" rel="noopener noreferrer nofollow" target="_blank">
                {Icon.x(14)}
              </a>
              <a href="https://github.com" aria-label="Nexora on GitHub" rel="noopener noreferrer nofollow" target="_blank">
                {Icon.github(15)}
              </a>
            </div>
          </div>

          <div className="footer-cols">
            {COLUMNS.map((col) => (
              <div className="footer-col" key={col.heading}>
                <h5>{col.heading}</h5>
                {col.links.map((l) => (
                  <Link key={l.to} to={l.to}>
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}

            <div className="footer-col">
              <h5>Connect</h5>
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
              <Link to="/contact">Start a conversation</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {COMPANY.legal}. All rights reserved.
          </span>
          <span>{COMPANY.tagline}</span>
        </div>
      </div>
    </footer>
  )
}
