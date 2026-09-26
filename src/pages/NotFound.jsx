import { Link } from 'react-router-dom'
import { useSeo } from '../lib/seo'
import { NAV } from '../data/site'
import { MagneticLink, Aurora, DotGrid } from '../components/Primitives'

export default function NotFound() {
  useSeo({
    title: 'Page not found',
    description: 'That page does not exist on nexoratechsolutionsllc.com.',
    path: '/404',
  })

  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <Aurora />
      <DotGrid />
      <div className="wrap notfound">
        <span className="code">404</span>
        <h1>That page moved, or never existed.</h1>
        <p>
          The link may be out of date. Everything on the site is one click away below — or tell us what you were
          looking for and we will point you at it.
        </p>

        <div className="hero-actions" style={{ justifyContent: 'center' }}>
          <MagneticLink to="/" className="btn btn-primary">
            Back to home
          </MagneticLink>
          <Link className="btn btn-ghost" to="/contact">
            Contact us
          </Link>
        </div>

        <div className="chip-row" style={{ justifyContent: 'center', marginTop: 30, maxWidth: 620 }}>
          {NAV.map((item) => (
            <Link className="chip" to={item.to} key={item.to}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
