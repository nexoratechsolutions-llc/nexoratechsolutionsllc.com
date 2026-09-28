import { useCallback, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

const STORAGE_KEY = 'nexora-theme'
const THEME_COLORS = { dark: '#141109', light: '#F7F4EC' }

function readStored() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    // Private mode or blocked storage — fall back to the system preference.
    return null
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', THEME_COLORS[theme])
}

/**
 * Theme state backed by `data-theme` on <html>, which public/theme-boot.js
 * sets before first paint. Starts as null so the server-rendered markup and
 * the first client render agree; the real value is read right after mount.
 *
 * Until the visitor picks a theme, the site follows the OS setting live.
 */
export function useTheme() {
  const [theme, setTheme] = useState(null)

  useEffect(() => {
    const attr = document.documentElement.getAttribute('data-theme')
    setTheme(attr === 'light' || attr === 'dark' ? attr : 'light')

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (readStored()) return
      const next = mq.matches ? 'dark' : 'light'
      applyTheme(next)
      setTheme(next)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(
    (event) => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
      const next = current === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* non-fatal */
      }

      const commit = () => {
        applyTheme(next)
        flushSync(() => setTheme(next))
      }

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!document.startViewTransition || reduced) {
        commit()
        return
      }

      // Grow the new theme out of the toggle as a circle.
      const rect = event?.currentTarget?.getBoundingClientRect?.()
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 40
      const y = rect ? rect.top + rect.height / 2 : 40
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
      const root = document.documentElement.style
      root.setProperty('--vt-x', `${x}px`)
      root.setProperty('--vt-y', `${y}px`)
      root.setProperty('--vt-r', `${r}px`)
      document.startViewTransition(commit)
    },
    []
  )

  return { theme, toggle }
}
