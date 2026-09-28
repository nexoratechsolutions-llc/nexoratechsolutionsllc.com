import Reveal from '../../components/Reveal'
import CountUp from '../../components/CountUp'
import { CtaBand, PageHero, SectionHead } from '../../components/Blocks'
import { IconByName } from '../../components/Icons'
import { aboutCells, techStats, whyUs } from '../../data/technical'

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About Nexora"
        title={
          <>
            One discipline underneath <em>everything</em> we build.
          </>
        }
        lede="Nexora TechSolutions LLC has been at the forefront of IT innovation since 2026 — specializing in software development, AI‑driven solutions, and business process optimization for organizations that need technology to actually hold up under real operating conditions."
      />

      <section>
        <div className="wrap">
          <SectionHead eyebrow="Who we are" title="Built on decades of enterprise delivery." />
          <Reveal className="about-grid">
            {aboutCells.map((c, i) => (
              <div className="about-cell" key={c.title}>
                <span className="num-badge">{i + 1}</span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="alt-band">
        <div className="wrap">
          <SectionHead eyebrow="By the numbers" title="The shape of the practice." />
          <Reveal effect="zoom" stagger className="big-stats">
            {techStats.map((s) => (
              <div className="big-stat" key={s.label}>
                <b>
                  <CountUp value={s.value} />
                </b>
                <span>{s.label}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section>
        <div className="wrap">
          <SectionHead eyebrow="Why Nexora" title="Reasons clients keep coming back." />
          <Reveal effect="flip" stagger className="why-grid">
            {whyUs.map((w) => (
              <article className="card why-card" key={w.title}>
                <IconByName name={w.icon} size={36} className="why-icon" />
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand practice="technical" />
    </>
  )
}
