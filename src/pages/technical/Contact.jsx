import Reveal from '../../components/Reveal'
import ContactForm from '../../components/ContactForm'
import OfficeMap from '../../components/OfficeMap'
import { ContactInfo } from '../../components/ContactInfo'
import { PageHero } from '../../components/Blocks'
import { techTopics } from '../../data/technical'

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>Let's transform your business <em>together</em>.</>}
        lede="Tell us what you're building, fixing or scaling — a new product, a stalled delivery, a test suite nobody trusts, or an AI idea that needs grounding. We'll come back with a straight answer on how we'd approach it."
      />

      <section>
        <div className="wrap contact-grid">
          <Reveal effect="left">
            <ContactInfo
              intro="Prefer to reach us directly? Email or call — a person reads every message."
              subject="Project enquiry"
            />
          </Reveal>
          <Reveal effect="right" delay={120}>
            <ContactForm
              topics={techTopics}
              subjectPrefix="Nexora TechSolutions enquiry"
              messageLabel="Tell us about your project"
              messagePlaceholder="What are you trying to achieve, and by when?"
            />
          </Reveal>
        </div>
      </section>

      <OfficeMap />
    </>
  )
}
