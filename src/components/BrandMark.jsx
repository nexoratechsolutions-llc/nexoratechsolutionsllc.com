/** The Nexora mark: three connected nodes, tinted by the current practice. */
export default function BrandMark({ size = 30, ring = true, className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 30 30" fill="none" aria-hidden="true">
      {ring && <circle cx="15" cy="15" r="12.5" stroke="var(--line-strong)" strokeWidth="1" />}
      <line x1="9" y1="20" x2="15" y2="8" stroke="var(--accent)" strokeWidth="1.4" />
      <line x1="15" y1="8" x2="21" y2="20" stroke="var(--accent2)" strokeWidth="1.4" />
      <line x1="9" y1="20" x2="21" y2="20" stroke="var(--ink-faint)" strokeWidth="1.4" />
      <circle cx="15" cy="8" r="3" fill="var(--accent)" />
      <circle cx="9" cy="20" r="3" fill="var(--accent2)" />
      <circle cx="21" cy="20" r="3" fill="var(--ink)" />
    </svg>
  )
}
