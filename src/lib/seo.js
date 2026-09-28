/**
 * Search and social metadata — the single source of truth.
 *
 * Used twice:
 *  - at build time by scripts/prerender.js, which writes each route's <head>
 *    (title, description, canonical, Open Graph, Twitter, JSON-LD) into its
 *    static HTML file and generates sitemap.xml and robots.txt from ROUTES;
 *  - at runtime by useRouteMeta, which keeps the same tags current as the
 *    visitor navigates client-side.
 *
 * Adding a page: add its <Route> in App.jsx and an entry here. The sitemap,
 * prerendered file and breadcrumbs follow automatically.
 */
import { SITE, SOCIALS, isProfileUrl } from '../data/site'
import { services, industries } from '../data/technical'
import {
  faqs,
  juniorPrice,
  coachingPrograms,
  researchPrograms,
  matchPrograms,
  rotationPrograms,
} from '../data/medical'

const OG_IMAGES = {
  technical: { path: '/og-technical.png', alt: 'Nexora TechSolutions — software, AI and cloud delivery' },
  medical: { path: '/og-medical.png', alt: 'Nexora Medical — USMLE, research and residency Match support' },
}

const ORG_ID = `${SITE.url}/#organization`
const WEBSITE_ID = `${SITE.url}/#website`

const provider = { '@id': ORG_ID }

const serviceNode = (name, description, extra = {}) => ({
  '@type': 'Service',
  name,
  serviceType: name,
  description,
  provider,
  ...extra,
})

const courseNode = (name, description, extra = {}) => ({
  '@type': 'Course',
  name,
  description,
  provider,
  inLanguage: 'en',
  ...extra,
})

