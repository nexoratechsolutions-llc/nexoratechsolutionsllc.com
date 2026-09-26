import { Link } from 'react-router-dom'
import { MARQUEE_ITEMS, COMPANY } from '../data/site'
import { MagneticLink, Aurora } from './Primitives'

/** Infinite technology ticker. The list is duplicated so the loop is seamless. */
export function Marquee() {
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span className="marquee-item" key={`${item}-${i}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Closing call-to-action band used at the foot of every page. */
export function CTABand({
  title = "Let's transform your business together.",
  body = 'Tell us what you are trying to build, change or fix. We will tell you honestly what it would take.',
  primary = { to: '/contact', label: 'Start a conversation' },
  secondary,
}) {
  return (
    <section className="cta">
      <Aurora />
      <div className="wrap">
        <div className="cta-box reveal">
          <div>
            <h2>{title}</h2>
            <p>{body}</p>
          </div>
          <div className="hero-actions">
            <MagneticLink to={primary.to} className="btn btn-primary btn-lg">
              {primary.label}
            </MagneticLink>
            {secondary ? (
              <Link className="btn btn-ghost btn-lg" to={secondary.to}>
                {secondary.label}
              </Link>
            ) : (
              <a className="btn btn-ghost btn-lg" href={`mailto:${COMPANY.email}`}>
                {COMPANY.email}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Accessible FAQ built on native <details>, so it works without JavaScript. */
export function FaqList({ items }) {
  return (
    <div className="faq-list reveal">
      {items.map((item) => (
        <details key={item.q}>
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  )
}

/** Horizontal numbered stepper. */
export function Stepper({ steps }) {
  return (
    <div className="stepper reveal">
      {steps.map((s) => (
        <div className="step" key={s.n}>
          <div className="step-num">{s.n}</div>
          <h4>{s.title}</h4>
          <p>{s.body}</p>
        </div>
      ))}
    </div>
  )
}
