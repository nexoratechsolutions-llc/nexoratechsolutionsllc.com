import Reveal from '../../components/Reveal'
import { CtaBand, PageHero, SectionHead } from '../../components/Blocks'
import { IconByName } from '../../components/Icons'
import { certifications, whyUs } from '../../data/technical'

export default function Consulting() {
  return (
    <>
      <PageHero
        eyebrow="Consulting & Training"
        title={
          <>
            Strategy, delivery leadership, and the <em>people</em> to run it.
          </>
        }
        lede="Beyond engineering, Nexora builds organizational capability — in business analysis, program leadership, and the workforce to sustain it."
      />

      <section>
        <div className="wrap">
          <Reveal className="consult-grid">
            <div className="consult-col">
              <span className="tag">Delivery Leadership</span>
              <h2 className="h3">Business Analysis, Project &amp; Product Management</h2>
              <p>
                Certified professionals guide business process optimization, stakeholder engagement and strategic
                decision‑making — with deep expertise in product lifecycle management, requirement gathering, risk
                assessment and market strategy.
              </p>
              <p className="fine">Methodologies: Agile · SAFe · Scrum · Lean</p>
            </div>
            <div className="consult-col">
              <span className="tag">Certified Training</span>
              <h2 className="h3">Elite Program &amp; Project Management Training</h2>
              <p>
                Hands‑on training led by certified SAFe experts, bridging the gap between theory and practical
                application — covering end‑to‑end project lifecycle, enterprise agility, strategic planning and risk
                assessment.
              </p>
              <ul className="cert-list">
                {certifications.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
            <div className="consult-col">
              <span className="tag">Workforce</span>
              <h2 className="h3">Training &amp; Staffing Solutions</h2>
              <p>
                Specialized training programs across IT, AI, Business Analysis, HR and Project Management, paired with
                end‑to‑end recruitment and workforce management.
              </p>
              <p>
                We upskill professionals with industry‑relevant expertise and help businesses build skilled teams for
                long‑term success.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="alt-band">
        <div className="wrap">
          <SectionHead eyebrow="Why Nexora" title="Certified people, accountable delivery." />
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