export const ROUTES = [
  {
    path: '/',
    crumb: 'Home',
    og: 'technical',
    priority: '1.0',
    changefreq: 'monthly',
    title: 'Nexora TechSolutions LLC | Technology & Medical Education',
    description:
      'Two practices, one standard of delivery: software, AI, QA, DevOps and SAFe® training for businesses, plus USMLE coaching, research and Match support for IMGs.',
  },

  /* ---------------- Technical ---------------- */
  {
    path: '/technical',
    crumb: 'Technical',
    og: 'technical',
    priority: '0.9',
    changefreq: 'monthly',
    title: 'Software, AI & Cloud Delivery | Nexora TechSolutions',
    description:
      'We design, build and run software, AI and cloud systems — end-to-end delivery from discovery through scale, backed by 25+ years of combined team expertise.',
  },
  {
    path: '/technical/about',
    crumb: 'About',
    og: 'technical',
    pageType: 'AboutPage',
    priority: '0.7',
    changefreq: 'yearly',
    title: 'About Us | Nexora TechSolutions',
    description:
      'Nexora TechSolutions LLC specializes in software development, AI-driven solutions and business process optimization, delivered by an experienced, certified team.',
  },
  {
    path: '/technical/process',
    crumb: 'Process',
    og: 'technical',
    priority: '0.7',
    changefreq: 'yearly',
    title: 'Our Delivery Process | Nexora TechSolutions',
    description:
      'A five-phase iterative delivery cycle — discovery, design, development, testing and deployment — with Agile and DevOps built in and client feedback at every step.',
  },
  {
    path: '/technical/services',
    crumb: 'Services',
    og: 'technical',
    priority: '0.8',
    changefreq: 'monthly',
    title: 'Software, QA, DevOps & AI Services | Nexora TechSolutions',
    description:
      'Full-lifecycle capabilities: full-stack software development, quality assurance, DevOps and cloud, AI and automation, business analysis, training and staffing.',
    schema: () => services.map((s) => serviceNode(s.title, s.text)),
  },
  {
    path: '/technical/ai-solutions',
    crumb: 'AI Solutions',
    og: 'technical',
    priority: '0.8',
    changefreq: 'monthly',
    title: 'AI Agents & Generative AI Solutions | Nexora TechSolutions',
    description:
      'AI agents and generative AI built on AWS, Azure and Google Cloud with TensorFlow, PyTorch, OpenAI and LangChain — for healthcare, finance, retail and more.',
    schema: () => [
      serviceNode(
        'AI agents & generative AI solutions',
        'Custom AI agents, chatbots and generative AI solutions deployed on AWS, Azure and Google Cloud.',
        { audience: industries.map((i) => ({ '@type': 'BusinessAudience', audienceType: i.title })) }
      ),
    ],
  },
  {
    path: '/technical/consulting',
    crumb: 'Consulting',
    og: 'technical',
    priority: '0.7',
    changefreq: 'monthly',
    title: 'Consulting & SAFe® Training | Nexora TechSolutions',
    description:
      'Business analysis, project and product management consulting, SAFe®-certified program training, and IT staffing that builds lasting in-house capability.',
    schema: () => [
      serviceNode('Business analysis, project & product management consulting', 'Certified delivery leadership under Agile, SAFe, Scrum and Lean.'),
      courseNode('SAFe® & PMP program and project management training', 'Hands-on training led by certified SAFe experts, covering the end-to-end project lifecycle, enterprise agility, strategic planning and risk assessment.'),
      serviceNode('Training & staffing solutions', 'Specialized training across IT, AI, Business Analysis, HR and Project Management, with end-to-end recruitment and workforce management.'),
    ],
  },
  {
    path: '/technical/contact',
    crumb: 'Contact',
    og: 'technical',
    pageType: 'ContactPage',
    priority: '0.6',
    changefreq: 'yearly',
    title: 'Contact Us | Nexora TechSolutions',
    description:
      'Start a conversation with Nexora TechSolutions about software development, AI, QA automation, DevOps, consulting or training. Email or call us today.',
  },

  /* ---------------- Medical ---------------- */
  {
    path: '/medical',
    crumb: 'Medical',
    og: 'medical',
    priority: '0.9',
    changefreq: 'monthly',
    title: 'USMLE, Research & Residency Match for IMGs | Nexora Medical',
    description:
      'USMLE Step 1, Step 2 CK and Step 3 coaching, U.S. clinical rotations, mentored research and end-to-end residency Match support for international medical graduates.',
  },
  {
    path: '/medical/coaching',
    crumb: 'USMLE Coaching',
    og: 'medical',
    priority: '0.8',
    changefreq: 'monthly',
    title: 'USMLE Step 1, Step 2 CK & Step 3 Coaching | Nexora Medical',
    description:
      'Crash courses, six-month mastery programs, NBME-style coaching and one-on-one tutoring for USMLE Step 1, Step 2 CK and Step 3 — paced to your timeline.',
    schema: () => coachingPrograms.map((p) => courseNode(p.title, p.text)),
  },
  {
    path: '/medical/rotations',
    crumb: 'Clinical Rotations',
    og: 'medical',
    priority: '0.7',
    changefreq: 'monthly',
    title: 'U.S. Clinical Rotations & LORs for IMGs | Nexora Medical',
    description:
      'Hands-on U.S. clinical experience — externships, clerkships and observerships — placed early enough to count, with guidance on earning strong letters.',
    schema: () => rotationPrograms.map((p) => serviceNode(p.title, p.text)),
  },
  {
    path: '/medical/research',
    crumb: 'Research',
    og: 'medical',
    priority: '0.8',
    changefreq: 'monthly',
    title: 'Medical Research & Publications for IMGs | Nexora Medical',
    description:
      'Mentored medical research from first co-authorship to a 12-month fellowship: Research Catalyst, original research, publication support and J-1 placement.',
    schema: () => researchPrograms.map((p) => courseNode(p.title, p.text)),
  },
  {
    path: '/medical/match',
    crumb: 'Residency Match',
    og: 'medical',
    priority: '0.8',
    changefreq: 'monthly',
    title: 'Residency Match Support: ERAS to SOAP | Nexora Medical',
    description:
      'End-to-end residency application support — ERAS CV, personal statement, LOR editing, interview preparation, program signaling and real-time SOAP guidance.',
    schema: () => matchPrograms.map((p) => serviceNode(p.title, p.text)),
  },
  {
    path: '/medical/junior-scientist',
    crumb: 'Junior Scientist Program',
    og: 'medical',
    priority: '0.8',
    changefreq: 'monthly',
    title: 'Junior Scientist: Research for High Schoolers | Nexora Medical',
    description:
      'Mentored medical research for grades 9–12. A physician-researcher guides your child through a real study, weekly — with a one-month trial and refundable deposit.',
    schema: () => [
      courseNode(
        'Junior Scientist Program',
        'A year of mentored medical research for high-school students: reading papers, judging evidence, study design, data, ethics, AI use, writing and presenting.',
        {
          educationalLevel: 'High school (grades 9–12)',
          teaches: [
            'Reading scientific papers',
            'Evaluating evidence',
            'Study design',
            'Data handling and statistics',
            'Research ethics',
            'Scientific writing',
            'Presenting research',
          ],
          offers: {
            '@type': 'Offer',
            category: 'Paid',
            price: String(juniorPrice.amount),
            priceCurrency: juniorPrice.currency,
            url: `${SITE.url}/medical/junior-scientist`,
          },
          hasCourseInstance: {
            '@type': 'CourseInstance',
            courseMode: 'Online',
            courseSchedule: { '@type': 'Schedule', repeatFrequency: 'P1W', duration: 'PT2H' },
          },
        }
      ),
    ],
  },
  {
    path: '/medical/faq',
    crumb: 'FAQ',
    og: 'medical',
    pageType: 'FAQPage',
    priority: '0.6',
    changefreq: 'monthly',
    title: 'Frequently Asked Questions | Nexora Medical',
    description:
      'Answers about USMLE coaching, residency Match support, single program tracks, the Junior Scientist Program, time commitment, publication and online sessions.',
    // FAQPage content is attached to the page node itself (see buildJsonLd).
    faq: faqs,
  },
  {
    path: '/medical/contact',
    crumb: 'Book a Guidance Call',
    og: 'medical',
    pageType: 'ContactPage',
    priority: '0.6',
    changefreq: 'yearly',
    title: 'Book a Free Guidance Call | Nexora Medical',
    description:
      'Book a free, no-obligation guidance call for an honest read of your USMLE, research and residency timeline — and which programs are worth it for you.',
  },
]

