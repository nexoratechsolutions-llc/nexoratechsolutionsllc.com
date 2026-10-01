import { Link } from 'react-router-dom'
import Reveal from '../../components/Reveal'
import { CtaBand, PageHero, SectionHead } from '../../components/Blocks'
import { ArrowRight } from '../../components/Icons'
import { faqs } from '../../data/medical'

export default function Faq() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title={<>Your questions, <em>answered</em>.</>}
        lede="About the IMG pathway, single tracks, and the Junior Scientist Program. If yours isn't here, ask it on a free guidance call."
      />

      <section>
        <div className="wrap faq-wrap">
          <div>
            <SectionHead
              eyebrow={`${faqs.length} questions`}
              title="Everything we get asked."
            />
            <Reveal stagger className="faq-list">
              {faqs.map((f, i) => (
                <details key={f.q} open={i === 0}>
                  <summary>
                    <h2 className="faq-q">{f.q}</h2>
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </Reveal>
          </div>

          <Reveal as="aside" effect="right" className="faq-aside" delay={200}>
            <p className="eyebrow">Still deciding?</p>
            <h2 className="h3">Get an honest read of your timeline.</h2>
            <p>A free guidance call gives you an honest read of your timeline and which programs are worth it for you — no obligation.</p>
            <Link className="btn btn-primary" to="/medical/contact">
              Book a guidance call <ArrowRight size={16} className="arrow" />
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBand practice="medical" />
    </>
  )
}
