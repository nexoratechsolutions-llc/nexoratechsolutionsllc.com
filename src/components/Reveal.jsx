import { useEffect, useRef, useState } from 'react'

/*
 * One IntersectionObserver shared by every Reveal on the page, so a long page
 * does not spin up dozens of observers. Each element registers its own
 * callback and is dropped once it has been revealed.
 */
let observer = null
const callbacks = new WeakMap()

function getObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        callbacks.get(entry.target)?.()
        callbacks.delete(entry.target)
        observer.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0 }
  )
  return observer
}

/**
 * Scroll-triggered entrance ("wow") effect, played the first time the element
 * scrolls into view.
 *
 *   effect   up | down | left | right | zoom | flip | blur | split
 *            (split: odd children come in from the left, even from the right)
 *   stagger  animate the direct children one after another instead of the
 *            element as a whole — for card grids, lists and steppers
 *   delay    extra delay in ms before it starts
 *
 * The keyframes live in base.css. Reduced-motion visitors get no animation.
 */
export default function Reveal({
  as: Tag = 'div',
  effect = 'up',
  stagger = false,
  className = '',
  delay,
  style,
  children,
  ...rest
}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = getObserver()
    if (!io) {
      setShown(true)
      return
    }
    callbacks.set(el, () => setShown(true))
    io.observe(el)
    return () => {
      callbacks.delete(el)
      io.unobserve(el)
    }
  }, [])

  const cls = ['reveal', `wow-${effect}`, stagger && 'stagger', shown && 'in', className].filter(Boolean).join(' ')
  const st = delay ? { ...style, '--d': `${delay}ms` } : style

  return (
    <Tag ref={ref} className={cls} style={st} {...rest}>
      {children}
    </Tag>
  )
}
