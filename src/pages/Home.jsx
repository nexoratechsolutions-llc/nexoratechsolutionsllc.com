import { Link } from 'react-router-dom'
import { useSeo, ORGANIZATION_LD } from '../lib/seo'
import {
  HERO_STATS,
  ABOUT_CELLS,
  PROCESS_STEPS,
  IMPACT_CELLS,
  SERVICES,
  AI_STATS,
  INDUSTRIES,
  WHY_CARDS,
} from '../data/site'
import OrbitVisual from '../components/OrbitVisual'
import { Marquee, CTABand, Stepper } from '../components/Sections'
import {
  SectionHead,
  CountStat,
  MagneticLink,
  GlowCard,
  Aurora,
  DotGrid,
  SplitHeadline,
  Reveal,
} from '../components/Primitives'
import { Icon } from '../components/Icons'

const HOME_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    ORGANIZATION_LD,
    {
      '@type': 'WebSite',
      name: 'Nexora TechSolutions',
      url: 'https://www.nexoratechsolutions.com',
    },
  ],
}

export default function Home() {
  useSeo({
    title: 'Nexora TechSolutions',
    description:
      'Nexora TechSolutions designs, builds and runs software, AI and cloud systems — end-to-end delivery from discovery through scale.',
    path: '/',
    jsonLd: HOME_LD,
  })

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <Aurora />
        <DotGrid />
        <div className="wrap">
          <div className="hero-copy">
            <p className="eyebrow">Nexora TechSolutions LLC — Est. 2026</p>
            <h1>
              <SplitHeadline
                text="Empowering businesses through transformative technology."
                emphasis={['transformative']}
              />
            </h1>
            <p className="hero-tag">
              We design, build and run software, AI and cloud systems that connect strategy to execution —
              end-to-end delivery from discovery through scale, led by a team with decades of combined practice.
            </p>
            <div className="hero-actions">
              <MagneticLink to="/contact" className="btn btn-primary btn-lg">
                Start a Conversation
              </MagneticLink>
              <Link className="btn btn-ghost btn-lg" to="/process">
                See how we work
              </Link>
            </div>
            <div className="stat-row">
              {HERO_STATS.map((s) => (
                <CountStat key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
              ))}
            </div>
          </div>
          <OrbitVisual />
        </div>
      </section>

      <Marquee />

      {/* ---------- ABOUT ---------- */}
      <section id="about">
        <div className="wrap">
          <SectionHead
            eyebrow="About Nexora"
            title="One discipline underneath everything we build."
            lede="Nexora TechSolutions LLC has been at the forefront of IT innovation since 2026 — specializing in software development, AI-driven solutions, and business process optimization for organizations that need technology to actually hold up under real operating conditions."
          />
          <div className="about-grid reveal">
            {ABOUT_CELLS.map((cell) => (
              <div className="about-cell" key={cell.n}>
                <span className="num-badge">{cell.n}</span>
                <h3>{cell.title}</h3>
                <p>{cell.body}</p>
              </div>
            ))}
          </div>
          <Reveal className="hero-actions" delay={120} style={{ marginTop: 28 }}>
            <Link className="link-arrow" to="/about">
              Read the full story {Icon.arrow(13)}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- PROCESS ---------- */}
      <section id="process">
        <div className="wrap">
          <SectionHead
            eyebrow="How we work"
            title="An iterative delivery cycle, built for adaptability."
            lede="Every engagement moves through five connected phases. Each one closes with a feedback loop back to the client, so the roadmap stays accurate as priorities evolve — not just at kickoff."
          />
          <Stepper steps={PROCESS_STEPS} />
          <Reveal className="hero-actions">
            <Link className="btn btn-ghost" to="/process">
              Walk through every phase
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- IMPACT ---------- */}
      <section className="impact">
        <div className="wrap">
          <SectionHead
            eyebrow="Agile + DevOps synergy"
            title="A high-velocity environment, without sacrificing quality."
            lede="We integrate Agile methodology with DevOps infrastructure so time-to-market drops without software quality following it down."
          />
          <div className="impact-grid reveal">
            {IMPACT_CELLS.map((cell) => (
              <div className="impact-cell" key={cell.title}>
                <h4>{cell.title}</h4>
                <p>{cell.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SERVICES ---------- */}
      <section id="services">
        <div className="wrap">
          <SectionHead
            eyebrow="What we do"
            title="Capabilities that cover the full lifecycle."
            lede="From first architecture sketch to scaled production system, Nexora brings one accountable team across every discipline involved."
          />
          <div className="services-grid reveal">
            {SERVICES.map((service) => (
              <GlowCard className="service-card" key={service.slug}>
                <div className="service-icon">{Icon[service.icon](20)}</div>
                <h3>{service.title}</h3>
                <p>{service.body}</p>
                <div className="card-foot">
                  <Link className="link-arrow" to="/services">
                    Details {Icon.arrow(13)}
                  </Link>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- AI ---------- */}
      <section id="ai" className="ai-section">
        <Aurora />
        <DotGrid />
        <div className="wrap">
          <SectionHead
            eyebrow="AI Solutions"
            title="AI agents built to carry real operational weight."
            lede="We build cutting-edge AI agents on AWS, Azure and Google Cloud — powered by TensorFlow, PyTorch, OpenAI, Hugging Face and LangChain — and apply them across healthcare, finance, e-commerce, manufacturing and logistics."
          />

          <div className="ai-stat-grid reveal">
            {AI_STATS.map((stat) => (
              <div className="ai-stat" key={stat.title}>
                <div
                  className="ring"
                  style={{ background: `conic-gradient(${stat.color} ${stat.pct}%, rgba(255,255,255,.12) 0)` }}
                >
                  <span>{stat.pct}%</span>
                </div>
                <h4>{stat.title}</h4>
                <p>{stat.body}</p>
              </div>
            ))}
          </div>

          <div className="case-card reveal">
            <span className="tag">Case Study</span>
            <h3>Health Care Navigator</h3>
            <p>
              An AI-powered solution transforming patient intake and care planning. Purpose-built agents automate
              data collection, perform clinical assessments, and ensure compliance — cutting administrative
              burden and wait times while improving patient outcomes through EHR integration and automated report
              generation.
            </p>
            <div className="case-agents">
              <span className="agent-pill">Intake Coordination Agent</span>
              <span className="agent-pill">Clinical Assessment Agent</span>
              <span className="agent-pill">Care Planning &amp; Compliance Agent</span>
            </div>
          </div>

          <p className="chip-label reveal" style={{ color: 'var(--dark-ink-faint)', marginTop: 8 }}>
            Industry-wide application
          </p>
          <div className="industry-grid reveal">
            {INDUSTRIES.map((industry) => (
              <div className="industry-tile" key={industry.name}>
                <b>{industry.name}</b>
                <span>{industry.body}</span>
              </div>
            ))}
          </div>

          <Reveal className="hero-actions" style={{ marginTop: 34 }}>
            <MagneticLink to="/ai-solutions" className="btn btn-primary">
              Explore AI solutions
            </MagneticLink>
          </Reveal>
        </div>
      </section>

      {/* ---------- IMG PATHWAY TEASER ---------- */}
      <section id="img-teaser">
        <div className="wrap">
          <div className="split">
            <Reveal variant="reveal-left" className="split-copy">
              <p className="eyebrow">New service line — Nexora IMG Pathway</p>
              <h2>The same delivery discipline, applied to the residency journey.</h2>
              <p className="lede">
                Assessment before advice, a roadmap with dated checkpoints, one accountable owner throughout —
                now for international medical graduates working toward a U.S. residency, from first Step exam to
                Match Day.
              </p>
              <div className="hero-actions">
                <MagneticLink to="/img-pathway" className="btn btn-primary">
                  See the pathway
                </MagneticLink>
                <Link className="btn btn-ghost" to="/img-pathway#assessment">
                  Request an assessment call
                </Link>
              </div>
            </Reveal>

            <Reveal variant="reveal-right" className="split-panel">
              <p className="badge-pill">
                <span className="live-dot" aria-hidden /> Six tracks · one programme
              </p>
              <dl style={{ margin: 0 }}>
                <div className="kv-row">
                  <dt>Exams</dt>
                  <dd>Step 1 · Step 2 CK · Step 3</dd>
                </div>
                <div className="kv-row">
                  <dt>Application</dt>
                  <dd>ERAS, letters &amp; signalling</dd>
                </div>
                <div className="kv-row">
                  <dt>Experience</dt>
                  <dd>Observerships &amp; externships</dd>
                </div>
                <div className="kv-row">
                  <dt>Research</dt>
                  <dd>Scoping to publication</dd>
                </div>
                <div className="kv-row">
                  <dt>Interviews</dt>
                  <dd>Rehearsal &amp; ranking strategy</dd>
                </div>
                <div className="kv-row">
                  <dt>Owner</dt>
                  <dd>One named contact</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- WHY ---------- */}
      <section id="why">
        <div className="wrap">
          <SectionHead eyebrow="Why Nexora" title="Reasons clients keep coming back." />
          <div className="why-grid reveal">
            {WHY_CARDS.map((card) => (
              <div className="why-card" key={card.title}>
                <span className="why-icon">{Icon[card.icon](30)}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand secondary={{ to: '/services', label: 'Browse capabilities' }} />
    </>
  )
}
