/** Single stroke-based icon set, sized by the `size` prop. */

const base = (size) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
})

export const Icon = {
  code: (s = 20) => (
    <svg {...base(s)}>
      <path d="M8.5 4 3 12l5.5 8M15.5 4 21 12l-5.5 8" />
    </svg>
  ),
  shield: (s = 20) => (
    <svg {...base(s)}>
      <path d="M12 3 4.5 6.4v5.2c0 4.3 3 8.2 7.5 9.4 4.5-1.2 7.5-5.1 7.5-9.4V6.4L12 3Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </svg>
  ),
  clock: (s = 20) => (
    <svg {...base(s)}>
      <circle cx="12" cy="12" r="8.8" />
      <path d="M12 6.8V12l3.4 2.2" />
    </svg>
  ),
  network: (s = 20) => (
    <svg {...base(s)}>
      <circle cx="12" cy="4.6" r="2.3" />
      <circle cx="4.8" cy="18.4" r="2.3" />
      <circle cx="19.2" cy="18.4" r="2.3" />
      <path d="M12 6.9v3.6M11 11.4 6.4 16.6M13 11.4l4.6 5.2" />
    </svg>
  ),
  doc: (s = 20) => (
    <svg {...base(s)}>
      <rect x="3.5" y="3.8" width="17" height="16.4" rx="2.2" />
      <path d="M7.4 8.6h9.2M7.4 12.4h9.2M7.4 16.2h5.6" />
    </svg>
  ),
  people: (s = 20) => (
    <svg {...base(s)}>
      <circle cx="8.6" cy="7.6" r="3" />
      <circle cx="16.6" cy="8.2" r="2.4" />
      <path d="M2.8 19c0-3 2.6-5.2 5.8-5.2S14.4 16 14.4 19M15.6 14.1c2.4.3 4 2.1 4 4.6" />
    </svg>
  ),
  sun: (s = 20) => (
    <svg {...base(s)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2.4M12 18.6V21M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M3 12h2.4M18.6 12H21M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
    </svg>
  ),
  moon: (s = 20) => (
    <svg {...base(s)}>
      <path d="M20 13.2A8.2 8.2 0 0 1 10.8 4a8.4 8.4 0 1 0 9.2 9.2Z" />
    </svg>
  ),
  trophy: (s = 20) => (
    <svg {...base(s)}>
      <path d="M7 3.6h10v4.8a5 5 0 0 1-10 0V3.6Z" />
      <path d="M7 5.6H4.2a3 3 0 0 0 3 5M17 5.6h2.8a3 3 0 0 1-3 5M12 13.4v3.8M9.2 20.4h5.6M10.6 17.2h2.8" />
    </svg>
  ),
  team: (s = 20) => (
    <svg {...base(s)}>
      <circle cx="8" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M2.6 19c0-3 2.5-5 5.4-5s5.4 2 5.4 5M14.6 14.6c2.3.3 4 2 4 4.4" />
    </svg>
  ),
  compass: (s = 20) => (
    <svg {...base(s)}>
      <circle cx="12" cy="12" r="8.8" />
      <path d="m15.2 8.8-1.8 4.6-4.6 1.8 1.8-4.6 4.6-1.8Z" />
    </svg>
  ),
  calendar: (s = 20) => (
    <svg {...base(s)}>
      <rect x="3.6" y="5" width="16.8" height="15.4" rx="2.2" />
      <path d="M8 3v3.6M16 3v3.6M3.6 10h16.8M8.4 14h2M14 14h2M8.4 17.2h2M14 17.2h2" />
    </svg>
  ),
  user: (s = 20) => (
    <svg {...base(s)}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c0-3.4 3.1-6 7-6s7 2.6 7 6" />
    </svg>
  ),
  chart: (s = 20) => (
    <svg {...base(s)}>
      <path d="M4 19.4V4.6M4 19.4h16" />
      <path d="m7.6 15.4 3.4-4 3 2.6 4.2-6" />
    </svg>
  ),
  book: (s = 22) => (
    <svg {...base(s)}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H19v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z" />
      <path d="M8 9h7M8 13h5" />
    </svg>
  ),
  layers: (s = 22) => (
    <svg {...base(s)}>
      <path d="M12 3 4 7l8 4 8-4-8-4Z" />
      <path d="M4 12l8 4 8-4M4 17l8 4 8-4" />
    </svg>
  ),
  file: (s = 22) => (
    <svg {...base(s)}>
      <path d="M7 3h7l4 4v14H7V3Z" />
      <path d="M14 3v4h4M10 12h5M10 16h3" />
    </svg>
  ),
  person: (s = 22) => (
    <svg {...base(s)}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" />
    </svg>
  ),
  steth: (s = 22) => (
    <svg {...base(s)}>
      <path d="M9 3v4a4 4 0 0 0 8 0V3" />
      <path d="M13 11v3a5 5 0 0 1-10 0v-1" />
      <circle cx="19" cy="14" r="2.2" />
    </svg>
  ),
  search: (s = 22) => (
    <svg {...base(s)}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 4.5 4.5" />
    </svg>
  ),
  mail: (s = 18) => (
    <svg {...base(s)}>
      <rect x="3" y="5.2" width="18" height="13.6" rx="2.2" />
      <path d="m3.8 7 7.1 5.1a2 2 0 0 0 2.2 0L20.2 7" />
    </svg>
  ),
  phone: (s = 18) => (
    <svg {...base(s)}>
      <path d="M7.6 3.8h-2A2.6 2.6 0 0 0 3 6.6c0 7.9 6.5 14.4 14.4 14.4a2.6 2.6 0 0 0 2.6-2.6v-2l-4.3-1.6-2 2a13.4 13.4 0 0 1-6.1-6.1l2-2L7.6 3.8Z" />
    </svg>
  ),
  pin: (s = 18) => (
    <svg {...base(s)}>
      <path d="M12 21s6.4-6 6.4-10.6A6.4 6.4 0 1 0 5.6 10.4C5.6 15 12 21 12 21Z" />
      <circle cx="12" cy="10.2" r="2.4" />
    </svg>
  ),
  check: (s = 22) => (
    <svg {...base(s)} strokeWidth={2}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  ),
  alert: (s = 18) => (
    <svg {...base(s)}>
      <circle cx="12" cy="12" r="8.8" />
      <path d="M12 7.6v5M12 16h.01" />
    </svg>
  ),
  lock: (s = 14) => (
    <svg {...base(s)}>
      <rect x="4.8" y="10.4" width="14.4" height="9.6" rx="2" />
      <path d="M8.4 10.4V7.6a3.6 3.6 0 0 1 7.2 0v2.8" />
    </svg>
  ),
  arrow: (s = 14) => (
    <svg {...base(s)}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  ),
  linkedin: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C21.4 8.75 22 11 22 14.1V21h-4v-6.1c0-1.45-.03-3.3-2.05-3.3-2.05 0-2.36 1.57-2.36 3.2V21h-4V9Z" />
    </svg>
  ),
  x: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
      <path d="M17.5 3h3.2l-7 8 8.3 10h-6.5l-5-6.1-5.8 6.1H1.5l7.5-8.5L1 3h6.7l4.5 5.6L17.5 3Zm-1.1 16h1.8L7.7 4.9H5.8L16.4 19Z" />
    </svg>
  ),
  github: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .26.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  ),
}
