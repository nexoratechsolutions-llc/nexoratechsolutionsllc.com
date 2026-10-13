/**
 * Shown while a lazily loaded route chunk is fetched.
 *
 * Same composition as the boot loader in index.html — ringed logo mark over a
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

        {/* Nexora "N" mark: colour on light, white on dark (see loader.css) */}
        <image className="pl-mark on-light" href="/logo-mark.png" x="36" y="36.75" width="48" height="46.5" />
        <image className="pl-mark on-dark" href="/logo-mark-dark.png" x="36" y="36.75" width="48" height="46.5" />
      </svg>

      <div className="page-loader-name" aria-hidden>
        Nexora Tech Solutions LLC
      </div>
      <div className="page-loader-track" aria-hidden />
    </div>
  )
}
