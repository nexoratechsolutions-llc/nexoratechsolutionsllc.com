import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Gateway from './pages/Gateway'
import PageLoader from './components/PageLoader'

const AdminPage = lazy(() => import('./pages/admin/AdminPage'))

const TechHome = lazy(() => import('./pages/technical/TechHome'))
const About = lazy(() => import('./pages/technical/About'))
const Process = lazy(() => import('./pages/technical/Process'))
const Services = lazy(() => import('./pages/technical/Services'))
const AiSolutions = lazy(() => import('./pages/technical/AiSolutions'))
const Consulting = lazy(() => import('./pages/technical/Consulting'))
const TechContact = lazy(() => import('./pages/technical/Contact'))

const MedHome = lazy(() => import('./pages/medical/MedHome'))
const Coaching = lazy(() => import('./pages/medical/Coaching'))
const Rotations = lazy(() => import('./pages/medical/Rotations'))
const Research = lazy(() => import('./pages/medical/Research'))
const Match = lazy(() => import('./pages/medical/Match'))
const JuniorScientist = lazy(() => import('./pages/medical/JuniorScientist'))
const Faq = lazy(() => import('./pages/medical/Faq'))
const MedContact = lazy(() => import('./pages/medical/Contact'))

const NotFound = lazy(() => import('./pages/NotFound'))

/** React Router v7 behaviours, opted into now; shared by the browser and prerender routers. */
export const ROUTER_FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true }

/* Every path here needs a matching entry in src/lib/seo.js (ROUTES). */
export default function App() {
  return (
    <Routes>
      <Route
        path="admin"
        element={
          <Suspense fallback={<PageLoader label="Loading admin portal" />}>
            <AdminPage />
          </Suspense>
        }
      />
      <Route
        path="admin/login"
        element={
          <Suspense fallback={<PageLoader label="Loading admin portal" />}>
            <AdminPage />
          </Suspense>
        }
      />

      <Route element={<Layout />}>
        <Route index element={<Gateway />} />

        <Route path="technical">
          <Route index element={<TechHome />} />
          <Route path="about" element={<About />} />
          <Route path="process" element={<Process />} />
          <Route path="services" element={<Services />} />
          <Route path="ai-solutions" element={<AiSolutions />} />
          <Route path="consulting" element={<Consulting />} />
          <Route path="contact" element={<TechContact />} />
        </Route>

        <Route path="medical">
          <Route index element={<MedHome />} />
          <Route path="coaching" element={<Coaching />} />
          <Route path="rotations" element={<Rotations />} />
          <Route path="research" element={<Research />} />
          <Route path="match" element={<Match />} />
          <Route path="junior-scientist" element={<JuniorScientist />} />
          <Route path="faq" element={<Faq />} />
          <Route path="contact" element={<MedContact />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
