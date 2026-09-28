import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import BrandMark from './BrandMark'
import ThemeToggle from './ThemeToggle'
import { ArrowRight } from './Icons'
import { PRACTICES } from '../data/site'

const DESKTOP_QUERY = '(min-width: 1181px)'

export default function Header({ practice }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const p = practice ? PRACTICES[practice] : null

  // Close the drawer whenever the route changes.
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape closes; the page behind stops scrolling while the drawer is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.documentElement.classList.add('menu-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('menu-open')
    }
  }, [open])

  // Growing the window past the breakpoint dismisses the mobile drawer.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY)
    const onChange = (e) => e.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <header className="site-header" data-scrolled={scrolled} data-practice={practice || 'none'}>
      <div className="wrap nav">
        <div className="nav-left">
          <Link className="brand" to="/" aria-label="Nexora TechSolutions — home">
            <BrandMark size={30} className="brand-mark" />
            <span className="brand-word">
              Nex<b>ora</b>
            </span>
          </Link>
          {p && (
            <nav className="practice-switch" aria-label="Practice">
              <NavLink to="/technical">Technical</NavLink>
              <NavLink to="/medical">Medical</NavLink>
            </nav>
          )}
        </div>

        {p && (
          <>
            <nav id="site-nav" className="links" aria-label={`${p.name} sections`} data-open={open}>
              {p.nav.map((item) => (
                <NavLink key={item.to} className="nav-link" to={item.to}>
                  {item.label}
                </NavLink>
              ))}
              <Link className="btn btn-primary nav-cta" to={p.cta.to}>
                {p.cta.label} <ArrowRight size={16} className="arrow" />
              </Link>
            </nav>
            <div className="nav-backdrop" data-open={open} onClick={() => setOpen(false)} aria-hidden="true" />
          </>
        )}

        <div className="nav-right">
          <ThemeToggle />
          {p && (
            <button
              type="button"
              className="icon-btn burger"
              aria-expanded={open}
              aria-controls="site-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              <i />
            </button>
          )}
        </div>
      </div>
      <div className="scroll-progress" aria-hidden="true" />
    </header>
  )
}
