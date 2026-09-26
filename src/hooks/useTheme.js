import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'nexora-theme'

function readStored() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    // Private mode or blocked storage — fall back to the system preference.
    return null
  }
}

/** The site ships dark; a visitor's saved choice overrides it. */
const DEFAULT_THEME = 'dark'

/**
 * Theme state backed by `data-theme` on <html>. Matches public/theme-boot.js,
 * which applies the same value before first paint to avoid a flash.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => readStored() || DEFAULT_THEME)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* non-fatal */
    }

    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#141109' : '#F7F4EC')
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  return { theme, toggle }
}
