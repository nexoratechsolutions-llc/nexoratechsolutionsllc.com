import { Link } from 'react-router-dom'
import Reveal from '../../components/Reveal'
import WordReveal from '../../components/WordReveal'
import { CtaBand, HeroBackdrop, Marquee, SectionHead, StatRow, Stepper } from '../../components/Blocks'
import { TechOrbit } from '../../components/Orbits'
import { ArrowRight, IconByName } from '../../components/Icons'
import AiRing from '../../components/AiRing'
import { aiStats, deliverySteps, services, stackChips, techStats, whyUs } from '../../data/technical'

export default function TechHome() {
  return (
    <>
      <section className="hero">
        <HeroBackdrop />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Nexora TechSolutions LLC — Est. 2026</p>
            <h1>
              <WordReveal>
                Empowering businesses through <em>transformative</em> technology.
              </WordReveal>
            </h1>
            <p className="hero-tag">
              We design, build and run software, AI and cloud systems that connect strategy to execution — end‑to‑end
              delivery from discovery through scale, led by a team with decades of combined practice.
            </p>
            <div className="actions">
              <Link className="btn btn-primary btn-lg" to="/technical/contact">
                Start a Conversation <ArrowRight size={18} className="arrow" />
              </Link>
              <Link className="btn btn-ghost btn-lg" to="/technical/process">
                See how we work
              </Link>
            </div>
            <StatRow stats={techStats} />
          </div>
          <TechOrbit />
        </div>
      </section>

      <Marquee items={stackChips} label="Technologies we work with" />

      <section>
        <div className="wrap">
          <SectionHead
            eyebrow="What we do"
            title="Capabilities that cover the full lifecycle."
            lede="From first architecture sketch to scaled production system, Nexora brings one accountable team across every discipline involved."
          />
          <Reveal effect="flip" stagger className="services-grid">
            {services.map((s) => (
              <article className="card service-card" key={s.title}>
                <span className="service-icon">
                  <IconByName name={s.icon} size={21} />
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </Reveal>
          <Reveal className="more-row">
            <Link className="text-link" to="/technical/services">
              Explore all services <ArrowRight size={16} className="arrow" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="alt-band">
        <div className="wrap">
          <SectionHead
            eyebrow="How we work"
            title="An iterative delivery cycle, built for adaptability."
            lede="Every engagement moves through five connected phases, each closing with a feedback loop back to the client."
          />
          <Stepper steps={deliverySteps} />
          <Reveal className="more-row">
            <Link className="text-link" to="/technical/process">
              See the full delivery cycle <ArrowRight size={16} className="arrow" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="dark-panel">
        <HeroBackdrop />
        <div className="wrap">
          <SectionHead
            eyebrow="AI Solutions"
            title="AI agents built to carry real operational weight."
            lede="Built on AWS, Azure and Google Cloud with TensorFlow, PyTorch, OpenAI, Hugging Face and LangChain — and applied where they remove real friction."
          />
          <Reveal effect="zoom" className="ai-stat-grid">
            {aiStats.map((s) => (
              <div className="ai-stat" key={s.title}>
                <AiRing value={s.value} tone={s.tone} />
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </Reveal>
          <Reveal className="more-row">
            <Link className="btn btn-primary" to="/technical/ai-solutions">
              Explore AI solutions <ArrowRight size={16} className="arrow" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="wrap">
          <SectionHead eyebrow="Why Nexora" title="Reasons clients keep coming back." />
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
