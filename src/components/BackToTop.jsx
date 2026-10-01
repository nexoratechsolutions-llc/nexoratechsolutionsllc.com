import { useEffect, useState } from 'react'

/** Round "back to top" button that appears after scrolling down a screen or so. */
export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      className="to-top"
      data-show={show}
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
    >
      <span aria-hidden="true">↑</span>
    </button>
  )
}
