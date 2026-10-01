import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Reveal from '../components/Reveal'
import CountUp from '../components/CountUp'
import WordReveal from '../components/WordReveal'
import { SectionHead } from '../components/Blocks'
import { ArrowRight, IconByName } from '../components/Icons'
import { SITE } from '../data/site'
import { deliverySteps, whyUs } from '../data/technical'
import { cycleSteps } from '../data/medical'

/** The two services, as numbered cards in the landing hero. */
const SERVICES = [
  {
    key: 'tech',
    n: '1',
    to: '/technical',
    title: 'Technical',
    text: 'Software, AI and cloud systems delivered end to end, from discovery through scale, plus delivery consulting and certified training.',
    items: [
      'Software development',
      'AI agents & automation',
      'Quality assurance',
      'DevOps & cloud',
      'BA, PM & consulting',
      'SAFe® training & staffing',
    ],
    go: 'Explore Technical services',
  },
  {
    key: 'med',
    n: '2',
    to: '/medical',
    title: 'Medical',
    text: 'From the first USMLE Step to Match Day: coaching, U.S. clinical rotations, mentored research and residency Match support.',
    items: [
      'USMLE Step 1, 2 CK & 3 coaching',
      'U.S. clinical rotations',
      'Research & publication',
      'Residency Match support',
      'Junior Scientist (grades 9–12)',
      '1:1 tutoring',
    ],
    go: 'Explore Medical services',
  },
]

/** "At a glance" strip — three figures per service. */
const NUMBERS = [
  { tag: 'Technical', t: 'tech', value: '25', plus: true, label: 'Years of combined team expertise' },
  { tag: 'Technical', t: 'tech', value: '7', label: 'Certified SAFe® disciplines' },
  { tag: 'Technical', t: 'tech', value: '5', label: 'Industries served' },
  { tag: 'Medical', t: 'med', value: '3', label: 'USMLE Steps covered' },
  { tag: 'Medical', t: 'med', value: '4', label: 'Program tracks' },
  { tag: 'Medical', t: 'med', value: '25', plus: true, label: 'Individual programs' },
]

const TICKER_TECH = ['Java', 'Python', 'React', 'AWS', 'Azure', 'Google Cloud', 'Kubernetes', 'Terraform', 'LangChain', 'PyTorch', 'Selenium', 'Cypress']
const TICKER_MED = ['Step 1', 'Step 2 CK', 'Step 3', 'ERAS', 'Research Catalyst', 'Junior Scientist']

/** Both delivery cycles, side by side. */
const CYCLES = [
  {
    key: 't',
    kicker: '1 · Technical delivery cycle',
    title: 'An iterative delivery cycle, built for adaptability.',
    steps: deliverySteps.map((s) => s.title),
    text: 'Every engagement moves through five connected phases, each closing with a feedback loop back to the client.',
    to: '/technical/process',
    cta: 'See the technical process',
  },
  {
    key: 'm',
    kicker: '2 · Medical pathway cycle',
    title: 'From your first Step exam to Match Day.',
    steps: cycleSteps.map((s) => s.title),
    text: 'Five phases, each closing with a checkpoint that decides whether the next one starts.',
    to: '/medical/match',
    cta: 'See the medical pathway',
  },
]

function TickerRow({ hidden }) {
  return (
    <ul className="ticker-list" aria-hidden={hidden || undefined}>
      {TICKER_TECH.map((w) => (
        <li key={w}>{w}</li>
      ))}
      {TICKER_MED.map((w) => (
        <li key={w} className="m">
          {w}
        </li>
      ))}
    </ul>
  )
}

export default function Gateway() {
  const { hash } = useLocation()
  const navigate = useNavigate()

  // Old single-page deep links (#technical / #medical) open that service.
  useEffect(() => {
    if (hash === '#technical' || hash === '#medical') navigate(`/${hash.slice(1)}`, { replace: true })
  }, [hash, navigate])

  return (
    <>
      {/* ── Hero: one company, two services ── */}
      <section className="land-hero" id="services-home">
        <div className="blueprint" aria-hidden="true" />
        <div className="wrap">
          <div className="land-top">
            <div className="land-title">
              <p className="eyebrow">Nexora TechSolutions LLC · Est. 2026</p>
              <h1>
                <WordReveal>
                  One company. <span className="grad">Two services.</span>
                </WordReveal>
              </h1>
            </div>
            <p className="land-lede">
              Nexora TechSolutions offers two services: technology delivery for businesses, and medical education
              for international medical graduates and young researchers. Choose a service to explore it.
            </p>
          </div>

          <div className="svc-label">
            <span>Services from Nexora TechSolutions</span>
            <span>Select one to enter</span>
          </div>
          <Reveal effect="flip" stagger delay={350} className="svc-grid">
            {SERVICES.map((s) => (
              <Link key={s.key} className={`svc ${s.key}`} to={s.to}>
                <span className="svc-num" aria-hidden="true">
                  {s.n}
                </span>
                <span className="svc-kicker">Service {s.n}</span>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
                <ul>
                  {s.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
                <span className="svc-go">
                  {s.go}{' '}
                  <i aria-hidden="true">
                    <ArrowRight size={16} />
                  </i>
                </span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── At a glance ── */}
      <section className="numbers" id="numbers" aria-label="Nexora at a glance">
        <Reveal stagger className="wrap numbers-grid">
          {NUMBERS.map((n) => (
            <div className="num" key={n.label}>
              <span className={`tag ${n.t}`}>{n.tag}</span>
              <b>
                <CountUp value={n.value} />
                {n.plus && <small>+</small>}
              </b>
              <span>{n.label}</span>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ── Ticker ── */}
      <div className="ticker" role="region" aria-label="Technologies and programs">
        <div className="ticker-track">
          <TickerRow />
          <TickerRow hidden />
        </div>
      </div>

      {/* ── How we deliver ── */}
      <section id="delivery">
        <div className="wrap">
          <SectionHead
            eyebrow="How we deliver"
            title="Two services, run with the same delivery discipline."
            lede="Assessment before advice, a roadmap with dated checkpoints, and one accountable team throughout, whether the outcome is a production system or a residency match."
          />
          <Reveal effect="split" stagger className="split">
            {CYCLES.map((c) => (
              <div className={`split-card ${c.key}`} key={c.key}>
                <span className="k">{c.kicker}</span>
                <h3>{c.title}</h3>
                <ol>
                  {c.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <p>{c.text}</p>
                <Link className="btn btn-ghost" to={c.to}>
                  {c.cta} <ArrowRight size={16} className="arrow" />
                </Link>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Why Nexora ── */}
      <section id="why-home" className="alt-band">
        <div className="wrap">
          <SectionHead eyebrow="Why Nexora" title="Reasons clients keep coming back." />
          <Reveal effect="flip" stagger className="why-grid">
            {whyUs.map((w) => (
              <article className="card why-card" key={w.title}>
                <IconByName name={w.icon} size={28} className="why-icon" />
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="cta" id="contact-home">
        <div className="wrap">
          <Reveal effect="zoom" className="cta-box">
            <div className="cta-copy">
              <h2>Let's transform your business together.</h2>
              <p className="lede">
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a> · <a href={SITE.phoneHref}>{SITE.phone}</a>
              </p>
            </div>
            <div className="actions">
              <Link className="btn btn-primary btn-lg" to="/technical/contact">
                Technical enquiry <ArrowRight size={18} className="arrow" />
              </Link>
              <Link className="btn btn-ghost btn-lg" to="/medical/contact">
                Medical guidance call <ArrowRight size={18} className="arrow" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
