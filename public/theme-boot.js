/*
 * Applies the theme before first paint so there is no flash.
 *
 * Dark is the site's default. A visitor's explicit choice, if they have made
 * one, always wins over that default.
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
})()
