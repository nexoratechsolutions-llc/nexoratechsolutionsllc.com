/**
 * Nexora IT Solutions logo (public/logo-*.png, cut from public/logo.png).
 *
 * The right file is picked by CSS (see .logo in blueprint.css), so it is
 * correct on first paint and in the prerendered HTML:
 *   - normal wordmark on light backgrounds, white-text version in dark mode;
 *   - onBand: always the white-text version (blue footer, bands);
 *   - compact: just the "N" mark on phones, where the wordmark won't fit;
 *   - mark: only the "N" mark, everywhere.
 *
 * Decorative by default (alt=""), because it usually sits inside a link that
 * carries its own label; pass `alt` when it stands alone.
 */
const FULL = { w: 496, h: 96 }
const MARK = { w: 99, h: 96 }

export default function Logo({ height = 40, onBand = false, compact = false, mark = false, alt = '', className = '' }) {
  const cls = ['logo', onBand && 'on-band', compact && 'compact', mark && 'mark-only', className].filter(Boolean).join(' ')
  const img = (src, size, kind) => (
    <img src={src} width={size.w} height={size.h} alt={alt} className={kind} decoding="async" />
  )
  return (
    <span className={cls} style={{ '--logo-h': `${height}px` }}>
      {!mark && img('/logo-full.png', FULL, 'full on-light')}
      {!mark && img('/logo-full-dark.png', FULL, 'full on-dark')}
      {(mark || compact) && img('/logo-mark.png', MARK, 'mark on-light')}
      {(mark || compact) && img('/logo-mark-dark.png', MARK, 'mark on-dark')}
    </span>
  )
}
