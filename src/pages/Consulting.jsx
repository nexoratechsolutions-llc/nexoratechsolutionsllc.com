import { useSeo } from '../lib/seo'
import { CONSULT_COLS, VALUES } from '../data/site'
import { PageHero, SectionHead, Reveal } from '../components/Primitives'
import { CTABand } from '../components/Sections'
import { Icon } from '../components/Icons'

export default function Consulting() {
  useSeo({
    title: 'Consulting & Training',
    description:
      'Business analysis, project and product management, certified SAFe training, and end-to-end staffing — building organizational capability that outlasts the engagement.',
    path: '/consulting',
  })

  return (
    <>
      <PageHero
        crumb="Consulting"
        eyebrow="Consulting & Training"
        title="Strategy, delivery leadership, and the people to run it."
        emphasis={['leadership']}
        lede="Beyond engineering, Nexora builds organizational capability — in business analysis, program leadership, and the workforce to sustain it."
      />

      <section>
        <div className="wrap">
          <div className="consult-grid reveal">
            {CONSULT_COLS.map((col) => (
              <div className="consult-col" key={col.tag}>
                <span className="tag">{col.tag}</span>
                <h3>{col.title}</h3>
                <p>{col.body}</p>
                {col.note && <p className="muted-note">{col.note}</p>}
                {col.extra && <p>{col.extra}</p>}
                {col.certs && (
                  <ul className="cert-list">
                    {col.certs.map((cert) => (
                      <li key={cert}>{cert}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="impact">
        <div className="wrap">
          <SectionHead
            eyebrow="Training that transfers"
            title="Capability you keep after we leave."
            lede="Training built around your stack and your backlog, not a generic curriculum delivered from slides."
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
              <p className="eyebrow">Engagement shapes</p>
              <h2>Three ways this usually starts.</h2>
              <p className="lede">
                Most consulting engagements begin in one of three places. Each has a different first
                deliverable, and we will say up front which one your situation actually calls for.
              </p>
            </Reveal>

            <Reveal variant="reveal-right" className="split-panel">
              <dl style={{ margin: 0 }}>
                <div className="kv-row">
                  <dt>Assessment</dt>
                  <dd>Current-state review &amp; findings</dd>
                </div>
                <div className="kv-row">
                  <dt>Embedded</dt>
                  <dd>BA / RTE / PM inside your team</dd>
                </div>
                <div className="kv-row">
                  <dt>Training</dt>
                  <dd>Certification cohort &amp; coaching</dd>
                </div>
                <div className="kv-row">
                  <dt>Staffing</dt>
                  <dd>End-to-end recruitment</dd>
                </div>
                <div className="kv-row">
                  <dt>Cadence</dt>
                  <dd>Fixed checkpoint reviews</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      <CTABand
        title="Build the capability, not the dependency."
        body="Tell us where delivery is stalling. The first conversation is an assessment, not a pitch."
        secondary={{ to: '/careers', label: 'Join the team' }}
      />
    </>
  )
}
