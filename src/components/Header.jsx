import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV } from '../data/site'
import { useTheme } from '../hooks/useTheme'
import { useScrolled, useScrollProgress } from '../hooks/useMotion'
import { Logo } from './Primitives'
import { Icon } from './Icons'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const scrolled = useScrolled(10)
  const progress = useScrollProgress()
  const location = useLocation()
  const panelRef = useRef(null)
  const burgerRef = useRef(null)

  // Close the drawer on navigation.
  useEffect(() => setOpen(false), [location.pathname])

  // Lock the page behind the drawer and restore focus on close.
  useEffect(() => {
    document.body.classList.toggle('nav-open', open)
    if (!open) return

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        burgerRef.current?.focus()
      }
      if (e.key !== 'Tab' || !panelRef.current) return

      const focusable = panelRef.current.querySelectorAll('a[href], button:not([disabled])')
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('nav-open')
    }
  }, [open])

  return (
    <>
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden
      />

      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        {/* Wider than the content container, so seven links plus the CTA fit. */}
        <div className="wrap wrap-wide nav">
          <Link className="brand" to="/" aria-label="Nexora TechSolutions — home">
            <Logo size={30} />
          </Link>

          <nav
            id="primary-nav"
            className={`nav-links${open ? ' open' : ''}`}
            ref={panelRef}
            aria-label="Primary"
          >
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {item.label}
              </NavLink>
            ))}
            <Link className="btn btn-primary" to="/contact">
              Start a Conversation
            </Link>
          </nav>

          <div className="nav-tools">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggle}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? Icon.sun(18) : Icon.moon(18)}
            </button>

            <button
              type="button"
              className="burger"
              ref={burgerRef}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="primary-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              <i aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <button
          type="button"
          className="nav-scrim"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}