export const NOT_FOUND = {
  path: '/404',
  crumb: 'Page not found',
  og: 'technical',
  noindex: true,
  title: 'Page not found | Nexora TechSolutions',
  description: "The page you were looking for doesn't exist or has moved.",
}

const byPath = new Map(ROUTES.map((r) => [r.path, r]))

export function normalizePath(pathname) {
  if (!pathname) return '/'
  const p = pathname.replace(/\/+$/, '')
  return p === '' ? '/' : p
}

export function findRoute(pathname) {
  return byPath.get(normalizePath(pathname)) || NOT_FOUND
}

export function absoluteUrl(path) {
  return path === '/' ? `${SITE.url}/` : `${SITE.url}${path}`
}

/** Home → practice → page, built from the path segments that have routes. */
export function breadcrumbsFor(route) {
  if (route.noindex || route.path === '/') return []
  const parts = route.path.split('/').filter(Boolean)
  const trail = [byPath.get('/')]
  parts.forEach((_, i) => {
    const r = byPath.get('/' + parts.slice(0, i + 1).join('/'))
    if (r) trail.push(r)
  })
  return trail.map((r) => ({ name: r.crumb, path: r.path }))
}

export function buildJsonLd(route) {
  const url = absoluteUrl(route.path)
  const crumbs = breadcrumbsFor(route)

  const organization = {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.legalName,
    alternateName: [SITE.name, SITE.medicalName],
    url: `${SITE.url}/`,
    logo: { '@type': 'ImageObject', url: `${SITE.url}/icon-512.png`, width: 512, height: 512 },
    email: SITE.email,
    telephone: SITE.phoneE164,
    foundingDate: SITE.founded,
    slogan: SITE.tagline,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${SITE.address.street}, ${SITE.address.unit}`,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.countryCode,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: SITE.email,
        telephone: SITE.phoneE164,
        availableLanguage: ['English'],
      },
    ],
  }
  // Only real profile pages belong in sameAs — never the platform home pages.
  const sameAs = SOCIALS.map((s) => s.url).filter(isProfileUrl)
  if (sameAs.length) organization.sameAs = sameAs

  const website = {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE.url}/`,
    name: SITE.name,
    alternateName: SITE.legalName,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
  }

  const page = {
    '@type': route.pageType || 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: route.title,
    description: route.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    inLanguage: 'en',
    primaryImageOfPage: { '@type': 'ImageObject', url: SITE.url + OG_IMAGES[route.og || 'technical'].path },
  }
  if (crumbs.length) page.breadcrumb = { '@id': `${url}#breadcrumb` }
  if (route.faq) {
    page.mainEntity = route.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    }))
  }

  const graph = [organization, website, page]

  if (crumbs.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: absoluteUrl(c.path),
      })),
    })
  }

  if (route.schema) graph.push(...route.schema())

  return { '@context': 'https://schema.org', '@graph': graph }
}

/** Social/meta values for a route, shared by the prerender and runtime paths. */
export function metaFor(route) {
  const og = OG_IMAGES[route.og || 'technical']
  return {
    title: route.title,
    description: route.description,
    canonical: absoluteUrl(route.path),
    robots: route.noindex
      ? 'noindex, follow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    image: SITE.url + og.path,
    imageAlt: og.alt,
    siteName: route.og === 'medical' ? SITE.medicalName : SITE.name,
  }
}

const escapeAttr = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** JSON safe to inline inside <script>: no "</script>" or HTML comment breakouts. */
export const safeJson = (value) =>
  JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')

/** The full <head> SEO block for a route, as an HTML string. */
export function buildHeadTags(route) {
  const m = metaFor(route)
  const tags = [
    `<title>${escapeAttr(m.title)}</title>`,
    `<meta name="description" content="${escapeAttr(m.description)}" />`,
    `<meta name="robots" content="${m.robots}" />`,
    route.noindex ? '' : `<link rel="canonical" href="${escapeAttr(m.canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:site_name" content="${escapeAttr(m.siteName)}" />`,
    `<meta property="og:title" content="${escapeAttr(m.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(m.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(m.canonical)}" />`,
    `<meta property="og:image" content="${escapeAttr(m.image)}" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeAttr(m.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(m.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(m.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(m.image)}" />`,
    `<meta name="twitter:image:alt" content="${escapeAttr(m.imageAlt)}" />`,
    `<script type="application/ld+json" id="ld-json">${safeJson(buildJsonLd(route))}</script>`,
  ]
  return tags.filter(Boolean).join('\n  ')
}

export function buildSitemap(lastmod) {
  const urls = ROUTES.map(
    (r) =>
      `  <url>\n    <loc>${absoluteUrl(r.path)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
  ).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

export function buildRobots() {
  return `# ${SITE.legalName}\nUser-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\nDisallow: /admin\n\nSitemap: ${SITE.url}/sitemap.xml\n`
}

