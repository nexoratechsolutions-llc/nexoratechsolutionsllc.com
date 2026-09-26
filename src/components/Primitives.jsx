import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCountUp, useMagnetic, useSpotlight } from '../hooks/useMotion'
import { Icon } from './Icons'

/* ------------------------------------------------------------------ */
/* Brand mark                                                          */
/* ------------------------------------------------------------------ */

export function Logo({ size = 30, withWord = true, word = 'Nexora' }) {
  const [head, tail] = [word.slice(0, 3), word.slice(3)]
  return (
    <>
      <svg width={size} height={size} viewBox="0 0 30 30" fill="none" aria-hidden focusable="false">
        <g className="brand-mark">
          <circle cx="15" cy="15" r="12.5" stroke="var(--line)" strokeWidth="1" />
        </g>
        <line x1="9" y1="20" x2="15" y2="8" stroke="var(--accent)" strokeWidth="1.4" />
        <line x1="15" y1="8" x2="21" y2="20" stroke="var(--accent2)" strokeWidth="1.4" />
        <line x1="9" y1="20" x2="21" y2="20" stroke="var(--ink-faint)" strokeWidth="1.4" />
        <circle cx="15" cy="8" r="3" fill="var(--accent)" />
        <circle cx="9" cy="20" r="3" fill="var(--accent2)" />
        <circle cx="21" cy="20" r="3" fill="var(--ink)" />
      </svg>
      {withWord && (
        <span className="brand-word">
          {head}
          <b>{tail}</b>
        </span>
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Section heading                                                     */
/* ------------------------------------------------------------------ */

export function SectionHead({ eyebrow, title, lede, center = false, children }) {
  return (
    <div className={`section-head reveal${center ? ' center' : ''}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {title && <h2>{title}</h2>}
      {lede && <p className="lede">{lede}</p>}
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Reveal wrapper — adds the observed class plus a stagger delay       */
/* ------------------------------------------------------------------ */

export function Reveal({ as: Tag = 'div', variant = 'reveal', delay = 0, className = '', style, children, ...rest }) {
  return (
    <Tag
      className={`${variant} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* Headline that animates in word by word                              */
/* ------------------------------------------------------------------ */

export function SplitHeadline({ text, emphasis = [], delay = 0 }) {
  const words = text.split(' ')

  // The words start at opacity 0 and are revealed by a CSS animation. If that
  // animation never runs, the headline would be invisible — so force the
  // finished state once it should have completed.
  const [settled, setSettled] = useState(false)
  useEffect(() => {
    const total = delay + words.length * 55 + 900
    const t = setTimeout(() => setSettled(true), total)
    return () => clearTimeout(t)
  }, [delay, words.length])

  return (
    <span className={`split-words${settled ? ' settled' : ''}`}>
      {words.map((word, i) => {
        const clean = word.replace(/[^\w-]/g, '').toLowerCase()
        const isEm = emphasis.includes(clean)
        return (
          <span key={`${word}-${i}`} className="split-word" style={{ '--wi': i, '--wdelay': `${delay}ms` }}>
            {isEm ? <em>{word}</em> : word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        )
      })}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Buttons & links                                                     */
/* ------------------------------------------------------------------ */

export function MagneticLink({ to, href, children, className = 'btn btn-primary', ...rest }) {
  const ref = useMagnetic(0.22)
  const inner = (
    <>
      {children}
      <span className="arrow" aria-hidden>
        {Icon.arrow(14)}
      </span>
    </>
  )

  if (href) {
    return (
      <a ref={ref} href={href} className={`${className} magnetic`} {...rest}>
        {inner}
      </a>
    )
  }
  return (
    <Link ref={ref} to={to} className={`${className} magnetic`} {...rest}>
      {inner}
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/* Animated stat                                                       */
/* ------------------------------------------------------------------ */

export function CountStat({ value, suffix = '', label }) {
  const [ref, current] = useCountUp(value)
  return (
    <div className="stat" ref={ref}>
      <b className="countup">
        {current}
        {suffix}
      </b>
      <span>{label}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Card with a cursor-tracked highlight                                */
/* ------------------------------------------------------------------ */

export function GlowCard({ as: Tag = 'div', className = '', children, ...rest }) {
  const onMove = useSpotlight()
  return (
    <Tag className={className} onMouseMove={onMove} {...rest}>
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* Ambient backdrops                                                   */
/* ------------------------------------------------------------------ */

export function Aurora() {
  return (
    <div className="aurora" aria-hidden>
      <b />
      <b />
      <b />
    </div>
  )
}

export function DotGrid() {
  return <div className="dotgrid" aria-hidden />
}

/* ------------------------------------------------------------------ */
/* Inner-page hero                                                     */
/* ------------------------------------------------------------------ */

export function PageHero({ eyebrow, title, emphasis = [], lede, crumb, children }) {
  return (
    <section className="page-hero">
      <Aurora />
      <DotGrid />
      <div className="wrap">
        <div className="page-hero-inner">
          {crumb && (
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden>/</span>
              <span>{crumb}</span>
            </nav>
          )}
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1>
            <SplitHeadline text={title} emphasis={emphasis} />
          </h1>
          {lede && <p className="lede">{lede}</p>}
          {children}
        </div>
      </div>
    </section>
  )
}
