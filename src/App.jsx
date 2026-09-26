import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import CursorGlow from './components/CursorGlow'
import ErrorBoundary from './components/ErrorBoundary'
import PageLoader from './components/PageLoader'
import Home from './pages/Home'
import { useRevealObserver } from './hooks/useMotion'

const About = lazy(() => import('./pages/About'))
const Process = lazy(() => import('./pages/Process'))
const Services = lazy(() => import('./pages/Services'))
const AiSolutions = lazy(() => import('./pages/AiSolutions'))
const Consulting = lazy(() => import('./pages/Consulting'))
const ImgPathway = lazy(() => import('./pages/ImgPathway'))
const Careers = lazy(() => import('./pages/Careers'))
const Contact = lazy(() => import('./pages/Contact'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const NotFound = lazy(() => import('./pages/NotFound'))

/**
 * Resets scroll on navigation and moves focus to the main region, so keyboard
 * and screen-reader users land at the top of the new page rather than wherever
 * the previous one left them.
 */
function RouteChangeEffects() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname, hash])

  return null
}

export default function App() {
  const { pathname } = useLocation()
  useRevealObserver(pathname)

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <CursorGlow />
      <div className="grain" aria-hidden />

      <Header />
      <RouteChangeEffects />

      <main id="main" tabIndex={-1} className="page-enter" key={pathname}>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/process" element={<Process />} />
              <Route path="/services" element={<Services />} />
              <Route path="/ai-solutions" element={<AiSolutions />} />
              <Route path="/consulting" element={<Consulting />} />
              <Route path="/img-pathway" element={<ImgPathway />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />
    </>
  )
}
