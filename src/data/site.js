/**
 * Site-wide constants. Contact details and the production URL live here only,
 * so the header, footer, contact pages, SEO tags and sitemap stay in step.
 *
 * VITE_SITE_URL (set it in Vercel → Project → Environment Variables) overrides
 * the production origin used for canonical URLs, Open Graph and the sitemap.
 */
const envUrl = import.meta.env.VITE_SITE_URL

export const SITE = {
  name: 'Nexora TechSolutions',
  legalName: 'Nexora TechSolutions LLC',
  medicalName: 'Nexora Medical',
  url: (envUrl || 'https://www.nexoratechsolutionsllc.com').replace(/\/+$/, ''),
  email: 'minchu@nexoratechsolutionsllc.com',
  phone: '+1 (678) 925-8885',
  phoneHref: 'tel:+16789258885',
  phoneE164: '+1-678-925-8885',
  founded: '2026',
  tagline: 'Where connection becomes capability.',
  address: {
    street: '11535 Park Woods Circle',
    unit: 'Suite B',
    city: 'Alpharetta',
    region: 'GA',
    postalCode: '30005',
    country: 'United States',
    countryCode: 'US',
    /** Display lines, the way post is addressed. */
    lines: ['11535 Park Woods Circle, Suite B', 'Alpharetta, GA 30005', 'United States'],
    oneLine: '11535 Park Woods Circle, Suite B, Alpharetta, GA 30005, United States',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent('11535 Park Woods Circle, Suite B, Alpharetta, GA 30005'),
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=' +
      encodeURIComponent('11535 Park Woods Circle, Suite B, Alpharetta, GA 30005'),
    /**
     * Map iframe source: the official Maps Embed API when
     * VITE_GOOGLE_MAPS_EMBED_KEY is set, otherwise Google's keyless embed —
     * so the map works with no Google Cloud billing account.
     */
    get embedUrl() {
      const query = encodeURIComponent('11535 Park Woods Circle, Suite B, Alpharetta, GA 30005')
      const key = import.meta.env?.VITE_GOOGLE_MAPS_EMBED_KEY
      return key
        ? `https://www.google.com/maps/embed/v1/place?key=${key}&q=${query}&zoom=15`
        : `https://maps.google.com/maps?q=${query}&z=15&output=embed`
    },
  },
}

/**
 * Social profiles shown as icons in the footer.
 *
 * TODO: replace each url with the company's own profile page
 * (e.g. https://www.linkedin.com/company/<your-page>). A url that points at a
 * real profile (anything with a path) is also added to the Organization
 * "sameAs" list in the JSON-LD; the bare platform home pages are not.
 */
export const SOCIALS = [
  { key: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/' },
  { key: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/' },
  { key: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/' },
  { key: 'x', label: 'X (Twitter)', url: 'https://x.com/' },
  { key: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/' },
]

/** True when a social url points at a specific profile rather than a platform home page. */
export function isProfileUrl(url) {
  try {
    return new URL(url).pathname.replace(/\/+$/, '') !== ''
  } catch {
    return false
  }
}

export const PRACTICES = {
  technical: {
    key: 'technical',
    label: 'Technical',
    name: 'Nexora TechSolutions',
    base: '/technical',
    nav: [
      { to: '/technical/about', label: 'About' },
      { to: '/technical/process', label: 'Process' },
      { to: '/technical/services', label: 'Services' },
      { to: '/technical/ai-solutions', label: 'AI Solutions' },
      { to: '/technical/consulting', label: 'Consulting' },
    ],
    cta: { to: '/technical/contact', label: 'Start a Conversation' },
  },
  medical: {
    key: 'medical',
    label: 'Medical',
    name: 'Nexora Medical',
    base: '/medical',
    nav: [
      { to: '/medical/coaching', label: 'Coaching' },
      { to: '/medical/rotations', label: 'Rotations' },
      { to: '/medical/research', label: 'Research' },
      { to: '/medical/match', label: 'Match' },
      { to: '/medical/junior-scientist', label: 'Junior Scientist' },
    ],
    cta: { to: '/medical/contact', label: 'Book a Guidance Call' },
  },
}

/** Which practice a path belongs to, or null for the gateway and 404. */
export function practiceFor(pathname) {
  if (pathname === '/technical' || pathname.startsWith('/technical/')) return 'technical'
  if (pathname === '/medical' || pathname.startsWith('/medical/')) return 'medical'
  return null
}
