import { Clock, Mail, MapPin, Phone } from './Icons'
import { SITE } from '../data/site'

export function ContactInfo({ intro, subject, children }) {
  const q = subject ? `?subject=${encodeURIComponent(subject)}` : ''
  return (
    <div className="contact-info">
      {intro && <p className="lede">{intro}</p>}
      <a className="info-card" href={`mailto:${SITE.email}${q}`}>
        <span className="ic">
          <Mail size={20} />
        </span>
        <span>
          <small>Email</small>
          <b>{SITE.email}</b>
        </span>
      </a>
      <a className="info-card" href={SITE.phoneHref}>
        <span className="ic">
          <Phone size={20} />
        </span>
        <span>
          <small>Phone</small>
          <b>{SITE.phone}</b>
        </span>
      </a>
      <a className="info-card" href={SITE.address.mapsUrl} target="_blank" rel="noopener noreferrer">
        <span className="ic">
          <MapPin size={20} />
        </span>
        <span>
          <small>Office</small>
          <address>
            {SITE.address.lines.map((line) => (
              <b key={line}>{line}</b>
            ))}
          </address>
          <span className="info-link">Get directions ↗</span>
        </span>
      </a>
      <div className="info-card static">
        <span className="ic">
          <Clock size={20} />
        </span>
        <span>
          <small>What happens next</small>
          <b>We reply by email to arrange a call at a time that suits you.</b>
        </span>
      </div>
      {children}
    </div>
  )
}
