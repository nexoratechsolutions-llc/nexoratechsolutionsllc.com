import { useEffect, useRef, useState, useCallback } from 'react'

/** True when the visitor has asked for reduced motion. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

const REVEAL_SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .rule-grow'

/**
 * Adds `.in` to every `.reveal*` element once it scrolls into view.
 *
 * Re-runs when `key` changes (route navigation) and also watches the DOM, so
 * elements from a lazily loaded route chunk are picked up when they mount.
 */
export function useRevealObserver(key) {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => el.classList.add('in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    const observeAll = (root) => {
      if (root.matches?.(REVEAL_SELECTOR)) io.observe(root)
      root.querySelectorAll?.(REVEAL_SELECTOR).forEach((el) => io.observe(el))
    }

    observeAll(document.body)

    const mo = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) observeAll(node)
        })
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [key])
}

/** Pulls an element gently toward the cursor. Returns a ref to attach. */
export function useMagnetic(strength = 0.28) {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let frame = 0

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - (rect.left + rect.width / 2)
      const y = e.clientY - (rect.top + rect.height / 2)
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
      })
    }

    const onLeave = () => {
      cancelAnimationFrame(frame)
      el.style.transform = ''
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [strength, reduced])

  return ref
}

/**
 * Tracks the cursor inside a card and exposes it as --mx/--my custom
 * properties, which the CSS turns into a radial highlight.
 */
export function useSpotlight() {
  return useCallback((e) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }, [])
}

/**
 * Counts from 0 to `target` once the element enters the viewport.
 * @returns {[React.RefObject, number]}
 */
export function useCountUp(target, duration = 1400) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (reduced || !('IntersectionObserver' in window)) {
      setValue(target)
      return
    }

    let raf = 0
    let guard = 0

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        io.disconnect()

        const start = performance.now()
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration)
          // easeOutExpo — fast start, settled finish
          const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
          setValue(Math.round(eased * target))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)

        // If rAF is throttled or never fires (background tab, some headless
        // and low-power modes), snap to the real number rather than show 0.
        guard = setTimeout(() => setValue(target), duration + 400)
      },
      { threshold: 0.4 }
    )

    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      clearTimeout(guard)
    }
  }, [target, duration, reduced])

  return [ref, value]
}

/** 3D tilt on hover for a card. */
export function useTilt(max = 7) {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let frame = 0

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg) translateZ(0)`
      })
    }

    const onLeave = () => {
      cancelAnimationFrame(frame)
      el.style.transform = ''
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [max, reduced])

  return ref
}

/** Window scroll position as a 0–1 fraction of scrollable height. */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return progress
}

/** True once the page has scrolled past `offset` pixels. */
export function useScrolled(offset = 12) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset])

  return scrolled
}
