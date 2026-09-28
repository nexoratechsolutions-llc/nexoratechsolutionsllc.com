import Reveal from '../../components/Reveal'
import { CtaBand, PageHero, ProgGrid } from '../../components/Blocks'
import { researchPrograms } from '../../data/medical'

export default function Research() {
  return (
    <>
      <PageHero
        eyebrow="03 · Research"
        title={
          <>
            Build the <em>academic profile</em> your residency application needs.
          </>
        }
        lede="Research opportunity matching, publication strategy, and a plan for how each paper shows up on your ERAS application — from a first co-authorship to a 12-month fellowship."
      />
      <section>
        <div className="wrap">
          <ProgGrid items={researchPrograms} />
          <Reveal as="p" className="fine note">
            Also available: Research Cohort Access — recorded, self-paced research training.
          </Reveal>
        </div>
      </section>
      <section className="alt-band">
        <div className="wrap">
          <Reveal effect="left" className="ethics-note">
            <h2>Authorship is earned, never sold.</h2>
            <p>
              Every program follows ICMJE authorship criteria. Your name goes on a paper because of the work you did on
              it — not because of a fee — and you work up from contributor to lead author as that work grows.
            </p>
          </Reveal>
        </div>
      </section>
      <CtaBand practice="medical" />
    </>
  )
}
