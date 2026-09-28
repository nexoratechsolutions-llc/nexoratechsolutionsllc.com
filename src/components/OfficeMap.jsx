import Reveal from './Reveal'
import { ArrowRight, MapPin } from './Icons'
import { SITE } from '../data/site'

/**
 * Full-width Google Map of the office with an address card over it.
 * The iframe is lazy-loaded, so nothing is requested from Google until the
 * visitor scrolls near it. In dark mode a CSS filter tones the map down.
 */
export default function OfficeMap() {
  const a = SITE.address
  return (
    <section className="map-band" aria-label="Office location">
      <iframe
        className="map-frame"
        src={a.embedUrl}
        title={`Map showing the Nexora TechSolutions office at ${a.oneLine}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <Reveal effect="right" className="map-card">
        <p className="eyebrow">Visit us</p>
        <h2>Our office</h2>
        <address>
          {a.lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </address>
        <div className="actions">
          <a className="btn btn-primary" href={a.directionsUrl} target="_blank" rel="noopener noreferrer">
            <MapPin size={16} /> Get directions
          </a>
          <a className="btn btn-ghost" href={a.mapsUrl} target="_blank" rel="noopener noreferrer">
            Open in Maps <ArrowRight size={16} className="arrow" />
          </a>
        </div>
      </Reveal>
    </section>
  )
}
