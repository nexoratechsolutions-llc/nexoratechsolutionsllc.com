import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { SERVICES, IMPACT_CELLS } from '../data/site'
import { PageHero, SectionHead, GlowCard, MagneticLink } from '../components/Primitives'
import { CTABand } from '../components/Sections'
import { Icon } from '../components/Icons'

const SERVICES_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Nexora TechSolutions capabilities',
  itemListElement: SERVICES.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: { '@type': 'Service', name: s.title, description: s.body },
  })),
}

export default function Services() {
  useSeo({
    title: 'Services',
    description:
      'Software development, quality assurance, DevOps and cloud, AI and automation, business analysis and project management, training and staffing.',
    path: '/services',
    jsonLd: SERVICES_LD,
  })

  return (
    <>
      <PageHero
        crumb="Services"
        eyebrow="What we do"
        title="Capabilities that cover the full lifecycle."
        emphasis={['lifecycle']}
        lede="From first architecture sketch to scaled production system, Nexora brings one accountable team across every discipline involved — no handoffs between vendors who have never met."
      />

      <section>
        <div className="wrap">
          <div className="services-grid reveal">
            {SERVICES.map((service) => (
              <GlowCard className="service-card" key={service.slug}>
                <div className="service-icon">{Icon[service.icon](20)}</div>
                <h3>{service.title}</h3>
                <p>{service.body}</p>
                <div className="card-foot">
                  <a className="link-arrow" href={`#${service.slug}`}>
                    What this includes {Icon.arrow(13)}
                  </a>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <SectionHead
            eyebrow="In detail"
            title="What each capability actually covers."
            lede="The short version above is the brochure. This is what shows up in the statement of work."
          />

          {SERVICES.map((service) => (
            <div className="process-block reveal" id={service.slug} key={service.slug}>
              <div className="ph">
                <span className="tag">{service.title}</span>
                <h3>{service.title}</h3>
                <span className="service-icon" style={{ marginTop: 6 }}>
                  {Icon[service.icon](20)}
                </span>
              </div>
              <div>
                <ul className="body-list">
                  {service.detail.map((line, i) => (
                    <li key={i}>
                      <p>{line}</p>
                    </li>
                  ))}
                </ul>
                <p className="chip-label">Typical stack</p>
                <div className="chip-row">
                  {service.stack.map((tech) => (
                    <span className="chip" key={tech}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="impact">
        <div className="wrap">
          <SectionHead
            eyebrow="Agile + DevOps synergy"
            title="Delivery speed and quality are not a trade."
            lede="Agile methodology and DevOps infrastructure run together, so release cadence goes up while operational risk goes down."
          />
          <div className="impact-grid reveal">
            {IMPACT_CELLS.map((cell) => (
              <div className="impact-cell" key={cell.title}>
                <h4>{cell.title}</h4>
                <p>{cell.body}</p>
              </div>
            ))}
          </div>
          <div className="hero-actions reveal" style={{ marginTop: 32 }}>
            <MagneticLink to="/contact" className="btn btn-primary">
              Scope an engagement
            </MagneticLink>
            <Link className="btn btn-ghost" to="/process">
              See the delivery cycle
            </Link>
          </div>
        </div>
      </section>

      <CTABand
        title="Not sure which of these you need?"
        body="That is a normal place to start. Describe the problem and we will tell you which capability it actually belongs to."
        secondary={{ to: '/ai-solutions', label: 'See AI solutions' }}
      />
    </>
  )
}
