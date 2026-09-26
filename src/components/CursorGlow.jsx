import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../hooks/useMotion'

/**
 * A soft accent-coloured light that trails the cursor. Pointer devices only,
 * and disabled entirely under reduced-motion.
 */
export default function CursorGlow() {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y
    let raf = 0

    const loop = () => {
      // Lerp toward the pointer so the light lags a touch behind it.
      x += (tx - x) * 0.12
      y += (ty - y) * 0.12
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }

    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      el.classList.add('on')
    }
    const onLeave = () => el.classList.remove('on')

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [reduced])

  if (reduced) return null
  return <div className="cursor-glow" ref={ref} aria-hidden />
}
