import { useEffect, useLayoutEffect } from 'react'

/** useLayoutEffect in the browser, useEffect during the build-time prerender (where it would warn). */
export const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Resolves once the boot loader has started lifting.
 *
 * public/theme-boot.js adds `booting` to <html> before first paint and
 * main.jsx removes it as the loader fades. While it is present, CSS pauses
 * every animation in the app, and count-ups wait here — so first-screen
 * effects play for the visitor instead of behind the loader.
 */
export function whenReady() {
  const root = document.documentElement
  if (!root.classList.contains('booting')) return Promise.resolve()
  return new Promise((resolve) => {
    const mo = new MutationObserver(() => {
      if (!root.classList.contains('booting')) {
        mo.disconnect()
        resolve()
      }
    })
    mo.observe(root, { attributes: true, attributeFilter: ['class'] })
  })
}
