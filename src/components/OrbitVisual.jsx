import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../hooks/useMotion'

/**
 * The hero constellation: two counter-rotating rings, drawn beams and pulsing
 * nodes, with a subtle parallax tilt that follows the pointer.
 */
export default function OrbitVisual() {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let raf = 0
    const onMove = (e) => {
      const px = e.clientX / window.innerWidth - 0.5
      const py = e.clientY / window.innerHeight - 0.5
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(1000px) rotateY(${px * 9}deg) rotateX(${-py * 9}deg)`
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [reduced])

  return (
    <div className="orbit-wrap" ref={ref} aria-hidden>
      <svg viewBox="0 0 400 400" role="presentation">
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity=".35" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="200" r="120" fill="url(#coreGlow)" />

        <g className="orbit-ring" style={{ transformOrigin: '200px 200px' }}>
          <circle cx="200" cy="200" r="150" stroke="var(--line)" strokeWidth="1" fill="none" />
          <circle cx="350" cy="200" r="3.5" fill="var(--accent2)" opacity=".7" />
        </g>

        <g className="orbit-ring rev" style={{ transformOrigin: '200px 200px' }}>
          <circle
            cx="200"
            cy="200"
            r="105"
            stroke="var(--line-strong)"
            strokeWidth="1"
            fill="none"
            className="orbit-dash"
          />
        </g>

        <g className="orbit-ring" style={{ transformOrigin: '200px 200px', animationDuration: '92s' }}>
          <circle cx="200" cy="200" r="186" stroke="var(--line)" strokeWidth="1" fill="none" opacity=".55" />
          <circle cx="200" cy="14" r="2.5" fill="var(--accent)" opacity=".6" />
        </g>

        <line x1="200" y1="200" x2="200" y2="60" stroke="var(--accent)" strokeWidth="1" opacity=".5" className="beam" />
        <line x1="200" y1="200" x2="320" y2="270" stroke="var(--accent2)" strokeWidth="1" opacity=".5" className="beam b2" />
        <line x1="200" y1="200" x2="90" y2="280" stroke="var(--ink-faint)" strokeWidth="1" opacity=".5" className="beam b3" />
        <line x1="200" y1="200" x2="300" y2="130" stroke="var(--ink-faint)" strokeWidth="1" opacity=".4" className="beam b4" />

        <circle cx="200" cy="200" r="9" fill="var(--ink)" />
        <circle className="node-pulse d1" cx="200" cy="60" r="6" fill="var(--accent)" />
        <circle className="node-pulse d2" cx="320" cy="270" r="6" fill="var(--accent2)" />
        <circle className="node-pulse d3" cx="90" cy="280" r="6" fill="var(--ink-faint)" />
        <circle className="node-pulse d4" cx="300" cy="130" r="6" fill="var(--accent)" />

        <text x="200" y="66" fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-faint)" textAnchor="middle" dy="-14">
          DISCOVER
        </text>
        <text x="330" y="272" fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-faint)" dy="20" textAnchor="middle">
          BUILD
        </text>
        <text x="90" y="284" fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-faint)" dy="22" textAnchor="middle">
          TEST
        </text>
        <text x="302" y="128" fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-faint)" dy="-14" textAnchor="middle">
          SCALE
        </text>
      </svg>
    </div>
  )
}
