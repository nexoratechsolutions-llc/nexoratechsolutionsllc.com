/**
 * Build-time only: renders a route to HTML for scripts/prerender.js.
 * Never shipped to the browser.
 */
import { StrictMode } from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Writable } from 'node:stream'
import App, { ROUTER_FUTURE } from './App'

export { ROUTES, NOT_FOUND, buildHeadTags, buildSitemap, buildRobots } from './lib/seo'
export { practiceFor } from './data/site'

/**
 * Waits for every lazy route chunk (onAllReady) so the output is the complete
 * page, with Suspense boundaries emitted inline — no streaming scripts, which
 * the CSP would block anyway.
 */
export function render(url) {
  return new Promise((resolve, reject) => {
    let html = ''
    let error = null
    const { pipe } = ReactDOMServer.renderToPipeableStream(
      <StrictMode>
        <StaticRouter location={url} future={ROUTER_FUTURE}>
          <App />
        </StaticRouter>
      </StrictMode>,
      {
        onAllReady() {
          const sink = new Writable({
            write(chunk, _enc, cb) {
              html += chunk.toString()
              cb()
            },
          })
          sink.on('finish', () => (error ? reject(error) : resolve(html)))
          pipe(sink)
        },
        onShellError: reject,
        onError(err) {
          error = err
        },
      }
    )
  })
}
