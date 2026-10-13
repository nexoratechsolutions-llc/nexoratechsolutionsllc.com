import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import { ArrowRight } from './Icons'
import { HOME, PRACTICES } from '../data/site'

const DESKTOP_QUERY = '(min-width: 1301px)'

export default function Header({ practice }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [drawerTop, setDrawerTop] = useState(null)
  const headerRef = useRef(null)
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

  // The drawer opens under the header's real bottom edge, which sits lower
  // while the utility bar above it is still on screen.
  const measureDrawerTop = () => {
    const el = headerRef.current
    if (el) setDrawerTop(Math.round(el.getBoundingClientRect().bottom))
  }
  useEffect(() => {
    if (!open) return
    window.addEventListener('resize', measureDrawerTop)
    return () => window.removeEventListener('resize', measureDrawerTop)
  }, [open])

  // Growing the window past the breakpoint dismisses the mobile drawer.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY)
    const onChange = (e) => e.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Landing page and 404 show the landing sections; a service shows its own pages.
  const links = p
    ? p.nav.map((item) => (
        <NavLink key={item.to} className="nav-link" to={item.to}>
          {item.label}
        </NavLink>
      ))
    : HOME.nav.map((item) => (
        <Link key={item.href} className="nav-link" to={`/${item.href}`}>
          {item.label}
        </Link>
      ))
  const cta = p ? { to: p.cta.to, label: p.cta.label } : { to: `/${HOME.cta.href}`, label: HOME.cta.label }

  return (
    <header
      ref={headerRef}
      className="site-header"
      data-scrolled={scrolled}
      data-practice={practice || 'none'}
      style={drawerTop == null ? undefined : { '--drawer-top': `${drawerTop}px` }}
    >
      <div className="wrap nav">
        <div className="nav-left">
          <Link className="brand" to="/" aria-label="Nexora TechSolutions — home">
            <Logo height={34} compact />
          </Link>
          <nav className="practice-switch" aria-label="Nexora services">
            <NavLink to="/technical">
              <span className="n">1</span>Technical
            </NavLink>
            <NavLink to="/medical">
              <span className="n">2</span>Medical
            </NavLink>
          </nav>
        </div>

        <nav id="site-nav" className="links" aria-label={`${p ? p.name : HOME.name} sections`} data-open={open}>
          {links}
          <Link className="btn btn-primary nav-cta" to={cta.to}>
            {cta.label} <ArrowRight size={16} className="arrow" />
          </Link>
        </nav>
        <div className="nav-backdrop" data-open={open} onClick={() => setOpen(false)} aria-hidden="true" />

        <div className="nav-right">
          <ThemeToggle />
          <button
            type="button"
            className="icon-btn burger"
            aria-expanded={open}
            aria-controls="site-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => {
              measureDrawerTop()
              setOpen((o) => !o)
            }}
          >
            <i />
          </button>
        </div>
      </div>
      <div className="scroll-progress" aria-hidden="true" />
    </header>
  )
}
