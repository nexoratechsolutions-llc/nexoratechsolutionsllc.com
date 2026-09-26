import { useEffect } from 'react'

const SITE = 'Nexora TechSolutions'
const ORIGIN = 'https://www.nexoratechsolutions.com'

function setMeta(selector, attr, value) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    const [, key, name] = selector.match(/\[(\w+)="([^"]+)"\]/) || []
    if (key && name) el.setAttribute(key, name)
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Keeps <title>, the description and the social/canonical tags in step with
 * the active route. Also publishes optional JSON-LD for the page.
 *
 * @param {{title:string, description:string, path:string, jsonLd?:object}} meta
 */
export function useSeo({ title, description, path, jsonLd }) {
  useEffect(() => {
    const fullTitle = title === SITE ? title : `${title} — ${SITE}`
    const url = `${ORIGIN}${path}`

    document.title = fullTitle
    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[property="og:title"]', 'content', fullTitle)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('meta[name="twitter:title"]', 'content', fullTitle)
    setMeta('meta[name="twitter:description"]', 'content', description)
    setLink('canonical', url)

    let script = null
    if (jsonLd) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      // JSON.stringify output is inserted as text, never parsed as HTML.
      script.textContent = JSON.stringify(jsonLd)
      script.dataset.nexoraLd = 'route'
      document.head.appendChild(script)
    }

    return () => {
      if (script && script.parentNode) script.parentNode.removeChild(script)
    }
  }, [title, description, path, jsonLd])
}

/** Organization-level JSON-LD reused across the site. */
export const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Nexora TechSolutions LLC',
  url: ORIGIN,
  logo: `${ORIGIN}/favicon.svg`,
  description:
    'Technology consulting, AI enablement and delivery services — software development, DevOps, quality assurance, business analysis and the Nexora IMG Pathway.',
  foundingDate: '2026',
  email: 'minchu@nexoratechsolutionsllc.com',
  telephone: '+1-678-925-8885',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '11535 Park Woods Circle, Suite B',
    addressLocality: 'Alpharetta',
    addressRegion: 'GA',
    postalCode: '30005',
    addressCountry: 'US',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    telephone: '+1-678-925-8885',
    email: 'minchu@nexoratechsolutionsllc.com',
    areaServed: 'US',
    availableLanguage: 'English',
  },
  sameAs: [],
  areaServed: 'US',
}

export { ORIGIN, SITE }
