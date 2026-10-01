import { CtaBand, PageHero, ProgGrid, SectionHead, Stepper } from '../../components/Blocks'
import { cycleSteps, matchPrograms } from '../../data/medical'

export default function Match() {
  return (
    <>
      <PageHero
        eyebrow="04 · Residency Match"
        title={<>End-to-end support, from ERAS to <em>Match Day</em> — and SOAP if needed.</>}
        lede="Every piece of the application, reviewed against the cycle calendar so nothing is left to the last two weeks."
      />

      {/* ── Eight match programs ── */}
      <section>
        <div className="wrap">
          <SectionHead
            eyebrow="All services"
            title="Every part of the application, accounted for."
            lede="From CV to signals — nothing gets left to chance in the final stretch."
          />
          <ProgGrid items={matchPrograms} four />
        </div>
      </section>

      {/* ── How a cycle runs ── */}
      <section className="alt-band">
        <div className="wrap">
          <SectionHead
            eyebrow="How a cycle runs"
            title="Five phases, each closing with a checkpoint."
            lede="Each checkpoint decides whether the next phase starts — so problems surface while there is still time to fix them."
          />
          <Stepper steps={cycleSteps} detailed />
        </div>
      </section>

      <CtaBand practice="medical" />
    </>
  )
}
