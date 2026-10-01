/*
 * Runs before first paint.
 *
 * 1. Applies the theme, so there is no flash of the wrong one. A visitor's
 *    saved choice wins; otherwise the operating-system setting is used.
 * 2. Marks the service (technical / medical) so the accent colour is right from the first frame.
 * 3. Promotes the web-font stylesheet from media="print" to media="all" once
 *    it has loaded. Declaring it as print keeps it off the critical path, so a
 *    slow or unreachable fonts.googleapis.com cannot stop the page painting.
 *
 * This lives in its own file rather than inline because the Content Security
 * Policy allows scripts only from 'self'.
 */
(function () {
  var root = document.documentElement
  var theme = null
  try {
    var saved = localStorage.getItem('nexora-theme')
    if (saved === 'light' || saved === 'dark') theme = saved
  } catch (e) {
    /* private mode or blocked storage — fall back to the system setting */
  }
  if (!theme) {
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    theme = prefersDark ? 'dark' : 'light'
  }
  root.setAttribute('data-theme', theme)
  // Held until the boot loader lifts (main.jsx), so entrance effects play in view.
  root.classList.add('booting')

  var meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0A0F1A' : '#F8FAFD')

  var view = location.pathname.match(/^\/(technical|medical)(\/|$)/)
  if (view) root.setAttribute('data-view', view[1])

  var fonts = document.getElementById('gfonts')
  if (!fonts) return

  var enable = function () {
    fonts.media = 'all'
  }

  // `sheet` is populated once the stylesheet has parsed, which may already
  // have happened if it came from cache.
  if (fonts.sheet) enable()
  else {
    fonts.addEventListener('load', enable, { once: true })
    // If it never loads, the site simply uses its fallback fonts.
    fonts.addEventListener('error', function () {}, { once: true })
  }
})()
