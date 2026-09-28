import { useEffect } from 'react'
import { buildJsonLd, findRoute, metaFor, safeJson } from '../lib/seo'

function setTag(selector, create, attr, value) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

const metaByName = (name, value) =>
  setTag(`meta[name="${name}"]`, () => Object.assign(document.createElement('meta'), { name }), 'content', value)

const metaByProperty = (property, value) =>
  setTag(
    `meta[property="${property}"]`,
    () => {
      const m = document.createElement('meta')
      m.setAttribute('property', property)
      return m
    },
    'content',
    value
  )

/**
 * Keeps <title>, description, canonical, Open Graph, Twitter and JSON-LD in
 * step with client-side navigation. The first page load already has all of
 * these from the prerendered HTML; this covers every route change after it.
 */
export function useRouteMeta(pathname) {
  useEffect(() => {
    const route = findRoute(pathname)
    const m = metaFor(route)

    document.title = m.title
    metaByName('description', m.description)
    metaByName('robots', m.robots)
    metaByProperty('og:title', m.title)
    metaByProperty('og:description', m.description)
    metaByProperty('og:url', m.canonical)
    metaByProperty('og:site_name', m.siteName)
    metaByProperty('og:image', m.image)
    metaByProperty('og:image:alt', m.imageAlt)
    metaByName('twitter:title', m.title)
    metaByName('twitter:description', m.description)
    metaByName('twitter:image', m.image)

    const canonical = document.head.querySelector('link[rel="canonical"]')
    if (route.noindex) canonical?.remove()
    else
      setTag(
        'link[rel="canonical"]',
        () => Object.assign(document.createElement('link'), { rel: 'canonical' }),
        'href',
        m.canonical
      )

    let ld = document.getElementById('ld-json')
    if (!ld) {
      ld = Object.assign(document.createElement('script'), { type: 'application/ld+json', id: 'ld-json' })
      document.head.appendChild(ld)
    }
    ld.textContent = safeJson(buildJsonLd(route))
  }, [pathname])
}
