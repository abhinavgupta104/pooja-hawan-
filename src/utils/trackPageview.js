// ─────────────────────────────────────────────────────────────
//  Anonymous page-view counting.
//
//  Sets no cookies and sends no identifiers — just the path and the
//  referring site, which the backend folds into daily totals. The
//  "session" flag lives in sessionStorage (cleared when the tab
//  closes), so it distinguishes visits without tracking a person.
//
//  Because nothing here identifies anyone, it needs no consent banner.
// ─────────────────────────────────────────────────────────────

import { BACKEND } from './leadsApi'

const SESSION_KEY = 'pujahavan:session-counted'

let lastPath = null

export function trackPageview(path) {
  // Never count the admin dashboard, and never count the same path twice in a row
  // (React can re-render a route without it being a new visit).
  if (!path || path.startsWith('/admin') || path === lastPath) return
  lastPath = path

  let newSession = false
  try {
    if (!sessionStorage.getItem(SESSION_KEY)) {
      sessionStorage.setItem(SESSION_KEY, '1')
      newSession = true
    }
  } catch {
    // Private mode with storage disabled — count it as a page view only.
  }

  const body = JSON.stringify({
    path,
    referrer: document.referrer || '',
    newSession,
  })

  // sendBeacon survives navigation away from the page; fetch is the fallback.
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${BACKEND}/api/pageview`, new Blob([body], { type: 'application/json' }))
      return
    }
  } catch {
    /* fall through to fetch */
  }

  fetch(`${BACKEND}/api/pageview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {
    // Analytics must never surface an error to the visitor.
  })
}
