/*
 * Runs before first paint.
 *
 * 1. Applies the theme, so there is no flash of the wrong one. Dark is the
 *    site's default; a visitor's explicit choice always wins over it.
 * 2. Promotes the web-font stylesheet from media="print" to media="all" once
 *    it has loaded. Declaring it as print keeps it off the critical path, so a
 *    slow or unreachable fonts.googleapis.com cannot stop the page painting.
 *
 * This lives in its own file rather than inline because the Content Security
 * Policy allows scripts only from 'self'.
 */
(function () {
  var theme = 'dark'
  try {
    var saved = localStorage.getItem('nexora-theme')
    if (saved === 'light' || saved === 'dark') theme = saved
  } catch {
    /* private mode or blocked storage — fall back to the default */
  }
  document.documentElement.setAttribute('data-theme', theme)

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
