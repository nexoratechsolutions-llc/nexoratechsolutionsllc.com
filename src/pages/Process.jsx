import { useSeo } from '../lib/seo'
import { PROCESS_STEPS, PROCESS_BLOCKS, IMPACT_CELLS } from '../data/site'
import { PageHero, SectionHead, Reveal } from '../components/Primitives'
import { CTABand, Stepper } from '../components/Sections'

const PROCESS_LD = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Nexora five-phase delivery cycle',
  description:
    'Discovery, Solution Design, Development, Quality Assurance and Deployment — each phase closing with a feedback loop back to the client.',
  step: PROCESS_STEPS.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.title,
    text: s.body,
  })),
}

export default function Process() {
  useSeo({
    title: 'Process',
    description:
      'The Nexora five-phase delivery cycle: Discovery, Solution Design, Development, Quality Assurance and Deployment — with a feedback loop at every phase boundary.',
    path: '/process',
    jsonLd: PROCESS_LD,
  })

  return (
    <>
      <PageHero
        crumb="Process"
        eyebrow="How we work"
        title="An iterative delivery cycle, built for adaptability."
        emphasis={['adaptability']}
        lede="Every engagement moves through five connected phases. Each one closes with a feedback loop back to the client, so the roadmap stays accurate as priorities evolve — not just at kickoff."
      />

      <section>
        <div className="wrap">
          <Stepper steps={PROCESS_STEPS} />

          {PROCESS_BLOCKS.map((block) => (
            <div className="process-block reveal" key={block.tag}>
              <div className="ph">
                <span className="tag">{block.tag}</span>
                <h3>{block.title}</h3>
              </div>
              <div>
                <ul className="body-list">
                  {block.items.map((item) => (
                    <li key={item.h}>
                      <h5>{item.h}</h5>
                      <p>{item.p}</p>
                    </li>
                  ))}
                </ul>
                {block.chips && (
                  <>
                    <p className="chip-label">{block.chipLabel}</p>
                    <div className="chip-row">
                      {block.chips.map((chip) => (
                        <span className="chip" key={chip}>
                          {chip}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="impact">
        <div className="wrap">
          <SectionHead
            eyebrow="Agile + DevOps synergy"
            title="A high-velocity environment, without sacrificing quality."
            lede="We integrate Agile methodology with DevOps infrastructure so time-to-market drops without software quality following it down."
          />
          <div className="impact-grid reveal">
            {IMPACT_CELLS.map((cell) => (
              <div className="impact-cell" key={cell.title}>
                <h4>{cell.title}</h4>
                <p>{cell.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <SectionHead
            eyebrow="What you get, per phase"
            title="Deliverables, not status updates."
            lede="Each phase closes with something you can read, review and disagree with — which is the point."
          />
          <div className="split">
            <Reveal variant="reveal-left" className="split-panel">
              <dl style={{ margin: 0 }}>
                <div className="kv-row">
                  <dt>Discovery</dt>
                  <dd>Requirements, backlog, feasibility note</dd>
                </div>
                <div className="kv-row">
                  <dt>Design</dt>
                  <dd>Architecture, wireframes, sprint plan</dd>
                </div>
                <div className="kv-row">
                  <dt>Development</dt>
                  <dd>Working increments, sprint reviews</dd>
                </div>
                <div className="kv-row">
                  <dt>Testing</dt>
                  <dd>Coverage report, gated pipeline</dd>
                </div>
                <div className="kv-row">
                  <dt>Deployment</dt>
                  <dd>Runbook, training, monitoring</dd>
                </div>
              </dl>
            </Reveal>

            <Reveal variant="reveal-right" className="split-copy">
              <h3>Feedback loops are scheduled, not requested.</h3>
              <p className="lede">
                The failure mode in delivery is not that nobody noticed a problem. It is that the person who
                noticed had no scheduled moment to raise it, so it surfaced at the retrospective instead.
              </p>
              <p className="lede">
                Each phase boundary is a decision point with a date on it: what we learned, what changed, and
                whether the next phase starts as planned.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <CTABand
        title="Start with a discovery conversation."
        body="The first phase is understanding your constraints. That starts with a call, not a proposal."
        secondary={{ to: '/services', label: 'Browse capabilities' }}
      />
    </>
  )
}
