import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

import './styles/tokens.css'
import './styles/components.css'
import './styles/effects.css'

/**
 * How long the boot loader stays on screen at minimum, measured from when the
 * page started loading.
 *
 * Without this the loader is invisible in practice: on a warm cache or over
 * localhost the app mounts in well under 100ms, so the loader would appear and
 * vanish inside a single frame. A floor makes it a deliberate moment rather
 * than a flicker, and costs nothing on slow connections where the app takes
 * longer than the floor anyway.
 */
const MIN_VISIBLE_MS = 1500

/**
 * Dismisses the boot loader that index.html paints before this bundle runs.
 *
 * Waits for the frame after React's first paint, so the loader never lifts to
 * reveal an unstyled or half-drawn page.
 */
function dismissBootLoader() {
  const el = document.getElementById('boot-loader')
  if (!el) return

  const fadeOut = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add('is-done')
        // Matches the CSS fade; removing the node frees the fixed overlay.
        const done = () => el.remove()
        el.addEventListener('transitionend', done, { once: true })
        // Belt and braces — if the transition never fires (reduced motion,
        // background tab), drop it anyway rather than trapping the page.
        setTimeout(done, 800)
      })
    })
  }

  // performance.now() is milliseconds since this page began loading, so the
  // remaining wait accounts for however long the bundle already took.
  setTimeout(fadeOut, Math.max(0, MIN_VISIBLE_MS - performance.now()))
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

dismissBootLoader()
