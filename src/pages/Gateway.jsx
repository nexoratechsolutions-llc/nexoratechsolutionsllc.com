import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import BrandMark from '../components/BrandMark'
import Reveal from '../components/Reveal'
import WordReveal from '../components/WordReveal'
import { HeroBackdrop } from '../components/Blocks'
import { ArrowRight, Code, Stethoscope } from '../components/Icons'

const GATES = [
  {
    key: 'tech',
    to: '/technical',
    Icon: Code,
    kicker: 'Technical',
    title: 'Nexora TechSolutions',
    text: 'Software development, AI agents, QA automation, DevOps & cloud, delivery consulting and SAFe®-certified training.',
    chips: ['Software', 'AI & Automation', 'QA', 'DevOps', 'Consulting', 'Training'],
    go: 'Enter Technical',
  },
  {
    key: 'med',
    to: '/medical',
    Icon: Stethoscope,
    kicker: 'Medical',
    title: 'Nexora Medical',
    text: 'USMLE coaching, U.S. clinical rotations, mentored research and end-to-end residency Match support — plus a research program for high schoolers.',
    chips: ['USMLE Coaching', 'Rotations', 'Research', 'Match', 'Junior Scientist'],
    go: 'Enter Medical',
  },
]

export default function Gateway() {
  const { hash } = useLocation()
  const navigate = useNavigate()

  // Old single-page deep links (#technical / #medical) land on the right practice.
  useEffect(() => {
    if (hash === '#technical' || hash === '#medical') navigate(`/${hash.slice(1)}`, { replace: true })
  }, [hash, navigate])

  return (
    <section className="gateway">
      <HeroBackdrop />
      <div className="wrap">
        <div className="gate-top">
          <div className="gate-mark">
            <BrandMark size={56} />
          </div>
          <p className="eyebrow">Nexora TechSolutions LLC</p>
          <h1>
            <WordReveal>
              Two practices. <em>One</em> standard of delivery.
            </WordReveal>
          </h1>
          <p className="lede">
            Choose where you'd like to go: technology services for businesses, or medical education for international
            medical graduates and young researchers.
          </p>
        </div>

        <Reveal effect="flip" stagger delay={450} className="gate-grid">
          {GATES.map((g) => (
            <Link key={g.key} className={`gate-card ${g.key}`} to={g.to}>
              <span className="gate-icon">
                <g.Icon size={26} />
              </span>
              <span className="gate-kicker">{g.kicker}</span>
              <h2>{g.title}</h2>
              <p>{g.text}</p>
              <span className="chip-row">
                {g.chips.map((c) => (
                  <span className="chip" key={c}>
                    {c}
                  </span>
                ))}
              </span>
              <span className="gate-go">
                {g.go} <ArrowRight size={18} className="arrow" />
              </span>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
