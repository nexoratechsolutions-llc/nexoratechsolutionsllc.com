/**
 * Sliding-window rate limiter.
 *
 * NOTE ON SCOPE: this is per-instance, in-memory state. On Vercel it therefore
 * limits per warm lambda instance rather than globally — enough to stop casual
 * flooding and accidental double-submits, not a determined distributed attack.
 * For production hardening, swap `hits` for Upstash Redis / Vercel KV; the
 * function signature below is deliberately drop-in compatible.
 */

const hits = new Map()

// Keeps the map from growing without bound on a long-lived instance.
const MAX_KEYS = 5000

function prune(now) {
  if (hits.size < MAX_KEYS) return
  for (const [key, stamps] of hits) {
    if (!stamps.length || now - stamps[stamps.length - 1] > 60 * 60 * 1000) hits.delete(key)
  }
}

/**
 * @param {string} key      Bucket identifier, e.g. `contact:1.2.3.4`.
 * @param {number} limit    Max requests allowed inside the window.
 * @param {number} windowMs Window length in milliseconds.
 * @returns {{allowed:boolean, remaining:number, retryAfter:number}}
 */
export function rateLimit(key, limit, windowMs) {
  const now = Date.now()
  prune(now)

  const stamps = (hits.get(key) || []).filter((t) => now - t < windowMs)

  if (stamps.length >= limit) {
    const oldest = stamps[0]
    const retryAfter = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000))
    hits.set(key, stamps)
    return { allowed: false, remaining: 0, retryAfter }
  }

  stamps.push(now)
  hits.set(key, stamps)
  return { allowed: true, remaining: limit - stamps.length, retryAfter: 0 }
}

/** Applies the standard RateLimit-* response headers. */
export function applyRateHeaders(res, limit, result) {
  res.setHeader('RateLimit-Limit', String(limit))
  res.setHeader('RateLimit-Remaining', String(result.remaining))
  if (!result.allowed) res.setHeader('Retry-After', String(result.retryAfter))
}
