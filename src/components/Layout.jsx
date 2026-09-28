import { Suspense, useEffect, useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import PageLoader from './PageLoader'
import ErrorBoundary from './ErrorBoundary'
import { practiceFor } from '../data/site'
import { useRouteMeta } from '../hooks/useRouteMeta'

// useLayoutEffect warns during the build-time prerender; it is a no-op there anyway.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * Resets scroll on navigation (or scrolls to the #hash target) and moves focus
 * to the main region, so keyboard and screen-reader users start at the top of
 * the new page rather than wherever the previous one left them.
 */
function RouteChangeEffects() {
  const { pathname, hash } = useLocation()
  const first = useRef(true)

  useEffect(() => {
    const isFirst = first.current
    first.current = false

    if (hash) {
      // The target may be inside a lazily loaded page; retry briefly.
      let tries = 0
      let timer
      const seek = () => {
        const el = document.getElementById(decodeURIComponent(hash.slice(1)))
        if (el) el.scrollIntoView({ block: 'start' })
        else if (tries++ < 40) timer = setTimeout(seek, 50)
      }
      seek()
      return () => clearTimeout(timer)
    }

    if (isFirst) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname, hash])

  return null
}

export default function Layout() {
  const { pathname } = useLocation()
  const practice = practiceFor(pathname)

  useRouteMeta(pathname)

  // Medical pages swap the accent to green — before paint, so there is no flash.
  useIsoLayoutEffect(() => {
    const root = document.documentElement
    if (practice === 'medical') root.setAttribute('data-view', 'medical')
    else root.removeAttribute('data-view')
  }, [practice])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header practice={practice} />
      <RouteChangeEffects />
      <main id="main" tabIndex={-1}>
        <div className="page-enter" key={pathname}>
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
      <Footer practice={practice} />
    </>
  )
}
