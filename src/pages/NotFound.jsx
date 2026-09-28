import { Link, useLocation } from 'react-router-dom'
import { HeroBackdrop } from '../components/Blocks'
import CountUp from '../components/CountUp'
import WordReveal from '../components/WordReveal'
import { ArrowLeft } from '../components/Icons'
import { practiceFor } from '../data/site'

export default function NotFound() {
  const { pathname } = useLocation()
  const practice = practiceFor(pathname)
  const back = practice ? `/${practice}` : '/'
  const backLabel = practice === 'medical' ? 'Back to Nexora Medical' : practice ? 'Back to Nexora TechSolutions' : 'Back to start'

  return (
    <section className="notfound">
      <HeroBackdrop />
      <div className="wrap notfound-inner">
        <p className="code" aria-hidden="true">
          <CountUp value="404" duration={1300} />
        </p>
        <h1>
          <WordReveal>This page doesn't exist.</WordReveal>
        </h1>
        <p className="lede">The link may be old, or the address mistyped. Everything we offer is one click from here.</p>
        <div className="actions center">
          <Link className="btn btn-primary" to={back}>
            <ArrowLeft size={17} /> {backLabel}
          </Link>
          {practice !== 'technical' && (
            <Link className="btn btn-ghost" to="/technical">
              Technical services
            </Link>
          )}
          {practice !== 'medical' && (
            <Link className="btn btn-ghost" to="/medical">
              Medical education
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
