/**
 * Thin client for the Nexora API.
 *
 * Every call sends `X-Nexora-Request: 1`, which the server requires. A browser
 * cannot attach that header cross-origin without a preflight, so together with
 * the server's Origin allow-list it blocks classic CSRF form posts.
 */

const HEADERS = {
  'Content-Type': 'application/json',
  'X-Nexora-Request': '1',
}

/** Aborts a request that hangs, so the UI never sticks on "Sending…". */
function withTimeout(ms) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  return { signal: controller.signal, clear: () => clearTimeout(timer) }
}

/**
 * @returns {Promise<{token: string|null, reason?: 'unreachable'|'rejected'}>}
 *
 * The reason matters: "we can't reach the server" and "the server turned us
 * down" need different advice, and telling someone to reload the page when the
 * API is down just wastes their time.
 */
export async function fetchFormToken() {
  const t = withTimeout(10000)
  try {
    const res = await fetch('/api/form-token', {
      method: 'GET',
      headers: HEADERS,
      credentials: 'same-origin',
      signal: t.signal,
    })

    if (!res.ok) {
      // 5xx and 404 both mean the endpoint is not answering properly — in
      // local development that is usually the API not being served at all.
      return { token: null, reason: res.status >= 500 || res.status === 404 ? 'unreachable' : 'rejected' }
    }

    const data = await res.json().catch(() => null)
    return data?.token ? { token: data.token } : { token: null, reason: 'rejected' }
  } catch {
    return { token: null, reason: 'unreachable' }
  } finally {
    t.clear()
  }
}

/**
 * @returns {Promise<{ok:boolean, error?:string, fieldErrors?:object, reference?:string}>}
 */
export async function submitForm(payload) {
  const t = withTimeout(20000)
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: HEADERS,
      credentials: 'same-origin',
      body: JSON.stringify(payload),
      signal: t.signal,
    })

    let data = null
    try {
      data = await res.json()
    } catch {
      data = null
    }

    if (!data) {
      return { ok: false, error: 'Unexpected response from the server. Please try again.' }
    }
    return data
  } catch (err) {
    if (err?.name === 'AbortError') {
      return { ok: false, error: 'The request timed out. Please check your connection and try again.' }
    }
    return {
      ok: false,
      error: 'We could not reach the server. Please try again, or email minchu@nexoratechsolutionsllc.com.',
    }
  } finally {
    t.clear()
  }
}
