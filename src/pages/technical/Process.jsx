import Reveal from '../../components/Reveal'
import { ChipRow, CtaBand, PageHero, SectionHead, Stepper } from '../../components/Blocks'
import { agileDevops, deliverySteps, phases } from '../../data/technical'

export default function Process() {
  return (
    <>
      <PageHero
        eyebrow="How we work"
        title={<>An iterative delivery cycle, built for <em>adaptability</em>.</>}
        lede="Every engagement moves through five connected phases. Each one closes with a feedback loop back to the client, so the roadmap stays accurate as priorities evolve — not just at kickoff."
      />

      {/* ── Five-phase stepper overview ── */}
      <section>
        <div className="wrap">
          <SectionHead
            eyebrow="At a glance"
            title="Five phases, one continuous loop."
            lede="Each phase has a named output and a client review before the next begins."
          />
          <Stepper steps={deliverySteps} />
        </div>
      </section>

      {/* ── Phase deep-dives ── */}
      <section className="alt-band">
        <div className="wrap">
          <SectionHead
            eyebrow="Deep dive"
            title="What happens inside each phase."
          />
          {phases.map((ph) => (
            <Reveal effect="split" stagger className="process-block" key={ph.tag}>
              <div className="ph">
                <span className="tag">{ph.tag}</span>
                <h2>{ph.title}</h2>
              </div>
              <div>
                <ul className="body-list">
                  {ph.items.map((it) => (
                    <li key={it.h}>
                      <h3>{it.h}</h3>
                      <p>{it.p}</p>
                    </li>
                  ))}
                </ul>
                {ph.chips && <ChipRow label={ph.chipsLabel} items={ph.chips} />}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Agile + DevOps ── */}
      <section>
        <div className="wrap">
          <SectionHead
            eyebrow="Agile + DevOps synergy"
            title="A high-velocity environment, without sacrificing quality."
            lede="We integrate Agile methodology with DevOps infrastructure so time-to-market drops without software quality following it down."
          />
          <Reveal effect="zoom" stagger className="impact-grid">
            {agileDevops.map((c) => (
              <div className="impact-cell" key={c.title}>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand practice="technical" />
    </>
  )
}
