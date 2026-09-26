import { Component } from 'react'
import { Link } from 'react-router-dom'
import { COMPANY } from '../data/site'

/**
 * Catches render errors in a route so a single broken page does not blank the
 * whole site. The error itself is logged, never shown to the visitor.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[nexora] Route render failed', error, info?.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <section className="wrap notfound">
        <p className="eyebrow">Something went wrong</p>
        <h1>This page did not load correctly.</h1>
        <p>
          The error has been logged. Try reloading, or reach us directly at{' '}
          <a href={`mailto:${COMPANY.email}`} style={{ color: 'var(--accent)' }}>
            {COMPANY.email}
          </a>
          .
        </p>
        <div className="hero-actions" style={{ justifyContent: 'center' }}>
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
            Reload the page
          </button>
          <Link className="btn btn-ghost" to="/">
            Back to home
          </Link>
        </div>
      </section>
    )
  }
}
