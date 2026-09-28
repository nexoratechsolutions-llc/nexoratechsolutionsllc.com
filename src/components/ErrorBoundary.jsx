import { Component } from 'react'

/**
 * Catches render errors — most often a route chunk that no longer exists
 * after a new deploy — and offers a reload instead of a blank page.
 */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <section className="notfound">
        <div className="wrap notfound-inner">
          <p className="eyebrow">Something went wrong</p>
          <h1>This page didn't load.</h1>
          <p className="lede">A newer version of the site may have been published. Reloading usually fixes it.</p>
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
            Reload the page
          </button>
        </div>
      </section>
    )
  }
}
