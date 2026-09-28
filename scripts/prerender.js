/**
 * Static prerender — runs after `vite build` and the SSR build.
 *
 * For every route in src/lib/seo.js ROUTES it writes a complete HTML file into
 * dist/ (full page markup + that route's <head> SEO block), plus 404.html,
 * sitemap.xml and robots.txt. Vercel serves these directly (cleanUrls maps
 * /technical/about → technical/about.html) and serves 404.html with a real
 * 404 status for anything else.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

process.env.NODE_ENV = 'production'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const ssr = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8')

const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/
const ROOT_DIV = '<div id="root"></div>'
const HTML_OPEN = '<html lang="en">'
if (!SEO_BLOCK.test(template) || !template.includes(ROOT_DIV) || !template.includes(HTML_OPEN)) {
  throw new Error('prerender: dist/index.html is missing the seo markers, <html lang="en"> or an empty #root')
}

function page(route, urlPath, appHtml) {
  let html = template.replace(SEO_BLOCK, ssr.buildHeadTags(route))
  if (ssr.practiceFor(urlPath) === 'medical') {
    html = html.replace(HTML_OPEN, '<html lang="en" data-view="medical">')
  }
  return html.replace(ROOT_DIV, `<div id="root" data-route="${urlPath}">${appHtml}</div>`)
}

const fileFor = (p) => (p === '/' ? 'index.html' : `${p.slice(1)}.html`)

async function write(rel, content) {
  const file = path.join(dist, rel)
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, content, 'utf8')
}

const started = Date.now()

for (const route of ssr.ROUTES) {
  const appHtml = await ssr.render(route.path)
  if (!appHtml.includes('<h1')) throw new Error(`prerender: ${route.path} rendered without an <h1>`)
  await write(fileFor(route.path), page(route, route.path, appHtml))
  console.log(`  ✓ ${route.path.padEnd(28)} → ${fileFor(route.path)}`)
}

const notFoundHtml = await ssr.render(ssr.NOT_FOUND.path)
await write('404.html', page(ssr.NOT_FOUND, ssr.NOT_FOUND.path, notFoundHtml))
console.log(`  ✓ ${'(not found)'.padEnd(28)} → 404.html`)

// Generate admin shell for clean direct navigation & static hosting
const adminHead = '<title>Admin Portal | Nexora TechSolutions</title>\n  <meta name="robots" content="noindex, nofollow" />'
const adminHtml = template.replace(SEO_BLOCK, adminHead).replace(ROOT_DIV, '<div id="root" data-route="/admin"></div>')
await write('admin.html', adminHtml)
await write('admin/index.html', adminHtml)
console.log(`  ✓ ${'/admin'.padEnd(28)} → admin.html, admin/index.html`)

const today = new Date().toISOString().slice(0, 10)
await write('sitemap.xml', ssr.buildSitemap(today))
await write('robots.txt', ssr.buildRobots())
console.log(`  ✓ sitemap.xml (${ssr.ROUTES.length} URLs), robots.txt`)

await fs.rm(ssrDir, { recursive: true, force: true })
console.log(`\nPrerendered ${ssr.ROUTES.length + 1} pages in ${Date.now() - started}ms.`)
