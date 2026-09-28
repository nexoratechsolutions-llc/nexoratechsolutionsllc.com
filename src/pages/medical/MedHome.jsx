import { Link } from 'react-router-dom'
import Reveal from '../../components/Reveal'
import WordReveal from '../../components/WordReveal'
import CountUp from '../../components/CountUp'
import { CompareGrid, CtaBand, HeroBackdrop, NumberedGrid, SectionHead, StatRow } from '../../components/Blocks'
import { MedOrbit } from '../../components/Orbits'
import { ArrowRight, IconByName } from '../../components/Icons'
import { friction, juniorStats, medStats, tracks, whyMedical } from '../../data/medical'

export default function MedHome() {
  return (
    <>
      <section className="hero">
        <HeroBackdrop />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Nexora Medical — IMG &amp; research pathway</p>
            <h1>
              <WordReveal>
                From your first Step exam to <em>Match Day</em>, with one team owning the plan.
              </WordReveal>
            </h1>
            <p className="hero-tag">
              Coaching for USMLE Step 1, Step 2 CK and Step 3, U.S. clinical rotations and letters, mentored research
              that leads to real publications, and hands-on Match support — sequenced as one roadmap instead of four
              separate purchases.
            </p>
            <div className="actions">
              <Link className="btn btn-primary btn-lg" to="/medical/contact">
                Book a free guidance call <ArrowRight size={18} className="arrow" />
              </Link>
              <a className="btn btn-ghost btn-lg" href="#programs">
                Explore programs
              </a>
            </div>
            <StatRow stats={medStats} />
          </div>
          <MedOrbit />
        </div>
      </section>

      <section className="alt-band">
        <div className="wrap">
          <SectionHead
            eyebrow="Where IMGs lose time"
            title="Most applications don't fail on effort. They fail on sequencing."
            lede="We see the same six problems in almost every profile we review. The programs below are built to close each one before it costs a cycle."
          />
          <NumberedGrid items={friction} />
        </div>
      </section>

      <section id="programs">
        <div className="wrap">
          <SectionHead
            eyebrow="Four tracks, one roadmap"
            title="Everything the application needs, in the order it needs it."
            lede="Take the full pathway or a single track. Either way, each piece is timed against the cycle calendar it has to land in."
          />
          <Reveal effect="flip" stagger className="track-grid">
            {tracks.map((t) => (
              <Link className="card track-card" to={t.to} key={t.to}>
                <span className="service-icon">
                  <IconByName name={t.icon} size={21} />
                </span>
                <span className="tag">{t.kicker}</span>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
                <span className="text-link">
                  Explore <ArrowRight size={16} className="arrow" />
                </span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="alt-band">
        <div className="wrap spot-hero">
          <SectionHead
            className="flush"
            eyebrow="Spotlight · Junior Scientist Program"
            title={
              <>
                Real medical research for high schoolers — and a path to <em>earned</em> publication.
              </>
            }
            lede="A physician-researcher mentors your child through one real study, every week, from reading their first paper to writing one of their own."
          />
          <Reveal effect="right" className="spot-side">
            <div className="spot-stats">
              {juniorStats.map((s) => (
                <div key={s.value}>
                  <b>
                    <CountUp value={s.value} />
                  </b>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
            <Link className="btn btn-primary" to="/medical/junior-scientist">
              See the Junior Scientist Program <ArrowRight size={16} className="arrow" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="wrap">
          <SectionHead
            eyebrow="Why Nexora Medical"
            title="The difference is not more content. It is ownership of the sequence."
          />
          <CompareGrid left={whyMedical.usual} right={whyMedical.ours} />
          <Reveal className="more-row">
            <Link className="text-link" to="/medical/faq">
              Read the FAQ <ArrowRight size={16} className="arrow" />
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBand practice="medical" />
    </>
  )
}
