import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

/**
 * Serves the `api/` folder during `vite dev`, the way Vercel serves it in
 * production — so `npm run dev` gives you a working site *and* working forms
 * without needing the Vercel CLI running alongside it.
 *
 * `/api/contact` maps to `api/contact.js`, and its default export is called
 * with (req, res), matching the Vercel Node function signature.
 */
export function apiDevServer({ root = process.cwd(), dir = 'api' } = {}) {
  const apiRoot = path.resolve(root, dir)

  return {
    name: 'nexora:api-dev-server',
    apply: 'serve',

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || ''
        if (!url.startsWith('/api/')) return next()

        const route = url.split('?')[0].slice('/api/'.length).replace(/\/+$/, '')

        // Keep the request inside api/, and never expose the _lib helpers.
        const file = path.resolve(apiRoot, `${route}.js`)
        if (!file.startsWith(apiRoot + path.sep) || route.split('/').some((p) => p.startsWith('_'))) {
          res.statusCode = 404
          res.end(JSON.stringify({ ok: false, error: 'Not found.' }))
          return
        }

        if (!fs.existsSync(file)) return next()

        // Vercel adds these helpers to the Node response; the handlers use them.
        if (typeof res.status !== 'function') {
          res.status = (code) => {
            res.statusCode = code
            return res
          }
        }

        try {
          // Cache-bust so editing a handler takes effect without a restart.
          const mod = await import(`${pathToFileURL(file).href}?t=${Date.now()}`)
          const handler = mod.default
          if (typeof handler !== 'function') {
            throw new Error(`api/${route}.js has no default export`)
          }
          await handler(req, res)
        } catch (err) {
          server.config.logger.error(
            `[api-dev] /api/${route} threw: ${err?.stack || err}`,
            { timestamp: true }
          )
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
          }
          res.end(JSON.stringify({ ok: false, error: 'Internal error in the dev API handler.' }))
        }
      })

      const routes = fs.existsSync(apiRoot)
        ? fs
            .readdirSync(apiRoot)
            .filter((f) => f.endsWith('.js') && !f.startsWith('_'))
            .map((f) => `/api/${f.replace(/\.js$/, '')}`)
        : []

      server.config.logger.info(
        `  \x1b[32m➜\x1b[0m  \x1b[1mapi\x1b[0m:     ${routes.join(', ') || '(none found)'}`
      )
    },
  }
}
