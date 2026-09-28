/**
 * Regenerates the social card and app icons in public/ from the templates in
 * this folder, using a locally installed Chrome or Edge in headless mode.
 *
 *   node scripts/brand/render.mjs
 *
 * Set CHROME_PATH if the browser is somewhere unusual. Needs internet access
 * for the Google Fonts used on the social cards.
 */
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const pub = path.resolve(here, '..', '..', 'public')

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)
const chrome = candidates.find((p) => existsSync(p))
if (!chrome) throw new Error('No Chrome/Edge found — set CHROME_PATH.')

function shot(template, query, out, w, h) {
  const url = pathToFileURL(path.join(here, template)).href + query
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--window-size=${w},${h}`,
    '--virtual-time-budget=6000',
    `--screenshot=${path.join(pub, out)}`,
    url,
  ])
  console.log(`  ✓ public/${out} (${w}×${h})`)
}

const host = (process.env.VITE_SITE_URL || 'https://www.nexoratechsolutionsllc.com').replace(/^https?:\/\/(www\.)?/, '').replace(/\/+$/, '')
shot('og.html', `?technical&host=${encodeURIComponent(host)}`, 'og-technical.png', 1200, 630)
shot('og.html', `?medical&host=${encodeURIComponent(host)}`, 'og-medical.png', 1200, 630)
shot('icon.html', '?size=512', 'icon-512.png', 512, 512)
shot('icon.html', '?size=192', 'icon-192.png', 192, 192)
shot('icon.html', '?size=180', 'apple-touch-icon.png', 180, 180)
