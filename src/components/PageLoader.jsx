/**
 * Shown while a lazily loaded route chunk is fetched.
 *
 * Same composition as the boot loader in index.html — ringed mark over a
 * tracked wordmark and a sliding bar — at a smaller scale, and without the
 * full-screen wash, since the header and footer stay put around it.
 *
 * Deliberately quiet: it fades in only after a short delay, so a chunk that
 * arrives quickly — the common case — never flashes a loader at the visitor.
 */
export default function PageLoader({ label = 'Loading page' }) {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span className="sr-only">{label}…</span>

      <svg className="page-loader-badge" viewBox="0 0 120 120" fill="none" aria-hidden>
        <circle cx="60" cy="60" r="52" stroke="var(--line)" strokeWidth="1" />
        <circle cx="60" cy="60" r="43" stroke="var(--line-strong)" strokeWidth="1" />
        <g className="pl-ring">
          <circle
            cx="60" cy="60" r="52"
            stroke="var(--accent)" strokeWidth="1" strokeLinecap="round"
            strokeDasharray="26 300" opacity="0.85"
          />
        </g>
        <g className="pl-ring rev">
          <circle
            cx="60" cy="60" r="43"
            stroke="var(--accent2)" strokeWidth="1" strokeLinecap="round"
            strokeDasharray="16 254" opacity="0.7"
          />
        </g>

        <g transform="translate(30 32) scale(2)">
          <line x1="9" y1="20" x2="15" y2="8" stroke="var(--accent)" strokeWidth="1" />
          <line x1="15" y1="8" x2="21" y2="20" stroke="var(--accent2)" strokeWidth="1" />
          <line x1="9" y1="20" x2="21" y2="20" stroke="var(--ink-faint)" strokeWidth="1" />
          <circle className="pl-node a" cx="15" cy="8" r="3" fill="var(--accent)" />
          <circle className="pl-node b" cx="9" cy="20" r="3" fill="var(--accent2)" />
          <circle className="pl-node c" cx="21" cy="20" r="3" fill="var(--ink)" />
        </g>
      </svg>

      <div className="page-loader-name" aria-hidden>
        Nexora Tech Solutions LLC
      </div>
      <div className="page-loader-track" aria-hidden />
    </div>
  )
}
