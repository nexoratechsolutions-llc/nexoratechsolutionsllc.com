/* Line icons, 24×24, stroked with currentColor. */

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
}

const make = (paths) =>
  function Icon({ size = 20, ...props }) {
    return (
      <svg width={size} height={size} {...base} {...props}>
        {paths}
      </svg>
    )
  }

export const ArrowRight = make(<path d="M5 12h14M13 6l6 6-6 6" />)
export const ArrowLeft = make(<path d="M19 12H5M11 6l-6 6 6 6" />)
export const Sun = make(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
  </>
)
export const Moon = make(<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />)
export const Mail = make(
  <>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </>
)
export const Phone = make(
  <path d="M5 4h3.2l1.6 4-2 1.3a11 11 0 0 0 4.9 4.9l1.3-2 4 1.6V17a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
)
export const Clock = make(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </>
)
export const Code = make(<path d="M8 5 3 12l5 7M16 5l5 7-5 7M13.5 4l-3 16" />)
export const Shield = make(
  <>
    <path d="M12 3 4.5 6.5v5.2c0 4.3 3.1 7.9 7.5 9.3 4.4-1.4 7.5-5 7.5-9.3V6.5L12 3Z" />
    <path d="m8.8 12 2.2 2.2 4.2-4.4" />
  </>
)
export const Cloud = make(
  <>
    <path d="M7 18h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.4 9.2 4.5 4.5 0 0 0 7 18Z" />
    <path d="m10 13.5 2-2 2 2M12 11.5V16" />
  </>
)
export const Network = make(
  <>
    <circle cx="12" cy="4.8" r="2.2" />
    <circle cx="5" cy="18.5" r="2.2" />
    <circle cx="19" cy="18.5" r="2.2" />
    <path d="M12 7v5M12 12l-5.3 4.8M12 12l5.3 4.8" />
  </>
)
export const Doc = make(
  <>
    <rect x="4" y="3.5" width="16" height="17" rx="2.5" />
    <path d="M8 8.5h8M8 12h8M8 15.5h5" />
  </>
)
export const People = make(
  <>
    <circle cx="8.5" cy="8" r="3" />
    <circle cx="16.8" cy="8.8" r="2.3" />
    <path d="M3 19c0-3 2.4-5 5.5-5s5.5 2 5.5 5M15 14.3c2.4.3 4.2 2 4.2 4.7" />
  </>
)
export const Spark = make(
  <>
    <circle cx="12" cy="12" r="3.6" />
    <path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
  </>
)
export const Trophy = make(
  <>
    <path d="M7 3.5h10v5a5 5 0 0 1-10 0v-5Z" />
    <path d="M7 5.5H4a3 3 0 0 0 3 5M17 5.5h3a3 3 0 0 1-3 5M12 13.5v3.5M8.5 21h7M10 17h4" />
  </>
)
export const Stethoscope = make(
  <>
    <path d="M6 3v5a4 4 0 0 0 8 0V3" />
    <path d="M10 12v3a5 5 0 0 0 10 0v-2" />
    <circle cx="20" cy="11" r="2" />
  </>
)
export const Book = make(
  <>
    <path d="M5 5a2 2 0 0 1 2-2h12v14.5H7a2 2 0 0 0-2 2V5Z" />
    <path d="M5 19.5a2 2 0 0 0 2 1.5h12v-3.5M9 7.5h6M9 11h4" />
  </>
)
export const Clipboard = make(
  <>
    <rect x="5" y="4.5" width="14" height="17" rx="2.5" />
    <path d="M9 4.5V3.5h6v1M9 11h6M12 8v6M9 17.5h6" />
  </>
)
export const Flask = make(
  <>
    <path d="M9.5 3h5M10 3v6.2L4.8 18.3A1.8 1.8 0 0 0 6.4 21h11.2a1.8 1.8 0 0 0 1.6-2.7L14 9.2V3" />
    <path d="M7.3 14.5h9.4" />
  </>
)
export const Target = make(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.8" />
    <circle cx="12" cy="12" r="1.2" />
  </>
)
export const MapPin = make(
  <>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </>
)
export const Check = make(<path d="m5 12.5 4.2 4.2L19 7" />)
export const Send = make(<path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z" />)

export const ICONS = {
  code: Code,
  shield: Shield,
  cloud: Cloud,
  network: Network,
  doc: Doc,
  people: People,
  spark: Spark,
  trophy: Trophy,
  book: Book,
  clipboard: Clipboard,
  flask: Flask,
  target: Target,
}

/* ---------- Social brand glyphs (filled, 24×24) ---------- */

const brand = (children) =>
  function BrandIcon({ size = 16, ...props }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
        {children}
      </svg>
    )
  }

export const SOCIAL_ICONS = {
  linkedin: brand(
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
  ),
  facebook: brand(
    <path d="M13.5 21.9v-8.4h2.8l.45-3.3H13.5V8.1c0-.95.27-1.6 1.63-1.6h1.72V3.55c-.3-.04-1.32-.13-2.5-.13-2.48 0-4.18 1.51-4.18 4.3v2.47H7.37v3.3h2.8v8.4h3.33Z" />
  ),
  instagram: brand(
    <>
      <rect x="3" y="3" width="18" height="18" rx="5.2" fill="none" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="17.3" cy="6.7" r="1.25" />
    </>
  ),
  x: brand(
    <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.18h1.7L7.4 4.73H5.58l11.09 14.45Z" />
  ),
  youtube: brand(
    <path
      fillRule="evenodd"
      d="M22.54 7.2a2.78 2.78 0 0 0-1.95-1.97C18.88 4.77 12 4.77 12 4.77s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 7.2C1 8.93 1 12 1 12s0 3.07.46 4.8a2.78 2.78 0 0 0 1.95 1.97c1.71.46 8.59.46 8.59.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.97C23 15.07 23 12 23 12s0-3.07-.46-4.8ZM9.75 15.27V8.73L15.5 12l-5.75 3.27Z"
    />
  ),
}

export function IconByName({ name, ...props }) {
  const Cmp = ICONS[name] || Spark
  return <Cmp {...props} />
}
