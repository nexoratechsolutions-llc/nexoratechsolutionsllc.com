import Reveal from '../../components/Reveal'
import { CtaBand, PageHero, ProgGrid } from '../../components/Blocks'
import { coachingPrograms } from '../../data/medical'

export default function Coaching() {
  return (
    <>
      <PageHero
        eyebrow="01 · USMLE Coaching"
        title={
          <>
            Step 1, Step 2 CK and Step 3 — at the <em>pace</em> your timeline needs.
          </>
        }
        lede="Short, intensive crash courses for students close to test day; longer mastery programs for those building from the basics; and one-on-one tutoring when you need someone working problems alongside you."
      />
      <section>
        <div className="wrap">
          <ProgGrid items={coachingPrograms} />
          <Reveal as="p" className="fine note">
            Also available: a full on-demand course library covering all three Steps.
          </Reveal>
        </div>
      </section>
      <CtaBand practice="medical" />
    </>
  )
}
