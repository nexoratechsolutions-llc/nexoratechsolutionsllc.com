import { Mail, Phone } from './Icons'
import { SITE } from '../data/site'

/** Thin contact strip above the header (scrolls away; the header stays). */
export default function UtilityBar() {
  return (
    <div className="utility">
      <div className="wrap utility-inner">
        <div className="u-left">
          <a href={`mailto:${SITE.email}`}>
            <Mail size={14} /> {SITE.email}
          </a>
          <a href={SITE.phoneHref}>
            <Phone size={14} /> {SITE.phone}
          </a>
        </div>
        <div className="u-right">
          {SITE.name} · <b>Two services:</b> Technical and Medical
        </div>
      </div>
    </div>
  )
}
