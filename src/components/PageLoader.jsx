/**
 * Shown while a lazily loaded route chunk is fetched.
 *
 * Deliberately quiet: it fades in only after a short delay, so a chunk that
 * arrives quickly — the common case — never flashes a loader at the visitor.
 */
export default function PageLoader({ label = 'Loading page' }) {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span className="sr-only">{label}…</span>

      <svg className="page-loader-mark" viewBox="0 0 30 30" fill="none" aria-hidden>
        <g className="pl-ring">
          <circle cx="15" cy="15" r="13.4" stroke="var(--line)" strokeWidth="1" strokeDasharray="3 6" />
        </g>
        <line x1="9" y1="20" x2="15" y2="8" stroke="var(--accent)" strokeWidth="1.4" />
        <line x1="15" y1="8" x2="21" y2="20" stroke="var(--accent2)" strokeWidth="1.4" />
        <line x1="9" y1="20" x2="21" y2="20" stroke="var(--ink-faint)" strokeWidth="1.4" />
        <circle className="pl-node a" cx="15" cy="8" r="3" fill="var(--accent)" />
        <circle className="pl-node b" cx="9" cy="20" r="3" fill="var(--accent2)" />
        <circle className="pl-node c" cx="21" cy="20" r="3" fill="var(--ink)" />
      </svg>

      <div className="page-loader-bar" aria-hidden />
    </div>
  )
}
