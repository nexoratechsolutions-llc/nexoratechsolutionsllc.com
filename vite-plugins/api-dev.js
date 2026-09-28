import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

/**
 * Serves the Vercel functions in /api from the Vite dev and preview servers,
 * so the contact form works under `npm run dev` and `npm run preview` exactly
 * as it does on Vercel. Server-only env vars come from .env (see vite.config.js).
 */
export function apiDev() {
  const apiDir = path.resolve('api')

  const mount = (middlewares) =>
    middlewares.use(async (req, res, next) => {
      const url = (req.url || '').split('?')[0]
      if (!url.startsWith('/api/')) return next()

      const name = url.slice('/api/'.length).replace(/[^a-z0-9-]/gi, '')
      const file = path.join(apiDir, `${name}.js`)
      if (!name || !fs.existsSync(file)) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify({ ok: false, error: 'Not found' }))
      }

      try {
        // Cache-bust on file change so edits to the function apply without a restart.
        const mod = await import(`${pathToFileURL(file).href}?v=${fs.statSync(file).mtimeMs}`)
        await mod.default(req, res)
      } catch (err) {
        console.error(`[api-dev] /api/${name} failed:`, err)
        if (!res.headersSent) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: 'Server error' }))
        }
      }
    })

  return {
    name: 'nexora-api-dev',
    configureServer(server) {
      mount(server.middlewares)
    },
    configurePreviewServer(server) {
      mount(server.middlewares)
    },
  }
}
