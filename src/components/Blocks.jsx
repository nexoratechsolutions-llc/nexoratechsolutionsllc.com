import { Link, useLocation } from 'react-router-dom'
import Reveal from './Reveal'
import CountUp from './CountUp'
import WordReveal from './WordReveal'
import { ArrowRight, Mail, Phone } from './Icons'
import { SITE } from '../data/site'
import { breadcrumbsFor, findRoute } from '../lib/seo'

/** Decorative background glows + dot grid. */
export function HeroBackdrop() {
  return (
    <>
      <div className="aurora" aria-hidden="true" />
      <div className="grid-bg" aria-hidden="true" />
    </>
  )
}

/** Breadcrumb trail. */
export function Breadcrumbs() {
  const { pathname } = useLocation()
  const crumbs = breadcrumbsFor(findRoute(pathname))
  if (crumbs.length < 2) return null
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {crumbs.map((c, i) => (
          <li key={c.path}>
            {i < crumbs.length - 1 ? (
              <Link to={c.path}>{c.name}</Link>
            ) : (
              <span aria-current="page">{c.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Inner-page hero — full-bleed mesh gradient band. */
export function PageHero({ eyebrow, title, lede, children }) {
  return (
    <section className="page-hero">
      <HeroBackdrop />
      <div className="wrap page-hero-inner">
        <Breadcrumbs />
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>
          <WordReveal>{title}</WordReveal>
        </h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
    </section>
  )
}

/** Section heading with eyebrow + lede. */
export function SectionHead({ eyebrow, title, lede, as: H = 'h2', center = false, className = '' }) {
  return (
    <Reveal effect="blur" className={`section-head${center ? ' center' : ''} ${className}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <H>{title}</H>
      {lede && <p className="lede">{lede}</p>}
    </Reveal>
  )
}

/** Four stats in an enclosed row. */
export function StatRow({ stats }) {
  return (
    <dl className="stat-row">
      {stats.map((s) => (
        <div className="stat" key={s.label}>
          <dt>{s.label}</dt>
          <dd>
            <CountUp value={s.value} />
          </dd>
        </div>
      ))}
    </dl>
  )
}

/** Numbered connected stepper. */
export function Stepper({ steps, detailed = false }) {
  return (
    <Reveal as="ol" stagger className={`stepper${detailed ? ' detailed' : ''}`}>
      {steps.map((s, i) => (
        <li className="step" key={s.title}>
          <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </li>
      ))}
    </Reveal>
  )
}

/** Numbered grid (friction problems etc). */
export function NumberedGrid({ items, cols = 3 }) {
  return (
    <Reveal className={`friction-grid cols-${cols}`}>
      {items.map((f, i) => (
        <div className="friction-cell" key={f.title}>
          <span className="fnum">{String(i + 1).padStart(2, '0')}</span>
          <h3>{f.title}</h3>
          <p>{f.text}</p>
        </div>
      ))}
    </Reveal>
  )
}

function CompareCol({ data, ours }) {
  return (
    <div className={`compare-col${ours ? ' ours' : ''}`}>
      <p className="tag">{data.tag}</p>
      <h3>{data.title}</h3>
      <ul>
        {data.items.map((t) => (
          <li key={t}>
            <span className="mark" aria-hidden="true">
              {ours ? '→' : '—'}
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CompareGrid({ left, right }) {
  return (
    <Reveal effect="split" stagger className="compare-grid">
      <CompareCol data={left} />
      <CompareCol data={right} ours />
    </Reveal>
  )
}

/** Program card with pill badges and optional link. */
export function ProgCard({ p }) {
  return (
    <article className={`prog-card${p.flag ? ' flag' : ''}`}>
      {p.pills?.length > 0 && (
        <div className="prog-meta">
          {p.pills.map((pill) => (
            <span key={pill.label} className={`pill${pill.live ? ' live' : ''}`}>
              {pill.label}
            </span>
          ))}
        </div>
      )}
      <h3>{p.title}</h3>
      <p>{p.text}</p>
      {p.link && (
        <Link className="text-link prog-link" to={p.link.to}>
          {p.link.label} <ArrowRight size={16} className="arrow" />
        </Link>
      )}
    </article>
  )
}

export function ProgGrid({ items, four = false }) {
  return (
    <Reveal effect="flip" stagger className={`prog-grid${four ? ' four' : ''}`}>
      {items.map((p) => (
        <ProgCard key={p.title} p={p} />
      ))}
    </Reveal>
  )
}

export function ChipRow({ items, label }) {
  return (
    <>
      {label && <p className="chip-label">{label}</p>}
      <ul className="chip-row">
        {items.map((c) => (
          <li className="chip" key={c}>
            {c}
          </li>
        ))}
      </ul>
    </>
  )
}

/** Endless horizontal marquee ticker. */
export function Marquee({ items, label }) {
  const row = (hidden) => (
    <ul className="marquee-list" aria-hidden={hidden || undefined}>
      {items.map((c) => (
        <li className="chip" key={c}>
          {c}
        </li>
      ))}
    </ul>
  )
  return (
    <div className="marquee" role="region" aria-label={label}>
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}

const CTA_COPY = {
  technical: {
    title: "Let's transform your business together.",
    text: "Tell us what you're building, fixing or scaling. We'll come back with a straight answer on how we'd approach it.",
    to: '/technical/contact',
    label: 'Start a Conversation',
    subject: '',
  },
  medical: {
    title: 'Find out where your profile actually stands.',
    text: 'A free guidance call, no obligation — an honest read of your timeline and which programs are worth it for you.',
    to: '/medical/contact',
    label: 'Book a guidance call',
    subject: '?subject=Medical%20guidance%20call',
  },
}

/** Full-bleed dark CTA band. */
export function CtaBand({ practice = 'technical' }) {
  const c = CTA_COPY[practice]
  return (
    <section className="cta">
      <div className="wrap">
        <Reveal effect="zoom" className="cta-box">
          <div className="cta-copy">
            <h2>{c.title}</h2>
            <p className="lede">{c.text}</p>
          </div>
          <div className="cta-actions">
            <Link className="btn btn-highlight btn-lg" to={c.to}>
              {c.label} <ArrowRight size={18} className="arrow" />
            </Link>
            <div className="cta-direct">
              <a href={`mailto:${SITE.email}${c.subject}`}>
                <Mail size={16} /> {SITE.email}
              </a>
              <a href={SITE.phoneHref}>
                <Phone size={16} /> {SITE.phone}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
