import { useSeo, ORGANIZATION_LD } from '../lib/seo'
import { ABOUT_CELLS, VALUES, TIMELINE, TEAM, HERO_STATS, WHY_CARDS } from '../data/site'
import { PageHero, SectionHead, CountStat, Reveal } from '../components/Primitives'
import { CTABand } from '../components/Sections'
import { Icon } from '../components/Icons'

export default function About() {
  useSeo({
    title: 'About',
    description:
      'Nexora TechSolutions LLC — founded 2026. A single practice covering software development, AI-driven solutions, cloud delivery and business process optimization.',
    path: '/about',
    jsonLd: ORGANIZATION_LD,
  })

  return (
    <>
      <PageHero
        crumb="About"
        eyebrow="About Nexora"
        title="One discipline underneath everything we build."
        emphasis={['discipline']}
        lede="Nexora TechSolutions LLC has been at the forefront of IT innovation since 2026 — specializing in software development, AI-driven solutions, and business process optimization for organizations that need technology to actually hold up under real operating conditions."
      >
        <div className="stat-row">
          {HERO_STATS.map((s) => (
            <CountStat key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </PageHero>

      <section>
        <div className="wrap">
          <SectionHead eyebrow="The short version" title="Four things worth knowing." />
          <div className="about-grid reveal">
            {ABOUT_CELLS.map((cell) => (
              <div className="about-cell" key={cell.n}>
                <span className="num-badge">{cell.n}</span>
                <h3>{cell.title}</h3>
                <p>{cell.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="impact">
        <div className="wrap">
          <SectionHead
            eyebrow="How we operate"
            title="The operating model, stated plainly."
            lede="These four commitments are what every engagement is measured against — including the ones that are going well."
          />
          <div className="pillar-grid reveal">
            {VALUES.map((value) => (
              <div className="pillar" key={value.title}>
                <span className="pi">{Icon[value.icon](20)}</span>
                <div>
                  <h4>{value.title}</h4>
                  <p>{value.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="split">
            <Reveal variant="reveal-left" className="split-copy">
              <p className="eyebrow">Our story</p>
              <h2>Built by people who have run this before.</h2>
              <p className="lede">
                Nexora is new as a company and not new as a team. The leadership group has spent decades
                delivering in regulated, high-stakes environments — where a failed release is not a bad sprint,
                it is an incident report.
              </p>
              <p className="lede">
                That history is the reason the delivery cycle looks the way it does: assessment before advice,
                checkpoints with dates, and one person accountable when something slips.
              </p>
            </Reveal>

            <Reveal variant="reveal-right">
              <div className="timeline">
                {TIMELINE.map((item) => (
                  <div className="tl-item" key={item.year}>
                    <span className="tl-year">{item.year}</span>
                    <h4>{item.title}</h4>
                    <p>{item.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <SectionHead
            eyebrow="Leadership"
            title="The people accountable for the work."
            lede="Small by design. The people who scope an engagement are the people who stay on it."
          />
          <div className="team-grid reveal">
            {TEAM.map((person) => (
              <article className="team-card" key={person.name}>
                <div className="avatar" style={{ background: person.bg }}>
                  <span aria-hidden>{person.initial}</span>
                </div>
                <div className="team-body">
                  <h3>{person.name}</h3>
                  <p className="team-role">{person.role}</p>
                  <p className="team-cred">{person.cred}</p>
                  <p className="bio">{person.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="impact">
        <div className="wrap">
          <SectionHead eyebrow="Why Nexora" title="Reasons clients keep coming back." />
          <div className="why-grid reveal">
            {WHY_CARDS.map((card) => (
              <div className="why-card" key={card.title}>
                <span className="why-icon">{Icon[card.icon](30)}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title="Want the longer conversation?"
        body="Tell us what you are working on. We will tell you honestly whether we are the right team for it."
        secondary={{ to: '/process', label: 'See our process' }}
      />
    </>
  )
}
