import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

import './styles/tokens.css'
import './styles/components.css'
import './styles/effects.css'

/**
 * Dismisses the boot loader that index.html paints before this bundle runs.
 *
 * Waits for the frame after React's first paint, so the loader never lifts to
 * reveal an unstyled or half-drawn page.
 */
function dismissBootLoader() {
  const el = document.getElementById('boot-loader')
  if (!el) return

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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

dismissBootLoader()
