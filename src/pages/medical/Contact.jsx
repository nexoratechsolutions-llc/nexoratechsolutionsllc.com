import { Link } from 'react-router-dom'
import Reveal from '../../components/Reveal'
import ContactForm from '../../components/ContactForm'
import OfficeMap from '../../components/OfficeMap'
import { ContactInfo } from '../../components/ContactInfo'
import { PageHero } from '../../components/Blocks'
import { medTopics } from '../../data/medical'

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Free guidance call"
        title={
          <>
            Find out where your profile <em>actually</em> stands.
          </>
        }
        lede="A free guidance call, no obligation — an honest read of your timeline and which programs are worth it for you. It covers where your profile stands today, what the next twelve months would need to look like, and which parts of the pathway are worth paying for in your case."
      />

      <section>
        <div className="wrap contact-grid">
          <Reveal effect="left">
            <ContactInfo
              intro="Email or call and we'll set up your assessment call."
              subject="Medical guidance call"
            >
              <p className="fine">
                Have a question first? <Link to="/medical/faq">Read the FAQ</Link>.
              </p>
            </ContactInfo>
          </Reveal>
          <Reveal effect="right" delay={120}>
            <ContactForm
              topics={medTopics}
              subjectPrefix="Medical guidance call"
              messageLabel="Where are you right now?"
              messagePlaceholder="e.g. Step 1 passed, Step 2 CK planned for March, targeting Internal Medicine in the next cycle. For Junior Scientist: your child's grade and interests."
            />
          </Reveal>
        </div>
      </section>

      <OfficeMap />
    </>
  )
}
