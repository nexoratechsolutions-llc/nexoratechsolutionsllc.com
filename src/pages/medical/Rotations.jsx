import { CtaBand, NumberedGrid, PageHero, ProgGrid, SectionHead } from '../../components/Blocks'
import { friction, rotationPrograms } from '../../data/medical'

export default function Rotations() {
  return (
    <>
      <PageHero
        eyebrow="02 · Clinical Rotations"
        title={<>U.S. clinical experience that turns into <em>strong letters</em>.</>}
        lede="Program directors want to see how you work in a U.S. setting. We help you secure hands-on placements early enough to count, and to leave each one with a letter that says something specific about you."
      />

      {/* ── What we offer ── */}
      <section>
        <div className="wrap">
          <SectionHead
            eyebrow="What we offer"
            title="Rotations placed around your application, not the other way round."
          />
          <ProgGrid items={rotationPrograms} />
        </div>
      </section>

      {/* ── Why timing matters ── */}
      <section className="alt-band">
        <div className="wrap">
          <SectionHead
            eyebrow="Why timing matters"
            title="Experience only counts if it lands in the right cycle."
            lede="Two of the problems we see most often — and what rotations are sequenced to prevent."
          />
          <NumberedGrid items={[friction[3], friction[1]]} cols={2} />
        </div>
      </section>

      <CtaBand practice="medical" />
    </>
  )
}
