import Reveal from '../../components/Reveal'
import { ChipRow, CtaBand, PageHero, SectionHead } from '../../components/Blocks'
import { IconByName } from '../../components/Icons'
import { industries, phases, services } from '../../data/technical'

export default function Services() {
  const stacks = phases.filter((p) => p.chips)

  return (
    <>
      <PageHero
        eyebrow="What we do"
        title={<>Capabilities that cover the <em>full</em> lifecycle.</>}
        lede="From first architecture sketch to scaled production system, Nexora brings one accountable team across every discipline involved."
      />

      {/* ── Six services ── */}
      <section>
        <div className="wrap">
          <SectionHead
            eyebrow="Core capabilities"
            title="Everything under one roof."
            lede="No hand-offs to unknown vendors — one team owns the delivery from discovery through production."
          />
          <Reveal effect="flip" stagger className="services-grid">
            {services.map((s, i) => (
              <article className="card service-card" key={s.title}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="service-icon">
                    <IconByName name={s.icon} size={20} />
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', color: 'var(--ink-faint)', letterSpacing: '.08em' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h2 className="h3">{s.title}</h2>
                <p>{s.text}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Stack ── */}
      <section className="alt-band">
        <div className="wrap">
          <SectionHead
            eyebrow="Tools & platforms"
            title="A stack chosen for the problem, not the other way round."
            lede="The languages, clouds, pipelines and test tooling our teams deliver with every day."
          />
          <Reveal stagger className="stack-grid">
            {stacks.map((p) => (
              <div className="card stack-card" key={p.chipsLabel}>
                <h3>{p.chipsLabel}</h3>
                <ChipRow items={p.chips} />
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Industries ── */}
      <section>
        <div className="wrap">
          <SectionHead
            eyebrow="Industries"
            title="Where our work lands."
            lede="We've shipped across five verticals where the margin for error is low and the stakes are real."
          />
          <Reveal effect="zoom" stagger className="industry-grid">
            {industries.map((i) => (
              <div className="industry-tile" key={i.title}>
                <b>{i.title}</b>
                <span>{i.text}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand practice="technical" />
    </>
  )
}
