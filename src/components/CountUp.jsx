import { useEffect, useMemo, useRef, useState } from 'react'
import { prefersReducedMotion, useIsoLayoutEffect, whenReady } from '../lib/motion'

/**
 * Splits a display value into literal text and numbers, so "25+", "9–12",
 * "6–8 mo" and "$4,000" all count up while keeping their symbols.
 */
function parse(value) {
  return String(value)
    .split(/(\d[\d,]*(?:\.\d+)?)/)
    .filter((s) => s !== '')
    .map((s) => {
      if (!/^\d/.test(s)) return { text: s }
      const clean = s.replace(/,/g, '')
      return {
        num: Number(clean),
        grouped: s.includes(','),
        decimals: clean.includes('.') ? clean.split('.')[1].length : 0,
      }
    })
}

function format(part, progress) {
  const n = part.num * progress
  if (part.decimals) return n.toFixed(part.decimals)
  const rounded = Math.round(n)
  return part.grouped ? rounded.toLocaleString('en-US') : String(rounded)
}

const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))

/**
 * Counts every number in `value` up from zero the first time it scrolls into
 * view. The server (and anyone with reduced motion) gets the final value, so
 * crawlers and no-JS visitors always see the real figure; a hidden copy of the
 * final value reserves its width so nothing shifts while it counts.
 */
export default function CountUp({ value, duration = 1800, className = '' }) {
  const parts = useMemo(() => parse(value), [value])
  const ref = useRef(null)
  const [progress, setProgress] = useState(1)

  // Drop to zero before the first paint; the count starts when it is seen.
  useIsoLayoutEffect(() => {
    if (!prefersReducedMotion()) setProgress(0)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setProgress(1)
      return
    }
    let raf = 0
    let alive = true
    const run = () => {
      const t0 = performance.now()
      const tick = (now) => {
        if (!alive) return
        const t = Math.min(1, (now - t0) / duration)
        setProgress(easeOutExpo(t))
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        whenReady().then(() => alive && run())
      },
      { threshold: 0.6 }
    )
    io.observe(el)
    return () => {
      alive = false
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [duration])

  return (
    <span ref={ref} className={`countup ${className}`.trim()} data-final={value}>
      <span>{parts.map((p, i) => (p.text !== undefined ? p.text : <span key={i}>{format(p, progress)}</span>))}</span>
    </span>
  )
}
